"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/spielplan", label: "Spielplan" },
  { href: "/leaderboard", label: "Rangliste" },
  { href: "/live", label: "Live" },
] as const;

/** Globale Navigation mit aktivem Zustand. */
export function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Hauptnavigation">
      <ul className="flex items-center gap-1">
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
