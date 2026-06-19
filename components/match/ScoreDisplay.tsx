import type { Match } from "@/lib/api/types";

/** Zeigt das Ergebnis bzw. "–:–" bei noch ausstehendem Spiel. */
export function ScoreDisplay({ match }: { match: Match }) {
  const { result, status } = match;

  if (!result) {
    return (
      <span className="tabular-nums text-slate-400" aria-label="noch kein Ergebnis">
        –&nbsp;:&nbsp;–
      </span>
    );
  }

  return (
    <span className="font-semibold tabular-nums text-slate-900">
      {result.homeGoals}&nbsp;:&nbsp;{result.awayGoals}
      {status === "live" && result.minute !== undefined ? (
        <span className="ml-2 text-xs font-medium text-status-live">
          {result.minute}&prime;
        </span>
      ) : null}
    </span>
  );
}
