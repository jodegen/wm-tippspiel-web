/**
 * Endpoint-Pfad-Builder gemäß contracts/backend-endpoints.md.
 * Alle Endpoints sind GET. Pfade relativ zu NEXT_PUBLIC_API_BASE_URL.
 */

export interface MatchQuery {
  phase?: "group" | "knockout";
  group?: string;
  round?: string;
  matchday?: string | number;
}

function withQuery(path: string, params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, value);
    }
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

export const endpoints = {
  matches: (query: MatchQuery = {}): string =>
    withQuery("/matches", {
      phase: query.phase,
      group: query.group,
      round: query.round,
      matchday: query.matchday !== undefined ? String(query.matchday) : undefined,
    }),
  matchDetail: (id: string): string => `/matches/${encodeURIComponent(id)}`,
  liveMatches: (): string => "/matches/live",
  leaderboard: (): string => "/leaderboard",
  playerProfile: (id: string): string => `/players/${encodeURIComponent(id)}`,
} as const;
