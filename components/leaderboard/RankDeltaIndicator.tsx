/**
 * Zeigt die vom Backend gelieferte Rang-Veränderung ("NEU" / "↑n" / "↓n" / "–").
 * Bezug: vorheriger Spieltag.
 */
export function RankDeltaIndicator({ rankChange }: { rankChange: string }) {
  const trimmed = rankChange.trim();
  let className = "text-slate-400";
  if (trimmed.startsWith("↑")) className = "text-status-finished";
  else if (trimmed.startsWith("↓")) className = "text-status-live";
  else if (trimmed.toUpperCase() === "NEU") className = "text-brand";

  return (
    <span className={`inline-flex items-center tabular-nums ${className}`}>
      {trimmed || "–"}
    </span>
  );
}
