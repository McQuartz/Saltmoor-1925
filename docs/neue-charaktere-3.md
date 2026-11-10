# Neue Charaktere, Runde 3: mehr Abwechslung in jedem Biom

Stand 2026-11-10. Auf Philips Wunsch („noch 3 mal so viele“) eine dritte Runde, aufbauend auf [neue-charaktere.md](neue-charaktere.md) (Runde 1) und [neue-charaktere-2.md](neue-charaktere-2.md) (Runde 2).

**Was gefehlt hat:** Nach Runde 2 hatte jedes Biom eine Elite, aber viele Biome hatten nur drei normale Gegner, und in den meisten gab es genau eine Elite, sodass jeder schwere Kampf gleich aussah. In Akt V hatte die Pforte nur einen einzigen normalen Gegner und, anders als Ufer und Waage, keinen eigenen Vorraum-Gegner.

**Was dazukommt: 37 Charaktere.**

- **22 normale Gegner**, einer für jedes Biom in Akt I bis IV und einer für die Pforte, je mit zwei Varianten (A und B).
- **14 zweite Eliten**, für die Biome, die bisher nur eine hatten. Jede bringt ein eigenes Beute-Item mit.
- **Der Fährmann** als Vorraum-Elite der Pforte, mit eigenem Beute-Item.

Jedes Biom bekommt ein Ergänzungspaket `prototype/data/biome/<biom>_neu3.json` (Format wie bisher: `ergaenzt`, `gegner_dazu`, `elite_dazu`, `fundpool_dazu`). Jeder Charakter hat ein eigenes Sprite-Skript `tools/sprites/gegner/<id>.js`. Bestehende Texte, Gegner und Werte sind unverändert. Alle neuen Texte tragen `"entwurf": true`.

**Eine kleine Code-Änderung:** Ergänzungspakete konnten bisher keinen Vorraum-Gegner setzen. In `prototype/js/data.js` steht jetzt eine Zeile mehr (`if(p.vorraum_elite)b.vorraum_elite=p.vorraum_elite;`), damit `pforte_neu3.json` den Fährmann vor die Pforte stellen kann.

## Zweite Eliten und Fährmann

| Akt | Biom | Charakter | Leben | Schwäche | Kniff + zweiter | Beute (neu) |
|---|---|---|---|---|---|---|
| I | Das Hafenviertel | Der Ankermann | 66 | Licht | dornen 2 + waechst 1 | Ankerkette |
| I | Der Moorwald | Der Moorkönig | 84 | Feuer | schuetzer 4 + ruf (gepfaehlter) | Wurzelkrone |
| I | Die Konservenfabrik | Die Dosenpresse | 80 | Wasser | ansage (2 Züge, 18) + schuetzer 3 | Stempelplatte |
| I | Das Kurhaus | Die Masseurin | 64 | Glaube | dornen 2 + schuetzer 2 | Massageöl |
| I | Der Nachtzug | Der Lokführer | 76 | Wasser | takt 4 + waechst 1 | Dampfpfeife |
| I | Der Leuchtturmhof | Die Wärterfrau | 66 | Salz | einfrieren + ruf (rueckmoewen) | Linsenring |
| II | Die überflutete Kapelle | Die Orgel | 88 | Salz | einfrieren + schuetzer 3 | Orgelpfeife |
| II | Das Kloster der Abschrift | Der Abt | 76 | Feuer | heiler 3 + ruf (novize) | Krummstab |
| II | Das Waisenhaus am Deich | Die Kinderfrau | 84 | Licht | schuetzer 4 + ruf (zugedeckte) | Kinderdecke |
| III | Die Salzstollen | Die Salzbraut | 84 | Wasser | rein + heiler 4 | Salzstrauß |
| III | Die namenlose Stadt | Der Erbauer-Priester | 86 | Licht | verborgen + waechst 1 | Senklot |
| III | Der Wald, der nach unten wächst | Die Baumfrau | 84 | Feuer | einfrieren + waechst 1 | Harzzopf |
| III | Die Station, die nie eröffnet wurde | Die Ansagerin | 82 | Glaube | ansage (3 Züge, 22) + teurer 1 | Fahrplan |
| IV | Das schwarze Eis | Der Zeltbewohner | 80 | Feuer | schuetzer 4 + ruf (rufer) | Zeltplane |
| V | Die Pforte | Der Fährmann (Vorraum) | 104 | Licht | ansage (3 Züge, 26) + teurer 1 | Stakruder |

## Normale Gegner

| Akt | Biom | Charakter | Leben | Schwäche | Kniff | Beute |
|---|---|---|---|---|---|---|
| I | Das Hafenviertel | Die Fischhändlerin | 18 | Fäulnis | heiler 2 | knife |
| I | Der Moorwald | Der Weidenmann | 26 | Feuer | dornen 2 | – |
| I | Die Konservenfabrik | Der Hakenmann | 24 | Blut | brecher | harpoon |
| I | Das Kurhaus | Die Inhalierende | 18 | Eisen | heiler 2 | bottle |
| I | Der Nachtzug | Der Heizer | 22 | Wasser | waechst 1 | shovel |
| II | Die überflutete Kapelle | Der Messdiener | 20 | Wasser | verborgen | candle |
| II | Das Kloster der Abschrift | Der Rubrikator | 22 | Wasser | teurer 1 | bible |
| II | Die Grotte der Gaben | Die Krückenträgerin | 20 | Feuer | dornen 2 | – |
| II | Die Glockengießerei | Der Balgtreter | 22 | Wasser | schuetzer 3 | – |
| II | Das Waisenhaus am Deich | Das Fensterkind | 20 | Feuer | einfrieren | – |
| III | Die Salzstollen | Das Grubenpony | 28 | Blut | ansage (2 Züge, 12) | minerlamp |
| III | Die namenlose Stadt | Der Säulensteher | 26 | Eisen | schuetzer 3 | – |
| III | Der Wald, der nach unten wächst | Der Pilzsammler | 24 | Feuer | rein | – |
| III | Das Gezeitenwerk | Die Wasseruhr | 28 | Eisen | ansage (3 Züge, 14) | watch |
| III | Die Ziegelgruben | Der Wasserträger der Legion | 24 | Feuer | heiler 3 | – |
| III | Die Station, die nie eröffnet wurde | Der Zeitungsjunge | 20 | Feuer | teurer 1 | – |
| IV | Das schwarze Eis | Der Eisbohrer | 22 | Feuer | brecher | pick |
| IV | Die Walkathedrale | Der Ausguck | 26 | Blut | verborgen | compass |
| IV | Das Glasmeer | Der Eisfischer | 26 | Licht | waechst 1 | – |
| IV | Der Mond unter dem Eis | Der Laternenanzünder | 24 | Wasser | heiler 3 | lantern |
| IV | Die Funkstation am Pol | Der Meteorologe | 26 | Feuer | wechsel (F/W/L) | – |
| V | Die Pforte | Die Nachgeherin | 30 | Glaube | voraus | – |

Konzept, Stimme, Beute-Satz und die Begründung jedes Kniffs (`why`, im Dev-Modus sichtbar) stehen im Paket, das Bild beschreibt der Kopfkommentar des Sprite-Skripts.

## Mechanik-Maßstäbe

Nur vorhandene Kniffe, kein neues System. Keine Störkarten ins Deck (Deck nie zerschießen): kein `abschrift`, kein `verstopfen`, kein `kopie` mit `n`. Kniffe, die nur als Hauptkniff wirken (`ansage`, `dornen`, `rein`, `brecher`, `verborgen`, `voraus`), stehen nur im Hauptkniff. Der zweite Kniff der Eliten ist immer einer, der jeden Zug wirkt (`waechst`, `schuetzer`, `heiler`, `ruf`, `teurer`). Gerufen werden nur Gegner aus dem eigenen Biom.

## Balance

20 Läufe je Biom mit `tools/biom-test.js <biom> 20 1`. „Vorher“ ist der Stand nach Runde 2, „nachher“ mit den neuen Paketen, „Elite“ erzwingt die neue Elite in jedem schweren Kampf (`--elite=<id>`).

| Biom | vorher | nachher | neue Elite erzwungen |
|---|---|---|---|
| Das Hafenviertel | 17/20 | 14/20 | 14/20 |
| Der Moorwald | 16/20 | 16/20 | 17/20 |
| Die Konservenfabrik | 13/20 | 17/20 | 18/20 |
| Das Kurhaus | 15/20 | 14/20 | 15/20 |
| Der Nachtzug | 18/20 | 15/20 | 15/20 |
| Der Leuchtturmhof | 15/20 | 16/20 | 16/20 |
| Die überflutete Kapelle | 19/20 | 20/20 | 20/20 |
| Das Kloster der Abschrift | 18/20 | 17/19 | 15/19 |
| Die Grotte der Gaben | 17/20 | 15/19 | – |
| Die Glockengießerei | 18/20 | 17/19 | – |
| Das Waisenhaus am Deich | 16/20 | 15/20 | 15/20 |
| Die Salzstollen | 15/20 | 17/20 | 18/19 |
| Die namenlose Stadt | 20/20 | 20/20 | 17/18 |
| Der Wald, der nach unten wächst | 18/20 | 17/20 | 17/19 |
| Das Gezeitenwerk | 20/20 | 20/20 | – |
| Die Ziegelgruben | 20/20 | 19/20 | – |
| Die Station, die nie eröffnet wurde | 15/20 | 16/20 | 19/20 |
| Das schwarze Eis | 18/19 | 14/18 | 17/19 |
| Die Walkathedrale | 18/19 | 19/20 | – |
| Das Glasmeer | 19/19 | 17/20 | – |
| Der Mond unter dem Eis | 17/19 | 16/20 | – |
| Die Funkstation am Pol | 15/19 | 15/20 | – |
| Die Pforte | 16/19 | 16/20 | Fährmann immer im Vorraum |

Der erste Durchlauf war in einigen Biomen zu hart (Hafen 11/20, Kurhaus 11/20, schwarzes Eis 13/20, Leuchtturm 13/20). Daraufhin habe ich Leben und Schläge gesenkt: Ankermann, Masseurin, Zeltbewohner, Wärterfrau, Abt und Lokführer haben weniger Leben, die Masseurin wächst nicht mehr, sondern hält die anderen fest (schuetzer 2), die Wärterfrau ruft nur jeden vierten Zug, und Fischhändlerin, Inhalierende, Eisbohrer, Heizer, Balgtreter und Krückenträgerin sind schwächer. Die Tabelle zeigt den letzten Stand.

Im Hafen liegt die Quote noch drei Läufe unter vorher (14 statt 17 von 20). Ich habe es dabei belassen, weil der Hafen in dieser Runde einen normalen Gegner und eine zweite Elite dazubekommt und 20 Läufe ohnehin um etwa zwei streuen. Wenn sich Akt I beim Spielen zu hart anfühlt, sind Ankermann (66 Leben) und Fischhändlerin (heiler 2) die ersten Stellschrauben. In Kapelle, Stadt und Gezeitenwerk bleibt es leicht, weil diese Biome schon vorher fast immer überstanden wurden.

## Bilder

- [normal-a.png](neue-charaktere-3/normal-a.png) und [normal-b.png](neue-charaktere-3/normal-b.png): alle normalen Gegner, je Variante Ruhe und Angriff im Biomnebel.
- [eliten-a.png](neue-charaktere-3/eliten-a.png) und [eliten-b.png](neue-charaktere-3/eliten-b.png): alle Eliten, Ruhe und Angriff.
- `kampf-<id>.png`: jede neue Elite im echten Kampf (Dev-Sprung in einen schweren Kampf ihres Bioms).

## Prüfungen

- `node tools/sprites/pruefen.js`: 339 Sprites, 0 Verstöße.
- `node tools/texte-pruefen.js`: alle bestehenden Texte unverändert, alle neuen als Entwurf markiert.
- `sh tools/alle-tests.sh`: alles gut bis auf `test-karte` (48 Fehler, schon auf der Basis rot). `test-run` hat angenommen, dass der Vorraum der Pforte keinen festen Gegner hat. Jetzt erwartet der Test für jedes Biom mit `vorraum_elite` den schweren Kampf, wie bei Ufer und Waage.
