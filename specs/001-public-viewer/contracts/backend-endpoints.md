# Contract: Backend Public GET-Endpoints (verifiziert)

**Read-only** Vertrag der konsumierten Endpoints, am 2026-06-19 gegen das laufende
Backend (`https://api.wm.xenoria.de/api/public`) verifiziert (T048). Quelle: die vom
Backend bereitgestellte OpenAPI 3.0.3. Maßgeblich für `lib/api/types.ts` und
`lib/api/endpoints.ts`.

> Base-Path: **`/api/public`** (in `NEXT_PUBLIC_API_BASE_URL` enthalten).
> Nur `GET`. Keine Authentifizierung. Keine sensiblen Felder (keine Discord-ID,
> E-Mail, Tokens). Zeitpunkte in UTC (ISO-8601).

## GET /schedule  *(Spielplan)*

- **Query (optional)**: `stage`, `group`, `matchday`.
- **200**: `Match[]` (verifiziert: 104 Spiele). Leere Liste statt Fehler.
- **Match**: `matchId` (int64), `home`, `away` (string), `kickoffUtc` (UTC),
  `stage` (z. B. `GROUP_STAGE`), `group` (nullable), `tvChannel` (nullable),
  `oddsHome/oddsDraw/oddsAway` (nullable number), `homeScore/awayScore` (nullable),
  `status` (`SCHEDULED|IN_PLAY|FINISHED|POSTPONED|CANCELLED`), `matchday` (nullable).

## GET /matches/live  *(Live)*

- **200**: `LiveMatch[]` (nur `status=IN_PLAY`); leere Liste, wenn keines läuft
  (verifiziert: `[]`). Felder: `matchId, home, away, kickoffUtc, homeScore,
  awayScore, status`.
- Clientseitiges Polling → **CORS erforderlich** (siehe Hinweis unten).

## GET /leaderboard  *(Rangliste)*

- **200**: `LeaderboardRow[]`, nach Rang sortiert (verifiziert: 8 Einträge).
- **LeaderboardRow**: `rank, displayName, points, exactHits, rankChange`
  (`rankChange` ist ein vorformatierter String: `"NEU" | "↑n" | "↓n" | "–"`).
- ⚠️ **Kein `publicId`** → aktuell keine Verlinkung Rangliste → Profil möglich
  (betrifft FR-006; siehe offener Punkt).

## GET /matches/{matchId}/tips  *(Tipps eines Spiels)*

- **200**: `MatchTips` = `{ matchId, released: boolean, tips: PublicTip[] }`.
  `released=false` (+ `tips=[]`) solange `now() < kickoff` ODER nicht revealed.
  **PublicTip**: `displayName, tipHome, tipAway, points` (points nullable).
  (verifiziert an beendetem Spiel: `released=true`, 4 Tipps.)
- **404**: unbekanntes Spiel (verifiziert) → `notFound()`.

## GET /players/{publicId}  *(Spielerprofil)*

- **200**: `Profile` = `publicId, displayName, rank? , points, exactHits,
  evaluatedTips, hitRatePercent?, distribution {p4,p3,p2,p0}, bestTip?, worstTip?,
  history: ProfileTip[]`.
  **ProfileTip**: `home, away, tipHome, tipAway, resultHome?, resultAway?, points`.
- **404**: unbekannter Identifier → `notFound()`.
- `publicId` ist HMAC-abgeleitet (nicht die Discord-ID) und **nicht** über andere
  Endpoints auffindbar — Profile werden ausschließlich über direkte/geteilte Links
  erreicht. (Daher in dieser Umgebung nicht end-to-end smoke-getestet.)

## Fehlerkonventionen

| Situation | Frontend-Reaktion |
|-----------|-------------------|
| Netzwerk-/5xx-Fehler | `ErrorState` mit Wiederholen (FR-013) |
| 404 (Tips/Profil) | `notFound()` (FR-015) |
| 200 mit leerer Menge | `EmptyState` (FR-014) |
| Fehlende optionale Felder | Feld auslassen/neutral darstellen |

## Verifikationsergebnis (2026-06-19)

- [x] Pfade/Methoden bestätigt (alle `GET`, Base `/api/public`).
- [x] Feldnamen/Typen mit `lib/api/types.ts` abgeglichen — **deckungsgleich**.
- [x] Live-Endpoint vorhanden (`/matches/live`).
- [x] `kickoffUtc` ist UTC/ISO-8601.
- [x] Tipp-Sichtbarkeit über `released` (Backend erzwingt Regel).
- [ ] **CORS** für `https://wm.xenoria.de` am Live-Endpoint: **fehlt aktuell** →
      Backend-seitig ergänzen ODER API per nginx unter dem Frontend-Origin
      proxien (Same-Origin, kein CORS nötig). Siehe `DEPLOYMENT.md`.
- [ ] **`publicId` in `LeaderboardRow`** ergänzen, um FR-006 (Profil-Verlinkung)
      zu erfüllen — offene Produktentscheidung.
