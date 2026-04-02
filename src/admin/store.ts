import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as db from "../lib/db";

// ── Types ──────────────────────────────────────────────────────────
export interface ConsolaVenta {
  id: string;
  name: string;
  estado: "Nueva" | "Usada" | "Restaurada";
  version?: "Original" | "Destrabada" | string;
  info?: string;
  garantia?: string;
  precio: string;
  image: string;
}

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

export interface Juego {
  id: string;
  name: string;
  plataformas: string[];
  image: string;
  precio: string;
}

export interface Plataforma {
  id: string;
  name: string;
}

export interface GamePassPlan {
  id: string;
  plan: string;
  precio: string;
}

export interface ContactoInfo {
  direccion: string;
  telefono: string;
  horario: string;
  whatsapp: string;
  mapaEmbed: string;
  sobre_nosotros_texto?: string;
  sobre_nosotros_ticks?: string[];
  sobre_nosotros_imagen?: string;
  facebook?: string;
  instagram?: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  role: "admin" | "subadmin";
}

// ── ID generator (kept for compatibility, Supabase generates real UUIDs) ──
export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ── PLATAFORMAS ───────────────────────────────────────────────────────
export const usePlataformas = () => {
  const qc = useQueryClient();
  const { data: plataformas = [] } = useQuery({ queryKey: ["plataformas"], queryFn: db.fetchPlataformas, staleTime: Infinity });

  const setPlataformas = async (val: Plataforma[] | ((prev: Plataforma[]) => Plataforma[])) => {
    const next = typeof val === "function" ? val(plataformas) : val;

    const existingIds = new Set(plataformas.map(p => p.id));
    const nextIds = new Set(next.map(p => p.id));

    // Deleted
    for (const p of plataformas) {
      if (!nextIds.has(p.id)) await db.deletePlataforma(p.id);
    }
    // Added
    for (const p of next) {
      if (!existingIds.has(p.id)) {
        await db.insertPlataforma(p);
      }
    }
    qc.invalidateQueries({ queryKey: ["plataformas"] });
  };

  return [plataformas, setPlataformas] as const;
};

// ── JUEGOS ────────────────────────────────────────────────────────────
export const useJuegos = () => {
  const qc = useQueryClient();
  const { data: juegos = [] } = useQuery({ queryKey: ["juegos"], queryFn: db.fetchJuegos });

  const setJuegos = async (val: Juego[] | ((prev: Juego[]) => Juego[])) => {
    const next = typeof val === "function" ? val(juegos) : val;
    // Detect added / removed by diffing
    const existingIds = new Set(juegos.map(j => j.id));
    const nextIds = new Set(next.map(j => j.id));

    // Deleted
    for (const j of juegos) {
      if (!nextIds.has(j.id)) await db.deleteJuego(j.id);
    }
    // Added
    for (const j of next) {
      if (!existingIds.has(j.id)) {
        const { id, ...rest } = j;
        await db.insertJuego(rest);
      } else {
        // Updated
        const orig = juegos.find(o => o.id === j.id);
        if (orig && JSON.stringify(orig) !== JSON.stringify(j)) {
          const { id, ...rest } = j;
          await db.updateJuego(id, rest);
        }
      }
    }
    qc.invalidateQueries({ queryKey: ["juegos"] });
  };

  return [juegos, setJuegos] as const;
};

// ── CONSOLAS VENTA ─────────────────────────────────────────────────────
export const useConsolasVenta = () => {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["consolas_venta"], queryFn: db.fetchConsolasVenta });

  const setItems = async (val: ConsolaVenta[] | ((prev: ConsolaVenta[]) => ConsolaVenta[])) => {
    const next = typeof val === "function" ? val(items) : val;
    const existingIds = new Set(items.map(i => i.id));
    const nextIds = new Set(next.map(i => i.id));
    for (const i of items) { if (!nextIds.has(i.id)) await db.deleteConsolaVenta(i.id); }
    for (const i of next) {
      if (!existingIds.has(i.id)) { const { id, ...rest } = i; await db.insertConsolaVenta(rest); }
      else {
        const orig = items.find(o => o.id === i.id);
        if (orig && JSON.stringify(orig) !== JSON.stringify(i)) { const { id, ...rest } = i; await db.updateConsolaVenta(id, rest); }
      }
    }
    qc.invalidateQueries({ queryKey: ["consolas_venta"] });
  };
  return [items, setItems] as const;
};

// ── CONSOLAS COMPRA ────────────────────────────────────────────────────
export const useConsolasCompra = () => {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["consolas_compra"], queryFn: db.fetchConsolasCompra });

  const setItems = async (val: ConsolaCompra[] | ((prev: ConsolaCompra[]) => ConsolaCompra[])) => {
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
  return [items, setItems] as const;
};

// ── GAME PASS ──────────────────────────────────────────────────────────
export const useGamePass = () => {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["game_pass"], queryFn: db.fetchGamePass });

  const setItems = async (val: GamePassPlan[] | ((prev: GamePassPlan[]) => GamePassPlan[])) => {
    const next = typeof val === "function" ? val(items) : val;
    const existingIds = new Set(items.map(i => i.id));
    const nextIds = new Set(next.map(i => i.id));
    for (const i of items) { if (!nextIds.has(i.id)) await db.deleteGamePass(i.id); }
    for (const i of next) {
      if (!existingIds.has(i.id)) { const { id, ...rest } = i; await db.insertGamePass(rest); }
      else {
        const orig = items.find(o => o.id === i.id);
        if (orig && JSON.stringify(orig) !== JSON.stringify(i)) { const { id, ...rest } = i; await db.updateGamePass(id, rest); }
      }
    }
    qc.invalidateQueries({ queryKey: ["game_pass"] });
  };
  return [items, setItems] as const;
};

// ── REPARACION ─────────────────────────────────────────────────────────
export const useReparacion = () => {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["reparacion"], queryFn: db.fetchReparacion });

  const setItems = async (val: ReparacionModelo[] | ((prev: ReparacionModelo[]) => ReparacionModelo[])) => {
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
  return [items, setItems] as const;
};

// ── DESTRABA ───────────────────────────────────────────────────────────
export const useDestraba = () => {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["destraba"], queryFn: db.fetchDestraba });

  const setItems = async (val: DestrabaModelo[] | ((prev: DestrabaModelo[]) => DestrabaModelo[])) => {
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
  return [items, setItems] as const;
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
  instagram: "https://www.instagram.com/gamedoctor2004?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
};

export const useContacto = () => {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["contacto"],
    queryFn: db.fetchContacto,
  });

  const contacto = data ?? SEED_CONTACTO;

  const setContacto = async (val: ContactoInfo | ((prev: ContactoInfo) => ContactoInfo)) => {
    const next = typeof val === "function" ? val(contacto) : val;
    await db.upsertContacto(next);
    qc.invalidateQueries({ queryKey: ["contacto"] });
  };

  return [contacto, setContacto] as const;
};

// ── USUARIOS (via Supabase Auth + profiles) ────────────────────────────
// Importado desde auth.ts para mantener la lógica de usuarios centralizada
export const useUsuarios = () => {
  // Implementado en auth.ts / Usuarios.tsx con supabase.auth
  // Este hook es un placeholder para compatibilidad de tipos
  return [[], () => {}] as [Usuario[], (v: any) => void];
};
