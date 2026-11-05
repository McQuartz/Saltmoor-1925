# Die Pforte, neu entworfen (Auftrag 2, M7)

Stand 2026-11-04. Ersetzt die alte Pforte aus Auftrag 1 (Linse aus Licht, Treppenringe; Mo: „zu sehr Science-Fiction“). Grundlage: [05-inhalte.md](../05-inhalte.md) Abschnitt 3 „Akt V“, [06-ki-bilder.md](../06-ki-bilder.md), Kompositionen des Hafens in [docs/auftrag/hintergruende-kompositionen.md](../../auftrag/hintergruende-kompositionen.md).

## Ort

**Der Hafen unten.** Nach dem Eis steigt man nicht in eine fremde Welt, sondern kommt dort an, wo man angefangen hat: am Kai von Saltmoor. Nur liegt er am Grund des Meeres, und alles ist seitenverkehrt. Die Speicher stehen rechts statt links, der Leuchtturm links statt rechts, das Licht kommt von links. Über den Dächern ist kein Himmel, sondern **die Unterseite der See**: eine helle, gewellte Fläche, an der die Boote von oben als dunkle Rümpfe hängen, mit Ankerketten, die herunterbaumeln und kurz über den Dächern enden.

**Das falsche Detail:**

- **Die Laternen brennen schwarz.** Eine dunkle Flamme mit hellem Rand (blasses Magenta), um sie herum kein Schein, sondern ein dunkler Hof: sie nehmen Licht weg. Der Leuchtturm wirft keinen Kegel, sondern einen schwarzen Strich, der über die Dächer streicht.
- **Das Wasser steht als Wand** am Ende des Kais: senkrecht, vom Pflaster bis an die Decke aus See. Die Wellen liegen waagerecht in ihr wie Schichten, Fische und ein Ruderboot stehen still darin.
- **Die Pforte** ist die Stelle, an der sich die Wand öffnet: ein hoher Spalt im Wasser, an dessen Rändern es nach oben (!) rinnt. Drinnen ist es dunkel, nur ganz klein und fern sieht man noch einmal einen Kai mit schwarzen Laternen. Kein Licht, kein Tor, keine Ringe.

**Palette:** wie bisher Grund (türkis) für Körper und Rand, Augen magenta `#ff6ad8`. Neu: Zusatzfarben im Hintergrund für die schwarzen Flammen (`#020404` Flamme, `#ff8ae0` / `#ffd8f4` Rand) und die Deckenhelle (`#2a5a54` … `#6ac0b0`). Nebel bleibt ein schmales Band vor der Wand (unter einem Drittel der Szene).

**Licht:** Von links oben, gespiegelt zum Hafen. Die Fläche der See über uns ist links hinten am hellsten. Im Finale kommt Gegenlicht zusätzlich aus dem Spalt hinter dem Boss; darum hat der Boss Randlicht an beiden Seiten.

## Szenen (was der Kern in Akt V aufruft)

Akt V hat die Ebenen `vorraum` (Rast oder Wandbild), `rast`, `finale`. Der Kern ruft dafür `uebergang` (Ankunft im Akt), `weg` (Wegwahl jeder Ebene), `rast`, `wandbild`, `waechter` (Finale) und danach `ankunft`/`ende` auf; dazu `kampf` V0 als Bild in der Biom-Wahl. Alle Szenen nutzen dieselben Bausteine in `prototype/js/scenes/world/pforte.js` (Speicher, Laterne mit schwarzer Flamme, Decke aus See, Wasserwand, Spalt).

| Art | Komposition |
|---|---|
| **kampf V0 „Der Kai unten“** (auch Biom-Wahl und `weg`) | Spiegelbild von Hafen V0. Horizont y 134, Fluchtpunkt (108, 134) links der Mitte. Speicherflucht rechts, die vorderen groß und angeschnitten, alle Fenster zugemauert bis auf eines, das **dunkel** leuchtet (schwarzes Fenster mit hellem Rahmen). Kai mit Kranschiene läuft nach links hinten auf die **Wasserwand**, die quer über das Kai-Ende steht; der Spalt klein in ihr. Links die See als Becken, darüber der Leuchtturm auf der Mole mit dem schwarzen Strich. Zwei schwarze Laternen an der Kaikante, Poller, Netzgestell links vorne. Decke: Unterseite der See mit drei hängenden Rümpfen und Ketten. Vordergrund: Dalben links angeschnitten, Kistenkante rechts. |
| **kampf V1 „Gasse unten“** | Spiegel der Lagerhaus-Gasse: zwei Wände, rechts höher; am Ende der Gasse statt Hafen die Wasserwand mit dem Spalt, die Netze hängen nach oben (sie „fallen“ zur Decke). |
| **kampf V2 „Steg unten“** | Spiegel des Bootsstegs: Planken laufen zum Fluchtpunkt rechts; dort steht die Wand. Ruderboote liegen nicht am Steg, sie hängen kieloben an der Decke darüber. |
| **weg** | V0 (bzw. Seed-Variante), wie im Hafen: Überblick. |
| **rast** | „Wo die Zeit stillsteht“: V2-Steg, Ferne abgedunkelt, vorne ein **schwarzes Feuer** (dunkle Flammen mit hellem Rand) in einem Steinkreis. Es wärmt trotzdem. |
| **wandbild** | V1-Gasse; die Wand rechts trägt das Relief. Das Relief selbst (`World.relief('pforte')`) ist neu: eine kleine Figur am Kai vor einer Wand aus Wasser, in der ein großes Auge offen steht – und die Figur trägt deine Laterne. („Die letzte Wand. Sie zeigt dich.“) |
| **uebergang** (Ankunft im Akt V) | Von oben: Eine Eisentreppe (die Leiter vom Eisloch) führt rechts herab auf den Kai. Man sieht den ganzen Hafen unten, noch ohne Spalt in der Wand. |
| **waechter (Finale)** | Nah am Kai-Ende, Untersicht. Die Wasserwand füllt die ganze Breite hinter dem Boss, mit Wellenschichten, zwei stehenden Fischen links, einem Ruderboot rechts oben in der Wand. Der **Spalt** steht mittig hinter dem Boss, hoch und schmal, seine Ränder mit Randlicht, Wasser rinnt an ihnen aufwärts (animiert). Links und rechts je eine schwarze Laterne auf der Kaikante, Poller mit Tau, das in die Wand führt. Oben die See-Decke mit einem Rumpf und seiner Kette, die bis knapp über die Krone des Königs hängt. Nebel nur als Band am Fuß der Wand. |
| **ankunft / ende** | Dieselbe Stelle ruhig: Der Spalt ist ganz offen, die Laternen brennen wieder **warm**. Kein Sog. |

## Das Finale: „Das, was ruft“ (neu gezeichnet)

Konzept unverändert: eine Öffnung, die Formen annimmt, um verstanden zu werden. Jede Phase ist ein schlechterer Versuch, wie etwas auszusehen, das du kennst. Sprites `ruft_p1`, `ruft_p2`, `ruft_p3`, je **240 × 220**, Zone `pforte`, idle 4 / angriff 4 / treffer 2 / tod 6.

| Phase | Was es ist | Silhouette in einem Satz | Falsches Detail | Angriff (Ausholen) |
|---|---|---|---|---|
| **P1 König** | Es nimmt die Gestalt des Hafenmeisters an, wie ein Kind sich einen König vorstellt. | Hohe Glocke aus Mantel mit Stehkragen, Zackenkrone, rechts ein langer **Bootshaken** als Zepter. | Unter der Krone ist kein Gesicht, nur ein senkrechter Spalt mit einem Auge darin. Die Lichter im Mantelsaum sind Bullaugen. | Hebt den Bootshaken über die Krone, schlägt ihn nach links unten. |
| **P2 Schlund** | Der König reißt auf: Der Mantel klappt wie zwei Türflügel nach außen. | Breites „M“: zwei gefaltete Mantelflügel nach außen, dazwischen ein hoher Schlund mit Zahnreihen, die Krone schief darüber, zwei Hände krallen in den Boden. | Die Zähne sind Poller und Planken; im Schlund hängt eine Laterne, die schwarz brennt. | Die Flügel ziehen zurück, der Schlund reißt weit auf und stößt nach vorn. |
| **P3 Auge** | Nichts mehr, nur noch das, was hinsieht. | Ein großes Auge zwischen zwei Lidern, um es ein Kranz aus Spitzen, darunter hängen Ketten und Fäden bis zum Boden. | Die Ketten sind Ankerketten; an einer hängt noch der Anker. Die Krone liegt am Boden. | Die Lider ziehen sich zurück, das Auge wird weit, die Spitzen richten sich nach vorn. |

**Augen im Rand** (`augen_a`, `augen_b`, 96 × 120, Kniff `schuetzer` 6: jede hängende Laterne gibt ihm Block, darum lohnt es, sie zuerst zu löschen): Was der Boss herbeiruft. Neu passend zum Hafen: **ein Auge in einer schwarzen Laterne** – die Laterne hängt an ihrer Kette von oben herab (aus der See-Decke), statt einer Flamme sitzt darin ein Auge. `augen_a`: Sturmlaterne mit Bügel; `augen_b`: kleine Positionslaterne, die Kette länger, zwei Fäden. Silhouette: hängendes Gehäuse an einem senkrechten Strich, klar anders als jeder Bodengegner.

## Silhouetten

Je Figur zwei Varianten als schwarze Fläche verglichen ([silhouetten.png](../bilder/M7/pforte/silhouetten.png), Skizzen in `tools/sprites/gegner/ruft.js` → `skizzen`):

- **P1:** mit Fächerkragen und Bootshaken (gewählt) gegen ohne Kragen und mit gerader Stange (verworfen: liest sich als gewöhnlicher König mit Speer, der Kragen macht den Kopf erst fremd).
- **P2:** Flügel offen, tiefes V mit schwebender Krone (gewählt) gegen Flügel zu (verworfen: eine schmale Säule, zu nah am König). Eine erste offene Fassung mit flacher Oberkante las sich als Katzenkopf; das V reicht jetzt bis zum Schlund hinunter.
- **P3:** Wimpernkranz oben lang, unten kurz (gewählt) gegen gleichmäßigen Strahlenkranz (verworfen: Sonne/Seeigel).
- **Augen:** hängende Laterne (gewählt) gegen bloße Kugel an der Kette (verworfen: zu klein, liest sich als Christbaumkugel).

## Werte und Abstimmung

Gemessen mit `node tools/biom-test.js pforte 20` (seit dem 2026-11-05 spielt das Werkzeug die Akte davor wirklich; frühere Zahlen sind nicht vergleichbar) und einer Kopie mit Zugzähler (40 + 40 Seeds) für die Kampflänge.

| Stand | `ruft` | biom-test 20 | Kampflänge Finale |
|---|---|---|---|
| vorher (altes Werkzeug, Startdeck) | hp 180, P1 buff 2 · 12 · 5×3 · Block 15 | 2/20 | – |
| vorher (neues Werkzeug) | wie oben | 13/16 (81 %) | 4–11 Züge, meist 6; Niederlagen schon in Zug 4 |
| **nachher** | hp 275 → **280**, P1 12 · Block 14 · 6×3 · buff 3; P2 (66 %) 9×2 · Block 12 · 17 · buff 4; P3 (33 %) 6×3 · 22 · Block 10 · 12×2; ruft Augen ab P2 alle 2 Züge | **12/16 (75 %)**; mit 61 Seeds 44/61 (72 %) | **Ø 10,3 Züge**, 69 % der Kämpfe in 8–12 Zügen; Niederlagen meist spät (Zug 8–15) |

Absicht: weniger Spitzen (der König schlägt nicht mehr in Zug 2 mit Stärke zu), dafür mehr Leben, damit alle drei Phasen wirklich zu sehen sind. Die Stärke wächst über die Phasen (+3, +4), das Finale wird also gegen Ende gefährlich, nicht am Anfang. Augen im Rand: `hp` 8, Muster Block 3 / Angriff 2 (+ Tiefenzuschlag), Kniff `schuetzer` 6.

Ganzer Run (`node tools/bot.js 100`): Niederlagen in der Pforte 7 von 63 (11 %); das Ziel „höchstens 35 % der Niederlagen“ ist erfüllt (vorher 2 von 66 mit dem alten Bot-Stand – die „über 40 %“ aus Mos Bericht ließen sich mit dem heutigen Bot nicht nachstellen).

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Punkte: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt. Bilder: [kontakt.png](../bilder/M7/pforte/kontakt.png), [animation.png](../bilder/M7/pforte/animation.png), [silhouetten.png](../bilder/M7/pforte/silhouetten.png), [nachher-finale-p1.png](../bilder/M7/pforte/nachher-finale-p1.png), [-p2](../bilder/M7/pforte/nachher-finale-p2.png), [-p3](../bilder/M7/pforte/nachher-finale-p3.png), [-p3-augen](../bilder/M7/pforte/nachher-finale-p3-augen.png), [nachher-szenen.png](../bilder/M7/pforte/nachher-szenen.png) gegen [vorher-szenen.png](../bilder/M7/pforte/vorher-szenen.png).

| Bild | S | L | P | K | B | Sp | Note | Begründung |
|---|---|---|---|---|---|---|---|---|
| `ruft_p1` König | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Krone, Fächerkragen, Bootshaken und Glocke sind schwarz sofort lesbar. Randlicht rechts voll, links gestrichelt (Spalt), Faltenbahnen und Pelerine mit Lichtkante, Bullaugen im Saum. Schwächer: Pelerine oben noch eine ruhige Fläche, die Bullaugen wirken klein fast wie Knöpfe; die Hakenspitze reicht im Spiel bis an den oberen Rand. |
| `ruft_p2` Schlund | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Tiefes V, schwebende Krone, Zahnreihen, vier Krallenarme: deutlich anders als P1 und P3. Faltenbahnen der Flügel sind noch etwas regelmäßig (Streifen), der Schlund innen ist klein gegen die Flügel; vor dem Dunst im Spalt steht er etwas weniger kontrastreich als P1. |
| `ruft_p3` Auge | 5 | 4 | 4 | 4 | 4 | 5 | **4** | Klarste Silhouette der drei (Auge, Kranz, Ankerketten, Anker). Iris mit Glutring ist der Blickfang. Der Ring wirkt etwas glatt/„grafisch“; die Krone am Boden liest sich klein eher als Gestrüpp. |
| `augen_a` / `augen_b` | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Hängende Laterne mit Auge statt Flamme, Glas mit gedithertem Schein und Glanzstrich, Tang darunter. Klein gegen den Boss; im Spiel stehen sie nah an den Kai-Laternen (x 0,14/0,86), lesbar, aber dicht. |
| Hintergrund Finale (`waechter`) | 4 | 4 | 4 | 5 | 4 | 4 | **4** | Wasserwand mit Schichten, Fischen, Boot; der Spalt als Spitzbogen rahmt den Boss, innen Dunst und noch einmal der Kai (Rekursion). Schwarze Laternen mit dunklem Hof links und rechts. Keine leere Fläche hinter dem Boss, Nebel nur als Band. Die Wellenschichten sind etwas gleichförmig. |
| `ankunft` / `ende` | 4 | 4 | 4 | 5 | 4 | – | **4** | Dieselbe Stelle, Spalt weiter, Laternen warm. Ruhig, ohne Sog. |
| Kampf V0 / `weg` / `uebergang` | 4 | 4 | 4 | 4 | 4 | – | **4** | Spiegel des Hafens: Speicher rechts, Leuchtturm links, Wand mit Spalt am Ende, Pfützen spiegeln die helle Decke, umgefallene Laterne brennt schwarz. Die Speicherfassaden sind (wie im Hafen) eher flach. |
| Kampf V1 (`wandbild`) | 4 | 4 | 4 | 4 | 4 | – | **4** (knapp) | Gasse mit Wand am Ende, Rumpf hängt kieloben hinein. Die Hauswände sind große dunkle Flächen; im Spiel liegt das Relief darüber. |
| Kampf V2 (`rast`) | 4 | 4 | 4 | 4 | 4 | – | **4** (knapp) | Steg zur Wand, Rümpfe über dem Steg, schwarzes Feuer mit hellem Rand. Das Feuer ist klein für die Fläche. |
| Wandbild-Relief | 4 | 4 | 4 | 5 | 4 | – | **4** | Figur mit Laterne vor der Wasserwand mit Auge; dasselbe Magenta in Laterne und Auge. |

## Vorschläge an den Kern

- **Relief je Biom:** `World.relief` kennt nur Stil-Parameter. Die Pforte hängt ihr eigenes Relief heute an, indem `pforte.js` `World.relief` umhüllt. Sauberer wäre ein Haken `World._biome.<id>.relief(seed)`, den `World.relief` zuerst fragt.
- **Boss-Reihe:** Bei 240 × 220 und Fußpunkt y 214 steht die Krone von P1 am oberen Bildrand. Ein eigener `reihen`-Eintrag für den Boss (etwa y 220) oder eine Skalierung 0,95 für `rang: boss` gäbe Luft.
- **Herbeigerufene Gegner im biom-test zählen:** Das Werkzeug zählt nur Gegner beim Kampfbeginn; die Augen tauchen in der Ausgabe nie auf.
- **Augen bei Tiefe:** Herbeigerufene normale Gegner bekommen den vollen Tiefenzuschlag (+10 Angriff in Akt V). Darum greifen die Augen nur jeden zweiten Zug an. Ein Feld „skaliert nicht“ je Gegner wäre einfacher.

## Offene Schwächen

- P2: Faltenbahnen der Flügel zu regelmäßig; der Schlund könnte größer sein.
- Speicherfassaden und Gassenwände sind flach (gleiches Bauteil wie im Hafen).
- Die Kai-Laternen der Finale-Szene stehen dort, wo die Augen erscheinen.
