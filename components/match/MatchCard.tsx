import Link from "next/link";
import type { Match } from "@/lib/api/types";
import { formatKickoff } from "@/lib/datetime";
import { phaseLabel } from "@/lib/filters";
import { MatchStatusBadge } from "@/components/match/MatchStatusBadge";
import { ScoreDisplay } from "@/components/match/ScoreDisplay";
import { TeamLabel } from "@/components/match/TeamLabel";

/** Karte für ein einzelnes Spiel; verlinkt auf die Detailseite. */
export function MatchCard({ match }: { match: Match }) {
  return (
    <Link
      href={`/spiel/${encodeURIComponent(match.id)}`}
      className="block rounded-lg border border-surface-border bg-surface p-4 transition hover:border-brand-muted hover:shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">
          {phaseLabel(match.phase)} · Spieltag {match.matchday}
        </span>
        <MatchStatusBadge status={match.status} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamLabel team={match.homeTeam} />
        <ScoreDisplay match={match} />
        <TeamLabel team={match.awayTeam} align="right" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
        <span>{formatKickoff(match.kickoff)} Uhr</span>
        {match.tvChannel ? <span>📺 {match.tvChannel}</span> : null}
        {match.odds !== undefined ? <span>Quote {match.odds}</span> : null}
      </div>
    </Link>
  );
}
