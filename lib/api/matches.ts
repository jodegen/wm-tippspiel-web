import { apiGet } from "@/lib/api/client";
import { endpoints, type MatchQuery } from "@/lib/api/endpoints";
import type { Match, MatchDetail } from "@/lib/api/types";

/** Standard-Revalidierung für Übersichtsseiten (Sekunden). */
export const OVERVIEW_REVALIDATE = 60;

/** Engere Revalidierung für die Spieldetailseite (näher an Live). */
export const MATCH_DETAIL_REVALIDATE = 30;

/** Alle Spiele für den Spielplan (ISR). */
export async function getMatches(query: MatchQuery = {}): Promise<Match[]> {
  return apiGet<Match[]>(endpoints.matches(query), {
    revalidate: OVERVIEW_REVALIDATE,
  });
}

/** Detail eines Spiels inkl. Tipps (Tipps nur nach Anpfiff vom Backend). */
export async function getMatchDetail(id: string): Promise<MatchDetail> {
  return apiGet<MatchDetail>(endpoints.matchDetail(id), {
    revalidate: MATCH_DETAIL_REVALIDATE,
  });
}
