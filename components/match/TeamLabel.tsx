import { flagEmoji } from "@/lib/flags";
import { cn } from "@/lib/utils";

/** Team-Darstellung mit Flaggen-Emoji (falls Land bekannt). */
export function TeamLabel({
  name,
  align = "left",
  className,
}: {
  name: string;
  align?: "left" | "right";
  className?: string;
}) {
  const flag = flagEmoji(name);
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5 font-medium",
        align === "right" && "flex-row-reverse",
        className,
      )}
    >
      {flag ? (
        <span aria-hidden className="shrink-0 text-base leading-none">
          {flag}
        </span>
      ) : null}
      <span className="truncate">{name}</span>
    </span>
  );
}
