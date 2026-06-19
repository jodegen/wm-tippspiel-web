import { describe, expect, it } from "vitest";
import type { Match } from "@/lib/api/types";
import {
  deriveMatchdayOptions,
  derivePhaseOptions,
  filterMatches,
  phaseKey,
  stageLabel,
} from "@/lib/filters";

function match(partial: Partial<Match> & Pick<Match, "matchId">): Match {
  return {
    home: "A",
    away: "B",
    kickoffUtc: "2026-06-19T16:00:00Z",
    stage: "GROUP_STAGE",
    group: "A",
    matchday: 1,
    status: "SCHEDULED",
    ...partial,
  };
}

const matches: Match[] = [
  match({ matchId: 1, group: "A", matchday: 1, kickoffUtc: "2026-06-19T18:00:00Z" }),
  match({ matchId: 2, group: "B", matchday: 1, kickoffUtc: "2026-06-19T16:00:00Z" }),
  match({ matchId: 3, group: "A", matchday: 2, kickoffUtc: "2026-06-22T16:00:00Z" }),
  match({ matchId: 4, stage: "FINAL", group: null, matchday: 7, kickoffUtc: "2026-07-19T19:00:00Z" }),
];

describe("phaseKey / stageLabel", () => {
  it("erzeugt Schlüssel aus group bzw. stage", () => {
    expect(phaseKey(match({ matchId: 9, group: "C" }))).toBe("group:C");
    expect(phaseKey(match({ matchId: 9, group: null, stage: "FINAL" }))).toBe("stage:FINAL");
  });

  it("übersetzt bekannte Stages und prettifiziert unbekannte", () => {
    expect(stageLabel("ROUND_OF_16")).toBe("Achtelfinale");
    expect(stageLabel("FINAL")).toBe("Finale");
    expect(stageLabel("SOMETHING_NEW")).toBe("Something New");
  });
});

describe("filterMatches", () => {
  it("filtert nach Phase (exklusiv) und sortiert chronologisch", () => {
    const result = filterMatches(matches, { phaseKey: "group:A" });
    expect(result.map((m) => m.matchId)).toEqual([1, 3]);
  });

  it("kombiniert Phase UND Spieltag (UND-Verknüpfung)", () => {
    const result = filterMatches(matches, { phaseKey: "group:A", matchday: "2" });
    expect(result.map((m) => m.matchId)).toEqual([3]);
  });

  it("filtert nur nach Spieltag über Phasen hinweg (chronologisch)", () => {
    const result = filterMatches(matches, { matchday: "1" });
    expect(result.map((m) => m.matchId)).toEqual([2, 1]);
  });

  it("gibt bei leerem Filter alle Spiele chronologisch zurück", () => {
    const result = filterMatches(matches, {});
    expect(result.map((m) => m.matchId)).toEqual([2, 1, 3, 4]);
  });
});

describe("derivePhaseOptions / deriveMatchdayOptions", () => {
  it("listet Gruppen vor Stages", () => {
    const opts = derivePhaseOptions(matches);
    expect(opts.map((o) => o.key)).toEqual(["group:A", "group:B", "stage:FINAL"]);
  });

  it("listet Spieltage numerisch sortiert", () => {
    const opts = deriveMatchdayOptions(matches);
    expect(opts.map((o) => o.key)).toEqual(["1", "2", "7"]);
  });
});
