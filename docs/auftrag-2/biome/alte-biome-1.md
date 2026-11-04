# Ergänzung der alten Biome, Teil 1: Hafen, Moor, Kapelle

Stand 2026-11-04 (Auftrag 2, M6). Ergänzungspakete nach [paket-format.md](../paket-format.md), letzter Abschnitt: `prototype/data/biome/hafen_plus.json`, `moor_plus.json`, `kapelle_plus.json`, eingetragen in `prototype/data/biome/index.json`. `data/foes.json` und `data/biomes.json` sind unverändert. Danach hat jedes der drei Biome **4 normale Gegner**.

| Biom | vorher | neu |
|---|---|---|
| Hafenviertel (Akt I, 1925) | Netzflickerin, Tiefling, Schmuggler | **Der Helmtaucher** (`taucher`) |
| Moorwald (Akt I) | Hirte, Torfstecherin, Nest | **Der Gepfählte** (`gepfaehlter`) |
| Überflutete Kapelle (Akt II, 17. Jh.) | Chorknabe, Ertrunkener | **Die Geprüfte** (`gepruefte`), **Der Kirchenvogt** (`kirchenvogt`) |

Alle Sprites per Skript (Weg A, `"quelle": "skript"`): `tools/sprites/gegner/<id>.js`, gebaut mit `node tools/sprites/bauen.js <id>`, Zonenpalette des alten Bioms. Neu ist das kleine Hilfsmodul `tools/sprites/gegner/hilfe/kanten.js` (liegt im Unterordner, damit `bauen.js` es nicht als Gegner lädt): Es malt nach dem Rendern Randlicht und Fase an **innere** Kanten einzelner Teile (Helm, Schulterstück, Flechtwerk, Kragen, Knie) und Kontaktschatten an die abgewandte Seite. Das ist die Antwort auf die Rückmeldung „zu oft große dunkle Flächen mit wenig Binnenform“: Der Renderer der Bibliothek setzt Randlicht nur an die Außenkante der ganzen Figur.

Arbeitsweise je Gegner: zwei Silhouetten als schwarze Fläche (Skizze im Skript unter `skizzen`, nicht gebaut), die bessere genommen, dann Licht, dann Pixel. Was dabei verworfen wurde, steht je Gegner unter „Silhouette“.

## Gegner

### Der Helmtaucher (`taucher`, Hafen)

- **Motiv:** Hafentaucher im Kupferhelm, 1925 ein gewöhnlicher Beruf am Kai (Bergung, Kaimauern, Schmuggelgut unter Wasser).
- **Wer er war:** Der Taucher, der 1919 die abgesackte Kaimauer prüfte. Er ruckte zweimal an der Signalleine, oben hat man den Luftschlauch gekappt. Sechs Jahre später steigt er die Leiter herauf.
- **Was falsch ist:** Der Schlauch hängt abgeschnitten hinter ihm, und trotzdem steigen aus dem Ventil Blasen. Im Sichtglas steht Wasser bis auf eine Handbreit Luft, und darin ist ein Gesicht zu nah am Glas, die Augen ungleich hoch.
- **Silhouette:** großer runder Helm mit vorstehendem Sichtglas-Stutzen auf einem sackigen Anzug, Bleischuhe als Klötze, der Schlauch als Bogen hinter ihm bis zum Boden. Verworfen: aufrechte Variante mit Helm mittig auf den Schultern (las sich als Roboter); genommen ist die leicht vorgebeugte mit tiefer sitzendem Helm.
- **Kniff:** `brecher`: „Bleischuhe und zwanzig Pfund auf der Brust: Wo er hinschlägt, gibt jeder Schutz nach.“ Fordert Bollwerk-Spieler im ersten Akt.
- **Muster:** Block 5 → Angriff 6 → Angriff 2×2 (hp 22).
- **Schwachstelle:** Eisen. Ein Schlag aufs Sichtglas, und das Wasser läuft heraus.
- **Stimme:** `ertrunkener`.
- **Varianten:** a mit Bergungshaken an der Stange, b mit Senkblei an der Leine, größerem Helm und Gitter vor dem Sichtglas.
- **Animation:** Leerlauf Atem, Schlauch schwingt, Blasen steigen; Angriff holt Haken/Blei über den Helm (2 Bilder), Schlag weit nach vorn unten, Nachschwung; Tod: sackt in die Bleischuhe, das Sichtglas wird dunkel.
- **Beute:** Sichtglas des Helmtauchers. `beute_satz`: „Der Helm rollt bis an die Kaikante und bleibt liegen. Innen steht das Wasser still, und es ist warm.“

### Der Gepfählte (`gepfaehlter`, Moor)

- **Motiv:** Moorleiche (Torf und die Leichen, die beim Stechen gefunden werden), mit Weidenschlinge, Flechtwerk und Pfählen, wie man sie in Mooren fand.
- **Wer er war:** Vor siebzehnhundert Jahren ins Moor gelegt, unter ein Flechtwerk gedrückt und festgepfählt, damit er nicht wiederkommt. 1925 haben die Torfstecher die Pfähle mit ausgestochen.
- **Was falsch ist:** Er kniet unter dem Flechtwerk wie unter einem Dach, die Pfähle stecken noch, und über der Spitze des einen schwebt ein Irrlicht. Die Augen sind geschlossen, aber das Licht kommt durch die Lider.
- **Silhouette:** kniende, vorgebeugte Gestalt mit langen Armen bis zum Boden, darüber schräg das Flechtwerk wie ein Dach, durchstoßen von drei bis vier Pfählen. Verworfen: gebeugt stehende Variante (zu nah am Hirten und an der Torfstecherin, das Flechtwerk wurde zum Schild).
- **Kniff:** `dornen` 2: „Die Pfähle stecken noch in ihm. Wer zuschlägt, greift hinein.“ Fordert Hagel-Spieler.
- **Muster:** Block 6 → Angriff 5 → Angriff 3×2 (hp 22).
- **Schwachstelle:** Salz. Salz zieht ihm das Moorwasser aus dem Leder, ohne das Wasser ist er nur Haut.
- **Stimme:** `mumie`.
- **Varianten:** a violett (Waldpalette `moor`), Fellkappe, drei Pfähle; b grün (`moor_gruen`, wie Torfstecherin b), vier Pfähle, Flechtwerk ausgerissen, ohne Kappe.
- **Animation:** Leerlauf Atem unter dem Flechtwerk, Irrlicht wippt; Angriff: Arm an die Hüfte zurück, aufbäumen mit erhobener Hand vor dem Gesicht, Schlag weit nach vorn unten; Tod: sinkt in den Torf, die Pfähle kippen.
- **Beute:** Weidenschlinge. `beute_satz`: „Er legt sich zurück in den Torf, ordentlich, wie man ihn hingelegt hat. Die Pfähle stehen wieder senkrecht.“

### Die Geprüfte (`gepruefte`, Kapelle)

- **Motiv:** Wasserprobe des 17. Jahrhunderts: gefesselt, Daumen an die großen Zehen, ein Seil um den Leib, ins Wasser vor der Kirche geworfen. Wer schwimmt, ist schuldig.
- **Wer sie war:** Eine Frau aus dem Kirchspiel, 1651 geprüft.
- **Was falsch ist:** Sie schwimmt bis heute, auch in der Luft. Das Seil hängt schlaff bis auf den Boden und liegt dort in einer Schlinge; niemand hält es. Aus Haar und Hemd tropft es, obwohl sie nie nass werden dürfte.
- **Silhouette:** zusammengekrümmter Mensch, Knie vor der Brust, Schienbeine und gebundene Füße vorn, schwebt hoch über dem Boden; darunter einzelne Strähnen und Tropfen, das schlaffe Seil bis zur Schlinge am Boden. Verworfen: Haar nach vorn über die Knie (Klumpen ohne Körper) und Haar als Fläche über den Rücken (las sich als Vogel mit angelegtem Flügel).
- **Kniff:** `wechsel` (Glaube ↔ Wasser): „Mal schwimmt sie, mal sinkt sie. Das Urteil fällt jeden Zug neu.“ Fordert Stoff-Vielfalt.
- **Muster:** Angriff 3×2 → Block 6 → Angriff 7 (hp 22).
- **Schwachstelle:** startet bei Wasser (das Wasser hat sie nicht genommen), wechselt dann mit Glaube.
- **Stimme:** `ertrunkener`.
- **Varianten:** a mit sechs Strähnen, b mit Haube, mehr und längerem Haar, schwebt höher.
- **Animation:** Leerlauf: schwebt auf und ab, Tropfen fallen; Angriff: kippt nach hinten und steigt (Ausholen), stürzt dann gedreht nach vorn unten wie ein geworfener Stein; Tod: fällt endlich zu Boden und zerfällt.
- **Beute:** Weihwasser (`holywater`, vorhanden). `beute_satz`: „Sie sinkt, endlich. Das Seil zieht sich von selbst nach unten, Hand über Hand.“

### Der Kirchenvogt (`kirchenvogt`, Kapelle)

- **Motiv:** Kirchenvogt mit dem Klingelbeutel an der langen Stange, schwarzer Talar und Mühlsteinkragen (17. Jh.), die Gemeinde der Kapelle in der Flut von 1634.
- **Wer er war:** Er ging mit dem Beutel durch die Bänke, als die Flut kam, und sammelt seitdem weiter.
- **Was falsch ist:** Der Mühlsteinkragen ist ein Teller, und auf dessen Rand liegt sein Kopf, auf der Seite, das Haar hängt über die Kante, die Augen stehen übereinander. Die Kragenöffnung in der Mitte ist leer. In Variante b steht der Hut noch auf dem Kragen, wo der Kopf war. Im Beutel glimmt etwas, das kein Geld ist.
- **Silhouette:** schmaler, vorgebeugter Talar, oben die breite flache Scheibe des Kragens mit dem Kopf am linken Rand, die lange Stange waagerecht nach vorn, am Ende der hängende Beutel. Verworfen: Kopf mittig auf dem Kragen (las sich als Hexe mit Krempenhut) und Kopf aufrecht (richtig lesbar, aber nichts Falsches).
- **Kniff:** `nachlass` (item): „Was im Beutel war, gehört der Gemeinde. Die Gemeinde braucht es nicht mehr.“ Wer ihn besiegt, bekommt sicher den Klingelbeutel. Fordert die Reihenfolge der Ziele.
- **Muster:** Angriff 5 → Block 6 → Angriff 2×3 (hp 24).
- **Schwachstelle:** Feuer. Sein Talar ist gegen das Wasser geteert, und Teer brennt.
- **Stimme:** `kultist`.
- **Varianten:** a ohne, b mit Hut auf dem Kragen, größerer Kragen, kürzere Stange.
- **Animation:** Leerlauf: Beutel pendelt, Glöckchen glänzt, Tropfen fallen aus dem Beutel; Angriff: Stange zurück und hoch, der Beutel über dem Kragen, dann schwingt er weit nach vorn unten (Glöckchen läutet); Tod: Stange sinkt, er zerfällt von oben.
- **Beute:** Klingelbeutel. `beute_satz`: „Der Beutel reißt. Heraus fallen Knöpfe, Zähne, ein Ehering, und ganz zuletzt eine Münze mit deinem Gesicht.“

## Items (über `fundpool_dazu`)

| Item | Biom | Art | Rar / Kerben / Preis | Eigenschaft | Karte |
|---|---|---|---|---|---|
| Sichtglas des Helmtauchers (`sichtglas`) | Hafen | Talisman, Wasser | selten / 2 / 42 | `block_haelt_halb` | Durchs Glas: 1, 6 Block, 1 ziehen |
| Weidenschlinge (`weidenschlinge`) | Moor | Talisman, Fäulnis | gewöhnlich / 1 / 22 | `verwundbar_start` 1 | Zuziehen: 1, 4 Schaden, Verwundbar 1 |
| Klingelbeutel (`klingelbeutel`) | Kapelle | Talisman, Glaube | selten / 2 / 45 | `gold_bonus` 6 | Glöckchen: 0, 1 ziehen, Schwäche 1 |

Die Icons sind Platzhalter aus `js/sprites/items.js` (`divinghelm`, `collar`, `rosary`); eigene 48 × 48-Icons stehen noch aus.

## Ereignisse (je 2, aus genau diesem Ort)

| id | Ort | Wahlen | Bezug auf Früheres |
|---|---|---|---|
| `hafen_leiter` Die Kaileiter | Signalleine an der Kaileiter ruckt zweimal | Zurückrucken (+1 Kerbe, −5 Leben) / Leine kappen (Sichtglas, Kampf Helmtaucher) / Hinunterrufen (+14 Gold) | – |
| `hafen_logbuch` Das Logbuch am Nagel | Logbuch im Bootshaus, eine Zeile frei | Satz zu Ende schreiben (Handgriff) / Zeile ausreißen (Schleifen, −6 max. Leben) / ins Wasser (+6 Leben) | `event_gesehen: hafen_kutter` (der Kutter, dessen Logbuch mitten im Satz endet) |
| `moor_pfaehle` Drei Pfähle | Flechtwerk und Pfähle im frischen Torf | Pfahl ziehen (Weidenschlinge, Kampf Gepfählter) / tiefer schlagen (+6 max., −9 Leben) / Gold darunter legen (−12 Gold, +1 Kerbe) | – |
| `moor_sode` Die Sode mit der Hand | Torfstapel am Bohlenweg, eine Hand hält etwas | Finger aufbiegen (Item, −5 Leben) / der Torfstecherin zurückbringen (Handgriff) / in die Esse (Karte streichen) | `event_gesehen: moor_torf` (Begegnung mit der Torfstecherin) |
| `kapelle_probe` Die Probe | Leinenbündel treibt trocken auf dem Wasser, Seil am Ufer | Seil anziehen (Kampf Geprüfte) / selbst ins Wasser (Handgriff, −10 Leben) / Seil hineinwerfen (+8 Leben) | – |
| `kapelle_kollekte` Die Kollekte | Klingelbeutel kommt durch die Bänke | Geben (−15 Gold, +1 Kerbe) / „schon am Opferstock gegeben“ (Schleifen) / nicht geben (Kampf Kirchenvogt) | `event_gesehen: kapelle_kerze` (Opferstock unter der Kerze) |

## Hintergrund: Moor-Torfstich heller

Mo fand den Torfstich zu dunkel. Geändert ist nur die Funktion `torfstich` in `prototype/js/scenes/world/moor.js` (Variante 1); `torfstapel` hat dafür ein optionales Material-Argument bekommen, das die anderen Varianten nicht nutzen.

- eigene, hellere Torframpe `TORF_STICH` für Stichwand, Torfringel und Grabenboden (die Rampe `TORF` der anderen Varianten bleibt);
- Stichwand: breitere Fase (3), Spatenspuren als hellere Bänder mit dunkler Fuge, Stichkanten alle paar Spatenbreiten, Kontaktschatten, Randlicht schon bei flacherem Lichteinfall; an der Oberkante jeder Stufe eine durchgehende Randlichtlinie, vorn heller;
- nasse Glanzpunkte auf der vorderen Stichfläche;
- Grabenboden heller, mit einer nassen Mittelbahn zum Fluchtpunkt; Pfützen heller;
- Nebelband hinter den Figuren etwas dichter und tiefer, schwaches Glühen am Ende des Grabens, damit die Figuren der hinteren Reihe vor Licht stehen.

Prüfung: Variante 0 und 2 unterscheiden sich vorher/nachher nur um die zufälligen Animationspixel (109 bzw. 51 Pixel; zwei Läufe nachher untereinander: 109 bzw. 52). Variante 1: 64 646 Pixel geändert.

## Prüfung

- `node tools/sprites/pruefen.js taucher_a taucher_b gepfaehlter_a gepfaehlter_b gepruefte_a gepruefte_b kirchenvogt_a kirchenvogt_b`: **8 Sprites, 0 Verstöße** (Randlicht oben rechts 92–99 %, Umriss schwarz 10–21 %, Idle-Wechsel 13–18 %).
- Biom-Tests (`node tools/biom-test.js <biom> 10`, 0 Fehler in allen Läufen):

| Biom | vorher (Seeds 1–10) | erster Entwurf | nachher (Seeds 1–10) | nachher (Seeds 11–30) |
|---|---|---|---|---|
| Hafen | 10/10 | 6/10 | **8/10** | 15/20 |
| Moor | 9/10 | 8/10 | **9/10** | 20/20 |
| Kapelle | 8/10 | 6/10 | **7/10** | 18/20 |

Der erste Entwurf war zu hart (Helmtaucher mit 27 Leben und Angriff 7 gegen Block-Spieler, Kirchenvogt mit Stärke plus Dreifachschlag). Gesenkt auf die Werte oben. Im Mittel über 30 Seeds: Hafen 23/30, Moor 29/30, Kapelle 25/30. Der Hafen ist damit etwas schwerer als vorher (vorher 10/10, also leichter als das Ziel 6–9), Moor und Kapelle liegen auf dem alten Stand.

## Bilder (`docs/auftrag-2/bilder/M6/alte-biome/`)

- `kontakt-hafen.png`, `kontakt-moor.png`, `kontakt-kapelle.png`: alle vier Gegner des Bioms (neue in a und b) neben Chorknabe, Hirte, Netzflickerin
- `silhouetten-neu.png`, `silhouetten-biome.png`: schwarze Flächen, die neuen neben den alten Gegnern ihres Bioms
- `anim-taucher_a.png`, `anim-gepfaehlter_a.png`, `anim-gepruefte_a.png`, `anim-kirchenvogt_a.png`: ganze Sheets auf Nebel, ×3
- `kampf-hafen-taucher.png`, `kampf-hafen-gruppe.png`, `kampf-moor-gepfaehlter.png`, `kampf-moor-gruppe.png` (im Torfstich), `kampf-kapelle-gepruefte.png`, `kampf-kapelle-kirchenvogt.png`, `kampf-kapelle-gruppe.png`: im Spiel
- `torfstich-vorher-nachher.png` (oben vorher, unten nachher, mit Torfstecherin, Hirte und Gepfähltem in den drei Reihen), `moor-varianten-nachher.png` (alle drei Varianten)

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / im Spiel. Gesamt = schwächster Punkt.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Helmtaucher | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Helm mit Sichtglas-Stutzen und gekapptem Schlauch ist im Spiel einzigartig und sofort lesbar; Glanzbogen auf dem Kupfer, Bördelring, Schulterstück, Brustblei und Ärmelfalten geben dem Leib Binnenform, das Sichtglas ist das innere Licht. Der Anzug ist noch etwas kastig, und das Gesicht im Wasser sieht man erst bei Vergrößerung. Etwas größer als die anderen Hafen-Gegner. |
| Der Gepfählte | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Flechtwerk-Dach mit Pfählen ist die stärkste neue Silhouette; Randlicht an Flechtwerk, Pfählen, Armen, Knien und Kopf, Licht durch die Lider und das Irrlicht als Akzente. Das Geflecht wirkt aus der Nähe eher gemauert als geflochten. Variante b (grün) hebt sich im violetten Torfstich stark ab, wie Torfstecherin b. |
| Die Geprüfte | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Zusammengekrümmte, schwebende Gestalt mit Tropfen und schlaffem Seil am Boden liest sich; Knie und Schienbeine haben Lichtkanten, das Hemd Falten und Wirbel. Dass sie gefesselt ist (Daumen an Zehen), sieht man nur am Strick an Hand und Knöchel; im Spiel vor dem grünen Fenster bleibt der untere Teil (Haar, Seil) zart. |
| Der Kirchenvogt | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Talar, heller Teller-Kragen mit Lichtrand und Klingelbeutel an der Stange sind klar 17. Jh.; nach der Überarbeitung liegt der Kopf sichtbar am Tellerrand, das Haar hängt über, die Augen stehen übereinander. Der Talar bleibt die größte dunkle Fläche der vier, trotz Falten mit Lichtkante, Gürtel und Schlüsselbund. |
| Hintergrund Moor V1 Torfstich (neu) | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Grabenboden und Stichwand jetzt in mittleren Tönen, Figuren aller drei Reihen stehen frei; Stufenkanten mit Randlicht, Spatenspuren als Bänder. Die Stichwand ist noch recht gleichförmig (die drei Stufen trennen sich vor allem über die Kantenlinien). |

Überarbeitet, bevor die Noten standen: Kirchenvogt (Kopf mittig → Hexenhut-Silhouette, dann Kopf am Rand, dann heller Kragen mit Lichtrand, Kontaktschatten unter dem Kopf und überhängendes Haar, weil der Kopf im Kragen unterging: Konzept vorher 3), Geprüfte (zwei Silhouetten verworfen, s. o.), Helmtaucher (Roboter-Kasten → sackiger Anzug mit freien Armen), Gepfählter (Angriff verschwand im Flechtwerk → Ausholen vor dem Gesicht). Nichts liegt unter 4.

Offene Schwächen für eine spätere Runde: Geflecht des Gepfählten wie Weide statt Ziegel; Anzug des Helmtauchers weniger kastig und eine Spur kleiner; Fesseln der Geprüften deutlicher; Talar des Kirchenvogts mit mehr Faltenwurf; Item-Icons für die drei neuen Items.
