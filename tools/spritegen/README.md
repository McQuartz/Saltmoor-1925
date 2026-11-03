# Sprite-Generator – JS-Referenz (M1)

Referenzimplementierung der Generator-Kette aus [docs/spritegen/03-architektur.md](../../docs/spritegen/03-architektur.md) in JavaScript (Node, ohne Abhängigkeiten).
Ziel ist **Godot 4 / GDScript** unter `game/addons/spritegen/`; dieser Code ist die Vorlage für den Port (siehe Entscheidung vom 2026-11-03 in `docs/spritegen/entscheidungen.md`).

## Benutzen

```
cd tools/spritegen
node cli/sheet.js 1 16          # Kontaktbogen Seeds 1–16 -> docs/spritegen/sheets/M1/
node cli/sheet.js 1 4 out.png 8 # Ausschnitt, 8-fach
npm test                        # Regel-, Determinismus- und Golden-Tests (node:test)
node cli/golden.js              # Goldens NEU erzeugen – nur bewusst, mit Eintrag in entscheidungen.md
```

Kontaktbogen: je Paar links **ohne**, rechts **mit** Aufräumregeln; Seeds zeilenweise von links oben, 4 Paare pro Zeile.

## Stufen

| Datei | Stufe | Kurz |
|---|---|---|
| `core/rng.js` | RNG | splitmix32, nur 32-Bit-Ganzzahl-Operationen; `fork(name)` gibt jedem Parameter einen eigenen Strom |
| `core/genome.js` | Genom | Seed → 15 normierte Parameter (0..1), JSON mit `v:1`, `marks`, `fixes` (noch leer) |
| `core/skeleton.js` | Skelett | Zweibeiner: Becken, Brust, Hals, Kopf, je 2 Arm- und 3 Beinknochen; Knochen = Kegel mit runden Enden; Knie per 2-Knochen-IK; Füße auf (32, 78), Figur wird bei Bedarf um den Fußpunkt verkleinert |
| `core/raster.js` | Volumen | SDF je Knochen, glattes Minimum innerhalb von Gruppen (Rumpf, Kopf, jede Gliedmaße + Ansatz), hartes Minimum zwischen Gruppen; Sphere Tracing entlang −z; 4×4 Supersampling, Mehrheitsentscheid; Normale aus dem Gradienten |
| `core/shade.js` | Schattierung | Lambert, Licht oben links vorne, 4 Stufen; ferne Gliedmaßen etwas dunkler |
| `core/cleanup.js` | Aufräumregeln | 1. Einzelpixel (Sporne, Kerben, Einzeltöne) 2. Treppen glätten (Stufenfolge 4,1,4 → 3,2,4) 3. Banding brechen (1-px-Zwischenton zwischen breiten Bändern) |
| `core/outline.js` | Umriss | Außenumriss; Innenkante, wo ein Körperteil ≥ 2,5 px vor einem anderen liegt |
| `core/pipeline.js` | Ausgabe | Kette zusammensetzen; Index-Bild → RGBA erst ganz am Ende |
| `core/png.js` | – | PNG-Schreiber mit `node:zlib` |

Index-Bild: `0` transparent, `1` Umriss, `2..5` Rampe dunkel → hell. Paletten: `palettes/*.json`.

## Hinweise für den Godot-Port

- RNG: Ganzzahlen in GDScript sind 64 Bit → nach jeder Operation `& 0xFFFFFFFF`; `Math.imul` = Produkt maskiert. Referenzfolge für Seed 1 steht im Test (`2527132011, 314344336, 2535364964`).
- Gleitkomma: JS und GDScript rechnen beide mit double. `+ − × ÷ sqrt` sind bitgleich, `sin/cos` können je Plattform minimal abweichen → Goldens werden in Godot neu erzeugt, nicht übernommen.
- Alle Regeln lesen aus dem Eingabebild und schreiben in eine Kopie; Reihenfolge der Schleifen ist darum egal.
- Laufzeit hier ~80 ms je Sprite (ein Bild). Für 4 Animationen × 8 Bilder wird das zu langsam → in Godot Supersampling nur an Randpixeln, Knochen-Vorauswahl je Pixel oder Shader.
