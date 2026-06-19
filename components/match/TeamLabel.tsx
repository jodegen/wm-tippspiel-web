import type { Team } from "@/lib/api/types";

/** Einheitliche Team-Darstellung (optionale Flagge/Code werden neutral behandelt). */
export function TeamLabel({
  team,
  align = "left",
}: {
  team: Team;
  align?: "left" | "right";
}) {
  return (
    <span
      className={`flex items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}
    >
      {team.flag ? (
        <span aria-hidden className="text-lg leading-none">
          {team.flag}
        </span>
      ) : null}
      <span className="font-medium text-slate-900">{team.name}</span>
    </span>
  );
}
