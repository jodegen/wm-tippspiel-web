import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge bedingter Tailwind-Klassen (shadcn-Konvention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
