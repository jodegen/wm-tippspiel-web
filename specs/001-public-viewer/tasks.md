---
description: "Task list for öffentliche Read-only-Website WM-Tippspiel"
---

# Tasks: Öffentliche Read-only-Website WM-Tippspiel

**Input**: Design documents from `/specs/001-public-viewer/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Die Spec fordert keinen TDD. Aufgenommen sind nur einige gezielte
Unit-Tests für reine Logik (datetime, API-Client-Fehler-Mapping, Filter), da der
Plan Vitest/RTL als Stack festlegt. Sie sind als `[P]` optional gekennzeichnet.

**Organization**: Tasks sind nach User Story gruppiert, damit jede Story unabhängig
umsetzbar und testbar ist.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallel ausführbar (andere Datei, keine offenen Abhängigkeiten)
- **[Story]**: Zugehörige User Story (US1–US5)
- Pfade relativ zum Repo-Root (Single Next.js App, App Router)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Projektinitialisierung und Grundstruktur

- [X] T001 Next.js 15 App (App Router) mit TypeScript (strict) im Repo-Root initialisieren; `tsconfig.json` strict, Verzeichnisse `app/`, `lib/`, `components/`, `hooks/`, `tests/` anlegen
- [X] T002 [P] Lint/Format + Tailwind im Steuerfertig-Stil konfigurieren (ESLint + Prettier mit `prettier-plugin-tailwindcss`, Konventionen aus Steuerfertig spiegeln) in `.eslintrc`/`prettier.config`
- [X] T003 [P] Test-Setup einrichten: Vitest + React Testing Library (`vitest.config.ts`, `tests/`), Skripte `test`/`typecheck`/`lint` in `package.json`
- [X] T004 [P] Tailwind CSS einrichten (`tailwind.config.ts` mit aus Steuerfertig übernommenen Theme-Tokens, `postcss.config`), `app/globals.css` mit Tailwind-Direktiven + Basis-Styles, sowie `.env.example` mit `NEXT_PUBLIC_API_BASE_URL` anlegen

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Kerninfrastruktur, die VOR allen User Stories fertig sein muss

**⚠️ CRITICAL**: Keine User-Story-Arbeit beginnt, bevor diese Phase abgeschlossen ist

- [X] T005 `NEXT_PUBLIC_API_BASE_URL` validieren in `lib/env.ts` (Fehler bei fehlender/ungültiger URL)
- [X] T006 TypeScript-Typen aller Backend-Entitäten (Match, MatchResult, Team, LeaderboardEntry, PlayerProfile, PlayerStats, TierBucket, TipEntry, Enums) in `lib/api/types.ts` gemäß data-model.md
- [X] T007 Zentraler **GET-only** API-Client `apiGet<T>(path, { revalidate, signal })` mit `ApiError`-Mapping (Netzwerk/4xx/5xx/Parse) in `lib/api/client.ts` (erzwingt Verfassungsprinzip I & II; KEINE anderen HTTP-Methoden exportieren)
- [X] T008 [P] Endpoint-URL-Builder (matches, matches/{id}, matches/live, leaderboard, players/{id}) in `lib/api/endpoints.ts` gemäß contracts/backend-endpoints.md
- [X] T009 [P] Zentrale Europe/Berlin-Formatierung (`formatKickoff`, `formatDate`) via `Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin' })` in `lib/datetime.ts`
- [X] T010 [P] Feedback-Komponenten `ErrorState`, `EmptyState`, `LoadingSkeleton` in `components/feedback/`
- [X] T011 Root-Layout mit globaler Navigation (Links zu allen Seiten) in `app/layout.tsx` + Layout-Komponenten (`Header`, `Nav`, `Container`) in `components/layout/`
- [X] T012 [P] Einstiegsseite `app/page.tsx` mit Redirect auf `/spielplan`
- [X] T013 [P] Globale `app/error.tsx` und `app/not-found.tsx` (nutzen `ErrorState`/`EmptyState`)
- [X] T014 [P] Unit-Test für `lib/datetime.ts` (Europe/Berlin, Sommer-/Winterzeit) in `tests/unit/datetime.test.ts`
- [X] T015 [P] Unit-Test für `apiGet`-Fehler-Mapping in `tests/unit/api-client.test.ts`

**Checkpoint**: Foundation steht — User Stories können beginnen

---

## Phase 3: User Story 1 - Spielplan einsehen und filtern (Priority: P1) 🎯 MVP

**Goal**: `/spielplan` zeigt alle Spiele (Begegnung, Anstoßzeit Europe/Berlin,
TV-Sender, Quote, Ergebnis, Status), filterbar nach Phase (Gruppe **oder** K.o.)
kombiniert mit Spieltag.

**Independent Test**: `/spielplan` öffnen; alle Spiele werden angezeigt; Phasen- und
Tagesfilter kombinierbar; Anstoßzeiten in Europe/Berlin; Leer-/Fehlerzustände greifen.

- [X] T016 [P] [US1] `getMatches(filters)`-Datenfunktion (ISR `revalidate: 60`) auf Basis `apiGet` in `lib/api/matches.ts`
- [X] T017 [P] [US1] `MatchStatusBadge` (scheduled/live/finished) in `components/match/MatchStatusBadge.tsx`
- [X] T018 [P] [US1] `ScoreDisplay` (Ergebnis bzw. „ausstehend") in `components/match/ScoreDisplay.tsx`
- [X] T019 [US1] `MatchCard` (Begegnung, Anstoßzeit via `formatKickoff`, TV-Sender, Quote, Status, Ergebnis; fehlende optionale Felder neutral) in `components/match/MatchCard.tsx` (nutzt T017, T018)
- [X] T020 [US1] Reine Filterlogik (Phase exklusiv Gruppe/K.o. UND Tag) in `lib/filters.ts`
- [X] T021 [US1] Filter-UI (Phasen-Auswahl + Tag) mit URL-Suchparametern in `components/match/SpielplanFilters.tsx`
- [X] T022 [US1] Seite `app/spielplan/page.tsx` (Server-Component, ISR): lädt Matches, wendet Filter an, rendert `MatchCard`-Liste, Empty-/Error-States
- [X] T023 [P] [US1] Unit-Test der Filterlogik in `tests/unit/filters.test.ts`

**Checkpoint**: Spielplan vollständig funktionsfähig und unabhängig testbar (MVP)

---

## Phase 4: User Story 2 - Vollständige Rangliste ansehen (Priority: P2)

**Goal**: `/leaderboard` zeigt ALLE Teilnehmer mit Rang, Punkten, exakten Treffern
und Rang-Veränderung (Bezug: vorheriger Spieltag), mit Link zum Profil.

**Independent Test**: `/leaderboard` öffnen; alle Einträge sichtbar; Veränderung
auf/ab/gleich erkennbar; Klick führt zu `/profil/[id]`.

- [X] T024 [P] [US2] `getLeaderboard()`-Datenfunktion (ISR `revalidate: 60`) in `lib/api/leaderboard.ts`
- [X] T025 [P] [US2] `RankDeltaIndicator` (auf/ab/gleich, visuell unterscheidbar) in `components/leaderboard/RankDeltaIndicator.tsx`
- [X] T026 [US2] `LeaderboardTable` (responsiv; Rang, Name, Punkte, exakte Treffer, Delta; Zeile verlinkt auf `/profil/[id]`) in `components/leaderboard/LeaderboardTable.tsx` (nutzt T025)
- [X] T027 [US2] Seite `app/leaderboard/page.tsx` (Server-Component, ISR): lädt vollständige Rangliste, rendert Tabelle, Empty-/Error-States

**Checkpoint**: Spielplan UND Leaderboard funktionieren unabhängig

---

## Phase 5: User Story 3 - Laufende Spiele live verfolgen (Priority: P2)

**Goal**: `/live` zeigt alle laufenden Spiele mit aktuellem Stand und aktualisiert
clientseitig automatisch (45 s, Korridor 30–60 s) ohne Reload.

**Independent Test**: `/live` bei laufenden Spielen öffnen; Stand aktualisiert sich
≤ 60 s; ohne laufende Spiele Hinweis „aktuell keine laufenden Spiele".

- [X] T028 [P] [US3] `getLiveMatches({ signal })`-Datenfunktion (clientseitig, kein Cache; Fallback: `getMatches` nach `status=live` filtern) in `lib/api/live.ts`
- [X] T029 [P] [US3] Generischer Polling-Hook `usePolling(fn, intervalMs)` mit Visibility-Pause und „letzten Stand behalten" in `hooks/usePolling.ts`
- [X] T030 [US3] Client-Component `LiveMatches` (`'use client'`): nutzt `usePolling` + `MatchCard`, zeigt Empty-/Error-States in `app/live/LiveMatches.tsx`
- [X] T031 [US3] Server-Shell `app/live/page.tsx` (rendert `LiveMatches`, ggf. initiale Daten)
- [X] T032 [P] [US3] Unit-Test für `usePolling` (Intervall, Visibility-Pause, Beibehalten bei Fehler) in `tests/unit/usePolling.test.ts`

**Checkpoint**: Spielplan, Leaderboard UND Live funktionieren unabhängig

---

## Phase 6: User Story 4 - Spielerprofil ansehen (Priority: P3)

**Goal**: `/profil/[id]` zeigt Tipp-Historie, Statistiken, Punktstufen-Verteilung
sowie besten/schlechtesten Tipp (Aggregate vom Backend), inkl. „nicht gefunden".

**Independent Test**: `/profil/<gültige-id>` → vollständiges Profil; unbekannte id →
„nicht gefunden"; leere Historie → verständlicher Leerzustand.

- [X] T033 [P] [US4] `getPlayerProfile(id)`-Datenfunktion (ISR `revalidate: 60`, `notFound()` bei 404) in `lib/api/players.ts`
- [X] T034 [P] [US4] `StatsSummary` (aggregierte Kennzahlen) in `components/profile/StatsSummary.tsx`
- [X] T035 [P] [US4] `TierDistribution` (Punktstufen-Verteilung) in `components/profile/TierDistribution.tsx`
- [X] T036 [P] [US4] `TipHistory` (Historie inkl. Best/Worst-Hervorhebung; Leerzustand) in `components/profile/TipHistory.tsx`
- [X] T037 [US4] Seite `app/profil/[id]/page.tsx` (Server-Component, ISR): lädt Profil, rendert Stats/Verteilung/Historie, `not-found`/Error-States (nutzt T034–T036)

**Checkpoint**: US1–US4 unabhängig funktionsfähig

---

## Phase 7: User Story 5 - Spieldetails inkl. abgegebener Tipps (Priority: P3)

**Goal**: `/spiel/[id]` zeigt Spieldetails; abgegebene Tipps NUR nach Anpfiff (Backend
liefert vorher keine), inkl. „nicht gefunden".

**Independent Test**: angepfiffenes Spiel → Details + Tipps; nicht angepfiffenes Spiel
→ Details ohne Tipps; unbekannte id → „nicht gefunden".

- [X] T038 [P] [US5] `getMatchDetail(id)`-Datenfunktion (ISR `revalidate: 30`, `notFound()` bei 404) in `lib/api/match-detail.ts`
- [X] T039 [P] [US5] `MatchTips`-Komponente (Liste abgegebener Tipps; rendert nur bei `status !== scheduled`; sonst Hinweis „Tipps erst nach Anpfiff") in `components/match/MatchTips.tsx`
- [X] T040 [US5] Seite `app/spiel/[id]/page.tsx` (Server-Component): rendert Details via `MatchCard` + `MatchTips`, `not-found`/Error-States (nutzt T039)

**Checkpoint**: Alle fünf User Stories unabhängig funktionsfähig

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verbesserungen über mehrere Stories hinweg

- [X] T041 [P] Responsives Verhalten aller Seiten bei ≤ 375 px prüfen/feinschleifen (kein horizontales Scrollen) — SC-006
- [X] T042 [P] Accessibility-Pass (semantische Tabellen/Listen, Fokus, Kontrast) über alle Seiten
- [X] T043 [P] Metadaten/`<title>` je Route und gemeinsame SEO-Defaults in `app/layout.tsx`/Routen
- [X] T044 Konsistenz-Review der Empty-/Error-/Loading-Zustände über alle Routen (FR-013/014/015) sowie Verifikation FR-017/FR-002: `lib/api/types.ts` enthält nur öffentliche Felder, kein Logging personenbezogener/sensibler Daten, keine Auth-/Tipp-/Wett-Pfade
- [X] T045 [P] README/`quickstart.md` final abgleichen (Setup, Env, Self-Hosting, CORS)
- [X] T046 Self-Hosting-Deploy-Artefakte (`deploy/nginx.wm.conf.example`, `deploy/wm-frontend.service`, `DEPLOYMENT.md`) erstellt; CORS verifiziert (Backend sendet aktuell keine ACAO-Header → Lösung in DEPLOYMENT.md: Same-Origin-Proxy ODER Backend-CORS). Verbleibende Infra-Aktion auf dem VServer (außerhalb des Repos): DNS/TLS + eine der CORS-Optionen anwenden.
- [X] T047 Smoke-Test gegen reales Backend bestanden: /spielplan (echte Teams), /leaderboard (echte Namen), /spiel/{id} (Tipps), unbekannte id → 404. /live aktuell leer (kein laufendes Spiel); /profil end-to-end nur mit bekanntem publicId testbar (offen).
- [X] T048 Endpoint-Vertrag gegen reales Backend verifiziert; `lib/api/types.ts`/`endpoints.ts` sind deckungsgleich mit der OpenAPI (Base `/api/public`). Vertrag dokumentiert in contracts/backend-endpoints.md.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: keine Abhängigkeiten — sofort startbar
- **Foundational (Phase 2)**: hängt von Setup ab — BLOCKIERT alle User Stories
- **User Stories (Phase 3–7)**: hängen von Foundational ab; danach parallelisierbar
  oder sequenziell in Prioritätsreihenfolge (P1 → P2 → P3)
- **Polish (Phase 8)**: nach Abschluss der gewünschten User Stories

### User Story Dependencies

- **US1 Spielplan (P1)**: nur Foundational; keine Story-Abhängigkeiten
- **US2 Leaderboard (P2)**: nur Foundational; verlinkt auf Profile (US4), aber
  unabhängig testbar (Link kann ins Leere zeigen, bis US4 fertig ist)
- **US3 Live (P2)**: nur Foundational; nutzt `MatchCard` aus US1 → US1 zuerst
  empfohlen (oder `MatchCard` in Foundational vorziehen, falls parallel)
- **US4 Profil (P3)**: nur Foundational; unabhängig
- **US5 Spieldetail (P3)**: nur Foundational; nutzt `MatchCard` aus US1
- **Hinweis zu US3/US5 ↔ US1**: Die `MatchCard`-Abhängigkeit bricht die
  Story-Unabhängigkeit nicht, da die Umsetzungsreihenfolge P1→P2→P3 US1 ohnehin
  zuerst abschließt. Nur bei striktem Parallelbetrieb `MatchCard` (T019) in die
  Foundational-Phase vorziehen.

### Within Each User Story

- Datenfunktion + Präsentationskomponenten ([P]) zuerst, dann die Seite, die sie zusammenführt
- Optionale Unit-Tests können parallel zur Implementierung entstehen

### Parallel Opportunities

- Setup: T002, T003, T004 parallel
- Foundational: T008, T009, T010 parallel; Tests T014, T015 parallel
- Innerhalb jeder Story: mit `[P]` markierte Komponenten/Datenfunktionen parallel
- Nach Foundational: verschiedene Stories durch verschiedene Entwickler parallel

---

## Parallel Example: User Story 1

```bash
# Datenfunktion + eigenständige Komponenten parallel:
Task: "getMatches in lib/api/matches.ts"
Task: "MatchStatusBadge in components/match/MatchStatusBadge.tsx"
Task: "ScoreDisplay in components/match/ScoreDisplay.tsx"
# danach: MatchCard (T019) → Filter (T020/T021) → Seite (T022)
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup abschließen
2. Phase 2 Foundational abschließen (KRITISCH — blockiert alle Stories)
3. Phase 3 User Story 1 (Spielplan) abschließen
4. **STOP & VALIDATE**: `/spielplan` unabhängig testen
5. Bei Bedarf deployen/demoen

### Incremental Delivery

1. Setup + Foundational → Fundament steht
2. US1 Spielplan → testen → Deploy/Demo (MVP)
3. US2 Leaderboard → testen → Deploy/Demo
4. US3 Live → testen → Deploy/Demo
5. US4 Profil, US5 Spieldetail → testen → Deploy/Demo

---

## Notes

- `[P]` = andere Datei, keine offenen Abhängigkeiten
- `[Story]`-Label verknüpft Task mit User Story zur Nachverfolgbarkeit
- Verfassung beachten: ausschließlich GET, keine Auth/Tipp-/Wett-Logik, keine
  sensiblen Daten, alle Zeiten Europe/Berlin
- Empfehlung: nach jedem Task oder logischer Gruppe committen
- An jedem Checkpoint kann die jeweilige Story unabhängig validiert werden
