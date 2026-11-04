# Neubauten: Windgestalt (M0) und schwache Gegner (M5)

Stand 2026-11-04. Weg A: selbst per Skript gepixelt (`tools/sprites/gegner/<id>.js`), mit der Licht-, Randlicht- und Dither-Kette aus `tools/sprites/lib.js`. In der Sitzung gab es keinen Bild-Generator und keinen API-Schlüssel, darum war Weg B (Generator) nicht möglich und Weg A der einzige und damit der beste verfügbare Weg (`"quelle": "skript"`). IDs und Sheet-Namen sind gleich geblieben, das Spiel nimmt die neuen Sheets direkt.

**Bilder**

- M0: [Kontaktbogen Windgestalt neben den Favoriten, Silhouetten mit verworfenen Varianten, alle Animationen](bilder/M0/windgestalt-kontakt.png) · [im Spiel, Wächter-Szene der Stadt](bilder/M0/im-spiel-stadt-waechter.png)
- M5: [vorher / nachher neben den Favoriten](bilder/M5/vorher-nachher.png) · [Silhouetten](bilder/M5/silhouetten.png) · [alle Animationen](bilder/M5/animationen.png)
- M5 im Spiel: [Stadt (Mumie a/b, Bote)](bilder/M5/im-spiel-stadt-mumie.png) · [Eis (Nachgeher a/b, Rufer)](bilder/M5/im-spiel-eis-nachgeher.png) · [Kapelle (Ertrunkener a/b, Chorknabe)](bilder/M5/im-spiel-kapelle-ertrunkener.png) · [Hafen (Tiefling a/b, Netzflickerin)](bilder/M5/im-spiel-hafen-tiefling-netzflickerin.png) · [Moor (Nest a/b, Hirte)](bilder/M5/im-spiel-moor-nest.png)

**Prüfung:** `node tools/sprites/pruefen.js` meldet für alle Sheets 0 Verstöße. Jede neue Figur hat die vollen Sheets (Idle 4, Angriff 4, Treffer 2, Tod 6), beide Varianten sind eigene Posen bzw. Formen und keine Umfärbung.

## Übersicht der Noten

Bewertungsbogen aus [06-ki-bilder.md](06-ki-bilder.md) Abschnitt 5, Gesamtnote = schwächster Punkt.

| Gegner | Silhouette | Licht | Pixel | Konzept | Biom | im Spiel | **Gesamt** |
|---|---|---|---|---|---|---|---|
| Windgestalt (Wächter Stadt) | 4 | 4 | 4 | 4 | 4 | 4 | **4** |
| Erbauer-Mumie | 4 | 4 | 4 | 4 | 4 | 4 | **4** |
| Nachgeher | 5 | 4 | 4 | 4 | 4 | 4 | **4** |
| Ertrunkener | 4 | 4 | 4 | 4 | 4 | 4 | **4** |
| Netzflickerin (Rückseite) | 5 | 5 | 4 | 5 | 5 | 4 | **4** |
| Tiefling | 4 | 4 | 4 | 4 | 4 | 4 | **4** |
| Das Nest | 4 | 4 | 4 | 4 | 4 | 4 | **4** |

Keine Fünf als Gesamtnote: Neben den Favoriten haben alle Neubauten mindestens eine Stelle, die gröber ist (siehe „Schwach“ je Gegner). Alles, was im Verlauf unter 4 lag, wurde neu gemacht (Verlauf je Gegner unten).

---

## Der Wind, der Gestalt hat (`windgestalt`, Wächter Namenlose Stadt, 128 × 160)

- **Motiv:** das Meer als etwas Älteres, hier als Atem aus dem Abgrund. Der Wind weht nach oben.
- **Was er ist:** Der Atem aus der Tiefe unter der Stadt hat sich aus den Binden der toten Erbauer einen Leib gewickelt und trägt die Totenmaske ihres Baumeisters, damit er ein Gesicht hat.
- **Was falsch ist:** Der Leib ist hohl, man sieht durch die Rippen aus Binden hindurch. Unten gibt es keine Beine, nur einen gedrehten Stiel, der aus einem Spalt im Boden kommt. Lose Binden und der Haarbusch wehen nach oben, Sand fällt nach oben.
- **Silhouette in einem Satz:** Eine hohe Gestalt mit langer Maske und einem nach oben wehenden Bindenbusch, ein hohler Brustkorb aus Rippen, zwei lange Klauenarme, unten ein gedrehter Stiel statt Beinen.
- **Kampf, den man versteht:** Er atmet ein (der Brustkorb wird sichtbar weit, Angriff 0), dann atmet er aus (die Maske reißt den Mund auf, Arm und Binden schlagen nach vorn, Angriff 2). Vorschlag: statt der wechselnden Schwachstelle ein `ansage`-Kniff (zwei Züge einatmen, dann der große Atemstoß) und feste Schwachstelle **Wasser** (nasse Binden kann der Wind nicht mehr tragen; in der Stadt hat sonst niemand Wasser).
- **Pipeline:** Konzept in Worten, dann drei Silhouetten als schwarze Fläche verglichen: die alte Säule (Kegel mit Flossen, keine Gestalt), Variante „Qualle“ (große Maske über einem Bänderfächer, liest sich als Krake mit Maske, also Klischee, verworfen), Variante „Gestalt“ (hohler Leib aus Binden mit Maske auf einem Stiel, gewählt). Der erste Wurf der Gestalt war zu dürr und hatte Fühler statt Bändern, der Kopf stieß oben an und der Leerlauf flackerte mit 21 %. Darum größere Maske, ein breiter Haarbusch statt Fühlern, ein zerfetzter Schulterumhang, dickere Arme, ein Sandhaufen am Spalt und ruhigeres Wehen (14 %).
- **Noten:**
  - Silhouette 4: Schwarz gefüllt sofort eine Figur mit Maske, Rippen und Klauen, unverwechselbar zu allen anderen Wächtern. Der Schulterumhang ist noch etwas kastig.
  - Licht 4: Gegenlicht von rechts oben, Randlicht an Rippen, Armen und Busch, keine Vorderbeleuchtung.
  - Pixel 4: harte Pixel, Dither, kein Umriss. Die Schulterlappen haben Treppenkanten, und die Maske ist kleinflächig gezeichnet.
  - Konzept 4: Binden, Maske und hohler Leib sind klar. Dass es „Wind“ ist, liest man nur über den aufwehenden Busch, den Stiel und den steigenden Sand.
  - Biom 4: Rost-Palette, Binden und Maske gehören zu den Erbauern (Mumie, Relief-Motiv der Stadt).
  - im Spiel 4: Er steht groß und dunkel vor dem hellen Relief der Wächter-Szene und ist gut lesbar. Das Relief mit dem Sonnenrad konkurriert etwas.
- **Hinweis zur Größe:** 06-ki-bilder.md erlaubt Wächter bis 160 × 180, `tools/sprites/pruefen.js` prüft Wächter aber noch auf höchstens 128 × 160. Darum bleibt die Windgestalt bei 128 × 160. Für größere Wächter müsste `GROESSE.waechter` in pruefen.js angehoben werden (nicht meine Datei).

## Erbauer-Mumie (`mumie_a`, `mumie_b`, Stadt)

- **Motiv:** falsche Geometrie. Die Erbauer gingen nicht aufrecht.
- **Wer sie war:** einer der Erbauer der Stadt, ein Echsenleib, in Binden gelegt zu einer Zeit, als es noch keine Menschen gab.
- **Was falsch ist:** Sie hockt wie ein Wasserspeier, der Hals ist zu lang, die Vorderarme haben ein Gelenk zu viel (b: zwei zu viel). Vor der Schnauze sitzt eine flache, helle Maske mit einem Menschengesicht, dem Relief, das dich zeigt.
- **Vorher:** ein langer Leib auf vielen gleichen Beinchen, las sich als Raupe.
- **Silhouette in einem Satz:** Ein hockender Echsen-Wasserspeier mit gestrecktem Hals, einer Maske vor der Schnauze, einem eingerollten Schwanz und hängenden Bindenenden.
- **Varianten:** a mit kurzem Hals und zweimal geknickten Armen, b mit langem Hals, dreimal geknickten Armen und mehr losen Binden.
- **Verlauf:** Der erste Wurf von b hatte einen Kamm, der wie Hundeohren aussah, und die Maske lief im Angriff über den Bildrand. Der Kamm flog raus, der Körper rückte nach rechts, und die Binden wurden kräftiger (Fuge dunkel, Kante hell, im Gegenlicht Randlicht). Das Flackern kam vom gedehnten Rumpf, jetzt nickt nur der Kopf.
- **Noten:**
  - Silhouette 4: Hockendes Wesen mit Maske und Schwanz, keine Raupe mehr und unverwechselbar. Von weitem auch ein wenig wie ein sitzender Hund.
  - Licht 4: Randlicht an Rücken, Hals und Schwanz, die Bindenkanten fangen das Gegenlicht.
  - Pixel 4: diagonale Wicklung, harte Pixel. Das Streifenmuster ist etwas gleichmäßig.
  - Konzept 4: Mumie (Binden, lose Enden), Erbauer (Echse) und Relief-Maske sind erkennbar. Die Maske ist klein, das „zeigt dich“ liest man erst aus der Nähe.
  - Biom 4: Rost-Palette, passt zu Bote und Windgestalt (dieselben Binden).
  - im Spiel 4: Beide Varianten stehen klar vor der Relieffront der Stadt.

## Nachgeher (`nachgeher_a`, `nachgeher_b`, Eis)

- **Motiv:** Nachahmung. Er hat einen Menschen sehr lange beobachtet und geht dir nach, nur falsch herum.
- **Was er ist:** etwas aus dem Eis, das die Form eines Menschen angenommen hat, rücklings.
- **Was falsch ist:** Er geht im hohen Rückwärtsbogen auf Händen und Füßen, der Bauch oben (der Nabel zeigt nach oben). Der Kopf hängt kopfüber unter der Schulter, das Gesicht steht auf dem Kopf (Mund oben, Augen unten), die Haare fallen bis fast zum Boden.
- **Vorher:** ein flacher, gerader Leib auf vier senkrechten Beinen, „wie ein Tisch mit hängendem Kopf“.
- **Silhouette in einem Satz:** Ein hoher Bogen aus einem menschlichen Leib auf vier gewinkelten Gliedern, vorn ein kopfüber hängender Kopf mit Haarvorhang.
- **Pipeline:** zwei Silhouetten verglichen: A „Brücke“ (gewählt) und B „aufrecht, Rücken zu uns, Knie nach hinten, Kopf gedreht“ (verworfen, nur noch ein dünner Humanoid, zu nah am Rufer und generisch). Der erste Bau von A hatte ein hängendes Hemd. Es machte die Figur wieder zum Klumpen, und die Hemdfetzen lasen sich wie eine Zahnreihe im Bauch. Das Hemd flog raus, der Bogen wurde höher und gekrümmt.
- **Varianten:** a mit flacherem Bogen und langem Haar, b mit hohem Bogen, kurzem Haar und Rippen.
- **Noten:**
  - Silhouette 5: sofort lesbar als Mensch im Rückwärtsbogen, kein anderer Gegner sieht so aus.
  - Licht 4: Randlicht an Bogen und Gliedern, Kopf und Haare im Schatten unter dem Leib.
  - Pixel 4: sauber und ohne Matsch. Das Gesicht ist sehr klein (Mund und Nase je 1 px).
  - Konzept 4: „falsch herum“ ist unübersehbar, die Nachahmung selbst sieht man im Bild nicht (dafür der Kniff).
  - Biom 4: Eis-Palette mit roten Augen, passt neben den Rufer.
  - im Spiel 4: sehr gut lesbar vor dem Eisfeld. Der Bogen ist etwas „Exorzisten-Gang“, also nah an einem bekannten Horrorbild, aber keine bestimmte Figur.

## Ertrunkener (`ertrunkener_a`, `ertrunkener_b`, Kapelle)

- **Motiv:** das Meer als etwas Älteres. Er ist nicht ertrunken, er hat umgelernt.
- **Wer er war:** ein Gemeindemitglied, das in der Soutane ins Wasser der Kapelle stieg.
- **Was falsch ist:** Er ist an Land, aber für ihn ist noch Wasser. Er schwebt knapp über dem Boden, der kahle Kopf hängt tief vor der Brust, die Arme treiben wie an Fäden, der Saum der Kutte hebt sich ungleich, und die nackten Füße hängen schlaff. Aus dem offenen Mund steigen Blasen, an Hals und Wange sitzen Kiemen, von Zehen und Saum tropft es ohne Ende.
- **Vorher:** eine Kutte mit Kapuze, schwarz gefüllt ein Klumpen.
- **Silhouette in einem Satz:** Eine schwebende Kutte wie eine Marionette, der Kopf hängt vor der Schulter, ein Saum, der sich hebt, und darunter zwei dünne hängende Beine.
- **Varianten:** a mit beiden Armen treibend, b mit einem Arm, der zur Oberfläche hinaufgreift, und einer Kapuze, die nach oben treibt.
- **Verlauf:** Der erste Wurf (Glockenrock, steife Haare) las sich als Tänzerin im Tutu mit Krone, also neu gemacht. Der zweite versteckte den Kopf im Rumpf, der dritte ließ ihn hinter dem Arm verschwinden und machte aus den waagrechten Armen eine Vogelscheuche. Jetzt hängt der Kopf abgesetzt vor der Schulter, die Arme hängen tief, die Haare sind weg, dazu ein Kordelgürtel und eine Knopfleiste.
- **Noten:**
  - Silhouette 4: kein Klumpen mehr, schwebend mit hängenden Beinen und abgesetztem Kopf, unterscheidbar von Chorknabe (Kegel) und Glockenmutter. Der Kopf ist klein.
  - Licht 4: Kerzen-Randlicht an rechter Seite, Arm und Beinen.
  - Pixel 4: harte Pixel, Blasen und Tropfen als einzelne Pixel. Der Rumpf ist eine große dunkle Fläche mit wenig Zeichnung.
  - Konzept 4: „unter Wasser an Land“ liest man an Schweben, Saum, Blasen und Tropfen. Der Strahl aus dem Mund (Auftrag 1) ist gegen die Blasen getauscht.
  - Biom 4: Kapellen-Palette, Soutane, passt neben Chorknabe und Glockenmutter.
  - im Spiel 4: lesbar, aber dunkel vor der dunklen Kapelle. Er lebt vom Randlicht.

## Netzflickerin, Rückseite (`netzflickerin_a`, `netzflickerin_b`, Hafen, Favoritin)

- **Was sich geändert hat (nur der Rücken):** Über den Buckel läuft jetzt ein knotiger Wirbelgrat, der die glatte Rundung aufbricht, dazu ein Schulterblatt-Grat. Der Umhang hat eine Taille und endet höher, darunter stehen die Beine mit hohen, nach außen geknickten Knien wie Spinnenbeine (ein drittes Bein dazu). Die senkrechten Falten sind schrägen Rippen unter dem Tuch gewichen. Kopf, Gesicht, Arme und Netz sind unverändert, sie bleibt erkennbar sie selbst.
- **Vorher:** Rücken und Umhang fielen als glatter Block bis zum Boden.
- **Silhouette in einem Satz:** wie bisher ein Buckel mit hängendem Kopf und zwei Spinnenarmen, jetzt mit einem gezackten Grat und spinnenhaft geknickten Beinen.
- **Noten:**
  - Silhouette 5: Der Grat zackt die Kontur, und die Beine brechen den Block auf.
  - Licht 5: wie bisher, der Grat fängt das Gegenlicht gut.
  - Pixel 4: Die schrägen Rippen auf dem Rücken sind nur schwach zu sehen.
  - Konzept 5: unverändert stark, der Rücken stützt jetzt „zu lange Glieder, Spinne“.
  - Biom 5: Hafen-Palette, unverändert.
  - im Spiel 4: In der mittleren Reihe ist sie kleiner, der Grat ist dort nur noch eine leichte Zackung.

## Tiefling (`tiefling_a`, `tiefling_b`, Hafen)

- **Motiv:** das Hybride, das Erbe aus dem Meer.
- **Wer er war:** ein junger Fischer aus einer alten Hafenfamilie, er trägt noch das Ölzeug.
- **Was falsch ist:** Der Kopf ist breiter als die Schultern und flach wie ein Fischkopf und sitzt ohne Hals tief zwischen den Schultern. Die Augen quellen seitlich aus der Kontur und sehen in zwei Richtungen, mit kleinen leuchtenden Pupillen statt großer Leuchtscheiben. Dazu ein breites Maul mit Unterbiss (im Biss eine Zahnreihe), Kiemen am Kieferwinkel, ein Flossenkamm über den Hinterkopf, Hände mit Schwimmhäuten bis zu den Knien und lange flache Füße.
- **Vorher:** Die beiden großen leuchtenden Augen lasen sich als Leuchtbrille.
- **Silhouette in einem Satz:** Ein gebückter Fischer in steifer Jacke, der Kopf breit und flach mit zwei seitlichen Augenbuckeln und einem Flossenkamm, lange Arme mit Fächerhänden, lange flache Füße.
- **Varianten:** a mit Mütze und halbem Kamm, b ohne Mütze, voller Kamm, breiterer Kopf, krummer.
- **Verlauf:** Der erste Wurf war ein Kühlschrank mit Hut: Der Kragen verdeckte das Gesicht, die Arme klebten am Rumpf, eine Kreuznaht machte einen Kasten daraus. Danach schmale Jacke ohne Kragen, Arme mit Abstand, Kopf frei und breiter.
- **Noten:**
  - Silhouette 4: Fischkopf mit Augenbuckeln und Kamm, unterscheidbar vom Schmuggler. Der Kopf liest sich auch etwas froschartig.
  - Licht 4: Randlicht an Kopf, Kamm, Arm und Beinen.
  - Pixel 4: sauber, das Maul als klare Linie. Die Jacke ist eine eher ruhige Fläche.
  - Konzept 4: Fischer (Jacke, Mütze) mit Fischerbe ist lesbar, die Brille ist weg.
  - Biom 4: Hafen-Palette, gelbe Augen wie die Laternen.
  - im Spiel 4: gut lesbar vor Kai und Häusern.

## Das Nest (`nest_a`, `nest_b`, Moor)

- **Motiv:** falsche Geometrie. Ein Hügel ist kein Tier, bis er aufsteht.
- **Was es war:** ein Erdhügel am Bohlenweg, um den man im Dorf einen Bogen macht. Jemand hat einen Pflock mit einem Lappen hineingesteckt (b: eine alte Bohle liegt quer darüber).
- **Was falsch ist:** Im Leerlauf ist es ein Grashügel, die angezogenen Beine sehen aus wie Wurzelknie. Im Angriff steht es auf acht kantigen Beinen auf, der Bauch hängt durch, vorn öffnet sich eine Reihe menschlicher Zähne. Die Augen blinzeln nacheinander, nie gleichzeitig.
- **Vorher:** Die hohen Spinnenbeine waren immer zu sehen, also eher Spinne als Hügel.
- **Silhouette in einem Satz:** Ein schiefer Grashügel mit Pflock und Lappen, an den Seiten geknickte Wurzelknie; im Angriff ein Hügel auf acht Beinen.
- **Verlauf:** Der erste Wurf hatte eine linsenförmige Unterseite (schwebte) und eine unsichtbare Bohle. Danach eine Kuppel mit flachem Boden, die Bohle ragt heraus. Im Aufstehen wurde der flache Boden zur Kiste auf Beinen, darum wölbt er sich jetzt zum Bauch, und die Beine sind gespreizt statt kammartig.
- **Noten:**
  - Silhouette 4: Hügel mit Pflock und Wurzelknien, nach dem Aufstehen klar ein Tier. Variante b mit der Bohle ist eher ein Keil.
  - Licht 4: Randlicht an Gras, Pflock, Kuppel und Beinen.
  - Pixel 4: Grashalme und Zähne als Einzelpixel, harte Kanten.
  - Konzept 4: „Hügel, bis er aufsteht“ sieht man im Wechsel von Leerlauf und Angriff, im Standbild nur über Augen und Zähne.
  - Biom 4: a in Moor-Grün, b in Wald-Violett wie bisher.
  - im Spiel 4: a hebt sich grün vom violetten Moor ab, b ist dunkler und liest sich in der hinteren Reihe mehr als Krabbler.

---

## Kniff-Vorschläge (für `foes.json`, nach [paket-format.md](paket-format.md))

```json
{
  "windgestalt": {"kniff": {"art": "ansage", "zuege": 2, "v": 18, "why": "Er atmet zwei Züge lang ein, der Brustkorb aus Binden wird weit; dann atmet er alles auf einmal aus."}},
  "mumie":       {"kniff": {"art": "nachlass", "was": "explodiert", "v": 6, "why": "Wenn die Binden reißen, entweicht der Staub von Äonen, und er trifft dich."}},
  "nachgeher":   {"kniff": {"art": "abschrift", "n": 1, "why": "Er macht deine Bewegungen nach, und eine davon gehört danach ihm."}},
  "ertrunkener": {"kniff": {"art": "loeschen", "why": "Für ihn ist noch Wasser: Brand erlischt an ihm am Zugende."}},
  "netzflickerin": {"kniff": {"art": "einfrieren", "why": "Ihr Netz verfängt jeden Zug eine deiner Karten."}},
  "tiefling":    {"kniff": {"art": "ruf", "gegner": "tiefling", "alle": 3, "why": "Er ruft ins Wasser, und ein Vetter kommt herauf."}},
  "nest":        {"kniff": {"art": "verborgen", "why": "Ein Hügel kündigt nichts an: Was es vorhat, sieht man nur halb."}}
}
```

Dazu für die Windgestalt: `besonders.schwach_wechsel` streichen und `weak` fest auf `W` setzen (siehe oben), damit der Kampf aus genau einer Idee besteht: einatmen, ausatmen. Passendes Muster: Sandsturm (3 × 4), Einatmen (Block 8, Ansage läuft), Einatmen (Stärke +2), Ausatmen (18), Böe (9).

## Offene Schwächen (ehrlich)

- Keiner der Neubauten erreicht die Feinheit der Favoriten (Gesamt 4, nicht 5). Am gröbsten sind die Schulterlappen der Windgestalt und der flächige Rumpf des Ertrunkenen.
- Die Mumie hat von weitem etwas von einem sitzenden Hund, der Tiefling etwas von einem Frosch.
- Der Nachgeher ist nah am bekannten „Rückwärts-Krabbeln“ aus dem Horrorfilm (eine Pose, keine Figur).
- Nest b und Ertrunkener sind im Spiel dunkel und leben vom Randlicht.
- Wächter sind durch `pruefen.js` auf 128 × 160 begrenzt, obwohl 160 × 180 erlaubt wären.
