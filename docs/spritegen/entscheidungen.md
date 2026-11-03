# Entscheidungen

Neueste oben. Jede Sitzung trägt hier ein, was sie festgelegt hat und warum.

| Datum | Entscheidung | Warum |
|---|---|---|
| 2026-11-03 | M1 als **JavaScript-Referenz** in `tools/spritegen/` statt in Godot (Mensch hat ausdrücklich entschieden) | Godot-Download in der Cloud-Sitzung war gesperrt; Algorithmen sind engine-unabhängig und werden in M2 nach GDScript portiert. Ziel bleibt Godot. |
| 2026-11-03 | Keine neue Abhängigkeit: nur Node-Bordmittel (`node:zlib` für PNG, `node:test` für Tests) | Regel aus AGENTS.md |
| 2026-11-03 | RNG = splitmix32 mit `fork(name)` je Parameter | nur 32-Bit-Ganzzahl-Arithmetik, leicht portierbar; neue Parameter verschieben alte Werte nicht |
| 2026-11-03 | Verschmelzung per glattem Minimum nur innerhalb von Gruppen (Rumpf, Kopf+Hals, je Gliedmaße), hartes Minimum zwischen Gruppen | sonst kleben Arme und Kopf am Rumpf („Gurke“), erster Lauf hat das gezeigt |
| 2026-11-03 | Banding-Regel greift nur, wenn beide Nachbarbänder ≥ 2 px breit sind | sonst fallen Verläufe aus 1-px-Stufen zusammen und Töne werden übersprungen (Regel-Test) |
| 2026-11-03 | Innenkante (Tiefensprung ≥ 2,5 px zwischen Gruppen → dunkelste Stufe) als Teil der Umriss-Stufe | Arme vor dem Rumpf sonst unlesbar |
| 2026-11-03 | Goldens erstmals erzeugt: `tools/spritegen/golden/`, Seeds 1–8, 100, 4711, je roh und aufgeräumt | Startstand M1 |
| 2026-11-02 | Mini-Pixelmodus kommt ins Werkzeug, Korrekturen standardmäßig am Knochen verankert | Ace will im Notfall Pixel ändern können; Verankerung verhindert Verlust beim Neugenerieren |
| 2026-11-02 | Kein eigenes Malprogramm, große Pixelarbeit in Pixelorama/Aseprite | Aufwand; fertige Werkzeuge sind gut |
| 2026-11-02 | „Malen mit Absicht“ (Augen, Wucherung … markieren) ist Teil des Editors | erlaubt Eingriffe ohne Pixel-Können |
| 2026-11-02 | Hauptweg: Skelett + Volumen + automatische Schattierung + Aufräumregeln | einziger Weg mit neuen Silhouetten, die lesbar bleiben |
| 2026-11-02 | Keine KI-Bilder als Eingabe, Vorlage oder Trainingsmaterial | Steam-Kennzeichnung, und das Team will es nicht |
| 2026-11-02 | Sprite-Labor (`prototype/lab.html`) ist nicht die Grundlage | nur Kombination vorgezeichneter Teile, wirkt schnell gleich |
| 2026-11-02 | Bosse bleiben Handarbeit | generierte Bosse wirken austauschbar |
