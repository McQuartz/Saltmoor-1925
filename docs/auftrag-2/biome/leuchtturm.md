# Der Leuchtturmhof (`leuchtturm`) · Akt I · Zugabe

Biom-Paket nach [paket-format.md](../paket-format.md), Zugabe nach Auftrag 2 ([03-meilensteine.md](../03-meilensteine.md), „Zugabe“). Bilder: [bilder/Zugabe/leuchtturm/](../bilder/Zugabe/leuchtturm/).

| Teil | Datei |
|---|---|
| Daten | `prototype/data/biome/leuchtturm.json` |
| Hintergrund | `prototype/js/scenes/world/leuchtturm.js` |
| Zonenpalette | `tools/sprites/zonen/leuchtturm.json` |
| Gegner | `tools/sprites/gegner/lampenputzer.js`, `rueckmoewen.js`, `strahlgaenger.js`, `fensterzaehlerin.js`, `linse.js` |
| Item-Icons | `tools/icons/items/putztuch.js`, `korkring.js`, `fensterschluessel.js`, `ochsenauge.js` |

## Der Ort

Auf der Klippe über Saltmoor steht der Leuchtturm, rot und weiß, mit zwei gekalkten Wärterhäusern, einem Öl- und Werkzeugschuppen, dem Nebelhornhaus, einem Signalmast und einer Hofmauer, hinter der es tief zum Meer geht. Im Winter 1917, als die Küstenfeuer abgedunkelt werden sollten, ist der Oberwärter in die Linse gestiegen, um sie zu drehen. Seitdem fällt der Strahl nicht aufs Meer, sondern schräg herab in den eigenen Hof. Wer dort steht, steht im Hellen. Alles daneben ist Nacht. Die „Gesine“ ist in jenem Winter an der Klippe gesunken.

- **Wahrzeichen:** die Gürtellinse erster Ordnung, groß wie ein Zimmer, auf ihrem Quecksilberbad. In den Hofszenen ist sie das helle Rautenglas oben im Turm, aus dem der Strahl kommt; in der Wächter-Szene steht sie selbst im Raum.
- **Falsches Detail:** Draußen auf dem Meer zeigt jedes Schiff sein rotes und sein grünes Seitenlicht zugleich. Das heißt für jeden Seemann: Es hält genau auf dich zu. Es sind elf (bei hoher Fremdheit mehr), in einer Linie auf den Turm, und keins kommt näher. Nie erklärt; der Fischer erkennt es in einem Ereignis.
- **Palette:** Graphit-Nacht mit einem Stich Violett (Körper `#050507 … #2d2b38`), Randlicht aus dem Strahl warm-weiß (`#857a60`/`#ece2c8`), Augen Lampengelb (`#ffe07a`, Kern `#fffff0`). Dazu drei Akzentfarben, sparsam: Turmrot (`#b8392c`), Messing, Fresnel-Glasgrün. In den Hintergründen: Kalkweiß und Pflastergrau im Strahl, Schiffslichter rot/grün.
- **Abgrenzung im Akt:** Der Hafen ist blau und eng (Gassen, Masten), der Moorwald violett-grün und nebelig, die Fabrik kachelgrün mit Natriumgelb, das Kurhaus weiß-türkis bei Tageslicht, der Nachtzug Mahagoni mit blauen Fenstern. Der Leuchtturmhof ist der einzige Ort im Akt mit **einer großen Diagonale aus Licht**, mit Rot-Weiß als Wahrzeichen und mit offenem Himmel über einer Klippe; hell sind hier die Flächen (Kalk, Pflaster), nicht die Lampen.
- **Bezug zum Hafen:** Im Hafenviertel sucht der Lichtkegel des Leuchtturms schon „landeinwärts“ (Ereignis `hafen_lichtkegel`). Das hier ist derselbe Turm, von nah.

## Hintergrund: Kompositionen

Grundform: **der Strahl als Diagonale**. Er kommt oben aus der Laterne und fällt schräg in den Hof; was er trifft (Kalkwände, Pflaster, Pfützen), ist hell und flach, damit die dunklen Gegner davor stehen. Fluchtlinien: die Pflasterfugen zum Turm, die Linie der Schiffe auf ihn zu. Nebel nur als schmales Band über der Mauer (unter einem Drittel).

### Variante 0: Der Hof
- **Horizont** y 128, Fluchtpunkt am Turmfuß (330). Der Turm hinten rechts, 140 px hoch, drei rote Bänder, Galerie mit Geländer, die Laterne hell mit Rautensprossen. Aus ihr fällt der Strahl nach links unten (Kegel, darin Staub und Gischt, ruhiges Atmen).
- Links die zwei Wärterhäuser, im Strahl kalkweiß, zwölf Fenster zusammen, eins warm. Rechts die Hofmauer, dahinter das Meer mit der Linie der Schiffe auf den Turm zu, der Schuppen, der Signalmast.
- **Boden:** Pflaster mit Fugen in Fluchtlinie, ein heller Fleck, wo der Strahl auftrifft; Pfützen spiegeln den Strahl. **Maßstab:** Tür, Fenster, eine verlassene Trittleiter, ein Eimer. Vordergrund: Pfahl mit Tau, die Ecke des Ölschuppens.

### Variante 1: Die Klippe
- **Horizont** y 136. Links das Meer weit, die Linie der Schiffe von links vorn bis an den Turm. Rechts der Turm angeschnitten und nah. Der Strahl geht über uns hinweg ins Land.
- Nebelhornhaus mit Trichter, Signalmast, Geländer an der Kante, eine Bank (Maßstab). Unten links bricht die Klippe ab, tief unten Brandung. Die Wiese hat Büschel und Steine und den Rand des Lichtflecks; ein Kiesweg läuft zum Turm.

### Variante 2: Am Fuß des Turms
- **Horizont** y 148. Links der Turmfuß riesig, rot-weiß, die Tür mit Stufen und Messingklinke; die Laterne ist oben aus dem Bild, ihr Strahl fällt steil herab über den Hof auf das Wärterhaus gegenüber (vier Fenster, eins warm) und die Wäscheleine mit dem nassen Ölzeug, dessen Tropfen nach oben fallen. Hinten die Mauer, das Meer, einige Schiffe. Vordergrund: Regentonne, Kante.

### Wächter-Szene: Die Laterne
- Innen im Laternenhaus, frontal. Ringsum Rautenscheiben, durch die man Himmel, Meer und links und rechts die Schiffe sieht (alle auf dich zu). **Direkt hinter der Linse** fangen die Rückscheiben ihr Licht: eine große, ruhige, warme Ellipse, vor der die Linse dunkler steht (die kontrastierende Zone). Unten das Messinggeländer, der Gitterboden mit radialen Linien, rechts das Gewicht des Drehwerks an seiner Kette (Maßstab).
- Bei hoher Fremdheit mehr Schiffe.

### Übrige Arten
- **Weg, Wandbild:** Varianten 0–2 per Seed. **Rast:** Variante 2 mit Feuer (Nebelhornhaus-Kessel). **Werkstatt:** Variante 2 mit Werkbank (Ölschuppen). **Krämer:** Variante 1 mit dem Bootsschuppen des Strandvogts, Boot, Strandgut, Rettungsring, Laterne. **Ereignis, Fund:** Variante 0 mit einer angespülten Seekiste und einem Korkring. **Übergang:** die Wendeltreppe im Turm von oben, Ring um Ring hinab, unten Wasser, der Strahl fällt den Schacht hinunter.

## Krämer

**Der Strandvogt**, im Bootsschuppen unter der Klippe, zwischen Strandgut. `art: leihe`: Er verleiht, was das Meer bringt, für 30 % des Preises, bis zur nächsten Flut (Anfang des nächsten Akts). „Dann holt es sich alles wieder, auch das, was du dazugelegt hast.“

## Gegner

### Der Lampenputzer (`lampenputzer`)
- **Motiv:** Pflicht, die weiterläuft, wenn ihr Gegenstand fehlt.
- **Wer er war:** der Hilfswärter. Jeden Morgen die Linse putzen, mit Leinenschürze, Rehleder und Spiritus, wie es Vorschrift ist.
- **Was falsch ist:** Er steht mitten im Hof auf seiner Trittleiter und putzt in kleinen Kreisen die Luft. Sein Gesicht hat er mitgeputzt: eine blanke, gewölbte Scheibe wie der Reflektor, darin ein Punkt Licht.
- **Silhouette:** ein Mann mit Schirmmütze auf einer A-Leiter, ein Arm hoch erhoben mit einem Tuch.
- **Proben:** ohne Leiter auf dem Boden (las sich wie jeder Mann mit erhobenem Arm, zu nah am Kirchenvogt und am Echo). Genommen: auf der Leiter.
- **Varianten:** a zwei Stufen, Schirmmütze, lange Schürze; b höhere Leiter, gebeugt, Wollmütze, längeres Tuch.
- **Animation:** Leerlauf: Die Hand kreist. Angriff: Er holt mit dem Tuch hinter den Kopf aus und lässt es nach vorn schnappen. Tod: zerfällt von oben, die Leiter zuletzt.
- **Kniff:** `heiler 4`: Er putzt, was zerkratzt ist, auch was du gerade zerkratzt hast. Fordert Zielwahl.
- **Muster:** Schlag (6), Block 6, 2 × 3. **Schwachstelle Feuer:** Spiritus und Lampenöl in Schürze und Tuch.
- **Stimme:** `torfstecherin` (Summen mit geschlossenem Mund). **Beute:** Ledertuch des Lampenputzers.

### Die Rückwärtsmöwe (`rueckmoewen`)
- **Motiv:** Ein Tier, das die Richtung verloren hat.
- **Wer sie war:** eine Silbermöwe vom Turm. Jetzt so groß wie ein Mann.
- **Was falsch ist:** Sie fliegt rückwärts, Schwanz voran; Brust und Schnabel zeigen vom Meer weg. Die Augen sitzen nebeneinander auf der Seite, die dich ansieht, wie bei einem Gesicht.
- **Silhouette:** ein aufrechter großer Vogel mit langem Schnabel nach rechts, die Schwinge hängt wie ein Mantel.
- **Proben:** ein Schwarm kleiner Möwen um den Signalmast (zwei Fassungen; las sich als Stange mit Fähnchen, ohne Masse); der Schwarm ohne Mast (Rauch). Genommen: eine große Möwe.
- **Varianten:** a Flügel angelegt, Ring am Bein; b Flügel halb offen, längerer Hals, zerzaust.
- **Animation:** Leerlauf: Kopfnicken, Atem. Angriff: Die Schwinge hebt sich steil (Ausholen), dann stößt sie Schwanz und Krallen voran auf dich. Tod: zerfällt mit gespreizter Schwinge.
- **Kniff:** `kopie`: Was du eben getan hast, bringt sie dir zurück, Schwanz voran (deine zuletzt gespielte Karte gegen dich). Fordert Reihenfolge: zuletzt Block, nicht Schlag.
- **Muster:** 3 × 2, Block 5, Hieb (6). **Schwachstelle Eisen:** Schrot.
- **Stimme:** `schmuggler` (gepfiffen). **Beute:** keine eigene.

### Der aus dem Strahl (`strahlgaenger`)
- **Motiv:** Schuld, die nur sichtbar ist, wo Licht hinfällt.
- **Wer er war:** ein Matrose der „Gesine“, die 1917 auf die Klippe lief, weil das Feuer nach innen schien.
- **Was falsch ist:** Es gibt ihn nur, wo der Strahl ihn trifft. Eine gerade, schräge Kante schneidet ihn durch, an ihr ein Saum Licht; dahinter steht nur sein Umriss als Staub im Strahl. Das Wasser tropft an ihm nach oben.
- **Silhouette:** ein Seemann mit Südwester und Korkring, schräg abgeschnitten, daneben eine gepunktete Hälfte.
- **Proben:** ganz, ohne Schnitt (zu nah am Helmtaucher). Genommen: geschnitten, mit Staub-Umriss.
- **Varianten:** a Schnitt steiler, ein Riemen in der Hand; b Schnitt flacher (mehr fehlt), Tang über der Schulter.
- **Animation:** Leerlauf: Tropfen steigen. Angriff: Riemen hinter den Kopf, dann Schlag nach vorn unten. Tod: zerfällt, der Staub-Umriss erlischt zuerst.
- **Kniff:** `verstopfen 1` („Seewasser“): Er tropft; eine Karte auf deiner Hand ist nass und unspielbar. Fordert volle Hände.
- **Muster:** Schlag (8), 2 × 4, Block 6. **Schwachstelle Glaube:** Er wurde nie begraben; ein Gebet nimmt ihn mit.
- **Stimme:** `ertrunkener`. **Beute:** Korkring der Gesine.

### Die Fensterzählerin (`fensterzaehlerin`)
- **Motiv:** Ordnung als Zwang.
- **Wer sie war:** die Frau des Oberwärters.
- **Was falsch ist:** Sie zählt nachts die Fenster der Wärterhäuser, die der Strahl trifft; jede Nacht eins mehr. Eins hat sie ausgehängt und trägt es vor sich her. In den Scheiben ist Licht, als stünde ein Zimmer dahinter, und in der unteren Scheibe steht eine kleine Frau und zählt.
- **Silhouette:** eine Frau im langen Rock mit Haarknoten, die ein Sprossenfenster seitlich von sich hält (Rechteck neben dem Leib).
- **Proben:** ohne Fenster (zu nah an Badefrau und Tintenfrau); Fenster vor der Brust (verschwand in der Silhouette). Genommen: Fenster seitlich.
- **Varianten:** a sechs Scheiben, Haarknoten; b vier Scheiben, Gardine, Kopftuch.
- **Animation:** Leerlauf: Der Finger tippt Scheibe für Scheibe, die gezählte leuchtet. Angriff: Sie hebt das Fenster hoch über den Kopf und schlägt es schräg nach vorn. Tod: Das Fenster sinkt, die Scheiben erlöschen.
- **Kniff:** `teurer 1`: Sie zählt nach, und es ist eins zu viel (eine Handkarte kostet diesen Zug 1 mehr). Fordert eine flache Kostenkurve.
- **Muster:** 2 × 4, Block 5, Schlag (9). **Schwachstelle Wasser:** Regen an den Scheiben, und sie verzählt sich.
- **Stimme:** `schatten` (Flüstern). **Beute:** Schlüsselbund der Wärterfrau.

### Wächter: Die Linse (`linse`), 160 × 180
- **Motiv:** Ein Licht, das nach innen sieht.
- **Wer sie war:** die Gürtellinse erster Ordnung, Paris 1884. Und der Oberwärter, der 1917 hineinstieg.
- **Was falsch ist:** Durch das Glas sieht man ihn in Streifen: Jeder Prismenring zeigt ein anderes Stück von ihm (Kopf, Schulter, Knie), keins passt zum nächsten; zwei Hände sind von innen gegen das Glas gedrückt. Das Ochsenauge in der Mitte vergrößert sein Auge.
- **Silhouette:** ein großer Bienenkorb aus Glasringen auf einem Sockel.
- **Proben:** ohne Sockel, schwebend (Bienenkorb oder Laterne). Genommen: auf dem Sockel mit Quecksilberbad.
- **Besonderheit (gegen die Rückmeldung):** Das Glas ist von innen warm erleuchtet (Lampe), damit die Linse keine dunkle Fläche ist und der Mann darin als dunkle Streifen steht; Prismenringe mit Lichtkante, Messingstäbe, die sich drehen.
- **Animation:** Leerlauf: Die Stäbe wandern (Drehung), das Auge blinzelt. Angriff: Sie neigt sich zurück, das Auge schließt sich (Laden), dann der Blitz: das Ochsenauge flammt auf, Lichtspeichen. Tod: Risse, das Licht erlischt.
- **Kniff:** `takt 6`: die Kennung, Blitz und Dunkel. Im Blitz bekommen alle Gegner 6 Block, im Dunkel ist sie nur Glas (verwundbar).
- **Besonders:** `phasen` bei 50 %: das Glas springt, neues Muster (2 × 7, Block 10, 16, 3 × 5) und alle 3 Züge kommt einer aus dem Strahl.
- **Muster:** 11, Block 8, 3 × 5, Stärke +2, 14. **Schwachstelle Salz:** Salz macht das Glas blind; dagegen haben die Wärter jeden Morgen geputzt.
- **Stimme:** `windgestalt` (Röhren mit Echo, Oktave tiefer: das Nebelhorn). **Beute:** Reliquie *Das Ochsenauge*.

## Items

| ID | Name | Rar | Kerben | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|---|
| `putztuch` | Ledertuch des Lampenputzers (L) | gewöhnlich | 1 | `start_block 2` | Blank reiben (1: Block 5, ziehe 1) | Weiches Rehleder, wie es Vorschrift ist. Es putzt alles blank, auch was nicht schmutzig war. |
| `korkring` | Korkring der Gesine (W) | selten | 2 | `block_haelt_halb` | Obenbleiben (1: Block 7) | Auf dem Ring steht der Name eines Schiffs, das 1917 an der Klippe sank. Er ist nass. Er wird nicht trocken. |
| `fensterschluessel` | Schlüsselbund der Wärterfrau (E) | selten | 2 | `hand_plus 1` | Nachzählen (1: ziehe 2) | Elf Schlüssel für elf Fenster. Es sind zwölf Fenster. Einer der Schlüssel ist warm. |
| `ochsenauge` | Das Ochsenauge (L), Reliquie | reliquie | 2 | `verwundbar_start 2` | Der Strahl (2: 7 an allen, Verwundbar 1) | Das mittlere Feld der Linse, so groß wie ein Teller. Wer hindurchsieht, sieht alles größer und näher. Manchmal sieht etwas zurück, auch vergrößert. |

Fundpool: die drei eigenen (ohne Reliquie) plus Sturmlaterne, Kompass, Ölmantel, Bootshaken, Leuchtpistole, Rum, Robbenfell, Taschenuhr, Ankerkette. Icons selbst gezeichnet (`tools/icons/items/…`), `node tools/icons/pruefen.js`: 0 Verstöße.

## Ereignisse

| ID | Titel | Kern | Bezug auf Früheres |
|---|---|---|---|
| `leuchtturm_wachbuch` | Das Wachbuch | Seit 1917 jede Nacht: Feuer brennt. Sicht gut. Kein Schiff. Daneben Striche für die, die doch kamen. (Kerbe, Handgriff, Gold + Kampf) | – |
| `leuchtturm_galerie` | Die Galerie | Scheiben von innen beschlagen, ein Kreis auf Augenhöhe gewischt. (Ledertuch, Schleifen) | `item: lantern` |
| `leuchtturm_schiffe` | Die Schiffe | Elf Schiffe, alle Rot und Grün zugleich. (Seltenes, Talisman-Slot, Entdecken) | `item: flaregun`, `job: fischer` |
| `leuchtturm_waesche` | Die Wäscheleine | Nasse Wäsche im Strahl, Tang im Ölzeug, Tropfen nach oben. (Ölmantel + Kampf, Gold + Streichen, Heilen) | – |
| `leuchtturm_fenster` | Die Fenster | „Elf“, sagt sie. Du zählst zwölf. (Schlüsselbund + Kampf, Kerbe, Item tauschen) | `job: detektiv` |
| `leuchtturm_eintrag` | Ein neuer Eintrag | Im Wachbuch steht eine Zeile in deiner Schrift: Ein Schiff. | Ereignis-`if`: `event_gesehen: leuchtturm_wachbuch`; Wahl mit `item: korkring` |
| `leuchtturm_marke` | Die Briefmarke | Die Marke auf dem Brief zeigte diesen Turm. | Ereignis-`if`: `event_gesehen: alle_brief` (biomübergreifendes Ereignis) |

Kein `stummfilm`, damit der Akt seinen einen Stummfilm behält.

## Musik

gis-Moll, Grundton 44 (Nachbarn im Akt: Hafen d, Moor c, Kurhaus a, Nachtzug h, Fabrik cis). Ort: Meer und Wind an der Galerie, Rhythmus `atem` (die Kennung), Einzelklänge aus `hafen` (ferne Glocke, Ketten).

## Prüfung

- `node tools/sprites/pruefen.js lampenputzer_a lampenputzer_b rueckmoewen_a rueckmoewen_b strahlgaenger_a strahlgaenger_b fensterzaehlerin_a fensterzaehlerin_b linse`: 9 Sprites, **0 Verstöße**.
- Kontakt- und Silhouettenbogen neben den Favoriten: [leuchtturm-bogen.png](../bilder/Zugabe/leuchtturm/leuchtturm-bogen.png); gegen alle 161 vorhandenen Sprites (eigene schwarz, oben links): [silhouetten-gegen-alle.png](../bilder/Zugabe/leuchtturm/silhouetten-gegen-alle.png); alle Animationen: [animationen.png](../bilder/Zugabe/leuchtturm/animationen.png).
- Hintergrund: [hintergrund-varianten.png](../bilder/Zugabe/leuchtturm/hintergrund-varianten.png) (V0, V1, V2, Wächter mit den echten Sprites), [hintergrund-leer.png](../bilder/Zugabe/leuchtturm/hintergrund-leer.png), [hintergrund-arten.png](../bilder/Zugabe/leuchtturm/hintergrund-arten.png), [hintergrund-fremdheit.png](../bilder/Zugabe/leuchtturm/hintergrund-fremdheit.png).
- Im Spiel (`newRun('fischer',3,{dev:true,route:['leuchtturm','kapelle','salz','eis','pforte']})`, `Dev.springe(…, 0)`): [im-spiel-kampf.png](../bilder/Zugabe/leuchtturm/im-spiel-kampf.png), [im-spiel-kampf-2.png](../bilder/Zugabe/leuchtturm/im-spiel-kampf-2.png), [im-spiel-kampf-3.png](../bilder/Zugabe/leuchtturm/im-spiel-kampf-3.png), [im-spiel-waechter.png](../bilder/Zugabe/leuchtturm/im-spiel-waechter.png). Keine Konsolenfehler.
- `node tools/biom-test.js leuchtturm 20` mit Startseeds 1, 21, 41: **17/20, 14/20, 16/20** (78 %), 0 Fehler. Erste Werte waren 17/20 und 17/20 (zu leicht); erhöht wurden Leben von Linse (70 → 82), Strahlgänger, Möwe, Fensterzählerin, Lampenputzer und einzelne Schläge. Zum Vergleich im selben Test: Fabrik 14/20, Nachtzug 14/20, Kurhaus 17/20, Hafen 19/20.
- `node tools/test-ereignisse.js` und `node tools/test-run.js`: „Alles gut.“

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Lampenputzer | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Der Mann auf der Trittleiter gibt es sonst nirgends und liest sich schwarz sofort. Die Schürze ist eine helle Binnenform mit Falten, die Jacke hat Revers, Knöpfe, Naht und Rockschlitz, Randlicht läuft an Rücken, Mütze, Leiter. Schwächen: Das blanke Gesicht liest sich eher als helle Maske mit einem Licht denn als „blank geputzt“; das Tuch ist klein. |
| Rückwärtsmöwe | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Ein mannshoher Vogel ist im Spiel neu und sofort lesbar; die Augen nebeneinander auf der falschen Seite sind das falsche Detail. Nach der Nacharbeit hat die Schwinge Federreihen und einen hellen Saum an der Hinterkante, die Brust ist hell. Schwächen: „rückwärts“ liest man erst im Angriff (Schwanz und Krallen voran); der Rumpf bleibt die größte dunkle Fläche des Bioms. |
| Der aus dem Strahl | 5 | 4 | 4 | 5 | 4 | 4 | **4** | Der gerade Schnitt mit Lichtsaum und der gepunktete Staub-Umriss der fehlenden Hälfte sind die stärkste Idee des Bioms und schwarz sofort zu sehen. Korkring mit roten Bändern und Pullover-Rippen gliedern den Rumpf. Schwächen: Der Riemen ist dünn und verschwindet fast; der Kopf ist klein. |
| Fensterzählerin | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Frau plus Sprossenfenster ist eine eigene Silhouette; die Scheiben sind ihr inneres Licht, die gezählte leuchtet. Schwächen: Der Rock ist eine große dunkle Fläche, gegliedert nur durch Falten mit Grat; die kleine Frau in der Scheibe sieht man erst beim zweiten Blick. |
| Linse (Wächter) | 5 | 4 | 4 | 5 | 5 | 5 | **4** | Bienenkorb aus Prismenringen auf Sockel, von innen warm erleuchtet, darin der Mann in versetzten Streifen und das vergrößerte Auge: Was sie war und was falsch ist, liest man sofort. Im Spiel steht sie groß und klar vor der hellen Ellipse auf den Rückscheiben. Schwächen: Die Pixel der Prismenringe sind gleichförmig (Linien in festem Abstand), die Hände sind klein. |
| Hintergrund V0 Der Hof | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Turm, Strahl, Kalkhäuser und die Linie der Schiffe erzählen Ort, Wahrzeichen und falsches Detail ohne Text; hinter den Gegnern helle Wände und der Lichtfleck. Schwäche: Das Pflaster vorne ist eine ruhige Fläche (dort liegt die UI), die Schiffe sind klein. |
| Hintergrund V1 Die Klippe | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Eigener Aufbau mit Meer links, Turm rechts nah, Abbruch unten links; die Schiffe sind hier am größten. Schwächen: Die Wiese in der Mitte ist eine große dunkle Fläche (Büschel und Steine helfen wenig); der Strahl geht in den Himmel und trifft wenig. Schwächste Variante. |
| Hintergrund V2 Am Fuß des Turms | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Der riesige Turmfuß links gibt Maßstab, das helle Haus gegenüber steht hinter den Gegnern, die Wäsche tropft nach oben. Schwäche: Die Schiffe sind hier nur Punkte. |
| Hintergrund Wächter Die Laterne | 4 | 5 | 4 | 4 | 5 | 5 | **4** | Ruhige warme Zone direkt hinter der Linse, Rautensprossen, Schiffe in beiden Fenstern, Geländer und Gewicht als Maßstab; im Spiel die beste Lesbarkeit des Bioms. Schwäche: Der Gitterboden ist etwas grob und kühl. |
| **Hintergrund gesamt** | | | | | | | **4** | |

Nichts unter 4. Überarbeitet wurden unterwegs: die Palette (rotes inneres Randlicht machte alles rostig und las sich wie ein Muster → warm-weißes Randlicht aus dem Strahl), Lampenputzer (Schürze erst gedithert wie ein Netz → helle Fläche mit Falten; Rückennaht, Revers), Möwen (Schwarm um den Mast zweimal versucht, ohne Masse → eine große Möwe; Flügel erst als seitlicher Klumpen, dann als Mantel; Federreihen), Strahlgänger (Korkring erst ein dünner Gürtel → heller Ring mit Bändern; Augen lagen hinter dem Schnitt; der Staub-Umriss der fehlenden Hälfte kam dazu), Fensterzählerin (Fenster vor der Brust verschwand in der Silhouette → seitlich gehalten; Zählhand), Linse (Glas zu dunkel, der Mann darin unsichtbar → von innen erleuchtet), Hintergrund (Lücken zwischen Himmel und Boden, Strahl zu schwach, Schiffe zu klein, Pfützen, Klippenabbruch).

## Vorschläge an den Kern

- `verstopfen` nimmt den Namen der Störkarte über `stoerKarte(en)` aus `en.kniff.karte`. Steht `verstopfen` (oder `abschrift`) in `kniffe` statt in `kniff`, heißt die Karte immer „Abschrift“. Vorschlag: den Namen aus dem auslösenden Kniff-Objekt nehmen.
- Für einen Strahl, der sich wirklich dreht und dabei Häuser und Gegner kurz anleuchtet, fehlt in `basis.js` ein Baustein „rotierender Kegel mit Lichtfleck auf dem Boden“ (heute: `lichtkegelAnim` ohne Bodenfleck). Das Paket zeigt deshalb einen festen Strahl mit leichtem Atmen.

## Offene Schwächen

- Der Strahl ist statisch mit leichtem Atmen; er dreht sich nicht sichtbar.
- Variante 1 hat die meiste ruhige Fläche (Wiese).
- Im Ereignisbild gibt es keine eigenen 160 × 90-Bilder (wie bei den anderen Paketen nur `bild` als Text).
