# Data Model: K.o.-Turnierbaum (/bracket)

Frontend-Sicht der `GET /api/public/bracket`-Antwort (read-only). Maßgeblich für die
Erweiterung von `lib/api/types.ts`. Wiederverwendet den bestehenden `MatchStatus`-Typ.

## Entities

### Bracket (Wurzel)

| Feld | Typ | Hinweise |
|------|-----|----------|
| `rounds` | `BracketRound[]` | Bereits in Turnierreihenfolge geliefert |

### BracketRound

| Feld | Typ | Hinweise |
|------|-----|----------|
| `stage` | `BracketStage` | `LAST_32 \| LAST_16 \| QUARTER_FINALS \| SEMI_FINALS \| THIRD_PLACE \| FINAL` |
| `label` | `string` | Deutsche Anzeige vom Backend („Sechzehntelfinale" … „Finale") |
| `matches` | `BracketMatch[]` | Erwartete Anzahl: 16 / 8 / 4 / 2 / 1 / 1 |

### BracketMatch

| Feld | Typ | Hinweise |
|------|-----|----------|
| `fifaMatchNo` | `number` | Logische Spielnummer; Schlüssel der Pfad-Verknüpfung |
| `matchId` | `number` | Echte Backend-Spiel-ID → Link `/spiel/{matchId}` (FR-017) |
| `home` | `BracketTeam` | Heimseite |
| `away` | `BracketTeam` | Auswärtsseite |
| `homeScore` | `number \| null` | `null` ohne Ergebnis |
| `awayScore` | `number \| null` | `null` ohne Ergebnis |
| `status` | `MatchStatus` | Wiederverwendeter Enum-Typ |
| `winner` | `string \| null` | Gewinnerkennung; Gestalt TBC (siehe Contract). `null`, solange offen |
| `sourceMatchNos` | `number[]` | `fifaMatchNo` der speisenden Spiele (leer in LAST_32) |
| `nextMatchNo` | `number \| null` | `fifaMatchNo` des Folgespiels; `null` bei FINAL/THIRD_PLACE |

### BracketTeam

| Feld | Typ | Hinweise |
|------|-----|----------|
| `teamName` | `string \| null` | Realer Teamname, sobald feststehend |
| `placeholder` | `string \| null` | Vom Backend gelieferter Platzhalter (z. B. „Sieger Gruppe A") |

> Anzeigeregel: `teamName ?? placeholder ?? "—"`. Eine Paarung gilt als **feststehend**,
> wenn `home.teamName` **und** `away.teamName` non-null sind.

## Abgeleitete View-Logik (rein darstellend, keine Domänen-Aggregation)

- **`isPlaceholder(team)`**: `team.teamName == null` → Platzhalter anzeigen, kein Flaggen-Emoji.
- **`isDecided(match)`**: `home.teamName != null && away.teamName != null` → Link aktiv (FR-017).
- **`winningSide(match)`**: Abgleich `winner` gegen `home.teamName`/`away.teamName`
  (bzw. `"HOME"`/`"AWAY"`, falls das Backend Seitenkennungen liefert). Ergebnis:
  `"home" | "away" | null`. Nur zur visuellen Hervorhebung; kein eigenes Ableiten aus Score.
- **`hasLiveMatch(bracket)`**: `rounds.some(r => r.matches.some(m => m.status === "IN_PLAY"))`
  → steuert das bedingte Client-Polling (FR-010).
- **Connector-Graph**: Index `fifaMatchNo → BracketMatch`; Kante von jedem `m` zu
  `byNo[m.nextMatchNo]`. Für das Zeichnen der Linien zwischen benachbarten Spalten.

## Zustände eines BracketMatch (Status-Übergänge, backend-getrieben)

```text
SCHEDULED ─(Anpfiff)→ IN_PLAY ─(Abpfiff)→ FINISHED
SCHEDULED ─(Verlegung)→ POSTPONED
SCHEDULED ─(Absage)→ CANCELLED
```

- Ergebnis (`homeScore`/`awayScore`) und `winner` werden vom Backend gesetzt; das Frontend
  reagiert nur. Nachrücken in die Folgerunde = Backend ersetzt dort `placeholder` durch
  `teamName` (kein Frontend-Schreibvorgang, keine eigene Berechnung).

## Validierung / Defensive Annahmen

- Unerwartete/fehlende Runden oder abweichende Spielanzahl dürfen die Darstellung nicht
  brechen (FR-014): Runden werden in der gelieferten Reihenfolge gerendert; fehlt
  THIRD_PLACE, entfällt der Bereich.
- Alle numerischen Felder können `null` sein → defensiv mit `??`/Guards behandeln.
- Keine sensiblen Felder im Schema (Prinzip IV) — nur Teamname/Platzhalter, Score, Status.
