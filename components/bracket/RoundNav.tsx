"use client";

import type { BracketStage } from "@/lib/api/types";

/** Mobile Schnellnavigation: springt zu einer Runde (FR-011). Auf Desktop ausgeblendet. */
export function RoundNav({
  rounds,
}: {
  rounds: { stage: BracketStage; label: string }[];
}) {
  return (
    <nav
      aria-label="Rundennavigation"
      className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden"
    >
      {rounds.map((r) => (
        <button
          key={r.stage}
          type="button"
          onClick={() =>
            document
              .getElementById(`round-${r.stage}`)
              ?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
          }
          className="shrink-0 rounded-md border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {r.label}
        </button>
      ))}
    </nav>
  );
}
