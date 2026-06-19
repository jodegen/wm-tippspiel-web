import type { MatchTips as MatchTipsDto } from "@/lib/api/types";
import { EmptyState } from "@/components/feedback/EmptyState";

/**
 * Abgegebene Tipps eines Spiels.
 * Vor Anpfiff liefert das Backend `released=false` und eine leere Liste (FR-008) —
 * dann wird ein Hinweis statt einer Liste angezeigt.
 */
export function MatchTips({ data }: { data: MatchTipsDto }) {
  if (!data.released) {
    return (
      <EmptyState
        title="Tipps erst nach Anpfiff sichtbar"
        message="Die abgegebenen Tipps werden angezeigt, sobald das Spiel angepfiffen ist."
      />
    );
  }

  if (data.tips.length === 0) {
    return <EmptyState title="Keine Tipps vorhanden" />;
  }

  return (
    <ul className="divide-y divide-surface-border rounded-lg border border-surface-border">
      {data.tips.map((tip, index) => (
        <li
          key={`${tip.displayName}-${index}`}
          className="flex items-center justify-between gap-3 px-4 py-2 text-sm"
        >
          <span className="font-medium text-slate-800">{tip.displayName}</span>
          <span className="flex items-center gap-3">
            <span className="tabular-nums text-slate-700">
              {tip.tipHome} : {tip.tipAway}
            </span>
            {tip.points != null ? (
              <span className="font-semibold tabular-nums text-slate-900">
                {tip.points} P
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
