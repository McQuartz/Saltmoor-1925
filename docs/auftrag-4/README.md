# Auftrag 4: Der fertige Look

Stand 2026-11-14. Auftraggeber: Philip (Ace). Ausführung: offen (Mo oder Philip), immer mit demselben Start-Prompt.

**Ziel:** Das Spiel soll nicht mehr nach Prototyp aussehen. Der Pixelstil bleibt, es gibt keinen Stilbruch. Der Kampf bekommt Tiefe (die Gegner stehen im Raum statt vor einem Hintergrund), eine neue Kampfoberfläche mit Fußleiste und Schultern, Bewegung beim Spielen und die anderen Bildschirme werden zu Szenen statt Kästen. Dazu kommt getrennt davon der Block „Momentum im Build-Flow“ (drei kleine Regel-Hebel).

Grundlage ist der Stand auf `main` (Auftrag 3 komplett, Charaktere, Wachswalze, PR #27). Der Plan fasst sieben Look-Runden zusammen und löst alle Widersprüche zu Auftrag 3 auf.

## Wer führt aus

Ein **Opus-Agent auf mittlerer Effort-Stufe** ist der Dirigent. Er liest, plant, verteilt, prüft und baut zusammen. Für abgegrenzte Arbeit startet er **Sonnet- und Haiku-Sub-Agenten** nach den Regeln in [../auftrag-3/08-dirigent.md](../auftrag-3/08-dirigent.md). Der Dirigent bleibt für jede Zeile verantwortlich, die im Branch landet.

## So startest du den Agenten (Mo oder Philip)

1. Neue Claude-Code-Sitzung mit Schreibzugriff auf `McQuartz/saltmoor-1925`, Modell **Opus**, Effort **mittel**.
2. Den Text aus [PROMPT.md](PROMPT.md) komplett hineinkopieren.
3. Laufen lassen. Bricht die Sitzung ab: neue Sitzung, gleicher Prompt. Der Agent macht laut [fortschritt.md](fortschritt.md) weiter.
4. Ergebnis kommt als **Draft-Pull-Request**. Gemergt wird erst, wenn Philip den Stand gesehen hat.

## Dateien

| Datei | Inhalt |
|---|---|
| [PROMPT.md](PROMPT.md) | Start-Prompt zum Kopieren |
| [00-philip.md](00-philip.md) | Philips Worte aus allen Look-Runden, wörtlich. Die Absicht hinter allem |
| [plan.md](plan.md) | **Der Plan:** was feststeht, zwölf aufgelöste Konflikte, Phasen 0 bis 4 mit Abnahme, Block Momentum, offene Punkte mit Standard |
| [verlauf-look-runden.md](verlauf-look-runden.md) | Die laufende Entscheidungsliste aller sieben Runden (Nachschlagen, wenn im Plan etwas knapp ist) |
| [fortschritt.md](fortschritt.md) | Führt der Agent |
| [vorlagen/](vorlagen/) | Die sieben Mockups als HTML (`look-runde-1` bis `look-runde-7`), dazu Bildschirmfotos der Referenz. **Runde 7 ist die Referenz** für die Kampfoberfläche, Runde 2 (Lichtpult) für die Tiefe, Runde 1 für Bewegung und Bildschirme, Runde 3 für Menü und Bausteine |

Weiter verbindlich: [CLAUDE.md](../../CLAUDE.md), [docs/auftrag-3/01-regeln.md](../auftrag-3/01-regeln.md), [docs/auftrag-3/08-dirigent.md](../auftrag-3/08-dirigent.md), [docs/auftrag-3/09-pruefen.md](../auftrag-3/09-pruefen.md) (soweit hier nichts anderes steht), [docs/auftrag-3/05-oberflaeche.md](../auftrag-3/05-oberflaeche.md) (was der Plan nicht ablöst, gilt weiter), [docs/spritegen/zielbild.md](../spritegen/zielbild.md).

## Die Mockups ansehen

Die Mockups laden Schriften von Google Fonts und Bilder aus ihrem `img/`-Ordner. Am einfachsten im Ordner `docs/auftrag-4/vorlagen/` einen Server starten (`python3 -m http.server 8123`) und `http://localhost:8123/look-runde-7/` öffnen. Die Schalter unter der Bühne zeigen Varianten, Kartenzahl und Raster.

## Die Originale (für Menschen)

- Plan als Doc: https://claude.ai/artifact/4jaQhJLhok8egK5FZVPGKh
- Look-Runden 1 bis 7: [1](https://claude.ai/artifact/SXPDznub9xUQus2wyfbR69), [2](https://claude.ai/artifact/WbQqxBKXneEQj66VkxsWNa), [3](https://claude.ai/artifact/A1WHD8RFyR7Vok4e3YXLEN), [4](https://claude.ai/artifact/Jh9MVgRm2Pt583bnMrnS4D), [5](https://claude.ai/artifact/XZsHduzFxM5qsUpyB73HFz), [6](https://claude.ai/artifact/6JjcEA15DVz9BvN9p7mzkV), [7](https://claude.ai/artifact/CzU1Nz2WyD1omrYD969Cbx)
- Momentum-Einschätzung: https://claude.ai/artifact/CSJrSKXyTVbYrHw5rV8Uwe

Der Agent braucht diese Links nicht. Alles, was er wissen muss, steht in diesem Ordner.
