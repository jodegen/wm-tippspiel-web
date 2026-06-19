import Link from "next/link";
import type { TipEntry } from "@/lib/api/types";
import { EmptyState } from "@/components/feedback/EmptyState";

interface TipHistoryProps {
  history: TipEntry[];
  bestTip?: TipEntry;
  worstTip?: TipEntry;
}

function highlightClass(
  tip: TipEntry,
  best?: TipEntry,
  worst?: TipEntry,
): string {
  if (best && tip.matchId === best.matchId) return "border-status-finished bg-green-50";
  if (worst && tip.matchId === worst.matchId) return "border-status-live bg-red-50";
  return "border-surface-border bg-surface";
}

/** Tipp-Historie mit Hervorhebung des besten/schlechtesten Tipps. */
export function TipHistory({ history, bestTip, worstTip }: TipHistoryProps) {
  if (history.length === 0) {
    return (
      <EmptyState
        title="Noch keine Tipps"
        message="Für diesen Teilnehmer liegen noch keine sichtbaren Tipps vor."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {history.map((tip) => (
        <li
          key={tip.matchId}
          className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${highlightClass(tip, bestTip, worstTip)}`}
        >
          <Link
            href={`/spiel/${encodeURIComponent(tip.matchId)}`}
            className="text-sm font-medium text-brand hover:underline"
          >
            Spiel {tip.matchId}
          </Link>
          <span className="tabular-nums text-slate-700">
            Tipp {tip.predictedHome}:{tip.predictedAway}
          </span>
          <span className="flex items-center gap-2 text-sm">
            {tip.tier ? (
              <span className="text-xs text-slate-500">{tip.tier}</span>
            ) : null}
            {tip.pointsAwarded !== undefined ? (
              <span className="font-semibold tabular-nums text-slate-900">
                {tip.pointsAwarded} P
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
