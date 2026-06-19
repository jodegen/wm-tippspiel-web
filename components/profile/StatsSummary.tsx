import type { Profile } from "@/lib/api/types";
import { Card } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="p-4 text-center">
      <div className="text-2xl font-semibold tabular-nums">
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </Card>
  );
}

/** Aggregierte Kennzahlen eines Profils (vom Backend geliefert). */
export function StatsSummary({ profile }: { profile: Profile }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat label="Punkte" value={profile.points} />
      <Stat label="Exakte Treffer" value={profile.exactHits} />
      <Stat label="Gewertete Tipps" value={profile.evaluatedTips} />
      <Stat
        label="Trefferquote"
        value={profile.hitRatePercent != null ? `${profile.hitRatePercent} %` : "–"}
      />
    </div>
  );
}
