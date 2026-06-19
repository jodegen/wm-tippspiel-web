# Contract: Backend Public GET-Endpoints

Aus der Spec abgeleiteter, **read-only** Vertrag der vom Frontend konsumierten
Endpoints. Maßgeblich für die Frontend-Sicht; **bei Implementierungsstart gegen das
reale WM-Tippspiel-Backend zu verifizieren** und ggf. im zentralen API-Client
(`lib/api/`) anzugleichen. Pfade relativ zu `NEXT_PUBLIC_API_BASE_URL`.

> Nur `GET`. Keine Authentifizierung. Es werden ausschließlich öffentliche Felder
> erwartet (Verfassungsprinzipien I, III, IV).

## GET /matches  *(Spielplan)*

- **Zweck**: Liste aller Spiele für `/spielplan`.
- **Query (optional, serverseitig oder clientseitig gefiltert)**:
  - `phase=group|knockout`
  - `group=A..H` (nur bei `phase=group`)
  - `round=round-of-16|quarter|semi|final` (nur bei `phase=knockout`)
  - `matchday=<id>`
- **Response 200**: `Match[]` (siehe data-model.md).
- **Frontend-Verhalten**: Filter „Phase (Gruppe oder K.o.) UND Spieltag"; leere
  Liste → EmptyState (FR-014).

## GET /matches/{id}  *(Spieldetail)*

- **Zweck**: Detail eines Spiels für `/spiel/[id]`.
- **Response 200**: `Match` + `tips: TipEntry[]`.
  - Vor Anpfiff (`status = scheduled`): `tips` fehlt oder ist leer — Backend liefert
    keine Tipps (FR-008).
- **Response 404**: unbekannter Identifier → `notFound()` (FR-015).

## GET /matches/live  *(Live)*

- **Zweck**: Aktuell laufende Spiele für `/live` (clientseitiges Polling 30–60 s).
- **Response 200**: `Match[]` mit `status = live` und aktuellem `result`.
- **Frontend-Verhalten**: leere Liste → Hinweis „aktuell keine laufenden Spiele"
  (FR-009/SC-004). Bei einzelnem Poll-Fehler letzten Stand beibehalten.
- **Hinweis**: Wird vom Browser aufgerufen → CORS für Site-Origin erforderlich.
  (Falls kein dedizierter Live-Endpoint existiert: Fallback auf `GET /matches`
  clientseitig nach `status = live` filtern.)

## GET /leaderboard  *(Rangliste)*

- **Zweck**: Vollständige Rangliste für `/leaderboard`.
- **Response 200**: `LeaderboardEntry[]` — ALLE Teilnehmer (kein Top-N, FR-005),
  sortiert nach `rank`.
- **Felder**: inkl. `rankDelta`/`rankDirection` (Bezug: vorheriger Spieltag).

## GET /players/{id}  *(Spielerprofil)*

- **Zweck**: Profil für `/profil/[id]` über öffentlichen Identifier.
- **Response 200**: `PlayerProfile` inkl. fertig aggregierter `stats`,
  `tierDistribution`, `bestTip`, `worstTip`, `history` (Aggregate vom Backend,
  FR-007).
- **Response 404**: unbekannter Identifier → „nicht gefunden" (FR-015).

## Fehlerkonventionen (alle Endpoints)

| Situation | Frontend-Reaktion |
|-----------|-------------------|
| Netzwerk-/5xx-Fehler | `ErrorState` mit Wiederholen (FR-013) |
| 404 (Detail/Profil) | `notFound()` / „nicht gefunden" (FR-015) |
| 200 mit leerer Menge | `EmptyState` (FR-014) |
| Fehlende optionale Felder | Feld auslassen/neutral darstellen (Edge Cases) |

## Verifikations-Checkliste (vor Implementierung)

- [ ] Reale Pfade/Methoden bestätigt (alle `GET`).
- [ ] Feldnamen/Typen mit `lib/api/types.ts` abgeglichen.
- [ ] Live-Endpoint vorhanden? sonst Fallback-Filter dokumentiert.
- [ ] `kickoff` ist UTC/ISO 8601 (für korrekte Europe/Berlin-Anzeige).
- [ ] CORS erlaubt Site-Origin für Live-Polling.
- [ ] Tipps werden vor Anpfiff nicht geliefert (Sichtbarkeitsregel backend-seitig).
