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
| M5 Pipeline und alte Schwächen | fertig | Neubauten fertig (Mumie, Nachgeher, Ertrunkener, Netzflickerin-Rücken, Tiefling, Nest, alle Note 4); Icons in Arbeit |
| M6 Biome Akt I und II | fertig | Fabrik, Kurhaus, Nachtzug, Kloster, Grotte (alle Note 4); neue Gegner Hafen, Moor, Kapelle; Torfstich heller |
| M7 Biome Akt III bis V | fertig | Wald, Gezeitenwerk (Akt III), Walkathedrale, Glasmeer (Akt IV), Ufer unten, Pforte neu, Finale neu (Akt V); neue Gegner Salz, Stadt, Eis; alle Noten 4. Kern: Kniffe teurer/kopie/takt/voraus/verborgen, Pendel, Tausch-/Leih-/Spiegel-Krämer, Vorgänger, Ergänzungspakete |
| M8 Ereignisse und Balance | fertig | ≥5 Ereignisse je Biom, 15 biomübergreifende, Test aller Wahlen; Builds 44–72 % (Ø 59 %), generischer Bot 65 %, kein Akt über 35 % der Niederlagen; Kampf Ø 4,1–4,5 Züge |
| M9 Abschluss | fertig | Geklickter Run (40 Stationen), Galerie und Artboard erweitert, Bericht unten |
| Zugabe | läuft | Punkte 1–4 der Liste erledigt, dazu drei weitere Biome: Waisenhaus am Deich (II), Funkstation am Pol (IV), Die Waage am Grund (V, mit Elite und Finale-Szene). Jetzt 24 Biome, alle Note 4; alle 151 Ereignisse mit Bild; 8 Builds 40–62 %; Akt V mit Ereignis-Knoten |

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

### M8 Ereignisse und Balance (fertig)

**Ereignisse:** jedes Biom hat mindestens 5 (alte Biome 5–6 mit den Ergänzungspaketen, neue 6–7), dazu 15 biomübergreifende; ein Viertel der Ereignisknoten zieht aus dem allgemeinen Pool. Ein gutes Drittel bezieht sich über `if` auf Früheres (Figur, Item, gesehenes Ereignis). `node tools/test-ereignisse.js` spielt jede Wahl jedes Ereignisses einmal: 0 Fehler.

**Balance, je 50 Seeds (Build-Bots) bzw. 100 Seeds (generischer Bot), Stand nach M8:**

| Build | Siege | Ø Tiefe | Ø Deck am Ende | Reaktionen/Zug | Niederlagen je Akt I/II/III/IV/V |
|---|---|---|---|---|---|
| Glutnest | 64 % | 29,4 | 22,7 | 2,83 | 0/0/4/4/10 |
| Brackwasser | 44 % | 27,1 | 22,1 | 2,20 | 0/0/12/8/8 |
| Bollwerk | 58 % | 28,9 | 23,0 | 2,28 | 0/2/2/10/7 |
| Aderlass | 72 % | 29,0 | 23,3 | 2,53 | 0/1/3/8/2 |
| Kettenwerk | 62 % | 28,2 | 22,4 | 2,89 | 1/1/5/4/8 |
| Hagel | 52 % | 28,3 | 22,6 | 2,27 | 0/0/6/9/9 |
| **Generischer Bot (100 Seeds)** | **65 %** | 27,8 | – | – | 3/3/9/10/10 |

- Niederlagen über alle Builds je Akt: I 1 %, II 3 %, III 26 %, IV 35 %, V 35 % (124 Niederlagen). Generischer Bot: I 9 %, II 9 %, III 26 %, IV 29 %, V 29 %.
- Niederlagen je Biom (generischer Bot, 100 Seeds): Ufer 8, Wald 3, Stadt 4, Walkathedrale 4, Glasmeer 3, Eis 3, Pforte 2, Hafen 2, Kloster 2, je 1 Salz, Moor, Grotte, Gezeitenwerk.
- Ø Züge je Kampf 4,1–4,5 (vorher 3,4–3,6), Finale Ø etwa 10 Züge.

**Was geändert wurde (der Reihe nach, jeweils gemessen):**
1. Gerufene Gegner rufen nicht weiter (Tiefling-Kette beim Lotsen; Hafen 23 % → 7 % der Niederlagen).
2. Tiefenzuschlag +1 Angriff alle **5** statt 3 Tiefen. Mit dem neuen Akt-Inhalt bekam in Akt IV jeder einzelne Treffer +7, das bestrafte Mehrfachangriffe und hielt die Builds bei 16–34 %. Gemessen: alle 3 → Ø 20 %, alle 4 → 33 %, alle 5 → 42 % (20 Seeds je Build).
3. Finale `ruft` 280 → 200 Leben, Augen ohne Tiefenzuschlag (`ohne_tiefe`, eigens ausgelegt mit 20 Leben) und Schutz 6 → 3: Akt V verursachte 45 % der Niederlagen, alle im Finale bei fast vollem Leben.
4. Mumie (3×2, 8) und Bote (3×3) leicht entschärft: Akt III lag bei 39 %.

**Ziele und Begründung, wo nicht ganz erreicht:**
- Builds 40–60 %: vier von sechs im Ziel, Kettenwerk mit 62 % knapp darüber, **Aderlass 72 %** darüber. Aderlass wird nur in der Hälfte der Runs als Build erkannt; sein Bot gewinnt eher über allgemein gute Karten als über den Blut-Plan. Lebensraub und Abbinden zu senken änderte nichts (gemessen), darum bleibt es so; bei 50 Seeds schwankt eine Rate um etwa ±7 Punkte.
- Kein Akt über 35 %: Akt IV und V liegen über alle Builds genau an der Grenze (35 %), beim generischen Bot bei 29 %. Das Finale ist absichtlich der härteste Einzelkampf.
- Kampf 4–8 Züge: Ø 4,1–4,5, also am unteren Rand. Mehr Gegnerleben machte den Run sofort deutlich schwerer (Kniffe wirken je Zug); ich habe die Länge darum nicht weiter gestreckt.
- Die Wahrsagerin gewinnt am seltensten (5 von 10), der Veteran am häufigsten (10 von 10); beide bleiben vorerst so.

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
| Der Regulator (Wächter) | Gezeitenwerk | 4 (nach Nacharbeit: Wasserwand hinter ihm, mehr Randlicht; schwingt als Pendel zwischen zwei Reihen) | [M7](bilder/M7/gezeitenwerk/im-spiel-waechter.png) |
| Hintergrund Gezeitenwerk (3 Varianten, Wächter-Szene) | Gezeitenwerk | 4 (V2 schwächste) | [M7](bilder/M7/gezeitenwerk/hintergrund-varianten.png) |
| Der Rippenkriecher | Walkathedrale | 4 (Mann darunter eher Masse) | [M7](bilder/M7/walkathedrale/kontaktbogen.png) |
| Das Walfänger-Echo | Walkathedrale | 4 (Leine in die Brust kaum zu sehen) | [M7](bilder/M7/walkathedrale/kontaktbogen.png) |
| Der Markfresser | Walkathedrale | 4 (dritter Entwurf) | [M7](bilder/M7/walkathedrale/kontaktbogen.png) |
| Der Seepockenmann | Walkathedrale | 4 | [M7](bilder/M7/walkathedrale/kontaktbogen.png) |
| Das Herz (Wächter) | Walkathedrale | 4 (Idle bewegt sich wenig) | [M7](bilder/M7/walkathedrale/im-spiel-waechter.png) |
| Hintergrund Walkathedrale (3 Varianten, Herzkammer) | Walkathedrale | 4 | [M7](bilder/M7/walkathedrale/hintergrund-varianten.png) |
| Der Glasschwimmer | Glasmeer | 4 (einziger liegender Gegner) | [M7](bilder/M7/glasmeer/kontakt.png) |
| Der Splitterchor | Glasmeer | 4 | [M7](bilder/M7/glasmeer/kontakt.png) |
| Der Vorhergehende | Glasmeer | 4 (Anorak dunkel, Spiegelbild klein) | [M7](bilder/M7/glasmeer/kontakt.png) |
| Der Leithund | Glasmeer | 4 | [M7](bilder/M7/glasmeer/kontakt.png) |
| Der Voraus (Wächter) | Glasmeer | 4 (stärkste Figur des Pakets) | [M7](bilder/M7/glasmeer/im-spiel-waechter.png) |
| Hintergrund Glasmeer (3 Varianten, Spiegelwand) | Glasmeer | 4 (Bruchkante sehr grün) | [M7](bilder/M7/glasmeer/varianten.png) |
| Der Holzfäller der Legion | Wald | 4 (Jahresringe im Gesicht erst nah sichtbar) | [M7](bilder/M7/wald/kontakt-neben-favoriten.png) |
| Der Steinhirsch | Wald | 4 | [M7](bilder/M7/wald/kontakt-neben-favoriten.png) |
| Der Harzfang | Wald | 4 | [M7](bilder/M7/wald/kontakt-neben-favoriten.png) |
| Die Bernsteinlarve | Wald | 4 | [M7](bilder/M7/wald/kontakt-neben-favoriten.png) |
| Der Wurzelstock (Wächter, 3 Phasen) | Wald | 4 knapp: Kopf geht oben im Geäst unter, Gesicht und Augen tragen | [M7](bilder/M7/wald/im-spiel-waechter.png) |
| Hintergrund Wald (3 Varianten, Wurzelgewölbe) | Wald | 4 | [M7](bilder/M7/wald/hintergrund-varianten.png) |
| Der, der vor dir kam (Elite) | Ufer | 4 (unterer Mantel dunkel) | [M7](bilder/M7/ufer/im-spiel-vorraum-elite.png) |
| Hintergrund Ufer (3 Varianten, Finale, Rast, Ankunft) | Ufer | 4 | [M7](bilder/M7/ufer/varianten.png) |
| Das, was ruft: König (Phase 1, neu) | Pforte | 4 | [M7](bilder/M7/pforte/nachher-finale-p1.png) |
| Das, was ruft: Schlund (Phase 2, neu) | Pforte | 4 knapp (Flügelfalten regelmäßig, weniger Kontrast) | [M7](bilder/M7/pforte/nachher-finale-p2.png) |
| Das, was ruft: Auge (Phase 3, neu) | Pforte | 4 | [M7](bilder/M7/pforte/nachher-finale-p3-augen.png) |
| Augen im Rand (Laternen, neu) | Pforte | 4 | [M7](bilder/M7/pforte/nachher-finale-p3-augen.png) |
| Hintergrund Pforte neu (Hafen unten, Finale, Ankunft) | Pforte | 4 knapp (einfarbig, Fassaden flach) | [M7](bilder/M7/pforte/nachher-szenen.png) |
| Der Mann im Salz (neu) | Salz | 4 (Rumpf dunkel) | [M7](bilder/M7/alte-biome/salz-bogen.png) |
| Der Vermesser (neu) | Stadt | 4 (Varianten ähnlich) | [M7](bilder/M7/alte-biome/stadt-bogen.png) |
| Der aus dem Relief (neu) | Stadt | 4 (stärkstes Bild der Ergänzungen) | [M7](bilder/M7/alte-biome/stadt-bogen.png) |
| Der Fahnenträger (neu) | Eis | 4 | [M7](bilder/M7/alte-biome/eis-bogen.png) |
| Die Seelilie (neu) | Eis | 4 (starke Silhouette) | [M7](bilder/M7/alte-biome/eis-bogen.png) |
| Item-Icons (125) | alle | 4 (alle; zweite Runde für 13, knapp: Trauerschleier, Knotenschnur bei 32 px) | [M5](bilder/M5/icons.png) |
| Handgriff-Bilder (70) | alle | 4 (alle; zweite Runde: große Hand plus Gegenstand, mehr Licht; jetzt auch in der Handgriff-Wahl zu sehen) | [M5](bilder/M5/handgriffe.png) |
| Leuchtturmhof: Lampenputzer, Rückwärtsmöwe, Der aus dem Strahl, Fensterzählerin (neu) | Leuchtturm | 4 (Möwe liest sich erst im Angriff rückwärts; Strahlgänger stärkste Silhouette) | [Zugabe](bilder/Zugabe/leuchtturm/leuchtturm-bogen.png) |
| Die Linse (Wächter, neu) | Leuchtturm | 4 (im Spiel klar vor warmem Lichthof) | [Zugabe](bilder/Zugabe/leuchtturm/im-spiel-waechter.png) |
| Hintergrund Leuchtturmhof (Hof, Klippe, Turmfuß, Laterne) | Leuchtturm | 4 (Klippe die schwächste Variante) | [Zugabe](bilder/Zugabe/leuchtturm/hintergrund-varianten.png) |
| Glockengießerei: Gießer, Formerin, Klöppel, Gussnaht (neu) | Glockengießerei | 4 (Gussnaht knapp, Kinderhälfte klein) | [Zugabe](bilder/Zugabe/glockengiesserei/glockengiesserei-bogen.png) |
| Die Ungetaufte (Wächter, neu) | Glockengießerei | 4 (vor dem glühenden Ofenmaul sehr gut lesbar) | [Zugabe](bilder/Zugabe/glockengiesserei/im-spiel-waechter.png) |
| Hintergrund Glockengießerei (Gießhalle, Glockenstuhl, Formenkammer, Ofen) | Glockengießerei | 4 | [Zugabe](bilder/Zugabe/glockengiesserei/hintergrund-varianten.png) |
| Ziegelgruben: Brennmeister, Ziegelträger, Stempel, Lehmhund (neu) | Ziegelgruben | 4 (Ziegelträger stärkste Silhouette; Körper innen wenig gegliedert) | [Zugabe](bilder/Zugabe/ziegelgruben/ziegelgruben-bogen.png) |
| Der Brennofen, zwei Phasen (Wächter, neu) | Ziegelgruben | 4 (Weißglut-Gesicht im Feuerloch stark) | [Zugabe](bilder/Zugabe/ziegelgruben/im-spiel-waechter-weissglut.png) |
| Hintergrund Ziegelgruben (Ringofen, Lehmgrube, Kammer, Aschewand) | Ziegelgruben | 4 (Lehmgrube die schwächste) | [Zugabe](bilder/Zugabe/ziegelgruben/hintergrund-varianten.png) |
| Mond: Astronom, Kraterbewohner, Mondmotte, Gezogene (neu) | Mond | 4 (Mondmotte stärkste; Gezogene: Strang liest sich als Seil) | [Zugabe](bilder/Zugabe/mond/mond-bogen.png) |
| Die Rückseite, drei Phasen (Wächter, neu) | Mond | 4 (Augen-Krater öffnen sich je Phase, auch am Boden) | [Zugabe](bilder/Zugabe/mond/im-spiel-waechter-p3.png) |
| Hintergrund Mond (Abstieg, Ebene, Krater, Lichthof) | Mond | 4 (Krater gleichmäßig wie Höhenlinien; Kampfbild etwas unruhig) | [Zugabe](bilder/Zugabe/mond/hintergrund-varianten.png) |
| Funkstation: Funker, Telegrafistin, Mastkletterer, Rauschen (neu) | Funkstation | 4 (nach Rückmeldung: kaltes Randlicht statt Sepia, im Kampf vorher 3,5) | [Zugabe](bilder/Zugabe/funkstation/im-spiel-kampf-alle-vier.png) |
| Der Sender, zwei Phasen, Funkstille unverwundbar (Wächter, neu) | Funkstation | 4 (vor heller Fensterwand klar) | [Zugabe](bilder/Zugabe/funkstation/im-spiel-waechter-p2.png) |
| Hintergrund Funkstation (Mast, Funkraum, Eisloch, Senderaum) + 6 Ereignisbilder | Funkstation | 4 (Funkraum jetzt karger, dafür ruhig hinter den Gegnern) | [Zugabe](bilder/Zugabe/funkstation/hintergrund-varianten.png) |
| Waisenhaus: Nachtschwester, Turnlehrer, Zugedecktes, Zwillinge (neu) | Waisenhaus | 4 (nach Rückmeldung: warmes rotes Randlicht statt Kalkweiß, im Kampf vorher 3,5) | [Zugabe](bilder/Zugabe/waisenhaus/im-spiel-kampf-alle-vier.png) |
| Die Heimleiterin mit der Kinderreihe (Wächter, neu) | Waisenhaus | 4 (dunkel vor hellem Bogenfenster) | [Zugabe](bilder/Zugabe/waisenhaus/im-spiel-waechter.png) |
| Hintergrund Waisenhaus (Schlafsaal, Flur der Nummern, Turnsaal, Halle) + 6 Ereignisbilder | Waisenhaus | 4 | [Zugabe](bilder/Zugabe/waisenhaus/hintergrund-varianten.png) |
| Waage am Grund: Schlagbaum, Schreiber, Tarierte, Warteschlange (neu) | Waage | 4 (im Kampf gut lesbar, goldenes Randlicht vor grünem Wasserlicht) | [Zugabe](bilder/Zugabe/waage/im-spiel-kampf.png) |
| Der Oberzöllner (Elite Akt V, neu) | Waage | 4 (Waage auf dem Kopf, ruft die Beamten) | [Zugabe](bilder/Zugabe/waage/im-spiel-elite-ruft.png) |
| Hintergrund Waage (Halle, Schalter, Unter der Schale, Finale, Ankunft) + 6 Ereignisbilder | Waage | 4 (Finale: türkiser Boss vor hellem Skalenbogen stark; Rast ohne eigene Komposition) | [Zugabe](bilder/Zugabe/waage/im-spiel-finale.png) |
| Reliquien Ballast und Kollekte (10), Bleigürtel, Geldkatze, Handgriffe Beschweren, Münzwurf (neu) | alle | 4 (knapp: Ballaststein schlichtes Oval, Fährgeld erinnert an Mond, Hand bei Beschweren krallig) | [Zugabe](bilder/Zugabe/reliquien/kontaktbogen.png) |
| Ereignisbilder Charge 1: 15 biomübergreifende, 6 Hafen (neu) | alle, Hafen | 4 (Kreidezeichen eher grafisch; Hafen etwas gleichförmig nachtblau) | [Zugabe](bilder/Zugabe/ereignisse/kontakt-1.png) |
| Ereignisbilder Akt I: Moor 5, Fabrik 7, Kurhaus 6, Nachtzug 7, Leuchtturm 7 (neu) | Akt I | 4 (selbst geprüft; stark: Kühlhaus, Kontrolle, Gedeck; knapp: Kurve, Lupe) | [Zugabe](bilder/Zugabe/ereignisse/kontakt-2-fabrik.png) |
| Ereignisbilder Akt II: Kapelle 6, Kloster 6, Grotte 7, Glockengießerei 6 (neu) | Akt II | 4 (selbst geprüft; 7 Bilder in zwei Runden überarbeitet; knapp: Stimmen, Taufe) | [Zugabe](bilder/Zugabe/ereignisse/kontakt-3-glockengiesserei.png) |
| Ereignisbilder Akt III: Salz 5, Stadt 5, Wald 6, Gezeitenwerk 6, Ziegelgruben 6 (neu) | Akt III | 4 (selbst geprüft; 12 Bilder überarbeitet, Rauschen auf großen Flächen beruhigt; knapp: Messlatte, Wind) | [Zugabe](bilder/Zugabe/ereignisse/kontakt-4-stadt.png) |
| Ereignisbilder Akt IV/V: Eis 6, Walkathedrale 6, Glasmeer 6, Mond 6, Ufer 3 (neu) | Akt IV, V | 4 (selbst geprüft; 7 Bilder überarbeitet, Glasmeer-Rand-Fehler entfernt; knapp: Leine, Strandkorb) | [Zugabe](bilder/Zugabe/ereignisse/kontakt-5-glasmeer.png) |

## Entscheidungen unterwegs

| Datum | Meilenstein | Entscheidung | Grund |
|---|---|---|---|
| 2026-11-05 | Zugabe | Kern-Wünsche der Biom-Agenten umgesetzt: Absicht „ruft“, `unverw` am Sprite sichtbar (kühl, durchscheinend im Raster), Störkarten-Bild über `spr`, Szene baut Wächter-Szene je Phase neu (Haken `phase`, Beispiel Mond), Vorraum-Elite im Kontaktbogen, `takt` mit Glockenklang (Glockengießerei). Ohne `spr` bleibt die Störkarte beim alten Knochen-Sprite | Gesammelte Vorschläge aus sieben Biom-Paketen; bestehende Bilder sollen sich ohne neue Angabe nicht ändern |
| 2026-11-05 | Zugabe | Akt V: zweite Ebene `rast_v` = Wahl Rast oder Ereignis (vorher nur Rast) | Akt V hatte keinen Ereignis-Knoten; die Ereignisse von Ufer und Waage (und Pforte über die allgemeinen) kamen im normalen Run nie vor (Hinweis des Waage-Agenten) |
| 2026-11-05 | Zugabe | Wächter-Reliquien: eine der drei passt zum erkannten Build (über ihre Eigenschaft), die anderen frei. Danach Build-Bots je 50 Seeds: Glutnest 52, Brackwasser 40, Bollwerk 50, Aderlass 52, Kettenwerk 48, Hagel 50, Ballast 50, Kollekte 62 %; generischer Bot 60 % | Mit 39 Reliquien kamen die eigenen Reliquien der alten Builds zu selten (Brackwasser 34 %, Kettenwerk 38 %). Jetzt alle acht in oder knapp über 40–60 %, keiner über 70 %, die Erkennung ist gestiegen (44–84 %) |
| 2026-11-05 | Zugabe | Zwei neue Builds Ballast (unspielbare Karten als Treibstoff) und Kollekte (Gold im Kampf, Schlagwort Zoll) mit 10 Reliquien; Brackwasser (34 %) und Kettenwerk (38 %) danach knapp unter 40 % gelassen | Ziel 04-deckbau §9: 40–60 %, keiner unter 25 %. Der größere Reliquien-Pool (29 → 39) verdünnt die alten Builds; neue Builds 46 % und 56 %, generischer Bot 61 %. Nachziehen wäre eine Gewichtung der Reliquien-Angebote nach erkanntem Build; vorerst offen |
| 2026-11-05 | Zugabe 4 | Zwei neue Builds Ballast (unspielbare Karten als Treibstoff) und Kollekte (Gold als Treibstoff), je 5 Reliquien und 2 normale Stücke; neue Schlagworte `zoll`, `gold`, Sonder `ueber_bord`, fx `ballast`; Build-Erkennung zählt jetzt die Eigenschaften aller Items (Reliquie 7, sonst 1,5), nicht nur die neuen | Die 10 neuen Reliquien verdünnen den Pool (29 → 39) und senkten die Erkennung der alten Builds um bis zu 24 Punkte; eine Reliquie definiert laut 04 §3 den Build. Profile der neuen Builds nur mit ihren eigenen Stücken, weil die Bots mit schwachen Allerweltsitems im Profil unter 35 % fielen. Details [builds.md](builds.md) Abschnitt 10–11 |
| 2026-11-05 | Zugabe | Balance nach den vier neuen Biomen nicht nachgezogen: Build-Bots je 50 Seeds Glutnest 46 %, Brackwasser 42 %, Bollwerk 44 %, Aderlass 52 %, Kettenwerk 48 %, Hagel 38 % (vorher 44–72 %); generischer Bot 63 % (100 Seeds, vorher 65 %); Niederlagen aller Builds je Akt 1/30/45/43/46, kein Akt über 28 % | Zielwerte 04-deckbau §9 sind 40–60 % je Build; jetzt liegen fünf von sechs darin, Hagel knapp darunter, Aderlass nicht mehr darüber. Die neuen Biome machen Akt II etwas härter, das war gewollt (vorher fast keine Niederlagen in Akt II) |
| 2026-11-05 | Zugabe | Neumond der Rückseite (Mond, Phase 3) jetzt echt unverwundbar: Musterschritt `{t:'blk',v:8,unverw:true}`, steht an zweiter Stelle, damit man ihn kommen sieht; Kraterbewohner ruft abwechselnd Kraterbewohner und Mondmotte | Vorschläge des Mond-Agenten; neuer Kernbaustein im Paketformat dokumentiert |
| 2026-11-05 | Zugabe | Je Akt I–IV ein weiteres Biom (Leuchtturmhof, Glockengießerei, Ziegelgruben, Mond unter dem Eis) statt neuer Systeme; Ziegelgruben bleibt bei 15/20 im biom-test | Philip: „mehr Inhalt“; vier Pakete nutzen nur vorhandene Kniffe. Ziegelgruben lag bei 82 % (49/60), der Wächter steht schon an der 80-Leben-Grenze, im Gesamtlauf passt es |
| 2026-11-05 | Zugabe | Störkarten heißen nach dem Kniff, der sie auslöst (`kniffe:[{art:'verstopfen',karte:…}]` wirkte vorher mit dem Namen „Abschrift“) | Fehler vom Leuchtturm-Agenten gemeldet |
| 2026-11-05 | Zugabe | Wahrsagerin bekommt ein Set aus ihren Startstücken (Teerfackel, Schleier, Kerze): 6 Karten auf der Hand („sie sieht, was kommt“); Veteran trägt den Offiziersmantel statt des Trenchcoats des Detektivs | Über 270 Runs gewann die Wahrsagerin 50 %, der Veteran 87 %, die übrigen 57–80 %. Ein Feuer-Bonus half ihr nicht (gemessen); danach Wahrsagerin 80 %, Veteran 70 % |
| 2026-11-05 | M8 | Gerufene Gegner rufen selbst niemanden mehr | Der Lotse rief Tieflinge, die selbst Tieflinge riefen: der Tiefling war bei 21 von 30 Niederlagen am Leben, der Hafen verursachte 23 % aller Niederlagen; danach 7 % |
| 2026-11-05 | M7 | Pforte neu als gespiegelter Hafen am Meeresgrund, Finale neu gezeichnet und leichter abgestimmt (`ruft` 280 Leben, Ø 10,3 Züge, 72 % überstanden); Boss mit Skala 0,92, damit die Krone nicht oben anstößt | Mo fand die alte Pforte zu sehr nach Science-Fiction; Auftrag: Finale lesbarer, Kampf 8–12 Züge. Die „über 40 % der Niederlagen“ ließen sich mit dem heutigen Bot nicht nachstellen (jetzt 11 %) |
| 2026-11-05 | M7 | Ufer: eigene Ankunft-Szene und eigener Ankunftssatz je Biom, Elite-Größe 128 × 160 in der Prüfung, der Vorgänger trägt ohne gespeicherten Run zusätzlich einen Fund je früherem Akt | Vorschläge des Ufer-Agenten; vorher zeigte jedes Biom die Ankunft der Pforte, und im Test war die Elite zu schwach |
| 2026-11-05 | M7 | Vorschläge der Walkathedrale (Verwundbar am Spieler, Kniff `frisst`, Szene pulsiert synchron zum Herzschlag) vorerst nicht umgesetzt; der Herzschlag ist dafür hörbar und sichtbar | Jeder Vorschlag braucht neues System (Spieler-Zustand, Bild-Haken); Kandidaten für die Zugabe |
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

Stand 2026-11-05, Branch `claude/jolly-mendel-ia28ci`, Draft-PR #14 (nicht gemergt).

### 1. Was gebaut wurde

| Meilenstein | Status | Kurz |
|---|---|---|
| M0 Pipeline | fertig | Bilder auf Weg A (per Skript, kein Bild-Generator in der Sitzung), Biom-Paket-Format, Windgestalt neu |
| M1 Gefühl und UI | fertig | Lebensbalken unten mittig, Meldungszeile, Wucht und Hitstop, Mehrfachtreffer einzeln, Übergang zum Wegklicken, Beute-Sätze, Endbildschirm, Boss-Musik baut sich auf |
| M2 Längere Akte | fertig | 6 Ebenen + Wächter je Akt I–IV, am Aktanfang Wahl zwischen zwei Biomen, 31 Knoten je vollem Run |
| M3 Deckbau-Kern | fertig | Kerben und Handgriffe (Handgriff nimmt die Stoffe seines Items an), 7 Schlagworte, Schleifen, Umritzen, Verkaufen, Rucksackmodus mit Grün/Rot, Hover-Vorschau |
| M4 Inhalte Deckbau | fertig | 70 Handgriffe, 125 Items (25 Reliquien), 6 Builds mit Build-Bots |
| M5 Pipeline und alte Schwächen | fertig | Neubauten Mumie, Nachgeher, Ertrunkener, Netzflickerin-Rücken, Tiefling, Nest; 125 Item-Icons und 70 Handgriff-Bilder (alle Note 4); Kontaktbogen je Biom automatisch (`tools/biom-bogen.js`) |
| M6 Biome Akt I/II | fertig | Konservenfabrik, Kurhaus, Nachtzug, Kloster der Abschrift, Grotte der Gaben; neue Gegner Hafen, Moor, Kapelle; Torfstich heller |
| M7 Biome Akt III–V | fertig | Wald nach unten, Gezeitenwerk, Walkathedrale, Glasmeer, Ufer unten; Pforte neu (Hafen unten), Finale neu gezeichnet; neue Gegner Salz, Stadt, Eis |
| M8 Ereignisse und Balance | fertig | 108 Ereignisse (≥5 je Biom, 15 überall), Test aller Wahlen; Balance siehe 5 |
| M9 Abschluss | fertig | geklickter Run mit 40 Stationen, Galerie und Artboard erweitert, dieser Bericht |

**In Zahlen:** 17 Biome (davon 10 neu, die Pforte neu entworfen), 61 normale Gegner, 15 Wächter, 1 Elite, das Finale in drei Phasen, 143 Sprite-Sheets, 20 verschiedene Kniffe, 125 Items, 70 Handgriffe, 108 Ereignisse.

**Neu im Kern (neben den Inhalten):** Kniffe `teurer`, `kopie`, `takt` (Herzschlag, hör- und sichtbar), `voraus`, `verborgen`, Zusatz-Kniffe und Pendel-Gegner; Kniffe sind über dem Gegner per Tooltip lesbar; besondere Krämer (Tausch in der Grotte, Leihe im Kloster, Spiegel im Glasmeer); „Der, der vor dir kam“ am Ufer aus deinem letzten verlorenen Run; Ergänzungspakete für alte Biome; eigene Ankunft je Akt-V-Biom.

### 2. So spielt man es

```bash
cd prototype && python3 -m http.server 8000
```

Dann `http://localhost:8000/`. Taste **R** öffnet den Rucksackmodus, **D** den Dev-Modus (Reiter „Deck“: Kerben, Handgriffe, Build; „Cheats“: Biom erzwingen, Sprung). URL-Hilfen: `?seed=`, `?dev=1`, `?job=fischer&springe=kampf_schwer&akt=2`. Galerie: `gallery.html`, Artboard (alle Gegner, Items, Handgriffe, Biome, Ereignisse): `artboard.html`.

Prüfungen: `node tools/test-run.js`, `test-deckbau.js` (25 Prüfungen), `test-ereignisse.js`, `test-vorschau.js`, `balance.js 50`, `build-bots.js 50`, `biom-test.js <biom> 20`, `sprites/pruefen.js`, `icons/pruefen.js`, `selbst-spielen.js <ordner>`.

### 3. Bilder

- **Alle neuen Gegner, Wächter, Hintergründe mit Note und Bild-Link:** Tabelle „Noten“ oben in dieser Datei. Jede Figur und jeder Hintergrund steht dort mit Note 4; nichts liegt darunter. Was nur knapp eine 4 ist, steht in Klammern dabei.
- Geklickter Run, alle 40 Stationen: [bilder/M9/run-uebersicht.png](bilder/M9/run-uebersicht.png) (Einzelbilder in [bilder/M9/run/](bilder/M9/run/)).
- Kontaktbögen je Biom: `bilder/M6/<biom>/`, `bilder/M7/<biom>/`, alte Biome `bilder/M6/alte-biome/`, `bilder/M7/alte-biome/`; Icons `bilder/M5/`.
- Finale: [Phase 1](bilder/M7/pforte/nachher-finale-p1.png), [Phase 2](bilder/M7/pforte/nachher-finale-p2.png), [Phase 3 mit Augen](bilder/M7/pforte/nachher-finale-p3-augen.png).

### 4. Ehrliche Einschätzung

- **Stark:** Die neuen Silhouetten sind deutlich eigenständiger als in Auftrag 1. Am besten gelungen sind der Kesselmann, der Geheilte, der Kanalaal, der aus dem Relief, die Seelilie, der Voraus und der Vorgänger am Ufer. Jedes Biom hat sein Wahrzeichen und sein falsches Detail im Bild. Akt IV/V wirken wie ein anderes Spiel als Akt I, und so soll es sein. Der Deckbau trägt: Handgriffe ritzen und dabei die Stoffe des Items übernehmen gibt pro Run echte Entscheidungen.
- **Schwach:** Viele Figuren haben noch große dunkle Flächen (Mäntel, Talare), die Favoriten bleiben handwerklich besser. Mehrere Wächter sind im Spiel nur knapp lesbar (Wurzelstock vor dem Geäst, Schicht innen dicht). Die Pforte ist einfarbig türkis. Kämpfe sind mit Ø 4,1–4,5 Zügen am unteren Rand des Ziels.
- **Musik:** jedes neue Biom hat eine eigene Fassung (Tonart, Ortsklang, Rhythmus) aus den vorhandenen Bausteinen; neue Klänge gibt es nur für den Herzschlag.
- **Weg A statt KI-Bilder:** In der Sitzung gab es keinen Bild-Generator und keinen Schlüssel. Alle Bilder sind per Skript gebaut und geprüft (`pruefen.js`: 143 Sheets, 0 Verstöße).

### 5. Autospieler und Balance

Generischer Autospieler, 100 Seeds: **65 %** Siege, Ø Tiefe 27,8, Ø 4,1–4,5 Züge je Kampf, 0 Fehler. Build-Bots je 50 Seeds:

| Build | Siege | Niederlagen je Akt I/II/III/IV/V |
|---|---|---|
| Glutnest | 64 % | 0/0/4/4/10 |
| Brackwasser | 44 % | 0/0/12/8/8 |
| Bollwerk | 58 % | 0/2/2/10/7 |
| Aderlass | 72 % | 0/1/3/8/2 |
| Kettenwerk | 62 % | 1/1/5/4/8 |
| Hagel | 52 % | 0/0/6/9/9 |

Niederlagen je Akt über alle Builds: I 1 %, II 3 %, III 26 %, IV 35 %, V 35 %. Einzelheiten und was geändert wurde: Abschnitt „M8“ oben.

### 6. Entscheidungen unterwegs (Kurzfassung)

Biome als Pakete, damit viele gleichzeitig entstehen; alte Biome über Ergänzungspakete. `biom-test` spielt die Akte davor wirklich. Gerufene Gegner rufen nicht weiter. Tiefenzuschlag +1 Angriff alle 5 Tiefen. Finale 200 Leben. Neue Kniffe nur, wo ein Steckbrief sie verlangte. Die volle Liste steht unter „Entscheidungen unterwegs“.

### 7. Offene Fragen und Vorschlag für die nächste Sitzung

- **Fragen an Philip und Mo:**
  - Ist der Pforte-Hafen am Meeresgrund die richtige Richtung, oder soll er wärmer und weniger einfarbig werden?
  - Soll Aderlass (72 %) noch geschwächt werden, oder ist ein starker Build in Ordnung?
  - Sollen Kämpfe länger werden? Dann müsste man die Kniffe zurücknehmen, die mit jedem Zug stärker werden.
- **Vorschläge der Agenten für den Kern**, je in den Biom-Konzepten:
  - Spieler-Verwundbar
  - Kniff `frisst` (wächst mit jedem Treffer)
  - Kniff `abgetaucht` (nur im Zug nach deinem Angriff verwundbar)
  - Brand und Gift spiegeln
  - Spiegelbilder unter den Gegnern im Glasmeer
  - Ereignisbilder 160 × 90
- **Nächste Sitzung (Zugabe):**
  - je Akt ein weiteres Biom (Leuchtturmhof, Glockengießerei, Ziegelbrenner-Gruben, Mond unter dem Eis)
  - die dunklen Flächen der Figuren aufhellen (Mäntel, Talare)
  - die Pforte farbiger machen

### Fünf Dinge, die Philip zuerst ausprobieren sollte

1. **Ein Item mit zwei Kerben und ein seltener Handgriff:** Nach einem schweren Kampf den Handgriff ritzen und sehen, wie er die Stoffe des Items annimmt. Dann mit **R** im Rucksackmodus umbauen und die grün/rot markierten Karten ansehen.
2. **Das Glasmeer (Akt IV) gegen den Voraus:** Er spielt deine nächste Karte vor dir. Der Spiegel-Krämer dort verkauft die Waren des letzten Krämers, nur andersherum.
3. **Das Kloster der Abschrift:** Der Abschreiber schreibt deine letzte Karte ab und spielt sie gegen dich. Der Bibliothekar verleiht nur, und am Anfang des nächsten Akts ist die Leihgabe weg.
4. **Das Ufer unten nach einem verlorenen Run:** Im Vorraum wartet „Der, der vor dir kam“ mit der Figur und den Items deines letzten Todes.
5. **Das neue Finale:** König, Schlund, Auge; ab Phase 2 hängen die Augen als Laternen herab und decken ihn. Danach die neue Ankunft (am Ufer ein eigenes Bild und ein eigener Satz).
