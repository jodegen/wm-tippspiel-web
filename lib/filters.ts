import type { Match } from "@/lib/api/types";

/**
 * Reine Filterlogik für den Spielplan (FR-004 / Clarification):
 * Phasen-Filter (Gruppe ODER Turnierphase/K.o., gegenseitig ausschließend) ist mit
 * einem unabhängigen Spieltag-Filter kombinierbar (UND-Verknüpfung).
 *
 * Die Phase eines Spiels ergibt sich aus `group` (falls gesetzt → Gruppenspiel)
 * bzw. `stage` (K.o.-Runde / sonstige Phase). Keine Domänenberechnung — nur
 * Filterung/Sortierung zur Anzeige.
 */

export interface SpielplanFilter {
  /** Phasen-Schlüssel, z. B. "group:A" oder "stage:ROUND_OF_16"; leer = alle. */
  phaseKey?: string;
  /** Spieltag als String; leer = alle Tage. */
  matchday?: string;
}

export interface FilterOption {
  key: string;
  label: string;
}

const STAGE_LABELS: Record<string, string> = {
  GROUP_STAGE: "Gruppenphase",
  ROUND_OF_32: "Sechzehntelfinale",
  ROUND_OF_16: "Achtelfinale",
  QUARTER_FINAL: "Viertelfinale",
  QUARTER_FINALS: "Viertelfinale",
  SEMI_FINAL: "Halbfinale",
  SEMI_FINALS: "Halbfinale",
  THIRD_PLACE: "Spiel um Platz 3",
  FINAL: "Finale",
};

/** Wandelt einen Stage-Code in ein lesbares Label (mit Fallback). */
export function stageLabel(stage: string): string {
  if (STAGE_LABELS[stage]) return STAGE_LABELS[stage];
  return stage
    .toLowerCase()
    .split(/[_\s]+/)
    .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** Eindeutiger Phasen-Schlüssel eines Spiels. */
export function phaseKey(match: Match): string {
  return match.group ? `group:${match.group}` : `stage:${match.stage}`;
}

/** Menschlich lesbares Label zur Phase eines Spiels. */
export function phaseLabel(match: Match): string {
  return match.group ? `Gruppe ${match.group}` : stageLabel(match.stage);
}

/** Verfügbare Phasen-Optionen aus der Spielmenge ableiten (Gruppen, dann Stages). */
export function derivePhaseOptions(matches: Match[]): FilterOption[] {
  const seen = new Map<string, string>();
  for (const match of matches) {
    const key = phaseKey(match);
    if (!seen.has(key)) seen.set(key, phaseLabel(match));
  }
  const entries = [...seen.entries()].map(([key, label]) => ({ key, label }));
  const groups = entries
    .filter((e) => e.key.startsWith("group:"))
    .sort((a, b) => a.label.localeCompare(b.label, "de"));
  const stages = entries.filter((e) => e.key.startsWith("stage:"));
  return [...groups, ...stages];
}

/** Verfügbare Spieltage aus der Spielmenge ableiten (numerisch sortiert). */
export function deriveMatchdayOptions(matches: Match[]): FilterOption[] {
  const seen = new Set<string>();
  for (const match of matches) {
    if (match.matchday !== null && match.matchday !== undefined) {
      seen.add(String(match.matchday));
    }
  }
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
      if (selectedPhase && phaseKey(match) !== selectedPhase) return false;
      if (matchday && String(match.matchday) !== matchday) return false;
      return true;
    })
    .slice()
    .sort(
      (a, b) =>
        new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
    );
}
