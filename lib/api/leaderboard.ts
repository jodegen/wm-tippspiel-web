import { apiGet } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { OVERVIEW_REVALIDATE } from "@/lib/api/matches";
import type { LeaderboardEntry } from "@/lib/api/types";

/** Vollständige Rangliste (alle Teilnehmer, kein Top-N) — ISR. */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return apiGet<LeaderboardEntry[]>(endpoints.leaderboard(), {
    revalidate: OVERVIEW_REVALIDATE,
  });
}
