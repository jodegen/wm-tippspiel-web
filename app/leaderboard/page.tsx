import type { Metadata } from "next";
import { getLeaderboard } from "@/lib/api/leaderboard";
import { Container } from "@/components/layout/Container";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
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
        <h1 className="mb-4 text-2xl font-bold">Rangliste</h1>
        <ErrorState />
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4 text-2xl font-bold">Rangliste</h1>
      {entries.length === 0 ? (
        <EmptyState
          title="Noch keine Rangliste"
          message="Sobald Ergebnisse vorliegen, erscheint hier die vollständige Rangliste."
        />
      ) : (
        <LeaderboardTable entries={entries} />
      )}
    </Container>
  );
}
