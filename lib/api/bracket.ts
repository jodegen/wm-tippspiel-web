import { apiGet } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { OVERVIEW_REVALIDATE } from "@/lib/api/matches";
import type { Bracket } from "@/lib/api/types";

/** K.o.-Turnierbaum — serverseitig mit ISR (Basis-Aktualität). */
export async function getBracket(): Promise<Bracket> {
  return apiGet<Bracket>(endpoints.bracket(), {
    revalidate: OVERVIEW_REVALIDATE,
  });
}

/**
 * K.o.-Turnierbaum ohne Cache — für clientseitiges Polling, das nur aktiv ist,
 * solange mindestens ein K.o.-Spiel läuft (siehe lib/bracket#hasLiveMatch).
 */
export async function getBracketNoStore(
  { signal }: { signal?: AbortSignal } = {},
): Promise<Bracket> {
  return apiGet<Bracket>(endpoints.bracket(), { noStore: true, signal });
}
