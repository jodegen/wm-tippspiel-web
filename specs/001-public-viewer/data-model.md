# Phase 1 Data Model: Öffentliche Read-only-Website WM-Tippspiel

Frontend-Sicht der Backend-Daten. Diese Typen sind read-only (Anzeige) und
entsprechen der maßgeblichen TypeScript-Definition in `lib/api/types.ts`. Felder,
die das Backend nicht garantiert, sind als optional markiert; das Frontend behandelt
fehlende Felder als Leerzustand (FR-014). Es werden ausschließlich öffentliche,
unbedenkliche Felder verarbeitet (Verfassungsprinzip IV).

## Enums / Wertebereiche

- **MatchStatus**: `scheduled` (ausstehend) | `live` (laufend) | `finished` (beendet)
- **Phase**: `group` (mit `groupName`, z. B. "A"…"H") | `knockout`
  (mit `round`, z. B. "round-of-16", "quarter", "semi", "final")
- **RankDirection**: `up` | `down` | `same`

## Entities

### Match (Spiel)

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `id` | string | ja | Öffentlicher Identifier (Route `/spiel/[id]`) |
| `homeTeam` | Team | ja | Heimteam |
| `awayTeam` | Team | ja | Auswärtsteam |
| `kickoff` | string (ISO 8601, UTC) | ja | Anstoßzeit; Anzeige stets Europe/Berlin |
| `phase` | Phase | ja | Gruppen- oder K.o.-Zuordnung (Filterdimension) |
| `matchday` | number \| string | ja | Spieltag (Filterdimension) |
| `status` | MatchStatus | ja | Status für Anzeige/Live-Selektion |
| `tvChannel` | string | nein | TV-Sender |
| `odds` | string \| number | nein | Quote |
| `result` | MatchResult | nein | Ergebnis (fehlt vor/bei laufendem Spiel) |

- **State transitions**: `scheduled` → `live` → `finished` (vom Backend gesetzt;
  Frontend leitet nichts ab).
- **Regel**: `/live` zeigt nur Matches mit `status = live` (FR-009).

### MatchResult (Ergebnis)

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `homeGoals` | number | ja | Tore Heim (aktueller Stand bei `live`) |
| `awayGoals` | number | ja | Tore Auswärts |
| `minute` | number | nein | Spielminute (für Live-Anzeige) |

### Team

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `name` | string | ja | Anzeigename |
| `code` | string | nein | Kürzel (z. B. "GER") |
| `flag` | string | nein | Flaggen-Asset/Emoji/URL |

### LeaderboardEntry (Ranglisteneintrag)

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `playerId` | string | ja | Öffentlicher Identifier → `/profil/[id]` |
| `displayName` | string | ja | Anzeigename des Teilnehmers |
| `rank` | number | ja | Aktueller Rang |
| `points` | number | ja | Gesamtpunkte |
| `exactHits` | number | ja | Anzahl exakter Treffer |
| `rankDelta` | number | nein | Rang-Veränderung ggü. vorherigem Spieltag |
| `rankDirection` | RankDirection | nein | Richtung der Veränderung (auf/ab/gleich) |

- **Regel**: Rangliste enthält ALLE Teilnehmer (kein Top-N, FR-005). Sortierung
  nach `rank` aufsteigend.
- **Regel**: `rankDelta`/`rankDirection` beziehen sich auf den Stand des vorherigen
  Spieltags (Clarification).

### PlayerProfile (Spielerprofil)

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `playerId` | string | ja | Öffentlicher Identifier |
| `displayName` | string | ja | Anzeigename |
| `stats` | PlayerStats | ja | Aggregierte Kennzahlen (vom Backend geliefert) |
| `tierDistribution` | TierBucket[] | ja | Punktstufen-Verteilung (vom Backend) |
| `bestTip` | TipEntry | nein | Bester Tipp (vom Backend) |
| `worstTip` | TipEntry | nein | Schlechtester Tipp (vom Backend) |
| `history` | TipEntry[] | ja | Tipp-Historie (kann leer sein) |

- **Regel**: Aggregate werden vom Backend fertig geliefert; Frontend berechnet
  keine eigenen (Clarification, FR-007).

### PlayerStats

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `totalPoints` | number | ja | Gesamtpunkte |
| `exactHits` | number | ja | Exakte Treffer |
| `tipCount` | number | ja | Anzahl abgegebener Tipps |
| `averagePoints` | number | nein | Durchschnittliche Punkte/Tipp |

### TierBucket (Punktstufe)

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `tier` | string | ja | Bezeichnung der Punktstufe (z. B. "exakt", "Tendenz") |
| `count` | number | ja | Anzahl Tipps in dieser Stufe |
| `points` | number | nein | Punktwert der Stufe |

### TipEntry (Tipp)

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `matchId` | string | ja | Bezug zum Spiel |
| `predictedHome` | number | ja | Vorhergesagte Heimtore |
| `predictedAway` | number | ja | Vorhergesagte Auswärtstore |
| `pointsAwarded` | number | nein | Erzielte Punkte (nach Spielende) |
| `tier` | string | nein | Erreichte Punktstufe |

- **Regel**: Tipps zu einem Spiel sind erst nach Anpfiff sichtbar; das Backend
  liefert sie vorher nicht (FR-008). Frontend muss das nur korrekt darstellen.

## Beziehungen

- `LeaderboardEntry.playerId` → `PlayerProfile.playerId`
- `TipEntry.matchId` → `Match.id`
- `PlayerProfile.history[]` → mehrere `TipEntry`
- `Match` ↔ Tipps der Teilnehmer (auf `/spiel/[id]` aggregiert, nur nach Anpfiff)

## Aggregierte View-Modelle (Frontend, reine Ableitung für Anzeige)

- **SpielplanView**: `Match[]` gefiltert nach Phase (Gruppe **oder** K.o.) UND
  optional Spieltag; reine Filterung/Sortierung, keine Domänenberechnung.
- **MatchDetailView**: `Match` + Liste der abgegebenen `TipEntry` (nur wenn
  `status !== scheduled`).
