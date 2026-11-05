# Der Wald, der nach unten wächst (`wald`) · Akt III

Biom-Paket nach [paket-format.md](../paket-format.md). Steckbrief: [05-inhalte.md](../05-inhalte.md) Abschnitt 3. Bilder: [bilder/M7/wald/](../bilder/M7/wald/).

| Teil | Datei |
|---|---|
| Daten | `prototype/data/biome/wald.json` |
| Hintergrund | `prototype/js/scenes/world/wald.js` |
| Zonenpalette | `tools/sprites/zonen/wald.json` |
| Gegner | `tools/sprites/gegner/holzfaeller.js`, `steinhirsch.js`, `harzfang.js`, `bernsteinlarve.js`, `wurzelstock.js` |

## Der Ort

Unter den Stollen öffnet sich eine Höhle, in der ein versteinerter Urwald hängt. Die Wurzeln verflechten sich an der Decke zu einem Gewölbe, die Stämme hängen herab, so dick wie Häuser, und die Kronen sind unten: Manche liegen flach auf dem Boden, andere schweben frei wie Leuchter, unter einer Kante hängen sie in eine Tiefe, in der der Wald weiter nach unten wächst. Eine Straße der Legion führt durch den Wald, über eine Hängebrücke und mitten durch den Fuß eines Stamms. Die Legion hat hier Holz geschlagen, das Stein ist: Kerben, Keile, gekappte Stümpfe, ein gefällter Stamm.

- **Wahrzeichen:** der Durchgangsbaum. Ein Stamm, breit wie ein Haus, hängt bis auf den Boden; die Straße führt durch einen römischen Bogen aus Keilsteinen in seinem Fuß. Dahinter schimmert Harzlicht.
- **Falsches Detail:** Die Jahresringe zählen rückwärts. Die Vermesser der Legion haben die Ringe numeriert: innen die höchste Zahl, nach außen VII, VI … I, und der äußerste Ring hat noch keine Zahl. Er ist heller, frischer, feucht (V1, Ereignis „Die Ringe“). Dasselbe auf dem Meilenstein (XII durchgestrichen, darunter XI) und auf den Stufen des Übergangs, die abwärts zählen. Nie erklärt.
- **Palette:** Steingrau (versteinertes Holz, Basalt der Straße) und Bernstein. Körper der Figuren in vier warmgrauen Stufen nahe Schwarz, Randlicht bernsteinbraun (`#8e6a36`) und blassgold (`#e6c48a`), Augen und Harz `#ffb436` mit Kern `#fff6dc`, dazu zwei Harzfarben.
- **Licht:** Es gibt kein Tageslicht. Licht kommt nur aus Harz: große Harztränen hängen in den Wurzeln, die größte oben rechts (daher das Gegenlicht von hinten oben rechts). Menschliches Licht ist nur die Öllampe am Meilenstein; sie erlischt mit `fremdheit`, dafür erscheinen mehr Harztränen.
- **Abgrenzung im Akt:** Salzstollen sind hell, weiß, Untersicht auf gewachsene Säulen. Die Namenlose Stadt ist rot, frontal, Relief. Der Wald ist dunkel, warmgrau und bernstein, und seine Grundform ist die **Umkehrung**: alles, was senkrecht ist, hängt.
- **Zeitschicht Rom und davor:** Die Legion ist durchgezogen (Straße, Bogen, Dolabra, Meilenstein, Brücke). Was älter ist (der Hain, der Hirsch, der Stock), ahmt nach: den Römer, das Licht, den Hirsch.

## Hintergrund: Kompositionen (480 × 270)

Feste Bedingungen wie in Auftrag 1: Gegner in x 60–420 auf drei Reihen, oben links und unten UI-frei, Nebel nur als schmales warmes Band hinter den Gegnern (Harzschein in der Luft, unter einem Drittel der Szene). Bausteine in `wald.js`: `decke` (Fels und Wurzelgeflecht), `stamm` (hängender Stamm, oben mit Wurzelanlauf, unten Krone oder Schnittfläche), `krone` (gespiegelter Baum: Hauptäste fächern nach unten, Laubballen aus Stein an den Enden; ohne die sichtbaren Äste las es sich als Wolke), `blattwerk`, `schnittUnten` / `schnittFront` (Ringe, Zahlen), `traene` (Harzträne, Lichtquelle, tropft), `strasse` (Basaltpolygone in Weltkoordinaten), `bogen`, `meilenstein`, `meiler`.

### Variante 0: Die Legionsstraße (Grundform: Portal)
- **Horizont** y 140, Fluchtpunkt (330, 140) im Bogen des Durchgangsbaums. Wir stehen auf der Straße.
- **Aufbau:** Die Basaltstraße läuft von vorn in den Bogen. Der Durchgangsbaum füllt die rechte Mitte bis an die Decke. Links ein Stamm, dessen Krone flach auf dem Boden liegt, darüber ein gekappter Stumpf, dessen Schnittfläche man von unten sieht (Ringe). Rechts hängt eine Krone frei wie ein Leuchter. Hinten eine Reihe hängender Stämme im Dunst, Kronen abwechselnd am Boden und in der Luft. Am Straßenrand der Meilenstein mit Öllampe.
- **Licht:** große Harzträne oben rechts, Lichtfächer nach links unten; kleinere Tränen am Stamm, Harz in den Rindenrissen.
- **Maßstab:** Meilenstein und Lampe gegen den Stamm, durch dessen Fuß die Straße passt.
- **Vordergrund:** Wurzelstrang oben links, ein paar Kronenzweige unten rechts (am Rand, damit sie keine Gegner verdecken).

### Variante 1: Der gefällte Stamm (Grundform: Diagonale)
- **Horizont** y 150, Fluchtpunkt rechts hinten. Ein gefällter Stamm liegt quer von links vorn nach rechts hinten. Links vorn seine Schnittfläche, so hoch wie die Gegner: Ringe, Trockenriss, harziges Mark, und die Zahlen VII bis I vom Mark zur Rinde; der äußerste Ring ist hell und ohne Zahl. Darüber hängt der Stumpf, von dem er stammt. Keile der Legion stecken in Kerben, eine Dolabra lehnt am Stamm. Hinten klein der Durchgangsbaum.
- **Maßstab:** Dolabra und Keile gegen den Stamm.

### Variante 2: Über der Tiefe (Grundform: Weite, Leere in der Mitte)
- **Horizont** y 118. Wir stehen auf einem Absatz aus liegendem Kronenlaub. Dahinter bricht der Boden ab: In der Tiefe hängen kleinere Bäume mit ihren Kronen, gegen einen Harzschein von unten (es geht weiter nach unten). Die Reihe großer hängender Stämme davor trägt ihre Kronen frei schwebend. Eine Hängebrücke der Legion führt von der Kante links zum Bogen des Durchgangsbaums rechts. Vorn die Straße, die zur Brücke biegt, ein Pflock mit Seil, Kronenschutt und Risse auf dem Absatz.
- **Maßstab:** Pflock und Brückengeländer gegen die Stämme.

### Wächter-Szene: Im Wurzelgewölbe (Grundform: Gewölbe in Untersicht)
- **Horizont** y 196. Die Decke kommt nah: Dicke Wurzeln laufen als Rippen zu einem Knoten in der Mitte oben (dort hängt der Wurzelstock, sein Sprite schließt an). Zwei gekappte Stümpfe zeigen ihre Ringe von unten, an den Seiten hängen Kronen fast bis zum Boden, Harztränen rechts und links. Der Boden ist Kronenschutt.
- **Übergang:** dieselbe Szene, im Boden öffnet sich der hohle Stamm, innen eine Wendeltreppe, deren Stufen numeriert sind und abwärts zählen (IX, VIII, …), unten Harzschein.

### Die anderen Arten
- **weg / wandbild:** Variante nach Seed bzw. V1 (das Relief kommt aus `World.relief` mit Stil `wald`). **rast:** V1 abgedunkelt, kleines Feuer. **werkstatt:** V1 mit Werkbank und einem kalten Meiler. **kraemer:** V0 mit dem glimmenden Meiler des Köhlers links und seinem Stand rechts. **ereignis / fund:** V2 mit der Fundkiste. **uebergang:** Wächter-Szene mit Treppe.
- Aufbau einer Szene 140–550 ms (einmal pro Knoten).

## Gegner

Arbeitsweise: Silhouette zuerst als schwarze Fläche, je Gegner zwei Proben (stehen als `proben` in den Skripten, werden nicht gebaut; Bild [silhouetten-proben.png](../bilder/M7/wald/silhouetten-proben.png), je Paar links genommen, rechts verworfen), dann Licht, Randlicht, Fase, Dither, dann Pixel nachgearbeitet. Weg A (`"quelle": "skript"`). Gegen die Rückmeldung zum Kloster (große dunkle Flächen) hat jede Figur Binnenform aus eigenen Teilen mit eigener Fase: Schienen des Panzers, Schulterbügel, Helmbusch, Blechplatten und Münzen im Köcher, Bernsteinringe, Maserung in Ringen um das Gesicht des Wurzelstocks, Risse mit Harz im Steinhirsch; dazu Lichtkanten innen und kleine Harzlichter.

### Der Holzfäller der Legion (`holzfaeller`)
- **Motiv:** Arbeit, die nie fertig wird.
- **Wer er war:** ein Legionär, abkommandiert zum Holzschlag, als die Straße durch den Wald gebaut wurde.
- **Was falsch ist:** Der Baum, den er seit neunzehnhundert Jahren fällt, ist sein linker Arm: ein Stammstück, waagerecht nach vorn, voller Axtkerben, am Ende Zweige statt Finger und eine Schnittfläche mit Ringen. Unter dem Helm ist kein Gesicht, sondern Holz mit Jahresringen, in denen zwei Harztropfen als Augen sitzen.
- **Silhouette:** ein Römer mit Helmbusch, die Dolabra hoch über der Schulter, der linke Arm als dicker Balken nach vorn.
- **Proben:** Axt in der eigenen Schulter, Arme als hängende Äste (las sich als gebückter Baum, der Helm verschwand); genommen: Axt hoch, Holzarm vorn.
- **Animation:** Leerlauf: Dolabra wippt kaum, der Holzarm sinkt ein Pixel. Angriff: weit zurück ausholen, über den Kopf, der Schlag geht vor dem Körper bis zum Boden durch (Späne), Rückfedern. Tod: Er sackt über den Holzarm zusammen.
- **Kniff:** `ansage` (2 Züge laden, dann 16): Er holt aus, wie er seit neunzehnhundert Jahren ausholt. Fordert Block-Planung. *Zuerst war es `brecher`; der zerbrach den Block vor allen anderen Angriffen des Zugs und machte jeden Kampf mit ihm tödlich (Biom-Test 1/10).*
- **Schwachstelle Glaube:** Er hat einem Kaiser geschworen, der ein Gott war. Ein anderer Gott löst den Eid.
- **Stimme:** `grabwaechter` (Horn aus Knochen, wie ein Signal der Legion).

### Der Steinhirsch (`steinhirsch`)
- **Motiv:** das Opfertier des Hains, das geblieben ist.
- **Wer er war:** der Hirsch, dem man vor Rom die Geweihe brachte.
- **Was falsch ist:** Sein Geweih wächst nach unten wie der ganze Wald: Die Krone ist die eines alten Hirsches, aber aus jeder Sprosse hängt ein Strang wie eine Luftwurzel bis auf den Boden und schlägt dort an. Im Stein stehen Risse voller Harz.
- **Silhouette:** ein Hirsch mit breiter Krone, unter der ein Vorhang aus Strängen bis zum Boden fällt.
- **Proben:** Kopf tief, Geweih sticht in den Boden (grasendes Tier mit Rechen, das falsche Detail verschwand); genommen: Kopf hoch, Vorhang.
- **Animation:** Leerlauf: einzelne Stränge wehen. Angriff: Kopf hoch, aufbäumen (Vorderbeine heben sich), mit dem Vorhang nach vorn schlagen. Tod: Die Knie knicken, er sinkt.
- **Kniff:** `dornen 3`: Wer zuschlägt, greift in den Vorhang. Fordert Hagel.
- **Schwachstelle Eisen:** Ein Meißel spaltet ihn längs der Schichten.
- **Stimme:** `hirte` (hohle Holzflöte).

### Der Harzfang (`harzfang`)
- **Motiv:** das Licht als Köder.
- **Wer er war:** nichts, das je Mensch war. Er ahmt die Harztränen nach, das einzige Licht im Wald.
- **Was falsch ist:** Der leuchtende Tropfen hat sechs (b: acht) Beine, die er wie die Streben einer Laterne um sich legt, und im Bernstein schwimmt ein Gesicht, gegen die Wand gedrückt (b: zwei).
- **Silhouette:** eine Laterne aus Beinen an einem langen Faden.
- **Proben:** am Boden sitzend mit gespreizten Beinen (gewöhnliche Riesenspinne, Klischee; das Hängen fehlte); genommen: hängend, Beine als Käfig.
- **Animation:** Leerlauf: Das Glimmen atmet, ein Bein zuckt. Angriff: am Faden hochziehen, Beine aufspreizen, fallen lassen und nach vorn greifen. Tod: Der Faden reißt, der Tropfen fällt und zerfällt.
- **Kniff:** `einfrieren`: Was er berührt, klebt. Eine Handkarte ist für den Zug nicht spielbar. Fordert ein Deck, das Ausweichkarten hat.
- **Schwachstelle Licht:** Neben echtem Licht sieht man, dass er keins ist.
- **Stimme:** `nest` (schnarrendes Zirpen auf Tonhöhe).

### Die Bernsteinlarve (`bernsteinlarve`)
- **Motiv:** Fremdes, das sich aus Menschenresten ein Haus baut.
- **Wer sie war:** eine Larve wie die der Köcherfliege, so groß wie ein Mann.
- **Was falsch ist:** Ihr Köcher ist aus dem gebaut, was von einer Kohorte übrig war: Helmschale, Schildbuckel, Blechstreifen der Panzer, Münzen, Fingerknochen (b), mit Harz verklebt. Sie trägt ihn schräg aufgerichtet wie einen Turm. Ihr eigener Leib ist Bernstein, durchscheinend, mit sechs Beinen.
- **Silhouette:** ein schräger Turm aus Blech, unten links kommt ein leuchtender Wurm mit Beinen heraus.
- **Proben:** Köcher flach liegend (Baumstamm mit Beinen, ähnlich dem Liegenden); genommen: schräg aufgerichtet.
- **Animation:** Leerlauf: Beine rudern, Kiefer. Angriff: Vorderleib hoch aus dem Köcher, nach vorn schnappen, zurück. Treffer: sie zieht sich in den Köcher. Tod: zieht sich ganz zurück, der Köcher kippt.
- **Kniff:** `rein`: Was fault, frisst sie. Fordert Brackwasser.
- **Schwachstelle Wasser:** Köcherfliegen leben im Wasser; diese hat es vergessen.
- **Stimme:** `salzlaeufer` (Klicken auf Tonhöhe, die Kiefer).

### Wächter: Der Wurzelstock (`wurzelstock`), 160 × 180, drei Sheets
- **Motiv:** das Älteste im Wald, das alles nach unten zieht.
- **Wer er war:** der erste Stock, aus dem der Wald gewachsen ist.
- **Was falsch ist:** In seiner Rinde ist ein Gesicht, und das Holz fließt in Ringen um seine Augen und den Mund wie um Astlöcher. Er hängt, er steht nicht: Er lässt Arme aus Ästen herunter, die baumeln, die Hände offen nach unten, und mit jeder Phase hängen mehr Arme (2, 4, 6).
- **Silhouette:** eine Wurzelkrone oben, ein hängender, unten spitzer Stock mit Gesicht, darunter baumelnde Arme, die den Boden nicht berühren.
- **Proben:** ein Stumpf auf Wurzelbeinen (gewöhnlicher Baumriese aus dem Märchenfilm, Klischee); genommen: hängend.
- **Animation:** Leerlauf: Arme pendeln gegeneinander, der Mund öffnet sich, Harz tropft. Angriff: Er zieht sich an den Wurzeln hoch, die Arme schwingen nach hinten, dann fegen alle Arme nach vorn. Tod: Die Arme hängen schlaff, der Stock zerfällt von oben.
- **Kniff:** `waechst 2`: „Mit jedem Zug lässt er einen Arm mehr herunter.“
- **Besonders:** `phasen` bei 66 % und 33 % mit eigenen Sprites (`wurzelstock_p2` mit 4 Armen, `wurzelstock_p3` mit 6 Armen, in Phase 3 kocht das Harz in Augen und Mund) und härterem Muster.
- **Steckbrief „Brand macht ihn wütend“:** Ein eigener Kniff dafür bräuchte neuen Kerncode. Umgesetzt über die Schwachstelle: Feuer trifft ihn hart und treibt ihn dadurch schneller in die nächste Phase, und jede Phase lässt mehr Arme herunter und schlägt härter. Wer ihn mit Feuer jagt, muss den Wechsel einplanen.
- **Muster:** 2 × 6, Block 12, 13, Stärke +2, 3 × 4. Phase 2: 3 × 5, Block 14, 16, Stärke +2. Phase 3: 3 × 6, 18, Stärke +3, 4 × 4.
- **Schwachstelle Feuer:** Stein, der einmal Holz war, brennt nicht, aber er erinnert sich daran.
- **Stimme:** `schlundtraeger` (Kehlgesang, sehr tief).
- **Beute:** Reliquie *Der Harzkern*.

## Items

| ID | Name | Rar | Kerben | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|---|
| `harzklumpen` | Harzklumpen (F) | gewöhnlich | 1 | – | Harz werfen (1: Brand 3, Geschwächt) | Er ist warm, als hätte ihn eben jemand in der Hand gehabt. In der Mitte ist ein Tropfen, der noch fließt. |
| `legionsaxt` | Dolabra der Legion (E) | selten | 2 | `verwundbar_start 1` | Fällen (2: 9 Schaden, Block zerbricht, Verwundbar 2) | Auf dem Stiel steht der Name eines Legionärs, elfmal, jedesmal in einer anderen Hand. |
| `bernstein_fliege` | Bernstein mit Fliege (L) | selten | 2 | `energie_bleibt 1` | Einschließen (1: Block 5, Behalten) | Die Fliege darin putzt sich die Flügel. Nur, wenn du nicht hinsiehst. |
| `koehlerhandschuh` | Köhlerhandschuh (F) | gewöhnlich | 1 | – (+2 Leben) | In die Glut greifen (1: Block 5, Brand 2) | Innen ist er kalt wie ein Keller. Der Köhler sagt, das sei die Hitze, die noch kommt. |
| `harzkern` | Der Harzkern (F) | Reliquie | 2 | `reaktion_heil 2` | Harz schlucken (1: 4 Leben, Block 4) | Er lag ihm auf der Zunge, all die Jahre. Er schmeckt nach einem Wald, der noch nicht gewachsen ist. |

Der Harzkern ist die Wächter-Beute (`nodrop`). Fundpool: die vier eigenen plus Spitzhacke, Fackel, Grubenlampe, Schaufel, Schwarze Kerze, Enterbeil. Item-Sprites sind Platzhalter (`candle`, `pick`, `tarot`, `gloves`, `holywater`).

## Krämer

**Der Köhler**, an einem Meiler aus versteinertem Holz, der seit Jahrhunderten nicht brennen will. Er schichtet ihn jeden Tag neu und sagt, morgen fängt er Feuer, auf Latein und dann in einer Sprache, die älter klingt.

## Ereignisse

| ID | Titel | Kern | Bezug auf Früheres |
|---|---|---|---|
| `wald_meilenstein` | Der Meilenstein | Die Zahl wird heruntergezählt, die letzte mit dem Fingernagel. (Kerbe, Kampf, Heilung) | – |
| `wald_ringe` | Die Ringe (Stummfilm) | Der äußerste Ring hat noch keine Zahl, das Holz ist feucht. (Handgriff, max. Leben gegen Streichen, Reaktion) | – |
| `wald_traene` | Die Harzträne | Eine offene Hand im Bernstein, darunter die Knochen eines Arms. (Item, Kampf gegen den Harzfang, Rast) | – |
| `wald_meiler` | Der kalte Meiler | Der Schleifstein ist nass, obwohl nichts nass ist. (Schleifen, Köhlerhandschuh) | – |
| `wald_bruecke` | Die Brücke der Legion | Frisches Holz über der Tiefe, darunter Kronen über Kronen. (Gold, Item tauschen, Handgriff) | – |
| `wald_brief` | Der Brief | Ein Legionär, nicht versteinert, gibt dir einen Brief an eine Adresse, die es nicht mehr gibt. | ja: `event_gesehen: wald_meilenstein`, `event_gesehen: kloster_abschriften` (Akt II), `item: legionsaxt` |

## Musik

es-Moll, Grundton 51 (Salz 53, Stadt 46, Gezeitenwerk 43). Ort: Stollenhall, wenig Wind, Schimmer; Rhythmus `holz` (eine ferne Axt), Einzelklänge aus `salz` (Tropfen, knarrendes Holz).

## Prüfung

- `node tools/sprites/pruefen.js holzfaeller_a holzfaeller_b steinhirsch_a steinhirsch_b harzfang_a harzfang_b bernsteinlarve_a bernsteinlarve_b wurzelstock wurzelstock_p2 wurzelstock_p3`: 11 Sprites, **0 Verstöße**.
- Kontaktbogen neben Chorknabe, Hirte, Netzflickerin: [kontakt-neben-favoriten.png](../bilder/M7/wald/kontakt-neben-favoriten.png). Alle Animationen: [animationen.png](../bilder/M7/wald/animationen.png). Silhouetten gegen alle 130 vorhandenen Sprites (Wald schwarz): [silhouetten-gegen-alle.png](../bilder/M7/wald/silhouetten-gegen-alle.png). Proben: [silhouetten-proben.png](../bilder/M7/wald/silhouetten-proben.png).
- Hintergrund: [hintergrund-varianten.png](../bilder/M7/wald/hintergrund-varianten.png) (V0, V1, V2, Wächter, mit Gegnern), [hintergrund-varianten-leer.png](../bilder/M7/wald/hintergrund-varianten-leer.png), [hintergrund-arten.png](../bilder/M7/wald/hintergrund-arten.png) (weg, rast, werkstatt, kraemer, ereignis, wandbild, fund, uebergang), [hintergrund-fremdheit.png](../bilder/M7/wald/hintergrund-fremdheit.png) (0 und 1).
- Im Spiel (`newRun('fischer', …, {route: ['hafen','kapelle','wald','eis','pforte']})`, `Dev.springe`): [im-spiel-kampf.png](../bilder/M7/wald/im-spiel-kampf.png), [im-spiel-kampf-2.png](../bilder/M7/wald/im-spiel-kampf-2.png), [im-spiel-kampf-3.png](../bilder/M7/wald/im-spiel-kampf-3.png), [im-spiel-waechter.png](../bilder/M7/wald/im-spiel-waechter.png), [im-spiel-waechter-phase3.png](../bilder/M7/wald/im-spiel-waechter-phase3.png). Keine Konsolenfehler.
- `node tools/test-ereignisse.js`: alles gut (6 Ereignisse im Wald).
- `node tools/biom-test.js wald 10` (neuer Test mit gespielten Vorakten): **8/10**, Startseed 11: **6/9** (ein Seed im Vorlauf gestorben), Seeds 1–20 zusammen 15/20 (75 %), Seeds 1–50 zusammen 35/46 (76 %), **0 Fehler**. Niederlagen verteilen sich auf normale Kämpfe und den Wurzelstock.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Holzfäller der Legion | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Helmbusch, hochgerissene Dolabra und Holzarm machen ihn sofort zum Römer und unverwechselbar; der Panzer hat echte Binnenform (Schienen mit Lichtkante). Die Jahresringe im Gesicht sieht man erst aus der Nähe, Rock und Beine sind noch eher dunkel. |
| Steinhirsch | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Die Krone mit dem herabhängenden Wurzelvorhang ist das stärkste Bild des Bioms und erzählt das „nach unten wachsen“ ohne Text. Die vielen dünnen, voll gerandlichteten Stränge sind unruhig, der Rumpf hat nur wenig Binnenform. |
| Harzfang | 4 | 5 | 4 | 5 | 5 | 5 | **4** | Laterne aus Beinen mit leuchtendem Bernstein und Gesicht darin: liest sich im Spiel als Erstes. Silhouette ist eigen, aber konzeptuell verwandt mit den hängenden Augen der Pforte (Faden, hängender Körper). |
| Bernsteinlarve | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Der schräge Blechturm mit dem leuchtenden Wurm ist neu im Spiel. Dass der Köcher aus Helmen und Münzen besteht, sieht man erst im Kontaktbogen; im Kampf ist es „ein Rohr aus Platten“. |
| Wurzelstock (3 Phasen) | 5 | 4 | 4 | 5 | 5 | 5 | **4** | Hängt statt zu stehen, die Maserung in Ringen um Augen und Mund gibt dem großen Körper Binnenform; die wachsende Armzahl je Phase ist im Kampf sichtbar. Der Mund ist klein, die Stockfläche unten bleibt recht dunkel. |
| Hintergrund V0 Legionsstraße | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Straße, Bogen im Stamm, gespiegelte Kronen und Harzlicht lesen sich; die hängenden Stämme mit Wurzelanlauf zeigen die Umkehrung. Der Boden neben der Straße ist ruhig. |
| Hintergrund V1 Gefällter Stamm | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Die numerierte Schnittfläche ist das falsche Detail im Großformat. Der liegende Stamm ist eine große, eher gleichförmige Fläche. |
| Hintergrund V2 Über der Tiefe | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Erst nach Überarbeitung (Harzschein aus der Tiefe, Kronen darunter, Brücke an der Kante, Schutt und Risse auf dem Absatz) liest sich die Tiefe; die Brücke bleibt dünn. |
| Hintergrund Wächter Wurzelgewölbe | 5 | 4 | 4 | 5 | 5 | 5 | **4** | Die Rippen aus Wurzeln laufen zum Knoten, an dem der Wurzelstock hängt; Sprite und Szene schließen aneinander an. Viele dünne Lichtlinien an den Rippen. |
| **Hintergrund gesamt** | | | | | | | **4** | |

Nichts unter 4. Überarbeitet wurden unterwegs: Holzfäller (Nackenschirm las sich als Schnabel, Helmbusch ergänzt, Schlag ging nach hinten, Holzarm abgeschnitten), Steinhirsch (Stränge wie Stangen, Hals wie ein Lama, dann Krone mit hängenden Strängen), Harzfang (dunkler Sack wie eine Spinne, dann Laterne mit leuchtendem Bernstein, im Leerlauf leicht geöffnet, damit die Beine frei stehen), Bernsteinlarve (Larve im Köcher versteckt, Köcher aus dem Bild), Wurzelstock (Arme lasen sich als Beine, dann hängend; Maserung als Ringe statt Rauschen; Schlag ging in die falsche Richtung), Kronen im Hintergrund (lasen sich als Wolken, dann gespiegelte Bäume mit Ästen), Variante 2 (Tiefe nicht lesbar), Vordergrund rechts in V0/V1 (verdeckte Gegner).

## Offene Schwächen

- „Brand macht ihn wütend“ ist nur über Schwachstelle und Phasen umgesetzt; ein echter Kniff (Stärke bei Brand) bräuchte Kerncode.
- Beim Phasenwechsel zeigt der Kern einen allgemeinen Hinweis („Das, was ruft – verändert sich“), der aus dem Finale stammt; das ist eine Sache des Kerns.
- Die Absicht des Holzfällers während des Ladens zeigt der Kern als „+0“.
- Item-Icons sind Platzhalter.
- Viele dünne Elemente (Geweihstränge, Wurzeln, Rippen) tragen volles Randlicht; das Bild ist dadurch etwas unruhiger als bei den Favoriten.
