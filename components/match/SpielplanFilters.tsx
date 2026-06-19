"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Select } from "@/components/ui/select";
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
      if (value) params.set(key, value);
      else params.delete(key);
      const qs = params.toString();
      router.replace(qs ? `/spielplan?${qs}` : "/spielplan", { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex flex-1 flex-col gap-1.5 text-sm sm:max-w-52">
        <span className="font-medium">Phase</span>
        <Select
          value={selectedPhase}
          onChange={(e) => updateParam("phase", e.target.value)}
        >
          <option value="">Alle Phasen</option>
          {phaseOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex flex-1 flex-col gap-1.5 text-sm sm:max-w-52">
        <span className="font-medium">Spieltag</span>
        <Select
          value={selectedMatchday}
          onChange={(e) => updateParam("matchday", e.target.value)}
        >
          <option value="">Alle Spieltage</option>
          {matchdayOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}
