import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert "1000" into "$ 1.000" or "US$ 1.000"
export function formatPriceForDB(price: string, moneda: "UYU" | "USD" = "UYU"): string {
  if (!price.trim()) return "";
  const num = parseInt(price.replace(/\D/g, ""));
  if (isNaN(num)) return "";
  const symbol = moneda === "USD" ? "US$" : "$";
  // es-AR usa puntos para miles y coma para decimales
  return `${symbol} ${num.toLocaleString("es-AR")}`;
}

// Convert "$1.000" into "1000"
export function parsePriceForForm(price?: string): string {
  if (!price) return "";
  return price.replace(/\D/g, "");
}
