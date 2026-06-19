# Implementation Plan: Öffentliche Read-only-Website WM-Tippspiel

**Branch**: `001-public-viewer` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-public-viewer/spec.md`

## Summary

Öffentliche, rein lesende Website zum WM-Tippspiel mit fünf Seiten (`/spielplan`,
`/leaderboard`, `/profil/[id]`, `/spiel/[id]`, `/live`). Die App konsumiert
ausschließlich die öffentlichen GET-Endpoints des bestehenden Backends über einen
zentralen, nur lesenden API-Client (Basis-URL via `NEXT_PUBLIC_API_BASE_URL`).
Übersichtsseiten (Spielplan, Leaderboard, Profile, Spieldetail) rendern
serverseitig mit ISR und moderater Revalidierung; `/live` ist eine Client-Component
mit Polling (30–60 s, kein WebSocket). Anstoßzeiten werden zentral in
Europe/Berlin formatiert. Responsives, sauberes UI im Stil des Steuerfertig-
Projekts. Deployment auf Vercel.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), Node.js 20 LTS

**Primary Dependencies**: Next.js 15 (App Router) + React 19; native `fetch`;
`Intl.DateTimeFormat` mit `timeZone: "Europe/Berlin"` für Datums-/Zeitformatierung
(kein schweres Datums-Framework nötig); Styling via **Tailwind CSS**
(Steuerfertig-Konventionen + übernommene Theme-Tokens)

**Storage**: N/A — keine eigene Persistenz. Datenquelle ausschließlich die
öffentlichen GET-Endpoints des Backends. Caching ausschließlich transient über
Next.js Data Cache / ISR.

**Testing**: Vitest + React Testing Library (Unit/Component). Playwright-E2E ist
**optional und nicht Teil der v1-Tasks** (kann später für Kernflows wie
Spielplan-Filter, Live-Polling, Empty/Error-States ergänzt werden).

**Target Platform**: Vercel (Node Runtime), moderne Browser (Desktop + Mobil)

**Project Type**: Web-Frontend (Single Next.js App, kein eigenes Backend)

**Performance Goals**: LCP < 2,5 s auf 4G-Mobil; serverseitig gerenderte Seiten
über ISR aus dem Cache ausgeliefert; `/live` aktualisiert spätestens alle 60 s

**Constraints**: Nur HTTP-`GET`; keine Auth/Tippabgabe/Wetten; keine sensiblen
Daten; alle Zeiten in Europe/Berlin; responsiv ohne horizontales Scrollen ab
≤ 375 px; CORS des Backends muss clientseitige Aufrufe (Polling) erlauben

**Scale/Scope**: 5 Routen, 1 Turnier; Rangliste bis ~mehrere hundert Teilnehmer;
Spielplan ~64 Spiele; geringe gleichzeitige Last (öffentliche Lese-Site)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Prinzip | Bewertung | Status |
|---------|-----------|--------|
| I. Read-Only by Design | API-Client exponiert ausschließlich GET-Methoden; keine Formulare/Mutationen; keine zustandsändernden Requests | ✅ PASS |
| II. Backend als alleinige Datenquelle | Alle Daten aus öffentlichen GET-Endpoints; keine eigene DB; Caching nur transient (ISR/Data Cache) | ✅ PASS |
| III. Keine Auth/Tippabgabe/Wetten | Keine Login-/Session-/Einsatz-Logik; alle Aufrufe anonym | ✅ PASS |
| IV. Datensparsamkeit & Datenschutz | Nur öffentliche Backend-Felder; kein Logging personenbezogener Daten; keine Persistenz | ✅ PASS |
| V. Stack- & Stilkonsistenz | Next.js + React + TypeScript; Struktur/Styling im Steuerfertig-Stil | ✅ PASS |
| Zeitzonen (Europe/Berlin) | Zentrale Formatierungs-Utility erzwingt Europe/Berlin | ✅ PASS |
| Responsiveness / Vercel | Responsives Layout; Vercel-kompatibler Next.js-Build | ✅ PASS |

**Ergebnis**: Keine Verstöße. Complexity Tracking bleibt leer.

## Project Structure

### Documentation (this feature)

```text
specs/001-public-viewer/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (Backend-GET-Endpoint-Verträge)
│   └── backend-endpoints.md
└── tasks.md             # Phase 2 output (/speckit-tasks — NICHT hier erzeugt)
```

### Source Code (repository root)

```text
app/                                 # Next.js App Router
├── layout.tsx                       # Root-Layout, globale Nav, Metadaten
├── page.tsx                         # Einstieg → Redirect auf /spielplan
├── globals.css                      # Globale Styles (Steuerfertig-Stil)
├── spielplan/
│   └── page.tsx                     # ISR; Phasen- + Tagesfilter (Server/URL-Params)
├── leaderboard/
│   └── page.tsx                     # ISR; vollständige Rangliste
├── profil/
│   └── [id]/
│       └── page.tsx                 # ISR; Profil über öffentlichen Identifier
├── spiel/
│   └── [id]/
│       └── page.tsx                 # SSR/ISR; Details + Tipps nur nach Anpfiff
└── live/
    ├── page.tsx                     # Server-Shell
    └── LiveMatches.tsx              # 'use client'; Polling-Hook (30–60 s)

lib/
├── api/
│   ├── client.ts                    # Zentraler GET-only Fetch-Wrapper (+ Fehler-Mapping)
│   ├── endpoints.ts                 # Endpoint-URL-Builder
│   └── types.ts                     # TypeScript-Typen der Backend-Antworten
├── datetime.ts                      # formatKickoff() etc. — Europe/Berlin zentral
└── env.ts                           # NEXT_PUBLIC_API_BASE_URL Validierung

components/
├── layout/                          # Header, Nav, Container
├── match/                           # MatchCard, MatchStatusBadge, ScoreDisplay
├── leaderboard/                     # LeaderboardTable, RankDeltaIndicator
├── profile/                         # TipHistory, StatsSummary, TierDistribution
└── feedback/                        # ErrorState, EmptyState, LoadingSkeleton

hooks/
└── usePolling.ts                    # Generischer Polling-Hook für /live

tests/
├── unit/                            # datetime, api-client, Komponenten
└── e2e/                             # optional/später (Playwright) — NICHT in v1-Tasks
```

**Structure Decision**: Einzelne Next.js-App im Repo-Root (App Router). Es gibt
kein eigenes Backend in diesem Repo (das WM-Tippspiel-Backend existiert separat),
daher die Single-Project-Struktur. Datenzugriff strikt gekapselt in `lib/api/`, um
Prinzip I (Read-Only) und Prinzip II (alleinige Datenquelle) an einer Stelle
durchzusetzen. Präsentationslogik in `components/`, Zeit-Formatierung zentral in
`lib/datetime.ts` (Prinzip Europe/Berlin).

## Complexity Tracking

> Keine Verstöße gegen die Verfassung — dieser Abschnitt bleibt leer.
