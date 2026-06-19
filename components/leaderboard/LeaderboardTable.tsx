import Link from "next/link";
import type { LeaderboardRow } from "@/lib/api/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { RankDeltaIndicator } from "@/components/leaderboard/RankDeltaIndicator";
import { cn } from "@/lib/utils";

/** Vollständige, responsive Ranglisten-Tabelle; ganze Zeile verlinkt aufs Profil. */
export function LeaderboardTable({ entries }: { entries: LeaderboardRow[] }) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <caption className="sr-only">Rangliste aller Teilnehmer</caption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-right">#</TableHead>
            <TableHead>Teilnehmer</TableHead>
            <TableHead className="text-right">Punkte</TableHead>
            <TableHead className="hidden text-right sm:table-cell">Exakt</TableHead>
            <TableHead className="text-right">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.rank}
              className={cn(entry.publicId && "group relative cursor-pointer")}
            >
              <TableCell
                className={cn(
                  "text-right text-sm font-semibold tabular-nums",
                  entry.rank === 1 && "text-warning",
                )}
              >
                {entry.rank}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={entry.displayName} />
                  {entry.publicId ? (
                    <Link
                      href={`/profil/${encodeURIComponent(entry.publicId)}`}
                      className="font-medium after:absolute after:inset-0 group-hover:text-primary focus-visible:outline-none focus-visible:underline"
                    >
                      {entry.displayName}
                    </Link>
                  ) : (
                    <span className="font-medium">{entry.displayName}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                {entry.points}
              </TableCell>
              <TableCell className="hidden text-right tabular-nums text-muted-foreground sm:table-cell">
                {entry.exactHits}
              </TableCell>
              <TableCell className="text-right">
                <RankDeltaIndicator rankChange={entry.rankChange} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
