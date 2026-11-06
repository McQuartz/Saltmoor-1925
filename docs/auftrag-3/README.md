# Auftrag 3: Die Tiefe verändert das Spiel

Stand 2026-11-06. Auftraggeber: Philip (Ace). Ausführung: offen (Mo oder Philip), immer mit demselben Start-Prompt.

**Ziel:** Ein neuer spielbarer Prototyp auf dem Stand von Auftrag 2 (`main` ab Commit `80c4ea0`, Merge von PR #14). Er vereint die Ergebnisse von zwei Besprechungen:

1. **Feedback zu Mos Stand** (Welle 1: sieben Fixes, Welle 2: neue Oberfläche). Kampf-HUD Variante 2 mit Stoff-Baum, Gegner gestaffelt, keine Kamera im Kampf, Fahrt nach vorne als Übergang, Peilkarte im Nebel statt „1 aus 3“, Rucksack „Am Körper“ mit Silhouette.
2. **Lovecraft als Mechanik-Quelle V2**: vier Kern-Systeme (die Tiefe biegt die Regeln, Sehen und gesehen werden, die Farbe, Hören statt sehen), vier Begegnungen, die Metaebene über Runs und ein kleiner Vorrat seltener Würze. Alles mit festen Obergrenzen pro Run.

Am Ende soll Philip einen Run spielen können, in dem sich die Tiefe **anders spielt** als die Oberfläche, ohne dass ihm sein Deck zerschossen wird, und in dem die Oberfläche nicht mehr nach Prototyp aussieht.

## Wer führt aus

Ein **Opus-Agent auf mittlerer Effort-Stufe** ist der Dirigent. Er liest, plant, verteilt, prüft und baut zusammen. Für abgegrenzte Arbeit startet er **Sonnet- und Haiku-Sub-Agenten** nach den Regeln in [08-dirigent.md](08-dirigent.md). Der Dirigent bleibt für jede Zeile verantwortlich, die im Branch landet.

## So startest du den Agenten (Mo oder Philip)

1. Neue Claude-Code-Sitzung mit Schreibzugriff auf `McQuartz/saltmoor-1925`, Modell **Opus**, Effort **mittel**.
2. Den Text aus [PROMPT.md](PROMPT.md) komplett hineinkopieren.
3. Laufen lassen. Bricht die Sitzung ab: neue Sitzung, gleicher Prompt. Der Agent macht laut [fortschritt.md](fortschritt.md) weiter.
4. Ergebnis kommt als **Draft-Pull-Request**. Gemergt wird erst, wenn Philip den Stand gesehen hat.

## Dateien

| Datei | Inhalt |
|---|---|
| [PROMPT.md](PROMPT.md) | Start-Prompt zum Kopieren |
| [00-philip.md](00-philip.md) | Philips Worte aus beiden Besprechungen, wörtlich. Die Absicht hinter allem |
| [01-regeln.md](01-regeln.md) | Arbeitsregeln (gelten vor Auftrag 1 und 2) |
| [02-entscheidungen.md](02-entscheidungen.md) | Alles Festgelegte auf einen Blick, dazu die Entscheidungen dieses Plans und was ausgeklammert ist |
| [03-meilensteine.md](03-meilensteine.md) | **Der Plan:** M0 bis M12 und Zugabe, je mit Abnahme |
| [04-welle-1.md](04-welle-1.md) | Die sieben Fixes im Einzelnen, mit Fundstellen im Code |
| [05-oberflaeche.md](05-oberflaeche.md) | Kampf-HUD, Stoff-Baum, Gegner-Aufstellung, Fahrt nach vorne, Peilkarte, Rucksack |
| [06-lovecraft-kern.md](06-lovecraft-kern.md) | Designregeln und die vier Kern-Systeme, alle 14 Regelbiegungen |
| [07-begegnungen-meta-wuerze.md](07-begegnungen-meta-wuerze.md) | Begegnungen, Metaebene, Würze, Dosierung pro Run |
| [08-dirigent.md](08-dirigent.md) | Wie Opus Sonnet und Haiku einsetzt: Zuschnitt, Auftragsvorlage, Prüfung, Verbote |
| [09-pruefen.md](09-pruefen.md) | Tests, Bots, Bilder, Abnahmeprotokoll je Meilenstein |
| [fortschritt.md](fortschritt.md) | Führt der Agent |
| [vorlagen/](vorlagen/) | Die abgenommenen Mockups (HTML zum Anklicken) und Bildschirmfotos der gewählten Varianten |
| [quellen/](quellen/) | Recherche-Notizen zu Lovecraft (Notizbuch, Mythos und 1925) als Textvorrat |

Weiter verbindlich: [CLAUDE.md](../../CLAUDE.md), [docs/auftrag-2/01-regeln.md](../auftrag-2/01-regeln.md) und [docs/auftrag/01-regeln.md](../auftrag/01-regeln.md) (soweit hier nichts anderes steht), [docs/auftrag-2/06-ki-bilder.md](../auftrag-2/06-ki-bilder.md) (Bilder, Bewertungsbogen, verbotene Abkürzungen), [docs/auftrag-2/paket-format.md](../auftrag-2/paket-format.md), [docs/spritegen/zielbild.md](../spritegen/zielbild.md), [docs/ui/kampf-ui.md](../ui/kampf-ui.md).

## Die Originale (für Menschen)

- Feedback sortiert, mit allen UI-Entscheidungen: https://claude.ai/artifact/MUaRxyH8cfpoufbEHbKRu6
- Lovecraft als Mechanik-Quelle V2: https://claude.ai/artifact/FWG927MqdTYPzLGNz5DNhr (V1: https://claude.ai/artifact/AVczqUfFSUPDtEYobHQguc)
- Mockups: HUD A3 https://claude.ai/artifact/DWmvku2ah1yBVktG1rnF1p, Karte Runde 1 https://claude.ai/artifact/MPxX1jaBXsRC76Zjk8J61K, Rucksack Runde B https://claude.ai/artifact/1Hp2jwjuhDFhzxDHSEWJ2h

Der Agent braucht diese Links nicht. Alles, was er wissen muss, steht in diesem Ordner, die Mockups liegen als Datei in [vorlagen/](vorlagen/).
