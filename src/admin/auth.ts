// ── Autenticación simple con localStorage ──
const ADMIN_USER = "admin";
const ADMIN_PASS = "gamedoctor2024";
const AUTH_KEY = "gd_admin_auth";

export function login(user: string, pass: string): boolean {
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}
