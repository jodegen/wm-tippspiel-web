/**
 * Zentrale Validierung der Umgebungsvariablen.
 * Die App ist read-only und benötigt ausschließlich die öffentliche Backend-Basis-URL.
 */

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function normalizeBaseUrl(value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL ist nicht gesetzt. Bitte in .env.local konfigurieren (siehe .env.example).",
    );
  }
  // Abschließenden Slash entfernen, damit Pfade konsistent angehängt werden.
  return value.trim().replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeBaseUrl(rawBaseUrl);
