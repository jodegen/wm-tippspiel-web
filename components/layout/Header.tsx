import Link from "next/link";
import { Nav } from "@/components/layout/Nav";

/** Globaler Kopfbereich mit Markentitel und Navigation. */
export function Header() {
  return (
    <header className="bg-brand text-brand-fg">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/spielplan" className="text-lg font-bold tracking-tight">
          WM-Tippspiel
        </Link>
        <Nav />
      </div>
    </header>
  );
}
