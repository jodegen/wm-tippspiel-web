/**
 * Endpoint-Pfad-Builder gemäß der WM-Tippspiel-Public-OpenAPI.
 * Alle Endpoints sind GET. Pfade relativ zu NEXT_PUBLIC_API_BASE_URL
 * (welche bereits den Base-Path `/api/public` enthält).
 */

export interface ScheduleQuery {
  stage?: string;
  group?: string;
  matchday?: number | string;
}

function withQuery(
  path: string,
  params: Record<string, string | undefined>,
): string {
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
  schedule: (query: ScheduleQuery = {}): string =>
    withQuery("/schedule", {
      stage: query.stage,
      group: query.group,
      matchday:
        query.matchday !== undefined ? String(query.matchday) : undefined,
    }),
  liveMatches: (): string => "/matches/live",
  bracket: (): string => "/bracket",
  leaderboard: (): string => "/leaderboard",
  matchTips: (matchId: number | string): string =>
    `/matches/${encodeURIComponent(String(matchId))}/tips`,
  playerProfile: (publicId: string): string =>
    `/players/${encodeURIComponent(publicId)}`,
} as const;
