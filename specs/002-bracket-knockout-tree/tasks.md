---
description: "Task list for feature: K.o.-Turnierbaum (/bracket)"
---

# Tasks: K.o.-Turnierbaum (/bracket)

**Input**: Design documents from `/specs/002-bracket-knockout-tree/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/bracket-endpoint.md

**Tests**: Gezielte Vitest/RTL-Unit-Tests sind eingeplant (plan.md → Technical Context):
Mapping, Platzhalter-vs-Team, Linking-Regel, `winningSide()`, `hasLiveMatch`. Kein
TDD-First erzwungen (Spec verlangt es nicht); Tests stehen je Story nach der
Implementierung. Playwright-E2E bleibt v1-extern.

**Organization**: Tasks gruppiert nach User Story (US1–US4) für unabhängige Lieferung.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: parallelisierbar (andere Datei, keine offene Abhängigkeit)
- **[Story]**: zugehörige User Story (US1–US4)
- Pfade sind relativ zum Repo-Root (bestehende Next.js-App).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verzeichnisse für die neuen Bausteine anlegen. Keine neuen Abhängigkeiten
(plan.md: bewusst dependency-frei).

- [X] T001 [P] Verzeichnisse `components/bracket/` und `tests/unit/bracket/` anlegen (leere Ordner/Platzhalter), passend zur Projektstruktur in plan.md.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Datentypen, Endpoint, Datenzugriff und View-Logik — gemeinsam von allen
Stories genutzt. **⚠️ Muss vor US1–US4 fertig sein.**

- [X] T002 Bracket-Typen in `lib/api/types.ts` ergänzen: `BracketStage` (`LAST_32 | LAST_16 | QUARTER_FINALS | SEMI_FINALS | THIRD_PLACE | FINAL`), `BracketTeam` (`teamName: string|null`, `placeholder: string|null`), `BracketMatch` (`fifaMatchNo`, `matchId`, `home`, `away`, `homeScore|null`, `awayScore|null`, `status: MatchStatus`, `winner: string|null`, `sourceMatchNos: number[]`, `nextMatchNo: number|null`), `BracketRound` (`stage`, `label`, `matches`), `Bracket` (`rounds`). `MatchStatus` wiederverwenden. (Vertrag: contracts/bracket-endpoint.md)
- [X] T003 [P] `endpoints.bracket()` → `"/bracket"` in `lib/api/endpoints.ts` ergänzen (analog `liveMatches()`).
- [X] T004 `lib/api/bracket.ts` neu: `getBracket()` (ISR via `apiGet<Bracket>(endpoints.bracket(), { revalidate: OVERVIEW_REVALIDATE })`) und `getBracketNoStore({ signal })` (`{ noStore: true, signal }`) für Polling. Abhängig von T002, T003.
- [X] T005 [P] `lib/bracket.ts` neu (reine View-Logik, keine Domänen-Aggregation): `teamDisplay(team)` (`teamName ?? placeholder ?? "—"`), `isPlaceholder(team)`, `isDecided(match)` (beide `teamName` non-null), `winningSide(match): "home"|"away"|null` (Abgleich `winner` gegen `home/away.teamName`, sonst `"HOME"/"AWAY"`, sonst null), `hasLiveMatch(bracket)` (`some status==="IN_PLAY"`), `buildConnectorIndex(bracket)` (`Map<fifaMatchNo, BracketMatch>` + Kanten via `nextMatchNo`). Abhängig von T002. (data-model.md)
- [X] T006 [P] Unit-Test `tests/unit/bracket/logic.test.ts`: `teamDisplay`, `isDecided`, `hasLiveMatch`, `buildConnectorIndex` gegen Fixture aus dem verifizierten Payload. Abhängig von T005.

**Checkpoint**: Daten- und Logikschicht steht — US1–US4 können beginnen.

---

## Phase 3: User Story 1 - Vollständigen K.o.-Baum ansehen (Priority: P1) 🎯 MVP

**Goal**: `/bracket` zeigt alle sechs Runden-Buckets (LAST_32 16, LAST_16 8,
QUARTER_FINALS 4, SEMI_FINALS 2, THIRD_PLACE separat, FINAL 1) mit Teams/Platzhaltern,
Ergebnis, Status — inkl. Gruppenphasen-Platzhalterbaum.

**Independent Test**: `/bracket` aufrufen; korrekte Spielanzahl je Runde, THIRD_PLACE
getrennt, Platzhalter statt leerer Teamnamen (FR-003/004/005/006/009).

- [X] T007 [P] [US1] `components/bracket/BracketMatchCard.tsx` neu: rendert beide Seiten über `teamDisplay()` + `flagEmoji()` (kein Emoji bei Platzhalter), Ergebnis `homeScore:awayScore` (oder neutral, wenn `null`), `MatchStatusBadge`, Anstoßzeit über `formatKickoff()` **nur wenn vorhanden** (FR-005a/015, graceful). **Verlinkung (FR-017):** Karte mit `next/link` auf `/spiel/{matchId}` umschließen **nur** wenn `isDecided(match)` true ist; reine Platzhalter-Karten ohne Link/Hover-Affordance rendern. Abhängig von T002, T005.
- [X] T008 [P] [US1] `components/bracket/BracketRoundColumn.tsx` neu: Runden-`label` als Spaltentitel + Liste der `BracketMatchCard` der Runde. Abhängig von T007.
- [X] T009 [US1] `components/bracket/BracketView.tsx` neu: **`THIRD_PLACE` aus `rounds[]` herausfiltern** (es kommt im Payload zwischen `SEMI_FINALS` und `FINAL`) und in einer eigenen Region rendern; die **fünf Spalten sind genau** LAST_32 → LAST_16 → QUARTER_FINALS → SEMI_FINALS → FINAL (in dieser Reihenfolge). Fehlende Runde/THIRD_PLACE wird ausgelassen (FR-014). Abhängig von T008.
- [X] T010 [US1] `app/bracket/page.tsx` neu (Server-Component, ISR): `getBracket()` laden, bei Erfolg `BracketView` rendern, bei `ApiError` `ErrorState` (FR-013), bei leerem `rounds` `EmptyState` (FR-014). **FR-005a-Entscheidung (MVP):** Wenn `/bracket` keine Anstoßzeit je Spiel liefert (im verifizierten Gruppenphasen-Payload nicht enthalten), hier serverseitig `getSchedule()` laden und Kickoff per `matchId` zuordnen (reine Anzeige, keine neue Datenquelle); andernfalls Feld der Bracket-Antwort nutzen. Abhängig von T004, T009.
- [X] T011 [P] [US1] `app/bracket/loading.tsx` neu: Skeleton analog zu bestehenden `loading.tsx` (Spalten-/Karten-Platzhalter).
- [X] T012 [US1] In `components/layout/Nav.tsx` Link `{ href: "/bracket", label: "Baum" }` in `links` ergänzen (FR-016).
- [X] T013 [P] [US1] Unit-Test `tests/unit/bracket/match-card.test.tsx`: Platzhalter- vs. Team-Anzeige, Ergebnis-/Status-Darstellung **und Linking-Regel (FR-017): feststehende Paarung → Link auf `/spiel/{matchId}`; Platzhalter-Karte → kein Link**. Abhängig von T007.

**Checkpoint**: `/bracket` ist eigenständig nutzbar (statischer/Platzhalter-Baum). MVP.

---

## Phase 4: User Story 2 - Turnierpfad & nachrückende Gewinner (Priority: P2)

**Goal**: Verbindungslinien zeigen den Pfad; Gewinner werden hervorgehoben und rücken in
die Folge-Paarung nach (FR-007/008).

**Independent Test**: Bei teilweise vorliegenden Ergebnissen sind Linien zwischen
Runden sichtbar und der Gewinner erscheint im Folgespiel (Platzhalter → Teamname).

- [X] T014 [P] [US2] `components/bracket/BracketConnectors.tsx` neu: zeichnet Verbindungslinien (SVG/CSS, keine neue Dependency) zwischen Spalten anhand `buildConnectorIndex()` (`fifaMatchNo`/`nextMatchNo`). Abhängig von T005, T009.
- [X] T015 [US2] Connectors in `components/bracket/BracketView.tsx` zwischen benachbarten Spalten positionieren (responsiv, ohne Layoutbruch). Abhängig von T014.
- [X] T016 [US2] Gewinner-Hervorhebung in `components/bracket/BracketMatchCard.tsx` über `winningSide()` (Sieger-Seite visuell markieren); nachgerücktes Team wird automatisch über `teamName` der Folge-Paarung angezeigt (kein eigenes Ableiten). Abhängig von T007, T005.
- [X] T017 [P] [US2] Unit-Test `tests/unit/bracket/path.test.ts`: `winningSide()`-Fälle (HOME/AWAY/Teamname/null) und Connector-Kanten gegen Fixture. Abhängig von T005, T014.

**Checkpoint**: US1 + US2 funktionieren unabhängig.

---

## Phase 5: User Story 3 - Turnierbaum auf Mobilgeräten bedienen (Priority: P2)

**Goal**: Auf ≤ 375 px ist der Gesamtbaum horizontal scrollbar und je Runde per
Schnellnavigation anspringbar; Desktop bleibt fünfspaltig (FR-011/012, Clarification).

**Independent Test**: Auf schmalem Viewport ist der gesamte Baum per Scrollen erreichbar
und die Rundennavigation springt zur gewählten Runde.

- [X] T018 [US3] `components/bracket/BracketView.tsx`: horizontalen Scroll-Container (`overflow-x-auto`) für schmale Viewports, Spalten behalten Mindestbreite; Desktop unverändert nebeneinander. Abhängig von T009.
- [X] T019 [P] [US3] `components/bracket/RoundNav.tsx` neu: Sprungmarken LAST_32…FINAL (Anker/`scrollIntoView`), nur auf Mobil sichtbar. Abhängig von T009.
- [X] T020 [US3] `RoundNav` in `BracketView` einbinden; jede Runde erhält ein Anker-/`id`-Ziel. Abhängig von T018, T019.

**Checkpoint**: US1–US3 funktionieren unabhängig.

---

## Phase 6: User Story 4 - Aktuelle Ergebnisse ohne Neuladen (Priority: P3)

**Goal**: ISR-Basis + clientseitiges Polling (30–60 s), das **nur** läuft, solange ≥1
Spiel `IN_PLAY` ist (FR-010).

**Independent Test**: Während ein K.o.-Spiel live ist, aktualisiert sich der Baum ohne
Neuladen (≤ 60 s); ist kein Spiel live, kein Polling.

- [X] T021 [US4] `app/bracket/BracketLive.tsx` neu (`'use client'`): nimmt Server-`Bracket` als Initialwert, rendert `BracketView`; startet `usePolling(getBracketNoStore, 45_000)` **nur**, wenn `hasLiveMatch(initial)` bzw. zuletzt geladene Daten ein `IN_PLAY` enthalten; zeigt „aktualisiert vor …" analog `LiveMatches`. Abhängig von T004, T005, T009.
- [X] T022 [US4] `app/bracket/page.tsx`: geladenes `Bracket` an `BracketLive` übergeben und Darstellung über die Client-Komponente leiten (ISR bleibt Basis). Abhängig von T021, T010.
- [X] T023 [P] [US4] Unit-Test `tests/unit/bracket/live.test.ts`: Polling-Aktivierung nur bei `hasLiveMatch` (an/aus) gegen Fixtures. Abhängig von T005.

**Checkpoint**: Alle vier User Stories funktionieren unabhängig.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verifikation offener TBCs, Qualitätssicherung, Verfassungstreue.

- [X] T024 [P] TBC abschließend verifizieren (contracts/bracket-endpoint.md): exakte `winner`-Gestalt an einem realen/beendeten Spiel prüfen und `winningSide()` ggf. anpassen. Die Kickoff-Quelle wird bereits in T010 entschieden/umgesetzt; hier nur gegen reale K.o.-Daten gegenprüfen (Zeit korrekt, Europe/Berlin).
- [X] T025 Lint, Typecheck und Tests grün: `npm run lint && npm run typecheck && npm run test`.
- [ ] T026 [P] quickstart.md-Akzeptanzchecks manuell durchgehen (FR-Mapping inkl. Mobil ≤ 375 px, Error/Empty, Polling-Verhalten).
- [X] T027 [P] Verfassungs-Re-Check: nur `GET`, keine neuen Abhängigkeiten, Zeiten in Europe/Berlin, keine sensiblen Felder/Persistenz (constitution.md).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: keine Abhängigkeiten — sofort startbar.
- **Foundational (Phase 2)**: nach Setup; **blockiert alle User Stories**.
- **User Stories (Phase 3–6)**: nach Phase 2. US1 ist MVP; US2/US3/US4 bauen auf
  US1-Komponenten (`BracketView`/`BracketMatchCard`) auf und sind danach unabhängig
  testbar.
- **Polish (Phase 7)**: nach den gewünschten Stories.

### User Story Dependencies

- **US1 (P1)**: nur Phase 2. Eigenständige MVP-Auslieferung.
- **US2 (P2)**: nutzt `BracketView`/`BracketMatchCard` aus US1 (T009/T007); danach unabhängig.
- **US3 (P2)**: nutzt `BracketView` aus US1 (T009); unabhängig von US2.
- **US4 (P3)**: nutzt `BracketView` (T009) + Datenzugriff (T004); unabhängig von US2/US3.

### Within Each User Story

- Karten/Spalten (Komponenten) vor `BracketView`-Assemblierung.
- `BracketView` vor Connectors/Mobil/Live-Integration.
- Unit-Tests je Story nach der jeweiligen Implementierung.

### Parallel Opportunities

- Phase 2: T003, T005 parallel (nach T002); T006 nach T005.
- US1: T007 ∥ T011; T013 nach T007. (T008→T009→T010→T012 seriell.)
- US2: T014 ∥ T016; T017 nach T014.
- US3: T019 parallel zu T018-Vorarbeit; T020 verbindet beide.
- Polish: T024, T026, T027 parallel; T025 als Gate.
- Bei mehreren Entwickler:innen können US2, US3, US4 nach US1 parallel laufen.

---

## Parallel Example: User Story 1

```bash
# Nach Phase 2 — parallel startbar:
Task: "T007 BracketMatchCard.tsx (Teams/Platzhalter, Score, Status, Kickoff)"
Task: "T011 app/bracket/loading.tsx Skeleton"
# danach seriell: T008 RoundColumn → T009 BracketView → T010 page.tsx → T012 Nav-Link
# parallel zur Story: T013 match-card.test.tsx (nach T007)
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup → 2. Phase 2 Foundational (kritisch, blockiert alles) →
3. Phase 3 US1 → 4. **STOP & VALIDATE**: `/bracket` zeigt vollständigen
   (Platzhalter-)Baum → 5. Deploy/Demo.

### Incremental Delivery

1. Setup + Foundational → Fundament steht.
2. US1 → unabhängig testen → MVP-Demo (statischer/Platzhalter-Baum).
3. US2 → Pfadlinien & Gewinner-Nachrücken.
4. US3 → mobile Bedienung.
5. US4 → Live-Aktualität (bedingtes Polling).
6. Polish → TBC-Verifikation + QA.

### Parallel Team Strategy

Nach Foundational: Entwickler A = US2, B = US3, C = US4 (jeweils auf US1 aufbauend),
unabhängig integrierbar.

---

## Notes

- [P] = andere Datei, keine offene Abhängigkeit.
- Keine neuen npm-Abhängigkeiten (Connectors via SVG/CSS).
- Read-only: ausschließlich `GET /api/public/bracket`; Pfad/Gewinner/Platzhalter kommen
  vom Backend (keine Frontend-Ableitung).
- Commit nach jedem Task oder logischer Gruppe; an Checkpoints Story-Unabhängigkeit prüfen.
