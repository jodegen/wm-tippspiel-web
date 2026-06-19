import type { PlayerStats } from "@/lib/api/types";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface p-4 text-center">
      <div className="text-2xl font-bold tabular-nums text-slate-900">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>
    </div>
  );
}

/** Aggregierte Kennzahlen eines Profils (vom Backend geliefert). */
export function StatsSummary({ stats }: { stats: PlayerStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat label="Punkte" value={stats.totalPoints} />
      <Stat label="Exakte Treffer" value={stats.exactHits} />
      <Stat label="Tipps" value={stats.tipCount} />
      {stats.averagePoints !== undefined ? (
        <Stat label="Ø Punkte" value={stats.averagePoints} />
      ) : null}
    </div>
  );
}
