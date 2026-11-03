# Arbeitsregeln für den Agenten

Diese Regeln gelten für die ganze Arbeit an diesem Auftrag. Wo sie `docs/spritegen/AGENTS.md` widersprechen, gilt diese Datei (Abschnitt „Verhältnis zu AGENTS.md“ unten). Alles andere in AGENTS.md gilt weiter.

## 1. Keine Rückfragen

Ace hat ausdrücklich gesagt: keine Rückfragen, alles soll durchlaufen. Du bist allein. Niemand liest während der Arbeit mit.

- Du hältst nie an, um auf eine Antwort zu warten.
- Unklares entscheidest du selbst (Abschnitt 2), schreibst die Entscheidung mit einem Satz Begründung in [fortschritt.md](fortschritt.md) unter „Entscheidungen unterwegs“ und arbeitest weiter.
- Fragen, die du gern gestellt hättest, sammelst du im Bericht unter „Offene Fragen an Ace und Mo“. Sie halten nichts auf.
- Wenn ein Weg nicht funktioniert, nimmst du den in diesem Auftrag genannten **Ersatzweg** (z. B. M6: kein Bild-Generator verfügbar → Sprites selbst als Pixel-Art zeichnen). Du brichst nur ab, wenn wirklich nichts mehr geht (kein Schreibzugriff, Repo kaputt), und schreibst dann genau auf, warum.

## 2. Wie du entscheidest

Bei Widersprüchen oder Lücken gilt diese Reihenfolge, das Höhere gewinnt:

1. [00-briefing.md](00-briefing.md) (Nachtrag von Ace und Mo, schlägt alles)
2. [02-entscheidungen.md](02-entscheidungen.md) (dort ist alles Festgelegte gesammelt)
3. [quellen/ace-wunsch.md](quellen/ace-wunsch.md) (die Absicht hinter allem)
4. die Meilensteine und Steckbriefe in diesem Ordner
5. [docs/ui/kampf-ui.md](../ui/kampf-ui.md), [docs/spritegen/zielbild.md](../spritegen/zielbild.md), [quellen/layer-musik.md](quellen/layer-musik.md), [quellen/der-sog.md](quellen/der-sog.md) (nur Ton und Welt, keine Regeln)
6. der bestehende Code und `prototype/data/*.json`
7. die Ideenkiste `prototype/data/ideas.json` (nur Vorschläge, noch unbewertet)

Wenn auch das nichts sagt: Nimm die Lösung, die **den Run spielbarer und lesbarer** macht und **weniger neue Systeme** braucht. Feedback nie wörtlich als starre Regel lesen, sondern die Absicht dahinter suchen (z. B. „organisch“ heißt natürlich fließend, nicht „überall rund“).

## 3. Verbotene Abkürzungen

- **Keine KI-Sounds.** Kein Aufruf von Musik- oder Stimmen-Generatoren. Klang entsteht aus WebAudio-Synthese (oder später aus Aufnahmen von Ace).
- **KI-Bilder nur für Gegner-Sprites** (und Item-Sprites, wenn es hilft), nach [00-briefing.md](00-briefing.md) Abschnitt 5 und M6. Jedes Sprite muss die Pixel-Art-Regeln aus `zielbild.md` einhalten und die Regel-Prüfung bestehen. Hintergründe, UI und Effekte entstehen weiter aus Code.
- **Keine fremden Assets** (Sprites, Tilesets, Fonts außer den bereits genutzten Google Fonts, Sounds aus Asset-Packs). CC0-Aufnahmen nur, wenn die Quelle in `data/audio.json` steht; im Zweifel weglassen.
- Die Regel „keine vorgezeichneten Körperteile, alles aus dem Generator“ aus AGENTS.md gilt in diesem Auftrag **nicht** (Briefing Abschnitt 5). Der Generator ist nachrangig und wird nicht gebraucht.
- **Nicht das alte Sprite-Labor als Generator ausgeben.** `prototype/js/procgen/creature.js` und `js/sprites/foes.js` sind Teile-Kombination. Sie dürfen als Rückfall bleiben, bis die neuen Sprites eingebaut sind, und fliegen dann aus dem Spiel (in der Galerie dürfen sie als „alt“ bleiben).
- **Keine Ersatz-Effekte**: kein Weichzeichner, keine geglättete Skalierung, kein Rauschen über alles, um Schwächen zu verstecken. Pixel bleiben scharf (`image-rendering: pixelated`, ganzzahlige Skalierung).
- **Tests nicht aufweichen**: Golden-Tests des Generators nicht löschen oder lockern. Goldens nur bewusst neu erzeugen, mit Eintrag in `docs/spritegen/entscheidungen.md`.
- **Keine neuen Abhängigkeiten** im Spiel (kein npm-Paket, kein Framework, kein Build-Schritt). Der Prototyp bleibt reines HTML/CSS/JS, das über einen einfachen lokalen Server läuft. Für Werkzeuge (Tests, Bildschirmfotos) sind Node-Bordmittel, Playwright/Chromium aus der Umgebung und Godot 4.3 headless erlaubt.
- **Kein globaler Zufall für Inhalte.** Run, Biome, Begegnungen, Gegner, Hintergründe hängen an einem Seed (siehe M1). `Math.random()` nur für reine Kosmetik (Partikel, Funkeln).

## 4. Technik und Architektur

- Der bestehende Aufbau bleibt: Zahlen und Texte in `prototype/data/*.json`, Regeln ohne Grafik in `js/core/`, Ereignisse über den Bus (`js/core/bus.js`), Aussehen und Klang in `js/ui/feedback.js`, Bausteine in `js/ui/components.js`. So bleibt alles nach Godot übertragbar (siehe `game/README.md`).
- Neue Spielwerte immer als Daten, nicht im Code. Neue Datei → Eintrag in `prototype/data/README.md`.
- Jedes neue System meldet, was es tut, über den Bus mit einem **Grund** (`Bus.emit('reaction', {..., why: '...'})`), damit der Dev-Modus es zeigen kann (siehe [06-dev-modus.md](06-dev-modus.md)).
- Der Prototyp muss mit `cd prototype && python3 -m http.server 8000` laufen, in aktuellem Chrome, Firefox und Safari, Bildschirm ab 1280 × 720. Handy ist kein Ziel.
- Keine Fehler in der Browser-Konsole bei einem normalen Run.

## 5. Git

- Branch: `auftrag/prototyp-run`, abgezweigt vom aktuellen `main`. Nie direkt auf `main` pushen, nie selbst mergen.
- Gleich nach M0 einen **Draft-Pull-Request** gegen `main` öffnen und nach jedem Meilenstein die Beschreibung aktualisieren (Stand, Bildschirmfotos, was fehlt).
- Kleine Commits nach jedem funktionierenden Schritt, Nachricht auf Deutsch, Präfix mit Meilenstein: `M3: Dev-Modus zeigt Schadensrechnung`.
- Nach jedem Meilenstein pushen. So geht bei einem Abbruch nichts verloren.
- Bildschirmfotos für den Bericht nach `docs/auftrag/bilder/<Meilenstein>/`, PNG, sprechende Namen.

## 6. Selbst prüfen

- **Autospieler** (M3): spielt Runs im Dev-Modus automatisch durch. Ab M3 läuft nach jedem Meilenstein ein Lauf mit mindestens 20 Seeds. Kein Absturz, keine Konsolenfehler, jeder Run endet (Sieg oder Strand).
- **Bildschirmfotos** mit Playwright und Chromium (vorinstalliert, `require('playwright')`), mindestens: Titel, Figurwahl, Weg-Wahl, Kampf je Biom, Werkstatt, Krämer, Ereignis, Finale, Ende, Dev-Modus offen. Sieh sie dir an.
- **Ehrlich bewerten**: Jeder Meilenstein-Eintrag in `fortschritt.md` sagt in 2–4 Sätzen, was gut aussieht, was schwach ist und was noch fehlt, gemessen an Zielbild und Kampf-UI-Ausgangslage.
- Generator-Tests (`godot --headless`) müssen grün bleiben, falls du doch am Generator arbeitest (nicht vorgesehen).
- Sprite-Regel-Prüfung (M6) läuft nach jedem neuen oder geänderten Sprite.

## 7. Zeit und Budget

Du siehst deinen Verbrauch nicht genau. Darum:

- Die Meilensteine sind so geordnet, dass **nach M5 ein vollständiger Run mit Motivation spielbar ist** (noch mit alter Grafik). Alles danach macht ihn schöner und reicher.
- Plane jeden Meilenstein knapp. Wenn einer deutlich länger dauert als gedacht, bring ihn auf einen sauberen Mindeststand (in den Abnahmekriterien als **Mindestens** markiert), schreib auf, was fehlt, und geh weiter. Hänge nicht stundenlang an einem Detail.
- Große Dateien nur in Ausschnitten lesen. Keine Subagenten, außer für klar abgegrenzte, große Teilaufgaben.

## 8. Verhältnis zu AGENTS.md

Der Generator ist in diesem Auftrag nachrangig (Briefing Abschnitt 5). Falls doch daran gearbeitet wird, gilt [docs/spritegen/AGENTS.md](../spritegen/AGENTS.md) mit diesen Ausnahmen:

- „Stoppe und berichte“ wird zu „nimm den Ersatzweg, schreib es auf, mach weiter“ (Abschnitt 1).
- Abnahme je Etappe durch Menschen entfällt während der Arbeit; Ace und Mo nehmen am Ende den ganzen Pull Request ab.
- Branch-Name ist `auftrag/prototyp-run` statt `spritegen/<etappe>-…`.

## 9. Bericht

Am Ende in den Pull Request und als letzter Abschnitt in [fortschritt.md](fortschritt.md):

1. **Was gebaut wurde**, je Meilenstein 2–5 Punkte, mit Status (fertig / Mindeststand / fehlt).
2. **So spielt man es**: Startbefehl, Testhilfen (`?seed=`, `?dev=1`, …), Tastenkürzel.
3. **Bildschirmfotos** (Links auf `docs/auftrag/bilder/`).
4. **Ehrliche Einschätzung**: Look gegen Zielbild, UI gegen Variante A, Musik, Hintergründe, Spielgefühl. Was ist stark, was ist schwach.
5. **Autospieler-Ergebnis**: Seeds, Gewinnrate, durchschnittliche Tiefe, Fehler.
6. **Entscheidungen unterwegs** (Kurzfassung der Liste aus fortschritt.md).
7. **Offene Fragen an Ace und Mo** und **Vorschlag für die nächste Sitzung**.
