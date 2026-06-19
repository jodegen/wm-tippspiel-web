"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Swords, User } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { SearchIndex } from "@/lib/api/search";

/** Globale Suche (⌘K) über Spiele und Profile. */
export function SearchCommand({ index }: { index: SearchIndex }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
        aria-label="Suche öffnen"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Spiele oder Profile…</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Spiele oder Profile suchen…" />
        <CommandList>
          <CommandEmpty>Keine Treffer.</CommandEmpty>

          {index.players.length > 0 ? (
            <CommandGroup heading="Profile">
              {index.players.map((p) => (
                <CommandItem
                  key={p.publicId}
                  value={`profil ${p.displayName}`}
                  onSelect={() => go(`/profil/${encodeURIComponent(p.publicId)}`)}
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  {p.displayName}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {index.matches.length > 0 ? (
            <CommandGroup heading="Spiele">
              {index.matches.map((m) => (
                <CommandItem
                  key={m.matchId}
                  value={`spiel ${m.home} ${m.away}`}
                  onSelect={() => go(`/spiel/${m.matchId}`)}
                >
                  <Swords className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {m.home} <span className="text-muted-foreground">–</span> {m.away}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}
