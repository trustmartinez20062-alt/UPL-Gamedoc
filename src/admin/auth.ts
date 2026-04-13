import { supabase } from "../lib/supabase";
import { sanitizeEmail } from "../lib/sanitize";
import { enforceRateLimit } from "../lib/rate-limiter";
import type { Usuario } from "./store";

// ── LOGIN CON SUPABASE AUTH ───────────────────────────────────────────────
// Los usuarios se crean en el dashboard de Supabase con email.
// El campo "nombre" se mapea al email (nombre@gamedoctor.uy) para simplificar el login.
// ── LOGIN TRADICIONAL ──────────────────────────────────────────────────────────
export async function loginEmailPassword(user: string, pass: string): Promise<{ state: "success" | "error", error?: string }> {
  enforceRateLimit("auth_login");

  const email = sanitizeEmail(user);
  if (!email) return { state: "error", error: "Email inválido" };
  if (!pass || pass.length < 8) return { state: "error", error: "La contraseña debe tener al menos 8 caracteres" };
  if (pass.length > 128) return { state: "error", error: "Contraseña demasiado larga" };
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
  if (error || !data.session) {
    console.error("Login fallido:", error?.message);
    return { state: "error", error: "Credenciales inválidas" };
  }

  return { state: "success" };
}



export async function sendPasswordResetEmail(email: string): Promise<boolean> {
  enforceRateLimit("auth_reset");

  const fullEmail = sanitizeEmail(email);
  if (!fullEmail) return false;

  const { error } = await supabase.auth.resetPasswordForEmail(fullEmail, {
    redirectTo: `${window.location.origin}/paneladmin/update-password`,
  });
  
  if (error) {
    console.error("Error al enviar email de recuperación:", error.message);
    return false;
  }
  return true;
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function isAuthenticated(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

export async function getCurrentUser(): Promise<Usuario | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, nombre, role, email")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    if (error) console.error("Error al obtener perfil de usuario:", error.message);
    else console.warn("No se encontró perfil para el usuario:", session.user.id);
    
    return {
      id: session.user.id,
      nombre: session.user.email?.split("@")[0] || "Usuario",
      email: session.user.email ?? "",
      role: "subadmin", // Fallback seguro
      pendingEmail: session.user.new_email,
    };
  }

  return {
    id: profile.id,
    nombre: profile.nombre,
    email: session.user.email || profile.email || "",
    role: profile.role as "admin" | "subadmin",
    pendingEmail: session.user.new_email,
  };
}

// ── GESTIÓN DE USUARIOS (solo admin) ─────────────────────────────────────
export async function fetchUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase.from("profiles").select("id, nombre, role, email");
  if (error) { console.error(error); return []; }
  return (data ?? []).map(p => ({ ...p, password: "" }));
}

// Crear un nuevo usuario en Supabase Auth + perfil (ATÓMICO vía Edge Function)
export async function createUsuario(nombre: string, email: string, password: string, role: "admin" | "subadmin"): Promise<boolean> {
  const fullEmail = email;
  const { data: { session } } = await supabase.auth.getSession();
  const { data, error: functionError } = await supabase.functions.invoke("admin-reset-password", {
    body: { action: "create", nombre, email: fullEmail, password, role },
    headers: { Authorization: `Bearer ${session?.access_token}` }
  });

  if (functionError || data?.error) {
    console.group("Detalle CRÍTICO del fallo en Edge Function");
    console.error("Mensaje:", functionError?.message || data?.error || "Desconocido");
    console.error("Cuerpo técnico:", data);
    console.groupEnd();
    return false;
  }
  return true;
}

// Cambiar mi propia contraseña
export async function changeMyPassword(newPassword: string): Promise<boolean> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) { console.error("Error cambiando mi contraseña:", error.message); return false; }
  return true;
}

// Cambiar mi propio email (requiere verificación)
export async function changeMyEmail(newEmail: string): Promise<{ ok: boolean, error?: string }> {
  const fullEmail = newEmail;
  const { error } = await supabase.auth.updateUser({ email: fullEmail });
  if (error) { 
    console.error("Error cambiando el email:", error.message); 
    return { ok: false, error: error.message }; 
  }
  return { ok: true };
}

// Cancelar un cambio de correo pendiente directamente en auth.users
export async function cancelEmailChange(): Promise<boolean> {
  const { error } = await supabase.rpc('cancel_email_change');
  if (error) {
    console.error("Error al cancelar cambio de email:", error.message);
    return false;
  }
  // Esto refresca la sesión actual internamente eliminando el new_email del token temporal
  await supabase.auth.refreshSession();
  return true;
}

// Actualizar nombre/email y sincronizar con Auth (ATÓMICO vía Edge Function)
export async function updateUsuario(id: string, nombre: string, email: string, password?: string): Promise<boolean> {
  const fullEmail = email;
  const { data: { session } } = await supabase.auth.getSession();
  
  // Enviamos tanto newEmail (para auth.users) como email (por si la lógica antigua lo requiere) -> Edge Function safe.
  const { data, error: functionError } = await supabase.functions.invoke("admin-reset-password", {
    body: { action: "update", userId: id, nombre, email: fullEmail, newEmail: fullEmail, password },
    headers: { Authorization: `Bearer ${session?.access_token}` }
  });

  if (functionError || data?.error) {
    console.error("Error actualizando usuario:", functionError?.message || data?.error);
    return false;
  }
  return true;
}

// Admin cambia la contraseña de un tercero (vía Edge Function)
export async function adminChangePassword(userId: string, newPassword: string): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  const { data, error } = await supabase.functions.invoke("admin-reset-password", {
    body: { action: "update", userId, password: newPassword },
    headers: { Authorization: `Bearer ${session?.access_token}` }
  });

  if (error || data?.error) {
    console.error("Error en admin-reset-password:", error?.message || data?.error);
    return false;
  }
  return true;
}

// Eliminar usuario: baja del perfil + auth (ATÓMICO vía Edge Function)
export async function deleteUsuario(id: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  await supabase.functions.invoke("admin-reset-password", {
    body: { action: "delete", userId: id },
    headers: { Authorization: `Bearer ${session?.access_token}` }
  });
}
