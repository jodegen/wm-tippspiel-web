import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getSchedule, getMatchTips } from "@/lib/api/matches";
import { getLeaderboard } from "@/lib/api/leaderboard";
import { ApiError } from "@/lib/api/client";
import { Container } from "@/components/layout/Container";
import { MatchHero } from "@/components/match/MatchHero";
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
  const playerIds: Record<string, string> = {};
  try {
    const [schedule, tipsData, leaderboard] = await Promise.all([
      getSchedule(),
      getMatchTips(matchId),
      // Rangliste nur für die Profil-Verlinkung der Tipps; Fehler darf die Seite nicht brechen.
      getLeaderboard().catch(() => []),
    ]);
    match = schedule.find((m) => m.matchId === matchId);
    tips = tipsData;
    for (const row of leaderboard) {
      if (row.publicId) playerIds[row.displayName] = row.publicId;
    }
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
      <Link
        href="/spielplan"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Zurück zum Spielplan
      </Link>

      <MatchHero match={match} />

      <section
        aria-labelledby="tips-heading"
        className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
        style={{ animationDelay: "120ms", animationFillMode: "both" }}
      >
        <h2 id="tips-heading" className="mb-3 text-lg font-semibold">
          Abgegebene Tipps
        </h2>
        <MatchTips data={tips} playerIds={playerIds} />
      </section>
    </Container>
  );
}
