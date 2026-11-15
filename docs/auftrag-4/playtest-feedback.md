# Spieltest Auftrag 4: Auswertung zum Durchgehen

Stand: 15.11.2026, Build aus Draft-PR #29 (Branch `claude/project-thread-hz79ia`).
Grundlage: Moriz' gesprochenes Feedback nach einem Run (Detektiv) mit normaler Musik und den selbst aufgenommenen Soundeffekten.

**Nur Analyse.** Hier ist noch nichts geändert. Jeder Punkt hat: was beobachtet wurde, die wahrscheinliche Ursache im Code (Datei:Zeile, Stand PR #29), einen Vorschlag, den Aufwand und offene Fragen. Wo die Ursache sicher im Code steht, steht **belegt**; wo es eine begründete Vermutung ist, steht **Vermutung**.

Aufwand: **S** = unter einer Stunde, **M** = ein halber Tag, **L** = ein bis zwei Tage, **XL** = mehr.

## Überblick

| # | Punkt | Gruppe | Ursache | Aufwand |
|---|---|---|---|---|
| A1 | Karte zurück in die Hand ziehen spielt sie trotzdem | Eingabe | belegt | S |
| A2 | Rechtsklick soll abbrechen, Kontextmenü weg | Eingabe | belegt | S |
| B1 | Besiegter Gegner springt an eine andere Stelle | Bug | belegt | S |
| B2 | Schild- und Buff-Animation verschoben oder abgeschnitten | Bug | belegt (gleiche Ursache wie B1) | S bis M |
| B3 | Gegner haben mal einen Namen, mal nicht | Bug | belegt | S |
| B4 | Nach dem Kampf sieht man den neuen Hintergrund laden | Bug | belegt | S bis M |
| B5 | Kerzen schweben bei der Kamerafahrt (Grotte) | Bug | belegt | M |
| B6 | Bei einer Hochreaktion überlappen zwei Einblendungen | Bug | belegt | S |
| C1 | Kartenvorschau überdeckt das Item unter dem Zeiger | UI | belegt | S bis M |
| C2 | Bildschirme in alter Optik (Kerbe usw.) | Pixel-Optik | belegt | L bis XL |
| C3 | Kopfleiste (Tiefe, Ort, Figur, Gold, Buch, Deck) in Pixel-Optik | Pixel-Optik | belegt | M |
| C4 | Krämer muss scrollen | UI | belegt | M |
| C5 | Werkbank: Aufbau verwirrend | UI | belegt | M |
| C6 | Schleifen als Kacheln statt Liste | UI | belegt | M |
| C7 | Lebensbalken: Raster sagt nichts über Leben plus Block | UI | belegt | M |
| C8 | Reaktionsbaum: Schrift wird kleiner bei vielen Ästen | UI | belegt | S bis M |
| C9 | Die 5 in Schadenszahlen sieht aus wie 8 oder 2 | Pixel-Optik | Vermutung, gut begründet | S bis M |
| C10 | Reaktionsbänder auf Karten verdecken Text, „In sich“ | UI | belegt | M |
| C11 | Schwarze Balken statt Vollbild | UI | belegt | M bis L |
| C12 | Karte: gegangene Ebenen links gestaucht | UI | belegt | M |
| D1 | Nachgezogene Karte fällt nicht auf | Animation | belegt | S bis M |
| E1 | Soundeffekte übersteuern manchmal | Sound | Vermutung, mehrere Ursachen | M |
| F1 | Detektiv räumt die ersten drei Stufen mit drei Karten ab | Balancing | belegt | gehört zu F5 |
| F2 | Neuer Slot nach jedem Wächter: stark und vorhersehbar | Balancing | Designfrage | S (Schalter) |
| F3 | Verschmelzen an der Werkbank ist bedeutungslos geworden | Design | belegt | M bis L |
| F4 | Notiz Gegnerdesign: „Der Geheilte“ | Design | Notiz | – |
| F5 | Das große Thema: Balancing, Karten, Freischalten | Balancing | – | Plan unten |

Vorschlag für die Reihenfolge steht ganz unten.

---

## A. Eingabe

### A1. Karte zurück in die Hand ziehen spielt sie trotzdem

**Beobachtet:** Karte auf den Gegner ziehen und wieder zurück zur Hand legen wollen, die Karte wird trotzdem gespielt.

**Ursache (belegt):** `js/ui/eingabe.js:9` prüft beim Loslassen nur `inScene(x,y)`, also ob der Zeiger im Element `#szene` liegt (bis 20 Pixel über der Unterkante). Seit Auftrag 4 liegt die Fußleiste mit der Hand aber **innerhalb** dieses Bildes (480 × 270, Fußbild ab Zeile 190, `css/kampf.css:10`). Die Hand ist also „in der Szene“. In `eingabe.js:30–35`:
- Karte ohne Ziel: wird gespielt, sobald man irgendwo außer ganz unten loslässt.
- Karte mit Ziel: lebt nur noch ein Gegner, wird sie überall in der Szene gespielt, auch über der Hand.

**Vorschlag:** Eine Ablegelinie wie in Slay the Spire. Gespielt wird nur, wenn der Zeiger beim Loslassen über der Oberkante der Fußleiste liegt (Zeile 190 bzw. etwas darüber). Unterhalb geht die Karte in die Hand zurück. Dazu sichtbar machen: Die Karte bekommt erst über der Linie den Rahmen „wird gespielt“, darunter sieht man, dass sie zurückgeht.

**Aufwand:** S.

**Frage:** Soll bei nur einem Gegner eine Zielkarte weiter „irgendwo oben“ gespielt werden dürfen? (Vorschlag: ja, aber nur über der Linie.)

### A2. Rechtsklick bricht ab, kein Kontextmenü

**Beobachtet:** Rechtsklick öffnet das Kontextmenü des Browsers. Rechtsklick soll das Ziehen abbrechen.

**Ursache (belegt):** Im Spiel gibt es keinen `contextmenu`-Handler (nur in `lab.js`). `pointerdown` in `eingabe.js:14` prüft `e.button` nicht, ein Rechtsklick auf eine Karte startet sogar ein Ziehen.

**Vorschlag:**
- `contextmenu` im Spielbereich immer unterdrücken (nicht in Eingabefeldern der Einstellungen).
- Rechtsklick oder Esc während des Ziehens oder Zielens: Abbruch, Karte fliegt zurück, Zielpfeil weg, Vorschau weg.
- Rechtsklick ohne Ziehen: gleiche Bedeutung wie Esc an anderen Stellen (zum Beispiel Rucksack oder Karte schließen). Das wäre konsequent.
- Linksklick-Ziehen nur mit `e.button===0`.

**Aufwand:** S.

---

## B. Bugs

### B1. Besiegter Gegner springt an eine andere Stelle

**Beobachtet:** Ein Gegner stirbt und taucht danach kurz woanders auf dem Bildschirm auf.

**Ursache (belegt):** Seit Phase 0 zeichnet die Bühne in den größeren Bildraum 560 × 315, die Szenenkoordinaten sind um x 40, y −3 verschoben (`js/scenes/buehne.js:7`, gesetzt in `buehne.js:110` mit `g.setTransform(1,0,0,1,BILD.x,BILD.y)`). Die Pixel-Effekte setzen in `js/fx/effekte.js:248` die Transformation aber wieder auf `setTransform(1,0,0,1,0,0)` zurück. Alle pixelfx-Effekte landen deshalb **40 Pixel zu weit links und 3 Pixel zu tief**.
Der Tod ist ein solcher Effekt: `FX.die` (`buehne.js:96–98`) übergibt den Gegner an `PFX.spiel('tod')`, der Gegner selbst wird nicht mehr gezeichnet, und der Zerfall läuft 40 Pixel daneben. Das sieht aus wie ein Sprung.

**Vorschlag:** In `PFX.zeichne` den Ursprung des Bildraums übernehmen (wie es `Fahrt` mit `ursprung()` schon macht, `js/scenes/fahrt.js:16`). Danach alle Effekte einmal in der Effekte-Seite (`effekte.html`) und im Kampf ansehen.

**Aufwand:** S.

### B2. Schild-, Buff- und Statusanimationen verschoben oder abgeschnitten

**Beobachtet:** Die Animation von Schild und Buffs sitzt manchmal nicht über dem Gegner. Manchmal sieht man nur die Hälfte oder ein Viertel, der Rest ist abgeschnitten.

**Ursache (belegt, gleiche wie B1):** `block_auf`, `brand`, `gift`, `geschwaecht`, `block_splitter`, `treffer`, `reaktion` laufen alle über `PFX.spiel` (`js/ui/feedback.js:48, 54, 61, 65`), also ebenfalls 40 Pixel links daneben.
Das Abschneiden: `flaechen()` in `effekte.js:176–188` schneidet die Fläche jedes Effekts auf `0…Breite` der Leinwand zu. Mit dem falschen Ursprung liegt ein Effekt am linken Gegner teilweise bei negativen x und wird abgeschnitten. Der Übergangseffekt mit `ganz` (`effekte.js:157`) deckt außerdem nur 480 × 270 statt des Bildraums.
**Vermutung zusätzlich:** Bei großen Gegnern ist die Box mancher Effekte (`groesse = h × 0,8`) kleiner als der Effekt selbst, dann wird auch ohne den Versatz oben abgeschnitten.

**Vorschlag:** Erst B1 beheben und neu ansehen. Falls noch abgeschnitten wird, die Boxen der Effekte aus der tatsächlichen Sprite-Größe statt `h × 0,8` ableiten. Danach ein Kontaktbogen aller Statuseffekte auf allen Gegnern (es gibt `tools/effekte-kontakt.js`), damit wir es einmal überall sehen.

**Aufwand:** S für den Versatz, M falls die Boxen nachgezogen werden müssen.

### B3. Gegner haben mal einen Namen, mal nicht

**Beobachtet:** Der vom Boss gerufene Taucher hatte erst einen Namen, als der Boss tot war. Als die Wachshände dazukamen, hatte der Geheilte plötzlich keinen Namen mehr.

**Ursache (belegt):** Das ist so gebaut. Der Name über der Plakette ist unsichtbar und erscheint nur bei Hover oder beim aktuellen Ziel (`js/ui/kampf.js:32` Kommentar, `css/kampf.css:159` `opacity:0`, `:162` sichtbar bei `.ziel`). Wenn der Boss stirbt, springt das Ziel auf den Taucher (`js/core/combat.js:82`), also bekommt er „seinen“ Namen. Wenn neue Gegner kommen oder du ein anderes Ziel anklickst, verliert der vorherige seinen.

**Vorschlag:** Namen immer zeigen, klein in Silkscreen über der Plakette. Das Ziel bekommt hellen Namen und Rahmen, die anderen gedämpft. Falls das bei vier Gegnern zu voll wird: Namen immer zeigen, aber bei Überlappung kürzen.

**Aufwand:** S.

**Frage:** Immer sichtbar, oder lieber nur am Kampfanfang ein paar Sekunden plus bei Hover? (Vorschlag: immer.)

### B4. Nach dem Kampf sieht man den nächsten Hintergrund laden

**Beobachtet:** Nach einem Kampf kommt der Bildschirm mit Ort und Lore-Text, und dabei sieht man, dass der Hintergrund schon auf das Nächste gewechselt hat.

**Ursache (belegt):** Der Akt-Wechsel als Zwischentitel öffnet sich mit einer Irisblende von 0 % auf 75 % (`css/szenen.css:58–59`). Das Schwarz außen herum ist ein `box-shadow` **am selben Element**, und `clip-path` schneidet den Schatten mit ab. Am Anfang der Blende ist also fast alles durchsichtig, und darunter steht schon die neue Szene des nächsten Bioms (Phase `uebergang`, `js/core/run.js:42`). Man sieht den Wechsel, dann wird es schwarz. Die Blende läuft damit verkehrt herum.

**Vorschlag:** Ablauf in drei Schritten: alte Szene mit Iris **zu** auf Schwarz, dann die neue Szene im Schwarz bauen (`World.build` dauert einen Moment), dann Iris **auf** mit dem Zwischentitel. Das schwarze Feld als eigene Ebene, die nicht mitgeschnitten wird.

**Aufwand:** S bis M.

**Frage:** Gilt der Fall nur beim Akt-Wechsel, oder hast du das auch zwischen zwei Knoten im selben Biom gesehen? Dann schaue ich mir zusätzlich die Fahrt an.

### B5. Kerzen schweben bei der Kamerafahrt (Grotte der Gaben)

**Beobachtet:** Nach dem Kampf, wenn die Kamera weiterfährt, schweben die Kerzen durch die Luft.

**Ursache (belegt):** Die Kerzen bestehen aus zwei Teilen: der Körper ist fest in eine Ebene gemalt, die Flamme ist animiert (`js/scenes/world/grotte.js:32–50`). Jede Animation hat ihre eigene Nähe `p` (`K.anim.push({p,…})`). Die Fahrt bewegt die festen Ebenen je Nähe und den Boden in Streifen, alle Animationen aber zusammen mit **einer** festen Nähe (`js/scenes/fahrt.js:61–62`: „Animiertes fährt mit der mittleren Ebene mit“, `PAR[3]`). Flamme und Kerze laufen auseinander.

**Wo noch:** Alles, was `K.anim` benutzt: Kerzen und Flammen (`basis.js:400ff.`), Augen (`basis.js:477`), Lichtschein (`grotte.js:121`), Nebelschwaden und Ähnliches in allen Biomen.

**Vorschlag:** In der Fahrt jede Animation mit ihrer eigenen Nähe und, falls sie unterhalb des Zielpunkts liegt, mit derselben Bodenkurve wie die Ebene zeichnen. Danach mit `tools/fahrt-bogen.js` für alle Biome einen Kontaktbogen über die Fahrt erzeugen und durchsehen.

**Aufwand:** M (die Regel ist schnell, das Prüfen aller Szenen kostet).

### B6. Zwei Einblendungen überlappen bei einer Hochreaktion

**Beobachtet:** Bei einer Hochreaktion kommen zwei Pop-ups, die übereinanderliegen.

**Ursache (belegt):** Eine Karte kann mehrere Reaktionen auf einmal auslösen. Bei der Hochreaktion feuert meistens auch eine Paar-Reaktion (zum Beispiel G und S als Bannkreis in Reinigendes Feuer FGS). `js/core/combat.js:147–155` schickt für jede ein eigenes `reaction`-Ereignis. Die Hochreaktion zeigt den Zwischentitel mittig (`#zwt`, `css/spiel.css:46`, `feedback.js:67`), die Paar-Reaktion den Stempel über der Hand (`js/ui/bewegung.js:37–38`, `css/kampf.css:202`, Zeile 128). Beide liegen fast an derselben Stelle.

**Vorschlag:** Gleichzeitige Reaktionen einer Karte als eine Einblendung zeigen: Hochreaktion groß, darunter klein „+ Bannkreis“. Alternativ nacheinander mit 300 ms Abstand. Die Sounds dazu ebenfalls bündeln (siehe E1).

**Aufwand:** S.

---

## C. UI und Pixel-Optik

### C1. Kartenvorschau überdeckt das Item unter dem Zeiger

**Beobachtet:** Nach dem Kampf beim Wählen eines Items erscheint die Kartenvorschau direkt am Zeiger und legt sich über das Item. Bei einem Item wäre rechts daneben gut, bei mehreren ist es schwieriger.

**Ursache (belegt):** Die Vorschau ist ein normaler Tooltip (`hoverVorschau` in `js/ui/ueberlagerungen.js:51`), und `showTip` (`js/ui/eingabe.js:99`) setzt ihn 16 Pixel rechts und 18 Pixel unter den Zeiger. Er folgt der Maus.

**Vorschlag:** Die Vorschau am Element verankern, nicht am Zeiger:
- Rechts neben die Vitrine bzw. den Handgriff, mit kleinem Abstand. Passt sie rechts nicht hin (letzte Spalte), links daneben.
- Bei drei Angeboten nebeneinander: unterhalb der Reihe in einem festen Feld, das immer an derselben Stelle steht. Dann deckt sie nie ein anderes Angebot zu.
- Sie bewegt sich nicht mit der Maus.
Das gleiche Verhalten für Krämer und Fundstelle.

**Aufwand:** S für „neben dem Element“, M für das feste Feld.

**Frage:** Lieber neben dem Item, oder ein festes Vorschaufeld (zum Beispiel unten in der Mitte)? Bei drei Items fände ich das feste Feld ruhiger.

### C2. Bildschirme in alter Optik

**Beobachtet:** Seit den letzten Änderungen sind Kampf und einige Bildschirme in Pixel-Optik. „Eine Kerbe mehr“ ist noch in der alten Optik. Einmal alles prüfen und vereinheitlichen.

**Ursache (belegt):** Phase 4 hat nur Rast, Beute, Werkstatt, Fundstelle und Krämer als Szene umgebaut (`SZENEN_PH` in `js/ui/bildschirme.js:10`), das steht auch als offen in `fortschritt.md`. Alles andere benutzt noch `.box`, `.deco`-Knöpfe und die Schriften Cinzel, IM Fell English und Limelight statt Silkscreen, Pixelify und Jersey 10.

**Inventar (alte Optik):**
- Wahl-Listen in `bildschirme.js:103–118`: Kerbe mehr (`:108`), Schleifen (`:109`), Umritzen (`:112`), Spur tilgen (`:105`), Krämer mit tausend Masken, Barmherzige Trennung.
- Ereignis-Zettel und Ereignis-Folge (`eventHtml`), Karte streichen und Krämer-Streichen (`streichenHtml`), Wandbild, Erbe, Brief, Fehlzeit, Zeitung.
- Biom-Wahl, Akt-Übergang (Text), Strand, Ankunft, Ende (Endschirm).
- Überlagerungen: Buch, Tagebuch, Einstellungen (Menü ist schon Plakette).
- Meldungen oben (`.tst` in Cinzel, `css/spiel.css:42`), Zwischentitel der Hochreaktion (Limelight, `spiel.css:49`), Tooltips (`#tip`).
- Kopfleiste (siehe C3) und Rucksack „Am Körper“ (`css/rucksack.css`, 13 Stellen mit alten Schriften).
- Schriften je CSS-Datei (alte / Pixel): spiel.css 46/0, rucksack.css 13/0, ritzen.css 9/0, beute.css 5/0, karte.css 5/0, kampf.css 0/31, szenen.css 1/13.

**Vorschlag:** Erst eine **Stilregel** festlegen (ein kurzer Abschnitt in `docs/auftrag-4/`): welche Schrift für Titel, Text, Zahlen, welche Knöpfe (Plakette mit vier Zuständen), welche Rahmen (9-Slice `px9`). Dann in drei Paketen umbauen: (1) Wahl-Listen und Werkbank als Kacheln (passt zu C5, C6), (2) Ereignis, Streichen, Wandbild, Erbe, Brief, (3) Überlagerungen, Meldungen, Tooltips, Endschirm. Jedes Paket in der Galerie (`gallery.html`) zeigen, bevor es ins Spiel geht.

**Aufwand:** L bis XL insgesamt, je Paket etwa M bis L.

**Fragen:** Bleibt Fließtext (Lore, Ereignisse) in einer Serifenschrift, weil Pixelschrift lange Texte schwer lesbar macht? Oder alles Pixel? Vorschlag: Titel, Zahlen, Knöpfe Pixel, längere Erzähltexte eine gut lesbare Pixel-Serifenschrift oder die bisherige Schrift in fester Pixelgröße.

### C3. Kopfleiste in Pixel-Optik

**Beobachtet:** Oben „Tiefe I, Hafenviertel, Du, Fischer, Gold, Buch, Deck“ soll einheitlich in Pixelgrafik sein.

**Ursache (belegt):** `kopfHtml` (`js/ui/oberflaeche.js:28ff.`) mit CSS in `css/spiel.css:19–24` und `:214–219`: Cinzel, Kursiv, weicher Schatten.

**Vorschlag:** Kopfleiste als schmales Band in Pixel-Optik: Tiefe als römische Zahl in Silkscreen, Biom-Name in Pixelify, Gold mit Münz-Icon und Zahl in der Zahlenschrift aus C9, Buch und Deck als kleine Pixel-Icons mit Zahl. Gleiche Höhe und Lage in Kampf und außerhalb.

**Aufwand:** M.

### C4. Krämer muss scrollen

**Beobachtet:** Im Shop muss man scrollen, um alles zu sehen. Alles muss auf einen Bildschirm passen.

**Ursache (belegt):** `kraemerHtml` (`bildschirme.js:124–135`) stapelt untereinander: Items und Laudanum, Handgriffe, gegebenenfalls Masken, „Verkaufen und Entfernen“ mit Erklärtext, Item-Leiste, Liste der entfernbaren Handgriffe, Weiter. Außerhalb des Kampfs hat die Szene nur 270 Pixel Höhe. Das ist aus dem Umbau vom 10.11. noch offen („Krämer mit Rucksack links, Angebot rechts“).

**Vorschlag:** Das schon besprochene Layout: links „Am Körper“ (Items, aus denen man verkauft oder Handgriffe entfernt), rechts das Angebot in Kacheln (Items als Vitrinen, Handgriffe als violette Karten, Laudanum). Verkaufen und Entfernen als Aktion am gewählten Item links, nicht als eigener Block. Keine Erklärsätze, sondern Preis auf dem Knopf.

**Aufwand:** M.

### C5. Werkbank: Aufbau verwirrend

**Beobachtet:** Die Aufteilung der Felder ist komisch. Die Optionen (Feilen bzw. Schleifen, Kerbe, Verschmelzen) sollten zum Anklicken da sein, und erst wenn man „Verschmelzen“ wählt, sollen die zwei Felder erscheinen.

**Ursache (belegt):** `werkstattHtml` (`bildschirme.js:139–142`) zeigt immer die Werkbank mit zwei Feldern und darunter klein „Oder statt zu verschmelzen“ mit zwei Knöpfen.

**Vorschlag:** Die Werkstatt als Wahl von drei (bzw. vier) gleich großen Kacheln, wie die Rast: **Kerbe schlagen**, **Schleifen**, **Verschmelzen**, gegebenenfalls **Spur tilgen**. Jede Kachel mit Icon und einem Satz. Ein Klick öffnet die jeweilige Ansicht. Erst bei „Verschmelzen“ erscheinen die zwei Felder. Zurück führt wieder zur Wahl.

**Aufwand:** M (zusammen mit C2 Paket 1 und C6).

**Frage:** Hängt an F3. Wenn Verschmelzen wegfällt oder neu gedacht wird, ändert sich die Kachel.

### C6. Schleifen als Kacheln

**Beobachtet:** Der Schleifen-Bildschirm sollte anders aussehen, eher Kacheln als Liste.

**Ursache (belegt):** `bildschirme.js:109`: eine Zeile je Item mit Textknöpfen „Name (Kosten)“.

**Vorschlag:** Wie das Ritzen (PR #21): echte Karten als Kacheln, gruppiert nach Item. Geschliffene Karten mit Raute und gedimmt, Karten mit Kosten 0 ausgegraut. Beim Hover der Vergleich „vorher 2, nachher 1“. Gleiches Muster für Kerbe (Items als Kacheln mit Kerbenanzeige) und Umritzen.

**Aufwand:** M.

### C7. Lebensbalken: Raster und Block

**Beobachtet:** Der Block füllt den Lebensbalken prozentual (blau), aber die Rasterung ändert sich nicht. Man sieht nicht, wie viel Leben plus Block man insgesamt hat. Die Striche auf dem Balken sehen außerdem nicht gut aus.

**Ursache (belegt):** Die Striche sind ein reines Muster: alle 4 Pixel ein dunkler Strich (`css/kampf.css:36` für Leben, `:40` für Block), unabhängig von den Zahlen. Der Block liegt seit dem Umbau vom 11.11. rechts über dem Leben (`spielerHtml`, `js/ui/oberflaeche.js:48`), der Balken bleibt so lang wie das maximale Leben.

**Vorschlag (zum Ausprobieren als zwei Varianten in der Galerie):**
- **Raster mit Bedeutung:** Ein Strich je 5 Leben, ein kräftiger je 25. Abstand passt sich an das maximale Leben an. So kann man Schaden „abzählen“.
- **Block verlängert den Balken:** Ist Leben plus Block größer als der Platz, wird der ganze Balken gestaucht (das Raster rückt enger), dann sieht man die Summe.
- **Optik:** Pixel-Balken mit Rahmen, oberer heller Lichtstreifen, Segmente als kleine Lücken statt dunkler Striche, Block als blaue Platte mit eigenem Glanz. Die Zahl „Leben + Block“ direkt daneben, z. B. `38 +12`.
- Dieselbe Regel für die Plaketten der Gegner.

**Aufwand:** M.

**Frage:** Raster pro 5 Leben oder pro 10? Bei 50 Leben auf 224 Pixeln wären 5er-Segmente etwa 22 Pixel breit, das ist gut lesbar.

### C8. Reaktionsbaum: Schrift wird kleiner

**Beobachtet:** Unten links skaliert die Schriftgröße mit der Zahl der möglichen Reaktionen. Die Schrift soll immer gleich groß sein, nur der Abstand darf sich ändern.

**Ursache (belegt):** `js/ui/stoffbaum.js:79`: `af = n>4 ? max(6, round(zeile+1,5)) : 10`. Ab fünf Ästen wird die Schrift kleiner, weil der Baum fest 88 × 36 Pixel groß ist (`css/kampf.css:51`) und die Zeilenhöhe `(36−4)/n` ist (`stoffbaum.js:68`).

**Vorschlag:** Schrift fest auf 10. Bis vier Äste wie jetzt. Ab fünf Ästen: (a) nur die hellen, spielbaren Äste mit Namen, die dunklen als kurze Striche ohne Text, oder (b) der Baum wächst nach oben (es ist Platz über der Leiste), oder (c) zweispaltig. Vorschlag (a), weil die dunklen Äste ohnehin nicht spielbar sind.

**Aufwand:** S für (a), M für (b) oder (c).

### C9. Die 5 sieht aus wie 8 oder 2

**Beobachtet:** Die 5 in „5 Schaden“ oder bei „50 % effektiver“ sieht nicht wie eine 5 aus, eher wie eine 8 oder 2.

**Ursache (Vermutung, gut begründet):** Die schwebenden Zahlen benutzen Press Start 2P (`css/spiel.css:151`) in der Größe `BU.k × 5 + Wucht` Pixel (`js/ui/feedback.js:5`). Press Start 2P ist für Vielfache von 8 Pixeln gebaut. Bei 10, 15 oder 17 Pixeln fallen die Pixel der Glyphe nicht auf das Raster, der Browser glättet, und die schmale Öffnung der 5 läuft zu. Dazu kommt ein Schatten in zwei Richtungen. Dieselbe Schrift steht in den Absichten (`--fp`).
**Bitte prüfen:** Wo genau stand die „5“? Schwebende Zahl am Gegner, Absicht über dem Gegner, oder Text auf der Karte?

**Vorschlag:** Eigene Pixel-Ziffern (3 × 5 oder 4 × 6) als Bild, ganzzahlig skaliert, wie die Stoff-Zeichen. Damit sind die Zahlen in Kampf, Plakette, Leben und Kopfleiste überall gleich und scharf.

**Aufwand:** S (Schrift auf ganze Vielfache stellen) bis M (eigene Ziffern).

### C10. Reaktionsbänder auf den Karten

**Beobachtet:** „Verstärkt“, „Bannkreis …“ oder „In sich Knistern“ verdecken Teile des Kartentexts. Und muss da „In sich“ stehen?

**Ursache (belegt):** `cardHtml` (`js/ui/kampf.js:123–124`) baut die Bänder, `css/kampf.css:130` setzt sie unten an das Bildfenster mit `bottom: −4` Pixeln, also in den Text hinein. Mehrere Bänder stapeln sich nach oben. „IN SICH“ heißt: die zwei Stoffe einer Duo-Karte reagieren miteinander, ganz ohne vorige Karte.

**Vorschlag:**
- Das Band ganz **ins Bildfenster** (oben oder unten innen), nie über den Text.
- Statt Wörtern die Stoffzeichen plus kurzer Name: zum Beispiel `F+S KNISTERN`. „Verstärkt“ als kleines `×1,5` am Kostenstein oder an der Zahl.
- „In sich“ durch ein eigenes Zeichen ersetzen (zwei Stoffe, die sich berühren) und die Erklärung in den Tooltip.
- Bei mehr als einem Band: eines zeigen und `+1`.

**Aufwand:** M.

**Frage:** Reicht dir ein Zeichen für „In sich“, wenn der Tooltip es erklärt?

### C11. Schwarze Balken statt Vollbild

**Beobachtet:** Man hat schwarze Balken am Rand, das soll ein richtiges Vollbild werden.

**Ursache (belegt):** `skala()` in `js/main.js:12–13` legt das Spiel fest auf 16:9 (480 × 270 Oberflächenpixel) und skaliert mit `min(Breite, Höhe)`. Ein MacBook-Bildschirm ist 16:10, ein Browserfenster hat irgendein Format. Der Rest bleibt schwarz.

**Vorschlag:** Die Szene wird seit Phase 0 ohnehin in 560 × 315 gemalt (`buehne.js:4–7`), es ist also links, rechts und unten schon mehr Bild da. Das Sichtfenster kann sich dem Bildschirm anpassen: bei 16:10 zeigt es 480 × 300 statt 480 × 270, bei breiteren Fenstern bis 560 Breite. Die Oberfläche hängt an den Rändern (Kopfleiste oben, Fußleiste unten), die Szene füllt den Rest. Erst jenseits von 560 × 315 (etwa 21:9) bleiben schmale Balken. Kampf: Gegner und Bodenlinie bleiben, wo sie sind, es kommt nur mehr Rand dazu.

**Aufwand:** M bis L (Oberfläche, die heute an festen 270 Zeilen hängt, und alle Tests mit festen Größen).

**Frage:** Ist dir „mehr Bild sehen“ recht, oder lieber auf volle Breite skalieren und oben und unten etwas abschneiden? Vorschlag: mehr Bild.

### C12. Karte: gegangene Ebenen gestaucht

**Beobachtet:** Auf der Karte wird der Teil links, wo man schon war, zusammengestaucht. Man soll entspannt sehen können, wo man war.

**Ursache (belegt):** `karteModell` in `js/ui/karte.js:34–38`: Gegangene Ebenen stehen links vom aktuellen Knoten mit höchstens 36 Pixeln Abstand (`hs`), Radius 7 statt 20 (`rH`), Höhenabstand 60 % (`ys`). Je mehr Ebenen, desto enger.

**Vorschlag:** Die Karte als Band, das man verschieben kann: alle Ebenen gleich groß, die Ansicht steht auf dem aktuellen Knoten, mit Ziehen oder Scrollen sieht man nach links zurück. Der gegangene Weg leuchtet als Spur. Alternativ ohne Verschieben: die letzten zwei gegangenen Ebenen voll groß, ältere klein, aber mit Zeichen.

**Aufwand:** M.

---

## D. Animation

### D1. Nachgezogene Karte fällt nicht auf

**Beobachtet:** Spielt man eine Karte, erscheint direkt darunter die nächste gezogene Karte. Das Tempo ist gut, aber man bekommt nicht mit, dass man eine neue Karte hat. Tempo nicht ändern, nur die Darstellung.

**Ursache (belegt):** Die Austeil-Animation vom Ziehstapel (`css/kampf.css:192–194`, `austeilenStil` in `js/ui/bewegung.js:31`) läuft nur, wenn `dealAnim` gesetzt ist. Das passiert nur beim Ereignis `deal` am Zuganfang (`js/ui/feedback.js:36`, `combat.js:78`). Karten, die mitten im Zug gezogen werden (`c.draw`, `combat.js:197`, Handgriffe wie Durchatmen, Beschatten), erscheinen einfach. Die Hand rendert neu, die Karten rücken zusammen, und die neue taucht ohne Bewegung auf.

**Vorschlag:** Neu gezogene Karten mit Zeitstempel markieren und nur diese vom Ziehstapel einfliegen lassen, in derselben Zeit wie jetzt (0,34 s, das Spiel wartet nicht). Dazu ein kurzes Aufleuchten im Zonenrand und eine Zahl am Ziehstapel, die einmal kleiner wird. Die übrigen Karten gleiten auf ihre neue Position statt zu springen.

**Aufwand:** S bis M.

---

## E. Sound

### E1. Soundeffekte übersteuern

**Beobachtet:** Manchmal übersteuert oder verzerrt es stark. Zweimal beim „Goldenen Kreuz“ hintereinander, einmal als ein Kampf endete. Gespielt mit normaler Musik und den eigenen Aufnahmen.

**Ursache (Vermutung, mehrere zusammen):**
1. **Viele Klänge im selben Moment.** Am Kampfende laufen Treffer, Tod (`sfx.die`), Musik-Stinger für den Tod (`Music.foeDie`), Sieg und gegebenenfalls Reaktionen gleichzeitig (`feedback.js:49` und folgende). Bei einer Hochreaktion feuern mehrere Reaktionen (siehe B6), dazu `sfx.hoch`, `Music.reaction` und nach 150 ms `sfx.disc`. Alles läuft gleichzeitig in denselben Bus.
2. **Dieselbe Aufnahme zweimal phasengleich.** Wenn derselbe Sound im selben Moment zweimal startet, addiert sich der Pegel um bis zu 6 dB. Die Streuung der Abspielgeschwindigkeit ist mit 3 % zu klein, um das zu verhindern.
3. **Der „Limiter“ ist ein Kompressor.** `js/audio/sfx.js:10–11`: `DynamicsCompressor` mit Schwelle −4 dB, Verhältnis 20, Attack 1 ms. Bei starken Spitzen regelt er hart, das klingt bei Stimmen-Aufnahmen kratzig. Er ist kein echter Begrenzer, Spitzen kommen durch.
4. **Pegel der Aufnahmen.** Jede Aufnahme hat einen eigenen Pegel (`pegel` in dB, `mund.js:86ff.`). Sind die eigenen Aufnahmen nah an 0 dBFS normalisiert, bleibt kein Platz für Überlagerung.

**Bitte klären:** Was ist das „Goldene Kreuz“? Ich finde den Namen weder bei Items noch bei Reaktionen oder Handgriffen. Vielleicht die Reaktion mit Glaube (G), etwa Segen oder Bannkreis, oder eine Karte mit einem anderen Namen? Das würde helfen, die Ereigniskette nachzustellen.

**Vorschlag:**
- Gleiche Sounds innerhalb von 40 ms zusammenfassen, höchstens zwei gleiche gleichzeitig.
- Kampfende als ein eigener Klangmoment (Tod + Sieg nacheinander statt übereinander).
- Ausgang: Kopfraum (Bus −6 dB), danach Kompressor sanfter und am Ende eine weiche Sättigung als echter Begrenzer.
- Im Studio einmal alle Aufnahmen auf denselben Spitzenpegel (etwa −6 dBFS) bringen.
- Eine Pegelanzeige im Dev-Menü, die Übersteuern rot markiert und mitschreibt, welche Sounds gerade liefen. Dann sehen wir beim nächsten Spieltest das Muster.

**Aufwand:** M.

---

## F. Balancing und Design

### F1. Detektiv räumt die ersten Stufen mit drei Karten ab

**Beobachtet:** Der Detektiv hämmert in den ersten drei Stufen jeden Gegner mit drei Karten durch.

**Befund (belegt):** Startdeck Detektiv (`data/jobs.json`): Revolver „Schuss“ (1 Energie, 4 Schaden × 2 Treffer), Trenchcoat „Beschatten“ (0 Energie, 1 Karte ziehen, Verwundbar 1), Laterne „Blenden“ (1 Energie, 3 Schaden an allen), dazu die geritzten Handgriffe Stoßen (5 Schaden), Ausweichen und Abwarten. Das Messer mit Durchatmen liegt im Rucksack. Jede Karte doppelt (`card_copies: 2`).
Beschatten kostet nichts, zieht sofort nach und macht den Doppelschuss zu 6 × 2 = 12 Schaden für 1 Energie (`js/core/combat.js:180`). Beschatten, Schuss, Schuss macht in einem Zug 24 Schaden für 2 Energie, mit der dritten Energie kommt Stoßen dazu. Die Gegner im Hafen haben 18 bis 22 Leben (Schmuggler 18, Netzflickerin 20, Tiefling 22). Ein normaler Kampf ist so oft nach einem Zug entschieden.
Der Bot zeigt das nicht so deutlich (Detektiv 5 von 10 Siegen, Mittel aller Figuren 46 %, gerade gemessen mit `node tools/balance.js 90`), weil er Beschatten nicht gezielt vor den Schuss legt. Daran sieht man auch die Grenze des Bots als Spieler.

**Schnelle Stellschrauben (nur zur Diskussion, nicht umgesetzt):** Beschatten kostet 1 oder zieht nicht mehr nach; Schuss 3 × 2; die ersten normalen Gegner 10 bis 20 % mehr Leben. Besser: im Rahmen von F5 entscheiden, wie stark ein Startdeck sein soll, und dann alle neun Figuren gegen dasselbe Ziel prüfen.

### F2. Neuer Slot nach jedem Wächter

**Beobachtet:** Nach jedem Bosskampf gibt es einen neuen Slot. Gut für Tempo und Momentum, aber man wird stark und die Belohnung ist vorhersehbar.

**Befund (belegt):** Momentum Stufe 1, Schalter `momentum.waechter_slot` in `data/balance.json`, gesetzt in `js/core/run.js:132`, gewählt in `:146`. Mit allen drei Momentum-Hebeln gewinnt der Bot 47 %, ohne 32 %.

**Ideen:**
- **Wahl statt Gabe:** Nach dem Wächter eine von drei Belohnungen: Slot, Reliquie, Karte streichen oder Kerbe. Der Slot bleibt möglich, ist aber eine Entscheidung.
- **Seltener:** Slot nur nach Akt I und III, oder nur nach Elite-Kämpfen mit Bedingung.
- **Mit Preis:** Slot nur gegen etwas (Leben, Gold, ein Fluch im Deck).
- **Bereich vorgegeben:** Der Wächter bestimmt den Bereich (passt zum Biom), du entscheidest nur ob.

**Aufwand:** S (Schalter, Varianten als Optionen in `balance.json`), Wirkung messen mit dem Prüfstand aus F5.

**Frage an Moriz und Philipp:** Welche Variante wollt ihr zuerst spielen? Vorschlag: „Wahl statt Gabe“.

### F3. Verschmelzen an der Werkbank ist bedeutungslos geworden

**Beobachtet:** Items zu kombinieren ist irrelevant geworden, und man weiß nicht mehr, was es macht.

**Was es macht (belegt, `js/core/run.js:210–221`, `data/balance.json` `forge`):** Zwei Items auf die Werkbank. Gleicher Stoff: ein Item „Name +1“ mit den Karten **beider** Items, jede Karte +3. Zwei Stoffe, die reagieren: ein Doppel-Item mit beiden Stoffen, alle Karten +3 und je 1 Energie teurer. Höchstens zwei Stoffe. Der Bereich kommt vom ersten Item.

**Warum es bedeutungslos ist (belegt):** Das neue Item wird ohne die Dinge angelegt, die seit Auftrag 2 und 3 den Wert eines Items ausmachen. Es verliert:
- alle **geritzten Handgriffe** (das neue Item hat kein `hg`),
- **zusätzliche Kerben** (`kerbenPlus`) und **Schliff**,
- die **Seltenheit** (wird gewöhnlich, also nur 1 Kerbe, `state.js:24–25`),
- **Eigenschaften und Passive** (`eigen`, `passiv`), also auch bei Reliquien.
Verschmelzen zerstört also meistens mehr, als es bringt, und der Bildschirm erklärt das nicht.

**Optionen:**
1. **Weglassen.** Werkstatt nur noch Kerbe, Schleifen, Tilgen.
2. **Richtig machen:** Das neue Item behält alle Handgriffe beider Items (bis 3 Kerben, Rest wählt man), die höhere Seltenheit und die Eigenschaften. Der Gewinn: ein Slot wird frei, die Karten werden stärker. Das wäre ein echter Tausch „zwei Plätze gegen einen“.
3. **Umdeuten:** Statt Verschmelzen „Umschmieden“, ein Item bekommt den Stoff eines anderen, das andere geht verloren. Passt besser zu den Reaktionen.

**Aufwand:** 1 = S, 2 = M bis L, 3 = L.

**Frage:** Welche Richtung? Vorschlag: erst 1 (aus dem Weg), und 2 oder 3 als Idee in `data/ideas.json`, bis F5 klarer ist.

### F4. Notiz zum Gegnerdesign: „Der Geheilte“

Moriz' Notiz: Am Geheilten ist gut, dass er offensichtlich nicht geheilt ist, aber so heißt. Dieser leise Widerspruch zwischen Name und Anblick ist Horror, den man weiterführen kann.

Im Konzept (`data/biome/grotte.json:152`) steht dazu: „Einer, der kam und nicht geheilt wurde …“. Vorschlag: Das als Regel für Gegnernamen in die Gegner-Vorgaben aufnehmen („Der Name sagt, was der Ort verspricht, der Körper zeigt, was er hält“) und die vorhandenen Gegner einmal danach durchgehen. Das kann als eigener kleiner Auftrag laufen: eine Liste aller Gegner mit Name, Anblick und Vorschlag. Kein Code nötig.

---

## F5. Das große Thema: Balancing, Karten, Freischalten

Moriz: „Ich glaube nicht, dass du das allein hinkriegst. Da müssen wir Input geben, und zwar eine ganze Menge.“ Richtig. Die Simulation kann messen und vergleichen, aber nicht sagen, was sich gut anfühlt. Hier ist ein Vorschlag, wie wir das zu dritt (Moriz, Philipp, Claude) mit möglichst wenig Aufwand für euch hinbekommen.

### Grundgedanke

1. **Ihr legt die Ziele fest, die Simulation misst den Abstand dazu.** Statt „mach es fairer“ ein paar Zahlen, die wir gemeinsam festlegen.
2. **Klein anfangen.** Erst ein Kern, der sich gut anfühlt, dann Schicht für Schicht mehr Inhalt dazu, jedes Mal mit Spieltest.
3. **Euer Feedback geht direkt aus dem Spiel in Daten.** Kein Abtippen, keine langen Sprachnachrichten nötig.

### Schritt 1: Zielbild Schwierigkeit (ihr, etwa 30 Minuten)

Ein kurzes Blatt `docs/balance/ziele.md`, das ihr ausfüllt (ich mache einen Entwurf mit Lücken). Zum Beispiel:
- Normaler Kampf in Akt I: dauert 3 bis 4 Züge, kostet 10 bis 20 % Leben, nie in einem Zug vorbei.
- Elite: 5 bis 7 Züge, kostet 25 bis 40 % Leben, kann einen schlechten Run beenden.
- Wächter: der Moment, an dem das Deck zeigen muss, was es kann.
- Ein guter Spieler gewinnt auf Stufe 0 etwa jeden dritten Run, ein neuer selten. Mit höheren Stufen wird es schwerer.
- Kein Startdeck darf allein reichen, man muss Belohnungen nehmen.
- Kein einzelnes Item oder Handgriff ist in mehr als X % der Siege dabei.

### Schritt 2: Der Prüfstand (ich, Aufwand L)

Auf den vorhandenen Bots aufbauen (`js/dev/bot.js`, `tools/balance.js`, `tools/kern.js`). Neu:
- **Feste Seed-Sätze.** Zum Beispiel 200 Seeds. Jede Änderung läuft auf denselben Seeds, dann ist der Unterschied echt und kein Zufall. Ein Vergleich A gegen B als eine Zeile: `node tools/pruefstand.js --vergleich --set='…'`.
- **Kampf-Labor.** Ein bestimmtes Deck gegen einen bestimmten Kampf, 1000 Mal. Antwort: Verteilung der Züge, Lebensverlust, Anteil der Ein-Zug-Siege. Das hätte den Detektiv sofort gezeigt.
- **Mehrere Bot-Profile.** Heute spielt der Bot gierig. Dazu: „sucht Reaktionen“, „vorsichtig“, „Kombo-Spieler“ (legt Verwundbar vor Mehrfachtreffer, Beschatten vor Schuss). Mit mehreren Profilen sieht man die Spanne zwischen schwachem und gutem Spiel.
- **Werte je Inhalt.** Für jedes Item, jeden Handgriff, jede Reaktion: wie oft angeboten, wie oft genommen, Siegrate mit und ohne im Deck, Schaden pro Energie. Ausreißer automatisch markiert.
- **Bericht als Seite.** Eine HTML-Seite neben `artboard.html` mit den Kurven gegen eure Ziele aus Schritt 1, je Figur und Akt. Rot, was außerhalb liegt.
- **Grenzen offen sagen.** Der Bot ist kein Mensch. Darum Schritt 4.

### Schritt 3: Mit einem kleinen Kern anfangen (gemeinsam entscheiden)

Heute gibt es 9 Figuren, rund 90 Items, 72 Handgriffe, 8 Stoffe mit Paar- und Hochreaktionen, Regelbiegungen, Würze, Meta-Ebene. Das gleichzeitig auszubalancieren geht nicht. Vorschlag:

- **Kern:** eine Figur (Vorschlag: Fischer, weil am wenigsten Sonderregeln, oder Detektiv, weil wir den jetzt kennen), etwa 20 Items, etwa 15 Handgriffe, 4 Stoffe mit ihren Paarreaktionen, keine Hochreaktionen, keine Biegungen, Würze aus. Akt I bis III.
- Technisch als **Inhaltsstand** in `balance.json` (zum Beispiel `umfang: "kern"` mit Listen), damit ihr selbst umschalten könnt und nichts gelöscht wird.
- Wenn der Kern sich gut anfühlt: **Schicht für Schicht** dazu. Zweite Figur, dann Stoffe 5 und 6, dann Hochreaktionen, dann Biegungen, dann Würze. Jede Schicht: Prüfstand, ein Spieltest von euch, nachjustieren.

### Schritt 4: Euer Input mit wenig Aufwand

- **Notiz-Taste im Spiel.** Während des Spielens `N` drücken und einen Satz tippen oder diktieren. Gespeichert wird die Notiz zusammen mit Seed, Tiefe, Kampf, Hand, Deck und Leben. Am Ende des Runs geht alles als eine JSON-Datei raus (oder in den Projektordner). So muss niemand nachher erklären, wo etwas war.
- **Run-Protokoll automatisch.** Jeder echte Run schreibt mit: was angeboten wurde, was genommen wurde, wie lange jeder Kampf dauerte, wie viel Leben er kostete. Damit kann ich euer Spiel mit dem Bot vergleichen und den Bot an euch anpassen.
- **Drei Fragen nach jedem Run** (je ein Klick, 1 bis 5): War es fair? War es fordernd? Hattest du Entscheidungen? Plus ein Feld für den besten und den schlimmsten Moment.
- **Seeds der Woche.** Ihr spielt beide dieselben zwei oder drei Seeds mit derselben Figur. Dann sind eure Eindrücke vergleichbar, und wir wissen, ob es am Deck oder am Zufall lag.
- **Bewertungsseite für Inhalte.** Eine Seite im Artboard, auf der jede Karte, jedes Item, jeder Handgriff drei Knöpfe hat: zu stark, passt, zu schwach (und „langweilig“). Ihr klickt euch in 15 Minuten durch einen Stapel. Ich lege das neben die Zahlen aus dem Prüfstand. Wo Bauch und Zahl auseinandergehen, wird es spannend.
- **Entscheidungen als Karten.** Designfragen (Slot nach dem Wächter, Verschmelzen, Freischalten) stelle ich euch als Auswahl mit Empfehlung, nicht als offene Frage.

### Schritt 5: Freischalten und Fortschritt (gemeinsam, nach dem Kern)

Heute: Figuren werden über gelesene Wandbild-Fragmente frei (`frei_ab` in `data/jobs.json`, `js/core/meta.js:13`), sonst ist fast alles von Anfang an im Topf. Fragen, die ihr entscheiden müsst:
- Startet ein neuer Spieler mit einer Figur und einem kleinen Topf, und Items und Handgriffe kommen mit Runs dazu (wie Karten-Freischaltung in Slay the Spire)? Das hätte einen schönen Nebeneffekt: Der Kern aus Schritt 3 ist dann gleichzeitig das Spiel für Neue.
- Wird je Figur freigeschaltet oder für alle?
- Wodurch: gespielte Runs, erreichte Tiefe, entdeckte Reaktionen, Fragmente?
- Kommen neue Mechaniken (Hochreaktionen, Biegungen) als Freischaltung, damit sie nicht alle am ersten Abend auftauchen?

Vorschlag: Erst den Kern balancieren, dann die Freischaltung genau entlang der Schichten aus Schritt 3 bauen. Was wir in welcher Reihenfolge dazunehmen, ist dann auch die Reihenfolge, in der ein Spieler es entdeckt.

### Erster konkreter Zyklus (Vorschlag)

1. Ich: Entwurf `ziele.md`, Prüfstand mit festen Seeds und Kampf-Labor, Notiz-Taste und Run-Protokoll. (L)
2. Ihr: Ziele ausfüllen, Kern festlegen (Figur, welche Items und Handgriffe).
3. Ich: Kern als Inhaltsstand, Prüfstand-Bericht dazu, erste Anpassungen, bis die Zahlen in den Zielen liegen.
4. Ihr: je zwei Runs auf denselben Seeds mit Notizen.
5. Gemeinsam: Bericht und Notizen durchgehen, nächste Schicht.

---

## Vorschlag für die Reihenfolge

1. **Schnelle Fixes, die beim Spielen stören** (zusammen etwa ein Tag): A1, A2, B1, B2, B3, B6, C8, D1.
2. **Sichtbare Unruhe:** B4, B5, C1, C9, C10.
3. **Bildschirme und Look** (größtes Paket): Stilregel, dann C2 in drei Paketen mit C3, C4, C5, C6, dazu C7.
4. **Vollbild und Karte:** C11, C12.
5. **Sound:** E1, am besten mit der Pegelanzeige zuerst, damit wir beim nächsten Spieltest das Muster sehen.
6. **Balancing:** parallel ab sofort F5 Schritt 1 und 2. F1, F2, F3 werden darin entschieden.

## Offene Fragen gesammelt

1. A1: Zielkarte bei nur einem Gegner überall über der Linie spielbar lassen?
2. B3: Gegnernamen immer zeigen?
3. B4: Nur beim Akt-Wechsel gesehen oder auch zwischen Knoten?
4. C1: Vorschau neben dem Item oder festes Vorschaufeld?
5. C2: Längere Erzähltexte auch in Pixelschrift?
6. C7: Raster je 5 oder je 10 Leben?
7. C9: Wo stand die schlecht lesbare 5?
8. C10: Reicht ein Zeichen statt „In sich“?
9. C11: Mehr Bild zeigen statt Balken, einverstanden?
10. E1: Was ist das „Goldene Kreuz“?
11. F2: Welche Variante für die Wächter-Belohnung zuerst?
12. F3: Verschmelzen weglassen, richtig machen oder umdeuten?
13. F5: Mit welcher Figur fängt der Kern an, und wer füllt die Ziele aus (Moriz, Philipp, beide)?
