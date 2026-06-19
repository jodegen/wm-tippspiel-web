# WM-Tippspiel Web

Öffentliche, **read-only** Website zum WM-Tippspiel: Spielplan, Rangliste,
Spielerprofile, Spieldetails und Live-Spiele. Die App konsumiert ausschließlich
die öffentlichen **GET**-Endpoints des bestehenden WM-Tippspiel-Backends — keine
Tippabgabe, keine Wetten, keine Authentifizierung, keine Speicherung sensibler
Daten.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS** (Stil/Tokens am Steuerfertig-Projekt orientiert)
- **Vitest** + React Testing Library
- Deployment: **self-hosted** (VServer, nginx-Reverse-Proxy)

## Setup

```bash
npm install
cp .env.example .env.local
# .env.local: NEXT_PUBLIC_API_BASE_URL=https://<backend-host>   (ohne abschließenden Slash)
npm run dev    # http://localhost:3000
```

### Skripte

| Befehl | Zweck |
|--------|-------|
| `npm run dev` | Dev-Server |
| `npm run build` / `npm start` | Production-Build / -Server |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (Unit/Component) |

## Routen

| Route | Rendering | Backend-Endpoint |
|-------|-----------|------------------|
| `/` | Redirect → `/spielplan` | — |
| `/spielplan` | dynamisch (Filter via URL) | `GET /matches` |
| `/leaderboard` | ISR (revalidate 60 s) | `GET /leaderboard` |
| `/profil/[id]` | ISR (revalidate 60 s) | `GET /players/{id}` |
| `/spiel/[id]` | ISR (revalidate 30 s) | `GET /matches/{id}` |
| `/live` | Client-Polling (45 s) | `GET /matches/live` |

Alle Anstoß-/Spielzeiten werden zentral in **Europe/Berlin** dargestellt
(`lib/datetime.ts`).

## Architektur

- `lib/api/client.ts` — **einziger** Datenpfad, ausschließlich `GET` (`apiGet`).
  Erzwingt die Read-only-Garantie an einer Stelle.
- `lib/api/{endpoints,types,matches,leaderboard,players,live}.ts` — Endpoint-Builder,
  Typen und Datenfunktionen.
- `lib/filters.ts` — reine Spielplan-Filterlogik (Phase exklusiv Gruppe/K.o. UND
  Spieltag).
- `hooks/usePolling.ts` — Intervall-Polling mit Pause bei verstecktem Tab.
- `components/` — `match/`, `leaderboard/`, `profile/`, `layout/`, `feedback/`.

Design-Dokumente: siehe [`specs/001-public-viewer/`](./specs/001-public-viewer/)
(spec, plan, research, data-model, contracts, tasks). Projektprinzipien:
[`.specify/memory/constitution.md`](./.specify/memory/constitution.md).

## Deployment (self-hosted, VServer)

Frontend `wm.xenoria.de`, Backend-API `api.wm.xenoria.de` — siehe ausführlich
[`DEPLOYMENT.md`](./DEPLOYMENT.md) und die Vorlagen unter [`deploy/`](./deploy/).

1. Die Backend-URL steht in der eingecheckten `.env.production` (wird von
   `next build`/`next start` automatisch geladen — kein Setzen je Befehl nötig).
2. `npm ci && npm run build && npm run start` (Node 20), betrieben als
   systemd-Dienst (`deploy/wm-frontend.service`) hinter nginx
   (`deploy/nginx.wm.conf.example`).
3. Das Backend muss **CORS** für `https://wm.xenoria.de` erlauben (die `/live`-Seite
   pollt clientseitig; serverseitige ISR-Fetches benötigen kein CORS).
4. Keine serverseitigen Secrets erforderlich (rein öffentliche Lese-Daten).
