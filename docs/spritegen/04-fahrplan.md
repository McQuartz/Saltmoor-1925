# Fahrplan und Budget

Gesamtbudget: ca. **150 €** Claude-Guthaben. Die Beträge pro Etappe sind Schätzungen. Was tatsächlich verbraucht wurde, steht in [budget-log.md](budget-log.md). Eine Etappe darf mehrere Sitzungen haben.

Grundregel: **Jede Etappe endet mit einer Abnahme durch Menschen.** Die nächste beginnt erst danach.

| Etappe | Budget | Prompt |
|---|---|---|
| M1 Technik-Probe | 10 € | [prompts/M1-technik-probe.md](prompts/M1-technik-probe.md) |
| M2 Kern in Godot | 25 € | [prompts/M2-kern.md](prompts/M2-kern.md) |
| M3 Körperbaupläne | 30 € | [prompts/M3-koerperbau.md](prompts/M3-koerperbau.md) |
| M4 Oberfläche und Details | 20 € | [prompts/M4-oberflaeche.md](prompts/M4-oberflaeche.md) |
| M5 Animation | 30 € | [prompts/M5-animation.md](prompts/M5-animation.md) |
| M6 Editor-Werkzeug und Hintergründe | 25 € | [prompts/M6-editor-hintergruende.md](prompts/M6-editor-hintergruende.md) |
| Reserve | 10 € | – |

## M1 Technik-Probe (10 €)

Frage: Sieht Skelett → Volumen → Schattierung → Aufräumen nach Pixel-Art aus oder nach gerendertem 3D?

- Ein Körperbau (Zweibeiner), statisch, 64×80.
- Skelett aus Parametern, Rastern per SDF mit glattem Minimum, Lambert-Schattierung auf 4er-Rampe, 3 Aufräumregeln, Außenumriss.
- Headless-Render eines Kontaktbogens: 16 aufeinanderfolgende Seeds, jeweils mit und ohne Aufräumregeln nebeneinander.

**Abnahme:** Ace/Philipp schauen den Bogen an und entscheiden: weiter, nachbessern oder Weg ändern. Kein vorgezeichnetes Teil im Code. Ergebnis bitgleich bei erneutem Lauf.

## M2 Kern in Godot (25 €)

- Alle Stufen als Klassen nach [03-architektur.md](03-architektur.md), eigener RNG, Genom-JSON mit Version, Paletten-JSON.
- GUT eingerichtet, Golden-Tests je Stufe, Regel-Tests für die Aufräumregeln, CLI für Kontaktbögen.
- Code aus M1 wird übernommen, aufgeräumt, nicht neu erfunden.

**Abnahme:** Tests grün headless, Kontaktbogen wie M1 oder besser, README im Addon erklärt die Stufen.

## M3 Körperbaupläne (30 €)

- Fünf Grammatiken: Zweibeiner, Klumpen, Schwebend, Krabbler, Wurm. Anatomie-Regeln statt fester Teile.
- Zonen-Regeln (Hafen, Wald, Kapelle, Grund) beeinflussen Paletten und Wertebereiche.
- Kontaktbogen pro Körperbau mit 64 aufeinanderfolgenden Seeds.

**Abnahme:** Pro Körperbau ist mindestens die Hälfte der 64 Seeds für Ace/Philipp „brauchbar“. Silhouetten unterscheiden sich deutlich (nicht nur Farbe).

## M4 Oberfläche und Details (20 €)

- Rauschen im Körperraum (Haut, Schuppen, Schleim), Zellautomaten-Wucherungen, Augen und Mäuler als formabhängige Regeln.
- Datenmodell `marks` (Malen mit Absicht) mit Verankerung an Knochen, im Generator umgesetzt (Editor-Oberfläche kommt in M6).

**Abnahme:** Kontaktbogen vorher/nachher, Markierungen sitzen in jeder Pose an der richtigen Stelle (Testbild mit 3 Posen).

## M5 Animation (30 €)

- Idle (Loop), Angriff, Treffer, Tod. Sinus-Zyklen, IK für Füße, Verlet-Ketten für Tentakel/Umhänge, Schlüsselposen je Körperbau.
- Flacker-Maß eingeführt und gesenkt. `SpriteFrames`-Ausgabe.
- Einbau-Test: ein generierter Gegner in einer einfachen Kampfszene in Godot.

**Abnahme:** Loops nahtlos, Ace/Philipp finden die Bewegung „lebendig“, Flacker-Maß dokumentiert.

## M6 Editor-Werkzeug und Hintergründe (25 €)

- Editor-Plugin: Vorschau, Regler, Gelenke ziehen, Pinsel „Malen mit Absicht“, Mini-Pixelmodus (Korrektur am Knochen, optional nur ein Bild), Evolutions-Raster, Export. (Mini-Pixelmodus ca. 5 €, Absichts-Pinsel ca. 5 €.)
- Hintergründe Grundstufe: WFC aus eigenen Beispielkacheln, Rauschen für Himmel/Wasser/Nebel.

**Abnahme:** Ace kann ohne Hilfe einen Gegner erzeugen, Augen hinmalen, einen Pixel korrigieren und exportieren.

## Nicht im Umfang

Bosse (bleiben Handarbeit), vollwertiges Malprogramm, 3D-Pipeline, KI-Bildmodelle jeder Art.
