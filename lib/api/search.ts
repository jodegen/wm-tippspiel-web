import { getSchedule } from "@/lib/api/matches";
import { getLeaderboard } from "@/lib/api/leaderboard";
import type { MatchStatus } from "@/lib/api/types";

export interface SearchIndex {
  matches: { matchId: number; home: string; away: string; status: MatchStatus }[];
  players: { publicId: string; displayName: string }[];
}

/**
 * Kompakter Such-Index für die Command-Palette.
 * Wird serverseitig (ISR) aus den öffentlichen GET-Endpoints aufgebaut — kein
 * eigener Datenspeicher, kein Client-CORS nötig. Bei Backend-Fehler: leer.
 */
export async function getSearchIndex(): Promise<SearchIndex> {
  try {
    const [schedule, leaderboard] = await Promise.all([
      getSchedule(),
      getLeaderboard(),
    ]);
    return {
      matches: schedule.map((m) => ({
        matchId: m.matchId,
        home: m.home,
        away: m.away,
        status: m.status,
      })),
      players: leaderboard
        .filter((r) => r.publicId)
        .map((r) => ({ publicId: r.publicId as string, displayName: r.displayName })),
    };
  } catch {
    return { matches: [], players: [] };
  }
}
