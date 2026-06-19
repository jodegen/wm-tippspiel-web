import type { PointDistribution } from "@/lib/api/types";

const TIERS: { key: keyof PointDistribution; label: string }[] = [
  { key: "p4", label: "Exakter Treffer" },
  { key: "p3", label: "Richtige Differenz" },
  { key: "p2", label: "Richtige Tendenz" },
  { key: "p0", label: "Daneben" },
];

const POINTS: Record<keyof PointDistribution, string> = {
  p4: "4 P",
  p3: "3 P",
  p2: "2 P",
  p0: "0 P",
};

/** Verteilung der Tipps über die festen Punktstufen (vom Backend geliefert). */
export function TierDistribution({ distribution }: { distribution: PointDistribution }) {
  const max = Math.max(...TIERS.map((t) => distribution[t.key]), 1);

  return (
    <ul className="flex flex-col gap-3">
      {TIERS.map((tier) => {
        const count = distribution[tier.key];
        return (
          <li key={tier.key} className="flex items-center gap-3">
            <span className="flex w-40 shrink-0 items-baseline justify-between text-sm">
              <span>{tier.label}</span>
              <span className="text-xs text-muted-foreground">{POINTS[tier.key]}</span>
            </span>
            <span className="flex h-2.5 flex-1 items-center overflow-hidden rounded-full bg-muted">
              <span
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </span>
            <span className="w-8 shrink-0 text-right text-sm font-semibold tabular-nums">
              {count}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
