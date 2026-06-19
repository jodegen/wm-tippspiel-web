import Link from "next/link";
import type { MatchSummary } from "@/lib/api/types";
import { formatKickoff } from "@/lib/datetime";
import { stageLabel } from "@/lib/filters";
import { MatchStatusBadge } from "@/components/match/MatchStatusBadge";
import { ScoreDisplay } from "@/components/match/ScoreDisplay";
import { TeamLabel } from "@/components/match/TeamLabel";

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
  return `Quote ${fmt(match.oddsHome)} / ${fmt(match.oddsDraw)} / ${fmt(match.oddsAway)}`;
}

/** Karte für ein einzelnes Spiel; verlinkt auf die Detailseite. */
export function MatchCard({ match }: { match: MatchSummary }) {
  const phase = phaseText(match);
  const odds = oddsText(match);

  return (
    <Link
      href={`/spiel/${encodeURIComponent(String(match.matchId))}`}
      className="block rounded-lg border border-surface-border bg-surface p-4 transition hover:border-brand-muted hover:shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">
          {[phase, match.matchday != null ? `Spieltag ${match.matchday}` : null]
            .filter(Boolean)
            .join(" · ") || " "}
        </span>
        <MatchStatusBadge status={match.status} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamLabel name={match.home} />
        <ScoreDisplay homeScore={match.homeScore} awayScore={match.awayScore} />
        <TeamLabel name={match.away} align="right" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
        <span>{formatKickoff(match.kickoffUtc)} Uhr</span>
        {match.tvChannel ? <span>📺 {match.tvChannel}</span> : null}
        {odds ? <span>{odds}</span> : null}
      </div>
    </Link>
  );
}
