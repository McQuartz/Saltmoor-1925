# Das Ufer unten (`ufer`) · Akt V

Biom-Paket nach [paket-format.md](../paket-format.md). Steckbrief in [05-inhalte.md](../05-inhalte.md) Abschnitt 3. Zeitschicht: außerhalb der Zeit, aber es ist **früher Morgen**, derselbe Morgen wie am Strand, an dem ein Run endet und beginnt. Akt V hat im Kern nur die Ebenen `vorraum`, `rast`, `finale`; das Finale ist derselbe Boss wie bei der Pforte (`waechter: ruft`).

## Ort

Unter dem schwarzen Eis liegt ein Strand. Es ist der Sand vom Anfang: dieselben Farben wie auf dem Strand-Bildschirm (`hafen.js`, `strand()`), dieselben Rippelmarken, dasselbe Treibholz mit dem abgebrochenen Ast, an derselben Stelle rechts vorne. Nur der Himmel fehlt. Wo er sein müsste, hängt das Meer.

- **Wahrzeichen: das Meer als Decke.** Man sieht die Wasseroberfläche von unten. Die Wellen rollen in Reihen von hinten auf dich zu, und sie brechen **nach unten**: Jede Reihe hat eine steile, dir zugewandte Front, die zur Lippe hin durchscheinend grün wird, und eine Schaumkrone an der Unterkante, von der Wasserfäden herabhängen. An einer Stelle hängt das Meer als **Säule** bis auf den Sand herunter, unten mit einem Schaumring und nassem, dunklem Sand rundherum. Das Wasser in der Säule fällt.
- **Falsches Detail: die Fußspuren.** Eine Spur nackter Füße, deine, führt von vorne über den Sand und endet in der Säule (oder unter der großen Welle). Die letzten Abdrücke stehen voll Wasser. Keine Spur kommt zurück. Je weiter man im Akt kommt (`fremdheit`), desto mehr Spuren derselben Füße kommen dazu, im Finale von allen Seiten. Nie erklärt.
- **Licht:** Morgenlicht, das hinten rechts durch das Wasser über dir fällt; dort sind Decke und Horizontstreifen am hellsten (Gegenlicht von hinten oben rechts wie bei den Figuren). Ein zweites, kühles Licht kommt vom nassen Sand zurück.
- **Palette:** Schiefer, nass (Körper `#040607 … #25333a`), Randlicht innen Seegrau `#5a7678`, außen Morgen `#e4dcc4`; Wasser von Fast-Schwarz bis Flaschenglas-Grün; Sand vom Anfang; Augen warm `#ffd89a` (die Morgensonne hinter dem Wasser).
- **Krämer** (Akt V hat heute keinen Krämer-Knoten, für später): Der Strandwärter, in einer Badehütte ohne Tür. „Er vermietet Strandkörbe. Einer ist noch frei, sagt er, der neben deinem.“

## Hintergrund: Kompositionen

Bildaufbau neu gegenüber allen anderen Orten: **Der Himmel ist das Meer**. Oben ist die dichteste, bewegteste Fläche des Bildes, unten ein ruhiger, heller Boden. Die Ferne (Horizontstreifen, wo Decke und Sand sich treffen) ist der hellste Ort; davor stehen die Gegner als dunkle Formen. Technik: Die Decke ist ein Höhenfeld, spaltenweise von nah nach fern gerendert (umgekehrtes Voxel-Verfahren), so verdecken tief hängende nahe Wellen die fernen. Boden mit Fluchtpunkt, Rippelmarken quer, Flutlinie aus Tang und Muscheln, Steine mit Fase und Randlicht.

### Variante 0: Die Flutlinie

- **Horizont** y 148, Fluchtpunkt (240, 148). Blickpunkt: stehend am Strand, weit.
- **Blickführung:** Die Wellenreihen der Decke laufen in Bögen zum Horizont; rechts der Mitte biegen sie sich zu einem Trichter, aus dem die Säule auf den Sand hängt (x ≈ 320). Deine Spuren kommen von links vorne und laufen schräg hinein. Der Elite-Gegner steht mitten auf der Spur, mit dem Rücken zu dir, und schaut zur Säule.
- **Details und warum:** Treibholz vom Anfang rechts vorne (Wiedererkennen). Flutlinie aus Tang zweimal quer über den Sand, Muscheln darin. Ferne Felsen am Horizont links (die Höhle hat Wände) und ein flacher Fels mittig hinten. Oben links und rechts angeschnittener Höhlenfels mit Tropfzapfen (Vordergrund, Ebene 5): Es ist kein Himmel.
- **Maßstab:** Fußabdruck und Treibholz gegen die Wellenreihen über dir.

### Variante 1: Der Brecher

- **Horizont** y 160, Fluchtpunkt rechts (290, 160).
- **Blickführung:** Eine einzige große Welle hängt von links oben schräg herab und bricht; ihre Lippe berührt hinten links den Sand, dort liegt ein zerrissener Schaumsaum. Die Spuren laufen unter sie. Rechts hinten klein ein Strandkorb.
- **Gegner** stehen vor dem hellen Horizontstreifen rechts der Welle.

### Variante 2: Der Strandkorb

- **Horizont** y 146, Fluchtpunkt (210, 146).
- **Blickführung:** Rechts steigt die Felswand der Höhle in die Flucht (waagerechte Schichten, oben vom Wasser abgeschnitten). Links in der Mitte steht ein **Strandkorb** schräg mit dem Rücken zu dir und schaut aufs Wasser, in der Haube gestreifter, ausgeblichener Stoff, ein nasses Handtuch über der Armlehne. Hinten links hängt die Säule; die Spuren gehen am Korb vorbei hinein.
- **Maßstab:** Strandkorb (1925, jeder kennt die Größe) gegen Wand und Decke.

### Finale-Szene: Wo es ruft (`art: waechter`)

- **Horizont** y 156, frontal. Die Säule steht nah und mittig, oben weit wie ein Trichter, in den sich die Wellenreihen der Decke hineindrehen (Spirale). Von allen Seiten führen Spuren auf ihren Fuß zu, sechs Stück, alle von denselben Füßen; die Flutlinie hat dort eine Lücke. Der Boss steht davor, die Säule hinter ihm; was um ihn herum sichtbar bleibt, ist der Trichter in der Decke und die Spuren, die in seinem Rücken verschwinden.

### Andere Arten

- **weg:** die Variante des Seeds. **rast:** Strandkorb-Szene, ein kleines Feuer aus Treibholz vor dem Korb (Sitz warm). **uebergang** (Ankunft im Akt aus dem Eis): Flutlinie ohne Höhlenrand, links kommt eine hölzerne Strandtreppe aus einem Spalt in der Felswand herab, Sand rieselt die Stufen hinunter. **ankunft** (nach dem Finale): Flutlinie ruhig, ohne Säule, ohne Gischt; die Spuren enden mitten im Sand. Diese Szene steht als `World._biome.ufer.ankunft` bereit, wird heute aber nicht benutzt (siehe Vorschläge an den Kern). **kraemer, werkstatt, ereignis, fund, wandbild:** allgemeine Zusätze aus `basis.js` (Akt V hat diese Knoten heute nicht).
- **Bewegung:** Schaumkronen glitzern, Glanz auf den Wellenrücken, Wasser fällt in der Säule, Gischt regnet von den tiefsten Lippen, einzelne Tropfen fallen aus der Decke. `Math.random` nur in Partikeln.
- **Fremdheit** (Vorraum 0, Rast 0,5, Finale 1): Wellen hängen tiefer, zweite und dritte Spur kommen dazu.

## Elite im Vorraum: Der, der vor dir kam (`vorgaenger`)

- **Motiv:** das Wiedersehen. Der Doppelgänger, aber nicht als Spiegel, sondern als der, der schon hier war.
- **Wer er war:** du, beim letzten Mal. Der Kern baut ihn aus deinem letzten verlorenen Run (Figur und Items, `Meta.vorgaenger`); ohne gespeicherten Run eine andere Figur per Seed. Er kämpft mit deinen besten Karten von damals, verstärkt (`atk_faktor` 1,8), seine Beute ist sicher eines seiner Items.
- **Was falsch ist:** Er steht mit dem Rücken zu dir am Wasser und dreht nur den Kopf halb über die Schulter, so dass ein Auge zu sehen ist. Er ist nass bis auf die Haut, die Hosenbeine bis über die Knie voller Sand, die Füße stecken im Sand. **Das Wasser tropft von ihm nach oben**, von Saum, Fingern und Haar. In der rechten Faust glimmt etwas, das er mitgenommen hat.
- **Silhouette:** ein aufrechter Mann im langen Mantel, von hinten, Arme hängend, leicht abgesetzt vom Leib; einzige Figur im Spiel, die einem den Rücken zukehrt. Keine Mütze, kein Werkzeug, kein Kragen einer Uniform: nichts, woran man eine Figur erkennt, damit er zu jedem Run passt. Verworfene Skizze (in `vorgaenger.js` unter `skizzen`): frontal mit gesenktem Kopf; las sich als Ertrunkener.
- **Kniff:** `voraus`: „Er war vor dir hier. Er weiß, welche Karte du als Nächstes ziehst, und spielt sie zuerst.“ Er spielt die oberste Karte deines Stapels gegen dich, bevor du sie ziehst, und wird schwach gegen den Stoff, den du am wenigsten spielst. Fordert: Mischung, Block vor dem eigenen Schlag.
- **Werte:** Rang `elite` (skaliert im Kern nicht mit der Tiefe, nur mit `waechter_faktor` 1,35), 80 Leben (im Spiel 108), Rückfall-Muster Schlag 10, 3 × 4, Block 10 (greift, wenn sein Run kaum Angriffskarten hatte), Schwachstelle Licht als Rückfall (der Kern setzt einen Stoff, den keines seiner Items hat).
- **Stimme:** `schatten`. **Beute:** eines seiner Items, sonst *Der nasse Mantel*. **Beute-Satz:** „Er fällt nicht. Er setzt sich in den Sand, mit dem Rücken zu dir, und schaut weiter aufs Wasser.“
- **Sprite:** 128 × 160, idle 4 (der Kopf nickt, Tropfen steigen, die Faust glimmt), angriff 4 (dreht sich halb um, der linke Arm holt nach hinten aus und schlägt quer, jetzt sieht man beide Augen), treffer 2, tod 6 (er sinkt in den Sand und zerfällt). Licht: Randlicht oben rechts, dazu ein kühles zweites Randlicht links (vom nassen Sand), Oberlicht auf Schultern und Kragen gedithert, Wasserglanz auf den Falten, wo der nasse Stoff an den Beinen klebt, Rückennaht, Gurt mit zwei Hornknöpfen, Strähnen im nassen Haar, Seetang über der Schulter.

## Ereignisse (für später; Akt V hat heute keine Ereignisknoten)

| ID | Szene | Bezug |
|---|---|---|
| `ufer_spuren` | Die Spuren: deine Füße passen in jeden Abdruck | |
| `ufer_strandkorb` | Der Strandkorb mit der Nummer deiner Kabine, die Zeitung vom Tag des Aufbruchs (Stummfilm) | `if event_gesehen ufer_spuren` |
| `ufer_flaschenpost` | Eine Flasche fällt von der Decke, der Zettel in deiner Schrift: »Nicht umdrehen.« | |

## Items

| Item | Bereich | Stoff | Seltenheit | Eigenschaft | Stammkarte |
|---|---|---|---|---|---|
| Sand vom Anfang | Talisman | Salz | gewöhnlich, 1 Kerbe, 22 | – | Rieseln: 1 Energie, Block 5, Geschwächt |
| Der nasse Mantel | Kleidung | Wasser | selten, 2 Kerben, 55 | `block_haelt_halb` | Kragen hoch: 1 Energie, Block 8 |
| Gipsabdruck | Talisman | Glaube | selten, 2 Kerben, 48 | `erste_karte_billiger` | Nachtreten: 1 Energie, 6 Schaden, ziehe 1 |

Der nasse Mantel ist die Rückfall-Beute des Vorgängers (wenn sein Run keine Items hinterlassen hat).

## Musik

`ufer`: gis-Moll (Grundton 44, keiner der anderen Orte), dauerhaft halb gekippt (`phryg`) wie die Pforte, Ortsklang `meer` 0,08, `sand` 0,03, `schimmer` 0,02, Rhythmus `atem`, Einzelklänge vom Hafen (`detail: hafen`): Der Strand vom Anfang klingt mit.

## Umsetzung und Prüfung

- **Weg A (Skript)**, `quelle: skript`. Sprite `tools/sprites/gegner/vorgaenger.js`, Palette `tools/sprites/zonen/ufer.json` (Extras `sand`, `see`).
- `node tools/sprites/pruefen.js vorgaenger`: **0 Verstöße** (Rand oben rechts 89 %, Umriss schwarz 4 %, Idle-Wechsel 6 %). Das Sheet trägt `rang: waechter`, weil `pruefen.js` die Größe „elite“ nicht kennt (siehe Vorschläge).
- Hintergrund `prototype/js/scenes/world/ufer.js`: 3 Varianten, Finale-Szene, rast, weg, uebergang, ankunft, dazu die allgemeinen Arten. Aufbau 250–500 ms je Szene in headless Chromium (die Decke ist teuer; im Spiel einmal je Szene).
- Im Spiel (`newRun('fischer',3,{dev:true,route:['hafen','kapelle','salz','eis','ufer']})`, Akt V über `enterAct`, `leaveUebergang`, `chooseWeg(0)`): Ankunft, Weg, Vorraum-Elite, Rast, Finale, Finale Phase 2. **Keine Konsolenfehler.**
- `node tools/biom-test.js ufer 20` (neue Fassung, Akte davor gespielt): siehe Bericht unten. `node tools/test-run.js`: „Alles gut.“
- Bilder: [bilder/M7/ufer/](../bilder/M7/ufer/): `kontakt.png` (neben Chorknabe, Hirte, Netzflickerin), `silhouetten.png` (neben den anderen menschenähnlichen Gegnern), `animation.png`, `varianten.png`, `arten.png`, `fremdheit.png`, `im-spiel-*.png`.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

NOTEN_PLATZHALTER

## Vorschläge an den Kern

VORSCHLAEGE_PLATZHALTER
