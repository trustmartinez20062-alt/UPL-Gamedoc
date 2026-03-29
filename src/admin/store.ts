import { useState, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────
export interface ConsolaVenta {
  id: string;
  name: string;
  badge: "Disponible" | "Agotado";
  emoji: string;
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
  plataforma: string;
  emoji: string;
  precio: string;
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
}

// ── Seed data (first load) ─────────────────────────────────────────
const SEED_CONSOLAS_VENTA: ConsolaVenta[] = [
  { id: "1", name: "PlayStation 5 Slim", badge: "Disponible", emoji: "🎮" },
  { id: "2", name: "PlayStation 5 Digital", badge: "Disponible", emoji: "🎮" },
  { id: "3", name: "Xbox Series X", badge: "Disponible", emoji: "🕹️" },
  { id: "4", name: "Xbox Series S", badge: "Disponible", emoji: "🕹️" },
  { id: "5", name: "Nintendo Switch OLED", badge: "Disponible", emoji: "🎯" },
  { id: "6", name: "Nintendo Switch Lite", badge: "Disponible", emoji: "🎯" },
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

const SEED_JUEGOS: Juego[] = [
  { id: "1", name: "EA FC 25", plataforma: "PS4 / PS5", emoji: "⚽", precio: "Consultar" },
  { id: "2", name: "GTA V Online", plataforma: "PS4 / PS5 / Xbox", emoji: "🚗", precio: "Consultar" },
  { id: "3", name: "Call of Duty: MW III", plataforma: "PS4 / PS5 / Xbox", emoji: "🔫", precio: "Consultar" },
  { id: "4", name: "Spider-Man 2", plataforma: "PS5", emoji: "🕷️", precio: "Consultar" },
  { id: "5", name: "Hogwarts Legacy", plataforma: "PS4 / PS5 / Xbox", emoji: "🧙", precio: "Consultar" },
  { id: "6", name: "Minecraft", plataforma: "Todas las plataformas", emoji: "⛏️", precio: "Consultar" },
  { id: "7", name: "Fortnite V-Bucks", plataforma: "Todas las plataformas", emoji: "🎯", precio: "Consultar" },
  { id: "8", name: "NBA 2K25", plataforma: "PS4 / PS5 / Xbox", emoji: "🏀", precio: "Consultar" },
];

const SEED_GAMEPASS: GamePassPlan[] = [
  { id: "1", plan: "Game Pass Core (1 mes)", precio: "$350" },
  { id: "2", plan: "Game Pass Core (3 meses)", precio: "$900" },
  { id: "3", plan: "Game Pass Core (12 meses)", precio: "$2.500" },
  { id: "4", plan: "Game Pass Ultimate (1 mes)", precio: "$600" },
  { id: "5", plan: "Game Pass Ultimate (3 meses)", precio: "$1.600" },
];

const SEED_CONTACTO: ContactoInfo = {
  direccion: "Juan José Castro 2381, Montevideo, Uruguay",
  telefono: "096 593 154",
  horario: "Lunes a Sábado — Consultá disponibilidad",
  whatsapp: "https://wa.me/59896593154?text=Hola%20Game%20Doctor!%20Quiero%20consultar%20sobre...",
};

// ── Generic localStorage hook ──────────────────────────────────────
function useLocalStorage<T>(key: string, seed: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [data, setData] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : seed;
    } catch {
      return seed;
    }
  });

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
export const useGamePass = () => useLocalStorage<GamePassPlan[]>("gd_gamepass", SEED_GAMEPASS);
export const useContacto = () => useLocalStorage<ContactoInfo>("gd_contacto", SEED_CONTACTO);

// ── ID generator ───────────────────────────────────────────────────
export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
