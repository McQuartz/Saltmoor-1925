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

**Augen im Rand** (`augen_a`, `augen_b`, 96 × 120): Was der Boss herbeiruft. Neu passend zum Hafen: **ein Auge in einer schwarzen Laterne** – die Laterne hängt an ihrer Kette von oben herab (aus der See-Decke), statt einer Flamme sitzt darin ein Auge. `augen_a`: Sturmlaterne mit Bügel; `augen_b`: kleine Positionslaterne, die Kette länger, zwei Fäden. Silhouette: hängendes Gehäuse an einem senkrechten Strich, klar anders als jeder Bodengegner.

## Werte und Abstimmung

Siehe Abschnitt „Abstimmung“ unten (wird beim Messen ausgefüllt).

## Noten

(wird nach dem Bauen ehrlich ausgefüllt)
