# Arbeitsregeln für Auftrag 2

Grundlage sind die Regeln von Auftrag 1: [docs/auftrag/01-regeln.md](../auftrag/01-regeln.md). Sie gelten weiter, **mit diesen Änderungen**. Wo sich etwas widerspricht, gilt diese Datei.

## 1. Keine Rückfragen

Wie bisher: Du bist allein, du hältst nie an. Unklares entscheidest du selbst (Abschnitt 2), schreibst es mit einem Satz Begründung in [fortschritt.md](fortschritt.md) unter „Entscheidungen unterwegs“ und arbeitest weiter. Fragen sammelst du im Bericht.

## 2. Wie du entscheidest

Reihenfolge, das Höhere gewinnt:

1. [00-philip.md](00-philip.md) (Philips Feedback und Antworten wörtlich, die Absicht hinter allem)
2. [02-entscheidungen.md](02-entscheidungen.md)
3. die Konzepte in diesem Ordner: [04-deckbau.md](04-deckbau.md), [05-inhalte.md](05-inhalte.md), [06-ki-bilder.md](06-ki-bilder.md), [07-ui-und-gefuehl.md](07-ui-und-gefuehl.md)
4. [03-meilensteine.md](03-meilensteine.md)
5. Auftrag 1: [docs/auftrag/00-briefing.md](../auftrag/00-briefing.md), dann die übrigen Dateien dort
6. der bestehende Code und `prototype/data/*.json`

Wenn auch das nichts sagt: die Lösung, die den Run **reicher und lesbarer** macht und weniger neue Systeme braucht. Feedback nie als starre Regel lesen, sondern die Absicht suchen.

## 3. Was sich bei den Verboten ändert

- **Bilder mit der besten verfügbaren Methode**: selbst per Skript pixeln, ein Bild-Generator oder beides gemischt, je nachdem, was die besseren Sprites ergibt ([06-ki-bilder.md](06-ki-bilder.md)). Es gibt keine Einschränkung aus Steam-Gründen.
- **Weiter verboten:** KI-Klänge und KI-Musik, fremde Assets (außer pixelfx), neue Abhängigkeiten im Spiel, Weichzeichner und geglättete Skalierung, globaler Zufall für Inhalte, Tests aufweichen.
- **Neu verboten:** die Abkürzungen aus [06-ki-bilder.md](06-ki-bilder.md) Abschnitt 6. Menge durch Umfärben oder Wiederverwenden vortäuschen. Noten schönen.

## 4. Technik

Wie in Auftrag 1, Abschnitt 4. Dazu:

- Neue Daten: `data/handgriffe.json`, neue Felder in `items.json` (`rar`, `kerben`, `eigen`, `preis`, `flavor`), `foes.json` (`kniff`, `beute_satz`), `biomes.json` (`beute_saetze`, `akt`), `balance.json` (`wucht`, Belohnungen, Schleifen). Alles in `prototype/data/README.md` erklären.
- Werkzeuge für Bilder bauen auf `tools/sprites/` auf.
- Der Autospieler und die Bots müssen nach jedem Meilenstein laufen.

## 5. Git

- Branch: `auftrag/run-2`, abgezweigt vom aktuellen `main`. Erzwingt die Sitzung einen anderen Namen, nimm den und schreib es auf.
- Draft-Pull-Request gegen `main` gleich nach M0, nach jedem Meilenstein Beschreibung aktualisieren. **Nie selbst mergen.** Philip will den Stand vor dem Merge sehen.
- Commit nach jedem funktionierenden Schritt, bei den Biomen nach jedem Paket-Schritt. Präfix mit Meilenstein: `M6: Kurhaus – Oberschwester gepixelt und animiert`. Push nach jedem Meilenstein und nach jedem fertigen Biom.
- Bilder für den Bericht nach `docs/auftrag-2/bilder/<Meilenstein>/`.

## 6. Selbst prüfen

Wie in Auftrag 1, Abschnitt 6, dazu:

- **Jedes Bild** bekommt eine Note nach dem Bewertungsbogen ([06-ki-bilder.md](06-ki-bilder.md) Abschnitt 5). Unter 4 wird neu gemacht. Du siehst dir jedes Bild selbst an, bevor du es benotest.
- **Kontaktbogen** jedes Bioms neben den drei Favoriten.
- **Build-Bots** ab M4 nach jedem Meilenstein, 20 Seeds je Build.

## 7. Zeit und Budget

- Nach M3 ist der neue Deckbau spielbar. Danach geht das meiste Budget in die Inhalte (M5 bis M7, dann Zugabe).
- Wenn ein Meilenstein ausufert: auf **Mindestens** bringen, aufschreiben, weiter.
- Wenn das Budget knapp wird: das laufende Biom fertig machen (lieber ein ganzes als zwei halbe), committen, `fortschritt.md` und PR aktualisieren.

## 8. Bericht

Wie in Auftrag 1, Abschnitt 9, dazu:

- Liste aller neuen Gegner, Bosse, Biome mit Note und Bild-Link.
- Siegrate je Build und Niederlagen je Akt.
- Die fünf Dinge, die Philip beim nächsten Spielen zuerst ausprobieren sollte.
