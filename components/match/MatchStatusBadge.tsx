import { Badge } from "@/components/ui/badge";
import type { MatchStatus } from "@/lib/api/types";

type Variant = "default" | "primary" | "success" | "destructive" | "warning";

const STATUS_META: Record<MatchStatus, { label: string; variant: Variant }> = {
  SCHEDULED: { label: "Ausstehend", variant: "default" },
  IN_PLAY: { label: "Live", variant: "destructive" },
  FINISHED: { label: "Beendet", variant: "success" },
  POSTPONED: { label: "Verlegt", variant: "warning" },
  CANCELLED: { label: "Abgesagt", variant: "default" },
};

/** Statuskennzeichnung eines Spiels. */
export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge variant={meta.variant}>
      {status === "IN_PLAY" ? (
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-destructive"
        />
      ) : null}
      {meta.label}
    </Badge>
  );
}
