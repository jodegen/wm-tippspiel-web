import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSchedule, getMatchTips } from "@/lib/api/matches";
import { ApiError } from "@/lib/api/client";
import { formatKickoff } from "@/lib/datetime";
import { phaseLabel } from "@/lib/filters";
import { Container } from "@/components/layout/Container";
import { MatchStatusBadge } from "@/components/match/MatchStatusBadge";
import { ScoreDisplay } from "@/components/match/ScoreDisplay";
import { TeamLabel } from "@/components/match/TeamLabel";
import { MatchTips } from "@/components/match/MatchTips";
import { ErrorState } from "@/components/feedback/ErrorState";
import type { Match, MatchTips as MatchTipsDto } from "@/lib/api/types";

export const metadata: Metadata = { title: "Spieldetails" };

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matchId = Number(id);
  if (!Number.isInteger(matchId)) notFound();

  // Es gibt keinen Match-Detail-Endpoint: Spiel aus dem Spielplan beziehen,
  // Tipps über den separaten Tips-Endpoint (regelt Sichtbarkeit via released).
  let match: Match | undefined;
  let tips: MatchTipsDto;
  try {
    const [schedule, tipsData] = await Promise.all([
      getSchedule(),
      getMatchTips(matchId),
    ]);
    match = schedule.find((m) => m.matchId === matchId);
    tips = tipsData;
  } catch (error) {
    if (error instanceof ApiError && error.kind === "not-found") {
      notFound();
    }
    return (
      <Container>
        <ErrorState />
      </Container>
    );
  }

  if (!match) notFound();

  return (
    <Container>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-500">
          {phaseLabel(match)}
          {match.matchday != null ? ` · Spieltag ${match.matchday}` : ""}
        </span>
        <MatchStatusBadge status={match.status} />
      </div>

      <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-lg border border-surface-border bg-surface p-6">
        <TeamLabel name={match.home} />
        <div className="text-2xl">
          <ScoreDisplay homeScore={match.homeScore} awayScore={match.awayScore} />
        </div>
        <TeamLabel name={match.away} align="right" />
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
        <span>{formatKickoff(match.kickoffUtc)} Uhr</span>
        {match.tvChannel ? <span>📺 {match.tvChannel}</span> : null}
      </div>

      <section aria-labelledby="tips-heading">
        <h2 id="tips-heading" className="mb-3 text-lg font-semibold text-slate-900">
          Abgegebene Tipps
        </h2>
        <MatchTips data={tips} />
      </section>
    </Container>
  );
}
