/**
 * Zentrale Datums-/Zeitformatierung.
 *
 * Verfassung & FR-012/SC-003: Anstoß- und Spielzeiten werden IMMER in der
 * Zeitzone Europe/Berlin angezeigt, unabhängig von Server- oder Gerätezeitzone.
 * Komponenten formatieren Zeiten ausschließlich über diese Helfer.
 */

const TIME_ZONE = "Europe/Berlin";
const LOCALE = "de-DE";

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function toDate(iso: string): Date | null {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Vollständige Anstoßzeit, z. B. "Mi., 19.06.2026, 18:00". */
export function formatKickoff(iso: string): string {
  const date = toDate(iso);
  if (!date) return "—";
  return dateTimeFormatter.format(date);
}

/** Nur Uhrzeit in Europe/Berlin, z. B. "18:00". */
export function formatTime(iso: string): string {
  const date = toDate(iso);
  if (!date) return "—";
  return timeFormatter.format(date);
}

/** Nur Datum (lang), z. B. "Mittwoch, 19. Juni 2026". */
export function formatDate(iso: string): string {
  const date = toDate(iso);
  if (!date) return "—";
  return dateFormatter.format(date);
}
