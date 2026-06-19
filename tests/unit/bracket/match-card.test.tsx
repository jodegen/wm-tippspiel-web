import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BracketMatchCard } from "@/components/bracket/BracketMatchCard";
import type { BracketMatch } from "@/lib/api/types";

function bm(partial: Partial<BracketMatch> = {}): BracketMatch {
  return {
    fifaMatchNo: 73,
    matchId: 537417,
    home: { teamName: null, placeholder: "Sieger Gruppe A" },
    away: { teamName: null, placeholder: "Zweiter Gruppe B" },
    homeScore: null,
    awayScore: null,
    status: "SCHEDULED",
    winner: null,
    sourceMatchNos: [],
    nextMatchNo: 90,
    ...partial,
  };
}

describe("BracketMatchCard", () => {
  it("zeigt Platzhalter und ist nicht verlinkt, solange Teams offen sind", () => {
    const { container } = render(<BracketMatchCard match={bm()} />);
    expect(screen.getByText("Sieger Gruppe A")).toBeInTheDocument();
    expect(screen.getByText("Zweiter Gruppe B")).toBeInTheDocument();
    expect(container.querySelector("a")).toBeNull();
  });

  it("verlinkt feststehende Paarungen auf /spiel/{matchId} (FR-017)", () => {
    const { container } = render(
      <BracketMatchCard
        match={bm({
          home: { teamName: "Deutschland", placeholder: null },
          away: { teamName: "Brasilien", placeholder: null },
          homeScore: 2,
          awayScore: 1,
          status: "FINISHED",
          winner: "Deutschland",
        })}
      />,
    );
    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("/spiel/537417");
    expect(screen.getByText("Deutschland")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
