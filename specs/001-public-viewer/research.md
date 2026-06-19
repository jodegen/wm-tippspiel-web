# Phase 0 Research: Öffentliche Read-only-Website WM-Tippspiel

Konsolidierte Entscheidungen für die offenen technischen Punkte. Jede Entscheidung
ist gegen die Projektverfassung (`.specify/memory/constitution.md`) geprüft.

## 1. Rendering- & Datenfrische-Strategie

- **Decision**: App Router mit serverseitigem Datenabruf + ISR.
  - `/spielplan`, `/leaderboard`, `/profil/[id]`: `fetch(..., { next: { revalidate: 60 } })`
    (moderate Revalidierung, 60 s).
  - `/spiel/[id]`: serverseitig, `revalidate: 30` (näher an Live, da sich Ergebnis/
    Tipps nach Anpfiff ändern).
  - `/live`: Server-Shell + Client-Component, die clientseitig per Polling alle
    45 s (im Korridor 30–60 s) neu lädt.
- **Rationale**: Übersichtsdaten ändern sich nur nach Spielen; ISR liefert schnelle,
  gecachte Antworten und entlastet das Backend. Polling nur dort, wo echte Live-
  Aktualität nötig ist. Erfüllt FR-010/FR-011 und Verfassungsprinzip II (Caching
  nur transient).
- **Alternatives considered**:
  - Vollständig clientseitiges Fetching überall → schlechtere LCP/SEO, mehr Last,
    verworfen.
  - WebSocket/SSE für `/live` → durch Spec (FR-010) für v1 ausgeschlossen.
  - On-Demand-Revalidation per Webhook → benötigt Backend-Mitwirkung, für v1
    unnötig; Zeit-basierte ISR genügt.

## 2. Zentraler API-Client (Read-Only)

- **Decision**: Ein Modul `lib/api/client.ts` mit einer einzigen Funktion
  `apiGet<T>(path, { revalidate, signal })`, das ausschließlich `GET` ausführt.
  Keine weiteren HTTP-Methoden werden exportiert. Basis-URL aus
  `NEXT_PUBLIC_API_BASE_URL` (validiert in `lib/env.ts`). Antworten werden gegen
  TypeScript-Typen (`lib/api/types.ts`) typisiert; Fehler werden auf ein schmales
  `ApiError` gemappt (Netzwerk-, 4xx-, 5xx-, Parse-Fehler).
- **Rationale**: Eine einzige Engstelle erzwingt Prinzip I (Read-Only) und II
  (alleinige Datenquelle) und macht Fehler-/Leerzustände konsistent behandelbar.
- **Alternatives considered**:
  - Schwergewichtiger Client (axios/react-query überall) → für serverseitiges ISR
    unnötig; native `fetch` integriert sich nativ mit dem Next.js Data Cache.
  - react-query nur für `/live` → vertretbar, aber ein schlanker eigener
    Polling-Hook reicht für v1 und vermeidet eine Abhängigkeit.

## 3. Polling-Hook für `/live`

- **Decision**: `hooks/usePolling.ts` — generischer Hook, der eine Fetch-Funktion in
  einem Intervall (Default 45 s) aufruft, `setInterval` bei `visibilitychange`
  pausiert (Tab im Hintergrund) und den letzten erfolgreichen Stand behält, falls
  ein einzelner Poll fehlschlägt (kein hartes Leerlaufen).
- **Rationale**: Erfüllt FR-009/FR-010, schont Backend (Pause bei verstecktem Tab),
  robuste UX bei kurzen Netzwerkaussetzern.
- **Alternatives considered**: `setTimeout`-Rekursion ohne Visibility-Pause →
  unnötige Last; verworfen.

## 4. Zeitzonen-Formatierung (Europe/Berlin)

- **Decision**: Zentrale Utility `lib/datetime.ts` mit `formatKickoff(iso)` /
  `formatDate(iso)` auf Basis `Intl.DateTimeFormat('de-DE', { timeZone:
  'Europe/Berlin', ... })`. Komponenten formatieren NIE selbst mit `toLocaleString`
  ohne diese Utility.
- **Rationale**: Erfüllt FR-012/SC-003 deterministisch, unabhängig von Server- oder
  Gerätezeitzone; `Intl` mit IANA-Zone behandelt Sommer-/Winterzeit korrekt ohne
  zusätzliche Abhängigkeit.
- **Alternatives considered**: `date-fns-tz` / `luxon` → Mehrgewicht ohne Mehrwert
  für reine Anzeige; verworfen.

## 5. UI / Styling im „Steuerfertig-Stil"

- **Decision**: Styling-Mechanismus = **Tailwind CSS**, angeglichen an das
  Steuerfertig-Projekt (gleiche Konventionen für Layout-Container, Typo-Skala,
  Komponentenbenennung). Theme-Tokens (Farben, Typo-Skala, Spacing) werden aus
  Steuerfertig in die Tailwind-Konfiguration übernommen.
- **Rationale**: Erfüllt Verfassungsprinzip V (Stilkonsistenz); Tailwind ist im
  Steuerfertig-Stack etabliert und beschleunigt ein responsives, sauberes UI.
- **Alternatives considered**: CSS Modules (Next.js-nativ) und CSS-in-JS →
  verworfen zugunsten der Konsistenz mit Steuerfertig (Tailwind).

## 6. Backend-Endpoint-Vertrag

- **Decision**: Erwartete GET-Endpoints und Felder werden in
  `contracts/backend-endpoints.md` aus der Spec abgeleitet dokumentiert und beim
  Implementierungsstart gegen das reale Backend verifiziert/justiert. Die
  TypeScript-Typen in `lib/api/types.ts` sind die maßgebliche Frontend-Sicht.
- **Rationale**: Entkoppelt Frontend-Arbeit von noch nicht final dokumentierten
  Endpoint-Details; der Client kapselt Abweichungen an einer Stelle.
- **Alternatives considered**: Warten auf vollständige Backend-API-Doku → blockiert
  unnötig; ein abgeleiteter Vertrag mit klarer Verifikationsaufgabe ist
  pragmatischer.

## 7. Fehler- & Leerzustände

- **Decision**: Wiederverwendbare Komponenten `ErrorState`, `EmptyState`,
  `LoadingSkeleton` in `components/feedback/`. Serverseitige Seiten nutzen
  Next.js `error.tsx`/`not-found.tsx` je Route; `/spiel/[id]` und `/profil/[id]`
  rufen `notFound()` bei unbekanntem Identifier.
- **Rationale**: Erfüllt FR-013/FR-014/FR-015 konsistent; „keine Tipps vor Anpfiff"
  ist ein normaler Leerzustand, kein Fehler.
- **Alternatives considered**: Ad-hoc-Fehlertexte pro Seite → inkonsistent;
  verworfen.

## 8. Deployment (Self-hosted VServer) & CORS

- **Decision**: Self-Hosting auf einem VServer. Production-Build via `next build`,
  Betrieb via `next start` (Node 20) als systemd-Dienst, davor ein nginx-Reverse-
  Proxy. Frontend unter `wm.xenoria.de`, Backend-API unter `api.wm.xenoria.de`.
  `NEXT_PUBLIC_API_BASE_URL=https://api.wm.xenoria.de`. Da `/live` clientseitig
  pollt und Frontend/API getrennte Origins sind, MUSS das Backend CORS für
  `https://wm.xenoria.de` erlauben; serverseitige ISR-Fetches benötigen kein CORS.
- **Rationale**: Entspricht der gewählten Infrastruktur (eigener VServer);
  Next.js läuft unverändert per `next start`, kein Vercel-spezifischer Code.
- **Alternatives considered**: Vercel (ursprüngliche Annahme) → verworfen zugunsten
  des vorhandenen VServers. Statischer Export → nicht möglich wegen ISR/SSR und
  dynamischer Routen.
- **Open item**: CORS-Konfiguration und nginx-vHosts sind serverseitig
  einzurichten; Artefakte siehe `DEPLOYMENT.md` und `deploy/`.

## Zusammenfassung offener Punkte (nicht blockierend)

| Punkt | Auflösung |
|-------|-----------|
| Theme-Tokens (Farben/Typo/Spacing aus Steuerfertig) | In Setup-Phase in Tailwind-Config übernehmen (Mechanismus = Tailwind festgelegt) |
| Reale Endpoint-Pfade/Schemata | In `contracts/` abgeleitet; bei Implementierungsstart verifizieren |
| CORS für Polling-Origin | Backend-seitig sicherstellen (Annahme) |
