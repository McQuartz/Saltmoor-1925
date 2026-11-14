# To-Do für die nächste Version: Look-Runde 1

Stand 2026-11-14. Philip hat alles aus der Look-Runde 1 abgenommen („alles unterschreiben, wird alles umgesetzt“).
Mockups: https://claude.ai/artifact/SXPDznub9xUQus2wyfbR69 (Quelle: `/mnt/project-files/mockups/look-runde-1/index.html`)

Texte und Sprüche im Spiel bleiben unverändert. Am Zeichenstil ändert sich nichts.

## Beschlossen (umsetzen)

### 1. Gegner atmen (`js/scenes/buehne.js`)
- Zeilenweises Wiegen über dem vorhandenen Sprite: Versatz pro Zeile = sin(t + Zeile), nach oben stärker, Fuß fest.
- Atmen: leichtes Strecken in der Höhe (±2 %), Breite gegenläufig.
- Treffer: weißer Blitz der Silhouette (~120 ms), Rückstoß, kurzes Stauchen.
- Angriff mit Ausholen: erst zurücklehnen (~180 ms), dann nach vorn und größer (zur Kamera hin).
- Augen pulsieren leicht.

### 2. Karten fliegen (`js/ui/kampf.js`, `css/spiel.css`)
- Hand als Fächer (Drehung und Bogen), beim Hover heben sich die Karten, die Nachbarn weichen aus.
- Ausspielen: Karte holt aus, fliegt zum Ziel (Angriff) oder zum Lebensbalken (Block) und löst sich auf.
- Aufprall: Hitstop ~70 ms, Splitter in Zonenfarbe, Schadenszahl springt auf.
- Ziehstapel links und Ablage rechts sichtbar mit Zähler. Austeilen vom Stapel mit Umdrehen, Zugende wirft die Hand zur Ablage.
- Energie: Rauten erlöschen beim Bezahlen und leuchten zu Zugbeginn nacheinander auf.
- Reaktionen (z. B. „Verstärkt“) als Stempel, der einschlägt.

### 3. Eine Plakette (`css/spiel.css`: button.deco, .tst, .box und andere)
- Ein Baustein für Knöpfe, Kästen und Gegner-Plaketten: dunkle Fläche, Fase (abgeschrägte Ecken), oben Randlicht in Zonenfarbe, unten eine dunkle Kante.
- Gedrückt: 2 px nach unten, Randlicht dünner.
- Die Leiste unten bekommt oben eine Kante Zonenlicht.

### 4. Lebensbalken mit Nachlauf (`js/ui/kampf.js`)
- Ein heller Rest schrumpft verzögert hinterher. Block als blaue Schraffur am Ende des Balkens.

### 5. Rohe Kanten
- Der Menüknopf darf „Deck“ in der Kopfleiste nicht mehr verdecken.
- Im Rucksack steht „TIEFE I · KARTE“; da gehört der richtige Titel hin.
- Leeres Quadrat unten links im Kampf entfernen und den schwarzen Streifen unter den Karten schließen.
- Im Kampf (4:3 mit Balken) und auf den anderen Bildschirmen dieselbe Bildbreite.
- Der Lebensbalken bleibt immer an derselben Stelle.

### 6. Szene statt Kasten (`js/ui/bildschirme.js`)
- Rast, Beute, Werkstatt, Fundstelle, Krämer: Der Ortsname steht wie ein Zwischentitel oben links, die Wahl liegt im Raum.
- Rast: Die Optionen hängen ums Feuer, und das Feuer reagiert auf den Zeiger.
- Beute: Der Gegner zerfällt, die Welt dunkelt ab, ein Lichtschacht erscheint, der Handgriff steigt auf, Gold fliegt zum Zähler.
- Werkstatt: Werkbank in der Szene. Fundstelle: die Lore kippt. Krämer: die Ware liegt auf seinem Tisch.

### 7. Akt-Wechsel als Zwischentitel (`js/scenes/fahrt.js`, Phase `uebergang`)
- Irisblende, die Szene in Zonenfarbe viragiert, Filmkorn und Kratzer, der Titel flackert Buchstabe für Buchstabe herein.
- Danach löst sich die Färbung, und die Leiste fährt hoch. Einmal pro Akt („Stummfilm nur ab und zu“).

### 8. Titel
- Der Leuchtturmkegel kreist, sein Licht läuft über das Wasser und einmal durch den Schriftzug.
- Die Fenster flackern, Nebel zieht.
- Das Menü ist Schrift statt Kästen, die Auswahl markiert ein kleines Licht.

## Philips Anmerkungen dazu (2026-11-14)
- Die überarbeitete UI (Mockup 1 und 5) ist besser lesbar als vorher, wirkt aber „ein bisschen nach AI“. Sie nicht verwerfen, sondern als Referenz behalten.
- Gegner-Boxen: Sie sind gut lesbar. Eine Pixel-Variante könnte schwerer lesbar werden, soll aber ausprobiert werden.
- Kopfleiste oben links („Tiefe … · Zug …“) ist unwichtig.
- Das eigentliche Problem im Kampfbild: Es sieht nach „Gegner plus Hintergrund“ aus. Daraus folgt Look-Runde 2 (Tiefe im Kampfbild, Pixel-UI-Varianten).

---

# Look-Runde 2: Entscheidungen (2026-11-14)
Mockups: https://claude.ai/artifact/WbQqxBKXneEQj66VkxsWNa (Quelle: `/mnt/project-files/mockups/look-runde-2/index.html`). **So soll es aussehen:** Preset „Alles“ im Lichtpult, aber OHNE den Schalter „Vordergrund“.

## Umsetzen (Tiefe im Kampfbild)
- **Atmen und Wiegen** (aus Runde 1).
- **Szenenlicht auf den Gegnern:** Randpixel, die zur Lichtquelle der Szene zeigen, bekommen die Lichtfarbe (oben und an der Seite zum Licht; ca. 60 %, an Ecken 85 %). Der Körper geht 30 % zur Raumfarbe, eigene helle Pixel ziehen zur Lichtfarbe. Je Bild cachen. Pro Szene eine Lichtquelle (Punkt plus Farbe), z. B. Kapelle (240,62) #8dffd0 mit Raum #0b1a16, Salz (443,108) #ffd29a mit Raum #2a2420.
- **Bodenkontakt:** gerasterter Schatten, der vom Licht weg fällt (im Salzstollen schräg weg von der Laterne). In Wasserszenen eine zeilenweise Spiegelung mit Wellenversatz und jede zweite Zeile, die Füße 2 px im Wasser, kleine Wellenpunkte um die Knöchel.
- **Luft zwischen den Ebenen:** gerasterter Dunst (Bayer 4×4) in Nebelfarbe zwischen Ebene 2 und 3 sowie über dem Boden, langsam ziehend; die hintere Reihe steht dichter darin.
- **Lichtstrahlen** (nur in Szenen mit Lichtquelle): Strahlmaske einmal pro Szene, pro Bild Rasterung und Staub, Strahlen liegen vor den Gegnern.
- **Augen leuchten in den Raum:** gerasterter Lichtfleck unter den Augen auf dem Boden, im Wasser gespiegelt.
- **Ein Pixelraster:** Gegner nicht mehr auf 0,9 skalieren. Tiefe entsteht über Reihe und Dunst.
- Leichte Vignette.

## Nicht umsetzen
- Vordergrund (dunkle Formen vor den Gegnern) und Verdeckung des hinteren Gegners durch die Säule.

## Oberfläche
- **Variante A (ganz Pixel)** ist gewählt: 9-Slice-Rahmen im Spielraster mit Fase und Randlicht, Kerbenbalken, Rauten als Pixelbild, Zahlen in Jersey 10, Text in Pixelify Sans und Silkscreen.
- Saubere Fassung mit Element-Bogen und Stresstest für lange Kartentexte folgt in Look-Runde 3.

---

# Look-Runde 3: saubere Variante A (Referenz für die Umsetzung)
Mockup: https://claude.ai/artifact/A1WHD8RFyR7Vok4e3YXLEN (Quelle: `/mnt/project-files/mockups/look-runde-3/index.html`)
- Maße in Spielpixeln: Leiste 58, Karte 60 × 84 (Name 13, Bild 26 bzw. 17 kompakt), Plakette 76 × 34, Knopf 15 hoch, Raute 13, Stapel 20 × 26, Ränder 12, Fächerabstand 40 bei 5° Drehung.
- Satzregeln für Karten: Name in Silkscreen, Stufen 5,4/4,8/4,2. Text in Pixelify Sans, Stufen 5,6/5,2/4,8, danach kompaktes Bild mit 5,2/4,8. Schlagworte (Behalten, Verbraucht, Funke) als Messingmarke. Alle 10 Grenzfälle aus dem Spiel passen (bis 85 Zeichen).
- Menü im selben Stil (Plakettenknöpfe mit 4 Zuständen).
- Kreativ-Entwürfe (Laterne, Séance, Film) sind noch nicht entschieden.

---

# Look-Runde 4: Layout (2026-11-14, Entscheidung offen)
Mockup: https://claude.ai/artifact/Jh9MVgRm2Pt583bnMrnS4D (Quelle: `/mnt/project-files/mockups/look-runde-4/index.html`)
Anlass (Philip): Plaketten zu groß, Karten mit leerer Fläche unten, Karten verdecken Ablage, Ziehstapel verdeckt Schild, Reaktionsbaum fehlt, alles gequetscht. Maßstab von Mockup 7A war gut.
- Plakette neu 50 × 26 statt 76 × 34: Absicht groß, Zustände rechts, Leben als Zahl im Balken; Name nur bei Hover oder Ziel als Schildchen darüber.
- Karte neu 50 × 70: Name 11, das Bildfenster füllt den Rest, Text darunter. Stufen 5,4 / 5,0 / 4,6, dann Bild bis 11, zuletzt 4,2 (nur „Ausschlagen“). Alle 10 Grenzfälle passen, keine leere Fläche.
- Hand bekommt die Mitte mit 236 px (Abstand bis 45, nur der Rahmen überlappt, 2° je Karte). Seitenzonen je 102 px. Nichts liegt neben der Hand.
- Reaktionsbaum im Pixelraster (102 × 30 bis 40), Kette links, Äste rechts.
- Vier Layouts: A Sauber (Leiste 64), B Fußleiste 18 unter der Hand mit Leben (Philips Idee, meine Empfehlung), C Tafeln in den Ecken, D Tisch unter dem Bild (Bild 196 hoch).

# Look-Runde 5: Fußleiste mit Schultern (2026-11-14)
Mockup: https://claude.ai/artifact/XZsHduzFxM5qsUpyB73HFz (Quelle: `/mnt/project-files/mockups/look-runde-5/index.html`)
- **Entschieden (Philip):** Die Fußleiste kommt (aus Runde 4 B). Sie ist in der Mitte schmal (18) und steigt an den Seiten zu Schultern (62) hoch. Links darauf steht der Reaktionsbaum, rechts Energie und Zugende, wie die Tafeln aus C.
- Offen: eckige Schultern (Fase 4, meine Empfehlung) oder geschwungene.
- Reaktionsbaum: In Runde 4 war er zu verpixelt. Neu gibt es „Klar“ (rechtwinklige Äste, meine Empfehlung) und „Liste“ (2 Spalten). Die Namen stehen in Jersey 10 mit Groß- und Kleinschreibung. Welche Fassung, ist noch offen.
- Verdeckung der Gegner (Kapelle, 5 Karten): A 3 %, B 25 %, Schultern 24 %. Mit angehobenem Bild sind es 2 %, beim Zielen 0 %.
  - Empfehlung: das Bild um 18 px anheben (Kamera tiefer, oben fällt Decke weg).
  - Empfehlung: Beim Zielen taucht die Hand um 40 px hinter die Leiste ab.
  - Die Karten nicht kleiner machen.

# Look-Runde 6: Flache Schultern und Bildraum (2026-11-14)
Mockup: https://claude.ai/artifact/6JjcEA15DVz9BvN9p7mzkV (Quelle: `/mnt/project-files/mockups/look-runde-6/index.html`)
- **Entschieden (Philip):** Der Reaktionsbaum ist „Klar“: rechtwinklige Äste, Namen in Jersey 10. Die Anordnung von Leben, Block und Energie passt.
- **Entschieden (Philip):** Die Karten sind immer ganz sichtbar, ohne Abtauchen. Beim Hover werden sie nur leicht hervorgehoben (107 %, heller) und verschieben sich nicht, damit man schnell spielen kann.
- Umgesetzt im Mockup: Die Schultern sind flacher, 44 statt 62.
  - Beide Seiten sind gleich aufgebaut: außen der Stapel (links Ziehen, rechts Ablage), innen links der Baum und rechts die Energie über Zugende.
  - Die Energie-Rauten sind 11 statt 13 groß, der Knopf hat eine feste Breite von 84.
- Offen: die Schulterform, eckig oder geschwungen.
- Offen: der Bildraum. Verdeckt sind bei „Wie heute“ 24 %, bei „Nach unten erweitert“ 1 % und bei „Größerer Raum“ 0 %.
  - Nach unten erweitert (meine Empfehlung): Kamera 30 tiefer, jede Szene unten um 30 Zeilen Boden verlängern.
  - Größerer Raum: Szene 640 × 360, also 3-fach statt 4-fach bei 1080p, die Szenen ringsum erweitern.

# Look-Runde 7 und Umsetzungsplan (2026-11-14)
Mockup (Referenz für die Umsetzung): https://claude.ai/artifact/CzU1Nz2WyD1omrYD969Cbx (Quelle: `/mnt/project-files/mockups/look-runde-7/index.html`)
- Die Stapel sitzen jetzt senkrecht mittig in den Schultern. Beide Seiten sind spiegelgleich, und das Leben sitzt mittig in der Fußleiste.
- Ziehen und Ablage bleiben vorerst dort, sind aber noch nicht endgültig.
- **Bildraum Mitte (Philip: beides 50/50):**
  - Die Szene ist 560 × 315 groß und die Kamera sitzt 15 px tiefer.
  - Die Szenen werden um 40 px links und rechts und um 48 px unten erweitert.
  - Verdeckt ist dann 1 % der Gegner.
- Die Plaketten sind in jeder Ansicht gleich groß, 50 × 26 Oberflächenpixel.
- **Umsetzungsplan mit allen Runden, den Konflikten zu Auftrag 3 und dem eigenen Block „Momentum“:**
  - https://claude.ai/artifact/4jaQhJLhok8egK5FZVPGKh (Claude Doc)
