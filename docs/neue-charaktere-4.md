# Neue Charaktere, Runde 4: Bosse für jedes Biom

Stand 2026-11-10. Auf Philips Wunsch („knall nochmal gleiche Menge wie aus beiden Aufträgen vorher durch“) eine vierte Runde mit 49 Charakteren, aufbauend auf [Runde 1](neue-charaktere.md), [Runde 2](neue-charaktere-2.md) und [Runde 3](neue-charaktere-3.md).

**Was gefehlt hat:** Nach Runde 3 hatte jedes Biom in Akt I bis IV fünf oder mehr normale Gegner, aber nur einen oder zwei Wächter. Wer ein Biom zweimal spielt, trifft also fast immer denselben Boss. Acht Biome hatten außerdem nur eine Elite. Akt V (Pforte, Ufer, Waage) besteht nur aus Vorraum und Finale. Dort fehlt nichts, und das Finale bleibt unverändert.

**Was dazukommt: 49 Charaktere.**

- **22 neue Wächter**, einer für jedes Biom in Akt I bis IV. Damit hat jedes dieser Biome zwei oder drei Bosse, aus denen der Lauf einen wählt. Jeder Wächter bringt ein eigenes Beute-Item mit.
- **8 zweite Eliten** für die Biome, die bisher nur eine hatten (Grotte, Glockengießerei, Gezeitenwerk, Ziegelgruben, Glasmeer, Walkathedrale, Mond, Funkstation). Jede bringt ein eigenes Beute-Item mit.
- **19 normale Gegner**, je mit zwei Varianten (A und B), für die Biome, in denen die normalen Kämpfe am gleichförmigsten waren.

Jedes Biom bekommt ein Ergänzungspaket `prototype/data/biome/<biom>_neu4.json` mit `waechter_dazu`, `elite_dazu`, `gegner_dazu` und `fundpool_dazu`. Der Loader konnte das schon, Code ist diesmal nicht geändert. Bestehende Texte, Gegner und Werte sind unverändert. Alle neuen Texte tragen `"entwurf": true`.

**Doppelungen mit dem Bestand:** Den Vermesser der namenlosen Stadt gab es schon (seit Auftrag 2, M7). Er ist wiederhergestellt, und der neue Stadt-Gegner ist der Eckenzähler. Das neue Glasmeer-Spiegelbild hieß zu ähnlich wie der Voraus und die Biegung „Spiegelbild“. Er ist jetzt der Untenläufer. Die Brennmeisterin heißt Meilerin, damit sie nicht neben dem Brennmeister steht. Der Klöppel hat die id `sprungkloeppel`, weil `kloeppel` schon ein Item ist.

## Wächter

„Vorher“ ist das Biom mit dem alten Stand (40 Läufe), „erzwungen“ sind 40 Läufe, in denen der neue Wächter immer der Boss ist (`--waechter=<id>`).

| Akt | Biom | Wächter | Leben | Schwäche | Kniff | Besonders | Beute (neu) | vorher | erzwungen |
|---|---|---|---|---|---|---|---|---|---|
| I | Das Hafenviertel | Der Hafenkran | 74 | Salz | ansage (3 Züge, 22) | ruft taucher (alle 3) | Kranhaken | 31/40 | 34/40 |
| I | Der Moorwald | Die Torfmutter | 82 | Feuer | rein | ruft torfstecherin (alle 3) | Schürze der Torfmutter | 33/40 | 30/40 |
| I | Die Konservenfabrik | Das Fließband | 80 | Wasser | takt 6 | Schwäche wechselt (W/F) | Dosenstempel | 30/40 | 35/40 |
| I | Das Kurhaus | Der Kurdirektor | 70 | Licht | teurer 1 | ruft kurgast (alle 4) | Kurtaxliste | 27/40 | 32/40 |
| I | Der Nachtzug | Die Schlafwagendame | 76 | Licht | einfrieren | ruft schlafwagenkind (alle 3) | Schlafmaske aus Abteil 7 | 32/40 | 36/40 |
| I | Der Leuchtturmhof | Die Schiffbrüchigen | 88 | Feuer | waechst 2 | Schwäche wechselt (F/S) | Rettungsring der Margarethe | 35/40 | 37/40 |
| II | Die überflutete Kapelle | Der Taufengel | 78 | Feuer | verborgen | ruft messdiener (alle 3) | Schale des Taufengels | 38/39 | 35/39 |
| II | Das Kloster der Abschrift | Die Bücherwand | 76 | Feuer | kopie | ruft leser (alle 3) | Die Zweitschrift | 37/39 | 33/36 |
| II | Die Grotte der Gaben | Die Kerzenkönigin | 74 | Wasser | dornen 3 | ruft wachshand (alle 3) | Dochtkrone | 34/39 | 32/38 |
| II | Die Glockengießerei | Die Gussform | 80 | Wasser | ansage (3 Züge, 24) | ruft giesser (alle 3) | Eingusstrichter | 35/39 | 34/39 |
| II | Das Waisenhaus am Deich | Die Wiege | 86 | Salz | takt 6 | Schwäche wechselt (S/L) | Spieluhr aus der Wiege | 32/39 | 35/39 |
| III | Die Salzstollen | Der Förderkorb | 92 | Feuer | brecher | ruft salzlaeufer (alle 3) | Lampe der letzten Schicht | 37/39 | 31/38 |
| III | Die namenlose Stadt | Der Torbogen | 88 | Eisen | voraus | ruft saeulensteher (alle 4) | Schlussstein | 39/39 | 33/35 |
| III | Der Wald, der nach unten wächst | Die Wölfin | 74 | Feuer | brecher | ruft harzfang (alle 5) | Zahn der Wölfin | 34/39 | 31/39 |
| III | Das Gezeitenwerk | Das Großpendel | 90 | Salz | takt 7 | Schwäche wechselt (S/W/E) | Pendellinse | 37/39 | 39/39 |
| III | Die Ziegelgruben | Der Zenturio | 96 | Wasser | ruf (amphorentraeger) | Schwäche wechselt (W/B) | Stempel des Zenturios | 35/39 | 35/37 |
| III | Die Station, die nie eröffnet wurde | Der Vortriebsschild | 90 | Licht | brecher | ruft streckengaenger (alle 4) | Zahn vom Schneidring | 33/39 | 28/36 |
| IV | Das schwarze Eis | Das Expeditionsschiff | 80 | Feuer | einfrieren | ruft fahnentraeger (alle 4) | Kompass der Bark | 33/38 | 29/37 |
| IV | Die Walkathedrale | Der Harpunier | 92 | Blut | ansage (3 Züge, 28) | ruft seepockenmann (alle 3) | Walleine | 36/38 | 36/39 |
| IV | Das Glasmeer | Der Untenläufer | 86 | Licht | kopie | Schwäche wechselt (L/V) | Glassohlen | 35/38 | 35/39 |
| IV | Der Mond unter dem Eis | Das Teleskop | 78 | Blut | teurer 1 | ruft astronom (alle 4) | Okular des Gehilfen | 34/38 | 32/37 |
| IV | Die Funkstation am Pol | Der Empfänger | 92 | Feuer | wechsel (F/W/L/E) | ruft funker (alle 3) | Kristalldetektor | 29/38 | 29/35 |

## Zweite Eliten

| Akt | Biom | Elite | Leben | Schwäche | Kniff + zweiter | Beute (neu) | vorher | erzwungen |
|---|---|---|---|---|---|---|---|---|
| II | Die Grotte der Gaben | Der Bußgänger | 72 | Blut | waechst 1 + ruf (wachshand) | Kreuz des Bußgängers | 34/39 | 31/37 |
| II | Die Glockengießerei | Der Glockenseiler | 78 | Feuer | einfrieren + waechst 1 | Unfertiges Glockenseil | 35/39 | 34/39 |
| III | Das Gezeitenwerk | Der Zahnradmann | 90 | Salz | takt 5 + schuetzer 3 | Schraubenschlüssel von 1909 | 37/39 | 38/39 |
| III | Die Ziegelgruben | Die Meilerin | 88 | Wasser | dornen 3 + waechst 1 | Schaufel der Meilerin | 35/39 | 34/37 |
| IV | Die Walkathedrale | Die Walpredigerin | 94 | Feuer | verborgen + heiler 4 | Bibel aus dem Wal | 36/38 | 36/39 |
| IV | Das Glasmeer | Der Gefangene im Glas | 92 | Eisen | rein + teurer 1 | Splitter vom Glasblock | 35/38 | 32/38 |
| IV | Der Mond unter dem Eis | Der Mondgräber | 78 | Licht | brecher + ruf (laternenanzuender) | Schaufel des Mondgräbers | 34/38 | 30/38 |
| IV | Die Funkstation am Pol | Der Antennenmann | 92 | Eisen | ansage (2 Züge, 20) + wechsel (E/W/G) | Antennendraht | 29/38 | 34/39 |

## Normale Gegner

| Akt | Biom | Charakter | Leben | Schwäche | Kniff | Beute |
|---|---|---|---|---|---|---|
| I | Der Moorwald | Der Bohlenleger | 26 | Feuer | schuetzer 3 | – |
| I | Die Konservenfabrik | Die Etikettiererin | 20 | Wasser | teurer 1 | – |
| I | Der Nachtzug | Der Speisewagenkoch | 26 | Blut | waechst 1 | pan |
| II | Die überflutete Kapelle | Der Küster | 22 | Feuer | einfrieren | – |
| II | Das Kloster der Abschrift | Der Siegelmönch | 24 | Wasser | brecher | candle |
| II | Die Grotte der Gaben | Die Wasserschöpferin | 20 | Eisen | heiler 3 | holywater |
| II | Die Glockengießerei | Der Klöppel | 26 | Wasser | ansage (2 Züge, 12) | – |
| II | Das Waisenhaus am Deich | Das Puppenkind | 22 | Feuer | verborgen | musicbox |
| III | Die Salzstollen | Die Solesiederin | 26 | Wasser | dornen 2 | salt |
| III | Die namenlose Stadt | Der Eckenzähler | 22 | Glaube | brecher | – |
| III | Der Wald, der nach unten wächst | Der Harzsammler | 24 | Feuer | heiler 3 | knife |
| III | Das Gezeitenwerk | Der Schmierer | 26 | Feuer | schuetzer 3 | bottle |
| III | Die Ziegelgruben | Der Formstreicher | 26 | Wasser | waechst 1 | – |
| III | Die Station, die nie eröffnet wurde | Der Gepäckträger | 28 | Licht | schuetzer 3 | watch |
| IV | Das schwarze Eis | Der Schneeblinde | 22 | Licht | rein | – |
| IV | Die Walkathedrale | Der Speckschneider | 24 | Blut | brecher | harpoon |
| IV | Das Glasmeer | Der Glasläufer | 20 | Eisen | einfrieren | – |
| IV | Der Mond unter dem Eis | Der Staubmann | 22 | Wasser | verborgen | – |
| IV | Die Funkstation am Pol | Der Kartenzeichner | 24 | Feuer | teurer 1 | compass |

Konzept, Stimme, Beute-Satz und die Begründung jedes Kniffs (`why`, im Dev-Modus sichtbar) stehen im Paket. Das Bild beschreibt der Kopfkommentar des Sprite-Skripts.

## Mechanik-Maßstäbe

Nur vorhandene Kniffe und Besonderheiten, kein neues System. Keine Störkarten ins Deck: kein `abschrift`, kein `verstopfen`, `kopie` nur ohne `n`. Kniffe, die nur als Hauptkniff wirken, stehen nur im Hauptkniff. Ein Wächter kämpft allein, deshalb bekommt jeder, der `heiler` oder `schuetzer` bräuchte, stattdessen einen Gerufenen (`ruft`) aus dem eigenen Biom oder eine wechselnde Schwäche. Phasen mit eigenem Sprite gibt es in dieser Runde nicht.

## Balance

40 Läufe je Biom mit `tools/biom-test.js <biom> 40 1`, vorher ohne und nachher mit den Paketen.

| Biom | vorher | nachher |
|---|---|---|
| Das Hafenviertel | 31/40 | 32/40 |
| Der Moorwald | 33/40 | 32/40 |
| Die Konservenfabrik | 30/40 | 31/40 |
| Das Kurhaus | 27/40 | 27/40 |
| Der Nachtzug | 32/40 | 31/40 |
| Der Leuchtturmhof | 35/40 | 37/40 |
| Die überflutete Kapelle | 38/39 | 36/39 |
| Das Kloster der Abschrift | 37/39 | 33/39 |
| Die Grotte der Gaben | 34/39 | 33/39 |
| Die Glockengießerei | 35/39 | 35/39 |
| Das Waisenhaus am Deich | 32/39 | 33/39 |
| Die Salzstollen | 37/39 | 34/39 |
| Die namenlose Stadt | 39/39 | 37/39 |
| Der Wald, der nach unten wächst | 34/39 | 32/39 |
| Das Gezeitenwerk | 37/39 | 39/39 |
| Die Ziegelgruben | 35/39 | 36/39 |
| Die Station, die nie eröffnet wurde | 33/39 | 31/39 |
| Das schwarze Eis | 33/38 | 31/39 |
| Die Walkathedrale | 36/38 | 34/39 |
| Das Glasmeer | 35/38 | 36/39 |
| Der Mond unter dem Eis | 34/38 | 35/39 |
| Die Funkstation am Pol | 29/38 | 31/39 |

Der erste Durchlauf mit jedem neuen Boss erzwungen war bei sechs Charakteren deutlich zu hart: Kurdirektor (22/40), Expeditionsschiff (13/26), Teleskop (23/32), Vortriebsschild (21/33), Wölfin (22/35) und Mondgräber (20/37). Bücherwand und Bußgänger lagen knapp darunter. Daraufhin habe ich bei diesen acht Leben und Schläge gesenkt, und die Gerufenen kommen nur noch jeden vierten Zug (bei der Wölfin jeden fünften). Die Tabellen zeigen den letzten Stand.

Die meisten neuen Bosse liegen jetzt gleichauf mit dem Biom vorher. Am leichtesten ist das Großpendel (39/39), weil der Takt nur Block gibt und der Boss allein steht. Am schwersten bleiben Wölfin und Vortriebsschild, weil beide mit `brecher` durch die Deckung gehen. Wenn sich ein Boss beim Spielen zu hart anfühlt, sind Leben und der letzte Schlag im Muster die ersten Stellschrauben. Im Kurhaus und auf der Station streut die Quote um zwei bis drei Läufe, das ist bei 40 Läufen normales Rauschen.

## Bilder

- [waechter-a.png](neue-charaktere-4/waechter-a.png) und [waechter-b.png](neue-charaktere-4/waechter-b.png): alle neuen Wächter, Ruhe und Angriff im Biomnebel.
- [eliten.png](neue-charaktere-4/eliten.png): die acht Eliten.
- [normal-a.png](neue-charaktere-4/normal-a.png) und [normal-b.png](neue-charaktere-4/normal-b.png): alle normalen Gegner, je Variante.
- `kampf-<id>.png`: jeder neue Wächter und jede neue Elite im echten Kampf (Dev-Sprung).

## Prüfungen

- `node tools/sprites/pruefen.js`: 407 Sprites, 0 Verstöße.
- `node tools/texte-pruefen.js`: alle bestehenden Texte unverändert, alle neuen als Entwurf markiert.
- `sh tools/alle-tests.sh`: alles gut bis auf `test-karte` (48 Fehler, schon auf der Basis rot). `test-meta` verlangt für jeden Wächter eine wahre und eine falsche Notiz des Vorgängers. Dafür stehen in `prototype/data/meta.json` jetzt 22 neue Einträge unter `notizen.waechter`, alle als Entwurf, bestehende Notizen unverändert. `test-welle1` war in einem Durchlauf einmal rot und beim Wiederholen grün.
