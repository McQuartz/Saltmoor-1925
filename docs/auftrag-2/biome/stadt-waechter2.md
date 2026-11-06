# Namenlose Stadt (`stadt`) · Zweiter Wächter: Der Getragene (`getragene`)

Zugabe zu Auftrag 2. Daten im Ergänzungspaket `prototype/data/biome/stadt_plus.json` (`waechter_dazu`, Gegner unter `foes`), Sprite `tools/sprites/gegner/getragene.js` (Hilfen in `tools/sprites/gegner/hilfe/w2a3.js`), Zone `tools/sprites/zonen/stadt_phosphor.json`. Der Seed wählt je Run zwischen dem Wind, der Gestalt hat, und dem Getragenen; die Wächter-Szene bleibt dieselbe. Alles per Skript gezeichnet (`quelle: skript`).

## Idee

- **Wer:** einer der Erbauer, der nicht gestorben ist. Durch die niedrigen Gänge zieht noch sein Leichenzug: vier Träger in Binden, mit den langen flachen Schädeln der Erbauer, tragen die Lade auf zwei Stangen.
- **Das falsche Detail:** Die Träger sind tot, der in der Lade ist es nicht. Der Deckel steht einen Spalt offen, darin ist Licht, und aus dem Spalt kommen Finger, zu viele und zu lang, und haken sich über den Rand. Die Stirnseite der Lade ist sein Gesicht aus Stein, mit Schnauze, und die Augen darin leuchten.
- **Silhouette:** ein langer Kasten mit Satteldeckel hoch auf zwei Stangen, vorn der Steinkopf mit Schnauze, darunter acht dünne, gebeugte Beine im Schritt; beim Angriff klappt der Deckel auf und ein Arm greift heraus.
- **Proben:** die Lade allein, aufrecht wie ein Sarg (schwarz ein Brett mit Kopf, zu nah an Relief und Bote). Genommen: der Zug mit Trägern.
- **Anders als der Wind:** Die Windgestalt ist eine hohle, dünne Gestalt, die allein kämpft und nur zuschlägt. Der Getragene **ruft und schützt**: Besonderheit `ruft` (alle 3 Züge löst sich ein Träger aus dem Zug: eine Erbauer-Mumie kommt dazu), Kniff `schuetzer` (die Träger decken jeden, der neben der Lade geht, mit 5 Block). Gegen ihn braucht man Flächenschaden oder eine klare Zielwahl.

## Kampf

- **Werte:** 76 Leben, Schwachstelle **Feuer** (Binden und trockenes Holz). Muster 11, Block 10, 3 × 5, Stärke +2, 16.
- **Stimme:** `chor` (ein Zug, viele Kehlen). **Beute:** Das schräge Lot (`schraeges_lot`).
- **Licht:** eigene Zone `stadt_phosphor`: die Körperstufen der Stadt, Randlicht **phosphorgrün** (das Licht aus dem Abgrund hinter dem Messingtor; die rote Szene hat es nirgends). Innere Lichter: der Spalt unter dem Deckel (gelb), die Augen im Steinkopf, ein Funke in jedem Trägerschädel. Zusatzfarbe `binde` für die Wicklungen.
- **biom-test (20 Seeds):** Wind 14/20 (70 %), Getragener 14/20 (70 %). Die Niederlagen fallen in beiden Fällen in den normalen Kämpfen davor; im Wächterkampf verliert der Autospieler im Mittel 2–3 Leben (Wind 2), braucht aber 5 statt 2–3 Züge.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Der Getragene (`getragene`) | 4 | 4 | 4 | 4 | 4 | 5 | **4** | Kasten auf Trägerbeinen mit Steinschnauze ist eigen; die Finger im Lichtspalt sind das stärkste Detail. Schwächen: Schwarz verwandt mit der Neununddreißigsten (beides Masse auf vielen Beinen, aber dort kurz und mit Feldzeichen), die Schädel der Träger sind klein, die hinteren Träger sind dunkle Pfosten. |
| Im Spiel (Wächter-Szene) | | | | | | 5 | **4** | Das grüne Randlicht steht klar vor dem roten Fries; der Zug füllt die Mitte, ohne die Kreisform hinten zu verdecken. |

Bilder: [Spiel](../bilder/Zugabe/waechter2/stadt-getragene.png), [Kontaktbogen](../bilder/Zugabe/waechter2/bogen-a3.png), [Silhouetten gegen alle](../bilder/Zugabe/waechter2/silhouetten-gegen-alle-a3.png).
