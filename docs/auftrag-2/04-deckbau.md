# Deckaufbau, Synergien, Idealbuilds

Das ist die Konzeptarbeit, um die Philip gebeten hat („mechanics und synergies entwickeln … probehalber idealbuilds konzipieren und gucken welche karten da dann geil sind“). Sie ist abgestimmt und wird umgesetzt. Zahlen sind Startwerte. Der Agent stimmt sie mit dem Autospieler ab (M8) und schreibt Änderungen in `fortschritt.md`.

## 1. Das Problem heute

- Das Deck besteht **nur** aus den Karten der angelegten Items: höchstens 6 Plätze, jedes Item gibt eine Karte, die doppelt im Deck liegt, dazu seit `more-cards` je Item eine schwache Grundkarte. Mehr kann das Deck nicht werden.
- Darum bringen Kämpfe außer Gold nichts. Ob ein Run stark wird, hängt daran, ob zufällig zwei, drei starke Items fallen.
- Items sind Werte-Träger („6 Schaden, 1 Kosten“). Sie haben keine Eigenschaft, die einen Plan auslöst.
- Starke Karten kosten 2 Energie, und es gibt kaum Wege zu mehr Energie. Das fühlt sich an wie „stark = teuer“ statt wie ein Deck, das läuft.

## 2. Der Kern: Kerben und Handgriffe

Philip will, dass das Deck wächst, **ohne** dass der Item-Ansatz (das Besondere von Saltmoor) verloren geht. Die Lösung:

> **Dein Deck ist deine Ausrüstung.** Items tragen Karten. Neue Karten lernst du als **Handgriffe** und ritzt sie in eine **Kerbe** eines Items. Ein Handgriff nimmt die **Stoffe des Items** an, in dem er steckt.

**Kurz gesagt:** Jeder gewonnene Kampf gibt dir eine **neue Karte** (einen Handgriff), die **zusätzlich** ins Deck kommt. Damit sie weiß, welchen Stoff sie hat, hängst du sie an eines deiner Items. Die Kerbe ist nur der Platz am Item dafür. Beispiel: Startdeck 10 Karten. Nach Kampf 1 wählst du „Schüren“ und hängst es an die Fackel, jetzt hast du 11 Karten, und „Schüren“ ist eine Feuer-Karte. Nach Kampf 2 hängst du „Abwarten“ an den Salzbeutel, 12 Karten, „Abwarten“ ist Salz. Und so weiter bis 20 bis 28.

- **Stammkarte:** Jedes Item hat wie bisher eine eigene Karte (2 Kopien im Deck, `card_copies`).
- **Kerben:** Jedes Item hat 1 bis 3 Kerben (gewöhnlich 1, selten 2, Reliquie 2, nach Werkstatt höchstens 3).
- **Handgriffe:** Karten ohne eigenen Stoff (Wirkung, Kosten, Name). In einer Kerbe liegt **ein** Handgriff, im Deck **eine** Kopie. Er trägt die Stoffe seines Items. Derselbe Handgriff „Nachsetzen“ in der Fackel ist Feuer, im Weihwasser Salz + Glaube. Damit löst er andere Reaktionen aus. Hier entsteht der Build.
- **Ausrüstung wechseln = Paket wechseln:** Legt man ein Item ab, gehen Stammkarte **und** seine Handgriffe aus dem Deck. Im Rucksack bleiben sie am Item. Darum gibt es den Rucksackmodus mit Deck-Vorschau ([07-ui-und-gefuehl.md](07-ui-und-gefuehl.md)).
- **Deckgröße:** Start etwa 10 Karten (3 Items × 2 Stammkarten + 4 Start-Handgriffe). Ende eines guten Runs 20–28 Karten.
- **Grundkarten aus `more-cards`** werden durch die Start-Handgriffe ersetzt („Stoßen“, „Ausweichen“, „Durchatmen“, „Abwarten“). Sie stecken schon in den Kerben der Startitems und lassen sich lösen oder überschreiben. `balance.json → grundkarten` fällt weg.
- **Volle Kerbe:** Ein neuer Handgriff überschreibt einen alten (mit Rückfrage im Spiel) oder kommt in ein anderes Item. Ablehnen ist immer möglich.

Warum das trägt: Das Deck wächst mit jedem Kampf, aber die Synergie entsteht weiter über Items und Stoffe. Das ist der Teil, den es so nur in Saltmoor gibt. Zwei Spieler mit denselben Handgriffen haben verschiedene Decks, weil die Items verschieden sind.

**Karten, die gut und schlecht zugleich sind** (Philips Idee „starke Karte und eine scheiß Karte“): Das ist **keine** Kernmechanik. Es darf höchstens 5 solche Items geben, als Würze (z. B. „Gezeichnetes Messer: starke Stammkarte, aber ein Handgriff ‚Zittern‘ (unspielbar) ist fest eingeritzt“).

## 3. Items neu: Eigenschaft statt nur Werte

| Seltenheit | Stammkarte | Kerben | Eigenschaft | Woher |
|---|---|---|---|---|
| gewöhnlich | ja | 1 | keine oder klein | Fundpool, Krämer, Kampf (selten) |
| selten | ja | 2 | eine, die einen Plan stützt („Brand an Gegnern verfällt nur um 1 statt um alles“) | schwerer Kampf, Krämer, Ereignis |
| Reliquie | ja oder nein | 2 | eine, die einen Build **definiert** („Jede Reaktion gibt 1 Block“, „Hochreaktionen zweimal pro Zug“) | **nur** Wächter, Boss, sehr seltene Ereignisse |

- Ziel: etwa **70 Items** (die 56 vorhandenen überarbeiten, schwache streichen oder zusammenlegen, neue aus den Biomen dazu), davon etwa 18 Reliquien. Jedes Biom bringt eigene Items in seinen Fundpool, die zu seinem Ort passen (Kurhaus: Badethermometer, Nachtzug: Fahrkartenzange …).
- **Jedes Item hat einen Satz Flavor-Text** im Ton der Welt (die Texte sind das, was Philip am meisten mag).
- Items haben einen Verkaufspreis (40 % des Kaufpreises, Krämer).

## 4. Neue Schlagworte (sparsam)

Nur diese neuen Mechaniken. Jede bekommt ein Stoffzeichen-artiges Symbol und einen Tooltip.

| Schlagwort | Wirkung | Wozu |
|---|---|---|
| **Stärke n** | Deine Angriffe machen +n Schaden je Treffer, bis Kampfende | Mehrfachtreffer-Builds |
| **Verwundbar n** | Gegner nimmt n Züge lang 50 % mehr Schaden | Vorbereitung, Rollen |
| **Funke** | Kostet 0, wenn diese Karte eine Reaktion auslöst | billige Kombos, Kosten-Gefühl |
| **Kette n** | +n Wirkung je Reaktion, die in diesem Zug schon ausgelöst wurde | Kettenwerk |
| **Behalten** | Bleibt am Zugende auf der Hand | Planung |
| **Opfer n** | Zahle n Leben statt Energie | Aderlass |
| **X** | Verbraucht alle Energie, wirkt X-mal | Endspiel-Wucht |

Bestehende Schlagworte bleiben: Brand, Gift, Geschwächt, Block, Schutz (ward), Ziehen, Energie, Eröffnung, Verbraucht, alle (all), Mehrfachtreffer (h).

## 5. Energie und Kosten

Philip: „wenig möglichkeiten mehr energie zu bekommen“, „cardcosts vllt durch event verringern“. Die Wege:

- **Im Zug:** Handgriffe mit Energie („Atemholen: 0, +1 Energie, Verbraucht“), die Reaktion Fanal (FL), Funke-Karten, die durch eine Reaktion umsonst werden.
- **Über den Zug:** Eigenschaft „1 ungenutzte Energie bleibt“ (Taschenuhr, selten), Eröffnung „+1 Energie im ersten Zug“.
- **Dauerhaft:** Reliquien mit +1 Energie pro Zug, aber einem Preis (eine Karte weniger auf der Hand, oder weniger Heilung). Höchstens 2 im Pool. Ein sehr seltenes Ereignis.
- **Kosten senken:** **Schleifen**: Eine Karte kostet dauerhaft 1 weniger (mindestens 0, je Karte einmal, sichtbar als Schliff-Zeichen). Das gibt es an Rast (statt heilen), in der Werkstatt und in Ereignissen („Der Uhrmacher im Nachtzug feilt dir alle Handgriffe eines Items ab, eine Stunde deines Lebens gegen …“).
- **Kostenkurve:** In jedem Pool etwa 30 % 0-Kosten, 50 % 1-Kosten, 15 % 2-Kosten, 5 % 3 oder X. Eine 2-Kosten-Karte muss eine **Wirkung** haben, die man planen will (verdoppeln, Kette auslösen, alles treffen), nicht nur „mehr Zahl“.

## 6. Belohnungen: jeder Kampf bringt etwas

| Knoten | Gold | Handgriff | Item | Besonderes |
|---|---|---|---|---|
| Kampf | ja | **1 aus 3** (oder überspringen für +10 Gold) | 25 % Chance auf 1 aus 2 | |
| schwerer Kampf | ja, mehr | 1 aus 3, davon 1 selten | 1 aus 3, davon 1 selten | |
| Wächter (Elite) | viel | 1 aus 3 seltene | **Reliquie 1 aus 3** | Stummfilm, Zwischentitel |
| Finale | | | | Endbildschirm |

- **Handgriff-Auswahl mit Absicht:** 2 der 3 Handgriffe passen zu den Stoffen und Schlagworten, die schon im Deck stecken (gewichtet), einer ist frei. So zieht der Run in Richtung eines Builds, ohne dass er festgelegt ist.
- **Beim Wählen:** Vorschau, in welches Item er passt, welchen Stoff er dort hätte und welche Reaktionen dadurch **neu möglich** werden („In der Fackel: Feuer. Mit deinem Salzbeutel: Knistern“).
- **Wie sich Belohnung anfühlt:** Seltenheit ist am Rahmen sichtbar (gewöhnlich schlicht, selten Messing, Reliquie Gold mit langsamem Glanz), die Karten werden aufgedeckt (kurzer Aufdeck-Ton, bei Reliquie tiefer Glockenschlag), eine neu mögliche Reaktion blinkt als Stoffpaar. Dazu der Satz zur Beute: je Biom und Gegner verschieden, nie immer gleich ([07-ui-und-gefuehl.md](07-ui-und-gefuehl.md)).

## 7. Sechs Idealbuilds

Jeder Build hat einen Kern (was man sammelt), eine Stütze (was ihn zuverlässig macht), einen Höhepunkt (die Karte, bei der man laut wird) und eine Schwäche (gegen wen er leidet). Gegner in [05-inhalte.md](05-inhalte.md) sind so gebaut, dass jeder Build mal glänzt und mal leidet.

### 7.1 Glutnest (Feuer, mit Eisen oder Salz)

- **Kern:** Brand stapeln. Glühend (EF) und Knistern (FS) zünden ihn.
- **Handgriffe:** *Schüren* (1: Brand am Ziel verdoppeln), *Funkenflug* (0, Funke: Brand 1 an allen), *Nachlegen* (1: Brand 3, Behalten).
- **Items:** Teerfackel, Schwarze Kerze, Salzbeutel; neu *Kohlenschaufel des Heizers* (selten, Nachtzug: Eigenschaft „Brand verfällt am Zugende nur um 1“).
- **Höhepunkt:** Reliquie *Der Ofen unter der Fabrik*: Stirbt ein Gegner mit Brand, springt sein Brand auf alle anderen über. Dazu die Hochreaktion Reinigendes Feuer.
- **Schwäche:** Gegner, die Brand löschen oder aus Wasser sind (Kurhaus, Ertrunkene).

### 7.2 Brackwasser (Fäulnis und Wasser)

- **Kern:** Gift. Brackwasser (VW), Seuche (BV), dann Läuterung (LV) oder Ertrinken (Hochreaktion).
- **Handgriffe:** *Sickern* (1: Behalten, am Zugende Gift 1 an allen), *Ansteckung* (1: Gift 4, stirbt das Ziel, wandert sein Gift weiter), *Abwarten* (0: Block 3, Gift am Ziel +1).
- **Items:** Seltsame Muschel, Sense, Gasmaske; neu *Glas mit Moorwasser* (Reliquie: Gift wirkt am Zugende zweimal).
- **Höhepunkt:** Ertrinken auf ein Ziel mit 20 Gift.
- **Schwäche:** Gegner ohne Fleisch (Salzwesen, Eis, Bronze im Gezeitenwerk), kurze Kämpfe.

### 7.3 Bollwerk (Glaube und Salz)

- **Kern:** Block und Schutz (ward) über Züge tragen. Bannkreis (GS).
- **Handgriffe:** *Kanzelschlag* (2: Schaden in Höhe deines Blocks), *Standhalten* (1: Block 6, Behalten), *Schwelle* (0, Funke: Schutz 3).
- **Items:** Familienbibel, Weihwasser, Priesterkragen; neu *Taufstein-Splitter* (Reliquie: Block verfällt nur zur Hälfte).
- **Höhepunkt:** Kanzelschlag mit 40 Block.
- **Schwäche:** Gegner, die Block zerbrechen oder Gift geben.

### 7.4 Aderlass (Blut, mit Glaube oder Eisen)

- **Kern:** Leben als Treibstoff. Opfer (BG) verdoppelt, Klinge (BE) heilt zurück.
- **Handgriffe:** *Bluteid* (Opfer 3: +2 Energie), *Wunde Hand* (1: 4 Schaden, +1 je 5 fehlende Leben), *Aufschneiden* (0: Opfer 2, ziehe 2).
- **Items:** Ritualdolch, Kultistenrobe, Blutrosenkranz; neu *Herz im Glas* (Reliquie: Jedes Mal, wenn du Leben zahlst, +1 Stärke).
- **Höhepunkt:** Bei 12 Leben ein Zug mit 6 Karten und Opfer-Verdopplung.
- **Schwäche:** Gegner mit vielen kleinen Treffern, Ereignisse, die Leben kosten.

### 7.5 Kettenwerk (viele Stoffe im Wechsel)

- **Kern:** Viele Reaktionen pro Zug. Funke macht Karten billig, Kette belohnt die Länge.
- **Handgriffe:** *Umschlagen* (0, Funke: ziehe 1), *Fortsetzen* (1, Kette 3: 3 Schaden +3 je Reaktion), *Gegenlauf* (1: die nächste Karte reagiert mit jedem Stoff der Karte davor).
- **Items:** Tarotkarten, Kompass, Hexenflasche; neu *Das Gezeitenrad* (Reliquie, Gezeitenwerk: Hochreaktionen zweimal pro Zug).
- **Höhepunkt:** Zug mit 5 Reaktionen und zwei Hochreaktionen.
- **Schwäche:** braucht Ziehen und Mischung, leidet unter Gegnern, die Karten verstopfen (Kloster: „Abschrift“-Karten ins Deck).

### 7.6 Hagel (Eisen, Mehrfachtreffer)

- **Kern:** Stärke und Verwundbar, dann Karten mit vielen Treffern.
- **Handgriffe:** *Nachladen* (1: Stärke 2, Behalten), *Anschlagen* (0: Verwundbar 1), *Trommelfeuer* (X: 3 Schaden X+1-mal).
- **Items:** Revolver, Ankerkette, Enterbeil; neu *Patronengurt des Lotsen* (Reliquie: Mehrfachangriffe treffen einmal mehr).
- **Höhepunkt:** Ankerkette mit Stärke 6 auf ein verwundbares Ziel.
- **Schwäche:** Gegner mit Dornen (Schaden je Treffer zurück), viel Block pro Treffer.

### 7.7 Beispieldeck (Glutnest, Ende Akt IV)

Fackel (2 × *Fackel schwingen*, *Schüren*, *Funkenflug*), Salzbeutel (2 × *Salz streuen*, *Nachlegen* (wird Salz → Knistern mit Feuer)), Kohlenschaufel (2 × *Schaufeln*, *Atemholen*, *Standhalten*), Ölmantel (2 × *Abperlen*, *Ausweichen*), Ofen-Reliquie (*Glutkern*, *Funkenflug*), Teerfackel (2 × *Teer und Flamme*). Das sind 22 Karten, 9 davon 0 Kosten, 3 mit Funke. Ein typischer Zug: Funkenflug (0) → Salz streuen (0, Knistern) → Schüren (1) → Teer und Flamme (1, Glühend) → Nachlegen behalten.

Der Agent baut für die anderen fünf Builds je ein Beispieldeck in `docs/auftrag-2/builds.md` und lässt einen Build-Bot je Archetyp spielen (M8).

## 8. Werkstatt, Rast, Krämer mit dem neuen Kern

- **Werkstatt:** wie bisher verschmelzen (zwei Items → eins mit zwei Stoffen), dazu neu: **+1 Kerbe** an einem Item, oder **Schleifen** einer Karte.
- **Rast:** heilen **oder** Schleifen **oder** einen Handgriff von einem Item in ein anderes umritzen.
- **Krämer:** Items kaufen, **Items verkaufen** (40 %), Handgriff kaufen (2 Angebote), Handgriff entfernen gegen Gold, ab und zu eine Reliquie zum Wucherpreis.
- **Ereignisse** dürfen alles davon gegen einen Preis anbieten (Leben, Gold, ein Fluch-Handgriff, ein Kampf).

## 9. Zielwerte für die Balance

- Generischer Bot (gierig): 30–45 % Siege.
- Build-Bot je Archetyp: 40–60 % Siege, keiner über 70 %, keiner unter 25 %.
- Deckgröße am Ende: 20–28. Reaktionen pro Zug in Akt IV: im Schnitt mindestens 1,5.
- Ein menschlicher Run dauert etwa 40–50 Minuten (Schätzung über die Zahl der Züge und Entscheidungen).
- Kein Akt darf mehr als 35 % aller Niederlagen verursachen (heute die Pforte mit über 40 %).
