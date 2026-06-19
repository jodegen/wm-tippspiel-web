/**
 * Frontend-Sicht der öffentlichen Backend-Daten (read-only).
 * Exakt abgeleitet aus der OpenAPI der WM-Tippspiel-Public-API (Base: /api/public).
 * Es werden ausschließlich öffentliche, unbedenkliche Felder verarbeitet
 * (keine Discord-ID, E-Mail, Tokens). Zeitpunkte sind UTC (ISO-8601).
 */

export type MatchStatus =
  | "SCHEDULED"
  | "IN_PLAY"
  | "FINISHED"
  | "POSTPONED"
  | "CANCELLED";

/** Gemeinsame Anzeigefelder von Spielplan- und Live-Spielen. */
export interface MatchSummary {
  matchId: number;
  home: string;
  away: string;
  kickoffUtc: string;
  status: MatchStatus;
  homeScore?: number | null;
  awayScore?: number | null;
  stage?: string;
  group?: string | null;
  matchday?: number | null;
  tvChannel?: string | null;
  oddsHome?: number | null;
  oddsDraw?: number | null;
  oddsAway?: number | null;
}

/** Vollständiges Spiel aus /schedule. */
export interface Match extends MatchSummary {
  stage: string;
}

/** Reduziertes Live-Spiel aus /matches/live (Status immer IN_PLAY). */
export interface LiveMatch extends MatchSummary {
  status: "IN_PLAY";
}

export interface LeaderboardRow {
  rank: number;
  displayName: string;
  points: number;
  exactHits: number;
  /** Vorgefertigte Anzeige: "NEU" / "↑n" / "↓n" / "–". */
  rankChange: string;
}

export interface PublicTip {
  displayName: string;
  tipHome: number;
  tipAway: number;
  /** Nur bei bereits gewertetem Spiel. */
  points?: number | null;
}

export interface MatchTips {
  matchId: number;
  /** true nur, wenn now() >= kickoff UND revealed. Sonst sind tips leer. */
  released: boolean;
  tips: PublicTip[];
}

/** Feste Punktstufen-Verteilung (4 = exakt, 3 = Differenz, 2 = Tendenz, 0 = daneben). */
export interface PointDistribution {
  p4: number;
  p3: number;
  p2: number;
  p0: number;
}

export interface ProfileTip {
  home: string;
  away: string;
  tipHome: number;
  tipAway: number;
  resultHome?: number | null;
  resultAway?: number | null;
  points: number;
}

export interface Profile {
  publicId: string;
  displayName: string;
  rank?: number | null;
  points: number;
  exactHits: number;
  evaluatedTips: number;
  hitRatePercent?: number | null;
  distribution: PointDistribution;
  bestTip?: ProfileTip | null;
  worstTip?: ProfileTip | null;
  history: ProfileTip[];
}
