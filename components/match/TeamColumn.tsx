import { flagEmoji } from "@/lib/flags";
import { cn } from "@/lib/utils";

/** Zentrierte Team-Spalte: Flagge über dem Namen. Geteilt von Card & Hero. */
export function TeamColumn({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "lg";
}) {
  const flag = flagEmoji(name);
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
      <span
        aria-hidden
        className={cn("leading-none", size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl")}
      >
        {flag ?? "🏳️"}
      </span>
      <span
        className={cn(
          "max-w-full truncate font-semibold",
          size === "lg" ? "text-sm sm:text-base" : "text-xs sm:text-sm",
        )}
      >
        {name}
      </span>
    </div>
  );
}
