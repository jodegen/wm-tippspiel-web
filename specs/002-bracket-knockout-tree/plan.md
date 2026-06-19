# Implementation Plan: K.o.-Turnierbaum (/bracket)

**Branch**: `002-bracket-knockout-tree` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-bracket-knockout-tree/spec.md`

## Summary

Neue öffentliche, rein lesende Seite `/bracket`, die den K.o.-Turnierbaum der WM 2026
aus dem verifizierten Backend-Endpoint `GET /api/public/bracket` rendert. Die Antwort
liefert die Runden bereits geordnet (`rounds[]` mit `stage`, `label`, `matches[]`); je
Spiel kommen Teamnamen **oder** vom Backend gelieferte Platzhalter, Ergebnis, Status,
Gewinner sowie die Pfad-Verknüpfung (`fifaMatchNo` ↔ `sourceMatchNos`/`nextMatchNo`).
Die Seite rendert serverseitig mit ISR (Basis) und schaltet clientseitiges Polling
(30–60 s) nur zu, solange mindestens ein K.o.-Spiel `IN_PLAY` ist (FR-010). Fünfspaltiges
Bracket-Layout (LAST_32→FINAL) plus separates THIRD_PLACE; Verbindungslinien zeigen den
Pfad, Gewinner rücken nach (Backend füllt die Folge-Paarung). Spiele mit echter `matchId`
verlinken auf `/spiel/[id]` (FR-017). Mobil: horizontales Scrollen des Gesamtbaums plus
rundenweise Schnellnavigation. Strikte Wiederverwendung bestehender Bausteine
(`lib/api/*`, `MatchStatusBadge`, `lib/flags.ts`, `lib/datetime.ts`, `usePolling`).

## Technical Context

**Language/Version**: TypeScript 5.x (strict), Node.js 20 LTS

**Primary Dependencies**: Next.js 15 (App Router) + React 19; native `fetch` über den
bestehenden GET-only-Client (`lib/api/client.ts`); `Intl.DateTimeFormat` (Europe/Berlin)
über `lib/datetime.ts`; Tailwind CSS. **Keine neuen Abhängigkeiten** — Verbindungslinien
mit reinem SVG/CSS, kein Graph-/Bracket-Framework (YAGNI, Verfassung „Einfachheit zuerst").

**Storage**: N/A — keine eigene Persistenz. Datenquelle ausschließlich
`GET /api/public/bracket`. Caching nur transient (Next.js Data Cache / ISR).

**Testing**: Vitest + React Testing Library (Unit/Component): Mapping der Bracket-Antwort,
Platzhalter-vs-Team-Anzeige, Linking-Regel (nur echte `matchId`), „mindestens ein Spiel
live"-Logik fürs Polling. Playwright-E2E bleibt v1-extern (konsistent mit 001).

**Target Platform**: Self-hosted VServer (Node 20 via `next start` hinter nginx),
moderne Browser (Desktop + Mobil).

**Project Type**: Web-Frontend (bestehende Single Next.js App, kein eigenes Backend).

**Performance Goals**: LCP < 2,5 s auf 4G-Mobil; `/bracket` serverseitig aus ISR-Cache;
Polling (nur bei laufendem K.o.-Spiel) aktualisiert spätestens alle 60 s.

**Constraints**: Nur HTTP-`GET`; keine Auth/Tippabgabe/Wetten; keine sensiblen Daten;
Zeiten in Europe/Berlin. Bewusst breiter Baum → auf Mobil horizontales Scrollen erlaubt
(Ausnahme zur generellen „kein horizontales Scrollen"-Regel, in der Spec dokumentiert).
CORS des Backends muss clientseitiges Polling vom Origin `wm.xenoria.de` erlauben
(bereits für `/live` verifiziert; derselbe Mechanismus).

**Scale/Scope**: 1 neue Route, 32 K.o.-Spiele (16/8/4/2 + THIRD_PLACE + FINAL),
6 Runden-Buckets. Geringe gleichzeitige Last (öffentliche Lese-Site).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Prinzip | Bewertung | Status |
|---------|-----------|--------|
| I. Read-Only by Design | Nur `GET /api/public/bracket` über bestehenden GET-only-Client; keine Formulare/Mutationen | ✅ PASS |
| II. Backend als alleinige Datenquelle | Baumdaten ausschließlich aus dem Endpoint; Pfad/Platzhalter/Gewinner kommen fertig vom Backend; keine eigene Ableitung; Caching nur transient (ISR) | ✅ PASS |
| III. Keine Auth/Tippabgabe/Wetten | Anonyme Anzeige; keine Login-/Einsatz-Logik | ✅ PASS |
| IV. Datensparsamkeit & Datenschutz | Nur öffentliche Felder (Teamname/Platzhalter, Score, Status); keine Persistenz/Logging | ✅ PASS |
| V. Stack- & Stilkonsistenz | Wiederverwendung von `lib/api/*`, `lib/datetime.ts`, `lib/flags.ts`, `MatchStatusBadge`, `usePolling`; keine neuen Deps | ✅ PASS |
| Zeitzonen (Europe/Berlin) | Anstoßzeiten je Spiel über `formatKickoff()` zentral | ✅ PASS |
| Responsiveness / Deployment | Mobil scrollbar + Rundennavigation; Self-Hosting unverändert | ✅ PASS |

**Ergebnis (Initial)**: Keine Verstöße. Complexity Tracking bleibt leer.

**Re-Check nach Phase 1 (Design)**: Design führt keine neuen Datenquellen, Mutationen,
Abhängigkeiten oder eigene Domänen-Aggregationen ein (Pfad/Gewinner stammen vom Backend).
→ Weiterhin **keine Verstöße**.

## Project Structure

### Documentation (this feature)

```text
specs/002-bracket-knockout-tree/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output — Endpoint verifiziert, Entscheidungen
├── data-model.md        # Phase 1 output — Bracket-Entities & Mapping
├── quickstart.md        # Phase 1 output — lokaler Lauf & manuelle Checks
├── contracts/
│   └── bracket-endpoint.md   # Phase 1 output — verifizierter GET-Vertrag
├── checklists/
│   └── requirements.md  # aus /speckit-specify (16/16)
└── tasks.md             # Phase 2 output (/speckit-tasks — NICHT hier erzeugt)
```

### Source Code (repository root) — neue & berührte Dateien

```text
app/
└── bracket/
    ├── page.tsx                     # NEU: Server-Component, ISR; lädt Bracket, rendert Server-Baum
    ├── loading.tsx                  # NEU: Skeleton (analog vorhandener loading.tsx)
    └── BracketLive.tsx              # NEU: 'use client'; Polling nur wenn ≥1 Spiel IN_PLAY

lib/api/
├── types.ts                        # ERWEITERN: BracketTeam, BracketMatch, BracketRound, Bracket
├── endpoints.ts                    # ERWEITERN: endpoints.bracket() → "/bracket"
└── bracket.ts                      # NEU: getBracket() (ISR) + getBracketNoStore() (Polling)

lib/
└── bracket.ts                      # NEU: reine View-Logik (teamDisplay, isDecided, winningSide, hasLiveMatch, buildConnectorIndex)

components/bracket/                  # NEU
├── BracketView.tsx                 # Gesamt-Layout: Spalten + THIRD_PLACE + Schnellnavigation
├── BracketRoundColumn.tsx          # Eine Runde (Spalte) mit Titel + Spielliste
├── BracketMatchCard.tsx            # Ein K.o.-Spiel: Teams/Platzhalter, Score, Status, Link
├── BracketConnectors.tsx           # SVG/CSS-Verbindungslinien zwischen Runden
└── RoundNav.tsx                    # Mobile Sprungmarken LAST_32 … FINAL

components/layout/
└── Nav.tsx                         # ERWEITERN: Link „Baum"/„Bracket" → /bracket

tests/unit/
└── bracket/                        # NEU: Mapping-, Platzhalter-, Linking-, Polling-Logik
```

**Structure Decision**: Erweiterung der bestehenden Single Next.js App (App Router) im
Repo-Root — keine neue Projektstruktur. Datenzugriff bleibt in `lib/api/` gekapselt
(neue `bracket.ts` analog zu `live.ts`/`matches.ts`), Präsentations-Bausteine in
`components/bracket/`. Wiederverwendung erzwingt Stilkonsistenz (Prinzip V) und hält den
Read-Only-/Single-Source-Vertrag (Prinzip I/II) an einer Stelle durch.

## Complexity Tracking

> Keine Verstöße gegen die Verfassung — dieser Abschnitt bleibt leer.
