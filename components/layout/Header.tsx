import Link from "next/link";
import { Trophy } from "lucide-react";
import { Nav } from "@/components/layout/Nav";

/** Globaler, sticky Kopfbereich mit Markentitel und Navigation. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/spielplan"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <Trophy className="h-5 w-5 text-primary" aria-hidden />
          WM-Tippspiel
        </Link>
        <Nav />
      </div>
    </header>
  );
}
