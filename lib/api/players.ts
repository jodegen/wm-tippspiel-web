import { apiGet } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { OVERVIEW_REVALIDATE } from "@/lib/api/matches";
import type { PlayerProfile } from "@/lib/api/types";

/**
 * Spielerprofil über öffentlichen Identifier (ISR).
 * Aggregate (Statistiken, Punktstufen, Best/Worst) werden vom Backend geliefert.
 * Bei unbekannter id wirft der Client ApiError(kind="not-found"); die Seite
 * übersetzt dies in notFound().
 */
export async function getPlayerProfile(id: string): Promise<PlayerProfile> {
  return apiGet<PlayerProfile>(endpoints.playerProfile(id), {
    revalidate: OVERVIEW_REVALIDATE,
  });
}
