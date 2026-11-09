# Prüfung der M9-Vorschläge (art, asche, tiefe)

Geprüft gegen `prototype/data/foes.json`, `prototype/data/biome/*.json` (Feld `konzept`) und die Steckbriefe in `docs/auftrag-2/biome/*.md` (Zeile „Wer er/sie war“). Maßstab: mensch = sichtbar unveränderter Mensch, veraendert = Mensch mit sichtbarer Körperveränderung, nachahmer = Ding oder Wesen in Menschenform, tiefe = ohne menschliche Form. Ein Ding, das an einem unveränderten Menschen hängt (Schlüsselbund, Decke, Kerzen, Pfütze, Schatten), ist keine Körperveränderung. Nie Herkunft, Blut oder Abstammung. Kein Grund in `art.json` enthält eine solche Aussage.

## 1. art.json: Änderungen (alt → neu)

| Gegner | alt → neu | Begründung (Steckbrief) |
|---|---|---|
| quellwaerter | veraendert → mensch | „Schöpfte den Pilgern mit der Kelle aus der Quelle. Steht jetzt bis zur Hüfte in einer Schale, die eine Handbreit tief ist.“ Der Körper selbst ist unverändert; wie beim Kühlhausgast („steckt bis zur Hüfte im Eis“, mensch) ist es der Ort, der nicht stimmt. |
| bittsteller | veraendert → mensch | „Rutscht seit der letzten Wallfahrt auf Knien, ein Bündel Kerzen auf dem Rücken … Das Wachs an seinen Kerzen läuft nach oben.“ Verändert ist das Wachs, nicht der Körper. |
| badefrau | veraendert → mensch | „Ihre Arme stecken bis zu den Ellbogen in einer Pfütze, die tiefer ist als der Boden.“ Wie beim Quellwärter: die Pfütze ist falsch, nicht der Körper. |
| zugedeckte | veraendert → mensch | „Ein Kind im Nachthemd, die Anstaltsdecke um die Schultern. Die Decke geht mit und ist viel zu lang.“ Das Kind ist unverändert, die Decke ist es, der Gegenstand wie der Schlüsselbund der Nachtschwester. |
| schreiber | veraendert → mensch | „Er schreibt mit dem Finger auf, was du bei dir trägst. Die Liste … wächst aus dem Buch.“ Nichts am Körper ist beschrieben. |
| uhrmacher | veraendert → mensch | „Ein langer, gebeugter Reisender mit Uhrmacherlupe … Im Mantelfutter hängen Taschenuhren, und alle gehen rückwärts.“ Steckbrief: „ein Reisender, Uhrmacher von Beruf“. Körperveränderung steht nirgends. |
| mondmann | veraendert → mensch | „Gebückt unter einem Bündel, größer als er selbst, mit Stock und Laterne.“ Die Hände am Bündel sind die Hände von 1890 an den Sprossen, nicht seine. |
| heimleiterin | veraendert → mensch | „Hoch und schmal im schwarzen Kleid von 1890.“ Das Wort „übermäßig gestreckt“ aus dem Vorschlag steht nicht im Steckbrief. Die Kinder hinter ihr sind das Falsche, nicht ihr Körper. |
| schlafwagenkind | mensch → veraendert | „Sein Haar fällt nach oben, als hinge es kopfüber, und durch die geschlossenen Lider scheint Licht.“ Haar und Gesicht sind sichtbar verändert (wie die gelochte Kontrolleurin). |
| kurgast | mensch → veraendert | „Die Brille ist voll Wasser, die Augen schwimmen darin, jedes für sich.“ Die Augen sind aus dem Kopf gelöst, das ist eine sichtbare Körperveränderung. |
| oelerin | veraendert → nachahmer | Steckbrief: „Wer sie war: eine der Dienerinnen, die die Maschine schmieren. Es gab sie, bevor jemand sie so genannt hätte“; „In der Hand mit sieben Fingern ein Lappen“. Sie war nie ein Mensch. Menschenähnliche Haltung (gebeugter Umhang), also nachahmer. Folge für Asche, siehe 2. |
| kraterbewohner | veraendert → nachahmer | Steckbrief: „Wer er war: niemand. Die Krater sind bewohnt.“ Er stützt sich auf den Wall „wie auf ein Fensterbrett“. Ein Wesen in Menschenhaltung, kein verwandelter Mensch. |

Ergebnis: mensch 17, veraendert 68, nachahmer 14, tiefe 44 (vorher 11 / 76 / 12 / 44). Alle 143 Gegner sind abgedeckt.

## 1a. Bestätigte Grenzfälle (unverändert)

- zwillinge: mensch. „Das Licht wirft nur einen Schatten, und der Schatten hat zwei Köpfe.“ Die Mädchen sind unverändert.
- nachtschwester: mensch. „Schlüsselbund so groß wie ein Fassreifen … alle tropfen.“ Nur der Gegenstand wächst.
- schlafwagenkind, kurgast: siehe Änderungen oben.
- fensterzaehlerin: mensch. „Die Frau des Oberwärters.“ Das Fenster, das sie trägt, ist der Gegenstand.
- fotograf: mensch. „er selbst unter dem schwarzen Tuch … seine Schuhe“; die kleinen Füße daneben sind Kinder, nicht er.
- gepruefte: mensch. „Eine Frau aus dem Kirchspiel, 1651 geprüft“; Schweben und Seil sind Umstand, nicht Körperveränderung.
- glasschwimmer: mensch. „Langstreckenschwimmer von 1925 in gestreiftem Wollbadeanzug“; nur das Glas verhält sich wie Wasser.
- vorhergehende: mensch. „Der Kundschafter … Unter ihm im Glas steht sein Spiegelbild und holt schon aus.“ Das Spiegelbild ist schneller, er nicht.
- zugedeckte, heimleiterin: siehe Änderungen. turnlehrer bleibt veraendert: „auf einem Bein, das zu lang ist für einen Menschen“.
- menge: veraendert. „Sie stehen so dicht, dass sie ein Leib geworden sind.“
- kirchenvogt: veraendert. „auf dem Rand des Tellers liegt sein Kopf, auf der Seite“.
- gussnaht: veraendert. „eine Hälfte eines alten Mannes und eine Hälfte eines Kindes, aneinandergegossen.“
- chor: veraendert, knapp. „Viele Köpfe, eingefroren in einem Klumpen Eis“: sichtbar Menschenköpfe, zu einem Klumpen verwachsen. Gegenvorschlag wäre tiefe; ohne Folge für Asche.
- lotse: veraendert. „statt Kopf ein Laternengehäuse“.
- glockenmutter: veraendert. „Glocke statt Kopf“.
- nebelhorn: veraendert. „Er trägt den Schalltrichter statt des Kopfes.“
- oberkellner: veraendert. „Wo der Kopf sein müsste, steht … ein Teller unter einer silbernen Speiseglocke.“
- astronom: veraendert. „Wo sein Kopf war, steht eine Armillarsphäre.“
- oelerin, kraterbewohner: siehe Änderungen.
- mumie: tiefe. „Einer der Erbauer, die nicht aufrecht gingen; kriecht auf zu vielen Gelenken.“ Keine Menschenform.
- relief, getragene: nachahmer bleibt, aber knapp. Beide zeigen Erbauer (kein Mensch, „gemeißelt, bevor es Menschen gab“); relief ist ein Bild, getragene ein Leichenzug mit Steingesicht, also Menschenform nachgestellt. Gegenvorschlag wäre tiefe; ohne Folge für Asche, da beide nicht in Frage kommen.
- neununddreissigste: nachahmer. „Die Legion, die es nie gab“, aus Schilden gebrannter Ziegel.
- vorgaenger: nachahmer. „Eine Gestalt in deinen Kleidern … kämpft mit deinen Karten.“
- galionsfigur: nachahmer. Holzfigur vom Bug („nur mit dem Stück Bug, an das sie genagelt ist“).
- badekarren: tiefe. Ein Karren; die Dame ist nur ein Schatten auf dem Leinen.
- gepaeck: tiefe. „Überseekoffer … laufen auf zwei Menschenarmen“; die Gestalt ist ein Kofferstapel.
- fang: tiefe. Kabeljau mit Armen statt Brustflossen, ein Tier.
- dosenkind: veraendert bleibt. Steckbrief: „Morgens fand man nur eine Dose mehr.“ Der Junge ist in der Dose aufgegangen.
- tiefling: veraendert. „zu große Augen, Kiemenfalten am Hals“. Der Steckbrieftext nennt auch ein „Erbe des Großvaters“; Grund der Einordnung sind allein die sichtbaren Kiemenfalten, nie die Herkunft.

## 2. asche.json

14 der 16 Einträge bleiben unverändert gültig, einer bleibt mit geänderter art, einer entfällt. Jeder Gegner ist rang normal, steht in der Gegnerliste seines Biomes, hat art mensch oder veraendert und war laut Steckbrief einmal ein Mensch.

- gezeitenwerk: **kein gültiger Eintrag.** Der Vorschlag hatte die Ölerin. Ihr Steckbrief sagt „eine der Dienerinnen, die die Maschine schmieren. Es gab sie, bevor jemand sie so genannt hätte“, sie hat sieben Finger. Sie war nie ein Mensch (art jetzt nachahmer). Die übrigen normalen Gegner des Gezeitenwerks (zahnradwaerter, kanalaal, gewicht) sind tiefe. Das Biom hat also keinen Gegner „aus den Gestalten, die einmal Menschen waren“. Eintrag entfernt, asche.json hat 15 statt 16 Einträge, `tools/m9-vorschlaege.js` meldet dafür genau einen Fehler. Entscheidung für den Dirigenten: Gezeitenwerk ohne Asche lassen (Plan „je Biom einer“ auf 15 Biome ändern) oder die Ölerin trotz Steckbrief als veraendert führen.
- quellwaerter (grotte): bleibt, jetzt art mensch. Der Mann, der den Pilgern aus der Quelle schöpfte, ist ein ehemaliger Mensch.
- Unverändert geprüft: ertrunkener (kapelle), kreuzgangwaechter (kloster), giesser (glockengiesserei), nachtschwester (waisenhaus), salzmann (salz), bote (stadt), holzfaeller (wald), brennmeister (ziegelgruben), wartende (station), fahnentraeger (eis), echo (walkathedrale), glasschwimmer (glasmeer), astronom (mond), funker (funkstation).
- Einige „grund“-Sätze erzählen kleine Dinge dazu (z. B. „Rest des Salzes im Becken“). Sie sind Vorschlagstext, kein Spieltext; keine Herkunfts- oder Blutaussage.

## 3. tiefe.json

11 Wahlen (verlangt 8 bis 12). Wahltexte stimmen wörtlich mit den Daten überein (Skript: „Text gleich“).

Behalten: eis_name #0 (antwortet dem Ruf mit der eigenen Stimme), funkstation_antwort #0, alle_laterne_spricht #0 („Dem Licht folgen“), gezeitenwerk_schleuse #2 (Item ins Wasser legen), station_zug #0, grotte_stimme #0 („Ja sagen“), fabrik_rauch #0 („Hineinknien und einatmen“).

Geändert:
- kapelle_taufe: Wahl 1 → Wahl 0. „Dich taufen lassen“ ist das Nachgeben selbst; „Eine Gabe hineinwerfen“ ist ein Handel.
- hafen_leiter #2 raus. „Hinunterrufen, wie spät es ist: +14 Gold“: man ruft selbst und gibt nichts nach.
- walkathedrale_tran #1 raus. Trinken vom Tran der Expedition: der Ruf kommt nicht von der Tiefe, die Wahl ist ein Wagnis, keine Hingabe.
- neu gezeitenwerk_hauptrad #0 „Dich in die Lücke legen und mitfahren“ (man legt sich ins Wasser).
- neu stadt_wind #0 „Dich mitziehen lassen“ (man lässt sich vom einatmenden Abgrund ziehen).
- neu mond_rand #0 „Einen Schritt hinüber“ (man folgt der Linie ins Graue).

Nicht genommen: kloster_flut (Lesen, Klettern, Hinaufgehen: man weicht der Flut aus), glasmeer_wartet (Annehmen vom Spiegelbild, aber das Wesen ist ein Spiegelbild, nicht die Tiefe; als Ersatz denkbar), waisenhaus_nachtlicht (#2 „Darunter stehen bleiben, bis dein Schatten stimmt“ ist Anpassung an das Haus; als Ersatz denkbar).
