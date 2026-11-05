# Ergänzung der alten Biome, Teil 2: Salzstollen, Namenlose Stadt, Schwarzes Eis

Stand 2026-11-04 (Auftrag 2, M7). Ergänzungspakete nach [paket-format.md](../paket-format.md), letzter Abschnitt: `prototype/data/biome/salz_plus.json`, `stadt_plus.json`, `eis_plus.json`, eingetragen in `prototype/data/biome/index.json`. `data/foes.json`, `data/biomes.json`, `tools/sprites/lib.js` und der Kern sind unverändert. Danach hat jedes der drei Biome **4 normale Gegner**.

| Biom | vorher | neu |
|---|---|---|
| Salzstollen (Akt III, Rom und älter) | Schlundträger, Salzläufer, Grabwächter | **Der Mann im Salz** (`salzmann`) |
| Namenlose Stadt (Akt III, vor dem Menschen) | Bote, Erbauer-Mumie | **Der Vermesser** (`vermesser`), **Der aus dem Relief** (`relief`) |
| Schwarzes Eis (Akt IV, vor dem Leben an Land) | Rufer, Nachgeher | **Der Fahnenträger** (`fahnentraeger`), **Die Seelilie** (`seelilie`) |

Alle Sprites per Skript (Weg A, `"quelle": "skript"`): `tools/sprites/gegner/<id>.js`, gebaut mit `node tools/sprites/bauen.js <id>`, Zonenpalette des alten Bioms (`salz`, `stadt`, `eis`), 96 × 120, Varianten `_a`/`_b`, idle 4 · angriff 4 · treffer 2 · tod 6. Jede Datei hat unter `skizzen` die beiden Silhouetten, die gegeneinander standen (nicht gebaut). Auf die Rückmeldung „große dunkle Flächen mit wenig Binnenform“ antworten die Skripte mit eigenen kleinen Helfern (je Datei, damit nichts Gemeinsames geändert wird): `kante()` und `kapselLicht()` malen Randlicht an **innere** Kanten (Schulterfell vor dem Sack, Arme und Stangen vor dem Rumpf), Würfel- und Plattenflächen bekommen eigene, gedithertee Verläufe, dazu Nähte, Falten mit Lichtkante, Teilungen, Scheibenfugen. Jede Figur hat mindestens ein inneres Licht (Kienspan, Fernrohrlinse und Lot, glühende Risse, Augen im Tuch, Gesicht im Kelch).

## Gegner

### Der Mann im Salz (`salzmann`, Salzstollen)

- **Motiv:** Die bronzezeitlichen Salzbergleute (Hallstatt, Dürrnberg), lange vor den Römern. Sie trugen Fellumhang, Lederwickel, Tragsack und hielten brennende Kienspäne. Salz bewahrt: Man hat solche Männer im Berg gefunden, mit Haut und Kleidern.
- **Wer er war:** Ein Hauer, den der Berg vor dreitausend Jahren verschüttet hat. Er trägt noch, was er an dem Tag trug.
- **Was falsch ist:** Der Kopf. Das Salz hat ihn zu einem einzigen, glatten, rechtwinkligen Würfel auskristallisiert, und drinnen liegt sein Gesicht, bewahrt und mit offenen Augen. Am Tragsack wächst ein zweiter Würfel nach. Der Kienspan in seiner Hand brennt noch.
- **Silhouette:** ein kleiner, leicht gebeugter Mann mit einem großen, schräg gekippten Würfel statt Kopf und einem hohen Tragsack, aus dem oben ein Kristall ragt. Verworfen: erste Fassung „Turm aus vielen Würfeln über einem tief gebeugten Mann“ (las sich als Esel mit Last, die Würfel schwebten als Blasen), zweite Fassung „Kristallbuckel“ (zu nah am Schlundträger). Genommen: der Würfelkopf, gegen die Variante mit längerem Hals.
- **Kniff:** `rein`: „Was dreitausend Jahre im Salz lag, verdirbt nicht mehr. Gift findet an ihm nichts, das faulen kann.“ Fordert Brackwasser-Builds.
- **Muster:** Angriff 7 → Block 7 → Angriff 3×3 (hp 26).
- **Schwachstelle:** Wasser. Wasser löst, was das Salz zusammenhält.
- **Stimme:** `grabwaechter` (Horn aus Knochen, passt zum Alten im Berg).
- **Varianten:** a Würfel nach vorn gekippt, Hals kurz; b Würfel nach hinten gekippt, Hals länger, ein Würfelchen auf der Schulter.
- **Animation:** Leerlauf Atem, Span flackert, Salzkorn glitzert auf dem Würfel, die Augen schließen sich im vierten Bild; Angriff hebt den Bronzepickel hoch über den Würfel (2 Bilder), Schlag weit nach vorn unten, Nachschwung; Tod: sackt zusammen, der Würfel kippt, die Kristalle am Sack fallen ab.
- **Beute:** Der Würfel aus dem Berg (neues Item). `beute_satz`: „Unter dem Salz liegt ein Lederschuh, genäht, nicht genagelt. Er ist warm.“

### Der Vermesser (`vermesser`, Namenlose Stadt)

- **Motiv:** Die Expedition von 1903, zu der auch die Krämerin (die Vermesserin) und der Schlittenführer im Eis gehören. Landvermessung mit Theodolit, Messlatte und Lot. Die Geometrie der Stadt stimmt nicht.
- **Wer er war:** Der Vermesser der Expedition. Er hat zwanzig Jahre lang Türen gemessen, die zu breit sind, und Treppen, die zu niedrig sind.
- **Was falsch ist:** Er hat zu lange gemessen. Von der Hüfte abwärts ist er das Stativ seines Theodoliten, drei Holzbeine mit Messingschuhen, und im rechten Auge sitzt das Fernrohr. Um ihn herum stimmt die Geometrie nicht: Die Messlatte knickt in der Mitte, obwohl sie gerade ist, und das Lot hängt schräg zu dir hin.
- **Silhouette:** Tropenhelm, das Fernrohr waagerecht nach vorn wie ein Schnabel, schmaler Mantel, drei gespreizte Stativbeine, rechts die hohe, geteilte Messlatte mit Versatz, links die schräge Lotschnur. Verworfen: Latte in der vorderen Hand (Latte und Fernrohr bildeten ein Kreuz vor dem Gesicht) und die Variante ohne Latte (zu wenig Erkennungszeichen).
- **Kniff:** `wechsel` (Licht → Eisen → Feuer): „Er misst dich jeden Zug neu, und jedes Mal kommt etwas anderes heraus. Hier unten stimmt keine Zahl zweimal.“ Fordert Stoff-Vielfalt.
- **Muster:** Angriff 7 → Block 6 → Angriff 3×3 (hp 22).
- **Schwachstelle:** Licht zuerst: ein Lichtblitz ins Fernrohr blendet ihn. Danach wechselt sie mit dem Kniff.
- **Stimme:** `bote` (der andere Mensch aus der Oberwelt, dem man hier unten geantwortet hat).
- **Varianten:** a Helm mit Band, Latte knickt nach rechts; b höheres, engeres Stativ, Helm mit Nackenschutz, Latte knickt nach links, Lot noch schräger.
- **Animation:** Leerlauf Atem, das Lot pendelt, die Linse blinkt; Angriff kippt die Latte weit nach hinten (2 Bilder), schlägt sie in einem Bogen nach vorn, Nachschwung; Tod: die Stativbeine spreizen sich, er sinkt ein.
- **Beute:** Das schräge Lot (neues Item). `beute_satz`: „Im Sand liegt ein Feldbuch voller Maße. Alle Türen sind darin breiter als die Stadt.“

### Der aus dem Relief (`relief`, Namenlose Stadt)

- **Motiv:** Das Reliefband, das durch die ganze Stadt läuft (Hintergrund und Weg-Hinweis „Das Reliefband läuft hier weiter“), und die Erbauer, die nicht aufrecht gingen.
- **Wer er war:** Eine Szene im Band, gemeißelt, bevor es Menschen gab: einer der Erbauer, kriechend, mit langem Schädel und Kamm.
- **Was falsch ist:** Er lehnt sich aus dem Stein. Unten ist er noch flach und Teil des Bildes (Rillen in der Platte), oben hat er schon Tiefe, Schatten und Randlicht und greift mit drei Fingern nach dir. Die Rahmenlinie der Platte schließt nicht, die Ecke oben links springt.
- **Silhouette:** eine hohe, oben abgebrochene Steinplatte auf einem Sockel, aus deren linker Kante ein langer Schädel mit Kamm und zwei dürre Arme ragen. Kein anderer Gegner ist zur Hälfte ein Rechteck. Verworfen: die Platte mit rundem Bogen oben (las sich als Grabstein, steht auf der Klischee-Liste); die Variante b ist jetzt schräg abgebrochen.
- **Kniff:** `dornen 2`: „Wer nach ihm schlägt, schlägt in behauenen Stein, und die Kanten sind so scharf wie am ersten Tag.“ Fordert Hagel-Builds.
- **Muster:** Block 8 → Angriff 8 → Angriff 4×2 (hp 26).
- **Schwachstelle:** Eisen. Der Meißel hat ihn gemacht, der Meißel nimmt ihn zurück.
- **Stimme:** `mumie` (dieselben Erbauer).
- **Varianten:** a breite, oben gezackte Platte, Kamm als Fächer; b schmalere, höhere, schräg abgebrochene Platte, Kamm als zwei Hörner, er kommt tiefer heraus.
- **Animation:** Leerlauf: er lehnt sich einen Pixel weiter heraus und zurück, die Risse glimmen; Angriff zieht ihn in den Stein zurück (2 Bilder), dann schnellt er weit heraus, Maul offen, Arm vorgestreckt; Treffer: Brocken platzen von der Kante; Tod: er sinkt zurück, die Platte zerfällt.
- **Beute:** keine. `beute_satz`: „Auf der Platte ist jetzt eine Stelle leer, genau so groß wie er.“

### Der Fahnenträger (`fahnentraeger`, Schwarzes Eis)

- **Motiv:** Polarexpedition, Parka mit Pelzrand, die Fahne, die man dort einschlägt, wo es nicht mehr weitergeht. Gesichter im Eis, Kälte, die ruft.
- **Wer er war:** Der Mann der Expedition von 1903, der die Fahne tragen durfte. Er sollte sie dort einschlagen, wo es nicht mehr weiter nach unten geht.
- **Was falsch ist:** Die Kapuze ist leer, nur Reif am Pelzrand. Sein Gesicht ist in der Fahne, durch den steif gefrorenen Stoff gedrückt wie von hinten, mit offenem Mund und roten Augen.
- **Silhouette:** runde Kapuze mit dickem Pelzrand, glockenförmiger Parka mit Pelzsaum, Mukluks, die Stange schräg vor dem Körper und oben die Fahne quer abstehend. Verworfen: die steile Variante (Fahne direkt über der Kapuze, Kopf und Tuch verschmolzen).
- **Kniff:** `schuetzer 4`: „Wo eine Fahne steht, ist Lager. Das Gesicht im Tuch ruft die anderen Erfrorenen darunter, und das steife Tuch deckt sie.“ Zuerst war es `ruf` (holt alle 3 Züge einen Rufer). Im Autospieler senkte das die Siegquote im Eis von 9/30 auf 4–5/30, darum der Wechsel; der Ruf bleibt im Bild und im Grund.
- **Muster:** Block 7 → Angriff 5 → Angriff 7 (hp 20).
- **Schwachstelle:** Blut. Warmes Blut ist das Einzige hier, das den Stoff noch weich macht.
- **Stimme:** `rufer`.
- **Varianten:** a breite Fahne, flache Stange, tief vorgebeugt; b Stange steiler, Fahne schmaler und länger, höherer Pelzrand.
- **Animation:** Leerlauf: Kapuze hebt und senkt sich, der Saum schwingt, die Augen im Tuch glimmen; Angriff zieht die Stange zurück (2 Bilder), dann schlägt er die Fahne über sich hinweg nach vorn, das Gesicht im Tuch kommt dir entgegen; Tod: er sackt nach hinten, die Fahne kippt.
- **Beute:** Gefrorenes Fahnentuch (neues Item). `beute_satz`: „Die Fahne ist umgefallen. Auf dem Tuch ist kein Gesicht mehr, nur eine Delle, wo eins war.“

### Die Seelilie (`seelilie`, Schwarzes Eis)

- **Motiv:** Die Zeitschicht „vor dem Leben an Land“: Seelilien (Crinoiden), Tiere, die wie Pflanzen aussehen, auf einem Stiel aus gestapelten Kalkscheiben, mit gefiederten Armen. Gesichter im Eis.
- **Wer sie war:** Ein Tier aus dem Meer unter dem Eis, älter als jedes Auge. Das Eis hat sie aufbewahrt, und jetzt hat sie sich losgerissen und geht auf ihren Wurzelkrallen.
- **Was falsch ist:** Ihr Kelch. Darin sitzt ein Menschengesicht, ein Matrose von 1903, blass, mit offenem Mund und roten Augen. Sie hat es sich genommen, weil sie selbst nie eins hatte.
- **Silhouette:** ein S-förmiger, gegliederter Stiel auf gespreizten Krallen, oben ein Kelch und eine Krone aus gefiederten, nach außen gebogenen Armen. Echtes Monster, keine Menschengestalt. Verworfen: die halb geschlossene Krone als Faust (las sich als Palme mit Knoten); sie ist jetzt die Variante b mit sechs Armen und geraderem Stiel.
- **Kniff:** `kleinvieh`: „Jeder Arm hat hundert Fiedern, und jede Fieder greift für sich allein.“ Fordert Aderlass und Block gegen viele kleine Treffer.
- **Muster:** Angriff 1×3 → Block 6 → Angriff 2×2 (hp 18). Bewusst kleine Grundwerte: In Akt IV kommt durch die Tiefe auf **jeden** Treffer etwa +7 dazu (8×3 im Spiel). Mit 2×4 und 3×3 lag die Siegquote im Eis deutlich tiefer.
- **Schwachstelle:** Licht. Sie ist älter als das erste Auge und hat Licht nie gekannt.
- **Stimme:** `eisgesicht` (menschliche Formanten unter Eis, passt zum Gesicht im Kelch).
- **Varianten:** a acht Arme, Krone weit offen, S-Stiel; b sechs Arme, Krone halb geschlossen, Stiel gerader und höher.
- **Animation:** Leerlauf: die Spitzen jedes zweiten Arms rollen sich langsam ein und aus, der Mund öffnet sich, die Augen schließen sich kurz (die Krone bleibt sonst ruhig, damit nichts flackert); Angriff spreizt die Krone weit (2 Bilder), dann peitschen die vorderen Arme nach vorn unten, der Stiel biegt sich; Tod: der Stiel sackt ein, die Krone schließt sich.
- **Beute:** keine. `beute_satz`: „Im Eis liegen Steinscheiben wie Münzen. Eine hat ein Muttermal.“

## Items (über `fundpool_dazu`)

| Item | Art | Rar | Kerben | Preis | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|---|---|
| Der Würfel aus dem Berg (`salzwuerfel`, Salz) | Talisman, Salz | selten | 2 | 46 | `block_haelt_halb` (Salz bewahrt) | Einsalzen: 1, 7 Block | „Ein Salzkristall, so rechtwinklig, als hätte ihn jemand gezogen. Wer lange hineinsieht, sieht ein Lid, das sich schließt.“ |
| Das schräge Lot (`schraeges_lot`, Stadt) | Talisman, Eisen | selten | 2 | 48 | `verwundbar_start 1` | Lot fällen: 1, 5 Schaden, Verwundbar 1 | „Ein Messinglot an gewachster Schnur. Es hängt nie senkrecht, immer schräg zu dem hin, der am nächsten steht.“ |
| Gefrorenes Fahnentuch (`fahnentuch`, Eis) | Kleidung, Wasser, +3 Leben | gewöhnlich | 1 | 26 | – | Unter die Fahne: 1, 6 Block, Eröffnung +2 Block | „Steif wie ein Brett und doch warm, wenn man es umlegt. Manchmal bewegt sich der Stoff an deinem Rücken, wo du still stehst.“ |

Icons: vorläufig die alten 12×12-Sprites (`salt`, `compass`, `sealskin`), die neuen 48er-Icons kommen mit der Icon-Runde.

## Ereignisse (je 2, aus genau diesem Ort)

| Biom | Ereignis | Bezug auf Früheres | Wahlen |
|---|---|---|---|
| Salz | **Der Schuh im Salz** (`salz_schuh`): ein genähter Lederschuh und ein warmer Span in der Wand, dahinter knistert ein Würfel. | – | Würfel herausbrechen (Item + Kampf Mann im Salz) · Span anzünden und folgen (Handgriff, −5 Leben) · Salz streuen und gehen (+8 Leben) |
| Salz | **Das ältere Schichtbuch** (`salz_zweites_buch`): Kerbtafeln mit Strichreihen und kleinen Würfeln, die letzte Reihe ist nicht fertig. | `event_gesehen: salz_schichtbuch` (Der letzte Eintrag von 1911) | Mit 1911 vergleichen (Schleifen, −4 max. Leben; nur wer das alte Buch gesehen hat) · Einen Strich dazukerben (+1 Kerbe, −6 Leben) · Würfel einstecken (+25 Gold, Kampf) |
| Stadt | **Die Messlatte** (`stadt_messlatte`): Nach der Teilung ist die Tür vier Meter breit, nach dem Auge so breit wie du. | – | Nachmessen (Schleifen + Kampf Vermesser) · Zahl korrigieren (Handgriff, −4 max. Leben) · Seitlich hindurch (+6 Leben) |
| Stadt | **Die leere Stelle im Relief** (`stadt_leere_stelle`): In einer Szene des Bandes fehlt einer, der Stein ist dort warm, darunter frische Splitter. | `event_gesehen: stadt_grabkammer` (die Notizen der Expedition) | Notizen danebenhalten (Reaktion + Kerbe) · Dich hineinlegen (+8 max. Leben, Karte streichen, −10 Leben) · Den Splittern folgen (Item + Kampf aus dem Relief) |
| Eis | **Die Fahne** (`eis_fahne`): eine Fahne ohne Wind, deren Falten zu einem Gesicht werden. | – | Herausziehen (Fahnentuch + Kampf Fahnenträger) · Namen in die Stange ritzen (+1 Kerbe, −5 Leben) · In den Windschatten ohne Wind setzen (+10 Leben) |
| Eis | **Der Garten unter dem Eis** (`eis_garten`): Steinlilien unter dem Eis, eine fehlt, Krallenspuren führen dorthin, woher du kamst. | `event_gesehen: eis_zelt` (die Zeichnung im Tagebuch) | Zeichnung danebenhalten (seltenes Item, −6 Leben) · Den Spuren folgen (Kampf Seelilie) · Das Eis polieren (Handgriff, −4 max. Leben) |

## Prüfung

- **Regelprüfung:** `node tools/sprites/pruefen.js salzmann_a salzmann_b vermesser_a vermesser_b relief_a relief_b fahnentraeger_a fahnentraeger_b seelilie_a seelilie_b` → 10 Sprites, **0 Verstöße**.
- **Bilder** in [`bilder/M7/alte-biome/`](../bilder/M7/alte-biome/): Kontaktbögen mit allen Gegnern des Bioms (je Variante Idle 0 und Angriff 2) neben Chorknabe, Hirte, Netzflickerin und darunter die Silhouetten (`salz-bogen.png`, `stadt-bogen.png`, `eis-bogen.png`, gebaut mit `tools/biom-bogen.js`), die Silhouetten-Entwürfe (`silhouetten-entwurf.png`: oben die genommene, unten die verworfene Silhouette je Gegner), alle Animationen je Gegner (`animation-<id>_a.png`) und je Biom ein Kampf-Bildschirmfoto (`im-spiel-salz.png`, `im-spiel-stadt.png`, `im-spiel-eis.png`; `newRun('fischer',3,{dev:true,route:[…]})`, `Dev.springe('kampf',2|3)`, Gegner gesetzt).
- **Autospieler** (`node tools/biom-test.js <biom> 10`, 0 Fehler in allen Läufen). Weil 10 Seeds stark streuen, zusätzlich derselbe Test mit 30 Seeds, einmal ohne und einmal mit den drei Paketen, im selben Stand des Kerns (gleiche Seeds):

| Biom | 10 Seeds vorher | 10 Seeds nachher | 30 Seeds ohne Paket | 30 Seeds mit Paket |
|---|---|---|---|---|
| Salzstollen | 2/10 | 6/10 | 5/30 | 9/30 |
| Namenlose Stadt | 3/10 | 2/10 | 8/30 | 8/30 |
| Schwarzes Eis | 4/10 | 2/10 | 9/30 | 9/30 |

Die neuen Gegner machen keinen Akt schwerer, den Salzstollen etwas leichter. Das Ziel 6–8 von 10 erreichen Akt III und IV **schon ohne die Pakete nicht**: Die Spieler sterben meist im ersten oder zweiten Kampf des Akts. Das liegt an der Grundabstimmung (Tiefenskalierung: auf Tiefe 21 kommen +7 auf **jeden** Treffer, Leben ×2,6), nicht an einzelnen Gegnern, und gehört in den Kern.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / im Spiel. Gesamt = schwächster Punkt.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Der Mann im Salz | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Der gekippte Salzwürfel als Kopf ist im ganzen Spiel einzigartig und schwarz gefüllt sofort lesbar; die Würfelflächen mit Verlauf und Grat lesen sich als Salz, das Gesicht darin zeigt Augenhöhlen, Mund und rote Augen. Fellstruktur, Beinwickel, Riemen und Naht geben dem Rumpf Binnenform, der Kienspan ist das warme innere Licht. Schwächer: Rumpf und Sack bleiben die dunkelste Masse, das Gesicht im Würfel ist erst ab ×2 deutlich. |
| Der Vermesser | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Stativbeine, Fernrohr-Schnabel und die rot geteilte Latte sind drei eigene Erkennungszeichen; Randlicht an Beinen, Latte, Schößen, Revers und Riemen. Die Knick-Latte und das schräge Lot sind das falsche Detail, im Spiel aber klein. Die Varianten a und b liegen nah beieinander. |
| Der aus dem Relief | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Halb Rechteck, halb Kreatur: das stärkste neue Bild. Seitenfläche im Gegenlicht, Rahmenrille, die nicht schließt, der flache Rest des Erbauers als Rillen, glimmende Risse. Verbindet sich mit dem Reliefband im Hintergrund der Stadt. Schwächer: die Vorderfläche der Platte ist groß und dunkel, nur durch Rillen gegliedert. |
| Der Fahnenträger | 4 | 4 | 4 | 5 | 4 | 4 | **4** | Leere Kapuze und das Gesicht im gefrorenen Tuch erzählen die Figur ohne Worte; die Stange mit Lichtkante gliedert den Parka, Pelzrand und Saum mit Reif. Schwächer: der Parka ist eine große, ruhige Fläche, die Arme lesen sich erst auf den zweiten Blick. |
| Die Seelilie | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Echtes Monster mit eigener Silhouette (Stiel, Kelch, Fiederkrone, Krallen); die Scheibenfugen geben dem Stiel durchgehend Gliederung, das blasse Gesicht im Kelch ist das innere Licht. Passt genau in die Zeitschicht „vor dem Leben“. Schwächer: der Angriff wirkt mehr als Neigen der ganzen Krone als ein Peitschen einzelner Arme. |

Nichts liegt unter 4. Offene Schwächen für eine spätere Runde: Rumpf des Mannes im Salz und Parka des Fahnenträgers heller gliedern (Fellbahnen, Steppnähte), Varianten des Vermessers stärker trennen, beim Angriff der Seelilie einzelne Arme gegeneinander versetzen, eigene 48er-Icons für die drei Items.
