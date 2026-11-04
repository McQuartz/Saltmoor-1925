# spritegen (Godot 4.3)

Prozeduraler Sprite-Generator für Saltmoor 1925: Gegner entstehen **Pixel für Pixel aus Skelett, Volumen und Regeln**.
Keine vorgezeichneten Teile, keine KI-Bilder. Stand: M1–M6 umgesetzt, Abnahme durch Ace/Philipp offen.
Plan, Regeln und Zielbild: `docs/spritegen/` (zuerst `README.md`, `AGENTS.md`, `zielbild.md`).

## Benutzen

```
# Kontaktbogen: Körperbau, Zone (hafen|wald|kapelle|grund|mix), Start-Seed, Anzahl, Ausgabe, Vergrößerung, Spalten, Modus
godot --headless --path game --script res://addons/spritegen/cli/sheet.gd -- biped mix 1 64 out.png 2 8 clean
#   Modus pair: links ohne / rechts mit Aufräumregeln; surface: links ohne / rechts mit Oberfläche+Details
godot --headless --path game --script res://addons/spritegen/cli/anim.gd -- floater hafen 4        # Animations-Sheet + Flacker-Maß
godot --headless --path game --script res://addons/spritegen/cli/backdrop.gd -- all 1              # Hintergründe je Zone
godot --headless --path game --script res://addons/spritegen/cli/marks_test.gd                     # Markierungen in 3 Posen
godot --headless --path game --script res://addons/spritegen/cli/test.gd                           # Tests (Exit 0 = grün)
godot --headless --path game --script res://addons/spritegen/cli/test_editor.gd                    # Test des Editor-Docks
godot --headless --path game --script res://addons/spritegen/cli/golden.gd                         # Goldens NEU erzeugen (nur bewusst!)
```

Achtung: Bei einem Skriptfehler beendet sich Godot im `--script`-Modus nicht von selbst. Immer mit `timeout` aufrufen.

Im Editor: Plugin ist in `project.godot` aktiviert, das Dock „SpriteGen“ erscheint rechts oben.
Dasselbe Dock läuft auch als Szene `scenes/spritegen_tool.tscn` (F6), ohne Editor-Plugin.
Einbau-Test: `scenes/combat_test.tscn` (Leertaste Angriff, H Treffer, D Tod, R neuer Seed, Pfeile Körperbau).

## Die Kette

```
Genom ─► Skelett(Pose t) ─► Rastern ─► Oberfläche ─► Schattierung+Dither ─► Aufräumen ─► Randlicht ─► Details ─► Korrekturen ─► Image
```

| Datei | Stufe | Kurz |
|---|---|---|
| `core/rng.gd` | RNG | splitmix32, 32-Bit-maskiert; `fork(name)` gibt jedem Parameter einen eigenen Strom |
| `core/genome.gd` | Genom | Seed + Körperbau + Zone → Parameter 0..1 (Zonen-Regeln aus `bodyplans/zones.json` bilden in [lo, hi] ab), Palette je Zone, `marks`, `fixes`, `joints`; Version 2 mit Migration; `mutate`/`crossover` für Evolution |
| `bodyplans/*.json` | Körperbau-Daten | Parameterlisten, Beschreibungen, Augenzahl-Bereich, Größe (96×120, Fuß bei 48/117) |
| `core/plans/*.gd` | Skelett + Pose | Zweibeiner, Klumpen, Schwebend, Krabbler, Wurm. Jeder Plan: `pose_vars(anim, t)` + `build(params, pose)`. Kegel-Knochen mit Gruppen (glattes Minimum innerhalb, hartes dazwischen), Anatomie aus Regeln (Knie-IK, Schwerpunkt, Bodenkontakt), keine Zufallszahlen im Plan |
| `core/posing.gd` | Pose-Helfer | ganzzahlige Sinus-Zyklen (nahtlos), Schlüsselposen mit weicher Interpolation, **Verlet-Ketten** (Tentakel) mit Loop-Mischung zweier Zyklen |
| `core/plans.gd` | Registry | baut Rest- und Posen-Skelett, Gelenk-Überschreibungen, Einpassen (Maßstab aus der Ruhepose, damit Animationen nicht springen), Klemmen an den Bildrand |
| `core/raster.gd` | Rastern | **2D-projiziertes Abstandsfeld** (Silhouette, 4×4 Teilproben am Rand, Mehrheitsentscheid), Höhe mit **Fase-Profil** `min(innen, R)·0,9`, Tiefe analytisch je Knochen, Körperkoordinaten u (entlang), v (um die Achse) |
| `core/surface.gd` | Oberfläche | Wert-Rauschen im Körperraum (periodisch um die Achse): skin/scales/slime je Zone; Wucherungen per Zellautomat (3 Schritte, 4-5-Regel) als Beulen |
| `core/shade.gd` | Schattierung | Normalen aus dem Höhenfeld, Lambert, Gesicht +0,25, Kontaktschatten (Gruppe davor), Rampe 4 Stufen mit **Bayer-4×4-Dither** |
| `core/cleanup.gd` | Aufräumregeln | Einzelpixel (dither-bewusst: nur Sprünge ≥ 2 Stufen), Treppen (4,1,4 → 3,2,4 in 4 Ausrichtungen), Banding (aus bei Dither) |
| `core/rim.gd` | Randlicht | Gegenlicht hinten oben rechts: Linie an der Außenkante (außen hell, innen dunkler, dünne Teile nur innen), dazu Normalen-Term; kein Randlicht im Kontaktschatten und nahe am Boden |
| `core/details.gd` | Details | Augen (Zahl/Größe aus Genom, um den Kopf verteilt, mit geditherten Glühen), Maul mit Zähnen, `marks` (eye/growth/rust/scar/light) und `fixes`, alle über (Knochen, u, v) je Bild neu verankert |
| `core/outline.gd` | Umriss | Außenumriss, standardmäßig **aus** (Zielbild) |
| `core/frames.gd` | Animation | idle (8, Loop), attack (8), hit (6), death (8); Flacker-Maß; `SpriteFrames`; PNG-Sheet mit Metadaten |
| `core/pipeline.gd` | Kette | `generate(genome, opts)`, Paletten, Index → `Image`, Nebelhintergrund |
| `core/backdrop/` | Hintergründe | `noise.gd` (Wert-Rauschen, fBm, Domain Warping), `wfc.gd` (Overlapping-WFC N=2 aus eigenen Beispielkacheln), `backdrop.gd` (Himmel, Silhouetten, Mauer/Boden, Wasser, Bodennebel als Ebenen) |
| `editor/dock.gd` | Editor | Vorschau mit Animation, Regler, Gelenke ziehen, Absichts-Pinsel, Mini-Pixelmodus (Stift/Radierer/Pipette, nur Palettenindizes, am Knochen oder nur dieses Bild, Zwiebelhaut, Rückgängig), 12-Kinder-Evolution, Export (Genom-JSON, PNG-Sheet + JSON, `SpriteFrames`), Genom laden |
| `palettes/*.json` | Paletten | je Zone 4 dunkle Körperstufen, 2 Randlicht, Augenfarbe (aus `zielbild.md`), Glühen, Nebel |
| `golden/` | Referenzbilder | 15 Genome × (roh, fertig) + 5 Posen |

Index-Bild: `0` transparent, `1` Umriss, `2..5` Körper dunkel → hell, `6/7` Randlicht innen/außen, `8` Auge, `9` Glühen.
Positionen sind Arrays aus 64-Bit-Floats statt `Vector3` (32 Bit).

## Genom (Version 2)

```json
{"v":2,"seed":4711,"plan":"biped","zone":"hafen","palette":"hafen",
 "params":{"height":0.7,"bulk":0.4,"eyes":0.3,"mouth":0.8,"pattern":0.5,"growth":0.2,"...":0},
 "marks":[{"kind":"eye","bone":"chest","u":0.5,"v":0.25,"r":2}],
 "fixes":[{"bone":"head","u":0.6,"v":0.2,"ramp":8},{"frame":"attack:3","x":30,"y":41,"ramp":0}],
 "joints":{"arm_lower_near":[3,-2]}}
```

## Leistung (gemessen, Godot 4.3 headless, ein Kern)

~250 ms je Bild bei 96×120 (M1 noch 1,4 s bei 64×80). Ein Gegner mit 30 Bildern: ~8 s. Für das Spiel werden Sprites daher
**im Editor/beim Bauen vorab erzeugt** und als `SpriteFrames` gespeichert (Export im Dock), nicht beim Laden.
