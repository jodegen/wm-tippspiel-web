import type { Metadata } from "next";
import { getBracket } from "@/lib/api/bracket";
import { getSchedule } from "@/lib/api/matches";
import type { Bracket } from "@/lib/api/types";
import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { BracketLive } from "./BracketLive";

export const metadata: Metadata = { title: "Turnierbaum" };

/**
 * Reichert den Baum mit Anstoßzeiten an, falls /bracket selbst keine liefert
 * (FR-005a). Reine Anzeige-Zuordnung per matchId aus dem Spielplan — keine neue
 * Datenquelle. Schlägt der Spielplan-Abruf fehl, bleibt der Baum ohne Zeiten.
 */
async function withKickoffs(bracket: Bracket): Promise<Bracket> {
  const hasKickoff = bracket.rounds.some((r) =>
    r.matches.some((m) => m.kickoffUtc),
  );
  if (hasKickoff) return bracket;
  try {
    const schedule = await getSchedule();
    const byId = new Map(schedule.map((m) => [m.matchId, m.kickoffUtc]));
    return {
      rounds: bracket.rounds.map((r) => ({
        ...r,
        matches: r.matches.map((m) => ({
          ...m,
          kickoffUtc: byId.get(m.matchId) ?? m.kickoffUtc ?? null,
        })),
      })),
    };
  } catch {
    return bracket;
  }
}

export default async function BracketPage() {
  let bracket: Bracket;
  try {
    bracket = await getBracket();
  } catch {
    return (
      <Container>
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Turnierbaum</h1>
        <ErrorState />
      </Container>
    );
  }

  bracket = await withKickoffs(bracket);
  const empty = bracket.rounds.every((r) => r.matches.length === 0);

  return (
    <Container>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Turnierbaum</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        K.o.-Phase der WM 2026. Solange Paarungen noch nicht feststehen, werden
        Platzhalter angezeigt.
      </p>
      {empty ? (
        <EmptyState
          title="Turnierbaum noch nicht verfügbar"
          message="Sobald die K.o.-Runden feststehen, erscheinen sie hier."
        />
      ) : (
        <BracketLive initial={bracket} />
      )}
    </Container>
  );
}
