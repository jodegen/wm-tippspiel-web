import { Suspense } from "react";
import type { Metadata } from "next";
import { getSchedule } from "@/lib/api/matches";
import {
  deriveMatchdayOptions,
  derivePhaseOptions,
  filterMatches,
  isTbd,
  sortByKickoff,
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
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Spielplan</h1>
        <ErrorState />
      </Container>
    );
  }

  // TBD-Begegnungen (noch nicht feststehende Teilnehmer) in der Übersicht ausblenden.
  const real = allMatches.filter((m) => !isTbd(m));

  // "Als Nächstes": kommende, noch nicht beendete Spiele, aufsteigend, max. 5.
  const upcoming = sortByKickoff(
    real.filter((m) => m.status !== "FINISHED"),
    "asc",
  ).slice(0, 5);

  const phaseOptions = derivePhaseOptions(real);
  const matchdayOptions = deriveMatchdayOptions(real);
  // Hauptliste absteigend (neueste/zuletzt relevante zuerst).
  const matches = filterMatches(
    real,
    { phaseKey: selectedPhase, matchday: selectedMatchday },
    "desc",
  );

  return (
    <Container>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Spielplan</h1>

      {upcoming.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Als Nächstes
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((match) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Alle Spiele
          </h2>
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
      </section>
    </Container>
  );
}
