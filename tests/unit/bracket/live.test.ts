import { describe, expect, it } from "vitest";
import { hasLiveMatch } from "@/lib/bracket";
import type { Bracket, BracketMatch, MatchStatus } from "@/lib/api/types";

function bm(status: MatchStatus): BracketMatch {
  return {
    fifaMatchNo: 1,
    matchId: 1,
    home: { teamName: null, placeholder: "A" },
    away: { teamName: null, placeholder: "B" },
    homeScore: null,
    awayScore: null,
    status,
    winner: null,
    sourceMatchNos: [],
    nextMatchNo: null,
  };
}

function bracket(...statuses: MatchStatus[]): Bracket {
  return { rounds: [{ stage: "FINAL", label: "Finale", matches: statuses.map(bm) }] };
}

describe("hasLiveMatch (Polling-Gating, FR-010)", () => {
  it("false, wenn alle Spiele SCHEDULED/FINISHED sind → kein Polling", () => {
    expect(hasLiveMatch(bracket("SCHEDULED", "FINISHED"))).toBe(false);
  });
  it("true, sobald ein Spiel IN_PLAY ist → Polling aktiv", () => {
    expect(hasLiveMatch(bracket("SCHEDULED", "IN_PLAY"))).toBe(true);
  });
  it("false bei leerem Baum", () => {
    expect(hasLiveMatch({ rounds: [] })).toBe(false);
  });
});
