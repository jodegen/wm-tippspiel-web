import { describe, expect, it } from "vitest";
import { winningSide } from "@/lib/bracket";
import type { BracketMatch } from "@/lib/api/types";

function bm(partial: Partial<BracketMatch> = {}): BracketMatch {
  return {
    fifaMatchNo: 101,
    matchId: 1101,
    home: { teamName: "Deutschland", placeholder: null },
    away: { teamName: "Brasilien", placeholder: null },
    homeScore: 1,
    awayScore: 0,
    status: "FINISHED",
    winner: null,
    sourceMatchNos: [],
    nextMatchNo: 104,
    ...partial,
  };
}

describe("winningSide", () => {
  it("keine Hervorhebung, solange kein Gewinner feststeht", () => {
    expect(winningSide(bm({ winner: null }))).toBeNull();
  });
  it("erkennt die Seitenkennung HOME/AWAY", () => {
    expect(winningSide(bm({ winner: "HOME" }))).toBe("home");
    expect(winningSide(bm({ winner: "AWAY" }))).toBe("away");
  });
  it("erkennt den Gewinner über den Teamnamen", () => {
    expect(winningSide(bm({ winner: "Deutschland" }))).toBe("home");
    expect(winningSide(bm({ winner: "Brasilien" }))).toBe("away");
  });
  it("leitet NICHT aus dem Tor-Ergebnis ab (unbekannter winner → null)", () => {
    expect(winningSide(bm({ winner: "Frankreich" }))).toBeNull();
  });
});
