import { Tv } from "lucide-react";
import type { Match } from "@/lib/api/types";
import { formatKickoff, isToday } from "@/lib/datetime";
import { phaseLabel } from "@/lib/filters";
import { flagEmoji } from "@/lib/flags";
import { MatchStatusBadge } from "@/components/match/MatchStatusBadge";
import { ScoreDisplay } from "@/components/match/ScoreDisplay";
import { Badge } from "@/components/ui/badge";

function oddsText(match: Match): string | null {
  if (match.oddsHome == null && match.oddsDraw == null && match.oddsAway == null) {
    return null;
  }
  const fmt = (v: number | null | undefined) => (v == null ? "–" : v);
  return `${fmt(match.oddsHome)} · ${fmt(match.oddsDraw)} · ${fmt(match.oddsAway)}`;
}

function Side({ name }: { name: string }) {
  const flag = flagEmoji(name);
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <span className="text-4xl leading-none sm:text-5xl" aria-hidden>
        {flag ?? "🏳️"}
      </span>
      <span className="max-w-full truncate text-sm font-semibold sm:text-base">
        {name}
      </span>
    </div>
  );
}

/** Ausbalancierte Kopf-Card der Spieldetailseite (Flaggen, Score, Meta). */
export function MatchHero({ match }: { match: Match }) {
  const odds = oddsText(match);
  const today = isToday(match.kickoffUtc);

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between gap-2 border-b bg-muted/30 px-5 py-3">
        <span className="truncate text-sm font-medium text-muted-foreground">
          {phaseLabel(match)}
          {match.matchday != null ? ` · Spieltag ${match.matchday}` : ""}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          {today && match.status === "SCHEDULED" ? (
            <Badge variant="primary">Heute</Badge>
          ) : null}
          <MatchStatusBadge status={match.status} />
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-8 sm:gap-8">
        <Side name={match.home} />
        <div className="animate-in zoom-in-95 duration-500">
          <ScoreDisplay
            homeScore={match.homeScore}
            awayScore={match.awayScore}
            className="text-3xl sm:text-4xl"
          />
        </div>
        <Side name={match.away} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 border-t px-5 py-3 text-xs text-muted-foreground">
        <span>{formatKickoff(match.kickoffUtc)} Uhr</span>
        {match.tvChannel ? (
          <span className="inline-flex items-center gap-1">
            <Tv className="h-3.5 w-3.5" aria-hidden />
            {match.tvChannel}
          </span>
        ) : null}
        {odds ? <span className="tabular-nums">Quote {odds}</span> : null}
      </div>
    </div>
  );
}
