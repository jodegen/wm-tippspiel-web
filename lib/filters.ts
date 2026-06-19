import type { KnockoutRound, Match, Phase } from "@/lib/api/types";

/**
 * Reine Filterlogik für den Spielplan (FR-004 / Clarification):
 * Phasen-Filter (Gruppe ODER K.o.-Runde, gegenseitig ausschließend) ist mit einem
 * unabhängigen Spieltag-Filter kombinierbar (UND-Verknüpfung).
 *
 * Keine Domänenberechnung — nur Filterung/Sortierung zur Anzeige.
 */

export interface SpielplanFilter {
  /** Phasen-Schlüssel, z. B. "group:A" oder "ko:final"; leer = alle Phasen. */
  phaseKey?: string;
  /** Spieltag als String; leer = alle Tage. */
  matchday?: string;
}

export interface FilterOption {
  key: string;
  label: string;
}

const KNOCKOUT_LABELS: Record<KnockoutRound, string> = {
  "round-of-16": "Achtelfinale",
  quarter: "Viertelfinale",
  semi: "Halbfinale",
  "third-place": "Spiel um Platz 3",
  final: "Finale",
};

const KNOCKOUT_ORDER: KnockoutRound[] = [
  "round-of-16",
  "quarter",
  "semi",
  "third-place",
  "final",
];

/** Eindeutiger Schlüssel der Phase eines Spiels. */
export function phaseKey(phase: Phase): string {
  return phase.type === "group"
    ? `group:${phase.groupName}`
    : `ko:${phase.round}`;
}

/** Menschlich lesbares Label zu einer Phase. */
export function phaseLabel(phase: Phase): string {
  return phase.type === "group"
    ? `Gruppe ${phase.groupName}`
    : KNOCKOUT_LABELS[phase.round];
}

/** Verfügbare Phasen-Optionen aus der Spielmenge ableiten (Gruppen, dann K.o.). */
export function derivePhaseOptions(matches: Match[]): FilterOption[] {
  const seen = new Map<string, string>();
  for (const match of matches) {
    const key = phaseKey(match.phase);
    if (!seen.has(key)) seen.set(key, phaseLabel(match.phase));
  }
  const entries = [...seen.entries()].map(([key, label]) => ({ key, label }));

  const groups = entries
    .filter((e) => e.key.startsWith("group:"))
    .sort((a, b) => a.label.localeCompare(b.label, "de"));
  const knockouts = entries
    .filter((e) => e.key.startsWith("ko:"))
    .sort(
      (a, b) =>
        KNOCKOUT_ORDER.indexOf(a.key.slice(3) as KnockoutRound) -
        KNOCKOUT_ORDER.indexOf(b.key.slice(3) as KnockoutRound),
    );

  return [...groups, ...knockouts];
}

/** Verfügbare Spieltage aus der Spielmenge ableiten (numerisch/lexikografisch sortiert). */
export function deriveMatchdayOptions(matches: Match[]): FilterOption[] {
  const seen = new Set<string>();
  for (const match of matches) seen.add(String(match.matchday));
  return [...seen]
    .sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
      return a.localeCompare(b, "de");
    })
    .map((value) => ({ key: value, label: `Spieltag ${value}` }));
}

/** Filtert (Phase UND Spieltag) und sortiert chronologisch nach Anstoß. */
export function filterMatches(
  matches: Match[],
  filter: SpielplanFilter,
): Match[] {
  const { phaseKey: selectedPhase, matchday } = filter;
  return matches
    .filter((match) => {
      if (selectedPhase && phaseKey(match.phase) !== selectedPhase) return false;
      if (matchday && String(match.matchday) !== matchday) return false;
      return true;
    })
    .slice()
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
}
