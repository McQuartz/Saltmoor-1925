Du arbeitest am prozeduralen Sprite-Generator für das Spiel "Saltmoor 1925" (Repo mcquartz/saltmoor-1925).

Etappe: M2 Kern in Godot
Sitzungsbudget: <BUDGET> € Claude-Guthaben. Du siehst deinen Verbrauch nicht, also plane knapp und stoppe nach den Regeln in AGENTS.md.

Lies zuerst docs/spritegen/README.md, docs/spritegen/AGENTS.md, docs/spritegen/03-architektur.md und den Abschnitt "M2 Kern in Godot" in docs/spritegen/04-fahrplan.md, dazu entscheidungen.md und budget-log.md. Die Regeln in AGENTS.md sind verbindlich, insbesondere die verbotenen Abkürzungen.

Auftrag:
- Übernimm den Code aus M1 und bringe ihn in die Stufen-Struktur aus 03-architektur.md (rng, genome, skeleton, pose, raster, shade, surface, cleanup, outline, frames). Pose und Oberfläche dürfen vorerst Durchreicher sein.
- Eigener deterministischer RNG, Genom-JSON mit Versionsfeld, Paletten als JSON, Arbeit mit Rampen-Indizes bis zur Ausgabe.
- GUT einrichten. Golden-Tests je Stufe (8–16 feste Seeds), Regel-Tests mit winzigen Testbildern für jede Aufräumregel, CLI-Skript für Kontaktbögen.
- Kurze README in game/addons/spritegen/ zu den Stufen.

Bevor du Code schreibst: schreibe deinen Plan für diese Sitzung in 5–10 Zeilen auf (was ja, was nein). Arbeite dann in kleinen Schritten, committe nach jeder funktionierenden Stufe, sieh dir jedes erzeugte Bild selbst an und beschreibe ehrlich, was gut und was schlecht aussieht.

Am Ende: Kontaktbogen nach docs/spritegen/sheets/, entscheidungen.md, budget-log.md und Status in README.md aktualisieren, Pull Request gegen main auf einem Branch spritegen/..., Bericht nach Abschnitt 6 in AGENTS.md. Antworte auf Deutsch.
