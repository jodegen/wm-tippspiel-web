import Link from "next/link";
import type { BracketMatch, BracketTeam } from "@/lib/api/types";
import { isDecided, isPlaceholder, teamDisplay, winningSide } from "@/lib/bracket";
import { flagEmoji } from "@/lib/flags";
import { formatKickoff } from "@/lib/datetime";
import { MatchStatusBadge } from "@/components/match/MatchStatusBadge";
import { cn } from "@/lib/utils";

function TeamRow({
  team,
  score,
  winner,
}: {
  team: BracketTeam;
  score?: number | null;
  winner: boolean;
}) {
  const placeholder = isPlaceholder(team);
  const flag = placeholder ? null : flagEmoji(team.teamName!);
  return (
    <div className={cn("flex items-center gap-2", winner && "font-bold")}>
      <span aria-hidden className="w-5 shrink-0 text-center text-base leading-none">
        {placeholder ? "" : (flag ?? "🏳️")}
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-xs",
          placeholder ? "italic text-muted-foreground" : "text-foreground",
        )}
      >
        {teamDisplay(team)}
      </span>
      <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
        {score ?? ""}
      </span>
    </div>
  );
}

/**
 * Eine K.o.-Spielkarte: beide Seiten (Team/Platzhalter), Ergebnis, Status,
 * optionale Anstoßzeit. Feststehende Paarungen verlinken auf /spiel/[id] (FR-017);
 * reine Platzhalter-Karten sind nicht klickbar. Gewinnerseite wird hervorgehoben.
 */
export function BracketMatchCard({ match }: { match: BracketMatch }) {
  const decided = isDecided(match);
  const win = winningSide(match);

  const inner = (
    <>
      <TeamRow team={match.home} score={match.homeScore} winner={win === "home"} />
      <div className="my-1 border-t border-dashed" />
      <TeamRow team={match.away} score={match.awayScore} winner={win === "away"} />
      <div className="mt-2 flex items-center justify-between gap-2">
        {match.kickoffUtc ? (
          <span className="truncate text-[10px] text-muted-foreground">
            {formatKickoff(match.kickoffUtc)}
          </span>
        ) : (
          <span />
        )}
        <MatchStatusBadge status={match.status} />
      </div>
    </>
  );

  const base = "block w-44 rounded-lg border bg-card p-2.5 shadow-sm";

  if (decided) {
    return (
      <Link
        href={`/spiel/${encodeURIComponent(String(match.matchId))}`}
        className={cn(
          base,
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        {inner}
      </Link>
    );
  }

  return <div className={cn(base, "cursor-default opacity-90")}>{inner}</div>;
}
