# M8: Farbton für „Die Farbe“

Skript: [tools/farbe-ton.js](../../tools/farbe-ton.js). Aufruf: `node tools/farbe-ton.js` (Tabelle), `--json` (Ergebnisse), `--alles` (zusätzlich alle Hex-Farben unter `prototype/`). Misst in CIELAB (D65) mit CIEDE2000, Farbtöne 0–359° in 1°-Schritten, Sättigung 0,6–1,0 (5 Stufen), Helligkeit 0,45–0,75 (7 Stufen), 12 600 Kandidaten.

## Standardumfang (Quellen aus 06-lovecraft-kern.md Abschnitt 6)

- Geprüft: 575 verschiedene Palettenfarben aus 858 Fundstellen in 71 Dateien (`tools/sprites/zonen/*.json`, `prototype/data/biomes.json`, `prototype/data/biome/*.json`, `prototype/data/stoffe.json`, Hex-Literale in `tools/icons/**/*.js`).
- Bester Ton: **#c800ff** (Farbton 287°, Sättigung 1,00, Helligkeit 0,50), Mindestabstand **19,117 dE00**.
- Nächste Palettenfarbe: **#ff6ad8**, `prototype/data/biomes.json`, Biom `pforte`, Feld `augen`.
- Schimmer-Stufen (gleicher Ton, Helligkeit 0,35 bis 0,65):

| Stufe | Helligkeit | Hex | Mindestabstand dE00 | nächste Palettenfarbe |
|---|---|---|---|---|
| 1 | 0,350 | #8c00b3 | 11,502 | #6c4a9c (`glasmeer.json`, extra.violett) |
| 2 | 0,425 | #aa00d9 | 14,000 | #6c4a9c (`glasmeer.json`, extra.violett) |
| 3 | 0,500 | #c800ff | 19,117 | #ff6ad8 (`biomes.json`, pforte.augen) |
| 4 | 0,575 | #d026ff | 16,561 | #ff6ad8 (`biomes.json`, pforte.augen) |
| 5 | 0,650 | #d84dff | 12,649 | #ff6ad8 (`biomes.json`, pforte.augen) |

## Befund: der Umfang entscheidet

Unter `prototype/` gibt es mehr Hex-Farben als die Quellenliste: Vendor-Paletten (`prototype/js/vendor/pixelfx/src/core/color.js`, Preset „arcane“), Sprite-Daten in `prototype/js/` und `prototype/assets/`. Das Spiel-Ziel lautet „in keiner Palette des Spiels“. Mit `--alles` (3 116 verschiedene Farben):

- Bester Ton: **#e60091** (Farbton 322°, S 1,00, L 0,45), Mindestabstand **10,960 dE00**, nächste Palettenfarbe #b0228f (`color.js:75`).
- Schimmer-Stufen für diesen Ton: 8,246 / 5,991 / 10,960 / 7,727 / 5,556 dE00.
- #c800ff liegt dort nur 7,28 dE00 von #9a48ec entfernt (pixelfx „arcane“, `color.js:65`).

## Empfehlung

Nimm #c800ff, wenn nur die Spiel-Paletten zählen; zählt die pixelfx-Vendor-Palette mit, ist #e60091 der beste Ton, aber mit Schimmer-Stufen bis herab zu 5,6 dE00 ist die Entscheidung Philips, nicht des Skripts.

## Entscheidung des Dirigenten

Genommen ist der Standardlauf: **#c800ff** (Mindestabstand 19,1 dE00 zu allen Zonen- und Biompaletten, Stoffen und Icon-Farben), Schimmer-Stufen #8c00b3, #aa00d9, #c800ff, #d026ff, #d84dff. Der Auftrag verlangt einen Ton, der in keiner Zonenpalette vorkommt. Die Vorgaben im Effekt-Baukasten (`js/vendor/pixelfx`, z. B. „arcane“) sind keine Zonenpaletten, sondern Vorlagen für Partikel, darum zählt der Lauf `--alles` nicht. Eingetragen in `data/stoffe.json → X`.
