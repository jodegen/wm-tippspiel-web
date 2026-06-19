"use client";

import { useMemo, useRef } from "react";
import type { Bracket, BracketRound } from "@/lib/api/types";
import { MAIN_ROUND_ORDER, buildConnectorIndex } from "@/lib/bracket";
import { BracketRoundColumn } from "@/components/bracket/BracketRoundColumn";
import { BracketMatchCard } from "@/components/bracket/BracketMatchCard";
import { BracketConnectors } from "@/components/bracket/BracketConnectors";
import { RoundNav } from "@/components/bracket/RoundNav";

/**
 * Gesamt-Layout des K.o.-Baums: die fünf Hauptrunden (LAST_32→FINAL) als
 * horizontal scrollbare Spalten mit Verbindungslinien; THIRD_PLACE separat.
 * Auf Mobil zusätzlich rundenweise Schnellnavigation (FR-011/012).
 */
export function BracketView({ bracket }: { bracket: Bracket }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const byStage = useMemo(
    () => new Map(bracket.rounds.map((r) => [r.stage, r] as const)),
    [bracket],
  );

  const mainRounds: BracketRound[] = MAIN_ROUND_ORDER.map((s) => byStage.get(s)).filter(
    (r): r is BracketRound => r != null,
  );
  const thirdPlace = byStage.get("THIRD_PLACE");

  const mainEdges = useMemo(() => {
    const mainNos = new Set(
      mainRounds.flatMap((r) => r.matches.map((m) => m.fifaMatchNo)),
    );
    return buildConnectorIndex(bracket).edges.filter(
      (e) => mainNos.has(e.from) && mainNos.has(e.to),
    );
  }, [bracket, mainRounds]);

  return (
    <div>
      <RoundNav rounds={mainRounds.map((r) => ({ stage: r.stage, label: r.label }))} />

      <div ref={scrollRef} className="relative overflow-x-auto pb-4">
        <BracketConnectors containerRef={scrollRef} edges={mainEdges} revision={bracket} />
        <div className="relative z-10 flex min-w-max gap-8">
          {mainRounds.map((r) => (
            <BracketRoundColumn key={r.stage} id={`round-${r.stage}`} round={r} />
          ))}
        </div>
      </div>

      {thirdPlace && thirdPlace.matches.length > 0 ? (
        <div className="mt-8 border-t pt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {thirdPlace.label}
          </h2>
          <BracketMatchCard match={thirdPlace.matches[0]!} />
        </div>
      ) : null}
    </div>
  );
}
