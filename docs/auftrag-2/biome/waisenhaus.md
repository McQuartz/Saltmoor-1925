# Das Waisenhaus am Deich (`waisenhaus`) · Akt II

Biom-Paket der Zugabe nach [paket-format.md](../paket-format.md) (Auftrag 2, [03-meilensteine.md](../03-meilensteine.md) Abschnitt „Zugabe“). Bilder: [bilder/Zugabe/waisenhaus/](../bilder/Zugabe/waisenhaus/).

| Teil | Datei |
|---|---|
| Daten | `prototype/data/biome/waisenhaus.json` |
| Hintergrund | `prototype/js/scenes/world/waisenhaus.js` |
| Zonenpalette | `tools/sprites/zonen/waisenhaus.json` |
| Gegner | `tools/sprites/gegner/nachtschwester.js`, `turnlehrer.js`, `zugedeckte.js`, `zwillinge.js`, `heimleiterin.js` |
| Item-Icons | `tools/icons/items/trillerpfeife.js`, `schluesselbund.js`, `nachthemd.js`, `aufnahmebuch.js` |
| Ereignisbilder | `tools/ereignisse/bilder/waisenhaus.js` |

## Der Ort

Hinter Saltmoor, oben auf dem Deich, steht das Waisenhaus von 1890: zwei Stockwerke Backstein, innen gekalkt, unten Ölfarbe bis zur Hüfte, auf den Böden Linoleum in Ocker. Seit der Sturmflut von 1913 ist es „voll belegt“. Es ist Nacht nach dem Zapfenstreich, draußen Sturm, Regen an den hohen Fenstern. Die Kinder sind still. Sie sind sehr viele.

- **Wahrzeichen:** der Schlafsaal: vierzig Eisenbetten in zwei Reihen, gemacht, die Decken auf Kante, über jedem Bett ein Emailschild mit einer Nummer.
- **Falsches Detail:** Beim Appell antworten mehr Kinder, als Betten da sind, und alle haben nasses Haar. Im Bild: Die Nummernschilder an der Stirnwand gehen weiter, wo keine Betten mehr stehen, bis unter die Decke, und darunter stehen die, für die kein Bett da ist (mit `fremdheit` mehr). Auf jedem Kissen ein nasser Fleck in der Größe eines Kopfes. Nasse Fußspuren führen von der Tür zu den Betten, nicht von ihnen weg. Nie erklärt.
- **Palette:** kaltes Kalkweiß und Sturmgrau (Wände, Fensterlicht), Linoleum-Ocker (Boden, dunkel), Eisen fast schwarz. **Ein einziges rotes Licht:** das Nachtlicht in rotem Glas über der Tür zum Schlafsaal (in jeder Variante genau eins). Sprites: Körper Sturmgrau (`#060708 … #252a31`), **Randlicht warm, Rot-Ocker vom Nachtlicht** (`#9a4630` / `#f6b08a`): ein Ton, der im kalten, grauen Hintergrund nirgends vorkommt, damit die Gegner sich vom Mittelgrund lösen. Augen rot (`#ff3b2b`, Kern `#fff4ee`), dazu sparsam `kalk` (Leinen), `ocker` (Messing), `nass` (Wasserglanz). Der Hintergrund behält sein kaltes Randlicht; Betten, Sprossenwand, Seile, Nachthemden am Haken und Vordergrund sind dort gedämpft (dunkle Massen, schwache Kanten), die Fenster sitzen über der Gegner-Zone.
- **Abgrenzung im Akt:** Kapelle = Bernstein und grünes Wasserlicht, Kloster = Pergament und Silberhimmel, Grotte = Wachsgelb und Kerzenrot auf Schiefer, Glockengießerei = Rot und Schwarz mit Licht von unten. Das Waisenhaus ist der einzige **kalte, graue, trockene Innenraum** des Akts: gerade Linien, Wiederholung (Betten, Haken, Schilder, Fußpaare), hohe Fenster als Lichtquelle von der Seite, und statt vieler Lichter nur das eine rote. Keine Gewölbe, kein Wasser im Bild, nur Nässe.
- **Licht:** Das Gegenlicht von oben rechts sind die Fenster (Sturmlicht). Es fällt als helle Rechtecke auf das Linoleum und die linke Wand. Das rote Nachtlicht sitzt immer hinten oder seitlich, klein.
- **Krämer:** Der Hausmeister, im Heizungskeller zwischen Koks und einem Regal mit Fundsachen der Kinder, an jeder ein Zettel mit einer Nummer. Gewöhnlicher Krämer (Tausch, Leihe und Spiegel gibt es im Akt schon).

## Hintergrund: Kompositionen (480 × 270)

Feste Bedingungen wie bei allen Biomen: Gegner in x 60–420 auf drei Reihen, oben links und unten UI-frei, Nebel höchstens ein schmales Band (hier fast keiner, die Luft im Haus ist klar). Grundmotiv des Bioms: **Reihen gleicher Dinge**, und eins mehr, als es geben dürfte. Keine zwei Varianten mit derselben Grundform.

### Variante 0: Der Schlafsaal (Grundform: Tunnel mit Fluchtpunkt)
- Horizont y 128, Fluchtpunkt (252, 128). Ein Raum mit echter Perspektive (Wände, Decke, Stirnwand werden je Pixel als Strahl berechnet).
- Links und rechts je acht Eisenbetten, Kopfteil an der Wand, Fußteil zum Gang; graue Anstaltsdecken mit zwei hellen Streifen, Kissen hell mit nassem Fleck. Über jedem Bett das Nummernschild.
- Rechts hohe Sprossenfenster mit Sturmlicht und Regen (animiert); in den vorderen sieht man unten den Deich. Ihr Licht liegt als helle Rechtecke auf dem Linoleum im Gang und schräg auf der linken Wand.
- Hinten die Stirnwand: Tür, darüber das rote Nachtlicht, ringsum Nummernschilder in Reihen bis unter die Decke, ohne Betten. Davor stehen zwei bis sieben kleine Gestalten mit roten Augenpunkten (`fremdheit`).
- Boden: Linoleum mit Läufer im Gang, eine Spur nasser Fußabdrücke von der Tür zu einem der vorderen Betten.
- Vordergrund: links das Fußteil eines Betts angeschnitten, rechts ein Stuhl mit gefalteter Wäsche.

### Variante 1: Der Flur der Nummern (Grundform: frontale Wand, waagerechtes Band)
- Horizont y 150, die Wand frontal. Unten dunkle Ölfarbe, oben Kalk mit Stockflecken.
- Eine Hakenleiste quer durchs Bild, daran neun Nachthemden, über jedem ein Schild; ein Haken ist leer. Darunter auf dem Linoleum je ein Paar nasser Fußabdrücke, als stünde jemand darin.
- Darüber drei gerahmte Gruppenfotos; das dritte (1913) ist doppelt so breit, und es sind zu viele Köpfe darauf.
- Links eine offene Tür in einen dunklen Gang, darin das rote Nachtlicht; rechts ein hohes Fenster zum Deich, auf dessen Krone kleine Gestalten im Regen stehen (`fremdheit`: mehr). Unter dem Fenster ein Heizkörper, auf der Fensterbank Wasser.

### Variante 2: Der Turnsaal (Grundform: senkrechte Linien gegen eine Diagonale)
- Horizont y 152, Fluchtpunkt rechts (330, 152), der Saal läuft schräg nach hinten.
- Links die Sprossenwand, hoch und dicht; von der Decke hängen Seile und zwei Ringe; Oberlichter rechts oben; ein Pferd; hinten links die Tür der Umkleide mit dem roten Licht.
- Auf den Dielen sind mit Kreide Fußpaare in Reihen vorgezeichnet, für die Freiübungen; auf den meisten steht ein Paar nasser Abdrücke.

### Wächter-Szene: Die Halle (Grundform: Bogenfenster frontal hinter dem Wächter)
- Horizont y 164, frontal. **Direkt hinter der Heimleiterin ein Rundbogenfenster, so hoch wie die Halle, gefüllt mit ruhigem Sturmgrau:** die ruhige, kontrastierende Zone (gleichmäßig, wenig Struktur, eine Sprosse, ein Bogen hoch über dem Kopf), vor der sie als dunkle Gestalt steht. Unten im Fenster der Deich.
- Links ihr Pult mit dem roten Licht, rechts die Treppe zum Schlafsaal, an beiden Wänden Nummernschilder in Reihen. Auf dem Linoleum eine lange Reihe nasser Fußpaare quer durch die Halle (der Appell).
- **Übergang:** dieselbe Halle leer, das Pult fort; ein Bett ist beiseitegeschoben, darunter eine offene Luke mit Leiter, kaltes Licht von unten.

### Die anderen Arten
- **weg** und **wandbild:** Variante nach Seed (Relief in Kalkgrau). **rast:** Schlafsaal abgedunkelt, ohne Spuren und ohne die Wartenden, ein Nachttisch mit einer Kerze. **werkstatt:** Flur mit Werkbank. **kraemer:** Flur, davor das Regal mit Fundsachen und der Kanonenofen des Hausmeisters. **ereignis / fund:** Schlafsaal, im Gang ein Kissen mit nassem Fleck, darunter glimmt kurz etwas aus Messing. **uebergang:** siehe oben.

## Gegner

Arbeitsweise wie bei den Vorbildern: Silhouette zuerst als schwarze Fläche, je Gegner mindestens zwei Silhouetten verglichen (die verworfene steht als `proben` im Skript), gegen alle vorhandenen Sprites geprüft ([silhouetten-gegen-alle.png](../bilder/Zugabe/waisenhaus/silhouetten-gegen-alle.png), Waisenhaus rot), dann Licht, Randlicht, Fase, Dither, dann Pixel nachgearbeitet. Weg A (`"quelle": "skript"`), kein Bild-Generator in der Sitzung.

**Zur Rückmeldung „große dunkle Flächen ohne Binnenform“ und „Wächter geht vor dem Hintergrund unter“:** Jede Figur hat innere Randlicht-Stufen an überlappenden Teilen (`innenKanten`), Falten mit Lichtkante, mindestens ein helles Material als Gliederung (Haube und Kragen der Schwester, Ringelhemd des Turnlehrers, Streifen und Nummer der Decke, Nachthemden der Zwillinge, Seiten des Buchs) und ein inneres Licht neben den Augen (Pfeife, rote Tinte, Tropfen). Die Wächter-Szene hat direkt hinter dem Wächter die helle, ruhige Fensterfläche.

### Die Nachtschwester (`nachtschwester`)
- **Motiv:** Zählen, bis es nicht mehr aufgeht.
- **Wer sie war:** eine Diakonisse, seit 1913 im Haus; sie macht jede Nacht die Runde.
- **Was falsch ist:** ihr Schlüsselbund: ein Eisenring so groß wie ein Fassreifen, ein Schlüssel für jedes Bett. Jede Nacht ist einer mehr daran (der neue ist blank), und alle tropfen.
- **Silhouette:** eine schmale, steife Frau im langen Kleid mit Haube, die einen Ring so groß wie ihr halber Körper vor sich hält, mit Schlüsseln wie Zähnen.
- **Varianten:** a Ring in der ausgestreckten Hand wie eine Laterne; b Ring an einer Kette vom Gürtel, schleift am Boden, ein einzelner Schlüssel in der erhobenen Hand.
- **Probe:** der Ring klein am Gürtel; schwarz eine beliebige Frau im langen Kleid (Hirte, Opfernde, Kontrolleurin). Erst der übergroße Ring mit dem Loch in der Mitte macht sie eindeutig.
- **Animation:** Leerlauf: Atem, einzelne Schlüssel pendeln, es tropft. Angriff: Sie reißt den Ring hinter die Schulter und schlägt ihn nach vorn unten. Tod: Sie sinkt, der Ring rollt fort.
- **Kniff:** `teurer 1`: Sie schließt ab. Was du willst, kostet einen Schlüssel mehr. Fordert knappe Energiepläne heraus (im Akt bisher nicht vertreten).
- **Muster:** Schlag mit dem Ring (8), Abschließen (Block 6), Klirren (2 × 4). Leben 25.
- **Schwachstelle Glaube:** Sie hat die Tracht abgelegt, nicht den Eid; ein Gebet hält sie an, mitten im Zählen.
- **Stimme:** `kultist`.

### Der Turnlehrer (`turnlehrer`)
- **Motiv:** Haltung, die nicht mehr aufhört.
- **Wer er war:** der Turnlehrer, der den Kindern im Herbst 1913 auf dem Deich die Waage beigebracht hat, bei Wind.
- **Was falsch ist:** Er hält die Waage noch, auf einem Bein, das zu lang ist für einen Menschen. Er atmet nicht. Die Trillerpfeife hängt an der Schnur senkrecht unter seiner Brust, und aus ihr tropft Wasser; unter dem Standfuß eine Pfütze.
- **Silhouette:** ein waagerechter Mann auf einem einzigen langen, geraden Bein, ein „T“ auf einem Stiel, die Arme wie Schwingen zurück.
- **Varianten:** a Schwalbe, beide Arme zurück; b eine Turnkeule in der vorgestreckten Hand, das freie Bein höher.
- **Probe:** aufrecht mit Pfeife und Keule; schwarz ein Mann wie Holzfäller, Lotse, Vermesser. Die Waage auf dem Stelzbein gibt es sonst nicht.
- **Animation:** Leerlauf: ein kaum merkliches Kippen, es tropft. Angriff: Er kippt nach hinten (Bein runter, Kopf hoch), dann schlägt der ganze Leib wie ein Hammer nach vorn unten, das Bein fliegt hoch. Tod: Das Standbein knickt, er fällt waagerecht.
- **Kniff:** `heiler 5`: Er pfeift, und wer liegt, steht wieder auf und stellt sich an. Fordert Zielwahl (ihn zuerst) heraus.
- **Muster:** Schlag (9), Antreten (Stärke +2), Zwei Pfiffe (2 × 4). Leben 27.
- **Schwachstelle Blut:** Wer blutet, muss aus der Reihe treten. Das hält er nicht aus.
- **Stimme:** `salzlaeufer`.

### Das Zugedeckte (`zugedeckte`)
- **Motiv:** Die Decke geht mit.
- **Wer es war:** ein Kind, Bett unbekannt.
- **Was falsch ist:** Die Anstaltsdecke um seine Schultern ist viel zu lang; sie schleppt hinter ihm über das Linoleum, und unter der Schleppe liegen noch welche: Buckel unter der Wolle, am Saum schauen ihre Hände heraus (b: ein Gesicht).
- **Silhouette:** ein kleines Kind mit großem Kopf, hinter dem eine lange, buckelige Schleppe auf dem Boden liegt.
- **Varianten:** a zwei Buckel, drei Hände, das Haar nass und angeklebt; b die Decke als Kapuze über den Kopf, drei Buckel, unter dem vordersten ein Gesicht.
- **Proben:** 1) das Kind kriecht ganz unter der Decke, vorn schaut der Kopf heraus: schwarz ein Felsbrocken, vom Kind blieb nichts; 2) das Kind steht, die Decke über dem Kopf bis zum Boden: das Bettlaken-Gespenst (Klischee) und zu nah am Chorknaben.
- **Animation:** Leerlauf: Kopf atmet, der hinterste Buckel hebt sich. Angriff: Es lehnt sich zurück, die Buckel heben sich, dann schlägt es die Decke vorn auf und springt; die Hände greifen nach vorn. Tod: Die Decke fällt flach.
- **Kniff:** `rein`: Unter der Decke ist alles nass, seit 1913; was du hineinstreust, wäscht sich aus. Fordert Brackwasser (Gift) heraus.
- **Muster:** Viele Hände (3 × 3), Zudecken (Block 7), Satz (6). Leben 25.
- **Schwachstelle Salz:** Eine Decke, die einmal im Salzwasser lag, wird mit noch mehr Salz steif wie ein Brett und fällt ab.
- **Stimme:** `chorknabe`.

### Die Zwillinge (`zwillinge`)
- **Motiv:** Einer zu viel, oder einer zu wenig.
- **Wer sie waren:** zwei Mädchen, 1913 zusammen ins Haus gekommen, Bett 17 und Bett 18.
- **Was falsch ist:** Das Licht wirft nur einen Schatten. Er liegt lang über dem Linoleum und hat zwei Köpfe und zwei Hände; im Angriff greift er nach vorn. Unter der anderen ist der Boden leer und nass. Die ohne Schatten hat die helleren Augen.
- **Silhouette:** zwei gleich große Kinder Hand in Hand, ein langer flacher Schatten nach vorn links.
- **Varianten:** a offenes Haar, den Schatten wirft die vordere; b Zöpfe, den Schatten wirft die hintere, er läuft unter der vorderen hindurch.
- **Probe:** eng hintereinander, fast deckungsgleich; schwarz ein einzelnes Kind mit breitem Rock (zu nah am Schlafwagenkind). Erst Abstand und gefasste Hände zeigen zwei.
- **Animation:** Leerlauf: Sie atmen gegeneinander versetzt. Angriff: Die gefassten Hände gehen hoch, beide treten vor, der Schatten wird lang. Tod: Sie sinken, der Schatten bleibt zuletzt.
- **Kniff:** `dornen 3`: Was du der einen tust, tut die andere dir. Fordert Hagel (viele kleine Treffer) heraus.
- **Muster:** Zwei Hände (2 × 5), Gemeinsam (10), Aneinander (Block 6). Leben 28.
- **Schwachstelle Licht:** Licht zeigt, welche den Schatten hat.
- **Stimme:** `schatten`.

### Wächter: Die Heimleiterin (`heimleiterin`), 160 × 180
- **Motiv:** Der Appell.
- **Wer sie war:** die Heimleiterin seit 1890; sie hat jedes Kind ins Aufnahmebuch eingetragen.
- **Was falsch ist:** Hinter ihr stehen die Kinder in einer Reihe, nach hinten kleiner, mehr, als Platz ist, alle mit nassem Haar und roten Augenpunkten. Wenn sie eine Nummer aufruft, antwortet jemand, der nicht auf der Liste steht.
- **Silhouette:** eine hohe, schmale Frau mit Knoten, Keulenärmeln und glockigem Rock, die ein aufgeschlagenes Buch auf dem Unterarm vor sich hält, daneben eine Reihe kleiner Gestalten.
- **Probe:** am Pult sitzend mit dem Buch: zu nah am Abschreiber (Kloster) und ohne die Reihe nur eine Frau am Tisch.
- **Animation:** Leerlauf: Der Kopf atmet, die Feder hebt sich. Angriff: Sie hebt das Buch hoch, dann schlägt sie es zu und tritt vor; die Reihe rückt nach. Tod: Sie sinkt, die Reihe zerfällt mit ihr.
- **Kniff:** `ruf` mit Liste `[zwillinge, zugedeckte]` alle 3 Züge: Sie ruft eine Nummer auf, und es antwortet jemand, der nicht auf der Liste steht.
- **Besonders:** Musterschritt **Nachtruhe** mit `unverw` („Alle schlafen, und wer schläft, dem tut man nichts“: in diesem Zug unverwundbar, Stärke +2), dazu Zusatz-Kniff `kniffe: abschrift 1` mit der Karte „Nummer 41“: Sie schreibt dich ins Buch.
- **Muster:** Aufrufen (10), Abzählen (4 × 3), Nachtruhe (unverwundbar, Stärke +2), Eintragen (16), Buch zu (Block 10). Leben 80.
- **Schwachstelle Feuer:** Das Aufnahmebuch ist das Einzige im Haus, das nie nass geworden ist.
- **Stimme:** `glockenmutter`.
- **Beute:** Reliquie *Das Aufnahmebuch* (`aufnahmebuch`).

## Items

| ID | Name | Rar | Kerben | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|---|
| `trillerpfeife` | Trillerpfeife (E) | gewöhnlich | 1 | – | Anpfiff (1: 4 Schaden, Stärke 1) | Messing, an einer grauen Schnur. In der Kugel klappert etwas, das keine Erbse ist. Wenn du hineinpfeifst, kommt Wasser heraus, und hinter dir stellt sich jemand an. |
| `schluesselbund` | Schlüsselbund der Nachtschwester (E G) | selten | 2 | `behalten_eine` | Abschließen (0: Block 4, behalten) | Ein Eisenring wie ein Fassreifen, ein Schlüssel für jedes Bett. Du hast nachgezählt. Es war einer mehr als beim letzten Mal. |
| `nachthemd` | Nachthemd Nr. 41 (W) | selten | 2 | `start_block 6` | Unter die Decke (1: Block 7) | Grobes Leinen, am Kragen die Nummer in rotem Garn. Es ist nass und wird nicht trocken. Es hält trotzdem warm, als läge jemand neben dir. |
| `aufnahmebuch` | Das Aufnahmebuch (G) | reliquie | 2 | `ballast_werfen` mit `energy +1`, `ballast_start 2`, Karte „Ein Name“ | Aufrufen (1: 6 Schaden, mischt 1 „Ein Name“ in den Ziehstapel) | Jeder, der seit 1890 ins Haus kam, mit Datum und Nummer. Nach 1913 werden die Einträge enger, dann gehen sie über den Rand. Die letzte Zeile ist frisch, in roter Tinte. |

Das Aufnahmebuch eröffnet einen neuen Ballast-Weg: unspielbare Karten als **Energie** (bisher Schaden, Block, Ziehen, Stärke). Es nutzt nur vorhandene Bausteine (`ballast_werfen` führt `runFx` aus, `energy` ist ein vorhandener fx-op) und macht auch die Störkarten der Gegner (Abdruck, Abschrift, Nummer 41) zu Treibstoff.

Fundpool: Trillerpfeife, Schlüsselbund, Nachthemd plus Spieluhr, Schwarze Kerze, Bibel, Rosenkranz, Laterne, Laudanum, Riechsalz. Beute: Nachtschwester → Schlüsselbund, Turnlehrer → Trillerpfeife, Zugedecktes → Nachthemd, Heimleiterin → Aufnahmebuch.

## Ereignisse

| ID | Titel | Kern | Bezug auf Früheres |
|---|---|---|---|
| `waisenhaus_schlafsaal` | Vierzig Betten | Die Nummern an der Stirnwand gehen weiter, wo keine Betten stehen; auf jedem Kissen ein feuchter Fleck. | – |
| `waisenhaus_reihe` | Die Reihe | Appell im Flur: Bei vierzig hört die Schwester auf, die Reihe ist länger, am Ende ist ein Platz frei. | `event_gesehen: nachtzug_netz` (das Kind aus dem Gepäcknetz steht in der Reihe) |
| `waisenhaus_waesche` | Die Wäschekammer | Nachthemden in Fächern, seit 1913 nass. „Nicht auswringen.“ | – |
| `waisenhaus_deich` | Das Fenster zum Deich | Auf der Deichkrone stehen Kinder im Regen und warten, dass ein Bett frei wird. | `event_gesehen: hafen_lichtkegel` |
| `waisenhaus_turnsaal` | Der Turnsaal | Vorgezeichnete Fußpaare, auf jedem ein Paar nasser Füße, darüber nichts. | `job: veteran` |
| `waisenhaus_nachtlicht` | Das Nachtlicht | Das rote Licht über der Tür; wer darunter durchgeht, wirft einen Schatten, der nicht ganz seiner ist. | `item: ewiges_licht` |

Alle sechs haben ein Bild (160 × 90): [kontakt-zugabe2-waisenhaus.png](../bilder/Zugabe/ereignisse/kontakt-zugabe2-waisenhaus.png).

## Musik

f-Moll, Grundton 53 (Kapelle 52 e-Moll, Kloster 55 g-Moll, Grotte 47 h-Moll, Glockengießerei 45 a-Moll). Ort: Schlafsaal bei Sturm; `amb` Wind und ein wenig Meer (der Deich), Rhythmus `atem` (Schlafende im Takt), Einzelklänge aus `hafen`.

## Vorschläge an den Kern

- **Ruf ohne Muster-Ansage:** `ruf` holt Verstärkung, wenn `turns % alle === 2`; die Absicht zeigt es nicht an. Ein Absichts-Symbol „ruft“ im Zug davor würde den Appell lesbar machen.
- **Unverwundbar sichtbar machen:** Bei `unverw` wäre ein Bild- oder Klangzeichen am Sprite schön (z. B. die Szene dunkelt ab, „alle schlafen“); heute steht es nur in der Absicht.
- **Bild der Störkarte:** wie bei der Gießerei: `stoerKarte` nimmt immer das Bild `bone`. Ein `kniff.spr` wäre billig (hier ein Nummernschild).
- **Szenenlicht auf Sprites:** `K.licht` meldet die Fensterflecken auf dem Boden; schön wäre, wenn Gegner, die in einem Lichtfleck stehen, eine Stufe heller gezeichnet würden.

## Prüfung

- `node tools/sprites/pruefen.js nachtschwester_a nachtschwester_b turnlehrer_a turnlehrer_b zugedeckte_a zugedeckte_b zwillinge_a zwillinge_b heimleiterin`: 9 Sprites, **0 Verstöße**.
- `node tools/icons/bauen.js trillerpfeife schluesselbund nachthemd aufnahmebuch`, `node tools/icons/pruefen.js`: **0 Verstöße**.
- Kontakt- und Silhouetten-Bogen neben Chorknabe, Hirte, Netzflickerin: [waisenhaus-bogen.png](../bilder/Zugabe/waisenhaus/waisenhaus-bogen.png). Silhouetten gegen alle vorhandenen Sprites (Waisenhaus rot): [silhouetten-gegen-alle.png](../bilder/Zugabe/waisenhaus/silhouetten-gegen-alle.png). Alle Animationen der a-Varianten und des Wächters: [animationen.png](../bilder/Zugabe/waisenhaus/animationen.png).
- Hintergrund: [hintergrund-varianten.png](../bilder/Zugabe/waisenhaus/hintergrund-varianten.png) (V0, V1, V2, Wächter, mit den echten Sprites, ×2), [hintergrund-arten.png](../bilder/Zugabe/waisenhaus/hintergrund-arten.png) (weg, rast, werkstatt, kraemer, ereignis, fund, wandbild, uebergang), [hintergrund-fremdheit.png](../bilder/Zugabe/waisenhaus/hintergrund-fremdheit.png) (fremdheit 0 und 1). Aufbau je Szene 50 bis 330 ms.
- Im Spiel (`newRun('fischer',3,{dev:true,route:['hafen','waisenhaus','salz','eis','pforte']})`, `Dev.springe('kampf_schwer',1)` bzw. `('waechter',1)`, für das gemischte Bild die Gegner per `mkEnemy` gesetzt): [im-spiel-kampf.png](../bilder/Zugabe/waisenhaus/im-spiel-kampf.png) (Flur), [im-spiel-kampf-2.png](../bilder/Zugabe/waisenhaus/im-spiel-kampf-2.png) (zwei Turnlehrer), [im-spiel-kampf-alle-vier.png](../bilder/Zugabe/waisenhaus/im-spiel-kampf-alle-vier.png) (Schlafsaal), [im-spiel-waechter.png](../bilder/Zugabe/waisenhaus/im-spiel-waechter.png). Keine Konsolenfehler.
- `node tools/biom-test.js waisenhaus 20`: erste Werte 17/20 und 18/20 (87 %, zu leicht). Danach alle vier Gegner +2 bis +3 Leben, Schläge +1, Turnlehrer heilt 5, Zwillinge Dornen 3, Heimleiterin 80 Leben, Eintragen 16. Jetzt **15/20** und mit Startseed 21 **17/20**, zusammen **32/40 (80 %)**, 0 Fehler. Die Niederlagen kommen meist aus Kämpfen mit den Zwillingen (Dornen) zusammen mit Turnlehrer oder Nachtschwester; zweimal stand die Heimleiterin mit gerufenen Zwillingen am Ende.
- `node tools/test-ereignisse.js` und `node tools/test-run.js`: „Alles gut.“ (6 Ereignisse des Waisenhauses). `node tools/ereignisse-fotos.js`: 151 von 151 Ereignissen ohne Fehler.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Nachtschwester | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Der Ring mit dem Loch in der Mitte und den Schlüsseln wie Zähnen gibt es sonst nicht; Haube und Kragen in hellem Leinen, Schürze, Saumband und warme Innenkanten gliedern die Figur. Das Kleid bleibt rechts die größte dunkle Fläche. |
| Turnlehrer | 5 | 4 | 4 | 4 | 4 | 5 | **4** | Die stärkste Silhouette des Bioms: ein „T“ auf einem zu langen Bein, im Spiel sofort lesbar, der Angriff kippt den ganzen Leib wie einen Hammer. Das Ringelhemd ist im Spiel nur als feine Streifen zu sehen, das Gesicht klein; dass er Turnlehrer war, sagt vor allem die Pose. |
| Das Zugedeckte | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Erst im dritten Anlauf (Fels, Gespenst, dann Kind mit Schleppe): Jetzt liest sich ein Kind, hinter dem die Decke über Buckel schleift, mit Händen am Saum. In der hinteren Reihe ist es klein, die Hände sind dann nur noch helle Punkte. |
| Die Zwillinge | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Knapp. Zwei Kinder Hand in Hand mit einem einzigen langen Schatten; im Spiel liest sich der Schatten auf dem Ocker-Linoleum gut, auf dunklem Grund kaum. Nach zwei Überarbeitungen (größer, Gesicht frei, Haar nur hinten; warmes Randlicht, Saum und Knopfleiste) stehen sie nicht mehr grau auf grau vor den Betten; die Gesichter bleiben klein. |
| Heimleiterin (Wächter) | 5 | 5 | 4 | 5 | 5 | 5 | **4** | Im Spiel steht sie dunkel vor dem ruhigen, hellen Bogenfenster, die klarste Stelle des Bioms; die Reihe der Kinder daneben erzählt den Appell ohne Text. Pixel 4: Der Rock ist trotz Falten und breiter Lichtkante eine große Fläche, das Buch ist eher eine Schraffur als Schrift. |
| Hintergrund V0 Schlafsaal | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Zwei Reihen Betten mit Kissen und nassen Flecken, Fenster mit Regen, hinten die Nummern ohne Betten und die Wartenden: Wahrzeichen und falsches Detail ohne Text. Der Gang unten ist trotz Läufer und Spuren eine ruhige braune Fläche, das nächste Bett links wirkt flach. |
| Hintergrund V1 Flur | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Die stärkste Variante: Hakenleiste mit Nachthemden, Nummern, das zu breite Foto von 1913, Fenster zum Deich, das rote Licht in der Tür. Der Boden davor ist leer bis auf Spuren und Lichtfleck. |
| Hintergrund V2 Turnsaal | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Sprossenwand, Seile und Ringe, Oberlichter, vorgezeichnete Fußpaare mit nassen Abdrücken. Die rechte Hälfte ist ruhiger als nötig; die Kreidezeichen sind im Spiel nur als Punkte zu sehen. |
| Hintergrund Wächter (Halle) | 5 | 5 | 4 | 5 | 5 | 5 | **4** | Das Bogenfenster als ruhige, helle Zone direkt hinter der dunklen Gestalt, Nummern an beiden Wänden, Pult mit rotem Licht, Treppe. Der Boden ist groß und leer, die Reihe der Fußpaare darauf zu schwach. |
| **Hintergrund gesamt** | | | | | | | **4** | |
| Item-Icons | | | | | | | **4** | Pfeife mit Schnur und Tropfen, Ring mit Schlüsseln (einer aus Messing), gefaltetes Nachthemd mit roter Nummer und nasser unterer Hälfte, aufgeschlagenes Folio mit Messingecken. Die rote Tinte im Buch ist bei 32 px nicht zu sehen. |
| Ereignisbilder | | | | | | | **4** | Fenster zum Deich, Wäschekammer und Nachtlicht klar (je eine helle Stelle, viel Fläche); Schlafsaal und Turnsaal knapp (Betten und Kreide fein); die Reihe erst nach Überarbeitung (Kinder vorher als Haken lesbar, jetzt größer und breiter). |

**Nacharbeit nach Rückmeldung (Kampf-Foto 3,5, „grau auf grau“):** Randlicht der Figuren von kaltem Kalkweiß auf warmes Rot-Ocker umgestellt (kommt im Hintergrund nicht vor), Kleider innen weiter gegliedert (Saumband, Knopfleiste, Leinen statt Randlicht-Dither in Haube und Kragen); im Hintergrund Bettgestelle, Decken, Kissen, Sprossenwand, Seile, Pferd, Nachthemden am Haken, Heizkörper und alle Vordergrundteile gedämpft (dunkle Massen, schwache Kanten), Fenster im Schlafsaal und Turnsaal höher, Lichtflecken auf der linken Wand über die Gegner-Zone gelegt. Alle drei Kampf-Varianten mit allen vier Gegnern: [im-spiel-kampf-alle-vier.png](../bilder/Zugabe/waisenhaus/im-spiel-kampf-alle-vier.png) (Schlafsaal), [-v1](../bilder/Zugabe/waisenhaus/im-spiel-kampf-alle-vier-v1.png) (Flur), [-v2](../bilder/Zugabe/waisenhaus/im-spiel-kampf-alle-vier-v2.png) (Turnsaal). Im Spiel jetzt 4: Jeder Gegner hat eine warme Kontur, die vor dem grauen Saal sofort steht.

Nichts unter 4. Überarbeitet wurden unterwegs: Nachtschwester (Haube dunkel wie eine Kapuze → helles Leinen; Schürzenkante als durchgehende Naht → gedithert; Idle unruhig), Turnlehrer (Bein ragte aus dem Bild, Schnur unsichtbar), Zugedecktes (zweimal neu, siehe oben; Lichtfarben über 6 %, Idle unruhig), Zwillinge (Kapuzen-Mönche → Kinder; größer), Heimleiterin (Kinder als Block, Hals zu lang, Buch als Gitter, Idle unruhig), Hintergrund (Boden übermalte Betten, Wände fehlten unten, Raum zu breit und leer, Stirnwand zu fern, Kinder dort unsichtbar, Sprossenwand wie ein Zaun, Bogensprosse als Heiligenschein hinter dem Kopf der Heimleiterin).

## Offene Schwächen

- Die großen Kleider (Nachtschwester, Heimleiterin) bleiben die dunkelsten Flächen des Bioms; gegliedert, aber nicht reich.
- Die Böden aller Varianten sind ruhig; die Gegner stehen davor gut lesbar, aber unten bleibt viel Ocker.
- Musik nur über `Music.addBiome`; `tools/musik-pruefen.js` (Echtzeit) nicht durchlaufen.
