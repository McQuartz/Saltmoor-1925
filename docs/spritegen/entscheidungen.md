# Entscheidungen

Neueste oben. Jede Sitzung trägt hier ein, was sie festgelegt hat und warum.

| Datum | Entscheidung | Warum |
|---|---|---|
| 2026-11-03 | **Abnahmen M1–M6 übersprungen**, alles in einer Sitzung auf ausdrücklichen Wunsch von Moritz („implement everything until m6“). Jede Etappe hat ihre Kontaktbögen in `sheets/M3`–`M6`; die Abnahme durch Ace/Philipp steht für alle noch aus | Wunsch des Menschen; Fahrplan-Regel „Abnahme vor nächster Etappe“ bleibt für künftige Arbeit |
| 2026-11-03 | **Zielbild (PR #2) übernommen**: Gegenlicht von hinten oben rechts, Randlicht-Linie an der Außenkante, Fase statt Kuppel, dunkle Zonenpaletten aus `zielbild.md`, Bayer-4×4-Dither, kein Außenumriss, leuchtende Augen mit Glühen, 96×120 | Zielbild ist verbindlich ab M2. Geändert: `raster` (Höhenfeld), `shade`, neu `rim`, `details`, Paletten; Goldens neu |
| 2026-11-03 | Rastern **ohne 3D-Strahl**: Silhouette aus dem 2D-projizierten Feld, Höhe mit Fase-Profil, Tiefe analytisch je Knochen (Kapsel), Normalen aus dem Höhenfeld | Zielbild will flache Flächen mit Fase, nicht Kuppeln; der 3D-Strahl war der Hauptkostenfaktor (161 000 Feldabfragen je Bild). Jetzt ~250 ms je Bild bei 96×120 |
| 2026-11-03 | Banding-Regel bei Dither aus, Einzelpixel-Tonregel nur bei Sprüngen ≥ 2 Stufen | Dither ist gewollte ±1-Struktur; die alten Regeln hätten ihn zerstört |
| 2026-11-03 | Ab M2 **nur Godot**; `tools/spritegen/` (JS) bleibt als eingefrorene M1-Referenz | zwei bitgleiche Implementierungen hätten M2–M6 verdoppelt |
| 2026-11-03 | Kein GUT; eigener Test-Runner `cli/test.gd` (126 Prüfungen) + `cli/test_editor.gd` | keine neue Abhängigkeit; Runner reicht, Exit-Code für CI |
| 2026-11-03 | Körperbaupläne als JSON (Parameter, Bereiche, Augenzahl) + Regel-Skript je Plan; **keine Zufallszahlen in den Plänen** (Beulen-/Tentakelverteilung aus Index und Parametern) | Regler im Editor verändern Figuren stetig; Determinismus |
| 2026-11-03 | Zonen-Regeln in `bodyplans/zones.json`: Paletten, Oberflächenmuster, Wertebereiche je Parameter (`*` oder je Plan) | Fahrplan M3 |
| 2026-11-03 | Posen im Plan (`pose_vars`), nicht als Nachbearbeitung; Einpass-Maßstab aus der Ruhepose, Endpunkte in den Bildrand geklemmt | sonst springt die Figurgröße zwischen Bildern bzw. läuft aus dem Bild |
| 2026-11-03 | Verlet-Ketten: zwei Zyklen simuliert und linear gemischt (Loop-Mischung) | nahtloser Idle-Loop trotz Physik |
| 2026-11-03 | Flacker-Maß = geänderte Randpixel / Randpixel zwischen aufeinanderfolgenden Bildern; zusätzlich „still“ (Idle mit Amplitude 0,15) als reines Raster-Flackern. Startwerte stehen in `sheets/M5/README.md` | Fahrplan M5; muss künftig sinken |
| 2026-11-03 | Oberfläche im Körperraum (u entlang, v um die Achse, periodisch), Wucherungen per Zellautomat auf der Körpermaske | Muster bleiben in jeder Pose an der Stelle |
| 2026-11-03 | Hintergründe: Overlapping-WFC N=2 aus **eigenen** 6–12 px Beispielkacheln (Ziegel, Stein, Planken, Fels) im Code, Rauschen für Himmel/Nebel/Wasser, Ebenen mit Parallax-Faktor | Fahrplan M6; keine fremden Assets |
| 2026-11-03 | Goldens neu erzeugt (15 Genome × roh/fertig + 5 Posen) | komplette Kette geändert (Zielbild, 96×120) |
| 2026-11-03 | Sprites werden **vorab erzeugt** (Export im Dock → `SpriteFrames`), nicht beim Laden im Spiel | 250 ms je Bild; Erzeugung beim Laden verfehlt die 100 ms |
| 2026-11-03 | Godot **4.3-stable** (offizielle Linux-Version) für headless Render und Tests | Version für AGENTS.md notiert; Download wurde in der Sitzung freigegeben |
| 2026-11-03 | M1 nach Godot portiert (`game/addons/spritegen/`), bitgleich zur JS-Referenz; JS bleibt als schnelle Vergleichs-Implementierung | gleicher Index-Hash über alle 32 Bilder des Bogens, Godot-Tests prüfen gegen dieselben Goldens |
| 2026-11-03 | Positionen in GDScript als Float-Arrays (64 Bit), nicht `Vector3` | `Vector3` hat nur 32 Bit, wäre nicht bitgleich |
| 2026-11-03 | Supersampling nur, wo die 3×3-Nachbarschaft der Pixelmitten gemischt ist | ~2× schneller, über 64 Seeds bitgleich zum vollen Supersampling (Goldens unverändert) |
| 2026-11-03 | Vorerst eigener kleiner Test-Runner (`cli/test.gd`) statt GUT | keine neue Abhängigkeit in M1; GUT laut Fahrplan in M2 |
| 2026-11-03 | **Offen (Mensch entscheidet):** Leistung. GDScript braucht ~1,4 s je Bild, Ziel war < 100 ms für 32 Bilder. Möglichkeiten: Sprites beim Bauen/im Editor vorab erzeugen und als PNG/`SpriteFrames` speichern; Shader; GDExtension (C++) | Architektur trägt für Erzeugung beim Laden so nicht |
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
