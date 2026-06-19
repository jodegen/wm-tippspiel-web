import Link from "next/link";
import { Lock } from "lucide-react";
import type { MatchTips as MatchTipsDto } from "@/lib/api/types";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Avatar } from "@/components/ui/avatar";
import { PointsBadge } from "@/components/match/PointsBadge";

interface MatchTipsProps {
  data: MatchTipsDto;
  /** displayName → publicId, um Tipps auf Profile zu verlinken. */
  playerIds?: Record<string, string>;
}

/**
 * Abgegebene Tipps eines Spiels.
 * Vor Anpfiff liefert das Backend `released=false` und eine leere Liste (FR-008) —
 * dann wird ein Hinweis statt einer Liste angezeigt.
 */
export function MatchTips({ data, playerIds = {} }: MatchTipsProps) {
  if (!data.released) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-card p-10 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Lock className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="font-medium">Tipps erst nach Anpfiff sichtbar</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Die abgegebenen Tipps erscheinen, sobald das Spiel angepfiffen ist.
          </p>
        </div>
      </div>
    );
  }

  if (data.tips.length === 0) {
    return <EmptyState title="Keine Tipps vorhanden" />;
  }

  return (
    <ul className="divide-y rounded-lg border bg-card">
      {data.tips.map((tip, index) => {
        const publicId = tip.publicId ?? playerIds[tip.displayName];
        return (
          <li
            key={`${tip.displayName}-${index}`}
            className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm animate-in fade-in slide-in-from-bottom-1"
            style={{
              animationDelay: `${Math.min(index, 12) * 40}ms`,
              animationFillMode: "both",
            }}
          >
            <span className="flex min-w-0 items-center gap-2">
              <Avatar name={tip.displayName} className="h-7 w-7 text-[10px]" />
              {publicId ? (
                <Link
                  href={`/profil/${encodeURIComponent(publicId)}`}
                  className="truncate font-medium text-primary hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {tip.displayName}
                </Link>
              ) : (
                <span className="truncate font-medium">{tip.displayName}</span>
              )}
            </span>
            <span className="flex shrink-0 items-center gap-3">
              <span className="rounded-md bg-muted px-2 py-0.5 font-semibold tabular-nums">
                {tip.tipHome}&nbsp;:&nbsp;{tip.tipAway}
              </span>
              {tip.points != null ? <PointsBadge points={tip.points} /> : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
