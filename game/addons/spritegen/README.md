# spritegen (Godot 4)

Prozeduraler Sprite-Generator für Saltmoor 1925. Stand: **M1 Technik-Probe**, ein Körperbau (Zweibeiner), statisch, 64×80.
Bitgleicher Port der JS-Referenz in `tools/spritegen/` (gleiche Hashes über alle Bilder des Kontaktbogens, gleiche Goldens).
Plan und Regeln: `docs/spritegen/` (zuerst `README.md` und `AGENTS.md` lesen).

## Aufrufen (headless, Godot 4.3)

```
godot --headless --path game --script res://addons/spritegen/cli/sheet.gd -- 1 16   # Kontaktbogen Seeds 1–16
godot --headless --path game --script res://addons/spritegen/cli/test.gd            # Tests, Exit-Code 0 = grün
```

Achtung: Bei einem Skriptfehler beendet sich Godot im `--script`-Modus nicht von selbst. Immer mit `timeout` aufrufen.

## Stufen

| Datei | Stufe |
|---|---|
| `core/rng.gd` | splitmix32, 32-Bit-maskiert, `fork(name)` je Parameter |
| `core/genome.gd` | Seed → 15 normierte Parameter, Genom-JSON mit `v:1` |
| `core/skeleton.gd` | Zweibeiner-Skelett aus Kegel-Knochen, Knie-IK, Füße auf (32, 78) |
| `core/raster.gd` | SDF + glattes Minimum, Sphere Tracing, Supersampling nur am Rand |
| `core/shade.gd` | Lambert, 4 Stufen |
| `core/cleanup.gd` | Einzelpixel, Treppen, Banding (je einzeln abschaltbar) |
| `core/outline.gd` | Außenumriss, Innenkanten |
| `core/pipeline.gd` | Kette, Palette, Ausgabe als `Image` |

Positionen sind Arrays aus 64-Bit-Floats statt `Vector3` (der rechnet nur mit 32 Bit und wäre nicht bitgleich zur Referenz).

## Leistung (gemessen, M1)

~1,4 s je Bild in GDScript (JS: ~45 ms). Ziel laut Architektur: 4 Animationen × 8 Bilder unter ~100 ms. **Das ist so nicht erreichbar**, siehe offene Frage in `docs/spritegen/entscheidungen.md`.
