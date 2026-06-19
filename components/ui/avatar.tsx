import { cn } from "@/lib/utils";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/** Deterministischer Farbton aus dem Namen (gleicher Name → gleiche Farbe). */
function hue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

/** Schlichtes Initialen-Avatar mit namensabhängiger Farbe (kein Bild). */
export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      style={{ backgroundColor: `hsl(${hue(name)} 55% 45%)` }}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-xs font-semibold text-white",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
