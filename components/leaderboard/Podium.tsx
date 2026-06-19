import Link from "next/link";
import { Crown, Medal } from "lucide-react";
import type { LeaderboardRow } from "@/lib/api/types";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const RANK_STYLE = [
  { accent: "border-warning/50", badge: "bg-warning/15 text-warning", Icon: Crown },
  { accent: "border-border", badge: "bg-muted text-muted-foreground", Icon: Medal },
  { accent: "border-amber-700/40", badge: "bg-amber-700/15 text-amber-700", Icon: Medal },
] as const;

function PodiumCard({ entry, place }: { entry: LeaderboardRow; place: 0 | 1 | 2 }) {
  const style = RANK_STYLE[place];
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center shadow-sm",
        style.accent,
        place === 0 && "sm:-translate-y-2",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
          style.badge,
        )}
      >
        <style.Icon className="h-3.5 w-3.5" aria-hidden />#{entry.rank}
      </span>
      <Avatar name={entry.displayName} className="h-12 w-12 text-base" />
      {entry.publicId ? (
        <Link
          href={`/profil/${encodeURIComponent(entry.publicId)}`}
          className="max-w-full truncate font-semibold hover:text-primary"
        >
          {entry.displayName}
        </Link>
      ) : (
        <span className="max-w-full truncate font-semibold">{entry.displayName}</span>
      )}
      <span className="text-sm tabular-nums text-muted-foreground">
        {entry.points} Punkte
      </span>
    </div>
  );
}

/** Top-3-Podium über der Rangliste. */
export function Podium({ entries }: { entries: LeaderboardRow[] }) {
  const top = entries.slice(0, 3);
  if (top.length < 3) return null;
  return (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
      <PodiumCard entry={top[1]!} place={1} />
      <PodiumCard entry={top[0]!} place={0} />
      <PodiumCard entry={top[2]!} place={2} />
    </div>
  );
}
