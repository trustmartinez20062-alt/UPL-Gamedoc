import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import * as db from "../lib/db";
import { logActivity } from "../lib/activity-logs";
import { sanitizeText, sanitizeUrl } from "../lib/sanitize";
import { enforceRateLimit } from "../lib/rate-limiter";

// ── Zod Schemas for Validation ──────────────────────────────────────
export const consolaVentaSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(200).transform(v => sanitizeText(v, 200)),
  estado: z.enum(["Nueva", "Usada", "Restaurada"]),
  version: z.string().max(100).optional().default("Original").transform(v => sanitizeText(v, 100)),
  info: z.string().max(2000).optional().default("").transform(v => sanitizeText(v, 2000)),
  garantia: z.string().max(500).optional().default("").transform(v => sanitizeText(v, 500)),
  precio: z.string().min(1, "El precio es requerido").max(50).transform(v => sanitizeText(v, 50)),
  moneda: z.enum(["UYU", "USD"]).default("UYU"),
  image: z.string().url("La URL de la imagen no es válida").or(z.string().min(1, "La imagen es requerida")).transform(v => sanitizeUrl(v)),
  mercadolibre_url: z.string().url("La URL de Mercado Libre no es válida").optional().or(z.literal("")).transform(v => v ? sanitizeUrl(v) : ""),
  orden: z.number().optional(),
});

export const juegoSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es requerido").max(300).transform(v => sanitizeText(v, 300)),
  plataformas: z.array(z.string().max(50)).min(1, "Selecciona al menos una plataforma").max(20),
  image: z.string().url("URL de imagen no válida").transform(v => sanitizeUrl(v)),
  precio: z.string().max(50).optional().transform(v => v ? sanitizeText(v, 50) : undefined),
});

export const gamePassPlanSchema = z.object({
  id: z.string().optional(),
  plan: z.string().min(1, "El nombre del plan es requerido").max(200).transform(v => sanitizeText(v, 200)),
  precio: z.string().min(1, "El precio es requerido").max(50).transform(v => sanitizeText(v, 50)),
  moneda: z.enum(["UYU", "USD"]).default("UYU"),
  type_id: z.string().optional(),
  mercadolibre_url: z.string().url("URL no válida").optional().or(z.literal("")).transform(v => v ? sanitizeUrl(v) : ""),
  orden: z.number().optional(),
});

export const contactoInfoSchema = z.object({
  direccion: z.string().min(5, "Dirección demasiado corta").max(300).transform(v => sanitizeText(v, 300)),
  telefono: z.string().min(8, "Teléfono inválido").max(30).transform(v => sanitizeText(v, 30)),
  horario: z.string().min(3, "Horario requerido").max(200).transform(v => sanitizeText(v, 200)),
  whatsapp: z.string().url("Enlace de WhatsApp inválido").transform(v => sanitizeUrl(v)),
  mapaEmbed: z.string().min(10, "Iframe de mapa inválido").max(2000).transform(v => sanitizeText(v, 2000)),
  sobre_nosotros_texto: z.string().max(3000).optional().transform(v => v ? sanitizeText(v, 3000) : undefined),
  sobre_nosotros_ticks: z.array(z.string().max(200).transform(v => sanitizeText(v, 200))).max(20).optional(),
  sobre_nosotros_imagen: z.string().url().optional().or(z.literal("")).transform(v => v ? sanitizeUrl(v) : ""),
  facebook: z.string().url().optional().or(z.literal("")).transform(v => v ? sanitizeUrl(v) : ""),
  instagram: z.string().url().optional().or(z.literal("")).transform(v => v ? sanitizeUrl(v) : ""),
  mercadolibre: z.string().url().optional().or(z.literal("")).transform(v => v ? sanitizeUrl(v) : ""),
});

// ── Types ──────────────────────────────────────────────────────────
export type ConsolaVentaInput = z.infer<typeof consolaVentaSchema>;
export interface ConsolaVenta extends ConsolaVentaInput {}

export type Juego = z.infer<typeof juegoSchema>;

export type GamePassPlanInput = z.infer<typeof gamePassPlanSchema>;
export interface GamePassPlan extends GamePassPlanInput {
  type?: GamePassType;
}

export type ContactoInfo = z.infer<typeof contactoInfoSchema>;

export interface ConsolaCompra {
  id: string;
  name: string;
  precio: string;
}

export interface ReparacionModelo {
  id: string;
  modelo: string;
}

export interface DestrabaModelo {
  id: string;
  modelo: string;
  precio: string;
}

export interface Plataforma {
  id: string;
  name: string;
}

export interface GamePassType {
  id: string;
  name: string;
  image: string;
  prefix: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  role: "admin" | "subadmin";
  pendingEmail?: string;
}

// ── ID generator (kept for compatibility, Supabase generates real UUIDs) ──
export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ── PLATAFORMAS ───────────────────────────────────────────────────────
export const usePlataformas = () => {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["plataformas"], queryFn: db.fetchPlataformas, staleTime: Infinity });
  const plataformas = query.data ?? [];

  const setPlataformas = async (val: Plataforma[] | ((prev: Plataforma[]) => Plataforma[])) => {
    enforceRateLimit("plataformas");
    const next = typeof val === "function" ? val(plataformas) : val;

    const existingIds = new Set(plataformas.map(p => p.id));
    const nextIds = new Set(next.map(p => p.id));

    // Deleted
    for (const p of plataformas) {
      if (!nextIds.has(p.id)) {
        await db.deletePlataforma(p.id);
        logActivity("DELETE", "Plataforma", p.name);
      }
    }
    // Added
    for (const p of next) {
      if (!existingIds.has(p.id)) {
        await db.insertPlataforma(p);
        logActivity("CREATE", "Plataforma", p.name);
      }
    }
    qc.invalidateQueries({ queryKey: ["plataformas"] });
  };

  return [plataformas, setPlataformas, query] as const;
};

// ── JUEGOS ────────────────────────────────────────────────────────────
export const useJuegos = () => {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["juegos"], queryFn: db.fetchJuegos });
  const juegos = query.data ?? [];

  const setJuegos = async (val: Juego[] | ((prev: Juego[]) => Juego[])) => {
    enforceRateLimit("juegos");
    const next = typeof val === "function" ? val(juegos) : val;
    // Detect added / removed by diffing
    const existingIds = new Set(juegos.map(j => j.id));
    const nextIds = new Set(next.map(j => j.id));

    // Deleted
    for (const j of juegos) {
      if (!nextIds.has(j.id)) {
        await db.deleteJuego(j.id);
        logActivity("DELETE", "Juego", j.name);
      }
    }
    // Added
    for (const j of next) {
      if (!existingIds.has(j.id)) {
        const { id, ...rest } = j;
        await db.insertJuego(rest);
        logActivity("CREATE", "Juego", j.name);
      } else {
        // Updated
        const orig = juegos.find(o => o.id === j.id);
        if (orig && JSON.stringify(orig) !== JSON.stringify(j)) {
          const { id, ...rest } = j;
          await db.updateJuego(id, rest);
          logActivity("UPDATE", "Juego", j.name);
        }
      }
    }
    qc.invalidateQueries({ queryKey: ["juegos"] });
  };

  return [juegos, setJuegos, query] as const;
};

// ── CONSOLAS VENTA ─────────────────────────────────────────────────────
export const useConsolasVenta = () => {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["consolas_venta"], queryFn: db.fetchConsolasVenta });
  const items = query.data ?? [];

  const setItems = async (val: ConsolaVenta[] | ((prev: ConsolaVenta[]) => ConsolaVenta[])) => {
    enforceRateLimit("consolas_venta");
    const next = typeof val === "function" ? val(items) : val;
    const existingIds = new Set(items.map(i => i.id));
    const nextIds = new Set(next.map(i => i.id));
    for (const i of items) { if (!nextIds.has(i.id)) { await db.deleteConsolaVenta(i.id); logActivity("DELETE", "Consola Venta", i.name); } }
    for (const i of next) {
      if (!existingIds.has(i.id)) { const { id, ...rest } = i; await db.insertConsolaVenta(rest); logActivity("CREATE", "Consola Venta", i.name); }
      else {
        const orig = items.find(o => o.id === i.id);
        if (orig && JSON.stringify(orig) !== JSON.stringify(i)) { const { id, ...rest } = i; await db.updateConsolaVenta(id, rest); logActivity("UPDATE", "Consola Venta", i.name); }
      }
    }
    qc.invalidateQueries({ queryKey: ["consolas_venta"] });
  };
  return [items, setItems, query] as const;
};

// ── CONSOLAS COMPRA ────────────────────────────────────────────────────
export const useConsolasCompra = () => {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["consolas_compra"], queryFn: db.fetchConsolasCompra });
  const items = query.data ?? [];

  const setItems = async (val: ConsolaCompra[] | ((prev: ConsolaCompra[]) => ConsolaCompra[])) => {
    enforceRateLimit("consolas_compra");
    const next = typeof val === "function" ? val(items) : val;
    const existingIds = new Set(items.map(i => i.id));
    const nextIds = new Set(next.map(i => i.id));
    for (const i of items) { if (!nextIds.has(i.id)) await db.deleteConsolaCompra(i.id); }
    for (const i of next) {
      if (!existingIds.has(i.id)) { const { id, ...rest } = i; await db.insertConsolaCompra(rest); }
      else {
        const orig = items.find(o => o.id === i.id);
        if (orig && JSON.stringify(orig) !== JSON.stringify(i)) { const { id, ...rest } = i; await db.updateConsolaCompra(id, rest); }
      }
    }
    qc.invalidateQueries({ queryKey: ["consolas_compra"] });
  };
  return [items, setItems, query] as const;
};

// ── GAME PASS TYPES ──────────────────────────────────────────────────
export const useGamePassTypes = () => {
  const qc = useQueryClient();
  const query = useQuery<GamePassType[]>({ 
    queryKey: ["game_pass_types"], 
    queryFn: db.fetchGamePassTypes 
  });
  const items = query.data ?? [];

  const setItems = async (val: GamePassType[] | ((prev: GamePassType[]) => GamePassType[])) => {
    enforceRateLimit("game_pass_types");
    const next = typeof val === "function" ? val(items) : val;
    const existingIds = new Set(items.map(i => i.id));
    const nextIds = new Set(next.map(i => i.id));
    for (const i of items) { if (!nextIds.has(i.id)) { await db.deleteGamePassType(i.id); logActivity("DELETE", "Tipo de Pase", i.name); } }
    for (const i of next) {
      if (!existingIds.has(i.id)) { const { id, ...rest } = i; await db.insertGamePassType(rest); logActivity("CREATE", "Tipo de Pase", i.name); }
      else {
        const orig = items.find(o => o.id === i.id);
        if (orig && JSON.stringify(orig) !== JSON.stringify(i)) { const { id, ...rest } = i; await db.updateGamePassType(id, rest); logActivity("UPDATE", "Tipo de Pase", i.name); }
      }
    }
    qc.invalidateQueries({ queryKey: ["game_pass_types"] });
    qc.invalidateQueries({ queryKey: ["game_pass"] }); // Re-fetch because relation might change
  };
  return [items, setItems, query] as const;
};

// ── GAME PASS ──────────────────────────────────────────────────────────
export const useGamePass = () => {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["game_pass"], queryFn: db.fetchGamePass });
  const items = query.data ?? [];

  const setItems = async (val: GamePassPlan[] | ((prev: GamePassPlan[]) => GamePassPlan[])) => {
    enforceRateLimit("game_pass");
    const next = typeof val === "function" ? val(items) : val;
    const existingIds = new Set(items.map(i => i.id));
    const nextIds = new Set(next.map(i => i.id));
    for (const i of items) { if (!nextIds.has(i.id)) { await db.deleteGamePass(i.id); logActivity("DELETE", "Plan Game Pass", i.plan); } }
    for (const i of next) {
      if (!existingIds.has(i.id)) { 
        const { id, type, ...rest } = i; 
        await db.insertGamePass(rest as any); 
        logActivity("CREATE", "Plan Game Pass", i.plan);
      }
      else {
        const orig = items.find(o => o.id === i.id);
        if (orig && JSON.stringify(orig) !== JSON.stringify(i)) { 
          const { id, type, ...rest } = i; 
          await db.updateGamePass(id, rest as any); 
          logActivity("UPDATE", "Plan Game Pass", i.plan);
        }
      }
    }
    qc.invalidateQueries({ queryKey: ["game_pass"] });
  };
  return [items, setItems, query] as const;
};

// ── REPARACION ─────────────────────────────────────────────────────────
export const useReparacion = () => {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["reparacion"], queryFn: db.fetchReparacion });
  const items = query.data ?? [];

  const setItems = async (val: ReparacionModelo[] | ((prev: ReparacionModelo[]) => ReparacionModelo[])) => {
    enforceRateLimit("reparacion");
    const next = typeof val === "function" ? val(items) : val;
    const existingIds = new Set(items.map(i => i.id));
    const nextIds = new Set(next.map(i => i.id));
    for (const i of items) { if (!nextIds.has(i.id)) await db.deleteReparacion(i.id); }
    for (const i of next) {
      if (!existingIds.has(i.id)) { const { id, ...rest } = i; await db.insertReparacion(rest); }
      else {
        const orig = items.find(o => o.id === i.id);
        if (orig && JSON.stringify(orig) !== JSON.stringify(i)) { const { id, ...rest } = i; await db.updateReparacion(id, rest); }
      }
    }
    qc.invalidateQueries({ queryKey: ["reparacion"] });
  };
  return [items, setItems, query] as const;
};

// ── DESTRABA ───────────────────────────────────────────────────────────
export const useDestraba = () => {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["destraba"], queryFn: db.fetchDestraba });
  const items = query.data ?? [];

  const setItems = async (val: DestrabaModelo[] | ((prev: DestrabaModelo[]) => DestrabaModelo[])) => {
    enforceRateLimit("destraba");
    const next = typeof val === "function" ? val(items) : val;
    const existingIds = new Set(items.map(i => i.id));
    const nextIds = new Set(next.map(i => i.id));
    for (const i of items) { if (!nextIds.has(i.id)) await db.deleteDestraba(i.id); }
    for (const i of next) {
      if (!existingIds.has(i.id)) { const { id, ...rest } = i; await db.insertDestraba(rest); }
      else {
        const orig = items.find(o => o.id === i.id);
        if (orig && JSON.stringify(orig) !== JSON.stringify(i)) { const { id, ...rest } = i; await db.updateDestraba(id, rest); }
      }
    }
    qc.invalidateQueries({ queryKey: ["destraba"] });
  };
  return [items, setItems, query] as const;
};

// ── CONTACTO ───────────────────────────────────────────────────────────
const SEED_CONTACTO: ContactoInfo = {
  direccion: "Juan José Castro 2381, Montevideo, Uruguay",
  telefono: "096 593 154",
  horario: "Lunes a Sábado — Consultá disponibilidad",
  whatsapp: "https://wa.me/59896593154?text=Hola%20Game%20Doctor!%20Quiero%20consultar%20sobre...",
  mapaEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3273.2247270613843!2d-56.13018048791508!3d-34.875702772744795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f81af46cb7f33%3A0xfa038957580c9695!2sTienda%20de%20Juegos%20-%20GAME%20DOCTOR!5e0!3m2!1ses!2suy!4v1774756722738!5m2!1ses!2suy",
  sobre_nosotros_texto: "Somos una tienda especializada en el mundo gaming ubicada en Montevideo, Uruguay.\nNos dedicamos a la venta y reparación de consolas PlayStation, Xbox y Nintendo, así como a la venta de juegos digitales y suscripciones como Game Pass Ultimate.\n\nNuestro compromiso es ofrecer el mejor servicio, precios justos y atención personalizada. Ya seas un gamer casual o un revendedor, tenemos lo que necesitás.",
  sobre_nosotros_ticks: [
    "Años de experiencia en reparación de consolas",
    "Precios competitivos por mayor y menor",
    "Atención personalizada y rápida",
    "Garantía en todos nuestros servicios",
    "Juegos digitales 100% originales",
    "Ubicación céntrica en Montevideo"
  ],
  sobre_nosotros_imagen: "",
  facebook: "https://www.facebook.com/gamedoctor2004/?locale=es_LA",
  instagram: "https://www.instagram.com/gamedoctor2004?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  mercadolibre: "https://www.mercadolibre.com.uy/"
};

export const useContacto = () => {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["contacto"],
    queryFn: db.fetchContacto,
  });

  const contacto = query.data ?? SEED_CONTACTO;

  const setContacto = async (val: ContactoInfo | ((prev: ContactoInfo) => ContactoInfo)) => {
    enforceRateLimit("contacto");
    const next = typeof val === "function" ? val(contacto) : val;
    await db.upsertContacto(next);
    logActivity("UPDATE", "Contacto/Sobre Nosotros", "Configuración");
    qc.invalidateQueries({ queryKey: ["contacto"] });
  };

  return [contacto, setContacto, query] as const;
};

// ── USUARIOS (via Supabase Auth + profiles) ────────────────────────────
// Importado desde auth.ts para mantener la lógica de usuarios centralizada
export const useUsuarios = () => {
  // Implementado en auth.ts / Usuarios.tsx con supabase.auth
  // Este hook es un placeholder para compatibilidad de tipos
  return [[], () => {}] as [Usuario[], (v: any) => void];
};
