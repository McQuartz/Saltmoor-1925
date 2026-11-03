# Auftrag: spielbarer Prototyp-Run „Saltmoor 1925“

Stand 2026-11-03. Auftraggeber: Ace (Philipp). Ausführung: der Agent von Mo (Moritz), selbstständig über Nacht bzw. einen Tag lang.

**Ziel:** Ein Browser-Prototyp, in dem man **einen kompletten Run spielen kann**, vom Strand bis zum Finale, in fünf festen Akten, mit echter Motivation (Erzählrahmen „Der Sog“, ohne Sog-Mechanik), der abgestimmten Kampf-UI (Variante A), der dynamischen Layer-Musik, wenigen starken Gegnern mit Konzept als KI-Sprites im Ziel-Look, organisch komponierten Hintergründen mit echter Tiefe, Ereignissen und Krämern zwischen den Kämpfen, runübergreifender Progression und einem Dev-Modus, der zeigt, was gerade passiert und warum.

**Zuerst [00-briefing.md](00-briefing.md) lesen**, der Nachtrag von Ace und Mo hat Vorrang vor allem anderen.

Alles, was dafür abgestimmt ist, liegt in diesem Repo. Offene Fragen sind in [02-entscheidungen.md](02-entscheidungen.md) bereits beantwortet. **Der Agent stellt keine Rückfragen**, er entscheidet nach den Regeln in [01-regeln.md](01-regeln.md) und schreibt seine Entscheidungen auf.

## Für Mo: so startest du den Agenten

1. Neue Sitzung mit Schreibzugriff auf `McQuartz/saltmoor-1925` öffnen (Claude Code o. Ä.).
2. Den Text aus [PROMPT.md](PROMPT.md) komplett hineinkopieren. Sonst nichts.
3. Laufen lassen. Der Agent arbeitet die Meilensteine der Reihe nach ab, committet nach jedem Schritt und hält einen Draft-Pull-Request aktuell.
4. Am Ende liegt ein Pull Request mit Bericht, Bildschirmfotos und einer Liste, was gut und was schwach ist.

Wenn die Sitzung abbricht: Eine neue Sitzung mit demselben Prompt starten. Der Agent liest [fortschritt.md](fortschritt.md) und macht dort weiter.

## Dateien

| Datei | Inhalt |
|---|---|
| [00-briefing.md](00-briefing.md) | **Nachtrag mit Vorrang**: fünf feste Akte, keine Sog-Mechanik, Stummfilm nur bei Anlässen, Hintergründe, KI-Sprites, Gegner, Knoten zwischen Kämpfen, Progression, Effekte mit pixelfx |
| [PROMPT.md](PROMPT.md) | Der Start-Prompt für den Agenten, zum Kopieren |
| [01-regeln.md](01-regeln.md) | Arbeitsregeln: keine Rückfragen, Reihenfolge der Quellen, verbotene Abkürzungen, Git, Tests, Bericht |
| [02-entscheidungen.md](02-entscheidungen.md) | Alles Festgelegte auf einen Blick, inklusive der Antworten auf alle offenen Fragen |
| [03-meilensteine.md](03-meilensteine.md) | **Der Plan**: M0 bis M11 mit Aufgaben und Abnahmekriterien |
| [04-welt-und-run.md](04-welt-und-run.md) | Run-Aufbau, die sieben Biome als Steckbriefe, Gegner-Besetzung, Musik je Biom |
| [05-hintergruende.md](05-hintergruende.md) | Wie die neuen Hintergründe gebaut werden: Ebenen, Tiefe, Licht, Lovecraft statt Klischee |
| [06-dev-modus.md](06-dev-modus.md) | Was der Dev-Modus anzeigt und kann |
| [fortschritt.md](fortschritt.md) | Wird vom Agenten geführt: Stand je Meilenstein, Entscheidungen, Probleme |
| [quellen/](quellen/) | Kopien der Konzepte, die sonst nur online lagen: [Der Sog](quellen/der-sog.md), [Layer-Musik](quellen/layer-musik.md), [Aces Wunsch wörtlich](quellen/ace-wunsch.md) |

## Was schon im Repo liegt und verbindlich ist

| Bereich | Wo | Stand |
|---|---|---|
| Ziel-Look der Figuren | [docs/spritegen/zielbild.md](../spritegen/zielbild.md) | abgestimmt (Chorknabe, Hirte, Netzflickerin top) |
| Sprite-Generator: Plan und Regeln | [docs/spritegen/](../spritegen/), vor allem [AGENTS.md](../spritegen/AGENTS.md) | nachrangig, in diesem Auftrag nicht gebraucht |
| Sprite-Generator: Code M1–M6 | Branch `claude/spritegen-implementation-is4a6p` (Godot 4.3, `game/addons/spritegen/`) | gebaut, nicht gemergt, bleibt für später liegen |
| Kampf-UI | [docs/ui/kampf-ui.md](../ui/kampf-ui.md), Entwurf [docs/ui/entwuerfe/kampf-ui-runde2.html](../ui/entwuerfe/kampf-ui-runde2.html) | Variante A ist Ausgangslage |
| Musik | [quellen/layer-musik.md](quellen/layer-musik.md), `prototype/musik.html`, `prototype/js/audio/music.js`, `sfx.js` | Konzept und Labor abgenickt |
| Klangliste | `prototype/klangliste.html`, `prototype/data/audio.json` | Liste der Audiodateien |
| Motivation | [quellen/der-sog.md](quellen/der-sog.md) | nur Erzählrahmen, Sog-Mechanik gestrichen |
| Inhalte | `prototype/artboard.html`, `prototype/ideen.html`, `prototype/data/*.json` | Spielwerte und Ideenkiste |
