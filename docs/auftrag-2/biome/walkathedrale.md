# Die Walkathedrale (`walkathedrale`) · Akt IV

Biom-Paket nach [paket-format.md](../paket-format.md). Steckbrief in [05-inhalte.md](../05-inhalte.md) Abschnitt 3. Zeitschicht Akt IV: **vor dem Leben**. Hier liegt etwas, das älter ist als alles, was atmet, und es ist noch nicht fertig.

## Ort

Unter dem schwarzen Eis liegt das Gerippe eines Wals, so groß wie ein Berg. Die Expedition von 1903 hat es gefunden, einen Bohlenweg zwischen die Rippen gelegt und Tranlampen an Harpunenschäfte gehängt. Man geht durch die Rippen wie durch ein Kirchenschiff: Spitzbögen links und rechts, oben der Grat der Wirbelsäule, am Ende eine dunkle Öffnung.

- **Wahrzeichen:** das Herz. Ein dunkler Raum am Ende des Schiffs, in dem es sehr langsam schlägt. In jeder Szene als Spitzbogen-Öffnung mit rotem Glimmen, das im Doppelschlag pulsiert (kurz, kurz, lange Pause). In der Wächter-Szene ist man drin.
- **Falsches Detail:** Das Skelett ist nicht fertig, es wächst nach innen. Die Rippenenden haken nach innen über den Weg, junge, glatte Rippen treiben aus dem Eis und krümmen sich zur Mitte, in der Krypta biegen sich sogar die Eiszapfen zur Wirbelreihe. Mit `fremdheit` werden die Triebe größer, und die Tranlampen der Menschen verlöschen von hinten nach vorn.
- **Licht:** kalt durch einen Riss im Eis hinten oben rechts (Gegenlicht und Randlicht wie bei den Figuren), warm aus dem Mark (Risse in den Knochen glimmen korallenrot) und aus den Tranlampen (gelb).
- **Palette:** Blauschwarz für Körper und Eis, Knochenweiß als Randlicht, Mark-Korallenrot als inneres Licht, Trangelb für die Menschen. Abgrenzung im Akt: Das schwarze Eis ist blau mit roten Augen und Gesichtern im Eis, das Glasmeer schwarzes Glas mit grünem Licht. Hier sind es Knochen (hell, porös) und warmes Licht von innen.
- **Krämer:** Der Walfänger. Er hat den Wal 1903 gefunden und dient ihm jetzt; er sitzt zwischen zwei Tranfässern unter der vierzehnten Rippe und fragt, ob du dein Gold nicht lieber dem Herzen geben willst.

## Hintergrund: Kompositionen

Datei `prototype/js/scenes/world/walkathedrale.js`. Bildaufbau-Idee: **Gewölbe**. Wiederholte Bögen in die Tiefe, ein Grat oben, ein Ziel am Ende. Unheimlich ist, dass die Bögen sich nach innen schließen.

### Variante 0: Das Kirchenschiff
- **Horizont** y 128, Fluchtpunkt (250, 128). Blick entlang der Wirbelsäule.
- Zwölf Rippenpaare als Spitzbögen in die Tiefe, vorne angeschnitten (Rahmen, Ebene 5), hinten im Dunst. Oben der Grat mit Wirbelknoten und Dornfortsätzen. Jede dritte Rippe hat einen Riss, aus dem das Mark glimmt.
- Am Fluchtpunkt die Öffnung zum Herzen, darin das pulsierende Glimmen.
- Boden: Eis mit Rissen und eingefrorenen Splittern, in der Mitte der Bohlenweg der Expedition, Tranlampen an Stöcken (Maßstab: Mensch gegen Bogen).
- Falsches Detail: Die Rippenenden haken nach innen; fünf junge Rippen treiben aus dem Eis zur Mitte.

### Variante 1: Die Flanke
- **Horizont** y 150, von außen auf dem Eis neben dem Wal.
- Das ganze Gerippe in der Ferne, halb in einem Eisrücken: Schädel links (Augenhöhle glimmt), Grat als Bogen, zwanzig Rippen als Kamm. Hier sieht man, dass er so groß ist wie ein Berg. Durch die Rippen das Glimmen des Herzens.
- Vorne das Lager der Expedition (Zelt mit Licht innen, Schlitten, Lampe), Eisschollen, zwei Rippenbruchstücke im Eis, davon eins mit glimmendem Riss; junge Rippen, alle zum Wal hin gekrümmt.

### Variante 2: Die Wirbelkrypta
- **Horizont** y 140, Fluchtpunkt (300, 140). Niedrige Decke aus Eis mit Zapfen.
- Links stehen die Wirbel wie Säulen einer Krypta in einer Reihe in die Tiefe; durch jeden geht der Rückenmarkskanal, und darin glimmt das Mark: eine Reihe Lichter in die Ferne. Rechts die Rippenansätze wie Strebepfeiler, die nach innen haken.
- Boden mit Bohlenweg rechts, Lampen, Funken aus dem Mark steigen langsam.

### Wächter-Szene: Die Herzkammer
- **Horizont** y 150, frontal. Ein dunkler Raum mit violettem Grund; die Wände sind Muskelbalken, die wie verdrehte Säulen in drei Tiefen stehen. Von der Decke hängen Sehnenfäden wie Glockenseile.
- Von beiden Seiten wachsen Knochendorne zur Mitte, wo das Herz steht, einige mit glimmenden Rissen. Vorne rahmen zwei große Rippenbögen. Hinter dem Herzen ein Glimmen, das im Doppelschlag pulsiert. Boden: eine Schale aus Knochen, Rillen laufen zur Mitte.

### Andere Arten
- **weg:** die Variante des Seeds. **rast:** im Kirchenschiff, ein Feuer aus Knochen und Tran auf dem Bohlenweg, die Ferne abgedunkelt. **werkstatt:** in der Krypta, Werkbank der Expedition. **kraemer:** an der Flanke, Tranfässer, Gestell mit Harpunen und Flenseisen, Lampe auf dem Fass. **ereignis/fund:** im Kirchenschiff, ein geritzter Walzahn auf einer Seekiste, daneben eine Tranlampe; im Zahn glimmt es. **wandbild:** Relief-Stil (fünf Figuren, gebeugt, zu einem Großen). **uebergang:** in der Herzkammer; unter dem Herzen ist der Boden eine runde Öffnung mit Knochenzähnen, nach innen gekrümmt, von unten kommt kaltes Wasserlicht (zur Pforte).
- Nebel nur als schmales Band am Horizont (deutlich unter einem Drittel). Aufbau 150–500 ms je Szene in headless Chromium.

## Gegner

Leitidee: die Mannschaft der Expedition. Jeder hat dem Wal etwas gegeben, und der Wal hat angefangen, ihn nachzubauen. Jeder trägt **ein inneres Licht** (Mark oder Tran) und Binnenform (Fase, Falten, Glieder, Kalk), keine leeren dunklen Flächen.

### Der Rippenkriecher (`rippenkriecher`)
- **Motiv:** das Gewölbe, das man mitträgt.
- **Wer er war:** ein Flenser der Expedition, der im Brustkorb des Wals schlief, weil es dort wärmer war.
- **Was falsch ist:** Seine eigenen Rippen sind ihm aus dem Rücken gewachsen, ein Fächer aus Sicheln, und er kriecht darunter auf den Händen, den Kopf am Boden. Die Spitzen biegen sich schon wieder nach innen, zu ihm. Unter dem Gewölbe ist seine Brust offen, und das Mark glimmt (Licht fällt auf die Rippenwurzeln). Variante b: mehr Rippen, die Tranlampe hängt ihm am Bügel aus dem Mund.
- **Silhouette:** ein tief kriechender Mann mit einem Fächer aus gebogenen Rippen auf dem Rücken.
- **Kniff:** `brecher`: Die Rippen schließen sich um dich, was du dazwischen hältst, bricht. Fordert Bollwerk heraus.
- **Muster (20 Leben):** Zuschnappen (5), Gewölbe (Block 6), Krallen (2 × 2).
- **Schwachstelle Eisen:** Knochen bricht unter Hammer und Säge.
- **Stimme:** `nachgeher` (menschliche Formanten »o«, tief, kriechend).

### Das Walfänger-Echo (`echo`)
- **Motiv:** der eine Wurf, der nie aufhört.
- **Wer er war:** der Harpunier, der den Wal als Erster sah und warf.
- **Was falsch ist:** Die Leine ist nie zurückgekommen. Sie läuft von der Harpune in einem Bogen in seine eigene Brust, und dort glimmt es. Unter dem Südwester ist kein Gesicht, nur zwei blasse Punkte. Er steht in Wurfhaltung, immer wieder, wie ein Echo. Am Gürtel brennt die Tranlampe (zweites inneres Licht), das Ölzeug ist offen und glänzt in Streifen.
- **Silhouette:** ein breitbeiniger Mann im Ölzeug mit Südwester, die Harpune quer über dem Kopf zum Wurf erhoben.
- **Kniff:** `ansage` (2 Züge, dann 14): Er zielt zwei Atemzüge lang, dann wirft er. Fordert Block-Planung.
- **Muster (18 Leben):** Zielen, Zielen, Wurf (14).
- **Schwachstelle Glaube:** Ein Gebet für die Toten auf See legt ihn zur Ruhe.
- **Stimme:** `rufer` (Formanten »a«, ruft, ein Echo).
- Der Wunsch war „zieht dich: Verwundbar“; der Kern kennt kein Verwundbar am Spieler (siehe Vorschläge).

### Der Markfresser (`markfresser`)
- **Motiv:** Hunger, der den Körper umbaut.
- **Wer er war:** der Schiffsjunge, der als Erster vom Wal gegessen hat.
- **Was falsch ist:** Vorn ist er noch ein Junge, dünner Oberkörper, kahler Kopf, und saugt an einem gespaltenen Knochen, in dem das Mark glimmt. Hinten ist er eine Made, so lang wie ein Boot, deren Glieder von innen leuchten, und die hintersten Glieder sind schon wieder Knochen (Dornfortsätze wie Wirbel). Variante b: dicker, mit Buckel.
- **Silhouette:** ein aufgerichteter Kinderoberkörper vorn auf einem U-förmig geringelten Madenleib.
- **Kniff:** `waechst 1`: Er frisst, während ihr kämpft. Fordert schnelle Kämpfe (Feuer, Aderlass).
- **Muster (20 Leben):** Biss (4), Einrollen (Block 6), Schnappen (2 × 2), dazu jeden Zug +1 Stärke.
- **Schwachstelle Feuer:** Mark ist Fett, und Fett brennt (Tran).
- **Stimme:** `schlundtraeger` (Kehlgesang, nass).

### Der Seepockenmann (`seepockenmann`)
- **Motiv:** Bewuchs, der Gewicht wird.
- **Wer er war:** ein Matrose, der sich zum Schlafen an den Kiefer des Wals lehnte.
- **Was falsch ist:** Auf der Seite zum Wal sind ihm Seepocken gewachsen, so schwer, dass er schief steht: links ein dünner Mann, rechts ein Fels aus Kalkkegeln, der über seinen Kopf wächst, der rechte Arm eine Keule. Ein Auge ist schon zugewachsen. Alle Seepocken öffnen sich in dieselbe Richtung, zum Herzen, und in jeder zweiten brennt ein kleines Licht; aus manchen tasten Rankfüße. Variante b: höher, Kegel auch auf dem Kopf.
- **Silhouette:** ein dünner Mann, dem rechts ein Fels aus Kegeln über den Kopf wächst, mit einer Keule bis zum Boden.
- **Kniff:** `dornen 2`: Wer zuschlägt, schlägt in Kalk mit scharfen Rändern. Fordert Hagel heraus.
- **Muster (22 Leben):** Keule (5), Kalk (Block 8), Schaben (3 × 2).
- **Schwachstelle Wasser:** Süßwasser tötet Seepocken.
- **Stimme:** `grabwaechter` (Horn aus Knochen).

### Wächter: Das Herz (`herz`)
- **Motiv:** der Takt. Das, was den Wal noch nicht sterben lässt.
- **Was es ist:** das Herz des Wals, so groß wie eine Kapelle, in einer Wiege aus Knochen, deren Dorne von allen Seiten nach innen wachsen. Die großen Adern stehen oben heraus wie Orgelpfeifen, abgeschnitten, offen; der Aortenbogen wölbt sich nach vorn. Kranzadern und Muskelfasern geben der Fläche Form, Knochenplatten wachsen über die Wand (das Skelett wächst auch hierher).
- **Was falsch ist:** In der Herzwand ist eine Tür aus Schiffsplanken mit Knochenrahmen, angelehnt, dahinter brennt warmes Licht, und im Spalt steht jemand, klein, gegen das Licht. Beim Schlag öffnet sich die Tür weiter.
- **Silhouette:** ein Herz mit Orgelpfeifen und Aortenbogen auf einer Wiege aus nach innen gebogenen Knochendornen.
- **Kampf (78 Leben):** Kniff `takt 7` (abwechselnd: ein Schlag gibt allen Gegnern 7 Block, dazwischen ist das Herz verwundbar) und `besonders: ruft` einen Rippenkriecher alle 3 Züge. Muster: Schlag (7), Pochen (3 × 3), Anschwellen (Stärke +2), Großer Schlag (11), Flattern (3 × 2).
- **Schwachstelle Blut:** Ein Herz versteht nur Blut.
- **Stimme:** `wurm` (Kehlgesang, eine Oktave tiefer, gedoppelt).
- **Beute:** Reliquie *Die Tür im Herzen*.

## Items

| Item | Bereich | Stoff | Seltenheit | Eigenschaft | Stammkarte |
|---|---|---|---|---|---|
| Fischbein-Korsett | Kleidung | Salz | selten, 2 Kerben, 42 | `start_block 6` | Schnüren: 1, Block 7, behalten |
| Tranlampe | Talisman | Feuer | gewöhnlich, 1 Kerbe, 20 | – | Tran nachgießen: 1, 3 Schaden, Brand 3 |
| Walzahn-Messer | Waffe | Blut | gewöhnlich, 1 Kerbe, 24 | – | Ritzen: 1, 5 Schaden, Verwundbar 1 |
| Harpune des Echos | Waffe | Eisen | selten, 2 Kerben, 48 | `verwundbar_start 1` | Harpunieren: 2, 12 Schaden, Verwundbar 2 |
| Die Tür im Herzen | Talisman | Blut | Reliquie (Wächter), 130 | `kampfstart_fx`: alle Gegner Verwundbar 2, du Schutz 5 | Herzschlag: Opfer 3, 2 × 5 Schaden |

Die Reliquie stützt Aderlass und Hagel zugleich: Zu Kampfbeginn schlägt sie einmal, alle sind verwundbar, und der Herzschlag kostet Leben statt Energie. Fundpool: die vier eigenen Items plus Harpune, Sturmlaterne, Robbenfell, Bootshaken, Ankerkette, Rum, Laudanum, Grubenlampe, Trenchcoat.

## Ereignisse (6, alle aus diesem Ort)

| ID | Szene | Bezug auf Früheres |
|---|---|---|
| `walkathedrale_kanzel` | Ein ausgehöhlter Wirbel als Kanzel, das Logbuch zählt die Rippen, die letzte Zahl in deiner Schrift | |
| `walkathedrale_rippe` | Eine neue, warme Rippe wächst aus dem Eis | |
| `walkathedrale_tran` | Das Tranlager der Expedition, der Tran ist frisch | `if item tranlampe` |
| `walkathedrale_horchen` | Am Knochen horchen, zwischen den Schlägen zählt jemand (Stummfilm) | |
| `walkathedrale_harpune` | Eine Harpune im Wirbel, die Leine straff zum Herzen | `if item knife` |
| `walkathedrale_mannschaft` | Elf Männer im Kreis, der Platz für den zwölften ist frei | `if event_gesehen walkathedrale_kanzel`, `if job fischer` |

Folgen: `handgriff` (auch selten), `kerbe`, `schleifen`, `reliquie`, `full_heal`, `fight` (Markfresser, Echo), Items. Ein Stummfilm im Akt.

## Musik

`root 45` (a-Moll, tiefer als Eis fis-Moll), `amb` Eisgrund und Tropfen, `rhy: trommel` (ein langsamer Doppelschlag ohne Spieler: das Herz), `detail: kapelle` (Orgel und Glocke in sehr weiter Ferne, die Kathedrale).

## Umsetzung und Prüfung

- **Weg A (Skript)**, `quelle: skript`. Sprites `tools/sprites/gegner/{rippenkriecher,echo,markfresser,seepockenmann,herz}.js`, Palette `tools/sprites/zonen/walkathedrale.json` (Körper Blauschwarz, Randlicht Knochenweiß, Glut Mark-Korallenrot, Extras `mark`, `tran`, `bein`). Jede Datei enthält unter `skizzen` die verworfene Silhouette (Käfig-Rippen senkrecht, Harpune als Stab, Made aufgerichtet, gleichmäßig bewachsen, Herz ohne Wiege); alle auf dem Silhouetten-Bogen. Beim Markfresser gab es dazu zwei ganz verworfene Entwürfe (Junge am schrägen Knochen, Sack auf dem Rücken): beide lasen sich als Masse ohne Figur.
- **Wächter 160 × 180.**
- `node tools/sprites/pruefen.js herz rippenkriecher_a rippenkriecher_b echo_a echo_b markfresser_a markfresser_b seepockenmann_a seepockenmann_b`: **9 Sprites, 0 Verstöße.**
- Im Spiel (`newRun('fischer',…,{route:['hafen','kapelle','salz','walkathedrale','pforte']})`, `Dev.springe('kampf_schwer'|'kampf'|'waechter',3)`): **keine Konsolenfehler.**
- `node tools/biom-test.js walkathedrale 10` mit Startseeds 1, 11, 21, 41 (Test spielt die Akte davor, Seeds, die im Vorlauf sterben, werden nicht gewertet): 5/9, 6/8, 9/10, 6/8, zusammen **26/35 (74 %)**, **0 Fehler**. Niederlagen meist im zweiten Kampf gegen drei Gegner mit Rippenkriecher (Brecher) und Echo (Ansage) zugleich.
- Bilder: [bilder/M7/walkathedrale/](../bilder/M7/walkathedrale/): `kontaktbogen.png` (neben Chorknabe, Hirte, Netzflickerin), `silhouetten.png`, `animation.png`, `hintergrund-varianten.png` (V0–V2 und Wächter-Szene mit Gegnern), `hintergrund-arten.png`, `hintergrund-fremdheit.png`, `im-spiel-kampf.png`, `im-spiel-kampf-2.png`, `im-spiel-kampf-3.png`, `im-spiel-waechter.png`.

## Vorschläge an den Kern

1. **Verwundbar am Spieler** (Gegner-Musterzug `{t:"vuln", v}`): „Die Harpune zieht dich heran“ war die Idee des Echos. Jetzt nimmt es `ansage`.
2. **Kniff `frisst {v}`**: +v Stärke je erlittenem Treffer (statt je Zug). Passt zum Markfresser („wird mit jedem Treffer größer“) und fordert Mehrfachtreffer anders heraus als Dornen. Jetzt `waechst 1`.
3. **Takt in der Szene:** Das Glimmen hinter dem Herzen (Wächter-Szene) und am Ende des Kirchenschiffs pulsiert heute zeitbasiert (Doppelschlag alle 2,4 s bzw. 4,2 s). Schön wäre ein Haken, mit dem die Szene auf `Bus.emit('herzschlag')` aus dem Kniff `takt` reagiert, damit Licht, Musik (`rhy: trommel`) und Block im selben Moment kommen.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / im Spiel. Gesamt = schwächster Punkt. Jedes Bild selbst angesehen (Kontaktbogen ×3, Animationen ×2, Kampf-Bildschirmfotos).

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Rippenkriecher | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Der Fächer aus Sichelrippen über einem kriechenden Mann ist einzigartig und schwarz gefüllt sofort lesbar; das Mark unter dem Gewölbe gibt ein warmes inneres Licht. Der Kopf am Boden ist klein, der Mann darunter bleibt eher Masse. |
| Walfänger-Echo | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Harpune quer über dem Kopf, Südwester zwischen den Armen, breiter Wurfschritt: klar und anders als die Kontrolleurin. Ölzeug mit Falten und Glanzstreifen, Tranlampe und Glimmen in der Brust. Dass die Leine in die eigene Brust läuft, sieht man erst bei ×2. |
| Markfresser | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Junge vorn, U-förmige Made hinten mit leuchtenden Ringen: eigene Silhouette, echtes Monster. Dritter Entwurf (die ersten beiden waren unter 4 und sind verworfen). Vor dem großen Wirbel der Krypta steht er dunkel auf dunkel; die Knochenglieder am Schwanz sind klein. |
| Seepockenmann | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Starke Asymmetrie (dünner Mann, Fels aus Kegeln, Keule) liest sich; Kegel mit Fase, Kalkkante und Lichtern geben viel Binnenform. Die Kolonie ist an der Grenze zur Unruhe, die Richtung der Öffnungen (zum Herzen) erkennt man nur, wenn man es weiß. |
| Das Herz (Wächter) | 5 | 4 | 4 | 5 | 4 | 4 | **4** | Herz mit Orgelpfeifen auf einer Wiege aus nach innen wachsenden Dornen, Tür mit Gestalt im Licht, Knochenplatten, Kranzadern: das Wahrzeichen in Reinform. Die Muskelfläche links bleibt trotz Fasern recht dunkel; der Schlag (Idle) ist bewusst leise, damit das Idle ruhig bleibt. |
| Hintergrund V0 Kirchenschiff | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Die Spitzbögen in die Tiefe mit dem glimmenden Ende sind der Ort selbst; Rippenhaken und junge Triebe zeigen das falsche Detail. Der Bohlenweg ist im Vordergrund etwas breit und flach. |
| Hintergrund V1 Flanke | 5 | 4 | 4 | 5 | 4 | 4 | **4** | Das ganze Gerippe als Berg im Eis gibt den Maßstab, den die anderen Szenen nicht haben. Der Eisrücken ist eher ein Band, das Lager links verschwindet hinter den Gegnern. |
| Hintergrund V2 Wirbelkrypta | 4 | 4 | 4 | 5 | 4 | 4 | **4** | Die Wirbelreihe mit glimmendem Kanal ist ein eigener Bildaufbau und ein schönes inneres Licht. Die rechte Hälfte über den Rippenansätzen ist ruhiger als links; der vorderste Wirbel ist groß und dunkel. |
| Wächter-Szene Herzkammer | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Muskelbalken wie Säulen, Sehnenfäden wie Glockenseile, Dorne von allen Seiten zur Mitte, pulsierendes Glimmen hinter dem Herzen. Der Boden ist eine große, eher gleichförmige Fläche (dort liegen im Spiel die Karten). |

Nichts liegt unter 4. Offene Schwächen für eine spätere Runde: der Mann unter dem Rippenkriecher deutlicher (Gesicht, Hände), die Leine des Echos kräftiger, Markfresser in der Krypta weiter vom Wirbel weg aufstellen oder heller rahmen, mehr Bewegung im Idle des Herzens (Schlag), Bohlenweg in V0 schmaler, Lager in V1 sichtbarer.

## Zweiter Wächter: Das Kalb (`kalb`, Zugabe)

Eingetragen als `biom.waechter_alt` in `prototype/data/biome/walkathedrale.json`; Sprite `tools/sprites/gegner/kalb.js` (Sheets `kalb`, `kalb_p2`), Zonenpalette `tools/sprites/zonen/walkathedrale_kalb.json` (Körper wie das Biom, Randlicht und Augen anders). Bilder: [bilder/Zugabe/waechter2/](../bilder/Zugabe/waechter2/).

- **Wer/was:** Der Wal ist nicht allein gestorben. In der Herzkammer hängt an seiner Schnur das Kalb, das nie geboren wurde, eingerollt, den Kopf nach unten, so groß wie ein Fischkutter. Es ist nicht fertig: Die Haut endet am Bauch, darunter liegen die Rippen offen und wachsen nach innen zur Mitte, wo das Mark glimmt.
- **Das falsche Detail:** Die Flossen sind Hände, mit fünf langen Fingern und bleichen Nägeln, und sie greifen nach vorn, nach dir. (Im Walskelett stecken wirklich Fingerknochen; hier sind sie nicht mehr eingewachsen.)
- **Silhouette in einem Satz:** ein eingerolltes Walkalb am Strang, großer Schädel unten links, Fluke oben, zwei gespreizte Hände unter dem Kiefer.
- **Warum anders als das Herz:** Das Herz sitzt in seiner Wiege, schützt im Takt die anderen und ruft Rippenkriecher. Das Kalb hängt, ruft niemanden und gibt keinen Schutz; es wird jeden Zug stärker (Kniff `waechst 3`: „Es ist nicht fertig. Jeden Zug wächst ihm ein Knochen nach.“). Man muss es schnell töten, statt auf Lücken im Takt zu warten. Besonderheit `phasen` bei 50 %: „Wach“ (`kalb_p2`), das Auge geht auf, der Kiefer klappt herunter, die Rippen spreizen sich; neues Muster (6 × 2, 13, Stärke +2, 3 × 4) und die Schwachstelle wechselt von Licht (es hat nie welches gesehen) zu Blut.
- **Randlicht:** Korallenrosa (`#a4503e`/`#ffc6aa`), das Licht des pulsierenden Glimmens hinter dem Herzen. Die Herzkammer ist Knochenweiß und Violett; das Rosa trägt dort keine Form, darum löst sich das Kalb von Dornen und Bögen. Augen milchig bleichgelb (`glut #ffe6a0`), damit sie nicht im Rot des Marks verschwinden. Inneres Licht: das Mark in der offenen Bauchhöhle.
- **Animation:** Leerlauf: hängt still, sinkt einen Pixel, das Auge öffnet sich kurz, die Hände zucken. Angriff: Es schaukelt am Strang zurück, die Hände ziehen sich an (Ausholen), dann schwingt es nach vorn, die Finger greifen, der Kiefer geht auf. Tod: Die Finger öffnen sich, es sackt ab und zerfällt.
- **Kampf (92 Leben):** Biss (12), 6 × 2, Block 12, 16; dazu jeden Zug Stärke +3. Stimme `torfstecherin` (Summen mit geschlossenem Mund, das Ungeborene). Beute: Fischbein-Korsett (selten, vorhanden).
- **Proben (Silhouette):** in einer Fruchtblase (ein Oval im Ring, zu nah an der Rückseite des Mondes, und ohne Hände nur ein Ei); ausgestreckt liegend (ein Fisch, kein Ungeborenes). Genommen: eingerollt am Strang. Gegen alle Sprites geprüft: nichts Hängendes in C-Form; die Gezogene (Mond) hängt gerade.
- **Abstimmung** (`biom-test walkathedrale 20`, gleiche Seeds): Herz 17/20 Akte, im Wächterkampf Ø 4 Schaden, 3,4 Züge; Kalb 16/18, Ø 9 Schaden, 4,4 Züge.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Das Kalb (`kalb`, `kalb_p2`) | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Eingerolltes Kalb mit Schädel, Fluke und Händen ist schwarz gefüllt eindeutig und neu im Spiel; die offenen Rippen mit dem Mark darin geben die große Binnenform und das innere Licht. Der Schädel bleibt eine große, sehr dunkle Fläche, das geschlossene Auge ist klein; Phase 2 unterscheidet sich vor allem am Auge und am Kiefer. |
