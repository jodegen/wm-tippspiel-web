import type { Metadata } from "next";
import { getLeaderboard } from "@/lib/api/leaderboard";
import { Container } from "@/components/layout/Container";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { Podium } from "@/components/leaderboard/Podium";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";

export const metadata: Metadata = { title: "Rangliste" };

export default async function LeaderboardPage() {
  let entries;
  try {
    entries = await getLeaderboard();
  } catch {
    return (
      <Container>
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Rangliste</h1>
        <ErrorState />
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Rangliste</h1>
      {entries.length === 0 ? (
        <EmptyState
          title="Noch keine Rangliste"
          message="Sobald Ergebnisse vorliegen, erscheint hier die vollständige Rangliste."
        />
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
          <Podium entries={entries} />
          <LeaderboardTable entries={entries} />
        </div>
      )}
    </Container>
  );
}
