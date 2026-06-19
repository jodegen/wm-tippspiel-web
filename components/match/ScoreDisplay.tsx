import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  homeScore?: number | null;
  awayScore?: number | null;
  className?: string;
}

/** Zeigt das Ergebnis bzw. "–:–", solange kein Stand vorliegt. */
export function ScoreDisplay({ homeScore, awayScore, className }: ScoreDisplayProps) {
  const hasScore =
    homeScore !== null &&
    homeScore !== undefined &&
    awayScore !== null &&
    awayScore !== undefined;

  if (!hasScore) {
    return (
      <span
        className={cn("font-semibold tabular-nums text-muted-foreground", className)}
        aria-label="noch kein Ergebnis"
      >
        –&nbsp;:&nbsp;–
      </span>
    );
  }

  return (
    <span className={cn("font-semibold tabular-nums", className)}>
      {homeScore}&nbsp;:&nbsp;{awayScore}
    </span>
  );
}
