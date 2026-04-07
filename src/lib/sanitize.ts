// src/lib/sanitize.ts
// Input sanitization and validation utilities for security hardening.

/**
 * Strip HTML tags, trim whitespace, and enforce max length.
 * Prevents stored XSS via user-generated content.
 */
export function sanitizeText(input: string, maxLength = 1000): string {
  if (!input) return "";
  // Strip HTML tags
  let clean = input.replace(/<[^>]*>/g, "");
  // Trim
  clean = clean.trim();
  // Enforce max length
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }
  return clean;
}

/**
 * Validate URL: must be http(s), reject javascript: / data: / other schemes.
 * Returns the cleaned URL or empty string if invalid.
 */
export function sanitizeUrl(input: string): string {
  if (!input || !input.trim()) return "";
  const trimmed = input.trim();

  // Allow relative URLs (start with /)
  if (trimmed.startsWith("/")) return trimmed;

  try {
    const url = new URL(trimmed);
    // Only allow http and https protocols
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      console.warn("URL rechazada (protocolo no permitido):", trimmed);
      return "";
    }
    return trimmed;
  } catch {
    // Not a valid URL
    console.warn("URL rechazada (formato inválido):", trimmed);
    return "";
  }
}

/**
 * Check that a payload (serialized as JSON) does not exceed maxBytes.
 * Default limit: 50KB. Prevents oversized payloads.
 */
export function validatePayloadSize(obj: unknown, maxBytes = 50_000): boolean {
  try {
    const size = new Blob([JSON.stringify(obj)]).size;
    return size <= maxBytes;
  } catch {
    return false;
  }
}

/**
 * Validate an image file before upload.
 * - Max size: 5MB
 * - Allowed types: image/jpeg, image/png, image/webp, image/gif, image/svg+xml
 */
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { valid: false, error: `Tipo de archivo no permitido: ${file.type}. Solo se aceptan imágenes (JPG, PNG, WebP, GIF, SVG).` };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: `La imagen es demasiado grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: 5MB.` };
  }
  return { valid: true };
}

/**
 * Sanitize email — lowercase, trim, basic format check.
 */
export function sanitizeEmail(email: string): string {
  if (!email) return "";
  return email.trim().toLowerCase();
}
