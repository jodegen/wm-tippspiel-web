import { describe, expect, it } from "vitest";
import {
  buildConnectorIndex,
  hasLiveMatch,
  isDecided,
  teamDisplay,
} from "@/lib/bracket";
import type { Bracket, BracketMatch } from "@/lib/api/types";

function bm(partial: Partial<BracketMatch> & Pick<BracketMatch, "fifaMatchNo">): BracketMatch {
  return {
    matchId: partial.fifaMatchNo + 1000,
    home: { teamName: null, placeholder: "Sieger Gruppe A" },
    away: { teamName: null, placeholder: "Zweiter Gruppe B" },
    homeScore: null,
    awayScore: null,
    status: "SCHEDULED",
    winner: null,
    sourceMatchNos: [],
    nextMatchNo: null,
    ...partial,
  };
}

const bracket: Bracket = {
  rounds: [
    {
      stage: "SEMI_FINALS",
      label: "Halbfinale",
      matches: [
        bm({ fifaMatchNo: 101, nextMatchNo: 104 }),
        bm({ fifaMatchNo: 102, nextMatchNo: 104 }),
      ],
    },
    {
      stage: "FINAL",
      label: "Finale",
      matches: [bm({ fifaMatchNo: 104, sourceMatchNos: [101, 102] })],
    },
  ],
};

describe("teamDisplay", () => {
  it("nutzt den Teamnamen, wenn vorhanden", () => {
    expect(teamDisplay({ teamName: "Deutschland", placeholder: "Sieger A" })).toBe("Deutschland");
  });
  it("fällt auf den Platzhalter zurück", () => {
    expect(teamDisplay({ teamName: null, placeholder: "Sieger A" })).toBe("Sieger A");
  });
  it("zeigt — ohne Name und Platzhalter", () => {
    expect(teamDisplay({ teamName: null, placeholder: null })).toBe("—");
  });
});

describe("isDecided", () => {
  it("false, solange eine Seite Platzhalter ist", () => {
    expect(isDecided(bm({ fifaMatchNo: 1 }))).toBe(false);
  });
  it("true, wenn beide Seiten reale Teams sind", () => {
    const m = bm({
      fifaMatchNo: 1,
      home: { teamName: "Deutschland", placeholder: null },
      away: { teamName: "Brasilien", placeholder: null },
    });
    expect(isDecided(m)).toBe(true);
  });
});

describe("hasLiveMatch", () => {
  it("false, wenn kein Spiel IN_PLAY ist", () => {
    expect(hasLiveMatch(bracket)).toBe(false);
  });
  it("true, sobald ein Spiel IN_PLAY ist", () => {
    const live: Bracket = {
      rounds: [
        { stage: "FINAL", label: "Finale", matches: [bm({ fifaMatchNo: 104, status: "IN_PLAY" })] },
      ],
    };
    expect(hasLiveMatch(live)).toBe(true);
  });
});

describe("buildConnectorIndex", () => {
  it("indexiert alle Spiele nach fifaMatchNo", () => {
    const { byNo } = buildConnectorIndex(bracket);
    expect([...byNo.keys()].sort()).toEqual([101, 102, 104]);
  });
  it("bildet Kanten entlang nextMatchNo", () => {
    const { edges } = buildConnectorIndex(bracket);
    expect(edges).toContainEqual({ from: 101, to: 104 });
    expect(edges).toContainEqual({ from: 102, to: 104 });
    expect(edges).toHaveLength(2);
  });
});
