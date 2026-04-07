// src/lib/rate-limiter.ts
// Client-side rate limiter to prevent abuse of admin mutation endpoints.
// 5 attempts per 15 minutes per action category.

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const STORAGE_KEY = "gd_rate_limits";

interface RateEntry {
  timestamps: number[];
}

function loadStore(): Record<string, RateEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStore(store: Record<string, RateEntry>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage full or unavailable — fail open
  }
}

/**
 * Check if an action is allowed under the rate limit.
 * Returns `{ allowed: true }` or `{ allowed: false, retryAfterMs }`.
 */
export function checkRateLimit(category: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const store = loadStore();
  const entry = store[category] || { timestamps: [] };

  // Prune expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_ATTEMPTS) {
    const oldest = entry.timestamps[0];
    const retryAfterMs = WINDOW_MS - (now - oldest);
    return { allowed: false, retryAfterMs };
  }

  return { allowed: true };
}

/**
 * Record a mutation attempt for the given category.
 * Call this AFTER a successful check and before executing the mutation.
 */
export function recordAttempt(category: string): void {
  const now = Date.now();
  const store = loadStore();
  const entry = store[category] || { timestamps: [] };

  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
  entry.timestamps.push(now);

  store[category] = entry;
  saveStore(store);
}

/**
 * Convenience wrapper: check + record in one call.
 * Throws if rate limited.
 */
export function enforceRateLimit(category: string): void {
  const result = checkRateLimit(category);
  if (!result.allowed) {
    const seconds = Math.ceil((result.retryAfterMs ?? 0) / 1000);
    throw new Error(
      `Demasiadas operaciones. Intenta de nuevo en ${seconds} segundos.`
    );
  }
  recordAttempt(category);
}
