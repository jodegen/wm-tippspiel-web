import { describe, expect, it } from "vitest";
import { formatKickoff, formatTime, formatDate } from "@/lib/datetime";

describe("datetime (Europe/Berlin)", () => {
  it("formatiert Sommerzeit (CEST, UTC+2) korrekt", () => {
    // 2026-06-19 16:00 UTC -> 18:00 Europe/Berlin (CEST)
    expect(formatTime("2026-06-19T16:00:00Z")).toBe("18:00");
  });

  it("formatiert Winterzeit (CET, UTC+1) korrekt", () => {
    // 2026-01-15 16:00 UTC -> 17:00 Europe/Berlin (CET)
    expect(formatTime("2026-01-15T16:00:00Z")).toBe("17:00");
  });

  it("enthält Datum und Uhrzeit im vollständigen Kickoff-Format", () => {
    const result = formatKickoff("2026-06-19T16:00:00Z");
    expect(result).toContain("19.06.2026");
    expect(result).toContain("18:00");
  });

  it("gibt für ungültige Eingaben einen Platzhalter zurück", () => {
    expect(formatKickoff("nonsense")).toBe("—");
    expect(formatTime("")).toBe("—");
    expect(formatDate("not-a-date")).toBe("—");
  });
});
