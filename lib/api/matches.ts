import { apiGet } from "@/lib/api/client";
import { endpoints, type ScheduleQuery } from "@/lib/api/endpoints";
import type { Match, MatchTips } from "@/lib/api/types";

/** Standard-Revalidierung für Übersichtsseiten (Sekunden). */
export const OVERVIEW_REVALIDATE = 60;

/** Engere Revalidierung für die Spieldetailseite (näher an Live). */
export const MATCH_DETAIL_REVALIDATE = 30;

/** Vollständiger Spielplan (optional gefiltert) — ISR. */
export async function getSchedule(query: ScheduleQuery = {}): Promise<Match[]> {
  return apiGet<Match[]>(endpoints.schedule(query), {
    revalidate: OVERVIEW_REVALIDATE,
  });
}

/** Abgegebene Tipps eines Spiels (released=false + leere Liste vor Anpfiff). */
export async function getMatchTips(matchId: number | string): Promise<MatchTips> {
  return apiGet<MatchTips>(endpoints.matchTips(matchId), {
    revalidate: MATCH_DETAIL_REVALIDATE,
  });
}
