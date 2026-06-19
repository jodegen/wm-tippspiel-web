import type { MatchStatus } from "@/lib/api/types";

const STATUS_META: Record<MatchStatus, { label: string; className: string }> = {
  scheduled: {
    label: "Ausstehend",
    className: "bg-slate-100 text-status-scheduled",
  },
  live: {
    label: "Live",
    className: "bg-red-100 text-status-live",
  },
  finished: {
    label: "Beendet",
    className: "bg-green-100 text-status-finished",
  },
};

/** Statuskennzeichnung eines Spiels. */
export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.className}`}
    >
      {status === "live" ? (
        <span
          aria-hidden
          className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-status-live"
        />
      ) : null}
      {meta.label}
    </span>
  );
}
