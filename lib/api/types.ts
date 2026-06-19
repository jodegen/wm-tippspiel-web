/**
 * Frontend-Sicht der öffentlichen Backend-Daten (read-only).
 * Es werden ausschließlich öffentliche, unbedenkliche Felder verarbeitet
 * (Verfassungsprinzip IV). Optionale Felder werden als Leerzustand behandelt.
 */

export type MatchStatus = "scheduled" | "live" | "finished";

export type KnockoutRound =
  | "round-of-16"
  | "quarter"
  | "semi"
  | "third-place"
  | "final";

export type Phase =
  | { type: "group"; groupName: string }
  | { type: "knockout"; round: KnockoutRound };

export type RankDirection = "up" | "down" | "same";

export interface Team {
  name: string;
  code?: string;
  flag?: string;
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  minute?: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  /** Anstoßzeit als ISO-8601 (UTC). Anzeige stets in Europe/Berlin. */
  kickoff: string;
  phase: Phase;
  matchday: number | string;
  status: MatchStatus;
  tvChannel?: string;
  odds?: string | number;
  result?: MatchResult;
}

export interface LeaderboardEntry {
  playerId: string;
  displayName: string;
  rank: number;
  points: number;
  exactHits: number;
  /** Rang-Veränderung ggü. dem vorherigen Spieltag. */
  rankDelta?: number;
  rankDirection?: RankDirection;
}

export interface PlayerStats {
  totalPoints: number;
  exactHits: number;
  tipCount: number;
  averagePoints?: number;
}

export interface TierBucket {
  tier: string;
  count: number;
  points?: number;
}

export interface TipEntry {
  matchId: string;
  predictedHome: number;
  predictedAway: number;
  pointsAwarded?: number;
  tier?: string;
}

export interface PlayerProfile {
  playerId: string;
  displayName: string;
  /** Aggregate werden vom Backend fertig geliefert (Frontend rechnet nicht). */
  stats: PlayerStats;
  tierDistribution: TierBucket[];
  bestTip?: TipEntry;
  worstTip?: TipEntry;
  history: TipEntry[];
}

/** Spieldetail: Match plus abgegebene Tipps (nur nach Anpfiff vom Backend geliefert). */
export interface MatchDetail extends Match {
  tips?: TipEntry[];
}
