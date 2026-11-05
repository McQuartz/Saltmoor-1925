# Das Glasmeer (`glasmeer`) · Akt IV

Biom-Paket nach [paket-format.md](../paket-format.md). Steckbrief in [05-inhalte.md](../05-inhalte.md) Abschnitt 3. Zeitschicht Akt IV: **vor dem Leben**. Daten: `prototype/data/biome/glasmeer.json`, Hintergrund: `prototype/js/scenes/world/glasmeer.js`, Sprites: `tools/sprites/gegner/{glasschwimmer,splitterchor,vorhergehende,leithund,voraus}.js`, Zonenpalette: `tools/sprites/zonen/glasmeer.json`. Bilder: [bilder/M7/glasmeer/](../bilder/M7/glasmeer/). Alles per Skript gezeichnet (Weg A, `quelle: skript`).

## Ort

Unter dem Eis liegt eine Ebene aus schwarzem Glas, glatt bis an den Horizont. Darüber spannt sich das Eis wie ein Himmel: Platten, Pressrücken, hängende Zapfen. Licht gibt es nur von unten: Tief unter dem Glas wehen Vorhänge aus grünem Polarlicht, und das Eis darüber fängt ihren Widerschein. Der Boden ist ein Spiegel. In der Ferne zeigt er nur die Eisdecke, in der Nähe sieht man durch ihn hinunter ins Grün.

Im Glasmeer liegen die Reste einer **Expedition von 1925**: ein Schlitten mit Flagge, ein halb versunkenes Zelt, eine Plattenkamera auf dem Dreibein, ein Kasten mit zerbrochenen Glasnegativen. Die Mannschaft ist nicht fort. Sie ist nur vorausgegangen.

- **Wahrzeichen:** **die Gestalt, die es nur im Spiegel gibt.** Im Boden steht kopfüber eine riesige, schmale Figur mit zu langen Armen und zu kleinem, geneigtem Kopf, umrandet vom Polarlicht, das hinter ihr steht. Darüber, auf dem Glas, ist nichts. Sie steht in jeder Kampfvariante an einer anderen Stelle; in der Wächter-Szene steht sie aufrecht in der Spiegelwand.
- **Falsches Detail:** **dein Spiegelbild ist einen Schritt voraus.** Vorn im Glas, am unteren Bildrand, geht eine kleine Gestalt kopfüber von dir weg, im Schritt. Über ihr steht niemand: Es ist deines. In der Wächter-Szene steht es klein in der Spiegelwand, schon einen Schritt weiter als der Voraus. In den Texten wird es nie erklärt.
- **Palette:** Schwarzglas mit kaltem Grünstich (Körper `#020305 → #1b2a2e`), Eis grau-grün, **Polarlicht-Grün als einziges Licht** (Randlicht innen `#2c6a4c`, außen `#aef2bc`, Augen `#6dff9e`, Kern `#f4fff6`). Bewusst nicht blau (Schwarzes Eis) und nicht knochenweiß (Walkathedrale); dazu keine Wellen und keine Gesichter im Eis, sondern Spiegel, Facetten und Licht aus der Tiefe.
- **Gegenlicht:** ein Riss in der Eisdecke oben rechts, in dem sich das grüne Licht von unten sammelt; er gibt allen Figuren und Formen ihr Randlicht oben rechts. Dazu das **Unterlicht**: Alle Figuren werden an ihren Unterkanten gedithert grün angestrahlt (Hilfsfunktion `glas.unterlicht` in `glasschwimmer.js`).
- **Krämer:** **Dein Spiegelbild** (`"art": "spiegel"`): Es breitet im Glas zu deinen Füßen eine Decke aus, die es auf deiner Seite nicht gibt, und verkauft die Waren des letzten Krämers mit vertauschten Stoffen. Im Bild: eine kopfüber stehende Gestalt im Boden mit einer Decke voller Ware, oben ist niemand.

## Hintergrund: Kompositionen

Bildaufbau **Spiegel**: Die obere Bildhälfte (Eisdecke) kehrt in der unteren gespiegelt und verkürzt wieder. Jeder Pixel des Bodens rechnet den gespiegelten Punkt der Decke aus (`deckeFn`), dunkler, und mischt mit der Nähe den Blick ins Glas hinein (Fresnel grob: fern Spiegel, nah durchsichtig). Die Eisplatten der Decke sind Zellen in Weltkoordinaten, also laufen ihre Kanten perspektivisch und erscheinen im Boden noch einmal; jede Platte hat ihre eigene Neigung zum Licht (Facetten). Risse in der Glasfläche sind die Fluchtlinien; manche leuchten. Alles, was auf dem Glas steht (Splitter, Schlitten, Zelt, Kamera, Kasten, Kocher, die Spiegelwand), wirft ein verkürztes, nach unten ausdünnendes Spiegelbild (`spiegeln`). Gegen die „große ruhige Leerfläche“: Platten und Pressrücken in der Decke, ihr Spiegelbild im Boden, Fließbänder im Glas wie bei Obsidian, die Polarlicht-Bänder in der Tiefe und die Gestalt im Spiegel füllen jede Fläche. Nebel nur als schmales Dunstband am Horizont (unter 5 % der Fläche).

### Variante 0: Die Spiegelebene
- **Horizont** y 118, Fluchtpunkt (214, 118). Blickpunkt: stehend auf der offenen Fläche.
- **Blickführung:** Die Eisplatten der Decke laufen zum Horizont, ihr Spiegelbild im Boden läuft zurück. Rechts oben der leuchtende Riss, von ihm eine Glanzbahn quer über das Glas.
- **Wahrzeichen:** die Gestalt rechts der Mitte, Füße am Horizont, kopfüber bis in den Mittelgrund.
- **Details und warum:** vorn links der Schlitten der Expedition mit Flagge (Maßstab: ein Schlitten gegen die Gestalt), Obsidiansplitter fern am Horizont und einer nah rechts mit grünem Licht im Bruch, Zapfen von der Decke. Vorn rechts die Kante einer gekippten Glasplatte, links ein Splitter (Rahmung). Dein Spiegelbild vorn Mitte.

### Variante 1: Das Lager
- **Horizont** y 128, Fluchtpunkt links (150, 128), damit sich der Aufbau von V0 unterscheidet.
- **Wahrzeichen:** die Gestalt links, groß und nah.
- **Details:** das halb im Glas versunkene Zelt (Eingang glimmt grün), die Plattenkamera auf dem Dreibein, ein Splitter rechts; vorn eine Schlittenkufe und eine Kiste. Dein Spiegelbild vorn rechts.

### Variante 2: Die Bruchkante
- **Horizont** y 112, Fluchtpunkt rechts (318, 112).
- **Blickführung:** Das Glas ist in gekippte Platten zerbrochen; aus den Spalten (Linien in Weltkoordinaten) scheint das Polarlicht herauf, das Licht steigt als Partikel auf.
- **Wahrzeichen:** die Gestalt in der Mitte, fern zwischen den Platten.
- **Details:** vier gekippte Platten mit Randlicht und Kontaktschatten, große Splitter links und rechts, vorn links eine senkrecht stehende Platte angeschnitten. Dein Spiegelbild vorn Mitte. Lauteste Variante (viel Grün).

### Wächter-Szene: Die Spiegelwand
- **Horizont** y 132, symmetrisch. Hinter dem Wächter steht eine senkrechte Wand aus schwarzem Glas, so hoch wie die Halle, mit gebrochener Oberkante und Fase. In ihr, **aufrecht**, die Gestalt (links) und klein **du** (rechts), einen Schritt weiter. Die Wand spiegelt die Decke, zwei Glanzstreifen laufen schräg darüber, ihr eigenes Spiegelbild liegt verkürzt im Boden. Zapfen und Splitter links und rechts, Platten vorn als Rahmung. Der Voraus steht davor, sein Nachbild neben ihm.

### Andere Arten
- **weg:** Variante nach Seed. **rast:** Lager, ein Spirituskocher mit grüner Flamme (animiert, Licht auf Ebenen 3/4). **werkstatt:** Lager mit Werkbank (Baustein). **kraemer:** Spiegelebene; im Boden kopfüber dein Spiegelbild auf einer Decke mit Ware, oben nichts. **ereignis/fund:** Lager, der aufgesprungene Plattenkasten, davor Scherben mit Gesicht nach oben (zwei grüne Augenpunkte je Scherbe). **wandbild:** Bruchkante, Relief im Biomstil (Schwarzglas, grüne Kerben). **uebergang:** Spiegelebene; unter der Gestalt ist das Glas dünn, ein Kreis aus leuchtenden Rissen, der pulsiert.
- **Animation:** wogendes Licht unter dem Glas (einzelne Pixel), blinkende Augen der Gestalt, sinkender Diamantstaub aus der Decke, steigendes Licht aus den Spalten (V2), Kocherflamme. `Math.random` nur in Partikeln.

## Gegner

Leitidee: **Was das Glas zeigt, ist schon geschehen.** Die Mannschaft der Expedition und ihr Gerät, vom Glas einen Schritt vorausgenommen. Jede Figur hat sichtbare Binnenform (Streifen, Facetten, Faltenwurf, Fase) und mindestens ein inneres Licht (grünes Licht in Bruchkanten, Brillen, Scherbengesichter, Unterlicht).

### Der Glasschwimmer (`glasschwimmer`)
- **Motiv:** das Langstreckenschwimmen der 1920er (Kanalschwimmer, Wollbadeanzug, Lederkappe).
- **Wer er war:** ein Schwimmer der Expedition, der unter dem Eis hinausschwamm, weil drüben Licht war.
- **Was falsch ist:** Er krault durch das Glas, als wäre es Wasser. Vor seinem Kopf steht eine Bugwelle aus Glas, die Spritzer hängen als Glasperlen in der Luft, und wo er die Fläche durchbricht, leuchtet von unten das Grün heraus. Der Mund steht offen zum Atemholen, seit Jahren.
- **Silhouette:** flach liegender Leib, aus dem ein Arm im hohen Kraulbogen ragt, vorn der Kopf mit Brille, hinten die Ferse über dem Glas.
- **Kniff:** `ansage` (2 Züge, 14): Er taucht ab und kommt mit einem großen Schlag hoch. Fordert Block-Planung. (Steckbrief-Idee „unverwundbar außer im Zug nach deinem Angriff“ gibt es im Kern nicht, siehe Vorschläge.)
- **Muster (22 Leben):** durch den Kniff: lädt, lädt, Schlag 14 (+ Tiefe).
- **Schwachstelle Wasser:** Echtes Wasser erinnert ihn daran, dass das hier keins ist; er vergisst zu schwimmen.
- **Stimme:** `ertrunkener` (gurgelnde Stimme).
- **Varianten:** a mit hängendem Unterarm und Lederkappe, b mit gestrecktem Arm nach vorn oben, gestreifter Kappe, höherer Bugwelle. **Verworfen:** Kopfsprung senkrecht aus dem Glas (liest sich als Hasenohren).

### Der Splitterchor (`splitterchor`)
- **Motiv:** Glasplatten-Negative, der Fotograf der Expedition.
- **Wer er war:** vierzig Aufnahmen der Mannschaft, in der Kiste zerbrochen.
- **Was falsch ist:** In jeder Scherbe ist ein Gesicht im Negativ: die Augen und der singende Mund hell, die Pelzkapuze als heller Ring. Sie singen mehrstimmig, nacheinander. Bricht eine Platte, hat jede Hälfte das ganze Gesicht.
- **Silhouette:** ein Fächer aus kantigen, gebrochenen Glasplatten, der aus einem zerborstenen Holzkasten wächst.
- **Kniff:** `nachlass teilt` (wird zu zwei halben Splitterchören). Fordert Reihenfolge und Flächenschaden.
- **Muster (16 Leben):** Schnitt (4), Abschirmen (Block 6), Klirren (6).
- **Schwachstelle Licht:** Licht belichtet die Platten neu, und was belichtet ist, schweigt.
- **Stimme:** `chorknabe` (hoher Chor, hier: nasser Finger auf Glas).
- **Varianten:** a fünf Platten, b vier Platten und eine abgebrochene liegt vorn. **Verworfen:** Bündel aus drei senkrechten Platten (ein Block, kein Fächer).

### Der Vorhergehende (`vorhergehende`)
- **Motiv:** der Kundschafter, der mit der Eisstange das Eis abklopft.
- **Wer er war:** der, der vorausging. Er ging so lange voraus, bis er auch sich selbst voraus war.
- **Was falsch ist:** Unter ihm im Glas steht sein Spiegelbild (verkürzt, im Sprite gezeichnet) **in einer anderen Haltung**: Steht er still, holt es schon mit der Stange aus (die Stange im Spiegel ist hell); schlägt er zu, steht es schon wieder; fällt er, ist es schon fort.
- **Silhouette:** hagere Gestalt mit großer zottiger Kapuzenkrause wie ein Strahlenkranz, kurzem Anorak, zu langen dünnen Beinen und langer Stange, darunter ihr dunkles Spiegelbild.
- **Kniff:** `verborgen` (der Kern zeigt jetzt „?“ statt der Zahl). Was er tut, hat sein Spiegelbild schon getan; du siehst nur die Hälfte. Fordert Vorsicht.
- **Muster (21 Leben):** Stoß (7), Block 8, zwei Stöße (2 × 3), Stoß (5).
- **Schwachstelle Fäulnis:** Fäulnis braucht Zeit, und Zeit ist das Einzige, dem er nicht voraus ist.
- **Stimme:** `nachgeher` (Formanten „o“, tief; der Nachgeher ist sein Gegenstück).
- **Varianten:** a mit Lot an der Stange, b länger, gebeugt, mit Haken. **Verworfen:** ohne Spiegelbild (dann ist er nur ein Mann mit Stock).

### Der Leithund (`leithund`)
- **Motiv:** das Hundegespann (1925: der Serumlauf nach Nome).
- **Wer er war:** der Leithund der Expedition, noch im Geschirr.
- **Was falsch ist:** Seine Beine sind Stelzen geworden, und sein Fell ist zu schwarzem Glas erstarrt: lange Nadeln, die **falsch herum** wachsen, zum Kopf hin. Der Kopf hängt tief zwischen den Vorderbeinen; er sieht immer ins Glas, auf das, was darunter läuft. Die Zugleine hinter ihm ist straff und führt schräg in den Boden. An der Flanke bricht das Glas durch, grünes Licht im Riss.
- **Silhouette:** Vierbeiner auf zu langen Beinen, gesträubter Nadelkamm, hängender Kopf, Huskyrute über dem Rücken, schräge Leine nach hinten in den Boden.
- **Kniff:** `dornen 3`: Wer oft zuschlägt, schneidet sich oft. Fordert Hagel (viele Treffer). (Ersetzt den Schwarzglas-Fisch aus dem Steckbrief: Der Kern kennt kein „Brand zurückspiegeln“, und ein Fisch im Glas hätte sich mit dem Schwimmer gedoppelt.)
- **Muster (18 Leben):** Biss (7), Block 7, Schnappen (2 × 3).
- **Schwachstelle Feuer:** Glas, das zu schnell warm wird, springt.
- **Stimme:** `nest` (schnarrendes Zirpen auf Tonhöhe, hier Glasnadeln).
- **Varianten:** a, b mit längeren Beinen, magerer, weniger Nadeln. **Verworfen:** Kopf hoch (dann ist es nur ein Hund).

### Wächter: Der Voraus (`voraus`, 160 × 180)
- **Motiv:** das Spiegelbild, der Doppelgänger, das Vorgefühl.
- **Wer er ist:** dein Spiegelbild, als Reisender von 1925 (Ulster mit Pelerine, Homburg, Koffer), ganz aus schwarzem Glas, geschliffen in Facetten. Das Gesicht ist glatt wie ein Spiegel, nur zwei Augen darin.
- **Was falsch ist:** Er hält einen Fächer aus gläsernen Karten (deine nächsten) und spielt sie, bevor du sie ziehst. Hinter ihm steht sein grünes Nachbild, dort, wo er eigentlich noch sein müsste. In den Bruchkanten (Gesicht, Brust, Mantel) steht grünes Licht; der Saum zerfällt hinten in schwebende Splitter.
- **Silhouette:** großer Mann im langen Mantel, im Schritt nach vorn, Hut, vorgestreckte Hand mit Kartenfächer, Koffer hinten, dahinter versetzt das gedithert grüne Nachbild.
- **Kampf (78 Leben, 5 Züge):** Schlag (12), Block 12, drei Karten (3 × 5), Atemholen (+3 Stärke), letzter Zug (16). **Kniff `voraus`** (neu im Kern): Nach seinem Zug spielt er die oberste Karte deines Ziehstapels vor dir (Angriff trifft dich, sonst Block) und ist **schwach gegen den Stoff, den du in diesem Kampf am wenigsten gespielt hast** (`weak` in den Daten ist nur der Startwert). Kein `besonders`.
- **Angriff:** Er zieht die Karte zurück (Ausholen), wirft sie (eine leuchtende Karte fliegt nach vorn), Nachschwingen. **Tod:** Risse flammen auf, er zerspringt.
- **Stimme:** `rufer` (menschliche Formanten „a“).
- **Beute:** Reliquie *Taschenspiegel des Reisenden* (`kette_start 1`: jeder Zug beginnt, als wäre schon eine Reaktion geschehen; Stammkarte *Vorausspielen*: 1, 3 Schaden, Kette 2, Behalten). Stützt Kettenwerk.
- **Verworfen:** stehend ohne Schritt, Karten und Nachbild (ein Mann im Mantel).

## Items

| Item | Bereich | Stoff | Seltenheit | Eigenschaft | Stammkarte |
|---|---|---|---|---|---|
| Glasscherbe | Waffe | Blut | gewöhnlich, 1 Kerbe, 20 | – | Scherbenschnitt: 1, 2 × 3 Schaden |
| Polarlicht im Glas | Talisman | Licht | selten, 2 Kerben, 42 | `verwundbar_start 1` | Grünes Licht: 1, 3 Schaden, Verwundbar 2, ziehe 1 |
| Spiegelscherbe | Talisman | Glaube | selten, 2 Kerben, 44 | `reaktion_schaden 1` | Zurückwerfen: 1, Block 6, Kette 1 |
| Schneebrille | Kleidung | Salz | gewöhnlich, 1 Kerbe, 22 | – | Durch den Schlitz: 1, Block 5, ziehe 1 |
| Taschenspiegel des Reisenden | Talisman | Licht | Reliquie (nur Wächter), 2 Kerben | `kette_start 1` | Vorausspielen: 1, 3 Schaden, Kette 2, Behalten |

Fundpool: die vier eigenen Items und Sturmlaterne, Grubenlampe, Kompass, Robbenfell, Wollmantel, Harpune, Tarotkarten, Taucherhelm, Salzbeutel, Fischmesser.

## Ereignisse (6, alle aus diesem Ort)

| ID | Szene | Bezug auf Früheres | Folgen |
|---|---|---|---|
| `glasmeer_schritt` | Du bleibst stehen, dein Spiegelbild noch nicht | | Schleifen, Handgriff, Heilung |
| `glasmeer_gestalt` | Die Gestalt unter dem Glas | `if item lantern` | Reliquie (teuer), Kerbe |
| `glasmeer_lager` | Das Lager; das Tagebuch endet in deiner Handschrift | | Schneebrille, Handgriff, Heilung |
| `glasmeer_platte` | Die belichtete Platte zeigt dein Gesicht im Negativ (Stummfilm) | | Kampf + seltenes Item, Spiegelscherbe, Gold |
| `glasmeer_leine` | Die Leine, die ins Glas führt | `if item glasscherbe` | Kampf + Polarlicht, Umritzen, Item tauschen |
| `glasmeer_wartet` | Es wartet, diesmal vor dir | `if event_gesehen glasmeer_schritt` | Reliquie, Item tauschen, Heilung |

## Musik

Gis-Moll (`root` 56, anders als Eis in fis), `amb` eisgrund 0,05 und schimmer 0,045, Rhythmus `glocken` (Glöckchen aus Glas), Einzelklänge des Eises. Ort: „Glas singt unter dem Eis, ein tiefes Dröhnen, jeder Schritt hallt einen Augenblick zu früh“.

## Umsetzung und Prüfung

- **Sprites:** `node tools/sprites/pruefen.js glasschwimmer_a glasschwimmer_b splitterchor_a splitterchor_b vorhergehende_a vorhergehende_b leithund_a leithund_b voraus`: **9 Sprites, 0 Verstöße.** Der Wächter nutzt 160 × 180. Gemeinsame Glas-Hilfen (`riss`, `streif`, `muschel`, `unterlicht`) stehen als Export `glas` in `glasschwimmer.js`, die anderen Gegner holen sie von dort. Die Spiegelbilder (Vorhergehender) und das Nachbild (Voraus) rendert das Skript selbst mit `lib.render` und setzt sie in den Puffer.
- **Hintergrund:** alle Arten bauen ohne Fehler, 300–700 ms je Szene in headless Chromium.
- **Im Spiel** (`newRun('fischer',3,{dev:true,route:['hafen','kapelle','salz','glasmeer','pforte']})`, `Dev.springe('kampf_schwer'|'waechter',3)`, dazu Krämer, Ereignis, Rast, Werkstatt, Wandbild): **keine Konsolenfehler**. Der Spiegel-Krämer verkauft „…, gespiegelt“.
- **Abstimmung** mit dem neuen `tools/biom-test.js` (Akte davor gespielt): Seeds 1–10 **8/9**, 11–20 **5/8**, 21–30 **6/10** überstanden (Vorlauf-Tode nicht gewertet), zusammen **19/27 = 70 %**, 0 Fehler. Schwarzes Eis zum Vergleich auf denselben Seeds 1–10: 6/9. Die Niederlagen fallen fast alle im schweren Kampf (Ebene 2) mit drei Gegnern; der Wächter hat in 27 Läufen niemanden besiegt, kostet aber deutlich Leben. Die Werte normaler Gegner liegen dadurch bei 16–22 Leben (Mitte des Rahmens); die Härte kommt aus den Kniffen (Ansage 14 + Tiefe, Teilen, Dornen, verborgene Absicht).
- **Bilder:** [kontakt.png](../bilder/M7/glasmeer/kontakt.png) (neben Chorknabe, Hirte, Netzflickerin), [silhouetten.png](../bilder/M7/glasmeer/silhouetten.png) (mit Skizzen und allen vorhandenen Gegnern), [animation.png](../bilder/M7/glasmeer/animation.png), [varianten.png](../bilder/M7/glasmeer/varianten.png), [varianten-mit-gegnern.png](../bilder/M7/glasmeer/varianten-mit-gegnern.png), [arten.png](../bilder/M7/glasmeer/arten.png), [im-spiel-kampf.png](../bilder/M7/glasmeer/im-spiel-kampf.png), [im-spiel-kampf-2.png](../bilder/M7/glasmeer/im-spiel-kampf-2.png), [im-spiel-kampf-3.png](../bilder/M7/glasmeer/im-spiel-kampf-3.png), [im-spiel-waechter.png](../bilder/M7/glasmeer/im-spiel-waechter.png).

## Vorschläge an den Kern

1. **Spiegelboden:** ein Biom-Feld `spiegel: true`, mit dem `buehne.js` jedes Gegner-Sprite gekippt, verkürzt (×0,5) und abgedunkelt unter den Fußpunkt zeichnet. Dann spiegelt das Glas alle Gegner, nicht nur den Vorhergehenden, und das falsche Detail ließe sich ausspielen: Das Spiegelbild zeigt schon das Bild der **nächsten** Absicht (Angriff-Bild, wenn er als Nächstes angreift).
2. **Kniff `abgetaucht`** für den Glasschwimmer, wie im Steckbrief: Er ist unverwundbar, außer im Zug nach deinem Angriff. Heute näherungsweise `ansage`.
3. **Kniff `spiegelt {status}`** (Schwarzglas-Fisch aus dem Steckbrief): Brand oder Gift, das man ihm gibt, geht zur Hälfte zurück auf dich. Heute nicht genutzt (Leithund mit `dornen`).
4. **`nachlass teilt` mit Grenze:** Die Hälften haben heute keinen Kniff mehr; ein Feld `tiefe` (wie oft weiter geteilt wird) würde den Splitterchor zum echten Chor machen, der kleiner und mehr wird.
5. **Ereignisbilder 160 × 90** für die sechs Ereignisse (die Bildbeschreibungen stehen in `bild`).

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / im Spiel. Gesamt = schwächster Punkt.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Glasschwimmer | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Einziger liegender Gegner im Spiel, Kraulbogen sofort lesbar; Streifen des Badeanzugs, Schulterblatt und der Lichtsaum an der Wasserlinie geben Binnenform. Die Hand ist klein und wirkt im Stand wie ein Haken. |
| Splitterchor | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Kantiger Plattenfächer, Negativgesichter mit hellen Augen und Mund, grüne Bruchkanten. Dass es Fotoplatten sind, zeigt erst der Kasten und der helle Plattenrand; nächste Silhouette ist der Stockfächer des Bittstellers. |
| Vorhergehender | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Kapuzenkrause als Strahlenkranz und Stelzenbeine sind eigen; das Spiegelbild darunter mit der hellen, schon erhobenen Stange trägt das Konzept, ist im Spiel aber klein und dunkel. Der Anorak bleibt eine eher dunkle Fläche mit wenigen Falten. |
| Leithund | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Nadelkamm gegen den Strich, hängender Kopf, Leine ins Glas: unheimlich und lesbar. In Variante 2 verschwindet der dunkle Leib zwischen den hellen Spalten etwas, Randlicht und Riss halten ihn. |
| Der Voraus (Wächter) | 5 | 4 | 4 | 5 | 4 | 5 | **4** | Stärkste Figur des Pakets: Facetten, Risse mit grünem Licht, Spiegelgesicht, Kartenfächer und das grüne Nachbild. Vor der Spiegelwand mit der Gestalt im Spiel sehr klar. Pelerine und Mantelsaum könnten noch mehr Faltenwurf haben. |
| Hintergrund V0 Spiegelebene | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Decke und ihr Spiegelbild im Boden, die kopfüber stehende Gestalt, dein kleines Spiegelbild vorn. Der Schlitten liest sich eher als Hütte. |
| Hintergrund V1 Lager | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Zelt, Kamera und Gestalt links, Fluchtpunkt links; ruhigste Variante, die Mitte des Bodens trägt nur Spiegel und Fließbänder. |
| Hintergrund V2 Bruchkante | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Gekippte Platten mit Licht aus den Spalten, eigener Aufbau. Lauteste Variante: das Grün rechts konkurriert mit dunklen Gegnern (schon gedämpft). |
| Wächter-Szene Spiegelwand | 5 | 4 | 4 | 5 | 5 | 5 | **4** | Die aufrechte Gestalt und du klein in der Wand, davor der Voraus: Wahrzeichen und falsches Detail zugleich. Die Wandfläche selbst ist zwischen den Glanzstreifen noch ruhig. |

Nichts liegt unter 4. Offene Schwächen für eine spätere Runde: Hand des Schwimmers, Faltenwurf im Anorak des Vorhergehenden, dessen Spiegelbild im Spiel größer (oder Vorschlag 1), Schlitten in V0 als Schlitten lesbarer, Wandfläche der Wächter-Szene mit mehr gespiegelter Struktur.
