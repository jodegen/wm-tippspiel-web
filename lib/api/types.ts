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
  /**
   * Öffentlicher, HMAC-abgeleiteter Identifier für die Profil-Verlinkung (FR-006).
   * Optional, bis das Backend das Feld in der Leaderboard-Antwort liefert.
   */
  publicId?: string;
}

export interface PublicTip {
  displayName: string;
  tipHome: number;
  tipAway: number;
  /** Nur bei bereits gewertetem Spiel. */
  points?: number | null;
  /** Öffentlicher Identifier für die Profil-Verlinkung (falls Backend ihn liefert). */
  publicId?: string;
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
  /**
   * Optionale Kontextfelder zur eindeutigen Zuordnung & Verlinkung des Spiels
   * (FR: Wiederholungsbegegnungen unterscheiden). Greifen, sobald das Backend
   * sie in ProfileTip liefert.
   */
  matchId?: number;
  kickoffUtc?: string;
  stage?: string;
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

/* --- K.o.-Turnierbaum (/bracket) ----------------------------------------- */

/** Runden-Kennung des K.o.-Baums (Backend liefert sie in dieser Reihenfolge). */
export type BracketStage =
  | "LAST_32"
  | "LAST_16"
  | "QUARTER_FINALS"
  | "SEMI_FINALS"
  | "THIRD_PLACE"
  | "FINAL";

/** Eine Seite einer K.o.-Begegnung: realer Teamname ODER Platzhalter. */
export interface BracketTeam {
  teamName: string | null;
  placeholder: string | null;
}

/** Ein einzelnes K.o.-Spiel inkl. Pfad-Verknüpfung über `fifaMatchNo`. */
export interface BracketMatch {
  fifaMatchNo: number;
  matchId: number;
  home: BracketTeam;
  away: BracketTeam;
  homeScore?: number | null;
  awayScore?: number | null;
  status: MatchStatus;
  /** Gewinnerkennung; Gestalt TBC (Teamname oder "HOME"/"AWAY"). null, solange offen. */
  winner?: string | null;
  /** `fifaMatchNo` der speisenden Spiele (leer im Sechzehntelfinale). */
  sourceMatchNos: number[];
  /** `fifaMatchNo` des Folgespiels; null bei FINAL/THIRD_PLACE. */
  nextMatchNo?: number | null;
  /** Optional: Anstoßzeit, falls /bracket sie liefert (sonst aus /schedule angereichert). */
  kickoffUtc?: string | null;
}

export interface BracketRound {
  stage: BracketStage;
  /** Deutsche Anzeige vom Backend, z. B. "Sechzehntelfinale". */
  label: string;
  matches: BracketMatch[];
}

export interface Bracket {
  rounds: BracketRound[];
}
