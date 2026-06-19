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
import { RankDeltaIndicator } from "@/components/leaderboard/RankDeltaIndicator";

/** Spielername — verlinkt aufs Profil, sobald ein publicId vorhanden ist. */
function PlayerName({ entry }: { entry: LeaderboardRow }) {
  if (entry.publicId) {
    return (
      <Link
        href={`/profil/${encodeURIComponent(entry.publicId)}`}
        className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:underline"
      >
        {entry.displayName}
      </Link>
    );
  }
  return <span className="font-medium">{entry.displayName}</span>;
}

/** Vollständige, responsive Ranglisten-Tabelle. */
export function LeaderboardTable({ entries }: { entries: LeaderboardRow[] }) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <caption className="sr-only">Rangliste aller Teilnehmer</caption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14 text-right">Rang</TableHead>
            <TableHead>Teilnehmer</TableHead>
            <TableHead className="text-right">Punkte</TableHead>
            <TableHead className="text-right">Exakt</TableHead>
            <TableHead className="text-right">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.rank}>
              <TableCell className="text-right text-base font-semibold tabular-nums">
                {entry.rank}
              </TableCell>
              <TableCell>
                <PlayerName entry={entry} />
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                {entry.points}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
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
