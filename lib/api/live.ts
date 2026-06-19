import { apiGet, ApiError } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Match } from "@/lib/api/types";

/**
 * Aktuell laufende Spiele (clientseitiges Polling, kein Cache).
 * Fallback: existiert kein dedizierter Live-Endpoint (404), werden alle Spiele
 * geladen und nach `status === "live"` gefiltert.
 */
export async function getLiveMatches(
  { signal }: { signal?: AbortSignal } = {},
): Promise<Match[]> {
  try {
    return await apiGet<Match[]>(endpoints.liveMatches(), {
      noStore: true,
      signal,
    });
  } catch (error) {
    if (error instanceof ApiError && error.kind === "not-found") {
      const all = await apiGet<Match[]>(endpoints.matches(), {
        noStore: true,
        signal,
      });
      return all.filter((match) => match.status === "live");
    }
    throw error;
  }
}
