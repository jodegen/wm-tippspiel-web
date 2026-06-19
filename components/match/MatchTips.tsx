import { Lock } from "lucide-react";
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
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-card p-10 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Lock className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="font-medium">Tipps erst nach Anpfiff sichtbar</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Die abgegebenen Tipps erscheinen, sobald das Spiel angepfiffen ist.
          </p>
        </div>
      </div>
    );
  }

  if (data.tips.length === 0) {
    return <EmptyState title="Keine Tipps vorhanden" />;
  }

  return (
    <ul className="divide-y rounded-lg border bg-card">
      {data.tips.map((tip, index) => (
        <li
          key={`${tip.displayName}-${index}`}
          className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
        >
          <span className="truncate font-medium">{tip.displayName}</span>
          <span className="flex items-center gap-3">
            <span className="tabular-nums text-muted-foreground">
              {tip.tipHome} : {tip.tipAway}
            </span>
            {tip.points != null ? (
              <span className="min-w-10 rounded-md bg-secondary px-2 py-0.5 text-right text-xs font-semibold tabular-nums">
                {tip.points} P
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
