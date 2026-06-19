import { apiGet } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { LiveMatch } from "@/lib/api/types";

/**
 * Aktuell laufende Spiele (Status IN_PLAY) — clientseitiges Polling, kein Cache.
 * Leere Liste, wenn kein Spiel läuft.
 */
export async function getLiveMatches(
  { signal }: { signal?: AbortSignal } = {},
): Promise<LiveMatch[]> {
  return apiGet<LiveMatch[]>(endpoints.liveMatches(), {
    noStore: true,
    signal,
  });
}
