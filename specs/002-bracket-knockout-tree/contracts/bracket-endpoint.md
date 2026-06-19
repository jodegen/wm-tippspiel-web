# Contract: GET /api/public/bracket (verifiziert)

**Read-only** Vertrag des K.o.-Baum-Endpoints, am 2026-06-19 gegen das laufende Backend
(`https://api.wm.xenoria.de/api/public/bracket`) verifiziert (HTTP 200, ~8.7 KB).
Maßgeblich für `lib/api/types.ts` und `lib/api/endpoints.ts`/`lib/api/bracket.ts`.

> Base-Path: **`/api/public`** (in `NEXT_PUBLIC_API_BASE_URL` enthalten).
> Nur `GET`. Keine Authentifizierung. Keine sensiblen Felder. Score `null` ohne Ergebnis.

## GET /bracket  *(K.o.-Turnierbaum)*

- **Query**: keine.
- **200**: `{ rounds: BracketRound[] }`. In der Gruppenphase vollständig mit Platzhaltern
  gefüllt (verifiziert: alle `teamName=null`, `status="SCHEDULED"`, `winner=null`).
- **BracketRound**: `stage`, `label` (deutsch), `matches[]`.
  - Reihenfolge & Anzahl (verifiziert): `LAST_32`(16), `LAST_16`(8), `QUARTER_FINALS`(4),
    `SEMI_FINALS`(2), `THIRD_PLACE`(1), `FINAL`(1) — 32 Spiele gesamt.
- **BracketMatch**: `fifaMatchNo` (int), `matchId` (int), `home`/`away` (BracketTeam),
  `homeScore`/`awayScore` (int|null), `status`
  (`SCHEDULED|IN_PLAY|FINISHED|POSTPONED|CANCELLED`), `winner` (siehe TBC),
  `sourceMatchNos` (int[]), `nextMatchNo` (int|null).
- **BracketTeam**: `teamName` (string|null), `placeholder` (string|null).

### Pfad-Verknüpfung (verifiziert)

- Kante über `fifaMatchNo`: `match.nextMatchNo` zeigt auf das Folgespiel; das Folgespiel
  führt seine Quellen in `sourceMatchNos`.
- Beispiel: `FINAL` (`fifaMatchNo` 104) → `sourceMatchNos: [101, 102]`, `nextMatchNo: null`.
  `THIRD_PLACE` (103) → `sourceMatchNos: [101, 102]`. LAST_32-Spiele: `sourceMatchNos: []`.

### Beispiel (LAST_32, Gruppenphase)

```json
{
  "fifaMatchNo": 73, "matchId": 537417,
  "home": { "teamName": null, "placeholder": "Sieger Gruppe A" },
  "away": { "teamName": null, "placeholder": "Zweiter Gruppe B" },
  "homeScore": null, "awayScore": null,
  "status": "SCHEDULED", "winner": null,
  "sourceMatchNos": [], "nextMatchNo": 90
}
```

## Offene Punkte (TBC — nicht blockierend)

- **`winner`-Gestalt**: In der Gruppenphase überall `null`; ob das Backend einen Teamnamen
  oder eine Seitenkennung (`"HOME"`/`"AWAY"`) liefert, ist noch nicht beobachtbar. Frontend
  implementiert `winningSide()` defensiv (Abgleich gegen `teamName`, sonst Seitenkennung,
  sonst keine Hervorhebung) und re-verifiziert gegen ein beendetes K.o.-Spiel.
- **Anstoßzeit (`kickoffUtc`)**: Im beobachteten Gruppenphasen-Payload **nicht** je
  BracketMatch enthalten. FR-005a (Anstoßzeit je Spiel) wird daher umgesetzt, **sofern**
  das Feld geliefert wird; andernfalls Anstoßzeit auslassen (graceful). Beim Verdrahten ist
  zu prüfen, ob `/bracket` ein Zeitfeld ergänzt oder die Zeit aus `/schedule` per `matchId`
  zugeordnet werden muss (in Tasks zu klären; reine Anzeige, keine neue Datenquelle).

## Fehlerkonventionen

| Situation | Frontend-Reaktion |
|-----------|-------------------|
| Netzwerk-/5xx-Fehler | `ErrorState` mit Wiederholen (FR-013) |
| 200 mit leerem/teilweisem Baum | mit Platzhaltern rendern; fehlende Runde/THIRD_PLACE auslassen (FR-014) |
| Fehlende optionale Felder (Score, Zeit) | Feld auslassen/neutral darstellen |

## Verifikationsergebnis (2026-06-19)

- [x] Pfad/Methode bestätigt (`GET /api/public/bracket`, Base `/api/public`).
- [x] Top-Level `{ rounds }`, 6 Runden, 32 Spiele, Anzahl je Runde 16/8/4/2/1/1.
- [x] Feldnamen je BracketMatch/BracketTeam erfasst.
- [x] Pfad-Verknüpfung über `fifaMatchNo`/`sourceMatchNos`/`nextMatchNo` bestätigt.
- [x] Gruppenphasen-Zustand: durchgängig Platzhalter, `SCHEDULED`, `winner=null`.
- [ ] **`winner`-Gestalt** an beendetem Spiel re-verifizieren (TBC).
- [ ] **Anstoßzeit-Feld** je BracketMatch klären (TBC, FR-005a).
