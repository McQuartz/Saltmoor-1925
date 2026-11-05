# Die Ziegelgruben (`ziegelgruben`) · Akt III

Biom-Paket der Zugabe nach [paket-format.md](../paket-format.md) (Auftrag 2, [03-meilensteine.md](../03-meilensteine.md) Abschnitt „Zugabe“). Bilder: [bilder/Zugabe/ziegelgruben/](../bilder/Zugabe/ziegelgruben/).

| Teil | Datei |
|---|---|
| Daten | `prototype/data/biome/ziegelgruben.json` |
| Hintergrund | `prototype/js/scenes/world/ziegelgruben.js` |
| Zonenpalette | `tools/sprites/zonen/ziegelgruben.json` |
| Gegner | `tools/sprites/gegner/brennmeister.js`, `ziegeltraeger.js`, `stempel.js`, `lehmhund.js`, `brennofen.js` |
| Item-Icons | `tools/icons/items/probeziegel.js`, `legionsstempel.js`, `traegerreff.js`, `aschekelle.js`, `gebrannter_finger.js` |

## Der Ort

Unter Rom, tiefer als die Katakomben und tiefer als der Ton, aus dem die Stadt gebaut ist, liegen Ziegelgruben: Lehmstiche in Terrassen, Trockenböden mit Rohlingen in langen Reihen, und Öfen, die noch warm sind. Niemand hat sie gelöscht. Die Ziegel tragen den Stempel einer Legion, die es nie gab, der neununddreißigsten; ihr Zeichen ist ein Ofen. Gebrannt wird weiter, in einem Ringofen, dessen Kammern um eine Kurve laufen, die sich nie schließt: Hinter jeder Kammer kommt noch eine, und in jeder steht die Glut weiß.

- **Wahrzeichen:** der Ringofen. Ein gewölbter Gang aus Ziegeln, der in einer weiten Kurve nach hinten läuft, an der Außenwand die Einkarrtüren der Kammern, eine nach der anderen, kleiner werdend, und hinter jeder steht weiße Glut. Über jeder Tür ein schwarzer Rußfächer. Die Kurve verschwindet hinter sich selbst; man sieht nie, wo sie endet.
- **Falsches Detail:** In jedem Ziegel ist ein Fingerabdruck, und es ist immer derselbe Finger: ein linker Ringfinger mit einer Narbe quer über den Linien. Auf den Rohlingen am Boden, in den Mauern, in den Gegnern. In der Lehmgrube sind die Terrassen selbst die Linien eines Abdrucks, so groß wie ein Platz, mit derselben Narbe. Nie erklärt.
- **Palette:** **Ziegelrot** für alles Gemauerte (gebrannter Ton im Licht, sieben Stufen von Rußbraun bis Terrakotta), **Asche** als kühles Grauweiß (Flugasche auf Simsen, der Dunst, der Lehm der Rohlinge), **Ruß** als fast schwarzes, kühles Grau für die Figuren, und **weißglühende Ofenmünder** als einziges helles Licht: Weißgelb mit weißem Kern, gesäumt von Orange. Die Figuren sind kühl und dunkel (Rußgrau `#060607 … #2a282d`), ihr Randlicht ist Ziegelorange innen und Weißglut außen (`#c4582c` / `#ffdcae`), Augen `#fff1b0` mit Kern `#ffffff`; als einzige Zusatzfarbe gebrannter Ziegel `#9a4228` für kleine Flächen.
- **Abgrenzung im Akt:** Salzstollen sepia und senkrecht (Stützen), Namenlose Stadt rostrot und frontal (Fries), der Wald Bernstein und Steingrau, mit Licht aus Harz, das Gezeitenwerk grün und rund. Die Ziegelgruben sind **Ziegelrot gegen Aschegrau**, mit **weißem** statt orangem Licht, und ihre Grundformen sind **Rundbogen in Reihe** (Kammern, Feuerlöcher), **Stapel** (Ziegel in Gittern, Rohlinge in Reihen) und **Terrassen**. Gegenüber der Glockengießerei aus Akt II (Ruß und Kirschglut, Licht von unten aus Rinnen, alles dunkelrot): Hier sind die Wände hell genug, dass man jeden Ziegel sieht, die Luft ist voller grauer Asche, und das Licht kommt aus vielen kleinen weißen Öffnungen in Reihe, nicht aus Rinnen am Boden.
- **Licht:** Gegenlicht von hinten oben rechts sind die Kammertüren des Ringofens und, in der Grube, ein Ofen auf der oberen Terrasse. Auf den Ziegelwänden liegt orangerotes Streiflicht, die Asche in der Luft fängt es als graue Punkte.
- **Zeitschicht:** Rom, aber nicht ganz: Römische Ziegelstempel (rechteckig und halbmondförmig), Tragreffe, Ziegelformen aus Holz, Wachstafeln. Der Ringofen ist eine Bauform des 19. Jahrhunderts, und er steht hier unter Rom, als wäre er älter. Das ist das zweite, leisere falsche Detail.

## Hintergrund: Kompositionen (480 × 270)

Feste Bedingungen: Gegner in x 60–420 auf drei Reihen, oben links (Tiefe) und unten (Karten) UI-frei, Nebel höchstens ein schmales Ascheband. Keine zwei Varianten mit derselben Grundform. Direkt hinter den Figuren liegt jeweils mittelhelles, gegliedertes Mauerwerk oder Asche, nie eine leere dunkle Fläche.

### Variante 0: Der Ringofen (Grundform: Kurve mit Reihung, Fluchtpunkt rechts)
- **Horizont** y 148. Wir stehen im Gang des Ringofens. Die Außenwand rechts läuft in einer weiten Kurve nach hinten links und verschwindet hinter sich selbst; das Tonnengewölbe darüber folgt der Kurve als Bänder aus Ziegelbögen.
- **Reihung:** In der Außenwand die Einkarrtüren der Kammern, Rundbögen, vorne groß und angeschnitten, nach hinten immer kleiner; jede mit weißer Glut, gesäumt von Orange, darüber ein Rußfächer. Über jeder Tür eine eingeritzte römische Zahl als Strichgruppe, die nach hinten immer länger wird.
- **Links:** die Innenwand mit Schürlöchern in der Decke (kleine Lichtpunkte oben) und Stapeln gebrannter Ziegel im Gitter, durch die Lücken Glut.
- **Falsches Detail:** Vorn an der Wand eine Lage einzeln gesetzter Ziegel, in jedem der Abdruck (Ringlinien mit einer Narbe), hell im Streiflicht.
- **Maßstab:** eine Schubkarre, eine Leiter zum Schürloch, die Türen sind gerade mannshoch.
- **Boden:** Ziegelpflaster im Fischgrät, Fluchtlinien zur Kurve, Asche in den Fugen.

### Variante 1: Die Lehmgrube (Grundform: Terrassen in Ellipsen, Blick in eine Tiefe)
- **Horizont** y 128, Aufsicht. Hinter den Figuren fällt eine weite Grube in Terrassen ab, deren Ränder konzentrische Ellipsen bilden: **die Linien eines Fingerabdrucks, so groß wie ein Platz, mit der Narbe quer darüber** (eine gerade Rinne, die die Terrassen schneidet). Auf den Terrassen trocknen Rohlinge in Reihen (Aschegrau, kleine Rechtecke).
- **Oben rechts** auf der höchsten Terrasse ein einzelner Kuppelofen, sein Mund weiß (Gegenlicht), Rauch steigt gerade auf und knickt an der Decke ab.
- **Vorn** gestampfter Lehm mit Fußspuren und Pfotenabdrücken, eine Ziegelform aus Holz, ein Spaten im Lehm. Links fern ein Trockengerüst wie ein Regal.

### Variante 2: In der Kammer (Grundform: Gitter, frontal, Licht durch Lücken)
- **Horizont** y 152, frontal. Wir stehen in einer Brennkammer, die gerade gesetzt wird: Die Rückwand ist ein **Gitter aus gestapelten Rohlingen** (Gittersetzung, Lagen kreuzweise), und durch die Lücken scheint von hinten weiße Glut, Pixel für Pixel. Oben das Gewölbe mit drei Schürlöchern. Links und rechts angeschnittene Stapel, vorn liegen einzelne Ziegel mit Abdruck.
- **Falsches Detail:** In der Mitte des Gitters fehlt ein Ziegel; durch die Lücke sieht man keine Glut, sondern einen Finger, der hineindrückt (nur bei `fremdheit` ≥ 0,5; sonst nur die Lücke, schwarz).

### Wächter-Szene: Vor der Feuertür
- **Horizont** y 166, Untersicht. Hinter dem Wächter (dem Brennofen, einer dunklen Flaschenform) steht die **Aschewand**: eine glatte, ruhige, mittelhelle Fläche aus Flugasche, die eine Kammerwand bis oben bedeckt, kühl grau, nur zur Mitte hin leicht wärmer. Davor steht der Ofen als dunkle Silhouette mit Randlicht und weißem Mund. Das ist die ruhige, kontrastierende Zone.
- **Seitlich** links und rechts die Kammerreihe des Ringofens, Türen mit weißer Glut, Rußfächer, abgedunkelt. Oben ein Bogen aus Ziegeln, durch den die Asche nach unten rieselt. Am Boden ein Kreis aus gebrannten Ziegeln, in jedem der Abdruck.

### Die anderen Arten
- **weg:** Variante nach Seed. **rast:** In der Kammer, abgedunkelt, die Glut hinter dem Gitter ist zu Rot heruntergebrannt, kleines Feuer. **werkstatt:** Lehmgrube mit Werkbank. **kraemer:** Ringofen, vor einer kalten Kammertür der Stand des Schreibers: Stapel gestempelter Ziegel, ein Pult mit Wachstafeln, eine Waage mit zwei Schalen, eine Öllampe. **ereignis / fund:** Lehmgrube, vorn eine Ziegelform aus Holz, darin ein Rohling, dessen Abdruck kurz aufglimmt. **wandbild:** Variante nach Seed, das Relief aus `World.relief` in Ziegel. **uebergang:** Die letzte Kammer: Die Tür steht offen, die Glut ist schwarz geworden, und am Boden der Kammer ist ein Schacht, ausgemauert, mit einer Wendel aus Ziegeln nach unten; von unten kommt kalte, blaue Luft (das Eis, Akt IV).

## Gegner

Arbeitsweise wie bei den Vorbildern: Silhouette zuerst als schwarze Fläche, je Gegner zwei Silhouetten verglichen (die verworfene steht als `proben` im Skript), gegen alle vorhandenen Sprites geprüft, dann Licht, Randlicht, Fase, Dither, dann Pixel nachgearbeitet. Weg A (`"quelle": "skript"`), kein Bild-Generator in der Sitzung.

**Zur Rückmeldung „große dunkle Flächen ohne Binnenform“:** Jedes Skript hat inneres Randlicht an überlappenden Teilen (`innenKanten`), dazu je Figur eigene Gliederung: Ziegelfugen und Lagen (Ziegelträger, Ofen), Lederschurz mit Nähten und Falten (Brennmeister, Stempel), Rippen und Fingerlinien im Lehm (Lehmhund). Jede Figur hat mindestens ein inneres Licht: die Brennprobe, glühende Fugen im Stapel, der glühende Stempel, die Glut in der Kehle des Hundes, Schaulöcher und Feuertür des Ofens.

### Der Brennmeister (`brennmeister`)
- **Motiv:** Wer dem Feuer zusieht, bis es zurücksieht.
- **Wer er war:** der Meister, der durch das Schauloch die Farbe der Glut las und wusste, wann der Brand gar war.
- **Was falsch ist:** Über dem Gesicht trägt er eine Maske aus Ton mit einem einzigen Schauloch, und durch das Loch sieht man nicht sein Auge, sondern weiße Glut, heißer als im Ofen. An seiner Stange hängt die Brennprobe, ein Ziegel, der nicht abkühlt, und auch in ihm ist der Abdruck.
- **Silhouette:** ein gebeugter Mann im Lederschurz, der eine lange Eisenstange über den eigenen Kopf nach vorn hält wie eine Angel, an ihrem Ende ein glühender Ziegel.
- **Kniff:** `teurer 1`: „Er legt nach. Was du in der Hand hältst, wird heiß.“ Eine Handkarte kostet in diesem Zug 1 mehr. Fordert Decks mit wenigen teuren Karten heraus.
- **Muster:** Schüren (7), Probe ziehen (Block 6), Glutstoß (3 × 2). 24 Leben.
- **Schwachstelle Wasser:** Gebrannter Ton reißt, wenn man ihn abschreckt.
- **Stimme:** `grabwaechter`.

### Der Ziegelträger (`ziegeltraeger`)
- **Motiv:** Eine Last, die nicht aufhört.
- **Wer er war:** ein Träger, der die Rohlinge auf dem Tragreff von der Grube zu den Öfen trug.
- **Was falsch ist:** Der Stapel auf seinem Rücken ist doppelt so hoch wie er und hängt nach vorn über, und die untersten Ziegel sind in seinen Rücken gewachsen. Die oberen glühen in den Fugen: Er trägt sie nicht zum Ofen, sondern aus ihm. In jedem Ziegel ein heller Fleck, der Abdruck.
- **Silhouette:** ein kleiner, tief gebückter Mensch unter einem schiefen Turm aus Ziegeln, der nach vorn überhängt.
- **Kniff:** `schuetzer 4`: „Wo er stehen bleibt, mauert er.“ Gibt den anderen Gegnern 4 Block nach seinem Zug. Fordert Zielwahl heraus.
- **Muster:** Abladen (7), Aufmauern (Block 8), Nachrutschen (4 × 2). 26 Leben.
- **Schwachstelle Salz:** Salz blüht im Ziegel aus und sprengt ihn von innen.
- **Stimme:** `schlundtraeger`.

### Der Stempel (`stempel`)
- **Motiv:** Ein Zeichen, das sich selbst setzt.
- **Wer er war:** der Mann, der den Stempel der Legion in jeden Rohling drückte, tausendmal am Tag.
- **Was falsch ist:** Er hat keine Hände mehr. Seine Unterarme enden in zwei schweren Stempeln aus Bronze, einem rechteckigen und einem halbmondförmigen, und die Stempelflächen glühen. Er hat keine Finger, und trotzdem ist der Abdruck in jedem Ziegel.
- **Silhouette:** eine hagere, lange Gestalt mit eingezogenem Kopf, die einen schweren Block über den Kopf hebt wie einen Hammer, der andere Arm hängt mit dem Halbmond bis zum Knie.
- **Kniff:** `kopie`: „Er drückt ab, was du zuletzt getan hast, spiegelverkehrt.“ Spielt deine zuletzt gespielte Karte gegen dich. Fordert, die letzte Karte eines Zugs zu bedenken.
- **Muster:** Abdrücken (7), Ansetzen (Block 6), Doppelstempel (3 × 2). 22 Leben.
- **Schwachstelle Eisen:** Ein Nagel in die Stempelfläche, und jeder Abdruck trägt die Kerbe.
- **Stimme:** `salzlaeufer` (Klicken im Takt).

### Der Lehmhund (`lehmhund`)
- **Motiv:** Ein Wächter, der nie gebrannt wurde.
- **Wer er war:** der Hund, der über die trocknenden Ziegel lief; man findet seine Pfoten in römischen Ziegeln bis heute.
- **Was falsch ist:** Er ist aus ungebranntem Lehm und zu lang, mit sechs Beinen. Sein Kopf ist ein Ziegel, flach und rechteckig, mit dem Stempel der Legion auf der Stirn, und die Augen sind zwei Fingerabdrücke, in denen Glut sitzt. In seiner Kehle glimmt es, als hätte man ihn mit dem Ofen gefüttert.
- **Silhouette:** ein flacher, zu langer Hund auf sechs Beinen, der Kopf ein Ziegel vorn tief am Boden.
- **Kniff:** `brecher`: „Er gräbt unter jeder Mauer durch.“ Zerbricht deinen Block vor seinem Angriff. Fordert, ihn zuerst zu töten oder seinen Schlag hinzunehmen.
- **Muster:** Schnappen (5), Graben (Block 5), Hetzen (2 × 2). 20 Leben.
- **Schwachstelle Feuer:** Ungebrannter Lehm platzt im Feuer.
- **Stimme:** `nest`.

### Wächter: Der Brennofen (`brennofen`), 160 × 180, zwei Phasen
- **Motiv:** Ein Feuer, das gefüttert werden will.
- **Wer er war:** die erste Kammer des Ringofens, die, mit der alles anfing. Oder ein Ofen, der beschlossen hat, die Kammern selbst zu besuchen.
- **Was falsch ist:** Ein Flaschenofen aus Ziegeln mit eisernen Bändern, krummem Schornstein und zwei Armen aus gemauerten Lagen, die bis zum Boden hängen und in Ziegelzangen enden. Über der Feuertür zwei Schaulöcher, die dich ansehen. In der Feuertür, in der weißen Glut, ein Gesicht, das nicht verbrennt. Jeder Ziegel trägt den Abdruck.
- **Silhouette:** eine bauchige Flasche aus Mauerwerk mit schiefem Hals, zwei lange, gegliederte Arme, unten ein glühender Rundbogen.
- **Kniff:** `loeschen`: „Was brennt, gehört ihm.“ Er nimmt nach seinem Zug allen Gegnern den Brand. Feuer stärkt ihn so mittelbar: Er frisst es, bevor es wirkt.
- **Besonders:** `phasen` bei 50 %: **Weißglut.** Die Feuertür springt auf (eigenes Sheet `brennofen_glut`), das Gesicht steht ganz im Licht, das Muster wird härter.
- **Muster Phase 1 (80 Leben):** Ausatmen (12), Nachlegen (Stärke +3), Zangen (5 × 3), Vermauern (Block 12), Glutwurf (16). **Phase 2:** Weißglut (10 × 2), Nachlegen (Stärke +3), Zangen (7 × 3), Vermauern (Block 10), Ausbrennen (22).
- **Schwachstelle Wasser:** Ein Ofen in Weißglut, Wasser hinein, und das Mauerwerk springt.
- **Stimme:** `wurm` (Kehlgesang, tief, gedoppelt).
- **Beute:** Reliquie *Der gebrannte Finger*.

## Krämer: Der Schreiber der Legion

Ein Mann in einer Tunika, die einmal weiß war, sitzt an einem Pult aus Ziegeln vor einer kalten Kammertür und verbucht jeden Ziegel auf Wachstafeln. Er nimmt kein Gold. Er wiegt auf: ein Stück von dir gegen ein Stück von ihm (`kraemer.art: tausch`; im Akt III sonst kein Tausch).

## Items

| ID | Name | Rar | Kerben | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|---|
| `probeziegel` | Brennprobe (F) | gewöhnlich | 1 | – | Glühende Probe (1: 4 Schaden, Brand 2) | Der Brennmeister zog ihn aus dem Schauloch, um die Farbe zu prüfen. Er ist seitdem nicht kalt geworden, und der Abdruck darin ist nicht deiner. |
| `legionsstempel` | Stempel der neununddreißigsten (E) | selten | 2 | `verwundbar_start 1` | Abdrücken (1: 6 Schaden, Verwundbar 1) | Bronze, in Spiegelschrift: LEG XXXIX. Es gab nie eine neununddreißigste Legion. Der Stempel ist abgegriffen von tausend Händen. |
| `traegerreff` | Tragreff (E, +3 Leben) | selten | 2 | `block_haelt_halb` | Aufladen (1: 8 Block) | Ein Gestell aus Holz für den Rücken. Was man einmal aufgeladen hat, trägt man weiter. Es ist schwerer, als es aussieht, auch leer. |
| `aschekelle` | Aschekelle (F W) | gewöhnlich | 1 | – | Ausräumen (1: 4 Block, Brand 2 an allen) | Mit ihr holt man die Asche aus den Feuerlöchern. Die Asche ist warm, und in ihr liegen kleine, gebrannte Dinge, die man nicht ansehen will. |
| `gebrannter_finger` | Der gebrannte Finger (F) | reliquie | 2 | `kampfstart_fx`: Verwundbar 2 an allen, Brand 2 an allen | Abdruck (0: Brand 3, Verwundbar 1, verbraucht) | Ein linker Ringfinger aus gebranntem Ton, eine Narbe quer über den Linien. Er ist warm. Drück ihn irgendwo hinein, und es gehört ihm. |

Item-Icons: eigene Skripte unter `tools/icons/items/` (Brennprobe an der Kette, Stempel mit Spiegelschrift, Tragreff mit zwei Ziegeln, Aschekelle, gebrannter Finger mit Abdruck). Fundpool: die vier eigenen plus Grubenlampe, Spitzhacke, Schaufel, Dynamit, Teerfackel, Legionsaxt, Kompass. Beute: Brennmeister → Brennprobe, Ziegelträger → Tragreff, Brennofen → Der gebrannte Finger.

## Ereignisse

| ID | Titel | Kern | Bezug auf Früheres |
|---|---|---|---|
| `ziegelgruben_kammer` | Die nächste Kammer | Die Zahl über der Tür ist länger als jede, die du kennst. | – |
| `ziegelgruben_abdruck` | Der Abdruck | Ein Rohling mit dem Abdruck; dein Finger passt nicht, oder doch. | – |
| `ziegelgruben_stempeltisch` | Der Stempeltisch | Stempel in Reihen, einer fehlt. | `event_gesehen: fabrik_stempeluhr` |
| `ziegelgruben_vermauert` | Die Mauer von der anderen Seite | Eine frisch gemauerte Wand, dahinter klopft es. | `event_gesehen: salz_mauer` |
| `ziegelgruben_appell` | Der Appell | Eine Liste der Legion; dein Name steht darunter. | `job: veteran`, `job: geologe`, `item: legionsaxt` |
| `ziegelgruben_ascheregen` | Ascheregen | Asche fällt aus dem Gewölbe, warm wie Haut. | – |

## Musik

d-Moll, Grundton 50, dauerhaft halb gekippt (`phryg`, ♭II wie die Hitze, die nicht nachlässt). Nachbarn im Akt: Salzstollen 53, Namenlose Stadt 46, Wald 51, Gezeitenwerk 43. Ort: Stollen-Hall, Sand (rieselnde Asche), etwas Wind im Gewölbe; Rhythmus `hacke` (Lehm stechen, Ziegel klopfen), Einzelklänge aus `stadt`.

## Prüfung

- `node tools/sprites/pruefen.js brennmeister_a brennmeister_b ziegeltraeger_a ziegeltraeger_b stempel_a stempel_b lehmhund_a lehmhund_b brennofen brennofen_glut`: 10 Sprites, **0 Verstöße**. `node tools/icons/pruefen.js`: 208 Bilder, **0 Verstöße**.
- Kontakt- und Silhouetten-Bogen neben Chorknabe, Hirte, Netzflickerin: [ziegelgruben-bogen.png](../bilder/Zugabe/ziegelgruben/ziegelgruben-bogen.png). Silhouetten gegen alle 182 vorhandenen Sprites (Ziegelgruben schwarz, oben links): [silhouetten-gegen-alle.png](../bilder/Zugabe/ziegelgruben/silhouetten-gegen-alle.png). Alle Animationen: [animationen.png](../bilder/Zugabe/ziegelgruben/animationen.png).
- Hintergrund: [hintergrund-varianten.png](../bilder/Zugabe/ziegelgruben/hintergrund-varianten.png) (V0, V1, V2, Wächter, mit den echten Sprites), [hintergrund-arten.png](../bilder/Zugabe/ziegelgruben/hintergrund-arten.png), [hintergrund-fremdheit.png](../bilder/Zugabe/ziegelgruben/hintergrund-fremdheit.png) (fremdheit 1: Wächter in Weißglut). Aufbau: Ringofen 400–440 ms (Ray-Marching durch den gekrümmten Gang), alle anderen unter 120 ms.
- Im Spiel (`newRun('fischer',3,{dev:true,route:['hafen','kapelle','ziegelgruben','eis','pforte']})`, `Dev.springe(…, 2)`): [im-spiel-kampf.png](../bilder/Zugabe/ziegelgruben/im-spiel-kampf.png), [im-spiel-kampf-2.png](../bilder/Zugabe/ziegelgruben/im-spiel-kampf-2.png), [im-spiel-kampf-3.png](../bilder/Zugabe/ziegelgruben/im-spiel-kampf-3.png) (Lehmgrube), [im-spiel-kampf-alle-vier.png](../bilder/Zugabe/ziegelgruben/im-spiel-kampf-alle-vier.png), [im-spiel-waechter.png](../bilder/Zugabe/ziegelgruben/im-spiel-waechter.png), [im-spiel-waechter-weissglut.png](../bilder/Zugabe/ziegelgruben/im-spiel-waechter-weissglut.png) (Phase 2 nach `checkPhase` bei 45 %). Keine Konsolenfehler.
- `node tools/biom-test.js ziegelgruben 20`: **15/20**, mit Startseed 21: **18/20**, mit Startseed 41: **16/20**; zusammen 49/60 (82 %), 0 Fehler. Zum Vergleich im selben Test heute: Wald 19/20, Gezeitenwerk 19/20. Alle Niederlagen kommen aus Doppel- und Dreierkämpfen mit dem Stempel (kopie) neben Ziegelträger (schuetzer) und Lehmhund (brecher); der Brennofen hat noch keinen Run beendet. Erste Werte waren 16/20 und 19/20; danach Wächter härter (Muster 12 / +3 Stärke / 5×3 / Block 12 / 16, Weißglut 10×2 / +3 / 7×3 / Block 10 / 22, Leben 80 statt 72), Lehmhund 20 statt 18 Leben, Brennmeister schlägt 7 statt 6. Weiter verschärfen wollte ich nicht über die Grenze von 80 Leben für Wächter hinaus.
- `node tools/test-ereignisse.js`: „Alles gut.“ (6 Ereignisse in den Ziegelgruben). `node tools/test-run.js`: „Alles gut.“

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Brennmeister | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Die Angel über dem Kopf mit dem glühenden Ziegel gibt es sonst nirgends und liest sich schwarz sofort (die waagerechte Probe war zu nah am Gießer). Die Tonmaske mit dem einen Schauloch ist das falsche Detail im Gesicht; im Angriff holt er sichtbar über die Schulter aus. Schwäche: der Leib bleibt eine große dunkle Fläche, nur Schurz-Naht, Gürtel und das Probenlicht gliedern ihn; Variante b unterscheidet sich nur in Probe und Kette. |
| Ziegelträger | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Der überhängende Turm aus Ziegeln mit dem winzigen Menschen darunter ist die stärkste Silhouette des Bioms; Lagen, Verband, glühende Fugen oben und die Abdrücke geben dem Stapel Binnenform. Im Angriff fliegen die oberen Ziegel nach vorn, im Tod bricht der Turm ein. Schwäche: der Träger selbst ist klein und liest sich als gebückter Klumpen mit Randlicht-Linien. |
| Stempel | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Der Block über dem Kopf wie ein Hammer und der Halbmond am Knie unterscheiden ihn von den vielen stehenden Männern; der Schlag geht wirklich von hinten oben bis an den Boden vor ihm, die Stempelfläche glüht. Schwäche: der Rumpf ist kastig, und der Kopf ist klein; Variante b hat nur einen anderen Block. |
| Lehmhund | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Flach, zu lang, sechs Beine, und vorn ein gebrannter Ziegel als Kopf auf einem Leib aus ungebranntem Lehm: Das Falsche liest man an der Farbe. Fingerabdruck-Augen und Glut in der Kehle. Schwäche: die Beine sind fast nur Randlicht-Striche, der Leib bleibt dunkel; der Ziegelkopf ist im Spiel klein. |
| Brennofen (Wächter) | 4 | 4 | 4 | 5 | 5 | 5 | **4** | Flasche mit schiefem Hals, zwei gemauerte Arme mit Zangen, zwei Schaulöcher als Augen und die Feuertür als Mund; in der Weißglut steht in der Tür ein ruhiges Gesicht mit geschlossenen Augen. Mauerwerk mit Lagen, Bändern und Abdrücken gliedert die große Fläche, die Glut wandert in den Fugen. Im Spiel steht er dunkel vor der hellen Aschewand und ist das Klarste im Bild (Sp 5). Schwäche: Die Schultern sind gerade wie ein Dach, schwarz gefüllt erinnert er an ein Haus mit Schornstein. |
| Hintergrund V0 Ringofen | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Der gekrümmte Gang mit der Reihe weißer Kammertüren, die hinter der Kurve verschwinden, ist das Wahrzeichen in einem Bild; in den nahen Ziegeln sieht man die Abdrücke. Gewölbe, Fischgrätboden und Rußfächer geben Tiefe. Schwäche: die linke Wand ist nah eine große, gleichmäßige Ziegelfläche. |
| Hintergrund V1 Lehmgrube | 4 | 4 | 4 | 5 | 4 | 4 | **4** | Die Terrassen bilden einen Fingerabdruck mit der Narbe quer, so groß wie ein Platz: das falsche Detail als Grundform. Steilwand mit Bänken voller Rohlinge, Kuppelofen oben rechts als Gegenlicht, Trockenboden vorn als Fluchtlinien. Schwäche: die schwächste Szene; die Steilwand ist streifig und der Vordergrund ruhig. Zweimal umgebaut (Grube zuerst als Hügel gelesen, leere graue Fläche hinter den Figuren). |
| Hintergrund V2 In der Kammer | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Frontales Gitter aus Rohlingen, durch die Lücken scheint weiße Glut; der fehlende Ziegel in der Mitte. Dunkle Figuren stehen davor sehr klar. Schwäche: das Gitter ist regelmäßig, der Boden schlicht. |
| Hintergrund Wächter | 5 | 4 | 4 | 4 | 5 | 5 | **4** | Die Aschewand im großen Bogen ist die ruhige, helle, kühle Zone direkt hinter dem Ofen; links und rechts weiße Kammertüren mit Rußfächern, am Boden der Ziegelring. Schwäche: Die Rußfächer sind schlichte Dreiecke. |
| **Hintergrund gesamt** | | | | | | | **4** | |

Nichts unter 4. Überarbeitet wurden unterwegs: Ziegelträger (Stapel zuerst aus dem Bild geragt, Angriff war ein flaches Brett, Neigung im Angriff verkehrt herum), Lehmhund (Kopf hoch las sich als Lama; Beine als Leuchtstriche, Kopf zu klein, dann gebrannter Ziegelkopf), Stempel (Kopf unsichtbar, Schlag ging nach hinten, Rumpf als Kasten), Brennmeister (Probe aus dem Bild beim Ausholen, Maske nicht lesbar, dann gebrannter Ton), Brennofen (zu breit wie ein Haus, Arme klebten am Leib, Gesicht in der Tür wie ein Geist mit drei Punkten, Weißglut über der Lichtgrenze), Ringofen (930 ms, Moiré in der fernen Wand, Gitter vorn zu groß), Kammer (schwarze Leibung, Ascheflecken am Boden), Lehmgrube (siehe oben), Krämerstand (zu klein).

## Vorschläge an den Kern

- **Kniff `glutfresser`** (Steckbrief „Feuer stärkt ihn“): Brand am Gegner verursacht keinen Schaden, sondern wird am Zugbeginn zu Stärke (+1 je 2 Brand). Heute nur über `loeschen` angenähert.
- `kopie` kann eine teure Angriffskarte voll zurückspielen; im Biom-Test sind fast alle Niederlagen Kämpfe mit dem Stempel. Vorschlag: höchstens die Hälfte des Schadens oder Obergrenze 8.
- Phasen-Wächter zeigen den Sheet-Wechsel ohne Übergang; ein kurzes Aufhellen (wie Treffer) beim Wechsel würde die Weißglut stärker machen.

## Offene Schwächen

- Variante b der Normalen unterscheidet sich je nur in einem Teil (Probe, Stapelform, Block, Schwanz).
- Die Lehmgrube bleibt die schwächste Szene; der Ringofen braucht über 400 ms zum Aufbau (einmal pro Knoten).
- Biom-Test 82 % statt Ziel 60–80 %, der Wächter hat noch keinen Run beendet.
