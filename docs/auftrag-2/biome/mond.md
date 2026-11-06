# Der Mond unter dem Eis (`mond`) · Akt IV · Zugabe

Biom-Paket nach [paket-format.md](../paket-format.md), Zugabe aus [03-meilensteine.md](../03-meilensteine.md). Zeitschicht Akt IV: **vor dem Leben**. Bilder: [bilder/Zugabe/mond/](../bilder/Zugabe/mond/). Alles per Skript gezeichnet (Weg A, `quelle: skript`), kein Bild-Generator in der Sitzung.

| Teil | Datei |
|---|---|
| Daten | `prototype/data/biome/mond.json` |
| Hintergrund | `prototype/js/scenes/world/mond.js` |
| Zonenpalette | `tools/sprites/zonen/mond.json` |
| Gegner | `tools/sprites/gegner/astronom.js`, `kraterbewohner.js`, `mondmotte.js`, `gezogene.js`, `rueckseite.js` |
| Item-Icons | `tools/icons/items/mondkarte.js`, `stechzirkel.js`, `mondstaub.js`, `aschlicht.js` |

## Der Ort

Unter dem schwarzen Eis, wo das Wasser aufhört, hängt ein zweiter Mond. Kalt, bleich, so nah, dass die Expedition von 1890 eine Strickleiter aus dem Eis bis auf seinen Staub hinabgelassen hat. Man steigt hinab und steht auf Asche. Der Horizont ist so krumm, dass man ihn in einer Stunde umrunden könnte. Es weht nichts; jede Spur bleibt. Es gibt keine Sonne, und trotzdem ist der Mond hell: Das Licht kommt von jenseits des Horizonts, von der Rückseite.

- **Wahrzeichen:** die Mondscheibe mit ihren Kratern. In den Kratern brennen Lampen, denn sie sind bewohnt. In V0 hängt die ganze Wölbung riesig über dem Sims, in V2 steht man in einem Krater, dessen Terrassen Fenster haben.
- **Falsches Detail:** Der Mond hat eine Rückseite, und sie schaut dich an. Krater auf der Nachtseite und hinter dem Horizont sind Augen: ein Ringwall, darin Lider, eine bleiche Pupille, die zu dir sieht und manchmal blinzelt. Nie erklärt; mit `fremdheit` öffnen sich mehr.
- **Palette:** Silber, Asche, bleiches Gelb. Körper warmes Aschgrau nahe Schwarz (`#060606 … #2c2b26`), Randlicht Silber (`#83837d`/`#dddcd4`), Augen bleiches Gelb (`#efe07c`, Kern `#fffbe2`), Zusatzfarben Asche, Messing (der Astronom) und Bleich (Lampen). Das Eis ist warmgrau statt blau.
- **Abgrenzung im Akt:** Das Schwarze Eis ist blau mit roten Augen und Gesichtern im Eis; die Walkathedrale Knochenweiß in Blauschwarz mit korallenrotem Mark, ein Gewölbe aus Rippen; das Glasmeer Schwarzglas und Polarlicht-Grün, ein Spiegel. Der Mond ist neutral grau bis bleichgelb, sein Bildaufbau ist **die Kugel**: gekrümmte Horizonte, Kreisbögen, Ringwälle, Licht von hinter der Kante. Keine Gesichter im Eis, keine Spiegel, keine Knochen.
- **Licht:** Gegenlicht oben rechts ist der Schein der Rückseite über dem Horizont (bleichgelb). Dazu das Mondlicht von unten auf der Unterseite des Eises, Lampen in den Kratern, die Laterne des Gehilfen.
- **Krämer:** Der Gehilfe (`art: leihe`). Er hat 1890 die Leiter gehalten, während der Herr hinabstieg, und hält sie seitdem. Er verleiht statt zu verkaufen: Hier gehört nichts jemandem, nicht einmal das Licht. Die Leihe passt, weil der Mond selbst nur geliehenes Licht hat.

## Hintergrund: Kompositionen

Grundform **die Kugel**. Jede Variante hat einen gekrümmten Rand (Scheibe, Horizont, Wall), hinter dem das Licht steht. Nebel nur als schmales Dunstband am Horizont (deutlich unter einem Drittel). Aufbau je Szene 150 bis 520 ms in headless Chromium.

### Variante 0: Der Abstieg
- **Horizont** y 168. Wir stehen auf einem Sims aus schwarzem Eis mit Reif und Rissen, die zur Kante laufen.
- **Aufbau:** Über die Kante ragt die obere Wölbung des Mondes, Radius 206 px, fast die ganze Breite: Maria, Krater mit Wall und Schatten, acht Lampen in Kratern. Licht von rechts oben; die Nachtseite links ist ein schmaler Rand im Erdschein. Darüber die Eisdecke in Platten, Zapfen.
- **Falsches Detail:** zwei Krater auf der Nachtseite sind Augen und blinzeln selten.
- **Maßstab:** die Strickleiter der Expedition hängt aus dem Eis bis auf den Mond; eine Kiste von 1890 auf dem Sims.
- **Hinter den Gegnern:** die helle Scheibe. Dunkle Figuren stehen davor als Silhouetten.

### Variante 1: Das Aschenmeer
- **Horizont** y 132, als Kurve (der Mond ist klein). Auf der Oberfläche.
- **Aufbau:** Rechts steht der Schein der Rückseite über dem Horizont, darin schauen **zwei große Augen** über die Kante. Ferne Kraterwälle als Silhouetten, in zweien Licht. Die Leiter hängt aus dem Eis bis in den Staub, Fußspuren laufen zu ihr. Krater am Boden (einer mit Lampe, mit Fremdheit einer mit Auge), Brocken im Mittelgrund und vorn als Rahmen.

### Variante 2: Im Krater
- **Horizont** y 142. Wir stehen innen in einem großen Krater.
- **Aufbau:** Der Wall in fünf Terrassen, jede mit eigener Fase und Kante, Rinnen und Geröll; in den Terrassen **Fenster**, die meisten mit Lampenlicht (mit Fremdheit weniger). Rechts der Zentralberg. Das Lager des Astronomen: Zelt mit Lampe rechts, links der Refraktor auf dem Stativ.
- Der Schein der Rückseite oben rechts über dem Wall.

### Wächter-Szene: Die Rückseite
- **Horizont** y 150, nah und stark gekrümmt; der Boden ist hell (die Rückseite liegt im Licht).
- **Ruhige Zone hinter dem Wächter:** ein großer, ruhiger Hof aus bleichem Licht (wenige Stufen, gedithert), genau hinter der Sichel. Die Sichel steht hell und mit Silberrand davor, ihr Profil dunkel gegen den Hof, die Augen im Ring glühen gelb gegen das Grau. Die Szene ist bewusst symmetrisch.
- Links und rechts Krater mit Lidern, halb geschlossen; mit `fremdheit` öffnen sie sich. Dunkle Brocken und Zapfen rahmen.

### Die anderen Arten
- **weg:** Variante nach Seed. **rast:** Aschenmeer mit Feuer aus Expeditionskisten. **werkstatt:** im Krater, Werkbank. **kraemer:** der Abstieg, am Fuß der Leiter der Stand des Gehilfen: Kisten, Klappstuhl, ein Messingrohr, Lampe. **ereignis / fund:** im Krater, ein offener Instrumentenkasten mit schimmerndem Messing. **wandbild:** Variante nach Seed, Relief im Biomstil (Asche, vier Figuren zu einem Großen). **uebergang:** Neumond: ein rundes, glattes Loch im Staub, die Leiter geht weiter hinab, von unten kaltes, fremdes Licht (zur Pforte).

## Gegner

Arbeitsweise: je Gegner zwei Silhouetten-Proben als schwarze Fläche, gegen alle 171 vorhandenen Sprites geprüft (die verworfenen stehen als `proben` in den Skripten), dann Licht, Randlicht, Fase, Dither, Binnenform, dann Pixel nachgearbeitet. **Zur Rückmeldung „große dunkle Flächen“:** Jede Figur hat Innenkanten-Randlicht (vordere Teile fangen an ihrer Lichtkante eine Linie, `innenKanten`), eigene Binnenform (Falten, Rippen, Adern, Segmente, Krater) und mindestens ein inneres Licht.

### Der Astronom (`astronom`)
- **Motiv:** Wer zu genau hinsieht, wird zum Instrument.
- **Wer er war:** ein Privatgelehrter der Expedition von 1890, der die Leiter hinabstieg, um den Mond von nah zu sehen.
- **Was falsch ist:** Wo sein Kopf war, steht eine Armillarsphäre aus Ringen; darin kreist ein kleiner, bleicher Mond (sein Auge). Er misst mit einem Stechzirkel so groß wie er selbst.
- **Silhouette:** ein hagerer Mann im Gehrock, statt des Kopfes eine offene Kugel aus Ringen, ein großer Zirkel als Stock.
- **Proben:** volle Kugel als Kopf (las sich wie ein Ballon); Fernrohr statt Kopf (zu nah am Vermesser der Stadt). Genommen: offene Ringe.
- **Varianten:** a drei Ringe, Buch unter dem Arm; b vier Ringe, Pelerine mit Saum, Blendlaterne (zweites Licht).
- **Binnenform:** Faltentäler mit Grat, Revers, Messingknöpfe, Tasche, Naht der Schöße; der kleine Mond wirft Licht auf Kragen und Ringe.
- **Animation:** Leerlauf: der kleine Mond kreist. Angriff: Er hebt den Zirkel hinter den Kopf, dann sticht er nach vorn, die Spitzen schließen sich.
- **Kniff:** `einfrieren`: Was er ansieht, hält still (eine Handkarte ist für den Zug unspielbar). Neu im Akt IV. Fordert breite Hände.
- **Muster:** Zirkelstich (6), Notieren (Block 7), Abgreifen (2 × 4).
- **Schwachstelle Licht:** Er hat nur ins Dunkel gesehen; Licht blendet das Glas.
- **Stimme:** `bote`. **Beute:** Stechzirkel.

### Der Kraterbewohner (`kraterbewohner`)
- **Motiv:** Zu Hause sein, wo niemand wohnen kann.
- **Wer er war:** niemand. Die Krater sind bewohnt.
- **Was falsch ist:** Er stützt sich auf den Wall seines Kraters wie auf ein Fensterbrett, um zu sehen, wer kommt; hinter ihm brennt eine Lampe, auf dem Rand steht eine Tasse. Sein Schädel ist narbig wie der Mond.
- **Silhouette:** ein Ringwall mit Loch, daraus ein hagerer Rücken wie ein Fragezeichen, und Arme so lang, dass sie wie Stelzen bis draußen in den Staub reichen.
- **Proben:** ohne Krater (ein kriechender Mann, nichts vom Mond); Krater als voller Hügel (las sich wie die Wachshand). Genommen: Ringwall mit Loch.
- **Varianten:** a weiter Krater, Lampe auf dem Wall, Tasse; b engerer, tieferer Krater, er steht höher, Lampe in der Hand.
- **Binnenform:** Innenwand des Kraters vom Lampenlicht bleich, Unterlicht auf dem Leib, fünf Rippen, Schulterblatt, Wirbelgrate, Krater auf dem Schädel.
- **Animation:** Leerlauf: Nicken. Angriff: Er duckt sich ins Loch, richtet sich auf, dann schnappt er mit Kopf und Armen nach vorn. Tod: Er sinkt in den Krater, die Lampe geht aus.
- **Kniff:** `ruf` (alle 3 Züge ein weiterer Kraterbewohner): Er klopft an den Rand, und nebenan geht ein Licht an. Fordert Flächenschaden.
- **Muster:** Zuschnappen (7), Greifen (3 × 3), Ducken (Block 6).
- **Schwachstelle Feuer:** In seinem Krater brennt nur eine Lampe; mehr Feuer verträgt das Zuhause nicht.
- **Stimme:** `tiefling`.

### Die Mondmotte (`mondmotte`)
- **Motiv:** Was zum Licht fliegt.
- **Wer sie war:** nichts. Hier lebt nichts. Der Staub hat nur gesehen, was zum Licht fliegt, und hat sich so gesetzt.
- **Was falsch ist:** Eine Motte groß wie ein Kind, aufrecht im Staub; ihre Augenflecken sind Krater mit Wall, Schattenseite und Zentralberg, und in der Mitte sieht etwas zu dir.
- **Silhouette:** eine aufrechte Motte mit offenen Flügeln und gefiederten Fühlern.
- **Proben:** Flügel als Zelt von der Seite (ein Dreieck, las sich als Felsbrocken); flach ausgebreitet (wie ein Vogel im Flug). Genommen: aufrecht, offen.
- **Varianten:** a breite runde Flügel; b wie ein Mondspinner mit Schwänzen bis in den Staub, schmaler, längere Fühler.
- **Binnenform:** Adern mit Grat, Staubband am Außenrand gedithert, ein blinder Krater auf jedem Hinterflügel, geringelter Leib, Pelz.
- **Animation:** Leerlauf: Flügel heben sich um einen Pixel, Staub rieselt. Angriff: Flügel hoch und schmal, dann der Schlag nach vorn mit einer Staubwolke.
- **Kniff:** `loeschen`: Wo sie schlägt, fällt Asche, jede Glut erstickt. Neu im Akt IV, fordert Glutnest.
- **Muster:** Flügelschlag (5), Flattern (2 × 3), Einhüllen (Block 6).
- **Schwachstelle Wasser:** Nasser Staub fliegt nicht.
- **Stimme:** `nest` (schnarrendes Zirpen eines Insektenflügels). **Beute:** Mondstaub im Fläschchen.

### Die Gezogene (`gezogene`, Gezeiten-Gestalt)
- **Motiv:** Gezeiten: Der Mond zieht.
- **Wer sie war:** eine Ertrunkene aus dem Meer über dem Eis.
- **Was falsch ist:** Der Mond zieht das Meer als Strang aus Wasser bis in den Staub herab, und mit ihm, wen es behalten hat. Sie hängt kopfüber daran, die Knöchel im Wasser; der Rock fällt über sie wie eine umgedrehte Glocke, die Arme reichen in den Staub, das Haar liegt auf dem Mond wie Wurzeln. Sie sieht dich verkehrt herum an.
- **Silhouette:** ein Strang von oben, darunter eine umgedrehte Glocke, darunter Arme, Kopf und Haar bis zum Boden.
- **Proben:** aufrecht stehend (eine Frau im nassen Kleid, nichts Falsches); frei schwebend ohne Strang (eine Glocke mit Fransen). Genommen: kopfüber am Strang.
- **Varianten:** a Arme hängen gerade in den Staub; b Arme ausgebreitet wie im Fall, zerrissener Saum, zweiter dünner Strang.
- **Binnenform:** Falten laufen zur Hüfte zusammen (Tal und Grat), Spitzensaum, fallende Tropfen, Wasserfäden im Strang, Salzkrusten an den Knöcheln; Licht im Wasser an den Knöcheln, Augen und Mund.
- **Animation:** Leerlauf: Pendeln um einen Pixel. Angriff: Sie schwingt nach hinten aus und dann wie ein Pendel auf dich zu, eine Hand greift nach vorn. Tod: Der Strang reißt, sie sinkt in den Staub.
- **Kniff:** `wechsel` Wasser ↔ Salz: Ebbe und Flut; mal ist sie Wasser, mal trocknet sie zu Salz. Neu im Akt IV, fordert Stoff-Vielfalt.
- **Muster:** Schwung (6), Ebbe (Block 7), Flut (9).
- **Schwachstelle Wasser** (zu Beginn), dann im Wechsel Salz.
- **Stimme:** `ertrunkener`.

### Wächter: Die Rückseite (`rueckseite`, 160 × 180, drei Phasen-Sheets)
- **Motiv:** Das, was man nie sieht, sieht dich.
- **Was es ist:** Am Rand des kleinen Mondes geht die Rückseite auf, und sie hat ein Gesicht: eine Sichel, so hoch wie ein Haus, an der Innenkante ein Profil wie aus einem alten Bauernkalender (Stirn, Nase, Lippen, Kinn), das Auge offen. Der Rest der Scheibe liegt im aschgrauen Licht und ist nur als Rand zu sehen; darin öffnen sich die Krater wie Augen.
- **Phasen (zu- und abnehmen):** `rueckseite` (breite Sichel, zwei Augen), ab 66 % `rueckseite_p2` (Halbmond, vier Augen), ab 33 % `rueckseite_p3` (Sichel vor Neumond, sieben Augen). Der Kern wechselt das Sprite über `besonders.sprites`.
- **Silhouette:** eine Sichel mit Profil in einem dünnen Ring, darin schwebende Krater, auf einem Aschehügel.
- **Proben:** volle Scheibe (nur ein Kreis auf einem Hügel, das Gesicht verschwand); Sichel ohne Ring (las sich als Horn oder Hauer, nicht als Mond). Genommen: Sichel, Profil, Ring.
- **Animation:** Leerlauf: Die Augen im Ring blinzeln nacheinander, die Scheibe hebt sich um einen Pixel. Angriff: Die Sichel kippt zurück, der Mund öffnet sich (glimmt), dann schlägt sie mit dem oberen Horn nach vorn. Tod: Sie sinkt in den Hügel und zerfällt, die Augen zuerst dunkel.
- **Kampf (80 Leben):** Kniff `teurer 1`: Wohin sie sieht, wird die Hand schwer (eine Karte kostet diesen Zug 1 mehr). `besonders: phasen` bei 66 % und 33 %, ab Phase 2 ruft sie alle 3 Züge eine Mondmotte. Muster: Vollmond: Schlag (9), Krater (3 × 4), Block 10, Großer Schlag (13); abnehmend: 2 × 7, Stärke +2, 14, Block 10; **Neumond:** Block 20, 17, 4 × 4, Block 20, 19. Der Neumond war als „unverwundbar“ gedacht; der Kern kennt das nicht, darum zweimal Block 20 (siehe Vorschläge).
- **Schwachstelle Eisen:** Eisen ist das Einzige, was je von außen auf den Mond gefallen ist.
- **Stimme:** `augen`. **Beute:** Reliquie *Das aschgraue Licht*.

## Items

| ID | Name | Bereich, Stoff | Seltenheit | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|---|
| `mondkarte` | Mondkarte von 1890 | Talisman, Licht | selten, 2 Kerben, 40 | `erste_karte_billiger` | Kartieren (1: Block 5, ziehe 1) | Sauber getuscht, jeder Krater beziffert. Auf der Rückseite des Blattes ist dieselbe Karte noch einmal, von unten gesehen, und dort sind die Krater Augen. |
| `stechzirkel` | Stechzirkel | Waffe, Eisen | gewöhnlich, 1 Kerbe, 24 | – | Abgreifen (1: 2 × 3) | Messing, so lang wie ein Unterarm. Die Spitzen stehen genau eine Mondbreite auseinander, und der Mond ist hier sehr klein. |
| `mondstaub` | Mondstaub im Fläschchen | Talisman, Salz | gewöhnlich, 1 Kerbe, 20 | – | Staub in die Augen (1: 3 Schaden, Geschwächt) | Er setzt sich nicht. Er wartet, bis du hinsiehst, und dann hat er eine Form, die du kennst. |
| `aschlicht` | Das aschgraue Licht | Talisman, Salz | **Reliquie** (Wächter), 130 | `kampfstart_fx`: Schutz 6, alle Gegner geschwächt | Neumond (1: Block 9, behalten) | Der Teil des Mondes, auf den kein Licht fällt. Man sieht ihn trotzdem, solange man nicht hinsieht. |

Die Reliquie stützt Bollwerk (Schutz zu Kampfbeginn, eine Blockkarte, die man halten kann) und ist die erste Reliquie mit Salz. Fundpool: die drei gewöhnlichen/seltenen plus Kompass, Sturmlaterne, Spieluhr, Tarotkarten, Rosenkranz, Laudanum, Grubenlampe, Robbenfell, Leuchtpistole, Riechsalz. Icons: eigene Skripte (Weg wie die übrigen 48 × 48), `pruefen.js` 0 Verstöße.

## Ereignisse (6, alle aus diesem Ort)

| ID | Szene | Folgen | Bezug auf Früheres |
|---|---|---|---|
| `mond_leiter` | Die Strickleiter: 412 Sprossen mit Kreide beziffert, von unten gezählt sind es 413 | Handgriff, Kerbe, Heilung | – |
| `mond_krater` | Ein bewohnter Krater: Tisch für zwei gedeckt, der Tee noch warm | volle Heilung gegen max. Leben, Item + Kampf (zwei Kraterbewohner), Schleifen gegen Gold | – |
| `mond_refraktor` | Das Fernrohr zeigt senkrecht in den Staub, das Okular ist warm | Reaktion + seltener Handgriff, Mondkarte, Kerbe + Kampf (Astronom) | – |
| `mond_rand` | Der Rand: das Licht hört auf wie mit dem Lineal gezogen, dahinter Lider | Reliquie gegen max. Leben, Schleifen, Heilung | – |
| `mond_spuren` | Zwölf Paar Spuren hinaus, elf zurück | Mondstaub + Kampf (Gezogene), Kerbe + Gold, Handgriff, Gold | `event_gesehen: gezeitenwerk_ingenieur` (Akt III: dessen Messlatte liegt hier), `job: detektiv` |
| `mond_beobachtungsbuch` | Das Buch des Astronomen: der Neumond ist heute | **Energie auf Dauer** gegen −12 max. Leben, Kerbe + seltener Handgriff, Handgriff + Heilung, Gold | `event_gesehen: mond_refraktor`, `item: mondkarte`, `job: wahrsagerin` |

Kein Stummfilm, damit der Akt seinen einen aus der Walkathedrale behalten kann. Kein „deine Handschrift“-Motiv (das haben Eis, Walkathedrale und Gezeitenwerk schon).

## Musik

c-Moll, Grundton 48 (Schwarzes Eis 54, Walkathedrale 45, Glasmeer 56). Ort: kein Wind, Staub (`sand`), Eisgrund sehr tief, ein Schimmer; Rhythmus `atem` (ein langsames Ein und Aus, wie ein Schläfer), Einzelklänge aus `pforte`.

## Prüfung

- `node tools/sprites/pruefen.js astronom_a astronom_b kraterbewohner_a kraterbewohner_b mondmotte_a mondmotte_b gezogene_a gezogene_b rueckseite rueckseite_p2 rueckseite_p3`: **11 Sprites, 0 Verstöße**.
- `node tools/icons/pruefen.js`: 212 Bilder, 0 Verstöße.
- Kontaktbogen neben den Favoriten und Silhouetten: [mond-bogen.png](../bilder/Zugabe/mond/mond-bogen.png) (`node tools/biom-bogen.js mond docs/auftrag-2/bilder/Zugabe/mond`); gegen alle vorhandenen Sprites (Mond unten, rot markiert): [silhouetten-gegen-alle.png](../bilder/Zugabe/mond/silhouetten-gegen-alle.png); alle Animationen: [animationen.png](../bilder/Zugabe/mond/animationen.png), [animationen-waechter.png](../bilder/Zugabe/mond/animationen-waechter.png).
- Hintergrund: [hintergrund-varianten.png](../bilder/Zugabe/mond/hintergrund-varianten.png) (V0, V1, V2, Wächter, mit den echten Sprites), [hintergrund-arten.png](../bilder/Zugabe/mond/hintergrund-arten.png), [hintergrund-fremdheit.png](../bilder/Zugabe/mond/hintergrund-fremdheit.png) (fremdheit 1).
- Im Spiel (`newRun('fischer',3,{dev:true,route:['hafen','kapelle','salz','mond','pforte']})`, `Dev.springe(…,3)`): [im-spiel-kampf.png](../bilder/Zugabe/mond/im-spiel-kampf.png), [im-spiel-kampf-2.png](../bilder/Zugabe/mond/im-spiel-kampf-2.png) (V0), [im-spiel-kampf-3.png](../bilder/Zugabe/mond/im-spiel-kampf-3.png) (V1), [im-spiel-kampf-alle-vier.png](../bilder/Zugabe/mond/im-spiel-kampf-alle-vier.png), [im-spiel-waechter.png](../bilder/Zugabe/mond/im-spiel-waechter.png), [im-spiel-waechter-p2.png](../bilder/Zugabe/mond/im-spiel-waechter-p2.png), [im-spiel-waechter-p3.png](../bilder/Zugabe/mond/im-spiel-waechter-p3.png) (Phasenwechsel im Spiel geprüft). **Keine Konsolenfehler.**
- `node tools/biom-test.js mond 20`: siehe unten (Abschnitt Abstimmung). `node tools/test-ereignisse.js` und `node tools/test-run.js`: „Alles gut.“

### Abstimmung
Erste Werte (Leben 16–22, Wächter 74): 10/10 überstanden, zu leicht (Walkathedrale mit denselben Seeds 7/10). Erhöht: alle normalen Gegner +2 Leben und +1 Schaden, Wächter 80 Leben und stärkere Phasen. Danach **14/20 (70 %)**, 0 Fehler. Die Niederlagen kommen aus dem zweiten Kampf mit drei Gegnern (Kraterbewohner ruft, Astronom friert ein); der Wächter hat in 20 Seeds keinen Run beendet, wie bei der Walkathedrale.

## Vorschläge an den Kern

1. **Unverwundbarer Zug** (`{t:"verbergen"}` im Muster: in diesem Zug nimmt der Gegner keinen Schaden, Absicht zeigt einen geschlossenen Mond). Das war die Idee für den Neumond; jetzt Block 20.
2. **`ruf` mit Liste** (`gegner: ["kraterbewohner","mondmotte"]`, zieht per Seed): Der Kraterbewohner ruft heute nur seinesgleichen.
3. **Szene hört auf `boss_phase`:** Die Wächter-Szene könnte bei jedem Phasenwechsel ihre `fremdheit` erhöhen (in der Szene öffnen sich dann mehr Augen am Boden). Das Ereignis gibt es schon (`Bus.emit('boss_phase')`), die Szene wird aber nur einmal je Knoten gebaut.
4. **`wechsel` in der Absicht zeigen:** Die nächste Schwachstelle der Gezogenen erscheint erst nach ihrem Zug; ein kleines Stoff-Symbol in der Absicht würde den Kniff planbar machen.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt. Jedes Bild selbst angesehen (Vorschauen ×3–×5, Kontaktbogen, Szenen ×2, Bildschirmfotos).

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Astronom | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Die offene Ringkugel statt des Kopfes gibt es sonst nirgends, der kreisende kleine Mond ist Auge und Licht zugleich; Rock mit Falten, Revers, Knöpfen. Der Gehrock bleibt die größte dunkle Fläche, und der Zirkel ist dünn; vor der hellen Scheibe (V0) steht er sehr gut, vor dem Eis (V1) knapp. |
| Kraterbewohner | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Der beleuchtete Krater mit Lampe und Tasse erzählt „bewohnt“ ohne Text; Unterlicht, Rippen, Schulterblatt. Die langen Arme lesen sich ein wenig wie ein Gestell um ihn herum, und der Leib ist eine Säule. Erst nach zwei Umbauten (flacher Kasten, dann Arme als waagerechte Stangen). |
| Mondmotte | 5 | 4 | 4 | 5 | 5 | 5 | **4** | Stärkste normale Figur: die zwei Kraterflecken starren dich an, Adern und Staubband gliedern die Flügel. Die Hinterflügel sind dunkel und ruhig. Vorher ohne sichtbare Krater (Fehler im Skript), dann neu. |
| Gezogene | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Kopfüber am Strang ist eine Silhouette, die es im Spiel nicht gibt; Falten zur Hüfte, Spitzensaum, Tropfen. Der Strang liest sich eher als Seil denn als Wasser, und der Rock ist trotz Falten eine große dunkle Fläche. |
| Die Rückseite (Wächter) | 5 | 4 | 4 | 5 | 5 | 5 | **4** | Sichel mit Profil im Ring, die Krater als Augen, drei Phasen mit mehr Augen: eindeutig, eigen, und im Spiel steht sie klar vor dem Lichthof. Die Sichel hat dithernde Flecken an der Lichtkante, der Hügel ist schlicht. Der erste Hügel war eine flache Platte (wie ein Sockel) und ist ersetzt. |
| Wächter im Spiel-Foto | 5 | 5 | 4 | 5 | 5 | 5 | **4** | Ruhiger heller Hof genau hinter der Figur, dunkles Profil dagegen, Augen gelb auf Grau; Absicht und Name bleiben lesbar. |
| Hintergrund V0 Der Abstieg | 5 | 4 | 4 | 5 | 5 | 5 | **4** | Die riesige Wölbung mit Kratern und Lampen ist das Wahrzeichen, dunkle Figuren stehen davor wie Scherenschnitte; Leiter als Maßstab. Der Sims vorn ist eine dunkle, eher ruhige Fläche (dort liegt die UI). |
| Hintergrund V1 Das Aschenmeer | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Krummer Horizont, der Schein der Rückseite, zwei Augen über der Kante: das falsche Detail am klarsten. Der Boden vorn ist weit und gleichförmig, und die Gegner stehen vor dunklem Eis. |
| Hintergrund V2 Im Krater | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Terrassen mit Fenstern machen den Krater bewohnt, Zentralberg und Lager geben Tiefe. Die Terrassenkanten sind etwas gleichmäßig (Höhenlinien), schwächste Szene, zweimal umgebaut (erst ein flaches helles Band). |
| Hintergrund Wächter | 5 | 5 | 4 | 5 | 5 | 5 | **4** | Siehe oben; die Krater mit Lidern ringsum tragen das falsche Detail. |
| **Hintergrund gesamt** | | | | | | | **4** | |
| Item-Icons (4) | 4 | 4 | 4 | 4 | 4 | – | **4** | Zirkel und Fläschchen klar; Karte und Reliquie lesen sich bei 32 px noch, das Auge in der Reliquie ist klein. |

Nichts unter 4. Überarbeitet unterwegs: Astronom (Zirkel unsichtbar → als Stock vorn; Ausholen ragte aus dem Bild), Kraterbewohner (zweimal, siehe oben; Lichtfleck als Rechteck → rund), Mondmotte (Krater fehlten, Beine als lange Lichtstriche), Gezogene (Arme wie Krücken), Rückseite (Profil zu schwach, Hügel), Leerlauf aller Figuren (kriechender Dither → ganzzahlige Verschiebung), V0 (Mond zu klein und dunkel, Gegner vor der Nachtseite), Eisdecke (Flecken → Platten), V1 (Augen wurden von den fernen Wällen verdeckt), V2 (helles flaches Band → Terrassen).

## Offene Schwächen

- Der Neumond ist nur Block 20 statt „unverwundbar“ (Vorschlag 1).
- Die Phasen-Sprites zeigen die Abnahme, die Szene selbst ändert sich beim Phasenwechsel nicht (Vorschlag 3).
- Der Rock der Gezogenen und der Gehrock des Astronomen sind trotz Falten die dunkelsten Flächen des Bioms.

## Zweiter Wächter: Der Mann im Mond (`mondmann`, Zugabe)

Eingetragen als `biom.waechter_alt` in `prototype/data/biome/mond.json`; Sprite `tools/sprites/gegner/mondmann.js` (Sheets `mondmann`, `mondmann_p2`), Zonenpalette `tools/sprites/zonen/mond_erde.json` (Körper wie das Biom, Randlicht Erdschein-Blau). Bilder: [bilder/Zugabe/waechter2/](../bilder/Zugabe/waechter2/).

- **Wer/was:** Der aus dem Bauernkalender, der am Sonntag Reisig gesammelt hat und dafür auf den Mond musste. Er ist immer noch unterwegs, tief gebückt unter einem Bündel, größer als er selbst, mit Hakenstock und Laterne, das Gesicht rund und vernarbt wie der Mond.
- **Das falsche Detail:** Das Bündel ist kein Reisig. Es sind die Sprossen der Strickleiter von 1890, zusammengeschnürt, hinten hängt noch ein Stück Leiter heraus, und an manchen Sprossen hängen noch die Hände, die sich daran festhielten. Er geht durch Asche, in der jede Spur bleibt, und hinterlässt keine (der einzige Gegner ohne Bodenschatten).
- **Silhouette in einem Satz:** ein tief gebückter Wanderer, über ihm schräg ein gespreiztes Bündel wie ein Dornenkamm, vorn der Stock mit der Laterne.
- **Warum anders als die Rückseite:** Die Rückseite ist eine Scheibe, sie macht Karten teurer, wird unverwundbar und ruft Motten. Der Mann im Mond ist eine Figur, ruft niemanden und stört das Deck auf Dauer: Kniff `abschrift 2` mit eigener Karte „Reisig“ (Bild `kerbholz`): „Was er trägt, lädt er dir auf.“ Besonderheit `phasen` bei 50 %: „Ohne Last“ (`mondmann_p2`): Er wirft das Bündel ab und richtet sich auf, und erst jetzt sieht man, wie groß er ist, der eine Arm reicht bis unter das Knie und fegt im Angriff nach vorn. Neues Muster (7 × 2, 15, 4 × 3, Block 10), Schwachstelle wechselt von Feuer (Reisig brennt) zu Eisen.
- **Randlicht:** Erdschein-Blau (`#5a7690`/`#c4d8ec`), das Licht, das die Nachtseite des Mondes von der Erde bekommt. Die Szene der Rückseite ist grau und bleichgelb; das kalte Blau kommt dort nicht vor. Inneres Licht: die Laterne (bleiches Gelb im Messingrahmen) und die Augen.
- **Animation:** Leerlauf: Er wippt unter der Last, die Laterne schwingt. Angriff (Phase 1): Er stemmt das Bündel zurück und hoch (Ausholen über zwei Bilder), dann schlägt er es über sich nach vorn. Phase 2: Der lange Arm holt nach hinten aus und fegt nach vorn. Tod: Er sackt zusammen, das Bündel kippt.
- **Kampf (84 Leben):** 11, 4 × 3, Block 9, 15; je Zug 2 „Reisig“ in dein Deck. Stimme `hirte` (hohle Holzflöte, ein Wanderer). Beute: Mondstaub im Fläschchen (vorhanden).
- **Proben (Silhouette):** aufrecht mit dem Bündel auf der Schulter (das Bündel las sich als Gewehr oder Sense); das Bündel als runder Sack (Lumpensammler, nah am Seepockenmann). Gegen alle Sprites geprüft: kein Gebückter mit Strahlenkranz; Hirte und Astronom stehen aufrecht.
- **Abstimmung** (`biom-test mond 20`, gleiche Seeds): Rückseite 16/19 Akte, im Wächterkampf Ø 13 Schaden, 6,3 Züge; Mann im Mond 15/20, Ø 7 Schaden, 3,5 Züge.
- **Szene je Phase:** Die Szene der Rückseite öffnet beim Phasenwechsel weitere Krater-Augen (Kern-Wunsch „Szene je Phase“). Das gilt auch für den Mann im Mond und passt: Wenn er die Last abwirft, sehen ihn mehr an.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Der Mann im Mond (`mondmann`, `mondmann_p2`) | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Gebückter Mann unter einem Strahlenbündel mit Laterne ist schwarz gefüllt eigen und liest sich als Figur aus dem Kalender; das Blau trennt ihn im Spiel klar vom bleichen Hof. Das untere Ende des Bündels verschmilzt zu einem Keil, der an einen Umhang erinnert; die Hände an den Sprossen sieht man erst bei ×2. Phase 2 ist ein klarer neuer Umriss (Riese mit langem Arm), der Mantel ist dort aber schlicht. |
