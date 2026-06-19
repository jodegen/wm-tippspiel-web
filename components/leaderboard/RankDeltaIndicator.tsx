import type { LeaderboardEntry, RankDirection } from "@/lib/api/types";

function resolveDirection(entry: LeaderboardEntry): RankDirection {
  if (entry.rankDirection) return entry.rankDirection;
  if (entry.rankDelta === undefined || entry.rankDelta === 0) return "same";
  return entry.rankDelta > 0 ? "up" : "down";
}

const META: Record<RankDirection, { symbol: string; className: string; label: string }> = {
  up: { symbol: "▲", className: "text-status-finished", label: "aufgestiegen" },
  down: { symbol: "▼", className: "text-status-live", label: "abgestiegen" },
  same: { symbol: "–", className: "text-slate-400", label: "unverändert" },
};

/** Visualisiert die Rang-Veränderung ggü. dem vorherigen Spieltag. */
export function RankDeltaIndicator({ entry }: { entry: LeaderboardEntry }) {
  const direction = resolveDirection(entry);
  const meta = META[direction];
  const magnitude =
    entry.rankDelta !== undefined && entry.rankDelta !== 0
      ? Math.abs(entry.rankDelta)
      : null;

  return (
    <span
      className={`inline-flex items-center gap-1 tabular-nums ${meta.className}`}
      title={`Rang ${meta.label}`}
    >
      <span aria-hidden>{meta.symbol}</span>
      {magnitude !== null ? <span className="text-xs">{magnitude}</span> : null}
      <span className="sr-only">Rang {meta.label}</span>
    </span>
  );
}
