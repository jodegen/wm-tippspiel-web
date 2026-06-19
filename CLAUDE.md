<!-- SPECKIT START -->
Active feature: 002-bracket-knockout-tree (Seite /bracket — K.o.-Turnierbaum WM 2026).

For technologies, project structure, shell commands, and other important
information, read the current plan: specs/002-bracket-knockout-tree/plan.md

Related artifacts:
- Spec: specs/002-bracket-knockout-tree/spec.md
- Research: specs/002-bracket-knockout-tree/research.md
- Data model: specs/002-bracket-knockout-tree/data-model.md
- Contracts: specs/002-bracket-knockout-tree/contracts/bracket-endpoint.md
- Quickstart: specs/002-bracket-knockout-tree/quickstart.md
- Constitution: .specify/memory/constitution.md

Previous feature (shipped): 001-public-viewer (specs/001-public-viewer/plan.md) —
/spielplan, /leaderboard, /profil/[id], /spiel/[id], /live.

Stack: Next.js 15 (App Router) + React 19 + TypeScript (strict). Read-only:
ausschließlich GET gegen die öffentlichen Backend-Endpoints (Basis-URL via
NEXT_PUBLIC_API_BASE_URL); keine Auth/Tippabgabe/Wetten. Zeiten stets
Europe/Berlin (zentral in lib/datetime.ts). ISR für Übersichtsseiten,
Client-Polling (30–60 s) für /live und /bracket (nur bei laufendem K.o.-Spiel).
Deployment: self-hosted VServer (next start hinter nginx).
<!-- SPECKIT END -->
