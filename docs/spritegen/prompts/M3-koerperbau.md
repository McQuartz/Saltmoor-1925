Du arbeitest am prozeduralen Sprite-Generator für das Spiel "Saltmoor 1925" (Repo mcquartz/saltmoor-1925).

Etappe: M3 Körperbaupläne
Sitzungsbudget: <BUDGET> € Claude-Guthaben. Du siehst deinen Verbrauch nicht, also plane knapp und stoppe nach den Regeln in AGENTS.md.

Lies zuerst docs/spritegen/README.md, docs/spritegen/AGENTS.md, docs/spritegen/03-architektur.md und den Abschnitt "M3 Körperbaupläne" in docs/spritegen/04-fahrplan.md, dazu entscheidungen.md und budget-log.md. Lies außerdem docs/spritegen/zielbild.md und sieh dir die Beispielbilder in docs/spritegen/zielbild/ an: das ist der Look, auf den der Generator hinarbeitet. Die Regeln in AGENTS.md sind verbindlich, insbesondere die verbotenen Abkürzungen.

Auftrag:
- Baue fünf Körperbau-Grammatiken (Zweibeiner, Klumpen, Schwebend, Krabbler, Wurm) als Daten plus kleine Regel-Skripte, mit Anatomie-Bedingungen statt fester Teile.
- Zonen-Regeln (hafen, wald, kapelle, grund) steuern Paletten und Wertebereiche.
- Kontaktbogen je Körperbau mit 64 aufeinanderfolgenden Seeds. Achte darauf, dass sich Silhouetten deutlich unterscheiden, nicht nur Farben.
- Wenn ein Körperbau überwiegend unbrauchbare Ergebnisse liefert, sag das offen und schlage Regeln vor, statt Seeds auszuwählen.

Bevor du Code schreibst: schreibe deinen Plan für diese Sitzung in 5–10 Zeilen auf (was ja, was nein). Arbeite dann in kleinen Schritten, committe nach jeder funktionierenden Stufe, sieh dir jedes erzeugte Bild selbst an und beschreibe ehrlich, was gut und was schlecht aussieht.

Am Ende: Kontaktbogen nach docs/spritegen/sheets/, entscheidungen.md, budget-log.md und Status in README.md aktualisieren, Pull Request gegen main auf einem Branch spritegen/..., Bericht nach Abschnitt 7 in AGENTS.md. Antworte auf Deutsch.
