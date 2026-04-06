// src/lib/db.ts
// Funciones centralizadas para interactuar con Supabase
import { supabase } from "./supabase";
import type {
  Juego, ConsolaVenta, ConsolaCompra, ReparacionModelo,
  DestrabaModelo, GamePassPlan, ContactoInfo, Plataforma, GamePassType
} from "../admin/store";

// ── Helper para mapear contacto desde snake_case de DB ──────────────
interface ContactoRow {
  direccion?: string;
  telefono?: string;
  horario?: string;
  whatsapp?: string;
  mapa_embed?: string;
  sobre_nosotros_texto?: string;
  sobre_nosotros_ticks?: string[];
  sobre_nosotros_imagen?: string;
  facebook?: string;
  instagram?: string;
  mercadolibre?: string;
}

function mapContacto(row: ContactoRow): ContactoInfo {
  return {
    direccion: row.direccion ?? "",
    telefono: row.telefono ?? "",
    horario: row.horario ?? "",
    whatsapp: row.whatsapp ?? "",
    mapaEmbed: row.mapa_embed ?? "",
    sobre_nosotros_texto: row.sobre_nosotros_texto ?? "",
    sobre_nosotros_ticks: row.sobre_nosotros_ticks ?? [],
    sobre_nosotros_imagen: row.sobre_nosotros_imagen ?? "",
    facebook: row.facebook ?? "https://www.facebook.com/gamedoctor2004/?locale=es_LA",
    instagram: row.instagram ?? "https://www.instagram.com/gamedoctor2004?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    mercadolibre: row.mercadolibre ?? "",
  };
}

// ── PLATAFORMAS ──────────────────────────────────────────────────────
export async function fetchPlataformas(): Promise<Plataforma[]> {
  const { data, error } = await supabase.from("plataformas").select("*").order("name");
  if (error) {
    console.error("Error fetching plataformas:", error);
    return [];
  }
  return data as Plataforma[];
}

export async function insertPlataforma(p: Plataforma): Promise<Plataforma | null> {
  const { data, error } = await supabase.from("plataformas").insert(p).select().single();
  if (error) {
    console.error("Error inserting plataforma:", error);
    return null;
  }
  return data as Plataforma;
}

export async function deletePlataforma(id: string): Promise<void> {
  const { error } = await supabase.from("plataformas").delete().eq("id", id);
  if (error) console.error("Error deleting plataforma:", error);
}

// ── JUEGOS ───────────────────────────────────────────────────────────
export async function fetchJuegos(): Promise<Juego[]> {
  const { data, error } = await supabase.from("juegos").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching juegos:", error);
    return [];
  }
  return (data ?? []).map(j => ({
    ...j,
    plataformas: j.plataformas ?? []
  })) as Juego[];
}

export async function insertJuego(juego: Omit<Juego, "id">): Promise<Juego | null> {
  const { data, error } = await supabase
    .from("juegos").insert(juego).select().single();
  if (error) {
    console.error("Error inserting juego:", error);
    return null;
  }
  return data as Juego;
}

export async function updateJuego(id: string, juego: Partial<Omit<Juego, "id">>): Promise<void> {
  const { error } = await supabase.from("juegos").update(juego).eq("id", id);
  if (error) console.error("Error updating juego:", error);
}

export async function deleteJuego(id: string): Promise<void> {
  const { error } = await supabase.from("juegos").delete().eq("id", id);
  if (error) console.error("Error deleting juego:", error);
}

// ── CONSOLAS VENTA ───────────────────────────────────────────────────
export async function fetchConsolasVenta(): Promise<ConsolaVenta[]> {
  const { data, error } = await supabase.from("consolas_venta").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching consolas venta:", error);
    return [];
  }
  return data as ConsolaVenta[];
}

export async function insertConsolaVenta(c: Omit<ConsolaVenta, "id">): Promise<ConsolaVenta | null> {
  const { data, error } = await supabase.from("consolas_venta").insert(c).select().single();
  if (error) {
    console.error("Error inserting consola venta:", error);
    return null;
  }
  return data as ConsolaVenta;
}

export async function updateConsolaVenta(id: string, c: Partial<Omit<ConsolaVenta, "id">>): Promise<void> {
  const { error } = await supabase.from("consolas_venta").update(c).eq("id", id);
  if (error) console.error("Error updating consola venta:", error);
}

export async function deleteConsolaVenta(id: string): Promise<void> {
  const { error } = await supabase.from("consolas_venta").delete().eq("id", id);
  if (error) console.error("Error deleting consola venta:", error);
}

// ── CONSOLAS COMPRA ──────────────────────────────────────────────────
export async function fetchConsolasCompra(): Promise<ConsolaCompra[]> {
  const { data, error } = await supabase.from("consolas_compra").select("*").order("name");
  if (error) {
    console.error("Error fetching consolas compra:", error);
    return [];
  }
  return data as ConsolaCompra[];
}

export async function insertConsolaCompra(c: Omit<ConsolaCompra, "id">): Promise<ConsolaCompra | null> {
  const { data, error } = await supabase.from("consolas_compra").insert(c).select().single();
  if (error) {
    console.error("Error inserting consola compra:", error);
    return null;
  }
  return data as ConsolaCompra;
}

export async function updateConsolaCompra(id: string, c: Partial<Omit<ConsolaCompra, "id">>): Promise<void> {
  const { error } = await supabase.from("consolas_compra").update(c).eq("id", id);
  if (error) console.error("Error updating consola compra:", error);
}

export async function deleteConsolaCompra(id: string): Promise<void> {
  const { error } = await supabase.from("consolas_compra").delete().eq("id", id);
  if (error) console.error("Error deleting consola compra:", error);
}

// ── GAME PASS TYPES ──────────────────────────────────────────────────
export async function fetchGamePassTypes(): Promise<GamePassType[]> {
  const { data, error } = await supabase.from("game_pass_types").select("*").order("name");
  if (error) {
    console.error("Error fetching game pass types:", error);
    return [];
  }
  return data as GamePassType[];
}

export async function insertGamePassType(t: Omit<GamePassType, "id">): Promise<GamePassType | null> {
  const { data, error } = await supabase.from("game_pass_types").insert(t).select().single();
  if (error) {
    console.error("Error inserting game pass type:", error);
    return null;
  }
  return data as GamePassType;
}

export async function updateGamePassType(id: string, t: Partial<Omit<GamePassType, "id">>): Promise<void> {
  const { error } = await supabase.from("game_pass_types").update(t).eq("id", id);
  if (error) console.error("Error updating game pass type:", error);
}

export async function deleteGamePassType(id: string): Promise<void> {
  const { error } = await supabase.from("game_pass_types").delete().eq("id", id);
  if (error) console.error("Error deleting game pass type:", error);
}

// ── GAME PASS ─────────────────────────────────────────────────────────
export async function fetchGamePass(): Promise<GamePassPlan[]> {
  const { data, error } = await supabase
    .from("game_pass")
    .select("*, type:game_pass_types(*)")
    .order("created_at");
  if (error) {
    console.error("Error fetching game pass plans:", error);
    return [];
  }
  return data as GamePassPlan[];
}

export async function insertGamePass(g: Omit<GamePassPlan, "id" | "type">): Promise<GamePassPlan | null> {
  const { data, error } = await supabase.from("game_pass").insert(g).select().single();
  if (error) {
    console.error("Error inserting game pass plan:", error);
    return null;
  }
  return data as GamePassPlan;
}

export async function updateGamePass(id: string, g: Partial<Omit<GamePassPlan, "id" | "type">>): Promise<void> {
  const { error } = await supabase.from("game_pass").update(g).eq("id", id);
  if (error) console.error("Error updating game pass plan:", error);
}

export async function deleteGamePass(id: string): Promise<void> {
  const { error } = await supabase.from("game_pass").delete().eq("id", id);
  if (error) console.error("Error deleting game pass plan:", error);
}

// ── REPARACION ────────────────────────────────────────────────────────
export async function fetchReparacion(): Promise<ReparacionModelo[]> {
  const { data, error } = await supabase.from("servicios_reparacion").select("*").order("modelo");
  if (error) {
    console.error("Error fetching reparaciones:", error);
    return [];
  }
  return data as ReparacionModelo[];
}

export async function insertReparacion(r: Omit<ReparacionModelo, "id">): Promise<ReparacionModelo | null> {
  const { data, error } = await supabase.from("servicios_reparacion").insert(r).select().single();
  if (error) {
    console.error("Error inserting reparacion:", error);
    return null;
  }
  return data as ReparacionModelo;
}

export async function updateReparacion(id: string, r: Partial<Omit<ReparacionModelo, "id">>): Promise<void> {
  const { error } = await supabase.from("servicios_reparacion").update(r).eq("id", id);
  if (error) console.error("Error updating reparacion:", error);
}

export async function deleteReparacion(id: string): Promise<void> {
  const { error } = await supabase.from("servicios_reparacion").delete().eq("id", id);
  if (error) console.error("Error deleting reparacion:", error);
}

// ── DESTRABA ──────────────────────────────────────────────────────────
export async function fetchDestraba(): Promise<DestrabaModelo[]> {
  const { data, error } = await supabase.from("servicios_destraba").select("*").order("modelo");
  if (error) {
    console.error("Error fetching destrabas:", error);
    return [];
  }
  return data as DestrabaModelo[];
}

export async function insertDestraba(d: Omit<DestrabaModelo, "id">): Promise<DestrabaModelo | null> {
  const { data, error } = await supabase.from("servicios_destraba").insert(d).select().single();
  if (error) {
    console.error("Error inserting destraba:", error);
    return null;
  }
  return data as DestrabaModelo;
}

export async function updateDestraba(id: string, d: Partial<Omit<DestrabaModelo, "id">>): Promise<void> {
  const { error } = await supabase.from("servicios_destraba").update(d).eq("id", id);
  if (error) console.error("Error updating destraba:", error);
}

export async function deleteDestraba(id: string): Promise<void> {
  const { error } = await supabase.from("servicios_destraba").delete().eq("id", id);
  if (error) console.error("Error deleting destraba:", error);
}

// ── CONTACTO ──────────────────────────────────────────────────────────
export async function fetchContacto(): Promise<ContactoInfo | null> {
  const { data, error } = await supabase.from("config_contacto").select("*").limit(1).maybeSingle();
  if (error) {
    console.error("Error fetching contacto:", error);
    return null;
  }
  if (!data) return null;
  return mapContacto(data as ContactoRow);
}

export async function upsertContacto(info: ContactoInfo): Promise<void> {
  // Get current row id first
  const { data: existing } = await supabase.from("config_contacto").select("id").limit(1).maybeSingle();
  
  const payload: ContactoRow = {
    direccion: info.direccion,
    telefono: info.telefono,
    horario: info.horario,
    whatsapp: info.whatsapp,
    mapa_embed: info.mapaEmbed,
    sobre_nosotros_texto: info.sobre_nosotros_texto,
    sobre_nosotros_ticks: info.sobre_nosotros_ticks,
    sobre_nosotros_imagen: info.sobre_nosotros_imagen,
    facebook: info.facebook,
    instagram: info.instagram,
    mercadolibre: info.mercadolibre,
  };

  if (existing?.id) {
    const { error } = await supabase.from("config_contacto").update(payload).eq("id", existing.id);
    if (error) console.error("Error updating contacto:", error);
  } else {
    const { error } = await supabase.from("config_contacto").insert(payload);
    if (error) console.error("Error inserting contacto:", error);
  }
}

// ── STORAGE ───────────────────────────────────────────────────────────
export async function uploadImage(file: File, folder: string): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error al subir imagen:", uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImageFromStorage(url: string): Promise<void> {
  if (!url) return;

  // Solo borrar si es una URL de nuestro bucket 'images'.
  // Las URLs de Supabase tienen este formato: .../public/images/[path]
  const parts = url.split("/public/images/");
  if (parts.length < 2) return;

  const path = parts[1].split('?')[0]; // Ignora parámetros como ?v=123
  if (!path) return;

  const { error } = await supabase.storage
    .from("images")
    .remove([path]);

  if (error) {
    console.error("Error al borrar imagen del storage:", error);
  } else {
    console.log("Imagen borrada exitosamente del storage:", path);
  }
}
