import type { ProfileTip } from "@/lib/api/types";

/**
 * Sortiert Tipps chronologisch (aufsteigend nach Anstoß), sofern `kickoffUtc`
 * vorhanden ist. Das Backend liefert die History nach Punkten sortiert — für
 * Zeitreihen (Punkteverlauf) und „Form" muss sie nach Datum geordnet werden.
 * Ohne `kickoffUtc` bleibt die ursprüngliche Reihenfolge erhalten.
 */
export function chronologicalTips(tips: ProfileTip[]): ProfileTip[] {
  if (tips.length === 0 || !tips.every((t) => t.kickoffUtc)) return tips.slice();
  return tips
    .slice()
    .sort(
      (a, b) =>
        new Date(a.kickoffUtc as string).getTime() -
        new Date(b.kickoffUtc as string).getTime(),
    );
}
