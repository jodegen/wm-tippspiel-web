import { apiGet } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { OVERVIEW_REVALIDATE } from "@/lib/api/matches";
import type { Profile } from "@/lib/api/types";

/**
 * Öffentliches Spielerprofil über den stabilen, nicht-sensiblen publicId (ISR).
 * Aggregate werden vom Backend geliefert. Bei unbekanntem Identifier wirft der
 * Client ApiError(kind="not-found"); die Seite übersetzt dies in notFound().
 */
export async function getPlayerProfile(publicId: string): Promise<Profile> {
  return apiGet<Profile>(endpoints.playerProfile(publicId), {
    revalidate: OVERVIEW_REVALIDATE,
  });
}
