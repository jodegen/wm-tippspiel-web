# Quickstart: K.o.-Turnierbaum (/bracket)

## Voraussetzungen

- Node.js 20 LTS, Abhängigkeiten installiert (`npm install`) — keine neuen Pakete für
  dieses Feature.
- `.env` mit `NEXT_PUBLIC_API_BASE_URL=https://api.wm.xenoria.de/api/public`
  (bereits in `.env.production` gesetzt).

## Lokal starten

```bash
npm run dev        # Dev-Server (http://localhost:3000)
# oder produktionsnah:
npm run build && npm run start
```

Seite öffnen: `http://localhost:3000/bracket`

## Endpoint manuell prüfen

```bash
curl -s https://api.wm.xenoria.de/api/public/bracket | head -c 400
# erwartet: {"rounds":[{"stage":"LAST_32","label":"Sechzehntelfinale","matches":[...]}]}
```

## Manuelle Akzeptanz-Checks (Spec-Mapping)

- **US1 / FR-003/004/005**: `/bracket` zeigt sechs Runden-Buckets — LAST_32(16),
  LAST_16(8), QUARTER_FINALS(4), SEMI_FINALS(2), THIRD_PLACE separat, FINAL(1).
- **US1 / FR-006/009**: In der Gruppenphase erscheinen je Spiel Platzhalter
  („Sieger Gruppe A", „Dritter A/B/C/D/F"), keine leeren/falschen Teamnamen.
- **US2 / FR-007/008**: Verbindungslinien führen von jedem Spiel zu seinem Folgespiel;
  bei einem beendeten Spiel erscheint der Gewinner in der Folge-Paarung (Platzhalter →
  Teamname) und die Gewinnerseite ist hervorgehoben.
- **FR-017**: Ein Spiel mit feststehenden Teams ist klickbar → `/spiel/{matchId}`;
  reine Platzhalter-Spiele sind nicht klickbar.
- **US3 / FR-011/012**: Desktop = fünf Spalten nebeneinander; bei ≤ 375 px ist der Baum
  horizontal scrollbar und die Rundennavigation springt zur gewählten Runde.
- **US4 / FR-010**: Während ein K.o.-Spiel `IN_PLAY` ist, aktualisiert sich der Baum ohne
  Neuladen (≤ 60 s). Ist kein Spiel live, bleibt es bei ISR (kein Polling).
- **FR-013/014**: Backend nicht erreichbar → `ErrorState` mit Wiederholen; leerer/teilweiser
  Baum → Platzhalter-Darstellung statt Absturz; fehlendes THIRD_PLACE → Bereich entfällt.
- **FR-015 / FR-005a**: Falls Anstoßzeiten geliefert werden, in Europe/Berlin (über
  `formatKickoff`), unabhängig von der Gerätezeitzone.

## Tests

```bash
npm run test       # Vitest: Bracket-Mapping, Platzhalter/Team, Linking-Regel, hasLiveMatch
npm run lint && npm run typecheck
```
