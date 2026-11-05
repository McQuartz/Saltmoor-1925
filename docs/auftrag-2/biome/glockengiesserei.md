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
- **Licht:** Das Gegenlicht von hinten oben rechts ist das Ofenmaul, hoch auf seiner Bühne. Dazu glühen die Rinnen am Boden als Fluchtlinien, die Gruben als Ringe. Mit `fremdheit` gehen die Laternen der Gesellen aus, die Rinnen werden heller und unter mehr Glocken hängen Füße.
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
- **Animation:** Leerlauf: Die Bronze im Löffel wallt, er atmet. Angriff: Er reißt den Löffel hoch über die Schulter, dann kippt er ihn nach vorn, ein Schwall fliegt. Tod: Er sinkt in die Knie, die Maske zuletzt.
- **Kniff:** `brecher`: Bronze läuft durch jede Fuge, auch durch deine Deckung. Fordert Bollwerk heraus.
- **Muster:** Ausgießen (7), Schlacke abziehen (Block 6), Spritzer (2 × 3).
- **Schwachstelle Wasser:** Wasser auf heißem Guss, und er springt.
- **Stimme:** `grabwaechter` (Horn aus Knochen).

### Die Formerin (`formerin`)
- **Motiv:** Der Abdruck.
- **Wer sie war:** die Magd, die den Lehm mit Haaren und Mist trat und die Kerne formte.
- **Was falsch ist:** Ab der Hüfte ist sie selbst ein Glockenkern aus Lehm auf der Spindel. In ihre eigene Wölbung drückt sie Gesichter, Reihe um Reihe, von Leuten, die nie hier waren; das jüngste hat offene Augen.
- **Silhouette:** ein Bienenkorb aus Lehm, aus dem oben eine schmale Frau wächst, die sich mit zu langen Armen über die eigene Wölbung beugt.
- **Varianten:** a hoher Kern, vier Gesichter; b breiter, niedriger Kern mit der Drehschablone, die an ihm lehnt.
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
- **Animation:** Leerlauf: Die Glocke wiegt sich, die Füße treten. Angriff: Sie kippt nach hinten, dann schwingt sie nach vorn und schlägt, der Mund glüht auf. Tod: Die Beine knicken, die Glocke fällt und zerfällt.
- **Kniff:** `ansage` (2 Züge laden, dann 13): Er holt aus. Er holt aus. Dann schlägt er. Fordert Block-Planung.
- **Schwachstelle Glaube:** Die Glocke wurde nie geweiht.
- **Stimme:** `nachgeher` (menschliche Formanten »o«, tief).

### Die Gussnaht (`gussnaht`)
- **Motiv:** Zwei, die nicht zusammengehören.
- **Wer sie war:** was in der Form stand, als die beiden Hälften zusammengesetzt wurden.
- **Was falsch ist:** Ein Mensch aus zwei Hälften gegossen, die nicht zueinander passen: die linke höher und älter, die rechte kleiner. Die Naht glüht, und aus ihr steht der Gussgrat als dünne Bronzeflosse über Kopf und Schultern.
- **Silhouette:** ein Mensch, der der Länge nach aus zwei ungleichen Hälften besteht, die gegeneinander verrutscht sind, dazwischen der Grat wie eine Flosse.
- **Varianten:** a linke Hälfte höher; b rechte Hälfte höher, der Grat zerfranst.
- **Animation:** Leerlauf: Die Hälften verrutschen um einen Pixel gegeneinander, die Naht glimmt. Angriff: Die Hälften gehen auseinander, die Naht klafft und glüht, dann schlagen sie zusammen nach vorn. Tod: Die Naht reißt auf, beide Hälften fallen auseinander.
- **Kniff:** `nachlass teilt`: Wenn sie fällt, geht sie an der Naht auf, und jede Hälfte gießt sich die andere nach (zwei Gussnähte mit halbem Leben). Fordert Reihenfolge und Flächenschaden.
- **Muster:** Zwei Hände (2 × 4), Erstarren (Block 8), Zusammenschlagen (7).
- **Schwachstelle Blut:** Die Naht hält nur, solange keine Hälfte blutet.
- **Stimme:** `schatten` (Flüstern, zweistimmig gedacht).

### Wächter: Die Ungetaufte (`ungetaufte`), 160 × 180
- **Motiv:** Zeit, die geläutet wird.
- **Wer sie war:** die große Glocke für St. Brendan. Sie wurde nie geweiht und nie hinaufgezogen.
- **Was falsch ist:** Sie hängt am Galgen über ihrer Grube, halb noch im Lehmmantel, halb bloße Bronze. Aus ihrem glühenden Mund hängen zwei nackte Füße, groß wie Ruderblätter, und wenn sie schlägt, schwingen sie.
- **Silhouette:** eine riesige Glocke unter einem Querbalken an einer Kette, links rau und mit Bändern gefasst, rechts glatt mit Schriftband, unten zwei hängende Füße.
- **Animation:** Leerlauf: Sie hängt, die Füße pendeln gegeneinander, der Mund glimmt. Angriff: Sie schwingt zurück, dann nach vorn, der Mund flammt auf, die Füße fliegen nach. Tod: Die Kette reißt, sie sinkt in die Grube und zerfällt.
- **Kniff:** `takt 6`: Wenn sie schlägt, duckt sich alles in der Halle unter den Ton (alle Gegner +6 Block); zwischen den Schlägen summt sie offen und ist verwundbar.
- **Besonders:** `ruft kloeppelmann` (alle 3 Züge): Bei jedem dritten Schlag fällt aus einer der kleinen Glocken einer heraus und steht auf.
- **Muster:** Schlag (10), Nachhall (3 × 3), Läuten (Block 12), Großer Schlag (16), Summen (Stärke +2).
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

(werden beim Bauen ergänzt)

## Prüfung

(wird beim Prüfen ergänzt)

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

(werden nach dem Bauen ehrlich vergeben)
