import { cn } from "@/lib/utils";

/** Einheitliche Team-Darstellung (Backend liefert den Teamnamen als String). */
export function TeamLabel({
  name,
  align = "left",
}: {
  name: string;
  align?: "left" | "right";
}) {
  return (
    <span
      className={cn("truncate font-medium", align === "right" && "text-right")}
    >
      {name}
    </span>
  );
}
