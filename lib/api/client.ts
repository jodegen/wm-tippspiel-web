import { API_BASE_URL } from "@/lib/env";

/**
 * Zentraler, AUSSCHLIESSLICH lesender API-Client.
 *
 * Verfassungsprinzip I (Read-Only) & II (Backend als alleinige Datenquelle):
 * Dieses Modul exportiert NUR `apiGet`. Es werden niemals zustandsändernde
 * HTTP-Methoden (POST/PUT/PATCH/DELETE) verwendet oder exponiert.
 */

export type ApiErrorKind = "network" | "not-found" | "http" | "parse";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

export interface ApiGetOptions {
  /** ISR-Revalidierungsfenster in Sekunden (serverseitig). */
  revalidate?: number;
  /** Caching deaktivieren (z. B. clientseitiges Live-Polling). */
  noStore?: boolean;
  /** Abbruchsignal (z. B. beim Unmount der Live-Component). */
  signal?: AbortSignal;
}

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

/**
 * Führt einen GET-Request gegen das Backend aus und parst die JSON-Antwort.
 * Wirft bei Fehlern ein typisiertes {@link ApiError}.
 */
export async function apiGet<T>(
  path: string,
  options: ApiGetOptions = {},
): Promise<T> {
  const { revalidate, noStore, signal } = options;

  const nextConfig: { revalidate?: number } | undefined =
    revalidate !== undefined ? { revalidate } : undefined;

  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
      ...(noStore ? { cache: "no-store" } : {}),
      ...(nextConfig ? { next: nextConfig } : {}),
    });
  } catch {
    throw new ApiError(
      "network",
      `Netzwerkfehler beim Abruf von ${path}`,
      undefined,
    );
  }

  if (response.status === 404) {
    throw new ApiError("not-found", `Nicht gefunden: ${path}`, 404);
  }

  if (!response.ok) {
    throw new ApiError(
      "http",
      `Unerwarteter Status ${response.status} für ${path}`,
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError("parse", `Antwort von ${path} ist kein gültiges JSON`);
  }
}
