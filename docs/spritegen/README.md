# Sprite-Generator für Saltmoor 1925

Ziel: ein eigener, wiederverwendbarer Generator, der Gegner-Sprites (und später Hintergründe) **Pixel für Pixel aus Regeln** erzeugt, inklusive Animation. Ohne KI-Bildmodelle, ohne vorgezeichnete Körperteile. Dazu ein Editor-Werkzeug, in dem man eingreifen kann, ohne Pixel-Artist zu sein.

Hintergrund: Niemand im Team ist Pixel-Artist, und KI-generierte Grafik soll nicht ins Spiel. Ein Algorithmus, den wir (mit Claude) selbst schreiben, erzeugt eigene Inhalte. Siehe [02-steam-ki.md](02-steam-ki.md).

Budget: rund **150 € Claude-Guthaben** für das ganze Vorhaben. Aufteilung in [04-fahrplan.md](04-fahrplan.md).

## Dateien

| Datei | Inhalt |
|---|---|
| [AGENTS.md](AGENTS.md) | **Pflichtlektüre für jede Claude-Sitzung**: Regeln, verbotene Abkürzungen, Budget, wann stoppen |
| [01-recherche.md](01-recherche.md) | Techniken, Stärken, Grenzen, Referenzen, warum das Sprite-Labor nicht der Weg ist |
| [02-steam-ki.md](02-steam-ki.md) | Steam-KI-Kennzeichnung: was zählt, was nicht |
| [03-architektur.md](03-architektur.md) | Generator-Kette, Datenformate, Ordner in Godot, Editor, Tests |
| [04-fahrplan.md](04-fahrplan.md) | Etappen mit Budget und Abnahmekriterien |
| [entscheidungen.md](entscheidungen.md) | getroffene Entscheidungen mit Begründung |
| [budget-log.md](budget-log.md) | was jede Sitzung gekostet und geschafft hat |
| [prompts/](prompts/) | fertige Start-Prompts pro Etappe zum Kopieren |

## So startet man eine Etappe

1. In [04-fahrplan.md](04-fahrplan.md) die nächste offene Etappe suchen.
2. Den passenden Prompt aus [prompts/](prompts/) in eine neue Claude-Sitzung kopieren, das Sitzungsbudget eintragen.
3. Nach der Sitzung die Kosten in [budget-log.md](budget-log.md) eintragen (die Sitzung trägt Inhalt und Ergebnis ein, die Kosten sieht nur ihr).
4. Ergebnis gegen die Abnahmekriterien prüfen. Erst dann die nächste Etappe.

## Status

| Etappe | Stand |
|---|---|
| Recherche | erledigt (2026-11-02) |
| M1 Technik-Probe | offen |
| M2–M6 | offen |

Das Sprite-Labor (`prototype/lab.html`) ist eine frühe Demo mit kombinierten Bauteilen. Es zeigt Paletten, Animationsloops und Welten-Schichten, ist aber **nicht** die Grundlage des Generators (siehe [01-recherche.md](01-recherche.md)).
