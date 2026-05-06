import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://unlimited.systems";

export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "34600000000";

export function waLink(message = "Hola UNLIMITED") {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
