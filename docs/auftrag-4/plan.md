# Saltmoor: Plan für die Überarbeitung (Look-Runden 1–7)

Stand 2026-11-14. Abgenommen von Philip. Original als Claude Doc: https://claude.ai/artifact/4jaQhJLhok8egK5FZVPGKh

Die Überarbeitung kommt in fünf Phasen. Zuerst die Grundlagen (Raster, Bildraum, Schriften), dann die Tiefe im Kampfbild, die neue Kampfoberfläche, die Bewegung und am Ende die anderen Bildschirme. Momentum im Build-Flow ist ein eigener Block, der Spielregeln ändert und unabhängig davon getestet wird.

Der Plan fasst sieben Look-Runden vom 14.11. zusammen und gleicht sie mit Auftrag 3 (Welle 2, `docs/auftrag-3/05-oberflaeche.md`) ab. Wo eine neue Entscheidung etwas aus Auftrag 3 ablöst, steht das im Abschnitt Konflikte. Texte und Sprüche im Spiel bleiben in allen Phasen unverändert.

| Runde | Mockup (Datei im Repo) | Original | Inhalt |
| --- | --- | --- | --- |
| 1 | [vorlagen/look-runde-1](vorlagen/look-runde-1/index.html) | [Artifact](https://claude.ai/artifact/SXPDznub9xUQus2wyfbR69) | Diagnose, Bewegung, Szene statt Kasten, Zwischentitel, Titel |
| 2 | [vorlagen/look-runde-2](vorlagen/look-runde-2/index.html) | [Artifact](https://claude.ai/artifact/WbQqxBKXneEQj66VkxsWNa) | Lichtpult (Tiefe), Oberfläche Variante A |
| 3 | [vorlagen/look-runde-3](vorlagen/look-runde-3/index.html) | [Artifact](https://claude.ai/artifact/A1WHD8RFyR7Vok4e3YXLEN) | Variante A sauber, Element-Bogen, Karten-Stresstest, Menü |
| 4 | [vorlagen/look-runde-4](vorlagen/look-runde-4/index.html) | [Artifact](https://claude.ai/artifact/Jh9MVgRm2Pt583bnMrnS4D) | Plakette 50 × 26, Karte 50 × 70, Layouts A bis D |
| 5 | [vorlagen/look-runde-5](vorlagen/look-runde-5/index.html) | [Artifact](https://claude.ai/artifact/XZsHduzFxM5qsUpyB73HFz) | Fußleiste mit Schultern, Baum-Fassungen, Verdeckung |
| 6 | [vorlagen/look-runde-6](vorlagen/look-runde-6/index.html) | [Artifact](https://claude.ai/artifact/6JjcEA15DVz9BvN9p7mzkV) | Flache Schultern, Hover, Bildraum |
| 7 | [vorlagen/look-runde-7](vorlagen/look-runde-7/index.html) | [Artifact](https://claude.ai/artifact/CzU1Nz2WyD1omrYD969Cbx) | **Referenz für die Umsetzung:** Feinschliff, Bildraum Mitte |

Bildschirmfotos der Referenz: [vorlagen/runde-7-mitte-eckig.png](vorlagen/runde-7-mitte-eckig.png) und [vorlagen/runde-7-mitte-geschwungen.png](vorlagen/runde-7-mitte-geschwungen.png). Die laufende Entscheidungsliste aller Runden steht in [verlauf-look-runden.md](verlauf-look-runden.md).

Die Mockups sind eigenständige HTML-Seiten (Google Fonts per Link, Bilder in `img/`). Zum Ansehen den Ordner `docs/auftrag-4/vorlagen/` über einen lokalen Server öffnen, zum Beispiel `python3 -m http.server` im Ordner `vorlagen/`. Die Mockups enthalten Hilfsfunktionen, die übernommen werden sollen: `slice9()` (9-Slice-Rahmen als `border-image`), `makeRenderer` (Licht, Dunst, Strahlen, Augenlicht, Spiegelung, Vignette), `fussBild()` (Fußleiste mit Schultern), `passen()` (Kartentext in Stufen) und die Überlappungsprüfung mit gedrehten Kartenpolygonen.

## Was feststeht

Alles hier ist von Philip abgenommen. Die Maße gelten in Spielpixeln der Oberfläche (480 × 270, ganzzahlig skaliert).

### Bild und Raster

- **Ein Pixelraster für die Gegner:** Sie werden nicht mehr skaliert (heute 0,9 oder 0,92). Tiefe entsteht über Reihe, Höhe und Dunst (Runde 2).
- **Bildraum Mitte (Runde 7):** Die Szene ist 560 × 315 groß, also halb „nach unten erweitert“, halb „größerer Raum“. Die Kamera sitzt 15 Pixel tiefer. Jede Szene wird um 40 Pixel nach links und rechts und um 48 nach unten erweitert. Verdeckt sind damit 1 % der Gegner statt 24 %.
- **Oberfläche immer gleich groß:** Plaketten, Karten und Leisten haben in jeder Bildgröße dieselben Maße. Nur die Lage der Plaketten folgt den Gegnern.
- **Ein Bildformat:** Kampf und alle anderen Bildschirme sind 16:9 mit derselben Bildbreite. Der Kampf ist nicht mehr 4:3 mit Leiste darunter.
- **Leichte Vignette.**

### Tiefe im Kampfbild (Runde 2, Preset „Alles“ ohne Vordergrund)

- **Szenenlicht auf den Gegnern:** Randpixel zur Lichtquelle bekommen die Lichtfarbe (oben und zur Lichtseite 60 %, an Ecken 85 %). Der Körper geht 30 % zur Raumfarbe, helle Pixel ziehen zur Lichtfarbe. Je Bild gecacht, pro Szene ein Lichtpunkt mit Farbe.
- **Bodenkontakt:** Ein gerasterter Schatten fällt vom Licht weg. In Wasserszenen gibt es eine Spiegelung Zeile für Zeile mit Wellenversatz, die Füße stehen 2 Pixel im Wasser.
- **Luft zwischen den Ebenen:** Bayer-Dunst zwischen Ebene 2 und 3 und über dem Boden zieht langsam, die hintere Reihe steht dichter darin.
- **Lichtstrahlen** nur in Szenen mit Lichtquelle, vor den Gegnern.
- **Augenlicht:** ein gerasterter Fleck auf dem Boden, im Wasser gespiegelt.
- **Gegner leben (Runde 1):** zeilenweises Wiegen, Atmen (Höhe ±2 %), Treffer mit weißem Blitz, Rückstoß und Stauchen, Angriff mit Ausholen, pulsierende Augen.

### Kampfoberfläche (Variante A, Runden 3 bis 7)

- **Stil:** 9-Slice-Pixelrahmen mit Fase und Randlicht in Zonenfarbe. Zahlen in Jersey 10, Namen in Silkscreen, Fließtext in Pixelify Sans.
- **Fußleiste mit Schultern:** In der Mitte ist sie 18 hoch und steht unter der Hand. Die Schultern links und rechts sind 44 hoch und 118 breit, mit Randlicht oben. Die Form ist noch offen (eckig oder geschwungen).
- **Leben unter der Hand:** Schild mit Block-Zahl, Balken 224 breit und 8 hoch, Block als blaue Kerben am Ende, dahinter Zahl und Zustände. Ein heller Rest läuft beim Schaden verzögert nach.
- **Linke Schulter:** außen der Ziehstapel (16 × 20), innen der Reaktionsbaum „Klar“ (88 × 36). Beide sitzen senkrecht mittig.
- **Rechte Schulter:** innen die Energie (Rauten 11, mit Zwischenraum 3) über „Zug beenden“ (84 breit), außen die Ablage. Alles ist spiegelgleich zur linken Seite.
- **Reaktionsbaum „Klar“:** links die Kette, ein Stamm mit waagrechten Ästen und keine Schrägen. Der spielbare Weg ist hell, die Namen stehen in Jersey 10.
- **Karte 50 × 70:** Name 11, darunter ein Bildfenster, das den Rest füllt, dann Text und Schlagwort-Marke. Die Schrift wird in Stufen kleiner (5,4 / 5,0 / 4,6, zuletzt 4,2). Alle Grenzfälle bis 85 Zeichen passen ohne leere Fläche.
- **Hand:** Sie hat 236 Pixel in der Mitte, Abstand bis 45 und 2° je Karte. Bei mehr Karten rücken sie enger. Die Karten sind immer ganz sichtbar und tauchen nicht ab.
- **Hover:** Die Karte wird 107 % groß und heller und verschiebt sich nicht, damit man schnell hintereinander spielen kann.
- **Plakette 50 × 26:** oben die Absicht groß, rechts die Zustände, darunter der Balken mit der Zahl darin. Der Name erscheint nur bei Hover oder Ziel. Das Ziel bekommt einen Rahmen ganz in Zonenlicht.
- **Kopfleiste oben links** ist unwichtig und bleibt schlicht. Der Menüknopf darf „Deck“ nicht verdecken.

### Bewegung (Runde 1)

- Die Karten fächern sich. Beim Ausspielen holt die Karte aus, fliegt zum Ziel oder zum Lebensbalken und löst sich auf.
- Der Aufprall bekommt Hitstop (~70 ms), Splitter in Zonenfarbe und eine aufspringende Zahl.
- Ausgeteilt wird vom Ziehstapel mit Umdrehen. Am Zugende fliegt die Hand zur Ablage.
- Die Energie-Rauten erlöschen beim Bezahlen und leuchten zu Zugbeginn nacheinander auf. Reaktionen schlagen als Stempel ein.

### Andere Bildschirme (Runde 1 und 3)

- **Szene statt Kasten:** Rast (Optionen ums Feuer, das auf den Zeiger reagiert), Beute (der Gegner zerfällt, ein Lichtschacht, der Handgriff steigt auf, Gold fliegt zum Zähler), Werkstatt (Werkbank), Fundstelle (die Lore kippt), Krämer (Ware auf dem Tisch). Der Ortsname steht wie ein Zwischentitel oben links.
- **Akt-Wechsel als Zwischentitel:** Irisblende, Viragierung in Zonenfarbe, Korn und Kratzer, der Titel flackert Buchstabe für Buchstabe herein. Einmal pro Akt.
- **Titel:** Der Leuchtturmkegel kreist und läuft einmal durch den Schriftzug, die Fenster flackern, Nebel zieht. Das Menü ist Schrift mit einem kleinen Licht als Auswahl.
- **Spielmenü:** Plakettenknöpfe mit vier Zuständen (Runde 3).
- **Rucksack:** Statt „TIEFE I · KARTE“ steht dort der richtige Titel.

## Konflikte und wie sie aufgelöst sind

Zwölf Stellen widersprechen Auftrag 3 oder einer früheren Runde. In jedem Fall gilt die neuere Entscheidung. Die alte Stelle wird beim Umbau entfernt und nicht überdeckt. Die Zeile zum Reaktions-Band braucht noch ein kurzes Ja (Standard bis dahin: ja).

| Thema | Vorher | Jetzt |
| --- | --- | --- |
| Footer | Auftrag 3: Tisch mit Messingkante. Links Balken und Baum, rechts Energie und „Stapel x · Ablage y“ als Text | Fußleiste mit Schultern (Runde 6/7), Leben unter der Hand, Stapel als Pixelstapel außen auf den Schultern |
| Rahmenfarbe | Auftrag 3: Messingrand an Plakette und Footer | Randlicht in Zonenfarbe (Runde 1, Punkt 3). Messing bleibt nur an Kartenrahmen, Rauten und Schlagwort-Marken |
| Plakette | Auftrag 3: Zustände unter der Plakette, Name sichtbar. Runde 3: 76 × 34 | 50 × 26, Zustände rechts in der Plakette, Name nur bei Hover oder Ziel. Stumme Gegner: Die Zeile für die Absicht entfällt ganz (wie in Auftrag 3) |
| Gegnergröße | Auftrag 3: vorn groß, hinten kleiner (`stell` mit Maßstab), Boss 0,92 | Kein Skalieren. Das Feld `stell` behält x und Bodenlinie, der Maßstab wird 1. Tiefe kommt über Höhe und Dunst |
| Reaktions-Band an der Karte | Auftrag 3: Band unten an der Karte („DAMPF“), die Karte leuchtet in Stofffarbe | Bleibt. Neu liegt es über der Unterkante des Bildfensters, damit es weder den Text noch das Leben in der Fußleiste verdeckt. **Kurz prüfen** |
| Hover | Runde 1: Karte hebt sich, Nachbarn weichen aus. Runde 3: 130 % und nach oben | 107 % und heller, keine Bewegung (Runde 6) |
| Fächer | Runde 1/3: 5° je Karte, Abstand 40 | 2° je Karte, Abstand bis 45, Hand höchstens 236 breit (Runde 4) |
| Kartenmaße | Runde 3: 60 × 84 mit festem Bild | 50 × 70, das Bild füllt den Rest (Runde 4) |
| Baum | Auftrag 3: Bögen, Strichlinien, Schrift Cinzel | „Klar“: rechtwinklig, Jersey 10. Gold für Hochreaktionen, Sackgasse, Mitrücken und Regelbiegungen (Über Eck, Falsche Winkel, Farbe) bleiben wie in Auftrag 3 |
| Menü | Runde 1: Menü als Schrift mit Licht. Runde 3: Plakettenknöpfe | Beides gilt, getrennt: Titelmenü als Schrift mit Licht, Spielmenü (Pause) mit Plakettenknöpfen |
| Überarbeitete UI aus Runde 1 (Mockup 1 und 5) | lesbar, wirkt aber „etwas nach AI“ | Bleibt nur als Referenz und wird nicht umgesetzt. Umgesetzt wird Variante A |
| Bildformat | Kampf 4:3 mit Leiste, offen war „Szenen breiter malen“ | Bildraum Mitte 560 × 315 in 16:9. Das löst beide Punkte mit einer Erweiterung der Szenen |

**Bleibt aus Auftrag 3 unverändert:**

- Beim eigenen Balken bricht bei drohendem Verlust zuerst das Blau, der rote Rest wird schraffiert.
- Es gibt kein Fragezeichen in der Oberfläche.
- Die Regelbiegung steht in der Kopfleiste.
- Keine Kamera im Kampf. Die Fahrt nach vorne bleibt nur als Übergang zwischen Knoten. Sie muss mit den erweiterten Szenen laufen.
- Peilkarte und Rucksack „Am Körper“ bleiben.

## Phasen der Umsetzung

Die Phasen bauen aufeinander auf. Phase 0 legt Raster und Bildraum fest, auf die alles andere misst. Phase 1 und 2 können danach parallel laufen, weil die eine in der Szene (`buehne.js`) und die andere in der Oberfläche (`kampf.js`, CSS) arbeitet. Jede Phase endet mit einem Spieltest im Browser, mit stummgeschaltetem Ton. Erst nach Philips Blick wird gemergt.

### Phase 0: Grundlagen

- [ ] Einen gemeinsamen Spielraster für die Oberfläche anlegen: 480 × 270 und `--px` = 1 Oberflächenpixel. Ganzzahlig skalieren, wo der Bildschirm es zulässt.
- [ ] Den Kampf auf 16:9 umstellen, dieselbe Bildbreite wie auf den anderen Bildschirmen. Die 4:3-Leiste entfällt.
- [ ] Die Szene in ihrer eigenen Größe 560 × 315 rendern und als Ganzes unter die Oberfläche skalieren. Bei 1080p ist das der Faktor 3,43. Prüfen, ob eine leichte Glättung nötig ist, sonst als Ausweg 640 × 360 nehmen.
- [ ] Prüfen, ob der Szenengenerator (`js/scenes/world`) die Ebenen breiter und tiefer erzeugen kann. Das Ziel ist, dass jede Ebene x −40 bis 520 und y 3 bis 318 abdeckt. Heute deckt sie −12 bis 492 und −12 bis 282 ab. Wo der Generator das nicht kann, die Ränder malen.
- [ ] Die Gegner in Szenenkoordinaten setzen und die Plaketten in Oberflächenkoordinaten daraus ableiten. Die Plaketten haben eine feste Größe.
- [ ] Den 9-Slice-Erzeuger und die Bausteine aus dem Mockup übernehmen (Plakette, Knopf mit vier Zuständen, Fenster, Kartenrücken, Raute 11 und 13). Dazu die Zonenfarben je Biom als Randlicht.
- [ ] Die drei Schriften laden: Jersey 10, Silkscreen und Pixelify Sans. Cinzel und IM Fell bleiben nur für Zwischentitel und Titel.

**Abnahme:** Kampf und Rast haben dieselbe Bildbreite. Bei drei Fenstergrößen sind die Plaketten gleich groß. Keine Szene zeigt am Rand Schwarz.

### Phase 1: Tiefe im Kampfbild (`js/scenes/buehne.js`)

- [ ] Die Skalierung 0,9, 0,92 und 1,3 entfernen. Das Feld `stell` behält x und Bodenlinie.
- [ ] Szenenlicht je Szene: Lichtpunkt, Lichtfarbe und Raumfarbe als Daten. Das Relight je Bild cachen.
- [ ] Bodenkontakt: Schatten, und in Wasserszenen die Spiegelung mit Füßen im Wasser.
- [ ] Bayer-Dunst zwischen den Ebenen und über dem Boden.
- [ ] Lichtstrahlen (Maske einmal pro Szene), Augenlicht und Vignette.
- [ ] Gegner leben: Wiegen, Atmen, Treffer und Angriff mit Ausholen, Augen.

**Abnahme:** Kapelle und Salzstollen sehen aus wie im Lichtpult ([vorlagen/look-runde-2](vorlagen/look-runde-2/index.html)) mit „Alles“ ohne Vordergrund. Bei 60 fps bleibt das Bild flüssig.

### Phase 2: Kampfoberfläche (`js/ui/kampf.js`, `plakette.js`, `stoffbaum.js`, `css/spiel.css`, `plakette.css`, `stoffbaum.css`)

- [ ] Die Fußleiste mit Schultern als Pixelbild bauen, mit Randlicht in Zonenfarbe. Den alten Footer entfernen.
- [ ] Das Leben unter die Hand setzen: Schild, Balken 224, Block-Kerben, Zahl und Zustände. Dazu den Nachlauf und den drohenden Verlust aus Auftrag 3.
- [ ] Linke Schulter: Ziehstapel und Baum „Klar“. Die Logik bleibt in `baumDaten`, nur die Zeichnung wird neu.
- [ ] Rechte Schulter: Energie (Rauten 11), „Zug beenden“ (84) und Ablage.
- [ ] Die Karte 50 × 70 mit füllendem Bild und Schriftstufen. Zahlen im Kartentext in Jersey 10, weil eine 5 in Pixelify Sans bei 5 Pixeln wie ein S aussieht.
- [ ] Das Reaktions-Band über der Unterkante des Bildfensters einbauen (siehe Konflikte).
- [ ] Die Hand: 236 breit, 2° je Karte. Hover mit 107 % ohne Bewegung.
- [ ] Die Plakette 50 × 26 mit Name bei Hover oder Ziel und ohne Absicht bei stummen Gegnern. Plaketten überlappen nie und weichen in der Höhe aus.
- [ ] Die Überlappungsprüfung aus dem Mockup als Test übernehmen, mit 5, 7 und 10 Karten und mit den 10 längsten Kartentexten.

**Abnahme:** Das Spiel sieht aus wie Look-Runde 7 ([vorlagen/look-runde-7](vorlagen/look-runde-7/index.html)). Die Prüfung meldet keine Überlappung. Die Verdeckung der Gegner in der Kapelle liegt bei höchstens 2 %.

### Phase 3: Bewegung (`js/ui/kampf.js`)

- [ ] Austeilen vom Stapel mit Umdrehen, und am Zugende fliegt die Hand zur Ablage.
- [ ] Ausspielen mit Ausholen und Flug, dazu Hitstop, Splitter und Schadenszahl.
- [ ] Die Energie-Rauten erlöschen und leuchten nacheinander auf. Reaktionen kommen als Stempel.

**Abnahme:** Drei Karten lassen sich in unter zwei Sekunden hintereinander spielen, ohne dass eine Animation den Klick schluckt.

### Phase 4: Andere Bildschirme (`js/ui/bildschirme.js`, `js/scenes/fahrt.js`, Titel)

- [ ] Rast, Beute, Werkstatt, Fundstelle und Krämer als Szene statt Kasten, die Knöpfe im Stil A.
- [ ] Der Akt-Wechsel als Zwischentitel, nach der Fahrt nach vorne und einmal pro Akt.
- [ ] Titel mit Leuchtturm, Nebel und Schriftmenü. Das Spielmenü mit Plakettenknöpfen.
- [ ] Den Titel im Rucksack korrigieren. Prüfen, dass der Menüknopf „Deck“ nicht verdeckt (seit PR #27 vermutlich erledigt).

**Abnahme:** Kein Bildschirm zeigt mehr einen schwarz-goldenen Kasten als Hauptform.

## Eigener Block: Momentum im Build-Flow

Dieser Block ändert Spielregeln, nicht den Look. Er läuft getrennt von den Phasen, damit sich ein Spieltest des Flows nicht mit dem neuen Aussehen vermischt. Grundlage ist die Einschätzung [Mehr Momentum](https://claude.ai/artifact/CSJrSKXyTVbYrHw5rV8Uwe).

**Stufe 1: drei kleine Hebel zusammen testen** (etwa ein Tag, `js/core/run.js`, `js/core/state.js`)

- [ ] Reliquien wirken auch aus dem Rucksack. `passive()` liest Reliquien aus `besitz()` statt nur aus `allActive()`.
- [ ] Der Handgriff wird beim Ritzen vorgeschlagen. Er liegt nach dem Kampf schon im besten freien Item, mit sichtbarem Grund. Ein Klick bestätigt, Ziehen ändert.
- [ ] Jeder besiegte Wächter gibt einen Slot im Bereich deiner Wahl (bis 4).

**Stufe 2, nur wenn der Flow noch fehlt:** die Westentasche mit Andenken. Das sind etwa 20 kleine Dinge ohne Slot, Karte oder Stoff.

**Berührungspunkte mit dem Look, damit nichts doppelt gebaut wird:**

- Der Vorschlag beim Ritzen und „Belohnung als Zuwachs zeigen“ gehören in die neue Beute-Szene aus Phase 4. Den Vorschlag zuerst im heutigen Belohnungsbild testen und dann in die Szene übernehmen.
- Die Andenken bräuchten Platz im Kampfbild. Die Fußleiste ist voll. Vorschlag ist die Kopfleiste oben links, die Philip ohnehin unwichtig findet. Erst entscheiden, wenn Stufe 2 kommt.
- Die Wächter-Slot-Wahl braucht einen eigenen Moment nach dem Wächter. Den im Stil A bauen, nicht als alten Kasten.

## Noch offen und nicht dabei

**Offen, mit Empfehlung als Standard bis zur Entscheidung:**

- [ ] Form der Schultern: eckig mit Fase oder geschwungen. Standard: eckig, passt zu den Fasen der anderen Bausteine. Beide Formen als Schalter anlegen, damit Philip umschalten kann.
- [ ] Ziehstapel und Ablage: Sie bleiben vorerst außen auf den Schultern, sind aber laut Philip noch nicht endgültig.
- [ ] Reaktions-Band über der Unterkante des Bildfensters: ja oder nein. Standard: ja.
- [ ] Ist eine leichte Glättung bei 560 × 315 sichtbar? Wenn sie stört, auf 640 × 360 gehen.

**Bewusst nicht dabei:**

- Der Vordergrund (dunkle Formen vor den Gegnern) und die Verdeckung des hinteren Gegners durch eine Säule (Runde 2, abgelehnt).
- Das Abtauchen der Hand beim Zielen und Karten, die nur halb zu sehen sind (Runde 5, abgelehnt).
- Kleinere Karten.
- Die drei Kreativ-Entwürfe Laterne, Séance und Film (Runde 3). Sie sind nicht entschieden und bleiben im Ideenspeicher.
- Jede Änderung an Texten und Sprüchen.
