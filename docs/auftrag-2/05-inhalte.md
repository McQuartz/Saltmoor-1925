# Inhalte: Biome, Bosse, Gegner in Masse

Philip: „viele gegnerdesigns, bosse und locations / biome pumpen also echt einfach tonnen davon“, und alles „auf einem Level wie bisher oder besser“. Das ist der **Hauptteil des Budgets** (siehe [03-meilensteine.md](03-meilensteine.md), M4 bis M7).

## 1. Mengen

| Was | Heute | Ziel | davon neu |
|---|---|---|---|
| Biome | 7 | **17** | 10 neue, dazu die Pforte neu |
| Wächter und Bosse | 6 + Finale | **18** | 12 (9 neue Wächter, Windgestalt neu, Finale neu gezeichnet, ein Elite am Ufer) |
| normale Gegner | 16 | **etwa 65** | etwa 50 (je neues Biom 4, alte Biome je auf mindestens 4 auffüllen, schwache neu) |
| Ereignisse | 25 | **etwa 90** | je Biom mindestens 5, dazu 10 biomübergreifende |
| Krämer | 7 | 17 | je Biom einer, mit Ort und Charakter |
| Items | 56 | etwa 70 | siehe [04-deckbau.md](04-deckbau.md) |
| Handgriffe | 0 | etwa 70 | siehe [04-deckbau.md](04-deckbau.md) |

**Menge heißt nicht Schablone.** Jeder Gegner braucht ein eigenes Konzept, eine eigene Silhouette und einen eigenen Kniff im Kampf. Umfärben oder ein Sprite für zwei Gegner gilt **nicht** als neuer Gegner (Varianten a/b eines Gegners sind erlaubt und erwünscht).

## 2. Die fünf Akte mit mehr Wahl

Die fünf Akte bleiben fest ([docs/auftrag/00-briefing.md](../auftrag/00-briefing.md) Abschnitt 1). Neu ist, dass jeder Akt mehrere Biome hat. Am Anfang des Akts wählt man zwischen **zwei** davon (per Seed gezogen, Akt I nach Figur-Vorliebe wie bisher). Jeder Akt bekommt 6 Ebenen plus Wächter statt 3 plus Wächter (Philip: „stages obv zu kurz“). Genauer Aufbau steht in M2.

| Akt | Zeitschicht | Biome (neu fett) |
|---|---|---|
| I Der Einstieg | 1925, Saltmoor und Umland | Hafenviertel, Moorwald, **Die Konservenfabrik**, **Das Kurhaus**, **Der Nachtzug** |
| II Die Kapelle | Glaube, Gotik, Mittelalter | Überflutete Kapelle, **Das Kloster der Abschrift**, **Die Grotte der Gaben** |
| III Die Tiefe | Rom und davor, vor dem Menschen | Salzstollen, Namenlose Stadt, **Der Wald, der nach unten wächst**, **Das Gezeitenwerk** |
| IV Das schwarze Eis | vor dem Leben | Schwarzes Eis, **Die Walkathedrale**, **Das Glasmeer** |
| V Die Pforte | außerhalb der Zeit | Die Pforte (**neu entworfen**), **Das Ufer unten** |

Ein neues Biom bekommt alles, was die alten haben: Eintrag in `biomes.json` (Paletten, Musik, Fundpool, Krämer, Weg-Hinweise, Übergang), Hintergrund mit mindestens 3 Varianten und eigener Wächter-Szene, Gegner, Wächter, Ereignisse, Items, Musik-Färbung.

## 3. Steckbriefe der neuen Biome

Wie bisher: **ein Ort zuerst**, das Fremde kommt durch ein **falsches Detail**, das nie erklärt wird. Keine Klischees ([docs/auftrag/05-hintergruende.md](../auftrag/05-hintergruende.md) Abschnitt 3 gilt). Die Gegner-Ideen sind Vorschläge. Der Agent darf sie ersetzen, wenn sein Konzept stärker ist.

### Akt I

**Die Konservenfabrik** (`fabrik`)
- *Ort:* Fischkonservenfabrik am Rand von Saltmoor, Nachtschicht, Fließbänder, Dampf, Kacheln, Dosen in Türmen.
- *Wahrzeichen:* der Schornstein, aus dem es nach unten raucht.
- *Falsches Detail:* Die Dosen haben keine Etiketten, aber alle sind beschriftet mit dem Datum von morgen.
- *Palette:* Kachelgrün und Rost, Licht aus Natriumlampen (gelb).
- *Krämer:* Die Vorarbeiterin, verkauft aus dem Spind, kennt deinen Namen aus der Stempelkarte.
- *Wächter:* **Die Schicht**: zwölf Arbeiterinnen, die zu einem Körper am Fließband zusammengewachsen sind. Arbeitet im Takt, jeder dritte Zug „Akkord“ (dreimal so schnell). Schwach gegen Feuer (Fett).
- *Gegner-Ideen:* Ausnehmerin (Messerarme, wird stärker, je länger der Kampf), Dosenkind (rollt, klein, explodiert bei Tod in Lake), Der Kesselmann (heizt, gibt Verbündeten Brand-Schutz), Kühlhausgast (friert eine deiner Karten pro Zug ein).
- *Items:* Fischmesser des Akkords, Stempelkarte (Eigenschaft), Lakeeimer, Gummischürze.

**Das Kurhaus** (`kurhaus`)
- *Ort:* Seebad-Sanatorium von 1900 auf der Klippe, Salzwasserbecken, Badekarren, Liegehalle mit Decken.
- *Wahrzeichen:* die Glaskuppel des Wellenbads, beschlagen von innen.
- *Falsches Detail:* Die Patienten werden jeden Tag gesünder, und sie atmen nicht mehr.
- *Palette:* Weiß-Türkis gedämpft, Messing, kaltes Tageslicht durch Milchglas.
- *Krämer:* Der Apotheker, Rezepte in einer Schrift, die er selbst nicht lesen kann.
- *Wächter:* **Die Oberschwester**: übergroß, Haube wie ein Segel, trägt eine Wanne voll stillem Wasser. Heilt alle Gegner, löscht Brand, verschreibt dir „Ruhe“ (Karte ohne Wirkung ins Deck). Schwach gegen Blut.
- *Gegner-Ideen:* Der Genesende (stark geheilt, nimmt keinen Gift-Schaden), Badefrau (zieht dich ins Becken: -1 Karte auf der Hand), Liegender (steht nie auf, schützt andere), Der Kurgast mit Taucherbrille (wechselt seine Schwachstelle jeden Zug).
- *Items:* Badethermometer, Wärmflasche, Kurkarte, Inhalationsmaske.

**Der Nachtzug** (`nachtzug`)
- *Ort:* Ein Zug, der in Saltmoor hält, obwohl Saltmoor keinen Bahnhof hat. Abteile, Speisewagen, Gepäckwagen, draußen nur Schwarz.
- *Wahrzeichen:* die Lok vorne, deren Lampe nach innen leuchtet.
- *Falsches Detail:* Die Fenster zeigen Landschaft, aber immer dieselbe Kurve.
- *Palette:* Mahagoni, Grün der Polster, Messing, Lampenlicht warm und Fenster kalt blau.
- *Krämer:* Der Schaffner, verkauft Fundsachen früherer Fahrgäste, darunter deine.
- *Wächter:* **Der Uhrmacher im Speisewagen**: ein Reisender, der die Zeit des Zugs aufzieht. Er dreht deine Züge zurück (nimmt deinen letzten Block), macht deine Karten teurer und seine Absichten in falscher Reihenfolge. Schwach gegen Eisen.
- *Gegner-Ideen:* Der Mitreisende (sitzt, bis du ihn angreifst, dann viel zu groß), Gepäckstück (Koffer mit Beinen, schluckt eine Karte und gibt sie bei Tod zurück), Die Kontrolleurin (bestraft, wenn du mehr als 3 Karten spielst), Schlafwagenkind (ruft im Schlaf Verstärkung).
- *Items:* Fahrkartenzange, Taschenuhr des Schaffners (Eigenschaft „1 Energie bleibt“), Reiseplaid, Gepäckriemen.

### Akt II

**Das Kloster der Abschrift** (`kloster`)
- *Ort:* Benediktiner-Skriptorium auf einer Insel im Watt, Pulte, Tintenhörner, Kreuzgang mit Säulen.
- *Wahrzeichen:* das Buch im Kreuzgang, so groß wie eine Kirche, aufgeschlagen.
- *Falsches Detail:* Die Mönche schreiben dasselbe Buch ab, und jede Abschrift ist ein Wort länger.
- *Palette:* Pergament, Eisengallustinte, Kerzenocker.
- *Krämer:* Der Bibliothekar, verleiht statt zu verkaufen (Item für einen Akt, dann ist es weg).
- *Wächter:* **Der Abschreiber**: Mönch, dessen Hand nie aufhört. Kopiert deine letzte Karte und spielt sie gegen dich, mischt „Abschrift“-Karten (unspielbar) in dein Deck. Schwach gegen Feuer.
- *Gegner-Ideen:* Novize mit zugenähten Augen (trifft nur, wenn du keine Karte spielst), Die Tintenfrau (Gift aus Tinte), Kreuzgangwächter (Säule, die läuft, viel Block), Der Leser (je mehr Karten du ziehst, desto stärker).
- *Items:* Federkiel, Tintenfass, Gebetsriemen, Siegel des Abts.

**Die Grotte der Gaben** (`grotte`)
- *Ort:* Wallfahrtsgrotte in der Steilküste, Quelle, Votivgaben aus Wachs (Hände, Augen, Herzen), Krücken an der Wand, Kerzen zu tausenden.
- *Wahrzeichen:* die Madonna aus Tropfstein, die zur Wand blickt.
- *Falsches Detail:* Die Wachsgaben sind warm und sie werden mehr, obwohl keiner mehr kommt.
- *Palette:* Wachsgelb und Kerzenrot auf nassem Schiefer.
- *Krämer:* Die Kerzenfrau, tauscht Gaben gegen Gaben (Item gegen Item statt Gold).
- *Wächter:* **Die Erhörte**: eine Pilgerin, deren Gebet erhört wurde, ganz und gar. Aus Wachs, schmilzt bei Feuer, wird dabei aber schneller. Schwach gegen Salz.
- *Gegner-Ideen:* Wachshand (viele kleine, greifen an Rand der Hand), Der Geheilte (läuft ohne Krücke, aber auf allen vieren), Quellgänger (heilt aus der Quelle, wenn er unter 50 % fällt), Bittsteller (gibt dir etwas, wenn du ihn verschonst).
- *Items:* Votivherz, Pilgerstab, Quellwasser, Wachsauge.

### Akt III

**Der Wald, der nach unten wächst** (`wald`)
- *Ort:* versteinerter Urwald in einer Höhle, Stämme so dick wie Häuser, die Kronen unten, die Wurzeln an der Decke.
- *Wahrzeichen:* ein Baum, durch den ein römischer Weg führt.
- *Falsches Detail:* Die Jahresringe zählen rückwärts.
- *Palette:* Bernstein und Steingrau, Licht aus Harz.
- *Krämer:* Ein Köhler, der seit Jahrhunderten versucht, Stein zu verkohlen.
- *Wächter:* **Der Wurzelstock**: ein Gesicht in der Wurzel, alt wie der Wald, das Arme aus Ästen herunterlässt. Wächst jeden Zug um einen Arm. Schwach gegen Feuer, aber Brand macht ihn wütend (Stärke).
- *Gegner-Ideen:* Harzfang (klebt eine Karte fest: Behalten erzwungen), Steinhirsch (Geweih als Dornen), Der Holzfäller der Legion (römisch, Axt, Verwundbar), Bernsteinlarve (Gift ist ihm Nahrung).
- *Items:* Harzklumpen, Legionsaxt, Bernstein mit Fliege, Köhlerhandschuh.

**Das Gezeitenwerk** (`gezeitenwerk`)
- *Ort:* eine Maschine aus grüner Bronze, älter als Rom, die Ebbe und Flut macht. Zahnräder so groß wie Häfen, Wasser in Kanälen.
- *Wahrzeichen:* das Hauptrad, das sich einmal pro Stunde um einen Zahn dreht.
- *Falsches Detail:* Die Maschine ist für Hände mit sieben Fingern gebaut, und es gibt Fingerabdrücke.
- *Palette:* Grünspan, nasses Schwarz, Lichtpunkte aus Phosphor.
- *Krämer:* Ein Ingenieur von 1880, der hier „nur kurz“ etwas nachsehen wollte.
- *Wächter:* **Der Regulator**: Pendel mit Körper, schwingt zwischen zwei Tiefenreihen hin und her, trifft je nach Seite anders, Schwachstelle wechselt mit dem Takt (Wasser ↔ Eisen). Ideal für den Musiktakt.
- *Gegner-Ideen:* Zahnrad-Wärter (Dornen), Kanalaal (Gift-immun), Ölerin (repariert Verbündete), Das Gewicht (tut nichts, fällt dann, sehr viel Schaden mit Ansage).
- *Items:* Siebenfinger-Schlüssel, Bronzezahn, Gezeitenrad (Reliquie), Öllappen.

### Akt IV

**Die Walkathedrale** (`walkathedrale`)
- *Ort:* das Gerippe eines Wals so groß wie ein Berg, im Eis eingeschlossen. Man geht durch die Rippen wie durch ein Kirchenschiff.
- *Wahrzeichen:* das Herz, ein dunkler Raum, in dem etwas schlägt, sehr langsam.
- *Falsches Detail:* Das Skelett ist noch nicht fertig, es wächst nach innen.
- *Palette:* Knochenweiß in Blauschwarz, Glimmen aus dem Mark.
- *Krämer:* Ein Walfänger, der den Wal gefunden hat und ihm jetzt dient.
- *Wächter:* **Das Herz**: schlägt im Takt der Musik. Jeder Schlag gibt den Gegnern Schutz. Zwischen den Schlägen verwundbar. Schwach gegen Blut.
- *Gegner-Ideen:* Rippenkriecher, Walfänger-Echo (Harpune, zieht dich: Verwundbar), Markfresser (wird mit jedem Treffer größer), Seepocken-Mensch (Dornen).
- *Items:* Fischbein-Korsett, Tranlampe, Walzahn-Messer, Harpune des Echos.

**Das Glasmeer** (`glasmeer`)
- *Ort:* eine Ebene aus schwarzem Glas unter dem Eis, glatt bis zum Horizont, darüber Eis wie ein Himmel.
- *Wahrzeichen:* eine Gestalt unter dem Glas, die man nur im Spiegelbild sieht.
- *Falsches Detail:* Dein Spiegelbild ist einen Schritt voraus.
- *Palette:* Schwarzglas, Polarlicht-Grün als einziges Licht von unten.
- *Krämer:* Dein Spiegelbild. Es verkauft dieselben Items wie der letzte Krämer, nur spiegelverkehrt (Stoffe getauscht).
- *Wächter:* **Der Voraus**: dein Spiegelbild in deiner Figur, spielt deine Karten aus deinem Deck einen Zug vor dir. Schwach gegen den Stoff, den du am wenigsten spielst.
- *Gegner-Ideen:* Glasschwimmer (unverwundbar außer im Zug nach deinem Angriff), Splitterchor (wenn einer stirbt, teilt er sich), Der Vorhergehende (kündigt zwei Absichten an, macht eine), Schwarzglas-Fisch (spiegelt Brand zurück).
- *Items:* Glasscherbe, Polarlicht im Glas, Spiegelscherbe, Schneebrille.

### Akt V

**Die Pforte** (`pforte`, neu entworfen)
- Mo und sein Agent fanden die bisherige Pforte zu sehr nach Science-Fiction. Neu: **kein Tor aus Licht**, sondern ein Ort, den man kennt, der falsch ist. Vorschlag: Ein Hafen wie im Akt I, nur unten, gespiegelt, die Laternen brennen schwarz, das Wasser steht als Wand. Die Pforte ist der Punkt, an dem die Wand sich öffnet.
- *Finale:* „Das, was ruft“ bleibt als Konzept (König → Schlund → Auge), wird aber in der neuen Pipeline neu gezeichnet und lesbarer. Leichter abstimmen (Pforte verursacht heute über 40 % der Niederlagen, Ziel höchstens 35 %).

**Das Ufer unten** (`ufer`)
- *Ort:* ein Strand unter der Erde, mit dem Sand vom Anfang. Die Wellen kommen von oben.
- *Falsches Detail:* Fußspuren am Strand, deine, aber sie gehen ins Wasser hinein und kommen nicht zurück.
- *Elite im Vorraum:* **Der, der vor dir kam**: die Figur deines letzten verlorenen Runs (aus `localStorage`, sonst eine zufällige), mit seinen Items. Ein Wiedersehen, das weh tut.
- Führt zum selben Finale wie die Pforte.

## 4. Ergänzungen für die alten Biome

- **Hafen, Moor, Salz** je mindestens 1 neuer Gegner, **Kapelle, Stadt, Eis** je mindestens 2 neue, damit jedes Biom 4 normale Gegner hat.
- **Schwach laut Mos Bericht, neu machen:** Erbauer-Mumie, Nachgeher, Ertrunkener, Netzflickerin-Rückseite (die Favoritin bleibt, nur besser), Moor-Torfstich zu dunkel.
- **Der Wind, der Gestalt hat** (Philip: „weirder gegner, der ist leider net so geil“): neu entwerfen. Das Motiv darf bleiben (Atem aus dem Abgrund), braucht aber eine klare Silhouette und einen Kampf, den man versteht. Wenn ein anderes Konzept für den Wächter der Stadt stärker ist, ersetzen.

## 5. Kniffe für Gegner

Jeder Gegner hat **einen** Kniff im Kampf, der zu seinem Konzept passt und einen Build herausfordert. Das Feld `kniff` in `foes.json` mit Grund (`why`) für den Dev-Modus. Auswahl (der Agent darf neue erfinden, wenn sie wenig System brauchen):

| Kniff | Wirkung | fordert |
|---|---|---|
| Dornen n | n Schaden zurück je Treffer | Hagel |
| Löschen | entfernt Brand am Zugende | Glutnest |
| Rein | Gift wirkt nicht oder heilt ihn | Brackwasser |
| Brecher | zerbricht deinen Block | Bollwerk |
| Kleinvieh | viele Treffer mit wenig Schaden | Aderlass |
| Abschrift | mischt unspielbare Karten in dein Deck | Kettenwerk |
| Wächst | jeden Zug +2 Stärke | lange Kämpfe |
| Schützer | gibt Verbündeten Block | Zielwahl |
| Ruf | holt Verstärkung | Flächenschaden |
| Wechsel | Schwachstelle wechselt | Stoff-Vielfalt |
| Ansage | lädt 2 Züge, dann ein großer Schlag | Block-Planung |
| Nachlass | tut etwas bei Tod (explodiert, teilt sich, gibt Item) | Reihenfolge |
| Verborgen | Absicht ist nur halb sichtbar | Vorsicht |

## 6. Ereignisse

- **Mindestens 5 je Biom**, dazu 10 biomübergreifende. Jedes ist eine kleine Szene **aus genau diesem Ort** (Philip: „thematisch eingeflochten in die welt“), mit Bildbeschreibung, Text im Ton der Welt und 2 bis 3 Wahlen mit Preis und Folge.
- Neue Folgen aus [04-deckbau.md](04-deckbau.md): Handgriff lernen, Schleifen, Kerbe dazu, Handgriff umritzen, Item tauschen, Item verkaufen, Reliquie gegen hohen Preis, Energie auf Dauer (sehr selten).
- Ein Drittel der Ereignisse bezieht sich auf etwas, das im Run schon passiert ist (Figur, ein früheres Ereignis, ein Item im Rucksack). Das macht die Welt lebendig.
- Höchstens 1 Ereignis pro Akt mit `stummfilm: true`.

## 7. Arbeitsweise für die Masse

Für jedes Biom in dieser Reihenfolge, als ein Paket mit einem Commit pro Schritt:

1. **Konzept** in `docs/auftrag-2/gegner-2.md` und `docs/auftrag-2/biome-2.md`: Ort, Komposition des Hintergrunds in Worten, jeder Gegner mit Motiv, Wer war er, Was ist falsch, Silhouette in einem Satz, Kniff, Muster, Schwachstelle mit Grund, Stimme in der Musik.
2. **Bilder** nach [06-ki-bilder.md](06-ki-bilder.md): Gegner, Wächter, Item-Icons, Hintergrund.
3. **Daten**: `biomes.json`, `foes.json`, `events.json`, `items.json`, Handgriffe.
4. **Prüfen**: Regelprüfung der Sprites, Kontaktbogen neben den Favoriten, Bildschirmfoto im Kampf, Autospieler 10 Seeds nur in diesem Biom (Dev-Sprung).
5. **Ehrliche Note** 1 bis 5 je Gegner und Hintergrund in `fortschritt.md`. Alles unter 4 wird überarbeitet, bevor das nächste Biom beginnt.
