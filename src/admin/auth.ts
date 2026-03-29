import { supabase } from "../lib/supabase";
import type { Usuario } from "./store";

// ── LOGIN CON SUPABASE AUTH ───────────────────────────────────────────────
// Los usuarios se crean en el dashboard de Supabase con email.
// El campo "nombre" se mapea al email (nombre@gamedoctor.uy) para simplificar el login.
export async function login(user: string, pass: string): Promise<boolean> {
  // Construimos el email desde el nombre de usuario
  const email = `${user}@gamedoctor.uy`;

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
    .select("id, nombre, role")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    if (error) console.error("Error al obtener perfil de usuario:", error.message);
    else console.warn("No se encontró perfil para el usuario:", session.user.id);
    
    // Fallback: Si no hay perfil pero el email es admin@gamedoctor.uy, dar admin
    const email = session.user.email ?? "";
    const isSpecialAdmin = email === "admin@gamedoctor.uy";
    
    return {
      id: session.user.id,
      nombre: email.split("@")[0],
      email: email,
      role: isSpecialAdmin ? "admin" : "subadmin",
    };
  }

  return {
    id: profile.id,
    nombre: profile.nombre,
    email: session.user.email ?? "",
    role: profile.role as "admin" | "subadmin",
  };
}

// ── GESTIÓN DE USUARIOS (solo admin) ─────────────────────────────────────
export async function fetchUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase.from("profiles").select("id, nombre, role");
  if (error) { console.error(error); return []; }
  return (data ?? []).map(p => ({ ...p, email: `${p.nombre}@gamedoctor.uy`, password: "" }));
}

// Crear un nuevo usuario en Supabase Auth + perfil
export async function createUsuario(nombre: string, password: string, role: "admin" | "subadmin"): Promise<boolean> {
  const email = `${nombre}@gamedoctor.uy`;

  // Usamos el Admin API (service_role) para crear usuarios.
  // Con la anon key, solo podemos hacer signup si está habilitado.
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) { console.error("Error creando usuario:", error?.message); return false; }

  // Crear el perfil asociado
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    nombre,
    role,
  });
  if (profileError) { console.error("Error creando perfil:", profileError.message); return false; }
  return true;
}

// Cambiar mi propia contraseña
export async function changeMyPassword(newPassword: string): Promise<boolean> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) { console.error("Error cambiando mi contraseña:", error.message); return false; }
  return true;
}

// Actualizar nombre y sincronizar con Auth (email)
export async function updateNombre(id: string, nuevoNombre: string, password?: string): Promise<boolean> {
  const email = `${nuevoNombre}@gamedoctor.uy`;

  // 1. Sincronizar con Auth vía Edge Function (Email + Opcional Password)
  const { data: { session } } = await supabase.auth.getSession();
  const { data, error: functionError } = await supabase.functions.invoke("admin-reset-password", {
    body: { userId: id, newEmail: email, password },
    headers: {
      Authorization: `Bearer ${session?.access_token}`
    }
  });

  if (functionError || data?.error) {
    console.error("Error sincronizando Auth:", functionError?.message || data?.error);
    return false;
  }

  // 2. Actualizar tabla profiles
  const { error } = await supabase
    .from("profiles")
    .update({ nombre: nuevoNombre })
    .eq("id", id);

  if (error) { 
    console.error("Error actualizando perfil:", error.message); 
    return false; 
  }

  return true;
}

// Admin cambia la contraseña de un tercero (vía Edge Function)
export async function adminChangePassword(userId: string, newPassword: string): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke("admin-reset-password", {
    body: { userId, password: newPassword },
  });

  if (error || data?.error) {
    console.error("Error en admin-reset-password:", error?.message || data?.error);
    return false;
  }
  return true;
}

// Eliminar usuario: baja del perfil (el auth.users requiere service_role)
export async function deleteUsuario(id: string): Promise<void> {
  await supabase.from("profiles").delete().eq("id", id);
}
