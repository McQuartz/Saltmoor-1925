# Das Gezeitenwerk (`gezeitenwerk`) · Akt III

Biom-Paket nach [paket-format.md](../paket-format.md). Steckbrief: [05-inhalte.md](../05-inhalte.md) Abschnitt 3. Bilder: [bilder/M7/gezeitenwerk/](../bilder/M7/gezeitenwerk/).

| Teil | Datei |
|---|---|
| Daten | `prototype/data/biome/gezeitenwerk.json` |
| Hintergrund | `prototype/js/scenes/world/gezeitenwerk.js` |
| Zonenpalette | `tools/sprites/zonen/gezeitenwerk.json` |
| Gegner | `tools/sprites/gegner/zahnradwaerter.js`, `kanalaal.js`, `oelerin.js`, `gewicht.js`, `regulator.js` |

## Der Ort

Unter dem Salz, tiefer als die Römer gegraben haben, liegt eine Maschine aus grüner Bronze. Sie macht Ebbe und Flut. Ihre Zahnräder sind so groß wie Häfen, in Kanälen läuft Meerwasser, und oben rechts stürzt der Zulauf herab, voll Meeresleuchten. Das Hauptrad rückt einmal in der Stunde um einen Zahn. Ein Ingenieur von 1880 hat eine eiserne Bühne an einen Zahn geschraubt; er wollte nur kurz etwas nachsehen.

- **Wahrzeichen:** das Hauptrad. In der Kampfszene ragt nur sein oberer Bogen aus der Grube, jeder Zahn so groß wie ein Haus; ein Zeiger aus Bronze steht vor der nächsten Lücke.
- **Falsches Detail:** Alles ist für Hände mit sieben Fingern gebaut (Griffe mit sieben Mulden, Handräder mit sieben Speichen, Schlüssel mit sieben Bärten), und es gibt Abdrücke: Wo eine Hand lag, ist der Grünspan weggegriffen und die Bronze glänzt blank, sieben Finger. In manchen Kuppen sitzt noch leuchtendes Öl. Nie erklärt.
- **Palette:** Grünspan (Körper dunkel `#030504 … #1a2e24`, Randlicht `#3f8a6c`/`#a8e6c4`), nasses Schwarz am Boden, Lichtpunkte aus Phosphor (`#d4ff5a`, Kern `#fbffe0`), blanke Bronze (`#a8823e`) als einziger warmer Ton der Maschine, Lampenlicht nur beim Ingenieur.
- **Zeitschicht vor dem Menschen:** keine Gesichter, keine Kleidung außer beim Ingenieur. Die Gegner sind Teile und Diener der Maschine. Fremd ist die Geometrie: Räder, die ineinandergreifen, eine Kette, die durchhängt und trotzdem trägt, Wasser, das bergauf läuft.
- **Abgrenzung im Akt:** Die Salzstollen sind sepia, römisch, untersichtig und senkrecht (Säulen). Die Namenlose Stadt ist rostrot und ein frontaler Fries mit zu niedrigen Stufen. Das Gezeitenwerk ist grün, rund (Kreisbögen statt Senkrechten oder Waagerechten) und lebt von Maschinenteilen, Wasser und kaltem Leuchten.
- **Licht:** Gegenlicht von oben rechts ist der Zulauf: Meerwasser, das durch einen Spalt herabstürzt und leuchtet. Dazu glimmen Phosphorpunkte im Wasser der Kanäle, die langsam vom Betrachter weg, also bergauf, laufen.

## Hintergrund: Kompositionen

Grundform: **der Eingriff**. Große Kreisbögen (angeschnittene Räder) schneiden das Bild, die Kanäle am Boden laufen als Fluchtlinien auf sie zu. Keine Variante ist symmetrisch außer der Wächter-Szene, die bewusst die Mitte betont (das Pendel).

### Variante 0: Das Hauptrad
- **Horizont** y 140, Fluchtpunkt (290, 140). Wir stehen auf genieteten Bronzeplatten vor einer Grube.
- **Aufbau:** Hinter der Grube steigt der obere Bogen des Hauptrads auf (Mitte unter dem Boden, Radius 250, 48 Zähne, dazu eine zweite, versetzte Scheibe als Dicke). Die Scheibe ist voll, die sieben Speichen nur als Rillen, damit es hinter den Figuren ruhig bleibt. Oben rechts der Zeiger, an seiner Spitze ein Phosphorpunkt vor der nächsten Lücke. Links fern zwei kleinere Räder im Dunst. Rechts der Zulauf als heller Spalt.
- **Falsches Detail:** Vier Handabdrücke im Grünspan des Kranzes, blank gegriffen, mit sieben Fingern; vorne links ein Hebel, dessen Griff sieben Mulden hat, auch daran ein Abdruck.
- **Maßstab:** Die eiserne Bühne des Ingenieurs mit Geländer, Leiter und einer Lampe (das einzige warme Licht, erlischt ab `fremdheit` 0,8) klebt an einem Zahn wie ein Schwalbennest.
- **Boden:** drei Kanäle zum Rad, nasser Glanz zur Lichtseite, Leuchtpunkte im Wasser.

### Variante 1: Die Schleusen
- **Horizont** y 136, Fluchtpunkt mittig (240, 136). Frontal, eine Wand quer durchs Bild.
- **Aufbau:** Eine Bronzewand mit Gesims und vier senkrechten Zahnstangen, darin drei Schleusentore im Rundbogen. Jedes Tor hat ein Handrad mit sieben Speichen, in der Nabe ein Phosphorpunkt. Über der Wand fern der Bogen des Hauptrads. Die Kanäle laufen auf die Tore zu, und an den Toren steigt das Wasser als heller Schimmer hinauf.
- **Falsches Detail:** neben jedem Tor ein Abdruck mit sieben Fingern auf Höhe des Handrads.
- **Vordergrund:** links oben ein Rohrbogen, links unten eine Kante, drei Poller am Kanal.

### Variante 2: Im Eingriff
- **Horizont** y 150. Wir stehen auf einem schmalen Gittersteg, links und rechts Kanäle.
- **Aufbau:** Zwei Räder, das linke nah und dunkel, das rechte weiter hinten, greifen oben über uns ineinander. Genau durch den Eingriff stürzt der Zulauf herab. Durch die Speichen sieht man das Gewölbe.
- **Falsches Detail:** Abdrücke auf beiden Kränzen, dort wo man ein Rad mit der Hand drehen würde, wenn man so groß wäre.

### Wächter-Szene: Die Hemmung
- **Horizont** y 162, Untersicht. Hinter dem Pendel fällt Meerwasser als glatte, leuchtende Wand senkrecht herab, breit genug für beide Stellungen des Pendels: die ruhige helle Zone, vor der der Regulator als dunkle Silhouette steht. Darüber ragen nur die unteren Sägezähne des Hemmungsrads herein (der Anker greift hinein). Das Hauptrad links oben ist abgedunkelt und sitzt nicht mehr hinter dem Wächter. Eine niedrige Wand mit vier Abdrücken links und rechts der Wasserwand, zwei Pfeiler, oben eine Zahnstange.
- **Am Boden** der Gradbogen: eine Rinne mit Teilstrichen, über die die Spitze des Pendels streicht. Seine beiden Enden leuchten; das sind die zwei Reihen, zwischen denen der Regulator schwingt.

### Die anderen Arten
- **weg:** Variante nach Seed. **rast:** Im Eingriff, abgedunkelt, mit kleinem Feuer. **werkstatt:** Werkbank in der Variante nach Seed. **kraemer:** Das Hauptrad nah, davor der Stand des Ingenieurs: Zelt aus Segeltuch, Theodolit aus Messing, Kisten, eine Lampe. **ereignis / fund:** die Schleusen, auf den Platten eine offene Kiste des Ingenieurs, darin ein Handschuh mit sieben Fingern, der kurz aufleuchtet. **wandbild:** Variante nach Seed, das Relief aus `World.relief` in Grünspan. **uebergang:** Die Hemmung bei Ebbe: Der Kanal ist leer, am Grund öffnen sich Ringe nach unten wie Stufen, Leuchtpunkte kreisen hinein.
- Nebel nur als schmales Band hinter den Gegnern (deutlich unter einem Drittel der Szene).
- Aufbau einer Szene 230 bis 450 ms (große Räder per Maske über die ganze Fläche), einmal pro Knoten.

## Gegner

Arbeitsweise: Silhouette zuerst als schwarze Fläche, je Gegner mindestens zwei Silhouetten verglichen (die verworfenen stehen als `proben` in den Skripten und werden nicht gebaut), dann Licht, Randlicht, Fase, Dither, dann Pixel nachgearbeitet. Weg A (`"quelle": "skript"`), kein Bild-Generator in der Sitzung.

**Zur Rückmeldung „wenig Binnenform“:** Jedes Skript hat eine zweite Randlicht-Stufe nach innen (`innenKanten`): Wo ein Teil vor einem anderen liegt, fängt seine Lichtkante oben rechts eine Linie inneres Randlicht, die Kante dahinter bekommt Kontaktschatten. Dazu je Figur eigene Binnenform: Lücken zwischen Speichen mit Randlicht an der Lochkante (Zahnrad-Wärter, Regulator), Facetten mit eigener Fase (Gewicht), Muskelsegmente und Bauchband (Kanalaal), Faltentäler, Grate und Ölstreifen (Ölerin), Rippenbögen am Rücken des Zusammengerollten (Regulator), und kleine Lichter: blanke Bronze an Zahnspitzen und Knöcheln, Phosphor in Fingerkuppen.

### Der Zahnrad-Wärter (`zahnradwaerter`)
- **Motiv:** Wartung, die selbst zum Teil wird.
- **Wer er war:** der, der die Zähne sauber hielt. Irgendwann war er einer davon.
- **Was falsch ist:** Kein Kopf. In der Nabe stehen zwei Lichter übereinander statt nebeneinander. Der Arm hat sieben Finger, und die Zahnspitzen oben links sind blank gegriffen.
- **Silhouette:** ein Zahnrad hochkant auf zwei Vogelbeinen, aus der Nabe hängt ein langer Arm.
- **Proben:** ein Rad auf dem Rücken einer gebückten Gestalt (las sich wie die Netzflickerin mit Schild); ein rollendes Rad ohne Beine (nur ein Kreis, kein Körper). Genommen: das Rad auf Beinen.
- **Varianten:** a 13 Zähne, sieben Speichen; b 9 lange Zähne, fünf Speichen, ein zweiter Arm mit einem Schlüssel.
- **Animation:** Leerlauf: Atem, die Finger zucken. Angriff: Er lehnt sich zurück, das Rad dreht an, dann stürzt er nach vorn und reißt den Arm herum, das untere Licht flammt auf. Tod: Er knickt ein und zerfällt.
- **Kniff:** `dornen 3`: Wer ihn schlägt, greift in die Zähne. Fordert Hagel heraus.
- **Muster:** Eingreifen (6), Sperren (Block 6), Doppelzahn (2 × 3).
- **Schwachstelle Salz:** Salz frisst Bronze (die Bronzekrankheit, grüner Puder, der nicht aufhört).
- **Stimme:** `salzlaeufer` (Klicken auf Tonhöhe, wie eine Hemmung).

### Der Kanalaal (`kanalaal`)
- **Motiv:** Ein Tier, das für die Maschine arbeitet.
- **Wer er war:** etwas, das die Kanäle frei hielt, bevor es Menschen gab.
- **Was falsch ist:** Statt eines Kopfes eine Hand mit sieben gekrümmten Fingern, im Handteller ein Auge. Sieben Lichter auf der Seitenlinie. Das Wasser läuft an ihm hinauf.
- **Silhouette:** ein hohes S, das aus einem eckigen Stück Bronzekanal steigt, oben eine offene Hand.
- **Proben:** flach im Kanal mit gehobener Hand (las sich als Schlange mit Fächer); Kopf als geballte Faust (die sieben Finger waren weg). Genommen: hohes S mit offener Hand, die Finger mit zwei Gelenken, zu dir gekrümmt.
- **Varianten:** a S nach rechts ausholend; b gegenläufiges S, höher, anderes Kanalstück.
- **Animation:** Leerlauf: Wiegen, die Finger öffnen und schließen sich, Wassertropfen steigen am Leib hoch, Ringe im Trog. Angriff: zurückziehen, aufbäumen, dann schlägt die Hand nach vorn unten. Tod: Er sinkt in den Kanal.
- **Kniff:** `rein`: Das Wasser in den Kanälen ist älter als jede Fäulnis. Fordert Brackwasser heraus.
- **Muster:** Zupacken (2 × 3), Schlag (6), Abtauchen (Block 6).
- **Schwachstelle Licht:** Er hat nie Licht gesehen, das nicht aus ihm selbst kam.
- **Stimme:** `ertrunkener` (gurgelnd).

### Die Ölerin (`oelerin`)
- **Motiv:** Pflege, die alles wieder gängig macht.
- **Wer sie war:** eine der Dienerinnen, die die Maschine schmieren. Es gab sie, bevor jemand sie so genannt hätte.
- **Was falsch ist:** Statt eines Kopfes sitzt eine Ölkanne auf einem dünnen Hals; der Ausguss reicht bis fast zum Boden, und im offenen Deckel leuchtet das Öl (ihr einziges Auge). In der Hand mit sieben Fingern ein Lappen.
- **Silhouette:** ein schmaler, gebeugter Umhang, ein langer Hals, oben eine flache Kanne, deren Ausguss wie ein Schnabel zu Boden zeigt.
- **Proben:** ein breiter Umhang mit der Kanne tief am Kragen (ein Block mit einem Stock, die Kanne verschwand). Genommen: schmaler Leib, Hals, Kanne als Kopf, danach die Kanne um ein Drittel vergrößert, weil sie im Spiel zu klein war.
- **Varianten:** a gerader Ausguss; b Schwanenhals-Ausguss und eine zweite kleine Kanne an der Hüfte.
- **Animation:** Leerlauf: Am Ausguss bildet sich ein leuchtender Tropfen und fällt. Angriff: sie richtet sich auf, der Ausguss hebt sich, dann sticht sie damit nach vorn unten. Tod: Sie sackt zusammen.
- **Kniff:** `heiler 4`: Sie macht gängig, was klemmt, auch das, was du gerade zerbrochen hast. Fordert Zielwahl heraus.
- **Muster:** Einölen (Block 7), Stich (6), Tropfen (2 × 3).
- **Schwachstelle Feuer:** Sie ist voll Öl.
- **Stimme:** `torfstecherin` (Summen mit geschlossenem Mund).

### Das Gewicht (`gewicht`)
- **Motiv:** Schwerkraft als Absicht.
- **Wer es war:** das Gegengewicht des Hauptrads, oder eines davon.
- **Was falsch ist:** Es hängt an einer Kette, und die Kette hängt durch, als trüge sie nichts. In die Flächen sind Hände mit sieben Fingern gedrückt, in den Kuppen glimmt Öl. Im Deckel ein Spalt, der sich öffnet, wenn es zählt.
- **Silhouette:** ein siebenkantiges Senklot, die Spitze eine Handbreit über dem Boden, darüber eine schlaffe Kette.
- **Proben:** ein Uhrgewicht als langer Zylinder (zu nah am Kreuzgangwächter, eine Säule). Genommen: das Lot mit Spitze.
- **Varianten:** a breiter, kurzer Leib; b schlanker, länger, mit Band.
- **Animation:** Leerlauf: hängt still, rückt um einen Pixel. Angriff: Es wird hochgezogen (der Spalt öffnet sich), fällt, Staub springt seitlich weg. Tod: Es sinkt und zerfällt, die Kette bleibt am längsten.
- **Kniff:** `ansage` (2 Züge laden, dann 14): Es tut nichts. Es zählt. Dann fällt es. Fordert Block-Planung.
- **Schwachstelle Eisen:** Im Werk gibt es kein Eisen; ein Keil davon in der Kette, und es kommt nicht wieder hoch.
- **Stimme:** `schlundtraeger` (Kehlgesang, sehr tief).

### Wächter: Der Regulator (`regulator`), 160 × 180
- **Motiv:** Takt, der einen Körper braucht.
- **Wer er war:** jemand, der die Stange festhielt, damit das Werk nicht zu schnell lief. Er hat nicht losgelassen.
- **Was falsch ist:** Ein Pendel mit einem Körper: oben der Anker der Hemmung wie zwei Schultern mit Krallen, eine Stange aus Wirbeln, unten eine hohle Linse aus Bronze, darin jemand zusammengerollt, die Stange mit sieben Fingern umklammert. Er sieht dich erst an, wenn er ausschlägt.
- **Silhouette:** ein umgedrehter Anker über einer Wirbelsäule, unten ein Ring mit einem Embryo darin.
- **Proben:** eine volle Linse ohne Loch (ein Schild an einer Stange). Genommen: die hohle Linse; danach Linse und Körper um die Hälfte vergrößert, weil er zu dünn war.
- **Animation:** Leerlauf: Pendeln um einen Pixel nach links und rechts (ganzzahlig, damit kein Dither kriecht). Angriff: Ausholen nach hinten, dann der Durchschwung nach vorn auf dich, die Augen weit. Tod: Die Linse sinkt ab, der Anker zerfällt zuletzt. Der Gradbogen am Boden ist Teil des Sprites und bewegt sich nicht.
- **Kniff:** `waechst 1`: Mit jedem Schlag rückt das Hauptrad einen Zahn weiter, und er schwingt ein wenig weiter aus.
- **Besonders:** `schwach_wechsel` Wasser ↔ Eisen, mit dem Takt: Am einen Ende des Ausschlags streift die Linse durch den Kanal (Wasser), am anderen schlägt sie gegen einen eisernen Anschlag, den irgendwer viel später eingebaut hat (Eisen).
- **Muster (wechselt die Seite):** nah: Doppelschlag (2 × 6), fern: Block 12, nah: Durchschwung (15), fern: Hagel (3 × 4), Block 9. Dazu `"pendel": true`: Nach jedem Gegnerzug schwingt er auf die andere Seite, x 0,3 in der hinteren Reihe, dann x 0,7 vorn, und gleitet im Bild dorthin. Der Gradbogen am Boden zeigt den Weg.
- **Stimme:** `windgestalt` (Röhren mit Echo, Oktave tiefer).
- **Beute:** Reliquie *Das Gezeitenrad* (`gezeitenrad`, schon in `items.json`, nicht neu angelegt, nicht im Fundpool).

## Items

| ID | Name | Rar | Kerben | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|---|
| `siebenfingerschluessel` | Siebenfinger-Schlüssel (E W) | selten | 2 | `energie_bleibt 1` | Sieben Umdrehungen (1: Block 3, ziehe 1, Kette 1) | Der Griff hat Mulden für sieben Finger. Mit fünf bekommst du ihn gerade so herum, und er dreht sich danach ein Stück weiter allein. |
| `bronzezahn` | Bronzezahn (E) | gewöhnlich | 1 | – | Eingreifen (1: 2 × 3) | Aus dem Hauptrad gebrochen. Er ist länger als die Lücke, aus der er stammt. |
| `oellappen` | Öllappen (F) | gewöhnlich | 1 | – | Einreiben (1: Brand 3, Behalten) | Riecht nach Lampenöl und nach etwas Älterem. Im Dunkeln leuchtet er schwach, an sieben Stellen nebeneinander. |
| `pegellatte` | Pegellatte des Ingenieurs (W) | selten | 2 | `verwundbar_start 1` | Ablesen (0: ziehe 1, Verwundbar 1) | Rot und weiß gestrichen, in Fuß und Zoll geteilt. Der Pegel steht heute bei einem Maß, das die Latte nicht hat. |

Fundpool: die vier eigenen plus Kompass, Taucherhelm, Ankerkette, Ölmantel, Tiefling-Schuppe, Grubenlampe, Bootshaken. Item-Sprites sind Platzhalter (`watch`, `knife`, `gloves`, `harpoon`). Beute: Zahnrad-Wärter → Bronzezahn, Ölerin → Öllappen, Regulator → Gezeitenrad.

## Ereignisse

| ID | Titel | Kern | Bezug auf Früheres |
|---|---|---|---|
| `gezeitenwerk_abdruecke` | Die Abdrücke | Ein Hebel so hoch wie ein Mast, darunter Abdrücke mit sieben Fingern; der letzte ist kleiner. (Handgriff, Kerbe + Kampf, Öllappen) | – |
| `gezeitenwerk_ingenieur` | Ein Herr mit Messlatte | Er wollte nur kurz nachsehen und fragt dich, welches Jahr wir haben. (Pegellatte, Schleifen) | – |
| `gezeitenwerk_hauptrad` | Ein Zahn | Die Lücke zwischen zwei Zähnen ist so breit wie ein Bett. (Kerbe, Bronzezahn + Gewicht, volle Heilung gegen max. Leben) | – |
| `gezeitenwerk_schleuse` | Die Schleuse | Wasser läuft bergauf in die Kammer, das Handrad hat sieben Mulden. (Heilen + Entdecken, Seltenes + Kanalaal, Verwandeln) | – |
| `gezeitenwerk_oelkammer` | Die Ölkammer | Krüge voll leuchtendem Öl, Ausgüsse an Haken. (Schleifen, Item + Doppelkampf, max. Leben + Streichen) | – |
| `gezeitenwerk_logbuch` | Das Logbuch | Jede Stunde seit 1880 derselbe Eintrag; der letzte handelt von dir. | ja: `event_gesehen: gezeitenwerk_ingenieur`, `item: siebenfingerschluessel`, `job: detektiv` |

Kein Ereignis mit `stummfilm`, damit der Akt seinen einen Stummfilm aus einem anderen Biom behalten kann.

## Musik

g-Moll, Grundton 43 (Salzstollen 53, Namenlose Stadt 46). Ort: Stollen-Hall, fernes Meer, ein Schimmer (Meeresleuchten); Rhythmus `ketten` (Gestänge und Zahnräder), Einzelklänge aus `salz` (Tropfen, Knarren).

## Prüfung

- `node tools/sprites/pruefen.js zahnradwaerter_a zahnradwaerter_b kanalaal_a kanalaal_b oelerin_a oelerin_b gewicht_a gewicht_b regulator`: 9 Sprites, **0 Verstöße**.
- Kontaktbogen neben Chorknabe, Hirte, Netzflickerin: [kontakt-neben-favoriten.png](../bilder/M7/gezeitenwerk/kontakt-neben-favoriten.png). Silhouetten gegen alle 143 vorhandenen Sprites (Gezeitenwerk schwarz, andere grau): [silhouetten-gegen-alle.png](../bilder/M7/gezeitenwerk/silhouetten-gegen-alle.png). Alle Animationen: [animationen.png](../bilder/M7/gezeitenwerk/animationen.png).
- Hintergrund: [hintergrund-varianten.png](../bilder/M7/gezeitenwerk/hintergrund-varianten.png) (V0, V1, V2, Wächter, mit den echten Sprites), [hintergrund-arten.png](../bilder/M7/gezeitenwerk/hintergrund-arten.png), [hintergrund-fremdheit.png](../bilder/M7/gezeitenwerk/hintergrund-fremdheit.png) (fremdheit 1).
- Im Spiel (`newRun('fischer',3,{dev:true,route:['hafen','kapelle','gezeitenwerk','eis','pforte']})`, `Dev.springe(…, 2)`): [im-spiel-kampf.png](../bilder/M7/gezeitenwerk/im-spiel-kampf.png), [im-spiel-kampf-7.png](../bilder/M7/gezeitenwerk/im-spiel-kampf-7.png), [im-spiel-kampf-alle-vier.png](../bilder/M7/gezeitenwerk/im-spiel-kampf-alle-vier.png) (alle vier Gegner gesetzt), [im-spiel-waechter.png](../bilder/M7/gezeitenwerk/im-spiel-waechter.png), dazu beide Pendel-Stellungen: [im-spiel-waechter-links-hinten.png](../bilder/M7/gezeitenwerk/im-spiel-waechter-links-hinten.png), [im-spiel-waechter-rechts-vorn.png](../bilder/M7/gezeitenwerk/im-spiel-waechter-rechts-vorn.png) (Absicht und Name bleiben im Bild, der Wechsel nach einem echten Gegnerzug ist geprüft: 0,5/vorn → 0,3/hinten). Keine Konsolenfehler.
- `node tools/biom-test.js gezeitenwerk 10`: **8/10** überstanden, 0 Fehler; mit Startseed 11: **7/10**, 0 Fehler. Die ersten Werte waren zu hart (5/10, die Niederlagen fast immer mit dem Kanalaal im ersten Kampf); gesenkt wurden Leben und Schaden von Kanalaal, Gewicht und Ölerin. Zum Vergleich mit demselben Test: Salzstollen 2/10, Namenlose Stadt 3/10. Der Regulator hat in 20 Seeds keinen Run beendet; alle Niederlagen kommen aus normalen Kämpfen.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Zahnrad-Wärter | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Das Rad auf Vogelbeinen gibt es sonst nirgends und liest sich schwarz sofort; Speichenlöcher, Nabe und blanke Zahnspitzen geben Binnenform. Die Beine sind fast nur Randlicht-Linien, und bei b liest sich der Arm mit dem Schlüssel leicht als drittes Bein. |
| Kanalaal | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Das S mit der Hand oben ist eigen und unheimlich, die gekrümmten Finger lesen sich als Hand; Segmente, Bauchband und Seitenlinie gliedern den Leib. Der Leib bleibt eine gleichmäßige Röhre, und der Trog ist ein schlichter Kasten. |
| Ölerin | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Kanne mit Schnabel auf dem langen Hals ist eine klare, neue Silhouette; Falten, Grate und Ölstreifen gliedern den Umhang. Der Umhang ist trotzdem die größte dunkle Fläche des Bioms, und der Lappen in der Hand ist kaum zu sehen. |
| Gewicht | 5 | 5 | 4 | 5 | 5 | 4 | **4** | Das siebenkantige Lot mit der schlaffen Kette ist die stärkste normale Figur: jede Fläche hat eigene Fase, der Abdruck mit sieben Fingern ist das falsche Detail auf dem Körper. Die Abdrücke sind im Spiel klein. |
| Regulator | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Anker, Wirbelstange und die hohle Linse mit dem Zusammengerollten sind groß und eindeutig; der Ausschlag auf dich ist die Absicht in Bewegung. Nach der Nacharbeit trägt er außen an Anker, Krallen und Linse zwei Pixel Randlicht zur Lichtseite und eine Linie ringsum, und der Körper in der Linse ist heller und hat einen Phosphor-Schimmer. Im Spiel steht er jetzt klar vor der Wasserwand (vorher Note 3 im Spiel: dunkel auf dunkel vor dem Hauptrad). Der Körper bleibt die dunkelste Stelle der Linse. |
| Hintergrund V0 Hauptrad | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Der Bogen mit Häuserzähnen, die winzige Bühne mit Lampe und die blanken Abdrücke erzählen Maßstab und falsches Detail ohne Text. Der Boden vorne ist eine ruhige dunkle Fläche (dort liegt die UI). |
| Hintergrund V1 Schleusen | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Klarer frontaler Aufbau, Handräder mit sieben Speichen, Kanäle als Fluchtlinien. Die Wand ist etwas gleichförmig. |
| Hintergrund V2 Im Eingriff | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Zwei Räder mit dem Zulauf genau im Eingriff, eigener Aufbau gegenüber V0/V1. Die Räder füllen viel Fläche hinter den Figuren, der Steg wird kaum gelesen. Schwächste Szene, zweimal umgebaut. |
| Hintergrund Wächter | 5 | 5 | 4 | 5 | 5 | 4 | **4** | Die leuchtende Wasserwand hinter dem Pendel trennt Figur und Hintergrund wie der Nebel hinter den Favoriten, der Anker greift ins Hemmungsrad, der Gradbogen liegt am Boden; die Abdrücke tragen das falsche Detail. Die Zahnstange oben liest sich klein wie eine gepunktete Linie. |
| **Hintergrund gesamt** | | | | | | | **4** | |

Nichts unter 4. Überarbeitet wurden unterwegs: Ölerin (Block mit Stock → schmaler Leib mit Hals und Kanne, dann Kanne größer), Kanalaal (Finger wie ein Fächer → Hand mit Gelenken, Flosse als durchgehender Saum, Segmente), Regulator (Linse und Körper zu klein; nach der Abnahme-Rückmeldung kräftigeres Randlicht außen und hellerer Körper, in der Szene die Wasserwand hinter ihm statt des Hauptrads), Gewicht (Kette in Stücken, Abdruck unlesbar), alle Leerlauf-Animationen (kriechender Dither: jetzt Anker bzw. ganzzahlige Verschiebung), Abdrücke im Hintergrund (dunkle Flecken → blank gegriffene Bronze), Hauptrad (Speichenlöcher hinter den Figuren zu unruhig → volle Scheibe mit Rillen), Variante 2 (zweimal umgebaut), Hebel vorne (deckte Gegner in der ersten Reihe).

## Offene Schwächen

- Der Kern zeigt die Absicht „lädt“ (Ansage des Gewichts) als „↑ +0“; das betrifft alle `ansage`-Gegner, nicht nur dieses Paket.
- Das Hauptrad rückt im Hintergrund nicht sichtbar weiter (die Szene ist bis auf Wasser, Licht und Partikel statisch).
- Item-Icons sind Platzhalter.
