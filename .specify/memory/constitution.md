<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0
Bump rationale: Initiale Ratifizierung der Projektverfassung (erste konkrete Fassung
  aus Platzhalter-Template). Erstellung einer neuen Verfassung ⇒ MAJOR-Start 1.0.0.

Principles defined (5):
  - I. Read-Only by Design (NON-NEGOTIABLE)
  - II. Backend als alleinige Datenquelle
  - III. Keine Authentifizierung, keine Tippabgabe, keine Wetten
  - IV. Datensparsamkeit & Datenschutz
  - V. Stack- & Stilkonsistenz

Sections added:
  - Technische Rahmenbedingungen (Stack, Zeitzonen, Responsiveness, Deployment)
  - Entwicklungs- & Qualitäts-Workflow

Templates reviewed for consistency:
  - .specify/templates/plan-template.md ............ ✅ generisches "Constitution Check",
       keine prinzipienwidrigen Vorgaben; bleibt kompatibel
  - .specify/templates/spec-template.md ............ ✅ keine Anpassung nötig
  - .specify/templates/tasks-template.md ........... ✅ keine prinzipien-getriebenen
       Pflicht-Tasktypen entfernt/hinzugefügt
  - Command-/Skill-Dateien .......................... ✅ generisch, keine veralteten Refs

Deferred TODOs: keine. Ratifizierungsdatum auf Projekt-Setup-Datum (2026-06-19) gesetzt.

AMENDMENT 2026-06-19 (1.0.0 → 1.1.0, MINOR):
  - Technische Rahmenbedingungen → Deployment: Ziel von "Vercel" auf "self-hosted
    VServer mit nginx-Reverse-Proxy (Frontend wm.xenoria.de, API api.wm.xenoria.de)"
    geändert; CORS-Anforderung für den Frontend-Origin explizit aufgenommen.
  - Begründung: materielle Änderung einer dokumentierten Rahmenbedingung ⇒ MINOR.
  - Folge-Updates: plan.md, spec.md (Assumptions), research.md §8, quickstart.md,
    README.md, neue Deployment-Artefakte (DEPLOYMENT.md, deploy/).
-->

# WM-Tippspiel Web Constitution

Read-only Frontend zur Anzeige öffentlicher Daten des WM-Tippspiel-Backends.

## Core Principles

### I. Read-Only by Design (NON-NEGOTIABLE)

Die Anwendung ist ausschließlich lesend. Es werden NIEMALS Schreibvorgänge gegen das
Backend ausgeführt. Erlaubt sind ausschließlich HTTP-`GET`-Anfragen; `POST`, `PUT`,
`PATCH`, `DELETE` und jede andere zustandsändernde Methode sind verboten. Es gibt keine
Tippabgabe, keine Formulare, die Daten an das Backend senden, und keine clientseitigen
Mutationen von Domänendaten.

Rationale: Das Produkt ist eine reine Darstellungsschicht. Der Verzicht auf
Schreibpfade eliminiert ganze Klassen von Fehlern, Sicherheitsrisiken und
Konsistenzproblemen und hält die Anwendung dauerhaft einfach.

### II. Backend als alleinige Datenquelle

Alle angezeigten Inhalte stammen ausschließlich aus den öffentlichen `GET`-Endpoints des
WM-Tippspiel-Backends. Es werden keine alternativen Datenquellen, keine eigenen
Datenbanken und keine clientseitige Persistenz von Domänendaten eingeführt. Caching ist
zulässig, sofern es transient ist und ausschließlich der Performance dient; es darf nie
zur Ersatz-Datenquelle oder zum Speicher für Nutzerinhalte werden.

Rationale: Eine einzige Quelle der Wahrheit verhindert Daten-Divergenz und stellt sicher,
dass das Frontend stets das widerspiegelt, was das Backend autoritativ bereitstellt.

### III. Keine Authentifizierung, keine Tippabgabe, keine Wetten

Die Anwendung implementiert keine Authentifizierung, kein Login, keine Sessions und keine
nutzerbezogene Identität. Es gibt keine Tippabgabe und keine Wett- oder
Einsatzfunktionen. Alle Endpoints werden anonym und unauthentifiziert aufgerufen.

Rationale: Der Funktionsumfang ist bewusst auf öffentliche Anzeige beschränkt. Das
Fehlen von Auth und Einsatz-Logik entfernt regulatorische, sicherheitstechnische und
datenschutzrechtliche Komplexität vollständig.

### IV. Datensparsamkeit & Datenschutz

Es werden niemals sensible oder personenbezogene Daten verarbeitet, geloggt oder
gespeichert. Das Backend liefert ausschließlich unbedenkliche, öffentliche Felder; die
Anwendung verlässt sich auf diese Eigenschaft und führt aktiv keine Erhebung,
Profilbildung oder dauerhafte Speicherung von Nutzerdaten ein.

Rationale: Minimaler Datenumgang ist die stärkste Datenschutzgarantie und ergibt sich
direkt aus dem Read-Only- und Anonymitäts-Charakter des Produkts.

### V. Stack- & Stilkonsistenz

Die Anwendung wird mit Next.js, React und TypeScript umgesetzt und folgt demselben Stil
und denselben Konventionen wie das Steuerfertig-Projekt (Projektstruktur, Komponenten-
und Styling-Muster, Lint-/Format-Regeln). Neue Muster werden nur eingeführt, wenn ein
bestehendes Muster nachweislich nicht passt; Abweichungen sind zu begründen.

Rationale: Konsistenz über Projekte hinweg senkt Einarbeitungskosten, erhöht
Wartbarkeit und sichert ein einheitliches Erscheinungsbild.

## Technische Rahmenbedingungen

- **Stack**: Next.js + React + TypeScript. Strikte TypeScript-Typisierung; keine
  ungetypten Datenflüsse für Backend-Antworten.
- **Zeitzonen**: Alle Anstoß- und Spielzeiten werden konsistent in `Europe/Berlin`
  angezeigt, unabhängig von der Zeitzone des Endgeräts. Zeitformatierung erfolgt zentral,
  damit die Darstellung einheitlich bleibt.
- **Responsiveness**: Das UI ist responsiv und auf Mobil- wie Desktop-Viewports nutzbar.
- **Deployment**: Auslieferung erfolgt self-hosted auf einem VServer. Das Next.js-
  Frontend läuft als Node-Prozess (`next start`, via systemd/Prozessmanager) hinter
  einem nginx-Reverse-Proxy (Frontend unter `wm.xenoria.de`, Backend-API unter
  `api.wm.xenoria.de`). Da Frontend und API verschiedene Origins sind, MUSS das
  Backend CORS für den Frontend-Origin erlauben (clientseitiges `/live`-Polling).

## Entwicklungs- & Qualitäts-Workflow

- **Prinzipientreue**: Jede Änderung ist vor dem Merge gegen die Core Principles zu
  prüfen. Insbesondere ist sicherzustellen, dass keine schreibenden Aufrufe, keine
  Auth-/Tipp-/Wett-Logik und keine sensiblen Datenflüsse eingeführt werden.
- **Einfachheit zuerst**: Lösungen folgen YAGNI. Zusätzliche Komplexität (neue
  Abhängigkeiten, neue Muster, clientseitige Persistenz) muss explizit begründet werden.
- **Stilkonventionen**: Lint- und Format-Regeln werden eingehalten und entsprechen dem
  Steuerfertig-Projekt. Code soll dem umgebenden Stil entsprechen.

## Governance

Diese Verfassung hat Vorrang vor anderen Praktiken und Konventionen des Projekts. Bei
Konflikten gelten die Core Principles.

Änderungen an der Verfassung erfordern eine dokumentierte Begründung und eine
Versionsanhebung gemäß Semantic Versioning:

- **MAJOR**: Rückwärtsinkompatible Entfernung oder Neudefinition von Prinzipien/Governance.
- **MINOR**: Neues Prinzip/neuer Abschnitt oder materiell erweiterte Vorgaben.
- **PATCH**: Klarstellungen, Formulierungen, nicht-semantische Korrekturen.

Alle Pull Requests und Reviews müssen die Einhaltung dieser Verfassung verifizieren.
Abweichungen sind nur mit dokumentierter Begründung zulässig.

**Version**: 1.1.0 | **Ratified**: 2026-06-19 | **Last Amended**: 2026-06-19
