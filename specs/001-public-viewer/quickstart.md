# Quickstart: WM-Tippspiel Read-only-Website

## Voraussetzungen

- Node.js 20 LTS, npm/pnpm
- Erreichbares WM-Tippspiel-Backend (öffentliche GET-Endpoints)

## Setup

```bash
# Abhängigkeiten installieren
npm install

# Umgebungsvariable setzen
cp .env.example .env.local
# .env.local:
# NEXT_PUBLIC_API_BASE_URL=https://<backend-host>/api
```

## Entwicklung

```bash
npm run dev          # Next.js Dev-Server (http://localhost:3000)
npm run lint         # Lint im Steuerfertig-Stil
npm run typecheck    # tsc --noEmit (strict)
npm test             # Vitest (Unit/Component)
```

## Routen

| Route | Rendering | Datenquelle |
|-------|-----------|-------------|
| `/` | Redirect → `/spielplan` | — |
| `/spielplan` | ISR (revalidate 60 s) | `GET /matches` |
| `/leaderboard` | ISR (revalidate 60 s) | `GET /leaderboard` |
| `/profil/[id]` | ISR (revalidate 60 s) | `GET /players/{id}` |
| `/spiel/[id]` | SSR/ISR (revalidate 30 s) | `GET /matches/{id}` |
| `/live` | Client-Polling (45 s) | `GET /matches/live` |

## Manuelle Verifikation (gegen Success Criteria)

1. **Spielplan/Filter (SC-001)**: `/spielplan` öffnen, Phasen- (Gruppe **oder**
   K.o.) und Tagesfilter kombinieren → nur passende Spiele.
2. **Rangliste vollständig (SC-002)**: `/leaderboard` → alle Teilnehmer mit Rang,
   Punkten, exakten Treffern, Rang-Veränderung.
3. **Zeitzone (SC-003)**: Gerätezeitzone wechseln → Anstoßzeiten bleiben
   Europe/Berlin.
4. **Live-Refresh (SC-004)**: `/live` offen lassen → Stand aktualisiert sich
   ≤ 60 s ohne Reload.
5. **Tipp-Sichtbarkeit (SC-005)**: `/spiel/[id]` vor Anpfiff → keine Tipps; nach
   Anpfiff → Tipps sichtbar.
6. **Responsiv (SC-006)**: alle Seiten bei ≤ 375 px ohne horizontales Scrollen.
7. **Fehler/Leer (SC-007)**: Backend-URL ungültig setzen → ErrorState statt Absturz.

## Deployment (Self-hosted VServer)

- Build & Start: `npm ci && npm run build && npm run start` (Node 20), betrieben
  als systemd-Dienst hinter nginx (siehe `DEPLOYMENT.md` und `deploy/`).
- `NEXT_PUBLIC_API_BASE_URL=https://api.wm.xenoria.de/api/public` setzen (Build-Zeit-Variable,
  da `NEXT_PUBLIC_`-Prefix → in den Client gebündelt).
- Backend-CORS muss `https://wm.xenoria.de` für das `/live`-Polling erlauben.
- Keine serverseitigen Secrets nötig (rein öffentliche Lese-Daten).
