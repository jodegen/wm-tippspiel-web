# Deployment — Self-hosted (VServer)

Frontend `wm.xenoria.de` (Next.js, `next start`) hinter nginx; Backend-API unter
`api.wm.xenoria.de`. Rein öffentliche Lese-Daten, keine Secrets.

## 0. Voraussetzungen / DNS

- Node.js 20 LTS und nginx auf dem VServer.
- **DNS-A/AAAA-Records** für `wm.xenoria.de` **und** `api.wm.xenoria.de` müssen auf
  den VServer zeigen. (Stand der Einrichtung: aktuell lösen beide Hostnamen noch
  nicht auf — `NXDOMAIN`. Records anlegen, bevor TLS/CORS getestet werden kann.)

## 1. Build (mit Build-Zeit-Env)

`NEXT_PUBLIC_API_BASE_URL` wird zur **Build-Zeit** in den Client gebündelt — daher
beim Build setzen:

```bash
cd /var/www/wm-tippspiel-web
npm ci
NEXT_PUBLIC_API_BASE_URL=https://api.wm.xenoria.de/api/public npm run build
```

## 2. Prozess via systemd

```bash
sudo cp deploy/wm-frontend.service /etc/systemd/system/wm-frontend.service
# WorkingDirectory/User bei Bedarf anpassen
sudo systemctl daemon-reload
sudo systemctl enable --now wm-frontend
sudo systemctl status wm-frontend          # läuft auf 127.0.0.1:3000
```

## 3. nginx-Reverse-Proxy

```bash
sudo cp deploy/nginx.wm.conf.example /etc/nginx/sites-available/wm.xenoria.de
sudo ln -s /etc/nginx/sites-available/wm.xenoria.de /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
# TLS:
sudo certbot --nginx -d wm.xenoria.de
```

## 4. CORS / Same-Origin (erforderlich für /live)

Das Frontend pollt `/matches/live` **clientseitig** vom Origin
`https://wm.xenoria.de`. Verifiziert am 2026-06-19: Das Backend sendet **aktuell
KEINE** `Access-Control-Allow-Origin`-Header → das Polling würde im Browser
blockiert. Zwei Lösungswege (einer genügt):

**Option A (empfohlen): API per nginx unter dem Frontend-Origin proxien** — dann
ist `/live` same-origin und CORS entfällt komplett. Im Frontend-vHost
(`wm.xenoria.de`) ergänzen und `NEXT_PUBLIC_API_BASE_URL=https://wm.xenoria.de/api/public`
setzen:

```nginx
location /api/public/ {
    proxy_pass https://api.wm.xenoria.de/api/public/;
    proxy_set_header Host api.wm.xenoria.de;
}
```

**Option B: CORS am Backend** — für die öffentlichen GET-Endpoints senden:

```
Access-Control-Allow-Origin: https://wm.xenoria.de
Access-Control-Allow-Methods: GET, OPTIONS
Vary: Origin
```

(Serverseitige ISR-Fetches von Spielplan/Leaderboard/Profil/Detail laufen
Server-zu-Server und benötigen **kein** CORS — nur das clientseitige `/live`.)

## 5. Verifikation (nach DNS/TLS/CORS)

- `curl -s https://api.wm.xenoria.de/matches | head` → JSON der Spiele.
- Browser: `https://wm.xenoria.de/live` offen lassen → Stand aktualisiert sich
  ≤ 60 s; DevTools → keine CORS-Fehler.
- Restliche Success Criteria siehe `specs/001-public-viewer/quickstart.md`.

## Updates ausrollen

```bash
git pull
npm ci
NEXT_PUBLIC_API_BASE_URL=https://api.wm.xenoria.de/api/public npm run build
sudo systemctl restart wm-frontend
```
