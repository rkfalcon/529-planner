import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(n: number): string {
  return "$" + Math.round(n).toLocaleString();
}

export function formatPct(n: number): string {
  return n.toFixed(1) + "%";
}
