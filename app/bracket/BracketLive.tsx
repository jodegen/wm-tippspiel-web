"use client";

import { useCallback } from "react";
import type { Bracket } from "@/lib/api/types";
import { getBracketNoStore } from "@/lib/api/bracket";
import { hasLiveMatch } from "@/lib/bracket";
import { usePolling } from "@/hooks/usePolling";
import { BracketView } from "@/components/bracket/BracketView";

/**
 * Client-Wrapper für den Baum (FR-010): ISR liefert die Initialdaten; nur wenn
 * mindestens ein K.o.-Spiel läuft, wird zusätzlich gepollt (30–60 s). Sonst wird
 * der Baum rein aus den Server-Daten gerendert (kein Polling, keine Last).
 * Übergänge SCHEDULED→IN_PLAY werden ansonsten über die ISR-Revalidierung erfasst.
 */
export function BracketLive({ initial }: { initial: Bracket }) {
  if (hasLiveMatch(initial)) {
    return <BracketPolling initial={initial} />;
  }
  return <BracketView bracket={initial} />;
}

function BracketPolling({ initial }: { initial: Bracket }) {
  const fetcher = useCallback(
    (signal: AbortSignal) => getBracketNoStore({ signal }),
    [],
  );
  const { data } = usePolling<Bracket>(fetcher, 45_000);
  return <BracketView bracket={data ?? initial} />;
}
