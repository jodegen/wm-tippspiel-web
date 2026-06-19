"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { FilterOption } from "@/lib/filters";

interface SpielplanFiltersProps {
  phaseOptions: FilterOption[];
  matchdayOptions: FilterOption[];
  selectedPhase: string;
  selectedMatchday: string;
}

/**
 * Phasen- (Gruppe ODER K.o., exklusiv) und Spieltag-Filter, kombinierbar.
 * Zustand wird in den URL-Suchparametern gehalten (teilbare Links, ISR-freundlich).
 */
export function SpielplanFilters({
  phaseOptions,
  matchdayOptions,
  selectedPhase,
  selectedMatchday,
}: SpielplanFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.replace(qs ? `/spielplan?${qs}` : "/spielplan", { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Phase</span>
        <select
          value={selectedPhase}
          onChange={(e) => updateParam("phase", e.target.value)}
          className="rounded-md border border-surface-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">Alle Phasen</option>
          {phaseOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Spieltag</span>
        <select
          value={selectedMatchday}
          onChange={(e) => updateParam("matchday", e.target.value)}
          className="rounded-md border border-surface-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">Alle Spieltage</option>
          {matchdayOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
