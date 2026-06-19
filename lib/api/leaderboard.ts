import { apiGet } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { OVERVIEW_REVALIDATE } from "@/lib/api/matches";
import type { LeaderboardRow } from "@/lib/api/types";

/** Vollständige Rangliste (alle Teilnehmer, nach Rang sortiert) — ISR. */
export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  return apiGet<LeaderboardRow[]>(endpoints.leaderboard(), {
    revalidate: OVERVIEW_REVALIDATE,
  });
}
