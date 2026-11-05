# Die Funkstation am Pol (`funkstation`) · Akt IV · Zugabe

Biom-Paket nach [paket-format.md](../paket-format.md), Zugabe aus [03-meilensteine.md](../03-meilensteine.md). Zeitschicht Akt IV: **vor dem Leben**, darüber eine Hütte von 1912. Bilder: [bilder/Zugabe/funkstation/](../bilder/Zugabe/funkstation/). Alles per Skript gezeichnet (Weg A, `quelle: skript`), kein Bild-Generator in der Sitzung.

| Teil | Datei |
|---|---|
| Daten | `prototype/data/biome/funkstation.json` |
| Hintergrund | `prototype/js/scenes/world/funkstation.js` |
| Zonenpalette | `tools/sprites/zonen/funkstation.json` |
| Gegner | `tools/sprites/gegner/funker.js`, `telegrafistin.js`, `mastkletterer.js`, `rauschen.js`, `sender.js` |
| Ereignisbilder | `tools/ereignisse/bilder/funkstation.js` |
| Item-Icons | `tools/icons/items/morsetaste.js`, `kopfhoerer.js`, `funkenstrecke.js`, `senderoehre.js` |

## Der Ort

Auf dem schwarzen Eis steht eine Hütte aus Teerpappe und Planken, bis zu den Fenstern eingeschneit: die Funkstation einer Expedition von 1912, die nie zurückkam. Niemand hat den Ofen geheizt, seit sie fort sind, und trotzdem glühen die Röhren des Empfängers noch, orange, durch die Ritzen des Bakelitgehäuses. Neben der Hütte steht der Antennenmast, ein Gittermast aus Stahl, an dessen Abspannseilen das Eis in langen Strähnen hängt wie Haar. Der Empfänger empfängt. Nicht von Norden, nicht von Süden. Von unten.

- **Wahrzeichen:** der **Antennenmast** mit dem Eishaar an den Seilen (V0 riesig in der Mitte, in der Hütte durch das Fenster, im Wächter-Raum hinter der Scheibe) und der **Morsetisch** mit Taste, Kopfhörer, Röhrenempfänger und Lampe (V1 im Funkraum, Ereignis, Krämer).
- **Falsches Detail:** Die Morsezeichen kommen **von unter dem Eis**, und sie buchstabieren deinen Namen, bevor du ihn gesagt hast. Im Bild: Unter dem schwarzen Eis blinken Lichter in Kurz und Lang, in einer Reihe, die genau auf dich zuläuft (animiert, nie erklärt). Der Antennendraht führt nicht von Mast zu Mast, sondern vom Mast **in ein Loch im Eis**. Der Papierstreifen des Schreibempfängers läuft aus der Tür, über den Schnee, in dasselbe Loch.
- **Palette:** Bakelit-Braun nahe Schwarz (`#060403 … #311d14`), Randlicht Schneeweiß im Lampenlicht (`#a48a74` / `#f4ebe0`), Augen und Röhren warmes Röhrenorange (`#ff8a2a`, Kern `#fff2d6`), Zusatzfarbe Kupfer (`#c0703e`) für Spulen, Drähte, Kopfhörer. Der Schnee in den Szenen ist warm-weiß im Lampenlicht und braungrau im Schatten, das Eis darunter schwarzbraun.
- **Abgrenzung im Akt:** Schwarzes Eis ist blau mit roten Augen, die Walkathedrale Knochenweiß in Blauschwarz, das Glasmeer Schwarzglas und Polarlicht-Grün, der Mond Asche und Silber. Die Funkstation ist das einzige **warme** Biom des Akts: Röhrenorange und Bakelit gegen Schnee. Bildaufbau sind **Senkrechte und Drähte** (Mast, Seile, Antennen, Kabel, Papierstreifen), Menschenwerk von 1912, kein Knochen, kein Glas, kein Mond, kein Nordlicht.
- **Licht:** Gegenlicht oben rechts ist der Schein der Röhren und Lampen auf Schnee (warmweiß). Dazu das Orange der Röhren als Innenlicht und, von unten, die Morselichter unter dem Eis.
- **Krämer:** **Der Proviantmeister** (`art: tausch`). Er führt seit 1912 Inventur und gibt nichts heraus, was nicht von der Liste gestrichen wird: Für jedes Stück, das du nimmst, kommt eins von dir auf die Liste. Die Liste muss stimmen, sagt er, sonst merkt man unten, dass einer fehlt.

## Hintergrund: Kompositionen

Grundform **die Senkrechte mit Drähten**: Mast, Seile, Antennenlitzen, Kabel, Papierstreifen ziehen die Linien durchs Bild. Nebel nur als Schneefegen in einem schmalen Band am Horizont (deutlich unter einem Drittel). Hinter den Gegnern liegt in jeder Szene etwas Gegliedertes und Helleres (Schneefläche im Lampenlicht, Plankenwand mit Fenster), keine ruhige Leerfläche.

### Variante 0: Der Mast
- **Horizont** y 160. Draußen auf dem Eis, Polarnacht. Der Schnee liegt in Wehen, darunter scheint an aufgewehten Stellen das schwarze Eis durch.
- **Aufbau:** Der Gittermast steht rechts der Mitte, steigt aus dem Bild; Abspannseile laufen schräg zu Ankern im Schnee, an ihnen hängt Eis in langen Strähnen. Links die Hütte mit glühendem Fenster und Ofenrohr. Vom Mast führt die Antennenlitze in einem Bogen hinab **in ein Loch im Eis** im Mittelgrund.
- **Falsches Detail:** Unter dem Eis vor dem Loch eine Reihe von Lichtern, die in Kurz und Lang blinken und auf dich zulaufen.
- **Maßstab:** die Tür der Hütte, ein Benzinfass, ein Hundeschlitten; der Mast ist zehnmal so hoch wie die Tür.
- **Hinter den Gegnern:** die beleuchtete Schneefläche zwischen Hütte und Mast mit Spuren, Wehen und dem Papierstreifen.

### Variante 1: Der Funkraum
- **Innen.** Plankenwand hinten, ein Fenster mit Eisblumen, dahinter der Mast als dunkle Senkrechte. Horizont (Bodenkante) y 150, Dielenboden mit Fluchtlinien.
- **Aufbau:** Links der **Morsetisch**: Röhrenempfänger mit vier glühenden Röhren, Morsetaste, Kopfhörer am Haken, Petroleumlampe, Logbuch. Rechts Regale mit Glasakkus und Kupferspulen. Von der Decke hängen Kabel. Der Papierstreifen des Schreibers läuft vom Tisch über die Dielen und verschwindet in einer Ritze, durch die von unten orange Licht blinkt.
- **Hinter den Gegnern:** die Plankenwand im Lampenlicht, mit Kalender, Karte, Kabelbündeln.

### Variante 2: Das Eisloch
- **Horizont** y 140. Weit draußen auf dem blank gefegten schwarzen Eis, die Station klein in der Ferne links mit einem Licht, der Mast als Strich.
- **Aufbau:** Die Antennenlitze kommt aus der Ferne, auf Stangen mit Isolatoren, und taucht hier in ein rundes, glattes Loch im Eis, um das sich Schnee wie ein Wall gelegt hat. Im Eis darunter die Morselichter. Ein Zelt, ein umgekippter Schlitten, Kisten. Der Papierstreifen windet sich über das Eis zum Loch.
- **Hinter den Gegnern:** das blanke Eis mit Rissen und Lichtern darin, darüber die helleren Schneewehen.

### Wächter-Szene: Der Senderaum
- **Innen**, der zweite Raum der Hütte. Bodenkante y 150.
- **Ruhige Zone hinter dem Wächter:** eine große Fensterwand aus bereiften Scheiben, dahinter der Schnee in fahlem Licht: wenige helle Stufen, ruhig, gedithert; nur der Mast steht als dünne, dunkle Senkrechte darin. Der Sender (dunkles Bakelit, orange Röhren) steht davor als klare Silhouette.
- Links und rechts Akkuregale, Kabel laufen über die Dielen zu einem Loch im Boden, aus dem orange Licht blinkt (Morse). Mit `fremdheit` mehr Lichter und das Fenster wird dunkler.

### Die anderen Arten
- **weg:** Variante nach Seed. **rast:** im Funkraum, der Kanonenofen brennt (zum ersten Mal seit 1912). **werkstatt:** Funkraum, Werkbank mit Lötkolben. **kraemer:** vor der Hütte, die Kisten des Proviantmeisters mit Liste und Laterne. **ereignis / fund:** das Eisloch, eine Kiste der Expedition. **wandbild:** Variante nach Seed, Relief im Stil des Bioms. **uebergang:** am Loch: Die Litze führt hinab, ins Dunkel, und von unten kommt das Licht (zur Pforte).

## Gegner

Arbeitsweise: je Gegner zwei Silhouetten-Proben als schwarze Fläche (die verworfene steht als `proben` im Skript), gegen alle vorhandenen Sprites in `prototype/assets/gegner/` gelegt, dann Licht, Randlicht, Fase, Dither, Binnenform, Pixel. **Zur Rückmeldung „große dunkle Flächen“:** Jede Figur hat Innenkanten-Randlicht, Falten oder Gliederung und mindestens ein inneres Licht (Röhre, Glut, Lampe).

### Der Funker (`funker`)
- **Motiv:** Wer zu lange hinhört, hört nicht mehr auf.
- **Wer er war:** der Funker der Expedition von 1912, der die Wache am Empfänger hatte, als das Signal zum ersten Mal kam.
- **Was falsch ist:** Der Kopfhörer ist ihm eingewachsen. Der Bügel liegt unter der Haut wie ein zweiter Scheitel, die Muscheln sind Teil des Schädels, und aus beiden laufen die Kabel den Rücken hinab bis ins Eis wie ein Schwanz. Er hält eine Hand an die Muschel und horcht. Was er hört, gibt er weiter.
- **Silhouette:** ein hagerer, vorgebeugter Mann im Pelzanorak, der Kopf schief an die Hand gelegt, ein Bügel über dem Schädel, ein Kabel vom Kopf bis zum Boden.
- **Varianten:** a mit Bleistift und Block, das Kabel läuft frei in den Schnee; b mit dem Tornister-Empfänger auf dem Rücken (eine Röhre glüht darin), aus dem eine Stabantenne ragt.
- **Kniff:** `kopie`: Er gibt weiter, was er hört; er spielt deine zuletzt gespielte Karte gegen dich. Neu im Akt IV, fordert Reihenfolge.
- **Muster:** Weitergeben (7), Horchen (Block 7), Rückkopplung (2 × 4). 25 Leben. **Beute:** Kopfhörer der Station.
- **Schwachstelle Wasser:** Ein Tropfen in der Muschel, und es knackt nur noch.
- **Stimme:** `rufer`.

### Die Telegrafistin (`telegrafistin`)
- **Motiv:** Die Nachricht, die durch einen hindurchgeht.
- **Wer sie war:** die Telegrafistin aus dem Postamt von Saltmoor, die 1912 die Meldungen der Expedition aufnahm und eines Tages selbst hinfuhr.
- **Was falsch ist:** Ihre Finger klopfen, ohne Pause, auf der Taste, die ihr vor der Brust gewachsen ist; zu lange Finger, zu viele Glieder. Was sie tippt, kommt ihr als Papierstreifen aus dem Mund und fällt in Schleifen bis auf den Boden. Auf dem Streifen steht dein Name.
- **Silhouette:** eine schmale Frau mit hohem Kragen und Haarknoten, die Hände vor der Brust gespreizt, ein langes Band aus dem Mund in Schleifen bis zum Boden.
- **Varianten:** a mit Augenschirm, das Band fällt gerade; b ohne Schirm, das Band ist ihr wie eine Stola um Hals und Arme gewunden, die Haare offen.
- **Kniff:** `verstopfen` (1, Karte „Dein Name“): Sie tippt deinen Namen, und er liegt dir in der Hand wie ein Stein. Neu im Akt IV, fordert schlanke Decks und Ballast-Builds.
- **Muster:** Tippen (2 × 5), Lang (8), Abheften (Block 6). 23 Leben. **Beute:** Die Morsetaste.
- **Schwachstelle Eisen:** Eisen auf der Leitung erdet sie.
- **Stimme:** `netzflickerin`.

### Der Mastkletterer (`mastkletterer`)
- **Motiv:** Oben bleiben.
- **Wer er war:** der Mechaniker der Expedition, der im Sturm hinaufstieg, um die Antenne zu richten, weil das Signal schwächer wurde.
- **Was falsch ist:** Er ist nie heruntergekommen. Er hängt an einem Stück Mast, das mit ihm wandert, festgefroren, und das Eis wächst ihm aus Kopf und Armen in langen Strähnen bis zum Boden, wie Haar. Er sieht dich von oben an, den Kopf verdreht.
- **Silhouette:** ein schmaler Gitterturm aus Streben, daran hoch oben eine geduckte Gestalt mit Steigeisen, von der Strähnen senkrecht zum Boden hängen.
- **Varianten:** a hält sich mit beiden Armen, Strähnen lang; b hockt auf einer Querstrebe mit Isolatoren wie ein Vogel, ein Arm reicht nach dir.
- **Kniff:** `rein`: Er ist bis ins Mark gefroren; Gift fließt nicht. Neu im Akt IV, fordert Brackwasser.
- **Muster:** Abspringen (9), Festklammern (Block 8), Eisschlag (2 × 5). 29 Leben.
- **Schwachstelle Feuer:** Wenn das Eis taut, lässt es ihn los.
- **Stimme:** `eisgesicht`.

### Das Rauschen (`rauschen`)
- **Motiv:** Etwas sucht seine Frequenz.
- **Wer es war:** niemand. Das, was zwischen zwei Sendern liegt.
- **Was falsch ist:** Es setzt sich zusammen wie ein Sender, den man sucht: erst Streifen, dann Schultern, dann ein Gesicht. Eine Gestalt aus waagerechten Bändern, die gegeneinander verrutscht sind; in der Mitte glüht eine Röhre wie ein Herz. Im Leerlauf rutschen die Bänder auf ihren Platz und wieder weg.
- **Silhouette:** ein Menschenumriss, in waagerechte Streifen geschnitten, die seitlich versetzt sind, mit Lücken dazwischen.
- **Varianten:** a stehend, die Bänder eng; b gebückt, breiter, die Bänder weit auseinander, der Kopf ganz verschoben.
- **Kniff:** `heiler` (5): Was fehlt, füllt das Rauschen auf; es flickt die anderen. Neu im Akt IV, fordert Zielwahl.
- **Muster:** Knistern (3 × 4), Verdichten (Block 6), Übersteuern (7). 21 Leben, heilt 5.
- **Schwachstelle Licht:** Licht ist ein Sender. Wo eins ist, setzt sich das Rauschen nicht.
- **Stimme:** `schatten`.

### Wächter: Der Sender (`sender`, 160 × 180, zwei Phasen-Sheets)
- **Motiv:** Die Stimme im Rauschen.
- **Was er ist:** der Röhrensender der Station, ein Schrank aus Bakelit und Eiche so hoch wie zwei Männer, auf dem eine Kupferspule sitzt wie eine Krone. Aus ihm wächst ein Schalltrichter, der sich zu dir dreht wie ein Kopf; unten laufen seine Kabel wie Wurzeln in den Boden und weiter ins Eis. Hinter dem Gitter glühen die Röhren in Reihen. Er sendet nicht. Er antwortet.
- **Phase 2 „Die Stimme“** (ab 50 %, Sprite `sender_p2`): Die Türen springen auf. Innen sitzen die Röhren nicht im Gestell, sondern in einem Brustkorb aus Kupfer, und in der Mitte, wo die große Senderöhre sein sollte, ein Gesicht hinter Glas, das spricht. Er ruft das Rauschen (alle 3 Züge), und es flickt ihn.
- **Silhouette:** ein hoher Schrank auf kurzen Beinen, oben eine Spule wie ein Turban, seitlich ein großer gebogener Trichter, unten Wurzeln.
- **Kampf (86 Leben):** Kniff `verborgen`: Man hört nur die Hälfte; du siehst, was kommt, nicht wie viel. `besonders: phasen` bei 50 %: Sprite `sender_p2`, neues Muster, Schwachstelle wechselt von Salz zu Glaube, ruft alle 3 Züge das Rauschen (das ihn heilt: erst das Rauschen töten). Muster Phase 1: Signal (10), Morsen (5 × 3), Block 11, Träger (13). Phase 2: 2 × 8, **Funkstille** (Block 10, `unverw`: zwischen zwei Zeichen ist nichts, was man treffen kann; die Absicht zeigt „? unverwundbar“), Sprechen (16), Stärke +2, 6 × 3.
- **Schwachstelle Salz** (Phase 1): Salz frisst Kupfer. **Glaube** (Phase 2): Wenn die Stimme spricht, kann man ihr antworten.
- **Stimme:** `bote`. **Beute:** Reliquie *Die Senderöhre*.

## Items

| ID | Name | Bereich, Stoff | Seltenheit | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|---|
| `morsetaste` | Die Morsetaste | Waffe, Eisen | gewöhnlich, 1 Kerbe, 22 | – | Kurz, kurz, lang (1: 2 × 3) | Messing auf Eichenholz, der Knopf blank gegriffen. Wenn du sie loslässt, tippt sie weiter, ein, zwei Zeichen, wie ein Nachzittern. |
| `kopfhoerer` | Kopfhörer der Station | Kleidung, Licht | selten, 2 Kerben, 42 | `kette_start 1` | Mithören (1: Block 4, ziehe 1) | Man hört darin das Rauschen, und im Rauschen, ganz leise, jemanden, der mitschreibt. |
| `funkenstrecke` | Die Funkenstrecke | Talisman, Feuer | selten, 2 Kerben, 44 | `mehrfach_plus1` | Überschlag (1: 2 × 2, Funke) | Zwei Kupferkugeln, ein Finger breit auseinander. Der Funke springt, auch wenn niemand sendet. |
| `senderoehre` | Die Senderöhre | Talisman, Licht | **Reliquie** (Wächter), 140 | `reaktion_schaden 2` | Auf Sendung (2: 4 an allen, Kette 1, Funke) | Sie ist kalt, und sie glüht. Hält man sie ans Ohr, hört man nichts. Hält man sie ans Eis, antwortet es. |

Die Reliquie stützt Kettenwerk (Funken = Funkentelegrafie): Jede Reaktion geht auf Sendung und trifft irgendwo. Kopfhörer (Kette ab Zugbeginn) und Funkenstrecke (Mehrfachtreffer) stützen Kettenwerk und Hagel. Fundpool: die drei plus Kompass, Sturmlaterne, Spieluhr, Taschenuhr, Robbenfell, Rum, Leuchtpistole, Grubenlampe, Dynamit, Riechsalz.

## Ereignisse (6, alle aus diesem Ort)

| ID | Szene | Folgen | Bezug auf Früheres |
|---|---|---|---|
| `funkstation_morsetisch` | Die Taste klopft allein; der Streifen buchstabiert deinen Namen, er ist noch nicht zu Ende | Handgriff + Name antworten, Kopfhörer aufsetzen (Item, −max. Leben), Streifen abreißen (Gold) | – |
| `funkstation_mast` | Das Eishaar am Mast ist warm, darin hängt etwas | hinaufsteigen (Kerbe, −Leben), Strähne abschneiden (Morsetaste), Kampf (Mastkletterer) + Item | – |
| `funkstation_kojen` | Zwölf Kojen, elf Schlafsäcke zugeschnürt, im zwölften dein Name eingestickt | schlafen (volle Heilung, max. Leben −4), Proviant (Heilung + Gold), Namen auftrennen (Schleifen) | – |
| `funkstation_eisloch` | Die Litze führt ins Loch und ist straff; jemand zieht, zweimal | zurückziehen (Kampf Rauschen + Reliquie gegen Leben), loslassen, Hinabhorchen | `event_gesehen: hafen_leiter` (Akt I: die Signalleine an der Kaileiter, zweimal) |
| `funkstation_logbuch` | Das Funklogbuch 1912: jeden Tag „kein Empfang“, dann eine Seite in Morse, die du lesen kannst | Handgriff, Kerbe, Schleifen | `event_gesehen: eis_zelt` (das Zelt der Expedition), `job: detektiv` |
| `funkstation_antwort` | Der Sender ist warm, auf dem Tisch liegt ein Formular: „Antwort an“ und dein Name | +1 Energie auf Dauer gegen max. Leben, Funkenstrecke, Gold | `event_gesehen: funkstation_morsetisch`, `item: kopfhoerer` |

Kein Stummfilm. Kein „deine Handschrift“-Motiv (das haben andere Biome); hier ist es dein **Name**, und er kommt von unten.

## Musik

d-Moll, Grundton 50 (Schwarzes Eis 54, Walkathedrale 45, Glasmeer 56, Mond 48). Ort: Wind über dem Eis, sehr tief der Eisgrund, ein Schimmer wie ein Röhrensummen; Rhythmus `holz` (das Klopfen der Taste), Einzelklänge aus `eis`.

## Prüfung

- `node tools/sprites/pruefen.js funker_a funker_b telegrafistin_a telegrafistin_b mastkletterer_a mastkletterer_b rauschen_a rauschen_b sender sender_p2`: **10 Sprites, 0 Verstöße** (unterwegs behoben: Leerlauf des Rauschens zu unruhig → je Bild nur ein Band, das rutscht; Sender ohne Kern-Pixel in Idle 2; Randlicht am Mastkletterer b im Angriff).
- `node tools/icons/pruefen.js`: 230 Bilder, 0 Verstöße.
- Kontaktbogen neben den Favoriten und Silhouetten: [funkstation-bogen.png](../bilder/Zugabe/funkstation/funkstation-bogen.png); gegen **alle** vorhandenen Sprites (Funkstation rot unterlegt): [silhouetten-gegen-alle.png](../bilder/Zugabe/funkstation/silhouetten-gegen-alle.png). Gittermast, in Bänder geschnittene Gestalt, Streifen aus dem Mund und Schrank mit Trichterhals gibt es sonst nirgends. Alle Animationen: [animationen.png](../bilder/Zugabe/funkstation/animationen.png), [animationen-waechter.png](../bilder/Zugabe/funkstation/animationen-waechter.png).
- Hintergrund: [hintergrund-varianten.png](../bilder/Zugabe/funkstation/hintergrund-varianten.png) (V0, V1, V2, Wächter, mit den echten Sprites), [hintergrund-arten.png](../bilder/Zugabe/funkstation/hintergrund-arten.png), [hintergrund-fremdheit.png](../bilder/Zugabe/funkstation/hintergrund-fremdheit.png) (fremdheit 1). Aufbau je Szene 60–160 ms in headless Chromium.
- Im Spiel (`newRun('fischer',3,{dev:true,route:['hafen','kapelle','salz','funkstation','pforte']})`, `Dev.springe(…,3)`): [im-spiel-kampf.png](../bilder/Zugabe/funkstation/im-spiel-kampf.png) (V2), [im-spiel-kampf-2.png](../bilder/Zugabe/funkstation/im-spiel-kampf-2.png) (V2, „Dein Name“ in der Hand), [im-spiel-kampf-3.png](../bilder/Zugabe/funkstation/im-spiel-kampf-3.png) (V0), [im-spiel-kampf-alle-vier.png](../bilder/Zugabe/funkstation/im-spiel-kampf-alle-vier.png) (V1), [im-spiel-waechter.png](../bilder/Zugabe/funkstation/im-spiel-waechter.png), [im-spiel-waechter-p2.png](../bilder/Zugabe/funkstation/im-spiel-waechter-p2.png) (Phasenwechsel im Spiel ausgelöst). **Keine Konsolenfehler.**
- Ereignisbilder: `node tools/ereignisse/bauen.js funkstation` (6/6), Kontaktbogen [kontakt-zugabe2-funkstation.png](../bilder/Zugabe/ereignisse/kontakt-zugabe2-funkstation.png); `node tools/ereignisse-fotos.js`: 139 von 139 Ereignissen mit Bild ohne Fehler.
- `node tools/test-ereignisse.js` und `node tools/test-run.js`: „Alles gut.“

### Abstimmung
Erste Werte (normale Gegner 18–26 Leben, Wächter 78): `biom-test funkstation 20` 17/19 überstanden (89 %, zu leicht; ein Seed starb schon im Vorlauf). Erhöht: alle normalen Gegner +3 Leben und +1 Schaden, Rauschen heilt 5, Wächter 86 Leben und je Schlag +1. Danach **13/19 (68 %)**, 0 Fehler. Die Niederlagen verteilen sich auf den schweren Kampf (Telegrafistin verstopft die Hand, Funker spielt große Karten zurück) und den Wächter in Phase 2, wenn das gerufene Rauschen ihn heilt.

## Vorschläge an den Kern

1. **`verborgen` je Phase:** Der Sender soll in Phase 2 klar sprechen (Absicht sichtbar) und dafür anders gefährlich werden. Heute gilt der Kniff für den ganzen Kampf; `besonders.kniffe: [[…], […]]` je Phase wäre eine Zeile in `checkPhase`.
2. **`kopie` mit Herkunft zeigen:** Die Absicht des Funkers könnte die Karte nennen, die er zurückspielen wird (heute steht nur die Absicht seines Musters da, die Kopie kommt überraschend obendrauf).
3. **Szene hört auf `boss_phase`** (wie beim Mond vorgeschlagen): Im Senderaum könnten bei Phase 2 die Fensterscheiben dunkel werden und mehr Morselichter im Bodenloch blinken; die Szene wird heute nur einmal je Knoten gebaut.
4. **Stimme `funk`:** Ein Gegnerstimmen-Baustein aus kurzen Sinus-Pieptönen im Morserhythmus (Taste) würde Funker, Telegrafistin und Sender eine eigene Stimme geben; heute leihen sie sich `rufer`, `netzflickerin`, `bote`.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt. Jedes Bild selbst angesehen (Vorschauen ×2–×3, Kontaktbogen, Szenen ×2, Bildschirmfotos).

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Funker | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Ellbogen-Flügel über dem Kopf, glühende Muschel als inneres Licht, Kabel als Schwanz bis in den Schnee: eigen und lesbar; b mit Tornister und Stabantenne. Der Anorak bleibt trotz Latz, Fellsaum, Gürtel und Nähten die größte dunkle Fläche, und das Profil (Nase, Kiefer) wirkt etwas schnabelartig. Erst nach Umbau (Kopf war ein Klumpen, Kabel kreuzte die Brust). |
| Telegrafistin | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Der Papierstreifen aus dem Mund in Schleifen bis zum Boden ist das falsche Detail und die Silhouette zugleich; b trägt ihn als Schleppe. Im Spiel liegt dazu „Dein Name“ in der Hand. Der Rock ist eine dunkle Fläche mit nur drei Bahnen; die Finger lesen sich erst im Angriff. Vorher war der Streifen eine gedithert rauschende Kette (zu unruhig), jetzt ein flaches Band. |
| Mastkletterer | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Der Gittermast ist eine Silhouette, die es im Spiel nicht gibt, der Isolator oben glüht; das Eishaar hängt wie ein Vorhang. Der Mann selbst wird vom Haar halb verdeckt und ist kleiner als die anderen Figuren. Umbau: Streben ohne Randlicht (vorher war der Mast heller als die Figur), Mann größer. |
| Rauschen | 5 | 4 | 4 | 4 | 4 | 5 | **4** | Die in Bänder geschnittene Gestalt mit der Röhre als Herz liest sich sofort, jede Schnittkante fängt Licht; vor Schnee und Eis im Spiel sehr klar. Etwas frontal und steif; b ist nicht so gebückt, wie es heißen soll (breiter, Bänder weiter). Die Wolken-Probe war unlesbar. |
| Der Sender (Wächter) | 5 | 4 | 4 | 5 | 5 | 5 | **4** | Schrank mit Spulenkrone, Trichter wie ein Kopf am Hals, Kabelwurzeln; Phase 2 mit Kupfer-Brustkorb und Gesicht hinter Glas. Das Gesicht ist schlicht (wirkt wie ein Totenkopf) und der Trichter reicht im Angriff bis an den Bildrand. Erster Entwurf las sich wie ein Spielzeugroboter (zwei Skalen als Augen, Spule als Hut) und ist ersetzt. |
| Wächter im Spiel-Foto | 5 | 5 | 4 | 5 | 5 | 5 | **4** | Die helle, ruhige Fensterwand steht genau hinter dem dunklen Schrank, die Röhren glühen dagegen; Absicht „?“ und Name lesbar. Der Mast draußen geht hinter der Spule etwas unter. |
| Hintergrund V0 Der Mast | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Hütte mit glühendem Fenster, riesiger Mast mit Eishaar-Seilen, blankes Eis mit Morselichtern, die auf dich zulaufen. Das Loch im Eis liegt oft hinter einem Gegner, nur Draht und Streifen zeigen hin. |
| Hintergrund V1 Der Funkraum | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Morsetisch mit Röhren, Kopfhörer, Lampe; Streifen in die Ritze, aus der es blinkt; Fenster mit Mast. Die vier Röhren sind groß und hell und konkurrieren im Spiel mit Köpfen davor; der Dielenboden vorn ist ruhig (dort liegt die UI). |
| Hintergrund V2 Das Eisloch | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Station klein in der Ferne, Litze auf Stangen ins Loch, blankes Eis mit zwei Lichterreihen, Zelt, Schlitten. Die Schneewehen sind etwas gleichförmig gestreift. |
| Hintergrund Wächter Der Senderaum | 5 | 5 | 4 | 4 | 5 | 5 | **4** | Siehe oben; Akkuregale, Kabel zum blinkenden Loch im Boden. `fremdheit` verdunkelt nur die Scheiben, mehr ändert sich nicht. |
| **Hintergrund gesamt** | | | | | | | **4** | |
| Ereignisbilder (6) | 4 | 4 | 4 | 4 | 5 | – | **4** | Je ein Motiv und eine helle Stelle (Lampe, Isolator, Laterne, Glut im Loch, Formular). Schwächste: „Antwort an“ (der Schrank ist nur ein Rahmen mit Röhren) und „Das Funklogbuch“ (die Seiten sind eine große helle Fläche). Morsetisch, Kojen und Antwort zweimal überarbeitet (Empfänger und Säcke waren unsichtbar). |
| Item-Icons (4) | 4 | 4 | 4 | 4 | 4 | – | **4** | Taste, Kopfhörer, Funkenstrecke, Röhre unterscheiden sich bei 32 px; der Funke der Funkenstrecke war zuerst zwischen den Kugeln verschwunden. Die Röhre glüht in der blassen Licht-Farbe, nicht orange. |

Nichts unter 4.

## Offene Schwächen

- Anorak des Funkers und Rock der Telegrafistin bleiben die dunkelsten Flächen des Bioms.
- `fremdheit` verändert die Szenen nur wenig (mehr Morselichter, dunklere Scheiben).
- Die Gegner haben keine eigene Funk-Stimme (Vorschlag 4).
