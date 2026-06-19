import Link from "next/link";

const links = [
  { href: "/spielplan", label: "Spielplan" },
  { href: "/leaderboard", label: "Rangliste" },
  { href: "/live", label: "Live" },
] as const;

/** Globale Navigation zwischen den Hauptseiten. */
export function Nav() {
  return (
    <nav aria-label="Hauptnavigation">
      <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-100 hover:bg-white/10"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
