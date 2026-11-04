# Das Kurhaus (`kurhaus`) · Akt I

Biom-Paket nach [paket-format.md](../paket-format.md). Steckbrief: [05-inhalte.md](../05-inhalte.md) Abschnitt 3. Bilder: [bilder/M6/kurhaus/](../bilder/M6/kurhaus/).

| Teil | Datei |
|---|---|
| Daten | `prototype/data/biome/kurhaus.json` |
| Hintergrund | `prototype/js/scenes/world/kurhaus.js` |
| Zonenpalette | `tools/sprites/zonen/kurhaus.json` |
| Gegner | `tools/sprites/gegner/genesender.js`, `badefrau.js`, `liegender.js`, `kurgast.js`, `oberschwester.js` |

## Der Ort

Ein Seebad-Sanatorium von 1900 auf der Klippe über Saltmoor: Wellenbad unter einer Glaskuppel, Liegehalle, Inhalatorium, Kurapotheke, unten am Strand die Badekarren. 1925 ist Nachsaison, aber niemand ist abgereist. Die Patienten werden jeden Tag gesünder, das steht auf jedem Krankenblatt, und sie atmen nicht mehr.

- **Wahrzeichen:** die Glaskuppel des Wellenbads, von innen beschlagen. Innen wölbt sie sich als Schale über das Bild, außen sitzt sie auf der Klippe.
- **Falsches Detail:** Die Kuppel ist von innen beschlagen, obwohl hier niemand mehr atmet. Das Wasser steht still wie Glas, im Becken wie im Meer, und spiegelt ohne eine einzige Welle. Wer darin treibt, rührt sich nicht. Nie erklärt.
- **Palette:** Weiß-Türkis gedämpft (Milchglas), Messing als einziger warmer Ton (Thermometer, Leitern, Brillenränder), kaltes Tageslicht von oben rechts. Die Körper bleiben dunkel in vier Stufen nahe Schwarz; das Helle liegt im Glas, im Wasser und im Randlicht. Augen sind milchig weiß (`#e6fff6`), wie beschlagenes Glas.
- **Zeitschicht 1925:** Menschen, die sich verändern. Alle Gegner sind Gäste oder Personal, jeder an genau einer Stelle falsch.
- **Licht:** Gegenlicht von hinten oben rechts ist hier das Milchglas der Kuppel (innen) oder der helle Nebelhimmel über dem Meer (außen).

## Hintergrund: Kompositionen

Grundform im Vergleich zu den anderen Orten: **die Schale**. Hafen ist Diagonale, Moor Senke, Kapelle kippende Symmetrie, Salz Untersicht, Stadt Fries, Eis Aufsicht. Das Kurhaus wölbt sich über den Betrachter: Kämpferkranz als U (hinten tief, an den Seiten hoch), Rippen laufen zu einem Scheitel außerhalb des Bildes. Die drei Varianten sind drei Stellen desselben Hauses, die Kuppel ist in jeder zu sehen.

### Variante 0: Das Wellenbad
- **Horizont** y 132, Fluchtpunkt (300, 132). Wir stehen auf dem gekachelten Umgang.
- **Aufbau:** Oben die Kuppel als Schale, rechts oben am hellsten (Licht), die Scheiben beschlagen (ruhiges Rauschen), Tropfspuren laufen das Glas hinab und enden in einer hellen Perle. Unter dem Kämpfer die Galerie mit Rundbogenfenstern aus Milchglas. Darunter das Becken bis zur Wand.
- **Falsches Detail:** Das Becken spiegelt Fenster und Galerie scharf, ohne eine Welle. Darin treiben Patienten auf dem Rücken in einer Reihe, das Gesicht nach oben, wie aufgereiht zur Visite. Vom Beckenrand führen nasse Fußspuren zu uns, keine zurück.
- **Details und warum:** Messingleiter am Beckenrand (hier steigt man ein), Gusseisensäulen der Kuppel links und rechts, ein Badethermometer an der Säule, eine Bank mit gefalteten Tüchern vorne links, ein leerer Korbrollstuhl am Rand, zum Wasser gedreht (wer darin saß, ist hineingegangen). Die nassen Kacheln spiegeln die Fenster als Lichtbahnen. Vordergrund: links eine Säule mit Rettungsring, rechts eine Säulenkante.
- **Maßstab:** Leiter, Rollstuhl, Bank gegen die Kuppel.
- **Luft:** Tropfen fallen aus der Kuppel; über dem Wasser bewegt sich nichts.

### Variante 1: Die Liegehalle
- **Horizont** y 138, frontal. Ganz anders als V0: eine Reihe statt einer Schale.
- **Aufbau:** Die Rückwand der offenen Halle läuft quer durchs Bild, davor neun Liegestühle in einer Reihe, darin eingepackte Patienten, deren blasse Gesichter alle zu uns sehen, obwohl hinter uns das Meer liegt, nach dem sie sehen sollten. Oben das Dach mit Sparren, Pfosten werfen lange Schatten nach links über die Dielen. Rechts endet die Halle: Brüstung, eine Decke zum Trocknen, dahinter Meer, Klippe und in der Ferne das Kurhaus mit seiner Kuppel.
- **Falsches Detail:** Ein Stuhl ist leer, aber die Decke liegt noch geschnürt in der Form eines Körpers, nur ohne Gesicht. Mit `fremdheit` wird ein zweiter leer.
- **Maßstab:** Stühle und Pfosten gegen das ferne Haus auf der Klippe.

### Variante 2: Am Strand unter der Klippe
- **Horizont** y 150, Fluchtpunkt links. Großer Himmel, rechts die Klippe, oben darauf das Kurhaus mit der Kuppel (Wahrzeichen außerhalb der UI-Ecke).
- **Aufbau:** Vier Badekarren stehen in einer Reihe im Meer, hinten kleiner, gestreiftes Segeltuch, Leitern ins Wasser, Türen offen und schwarz. Eine Holztreppe führt die Klippe hinab. Auf dem nassen Sand drei Strandkörbe in Seitenansicht, alle zum Meer gedreht.
- **Falsches Detail:** Das Meer ist so still wie das Becken; die Karren spiegeln sich ohne Welle, obwohl sie bis über die Achsen im tiefen Wasser stehen. Fußspuren kommen aus dem Wasser auf den Strand.
- **Bewusst vermieden:** Die Strandkörbe waren zuerst von hinten gezeichnet und sahen aus wie Grabsteine (Klischeeliste). Jetzt Seitenansicht mit überkragender Haube.

### Wächter-Szene: Unter der Laterne
- **Horizont** y 176, Untersicht. Die Kuppel füllt fast das ganze Bild, die Rippen laufen sichtbar zur Laterne im Scheitel (oben rechts der Mitte), deren Glas am hellsten ist und kalte Lichtbahnen nach unten wirft. Unten der Beckenrand mit Messing-Handläufen und Stufen ins Wasser, das die Kuppel spiegelt. Links ein Rollstuhl, rechts an der Säule ein Badethermometer so groß wie ein Mensch, die Skala leer.
- Die Laterne hatte zuerst zwei dunkle Bögen und sah aus wie ein Auge mit Brauen (Klischee „großes Auge“). Jetzt zehn gerade Speichen und ein Ring.

### Die anderen Arten
- **weg:** Variante nach Seed. **rast:** Liegehalle mit kleinem Feuer. **werkstatt:** Werkbank vorne in der Variante nach Seed. **kraemer:** Stand des Apothekers im Wellenbad. **ereignis / fund:** Strand mit einem offenen Arzneikästchen, darin ein Thermometer mit Messingkugel, das im Licht kurz aufblitzt. **wandbild:** Variante nach Seed, das Relief kommt aus `World.relief`. **uebergang:** Unter der Laterne, aber das Becken ist nah und die Stufen laufen unter dem Wasser weiter, schmaler und dunkler, bis in ein Schwarz, das tiefer ist als jedes Becken.
- Nebel nur als schmales Band hinter den Gegnern (unter einem Drittel der Szene).
- Aufbau einer Szene 40 bis 520 ms (Kuppel per Vorwärtsabbildung), einmal pro Knoten.

## Gegner

Arbeitsweise: Silhouette zuerst als schwarze Fläche, je Gegner mindestens zwei Varianten verglichen (die verworfenen stehen als `probe` in den Skripten und werden nicht gebaut), dann Licht, Randlicht, Fase, Dither, dann Pixel nachgearbeitet. Weg A (`"quelle": "skript"`), kein Bild-Generator in der Sitzung.

### Der Genesende (`genesender`)
- **Motiv:** Heilung als Verlust.
- **Wer er war:** ein Lungenkranker, der jahrelang in der Liegehalle lag.
- **Was falsch ist:** Er ist gesund, die Brust gewölbt wie ein Blasebalg, und er atmet nicht. Der Kopf liegt im Nacken, der Mund offen, und zwischen den Rippen brennt ein Licht, das man durch das Nachthemd sieht. In der Hand die blaue Taschenflasche der Lungenkranken.
- **Silhouette:** eine riesige runde Taubenbrust auf zwei Stelzenbeinen, darüber ein kleiner Kopf, der nach oben sieht.
- **Proben:** Arme seitlich gehoben (Atemgymnastik) las sich als Vogelscheuche; genommen: Arme hängend, die Brust trägt die Form.
- **Animation:** Leerlauf ohne Atem, nur das Licht in der Brust pulsiert. Angriff: Er holt Luft (Brust wächst zweimal), dann der erste Atemzug seit Jahren als Hauch aus Licht nach vorn, danach ist die Brust zum ersten Mal kleiner. Tod: Die Brust fällt zusammen.
- **Kniff:** `rein` (Gift wirkt nicht): was nicht atmet, fault nicht. Fordert Brackwasser.
- **Muster:** Stillstehen (Block 7), Einatmen (Stärke +3), Ausatmen (10).
- **Schwachstelle Salz:** Riechsalz zwingt zum Atmen, und der erste Atemzug zerreißt ihn.
- **Stimme:** `schatten` (Flüstern, Luft ohne Ton).

### Die Badefrau (`badefrau`)
- **Motiv:** Fürsorge, die ertränkt.
- **Wer sie war:** die Badefrau, die die Damen 1900 aus dem Badekarren ins Meer brachte und untertauchte.
- **Was falsch ist:** Ihre Arme stecken bis zu den Ellbogen in einer Pfütze vor ihren Füßen, die tiefer ist als der Boden. Das Kleid ist nass bis zur Brust. Wenn sie die Hände herauszieht, sind die Finger zu lang.
- **Silhouette:** eine gebeugte Frau in Glockenkleid und gekräuselter Haube, deren zwei Arme schräg in den Boden laufen.
- **Proben:** ein hochgehaltenes nasses Laken wurde ein Block; genommen: die Arme in der Pfütze. Danach Kragen und Schärpe entfernt, weil der Oberkörper wie eine Kiste wirkte.
- **Animation:** Leerlauf: Wellenringe um die Arme. Angriff: Schultern sinken, die Arme kommen tropfend aus dem Wasser, dann der Griff nach vorn. Tod: Sie sinkt in die Pfütze, was unter der Bodenlinie liegt, verschwindet.
- **Kniff:** `loeschen` (Brand weg am Zugende): Sie gießt Wasser aus einem Becken, das es nicht gibt. Fordert Glutnest.
- **Muster:** Eintauchen (2 × 4), Kleid (Block 6), Hinabziehen (8).
- **Schwachstelle Feuer:** Ihr Kleid ist seit 1900 nicht trocken geworden; Hitze treibt das Wasser aus ihr. Brand löscht sie, direkte Feuertreffer nicht.
- **Stimme:** `ertrunkener` (gurgelnd).

### Der Liegende (`liegender`)
- **Motiv:** Ruhe als Zustand.
- **Wer er war:** ein Gast der Liegekur, nach Vorschrift eingepackt und festgeschnürt.
- **Was falsch ist:** Das Deckenpaket ist zu lang für den Stuhl: am Fußende hängt es über die Kante bis zum Boden und liegt dort weiter. Im Mund steckt noch das Thermometer.
- **Silhouette:** ein Liegestuhl mit einem gegurteten Kokon, der am Fußende über die Kante fließt.
- **Proben:** ein Strandkorb mit Gestalt darin war nur ein Kasten; genommen: der Liegestuhl.
- **Animation:** Leerlauf: das Ende am Boden kriecht, die Augen blinzeln nacheinander. Angriff: Er steht nicht auf, er klappt aus der Hüfte hoch, beugt sich weit nach vorn, und das Ende am Boden peitscht. Tod: Das Paket fällt flach.
- **Kniff:** `schuetzer` (5 Block für Verbündete): Er zieht die Decke über die anderen. Fordert Zielwahl.
- **Muster:** Decke (Block 9), Klappen (2 × 5), Peitschen (6).
- **Schwachstelle Licht:** Die Lichtkur war seine Verordnung, er hat sie nie genommen.
- **Stimme:** `torfstecherin` (Summen mit geschlossenem Mund).

### Der Kurgast mit Taucherbrille (`kurgast`)
- **Motiv:** Warten, das zur Form wird.
- **Wer er war:** ein Herr im gestreiften Badeanzug, der seit fünfundzwanzig Jahren am Beckenrand steht und springen will.
- **Was falsch ist:** Alles an ihm ist ein Glied zu lang. Die Brille ist voll Wasser, die Augen schwimmen darin, jedes für sich, und wechseln in jedem Bild die Stelle.
- **Silhouette:** ein langer, dünner Mann auf Zehenspitzen, die Arme zum Startsprung flach nach vorn gefaltet, der Kopf dazwischen.
- **Proben:** geduckt am Beckenrand (las sich als Knien); dann Arme senkrecht über dem Kopf, aber die Erhörte aus der Grotte hat dieselbe Armgeste, und die Variante schräg nach oben wirkte wie eine Tanzgeste. Genommen: die flache Startpose, Kopf zwischen den Armen.
- **Animation:** Leerlauf: steht still, nur die Augen treiben in den Gläsern. Angriff: tiefe Hocke, Absprung, Kopfsprung auf dich, Rückkehr. Tod: Er sackt zusammen, die Brille wird leer.
- **Kniff:** `wechsel` (Wasser → Eisen → Licht): Das Wasser in der Brille fängt jeden Zug ein anderes Licht. Fordert Stoff-Vielfalt.
- **Muster:** Ansetzen (Stärke +3), Kopfsprung (10), Strampeln (3 × 4).
- **Schwachstelle Wasser (am Anfang):** das Wasser, auf das er wartet.
- **Stimme:** `augen` (kleine, hohe Glasklänge).

### Wächter: Die Oberschwester (`oberschwester`), 128 × 160
- **Motiv:** Die Kur, die nicht endet.
- **Wer sie war:** die Oberschwester des Hauses, die jede Visite selbst macht.
- **Was falsch ist:** Sie ist übergroß, die gestärkte Flügelhaube steht wie ein geblähtes Segel über ihr. Vor sich trägt sie eine Zinkwanne voll stillem Wasser, darin ruht ein Patient mit offenen Augen. Wenn sie die Wanne hebt und damit zuschlägt, bleibt das Wasser waagerecht.
- **Silhouette:** eine Sichel aus Leinen über einem schweren Habit, davor eine Wanne.
- **Proben:** ein einzelnes hohes Segel nach hinten oben las sich wie ein Horn und ragte aus dem Bild; genommen: die breite Flügelhaube mit hochgezogenen Spitzen.
- **Animation:** Leerlauf: die Haube bläht sich kaum merklich. Angriff: Wanne heben, über den Kopf, schräg nach vorn schlagen (das Wasser bleibt waagerecht), zurück. Tod: Sie verneigt sich, die Wanne sinkt auf den Boden.
- **Kniff:** `abschrift` mit `karte: "Ruhe"`: Sie verschreibt dir Ruhe, jeden Zug eine Karte ohne Wirkung. Fordert Kettenwerk.
- **Besonders:** `phasen` bei 50 %: härteres Muster, und alle 3 Züge steht ein Genesender aus der Liegehalle auf (`ruft`). Den Steckbrief-Punkt „löscht Brand“ trägt im Biom die Badefrau, weil je Gegner nur ein Kniff erlaubt ist; „heilt alle“ ist nicht umgesetzt (Rufen der Genesenden ersetzt es).
- **Muster:** Wanne heben (Block 12), Wanne schlagen (11), Visite (Stärke +3), Verordnung (3 × 5), Bettruhe (16). Phase 2: 2 × 7, Block 14, 18, Stärke +3.
- **Schwachstelle Blut:** Sie hat seit fünfundzwanzig Jahren kein Blut gesehen; ein Fleck auf der Schürze ist mehr, als sie erträgt.
- **Stimme:** `chor` (menschliches „a“, eine Oktave tiefer, gedoppelt: „Sagen Sie Aaa“).
- **Beute:** Reliquie *Das stille Wasser*.

## Items

| ID | Name | Rar | Kerben | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|---|
| `badethermometer` | Badethermometer (W) | gewöhnlich | 1 | – | Fieber messen (0: Block 2, ziehe 1, Verwundbar 1) | Die Säule fällt jeden Tag ein wenig. Seit März steht sie unter null, und die Schwestern tragen es so ein. |
| `waermflasche` | Wärmflasche (F W) | selten | 2 | `start_block 5` | An den Leib drücken (1: Block 6, Heilung 2) | Kupfer, mit Flanell bezogen. Sie ist noch warm, und niemand hat sie gefüllt. |
| `kurkarte` | Kurkarte (G) | selten | 2 | `heil_nach_sieg 4` | Abstempeln lassen (1: Block 5, Behalten) | Für jeden Kurtag ein Stempel. Die letzten Felder sind schon gestempelt, mit Daten, die noch kommen. |
| `inhalationsmaske` | Inhalationsmaske (S) | gewöhnlich | 1 | – | Salzdampf (1: 3 an alle, geschwächt) | Für den Soledampf am Morgen, zehn Minuten. Sie beschlägt nur, wenn ein anderer sie trägt. |
| `stilleswasser` | Das stille Wasser (W G) | Reliquie | 2 | `block_haelt_halb` | Stillhalten (1: Block 9, Behalten) | Ein Glas aus ihrer Wanne. Es schwappt nicht, auch wenn du rennst. |

Das stille Wasser ist die Wächter-Beute (`nodrop`, nicht im Fundpool) und definiert einen Bollwerk-Build. Fundpool: die vier eigenen plus Laudanum, Riechsalz, Gasmaske, Salzbeutel, Trauerschleier, Taucherhelm. Item-Sprites sind Platzhalter (`watch`, `bottle`, `tarot`, `gasmask`, `holywater`), Icons kommen in M5.

## Ereignisse

| ID | Titel | Kern | Bezug auf Früheres |
|---|---|---|---|
| `kurhaus_visite` | Die Visite | Dein Name steht auf der Tafel am leeren Stuhl. | – |
| `kurhaus_inhalatorium` | Das Inhalatorium | Zehn atmen ein, keiner aus; der Nebel schließt sich nicht hinter dir. (Schleifen, Inhalationsmaske) | – |
| `kurhaus_wellen` | Wellen um elf | Die Maschine läuft, das Wasser bleibt glatt, die Treibenden heben sich im Takt. (Kerbe) | – |
| `kurhaus_badekarren` | Der Badekarren (Stummfilm) | Nasse Schuhe in deiner Größe auf der Stufe. | – |
| `kurhaus_kurkonzert` | Das Kurkonzert | Die Hörner klingen ohne Atem. (Handgriff) | – |
| `kurhaus_gaestebuch` | Das Gästebuch | Dein Name, Ankunft Juli 1900, Abreise leer. | ja: Optionen nur mit `job: fischer`, `event_gesehen: kurhaus_visite`, `item: kurkarte` |

## Musik

a-Moll, Grundton 45 (Hafen 50, Moor 48, andere Akt-I-Pakete andere Tonarten). Ort: fernes Meer, wenig Wind, ein Schimmer; Rhythmus `atem` (ein Atem, der nicht dazugehört), Einzelklänge aus `salz` (Tropfen, knarrendes Holz).

## Prüfung

- `node tools/sprites/pruefen.js genesender_a genesender_b badefrau_a badefrau_b liegender_a liegender_b kurgast_a kurgast_b oberschwester`: 9 Sprites, **0 Verstöße**.
- Kontaktbogen neben Chorknabe, Hirte, Netzflickerin: [kontakt-neben-favoriten.png](../bilder/M6/kurhaus/kontakt-neben-favoriten.png). Silhouetten gegen alle 43 vorhandenen Gegner (Kurhaus schwarz, andere grau): [silhouetten-gegen-alle.png](../bilder/M6/kurhaus/silhouetten-gegen-alle.png). Alle Animationen: [animationen.png](../bilder/M6/kurhaus/animationen.png).
- Hintergrund: [hintergrund-varianten.png](../bilder/M6/kurhaus/hintergrund-varianten.png) (V0, V1, V2, Wächter), [hintergrund-arten.png](../bilder/M6/kurhaus/hintergrund-arten.png), [hintergrund-fremdheit.png](../bilder/M6/kurhaus/hintergrund-fremdheit.png) (fremdheit 1).
- Im Spiel: [im-spiel-kampf.png](../bilder/M6/kurhaus/im-spiel-kampf.png), [im-spiel-kampf-5.png](../bilder/M6/kurhaus/im-spiel-kampf-5.png), [im-spiel-kampf-11.png](../bilder/M6/kurhaus/im-spiel-kampf-11.png), [im-spiel-waechter.png](../bilder/M6/kurhaus/im-spiel-waechter.png). Keine Konsolenfehler aus dem Paket (zwei 404 auf optionale Kern-Dateien `assets/items/index.json`, `assets/handgriffe/index.json`).
- `node tools/biom-test.js kurhaus 10`: **8/10** überstanden, 0 Fehler (davor mit älterem Kernstand 9/10 und Seeds 11–20 9/10). Die ersten Werte waren zu weich (10/10, niedrigstes Leben 36 von 55); Leben und Schaden aller Gegner sind darum am oberen Rand der erlaubten Spannen, die Oberschwester hat 80 Leben. Niederlagen kommen aus normalen Kämpfen; die Oberschwester selbst kostet meist 10 bis 25 Leben.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Genesender | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Die Taubenbrust auf Stelzen gibt es sonst nirgends; das Licht zwischen den Rippen trägt das „atmet nicht“, die Rippenschlitze sind aber etwas gleichförmig. |
| Badefrau | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Die Arme, die in den Boden laufen, lesen sich sofort und sind eigen; die Haube von a wirkt eher wie ein Hut, die dünnen Unterarme leuchten wie Stäbe. |
| Liegender | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Stärkste Figur des Bioms (überlanger Kokon, Hochklappen aus der Hüfte); im Spiel flach und dunkel auf dunklem Boden, Randlicht oben rechts nur knapp über der Grenze. |
| Kurgast | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Die flache Startpose und die leuchtende Messingbrille machen ihn erkennbar; die Glieder sind sehr dünn und die schwimmenden Augen sieht man erst aus der Nähe. |
| Oberschwester | 5 | 4 | 4 | 5 | 4 | 5 | **4** | Haube als Segel und Wanne mit dem Ruhenden sind groß und klar, der Schlag mit waagerechtem Wasser ist das falsche Detail in Bewegung; der Habit ist eine große, ruhige Fläche mit wenig Form. |
| Hintergrund V0 Wellenbad | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Kuppel, stille Spiegelung, Treibende und Fußspuren erzählen den Ort ohne Text; der Kachelboden vorne ist noch ruhig. |
| Hintergrund V1 Liegehalle | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Eigener frontaler Aufbau mit der Reihe, die dich ansieht, und dem leeren Stuhl; die Gesichter sind auf Distanz nur helle Punkte. |
| Hintergrund V2 Strand | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Klippe, Kurhaus, Karren im stillen Wasser und Strandkörbe lesen sich; der Strand selbst ist die leerste Fläche des Bioms. |
| Hintergrund Wächter | 5 | 5 | 4 | 5 | 5 | 5 | **4** | Die Rippen zur Laterne sind die stärkste Komposition des Pakets; die Vorwärtsabbildung lässt an den Rippen einzelne Treppenstufen. |
| **Hintergrund gesamt** | | | | | | | **4** | |

Nichts unter 4. Überarbeitet wurden unterwegs: Badefrau (Kastenkörper, Kragen), Kurgast (Strichfigur, Armgeste doppelt mit der Erhörten), Oberschwester (Horn statt Haube), Wellenbad (Becken zu schmal, Lücken in der Kuppel, Fahne statt Handtuch), Badekarren und Strandkörbe (lasen sich als Grabsteine), Wächter-Laterne (las sich als Auge).

## Offene Schwächen

- Die Wächter-Größe ist 128 × 160, weil `pruefen.js` Wächter noch auf diese Größe begrenzt (der Auftrag erlaubt 160 × 180).
- „Heilt alle Gegner“ aus dem Steckbrief ist nicht umgesetzt (ein Kniff je Gegner); das Rufen von Genesenden in Phase 2 ersetzt es.
- Die Kuppel wird per Vorwärtsabbildung gerastert (bis etwa 0,5 s Aufbau je Szene, einmal pro Knoten).
- Item-Icons sind Platzhalter.
