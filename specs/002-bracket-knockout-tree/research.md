# Research: K.o.-Turnierbaum (/bracket)

Phase 0. Ziel: alle offenen Punkte der Spec/Technical-Context auflösen. Der einzige
Spec-seitig zur Planung verschobene Punkt war das **Antwort-Schema von
`/api/public/bracket`** — am 2026-06-19 direkt gegen das laufende Backend verifiziert.

## 1. Endpoint-Existenz & Schema (war: NEEDS CLARIFICATION)

- **Decision**: `GET /api/public/bracket` existiert und liefert `200` mit
  `{ rounds: BracketRound[] }`. Verifiziert gegen `https://api.wm.xenoria.de/api/public/bracket`
  (HTTP 200, ~8.7 KB, 6 Runden, 32 Spiele).
- **Beobachtetes Schema** (maßgeblich für `lib/api/types.ts`):
  - `rounds[]`: `{ stage, label, matches[] }`, bereits in Turnierreihenfolge geliefert:
    `LAST_32`(16) → `LAST_16`(8) → `QUARTER_FINALS`(4) → `SEMI_FINALS`(2) →
    **`THIRD_PLACE`(1)** → `FINAL`(1). `label` ist die deutsche Anzeige
    („Sechzehntelfinale" … „Finale", „Spiel um Platz 3").
  - `matches[]` Element: `fifaMatchNo` (int), `matchId` (int, echte Spiel-ID),
    `home`/`away` (`{ teamName: string|null, placeholder: string|null }`),
    `homeScore`/`awayScore` (int|null), `status` (`MatchStatus`),
    `winner` (null in der Gruppenphase), `sourceMatchNos` (int[]), `nextMatchNo` (int|null).
- **Rationale**: Das Backend liefert Struktur, Reihenfolge, Platzhaltertexte und
  Pfad-Verknüpfung bereits fertig → das Frontend rendert nur (Verfassung II; FR-006/008).
- **Alternatives considered**: Baum aus `/schedule` (`stage`-Werten) selbst rekonstruieren
  — verworfen: erzwänge frontend-seitige Domänenlogik (Pfad/Platzhalter/Gewinner) gegen
  Prinzip II und FR-006/008.

## 2. Platzhalter vs. Team (FR-006)

- **Decision**: Pro Seite gilt: `teamName` wenn non-null, sonst `placeholder` anzeigen.
  Beobachtete Platzhalter exakt wie in der Spec genannt: „Sieger Gruppe A", „Zweiter
  Gruppe B", „Dritter A/B/C/D/F", in Folgerunden „Sieger Match 101", „Verlierer Match 101".
- **Rationale**: Texte kommen vom Backend; keine eigene Generierung (FR-006).
- **Alternatives considered**: Eigene Platzhalter-Texte ableiten — verworfen (Prinzip II).

## 3. Pfad-Verknüpfung & Verbindungslinien (FR-007/008)

- **Decision**: Der Graph wird über **`fifaMatchNo`** gebildet: ein Spiel speist das Spiel
  mit `nextMatchNo`; ein Folgespiel listet seine Quellen in `sourceMatchNos` (verifiziert:
  FINAL `fifaMatchNo` 104 hat `sourceMatchNos` [101,102]; THIRD_PLACE 103 ebenfalls
  [101,102]). Verbindungslinien werden client-/layoutseitig aus diesen Referenzen
  gezeichnet (SVG/CSS), nicht aus Reihenfolge geraten.
- **Gewinner-Nachrücken**: Sobald ein Spiel beendet ist, füllt das Backend `teamName` in
  der Folge-Paarung (und setzt `winner`). Das Frontend hebt im Spiel selbst die
  Gewinnerseite hervor (über `winner`) und zeigt nachgerückte Teams automatisch, weil der
  nächste `placeholder` durch `teamName` ersetzt wird. Das Frontend leitet **keinen**
  Gewinner aus dem Tor-Ergebnis ab (FR-008; deckt Verlängerung/Elfmeter ab).
- **Offener Detailpunkt (nicht blockierend)**: Die exakte Gestalt von `winner` ist während
  der Gruppenphase nicht beobachtbar (überall `null`). Annahme: String (Seitenkennung
  `"HOME"`/`"AWAY"` **oder** Teamname). Mapping wird defensiv implementiert (Abgleich gegen
  `home.teamName`/`away.teamName`, Fallback ohne Hervorhebung) und gegen ein beendetes
  Spiel re-verifiziert, sobald die K.o.-Phase Daten liefert. Im Contract als „TBC" markiert.

## 4. Datenaktualität: ISR-Basis + bedingtes Polling (FR-010)

- **Decision**: Server-Component lädt mit ISR (`revalidate: 60`, analog
  `OVERVIEW_REVALIDATE`). Eine Client-Component (`BracketLive.tsx`) übernimmt die
  Server-Daten als Initialwert und startet `usePolling` (45 s, Korridor 30–60 s) **nur**,
  wenn mindestens ein Spiel `status === "IN_PLAY"` ist; andernfalls bleibt es bei ISR.
- **Rationale**: Spiegelt das etablierte Muster (`/live` pollt, Übersichtsseiten ISR) und
  vermeidet unnötige Last während der gruppen-/spielfreien Phase. Kein WebSocket (v1).
- **Alternatives considered**: Dauerpolling wie `/live` (verworfen: überflüssige Last bei
  meist statischem Baum); reines ISR (verworfen: spürbarer Lag während Live-K.o.-Spielen).

## 5. Verbindungslinien-Technik (keine neue Dependency)

- **Decision**: Verbindungslinien rein mit CSS (Pseudo-Elemente/Border) bzw. einem
  leichten SVG-Overlay; kein Bracket-/Graph-NPM-Paket.
- **Rationale**: YAGNI / „Einfachheit zuerst"; 6 feste Runden mit bekannter Topologie
  erfordern kein Framework.
- **Alternatives considered**: `react-brackets`/`d3` — verworfen (Bundle-Gewicht,
  Stilbruch, Prinzip V).

## 6. Mobile Darstellung (FR-011/012, Clarification)

- **Decision**: Desktop = fünf Spalten nebeneinander (THIRD_PLACE separat unter/neben
  FINAL). Mobil = derselbe Baum in einem horizontal scrollbaren Container
  (`overflow-x: auto`) plus `RoundNav` mit Sprungmarken (Anker/`scrollIntoView`) zu jeder
  Runde. Keine separate „nur eine Runde"-Ansicht nötig.
- **Rationale**: Erhält die Gesamtstruktur (Clarification) und ist mit Tailwind ohne
  Zusatz-Logik umsetzbar.

## 7. Verlinkung K.o.-Spiel → Spieldetail (FR-017)

- **Decision**: `BracketMatchCard` umschließt sich mit `next/link` zu `/spiel/{matchId}`
  **nur**, wenn das Spiel reale Teams hat (beide `teamName` non-null) **und** eine
  `matchId` trägt. Reine Platzhalter-Karten sind nicht klickbar (kein Link, kein
  Hover-Affordance). `matchId` ist im Schema durchgängig vorhanden, daher ist die echte
  Bedingung „Paarung steht fest" (Teamnamen vorhanden).
- **Rationale**: Reuse der bestehenden `/spiel/[id]`-Seite; klare Affordance (FR-017).

## 8. Reuse-Inventar (Prinzip V)

| Bedarf | Bestehender Baustein |
|--------|----------------------|
| GET-Fetch + Fehler-Mapping | `lib/api/client.ts` (`apiGet`, `ApiError`) |
| ISR/`noStore`-Optionen | `ApiGetOptions` (`revalidate` / `noStore`) |
| Polling-Hook | `hooks/usePolling.ts` |
| Statuskennzeichnung | `components/match/MatchStatusBadge.tsx` |
| Flaggen-Emoji | `lib/flags.ts` (`flagEmoji(name)`) |
| Zeitformat Europe/Berlin | `lib/datetime.ts` (`formatKickoff`/`formatDate`) |
| Empty/Error/Loading | `components/feedback/*` |
| Revalidierungskonstante | `OVERVIEW_REVALIDATE` (60 s) aus `lib/api/matches.ts` |

## Ergebnis

Alle NEEDS-CLARIFICATION-Punkte aufgelöst; ein nicht blockierender Detailpunkt (`winner`-
Gestalt) ist als TBC dokumentiert und defensiv eingeplant. Bereit für Phase 1.
