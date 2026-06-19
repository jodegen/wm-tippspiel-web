# Feature Specification: Öffentliche Read-only-Website WM-Tippspiel

**Feature Branch**: `001-public-viewer`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: "Erstelle die Spezifikation für eine öffentliche Read-only-Website zum WM-Tippspiel (reine Übersicht, keine Tippabgabe, keine Wetten). Stack: Next.js/React/TypeScript. Sie konsumiert die öffentlichen GET-Endpoints des bestehenden WM-Tippspiel-Backends. Seiten: /spielplan, /leaderboard, /profil/[id], /spiel/[id], /live."

## Clarifications

### Session 2026-06-19

- Q: Wie verhalten sich die Spielplan-Filter (Gruppe, Tag, K.o.-Phase) zueinander? → A: Phasen-Filter (Gruppe **oder** K.o.-Runde, gegenseitig ausschließend) ist mit einem unabhängigen Tagesfilter kombinierbar (UND-Verknüpfung).
- Q: Worauf bezieht sich die angezeigte Rang-Veränderung? → A: Auf den Stand des vorherigen Spieltags (nach Abschluss des letzten Spieltags).
- Q: Wie finden Besucher ein Spielerprofil? → A: Nur per Link aus der Rangliste und über die direkte URL; keine Suche und kein Spielerverzeichnis.
- Q: Woher stammen die aggregierten Profilkennzahlen (Statistiken, Punktstufen-Verteilung, bester/schlechtester Tipp)? → A: Das Backend liefert die Aggregate fertig; das Frontend stellt sie nur dar.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Spielplan einsehen und filtern (Priority: P1)

Ein Besucher öffnet die Website, um sich einen Überblick über alle Spiele des
Turniers zu verschaffen. Er sieht jedes Spiel mit Begegnung, Anstoßzeit in der
Zeitzone Europe/Berlin, TV-Sender, Quote, aktuellem Ergebnis und Status. Er kann
die Liste nach Gruppe, nach Spieltag und nach K.o.-Phase filtern, um schnell die
für ihn relevanten Spiele zu finden.

**Why this priority**: Der Spielplan ist die zentrale Einstiegs- und Übersichtsseite.
Ohne ihn fehlt der grundlegende Kontext für alle anderen Ansichten. Er liefert
eigenständigen Wert und ist für sich allein ein nutzbares Produkt.

**Independent Test**: Aufruf von `/spielplan` ohne weitere Seiten; vollständige
Spielliste wird angezeigt und lässt sich nach Gruppe, Tag und K.o.-Phase filtern.

**Acceptance Scenarios**:

1. **Given** das Backend liefert eine Liste von Spielen, **When** der Besucher
   `/spielplan` öffnet, **Then** werden alle Spiele mit Begegnung, Anstoßzeit
   (Europe/Berlin), TV-Sender, Quote, Ergebnis und Status angezeigt.
2. **Given** der Spielplan ist geladen, **When** der Besucher nach einer Gruppe
   filtert, **Then** werden ausschließlich Spiele dieser Gruppe angezeigt.
3. **Given** der Spielplan ist geladen, **When** der Besucher nach einem Spieltag
   filtert, **Then** werden ausschließlich Spiele dieses Tages angezeigt.
4. **Given** der Spielplan ist geladen, **When** der Besucher die K.o.-Phase
   auswählt, **Then** werden ausschließlich K.o.-Spiele angezeigt.
5. **Given** ein Spiel hat noch kein Ergebnis, **When** es angezeigt wird,
   **Then** wird ein klar erkennbarer Status (z. B. „ausstehend") statt eines
   Ergebnisses dargestellt.

---

### User Story 2 - Vollständige Rangliste ansehen (Priority: P2)

Ein Besucher möchte den aktuellen Stand des Tippspiels sehen. Er ruft die
Rangliste auf und sieht alle Teilnehmer (nicht nur die Top-N) mit Rang, Punkten,
Anzahl exakter Treffer und der Rang-Veränderung gegenüber dem vorherigen Stand.

**Why this priority**: Die Rangliste ist der wichtigste Wettbewerbsindikator und
nach dem Spielplan die meistgefragte Ansicht. Sie ist unabhängig nutzbar.

**Independent Test**: Aufruf von `/leaderboard`; die vollständige Teilnehmerliste
erscheint sortiert nach Rang mit Punkten, exakten Treffern und Rang-Veränderung.

**Acceptance Scenarios**:

1. **Given** das Backend liefert die Rangliste, **When** der Besucher
   `/leaderboard` öffnet, **Then** werden alle Teilnehmer absteigend nach Punkten
   bzw. Rang angezeigt.
2. **Given** die Rangliste ist geladen, **When** ein Teilnehmer angezeigt wird,
   **Then** sind Rang, Punkte, exakte Treffer und Rang-Veränderung sichtbar.
3. **Given** ein Teilnehmer ist im Rang gestiegen/gefallen, **When** die Liste
   angezeigt wird, **Then** wird die Veränderung visuell unterscheidbar dargestellt
   (auf/ab/unverändert).
4. **Given** ein Eintrag in der Rangliste, **When** der Besucher ihn auswählt,
   **Then** gelangt er zum zugehörigen Spielerprofil.

---

### User Story 3 - Laufende Spiele live verfolgen (Priority: P2)

Ein Besucher möchte während des Turniers laufende Spiele mit aktuellem Spielstand
verfolgen. Er ruft die Live-Seite auf und sieht alle gerade laufenden Spiele, die
sich automatisch in regelmäßigen Abständen aktualisieren, ohne dass er die Seite
neu laden muss.

**Why this priority**: Hoher Nutzwert während aktiver Spielphasen, jedoch nur
zeitweise relevant und abhängig vom Spielplan. Unabhängig testbar.

**Independent Test**: Aufruf von `/live` während (simulierter) laufender Spiele;
der angezeigte Stand aktualisiert sich automatisch im definierten Intervall.

**Acceptance Scenarios**:

1. **Given** mindestens ein Spiel läuft, **When** der Besucher `/live` öffnet,
   **Then** werden alle laufenden Spiele mit aktuellem Stand angezeigt.
2. **Given** die Live-Seite ist geöffnet, **When** das definierte
   Aktualisierungsintervall verstreicht, **Then** wird der angezeigte Stand
   automatisch aktualisiert, ohne dass der Besucher die Seite neu lädt.
3. **Given** aktuell läuft kein Spiel, **When** der Besucher `/live` öffnet,
   **Then** wird ein verständlicher Hinweis „aktuell keine laufenden Spiele"
   angezeigt.

---

### User Story 4 - Spielerprofil ansehen (Priority: P3)

Ein Besucher möchte die Leistung eines Teilnehmers im Detail nachvollziehen. Über
den öffentlichen Identifier ruft er ein Spielerprofil auf und sieht dessen
Tipp-Historie, zusammenfassende Statistiken, die Verteilung über die Punktstufen
sowie den besten und schlechtesten Tipp.

**Why this priority**: Vertiefende Ansicht, die auf Rangliste und Spielplan
aufbaut; wertvoll, aber nicht für den Grundüberblick erforderlich.

**Independent Test**: Aufruf von `/profil/<id>` mit gültigem öffentlichem
Identifier; Tipp-Historie, Statistiken, Punktstufen-Verteilung sowie bester und
schlechtester Tipp werden angezeigt.

**Acceptance Scenarios**:

1. **Given** ein gültiger öffentlicher Identifier, **When** der Besucher
   `/profil/<id>` öffnet, **Then** werden Tipp-Historie, Statistiken,
   Punktstufen-Verteilung sowie bester und schlechtester Tipp angezeigt.
2. **Given** ein unbekannter Identifier, **When** das Profil aufgerufen wird,
   **Then** wird eine verständliche „nicht gefunden"-Meldung angezeigt.
3. **Given** ein Profil mit noch leerer Historie, **When** es angezeigt wird,
   **Then** werden leere Zustände verständlich dargestellt statt fehlerhafter
   oder leerer Bereiche.

---

### User Story 5 - Spieldetails inkl. abgegebener Tipps (Priority: P3)

Ein Besucher möchte zu einem bestimmten Spiel die Details und die abgegebenen
Tipps der Teilnehmer sehen. Er ruft die Detailseite eines Spiels auf. Die Tipps
werden nur dann angezeigt, wenn das Spiel bereits angepfiffen ist; vorher liefert
das Backend keine Tipps.

**Why this priority**: Ergänzende Detailansicht; baut auf Spielplan/Live auf und
ist erst nach Anpfiff vollständig sinnvoll.

**Independent Test**: Aufruf von `/spiel/<id>` für ein angepfiffenes Spiel; Details
und abgegebene Tipps werden angezeigt. Für ein noch nicht angepfiffenes Spiel
werden Details, aber keine Tipps angezeigt.

**Acceptance Scenarios**:

1. **Given** ein bereits angepfiffenes Spiel, **When** der Besucher `/spiel/<id>`
   öffnet, **Then** werden die Spieldetails und die abgegebenen Tipps angezeigt.
2. **Given** ein noch nicht angepfiffenes Spiel, **When** der Besucher
   `/spiel/<id>` öffnet, **Then** werden die Spieldetails angezeigt, jedoch keine
   Tipps (das Backend liefert vorher keine).
3. **Given** ein unbekannter Spiel-Identifier, **When** die Seite aufgerufen wird,
   **Then** wird eine verständliche „nicht gefunden"-Meldung angezeigt.

---

### Edge Cases

- **Backend nicht erreichbar / Fehlerantwort**: Jede Seite zeigt einen
  verständlichen Fehlerzustand mit Wiederholungsmöglichkeit statt einer leeren
  oder abstürzenden Ansicht.
- **Leere Datenmengen**: Spielplan ohne Spiele, Rangliste ohne Teilnehmer, Profil
  ohne Tipps, Live ohne laufende Spiele zeigen jeweils einen verständlichen
  Leerzustand.
- **Teilweise fehlende Felder pro Spiel** (z. B. fehlender TV-Sender oder fehlende
  Quote): Das betroffene Feld wird ausgelassen oder neutral dargestellt, ohne die
  übrige Darstellung zu beeinträchtigen.
- **Filterkombination ohne Treffer** auf dem Spielplan: verständliche Meldung
  „keine Spiele für diese Auswahl".
- **Zeitzonen-Konsistenz**: Anstoßzeiten werden unabhängig von der Gerätezeitzone
  des Besuchers immer in Europe/Berlin angezeigt.
- **Statuswechsel während des Betrachtens** auf `/live` (Spiel endet): Das Spiel
  verschwindet beim nächsten Aktualisierungszyklus aus der Live-Liste bzw. wird
  als beendet markiert.
- **Veraltete Cache-Daten** bei serverseitig gerenderten/ISR-Seiten: nach einer
  Ergebnisänderung wird der Inhalt innerhalb des definierten Revalidierungsfensters
  aktualisiert.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Das System MUSS ausschließlich lesend arbeiten und Daten
  ausschließlich über die öffentlichen GET-Endpoints des WM-Tippspiel-Backends
  beziehen; es DARF KEINE schreibenden Aufrufe ausführen.
- **FR-002**: Das System DARF KEINE Tippabgabe, Wett-, Einsatz- oder
  Authentifizierungsfunktionen anbieten; alle Inhalte sind öffentlich und anonym
  abrufbar.
- **FR-003**: Das System MUSS auf `/spielplan` alle Spiele mit Begegnung,
  Anstoßzeit (Europe/Berlin), TV-Sender, Quote, Ergebnis und Status anzeigen.
- **FR-004**: Das System MUSS auf `/spielplan` einen Phasen-Filter (Gruppe **oder**
  K.o.-Runde, gegenseitig ausschließend) sowie einen davon unabhängigen
  Spieltag-Filter bereitstellen; Phasen- und Tagesfilter MÜSSEN kombinierbar sein
  (UND-Verknüpfung).
- **FR-005**: Das System MUSS auf `/leaderboard` die vollständige Rangliste (alle
  Teilnehmer, nicht nur Top-N) mit Rang, Punkten, exakten Treffern und
  Rang-Veränderung anzeigen; die Rang-Veränderung bezieht sich auf den Stand des
  vorherigen Spieltags.
- **FR-006**: Das System MUSS von Ranglisteneinträgen auf das zugehörige
  Spielerprofil verlinken. Profile sind ausschließlich über diesen Link und über
  die direkte URL erreichbar; eine Suche oder ein Spielerverzeichnis ist NICHT
  vorgesehen.
- **FR-007**: Das System MUSS auf `/profil/[id]` über den öffentlichen Identifier
  die Tipp-Historie, zusammenfassende Statistiken, die Punktstufen-Verteilung
  sowie den besten und schlechtesten Tipp anzeigen. Diese Aggregate werden vom
  Backend fertig geliefert und vom Frontend nur dargestellt; das Frontend berechnet
  keine eigenen Domänenaggregate.
- **FR-008**: Das System MUSS auf `/spiel/[id]` die Spieldetails anzeigen und die
  abgegebenen Tipps NUR dann darstellen, wenn das Spiel angepfiffen ist.
- **FR-009**: Das System MUSS auf `/live` alle aktuell laufenden Spiele mit
  aktuellem Spielstand anzeigen.
- **FR-010**: Das System MUSS die `/live`-Ansicht clientseitig automatisch in
  einem Intervall von 30 bis 60 Sekunden aktualisieren; ein WebSocket wird in v1
  NICHT verwendet.
- **FR-011**: Das System MUSS Spielplan, Rangliste und Profile mit serverseitig
  bezogenen bzw. inkrementell revalidierten Daten ausliefern, da sich diese nur
  nach Spielen ändern.
- **FR-012**: Das System MUSS alle Datums- und Anstoßzeiten konsistent in der
  Zeitzone Europe/Berlin darstellen, unabhängig von der Gerätezeitzone.
- **FR-013**: Das System MUSS bei nicht erreichbarem Backend oder Fehlerantworten
  einen verständlichen Fehlerzustand mit Wiederholungsmöglichkeit anzeigen.
- **FR-014**: Das System MUSS bei leeren Datenmengen und bei Filterauswahlen ohne
  Treffer einen verständlichen Leerzustand anzeigen.
- **FR-015**: Das System MUSS bei unbekannten Identifiern (Profil, Spiel) eine
  verständliche „nicht gefunden"-Meldung anzeigen.
- **FR-016**: Das System MUSS responsiv sein und auf Mobil- wie Desktop-Viewports
  vollständig nutzbar bleiben.
- **FR-017**: Das System DARF KEINE sensiblen oder personenbezogenen Daten
  verarbeiten, protokollieren oder speichern; es nutzt ausschließlich die vom
  Backend gelieferten öffentlichen Felder.

### Key Entities *(include if feature involves data)*

- **Spiel (Match)**: Eine Begegnung des Turniers. Attribute u. a.: Identifier,
  Heim-/Auswärtsteam, Anstoßzeit, TV-Sender, Quote, Ergebnis, Status
  (ausstehend/laufend/beendet), Zuordnung zu Gruppe oder K.o.-Phase, Spieltag.
- **Gruppe / Phase**: Strukturmerkmal zur Einordnung von Spielen (Gruppenname bzw.
  K.o.-Runde) als Filterdimension auf dem Spielplan.
- **Teilnehmer / Spieler**: Ein Tippspiel-Teilnehmer, adressiert über einen
  öffentlichen Identifier. Attribute u. a.: Anzeigename, Rang, Punkte, exakte
  Treffer, Rang-Veränderung.
- **Tipp (Vorhersage)**: Die Vorhersage eines Teilnehmers zu einem Spiel. Sichtbar
  ausschließlich nach Anpfiff des betreffenden Spiels. Attribute u. a.:
  vorhergesagtes Ergebnis, erzielte Punkte/Punktstufe.
- **Rangliste (Leaderboard)**: Geordnete Gesamtliste aller Teilnehmer mit den
  zugehörigen Wettbewerbskennzahlen.
- **Spielerstatistik**: Aggregierte Kennzahlen eines Profils, u. a.
  Punktstufen-Verteilung sowie bester und schlechtester Tipp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ein Besucher kann den Spielplan öffnen und ohne Anleitung innerhalb
  von 30 Sekunden nach Gruppe, Tag oder K.o.-Phase filtern und die relevanten
  Spiele sehen.
- **SC-002**: Die Rangliste zeigt zu 100 % aller Teilnehmer (keine Top-N-
  Begrenzung) Rang, Punkte, exakte Treffer und Rang-Veränderung an.
- **SC-003**: Anstoßzeiten werden in 100 % der Fälle in Europe/Berlin angezeigt,
  unabhängig von der Zeitzone des Endgeräts.
- **SC-004**: Die `/live`-Ansicht aktualisiert den Spielstand automatisch innerhalb
  von höchstens 60 Sekunden ohne manuelles Neuladen.
- **SC-005**: Tipps auf der Spieldetailseite sind in 100 % der Fälle erst nach
  Anpfiff sichtbar und vorher nicht.
- **SC-006**: Alle fünf Seiten sind auf Mobil- (≤ 375 px Breite) und Desktop-
  Viewports ohne horizontales Scrollen und ohne Funktionsverlust bedienbar.
- **SC-007**: Bei nicht erreichbarem Backend zeigen alle Seiten einen
  verständlichen Fehler- bzw. Leerzustand statt einer leeren oder abstürzenden
  Ansicht.
- **SC-008**: Spielplan-, Rangliste- und Profilseiten zeigen nach einer
  Ergebnisänderung den aktualisierten Stand innerhalb des definierten
  Revalidierungsfensters.

## Assumptions

- **Sprache**: Die Benutzeroberfläche ist deutschsprachig (passend zu Domäne und
  Routen-Benennung).
- **Datenquelle**: Das bestehende WM-Tippspiel-Backend stellt alle benötigten
  Felder über öffentliche, nicht authentifizierte GET-Endpoints bereit und liefert
  ausschließlich unbedenkliche, öffentliche Daten.
- **Rang-Veränderung**: Bezieht sich auf den Ranglistenstand nach Abschluss des
  vorherigen Spieltags (siehe Clarifications); das Backend liefert die hierfür
  nötige Information.
- **Live-Daten**: Das Backend liefert für laufende Spiele einen aktuellen
  Spielstand, der per Polling abgefragt werden kann.
- **Tipp-Sichtbarkeit**: Das Backend setzt die Regel „Tipps erst nach Anpfiff"
  bereits durch und liefert vorher keine Tipps; das Frontend muss diese Regel nicht
  zusätzlich erzwingen, sondern lediglich korrekt darstellen.
- **Aktualisierungsintervall `/live`**: 30–60 Sekunden Polling gilt als
  ausreichend aktuell; ein WebSocket ist für v1 ausdrücklich ausgeschlossen.
- **Profil-Adressierung**: Spielerprofile werden ausschließlich über den
  öffentlichen Identifier in der URL erreicht; es gibt keine Suche oder Anmeldung.
- **Deployment-Umgebung**: Die Anwendung wird als öffentlich erreichbare Website
  betrieben (Vercel) und benötigt keine nutzerbezogene Sitzungsverwaltung.
- **Endpoint-Details** (genaue URLs, Antwort-Schemata, Paginierung) werden in der
  Planungsphase anhand der Backend-Schnittstelle konkretisiert.
