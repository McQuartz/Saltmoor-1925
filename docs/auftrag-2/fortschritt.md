# Fortschritt Auftrag 2

Wird vom Agenten geführt. Neueste Einträge oben in jedem Abschnitt.

## Stand

| Meilenstein | Status | Notiz |
|---|---|---|
| M0 Einrichten und Bild-Pipeline | offen | |
| M1 Gefühl und UI | fertig | Lebensbalken unten mittig, Meldungszeile, Wucht, Mehrfachtreffer einzeln, Übergang zum Wegklicken, Beute-Sätze, Endbildschirm, Musik-Aufbau |
| M2 Längere Akte | offen | |
| M3 Deckbau-Kern | offen | |
| M4 Items, Handgriffe, Builds | offen | |
| M5 Pipeline und alte Schwächen | läuft | Neubauten fertig (Mumie, Nachgeher, Ertrunkener, Netzflickerin-Rücken, Tiefling, Nest, alle Note 4); Icons in Arbeit |
| M6 Biome Akt I und II | offen | |
| M7 Biome Akt III bis V | offen | |
| M8 Ereignisse und Balance | offen | |
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

## Entscheidungen unterwegs

| Datum | Meilenstein | Entscheidung | Grund |
|---|---|---|---|

## Probleme

## Bericht
