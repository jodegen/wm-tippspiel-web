import { cn } from "@/lib/utils";

/** Farbe nach erreichter Punktstufe (4 = exakt … 0 = daneben). */
function tierClass(points: number): string {
  if (points >= 4) return "bg-success/15 text-success";
  if (points === 3) return "bg-primary/10 text-primary";
  if (points === 2) return "bg-warning/15 text-warning";
  return "bg-muted text-muted-foreground";
}

/** Farbige Punkte-Pille, geteilt von Tipp-Liste & Profil-Historie. */
export function PointsBadge({
  points,
  className,
}: {
  points: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-11 items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums",
        tierClass(points),
        className,
      )}
    >
      {points} P
    </span>
  );
}
