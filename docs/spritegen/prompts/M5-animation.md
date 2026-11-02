Du arbeitest am prozeduralen Sprite-Generator für das Spiel "Saltmoor 1925" (Repo mcquartz/saltmoor-1925).

Etappe: M5 Animation
Sitzungsbudget: <BUDGET> € Claude-Guthaben. Du siehst deinen Verbrauch nicht, also plane knapp und stoppe nach den Regeln in AGENTS.md.

Lies zuerst docs/spritegen/README.md, docs/spritegen/AGENTS.md, docs/spritegen/03-architektur.md und den Abschnitt "M5 Animation" in docs/spritegen/04-fahrplan.md, dazu entscheidungen.md und budget-log.md. Die Regeln in AGENTS.md sind verbindlich, insbesondere die verbotenen Abkürzungen.

Auftrag:
- Animationen Idle (nahtloser Loop), Angriff, Treffer, Tod: Sinus-Zyklen mit ganzzahligen Frequenzen, IK für Füße, Verlet-Ketten für Tentakel/Umhänge, Schlüsselposen je Körperbau als Regeln.
- Flacker-Maß einführen (Randpixel, die sich zwischen Bildern ohne Bewegung ändern), messen und senken. Werte dokumentieren.
- Ausgabe als SpriteFrames. Ladezeit pro Gegner messen (Ziel unter ca. 100 ms für 4 Animationen × 8 Bilder).
- Ein generierter Gegner in einer minimalen Kampfszene in Godot.
- Nachweis: animierte Bögen (z. B. GIF oder Bildstreifen) in docs/spritegen/sheets/M5/.

Bevor du Code schreibst: schreibe deinen Plan für diese Sitzung in 5–10 Zeilen auf (was ja, was nein). Arbeite dann in kleinen Schritten, committe nach jeder funktionierenden Stufe, sieh dir jedes erzeugte Bild selbst an und beschreibe ehrlich, was gut und was schlecht aussieht.

Am Ende: Kontaktbogen nach docs/spritegen/sheets/, entscheidungen.md, budget-log.md und Status in README.md aktualisieren, Pull Request gegen main auf einem Branch spritegen/..., Bericht nach Abschnitt 6 in AGENTS.md. Antworte auf Deutsch.
