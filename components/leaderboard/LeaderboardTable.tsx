import type { LeaderboardRow } from "@/lib/api/types";
import { RankDeltaIndicator } from "@/components/leaderboard/RankDeltaIndicator";

/**
 * Vollständige, responsive Ranglisten-Tabelle.
 *
 * Hinweis: Die öffentliche Leaderboard-API liefert keinen `publicId`, daher ist
 * (noch) keine Verlinkung zum Spielerprofil möglich (siehe Spec-Hinweis FR-006).
 */
export function LeaderboardTable({ entries }: { entries: LeaderboardRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-surface-border">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <caption className="sr-only">Rangliste aller Teilnehmer</caption>
        <thead className="bg-surface-subtle text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-3 py-2 text-right">Rang</th>
            <th scope="col" className="px-3 py-2">Teilnehmer</th>
            <th scope="col" className="px-3 py-2 text-right">Punkte</th>
            <th scope="col" className="px-3 py-2 text-right">Exakt</th>
            <th scope="col" className="px-3 py-2 text-right">Δ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {entries.map((entry) => (
            <tr key={entry.rank} className="hover:bg-surface-subtle">
              <td className="px-3 py-2 text-right font-semibold tabular-nums text-slate-900">
                {entry.rank}
              </td>
              <td className="px-3 py-2 font-medium text-slate-800">
                {entry.displayName}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">{entry.points}</td>
              <td className="px-3 py-2 text-right tabular-nums">{entry.exactHits}</td>
              <td className="px-3 py-2 text-right">
                <RankDeltaIndicator rankChange={entry.rankChange} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
