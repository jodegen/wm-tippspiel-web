import { AnimatedNumber } from "@/components/ui/animated-number";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  homeScore?: number | null;
  awayScore?: number | null;
  /** Score-Änderungen weich hochzählen (für /live). */
  animate?: boolean;
  /** Beim Laden von 0 auf den Endstand hochzählen. */
  countUp?: boolean;
  /** Dauer der Count-up-Animation (ms). */
  durationMs?: number;
  /** Verzögerung vor dem Count-up (ms). */
  delayMs?: number;
  className?: string;
}

/** Zeigt das Ergebnis bzw. "–:–", solange kein Stand vorliegt. */
export function ScoreDisplay({
  homeScore,
  awayScore,
  animate = false,
  countUp = false,
  durationMs,
  delayMs,
  className,
}: ScoreDisplayProps) {
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

  const useAnim = animate || countUp;
  const startFrom = countUp ? 0 : undefined;

  return (
    <span className={cn("font-semibold tabular-nums", className)}>
      {useAnim ? (
        <AnimatedNumber
          value={homeScore}
          startFrom={startFrom}
          durationMs={durationMs}
          delayMs={delayMs}
        />
      ) : (
        homeScore
      )}
      &nbsp;:&nbsp;
      {useAnim ? (
        <AnimatedNumber
          value={awayScore}
          startFrom={startFrom}
          durationMs={durationMs}
          delayMs={delayMs}
        />
      ) : (
        awayScore
      )}
    </span>
  );
}
