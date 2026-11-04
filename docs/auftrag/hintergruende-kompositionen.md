# Hintergründe: Kompositionen (M8)

Stand 2026-11-03. Diese Datei skizziert **vor dem Bauen** jeden Ort in Worten. Die Ebenen aus [05-hintergruende.md](05-hintergruende.md) sind nur das technische Gerüst. Hier steht, wo was steht und warum. Code: `prototype/js/scenes/world/`, Labor: `prototype/hintergrund.html`.

Feste Rahmenbedingungen für alle Kampfszenen (480 × 270):

- Gegner stehen etwa in x 60–420, Fußlinien y 150–215 (drei Reihen: hinten, mitte, vorne). Dahinter hellt ein schmaler Nebel leicht auf, damit die dunklen Silhouetten stehen.
- Oben links (0–200 × 0–80) und unten (ab etwa y 220) liegt UI. Dort stehen keine Wahrzeichen und keine falschen Details, nur Fläche, Rahmen oder Himmel.
- Das Gegenlicht kommt wie bei den Figuren von **hinten oben rechts**. Jede Komposition begründet, woher dieses Licht im Ort kommt. Einzige Ausnahme ist die Pforte (gespiegelt, Licht von links).
- Die menschlichen Lichter (Laternen, Kerzen, Grubenlampen) nehmen mit `fremdheit` ab, das Leuchten aus der Tiefe nimmt zu.

## Bildaufbau im Überblick (keine zwei gleich)

| Ort | Grundform | Horizont | Blickpunkt | Blickführung |
|---|---|---|---|---|
| Hafen | **Diagonale**: schwere Lagerhäuser links, offene See rechts | mittel (y 134) | stehend auf dem Kai | an der Häuserflucht entlang zum Leuchtturm am Molenkopf rechts |
| Moorwald | **Senke und Anhöhe**, gewundener Weg, großer Himmel | tief (y 150) | im Moor, Augenhöhe niedrig | über den S-förmigen Bohlenweg hinauf zum Steinkreis rechts oben; Bäume zeigen mit ihrer Neigung dorthin |
| Kapelle | **Symmetrie, die kippt**: Mittelschiff mit zentralem Fluchtpunkt, aber die Wasserlinie schräg | mittel (y 140) | im Wasser des Mittelschiffs | Säulenreihen und Bänke zum Altar, hinauf zum Rundfenster |
| Salzstollen | **Monumentale Senkrechte**, untersichtig | tief (y 172) | am Boden der Halle, nach oben schauend | Säulen nach oben, Schienen in die Tiefe nach links |
| Namenlose Stadt | **Fries**: frontale Wand, waagerechtes Reliefband über die ganze Breite | tief-mittel (y 152) | frontal vor der Wand | waagerecht am Band entlang, dann über die zu niedrigen Stufen nach vorn |
| Schwarzes Eis | **Aufsicht**: hoher Horizont, der Boden ist das Bild | hoch (y 96) | stehend, schräg nach unten durchs Eis schauend | Eisrisse zum Fluchtpunkt rechts, darunter der Umriss |
| Pforte | **Konzentrisch**: alles kreist um die Öffnung in der Mitte | gewölbt (Mitte y 120, Ränder höher) | unbestimmt | Ringe, Treppen und Spiegelung führen zur Mitte |

## Akt 1a: Das Hafenviertel (1925)

Palette Hafen (blau), Augen `#ffe9a0`, warmes Gelb nur für Laternen und das eine Fenster. Licht: Nachthimmel über der See ist rechts hinten am hellsten (Horizontschein), daher das Randlicht von oben rechts. Der Leuchtturmkegel ist die zweite, wandernde Lichtquelle.

### Variante 0: Am Kai

- **Horizont** y 134 (Meereshorizont rechts). Fluchtpunkt (372, 134), rechts der Mitte. Blickpunkt: stehend auf dem breiten Kai.
- **Blickführung:** Die Lagerhäuser stehen links in einer Flucht, die vorderen groß und angeschnitten, die hinteren klein. Ihre Dachkanten, die Kranschiene und die Pflasterfugen laufen alle zum Fluchtpunkt. Dort, am Ende der Mole, steht der Leuchtturm (Laterne bei etwa x 394, y 96).
- **Wahrzeichen und falsches Detail:** Der Kegel des Leuchtturms streicht langsam (etwa 12 s) **nach links über die Dächer**, also landeinwärts, nie über die See. Alle Fenster der Lagerhäuser sind zugemauert (Ziegel in der Fensteröffnung, eine Stufe heller als die Wand), nur eines im obersten Stock des zweiten Hauses (etwa x 214, y 86) hat warmes Licht. Es liegt bewusst außerhalb der UI-Ecke.
- **Details und warum:** Ein Portalkran steht an der Kaikante rechts der Mitte, weil hier entladen wird; er ist das große Ding gegen die kleinen Poller. Poller an der Kante, Taue zum Wasser. Netze hängen rechts vorne über einem Gestell aus zwei Pfählen, darunter ein Schemel und ein Korb: dort wird geflickt (die Netzflickerin kommt von hier). Eine Gaslaterne an der Häuserecke links (menschliches Licht, erlischt ab fremdheit 0,7). Kisten an der Ladetür des ersten Hauses, nicht verstreut.
- **Maßstab:** Poller, Kiste, Tür gegen Kran und Leuchtturm.
- **Ebenen:** 0 Himmel mit Horizontschein rechts; 1 Mole und Leuchtturm, flach und hell; 2 hintere Lagerhäuser, Kran; 3 vorderes Lagerhaus, Laterne, Netzgestell; 4 Kai mit Pflaster, Kranschiene, Wasser rechts mit Spiegelungen; 5 Pfahl und Tau links vorne angeschnitten, Kistenkante rechts unten; 6 Gischt und Nieselregen.

### Variante 1: Lagerhaus-Gasse

- **Horizont** y 122. Fluchtpunkt (268, 122). Blickpunkt: in einer engen Gasse zwischen zwei Speichern, Blick zum Wasser.
- **Blickführung:** Zwei hohe Wände rahmen das Bild, links höher als rechts. Am Ende der Gasse ein schmaler Streifen Hafen mit dem Leuchtturm, klein. Die Rinne in der Mitte des Pflasters führt dorthin.
- **Wahrzeichen und falsches Detail:** Der Kegel zeigt **in die Gasse hinein** (landeinwärts, auf uns zu). Man sieht ihn als Lichtfächer, der in Abständen über die Wände wischt. Viele zugemauerte Fenster an beiden Wänden, das eine warme Fenster ganz oben rechts.
- **Details und warum:** Ladeluken mit Kragbalken und Rolle, darunter hängen Netze zum Trocknen (die Gasse ist windgeschützt). Ein Fass unter dem Fallrohr. Pfützen spiegeln das warme Fenster.

### Variante 2: Bootssteg

- **Horizont** y 154, sehr tief. Fluchtpunkt (206, 154). Blickpunkt: niedrig, fast auf dem Wasser.
- **Blickführung:** Ein breiter Anleger läuft aus dem Vordergrund zum Fluchtpunkt in die See, seine Planken sind die Fluchtlinien. Rechts am Ufer die Silhouette des Viertels, klein. Der Leuchtturm steht links auf einer Landzunge, der Kegel streicht nach rechts **über die Stadt**.
- **Details und warum:** Ruderboote liegen am Steg festgemacht (links), ein Boot ist kieloben aufs Ufer gezogen. Pfähle mit Algenkante, unregelmäßig, weil oft geflickt. Eine Laterne am Stegende (für heimkehrende Boote).

### Wächter: Am Fuß des Leuchtturms

- **Horizont** y 196, Untersicht. Der Turm steht rechts der Mitte, groß und angeschnitten, die Laterne oben rechts. Felsen und Gischt am Fuß. Auch der Turm hat zugemauerte Fenster bis auf eines. Der Kegel geht nach links ins Land.

## Akt 1b: Der Moorwald

Palette Wald (violett) für Himmel, Bäume und Steine, Moor (grün) für Wasser und Torf. Augen `#9affe0`. Licht: Sternenhimmel, oben rechts ein heller Schleier (Milchstraße), daher Randlicht oben rechts. Keine Mondscheibe (Klischee).

### Variante 0: Bohlenweg

- **Horizont** y 150. Der Himmel nimmt mehr als die Hälfte ein. Blickpunkt: auf dem Weg im Moor.
- **Blickführung:** Ein Bohlenweg in S-Form läuft von unten links durch das Wasser nach rechts hinten und steigt zur Anhöhe hinauf, auf der der **Steinkreis** steht (etwa x 428, y 100: rechts der üblichen Gegnerplätze und vor einem helleren Himmelsfleck, damit er sichtbar bleibt). Der Weg ist keine Gerade, sondern folgt dem festen Boden.
- **Falsches Detail:** Alle Bäume neigen sich **zum Steinkreis**. Links stehende neigen sich nach rechts, die rechts hinter dem Kreis nach links. Mit fremdheit nimmt die Neigung zu. In den Wasserlöchern links vorne spiegeln sich **Sterne, die am Himmel nicht stehen** (eigene Muster, leicht grünlich). Am Himmel ein Sternbild, das man zu kennen glaubt (wie der Orion), aber der Gürtel hat vier Sterne.
- **Details und warum:** Abgestorbene Erlen und Birken stehen dort, wo der Boden fest ist, also am Weg und auf der Anhöhe, nicht im offenen Wasser. Ein Torfstapel am Wegrand (hier wird gestochen). Bohlen sind teils gebrochen.

### Variante 1: Torfstich

- **Horizont** y 124. Fluchtpunkt (236, 124). Wir stehen im ausgestochenen Graben.
- **Blickführung:** Rechts steigt die Stichwand in drei Stufen auf und läuft zum Fluchtpunkt; links ist das Ufer niedrig und offen, dort steht der Steinkreis klein auf einer fernen Kuppe (x 196).
- **Details und warum:** Torfsoden zu kleinen Pyramiden gestapelt, nur auf den Stufen (dort trocknen sie). Ein Spaten steckt in der frischen Stichkante vorne. Eine Schubkarre im Graben. Wenige Bäume links, alle zum Kreis geneigt. Pfützen im Grabengrund mit fremden Sternen.

### Variante 2: Im Steinkreis

- **Horizont** y 162. Blickpunkt: in der Mitte der Anhöhe.
- **Blickführung:** Die Steine stehen auf einer flachen Ellipse um die Mitte: hinten klein, an den Seiten groß und angeschnitten. Über dem Kreis der große Himmel mit dem falschen Sternbild. Am Horizont die Baumkronen, die sich alle **zu uns herein** neigen.
- **Details und warum:** Die Steine haben Kerben, die zur Mitte zeigen. In ihren Fußmulden stehen Pfützen mit fremden Sternen.

### Wächter: Der Opferstein

- Ein flacher Stein mit Kerbe, nah und groß, mittig rechts, umgeben von Kreissteinen. Untersicht, Horizont y 176.

## Akt 2: Die überflutete Kapelle

Palette Kapelle (bernstein), Augen `#fff4d0`. Licht: Das Rundfenster ist die Hauptlichtquelle; sein grünes Licht kommt **von unten** und fällt schräg nach oben in das Gewölbe (falsch, weil Licht durch Fenster sonst von oben fällt). Kerzen warm, Randlicht bernstein.

### Variante 0: Mittelschiff

- **Licht-Nachtrag:** Die Wasserfläche ist eine echte schräge Ebene (Höhe = 0,5 − 0,12·X, mit fremdheit steiler). Daraus folgt die schräge Wasserkante an den Pfeilern und auf der Chorwand und der trockene Streifen ganz rechts.
- **Horizont** y 140, Fluchtpunkt (240, 140), mittig: die einzige streng symmetrische Szene des Spiels.
- **Blickführung:** Säulen links und rechts laufen zum Altar; dahinter das **Rundfenster** (Mitte x 240, y 70) mit grünem Maßwerk-Licht.
- **Falsches Detail:** Das Wasser steht **schräg**: Die Wasserlinie an den Säulen ist links höher als rechts (Neigung etwa 10 Grad), die Bänke tauchen links tiefer ein. Zwei Kerzen brennen **unter Wasser** weiter, mit gebrochenem Licht.
- **Details und warum:** Die Bankreihen ragen mit den Lehnen aus dem Wasser, die vorderen gekippt. Kerzen stehen auf Treibholz dort, wo gebetet wurde: am Altar und an der zweiten Bank links (dort kniete jemand). Gewölberippen oben laufen aus dem Bild (die Ecke links oben bleibt dunkles Gewölbe).

### Variante 1: Seitenkapelle

- **Horizont** y 150, Fluchtpunkt (300, 150). Frontal vor der Seitenwand.
- **Blickführung:** Ein großer Spitzbogen öffnet sich in eine Seitenkapelle. Darin ein Seitenaltar mit einer Figur in der Nische und einem gestuften Ständer voller Votivkerzen: hier beten die Leute, darum ist hier das meiste warme Licht.
- **Falsches Detail:** Weil das Wasser schräg steht, ist der Boden links überflutet und rechts trocken. Die nasse Kante läuft schräg quer durch die Kirche. Eine Hochwassermarke an der Wand ist ebenso schräg. Grünes Licht vom (unsichtbaren) Rundfenster fällt als Band von rechts unten nach links **oben**. Zwei Kerzen brennen unter Wasser.
- **Details und warum:** Ein Beichtstuhl rechts (auf dem trockenen Teil), Pfeiler links vorne als Rahmen.

### Variante 2: Empore

- **Horizont** y 100. Blickpunkt auf der Empore, hoch über dem Wasser.
- **Blickführung:** Vorne der Dielenboden der Empore (auf ihm stehen die Gegner), dahinter quer die Brüstung mit Docken. Durch die Lücken sieht man tief unten das Wasser mit winzigen Bankreihen (eigene, viel höhere Perspektive). Gegenüber, fast auf Augenhöhe, das Rundfenster; Pfeilerköpfe und Bögen ragen aus der Tiefe.
- **Details und warum:** Gesangbuchpult und Orgelpfeifen am rechten Rand (Empore = Orgel). Der Krämer (Küster) steht hier.

### Wächter: Vor dem Altar

- Gleicher Aufbau wie das Mittelschiff, aber nah: Chorwand bei Tiefe 8, Rundfenster groß (Radius ~70) mittig oben, Altar mit Stufen aus dem Wasser.
- **Übergang** nutzt diesen Ausschnitt und öffnet hinter dem Altar die Treppe nach unten, grün beleuchtet.

## Akt 3a: Die Salzstollen

Palette Salz, Augen `#ff9a5a`. Die hellste Szene: Salz reflektiert. Licht: Von oben rechts fällt fahles Licht aus einem Schacht in die Halle; Grubenlampen sind warm-orange.

### Variante 0: Salzkathedrale

- **Horizont** y 172, Untersicht in eine riesige Halle.
- **Blickführung:** Gewachsene Säulen (unten breit, in der Mitte eingeschnürt, oben in die Decke übergehend, mit Kristallfacetten) stehen unregelmäßig in die Tiefe. Die Schienen kommen von rechts unten und laufen nach links hinten bergab.
- **Falsches Detail:** In der linken Salzwand liegen Fossilien (Ammoniten, Fische) mit **offenen Augen, alle nach unten blickend**. Die Lore steht auf den Schienen in der Mitte, zum Gefälle hin; niemand schiebt.
- **Details und warum:** Eine Grubenlampe hängt am letzten Holzstempel, wo der Stollen in die Halle mündet (rechts). Maßstab: Lore und Lampe gegen die Säulen.

### Variante 1: Holzverbau

- **Horizont** y 128, Fluchtpunkt (300, 128), der Stollen biegt nach rechts.
- **Blickführung:** Türstöcke aus Holz in ungleichen Abständen (wo neu verbaut wurde, dichter), vom Salzdruck verbogen. Am Ende ältere Schicht: ein römisch behauener Bogen mit Steinmetzzeichen.
- **Details und warum:** Grubenlampen an den Kappen, wo gearbeitet wird; Fossilien in der rechten Wand; Lore auf der Schiene bergab.

### Variante 2: Kristallgrotte

- **Horizont** y 150. Links eine schräge Salzwand mit Fossilien, rechts Kristalle so groß wie Häuser, hinten klein die weiße Öffnung zur Kathedrale.

### Wächter: Die Säule und das Loch

- Eine Säule nah und riesig links der Mitte, rechts in der Wand ein rundes Loch, aus dem der Wurm kommt.

## Akt 3b: Die namenlose Stadt

Palette Rost, Augen `#ffe060`. Licht: Ocker aus dem Abgrund **von unten** hinten, kühleres Randlicht oben rechts von einem Lichtschacht.

### Variante 0: Reliefhalle

- **Horizont** y 152. Eine frontale Wand über die ganze Breite.
- **Blickführung:** Das **Reliefband** (y 30–66) läuft waagerecht durch die ganze Szene, oberhalb der Gegnerköpfe: Figuren mit zu vielen Gelenken, die sich vor etwas Großem in der Mitte rechts verneigen oder fliehen.
- **Falsches Detail:** Die Türen am Wandfuß sind **breit und flach** (etwa 70 × 18). Vorne führen Stufen herab, die **viel zu niedrig** sind (2 px). Aus Fugen im Boden steigt Sand **nach oben**.
- **Details und warum:** Ein Absatz unter dem Band (dort stand etwas). Der Sand sammelt sich nicht am Boden, sondern an der Unterseite des Gesimses.

### Variante 1: Niedriger Gang

- Vorne eine **hüfthohe Decke** als schwere Platte quer über das obere Bild (deckt die UI-Ecke), dahinter öffnet sich eine riesige Halle mit Pfeilern. Das Reliefband läuft am Sturz der Platte nah und groß weiter.

### Variante 2: Am Abgrund

- **Horizont** y 128. Der Boden endet rechts an einer Kante; aus dem Abgrund steigt Sand in Schleiern nach oben, von unten ocker beleuchtet. Links führen die zu niedrigen Stufen hinab. Gegenüber die ferne Wand mit dem Band.

### Wächter: Das Band nah

- Ein Ausschnitt des Bandes groß: das „Große“, vor dem die Figuren knien.

## Akt 4: Das schwarze Eis

Palette Eis, Augen `#ff4a4a`. Licht: Die Höhlendecke ist ein Himmel ohne Sterne. Kaltes Randlicht von oben rechts (eine fahle Spalte in der Decke), dazu ein schwaches Leuchten **von unten** aus dem Eis.

### Variante 0: Eisfeld

- **Horizont** y 96, Aufsicht. Der Boden ist das Bild.
- **Blickführung:** Eisrisse laufen zum Fluchtpunkt (310, 96). Rechts hinten eine Reihe gefrorener Brecher.
- **Wahrzeichen:** Unter dem Eis der **riesige Umriss** (Mitte x 250, y 205), nur als schwaches Leuchten an seinen Kanten. **In jeder Eis-Szene an derselben Stelle des Bildes.**
- **Falsches Detail:** Die Wellen sind mitten in der Bewegung gefroren. Eine Welle hat vor sich eine helle Narbe im Eis: dort stand sie vorher.

### Variante 1: Gefrorene Brandung

- **Horizont** y 140. Eine große, überhängende Welle links, kleinere nach rechts hinten. Wir stehen im Wellental. Der Umriss scheint durch den Talboden.

### Variante 2: Lager der Expedition

- **Horizont** y 118. Zelt mit Laterne (letztes menschliches Licht), eingefrorener Schlitten, Stangen mit Führungsseil in ungleichen Abständen, einige umgefallen. Der Umriss liegt wieder an derselben Stelle.

### Wächter: Der Riss

- Ein breiter Riss im Eis vorne, darunter der Umriss näher und heller.

## Akt 5: Die Pforte

Palette Grund (türkis), Augen `#ff6ad8`. **Licht von links** (gespiegelt). Der Umriss der Pforte wandert langsam zwischen Magenta und Türkis.

### Variante 0 bis 2 (vereinfacht)

- **V0:** Pforte (hohe Linse aus Randlicht, Farbe wandert in sechs festen Stufen zwischen Magenta und Türkis) in der Mitte. Innen Ringe, die immer kleiner werden (nah und unendlich fern). Der Horizont wölbt sich an den Rändern nach oben. Links und rechts Stufenringe auf Schäften: Treppen, die im Kreis zu sich selbst führen. Der Boden spiegelt die Pforte. Funken treiben langsam auf die Öffnung zu.
- **V1:** Nah an einem großen Stufenring links, die Pforte klein rechts hinten.
- **V2:** Der Boden ist ein zweiter Himmel: Sterne oben und gespiegelt unten, die Pforte doppelt.
- **Wächter (Finale):** die Pforte nah und groß, hinter dem Boss.
- **ankunft:** V0 ruhig: die Pforte innen hell und offen, kein Sog.

## Andere Knoten (Arten)

Alle Arten nutzen den Ort ihres Bioms, mit anderem Ausschnitt:

- **weg:** die Variante des Seeds, Ferne etwas klarer (Überblick).
- **rast:** Variante des Seeds, Ferne dunkler, ein kleines Feuer vorne mittig.
- **werkstatt:** Werkbank mit Werkzeug mittig vorne.
- **kraemer:** Mitte freigehalten, ein Stand mit Laterne leicht rechts der Mitte.
- **ereignis / fund / wandbild:** Mitte freigehalten, ein Fundstück oder eine Ritzung als Blickpunkt.
- **uebergang:** der Abstieg ins nächste Biom (Hafen/Moor: Kirchenmauer im Wasser; Kapelle: Treppe hinter dem Altar; Salz/Stadt: Spalt nach unten; Eis: Loch im Eis).
- **strand:** Morgen am Strand von Saltmoor, Möwen, flacher Horizont, Flutlinien.
- **ankunft:** die offene Pforte, ruhig, ohne Gegner.
- **titel:** Saltmoor bei Nacht von der Küste: Klippe vorne, Bucht, Lichter der Stadt, Leuchtturm.

## Prüfung


Bilder: [bilder/M8/](bilder/M8/). Je Biom `<biom>-kampf-v0.png` (×2, mit Gegner-Platzhaltern), `<biom>-varianten.png` (V0, V1, V2, Wächter), `<biom>-fremdheit.png` (0 / 0,5 / 1), `<biom>-arten.png` (weg, rast, werkstatt, krämer, ereignis, wandbild, fund, übergang), dazu `uebersicht.png`, `sonderszenen.png` (strand, ankunft, titel), `reliefs.png`, `bildrate.txt`. Erzeugt mit `node tools/hintergruende-fotos.js --arten --fremd`.

### Prüffragen je Biom (Kampf, Variante 0)

| Biom | Ort ohne Text? | Wahrzeichen / falsches Detail sichtbar? | ≥ 4 Tiefenebenen? | Nebel < 1/3? | Klischee? | Stil wie Figuren? | Organisch oder Raster? |
|---|---|---|---|---|---|---|---|
| Hafen | Ja: Speicherflucht, Kai, Kran, Leuchtturm, Netze. | Ja. Leuchtturm rechts frei von Gegnern, Kegel sucht über den Dächern. Zugemauerte Fenster lesbar, das eine warme Fenster sitzt hoch über den Köpfen. | Ja (Himmel, Mole/Turm, hintere Speicher und Kran, vordere Speicher mit Laterne, Kai, Dalben vorne). | Ja, ein Band von etwa 25 %. | Nein. | Ja: Randlicht oben rechts, Fase, Dither. Speicherfassaden etwas flach. | Organisch gesetzt; die Fensterraster sind Architektur und darum regelmäßig. Pfützen wirken teils fleckig. |
| Moorwald | Ja: toter Wald, Bohlenweg, Wasserlöcher. | Steinkreis rechts auf der Anhöhe gut, Neigung der Bäume zur Mitte erkennbar, aber nur, wenn man es weiß. Die fremden Sterne im Wasser lesen sich eher als Glühwürmchen. Das Sternbild mit vier Gürtelsternen braucht einen zweiten Blick. | Ja. | Ja. | Nein (kein Mond, keine Grabsteine; die Steine sind Menhire). | Ja, Zweige sind etwas zu hell. | Organisch: Haine, S-Weg, Binsen nur an Wasserrändern. |
| Kapelle | Ja, sofort. | Ja: Rundfenster grün, Strahlen steigen nach oben, Wasserkante schräg, Kerzen unter Wasser (animiert). | Ja. | Ja. | Nein. | Ja; die Quaderwand ist etwas unruhig. | Symmetrisch gewollt; Bänke verdreht, Kerzen dort, wo gebetet wurde. |
| Salzstollen | Ja: hell, Schienen, Lore, Holzstempel, Grubenlampe. | Säulen lesen sich als gewachsen. Fossilien mit Augen nach unten klar, nur klein. Die Lore steht (statisch, sie fährt nicht). | Ja. | Ja. | Nein. | Ja, sticht als einziges helles Biom heraus. | Organisch: Säulen ungleich in der Tiefe, Kruste aus Voronoi-Zellen. |
| Namenlose Stadt | Ja: Fries, flache Türen, niedrige Stufen. | Reliefband über die ganze Breite gut. Figuren lesen sich eher als Strichmännchen mit Knicken als „zu viele Gelenke“. Aufsteigender Sand ist nur in Bewegung zu sehen. | Ja (V0 eher flach, der frontale Aufbau ist Absicht). | Ja. | Nein; das „Große“ im Band erinnert entfernt an eine Sonne. | Ja. | Unregelmäßige Abstände im Band; die Stufenbänder sind gewollt gleichmäßig. |
| Schwarzes Eis | Ja: Eisfläche, gefrorene Brecher, Höhlendecke. | Umriss unter dem Eis jetzt nur zu ahnen, an derselben Stelle in allen Eis-Szenen. Die Narbe vor einer Welle fällt kaum auf. | Ja. | Ja. | Nein. | Ja. | Organisch; die Risse laufen als Fluchtlinien, sind aber gleichmäßig verteilt. |
| Pforte | Ja, als „anderer Ort“. | Pforte mit wandernder Farbe, Licht von links, Treppenringe. | Mittel: nur drei klar getrennte Ebenen. | Ja. | Grenzwertig: Linsenform und Ringe sind eher Science-Fiction als Lovecraft. | Ja, gespiegelt. | Bewusst konzentrisch. **Vereinfacht.** |

### Gesamturteil

- **Stark:** Die sieben Orte sind im Übersichtsbild sofort unterscheidbar, nach Farbe und nach Aufbau: Diagonale, Senke mit Anhöhe, kippende Symmetrie, Untersicht, Fries, Aufsicht, konzentrisch. Die Wahrzeichen stehen außerhalb der üblichen Gegnerplätze oder über den Köpfen. Kapelle und Salz sind am stärksten.
- **Schwach:** Pforte (vereinfacht) und die Moor-Variante Torfstich (die Stichwand ist zu dunkel). Weite Bodenflächen sind in Hafen und Stadt noch ruhig; das ist für die Karten-UI unten gut, wirkt ohne UI aber leer. Wandbild-Reliefs (`World.relief`) sind nur ein Grundgerüst. Die Varianten sind andere Stellen desselben Ortes, aber V0 ist je Biom deutlich am gründlichsten.
- **Bildrate:** Mit Ebenen, Animation, 4 Platzhaltern, Vordergrund und Luft braucht ein Bild in headless Chromium (Software-Rendering) 0,3 bis 0,6 ms, im Hafen 2 ms (der Leuchtturmkegel wird neu berechnet, wenn er sich bewegt). Das ist weit unter 16,7 ms, also 60 fps. Der Aufbau einer Szene dauert 35 bis 220 ms, einmal pro Knoten. Werte in `bilder/M8/bildrate.txt`.

## Technik (wie gebaut)

- `World.build(biom, {variante, seed, fremdheit, art})` liefert `{w, h, rand, ebenen[5], vorne, reihen[3], lichter, zeichneAnimiert, zeichneVordergrund, zeichneHintergrund, zeichneEbene, zeichne}`.
- **Abweichung:** Jede Ebene ist 504 × 294 groß (12 px Rand, damit beim Verschieben kein leerer Streifen entsteht) und trägt `x: -12, y: -12`. Zu zeichnen also bei `(e.x - round(kamera.x*parallax), e.y - round(kamera.y*parallax))`. Bequemer: `szene.zeichneHintergrund(ctx, t, kamera)`, dann die Gegner, dann `szene.zeichneVordergrund(ctx, t, kamera)`.
- Der Boden ist je nach Tiefe auf die Ebenen 2, 3 und 4 verteilt (`K.split`). So überdeckt der nahe Boden nichts, was weiter hinten steht.
- `Math.random` nur in Partikeln, Möwen, Funken und Wasserglitzern. Alles andere hängt am Seed (splitmix32) oder ist fest gesetzt.
