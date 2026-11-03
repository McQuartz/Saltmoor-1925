# Meilensteine

Der Reihe nach abarbeiten. Jeder Meilenstein endet mit: Abnahmekriterien geprüft, Eintrag in [fortschritt.md](fortschritt.md) (Stand, ehrliche Einschätzung, Entscheidungen), Commit, Push, PR-Beschreibung aktualisiert.

Achtung Namensgleichheit: Die Etappen des Sprite-Generators in `docs/spritegen/` heißen ebenfalls M1–M6 („Mos M1–M6“). Hier sind immer die Auftrags-Meilensteine gemeint, außer es steht „Generator-Etappe“ oder „Mos M…“ dabei.

**Mindestens** markiert den Stand, der reicht, wenn die Zeit knapp wird. Alles andere im Meilenstein ist das Ziel.

Das [Briefing](00-briefing.md) hat Vorrang. Die Meilensteine unten sind daran angepasst.

Reihenfolge mit Absicht: **Nach M5 ist ein kompletter Run mit Motivation spielbar** (noch mit alter Grafik). M6 bis M10 machen ihn schön und reich. So gibt es auch bei einem Abbruch etwas Spielbares.

| | Meilenstein | Ergebnis |
|---|---|---|
| M0 | Einlesen und Aufräumen | Branch, Bestandsaufnahme, Draft-PR |
| M1 | Run-Gerüst | Seed, fünf feste Akte, Gabelungen, Weg-Wahl, Knoten zwischen den Kämpfen, Strand, Ende, Speichern |
| M2 | Kampf-UI Variante A | Kampfbildschirm wie abgestimmt, alle anderen Bildschirme im selben Stil |
| M3 | Dev-Modus und Autospieler | sieht alles, erklärt alles, spielt selbst |
| M4 | Musik im Spiel | Layer-Musik hängt am Spiel, alle sieben Biome, Einstellungen |
| M5 | Meta und Progression | Progressions-Konzept, Wandbilder, Freischaltungen, Tagebuch, Figuren mit Ausrede, Ankunft |
| M6 | Sprite-Pipeline | KI-Sprites nach Pixel-Art-Regeln → Regel-Prüfung → PNG-Sheets → Spiel, mit Animation |
| M7 | Gegner-Besetzung | wenige starke Gegner mit Konzept, Wächter und Finale-Boss im Ziel-Look |
| M8 | Hintergründe | sieben Orte mit Tiefe und eigener Komposition, organisch, neu gebaut |
| M9 | Inhalte und Balance | Items, Ereignisse, Krämer, Fundpools, Balance per Autospieler |
| M10 | Politur | Übergänge, Effekte, Galerie, Extras |
| M11 | Abschluss | Prüfung, Bildschirmfotos, Bericht |

---

## M0 Einlesen und Aufräumen

**Aufgaben**

1. Alles aus der Leseliste im [PROMPT.md](PROMPT.md) lesen. Dazu einmal den Prototyp starten und kurz spielen (Playwright, Bildschirmfotos), `prototype/artboard.html`, `ideen.html`, `musik.html`, `klangliste.html`, `docs/ui/entwuerfe/kampf-ui-runde2.html` ansehen.
2. Branch `auftrag/prototyp-run` von `main` anlegen.
3. Mos Generator-Branch wird **nicht** gemergt (Generator nachrangig, siehe Briefing). Prüfen, ob in der Sitzung ein Bild-Generator zur Verfügung steht (wird in M6 wichtig), und das Ergebnis notieren.
4. Bestandsaufnahme in `fortschritt.md`: was der Prototyp heute kann (Kampf, Reaktionen, Werkstatt, Krämer, Ereignisse, Zonen, Jumpscare, Galerie), was davon bleibt, was umgebaut wird. 10–20 Zeilen.
5. Plan der Sitzung in `fortschritt.md` (5–10 Zeilen).
6. Draft-PR gegen `main` öffnen, Titel „Spielbarer Prototyp-Run (Auftrag)“, Beschreibung: Link auf `docs/auftrag/README.md` und Checkliste M0–M11.

**Abnahme**

- [ ] Branch existiert.
- [ ] Prototyp läuft wie vorher (Bildschirmfoto Kampf).
- [ ] Notiert, ob ein Bild-Generator verfügbar ist.
- [ ] `fortschritt.md` hat Bestandsaufnahme und Plan. Draft-PR ist offen.

---

## M1 Run-Gerüst

Quelle: [04-welt-und-run.md](04-welt-und-run.md), Abschnitte 1–3, 7.

**Aufgaben**

1. **Seed:** eigener kleiner Zufallsgenerator (z. B. splitmix32 wie im Generator, mit `fork(name)`), Seed pro Run, `?seed=` in der Adresse, Anzeige im Dev-Modus. Alle Inhaltsentscheidungen (Wege, Begegnungen, Belohnungen, Krämer, Ereignisse, Aufstellung) laufen über ihn. Gleicher Seed + gleiche Entscheidungen = gleicher Run.
2. **Daten:** `data/run.json` (Akte, Gabelungen, Ebenen-Regeln, Knotenarten, Übergangstexte), `data/biomes.json` (sieben Biome: Name, Palette, Musik-Fassung, Gegner, Fundpool, Ereignisse, Szenen-Varianten). `balance.json` → `zones` und `encounters.boss_depth` werden davon abgelöst.
3. **Ablauf** in `js/core/run.js`: Strand (Start) → Figurwahl → fünf feste Akte (Anzahl und Reihenfolge nie ändern) mit je vier Ebenen (Pforte zwei) → Weg-Wahl nach jedem Knoten → Wächter am Ende jedes Akts → Finale → Ankunft (Bleiben/Umkehren). Verlieren → „Die Tiefe spuckt dich aus“ → Strand.
4. **Weg-Wahl-Bildschirm:** zwei bis drei Wege mit Zeichen und Hinweistext. Der nächste Akt wird beim Wächter angekündigt („Hinter ihm führt eine Treppe nach unten“).
5. **Figuren:** `data/jobs.json` auf die sechs Startfiguren umbauen (Tabelle in 04, Abschnitt 5), mit Feldern für Ausrede, Wahrheit, Einstieg-Vorliebe, Instrument, Freischaltung. Bis M5 sind alle sechs wählbar.
6. **Neue Biome ohne neue Grafik:** Bis M8 nutzen Salzstollen, Stadt, Eis und Pforte vorläufig die vorhandenen Szenen (`grund`, `kapelle`, …) mit ihrer Palette. Gegner bis M7 aus dem vorhandenen Pool, nach Biom zugeordnet.
7. **Speichern:** Run nach jedem Knoten in `localStorage` sichern, „Fortsetzen“ im Titel.
8. Übergangsbild zwischen Akten (Text auf schwarzem Grund reicht vorerst).
9. **Knoten zwischen den Kämpfen** spielbar machen: Ereignis, Krämer, Werkstatt, Rast, Wandbild (vorläufig schlicht, Inhalte in M5 und M9). Jeder Knoten hat einen eigenen Bildschirm, keinen leeren Platzhalter.

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
6. **Stummfilm-Rauschen fest definiert, nur bei besonderen Anlässen:** wenn ein Elite-Gegner (Wächter) oder der Boss erscheint, oder ein besonderes Ereignis es anfordert (`stummfilm: true` in `events.json`). Nie dauerhaft, kein Takt, nicht bei Hochreaktionen, höchstens einmal pro Kampf, frühestens alle 3 Minuten, ca. 1,2 s, schwächer als im Entwurf. Werte in `balance.json` → `stummfilm`. Augen behalten ihre Farbe.
7. **Alle anderen Bildschirme** in derselben Formensprache: Titel, Strand, Figurwahl, Weg-Wahl, Belohnung, Werkstatt, Krämer, Ereignis, Rast, Übergang, Ankunft, Tagebuch (Platzhalter bis M5), Einstellungen (Lautstärke Musik/Effekte, Stummfilm an/aus, Jumpscare an/aus, Dev-Schalter).
8. Ausrüstung (Waffen, Kleidung, Talismane, Rucksack) unter der Szene im selben Stil, Ziehen und Ablegen funktioniert wie heute.
9. `gallery.html` zeigt die neuen UI-Bausteine.

**Abnahme**

- [ ] Bildschirmfoto Kampf neben `variante-a.png` gelegt: Jeder Punkt der Tabelle ist umgesetzt oder als Abweichung mit Grund notiert.
- [ ] Stummfilm kommt in einem 10-Minuten-Lauf des Autospielers (ab M3) nur bei Wächtern, Boss und markierten Ereignissen, nie sonst.
- [ ] Schadens-Vorschau stimmt mit dem tatsächlichen Schaden überein (Test über 50 gespielte Karten im Autospieler, ab M3 nachholen).
- [ ] Text und Zahlen sind bei 1280 × 720 lesbar. Keine Konsolenfehler.
- **Mindestens:** Kampfbildschirm Variante A mit Stoffzeichen, Karten, Absichten, Balken mit Block, Energie, Kopfzeile, versetzter Aufstellung. Stoffrad und andere Bildschirme dürfen vereinfacht sein.

---

## M3 Dev-Modus und Autospieler

Quelle: [06-dev-modus.md](06-dev-modus.md).

**Aufgaben**

1. Alle Systeme melden über den Bus mit Grund (`why`): Reaktionen, Schaden (aufgeschlüsselt), Block, Zustände, Gegnerzüge, Set-Boni, Weg-Entscheidungen, Belohnungen, Freischaltungen (ab M5), Musik (ab M4).
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

## M5 Meta und Progression

Quellen: [00-briefing.md](00-briefing.md) Abschnitte 2 und 8, [04-welt-und-run.md](04-welt-und-run.md) Abschnitte 5–7, [quellen/der-sog.md](quellen/der-sog.md) (nur Ton und Figuren). **Keine Sog-Leiste.**

**Aufgaben**

1. **Progressions-Konzept zuerst:** `docs/auftrag/progression.md`, höchstens eine Seite. Was bleibt über Runs, was wird freigeschaltet (Figuren, Items im Fundpool, Startvarianten, Schwierigkeitsstufen nach dem ersten Sieg), in welchem Takt kommt etwas Neues (Ziel: fast jeder Run schaltet etwas frei, auch ein verlorener), warum motiviert das. Zwei bis drei Varianten kurz vergleichen, eine wählen (Regel „Wie du entscheidest“), Entscheidung in `fortschritt.md`.
2. **Wandbild-Knoten** mit prozeduralem Relief (vorläufig einfach, in M8 im Stil der Hintergründe) und Text auf abgerissenem Zettel. **21 Fragment-Texte** schreiben (drei je Biom), Regeln in 04, Abschnitt 6.
3. **Meta-Speicher** `saltmoor.meta.v1`: Fragmente, Freischaltungen, Fortschritt nach dem gewählten Konzept, Tagebuch-Statistik.
4. Die gewählte Progression in einer kleinen, spielbaren Fassung einbauen (Freischaltungen greifen sichtbar im nächsten Run).
5. **Figurwahl** am Strand: Figur, Ausrede, Set, Startdeck-Vorschau; gesperrte Figuren mit Bedingung („… Fragmente“).
6. **Tagebuch** im Titel.
7. **Ankunft** nach dem Finale mit Bleiben/Umkehren und der Wahrheit der Figur.
8. **Strand** nach Niederlage mit Zusammenfassung und neuen Freischaltungen.

**Abnahme**

- [ ] `progression.md` liegt vor, mit gewählter Variante und Grund.
- [ ] Autospieler-Lauf über 20 Seeds hintereinander mit gemeinsamem Meta-Speicher: Freischaltungen kommen in einem sinnvollen Takt (Tabelle in `fortschritt.md`: nach wie vielen Runs was frei ist).
- [ ] Fragmente und Freischaltungen bleiben nach Neuladen erhalten, Dev-Reset setzt alles zurück.
- [ ] Beide Enden und der Strand zeigen die richtigen Texte der Figur.
- [ ] Die 21 Fragment-Texte stehen auch als Liste in `docs/auftrag/fragmente.md` (zum Gegenlesen für Ace).
- **Ab hier ist ein kompletter Run mit Motivation spielbar.** Bildschirmfotos von Strand, Figurwahl, Weg-Wahl, Kampf, Ereignis, Krämer, Wandbild, Ankunft nach `docs/auftrag/bilder/M5/`.
- **Mindestens:** Konzept, Wandbilder mit Texten, Figuren-Freischaltung, Ankunft, Strand. Tagebuch darf schlicht sein.

---

## M6 Sprite-Pipeline (KI-Sprites)

Quellen: [00-briefing.md](00-briefing.md) Abschnitt 5, [docs/spritegen/zielbild.md](../spritegen/zielbild.md) (Pixel-Art-Regeln und Referenzbilder der bestätigten Figuren). Der Generator in `docs/spritegen/` ist **nachrangig** und wird nicht gebraucht.

**Aufgaben**

1. **Regeln als Prüfskript** unter `tools/sprites/pruefen.js` (Node-Bordmittel): Bildgröße 96 × 120 (Wächter bis 128 × 160), nur Farben aus der Zonenpalette plus Augenfarbe, keine halbtransparenten Kantenpixel, kein durchgehender schwarzer Umriss, Randlicht vorhanden an der Lichtseite (oben rechts), hellste Pixel nur in den Augen. Gibt je Sprite einen kurzen Bericht aus.
2. **Erzeugung per KI**, zwei Wege:
   - **Bild-Generator verfügbar:** Sprite erzeugen und dann per Skript auf die Regeln bringen (auf Zielgröße mit Nächster-Nachbar herunterrechnen, auf die Zonenpalette quantisieren mit Bayer-Dither, Umriss entfernen, Randlicht nachziehen). Danach muss die Prüfung bestehen.
   - **Kein Bild-Generator (Ersatzweg):** Der Agent zeichnet jedes Sprite selbst als Pixel-Art, als Formen und Pixel in einem Skript je Gegner (`tools/sprites/gegner/<id>.js`), das die PNG-Sheets schreibt. Fase, Randlicht und Dither dürfen dabei aus gemeinsamen Hilfsfunktionen kommen.
3. **Animation:** je Gegner Idle (2–4 Bilder, ruhig), Angriff, Treffer, Tod als **PNG-Sheets mit JSON-Beschreibung** (Bildgröße, Bildzahl, Bildrate, Fußpunkt, Augenpositionen für Glühen, Kopfpunkt für die Absicht) nach `prototype/assets/gegner/`. Bewegung auf ganze Pixel, kein Flackern.
4. **Lader im Prototyp:** `js/sprites/` lädt Sheets, spielt Animationen (Idle-Loop, Angriff beim Gegnerzug, Treffer beim Treffer, Tod), Augen glühen gedithert. Das alte Teile-Labor (`creature.js`, `foes.js`) fliegt aus dem Kampf.
5. Arbeitsweise wie bei pixelfx (zeichnen, rendern, Kontaktbogen ansehen, verbessern), siehe Briefing Abschnitt 9.
6. Weg und Arbeitsschritte in `docs/auftrag/sprites.md` dokumentieren, damit Ace und Mo später weitere Sprites genauso erzeugen können.

**Abnahme**

- [ ] Alle Sprites im Spiel bestehen die Regel-Prüfung (Bericht in `fortschritt.md`).
- [ ] Kontaktbogen der Sprites neben den Referenzbildern aus `zielbild.md` nach `docs/auftrag/bilder/M6/`, mit ehrlicher Einschätzung je Sprite: Passt es zu Chorknabe, Hirte, Netzflickerin?
- [ ] Im Kampf laufen Idle, Angriff, Treffer, Tod sichtbar und ruhig (Bildschirmfoto-Serie in `docs/auftrag/bilder/M6/`).
- [ ] Silhouetten-Test: Jeder Gegner schwarz gefüllt bleibt erkennbar (Kontaktbogen mit Silhouetten).
- **Mindestens:** Prüfskript, die drei Favoriten mit Idle und Tod im Spiel.

---

## M7 Gegner-Besetzung

Quellen: [00-briefing.md](00-briefing.md) Abschnitt 6, [04-welt-und-run.md](04-welt-und-run.md) Abschnitte 8–9 (Vorschläge), [zielbild.md](../spritegen/zielbild.md).

**Aufgaben**

1. **Konzepte zuerst:** `docs/auftrag/gegner.md`. Je Gegner: Lovecraft-Motiv (z. B. das Ererbte, das Hybride, Wissen, das den Verstand kostet, unermessliche Zeit, falsche Geometrie), wer oder was er war, was an ihm falsch ist, Silhouette in einem Satz, Kampfverhalten passend zum Konzept (Muster, Schwachstelle mit Grund), Stimme in der Musik. Aus den Steckbriefen in 04 streichen, zusammenlegen oder ersetzen, wo das Konzept dadurch stärker wird. **Lieber wenige starke als viele schwache Gegner.**
2. Erst wenn das Konzept steht: Sprites nach M6. Je Typ **zwei bis drei Varianten** (leicht anders), damit zwei Kultisten nicht identisch sind.
3. **Wächter** je Akt (Elite): größer (bis 128 × 160), eigenes Konzept, Besonderheit im Muster. Sein Auftritt ist ein Anlass für das Stummfilm-Rauschen.
4. **Finale-Boss „Das, was ruft“**: mehrere Phasen mit sichtbarer Veränderung, „Augen im Rand“ als Helfer. Die drei alten Entwürfe (`eye`, `maw`, `king`) dienen als Ideen.
5. `data/foes.json` mit allen Gegnern, Werten, Mustern, Stimmen, Beute vervollständigen; Biome in `biomes.json` verweisen darauf.
6. Kontaktbögen je Biom (alle Typen und Varianten, keine Auswahl der schönsten) nach `docs/auftrag/bilder/M7/`, mit ehrlicher Einschätzung je Gegner.
7. Galerie zeigt alle neuen Gegner mit Kurzfassung ihres Konzepts.

**Abnahme**

- [ ] Jeder Gegner im Spiel hat einen Eintrag in `gegner.md`, und Muster, Schwachstelle und Aussehen passen erkennbar zum Konzept.
- [ ] Jedes Biom hat **zwei bis drei** Gegnertypen und einen Wächter, die Pforte den Finale-Boss.
- [ ] Die drei Favoriten (Chorknabe, Hirte, Netzflickerin) sind im Spiel und treffen ihre Richtung aus dem Zielbild (Einschätzung im Bericht).
- [ ] Gegner-Regel nach Tiefe ist sichtbar: Hafen/Moorwald menschlich, Kapelle verwandelt, Salz/Stadt Nachahmer und Fremdes, Eis Nachahmer, Pforte formlos.
- [ ] Autospieler: 20 Seeds ohne Fehler.
- **Mindestens:** die drei Favoriten, ein weiterer Typ je Biom, ein Wächter je Akt, Finale-Boss einfach.

---

## M8 Hintergründe

Quelle: [05-hintergruende.md](05-hintergruende.md), Steckbriefe in [04-welt-und-run.md](04-welt-und-run.md) Abschnitt 8.

**Aufgaben**

Hier ist **deutlich mehr Aufwand** vorgesehen als für die anderen Meilensteine. **Organisch statt Schema F** (Briefing Abschnitt 4).

1. **Kompositionen zuerst:** `docs/auftrag/hintergruende-kompositionen.md`. Je Ort und Variante in Worten: Horizonthöhe, Blickpunkt, wohin der Blick geführt wird, Lichtführung, Wahrzeichen, falsches Detail, und **wo welche Details stehen und warum** (Netze, wo geflickt wird; Kerzen, wo gebetet wird). Keine zwei Orte mit demselben Bildaufbau.
2. Gemeinsame Bausteine: Ebenen-System (7 Ebenen, Parallax, einmal rendern, dann verschieben), Licht, Randlicht, Fase, Dither, Boden mit Fluchtlinien und drei Tiefenreihen, Partikel, Lichtquellen mit Glühen.
3. **Sieben Orte** nach ihrer Komposition, je mindestens drei Varianten und eine Wächter-Szene, mit Wahrzeichen und falschem Detail aus dem Steckbrief, `fremdheit` steigt pro Ebene. Details werden **gesetzt, nicht gestreut**: keine festen Abstände, keine Wiederholung derselben Requisite in Reihe, keine Platzierung nur nach Zufall. Zufall (per Seed) nur für kleine Unterschiede innerhalb einer Komposition. Varianten sind andere Stellen desselben Ortes, nicht neu gewürfelte Teile.
4. Szenen für Weg-Wahl, Rast, Werkstatt, Krämer, Ereignis, Wandbild, Übergänge, Strand, Ankunft aus denselben Bausteinen.
5. Wandbild-Reliefs (M5) im Stil der Hintergründe neu.
6. Hintergrund-Labor (Biom, Variante, Seed, `fremdheit`, Ebenen an/aus, PNG speichern).
7. Alte Zonen-Szenen (`js/scenes/zones.js`) aus dem Spiel nehmen, in der Galerie als „alt“ lassen.

**Abnahme**

- [ ] Bildschirmfoto je Biom mit Gegnern im Kampf nach `docs/auftrag/bilder/M8/`. Prüffragen, je Bild ehrlich beantwortet: Erkennt man den Ort ohne Text? Sieht man das Wahrzeichen und das falsche Detail? Gibt es mindestens vier klar getrennte Tiefenebenen? Verdeckt Nebel weniger als ein Drittel? Ist ein Klischee aus der Nein-Liste drin? Passt der Stil zu den Figuren (Randlicht, Fase, Dither)? Wirkt der Aufbau organisch, oder sieht man ein Raster oder Wiederholungen?
- [ ] Die sieben Biome sind nebeneinander klar unterscheidbar (ein Übersichtsbild mit allen sieben), und kein Ort hat denselben Bildaufbau wie ein anderer.
- [ ] Die drei Varianten eines Ortes nebeneinander wirken wie verschiedene Stellen desselben Ortes, nicht wie umgewürfelte Teile.
- [ ] 60 fps im Kampf auf einem normalen Laptop (Chrome Performance-Messung im Bericht).
- **Mindestens:** fünf Biome (beide Einstiege, Kapelle, eine Tiefe, Eis) neu mit je einer Variante, Pforte und das zweite Akt-3-Biom vereinfacht.

---

## M9 Inhalte und Balance

Quellen: [02-entscheidungen.md](02-entscheidungen.md) (Ideenkiste), `prototype/data/ideas.json`, `data/items.json`, `data/events.json`, `data/reactions.json`.

**Aufgaben**

1. Die freigegebenen Items aus der Ideenkiste in `data/items.json` übernehmen, mit 12 × 12 Pixel-Sprites in `js/sprites/items.js` (Items sind keine Körperteile, Pixel-Sprites wie die vorhandenen sind erlaubt). Schlüsselwort „Eröffnung“, „verbraucht“, passive Talismane. Keine Sog-Wirkungen, keine verfluchten Items.
2. **Fundpools je Biom** (Zonen-Beute) und **Gegner-Beute**.
3. **Ereignisse:** mindestens drei je Biom, im Ton der Welt, mit Bild, Text und zwei bis drei Entscheidungen, jede mit Preis und Folge (Leben, Gold, Items, Karten entfernen oder verwandeln, ein Kampf). Kein Klischee, keine Erklärungen. Nur wenige, besonders starke Ereignisse bekommen `stummfilm: true`.
4. **Krämer:** je Biom eine eigene Figur mit Ort und einer Zeile Charakter, Sortiment aus dem Fundpool des Bioms, Preise nach Seltenheit, eine Karte entfernen gegen Gold. Werkstatt und Rast ebenfalls mit eigenem Bild je Biom.
5. Weitere einfache Knotenarten nur, wenn sie wenig neues System brauchen (z. B. Fundstelle: Item oder Gold, manchmal mit Haken).
6. **Balance** per Autospieler über 50 Seeds: Ziel-Gewinnrate des gierigen Autospielers 25–50 %, kein Biom, in dem mehr als 40 % der Niederlagen passieren, Kampf dauert im Schnitt 4–8 Züge. Änderungen nur in Daten, Liste der Änderungen in `fortschritt.md`.
7. `artboard.html` und `ideen.html` mit den neuen Inhalten aktualisieren (in der Ideenkiste: übernommene Ideen als „übernommen“ markieren).

**Abnahme**

- [ ] Autospieler-Tabelle (50 Seeds) erfüllt die Ziele oder die Abweichung ist begründet.
- [ ] Jedes neue Item taucht in mindestens einem Fundpool auf und hat ein Sprite.
- [ ] Artboard zeigt alle Items, Gegner, Biome.
- [ ] Jedes Biom hat einen eigenen Krämer und mindestens drei Ereignisse.
- **Mindestens:** zehn neue Items, zwei Ereignisse je Biom, Krämer je Biom mit eigenem Sortiment, Balance-Lauf mit 20 Seeds.

---

## M10 Politur

**Aufgaben** (nach Wirkung sortiert, so weit die Zeit reicht)

1. Übergangsbilder zwischen Akten als echte Szenen (M8-Bausteine) mit Satz und Klang.
2. Trefferwirkung mit **pixelfx** (Briefing Abschnitt 9): kurzer Ruck der Szene und Einfrieren beim Treffer nach dem `act`-Timing, Treffer-Effekt am Gegner, Zustände (Brand, Gift) als Effekte am Körper, Reaktionen mit Effekt in Stofffarbe, Tod als Auflösen, Block-Splitter, Zahlen im Stil von Variante A. Alles in Zonen- und Stofffarben, ruhig, nichts Grelles. Kontaktbogen der benutzten Effekte nach `docs/auftrag/bilder/M10/`.
3. Hochreaktion als Höhepunkt: Atemholen (Musik), Zwischentitel, Licht flammt in der Szene auf. Kein Stummfilm-Rauschen dabei.
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
