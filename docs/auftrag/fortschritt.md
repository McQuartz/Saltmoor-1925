# Fortschritt

Wird vom Agenten geführt. Neueste Einträge oben in jedem Abschnitt. Eine neue Sitzung liest diese Datei und macht beim ersten nicht fertigen Meilenstein weiter.

## Stand

| Meilenstein | Stand | Kurz |
|---|---|---|
| M0 Einlesen und Aufräumen | fertig | Bestandsaufnahme, Plan, Draft-PR |
| M1 Run-Gerüst | fertig | Seed, fünf Akte, Gabelungen, Weg-Wahl, alle Knoten, Strand, Ankunft, Speichern |
| M2 Kampf-UI Variante A | fertig | 480 × 270, Karten, Stoffzeichen, Balken, Vorschau, Stummfilm nur bei Anlässen; Galerie der Bausteine fehlt noch (M10) |
| M3 Dev-Modus und Autospieler | fertig | sechs Reiter, Einblendungen, Bot in Node und Browser |
| M4 Musik im Spiel | offen | |
| M5 Meta und Progression | offen | |
| M6 Sprite-Pipeline (KI-Sprites) | offen | |
| M7 Gegner-Besetzung | offen | |
| M8 Hintergründe | offen | |
| M9 Inhalte und Balance | offen | |
| M10 Politur | offen | |
| M11 Abschluss | offen | |

Stand-Werte: `offen`, `läuft`, `fertig`, `Mindeststand`, `fehlt`.

## Plan der Sitzung

Sitzung 1 (2026-11-03), eine einzige Sitzung, keine Folgesitzung geplant.

- Reihenfolge M0 → M11 wie vorgegeben. Schwerpunkt: Bis M5 ein vollständiger, spielbarer Run mit Motivation, danach so viel Schönheit wie möglich.
- Der Spielkern wird neu geordnet statt geflickt: Seed-Zufall (`js/core/rng.js`), neuer Run-Ablauf (`js/core/run.js`), Meta (`js/core/meta.js`), Daten in `run.json`, `biomes.json`, `fragmente.json`.
- Kampfregeln (Reaktionen, Werkbank, Schaden) bleiben inhaltlich, nur der Zufall läuft über den Seed.
- Oberfläche wird nach Variante A neu gebaut (480 × 270-Szene, Art-déco-Karten, Stoffzeichen).
- Sprites: kein Bild-Generator verfügbar → Ersatzweg aus M6 (selbst gezeichnet per Skript mit der Licht-/Randlicht-/Dither-Kette aus `zielbild/referenz/render.js`).
- Was wahrscheinlich nicht fertig wird: alle sieben Hintergründe in voller Tiefe mit je drei Varianten, Zusatzfiguren (M10).

## Bestandsaufnahme (M0)

Was der Prototyp heute kann (Stand `main`, 92b3cad), Bildschirmfotos in `bilder/M0/`:

- **Kampf** (`js/core/combat.js`): Karten aus angelegten Items, Energie 3, Hand 5, Gegnermuster (`atk`, `blk`, `buff`), Schwachstelle ×1,5, Brand, Gift, Geschwächt, Block, Ward. **Bleibt**, Zufall wird auf Seed umgestellt.
- **Reaktionen** (`js/core/rules.js`, `data/reactions.json`): 12 Paare, Verstärkt, 3 Hochreaktionen, Buch der Reaktionen, Entdecken. **Bleibt unverändert.**
- **Rollen/Sets** (`data/roles.json`): sechs Sets mit Bonus. **Bleibt**, die Figuren werden darauf umgestellt.
- **Run** (`js/core/run.js`): lineare Tiefe 1–12, nach jedem Sieg Rast mit Fund, alle 5 Tiefen Werkstatt/Krämer/Ereignis, Boss auf Tiefe 12. **Wird ersetzt** durch fünf Akte mit Weg-Wahl.
- **Werkstatt** (Verschmelzen) und **Krämer**: funktionieren. Werkstatt-Logik **bleibt**, Krämer wird zum eigenen Knoten mit Figur je Biom.
- **Ereignisse** (`data/events.json`): 4 allgemeine Ereignisse mit Effekten. **Werden erweitert** (je Biom, mit Folgen).
- **Zonen** (`js/scenes/zones.js`): Hafen, Wald, Kapelle, Grund als 320 × 180-Szenen. **Bleiben bis M8 als Rückfall**, dann nur noch in der Galerie.
- **Gegner** (`js/sprites/foes.js`): Kultist, Tiefling, Ertrunkener, Schatten, Boss mit drei Entwürfen, alles 64 × 80 per Hand-Zeichenfunktion. **Fliegen in M6/M7 raus.**
- **Jumpscare** (`js/ui/jumpscare.js`): zweimal pro Run in Zeitfenstern. **Wird auf einmal pro Run, nicht in den ersten 5 Minuten** umgestellt.
- **Musik** (`js/audio/music.js`): nur im Labor (`musik.html`), Hafen und Kapelle. **Kommt in M4 ins Spiel.** `sfx.js` ist im Spiel und bleibt.
- **Galerie, Artboard, Ideenkiste, Klangliste, Sprite-Labor**: Nebenseiten, werden später ergänzt.
- **Kein Seed, kein Speichern, keine Figuren-Motivation, kein Dev-Modus** im Spiel.
- Bild-Generator in dieser Sitzung: **nicht verfügbar** (kein Werkzeug dafür). M6 nimmt den Ersatzweg.

## Einträge je Meilenstein

(Je Meilenstein: was gebaut wurde, Prüfergebnis der Abnahme, ehrliche Einschätzung in 2–4 Sätzen, Bildschirmfotos.)

### M1 Run-Gerüst (fertig)

- **Seed** `js/core/rng.js`: splitmix32 mit benannten Strömen (`Rng.of(seed,'weg:2:1')`, laufende Ströme in `S.rs`, speicherbar). Alle Inhaltsentscheidungen laufen darüber, `Math.random` nur noch für Partikel. `?seed=N` in der Adresse.
- **Daten** `data/run.json` (Akte, Ebenen-Regeln, Knotenarten, Kampfgrößen, Strand, Ankunft), `data/biomes.json` (sieben Biome mit Palette, Gegnern, Wächter, Fundpool, Krämer, Übergangssatz, Weg-Hinweisen), `data/jobs.json` (sechs Startfiguren mit Ausrede, Wahrheit, Vorliebe, Instrument, Freischaltung). `balance.json` → `zones`/`encounters` abgelöst.
- **Ablauf** `js/core/run.js`: Figurwahl → Akt-Übergang → Weg-Wahl (2–3 Wege mit Zeichen und Hinweis) → Knoten → … → Wächter → nächster Akt → Pforte (Vorraum, Finale) → Ankunft (Bleiben/Umkehren) bzw. Strand nach Niederlage. Knoten: Kampf, schwerer Kampf, Ereignis (mit Folgen: Streichen, Verwandeln, Kampf), Krämer (Kaufen, Laudanum, Karte streichen), Werkstatt (Verschmelzen), Rast (heilen oder Item verbessern), Wandbild (Fragment), Fundstelle (Item oder Gold, manchmal mit Haken).
- **Kampf** `js/core/combat.js`: läuft auf Wunsch synchron (FAST), damit Autospieler und Schadens-Vorschau (`previewCard`, spielt die Karte auf einer Kopie des Zustands) exakt dieselbe Rechnung nutzen. Aufstellung in drei Tiefenreihen per Seed.
- **Speichern**: vor jedem Knoten in `localStorage` (`saltmoor.run.v1`), „Fortsetzen“ im Titel betritt denselben Knoten mit demselben Inhalt.

**Abnahme:** `node tools/test-run.js`: alle vier Wege kommen in 20 Seeds vor (hafen/salz 8, hafen/stadt 6, moor/stadt 4, moor/salz 2), gleicher Seed = gleicher Weg und gleiche Weg-Wahl, Ebenen-Regeln für 100 Seeds (1800 Ebenen) eingehalten. Durchlauf bis zur Ankunft mit beiden Enden geprüft (Autospieler mit viel Leben), Strand nach Niederlage geprüft. Laden mitten im Run → derselbe Kampf mit derselben Hand. Keine Konsolenfehler außer den noch fehlenden Hintergrund-Dateien (M8).

**Einschätzung (M1):** Das Gerüst trägt: Akte, Gabelungen und Knoten fühlen sich schon wie ein Abstieg an, die Weg-Hinweise geben Ort. Schwach ist noch die Balance (der Autospieler kommt im Schnitt bis Tiefe 10, die Wächter ab Akt 2 sind zu stark), und die Gegner sind bis M7 die vier alten. Bilder: `bilder/M1/`.

### M2 Kampf-UI Variante A (fertig, Galerie-Seite fehlt)

Neue Oberfläche: `index.html`, `css/spiel.css`, `js/ui/oberflaeche.js`, `js/ui/eingabe.js`, `js/ui/feedback.js`, `js/ui/zeichen.js`, `js/scenes/buehne.js`. Szene 480 × 270, ganzzahlig skaliert (`--u`), Pixel scharf.

| Punkt aus „Ausgangslage Variante A“ | Stand |
|---|---|
| Stoffe als 9×9-Pixelzeichen | umgesetzt (ganzzahlig 9/18 px), auch Absichten, Zustände, Knotenarten |
| Karten Art déco, Item-Bild im Bogenfenster, Stoffe klein oben rechts, Reaktion unten in Gold | umgesetzt |
| Hand nebeneinander, leicht schief und versetzt | umgesetzt |
| Reagiert: Gold mit Schein; unentdeckt „? ? ?“ violett; „In sich: …“ blau; zu teuer abgedunkelt | umgesetzt |
| Absicht als Zeichen + Zahl, weiß mit schwarzem Rand, geschwächt durchgestrichen | umgesetzt |
| Balken mit Block-Schraffur, Zahlen, Zustände als Zeichen, Name + Schwachstelle | umgesetzt (Name/Balken unter den Füßen wie im Entwurf) |
| Spieler oben links mit Warnung „19 kommen → −11 Leben“ | umgesetzt |
| Energie-Rauten, Art-déco-Knopf, Stapel/Ablage | umgesetzt |
| Kopfzeile „TIEFE IX · ZUG 3“, kursiv Zone, Gold, Buch | umgesetzt |
| Stoffrad nur mit Linien zu dem, was jetzt reagiert | umgesetzt (bekannt farbig, unentdeckt gestrichelt violett) |
| Versetzte Aufstellung, hinten höher, 90 %, im Nebel | umgesetzt (Reihen kommen aus der Szene) |
| Stummfilm nur bei Wächter, Boss, markiertem Ereignis | umgesetzt (`balance.stummfilm`, max. 1 pro Kampf, frühestens alle 3 min, 1,2 s, Augen behalten Farbe) |
| Szene im Ziel-Look | kommt mit M8 |
| keine Art-déco-Ecken um die Szene | eingehalten |

Dazu: Schadens-Vorschau (schraffiert, „−8“), Hochreaktions-Zwischentitel (0,6 s), alle anderen Bildschirme im selben Stil (Titel, Figurwahl, Übergang, Weg-Wahl, Belohnung, Krämer, Ereignis als Zettel, Werkstatt, Rast, Wandbild, Fundstelle, Strand, Ankunft, Ende, Buch, Tagebuch, Einstellungen). Ausrüstung unter der Szene, Ziehen/Ablegen wie bisher.

**Abnahme:** Vorschau gegen echten Schaden: `node tools/test-vorschau.js` → 309 Karten, 0 Abweichungen (die Vorschau spielt die Karte auf einer Kopie des Zustands, darum gleiche Rechnung). Stummfilm: wird im Code nur an drei Stellen ausgelöst (Wächter, Finale, `events.json` mit `stummfilm: true`), Hochreaktionen lösen ihn nicht aus. Lesbar bei 1280 × 720, keine Konsolenfehler.

**Einschätzung:** Der Kampf sieht jetzt wie der Entwurf aus und liest sich klar. Schwach: Die alten Gegner (Kultist, Tiefling, Ertrunkener) sind bunt und cartoonig und brechen den Look bis M6. Die Gegner-Infos können sich bei vier Gegnern berühren. Eine eigene Galerie-Seite der UI-Bausteine fehlt noch (kommt mit M10). Bilder: `bilder/M2/`.

### M3 Dev-Modus und Autospieler (fertig)

- `js/dev/dev.js`: Knopf DEV, Taste D, `?dev=1`. Reiter **Jetzt** (letztes Warum, Kette, Hochreaktionen frei/benutzt, offene Kombos je Handkarte mit Reaktion, „unentdeckt“ und Vorschau-Schaden, letzte Ereignisse), **Kampf** (Muster mit nächstem Zug, Skalierung, Schadensrechnung der letzten 10 Treffer, Sets, Stapel/Ablage), **Run** (Seed kopierbar, Weg mit Grund, nächste Weg-Wahlen per Seed, Fundpool, Beute, Meta), **Musik** (Kurven, Layer, Stimmen, Entscheidungen), **Log** (filterbar, Export), **Cheats** (Akt, Gabelung, jeder Knoten, Gegner spawnen, Item, Karte, Leben, Energie, Gold, Reaktionen, Meta zurücksetzen/alles frei, Stummfilm, Jumpscare, Autospieler sichtbar mit Tempo oder schnell). Einblendungen in der Szene: ID, nächster Zug, Reihe, Warum-Zeile.
- Alle Systeme melden über den Bus mit `why` (Reaktion, Schaden aufgeschlüsselt, Block, Zustände, Gegnerzüge, Set-Boni, Weg, Belohnung, Fragment, Freischaltung).
- Autospieler `js/dev/bot.js` (gierig über die Vorschau), im Browser `?bot=50&seed=1`, in Node `node tools/bot.js 50 1`, im Browser headless `node tools/bot-browser.js 20 1`.

**Abnahme:** 20 Seeds im Browser: alle Runs enden, 0 Fehler, keine Konsolenfehler (Tabelle unten). Stichprobe der Warum-Sätze: 120 Reaktionen in 3 Runs, jede mit Auslöser und Paar (z. B. „Zersetzen ausgelöst: Eisen von der Karte davor trifft Salz (Paar ES aus reactions.json)“). Offene Kombos = tatsächliches Ergebnis, weil beide dieselbe Rechnung nutzen (Vorschau-Test oben). Ohne Dev ist nur der kleine Knopf zu sehen.

**Einschätzung:** Sehr nützlich, vor allem die Vorschau je Handkarte und die Weg-Vorschau. Schwach: Der Reiter Musik zeigt erst nach M4 alles. Bilder: `bilder/M3/`.

## Entscheidungen unterwegs

| Datum | Meilenstein | Entscheidung | Warum |
|---|---|---|---|
| 2026-11-03 | M0 | Branch heißt `claude/jolly-mendel-ia28ci` statt `auftrag/prototyp-run`. | Die Sitzungsumgebung erlaubt nur Pushes auf diesen vorgegebenen Branch. Ziel (Draft-PR gegen `main`, nie selbst mergen) bleibt gleich. |
| 2026-11-03 | M1 | Jede Karte eines Items kommt zweimal ins Deck (`balance.card_copies = 2`). | Startdecks sollen 8–10 Karten haben (04, Abschnitt 5), Figuren starten aber mit 4–5 Items zu je einer Karte. Verdoppeln braucht kein neues System. |
| 2026-11-03 | M1 | Tiefe zählt jede besuchte Ebene: Akte I–IV = Tiefe 1–16, Vorraum 17, Finale 18. | 04 nennt 17 fürs Finale, zählt aber den Vorraum nicht mit. 18 ist die ehrliche Zählung. |
| 2026-11-03 | M1 | „Karte entfernen“ heißt hier „Karte streichen“: Das Item bleibt angelegt (Leben, Set), gibt aber keine Karte mehr. | Karten entstehen aus Items. Ein ganzes Item entfernen kann man schon durch Ablegen, das wäre kein Preis. |
| 2026-11-03 | M1 | Neue Knotenart Fundstelle (Ebene 2): Item oder Gold, manchmal mit Haken (−5 Leben). | Briefing Abschnitt 7 schlägt sie vor, sie braucht kein neues System. |
| 2026-11-03 | M1 | Bis M7 vorläufige Wächter (`vorlaeufig: true` in foes.json) mit alten Grafiken. | Damit jeder Akt schon einen Wächter hat. |
| 2026-11-03 | M0 | Kein Bild-Generator verfügbar, M6 nimmt den Ersatzweg (Sprites per Skript selbst gezeichnet). | In der Sitzung gibt es kein Werkzeug zur Bilderzeugung. |

## Autospieler-Ergebnisse

| Datum | Stand | Seeds | Gewinnrate | Ø Tiefe | häufigste Niederlage | Fehler |
|---|---|---|---|---|---|---|
| 2026-11-03 | M3, Browser (`tools/bot-browser.js 20 1`) | 1–20 | 0 % | 10,3 | Kapelle (7 von 20) | 0 |

## Probleme und Ersatzwege

## Bericht

(Am Ende, nach 01-regeln.md Abschnitt 9.)
