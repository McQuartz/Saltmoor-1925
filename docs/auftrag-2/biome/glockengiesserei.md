# Die Glockengießerei (`glockengiesserei`) · Akt II

Biom-Paket der Zugabe nach [paket-format.md](../paket-format.md) (Auftrag 2, [03-meilensteine.md](../03-meilensteine.md) Abschnitt „Zugabe“). Bilder: [bilder/Zugabe/glockengiesserei/](../bilder/Zugabe/glockengiesserei/).

| Teil | Datei |
|---|---|
| Daten | `prototype/data/biome/glockengiesserei.json` |
| Hintergrund | `prototype/js/scenes/world/glockengiesserei.js` |
| Zonenpalette | `tools/sprites/zonen/glockengiesserei.json` |
| Gegner | `tools/sprites/gegner/giesser.js`, `formerin.js`, `kloeppelmann.js`, `gussnaht.js`, `ungetaufte.js` |
| Item-Icons | `tools/icons/items/giesskelle.js`, `lehmmaske.js`, `stimmeisen.js`, `handglocke.js` |

## Der Ort

Unter dem Kirchhof von St. Brendan liegt die Gießhütte, in der 1641 die Glocken für die Kapelle gegossen wurden: ein gemauertes Gewölbe, schwarz von Ruß, der Boden aus gestampftem Lehm. In der Mitte die Dammgruben, runde Löcher, in denen die Formen stehen; hinten der Flammofen, aus dessen Abstich die Gussrinnen über den Boden zu den Gruben laufen. Die Gruben sind noch warm, die Rinnen glühen. Durch einen gemauerten Schacht wurden die fertigen Glocken nach oben gezogen, in den Kirchhof; oben im Schacht hängt ein Seil, und durch ihn fällt ein wenig kaltes Licht. Hier wurden die Glocken gegossen, die bei Flut läuten.

- **Wahrzeichen:** die große Glocke, so hoch wie ein Haus, halb noch in ihrem Lehmmantel. Sie hängt an einem Galgen aus Eichenstämmen über ihrer Grube; auf der linken Seite ist der Mantel noch da (grauer Lehm, mit Eisenbändern gefasst), rechts ist er abgeschlagen und die Bronze liegt bloß, mit dem Schriftband, das man nicht lesen kann. Unten aus dem Mund glüht es noch.
- **Falsches Detail:** In den Glocken hängt statt eines Klöppels jeweils ein Mensch. Man sieht es an den Füßen: Unter dem Rand jeder fertigen Glocke hängen zwei nackte Füße, still. Wenn irgendwo eine Glocke anschlägt, schwingen sie ein wenig. Nie erklärt.
- **Palette:** Ruß (Schwarz mit einem Hauch Violett, Körper `#060506 … #2a2026`), Lehm (stumpfes Graubraun, nur im Hintergrund und als Material „haut“), **Kirschglut** als Randlicht (`#a8322a` / `#ff9e6e`), flüssige Glockenspeise als einziges helles Licht (Glut `#ffd36a`, Kern `#fffbe6`), Glockenbronze rosig-golden (`#a87a52`) für Kanten und Schriftbänder. Ein einziger kalter Ton: das Licht aus dem Schacht (Graublau, nur oben, klein).
- **Abgrenzung im Akt:** Die Kapelle ist bernstein mit grünem Wasserlicht und steht im Wasser; das Kloster ist der hellste Ort (Pergament, Silberhimmel); die Grotte ist Wachsgelb und Kerzenrot auf blaugrauem Schiefer, mit tausend kleinen Lichtern. Die Gießerei ist **rot und schwarz**, trocken, mit **Licht von unten** (Rinnen, Gruben, Ofenmaul) und wenigen, großen Lichtflächen statt vieler Punkte. Ihre Formen sind Glockenprofile (geschweift, unten ausgestellt) und schwere Zimmermannsbalken, nicht Spitzbögen (Kapelle), Arkaden (Kloster) oder Tropfstein (Grotte).
- **Licht:** Das Gegenlicht von hinten oben rechts ist das Ofenmaul, hoch auf seiner Bühne. Dazu glühen die Rinnen am Boden als Fluchtlinien, die Gruben als Ringe. Mit `fremdheit` werden die Rinnen heller, unter mehr Glocken hängen Füße, und in der Wächter-Szene hängt eine Glocke mehr.
- **Krämer:** Der Wandergießer. Er nimmt kein Geld, er gießt um: Er verkauft, was du beim letzten Krämer gesehen hast, nur in seiner Speise, und was Feuer war, kommt als Wasser aus der Form (`kraemer.art: spiegel`; im Akt sonst nur Tausch und Leihe).

## Hintergrund: Kompositionen (480 × 270)

Feste Bedingungen wie bei allen Biomen: Gegner in x 60–420 auf drei Reihen, oben links (Tiefe) und unten (Karten) UI-frei halten, Nebel höchstens ein schmales Band. Grundform des Bioms: **die Glocke als Profil** (überall Glockenschweifungen in verschiedenen Größen, als Maßstab) und **glühende Linien auf dunklem Boden**. Keine zwei Varianten mit derselben Grundform.

### Variante 0: Die Gießhalle (Grundform: Tunnel mit Fluchtpunkt, Licht am Ende)
- **Horizont** y 146, Fluchtpunkt (300, 146). Wir stehen am vorderen Ende der Halle, das Gewölbe aus Backstein läuft nach hinten.
- **Blickführung:** Hinten im Fluchtpunkt der Flammofen mit seinem glühenden Maul, darüber die Esse. Vom Abstich laufen drei Gussrinnen als glühende Linien über den Lehmboden auf uns zu und biegen zu den Dammgruben ab. Rechts hinten steht die große Glocke in ihrer Grube (Wahrzeichen, halb Lehm, halb Bronze), am Galgen. Links reihen sich fertige Glocken an einem Balken, nach hinten kleiner.
- **Falsches Detail:** unter jeder Glocke am Balken zwei nackte Füße; je höher `fremdheit`, desto mehr Glocken haben welche.
- **Maßstab:** eine Leiter am Ofen, eine Schubkarre mit Lehm, ein Geselle-Hocker. Die große Glocke ist höher als die Ofenbühne.
- **Vordergrund:** links ein Balken des Galgens angeschnitten, unten rechts der Rand einer Grube mit Glutring.

### Variante 1: Unter dem Glockenstuhl (Grundform: schwere Diagonale aus Balken quer durchs Bild)
- **Horizont** y 156, Fluchtpunkt links (120, 156).
- **Aufbau:** Quer über das Bild läuft hoch ein Glockenstuhl aus Eiche (zwei Balken, Streben im Andreaskreuz), daran hängen fünf Glocken von links klein nach rechts groß; die größte reicht fast bis zum Boden hinter den Gegnern. Dahinter das Gewölbe mit dem Schacht nach oben (kaltes Licht, ein Seil hängt herab). Fern links in der Glut die große Glocke als Silhouette.
- **Falsches Detail:** unter allen fünf Glocken Füße; unter der größten hängen sie so tief, dass die Zehen den Boden streifen und im Lehm zwei Rinnen gezogen haben.
- **Boden:** Gruben als glühende Ringe, eine Rinne läuft diagonal.

### Variante 2: Die Formenkammer (Grundform: Raster aus gleichen Formen, frontal)
- **Horizont** y 150, frontal, Fluchtpunkt mittig (240, 150).
- **Aufbau:** Eine niedrige Kammer mit Rundbögen, in denen die Lehmkerne auf ihren Spindeln stehen, in Reihen, wie Bienenkörbe; an der Rückwand Drehschablonen (Bretter mit Glockenprofil) wie Ruder an Haken. In der Mitte hinten ein Bogen, durch den man in die Halle und die große Glocke sieht. Ein Kohlebecken trocknet die Formen (warmes Licht links).
- **Falsches Detail:** zwischen den Kernen hängt eine fertige Glocke am Kran, mit Füßen; die Schablonen an der Wand haben alle dasselbe Profil, und das Profil hat Knie.

### Wächter-Szene: Vor dem Ofen
- **Horizont** y 168, Untersicht. Hinter dem Wächter steht das Maul des großen Flammofens, breit und rund überwölbt, gefüllt mit ruhiger, gleichmäßiger Glut (dichte Dither-Fläche in Orange und Rot, keine Details): **die ruhige, kontrastierende Zone**, vor der die dunkle Glocke als Silhouette steht. Links und rechts Backsteinpfeiler, oben quer der Balken des Galgens mit Kette (die Kette des Sprites hängt daran). Seitlich hängen kleinere Glocken mit Füßen. Der Boden ist die Grube: ein glühender Ring, zu dem alle Rinnen laufen.
- **Übergang:** dieselbe Grube, die Glocke ist fort; wo der Lehmkern stand, ist ein Loch, und in die Innenseite des Kerns ist eine Wendeltreppe geschnitten, die nach unten führt. Von unten glüht es.

### Die anderen Arten
- **weg:** Variante nach Seed. **rast:** Formenkammer abgedunkelt, kleines Feuer in einem kalten Kohlebecken. **werkstatt:** Formenkammer mit Werkbank. **kraemer:** Glockenstuhl, davor der Stand des Wandergießers: ein Haufen gesammelter Kessel, Leuchter und Löffel, ein kleiner Tiegelofen. **ereignis / fund:** Gießhalle, vorn eine zerschlagene kleine Form, darin eine Handglocke, die kurz aufglüht. **wandbild:** Variante nach Seed, Relief aus `World.relief` in Bronze. **uebergang:** wie oben.

## Gegner

Arbeitsweise wie bei den Vorbildern: Silhouette zuerst als schwarze Fläche, je Gegner zwei Silhouetten verglichen (die verworfene steht als `proben` im Skript), gegen alle vorhandenen Sprites geprüft, dann Licht, Randlicht, Fase, Dither, dann Pixel nachgearbeitet. Weg A (`"quelle": "skript"`), kein Bild-Generator in der Sitzung.

**Zur Rückmeldung „große dunkle Flächen ohne Binnenform“:** Jedes Skript hat eine innere Randlicht-Stufe an überlappenden Teilen (`innenKanten` wie beim Regulator), dazu je Figur eigene Gliederung (Falten und Lederschurz-Nähte beim Gießer, Gesichter und Ringwülste im Lehm bei der Formerin, Schriftband, Rippen und Sprung an den Glocken, die Naht mit dem Grat bei der Gussnaht) und mindestens ein inneres Licht (Bronze im Löffel, Glut in der Naht, Glut im Glockenmund).

### Der Gießer (`giesser`)
- **Motiv:** Handwerk, das an sich selbst weiterarbeitet.
- **Wer er war:** der Meister, der 1641 die Glocken für St. Brendan gegossen hat.
- **Was falsch ist:** Er trägt eine Maske aus Lehm, die Form seines eigenen Gesichts. Hinter den Augenlöchern steht flüssige Bronze; wo sein Gesicht war, wird gerade gegossen.
- **Silhouette:** ein breiter, gebeugter Mann im Lederschurz, der einen Gießlöffel an einer Stange, doppelt so lang wie er, waagerecht vor sich trägt.
- **Varianten:** a Gießlöffel an der langen Stange; b Tiegel in einer Tiegelzange, die Maske gesprungen.
- **Proben:** aufrecht mit dem Löffel senkrecht wie ein Spieß (las sich als Wächter mit Hellebarde, zu nah an Fahnenträger und Holzfäller). Genommen: gebückt, Stange waagerecht; danach Stange gekürzt (der Löffel lag außerhalb des Bilds), Gugel niedriger, die Maske größer und aus hellem Lehm.
- **Animation:** Leerlauf: Die Bronze im Löffel wallt, er atmet. Angriff: Er reißt den Löffel hoch über die Schulter, dann kippt er ihn nach vorn, ein Schwall fliegt. Tod: Er sinkt in die Knie, die Maske zuletzt.
- **Kniff:** `brecher`: Bronze läuft durch jede Fuge, auch durch deine Deckung. Fordert Bollwerk heraus.
- **Muster:** Ausgießen (8), Schlacke abziehen (Block 6), Spritzer (2 × 4).
- **Schwachstelle Wasser:** Wasser auf heißem Guss, und er springt.
- **Stimme:** `grabwaechter` (Horn aus Knochen).

### Die Formerin (`formerin`)
- **Motiv:** Der Abdruck.
- **Wer sie war:** die Magd, die den Lehm mit Haaren und Mist trat und die Kerne formte.
- **Was falsch ist:** Ab der Hüfte ist sie selbst ein Glockenkern aus Lehm auf der Spindel. In ihre eigene Wölbung drückt sie Gesichter, Reihe um Reihe, von Leuten, die nie hier waren; das jüngste hat offene Augen.
- **Silhouette:** ein Bienenkorb aus Lehm, aus dem oben eine schmale Frau wächst, die sich mit zu langen Armen über die eigene Wölbung beugt.
- **Varianten:** a hoher Kern, drei Gesichter, die Spindel ragt mit ihrem Querholz hinter ihr auf; b breiter, niedriger Kern, vier Gesichter (zwei mit offenen Augen), die Drehschablone lehnt daran.
- **Proben:** die Frau kniend neben einem freistehenden Kern (las sich als zwei Dinge nebeneinander, eine Gestalt und ein Hügel). Genommen: verwachsen; danach der Kern runder (er war ein schräger Kegel) und die Gesichter größer.
- **Animation:** Leerlauf: Die Hände streichen den Lehm glatt, ein Gesicht blinzelt. Angriff: Sie richtet sich auf, die Arme gehen zurück, dann drückt sie mit flachen Händen nach vorn unten. Tod: Der Lehm reißt, sie sinkt in den Kern.
- **Kniff:** `abschrift 1` (Karte „Abdruck“): Sie drückt dein Gesicht in den Lehm; der Abdruck liegt danach in deinem Stapel und tut nichts. Fordert Kettenwerk und kleine Decks heraus.
- **Muster:** Andrücken (6), Glätten (Block 7), Formen (2 × 3).
- **Schwachstelle Feuer:** Im Feuer wird Lehm hart und nimmt keine Gesichter mehr.
- **Stimme:** `torfstecherin` (Summen, sehr tief).

### Der Klöppel (`kloeppelmann`)
- **Motiv:** Die Glocke geht.
- **Wer er war:** einer aus der Gemeinde. Mehr steht nicht im Gießbuch.
- **Was falsch ist:** Eine Glocke, mannshoch, geht auf zwei nackten Beinen. Er hängt darin, wo der Klöppel hängen müsste; bei jedem Schritt schlägt er innen an. Unter dem Rand greift eine Hand hervor.
- **Silhouette:** eine Glocke auf zwei dünnen nackten Beinen, die Krone oben wie ein Henkel.
- **Varianten:** a schlanke, hohe Glocke (alte Zuckerhutform); b breite, kurze Glocke mit Sprung im Rand und einem Seilrest an der Krone.
- **Proben:** eine kleine Haube auf langen Beinen (las sich als Lampenschirm mit Beinen). Genommen: die große Glocke, unter der nur die Unterschenkel herausschauen.
- **Animation:** Leerlauf: Die Glocke wiegt sich, die Füße treten. Angriff: Sie kippt nach hinten, dann schwingt sie nach vorn und schlägt, der Mund glüht auf. Tod: Die Beine knicken, die Glocke fällt und zerfällt.
- **Kniff:** `ansage` (2 Züge laden, dann 13): Er holt aus. Er holt aus. Dann schlägt er. Fordert Block-Planung.
- **Schwachstelle Glaube:** Die Glocke wurde nie geweiht.
- **Stimme:** `nachgeher` (menschliche Formanten »o«, tief).

### Die Gussnaht (`gussnaht`)
- **Motiv:** Zwei, die nicht zusammengehören.
- **Wer sie war:** was in der Form stand, als die beiden Hälften zusammengesetzt wurden.
- **Was falsch ist:** Der Länge nach aneinandergegossen: die Hälfte eines alten Mannes (Bart, Mantel mit Knopfreihe) und die Hälfte eines Kindes, das ihm bis zur Brust reicht. Über dem Kopf des Kindes liegt die Schnittfläche des Alten offen und glüht; die Naht leuchtet beide Hälften von innen an, und aus ihr steht der Gussgrat als dünne Bronzeflosse über den Kopf.
- **Silhouette:** ein Mensch, der der Länge nach aus einer großen und einer kleinen Hälfte besteht, die Arme hängen weit vom Leib, oben eine zackige Flosse.
- **Proben:** zwei fast gleich große Hälften (las sich als gewöhnlicher Mensch mit Kamm; die Naht ging verloren). Genommen: alt und Kind; danach Arme vom Leib gelöst, Bart und Haar, der glühende Querschnitt über dem Kind.
- **Varianten:** a die große Hälfte links; b die große Hälfte rechts, der Grat zerfranst, an der Schulter ein zweiter Lappen.
- **Animation:** Leerlauf: Die Hälften verrutschen um einen Pixel gegeneinander, die Naht glimmt. Angriff: Die Hälften gehen auseinander, die Naht klafft und glüht, dann schlagen sie zusammen nach vorn. Tod: Die Naht reißt auf, beide Hälften fallen auseinander.
- **Kniff:** `nachlass teilt`: Wenn sie fällt, geht sie an der Naht auf, und jede Hälfte gießt sich die andere nach (zwei Gussnähte mit halbem Leben). Fordert Reihenfolge und Flächenschaden.
- **Muster:** Zwei Hände (2 × 4), Erstarren (Block 8), Zusammenschlagen (7). Leben 28.
- **Schwachstelle Blut:** Die Naht hält nur, solange keine Hälfte blutet.
- **Stimme:** `schatten` (Flüstern, zweistimmig gedacht).

### Wächter: Die Ungetaufte (`ungetaufte`), 160 × 180
- **Motiv:** Zeit, die geläutet wird.
- **Wer sie war:** die große Glocke für St. Brendan. Sie wurde nie geweiht und nie hinaufgezogen.
- **Was falsch ist:** Sie hängt am Galgen über ihrer Grube, halb noch im Lehmmantel, halb bloße Bronze. Aus ihrem glühenden Mund hängen zwei nackte Füße, groß wie Ruderblätter, und wenn sie schlägt, schwingen sie.
- **Silhouette:** eine riesige Glocke unter einem Querbalken an einer Kette, links rau und mit Bändern gefasst, rechts glatt mit Schriftband, unten zwei hängende Füße über dem Glutring der Grube.
- **Proben:** die Glocke ganz im Mantel (las sich als Bienenkorb oder Hügel, zu nah an der Formerin). Genommen: halb abgeschlagen; danach die Füße größer und im Profil (Zehen nach unten), vorher lasen sie sich als graue Steine.
- **Animation:** Leerlauf: Sie hängt, die Füße pendeln gegeneinander, der Mund glimmt. Angriff: Sie schwingt zurück, dann nach vorn, der Mund flammt auf, die Füße fliegen nach. Tod: Die Kette reißt, sie sinkt in die Grube und zerfällt.
- **Kniff:** `takt 7`: Wenn sie schlägt, duckt sich alles in der Halle unter den Ton (alle Gegner +7 Block); zwischen den Schlägen summt sie offen und ist verwundbar.
- **Besonders:** `ruft kloeppelmann` (alle 3 Züge): Bei jedem dritten Schlag fällt aus einer der kleinen Glocken einer heraus und steht auf.
- **Muster:** Schlag (11), Nachhall (4 × 3), Läuten (Block 12), Großer Schlag (16), Summen (Stärke +2). Leben 76.
- **Schwachstelle Wasser:** Sie ist für die Flut gegossen; Wasser im Sprung kühlt die Speise zu schnell, und der Sprung läuft weiter.
- **Stimme:** `glockenmutter` (Knabenchor eine Oktave tiefer, gedoppelt; die Glocke der Kapelle stammt von hier).
- **Beute:** Reliquie *Die Handglocke der Ungetauften* (`handglocke`).

## Items

| ID | Name | Rar | Kerben | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|---|
| `giesskelle` | Gießkelle (F E) | gewöhnlich | 1 | – | Ausgießen (1: 5 Schaden, Brand 2) | Der Stiel ist so lang, dass zwischen dir und dem Guss ein Mensch Platz hätte. Innen ist der Löffel blank, als hätte ihn jemand ausgeleckt. |
| `lehmmaske` | Lehmmaske (W) | selten | 2 | `block_haelt_halb` | Den Kopf senken (1: Block 7) | Die Form eines Gesichts, innen. Sie passt dir, obwohl sie für einen anderen gemacht wurde. Lehm, der einmal warm war, bleibt lange warm. |
| `stimmeisen` | Stimmeisen (E G) | selten | 2 | `erste_karte_billiger` | Nachstimmen (0: 3 Schaden, Verwundbar 1) | Ein Meißel, mit dem man innen von der Glocke Bronze abnimmt, bis sie stimmt. An der Schneide klebt etwas, das kein Metall ist. |
| `handglocke` | Die Handglocke der Ungetauften (W) | reliquie | 2 | `kampfstart_fx`: allen Gegnern 3 Schaden und Schwäche | Anschlagen (1: 4 Schaden an allen) | Aus derselben Speise wie die große. Statt eines Klöppels hängt darin ein Fingerknochen, und sie läutet nur bei Flut. Irgendwo ist immer Flut. |

Fundpool: Gießkelle, Lehmmaske, Stimmeisen plus Kerze, Kreuz, Rosenkranz, Grubenlampe, Schaufel, Spitzhacke, Teerfackel. Beute: Gießer → Gießkelle, Formerin → Lehmmaske, Ungetaufte → Handglocke.

## Ereignisse

| ID | Titel | Kern | Bezug auf Früheres |
|---|---|---|---|
| `glockengiesserei_grube` | Die warme Grube | In einer Grube steht eine Form, noch warm. Von innen klopft es, im Takt. | – |
| `glockengiesserei_giessbuch` | Das Gießbuch | Jede Glocke mit Gewicht, Gemeinde und einem Namen in der Spalte „Klöppel“. Die letzte Zeile ist leer. | `event_gesehen: alle_kirchenbuch`, `job: pfarrerin` |
| `glockengiesserei_stille` | Die stille Glocke | Eine Glocke hängt tief am Balken, unter dem Rand zwei Füße. Sie sind warm. | `item: kloeppel` (Glockenklöppel von St. Brendan) |
| `glockengiesserei_wachs` | Die Wachsbuchstaben | Buchstaben aus Wachs für ein Schriftband, sortiert in Kästen; sie ergeben einen Namen, und der Name passt in die Lücke. | – |
| `glockengiesserei_stimmen` | Das Stimmen | Eine Reihe Glocken am Boden, eine klingt falsch. Innen in ihr, wo man Bronze abnimmt, ist etwas anderes als Bronze. | `item: stimmeisen` |
| `glockengiesserei_flut` | Flut | Oben im Schacht läuten alle Glocken zugleich. Die Füße unter den Rändern beginnen zu treten. | `event_gesehen: hafen_lichtkegel` |

## Musik

a-Moll, Grundton 45 (Kapelle 52 e-Moll, Kloster 55 g-Moll, Grotte 47 h-Moll). Ort: Stollenhall unter dem Kirchhof, Zugluft im Schacht; Rhythmus `hacke` (Meißel und Hammer auf Bronze), Einzelklänge aus `kapelle` (Glockenschläge, die verstimmte Orgel von oben).

## Vorschläge an den Kern

- **Takt mit eigenem Klang:** `takt` sendet `herzschlag` (Bild- und Klangwirkung des Herzens). Für die Ungetaufte wäre ein Feld `klang: "glocke"` am Kniff schön, das statt des Herzschlags einen Glockenschlag (`bigBell` aus `music.js`) auslöst.
- **Hälften bei `nachlass teilt`:** Die Teile sind volle Kopien mit halbem Leben und Zufallsvariante. Ein optionales `sprites: [...]` (eigene Hälften-Sprites) und `hp_anteil` würden die Gussnaht genauer erzählen.
- **Bild der Störkarte:** `stoerKarte` nimmt den Namen aus `kniff.karte`, das Bild ist immer `bone`. Ein `kniff.spr` (hier ein Abdruck im Lehm) wäre billig.
- **Szene reagiert auf Schläge:** Die Füße unter den Hintergrund-Glocken sollen schwingen, wenn die Ungetaufte schlägt. Dafür bräuchte `World.build` eine Rückmeldung wie `S.puls(art)`, die `buehne.js` bei `herzschlag` aufruft; heute sind die Szenen bis auf Partikel statisch.

## Prüfung

- `node tools/sprites/pruefen.js giesser_a giesser_b formerin_a formerin_b kloeppelmann_a kloeppelmann_b gussnaht_a gussnaht_b ungetaufte`: 9 Sprites, **0 Verstöße**.
- `node tools/icons/bauen.js giesskelle lehmmaske stimmeisen handglocke`, `node tools/icons/pruefen.js`: 203 Bilder, **0 Verstöße**.
- Kontakt- und Silhouetten-Bogen neben Chorknabe, Hirte, Netzflickerin: [glockengiesserei-bogen.png](../bilder/Zugabe/glockengiesserei/glockengiesserei-bogen.png). Silhouetten gegen alle 161 vorhandenen Sprites (Gießerei schwarz, andere grau): [silhouetten-gegen-alle.png](../bilder/Zugabe/glockengiesserei/silhouetten-gegen-alle.png). Alle Animationen der a-Varianten und des Wächters: [animationen.png](../bilder/Zugabe/glockengiesserei/animationen.png).
- Hintergrund: [hintergrund-varianten.png](../bilder/Zugabe/glockengiesserei/hintergrund-varianten.png) (V0, V1, V2, Wächter, mit den echten Sprites, ×2), [hintergrund-arten.png](../bilder/Zugabe/glockengiesserei/hintergrund-arten.png) (weg, rast, werkstatt, kraemer, ereignis, wandbild, fund, uebergang), [hintergrund-fremdheit.png](../bilder/Zugabe/glockengiesserei/hintergrund-fremdheit.png). Aufbau je Szene 80 bis 290 ms.
- Im Spiel (`newRun('fischer',3,{dev:true,route:['hafen','glockengiesserei','salz','eis','pforte']})`, `Dev.springe('kampf_schwer',1)` bzw. `('waechter',1)`): [im-spiel-kampf.png](../bilder/Zugabe/glockengiesserei/im-spiel-kampf.png), [im-spiel-kampf-2.png](../bilder/Zugabe/glockengiesserei/im-spiel-kampf-2.png), [im-spiel-kampf-3.png](../bilder/Zugabe/glockengiesserei/im-spiel-kampf-3.png), [im-spiel-kampf-alle-vier.png](../bilder/Zugabe/glockengiesserei/im-spiel-kampf-alle-vier.png), [im-spiel-waechter.png](../bilder/Zugabe/glockengiesserei/im-spiel-waechter.png). Keine Konsolenfehler.
- `node tools/biom-test.js glockengiesserei 20`: **16/20**, mit Startseed 21: **15/20**, zusammen 31/40 (78 %), 0 Fehler. Erste Werte waren 34/40 (85 %); danach Gießer (8 statt 7, Spritzer 2 × 4), Gussnaht (28 Leben) und Ungetaufte (76 Leben, Takt 7, Schläge 11/4 × 3/16) verstärkt. Alle Niederlagen kommen aus normalen Kämpfen, meist Gießer mit Gussnaht (Brecher und Teilen zusammen); die Ungetaufte hat in 40 Seeds keinen Run beendet.
- `node tools/test-ereignisse.js` und `node tools/test-run.js`: „Alles gut.“ (6 Ereignisse der Gießerei).

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Gießer | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Gebückt mit der waagerechten Stange und dem glühenden Löffel gibt es sonst nicht; die Lehmmaske mit Bronze in den Augenlöchern liest sich ab ×2. Der Löffel leuchtet Hände und Schurz von unten an, Nähte, Gürtel und Brandflecken gliedern den Schurz. Rücken und Buckel bleiben eine große dunkle Fläche mit nur drei Falten, und der gekippte Löffel im Angriffsbild ist eine unklare Schlaufe. |
| Formerin | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Der Bienenkorb, aus dem eine Frau wächst, ist neu und schwarz sofort lesbar; Ringwülste mit Licht, das Feuerloch unten und die Gesichter mit offenen Augen geben Binnenform und inneres Licht. Die Gesichter sind im Spiel klein (5 × 7 px), die ruhende Hand liegt etwas lose auf der Wölbung. |
| Klöppel | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Eine Glocke auf zwei nackten Beinen, eine Hand über der Schärfe: das falsche Detail des Bioms als Figur. Rippen, Schriftband, Glanzbänder und der Glutmund gliedern die Bronze; der Angriff kippt die ganze Glocke. Im Glockenstuhl (V1) steht er vor Glocken desselben Motivs und lebt dort nur von Randlicht und dunklerem Ton. |
| Gussnaht | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Knapp. Erst nach zwei Überarbeitungen (zwei gleiche Hälften → Alter und Kind; Arme vom Leib, Bart, Haar, glühender Querschnitt über dem Kind, Licht aus der Naht auf beiden Hälften) liest sich, dass hier zwei Menschen aneinandergegossen sind. Die Kinderhälfte ist klein und dunkel, der Mantel des Alten bleibt die schwächste Fläche des Bioms. |
| Ungetaufte (Wächter) | 5 | 5 | 4 | 5 | 5 | 5 | **4** | Halb Lehmmantel, halb Bronze, unten die hängenden Füße über dem Glutring: Wahrzeichen und falsches Detail in einer Figur. Im Spiel steht sie dunkel vor dem gleichmäßig glühenden Ofenmaul, die ruhigste und klarste Stelle des Bioms. Pixel 4: Der Mantel ist mit Rauschen strukturiert und wirkt gekörnt, die Leisten sind gerade Bänder. |
| Hintergrund V0 Gießhalle | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Tunnel aus Gurtbögen auf den Ofen zu, Glocken am Wandbalken mit Füßen, die große Glocke im Galgen, Rinnen als Fluchtlinien: Ort, Maßstab und falsches Detail ohne Text. Die Rinnen sind die hellsten Linien im Bild und ziehen unten viel Blick; die große Glocke ist hier klein. |
| Hintergrund V1 Glockenstuhl | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Die stärkste Variante: fünf Glocken mit Füßen über den Köpfen der Gegner, der Schacht mit kaltem Licht. Hinter den Gegnern ist es unruhig; die Streben sind abgedunkelt und tragen nur noch dünnes Randlicht. |
| Hintergrund V2 Formenkammer | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Frontaler Aufbau mit drei Bögen, Kernen in den Nischen, der großen Glocke im glühenden Mittelbogen. Die untere Bildhälfte (Boden) ist ruhig und leer, der Kran wurde einmal versetzt, weil seine Glocke die große verdeckte. |
| Hintergrund Wächter (Vor dem Ofen) | 5 | 5 | 4 | 5 | 5 | 5 | **4** | Das Ofenmaul als ruhige, helle Zone direkt hinter der dunklen Glocke, Galgen oben, kleine Glocken mit Füßen an den Seiten, alle Rinnen zur Grube. Der Balken des Sprites sitzt knapp unter dem Balken der Szene und liest sich als zweites Joch. |
| **Hintergrund gesamt** | | | | | | | **4** | |
| Item-Icons | | | | | | | **4** | Gießkelle (Glut im Löffel), Lehmmaske (Riss, Glut hinter einem Auge), Stimmeisen, Handglocke; der Fingerknochen unter der Handglocke ist bei 32 px kaum zu erkennen. |

Nichts unter 4. Überarbeitet wurden unterwegs: Gießer (Stange ragte aus dem Bild, Kopf verschwamm mit dem Buckel), Formerin (Kegel statt Kuppel, Gesichter zu klein, Lehm-Akzente über der 6-%-Grenze), Klöppel (flache Glockenfläche; Glanzbänder, Randlicht, Licht von unten; Leerlauf ohne kriechenden Dither), Gussnaht (siehe Tabelle), Ungetaufte (Füße als Steine → im Profil, größer, heller), Hintergrund (Glocken zu hell und flach, Rinnen zu breit, Esse als Stange im Fluchtpunkt, Kranglocke vor der großen Glocke, Streben in V1 zu hell, Treppe im Übergang unsichtbar).

## Offene Schwächen

- Die Ungetaufte hat im Autospieler keinen Run beendet; der Akt wird in den normalen Kämpfen entschieden.
- Die Szenen sind bis auf Funken, Ruß und Flammen statisch; die Füße schwingen nicht mit dem Schlag (siehe Vorschläge).
- Musik nur über `Music.addBiome` (a-Moll, Grundton 45); `tools/musik-pruefen.js` (6 Minuten Echtzeit) wurde nicht vollständig durchlaufen.
