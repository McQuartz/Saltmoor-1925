# Neue Charaktere (Eliten-Schwerpunkt)

Stand 2026-11-09. Auf Philips Wunsch: so viele neue Charaktere wie möglich, mit Fokus auf Eliten. Jeder kommt als Ergänzungspaket `prototype/data/biome/<biom>_neu.json` (Format: [paket-format.md](auftrag-2/paket-format.md), Abschnitte „Ergänzung eines alten Bioms“ und „Eliten“), mit eigenem Sprite-Skript in `tools/sprites/gegner/<id>.js`. Bestehende Texte und Gegner sind unverändert.

**Wichtig fürs Spielen:** Bis jetzt hatte kein Biom eine aktive Elite-Liste (Oberzöllner und „Der, der vor dir kam“ sind Vorraum-Eliten in Akt V). Mit diesen Paketen bringt ein schwerer Kampf in zehn Biomen mit `BAL.elite.chance` (0,5) eine Elite statt zwei normaler Gegner.

## Übersicht

| Akt | Biom | Charakter | Rang | Leben | Schwäche | Kniff (+ zweiter) | Beute |
|---|---|---|---|---|---|---|---|
| I | Leuchtturm | Der Ölträger | normal | 27 | Feuer | ansage (2 Züge, 14) | Laterne |
| I | Leuchtturm | Der Feuerinspektor | Elite | 88 | Wasser | schuetzer 4 + ruf (Ölträger, Lampenputzer, Fensterzählerin) | Prüfbuch (neu) |
| I | Nachtzug | Der Stehgeiger | Elite | 72 | Blut | kopie + schuetzer 3 | Kolophonium (neu) |
| I | Fabrik | Der Etikettenmann | Elite | 86 | Feuer (wechselt F/W/S) | wechsel + waechst 1 | Leimtopf (neu) |
| I | Kurhaus | Der Badearzt | Elite | 78 | Feuer | heiler 4 + ruf (Genesender, alle 5) | Hörrohr (neu) |
| II | Kloster | Die Buchbinderin | Elite | 86 | Feuer | waechst 1 + schuetzer 3 | Falzbein (neu) |
| II | Waisenhaus | Der Vormund | Elite | 82 | Licht | teurer 1 + schuetzer 3 | Mündelakte (neu) |
| III | Wald | Die Köhlerin | Elite | 92 | Wasser | dornen 3 + ansage (3 Züge, 22) | Legionskohle (neu) |
| III | Station | Der Stationsvorsteher | Elite | 94 | Eisen | takt 5 + ruf (Wartende, Sperrenschaffner) | Befehlskelle (neu) |
| IV | Funkstation | Der Expeditionsleiter | Elite | 90 | Feuer | einfrieren + ruf (Funker, Mastkletterer) | Expeditionsfahne (neu) |
| IV | Glasmeer | Der Glasbläser | Elite | 90 | Eisen | nachlass explodiert 8 + waechst 1 | Glasperle mit Nordlicht (neu) |

Konzept, Muster, Stimme und Beute-Satz stehen im jeweiligen Paket, das Bild ist im Kopfkommentar des Sprite-Skripts beschrieben.

## Mechanik-Maßstäbe

Nur vorhandene Kniffe, keine neuen Systeme. Keine Störkarten ins Deck (Deck nie zerschießen). Der Nachlass des Glasbläsers kann nicht töten (der Code lässt mindestens 1 Leben). Die Eliten haben 4 bis 5 Züge im Muster, genau einen Kniff und einen zweiten in `kniffe`, wie im Paketformat vorgesehen.

## Prüfung

- `node tools/sprites/pruefen.js`: 0 Verstöße für alle neuen Sprites. Jedes Sheet habe ich selbst angesehen (Idle und Angriff).
- `node tools/biom-test.js <biom> <n>` gegen den Stand ohne die neuen Pakete (Basis M12/Zugabe), 0 Fehler überall. Die Eliten machen die Akte spürbar schwerer, bleiben aber im Ziel des Paketformats (6–9 von 10). Zu harte Eliten habe ich entschärft (Stehgeiger, Vormund, Expeditionsleiter, Badearzt).

| Biom | vorher | mit neuen Charakteren | Elite in jedem schweren Kampf |
|---|---|---|---|
| Leuchtturm | 10/10 | 8/10 | 8/10 |
| Kurhaus | 7/10 | 7/10 | 7/10 |
| Nachtzug | 9/10 | 10/10 | 8/10 |
| Fabrik | 10/10 | 7/10 | 7/10 |
| Kloster | 10/10 | 9/10 | 9/10 |
| Waisenhaus | 18/20 | 17/20 | |
| Wald | 10/10 | 8/10 | 8/10 |
| Station | | 10/10 | 10/10 |
| Funkstation | 19/20 | 17/20 | |
| Glasmeer | | 10/10 | 10/10 |

- Gesamttests (`sh tools/alle-tests.sh`): siehe PR. `test-karte` meldet auf der Basis schon dieselben 48 Fehler, das kommt nicht von hier.

## Noten (eigene Einschätzung, Bewertungsbogen 1–5)

| Sprite | Note | Anmerkung |
|---|---|---|
| Ölträger a/b | 4 | Buckel und Joch lesen sich gut, die Glut in den Kannen dürfte heller sein |
| Feuerinspektor | 4 | Lampenzylinder als Kopf ist sofort lesbar |
| Badearzt | 4 | Schläuche in den Boden tragen das Bild; Kittel noch etwas blockig |
| Buchbinderin | 4 | Bücherturm mit Kerze oben, Presse vorn |
| Vormund | 4 | Augenreihen im offenen Rock; liest sich erst auf den zweiten Blick als Kinder, das ist Absicht |
| Köhlerin | 4 | Meiler mit Zuglöchern, klein davor die Frau mit Haken |
| Stationsvorsteher | 4 | Uhr als Kopf, starke Silhouette |
| Expeditionsleiter | 4 | leere Kapuze mit Röhren, Fahne |
| Glasbläser | 4 | Blase mit Nordlicht; Körper noch recht gerade |
| Stehgeiger | 4 | Kopf auf der Geige, Bogen so lang wie er; für eine Elite eher schmal |
| Etikettenmann | 4 | runder Leib aus Etiketten, der Fisch auf der Brust hat die Augen |

Offen: Kontaktbogen neben den Favoriten und Bildschirmfotos im Spiel sind nicht gemacht. Die Item-Bilder sind Platzhalter aus `js/sprites/items.js`.
