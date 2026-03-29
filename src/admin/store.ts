import { useState, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────
export interface ConsolaVenta {
  id: string;
  name: string;
  badge: "Disponible" | "Agotado";
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
  plataformas: string[]; // IDs de plataformas
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
}

// ── Seed data (first load) ─────────────────────────────────────────
const SEED_CONSOLAS_VENTA: ConsolaVenta[] = [
  { id: "1", name: "PlayStation 5 Slim", badge: "Disponible", image: "https://placehold.co/600x400/1e293b/FFFFFF?text=PlayStation+5+Slim" },
  { id: "2", name: "PlayStation 5 Digital", badge: "Agotado", image: "https://placehold.co/600x400/1e293b/FFFFFF?text=PlayStation+5+Digital" },
  { id: "3", name: "Xbox Series X", badge: "Disponible", image: "https://placehold.co/600x400/10b981/FFFFFF?text=Xbox+Series+X" },
  { id: "4", name: "Xbox Series S", badge: "Disponible", image: "https://placehold.co/600x400/10b981/FFFFFF?text=Xbox+Series+S" },
  { id: "5", name: "Nintendo Switch OLED", badge: "Disponible", image: "https://placehold.co/600x400/ef4444/FFFFFF?text=Nintendo+Switch+OLED" },
  { id: "6", name: "Nintendo Switch Lite", badge: "Disponible", image: "https://placehold.co/600x400/ef4444/FFFFFF?text=Nintendo+Switch+Lite" },
];

const SEED_CONSOLAS_COMPRA: ConsolaCompra[] = [
  { id: "1", name: "PlayStation 4 Slim", precio: "$4.000" },
  { id: "2", name: "PlayStation 4 Pro", precio: "$5.500" },
  { id: "3", name: "PlayStation 5", precio: "$12.000" },
  { id: "4", name: "Xbox One S", precio: "$3.500" },
  { id: "5", name: "Xbox One X", precio: "$4.500" },
  { id: "6", name: "Xbox Series S", precio: "$6.000" },
  { id: "7", name: "Xbox Series X", precio: "$10.000" },
  { id: "8", name: "Nintendo Switch", precio: "$4.000" },
  { id: "9", name: "Nintendo Switch OLED", precio: "$6.000" },
];

const SEED_REPARACION: ReparacionModelo[] = [
  { id: "1", modelo: "PlayStation 4 / Slim / Pro" },
  { id: "2", modelo: "PlayStation 5 / Slim / Digital" },
  { id: "3", modelo: "Xbox One S / X" },
  { id: "4", modelo: "Xbox Series S / X" },
  { id: "5", modelo: "Nintendo Switch / OLED / Lite" },
];

const SEED_DESTRABA: DestrabaModelo[] = [
  { id: "1", modelo: "PlayStation 4 (todas las versiones)", precio: "$2.500" },
  { id: "2", modelo: "Nintendo Switch / OLED", precio: "$3.000" },
  { id: "3", modelo: "Xbox 360", precio: "$1.500" },
];

const SEED_PLATAFORMAS: Plataforma[] = [
  { id: "ps4", name: "PS4" },
  { id: "ps5", name: "PS5" },
  { id: "xbox", name: "Xbox" },
  { id: "pc", name: "PC" },
  { id: "switch", name: "Nintendo Switch" },
];

const SEED_JUEGOS: Juego[] = [
  { id: "1", name: "EA FC 25", plataformas: ["ps4", "ps5"], image: "https://placehold.co/300x400/1e293b/FFFFFF?text=EA+FC+25", precio: "Consultar" },
  { id: "2", name: "GTA V Online", plataformas: ["ps4", "ps5", "xbox"], image: "https://placehold.co/300x400/1e293b/FFFFFF?text=GTA+V+Online", precio: "Consultar" },
  { id: "3", name: "Call of Duty: MW III", plataformas: ["ps4", "ps5", "xbox"], image: "https://placehold.co/300x400/1e293b/FFFFFF?text=Call+of+Duty+MW+III", precio: "Consultar" },
  { id: "4", name: "Spider-Man 2", plataformas: ["ps5"], image: "https://placehold.co/300x400/1e293b/FFFFFF?text=Spider-Man+2", precio: "Consultar" },
  { id: "5", name: "Hogwarts Legacy", plataformas: ["ps4", "ps5", "xbox"], image: "https://placehold.co/300x400/1e293b/FFFFFF?text=Hogwarts+Legacy", precio: "Consultar" },
  { id: "6", name: "Minecraft", plataformas: ["ps4", "ps5", "xbox", "switch", "pc"], image: "https://placehold.co/300x400/1e293b/FFFFFF?text=Minecraft", precio: "Consultar" },
  { id: "7", name: "Fortnite V-Bucks", plataformas: ["ps4", "ps5", "xbox", "switch", "pc"], image: "https://placehold.co/300x400/1e293b/FFFFFF?text=Fortnite", precio: "Consultar" },
  { id: "8", name: "NBA 2K25", plataformas: ["ps4", "ps5", "xbox"], image: "https://placehold.co/300x400/1e293b/FFFFFF?text=NBA+2K25", precio: "Consultar" },
];

const SEED_GAMEPASS: GamePassPlan[] = [
  { id: "1", plan: "Game Pass Core (1 mes)", precio: "$350" },
  { id: "2", plan: "Game Pass Core (3 meses)", precio: "$900" },
  { id: "3", plan: "Game Pass Core (12 meses)", precio: "$2.500" },
  { id: "4", plan: "Game Pass Ultimate (1 mes)", precio: "$600" },
  { id: "5", plan: "Game Pass Ultimate (3 meses)", precio: "$1.600" },
];

function sanitizeMapaUrl(url: string): string {
  if (!url) return "";
  if (url.includes("<iframe") && url.includes("src=\"")) {
    const match = url.match(/src="([^"]+)"/);
    if (match && match[1]) return match[1];
  }
  return url.trim();
}

const SEED_CONTACTO: ContactoInfo = {
  direccion: "Juan José Castro 2381, Montevideo, Uruguay",
  telefono: "096 593 154",
  horario: "Lunes a Sábado — Consultá disponibilidad",
  whatsapp: "https://wa.me/59896593154?text=Hola%20Game%20Doctor!%20Quiero%20consultar%20sobre...",
  mapaEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3273.2247270613843!2d-56.13018048791508!3d-34.875702772744795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f81af46cb7f33%3A0xfa038957580c9695!2sTienda%20de%20Juegos%20-%20GAME%20DOCTOR!5e0!3m2!1ses!2suy!4v1774756722738!5m2!1ses!2suy",
};

// ── Generic localStorage hook ──────────────────────────────────────
function useLocalStorage<T>(key: string, seed: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [data, setData] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return seed;
      let parsed = JSON.parse(raw) as T;

      // Migration for Juegos: from plataforma (string) to plataformas (string[])
      if (key === "gd_juegos" && Array.isArray(parsed)) {
        parsed = (parsed as any[]).map(j => {
          if (typeof j.plataforma === 'string' && !j.plataformas) {
            const str = j.plataforma.toLowerCase();
            const ids: string[] = [];
            if (str.includes("ps4")) ids.push("ps4");
            if (str.includes("ps5")) ids.push("ps5");
            if (str.includes("xbox")) ids.push("xbox");
            if (str.includes("pc")) ids.push("pc");
            if (str.includes("switch")) ids.push("switch");
            if (str.includes("todas")) ids.push("ps4", "ps5", "xbox", "pc", "switch");
            return {
              id: j.id,
              name: j.name,
              plataformas: ids.length > 0 ? ids : ["ps4", "ps5"],
              image: j.image,
              precio: j.precio
            };
          }
          return j;
        }) as any;
      }
      return parsed;
    } catch {
      return seed;
    }
  });

  // Migration for the new map URL
  useEffect(() => {
    if (key === "gd_contacto") {
      const current = localStorage.getItem(key);
      if (current) {
        const parsed = JSON.parse(current) as ContactoInfo;
        // Check if it's using the old placeholder
        if (parsed.mapaEmbed.includes("56.17!3d-34.87")) {
          const updated = { ...parsed, mapaEmbed: (seed as ContactoInfo).mapaEmbed };
          localStorage.setItem(key, JSON.stringify(updated));
          setData(updated as T);
        }
      }
    }
  }, [key, seed]);

  const setValue = useCallback((val: T | ((prev: T) => T)) => {
    setData((prev) => {
      const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);

  // Initialize seed if key doesn't exist
  useEffect(() => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(seed));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [data, setValue];
}

// ── Store hooks ────────────────────────────────────────────────────
export const useConsolasVenta = () => useLocalStorage<ConsolaVenta[]>("gd_consolas_venta", SEED_CONSOLAS_VENTA);
export const useConsolasCompra = () => useLocalStorage<ConsolaCompra[]>("gd_consolas_compra", SEED_CONSOLAS_COMPRA);
export const useReparacion = () => useLocalStorage<ReparacionModelo[]>("gd_reparacion", SEED_REPARACION);
export const useDestraba = () => useLocalStorage<DestrabaModelo[]>("gd_destraba", SEED_DESTRABA);
export const useJuegos = () => useLocalStorage<Juego[]>("gd_juegos", SEED_JUEGOS);
export const usePlataformas = () => useLocalStorage<Plataforma[]>("gd_plataformas", SEED_PLATAFORMAS);
export const useGamePass = () => useLocalStorage<GamePassPlan[]>("gd_gamepass", SEED_GAMEPASS);

export const useContacto = (): [ContactoInfo, (val: ContactoInfo | ((prev: ContactoInfo) => ContactoInfo)) => void] => {
  const [data, setData] = useLocalStorage<ContactoInfo>("gd_contacto", SEED_CONTACTO);

  const sanitizedData = {
    ...data,
    mapaEmbed: sanitizeMapaUrl(data.mapaEmbed)
  };

  return [sanitizedData, setData];
};

// ── ID generator ───────────────────────────────────────────────────
export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
