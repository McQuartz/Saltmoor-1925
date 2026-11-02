# Architektur

## Grundidee

Jedes Bild läuft durch dieselbe Kette. Zufällig ist nur das **Genom** (plus Seed). Jede Stufe hat klare Ein- und Ausgaben und lässt sich einzeln testen und verbessern.

```
Genom ──► Skelett ──► Pose(t) ──► Volumen rastern ──► Schattierung ──► Oberfläche ──► Aufräumregeln ──► Umriss ──► Bild
  ▲                                                                                                              │
  └──────────── Auswahl / Evolution (nur im Editor-Werkzeug, nicht im Spiel) ◄── SpriteFrames ◄───────────────────┘
```

| Stufe | Eingabe | Ausgabe | Techniken |
|---|---|---|---|
| Genom | Seed, Körperbauplan, Zonen-Regeln | Parameter-Dictionary (JSON) | eigener deterministischer RNG |
| Skelett | Genom | Knochen: Start, Ende, Radius am Anfang/Ende, Ebene (vorne/hinten), Tags (Kopf, Arm, Tentakel …) | Grammatik je Körperbau, Anatomie-Regeln |
| Pose(t) | Skelett, Animation, Zeit | Skelett in Pose | Sinus-Zyklen, IK, Verlet-Ketten, Schlüsselposen |
| Volumen rastern | Pose | Puffer in Sprite-Größe: Abdeckung, Tiefe, Normale, Knochen-ID, Körperkoordinate (u, v) | Signed Distance Fields / Metaballs mit glattem Minimum, Supersampling + Mehrheitsentscheid |
| Schattierung | Puffer, Licht, Palette | Rampen-Index pro Pixel | Lambert + Randlicht, Stufen, optional geordnetes Dithering |
| Oberfläche | Puffer, Genom, Absichts-Markierungen | geänderte Rampen-Indizes, Details | Rauschen im Körperraum, Zellautomaten-Wucherungen, Augen/Maul als Regeln |
| Aufräumregeln | Index-Bild | Index-Bild | Einzelpixel, Treppen, Banding, Lücken, Doppel-Kanten, je Regel einzeln abschaltbar |
| Umriss | Index-Bild | Index-Bild | selektiver Umriss (dunkler Ton der angrenzenden Rampe), Außenumriss |
| Ausgabe | Index-Bild, Palette | `Image` / `SpriteFrames` | einmal beim Laden pro Gegner und Animation |

Wichtig: Bis kurz vor Schluss wird mit **Rampen-Indizes** gearbeitet, nicht mit RGB. Paletten tauschen ist dann trivial, und Aufräumregeln können über „heller/dunkler“ entscheiden.

## Festlegungen

- **Engine:** Godot 4, GDScript. Der Generator-Kern hat keine Abhängigkeit zum Editor und läuft auch im Spiel.
- **Größen:** normale Gegner 64×80, Füße bei (32, 78); Bosse 160×140 (wie im Prototyp). Größe ist ein Parameter, nicht fest verdrahtet.
- **Determinismus:** gleicher Seed + gleiches Genom = bitgleiches Bild. Eigener RNG (z. B. PCG32 oder xorshift), nie `randi()`/`randf()` global, nie Zeit oder Reihenfolge von Dictionaries als Zufallsquelle.
- **Kein Bild-Material im Generator:** Es gibt keine PNG-Bauteile. Erlaubt sind Paletten (Farbwerte) und Test-Referenzbilder.
- **Leistung:** Ein Gegner mit 4 Animationen × 8 Bildern soll beim Laden unter ~100 ms auf einem normalen PC brauchen. Erst messen, dann optimieren (ggf. Teile als Shader).

## Ordner (geplant)

```
game/addons/spritegen/
  core/            Stufen als reine GDScript-Klassen (rng.gd, genome.gd, skeleton.gd, pose.gd, raster.gd, shade.gd, surface.gd, cleanup.gd, outline.gd, frames.gd)
  bodyplans/       Körperbau-Grammatiken als Daten (JSON) + kleine Regel-Skripte
  palettes/        Farbrampen als JSON
  editor/          Editor-Plugin (Dock, Gizmos, Pinsel, Mini-Pixelmodus, Evolutions-Raster)
  cli/             Headless-Skripte: Kontaktbögen rendern, Golden-Tests
  tests/           GUT-Tests
  golden/          Referenzbilder für feste Seeds
docs/spritegen/sheets/   Kontaktbögen pro Etappe (Nachweis für Menschen)
```

## Datenformate (Entwurf)

Genom:
```json
{"v":1,"seed":4711,"plan":"biped","zone":"hafen","palette":"tiefsee",
 "params":{"height":0.7,"bulk":0.4,"neck":0.2,"arms":2,"tentacles":0,"asym":0.1},
 "marks":[{"kind":"eye","bone":"head","u":0.4,"v":0.3,"r":1.5}],
 "fixes":[{"bone":"torso","u":0.52,"v":0.61,"ramp":2},{"frame":"attack:3","x":30,"y":41,"ramp":0}]}
```
- `marks` = Malen mit Absicht (Augen, Wucherung, Rost …), verankert in Körperkoordinaten eines Knochens.
- `fixes` = Mini-Pixelmodus. Standard: am Knochen verankert. Ausnahme: „nur dieses Bild“ mit Bildnummer.
- Versionsfeld `v` ist Pflicht. Ändert sich die Bedeutung eines Parameters, steigt `v`, und alte Genome bekommen eine Migration.

Körperbauplan (Idee): Grammatik aus Regeln wie „Rumpf → Hals? Kopf, Gliedmaßen-Paare 0–3, Schwanz?“ mit Wertebereichen und Anatomie-Bedingungen (Kopf nicht dicker als Rumpf × 1,2, Beine tragen Schwerpunkt …).

## Tests

- **Golden-Tests:** Für jede Stufe 8–16 feste Seeds, Ergebnis als PNG in `golden/`. Test vergleicht bitgenau. Goldens werden nur bewusst neu erzeugt, mit Begründung in `entscheidungen.md`.
- **Regel-Tests:** Jede Aufräumregel bekommt kleine handgebaute Testbilder (wenige Pixel) mit erwarteter Ausgabe.
- **Kontaktbögen:** Pro Etappe ein Bogen mit **aufeinanderfolgenden** Seeds (keine Auswahl), damit Menschen den echten Durchschnitt sehen.
- **Flacker-Maß (ab M5):** Anteil der Randpixel, die zwischen zwei Bildern ohne Bewegung ihren Wert ändern. Muss sinken, nicht steigen.
- Alles läuft headless: `godot --headless --path game --script res://addons/spritegen/cli/...`

## Editor-Werkzeug (M6)

- Vorschau mit Animation, Regler für Parameter, Gelenke ziehen.
- Pinsel „Malen mit Absicht“ (Augen, Wucherung, Rost, Narbe …) → schreibt `marks`.
- Mini-Pixelmodus: Stift, Radierer, Pipette, nur Palettenfarben, Bild vor/zurück, Zwiebelhaut → schreibt `fixes`.
- Evolutions-Raster: 12 Kinder, auswählen, weiterzüchten.
- Export: Genom-JSON, PNG-Sheet, `SpriteFrames`-Ressource.
- Für große Pixelarbeit: Export nach Pixelorama/Aseprite, nur für eingefrorene Gegner.

## Hintergründe (M6, Grundstufe)

WFC für Bauwerke, Mauern, Boden aus kleinen eigenen Beispielkacheln. Rauschen für Himmel, Wasser, Nebel. L-Systeme für Bäume. Animation über Parallax-Ebenen und Partikel in Godot.
