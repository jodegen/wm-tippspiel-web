import type { BracketRound } from "@/lib/api/types";
import { BracketMatchCard } from "@/components/bracket/BracketMatchCard";

/** Eine Runde als Spalte: Titel (Backend-Label) + gleichmäßig verteilte Spielkarten. */
export function BracketRoundColumn({
  round,
  id,
}: {
  round: BracketRound;
  id?: string;
}) {
  return (
    <section id={id} className="flex shrink-0 scroll-mt-20 flex-col">
      <h2 className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {round.label}
      </h2>
      <div className="flex flex-1 flex-col justify-around gap-3">
        {round.matches.map((m) => (
          <div key={m.fifaMatchNo} data-fifa={m.fifaMatchNo}>
            <BracketMatchCard match={m} />
          </div>
        ))}
      </div>
    </section>
  );
}
