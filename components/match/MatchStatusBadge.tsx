import type { MatchStatus } from "@/lib/api/types";

const STATUS_META: Record<MatchStatus, { label: string; className: string }> = {
  SCHEDULED: { label: "Ausstehend", className: "bg-slate-100 text-status-scheduled" },
  IN_PLAY: { label: "Live", className: "bg-red-100 text-status-live" },
  FINISHED: { label: "Beendet", className: "bg-green-100 text-status-finished" },
  POSTPONED: { label: "Verlegt", className: "bg-amber-100 text-amber-700" },
  CANCELLED: { label: "Abgesagt", className: "bg-slate-200 text-slate-600" },
};

/** Statuskennzeichnung eines Spiels. */
export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.className}`}
    >
      {status === "IN_PLAY" ? (
        <span
          aria-hidden
          className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-status-live"
        />
      ) : null}
      {meta.label}
    </span>
  );
}
