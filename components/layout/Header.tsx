import Link from "next/link";
import { Trophy } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { SearchCommand } from "@/components/search/SearchCommand";
import { getSearchIndex } from "@/lib/api/search";

/** Globaler, sticky Kopfbereich mit Marke, Suche und Navigation. */
export async function Header() {
  const index = await getSearchIndex();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/spielplan"
          className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <Trophy className="h-5 w-5 text-primary" aria-hidden />
          <span className="hidden sm:inline">WM-Tippspiel</span>
        </Link>

        <div className="flex min-w-0 flex-1 justify-center">
          <div className="w-full max-w-sm">
            <SearchCommand index={index} />
          </div>
        </div>

        <div className="shrink-0">
          <Nav />
        </div>
      </div>
    </header>
  );
}
