<!-- SPECKIT START -->
Active feature: 001-public-viewer (öffentliche Read-only-Website WM-Tippspiel).

For technologies, project structure, shell commands, and other important
information, read the current plan: specs/001-public-viewer/plan.md

Related artifacts:
- Spec: specs/001-public-viewer/spec.md
- Research: specs/001-public-viewer/research.md
- Data model: specs/001-public-viewer/data-model.md
- Contracts: specs/001-public-viewer/contracts/backend-endpoints.md
- Quickstart: specs/001-public-viewer/quickstart.md
- Constitution: .specify/memory/constitution.md

Stack: Next.js 15 (App Router) + React 19 + TypeScript (strict). Read-only:
ausschließlich GET gegen die öffentlichen Backend-Endpoints (Basis-URL via
NEXT_PUBLIC_API_BASE_URL); keine Auth/Tippabgabe/Wetten. Zeiten stets
Europe/Berlin (zentral in lib/datetime.ts). ISR für Übersichtsseiten,
Client-Polling (30–60 s) für /live. Deployment: Vercel.
<!-- SPECKIT END -->
