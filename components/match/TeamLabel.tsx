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
      className={`font-medium text-slate-900 ${align === "right" ? "text-right" : ""}`}
    >
      {name}
    </span>
  );
}
