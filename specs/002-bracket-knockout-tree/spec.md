# Feature Specification: K.o.-Turnierbaum (/bracket)

**Feature Branch**: `002-bracket-knockout-tree`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: "Füge eine neue Seite /bracket zur Website hinzu: den K.o.-Turnierbaum der WM 2026, gespeist aus dem Backend-Endpoint /api/public/bracket. Fünfspaltiges Layout: LAST_32 (16) -> LAST_16 (8) -> QUARTER_FINALS (4) -> SEMI_FINALS (2) -> FINAL (1), plus ein separat dargestelltes THIRD_PLACE-Spiel. Je Spiel: beide Teams (oder Platzhalter wie "Sieger Gruppe A" / "Dritter A/B/C/D/F", solange nicht feststehend), Ergebnis, Status. Verbindungslinien zwischen den Runden zeigen den Pfad; Gewinner rücken sichtbar nach, sobald Ergebnisse vorliegen. Während der Gruppenphase wird der leere Baum mit Platzhaltern gezeigt. Datenaktualität per Polling/Revalidierung. Responsive: ein fünfspaltiger Baum ist sehr breit -> auf Mobil horizontal scrollbar oder rundenweise navigierbar."

## Clarifications

### Session 2026-06-19

- Q: Wie wird der sehr breite fünfspaltige Baum auf Mobilgeräten zugänglich gemacht? → A: Horizontales Scrollen des gesamten Baums **kombiniert** mit einer rundenweisen Schnellnavigation (Sprungmarken zu LAST_32 … FINAL), sodass der Baum als Ganzes erhalten bleibt und einzelne Runden gezielt angesprungen werden können.
- Q: Verlinken einzelne K.o.-Spiele auf eine Detailansicht? → A: Ja — jedes Spiel mit echter Backend-Spiel-ID verlinkt auf die bestehende Spieldetailseite `/spiel/[id]`; reine Platzhalter-Spiele (noch keine echten Teams/IDs) sind nicht klickbar.
- Q: Über welchen Mechanismus bleibt `/bracket` aktuell? → A: ISR/inkrementelle Revalidierung als Basis, ergänzt um clientseitiges Polling (30–60 s), das nur aktiv ist, solange mindestens ein K.o.-Spiel läuft; kein WebSocket.
- Q: Wird je Spiel die Anstoßzeit angezeigt? → A: Ja — Datum/Uhrzeit (Europe/Berlin) werden je Spiel angezeigt, sofern terminiert; bei nicht terminierten bzw. reinen Platzhalter-Spielen wird die Anstoßzeit ausgelassen.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Vollständigen K.o.-Baum ansehen (Priority: P1)

Ein Besucher öffnet `/bracket`, um den kompletten K.o.-Turnierbaum der WM 2026 auf
einen Blick zu erfassen. Er sieht alle fünf Runden in der korrekten Reihenfolge —
Sechzehntelfinale (LAST_32, 16 Spiele), Achtelfinale (LAST_16, 8 Spiele),
Viertelfinale (QUARTER_FINALS, 4 Spiele), Halbfinale (SEMI_FINALS, 2 Spiele) und
Finale (FINAL, 1 Spiel) — sowie das separat dargestellte Spiel um Platz 3
(THIRD_PLACE). Je Spiel werden beide Teams (oder ein Platzhalter wie „Sieger Gruppe
A" bzw. „Dritter A/B/C/D/F", solange die Paarung noch nicht feststeht), das
Ergebnis und der Status angezeigt.

**Why this priority**: Die strukturierte Darstellung aller K.o.-Runden ist der
Kern der Seite. Ohne sie existiert kein nutzbares Produkt. Sie liefert für sich
allein vollständigen Wert.

**Independent Test**: Aufruf von `/bracket` ohne weitere Seiten; alle fünf Runden
mit korrekter Spielanzahl (16/8/4/2/1) plus das Spiel um Platz 3 werden mit Teams
bzw. Platzhaltern, Ergebnis und Status angezeigt.

**Acceptance Scenarios**:

1. **Given** das Backend liefert den vollständigen Turnierbaum, **When** der
   Besucher `/bracket` öffnet, **Then** werden die fünf Runden LAST_32, LAST_16,
   QUARTER_FINALS, SEMI_FINALS und FINAL mit jeweils 16, 8, 4, 2 und 1 Spiel
   angezeigt.
2. **Given** der Turnierbaum ist geladen, **When** das Spiel um Platz 3
   (THIRD_PLACE) vorhanden ist, **Then** wird es klar erkennbar getrennt vom
   Hauptbaum dargestellt.
3. **Given** eine Paarung steht noch nicht fest, **When** das betreffende Spiel
   angezeigt wird, **Then** werden Platzhalter (z. B. „Sieger Gruppe A", „Dritter
   A/B/C/D/F") anstelle der Teamnamen dargestellt.
4. **Given** ein K.o.-Spiel hat ein Ergebnis, **When** es angezeigt wird, **Then**
   werden beide Teams mit Ergebnis und Status dargestellt.
5. **Given** ein K.o.-Spiel hat noch kein Ergebnis, **When** es angezeigt wird,
   **Then** wird ein klar erkennbarer Status (z. B. „ausstehend") statt eines
   Ergebnisses dargestellt.

---

### User Story 2 - Turnierpfad und nachrückende Gewinner verfolgen (Priority: P2)

Ein Besucher möchte nachvollziehen, wie sich der Turnierverlauf entwickelt. Er sieht
Verbindungslinien zwischen den Runden, die zeigen, aus welchen beiden Spielen einer
Runde sich die folgende Paarung speist. Sobald ein Spiel ein Ergebnis hat, rückt
der Gewinner sichtbar in das zugehörige Spiel der nächsten Runde nach und der
Pfad ist visuell verfolgbar.

**Why this priority**: Die Pfaddarstellung und das Nachrücken der Gewinner heben
die Seite von einer bloßen Spielliste ab und machen den Turnierverlauf erlebbar.
Wertvoll, aber die statische Baumdarstellung (US1) funktioniert auch ohne sie.

**Independent Test**: Aufruf von `/bracket` mit teilweise vorliegenden Ergebnissen;
Verbindungslinien zwischen aufeinanderfolgenden Runden sind sichtbar und der
Gewinner eines abgeschlossenen Spiels erscheint im zugehörigen Folgespiel.

**Acceptance Scenarios**:

1. **Given** der Turnierbaum ist geladen, **When** er dargestellt wird, **Then**
   verbinden sichtbare Linien jedes Spiel mit dem Folgespiel der nächsten Runde,
   in das sein Gewinner einzieht.
2. **Given** ein Spiel ist beendet und hat einen Gewinner, **When** der Baum
   angezeigt wird, **Then** erscheint der Gewinner als Teilnehmer des zugehörigen
   Folgespiels (Platzhalter wird durch den Teamnamen ersetzt).
3. **Given** ein Spiel ist noch nicht beendet, **When** der Baum angezeigt wird,
   **Then** bleibt der Eingang des Folgespiels ein Platzhalter und es rückt kein
   Gewinner nach.

---

### User Story 3 - Turnierbaum auf Mobilgeräten bedienen (Priority: P2)

Ein Besucher öffnet `/bracket` auf einem Smartphone. Da ein fünfspaltiger Baum für
schmale Viewports zu breit ist, kann er den Baum horizontal scrollen und über eine
rundenweise Schnellnavigation gezielt zu einer Runde (z. B. Viertelfinale) springen,
ohne die Übersicht über die Gesamtstruktur zu verlieren.

**Why this priority**: Ein erheblicher Teil der Besucher nutzt Mobilgeräte; ohne
bedienbare mobile Darstellung wäre die Seite dort praktisch unbrauchbar. Die
Grundinformation (US1) ist jedoch auch ohne optimierte Navigation lesbar.

**Independent Test**: Aufruf von `/bracket` auf einem schmalen Viewport (≤ 375 px);
der Baum ist vollständig per horizontalem Scrollen erreichbar und einzelne Runden
lassen sich über die Schnellnavigation gezielt ansteuern.

**Acceptance Scenarios**:

1. **Given** ein schmaler Viewport (≤ 375 px), **When** der Besucher `/bracket`
   öffnet, **Then** ist der gesamte Baum durch horizontales Scrollen erreichbar,
   ohne dass Inhalte abgeschnitten oder unzugänglich werden.
2. **Given** die mobile Ansicht ist geöffnet, **When** der Besucher die
   rundenweise Schnellnavigation nutzt, **Then** springt die Ansicht zur gewählten
   Runde (LAST_32 … FINAL).
3. **Given** ein breiter Desktop-Viewport, **When** der Besucher `/bracket` öffnet,
   **Then** werden alle fünf Spalten nebeneinander dargestellt.

---

### User Story 4 - Aktuelle Ergebnisse ohne manuelles Neuladen (Priority: P3)

Ein Besucher hat `/bracket` während der K.o.-Phase geöffnet und möchte, dass sich
neue Ergebnisse und nachrückende Gewinner ohne manuelles Neuladen aktualisieren.
Der angezeigte Baum spiegelt den jeweils aktuellen Stand innerhalb eines definierten
Aktualisierungsfensters wider.

**Why this priority**: Aktualität erhöht den Nutzwert während laufender Spiele, ist
aber nachrangig gegenüber der korrekten Grunddarstellung.

**Independent Test**: Aufruf von `/bracket` während (simulierter) Ergebnisänderungen;
der dargestellte Baum übernimmt den neuen Stand innerhalb des definierten Fensters
ohne Eingriff des Besuchers.

**Acceptance Scenarios**:

1. **Given** `/bracket` ist geöffnet, **When** sich ein Ergebnis ändert, **Then**
   wird der aktualisierte Stand innerhalb des definierten Aktualisierungs- bzw.
   Revalidierungsfensters angezeigt, ohne dass der Besucher neu laden muss.
2. **Given** sich keine Daten geändert haben, **When** ein Aktualisierungszyklus
   verstreicht, **Then** bleibt die Darstellung stabil und unverändert.

---

### Edge Cases

- **Gruppenphase (noch keine K.o.-Paarungen)**: Der Baum wird vollständig mit
  Platzhaltern (z. B. „Sieger Gruppe A", „Dritter A/B/C/D/F") gezeigt, sodass die
  Struktur bereits vor Beginn der K.o.-Phase erkennbar ist.
- **Backend nicht erreichbar / Fehlerantwort**: Die Seite zeigt einen
  verständlichen Fehlerzustand mit Wiederholungsmöglichkeit statt einer leeren oder
  abstürzenden Ansicht.
- **Leerer oder unvollständiger Baum**: Liefert das Backend (noch) keine oder nur
  teilweise Runden, wird ein verständlicher Zustand mit Platzhaltern dargestellt,
  ohne dass die Darstellung bricht.
- **Fehlendes THIRD_PLACE-Spiel**: Ist kein Spiel um Platz 3 vorhanden, wird der
  zugehörige Bereich ausgelassen, ohne die übrige Darstellung zu beeinträchtigen.
- **Unentschieden / Verlängerung / Elfmeterschießen**: Ein K.o.-Spiel kann trotz
  unentschiedenem regulären Ergebnis einen Gewinner haben; der nachrückende
  Gewinner richtet sich nach der vom Backend gelieferten Gewinner-Information, nicht
  allein nach dem Tor-Ergebnis.
- **Teilweise fehlende Felder pro Spiel** (z. B. fehlendes Ergebnis): Das betroffene
  Feld wird ausgelassen oder neutral dargestellt.
- **Zeitzonen-Konsistenz**: Sofern Anstoßzeiten dargestellt werden, erfolgt dies
  konsistent in Europe/Berlin, unabhängig von der Gerätezeitzone.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Das System MUSS eine Seite unter `/bracket` bereitstellen, die den
  K.o.-Turnierbaum der WM 2026 darstellt.
- **FR-002**: Das System MUSS die Baumdaten ausschließlich lesend über den
  öffentlichen GET-Endpoint des Backends (`/api/public/bracket`) beziehen; es DARF
  KEINE schreibenden Aufrufe und keine Tippabgabe-, Wett- oder
  Authentifizierungsfunktionen anbieten.
- **FR-003**: Das System MUSS die fünf K.o.-Runden in der korrekten Reihenfolge und
  mit der erwarteten Spielanzahl darstellen: LAST_32 (16), LAST_16 (8),
  QUARTER_FINALS (4), SEMI_FINALS (2), FINAL (1).
- **FR-004**: Das System MUSS das Spiel um Platz 3 (THIRD_PLACE) separat und klar
  erkennbar getrennt vom Hauptbaum darstellen, sofern es vorhanden ist.
- **FR-005**: Das System MUSS je Spiel beide Teams, das Ergebnis und den Status
  anzeigen, sofern diese vorliegen.
- **FR-005a**: Das System MUSS je Spiel die Anstoßzeit (Datum/Uhrzeit in
  Europe/Berlin) anzeigen, sofern das Spiel terminiert ist; bei nicht terminierten
  bzw. reinen Platzhalter-Spielen wird die Anstoßzeit ausgelassen.
- **FR-006**: Das System MUSS für noch nicht feststehende Teilnehmer Platzhalter
  (z. B. „Sieger Gruppe A", „Dritter A/B/C/D/F") anstelle von Teamnamen anzeigen;
  diese Platzhalterbezeichnungen werden vom Backend geliefert und vom Frontend nur
  dargestellt.
- **FR-007**: Das System MUSS Verbindungslinien zwischen aufeinanderfolgenden Runden
  darstellen, die den Turnierpfad (welches Spiel speist welches Folgespiel) sichtbar
  machen.
- **FR-008**: Das System MUSS den Gewinner eines abgeschlossenen Spiels sichtbar in
  das zugehörige Folgespiel der nächsten Runde nachrücken lassen, sobald ein
  Gewinner feststeht; maßgeblich ist die vom Backend gelieferte Gewinner-/
  Fortschrittsinformation.
- **FR-009**: Das System MUSS während der Gruppenphase (vor Feststehen der
  K.o.-Paarungen) den vollständigen Baum mit Platzhaltern anzeigen.
- **FR-010**: Das System MUSS die `/bracket`-Daten aktuell halten: serverseitige
  inkrementelle Revalidierung (ISR) als Basis, ergänzt um clientseitiges Polling
  (Intervall 30–60 s), das nur aktiv ist, solange mindestens ein K.o.-Spiel läuft.
  Ergebnisänderungen MÜSSEN ohne manuelles Neuladen innerhalb dieses Fensters
  sichtbar werden; ein WebSocket wird in v1 NICHT verwendet.
- **FR-011**: Das System MUSS auf schmalen Viewports den vollständigen Baum durch
  horizontales Scrollen zugänglich machen und zusätzlich eine rundenweise
  Schnellnavigation (Sprung zu einer Runde) bereitstellen.
- **FR-012**: Das System MUSS auf breiten Viewports alle fünf Runden nebeneinander
  als fünfspaltigen Baum darstellen.
- **FR-013**: Das System MUSS bei nicht erreichbarem Backend oder Fehlerantworten
  einen verständlichen Fehlerzustand mit Wiederholungsmöglichkeit anzeigen.
- **FR-014**: Das System MUSS bei leerem oder unvollständigem Baum sowie bei
  fehlendem THIRD_PLACE-Spiel einen verständlichen Zustand anzeigen, ohne dass die
  Darstellung bricht.
- **FR-015**: Das System MUSS die je Spiel angezeigten Anstoßzeiten (siehe FR-005a)
  konsistent in der Zeitzone Europe/Berlin darstellen, unabhängig von der
  Gerätezeitzone.
- **FR-016**: Das System MUSS `/bracket` über die bestehende Seitennavigation der
  Website erreichbar machen, konsistent mit den übrigen öffentlichen Seiten.
- **FR-017**: Das System MUSS jedes K.o.-Spiel mit einer echten Backend-Spiel-ID auf
  die bestehende Spieldetailseite `/spiel/[id]` verlinken; reine Platzhalter-Spiele
  (ohne feststehende Teams bzw. ohne Spiel-ID) DÜRFEN NICHT verlinkt/klickbar sein.

### Key Entities *(include if feature involves data)*

- **Turnierbaum (Bracket)**: Die Gesamtstruktur der K.o.-Phase, gegliedert in
  geordnete Runden plus das separate Spiel um Platz 3.
- **Runde (Round)**: Eine K.o.-Stufe mit definierter Spielanzahl. Attribute:
  Kennung (`LAST_32`, `LAST_16`, `QUARTER_FINALS`, `SEMI_FINALS`, `FINAL`,
  `THIRD_PLACE`), Reihenfolge, enthaltene Spiele.
- **K.o.-Spiel (Bracket Match)**: Eine Begegnung innerhalb einer Runde. Attribute
  u. a.: Identifier, Heim-/Auswärtsteilnehmer (Teamname **oder** Platzhalter),
  Ergebnis, Status (ausstehend/laufend/beendet), Gewinner, Verweis auf das
  Folgespiel (Pfad zur nächsten Runde).
- **Platzhalter**: Eine vom Backend gelieferte Bezeichnung für einen noch nicht
  feststehenden Teilnehmer (z. B. „Sieger Gruppe A", „Dritter A/B/C/D/F").

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ein Besucher kann `/bracket` öffnen und ohne Anleitung alle fünf
  K.o.-Runden sowie das Spiel um Platz 3 erkennen.
- **SC-002**: Der Baum zeigt in 100 % der Fälle die korrekte Spielanzahl je Runde
  (16/8/4/2/1) und das separate THIRD_PLACE-Spiel an, sofern das Backend diese
  liefert.
- **SC-003**: Für jedes Spiel, dessen Teilnehmer noch nicht feststehen, wird in
  100 % der Fälle ein Platzhalter statt eines leeren oder falschen Teamnamens
  angezeigt.
- **SC-004**: Sobald ein Spiel einen Gewinner hat, erscheint dieser im zugehörigen
  Folgespiel der nächsten Runde, und der Pfad ist über die Verbindungslinien
  nachvollziehbar.
- **SC-005**: `/bracket` ist auf Mobil- (≤ 375 px Breite) und Desktop-Viewports
  vollständig bedienbar; auf Mobil ist der gesamte Baum per horizontalem Scrollen
  erreichbar und jede Runde per Schnellnavigation gezielt ansteuerbar.
- **SC-006**: Nach einer Ergebnisänderung zeigt `/bracket` den aktualisierten Stand
  innerhalb des definierten Aktualisierungs- bzw. Revalidierungsfensters ohne
  manuelles Neuladen.
- **SC-007**: Bei nicht erreichbarem Backend zeigt `/bracket` einen verständlichen
  Fehler- bzw. Leerzustand statt einer leeren oder abstürzenden Ansicht.
- **SC-008**: Während der Gruppenphase wird der vollständige Baum mit Platzhaltern
  dargestellt, sodass die Turnierstruktur bereits vor der K.o.-Phase erkennbar ist.

## Assumptions

- **Sprache**: Die Benutzeroberfläche ist deutschsprachig, konsistent mit den
  bestehenden öffentlichen Seiten.
- **Datenquelle**: Das bestehende WM-Tippspiel-Backend stellt den Turnierbaum über
  einen öffentlichen, nicht authentifizierten GET-Endpoint (`/api/public/bracket`)
  bereit und liefert je Spiel Teams bzw. Platzhalter, Ergebnis, Status sowie eine
  Gewinner-/Fortschrittsinformation und die Zuordnung der Folgespiele.
- **Platzhalterbezeichnungen**: Die Texte für noch nicht feststehende Teilnehmer
  (z. B. „Sieger Gruppe A", „Dritter A/B/C/D/F") werden vom Backend geliefert; das
  Frontend stellt sie nur dar und berechnet sie nicht selbst.
- **Gewinner-Logik**: Welcher Teilnehmer in die nächste Runde nachrückt (inkl.
  Verlängerung/Elfmeterschießen), bestimmt das Backend; das Frontend leitet keine
  Gewinner aus dem Tor-Ergebnis ab.
- **WM-2026-Format**: Die K.o.-Phase beginnt mit dem Sechzehntelfinale (LAST_32,
  16 Spiele) entsprechend dem 48-Teams-Format der WM 2026.
- **Aktualisierung**: Die Aktualität wird über inkrementelle Revalidierung und/oder
  clientseitiges Polling sichergestellt, konsistent mit dem Ansatz der übrigen
  öffentlichen Seiten; ein WebSocket ist für v1 nicht vorgesehen.
- **Mobile Navigation**: Horizontales Scrollen des Gesamtbaums kombiniert mit einer
  rundenweisen Schnellnavigation (siehe Clarifications) gilt als ausreichend; die
  generelle „kein horizontales Scrollen"-Vorgabe anderer Seiten gilt für den
  bewusst breiten Turnierbaum nicht.
- **Endpoint-Details** (genaues Antwort-Schema, Feldnamen, Statuswerte) werden in
  der Planungsphase anhand der Backend-Schnittstelle (OpenAPI) konkretisiert und im
  Contract dokumentiert.
