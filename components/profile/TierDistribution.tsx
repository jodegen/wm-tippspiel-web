import type { PointDistribution } from "@/lib/api/types";

const TIERS: { key: keyof PointDistribution; label: string }[] = [
  { key: "p4", label: "Exakter Treffer (4 P)" },
  { key: "p3", label: "Richtige Differenz (3 P)" },
  { key: "p2", label: "Richtige Tendenz (2 P)" },
  { key: "p0", label: "Daneben (0 P)" },
];

/** Verteilung der Tipps über die festen Punktstufen (vom Backend geliefert). */
export function TierDistribution({ distribution }: { distribution: PointDistribution }) {
  const max = Math.max(...TIERS.map((t) => distribution[t.key]), 1);

  return (
    <ul className="flex flex-col gap-2">
      {TIERS.map((tier) => {
        const count = distribution[tier.key];
        return (
          <li key={tier.key} className="flex items-center gap-3">
            <span className="w-44 shrink-0 truncate text-sm text-slate-700">
              {tier.label}
            </span>
            <span className="flex h-5 flex-1 items-center">
              <span
                className="h-2 rounded-full bg-brand-muted"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </span>
            <span className="w-8 shrink-0 text-right text-sm font-medium tabular-nums text-slate-900">
              {count}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
