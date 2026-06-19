import { Suspense } from "react";
import type { Metadata } from "next";
import { getSchedule } from "@/lib/api/matches";
import {
  deriveMatchdayOptions,
  derivePhaseOptions,
  filterMatches,
} from "@/lib/filters";
import { Container } from "@/components/layout/Container";
import { MatchCard } from "@/components/match/MatchCard";
import { SpielplanFilters } from "@/components/match/SpielplanFilters";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";

export const metadata: Metadata = { title: "Spielplan" };

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(params: SearchParams, key: string): string {
  const value = params[key];
  return typeof value === "string" ? value : "";
}

export default async function SpielplanPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const selectedPhase = readParam(params, "phase");
  const selectedMatchday = readParam(params, "matchday");

  let allMatches;
  try {
    allMatches = await getSchedule();
  } catch {
    return (
      <Container>
        <h1 className="mb-4 text-2xl font-bold">Spielplan</h1>
        <ErrorState />
      </Container>
    );
  }

  const phaseOptions = derivePhaseOptions(allMatches);
  const matchdayOptions = deriveMatchdayOptions(allMatches);
  const matches = filterMatches(allMatches, {
    phaseKey: selectedPhase,
    matchday: selectedMatchday,
  });

  return (
    <Container>
      <h1 className="mb-4 text-2xl font-bold">Spielplan</h1>

      <div className="mb-6">
        <Suspense fallback={null}>
          <SpielplanFilters
            phaseOptions={phaseOptions}
            matchdayOptions={matchdayOptions}
            selectedPhase={selectedPhase}
            selectedMatchday={selectedMatchday}
          />
        </Suspense>
      </div>

      {matches.length === 0 ? (
        <EmptyState
          title="Keine Spiele für diese Auswahl"
          message="Passe die Filter an, um Spiele anzuzeigen."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {matches.map((match) => (
            <MatchCard key={match.matchId} match={match} />
          ))}
        </div>
      )}
    </Container>
  );
}
