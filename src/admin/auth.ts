import { supabase } from "../lib/supabase";
import type { Usuario } from "./store";

// ── LOGIN CON SUPABASE AUTH ───────────────────────────────────────────────
// Los usuarios se crean en el dashboard de Supabase con email.
// El campo "nombre" se mapea al email (nombre@gamedoctor.uy) para simplificar el login.
export async function login(user: string, pass: string): Promise<boolean> {
  // Ahora el usuario ingresa su correo electrónico completo
  const email = user.includes("@") ? user : `${user}@gamedoctor.uy`;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });

  if (error || !data.session) {
    console.error("Login fallido:", error?.message);
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
      role: (session.user.email === "admin@gamedoctor.uy" || session.user.email === "santi@gamedoctor.uy") ? "admin" : "subadmin",
    };
  }

  return {
    id: profile.id,
    nombre: profile.nombre,
    email: profile.email || session.user.email || "",
    role: profile.role as "admin" | "subadmin",
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
  const { data: { session } } = await supabase.auth.getSession();
  const { data, error: functionError } = await supabase.functions.invoke("admin-reset-password", {
    body: { action: "create", nombre, email, password, role },
    headers: { Authorization: `Bearer ${session?.access_token}` }
  });

  if (functionError || data?.error) {
    console.error("Error creando usuario:", functionError?.message || data?.error);
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

// Actualizar nombre/email y sincronizar con Auth (ATÓMICO vía Edge Function)
export async function updateUsuario(id: string, nombre: string, email: string, password?: string): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  const { data, error: functionError } = await supabase.functions.invoke("admin-reset-password", {
    body: { action: "update", userId: id, nombre, newEmail: email, password },
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
