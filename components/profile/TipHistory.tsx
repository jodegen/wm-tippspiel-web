import type { ProfileTip } from "@/lib/api/types";
import { EmptyState } from "@/components/feedback/EmptyState";

function resultText(tip: ProfileTip): string {
  if (tip.resultHome == null || tip.resultAway == null) return "–:–";
  return `${tip.resultHome}:${tip.resultAway}`;
}

function TipRow({ tip }: { tip: ProfileTip }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-2 text-sm">
      <span className="truncate text-slate-800">
        {tip.home} – {tip.away}
      </span>
      <span className="flex items-center gap-4 tabular-nums">
        <span className="text-slate-500">
          Tipp {tip.tipHome}:{tip.tipAway}
        </span>
        <span className="text-slate-500">Ergebnis {resultText(tip)}</span>
        <span className="w-10 text-right font-semibold text-slate-900">
          {tip.points} P
        </span>
      </span>
    </div>
  );
}

function HighlightCard({ title, tip, accent }: { title: string; tip: ProfileTip; accent: string }) {
  return (
    <div className={`rounded-lg border p-3 ${accent}`}>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <div className="text-sm text-slate-800">
        {tip.home} – {tip.away}
      </div>
      <div className="mt-1 flex items-center gap-3 text-sm tabular-nums text-slate-600">
        <span>Tipp {tip.tipHome}:{tip.tipAway}</span>
        <span>Ergebnis {resultText(tip)}</span>
        <span className="font-semibold text-slate-900">{tip.points} P</span>
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
            <HighlightCard
              title="Bester Tipp"
              tip={bestTip}
              accent="border-status-finished bg-green-50"
            />
          ) : null}
          {worstTip ? (
            <HighlightCard
              title="Schlechtester Tipp"
              tip={worstTip}
              accent="border-status-live bg-red-50"
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
        <div className="divide-y divide-surface-border rounded-lg border border-surface-border">
          {history.map((tip, index) => (
            <TipRow key={`${tip.home}-${tip.away}-${index}`} tip={tip} />
          ))}
        </div>
      )}
    </div>
  );
}
