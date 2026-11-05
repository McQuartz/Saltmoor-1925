# Fortschritt Auftrag 2

Wird vom Agenten geführt. Neueste Einträge oben in jedem Abschnitt.

## Stand

| Meilenstein | Status | Notiz |
|---|---|---|
| M0 Einrichten und Bild-Pipeline | fertig | Windgestalt neu (Note 4), Biom-Paket-Format, Prüfung mit größeren Grenzen |
| M1 Gefühl und UI | fertig | Lebensbalken unten mittig, Meldungszeile, Wucht, Mehrfachtreffer einzeln, Übergang zum Wegklicken, Beute-Sätze, Endbildschirm, Musik-Aufbau |
| M2 Längere Akte | fertig | 6 Ebenen + Wächter je Akt I–IV, Biom-Wahl am Aktanfang, 31 Knoten je vollem Run |
| M3 Deckbau-Kern | fertig | Kerben, Handgriffe, 7 Schlagworte, Belohnung, Ritzen, Schleifen, Umritzen, Verkaufen, Rucksackmodus, Hover-Vorschau, Dev-Reiter Deck |
| M4 Items, Handgriffe, Builds | fertig | 70 Handgriffe, 74 Items (18 Reliquien), 6 Builds mit Beispieldeck und Build-Bot; Builds 30–40 % (Feinabstimmung M8) |
| M5 Pipeline und alte Schwächen | läuft | Neubauten fertig (Mumie, Nachgeher, Ertrunkener, Netzflickerin-Rücken, Tiefling, Nest, alle Note 4); Icons in Arbeit |
| M6 Biome Akt I und II | läuft | Fabrik, Kurhaus, Nachtzug, Kloster, Grotte fertig (alle Note 4); neue Gegner Hafen/Moor/Kapelle in Arbeit |
| M7 Biome Akt III bis V | läuft | Wald, Gezeitenwerk, Walkathedrale, Glasmeer, Ufer, Pforte neu, Finale neu, Gegner Salz/Stadt/Eis in Arbeit; Kern: Kniffe teurer/kopie/takt/voraus, Ergänzungspakete, Vorgänger |
| M8 Ereignisse und Balance | läuft | 15 biomübergreifende Ereignisse, Ereignis-Test (alle Wahlen); Balance folgt, wenn alle Biome stehen |
| M9 Abschluss | offen | |
| Zugabe | offen | |

## Einträge je Meilenstein

### M0 Einrichten und Bild-Pipeline (fertig)

- Branch frisch vom aktuellen `main` (Name von der Sitzung vorgegeben), Draft-PR [McQuartz/Saltmoor-1925#14](https://github.com/McQuartz/Saltmoor-1925/pull/14).
- Bild-Wege: kein Bild-Werkzeug, kein API-Schlüssel in der Sitzung → nur Weg A (selbst per Skript) möglich; ein Vergleich mit Weg B entfällt (siehe Entscheidungen).
- Testgegner **Windgestalt** neu durch die ganze Pipeline aus 06-ki-bilder.md (Konzept in Worten, drei Silhouetten verglichen – alte Säule, „Qualle“ verworfen weil Krake-mit-Maske, „Gestalt“ gewählt –, Licht/Pixel, Animation, Prüfung, im Spiel). Neues Konzept: der Atem aus dem Abgrund in einem Leib aus Binden mit Totenmaske, atmet sichtbar ein (Block, Stärke) und aus (18 Schaden). Schwachstelle fest Wasser statt wechselnd (verständlicher Kampf). Kontaktbogen neben den Favoriten: `bilder/M0/windgestalt-kontakt.png`, im Spiel: `bilder/M0/im-spiel-stadt-waechter.png`. **Note 4** (Silhouette, Licht, Pixel, Konzept, Biom, im Spiel je 4; schwächster Punkt: kastige Schulterlappen).
- Werkzeuge für die Masse: Biom-Pakete (`paket-format.md`), Zonen-Paletten je Datei, `tools/biom-test.js`, Prüfgrenzen für Wächter (160 × 180) und Finale (240 × 220).

### M5 (Teil 1): Neubauten der schwachen Gegner

Neu gebaut (Subagent, Weg A, gleiche IDs): Erbauer-Mumie (hockender Echsenleib in Binden, Menschenmaske vor der Schnauze), Nachgeher (Mensch im Rückwärtsbogen, Kopf hängt kopfüber), Ertrunkener (schwebt an Land, als wäre er noch unter Wasser), Netzflickerin (nur Rücken: knotiger Wirbelgrat, Spinnenknie), Tiefling (flacher Fischkopf ohne Hals, Flossenkamm), Nest (Grashügel mit Warnpflock, steht erst im Angriff auf). Jeder bekommt einen Kniff (Mumie explodiert beim Tod, Nachgeher mischt Abschriften, Ertrunkener löscht Brand, Netzflickerin friert eine Karte ein, Tiefling ruft einen Vetter, Nest verbirgt die Absicht). Bögen: `bilder/M5/vorher-nachher.png`, `silhouetten.png`, `animationen.png`, `im-spiel-*.png`. Konzepte und Noten: `neubauten.md`.

**Meine Prüfung der Bögen:** Mumie, Nachgeher und Ertrunkener sind klar besser lesbar als vorher, das Nest liest sich jetzt als Hügel. Der Tiefling wirkt eher froschartig als fischig, für mich eine knappe 4. Keiner erreicht die Feinheit der Favoriten.

### M2 Längere Akte (fertig)

`run.json`: Akte I–IV mit 6 Ebenen plus Wächter (e1 Kampf/Ereignis, e2 gemischt, e3 Rast/Werkstatt/Krämer, e4 Kampf/schwerer Kampf/Ereignis, e5 gemischt, e6 Rast/Krämer/Werkstatt), Akt V Vorraum, Rast, Finale. Am Anfang jedes Akts wählt man zwischen zwei Biomen (Akt I: Vorliebe der Figur plus eins per Seed); der Code nimmt beliebig viele Biome je Akt und überspringt fehlende. Neue Biome als Pakete (`paket-format.md`). Dev-Reiter „Run“ zeigt Weg und Angebote, Cheats erzwingen jedes Biom. Skalierung auf die längere Strecke und den stärkeren Deckbau angepasst (`balance.json → enemy_scaling`).

**Abnahme:** `node tools/test-run.js`: alle Biome werden angeboten, Vorliebe in Akt I immer dabei, gleicher Seed = gleiches Angebot, 3100 Ebenen nach Regel, 10 volle Runs mit je 31 Knoten (Ziel ≥ 26), jeder endet.

### M3 Deckbau-Kern (fertig)

- **Kerben und Handgriffe:** Items tragen 1–3 Kerben (gewöhnlich 1, selten/Reliquie 2, Werkstatt +1 bis 3). Handgriffe (`data/handgriffe.json`) nehmen die Stoffe ihres Items an; Stammkarten liegen doppelt im Deck, Handgriffe einfach. Grundkarten aus `more-cards` sind durch die Start-Handgriffe Stoßen, Ausweichen, Abwarten, Durchatmen ersetzt; jede Figur startet mit drei angelegten Items (≈ 10 Karten).
- **Schlagworte:** Stärke, Verwundbar, Funke, Kette, Behalten, Opfer, X (dazu Unspielbar für Abschriften und Zittern), 12 Sonderwirkungen, 19 Item-Eigenschaften, 15 Gegner-Kniffe. Alles meldet sich mit Grund im Dev-Modus.
- **Belohnung:** jeder Kampf Gold + Handgriff 1 aus 3 (zwei passend zum Deck, einer frei; Überspringen +10 Gold) + 25 % Item 1 aus 2; schwerer Kampf mehr und selten; Wächter Reliquie 1 aus 3. Ritzen mit Vorschau je Item (Stoff, mögliche Reaktionen), volle Kerbe mit Rückfrage zum Überschreiben. Rahmen nach Seltenheit, Aufdecken nacheinander, Glocke bei Reliquien.
- **Werkstatt:** verschmelzen oder Kerbe dazu oder Schleifen. **Rast:** schlafen oder Schleifen oder Umritzen. **Krämer:** Items kaufen und verkaufen (40 %), 2 Handgriffe, Handgriff entfernen, manchmal eine Reliquie zum Wucherpreis. **Ereignisse:** neue Folgen Handgriff, Schleifen, Kerbe, Umritzen, Item tauschen, Reliquie, Energie auf Dauer; Bedingungen Item/Figur/früheres Ereignis.
- **Rucksackmodus** (Taste R): Ausrüstung, Rucksack, Deck als Liste nach Item, Änderungen grün/rot mit Deckgröße vorher/nachher, erst „Übernehmen“ macht es fest, Verkaufen beim Krämer. **Hover-Vorschau** am Cursor bei Belohnung, Krämer, Fund.
- **Autospieler** versteht Handgriffe (Wert inkl. Gift/Brand über die Züge, ritzt ins Item mit den meisten Reaktionen), **Dev-Reiter „Deck“** (Items, Kerben, Handgriffe, Eigenschaften, Kostenkurve, erkannter Build).

**Abnahme:** `node tools/test-deckbau.js` 13/13 (Start-Handgriffe, Kerben-Grenze, Stoffübernahme, Überschreiben, Kerbe dazu, Schleifen, Funke, Kette, Opfer, X, Stärke, Verwundbar, Behalten). Autospieler-Decks am Ende 19–24 Karten (Ziel ≥ 20 im Schnitt erreicht bei vier von sechs Builds, Rest 19,0–19,6). Bilder `bilder/M3/`: Handgriff-Wahl, Hover am Handgriff, Ritzen, Hover am Item, Rucksackmodus mit Grün/Rot. Vorschau weiter exakt (240 Karten, 0 Abweichungen).

**Einschätzung:** Das Deck wächst jetzt spürbar mit jedem Kampf, und dieselben Handgriffe ergeben je nach Item andere Reaktionen; das trägt den Item-Ansatz. Schwach: Die Ritzen-Liste ist textlastig; das Überschreiben braucht zwei Klicks.

### M4 Items, Handgriffe, Reliquien, Builds (fertig)

Inhalts-Subagent: 70 Handgriffe (je Build 9–10, neutral 12; Kostenkurve 30 % 0, 51 % 1, 13 % 2, 6 % 3/X), 74 Items (44 gewöhnlich, 12 selten, 18 Reliquien), jedes mit Seltenheit, Kerben, Flavor, Preis, Eigenschaft wo es passt; zwei „gut und schlecht“-Items (Kultmaske, Laudanum mit fest eingeritztem Zittern). `docs/auftrag-2/builds.md`: sechs Builds mit Beispieldeck und typischem Zug, Profile in `data/builds.json`. Build-Bots: `node tools/build-bots.js 20 1`.

**Abnahme (Build-Bots, je 20 Seeds, nach Ausreißer-Korrektur):**

| Build | Siege | Ø Tiefe | Ø Deck | Reaktionen/Zug | Niederlagen je Akt I/II/III/IV/V |
|---|---|---|---|---|---|
| Glutnest | 35 % | 23,1 | 21,1 | 2,54 | 1/1/7/2/2 |
| Brackwasser | 30 % | 19,1 | 19,6 | 1,91 | 3/4/6/0/1 |
| Bollwerk | 40 % | 22,0 | 21,4 | 2,06 | 3/1/4/4/0 |
| Aderlass | 40 % | 23,1 | 21,4 | 2,11 | 1/2/6/1/2 |
| Kettenwerk | 30 % | 19,1 | 19,0 | 2,22 | 4/2/6/2/0 |
| Hagel | 35 % | 23,4 | 21,6 | 2,04 | 1/1/5/6/0 |

Allgemeiner Autospieler 30 Seeds: 47 %. **Korrigierte Ausreißer:** Brackwasser 0 % → 30 % (der Autospieler bewertete Gift und Brand nicht über die Züge; Vorschau liefert jetzt Gift/Brand/Verwundbar, Bewertung rechnet den erwarteten Schaden); Funke-Karten mit Kosten 0 auf 1 (sonst wirkt Funke nicht); Build-Bots bevorzugten ihre Karten zu stark (Bonus halbiert); Gegnerleben ×1,25 (Wächter ×1,35), weil der neue Deckbau alle Builds auf 65–95 % hob.

**Einschätzung:** Alle sechs Builds sind spielbar und keiner fällt heraus. Unter dem Ziel 40–60 % liegen sie noch, weil Akt III (Stadt mit der neuen Windgestalt) zu viele Runs beendet; das stimme ich in M8 ab. Die Build-Erkennung ist grob (nur Hagel wird zuverlässig erkannt).

### M1 Gefühl und UI (fertig)

- **Lebensbalken** unten mittig über der Hand, breit, mit Block-Schild links und dem angekündigten Schaden als rotem, pulsierendem Schatten im Balken; Warnzeile darunter. Gegner-Balken stehen unter den Füßen (schon seit Auftrag 1). Kopfzeile nur noch Tiefe, Zug, Ort, Gold, Buch.
- **Meldungszeile** oben mittig: höchstens 2 nebeneinander, nie gestapelt, mindestens 4 s (Hochreaktion, neu entdeckt, Freischaltung 6 s), Warteschlange, gleiche Meldungen zusammengefasst („×3“), Klick zeigt die letzten 20. Werte in `balance.json → meldungen`.
- **Wucht** (`balance.json → wucht`, eigene Treffer ×1,25): Hitstop, Kamera-Ruck, Rückstoß, Zahlengröße; Gegner holen mit dem Angriffs-Sheet aus (330 ms Anlauf), bevor der Schaden kommt.
- **Mehrfachtreffer** einzeln, im Abstand von 120 ms, jeder mit eigenem Klang, eigener Zahl und eigenem Ruck; der letzte etwas wuchtiger. In beide Richtungen.
- **Übergangstext** bleibt stehen, bis man klickt oder eine Taste drückt; der Hinweis erscheint nach 1,5 s. Der Zeitautomat ist raus.
- **Beute-Sätze** je Biom (`biomes.json → beute_saetze`) und Gegner (`foes.json → beute_satz`), nie zweimal derselbe hintereinander. Die alten Biome bekommen ihre Sätze in M5/M6 (bis dahin der alte Satz als Rückfall).
- **Endbildschirm** nach Strand, Bleiben und Umkehren: Figur, Seed, Dauer, Weg als Reihe kleiner Bilder, Tiefe, Kämpfe, Gold verdient/ausgegeben, Schaden ausgeteilt/genommen, höchster Treffer, längste Kette, entdeckte Reaktionen, Build-Archetyp, Todesursache, Deck am Ende, neue Freischaltungen; Knöpfe neuer Abstieg, gleicher Seed, Bild speichern, Titel.
- **Musik:** Bei Wächter und Finale kommen die Layer nacheinander über 6 Takte (`balance.json → musik.boss_aufbau_takte`): erst Grund und Puls, dann die Stimme, zuletzt Tutti.

**Abnahme:** Bilder in `bilder/M1/`: `mehrfach-1/2/3.png` (Schmuggler 3 × 3, drei Einzelbilder), `belohnung.png`, `uebergang-nach-4s.png` (wartet noch), `endschirm.png`. Autospieler im Browser 20 Seeds: 0 Fehler, keine Konsolenfehler (Gewinnrate 75 %, zu leicht; Balance in M8).

**Einschätzung:** Der Kampf liest sich besser, der eigene Balken ist da, wo man hinschaut. Die Meldungszeile ist ruhiger. Schwach: Die Wucht ist im Standbild kaum zu sehen; ob 25 % sich „wuchtiger“ anfühlen, muss Philip spielen. Der Endbildschirm ist textlastig.

## Noten

| Was | Biom | Note | Bild |
|---|---|---|---|
| Windgestalt (Wächter, neu) | Stadt | 4 | [M0](bilder/M0/windgestalt-kontakt.png) |
| Erbauer-Mumie (neu) | Stadt | 4 | [M5](bilder/M5/vorher-nachher.png) |
| Nachgeher (neu) | Eis | 4 | [M5](bilder/M5/vorher-nachher.png) |
| Ertrunkener (neu) | Kapelle | 4 | [M5](bilder/M5/vorher-nachher.png) |
| Netzflickerin (Rücken) | Hafen | 4 | [M5](bilder/M5/vorher-nachher.png) |
| Tiefling (neu) | Hafen | 4 (knapp) | [M5](bilder/M5/vorher-nachher.png) |
| Nest (neu) | Moor | 4 | [M5](bilder/M5/vorher-nachher.png) |
| Der Genesende | Kurhaus | 4 | [M6](bilder/M6/kurhaus/kontakt-neben-favoriten.png) |
| Die Badefrau | Kurhaus | 4 | [M6](bilder/M6/kurhaus/kontakt-neben-favoriten.png) |
| Der Liegende | Kurhaus | 4 | [M6](bilder/M6/kurhaus/kontakt-neben-favoriten.png) |
| Der Kurgast mit Taucherbrille | Kurhaus | 4 (knapp, eher Mensch als fremd) | [M6](bilder/M6/kurhaus/kontakt-neben-favoriten.png) |
| Die Oberschwester (Wächter) | Kurhaus | 4 | [M6](bilder/M6/kurhaus/im-spiel-waechter.png) |
| Hintergrund Kurhaus (3 Varianten, Wächter-Szene) | Kurhaus | 4 | [M6](bilder/M6/kurhaus/hintergrund-varianten.png) |
| Novize | Kloster | 4 (knapp, wenig Binnenform) | [M6](bilder/M6/kloster/kontaktbogen.png) |
| Tintenfrau | Kloster | 4 (knapp) | [M6](bilder/M6/kloster/kontaktbogen.png) |
| Kreuzgangwächter | Kloster | 4 | [M6](bilder/M6/kloster/kontaktbogen.png) |
| Der Leser | Kloster | 4 | [M6](bilder/M6/kloster/kontaktbogen.png) |
| Der Abschreiber (Wächter) | Kloster | 4 | [M6](bilder/M6/kloster/im-spiel-waechter.png) |
| Hintergrund Kloster (3 Varianten, Wächter-Szene) | Kloster | 4 | [M6](bilder/M6/kloster/hintergrund-varianten.png) |
| Der Mitreisende | Nachtzug | 4 | [M6](bilder/M6/nachtzug/kontaktbogen.png) |
| Das Gepäckstück | Nachtzug | 4 | [M6](bilder/M6/nachtzug/kontaktbogen.png) |
| Die Kontrolleurin | Nachtzug | 4 (knapp, Mantelsäule nah am Schmuggler) | [M6](bilder/M6/nachtzug/kontaktbogen.png) |
| Das Schlafwagenkind | Nachtzug | 4 | [M6](bilder/M6/nachtzug/kontaktbogen.png) |
| Der Uhrmacher im Speisewagen (Wächter) | Nachtzug | 4 | [M6](bilder/M6/nachtzug/im-spiel-waechter.png) |
| Hintergrund Nachtzug (3 Varianten, Wächter-Szene) | Nachtzug | 4 (Decken ruhig, Gepäckwagen leer) | [M6](bilder/M6/nachtzug/hintergrund-varianten.png) |
| Die Ausnehmerin | Fabrik | 4 | [M6](bilder/M6/fabrik/kontakt.png) |
| Das Dosenkind | Fabrik | 4 (Arm wie ein Stock) | [M6](bilder/M6/fabrik/kontakt.png) |
| Der Kesselmann | Fabrik | 4 (stärkste Figur des Pakets) | [M6](bilder/M6/fabrik/kontakt.png) |
| Der Kühlhausgast | Fabrik | 4 | [M6](bilder/M6/fabrik/kontakt.png) |
| Die Schicht (Wächter) | Fabrik | 4 (knapp: Masse innen dicht, Lampenschnur unsichtbar) | [M6](bilder/M6/fabrik/im-spiel-waechter.png) |
| Hintergrund Fabrik (3 Varianten, Wächter-Szene) | Fabrik | 4 (Kesselhaus hinter Gegnern unruhig) | [M6](bilder/M6/fabrik/varianten.png) |
| Die Wachshände | Grotte | 4 | [M6](bilder/M6/grotte/kontakt.png) |
| Der Geheilte | Grotte | 4 (starke Silhouette) | [M6](bilder/M6/grotte/kontakt.png) |
| Der Quellwärter | Grotte | 4 (knapp, Körper klein in der Schale) | [M6](bilder/M6/grotte/kontakt.png) |
| Der Bittsteller | Grotte | 4 (Körper eher Masse) | [M6](bilder/M6/grotte/kontakt.png) |
| Die Erhörte (Wächter) | Grotte | 4 | [M6](bilder/M6/grotte/im-spiel-waechter.png) |
| Hintergrund Grotte (3 Varianten, Wächter-Szene) | Grotte | 4 (Madonna flächig, V2 unten leer) | [M6](bilder/M6/grotte/varianten.png) |
| Der Helmtaucher (neu) | Hafen | 4 (Anzug etwas kastig) | [M6](bilder/M6/alte-biome/kontakt-hafen.png) |
| Der Gepfählte (neu) | Moor | 4 | [M6](bilder/M6/alte-biome/kontakt-moor.png) |
| Die Geprüfte (neu) | Kapelle | 4 (starke Silhouette) | [M6](bilder/M6/alte-biome/kontakt-kapelle.png) |
| Der Kirchenvogt (neu) | Kapelle | 4 (Talar große dunkle Fläche) | [M6](bilder/M6/alte-biome/kontakt-kapelle.png) |
| Torfstich (heller) | Moor | 4 knapp: Figuren lesbar, Boden noch sehr dunkel | [M6](bilder/M6/alte-biome/torfstich-vorher-nachher.png) |
| Zahnrad-Wärter | Gezeitenwerk | 4 | [M7](bilder/M7/gezeitenwerk/kontakt-neben-favoriten.png) |
| Kanalaal | Gezeitenwerk | 4 (starke Silhouette) | [M7](bilder/M7/gezeitenwerk/kontakt-neben-favoriten.png) |
| Die Ölerin | Gezeitenwerk | 4 | [M7](bilder/M7/gezeitenwerk/kontakt-neben-favoriten.png) |
| Das Gewicht | Gezeitenwerk | 4 | [M7](bilder/M7/gezeitenwerk/kontakt-neben-favoriten.png) |
| Der Regulator (Wächter) | Gezeitenwerk | im Spiel 3 (dunkel vor dem Hauptrad), in Nacharbeit | [M7](bilder/M7/gezeitenwerk/im-spiel-waechter.png) |
| Hintergrund Gezeitenwerk (3 Varianten, Wächter-Szene) | Gezeitenwerk | 4 (V2 schwächste) | [M7](bilder/M7/gezeitenwerk/hintergrund-varianten.png) |

## Entscheidungen unterwegs

| Datum | Meilenstein | Entscheidung | Grund |
|---|---|---|---|
| 2026-11-05 | M7/M8 | `tools/biom-test.js` spielt die Akte vor dem Biom wirklich (Heilung als Netz, Kämpfe im Vorlauf höchstens 30 Züge); Seeds, die im Vorlauf sterben, zählen nicht | Vorher startete jeder Akt mit dem Startdeck: Akt IV war mit 2/10 kaum schaffbar, obwohl ein echter Run dort ein gewachsenes Deck hat (Hinweis des Walkathedrale-Agenten). Neue Werte je 20 Seeds: Hafen 16, Kapelle 19, Salz 14, Stadt 11, Eis 14/17, Pforte 13/16 |
| 2026-11-04 | M7 | Ansage zeigt die Wucht und die Züge bis zum Schlag („⚔ 14 in 2“) statt „↑ +0“ | Gezeitenwerk meldete die irreführende Anzeige; betrifft alle Gegner mit Ansage |
| 2026-11-04 | M5 | `tools/biom-bogen.js` baut Kontakt- und Silhouetten-Bogen eines Bioms automatisch aus den Spieldaten (auch Pakete, Ergänzungen, `--alle`) | Abnahme „Kontaktbogen automatisch“; vorher schrieb jeder Agent sein eigenes Skript |
| 2026-11-04 | M6/M7 | Besondere Krämer: Tausch (Kerzenfrau, Grotte), Leihe (Bibliothekar, Kloster), Spiegel (Glasmeer) | Die Steckbriefe beschreiben Krämer, die anders handeln; drei kleine Regeln im Kern geben jedem Biom eine eigene Handelsstelle |
| 2026-11-04 | M8 | 11 neue biomübergreifende Ereignisse (zusammen 15); ein Viertel der Ereignisknoten zieht aus diesem Pool (`BAL.ereignis_allgemein`), Ereignisse können als Ganzes eine Bedingung `if` haben | Vorher kamen allgemeine Ereignisse nur, wenn das Biom leer war, also nie; Bedingung für Ereignisse, die sich auf Früheres beziehen (Photograph → Noch einmal der Photograph, Fischer-Netz, Laterne, Beichte) |
| 2026-11-04 | M8 | `tools/test-ereignisse.js` spielt jedes Ereignis mit jeder Wahl einmal durch | Der Autospieler wählt Ereignisse selten; so läuft trotzdem jede Folge einmal |
| 2026-11-04 | M6/M7 | Neue Kniffe `teurer`, `kopie`, `takt`, `voraus` im Kern; der Abschreiber kopiert jetzt deine letzte Karte (und mischt eine Abschrift) | Steckbriefe von Abschreiber, Herz und Voraus brauchten Mechaniken, die es nicht gab; jede mit Test in `tools/test-deckbau.js` |
| 2026-11-04 | M6 | Kniff `heiler` heilt nur Verbündete, nie sich selbst | Ein Heiler, der sich selbst heilt, hielt den Autospieler in einem endlosen Kampf (Grotte, Pfarrerin, Seed 9); laut Paket-Format heilt er Verbündete |
| 2026-11-04 | M6 | Akt-I/II-Wächter der Pakete bleiben 128 × 160, obwohl 160 × 180 erlaubt ist | Die Agenten sahen noch die alte Grenze; die Figuren sind fertig und lesbar, Vergrößern bringt wenig |
| 2026-11-04 | M6 | Uhrmacher ohne „Karten teurer“ und „Absichten in falscher Reihenfolge“, Kerzenfrau ohne Tausch-Krämer | Brauchen neue Kernbausteine; als Kandidaten für die Zugabe notiert, der Tausch läuft vorerst als Ereignis `grotte_tausch` |

## Probleme

- 2026-11-04, M8 Vorarbeit: `tools/balance.js` las den ersten `--set=`-Schalter als Startseed (Seeds `NaN`, alle Messungen mit `--set` waren falsch). Behoben. Neuer Hebel `BAL.enemy_scaling.atk_faktor` (Standard 1). Zwischenmessung, 60 Runs, generischer Bot, noch während Biome entstehen: heute 40 %, 3,6 Züge je Kampf; mit Leben ×1,45, Wächter ×1,4, Angriff ×0,7 sind es 45 % bei 4,4 Zügen. Mehr Gegnerleben allein macht den Run deutlich schwerer, weil Kniffe wie „wächst“ und „ruft“ mit der Zahl der Züge wirken. Übernommen wird erst in M8, wenn alle Pakete fertig sind (die Agenten stimmen gegen den heutigen Stand ab).

## Bericht
