// src/lib/db.ts
// Funciones centralizadas para interactuar con Supabase
import { supabase } from "./supabase";
import type {
  Juego, ConsolaVenta, ConsolaCompra, ReparacionModelo,
  DestrabaModelo, GamePassPlan, ContactoInfo, Plataforma
} from "../admin/store";

// ── Helper para mapear contacto desde snake_case de DB ──────────────
function mapContacto(row: any): ContactoInfo {
  return {
    direccion: row.direccion ?? "",
    telefono: row.telefono ?? "",
    horario: row.horario ?? "",
    whatsapp: row.whatsapp ?? "",
    mapaEmbed: row.mapa_embed ?? "",
  };
}

// ── PLATAFORMAS ──────────────────────────────────────────────────────
export async function fetchPlataformas(): Promise<Plataforma[]> {
  const { data, error } = await supabase.from("plataformas").select("*");
  if (error) { console.error(error); return []; }
  return data as Plataforma[];
}

export async function insertPlataforma(p: Plataforma): Promise<Plataforma | null> {
  const { data, error } = await supabase.from("plataformas").insert(p).select().single();
  if (error) { console.error(error); return null; }
  return data as Plataforma;
}

export async function deletePlataforma(id: string): Promise<void> {
  const { error } = await supabase.from("plataformas").delete().eq("id", id);
  if (error) console.error(error);
}

// ── JUEGOS ───────────────────────────────────────────────────────────
export async function fetchJuegos(): Promise<Juego[]> {
  const { data, error } = await supabase.from("juegos").select("*").order("created_at");
  if (error) { console.error(error); return []; }
  return (data ?? []).map(j => ({ ...j, plataformas: j.plataformas ?? [] })) as Juego[];
}

export async function insertJuego(juego: Omit<Juego, "id">): Promise<Juego | null> {
  const { data, error } = await supabase
    .from("juegos").insert(juego).select().single();
  if (error) { console.error(error); return null; }
  return data as Juego;
}

export async function updateJuego(id: string, juego: Partial<Omit<Juego, "id">>): Promise<void> {
  const { error } = await supabase.from("juegos").update(juego).eq("id", id);
  if (error) console.error(error);
}

export async function deleteJuego(id: string): Promise<void> {
  const { error } = await supabase.from("juegos").delete().eq("id", id);
  if (error) console.error(error);
}

// ── CONSOLAS VENTA ───────────────────────────────────────────────────
export async function fetchConsolasVenta(): Promise<ConsolaVenta[]> {
  const { data, error } = await supabase.from("consolas_venta").select("*").order("created_at");
  if (error) { console.error(error); return []; }
  return data as ConsolaVenta[];
}

export async function insertConsolaVenta(c: Omit<ConsolaVenta, "id">): Promise<ConsolaVenta | null> {
  const { data, error } = await supabase.from("consolas_venta").insert(c).select().single();
  if (error) { console.error(error); return null; }
  return data as ConsolaVenta;
}

export async function updateConsolaVenta(id: string, c: Partial<Omit<ConsolaVenta, "id">>): Promise<void> {
  const { error } = await supabase.from("consolas_venta").update(c).eq("id", id);
  if (error) console.error(error);
}

export async function deleteConsolaVenta(id: string): Promise<void> {
  const { error } = await supabase.from("consolas_venta").delete().eq("id", id);
  if (error) console.error(error);
}

// ── CONSOLAS COMPRA ──────────────────────────────────────────────────
export async function fetchConsolasCompra(): Promise<ConsolaCompra[]> {
  const { data, error } = await supabase.from("consolas_compra").select("*").order("created_at");
  if (error) { console.error(error); return []; }
  return data as ConsolaCompra[];
}

export async function insertConsolaCompra(c: Omit<ConsolaCompra, "id">): Promise<ConsolaCompra | null> {
  const { data, error } = await supabase.from("consolas_compra").insert(c).select().single();
  if (error) { console.error(error); return null; }
  return data as ConsolaCompra;
}

export async function updateConsolaCompra(id: string, c: Partial<Omit<ConsolaCompra, "id">>): Promise<void> {
  const { error } = await supabase.from("consolas_compra").update(c).eq("id", id);
  if (error) console.error(error);
}

export async function deleteConsolaCompra(id: string): Promise<void> {
  const { error } = await supabase.from("consolas_compra").delete().eq("id", id);
  if (error) console.error(error);
}

// ── GAME PASS ─────────────────────────────────────────────────────────
export async function fetchGamePass(): Promise<GamePassPlan[]> {
  const { data, error } = await supabase.from("game_pass").select("*").order("created_at");
  if (error) { console.error(error); return []; }
  return data as GamePassPlan[];
}

export async function insertGamePass(g: Omit<GamePassPlan, "id">): Promise<GamePassPlan | null> {
  const { data, error } = await supabase.from("game_pass").insert(g).select().single();
  if (error) { console.error(error); return null; }
  return data as GamePassPlan;
}

export async function updateGamePass(id: string, g: Partial<Omit<GamePassPlan, "id">>): Promise<void> {
  const { error } = await supabase.from("game_pass").update(g).eq("id", id);
  if (error) console.error(error);
}

export async function deleteGamePass(id: string): Promise<void> {
  const { error } = await supabase.from("game_pass").delete().eq("id", id);
  if (error) console.error(error);
}

// ── REPARACION ────────────────────────────────────────────────────────
export async function fetchReparacion(): Promise<ReparacionModelo[]> {
  const { data, error } = await supabase.from("servicios_reparacion").select("*");
  if (error) { console.error(error); return []; }
  return data as ReparacionModelo[];
}

export async function insertReparacion(r: Omit<ReparacionModelo, "id">): Promise<ReparacionModelo | null> {
  const { data, error } = await supabase.from("servicios_reparacion").insert(r).select().single();
  if (error) { console.error(error); return null; }
  return data as ReparacionModelo;
}

export async function updateReparacion(id: string, r: Partial<Omit<ReparacionModelo, "id">>): Promise<void> {
  const { error } = await supabase.from("servicios_reparacion").update(r).eq("id", id);
  if (error) console.error(error);
}

export async function deleteReparacion(id: string): Promise<void> {
  const { error } = await supabase.from("servicios_reparacion").delete().eq("id", id);
  if (error) console.error(error);
}

// ── DESTRABA ──────────────────────────────────────────────────────────
export async function fetchDestraba(): Promise<DestrabaModelo[]> {
  const { data, error } = await supabase.from("servicios_destraba").select("*");
  if (error) { console.error(error); return []; }
  return data as DestrabaModelo[];
}

export async function insertDestraba(d: Omit<DestrabaModelo, "id">): Promise<DestrabaModelo | null> {
  const { data, error } = await supabase.from("servicios_destraba").insert(d).select().single();
  if (error) { console.error(error); return null; }
  return data as DestrabaModelo;
}

export async function updateDestraba(id: string, d: Partial<Omit<DestrabaModelo, "id">>): Promise<void> {
  const { error } = await supabase.from("servicios_destraba").update(d).eq("id", id);
  if (error) console.error(error);
}

export async function deleteDestraba(id: string): Promise<void> {
  const { error } = await supabase.from("servicios_destraba").delete().eq("id", id);
  if (error) console.error(error);
}

// ── CONTACTO ──────────────────────────────────────────────────────────
export async function fetchContacto(): Promise<ContactoInfo | null> {
  const { data, error } = await supabase.from("config_contacto").select("*").limit(1).maybeSingle();
  if (error) { console.error(error); return null; }
  if (!data) return null;
  return mapContacto(data);
}

export async function upsertContacto(info: ContactoInfo): Promise<void> {
  // Get current row id first
  const { data: existing } = await supabase.from("config_contacto").select("id").limit(1).maybeSingle();
  const payload = {
    direccion: info.direccion,
    telefono: info.telefono,
    horario: info.horario,
    whatsapp: info.whatsapp,
    mapa_embed: info.mapaEmbed,
  };
  if (existing?.id) {
    await supabase.from("config_contacto").update(payload).eq("id", existing.id);
  } else {
    await supabase.from("config_contacto").insert(payload);
  }
}
