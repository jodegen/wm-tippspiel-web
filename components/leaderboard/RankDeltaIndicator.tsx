import { ArrowDown, ArrowUp, Minus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Zeigt die vom Backend gelieferte Rang-Veränderung ("NEU" / "↑n" / "↓n" / "–").
 * Bezug: vorheriger Spieltag.
 */
export function RankDeltaIndicator({ rankChange }: { rankChange: string }) {
  const trimmed = rankChange.trim();
  const magnitude = trimmed.replace(/[^0-9]/g, "");

  if (trimmed.startsWith("↑")) {
    return (
      <span className={cn("inline-flex items-center gap-0.5 tabular-nums text-success")}>
        <ArrowUp className="h-3.5 w-3.5" aria-hidden />
        {magnitude}
        <span className="sr-only">Plätze aufgestiegen</span>
      </span>
    );
  }
  if (trimmed.startsWith("↓")) {
    return (
      <span className="inline-flex items-center gap-0.5 tabular-nums text-destructive">
        <ArrowDown className="h-3.5 w-3.5" aria-hidden />
        {magnitude}
        <span className="sr-only">Plätze abgestiegen</span>
      </span>
    );
  }
  if (trimmed.toUpperCase() === "NEU") {
    return (
      <span className="inline-flex items-center gap-1 text-primary">
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        Neu
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-muted-foreground" title="unverändert">
      <Minus className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">unverändert</span>
    </span>
  );
}
