# Welle 2: die neue Oberfläche

Alle Entscheidungen hier sind von Philip abgenommen ([02-entscheidungen.md](02-entscheidungen.md)). Die Vorlagen sind klickbare Mockups in [vorlagen/](vorlagen/), mit Playwright öffnen und durchklicken, bevor du anfängst:

| Vorlage | Was gilt |
|---|---|
| `saltmoor-kampf-hud-a3-runde-c.html`, Reiter „HUD überarbeitet“ ([Foto](vorlagen/hud-variante-2.png)) | Kampf-HUD, Stoff-Baum, Plakette |
| derselbe, Reiter „C1 Tiefe“ ([Foto](vorlagen/gegner-gestaffelt-c1.png)) | Gegner-Aufstellung |
| `saltmoor-kampf-kamera-probe-2.html` | **nur** als Technik-Vorbild für die Fahrt nach vorne (Ebenen, Boden in Streifen, Dolly statt Zoom). Die Dauerbewegung selbst ist verworfen |
| `saltmoor-karte-runde-1.html`, Reiter „B · Peilkarte im Nebel“ ([Foto](vorlagen/karte-b-peilkarte.png)) | Karte |
| `saltmoor-rucksack-runde-b.html`, Reiter „B · Am Körper“ ([Foto](vorlagen/rucksack-b-am-koerper.png)) | Rucksack, Ausrüstung, Deck |
| `fischer-figur-silhouette.png` | Stil der Figuren-Silhouetten |

**Grundsatz:** Die Mockups sind die Absicht, nicht der Pixel-Plan. Wo das echte Spiel mehr zeigt als das Mockup (mehr Karten, lange Namen, drei Gegner, vier Fächer, Kniffe), löst du es im Stil des Mockups, nicht durch Abschneiden oder Verkleinern unter die Lesbarkeit. Prüfe jede Ansicht bei 1280×720, 1440×900 und 1920×1080.

**Altes wird ersetzt, nicht überdeckt:** Stoffrad (`radSvg`), „1 aus 3“-Wegwahl (`wegHtml` als Hauptansicht), Mausfolge-Parallaxe im Kampf, alte Itemleiste und alter Rucksackmodus werden entfernt, sobald das Neue steht. Galerie und Artboard zeigen danach das Neue.

---

## 1. Kampf-HUD (Variante 2)

**Aufbau von oben nach unten:**

- **Kopfleiste:** links „TIEFE XIV · ZUG 1“ und der Biom-Name kursiv. Rechts Gold (Münze + Zahl, **gleiche Größe** wie Buch und Deck), Buch (gelesene Fragmente), Deck (Kartenzahl). Neu: rechts neben dem Biom-Namen das Zeichen der aktiven Regelbiegung mit ihrem Namen (Tooltip mit Regeltext), nur in Biomen mit Biegung ([06-lovecraft-kern.md](06-lovecraft-kern.md)).
- **Szene:** Gegner gestaffelt (Abschnitt 4), über jedem eine **Plakette** (Abschnitt 3).
- **Footer als Tisch mit Messingkante:** links der eigene Balken, darunter der Stoff-Baum. Mitte die Hand, die Karten ragen etwas in die Szene. Rechts Energie als Rauten und „ZUG BEENDEN“, darunter „Stapel x · Ablage y“.

**Eigener Balken:**

- Name der Figur links in Kapitälchen, Leben groß rechts darüber („52/52“).
- Rot = Leben, **Blau = Block als Verlängerung des Balkens** nach rechts mit dem Block-Wert im Schild am Ende. Kein Block-Wert mehr daneben.
- Drohender Verlust (Summe der sichtbaren Absichten nach Block): **zuerst bricht das Blau, der rote Rest ist schraffiert**. Keine Zahl darunter.
- Abstände: links zum Rand und rechts zu den Karten gleich groß. Der Balken sitzt mit Abstand zur Footer-Kante (Philips Hinweis zu A2).

**Karten:** Kosten in der Messing-Raute oben links, Stoff-Zeichen oben rechts, Name, Bild, Wirkung. Löst die Karte mit der zuletzt gespielten eine Reaktion aus, hängt **unten an der Karte ein Band** mit dem Namen der Reaktion („DAMPF“, „VERSTÄRKT“) und die Karte leuchtet in der Stofffarbe. Bei mehr als 6 Karten überlappen sie (wie heute), das Band bleibt lesbar.

**Kein Fragezeichen:** Suche alle Stellen, an denen die Oberfläche „?“ für einen unbekannten Wert zeigt, und ersetze sie. Bekannter Fall: Kniff `verborgen` zeigt in `absicht0` (`js/ui/oberflaeche.js`) das Absicht-Zeichen mit „?“. Neu: nur das Zeichen der Absicht-Art ohne Zahl, kein „?“. Das Ereignis-Symbol auf der Karte bleibt, es bedeutet „Ereignis“, nicht „unbekannt“.

## 2. Stoff-Baum

Ersetzt das Stoffrad, sitzt unten links unter dem Balken und nutzt die Fläche dort ganz.

- **Pfad:** die Stoffe der in diesem Zug gespielten Karten, als Kette von Zeichen von links nach rechts. Der letzte Stoff ist hervorgehoben (Rahmen in Stofffarbe).
- **Äste:** vom letzten Stoff aus je ein Ast zu jedem Stoff, mit dem die nächste Karte reagieren würde, mit dem Namen der Reaktion daneben (Paare, „Verstärkt“ bei gleichem Stoff, Hochreaktionen aus drei Stoffen in **Gold**, wenn die Hochreaktion in diesem Zug noch nicht verbraucht ist).
- **Hell und dunkel:** Ein Ast ist hell, wenn eine Karte auf der Hand ihn auslösen kann und bezahlbar ist. Sonst gedimmt. Ist kein Ast hell, steht dort **„Sackgasse“**.
- **Mitrücken:** Nach jeder gespielten Karte rückt der Pfad einen Schritt weiter (kurze Bewegung, keine Ablenkung). Bei langen Ketten scrollt der Pfad nach links aus, die letzten drei bleiben sichtbar.
- **Zugbeginn:** leer bis auf einen Platzhalter-Punkt. Mit Regelbiegungen, die über das Zugende hinaus wirken (Ringofen), beginnt er mit dem Stoff des Vorzugs.
- **Regelbiegungen** zeigen sich im Baum: „Über Eck“ als Bogen vom ersten zum letzten Glied, der beim Zugende aufleuchtet; „Falsche Winkel“ als Ast, der vom vorletzten Glied ausgeht; die Farbe als Glied in der Farbe des Stoffs, den sie gerade annimmt. Die Biegung ändert die Äste, die Logik dafür kommt aus derselben Funktion wie der Kampf (`reactionsFor` und ihre Erweiterungen), **nie aus einer zweiten Kopie der Regeln**.
- **Tooltip** je Ast: Reaktionstext aus `reactions.json`, unverändert.

## 3. Gegner-Plakette

- Eine Plakette über jedem Gegner: **Absicht oben** (Zeichen + Zahl, z. B. Schwert „5×2“), **Leben darunter** als roter Balken mit „24/31“, in **derselben Schrift und demselben Rot** wie der eigene Balken. Messingrand wie der Footer, kleine Spitze unten zeigt auf den Gegner.
- Block des Gegners als blaue Verlängerung wie beim eigenen Balken, Status (Gift, Brand, Verwundbar, Geschwächt) als kleine Zeichen unter der Plakette, Kniff als Zeichen am Rand (Tooltip wie heute).
- Plaketten überlappen nie, auch bei drei Gegnern und großen Wächtern. Bei Platzmangel rücken sie in der Höhe, nicht in die Szene hinein.
- Nach dem Gegnerzug: nur Leben, keine Absicht (Fix 3).
- **Stumme Gegner** ([06-lovecraft-kern.md](06-lovecraft-kern.md) Abschnitt 5): Die Plakette zeigt nur das Leben. Der Platz für die Absicht ist **nicht da**, kein leerer Kasten, kein Strich, kein Fragezeichen.

## 4. Gegner-Aufstellung

- **Gestaffelt (C1):** Gegner stehen fest auf Bodenreihen der Szene, vorn groß, hinten kleiner und im Nebel. Kein Gegner steht in einer Wand, über einem Abgrund oder schwebt (außer fliegenden Gegnern, die das in ihren Daten haben).
- Dafür braucht jede Szene **Bodenreihen**: je Hintergrund (alle Szenen aller 25 Biome, auch Varianten und Wächter-Szenen) eine Liste von 3 bis 5 Stellplätzen (x, Bodenlinie y, Maßstab). Feld `stell` in der Szene. Ein Haiku-Agent erstellt pro Szene einen Vorschlag aus dem Bild (Bodenfläche erkennen), ein Sonnet-Agent prüft ihn mit Bildschirmfotos von 1, 2 und 3 Gegnern, du siehst dir jeden Kontaktbogen selbst an.
- **Umzingelt** nur für die Kniffe oder Wächter, die das heute schon tun, und mit Abstand zum Rand: kein Gegner näher als 12 % der Breite am Rand, damit die Maus keine weiten Wege hat.
- Gegner überdecken weder den eigenen Balken noch die Karten noch einander so, dass eine Plakette nicht mehr zuzuordnen ist.

## 5. Keine Kamera im Kampf

Die Mausfolge-Parallaxe und jede Kamerabewegung im Kampf werden entfernt. Auch keine Einstellung dafür. Wackeln bei Treffern (Wucht) bleibt, das ist keine Kamera.

## 6. Fahrt nach vorne als Übergang

**Wann:** nach der Wahl des nächsten Ziels auf der Peilkarte und vor dem Laden des nächsten Knotens. Nicht im Kampf, nicht bei Overlays.

**Wie:** Die aktuelle Szene (die Ebenen, aus denen der Hintergrund gebaut ist) fährt etwa 1,2 bis 1,6 Sekunden in die **Weg-Richtung** der Szene: nahe Ebenen werden stärker größer und wandern stärker als ferne, der Boden in Streifen (vorn mehr als hinten), so wie in `saltmoor-kampf-kamera-probe-2.html`. Das ist eine **Fahrt**, kein Zoom auf das flache Bild. Am Ende geht es in einen kurzen Nebel-Übergang über, dann die nächste Szene.

**Weg-Richtung je Szene:** neues Feld `weg_richtung` in jeder Szene (alle Biome, alle Szenen-Varianten):

| Wert | Bedeutung | Bewegung |
|---|---|---|
| `vor` | ein Gang, Weg oder Tunnel führt in die Tiefe des Bildes | geradeaus auf den Fluchtpunkt zu |
| `links` / `rechts` | vorn eine Wand, der Weg geht seitlich weiter | erst eine leichte Drehung (Ebenen verschieben sich gegenläufig), dann schräg zur Seite weg |
| `ab` | der Weg geht nach unten (Treppe, Schacht, Abhang) | nach vorn und leicht nach unten |
| `auf` | nur wo das Bild es zeigt (Leiter, Treppe hinauf) | nach vorn und leicht nach oben |

Jede Szene bekommt ihren Wert und, wo nötig, einen **Zielpunkt** (x, y) im Bild, auf den die Fahrt zuläuft. Ein Haiku-Agent schlägt Werte aus den Bildern vor, du prüfst jeden mit einer Bildfolge (Anfang, Mitte, Ende der Fahrt) und korrigierst. **Keine Szene fährt in eine Wand.**

`FAST`-Modus (Autospieler) überspringt die Fahrt. Einstellung „Übergänge kürzer“ für Spieler, die schneller durchwollen (halbiert die Dauer, schaltet sie nicht ab).

## 7. Peilkarte im Nebel

Ersetzt die „1 aus 3“-Wegwahl als Hauptansicht zwischen den Knoten. Der Aufbau des Akts bleibt: Ebenen aus `run.json` (Akt I bis IV: e1 bis e6 und Wächter, Akt V: Vorraum, Rast, Finale), dieselben Knotenarten an denselben Stellen.

**Erzeugen:** Beim Betreten eines Akts erzeugt `run.js` aus dem Seed den **ganzen Akt als Netz**: je Ebene 2 bis 4 Knoten, Pfade nur zur nächsten Ebene, jeder Knoten hat mindestens einen Ausgang, Pfade kreuzen sich nicht, alle führen zum Wächter. Die Regeln `pool`, `wege`, `mindestens`, `verschiedene`, `einer_von` aus `run.json` gelten je Ebene weiter. Das Netz ist Teil des Speicherstands. Die alte Funktion `genWeg` wird ersetzt, nicht daneben gestellt.

**Ansicht:**

- Von **links nach rechts**. Der aktuelle Knoten links, leuchtend gerahmt. Man sieht **zwei Abschnitte voraus** (die nächsten zwei Ebenen) klar, dahinter **Nebel** mit „UNKARTIERT“.
- Pfade als gestrichelte Linien, gewählte Wege bleiben eingezeichnet, verlorene Wege verblassen.
- Knoten als Rauten mit den Symbolen aus dem Spiel (Kampf, schwerer Kampf, Ereignis, Wandbild, Krämer, Werkstatt, Rast, Fundstelle, Wächter). Drüberfahren zeigt, was der Knoten ist.
- Kopfleiste wie im Kampf: Akt und Titel, Biom kursiv, Gold, Leben, Deck. Darunter oder daneben: das Zeichen und der Name der **Regelbiegung** des Bioms, falls es eine hat.
- **Wandbild-Knoten** heben den Nebel **bis zum Wächter** des Akts, sobald das Wandbild gelesen ist. Damit hat das Wandbild auf der Karte einen Zweck.
- **Pixel-Optik feiner als die Szenen** (Philip: „nicht gröber“): 2 Bildpunkte je Pixel statt 3, gedithert, der Nebel bewegt sich langsam. Hintergrund in der Palette des Bioms.

**Folgen auf der Karte** (aus dem Mockup, je Akt höchstens zwei verschiedene, über den Seed):

- **Abkürzung** (»): ein Pfad, der eine Ebene überspringt und direkt in einen schweren Kampf führt.
- **Brüchiger Gang:** ein Pfad, der einstürzt, wenn man an einer bestimmten Stelle (z. B. der Werkstatt davor) etwas tut. **Hinter dem Nebel ist der Einsturz nicht zu sehen.** Man hört ein Rumpeln (Klang aus den vorhandenen Bausteinen), und erst wenn der Nebel weicht, sieht man den eingestürzten Gang. Vor dem Nebel ist der Gang an einem Riss im Pfad zu erkennen, wenn man genau hinsieht, ohne Warnzeichen.
- **Dunkler Stollen:** Ein Knoten zeigt sein Symbol erst, wenn man direkt davor steht oder nach dem Wandbild. Bis dahin ist die Raute **leer und verschattet**, ohne „?“.
- **Spuren** (Begegnung, [07-begegnungen-meta-wuerze.md](07-begegnungen-meta-wuerze.md)) sitzen ebenfalls auf der Karte.

**Biom-Wahl am Aktanfang** (gibt es seit Auftrag 2): Die beiden Biome werden als zwei kleine Peilkarten-Ausschnitte nebeneinander gezeigt, jeweils mit Name, Kurzbild und **Regelbiegung**, damit man das Deck vorher darauf ausrichten kann.

**Auf die Karte zurück:** Taste **M** und ein Knopf in der Kopfleiste öffnen die Karte jederzeit außerhalb des Kampfes (im Kampf nur lesend).

## 8. Rucksack „Am Körper“

Ersetzt den Rucksackmodus aus Auftrag 2 (Taste R) und die alte Itemleiste außerhalb des Kampfes. Öffnet sich bei Rast, Werkstatt, Krämer, nach einem Fund und mit R. Im Kampf öffnet R ihn nur lesend.

**Aufbau:**

- **Mitte:** die gewählte Figur als **dunkle, einfarbige Silhouette im Nebel**, nur **Randlicht von hinten**, die Beine verschwinden in langsam wabberndem Nebel. Kein 3D-Look, keine Innenzeichnung außer den leuchtenden Augen und den Dingen, die sie am Körper trägt, als dunkle Formen. Links oben Name der Figur, Leben, Ausrede (unverändert aus `jobs.json`).
- **Fächer am Körper,** mit feinen gepunkteten Linien zum Körperteil:
  - **Talismane** als **Reihe** am Hals (bis 4 nebeneinander),
  - **Kleidung** als **2×2-Block** am Leib,
  - **Waffen und Schilde** als **Säule** an der Hand (bis 4 untereinander).
  - Freie Plätze leer, gesperrte Plätze (über `S.slots`, max. `max_slots`) mit **Schloss**. Kerben als kleine **Striche in Stofffarbe** unter dem Item.
- **Rechts:** das gewählte Item mit Namen, Seltenheit, Eigenschaften, seinen Karten (im Kartenstil des HUD). Darunter das **Deck**: Kartenzahl, **Stoff-Balken** (Anteil je Stoff in Stofffarbe), und nach einem Tausch die Änderung: was reinkommt **grün**, was rausfliegt **rot**.
- **Unten:** der Rucksack als Holz-Footer mit den nicht angelegten Items.
- **Bedienung:** Item anklicken, dann einen freien Platz derselben Art oder ein anderes Item zum Tauschen. Passende Ziele leuchten. Ziehen mit der Maus geht auch. Hover über ein Item zeigt die Karten, die es ins Deck bringt (Hover-Vorschau aus Auftrag 2 bleibt).

**Silhouetten für alle 9 Figuren:** Fischer, Friedhofswärter, Pfarrerin, Detektiv, Okkultist, Kneipenschläger, Geologe, Wahrsagerin, Veteran. Je eine Silhouette im Stil von `vorlagen/fischer-figur-silhouette.png`, gebaut mit dem Referenz-Renderer ([docs/spritegen/zielbild/referenz/render.js](../spritegen/zielbild/referenz/render.js)) im monochromen Modus, mit eigener, erkennbarer Form je Figur (Kopfbedeckung, Haltung, Werkzeug). Pipeline, Bewertungsbogen und Note mindestens 4 wie in [docs/auftrag-2/06-ki-bilder.md](../auftrag-2/06-ki-bilder.md). Die Anschlusspunkte der Fächer (Hals, Leib, Hand) stehen je Figur in `jobs.json → koerper`.

## Abnahme Welle 2

Siehe die Meilensteine M2 bis M4 in [03-meilensteine.md](03-meilensteine.md). Für jede Ansicht ein Bildschirmfoto in allen drei Auflösungen, daneben das Foto der Vorlage, und eine Zeile im Protokoll, wo du bewusst von der Vorlage abweichst und warum.
