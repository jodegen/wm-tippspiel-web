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
import { berlinDayKey, formatDate } from "@/lib/datetime";
import type { Match } from "@/lib/api/types";
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

/** Gruppiert (bereits sortierte) Spiele nach Kalendertag (Europe/Berlin). */
function groupByDay(
  matches: Match[],
): { key: string; label: string; items: Match[] }[] {
  const groups: { key: string; label: string; items: Match[] }[] = [];
  for (const m of matches) {
    const key = berlinDayKey(m.kickoffUtc);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(m);
    else groups.push({ key, label: formatDate(m.kickoffUtc), items: [m] });
  }
  return groups;
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
          <div className="flex flex-col gap-6">
            {groupByDay(matches).map((group) => (
              <div key={group.key}>
                <h3 className="sticky top-14 z-10 mb-3 bg-background/95 py-1.5 text-sm font-semibold backdrop-blur">
                  {group.label}
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {group.items.map((match) => (
                    <MatchCard key={match.matchId} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
