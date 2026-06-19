import type { MatchStatus, TipEntry } from "@/lib/api/types";
import { EmptyState } from "@/components/feedback/EmptyState";

interface MatchTipsProps {
  status: MatchStatus;
  tips?: TipEntry[];
}

/**
 * Abgegebene Tipps zu einem Spiel.
 * Vor Anpfiff (status = scheduled) liefert das Backend keine Tipps (FR-008) —
 * dann wird ein Hinweis statt einer Liste angezeigt.
 */
export function MatchTips({ status, tips }: MatchTipsProps) {
  if (status === "scheduled") {
    return (
      <EmptyState
        title="Tipps erst nach Anpfiff sichtbar"
        message="Die abgegebenen Tipps werden angezeigt, sobald das Spiel angepfiffen ist."
      />
    );
  }

  if (!tips || tips.length === 0) {
    return <EmptyState title="Keine Tipps vorhanden" />;
  }

  return (
    <ul className="divide-y divide-surface-border rounded-lg border border-surface-border">
      {tips.map((tip, index) => (
        <li
          key={`${tip.matchId}-${index}`}
          className="flex items-center justify-between gap-3 px-4 py-2 text-sm"
        >
          <span className="tabular-nums text-slate-700">
            {tip.predictedHome} : {tip.predictedAway}
          </span>
          <span className="flex items-center gap-3">
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
