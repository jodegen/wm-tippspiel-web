import { describe, expect, it } from "vitest";
import type { Match } from "@/lib/api/types";
import {
  deriveMatchdayOptions,
  derivePhaseOptions,
  filterMatches,
  phaseKey,
} from "@/lib/filters";

function match(partial: Partial<Match> & Pick<Match, "id">): Match {
  return {
    homeTeam: { name: "A" },
    awayTeam: { name: "B" },
    kickoff: "2026-06-19T16:00:00Z",
    phase: { type: "group", groupName: "A" },
    matchday: 1,
    status: "scheduled",
    ...partial,
  };
}

const matches: Match[] = [
  match({ id: "1", phase: { type: "group", groupName: "A" }, matchday: 1, kickoff: "2026-06-19T18:00:00Z" }),
  match({ id: "2", phase: { type: "group", groupName: "B" }, matchday: 1, kickoff: "2026-06-19T16:00:00Z" }),
  match({ id: "3", phase: { type: "group", groupName: "A" }, matchday: 2, kickoff: "2026-06-22T16:00:00Z" }),
  match({ id: "4", phase: { type: "knockout", round: "final" }, matchday: 7, kickoff: "2026-07-19T19:00:00Z" }),
];

describe("phaseKey", () => {
  it("erzeugt eindeutige Schlüssel für Gruppe und K.o.", () => {
    expect(phaseKey({ type: "group", groupName: "A" })).toBe("group:A");
    expect(phaseKey({ type: "knockout", round: "final" })).toBe("ko:final");
  });
});

describe("filterMatches", () => {
  it("filtert nach Phase (exklusiv) und sortiert chronologisch", () => {
    const result = filterMatches(matches, { phaseKey: "group:A" });
    expect(result.map((m) => m.id)).toEqual(["1", "3"]);
  });

  it("kombiniert Phase UND Spieltag (UND-Verknüpfung)", () => {
    const result = filterMatches(matches, { phaseKey: "group:A", matchday: "2" });
    expect(result.map((m) => m.id)).toEqual(["3"]);
  });

  it("filtert nur nach Spieltag über Phasen hinweg", () => {
    const result = filterMatches(matches, { matchday: "1" });
    // chronologisch: 16:00 (id 2) vor 18:00 (id 1)
    expect(result.map((m) => m.id)).toEqual(["2", "1"]);
  });

  it("gibt bei leerem Filter alle Spiele chronologisch zurück", () => {
    const result = filterMatches(matches, {});
    expect(result.map((m) => m.id)).toEqual(["2", "1", "3", "4"]);
  });
});

describe("derivePhaseOptions / deriveMatchdayOptions", () => {
  it("listet Gruppen vor K.o.-Runden", () => {
    const opts = derivePhaseOptions(matches);
    expect(opts.map((o) => o.key)).toEqual(["group:A", "group:B", "ko:final"]);
  });

  it("listet Spieltage numerisch sortiert", () => {
    const opts = deriveMatchdayOptions(matches);
    expect(opts.map((o) => o.key)).toEqual(["1", "2", "7"]);
  });
});
