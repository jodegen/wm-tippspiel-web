import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import type { ProfileTip } from "@/lib/api/types";
import { EmptyState } from "@/components/feedback/EmptyState";
import { formatKickoff } from "@/lib/datetime";
import { stageLabel } from "@/lib/filters";
import { cn } from "@/lib/utils";

function resultText(tip: ProfileTip): string {
  if (tip.resultHome == null || tip.resultAway == null) return "–:–";
  return `${tip.resultHome}:${tip.resultAway}`;
}

/** Farbe der Punkte-Pill nach erreichter Stufe (4/3/2/0). */
function pointsPillClass(points: number): string {
  if (points >= 4) return "bg-success/15 text-success";
  if (points === 3) return "bg-primary/10 text-primary";
  if (points === 2) return "bg-warning/15 text-warning";
  return "bg-muted text-muted-foreground";
}

function PointsPill({ points }: { points: number }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-12 items-center justify-center rounded-md px-2 py-1 text-xs font-semibold tabular-nums",
        pointsPillClass(points),
      )}
    >
      {points} P
    </span>
  );
}

/** Datum/Stage-Kontextzeile (unterscheidet Wiederholungsbegegnungen). */
function metaLine(tip: ProfileTip): string {
  return [
    tip.kickoffUtc ? formatKickoff(tip.kickoffUtc) : null,
    tip.stage ? stageLabel(tip.stage) : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function TipRow({ tip }: { tip: ProfileTip }) {
  const meta = metaLine(tip);
  const inner: ReactNode = (
    <>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 font-medium">
          <span className="truncate">{tip.home}</span>
          <span className="text-muted-foreground">–</span>
          <span className="truncate">{tip.away}</span>
        </div>
        {meta ? (
          <div className="mt-0.5 text-xs text-muted-foreground">{meta}</div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-4 text-sm tabular-nums">
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Tipp
          </div>
          <div>{tip.tipHome}:{tip.tipAway}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Ergebnis
          </div>
          <div>{resultText(tip)}</div>
        </div>
        <PointsPill points={tip.points} />
        {tip.matchId != null ? (
          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
        ) : null}
      </div>
    </>
  );

  if (tip.matchId != null) {
    return (
      <Link
        href={`/spiel/${tip.matchId}`}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:bg-muted/50"
      >
        {inner}
      </Link>
    );
  }
  return <div className="flex items-center gap-3 px-4 py-3">{inner}</div>;
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
            <TipRow key={tip.matchId ?? `${tip.home}-${tip.away}-${index}`} tip={tip} />
          ))}
        </div>
      )}
    </div>
  );
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
  const meta = metaLine(tip);
  return (
    <div className={cn("rounded-lg border border-l-2 bg-card p-4 shadow-sm", accent)}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <PointsPill points={tip.points} />
      </div>
      <div className="font-medium">
        {tip.home} <span className="text-muted-foreground">–</span> {tip.away}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm tabular-nums text-muted-foreground">
        <span>Tipp {tip.tipHome}:{tip.tipAway}</span>
        <span>Ergebnis {resultText(tip)}</span>
      </div>
      {meta ? <div className="mt-1 text-xs text-muted-foreground">{meta}</div> : null}
    </div>
  );
}
