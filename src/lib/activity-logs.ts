import { supabase } from "./supabase";

export type AdminAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN";

export async function logActivity(
  action: AdminAction,
  entityType: string,
  entityName?: string,
  details: any = {}
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Obtener nombre del perfil para lectura rápida en el log
    const { data: profile } = await supabase
      .from("profiles")
      .select("nombre")
      .eq("id", session.user.id)
      .single();

    const { error } = await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      user_name: profile?.nombre || session.user.email || "Admin",
      action,
      entity_type: entityType,
      entity_name: entityName || "N/A",
      details
    });

    if (error) {
      console.error("Error al registrar actividad:", error.message);
    }
  } catch (err) {
    console.error("Error inesperado en logActivity:", err);
  }
}
