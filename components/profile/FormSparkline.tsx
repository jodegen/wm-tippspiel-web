import type { ProfileTip } from "@/lib/api/types";
import { chronologicalTips } from "@/lib/tips";

/** Tailwind-Fill-Klasse je Punktstufe. */
function tierFill(points: number): string {
  if (points >= 4) return "fill-success";
  if (points === 3) return "fill-primary";
  if (points === 2) return "fill-warning";
  return "fill-muted-foreground/50";
}

const BAR_W = 7;
const GAP = 4;
const MAX_H = 28;
const MIN_H = 5;

/**
 * Mini-„Form"-Sparkline: die letzten `max` Tipps (chronologisch, jüngste rechts)
 * als Balken, Höhe ∝ Punkte, Farbe nach Stufe (4/3/2/0). Reines SVG.
 */
export function FormSparkline({
  history,
  max = 12,
}: {
  history: ProfileTip[];
  max?: number;
}) {
  const tips = chronologicalTips(history).slice(-max);
  if (tips.length === 0) return null;

  const width = tips.length * BAR_W + (tips.length - 1) * GAP;

  return (
    <svg
      width={width}
      height={MAX_H}
      viewBox={`0 0 ${width} ${MAX_H}`}
      role="img"
      aria-label={`Form der letzten ${tips.length} Tipps (chronologisch)`}
      className="overflow-visible"
    >
      {tips.map((tip, i) => {
        const h =
          tip.points <= 0 ? MIN_H : Math.max(MIN_H, (tip.points / 4) * MAX_H);
        const x = i * (BAR_W + GAP);
        const y = MAX_H - h;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={BAR_W}
            height={h}
            rx={2}
            className={tierFill(tip.points)}
          >
            <title>{`${tip.points} P${tip.home ? ` · ${tip.home}–${tip.away}` : ""}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}
