/**
 * Reine View-Logik für den K.o.-Turnierbaum — KEINE Domänen-Aggregation.
 * Pfad, Gewinner und Platzhalter stammen vom Backend; hier wird nur dargestellt
 * bzw. für die Darstellung indexiert (Verfassung II).
 */
import type {
  Bracket,
  BracketMatch,
  BracketStage,
  BracketTeam,
} from "@/lib/api/types";

/** Die fünf Hauptspalten in Anzeigereihenfolge (THIRD_PLACE wird separat gezeigt). */
export const MAIN_ROUND_ORDER: BracketStage[] = [
  "LAST_32",
  "LAST_16",
  "QUARTER_FINALS",
  "SEMI_FINALS",
  "FINAL",
];

/** Anzuzeigender Name einer Seite: Teamname, sonst Platzhalter, sonst „—". */
export function teamDisplay(team: BracketTeam): string {
  return team.teamName ?? team.placeholder ?? "—";
}

/** true, solange für diese Seite nur ein Platzhalter (kein realer Teamname) vorliegt. */
export function isPlaceholder(team: BracketTeam): boolean {
  return team.teamName == null;
}

/** Eine Paarung steht fest, sobald beide Seiten reale Teamnamen tragen (FR-017). */
export function isDecided(match: BracketMatch): boolean {
  return match.home.teamName != null && match.away.teamName != null;
}

/**
 * Gewinnerseite zur visuellen Hervorhebung (FR-008). Defensiv: akzeptiert eine
 * Seitenkennung ("HOME"/"AWAY") ODER den Teamnamen; sonst keine Hervorhebung.
 * Es wird NIE aus dem Tor-Ergebnis abgeleitet.
 */
export function winningSide(match: BracketMatch): "home" | "away" | null {
  const w = match.winner;
  if (!w) return null;
  if (w === "HOME") return "home";
  if (w === "AWAY") return "away";
  if (match.home.teamName && w === match.home.teamName) return "home";
  if (match.away.teamName && w === match.away.teamName) return "away";
  return null;
}

/** Steuert das bedingte Client-Polling (FR-010): läuft gerade mindestens ein Spiel? */
export function hasLiveMatch(bracket: Bracket): boolean {
  return bracket.rounds.some((r) =>
    r.matches.some((m) => m.status === "IN_PLAY"),
  );
}

export interface ConnectorIndex {
  /** `fifaMatchNo` → Spiel. */
  byNo: Map<number, BracketMatch>;
  /** Pfadkanten: von einem Spiel zu seinem Folgespiel (`nextMatchNo`). */
  edges: { from: number; to: number }[];
}

/** Indexiert die Pfad-Verknüpfung für die Verbindungslinien (FR-007). */
export function buildConnectorIndex(bracket: Bracket): ConnectorIndex {
  const byNo = new Map<number, BracketMatch>();
  for (const round of bracket.rounds) {
    for (const m of round.matches) byNo.set(m.fifaMatchNo, m);
  }
  const edges: { from: number; to: number }[] = [];
  for (const m of byNo.values()) {
    if (m.nextMatchNo != null && byNo.has(m.nextMatchNo)) {
      edges.push({ from: m.fifaMatchNo, to: m.nextMatchNo });
    }
  }
  return { byNo, edges };
}
