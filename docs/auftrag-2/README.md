# Auftrag 2: tiefer Deckbau und Inhalte in Masse

Stand 2026-11-04. Auftraggeber: Philip (Ace). Ausführung: der Agent von Mo, selbstständig, so lange das Budget reicht.

**Ziel:** Auf dem spielbaren Run aus [Auftrag 1](../auftrag/README.md) aufbauen. Erstens das Deck wirklich aufbauen lassen (Kerben und Handgriffe, Items mit Eigenschaften, Synergien, sechs Builds, mehr Energie-Wege). Zweitens das Spielgefühl schärfen (Wucht, Lebensbalken, Meldungen, Rucksackmodus, Endbildschirm). Drittens und vor allem: **Tonnen von Gegnern, Bossen und Biomen**, mit der besten verfügbaren Methode im bestätigten Look, mit eigener Qualitätskontrolle.

## Für Mo: so startest du den Agenten

1. Optional: Hat Mo einen API-Schlüssel für einen Bild-Generator (z. B. OpenAI, PixelLab), kann er ihn als Umgebungsvariable in der Sitzung hinterlegen. Dann hat der Agent eine Möglichkeit mehr ([06-ki-bilder.md](06-ki-bilder.md) Abschnitt 1). Ohne Schlüssel zeichnet er selbst per Skript.
2. Neue Sitzung mit Schreibzugriff auf `McQuartz/saltmoor-1925`.
3. Den Text aus [PROMPT.md](PROMPT.md) komplett hineinkopieren.
4. Laufen lassen. Bricht die Sitzung ab: neue Sitzung, gleicher Prompt, der Agent macht laut [fortschritt.md](fortschritt.md) weiter.

## Dateien

| Datei | Inhalt |
|---|---|
| [PROMPT.md](PROMPT.md) | Start-Prompt zum Kopieren |
| [00-philip.md](00-philip.md) | Philips Feedback und Antworten wörtlich, die Absicht hinter allem |
| [01-regeln.md](01-regeln.md) | Arbeitsregeln (Änderungen gegenüber Auftrag 1) |
| [02-entscheidungen.md](02-entscheidungen.md) | alles Festgelegte auf einen Blick, auch Mos offene Fragen |
| [03-meilensteine.md](03-meilensteine.md) | **der Plan**: M0 bis M9 und Zugabe |
| [04-deckbau.md](04-deckbau.md) | Kerben und Handgriffe, Items neu, Schlagworte, Energie, Belohnungen, sechs Idealbuilds, Zielwerte |
| [05-inhalte.md](05-inhalte.md) | Mengen, die fünf Akte mit mehr Biomen, 10 neue Biome als Steckbriefe, Wächter, Gegner-Ideen, Kniffe, Ereignisse |
| [06-ki-bilder.md](06-ki-bilder.md) | Bilder mit der besten Methode: Wege, Pipeline bis zum Sprite-Sheet, Bewertungsbogen, verbotene Abkürzungen |
| [07-ui-und-gefuehl.md](07-ui-und-gefuehl.md) | alle klaren UI- und Gefühl-Punkte |
| [fortschritt.md](fortschritt.md) | führt der Agent |

Weiter verbindlich aus Auftrag 1: [00-briefing.md](../auftrag/00-briefing.md) (soweit hier nichts anderes steht), [05-hintergruende.md](../auftrag/05-hintergruende.md), [06-dev-modus.md](../auftrag/06-dev-modus.md), [docs/spritegen/zielbild.md](../spritegen/zielbild.md), [docs/ui/kampf-ui.md](../ui/kampf-ui.md).
