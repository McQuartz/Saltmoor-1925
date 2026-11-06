# Die Station, die nie eröffnet wurde (`station`) · Akt III · Zugabe

Biom-Paket nach [paket-format.md](../paket-format.md), Zugabe aus [03-meilensteine.md](../03-meilensteine.md). Zeitschicht Akt III: **die Tiefe**, darin eine Station von 1925, die tiefer liegt als jede andere Bahn der Stadt. Bilder: [bilder/Zugabe/station/](../bilder/Zugabe/station/). Alles per Skript gezeichnet (Weg A, `quelle: skript`), kein Bild-Generator in der Sitzung.

| Teil | Datei |
|---|---|
| Daten | `prototype/data/biome/station.json` |
| Hintergrund | `prototype/js/scenes/world/station.js` |
| Zonenpalette | `tools/sprites/zonen/station.json` |
| Gegner | `tools/sprites/gegner/sperrenschaffner.js`, `wartende.js`, `streckengaenger.js`, `kachelleger.js`, `einfahrt.js` |
| Ereignisbilder | `tools/ereignisse/bilder/station.js` |
| Item-Icons | `tools/icons/items/bahnsteigkarte.js`, `streckenlaterne.js`, `letzte_kachel.js`, `stirnlampe.js` |

## Der Ort

Tief unter der Stadt, tiefer als jede Linie, die es gibt, liegt eine Station der Untergrundbahn. Sie ist fertig: weiße Wandkacheln bis unter das Gewölbe, ein grüner Sockel in der Kennfarbe, Bogenlampen an Stangen, Bänke, eine Sperre mit Kanzel, ein Fundbüro, über dem Gleis das Emailschild mit dem Namen. Eröffnet wurde sie nie. Trotzdem fahren Züge ein, voll besetzt, die Gesichter an den Scheiben. Keiner fährt ab.

- **Wahrzeichen:** das **Emailschild** mit dem Namen der Station, weiß auf blau eingebrannt. Der Name ist länger als das Schild: Er läuft mit dem Pinsel in weißer Farbe über die Kacheln weiter, jede Nacht ein Zeichen mehr, das letzte halb fertig (in jeder Variante, in der Wächter-Szene über dem Tunnelmund; mit `fremdheit` wird es länger). Die Zeichen sind Striche in Zellen, keine lesbare Schrift.
- **Falsches Detail:** **Der Tunnel der Ausfahrt ist zugemauert, und der Mörtel ist aus jeder Fuge nach außen gequollen, zu dir hin. Man hat von innen gemauert.** Die Gleise laufen unter der untersten Ziegelreihe weiter. In der Vorhalle endet die Treppe nach oben an der Decke. Es gibt keinen Weg hinaus, nur Züge, die hereinkommen. Nie erklärt. (Die vorgeschlagene rückwärts gehende Uhr ist bewusst ersetzt: Der Uhrmacher im Nachtzug hat schon rückwärts gehende Uhren, das Kurhaus schon „Patienten werden gesünder“.)
- **Palette:** Kacheln weiß bis grüngrau (`#0d1114 … #d4d6cc`), Sockel dunkelgrün (`#040a08 … #2f5648`), Emailblau (`#243c86`), Messing (`#b08e48`), Bogenlampen kalt weißviolett (`#e8f0ff`, Hof `#2c3656`). Figuren: Körper blauschwarz (`#04060a … #1f2c41`), **Randlicht rosa-rot vom Haltesignal** (`#a83a50` / `#ffb4b8`): ein Ton, der im kalten Hintergrund nirgends vorkommt (nur das eine rote Signal am Tunnel). Augen kaltes Mintweiß (`#9ff0da`, Kern `#f2fffa`), dazu sparsam `messing`, `email`, `blass` (bleiche Gesichter, Papier, Glasur).
- **Abgrenzung im Akt:** Salzstollen weiß-salzig mit Fels, Namenlose Stadt Rotschwarz und Ocker, Wald Bernstein, Gezeitenwerk Bronze und Grünspan, Ziegelgruben Ziegelrot und Glut. Die Station ist das einzige **gekachelte, kalt elektrisch beleuchtete** Biom des Akts, Menschenwerk von 1925 mit Fluchtlinien, Rundbögen und Fliesenraster. Die Ziegel kommen nur in der vermauerten Ausfahrt vor, dunkel und klein.
- **Licht:** Bogenlampen an Stangen aus dem Gewölbe (flackern selten), Lichtpools auf der Wand; in der Wächter-Szene ein ruhiges, gleichmäßiges Licht im Tunnel, wo keins sein dürfte. Die Gegner stehen dunkel davor, mit rosa Randlicht und mintweißen Augen.
- **Krämer:** **Der Beamte im Fundbüro** (`art: leihe`). Er verkauft nichts, Fundsachen gehören jemandem. Er verleiht sie gegen eine Gebühr bis zum nächsten Abschnitt; dann kommt der Eigentümer sie abholen. Er sieht dabei auf den Tunnel, als käme der gleich. (Leihe gibt es in Akt III sonst nicht.)

## Hintergrund: Kompositionen

Grundform **Kachelraster und Rundbogen**: Fliesen 9 × 5 px versetzt, die Fugen in der Gegner-Zone nur eine Stufe dunkler (ruhig), im Lampenlicht deutlicher. Kein Nebel. Hinter den Gegnern liegt in jeder Variante eine gegliederte, aber gedämpfte Fläche (Kachelwand im Halbdunkel, grüner Sockel, Gleisbett), keine leere Fläche; helle Kanten nur oben (Gewölbe, Schild, Lampen) und an den Rändern (Tunnelmünder).

### Variante 0: Die Gleiswand
- Frontal über das Gleis. Oben das dunkle Tonnengewölbe mit einem Band aus Emailkacheln und drei Bogenlampen; die gekachelte Wand drüben mit dem **Emailschild** in der Mitte und dem Überlauf auf den Kacheln; darunter der grüne Sockel, das Gleisbett mit Stromschiene und gedämpften Schienen, vorn der Bahnsteig mit weißer Kante und Plattenfugen in Fluchtsicht.
- Links der **Tunnel der Einfahrt**, schwarz mit Ringen, darin das rote Haltesignal. Rechts der **Tunnel der Ausfahrt, zugemauert**, der Mörtel gequollen (falsches Detail). Ein leerer Fahrplankasten an der Wand. Links vorn eine grüne Säule angeschnitten.
- **Hinter den Gegnern:** die Wandmitte zwischen den Lampenpools, dunkler und mit schwachen Fugen (Zone `ruhig`), darunter Sockel und Gleisbett.

### Variante 1: Der Zug am Bahnsteig
- Frontal. Ein langer Wagen steht drüben am Gleis und verdeckt Sockel und Gleisbett: dunkler Wagenkasten, Fenster in Reihe mit trübem Licht, darin Stehende, alle zu dir gewandt, manche mit zwei glimmenden Punkten. Über dem Dach die Kachelwand mit dem Schild. Rechts drückt die Stirn des Zugs gegen die **vermauerte Ausfahrt**: Er kann nicht weiter.
- **Hinter den Gegnern:** die gedämpften Fenster; die Gegner stehen mit rosa Rand davor (im Foto mit allen vier gut lesbar, aber die unruhigste der drei Varianten).

### Variante 2: Die Vorhalle
- Fluchtpunkt-Saal (pro Pixel als Raum gerechnet wie im Waisenhaus): Kachelwände links und rechts, grüner Sockel, Gewölbedecke, Terrazzo mit Feldern. Hinten die breite **Treppe nach oben, die an der Decke endet**, mit Messinggeländern; darüber das Emailschild. Links Fahrkartenschalter mit Messinggittern, im Mittelgrund die Sperrgitter, rechts ein leeres Sperrhäuschen. Drei Bogenlampen.
- **Hinter den Gegnern:** die Stirnwand mit der Treppe, mittelhell und ruhig.

### Wächter-Szene: Der Tunnelmund
- Frontal vor dem großen Rundbogen des Tunnels, aus dem der Zug kommt. **Ruhige, kontrastierende Zone direkt hinter dem Wächter:** Im Tunnel steht ein gleichmäßiges, kaltes Licht, hell in der Mitte, zum Rand hin dunkler, nur drei flache Ringe, sonst keine Struktur. Der dunkle Triebwagen steht davor als klare Silhouette.
- Das Gleis kommt aus dem Mund auf dich zu, links und rechts die Bahnsteige mit weißer Kante; darüber Kachelwand, Sockel, das Emailschild über dem Bogen; links ein Signal (grün, ab Phase 2 rot). Staub treibt aus dem Tunnel nach vorn.
- **Phase 2** (`o.phase`): Das Licht im Tunnel wird dunkler, das Signal steht auf Halt.

### Die anderen Arten
- **weg / wandbild:** Variante nach Seed (Relief im Stil des Bioms über `reliefStil`). **rast:** Vorhalle, das Kohlenbecken der Streckenarbeiter mit einer Bank. **werkstatt:** Vorhalle, Werkbank. **kraemer:** Vorhalle, der Schalter des Fundbüros mit Messinggitter, dahinter Regale voller Hüte, Koffer, Schirme, eine Lampe. **ereignis / fund:** Gleiswand, ein gepackter Koffer allein auf dem Bahnsteig. **uebergang:** im Tunnel, an den Schienen entlang, Lampe um Lampe, am Ende ein kaltes Licht, das nicht näher kommt (zum schwarzen Eis).

## Gegner

Arbeitsweise: je Gegner zwei Silhouetten-Proben als schwarze Fläche (die verworfene steht als `proben` im Skript), gegen **alle** vorhandenen Sprites gelegt ([silhouetten-gegen-alle.png](../bilder/Zugabe/station/silhouetten-gegen-alle.png), Station rot), dann Licht, Randlicht, Fase, Dither, Binnenform, Pixel. **Zur Rückmeldung „große dunkle Flächen“ und „Wächter geht unter“:** Randlicht in einem Ton, den der Hintergrund nicht hat (rosa-rot gegen kaltes Weißgrün), Innenkanten-Randlicht an überlappenden Teilen, Gliederung durch Material (Bretter der Kanzel, Revers und Messingknöpfe, Papiertüte, Kacheln, Schienen) und je ein inneres Licht (Lampe der Sperre, Medaillon, Laterne, Licht aus den Fugen, Stirnlampen).

Die Ideen aus dem Auftrag sind teils ersetzt, weil es sie schon gibt: Fahrkartenknipser mit gelochtem Licht → Kontrolleurin (Nachtzug); Hutschachtel → Gepäckstück (Nachtzug); „Pendler, die nur zusammen stehen“ → Warteschlange (Waage). Stattdessen: Sperrenschaffner in seiner Kanzel, Wartende mit dem langen Hals, Kachelleger.

### Der Sperrenschaffner (`sperrenschaffner`)
- **Motiv:** Die Kontrolle am Eingang, die niemanden hereinlässt, weil niemand kommt.
- **Wer er war:** der Schaffner an der Bahnsteigsperre, eingestellt für den Tag der Eröffnung.
- **Was falsch ist:** Er steht in seiner hölzernen Kanzel und lehnt sich heraus. Die Kanzel hat keine Tür; wo seine Beine sein müssten, laufen die Bretter in seinen Mantel hinauf. Sein rechter Unterarm endet nicht in einer Hand, sondern in der Lochzange. Unter der Zange rieseln Papierplättchen.
- **Silhouette:** ein halbhoher Kasten, darin ein Mann mit Schirmmütze bis zur Hüfte, ein langer Arm mit Zangenmaul nach vorn, über ihm eine Lampe am Schwanenhals.
- **Varianten:** a Zange vorgestreckt, die andere Hand auf dem Brett; b Zange hoch über dem Kopf, die andere Hand fordernd vorgestreckt, seitlich ein Fahrkartenfach.
- **Kniff:** `verstopfen` (1, Karte „Gelocht“): Er knipst dir den Fahrschein in die Hand; durch das Loch fällt, was du halten wolltest. In Akt III sonst nicht vertreten, fordert schlanke Hände und Ballast-Builds.
- **Muster:** Knipsen (8), 2 × 4, Block 7. 27 Leben. **Beute:** Die Bahnsteigkarte.
- **Schwachstelle Feuer:** Die Kanzel ist aus Holz, und er ist es inzwischen auch.
- **Stimme:** `rufer`.

### Die Wartende (`wartende`)
- **Motiv:** Das Warten, das den Körper verformt.
- **Wer sie war:** eine Frau im Sonntagsmantel von 1925, die am Tag der Eröffnung jemanden abholen wollte.
- **Was falsch ist:** Bei jedem Zug, der einfährt, hat sie den Hals gereckt, um in den Tunnel zu sehen, und der Hals ist dabei lang geworden, mit Ringen wie ein ausgezogenes Rohr. Ihr Kopf mit Glockenhut und Schleier hängt weit vor ihr in der Luft. Die Blumen in der Papiertüte sind trocken und hängen mit den Köpfen nach unten.
- **Silhouette:** eine Frau im geraden Mantel, aus deren Schultern ein Hals im Bogen nach vorn steigt, an seinem Ende ein Kopf mit Hut.
- **Varianten:** a Strauß, der Hals als S nach vorn; b Schirm als Stock und Handtasche, der Hals steigt erst hoch und hängt dann wie ein Fragezeichen. Angriff: Der Kopf stößt herab wie ein Reiher.
- **Kniff:** `verborgen`: Hinter dem Schleier sieht man nicht, was sie vorhat. Neu im Akt.
- **Muster:** 9, 2 × 5, Block 6. 24 Leben. Der Wächter ruft sie in Phase 2 („es steigt eine aus, mit Blumen“).
- **Schwachstelle Glaube:** Sie wartet auf eine Ankunft. Wer ihr sagt, dass niemand mehr kommt, und es glaubt, nimmt ihr den Grund.
- **Stimme:** `netzflickerin`.

### Der Streckengänger (`streckengaenger`)
- **Motiv:** Das Gleis, das an einem Menschen endet.
- **Wer er war:** der Streckenläufer, der 1925 jede Nacht mit Laterne und Hammer die Strecke abging und an jede Schiene klopfte, ob sie klingt.
- **Was falsch ist:** Die beiden Schienen kommen aus dem Tunnel, laufen am Boden heran und biegen an seinen Fersen nach oben; sie sind seine Beine. Wohin er geht, geht das Gleis mit.
- **Silhouette:** ein Mann im langen Ölzeug mit Schirmmütze, Laterne vorgestreckt, Vorschlaghammer auf der Schulter; von seinen Füßen laufen zwei Linien am Boden bis zum Bildrand.
- **Varianten:** a Laterne vorgestreckt, Hammer geschultert; b Laterne hoch über dem Kopf, der Hammer hängt, sein Kopf ruht auf der Schiene.
- **Kniff:** `voraus`: Er geht die Strecke vor dir ab; was du als Nächstes ziehst, hat er schon in der Hand, und er ist schwach gegen den Stoff, den du am wenigsten spielst. In Akt III neu.
- **Muster:** Block 8, 7, 2 × 4 (weich, weil `voraus` jeden Zug deine nächste Karte obendrauf spielt). 28 Leben. **Beute:** Die Streckenlaterne.
- **Schwachstelle Licht** (zu Beginn; danach der Stoff, den du am wenigsten spielst): Wer ihm vorausleuchtet, ist ihm voraus.
- **Stimme:** `salzlaeufer`.

### Der Kachelleger (`kachelleger`)
- **Motiv:** Die Arbeit, die nicht aufhört, wenn sie fertig ist.
- **Wer er war:** der Fliesenleger, der die Station Wand um Wand gekachelt hat, bis zum Tag der Eröffnung.
- **Was falsch ist:** Er hat nicht aufgehört. Die Kacheln wachsen ihm über Rücken, Schulter und Hinterkopf, in sauberen versetzten Reihen mit Fugen, und er drückt mit der Kelle die nächste an sich selbst. Aus manchen Fugen kommt ein kaltes Licht, als wäre hinter ihm noch ein Raum.
- **Silhouette:** ein gebückter, breitbeiniger Mann mit Schurz und vorgestreckter Kelle; sein Rücken ist ein Buckel mit Treppenkante aus Fliesen.
- **Varianten:** a Kacheln auf Rücken und Hinterkopf, eine Kachel in der Hand, die er sich auf die Brust drückt; b zugekachelt bis auf ein Auge, auch der Kellenarm, ein Mörteleimer an der Hand.
- **Kniff:** `abschrift` (1, Karte „Kachel“): Was offen ist, verfugt er. In Akt III neu; die Kacheln sind Ballast für die Letzte Kachel und die Ballast-Builds.
- **Muster:** 9, Block 9, 2 × 5. 30 Leben. **Beute:** Die letzte Kachel.
- **Schwachstelle Wasser:** Wasser löst den Mörtel.
- **Stimme:** `grabwaechter`.

### Wächter: Der Zug, der einfährt (`einfahrt`, 160 × 180, zwei Phasen-Sheets)
- **Motiv:** Die Ankunft, die nicht aufhört.
- **Was er ist:** ein Triebwagen der Untergrundbahn von 1925, schräg von vorn, wie er aus dem Tunnel kommt: gewölbtes Dach, Zielanzeiger, drei Stirnfenster mit der Tür in der Mitte, zwei Stirnlampen (die Augen), Pufferbohle, Kupplung, Bahnräumer; die Seite läuft als Keil nach hinten ins Dunkel, Fenster um Fenster, darunter die Räder. Er ist voll: In jedem Fenster stehen bleiche Gesichter, die Hände flach an der Scheibe. Der Zielanzeiger zeigt den Namen der Station, und die Lichtpunkte laufen über das Schild hinaus aufs Blech.
- **Phase 2** (ab 50 %, Sprite `einfahrt_p2`): Die Türen gehen auf. Was drin ist, will nicht aussteigen; es greift heraus. Bleiche Arme aus Tür, Stirnfenster und Seitenfenstern, im rechten Fenster nur noch Augen im Dunkel, eine Stirnlampe flackert.
- **Silhouette:** ein hoher gewölbter Kasten mit einem langen Keil nach links hinten, unten Räder und Räumer. (Probe frontal ohne Seite verworfen: ein Schrank, zu nah am Sender.)
- **Kampf (108 Leben):** Kniff `ansage` (2 Züge, 30): **Einfahrt**, erst das Licht im Tunnel, dann das Rauschen in den Schienen, dann der Zug. `besonders: phasen` bei 50 %: Sprite `einfahrt_p2`, Schwachstelle wechselt von Salz zu Blut, ruft alle 3 Züge eine Wartende. Muster Phase 2: 3 × 8, **Zurückbleiben** (Block 14, `unverw`: die Türen schließen sich, und dahinter ist nichts, was man treffen kann), 20, Stärke +3, 4 × 5.
- **Schwachstelle Salz** (Phase 1): Salz auf den Schienen, und die Räder greifen nicht. **Blut** (Phase 2): Wenn die Türen offen sind, ist er nur noch das, was drin sitzt.
- **Stimme:** `wurm`. **Beute:** Reliquie *Die Stirnlampe*.

## Items

| ID | Name | Bereich, Stoff | Seltenheit | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|---|
| `bahnsteigkarte` | Die Bahnsteigkarte | Talisman, Glaube | gewöhnlich, 1 Kerbe, 20 | – | Warten (1: Block 6, behalten) | Gültig zum Betreten des Bahnsteigs, nicht zur Fahrt. Gelocht am Tag der Eröffnung, den es nicht gab. |
| `streckenlaterne` | Die Streckenlaterne | Talisman, Licht | selten, 2 Kerben, 42 | `hand_plus 1` | Ableuchten (1: 3 Schaden, Verwundbar 1, ziehe 1) | Ein Blechgehäuse mit grünem und weißem Glas. Das Licht darin ist kalt, und es zeigt immer ein paar Schwellen voraus. |
| `letzte_kachel` | Die letzte Kachel | Kleidung, Salz | selten, 2 Kerben, 44 | `ballast_block 2`, `ballast_start 2` („Kachel“) | Verfugen (1: Block 7) | Weiß glasiert, auf der Rückseite noch der Mörtel. Sie passt in jede Lücke, auch in die, die du nicht hast. |
| `stirnlampe` | Die Stirnlampe | Talisman, Eisen | **Reliquie** (Wächter), 140 | `mehrfach_plus1` | Einfahrt (2: 3 × 2 an allen) | Die Lampe eines Triebwagens, der zum ersten Mal abgefahren ist. Sie brennt ohne Strom, und wohin du sie richtest, kommt etwas näher. |

Die Reliquie stützt Hagel (Schienenstoß um Schienenstoß: jeder Mehrfachangriff einmal mehr, die eigene Karte trifft alle dreimal, mit der Eigenschaft viermal). Die Letzte Kachel ist ein Ballast-Item (Bollwerk aus unspielbaren Karten) und arbeitet mit dem Kachelleger und dem Sperrenschaffner zusammen. Fundpool: die drei plus Sturmlaterne, Taschenuhr, Kompass, Grubenlampe, Spitzhacke, Schaufel, Spieluhr, Riechsalz, Uhr ohne Zeiger.

## Ereignisse (6, alle aus diesem Ort)

| ID | Szene | Folgen | Bezug auf Früheres |
|---|---|---|---|
| `station_schild` | Das Emailschild; der Name läuft mit dem Pinsel weiter, der letzte Buchstabe ist nass | seltener Handgriff gegen max. Leben, Schleifen gegen Leben, +5 Leben | – |
| `station_zug` | Ein voller Zug, ein freier Platz mit einer Fahrkarte; alle sehen nach vorn zur Mauer | Reliquie gegen −10 max. Leben, Bahnsteigkarte, nichts | `event_gesehen: nachtzug_fahrkarte` (Akt I: dieselbe Fahrkarte; Kerbe und Reaktion) |
| `station_sperre` | Die leere Kanzel, Lochzange, gelochte Fahrscheine, eine Schale mit Plättchen | Kerbe gegen Leben, Gold, seltenes Item mit Kampf gegen den Sperrenschaffner | – |
| `station_mauer` | Die vermauerte Ausfahrt, Mörtel nach außen gequollen; es klopft zweimal | seltener Handgriff, Letzte Kachel gegen max. Leben, nichts | `item: pick` (mit der Spitzhacke einen Ziegel lösen: Reliquie) |
| `station_bank` | Drei Wartende auf der Bank, die Hälse zu lang | volle Heilung gegen max. Leben, Handgriff | `event_gesehen: waisenhaus_reihe` (Akt II: das Kind aus der Reihe; Kerbe und Gold) |
| `station_treppe` | Die Treppe nach oben endet an der Decke; oben stehen Schuhe | Reaktion und Kerbe gegen max. Leben, Item tauschen, +8 Leben | – |

Kein Stummfilm.

## Musik

e-Moll, Grundton 52 (Salzstollen 53, Namenlose Stadt 46, Wald 51, Gezeitenwerk 43, Ziegelgruben 50). Ort: Zugluft in den Gängen, leiser Wind und Stollen; Rhythmus `ketten` (Schienenstöße), Einzelklänge aus `stadt`.

## Prüfung

- `node tools/sprites/pruefen.js sperrenschaffner_a sperrenschaffner_b wartende_a wartende_b streckengaenger_a streckengaenger_b kachelleger_a kachelleger_b einfahrt einfahrt_p2`: **10 Sprites, 0 Verstöße** (unterwegs behoben: Idle des Sperrenschaffners und des Zugs unruhig, weil sich Teile gegen den festen Dither verschoben → Zug als Ganzes verschoben; Lichtfarben im Angriff des Zugs in Phase 2 über 6 % → Arme dünner gedithert).
- `node tools/icons/pruefen.js`: 242 Bilder, 0 Verstöße.
- Kontaktbogen neben den Favoriten und Silhouetten: [station-bogen.png](../bilder/Zugabe/station/station-bogen.png); gegen **alle** 220 Sprites: [silhouetten-gegen-alle.png](../bilder/Zugabe/station/silhouetten-gegen-alle.png). Kanzel mit Schwanenhals, Hals mit Kopf weit vor dem Körper, Schienen als Beine, Fliesenbuckel und der Triebwagen-Keil kommen sonst nicht vor; der Kachelleger ist die gewöhnlichste Silhouette (gebückter Mann). Animationen: [animationen.png](../bilder/Zugabe/station/animationen.png), [animationen-waechter.png](../bilder/Zugabe/station/animationen-waechter.png).
- Hintergrund: [hintergrund-varianten.png](../bilder/Zugabe/station/hintergrund-varianten.png) (V0, V1, V2 mit allen vier Gegnern, Wächter), [hintergrund-arten.png](../bilder/Zugabe/station/hintergrund-arten.png), [hintergrund-fremdheit.png](../bilder/Zugabe/station/hintergrund-fremdheit.png) (fremdheit 1, Wächter Phase 2). Aufbau je Szene 50–170 ms in headless Chromium.
- Im Spiel (`newRun('fischer',3,{dev:true,route:['hafen','kapelle','station','eis','pforte']})`, `Dev.springe(…,2)`): [im-spiel-kampf.png](../bilder/Zugabe/station/im-spiel-kampf.png), alle vier Gegner in jeder Variante [V0](../bilder/Zugabe/station/im-spiel-kampf-alle-vier-v0.png), [V1](../bilder/Zugabe/station/im-spiel-kampf-alle-vier-v1.png), [V2](../bilder/Zugabe/station/im-spiel-kampf-alle-vier-v2.png), b-Varianten [im-spiel-kampf-b.png](../bilder/Zugabe/station/im-spiel-kampf-b.png), [im-spiel-waechter.png](../bilder/Zugabe/station/im-spiel-waechter.png) (Absicht „30 in 2“), [im-spiel-waechter-p2.png](../bilder/Zugabe/station/im-spiel-waechter-p2.png) (Phasenwechsel im Spiel ausgelöst). **Keine Konsolenfehler.**
- Ereignisbilder: `node tools/ereignisse/bauen.js station` (6/6), Kontaktbogen [kontakt-zugabe2-station.png](../bilder/Zugabe/ereignisse/kontakt-zugabe2-station.png); `node tools/ereignisse-fotos.js`: 157 von 157 Ereignissen mit Bild ohne Fehler.
- `node tools/test-ereignisse.js` und `node tools/test-run.js`: „Alles gut.“

### Abstimmung
Erste Werte (normale Gegner 21–27 Leben, Wächter 82 mit Ansage 21): `biom-test station 20` **19/20** (zu leicht). Danach alle normalen Gegner +5 Leben und +1–2 Schaden, Wächter 96/26: 13/20, aber sechs der sieben Niederlagen im schweren Kampf mit vier Gegnern, nur eine am Wächter. Ausgeglichen: normale Gegner wieder −2 Leben, Wächter 108 Leben, Ansage 30, Phase 2 stärker. **Letzter Lauf 14/20 (70 %), 0 Fehler**; Niederlagen je zur Hälfte im schweren Kampf (Gelocht und Kachel verstopfen Hand und Stapel, der Streckengänger spielt Angriffe voraus) und am Wächter (die Einfahrt, wenn man zwei Züge lang nicht vorgebaut hat, oder Phase 2 mit gerufener Wartender).

## Vorschläge an den Kern

1. **Störkarten mit Bild:** `verstopfen`/`abschrift` mit `karte` zeigen heute das Knochen-Bild. Ein Feld `karte_bild` (Item-Icon-ID, z. B. `letzte_kachel` für „Kachel“, `bahnsteigkarte` für „Gelocht“) wäre eine Zeile in `stoerKarte()`.
2. **`ansage` je Phase:** Beim Phasenwechsel ersetzt `besonders.muster` das Ansage-Muster; das ist hier gewollt (erst Einfahrt, dann offene Türen), aber ein `ansage`-Schritt im Muster selbst (`{t:"laedt"}` mit folgendem großen Schlag) würde Phasen mit Ansage erlauben.
3. **`voraus` in der Absicht zeigen:** `incoming()` rechnet die vorausgespielte Karte schon mit; die Absicht des Streckengängers könnte die Karte nennen („spielt ‚Harpunieren‘ voraus“).
4. **Stimme `zug`:** ein Gegnerstimmen-Baustein aus zwei tiefen Schlägen im Schienenstoß-Rhythmus (ta-tamm) für den Zug und den Streckengänger; heute leihen sie sich `wurm` und `salzlaeufer`.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt. Jedes Bild selbst angesehen (Vorschauen ×3 und ×6, Kontaktbogen, Szenen ×2, Bildschirmfotos).

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Sperrenschaffner | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Kanzel, Zangenarm und Schwanenhals-Lampe sind eine Silhouette, die es sonst nicht gibt; Emailschild und Bretter gliedern den Kasten, Revers, Knöpfe und Schulterstück den Mantel, die Lampe hellt die Mütze auf. Das Gesicht ist klein, und dass die Bretter in den Mantel laufen, sieht man erst bei ×6. Vorher las sich die Zange wie eine Klaue, in b wie ein Victory-Zeichen. |
| Wartende | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Der lange Hals mit dem Kopf weit vor dem Körper ist sofort lesbar und unheimlich; der Reiherstoß im Angriff passt. Der Mantel bleibt eine gerade dunkle Fläche (Gürtel, Falten, Saumband, Pelzkragen gliedern ihn nur schwach), die trockenen Blüten lesen sich eher als rosa Flecken. Die helle Papiertüte war nötig, vorher war der Strauß unsichtbar. |
| Streckengänger | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Laterne als inneres Licht, Vorschlaghammer, Schienen vom Bildrand bis an die Fersen; die Linie am Boden unterscheidet ihn im Spiel sofort. Dass die Schienen *seine Beine* sind, sieht man nur aus der Nähe; der Mantel ist kastig. Der Hammer las sich zuerst als Besen. |
| Kachelleger | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Der Fliesenbuckel mit Treppenkante und Glanzpunkten, Licht aus einzelnen Fugen, Kelle, Kachel in der Hand. Erst rot umrandet sah das Raster wie Ziegel aus (zu nah an den Ziegelgruben), jetzt dunkel glasiert ohne Innenrand. Die Kacheln sind blau-dunkel statt weiß (die Lichtfarben-Regel lässt nur Glanzpunkte zu); die gebückte Silhouette ist die gewöhnlichste des Bioms. |
| Der Zug, der einfährt (Wächter) | 5 | 4 | 4 | 5 | 5 | 5 | **4** | Triebwagen-Keil mit gewölbtem Dach, Zielanzeiger, bleichen Gesichtern hinter den Scheiben, Stirnlampen als Augen; Phase 2 mit bleichen Armen aus Tür und Fenstern. Die Seite ist trotz Fensterreihe, Zierleiste und Türfugen eine große dunkle Fläche; die Arme in Phase 2 sind etwas steif (gerade Kapseln). Vorher: Gesichter als graue „Blätter“, Fenster schwarz, Arme dunkelblau. |
| Wächter im Spiel-Foto | 5 | 5 | 4 | 5 | 5 | 5 | **4** | Der dunkle Zug steht genau vor dem ruhigen, kalten Licht im Tunnel und kommt auf den Schienen auf dich zu; Absicht „30 in 2“ und Name lesbar. In Phase 2 wird das Tunnellicht dunkler, der Kontrast nimmt etwas ab, die bleichen Arme halten ihn. |
| Hintergrund V0 Die Gleiswand | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Schild mit Überlauf, Tunnel mit rotem Signal, vermauerte Ausfahrt mit gequollenem Mörtel, Lampen, Gewölbe; alle vier Gegner stehen mit rosa Rand vor der gedämpften Wandmitte. Der Bahnsteig unten ist eine große ruhige Fläche (im Spiel zum Teil unter den Karten). |
| Hintergrund V1 Der Zug am Bahnsteig | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Der volle Wagen mit Gestalten in jedem Fenster und der Stirn an der Mauer erzählt das Biom ohne Text. Die Fensterreihe liegt genau hinter den Köpfen und ist die unruhigste Zone des Bioms; die Gegner bleiben durch das Randlicht lesbar. |
| Hintergrund V2 Die Vorhalle | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Fluchtpunkt-Saal mit Schaltern, Sperrgittern, Treppe in die Decke und Schild; die ruhigste Kampfszene. Dass die Treppe an der Decke endet, verdeckt oft ein Gegner. |
| Hintergrund Wächter Der Tunnelmund | 5 | 5 | 4 | 5 | 5 | 5 | **4** | Siehe oben; Gleis in Fluchtsicht, Signal grün → rot. Die Kachelwand oben ist etwas gleichförmig. |
| **Hintergrund gesamt** | | | | | | | **4** | |
| Ereignisbilder (6) | 4 | 4 | 4 | 4 | 5 | – | **4** | Schild, Sperre, Ausfahrt und Wartende klar (je ein Motiv, eine helle Stelle). Schwächste: „Der volle Zug“ (die Sitzenden sind kleine Standardfiguren) und „Die Treppe“ (die Schuhe oben sind sehr klein). Zweimal überarbeitet: Die Kachelwände rauschten (gedithertes Licht auf 12 Stufen) → große Fliesen in flachen Stufen, Lampenlicht schwächer; die Ziegelwand war zu hell. |
| Item-Icons (4) | 4 | 4 | 4 | 4 | 4 | – | **4** | Fahrschein mit Loch, kantige Bahnlaterne mit Linse, gekippte Kachel mit Mörtel und Sprung, Stirnlampe mit Lichtstrahl unterscheiden sich bei 32 px. Die Stirnlampe sah zuerst aus wie eine Lupe und ist neu gebaut; die Kachel wirkt eher grau als weiß. |

Nichts unter 4.

## Offene Schwächen

- Die Mäntel der Wartenden und des Streckengängers sind gerade, dunkle Flächen mit wenig Binnenform; die Seite des Zugs bleibt die größte dunkle Fläche des Bioms.
- Variante 1 ist hinter den Köpfen unruhiger als die anderen.
- `fremdheit` verändert die Kampfszenen nur wenig (das Schild wird länger); die Wächter-Szene reagiert auf die Boss-Phase.
- Die Störkarten „Gelocht“ und „Kachel“ zeigen das allgemeine Knochen-Bild (Vorschlag 1).

## Zweiter Wächter: Die Menge (`menge`)

Zugabe. Eingetragen als `biom.waechter_alt` in `prototype/data/biome/station.json`; der Seed wählt je Run zwischen dem Zug, der einfährt, und der Menge, die Szene am Tunnelmund bleibt dieselbe. Sprite `tools/sprites/gegner/menge.js`, Zonenpalette der Station (das rosa Randlicht hat die kalte Szene schon nicht).

- **Idee:** Alle, die zur Eröffnung gekommen sind: Herren mit Zylinder und Melone, Damen mit Glockenhut, ein Schirm, der Pressefotograf mit der Blitzpfanne hoch über den Köpfen, vorn einer mit der großen Schere für das Band. **Das falsche Detail:** Das Band ist nie durchgeschnitten worden, und sie stehen so dicht, dass sie ein Leib geworden sind; alle sehen zum Tunnel, mit dem Rücken zu dir. Nur einer in der Mitte hat sich umgedreht. **Silhouette:** ein breiter Hügel aus Hüten und Schultern auf vielen Beinen, davor quer das Band, nach oben drei Spitzen: die Schere links, der Schirm, rechts der Arm mit der Blitzpfanne. **Proben:** die Menge ohne die erhobenen Arme (schwarz ein Hügel mit Buckeln, nah an Kachelleger und Salzmann), genommen: mit Schere, Schirm und Blitz.
- **Anders als der Zug:** Der Zug kündigt einen großen Schlag an (`ansage`), schließt die Türen (`unverw`) und ruft Wartende. Die Menge **drängt**: Kniff `teurer` (jeden Zug kostet eine Handkarte 1 mehr), viele kleine Treffer (4 × 7, 6 × 5), Besonderheit `schwach_wechsel` Licht ↔ Blut (sie dreht sich mit dem Blitz: mal Gesichter, mal Rücken). Man kämpft gegen Gedränge, nicht gegen einen Schlag.
- **Werte:** 124 Leben, Schwachstelle zu Beginn **Licht**, Muster 4 × 7, Block 14, 24, 6 × 5, Stärke +3. Stimme `glockenmutter`, Beute Bahnsteigkarte.
- **Licht:** Randlicht rosa-rot wie das Haltesignal. Innere Lichter: die Augen des Umgedrehten (mint), die glimmende Blitzpfanne (beim Angriff zündet sie), Messingknöpfe; das Band in Emailblau.
- **biom-test (20 Seeds):** Zug 14/19 (74 %), Menge 15/18 (83 %); die Menge gewinnt dreimal (Zug zweimal), im Mittel 25 Leben je Kampf (Zug 23).

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Die Menge (`menge`) | 5 | 4 | 4 | 5 | 5 | 5 | **4** | Hüte, Schere, Schirm und Blitzpfanne über dem Band lesen sich sofort als Eröffnungsgesellschaft, das eine Gesicht in der Mitte ist das falsche Detail. Schwächen: Die Mäntel unten sind eine große dunkle Fläche (Band und Beine gliedern sie), die Köpfe der hinteren Reihe sind klein. |
| Im Spiel (Tunnelmund) | | | | | | 5 | **4** | Steht im hellen Tunnelbogen; die erhobenen Arme ragen in das Licht. |

Bilder: [Spiel](../bilder/Zugabe/waechter2/station-menge.png), [Kontaktbogen](../bilder/Zugabe/waechter2/bogen-a3.png).
