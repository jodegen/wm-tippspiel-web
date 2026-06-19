import Link from "next/link";
import { Tv } from "lucide-react";
import type { MatchSummary } from "@/lib/api/types";
import { formatKickoff, isToday } from "@/lib/datetime";
import { stageLabel } from "@/lib/filters";
import { MatchStatusBadge } from "@/components/match/MatchStatusBadge";
import { ScoreDisplay } from "@/components/match/ScoreDisplay";
import { TeamColumn } from "@/components/match/TeamColumn";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function phaseText(match: MatchSummary): string | null {
  if (match.group) return `Gruppe ${match.group}`;
  if (match.stage) return stageLabel(match.stage);
  return null;
}

function oddsText(match: MatchSummary): string | null {
  if (match.oddsHome == null && match.oddsDraw == null && match.oddsAway == null) {
    return null;
  }
  const fmt = (v: number | null | undefined) => (v == null ? "–" : v);
  return `${fmt(match.oddsHome)} · ${fmt(match.oddsDraw)} · ${fmt(match.oddsAway)}`;
}

/** Karte für ein einzelnes Spiel; verlinkt auf die Detailseite. */
export function MatchCard({
  match,
  animate = false,
}: {
  match: MatchSummary;
  animate?: boolean;
}) {
  const phase = phaseText(match);
  const odds = oddsText(match);
  const today = isToday(match.kickoffUtc);
  const meta = [phase, match.matchday != null ? `Spieltag ${match.matchday}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/spiel/${encodeURIComponent(String(match.matchId))}`}
      className={cn(
        "group block rounded-lg border bg-card p-4 shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "animate-in fade-in slide-in-from-bottom-1",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-muted-foreground">
          {meta || " "}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          {today && match.status === "SCHEDULED" ? (
            <Badge variant="primary">Heute</Badge>
          ) : null}
          <MatchStatusBadge status={match.status} />
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <TeamColumn name={match.home} />
        <ScoreDisplay
          homeScore={match.homeScore}
          awayScore={match.awayScore}
          animate={animate}
          className="text-xl"
        />
        <TeamColumn name={match.away} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-xs text-muted-foreground">
        <span>{formatKickoff(match.kickoffUtc)} Uhr</span>
        {match.tvChannel ? (
          <span className="inline-flex items-center gap-1">
            <Tv className="h-3.5 w-3.5" aria-hidden />
            {match.tvChannel}
          </span>
        ) : null}
        {odds ? <span className="ml-auto tabular-nums">Quote {odds}</span> : null}
      </div>
    </Link>
  );
}
