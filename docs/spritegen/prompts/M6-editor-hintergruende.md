Du arbeitest am prozeduralen Sprite-Generator für das Spiel "Saltmoor 1925" (Repo mcquartz/saltmoor-1925).

Etappe: M6 Editor-Werkzeug und Hintergründe
Sitzungsbudget: <BUDGET> € Claude-Guthaben. Du siehst deinen Verbrauch nicht, also plane knapp und stoppe nach den Regeln in AGENTS.md.

Lies zuerst docs/spritegen/README.md, docs/spritegen/AGENTS.md, docs/spritegen/03-architektur.md und den Abschnitt "M6 Editor-Werkzeug und Hintergründe" in docs/spritegen/04-fahrplan.md, dazu entscheidungen.md und budget-log.md. Lies außerdem docs/spritegen/zielbild.md und sieh dir die Beispielbilder in docs/spritegen/zielbild/ an: das ist der Look, auf den der Generator hinarbeitet. Die Regeln in AGENTS.md sind verbindlich, insbesondere die verbotenen Abkürzungen.

Auftrag:
- Godot-Editor-Plugin: Vorschau mit Animation, Regler, Gelenke ziehen, Pinsel 'Malen mit Absicht' (schreibt marks), Mini-Pixelmodus (Stift, Radierer, Pipette, nur Palettenfarben, Bild vor/zurück mit Zwiebelhaut; Korrekturen standardmäßig am Knochen verankert, optional 'nur dieses Bild'; schreibt fixes), Evolutions-Raster mit 12 Kindern, Export (Genom-JSON, PNG-Sheet, SpriteFrames).
- Kein vollwertiges Malprogramm: keine Ebenen, Auswahlen, Pinselformen.
- Hintergründe Grundstufe: Wave Function Collapse aus kleinen eigenen Beispielkacheln (von Hand im Repo gebaut, nicht KI), Rauschen für Himmel/Wasser/Nebel.
- Kurze Bedienungsanleitung für Ace und Philipp in docs/spritegen/editor.md, ohne Fachbegriffe.

Bevor du Code schreibst: schreibe deinen Plan für diese Sitzung in 5–10 Zeilen auf (was ja, was nein). Arbeite dann in kleinen Schritten, committe nach jeder funktionierenden Stufe, sieh dir jedes erzeugte Bild selbst an und beschreibe ehrlich, was gut und was schlecht aussieht.

Am Ende: Kontaktbogen nach docs/spritegen/sheets/, entscheidungen.md, budget-log.md und Status in README.md aktualisieren, Pull Request gegen main auf einem Branch spritegen/..., Bericht nach Abschnitt 7 in AGENTS.md. Antworte auf Deutsch.
