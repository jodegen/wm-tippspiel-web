import type { TierBucket } from "@/lib/api/types";
import { EmptyState } from "@/components/feedback/EmptyState";

/** Verteilung der Tipps über die Punktstufen (vom Backend geliefert). */
export function TierDistribution({ buckets }: { buckets: TierBucket[] }) {
  if (buckets.length === 0) {
    return <EmptyState title="Keine Punktstufen-Daten" />;
  }

  const max = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <ul className="flex flex-col gap-2">
      {buckets.map((bucket) => (
        <li key={bucket.tier} className="flex items-center gap-3">
          <span className="w-32 shrink-0 truncate text-sm text-slate-700">
            {bucket.tier}
            {bucket.points !== undefined ? (
              <span className="text-slate-400"> ({bucket.points} P)</span>
            ) : null}
          </span>
          <span className="flex h-5 flex-1 items-center">
            <span
              className="h-2 rounded-full bg-brand-muted"
              style={{ width: `${(bucket.count / max) * 100}%` }}
            />
          </span>
          <span className="w-8 shrink-0 text-right text-sm font-medium tabular-nums text-slate-900">
            {bucket.count}
          </span>
        </li>
      ))}
    </ul>
  );
}
