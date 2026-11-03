# Meilensteine

Der Reihe nach abarbeiten. Jeder Meilenstein endet mit: Abnahmekriterien geprüft, Eintrag in [fortschritt.md](fortschritt.md) (Stand, ehrliche Einschätzung, Entscheidungen), Commit, Push, PR-Beschreibung aktualisiert.

Achtung Namensgleichheit: Die Etappen des Sprite-Generators in `docs/spritegen/` heißen ebenfalls M1–M6 („Mos M1–M6“). Hier sind immer die Auftrags-Meilensteine gemeint, außer es steht „Generator-Etappe“ oder „Mos M…“ dabei.

**Mindestens** markiert den Stand, der reicht, wenn die Zeit knapp wird. Alles andere im Meilenstein ist das Ziel.

Reihenfolge mit Absicht: **Nach M5 ist ein kompletter Run mit Motivation spielbar** (noch mit alter Grafik). M6 bis M10 machen ihn schön und reich. So gibt es auch bei einem Abbruch etwas Spielbares.

| | Meilenstein | Ergebnis |
|---|---|---|
| M0 | Einlesen und Aufräumen | Branch, Mos Generator im Branch, Bestandsaufnahme, Draft-PR |
| M1 | Run-Gerüst | Seed, fünf Akte, Gabelungen, Weg-Wahl, Strand, Ende, Speichern |
| M2 | Kampf-UI Variante A | Kampfbildschirm wie abgestimmt, alle anderen Bildschirme im selben Stil |
| M3 | Dev-Modus und Autospieler | sieht alles, erklärt alles, spielt selbst |
| M4 | Musik im Spiel | Layer-Musik hängt am Spiel, alle sieben Biome, Einstellungen |
| M5 | Sog und Meta | Sog-Leiste, Wandbilder, Tagebuch, Figuren mit Ausrede, Ankunft |
| M6 | Sprite-Pipeline | Generator → PNG-Sheets → Spiel, mit Animation |
| M7 | Gegner-Besetzung | alle Gegner, Wächter und der Finale-Boss im Ziel-Look |
| M8 | Hintergründe | sieben Orte mit Tiefe, neu gebaut |
| M9 | Inhalte und Balance | Items, Ereignisse, Fundpools, Balance per Autospieler |
| M10 | Politur | Übergänge, Effekte, Galerie, Extras |
| M11 | Abschluss | Prüfung, Bildschirmfotos, Bericht |

---

## M0 Einlesen und Aufräumen

**Aufgaben**

1. Alles aus der Leseliste im [PROMPT.md](PROMPT.md) lesen. Dazu einmal den Prototyp starten und kurz spielen (Playwright, Bildschirmfotos), `prototype/artboard.html`, `ideen.html`, `musik.html`, `klangliste.html`, `docs/ui/entwuerfe/kampf-ui-runde2.html` ansehen.
2. Branch `auftrag/prototyp-run` von `main` anlegen.
3. Mos Generator-Branch `origin/claude/spritegen-implementation-is4a6p` in den Auftrags-Branch **mergen**. Konflikte (vor allem `docs/spritegen/*`, `README.md`, `CLAUDE.md`, `prototype/js/procgen/*`, `prototype/lab.html`) so lösen, dass der neuere Stand von `main` für Doku-Texte gilt und Mos Code vollständig erhalten bleibt. Prüfen, ob `game/` mit Godot 4.3 headless lädt und die Generator-Tests (`game/addons/spritegen/cli/test.gd`) laufen. Wenn Godot fehlt: offizielle Linux-Version 4.3-stable laden. Klappt das nicht, notieren (wird in M6 wichtig).
4. Bestandsaufnahme in `fortschritt.md`: was der Prototyp heute kann (Kampf, Reaktionen, Werkstatt, Krämer, Ereignisse, Zonen, Jumpscare, Galerie), was davon bleibt, was umgebaut wird. 10–20 Zeilen.
5. Plan der Sitzung in `fortschritt.md` (5–10 Zeilen).
6. Draft-PR gegen `main` öffnen, Titel „Spielbarer Prototyp-Run (Auftrag)“, Beschreibung: Link auf `docs/auftrag/README.md` und Checkliste M0–M11.

**Abnahme**

- [ ] Branch existiert, Mos Branch ist gemergt, `git log` zeigt den Merge.
- [ ] Prototyp läuft nach dem Merge wie vorher (Bildschirmfoto Kampf).
- [ ] Generator-Tests: Ergebnis notiert (grün, oder warum nicht).
- [ ] `fortschritt.md` hat Bestandsaufnahme und Plan. Draft-PR ist offen.

---

## M1 Run-Gerüst

Quelle: [04-welt-und-run.md](04-welt-und-run.md), Abschnitte 1–3, 7.

**Aufgaben**

1. **Seed:** eigener kleiner Zufallsgenerator (z. B. splitmix32 wie im Generator, mit `fork(name)`), Seed pro Run, `?seed=` in der Adresse, Anzeige im Dev-Modus. Alle Inhaltsentscheidungen (Wege, Begegnungen, Belohnungen, Krämer, Ereignisse, Aufstellung) laufen über ihn. Gleicher Seed + gleiche Entscheidungen = gleicher Run.
2. **Daten:** `data/run.json` (Akte, Gabelungen, Ebenen-Regeln, Knotenarten, Übergangstexte), `data/biomes.json` (sieben Biome: Name, Palette, Musik-Fassung, Gegner, Fundpool, Ereignisse, Szenen-Varianten). `balance.json` → `zones` und `encounters.boss_depth` werden davon abgelöst.
3. **Ablauf** in `js/core/run.js`: Strand (Start) → Figurwahl → fünf Akte mit je vier Ebenen (Pforte zwei) → Weg-Wahl nach jedem Knoten → Wächter am Ende jedes Akts → Finale → Ankunft (Bleiben/Umkehren). Verlieren → „Die Tiefe spuckt dich aus“ → Strand.
4. **Weg-Wahl-Bildschirm:** zwei bis drei Wege mit Zeichen und Hinweistext. Der nächste Akt wird beim Wächter angekündigt („Hinter ihm führt eine Treppe nach unten“).
5. **Figuren:** `data/jobs.json` auf die sechs Startfiguren umbauen (Tabelle in 04, Abschnitt 5), mit Feldern für Ausrede, Wahrheit, Einstieg-Vorliebe, Instrument, Freischaltung. Bis M5 sind alle sechs wählbar.
6. **Neue Biome ohne neue Grafik:** Bis M8 nutzen Salzstollen, Stadt, Eis und Pforte vorläufig die vorhandenen Szenen (`grund`, `kapelle`, …) mit ihrer Palette. Gegner bis M7 aus dem vorhandenen Pool, nach Biom zugeordnet.
7. **Speichern:** Run nach jedem Knoten in `localStorage` sichern, „Fortsetzen“ im Titel.
8. Übergangsbild zwischen Akten (Text auf schwarzem Grund reicht vorerst).

**Abnahme**

- [ ] Ein Run lässt sich von Strand bis Ankunft durchspielen (von Hand mit Dev-Sprüngen oder per Konsole), beide Enden und der Strand nach Niederlage funktionieren.
- [ ] Mit 20 verschiedenen Seeds kommen alle vier Wege vor (Hafen/Moorwald × Salzstollen/Stadt). Gleicher Seed ergibt denselben Weg.
- [ ] Jede Akt-Ebene hält die Regeln aus 04, Abschnitt 3 (Prüfung als kleiner Test in `tools/` oder als Konsolen-Test, der die Knotenlisten für 100 Seeds prüft).
- [ ] Neu laden mitten im Run → „Fortsetzen“ bringt einen an denselben Knoten.
- [ ] Keine Konsolenfehler.
- **Mindestens:** Ablauf mit fünf Akten, Gabelungen, Weg-Wahl, Finale, Strand. Speichern darf fehlen.

---

## M2 Kampf-UI Variante A

Quellen: [docs/ui/kampf-ui.md](../ui/kampf-ui.md) (Tabelle „Ausgangslage“), Entwurfsseite [docs/ui/entwuerfe/kampf-ui-runde2.html](../ui/entwuerfe/kampf-ui-runde2.html) (Variante A), Bild [variante-a.png](../ui/entwuerfe/variante-a.png), Entscheidungen zur UI in [02-entscheidungen.md](02-entscheidungen.md).

**Aufgaben**

1. **Szene** auf 480 × 270 logische Pixel umstellen, ganzzahlig skaliert und zentriert, `image-rendering: pixelated`. Gegner 96 × 120.
2. Den Kampfbildschirm nach der Tabelle „Ausgangslage: Variante A“ umbauen, Punkt für Punkt: Stoff-Pixelzeichen (9 × 9) statt Kürzel, Karten im Art-déco-Stil mit großem Item-Bild und Stoffen klein oben rechts, Hand nebeneinander leicht schief, Reagiert-Zustände (Gold, „? ? ?“ violett, „In sich: …“ blau, zu teuer abgedunkelt), Absicht als Zeichen und Zahl ohne Wort und ohne Neon, Leben-Balken mit Block-Schraffur, Spieler oben links mit Warnung „19 kommen → −11 Leben“, Energie-Rauten und „Zug beenden“ rechts unten mit Stapel und Ablage, Kopfzeile „TIEFE IX · ZUG 3“ mit Zone, Gold, Buch der Reaktionen, Stoffrad unten links (nur Linien zu dem, was jetzt reagiert). Keine Art-déco-Ecken um die Szene.
3. **Versetzte Aufstellung:** drei Tiefenreihen, hinten höher, 90 % Größe, leicht im Nebel, gezeichnet von hinten nach vorne, Aufstellung per Seed mit etwas Zufall, Gegner überdecken sich nie so, dass Absicht oder Balken verdeckt sind.
4. **Schadens-Vorschau** beim Anheben/Ziehen einer Karte (schraffiert auf dem Balken, inklusive Reaktion und Schwachstelle).
5. **Hochreaktions-Zwischentitel** (0,6 s, Art déco).
6. **Stummfilm-Rauschen dezent und selten:** nur bei Anlässen (Hochreaktion, Wächter/Boss erscheint, Sog-Stufenwechsel), höchstens einmal pro Kampf, frühestens alle 3 Minuten, ca. 1,2 s, schwächer als im Entwurf. Werte in `balance.json` → `stummfilm`. Augen behalten ihre Farbe.
7. **Alle anderen Bildschirme** in derselben Formensprache: Titel, Strand, Figurwahl, Weg-Wahl, Belohnung, Werkstatt, Krämer, Ereignis, Rast, Übergang, Ankunft, Tagebuch (Platzhalter bis M5), Einstellungen (Lautstärke Musik/Effekte, Stummfilm an/aus, Jumpscare an/aus, Dev-Schalter).
8. Ausrüstung (Waffen, Kleidung, Talismane, Rucksack) unter der Szene im selben Stil, Ziehen und Ablegen funktioniert wie heute.
9. `gallery.html` zeigt die neuen UI-Bausteine.

**Abnahme**

- [ ] Bildschirmfoto Kampf neben `variante-a.png` gelegt: Jeder Punkt der Tabelle ist umgesetzt oder als Abweichung mit Grund notiert.
- [ ] Stummfilm kommt in einem 10-Minuten-Lauf des Autospielers (ab M3) höchstens bei Anlässen, nie in festem Takt.
- [ ] Schadens-Vorschau stimmt mit dem tatsächlichen Schaden überein (Test über 50 gespielte Karten im Autospieler, ab M3 nachholen).
- [ ] Text und Zahlen sind bei 1280 × 720 lesbar. Keine Konsolenfehler.
- **Mindestens:** Kampfbildschirm Variante A mit Stoffzeichen, Karten, Absichten, Balken mit Block, Energie, Kopfzeile, versetzter Aufstellung. Stoffrad und andere Bildschirme dürfen vereinfacht sein.

---

## M3 Dev-Modus und Autospieler

Quelle: [06-dev-modus.md](06-dev-modus.md).

**Aufgaben**

1. Alle Systeme melden über den Bus mit Grund (`why`): Reaktionen, Schaden (aufgeschlüsselt), Block, Zustände, Gegnerzüge, Set-Boni, Weg-Entscheidungen, Belohnungen, Sog (ab M5), Musik (ab M4).
2. Dev-Panel mit den Reitern Jetzt, Kampf, Run, Musik (Platzhalter bis M4), Log, Cheats. Einblendungen in der Szene.
3. Autospieler, sichtbar und schnell (`?bot=50&seed=1`), plus Kommandozeilen-Skript unter `tools/` mit Playwright.
4. Die in M2 offenen Prüfungen (Schadens-Vorschau, Stummfilm-Häufigkeit) mit dem Autospieler nachholen.

**Abnahme**

- [ ] Für jede Reaktion, die im Kampf passiert, zeigt der Reiter „Jetzt“ den richtigen Satz mit Grund (Stichprobe von 20 Reaktionen in einem Lauf).
- [ ] Offene Kombos auf der Hand stimmen mit dem tatsächlichen Ergebnis beim Spielen überein.
- [ ] Autospieler: 20 Seeds, alle Runs enden (Sieg oder Strand), keine Fehler, Tabelle mit Ergebnis in `fortschritt.md`.
- [ ] Ohne Dev-Modus ist vom Panel nichts zu sehen außer dem kleinen Knopf.
- **Mindestens:** Reiter Jetzt, Run, Log und Cheats (Sprünge), Autospieler schnell.

---

## M4 Musik im Spiel

Quellen: [quellen/layer-musik.md](quellen/layer-musik.md), `prototype/js/audio/music.js`, `prototype/musik.html`, `prototype/data/audio.json`, Entscheidungen zur Musik in [02-entscheidungen.md](02-entscheidungen.md).

**Aufgaben**

1. `music.js` im Spiel laden und über `js/ui/feedback.js` an den Bus hängen: Szene (Menü, Karte/Weg-Wahl, Kampf, Wächter, Finale), Gegnertypen im Kampf (Stimmen-Plätze, Abgesang, Duell), Leben und angekündigter Schaden (Gefahr), eigene Aktionen, Reaktionen, Hochreaktion (Atemholen, dann Tutti), Treffer (kurzes Wegducken), Sieg (Kadenz, dann leer), Niederlage.
2. **Sieben Biom-Fassungen** in `music.js` (bisher Hafen und Kapelle): Tonart, Akkorde, gekippte Folge, Ortsklang, Rhythmus-Instrument nach [04-welt-und-run.md](04-welt-und-run.md). Alles prozedural. `data/audio.json` um die neuen Biome ergänzen, damit die Klangliste sie zeigt.
3. **Gegnerstimmen** für alle Gegner aus der Tabelle in 04, Abschnitt 9 (prozedural; vorhandene vier wiederverwenden).
4. **Rollen-Instrument** nach Startfigur (Spieluhr, Ziehharmonika, Orgel, Trompete, Glasharfe, Klavier).
5. Stoff-Färbung des Mix (dominanter Stoff im Loadout).
6. Biom-Wechsel auf Taktgrenze mit Überblendung, Übergangsbild mit eigenem kurzen Klang.
7. Alle SFX laufen weiter über den gemeinsamen Limiter, tonale SFX folgen `Music.harmony()`.
8. Einstellungen: Lautstärke Musik, Effekte. Musik startet erst nach dem ersten Klick (Browser-Regel).
9. Reiter „Musik“ im Dev-Modus füllen.

**Abnahme**

- [ ] Kein Clipping: Pegel-Messung am Ausgang (AnalyserNode) im Autospieler-Lauf, Spitze unter 0 dBFS, notiert.
- [ ] Tempo bleibt zwischen 80 und 88 BPM, nie mehr als 1 BPM pro Takt (Log-Auswertung).
- [ ] Nichts offkey: Alle Stimmen und tonalen SFX nehmen Töne aus `Music.harmony()` (Code-Prüfung, kurz notiert).
- [ ] Musik reagiert hörbar und sichtbar (Dev-Reiter) auf Kampfbeginn, Tod eines Gegnertyps, letzten Gegner, Hochreaktion, Sieg.
- [ ] Alle sieben Biome haben eine eigene Fassung, im Dev-Modus umschaltbar.
- **Mindestens:** Musik hängt am Spiel mit Hafen, Kapelle und je einer einfachen Fassung für die übrigen fünf Biome.

---

## M5 Sog und Meta

Quellen: [quellen/der-sog.md](quellen/der-sog.md), [04-welt-und-run.md](04-welt-und-run.md) Abschnitte 4–7.

**Aufgaben**

1. **Sog-Leiste** (0–10) mit Spiral-Zeichen oben links, Regeln und Stufen aus 04, Abschnitt 4, Werte in `data/sog.json`. Trugbild-Karte, Stärke-kostet-Verstand, Ertrinken. Sog speist die Gefahr-Achse der Musik.
2. **Wandbild-Knoten** mit prozeduralem Relief (vorläufig einfach, in M8 im Stil der Hintergründe) und Text auf abgerissenem Zettel. **21 Fragment-Texte** schreiben (drei je Biom), Regeln in 04, Abschnitt 6.
3. **Meta-Speicher** `saltmoor.meta.v1`: Fragmente, Freischaltungen, Tagebuch-Statistik.
4. **Figurwahl** am Strand: Figur, Ausrede, Set, Startdeck-Vorschau; gesperrte Figuren mit „… Fragmente“.
5. **Tagebuch** im Titel.
6. **Ankunft** nach dem Finale mit Bleiben/Umkehren und der Wahrheit der Figur.
7. **Strand** nach Niederlage mit Zusammenfassung und neuen Freischaltungen.
8. Ereignisse (vorhandene) um Sog-Preise ergänzen, wo es passt.

**Abnahme**

- [ ] Autospieler-Lauf über 20 Seeds: Sog erreicht im Schnitt Stufe „Flüstern“ bis „Ruf“ im späten Run, selten 10. Werte notiert und bei Bedarf angepasst.
- [ ] Fragmente bleiben nach Neuladen erhalten, Freischaltungen greifen, Dev-Reset setzt alles zurück.
- [ ] Beide Enden und der Strand zeigen die richtigen Texte der Figur.
- [ ] Die 21 Fragment-Texte stehen auch als Liste in `docs/auftrag/fragmente.md` (zum Gegenlesen für Ace).
- **Ab hier ist ein kompletter Run mit Motivation spielbar.** Bildschirmfotos von Strand, Figurwahl, Weg-Wahl, Kampf, Wandbild, Ankunft nach `docs/auftrag/bilder/M5/`.
- **Mindestens:** Sog-Leiste mit zwei Stufen, Wandbilder mit Texten, Ankunft, Strand. Tagebuch darf schlicht sein.

---

## M6 Sprite-Pipeline

Quellen: [docs/spritegen/](../spritegen/) (AGENTS.md, 03-architektur.md, zielbild.md, entscheidungen.md), Mos Code `game/addons/spritegen/`, `docs/spritegen/sheets/M3`–`M6`.

**Aufgaben**

1. Mos Kontaktbögen M3–M6 ansehen und ehrlich gegen das Zielbild bewerten (in `fortschritt.md`): Wo stimmt der Look (Randlicht, Fase, dunkle Körper, Dither, Augen), wo nicht (Silhouetten, Lesbarkeit, Flackern laut `sheets/M5/README.md`).
2. **Export-Weg** bauen: Ein Kommandozeilen-Skript rendert für eine Liste von Gegnern (aus `data/foes.json` → `generator`) die Animationen Idle, Angriff, Treffer, Tod als **PNG-Sheets mit JSON-Beschreibung** (Bildgröße, Bildzahl, Bildrate, Fußpunkt, Augenpositionen für Glühen, Kopfpunkt für die Absicht) nach `prototype/assets/gegner/`. Bevorzugt: Godot 4.3 headless mit Mos Generator. Ergebnisse werden committet (die Erzeugung ist deterministisch und dokumentiert, also kein Fremd-Asset).
3. **Ersatzweg**, falls Godot nicht läuft: den Generator nach JavaScript portieren (aufbauend auf Mos M1-Referenz `tools/spritegen/`, Node-Bordmittel), gleiche Kette und Regeln, als Skript unter `tools/spritegen/`. Eintrag in `docs/spritegen/entscheidungen.md`. Bitgleichheit zu Godot ist dann kein Ziel, Determinismus schon.
4. **Lader im Prototyp:** `js/sprites/` lädt Sheets, spielt Animationen (Idle-Loop, Angriff beim Gegnerzug, Treffer beim Treffer, Tod), Augen glühen gedithert, Zonenfarbe aus dem Biom. Das alte Teile-Labor (`creature.js`, `foes.js`) fliegt aus dem Kampf.
5. Flackern senken, wenn es im Spiel stört (Hebel aus `sheets/M5/README.md`: Dither im Körperraum verankern, Randlicht mit Hysterese, Bewegung auf ganze Pixel runden). Goldens dabei bewusst neu erzeugen und notieren.

**Abnahme**

- [ ] Ein Befehl erzeugt alle Sheets neu, zweimal ausgeführt ergeben sich identische Dateien.
- [ ] Generator-Tests grün (Godot) bzw. eigene Tests für den Port grün.
- [ ] Im Kampf laufen Idle, Angriff, Treffer, Tod sichtbar und ruhig (Bildschirmfoto-Serie oder kurzes GIF aus Einzelbildern in `docs/auftrag/bilder/M6/`).
- [ ] Silhouetten-Test: Jeder exportierte Gegner schwarz gefüllt bleibt erkennbar (Kontaktbogen mit Silhouetten in `docs/auftrag/bilder/M6/`).
- **Mindestens:** Pipeline für Idle und Tod, drei Gegner im Spiel.

---

## M7 Gegner-Besetzung

Quellen: [04-welt-und-run.md](04-welt-und-run.md) Abschnitte 8–9, [zielbild.md](../spritegen/zielbild.md).

**Aufgaben**

1. **Archetypen** für alle Gegner aus den Steckbriefen als Generator-Vorgaben anlegen: Körperbauplan (biped, blob, crawler, floater, worm, bei Bedarf ein neuer Plan nach denselben Regeln), Parameterbereiche, Merkmale als Regeln („drei gestapelte Köpfe“, „Geweih mit leuchtenden Knoten“, „Mund senkrecht in der Brust“, „Kopf aufgeplatzt mit Tentakeln“, „zu lange Glieder, die abknicken“). **Keine Koordinaten aus den Zielbild-Bildern übernehmen.**
2. Je Gegnertyp **Varianten per Seed** (gleicher Typ, leicht anders), damit zwei Kultisten nicht identisch sind.
3. **Wächter** je Biom: größer (bis 128 × 160 erlaubt), eigener Archetyp, Besonderheit im Muster.
4. **Finale-Boss „Das, was ruft“**: Handarbeit mit derselben Render-Kette (Formen im Code erlaubt), mehrere Phasen mit sichtbarer Veränderung, „Augen im Rand“ als Helfer. Die drei alten Entwürfe (`eye`, `maw`, `king`) dienen als Ideen.
5. `data/foes.json` mit allen Gegnern, Werten, Mustern, Stimmen, Beute vervollständigen; Biome in `biomes.json` verweisen darauf.
6. Kontaktbögen je Biom (alle Typen, je vier Seeds hintereinander, keine Auswahl der schönsten) nach `docs/auftrag/bilder/M7/`, mit ehrlicher Einschätzung je Gegner gegen das Zielbild.
7. Galerie zeigt alle neuen Gegner.

**Abnahme**

- [ ] Jedes Biom hat drei Gegnertypen und einen Wächter im Spiel, Pforte den Finale-Boss.
- [ ] Die drei Favoriten (Chorknabe, Hirte, Netzflickerin) sind als Generator-Archetyp erkennbar in ihrer Richtung, gemessen am Zielbild (Einschätzung im Bericht).
- [ ] Gegner-Regel nach Tiefe ist sichtbar: Hafen/Moorwald menschlich, Kapelle verwandelt, Salz/Stadt Nachahmer und Fremdes, Eis Nachahmer, Pforte formlos.
- [ ] Autospieler: 20 Seeds ohne Fehler.
- **Mindestens:** die drei Favoriten, ein weiterer Typ je Biom, ein Wächter je Biom aus einem gemeinsamen Archetyp mit anderer Zone, Finale-Boss einfach.

---

## M8 Hintergründe

Quelle: [05-hintergruende.md](05-hintergruende.md), Steckbriefe in [04-welt-und-run.md](04-welt-und-run.md) Abschnitt 8.

**Aufgaben**

1. Gemeinsame Bausteine: Ebenen-System (7 Ebenen, Parallax, einmal rendern, dann verschieben), Licht, Randlicht, Fase, Dither, Boden mit Fluchtlinien und drei Tiefenreihen, Partikel, Lichtquellen mit Glühen.
2. **Sieben Orte**, je mindestens drei Varianten und eine Wächter-Szene, mit Wahrzeichen und falschem Detail aus dem Steckbrief, `fremdheit` steigt pro Ebene.
3. Szenen für Weg-Wahl, Rast, Werkstatt, Krämer, Ereignis, Wandbild, Übergänge, Strand, Ankunft aus denselben Bausteinen.
4. Wandbild-Reliefs (M5) im Stil der Hintergründe neu.
5. Hintergrund-Labor (Biom, Variante, Seed, `fremdheit`, Ebenen an/aus, PNG speichern).
6. Alte Zonen-Szenen (`js/scenes/zones.js`) aus dem Spiel nehmen, in der Galerie als „alt“ lassen.

**Abnahme**

- [ ] Bildschirmfoto je Biom mit Gegnern im Kampf nach `docs/auftrag/bilder/M8/`. Prüffragen, je Bild ehrlich beantwortet: Erkennt man den Ort ohne Text? Sieht man das Wahrzeichen und das falsche Detail? Gibt es mindestens vier klar getrennte Tiefenebenen? Verdeckt Nebel weniger als ein Drittel? Ist ein Klischee aus der Nein-Liste drin? Passt der Stil zu den Figuren (Randlicht, Fase, Dither)?
- [ ] Die sieben Biome sind nebeneinander klar unterscheidbar (ein Übersichtsbild mit allen sieben).
- [ ] 60 fps im Kampf auf einem normalen Laptop (Chrome Performance-Messung im Bericht).
- **Mindestens:** fünf Biome (beide Einstiege, Kapelle, eine Tiefe, Eis) neu mit je einer Variante, Pforte und das zweite Akt-3-Biom vereinfacht.

---

## M9 Inhalte und Balance

Quellen: [02-entscheidungen.md](02-entscheidungen.md) (Ideenkiste), `prototype/data/ideas.json`, `data/items.json`, `data/events.json`, `data/reactions.json`.

**Aufgaben**

1. Die freigegebenen Items aus der Ideenkiste in `data/items.json` übernehmen, mit 12 × 12 Pixel-Sprites in `js/sprites/items.js` (Items sind keine Körperteile, Pixel-Sprites wie die vorhandenen sind erlaubt). Schlüsselwort „Eröffnung“, „verbraucht“, „+Sog/−Sog“, passive Talismane, zwei verfluchte Items.
2. **Fundpools je Biom** (Zonen-Beute) und **Gegner-Beute**.
3. **Ereignisse:** mindestens drei je Biom, im Ton der Sog-Quelle, mit Entscheidungen und Preisen. Kein Klischee, keine Erklärungen.
4. **Balance** per Autospieler über 50 Seeds: Ziel-Gewinnrate des gierigen Autospielers 25–50 %, kein Biom, in dem mehr als 40 % der Niederlagen passieren, Kampf dauert im Schnitt 4–8 Züge. Änderungen nur in Daten, Liste der Änderungen in `fortschritt.md`.
5. `artboard.html` und `ideen.html` mit den neuen Inhalten aktualisieren (in der Ideenkiste: übernommene Ideen als „übernommen“ markieren).

**Abnahme**

- [ ] Autospieler-Tabelle (50 Seeds) erfüllt die Ziele oder die Abweichung ist begründet.
- [ ] Jedes neue Item taucht in mindestens einem Fundpool auf und hat ein Sprite.
- [ ] Artboard zeigt alle Items, Gegner, Biome.
- **Mindestens:** zehn neue Items, zwei Ereignisse je Biom, Balance-Lauf mit 20 Seeds.

---

## M10 Politur

**Aufgaben** (nach Wirkung sortiert, so weit die Zeit reicht)

1. Übergangsbilder zwischen Akten als echte Szenen (M8-Bausteine) mit Satz und Klang.
2. Trefferwirkung: kurzer Ruck der Szene, Treffer-Bild am Gegner, Zahlen im Stil von Variante A, Block-Splitter. Alles ruhig, nichts Grelles.
3. Hochreaktion als Höhepunkt: Atemholen (Musik), Zwischentitel, Licht flammt in der Szene auf, ggf. das dezente Stummfilm-Rauschen.
4. Einstellungen vollständig (Lautstärken, Stummfilm, Jumpscare, Bildschirmwackeln, Textgeschwindigkeit).
5. Freischaltbare Zusatzfiguren Geologe, Wahrsagerin, Kriegsveteran (04, Abschnitt 5), wenn Zeit ist.
6. Galerie: alle Gegner, Wächter, Boss, Biome, UI-Bausteine, Stoffzeichen.
7. README im Repo-Hauptordner und `prototype/data/README.md` auf den neuen Stand bringen.

**Abnahme**

- [ ] Jeder umgesetzte Punkt hat ein Bildschirmfoto oder einen Satz im Bericht.
- [ ] Keine Konsolenfehler, Autospieler 20 Seeds ohne Fehler.

---

## M11 Abschluss

**Aufgaben**

1. Vollständiger Autospieler-Lauf (50 Seeds) und **ein von dir selbst gespielter Run** (über Playwright mit gezielten Klicks, Bildschirmfotos aller Stationen nach `docs/auftrag/bilder/M11/`).
2. Konsolenfehler-Prüfung in Chromium bei einem ganzen Run.
3. Bericht nach [01-regeln.md](01-regeln.md), Abschnitt 9, in den PR und in `fortschritt.md`.
4. PR von Draft auf „bereit zur Prüfung“ stellen. **Nicht mergen.**

**Abnahme**

- [ ] Alle Meilensteine haben in `fortschritt.md` einen Stand (fertig / Mindeststand / fehlt) mit ehrlicher Einschätzung.
- [ ] Bericht vollständig, Bildschirmfotos verlinkt, Startanleitung stimmt (einmal frisch nach Anleitung gestartet).
