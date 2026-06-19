"use client";

import { useCallback } from "react";
import type { Match } from "@/lib/api/types";
import { getLiveMatches } from "@/lib/api/live";
import { usePolling } from "@/hooks/usePolling";
import { MatchCard } from "@/components/match/MatchCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

/** Polling-Intervall in ms (Korridor 30–60 s gemäß Spec). */
const POLL_INTERVAL_MS = 45_000;

export function LiveMatches() {
  const fetcher = useCallback(
    (signal: AbortSignal) => getLiveMatches({ signal }),
    [],
  );
  const { data, error, isLoading } = usePolling<Match[]>(
    fetcher,
    POLL_INTERVAL_MS,
  );

  if (isLoading && data === null) {
    return <LoadingSkeleton rows={3} />;
  }

  if (error && data === null) {
    return (
      <ErrorState message="Die laufenden Spiele konnten nicht geladen werden." />
    );
  }

  const matches = data ?? [];

  if (matches.length === 0) {
    return (
      <EmptyState
        title="Aktuell keine laufenden Spiele"
        message="Sobald ein Spiel angepfiffen ist, erscheint es hier automatisch."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
