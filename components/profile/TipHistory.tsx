import type { ProfileTip } from "@/lib/api/types";
import { EmptyState } from "@/components/feedback/EmptyState";
import { cn } from "@/lib/utils";

function resultText(tip: ProfileTip): string {
  if (tip.resultHome == null || tip.resultAway == null) return "–:–";
  return `${tip.resultHome}:${tip.resultAway}`;
}

function HighlightCard({
  title,
  tip,
  accent,
}: {
  title: string;
  tip: ProfileTip;
  accent: string;
}) {
  return (
    <div className={cn("rounded-lg border-l-2 bg-card p-4 shadow-sm", accent)}>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <div className="font-medium">
        {tip.home} – {tip.away}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm tabular-nums text-muted-foreground">
        <span>Tipp {tip.tipHome}:{tip.tipAway}</span>
        <span>Ergebnis {resultText(tip)}</span>
        <span className="font-semibold text-foreground">{tip.points} P</span>
      </div>
    </div>
  );
}

interface TipHistoryProps {
  history: ProfileTip[];
  bestTip?: ProfileTip | null;
  worstTip?: ProfileTip | null;
}

/** Beste/schlechteste Tipps (hervorgehoben) plus vollständige Historie. */
export function TipHistory({ history, bestTip, worstTip }: TipHistoryProps) {
  return (
    <div className="flex flex-col gap-4">
      {bestTip || worstTip ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {bestTip ? (
            <HighlightCard title="Bester Tipp" tip={bestTip} accent="border-l-success" />
          ) : null}
          {worstTip ? (
            <HighlightCard
              title="Schlechtester Tipp"
              tip={worstTip}
              accent="border-l-destructive"
            />
          ) : null}
        </div>
      ) : null}

      {history.length === 0 ? (
        <EmptyState
          title="Noch keine gewerteten Tipps"
          message="Sobald Tipps gewertet wurden, erscheinen sie hier."
        />
      ) : (
        <div className="divide-y rounded-lg border bg-card">
          {history.map((tip, index) => (
            <div
              key={`${tip.home}-${tip.away}-${index}`}
              className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-2.5 text-sm"
            >
              <span className="truncate">
                {tip.home} <span className="text-muted-foreground">–</span> {tip.away}
              </span>
              <span className="flex items-center gap-3 tabular-nums text-muted-foreground sm:gap-4">
                <span className="hidden sm:inline">Tipp {tip.tipHome}:{tip.tipAway}</span>
                <span>{resultText(tip)}</span>
                <span className="min-w-10 rounded-md bg-secondary px-2 py-0.5 text-right text-xs font-semibold text-foreground">
                  {tip.points} P
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
