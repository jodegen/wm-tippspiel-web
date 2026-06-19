interface ScoreDisplayProps {
  homeScore?: number | null;
  awayScore?: number | null;
}

/** Zeigt das Ergebnis bzw. "–:–", solange kein Stand vorliegt. */
export function ScoreDisplay({ homeScore, awayScore }: ScoreDisplayProps) {
  const hasScore =
    homeScore !== null &&
    homeScore !== undefined &&
    awayScore !== null &&
    awayScore !== undefined;

  if (!hasScore) {
    return (
      <span className="tabular-nums text-slate-400" aria-label="noch kein Ergebnis">
        –&nbsp;:&nbsp;–
      </span>
    );
  }

  return (
    <span className="font-semibold tabular-nums text-slate-900">
      {homeScore}&nbsp;:&nbsp;{awayScore}
    </span>
  );
}
