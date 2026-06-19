"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import type { LiveMatch } from "@/lib/api/types";
import { getLiveMatches } from "@/lib/api/live";
import { usePolling } from "@/hooks/usePolling";
import { MatchCard } from "@/components/match/MatchCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

/** Polling-Intervall in ms (Korridor 30–60 s gemäß Spec). */
const POLL_INTERVAL_MS = 45_000;

function LastUpdated({ at }: { at: number | null }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  if (!at) return null;
  const secs = Math.max(0, Math.round((Date.now() - at) / 1000));
  const label = secs < 5 ? "gerade eben" : `vor ${secs}s`;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <RefreshCw className="h-3 w-3" aria-hidden />
      aktualisiert {label}
    </span>
  );
}

export function LiveMatches() {
  const fetcher = useCallback(
    (signal: AbortSignal) => getLiveMatches({ signal }),
    [],
  );
  const { data, error, isLoading } = usePolling<LiveMatch[]>(
    fetcher,
    POLL_INTERVAL_MS,
  );

  const prevRef = useRef<Map<number, LiveMatch> | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!data) return;
    setUpdatedAt(Date.now());

    const prev = prevRef.current;
    if (prev) {
      for (const m of data) {
        const p = prev.get(m.matchId);
        if (!p || m.homeScore == null || m.awayScore == null) continue;
        const changed = p.homeScore !== m.homeScore || p.awayScore !== m.awayScore;
        if (!changed) continue;
        const before = (p.homeScore ?? 0) + (p.awayScore ?? 0);
        const after = m.homeScore + m.awayScore;
        const line = `${m.home} ${m.homeScore}:${m.awayScore} ${m.away}`;
        if (after > before) toast(`⚽ Tor! ${line}`);
        else toast(`Korrektur: ${line}`);
      }
    }
    prevRef.current = new Map(data.map((m) => [m.matchId, m]));
  }, [data]);

  if (isLoading && data === null) {
    return <LoadingSkeleton rows={3} />;
  }
  if (error && data === null) {
    return <ErrorState message="Die laufenden Spiele konnten nicht geladen werden." />;
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <LastUpdated at={updatedAt} />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {matches.map((match) => (
          <MatchCard key={match.matchId} match={match} animate />
        ))}
      </div>
    </div>
  );
}
