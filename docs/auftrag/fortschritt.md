# Fortschritt

Wird vom Agenten geführt. Neueste Einträge oben in jedem Abschnitt. Eine neue Sitzung liest diese Datei und macht beim ersten nicht fertigen Meilenstein weiter.

## Stand

| Meilenstein | Stand | Kurz |
|---|---|---|
| M0 Einlesen und Aufräumen | fertig | Bestandsaufnahme, Plan, Draft-PR |
| M1 Run-Gerüst | fertig | Seed, fünf Akte, Gabelungen, Weg-Wahl, alle Knoten, Strand, Ankunft, Speichern |
| M2 Kampf-UI Variante A | fertig | 480 × 270, Karten, Stoffzeichen, Balken, Vorschau, Stummfilm nur bei Anlässen; Galerie der Bausteine fehlt noch (M10) |
| M3 Dev-Modus und Autospieler | fertig | sechs Reiter, Einblendungen, Bot in Node und Browser |
| M4 Musik im Spiel | fertig | sieben Biom-Fassungen, alle Gegnerstimmen, Rollen, Stoffe, Enden; gemessen, nicht angehört |
| M5 Meta und Progression | fertig | Konzept B, 21 Fragmente, Figuren, Startvarianten, Stufen, Tagebuch, Ankunft, Strand |
| M6 Sprite-Pipeline (KI-Sprites) | fertig | Ersatzweg: per Skript gezeichnet, 41 Sheets, Prüfung 0 Verstöße, Idle/Angriff/Treffer/Tod |
| M7 Gegner-Besetzung | fertig | 16 Typen mit je zwei Varianten, 6 Wächter, Boss mit 3 Phasen; drei Typen im Mindeststand |
| M8 Hintergründe | fertig | sieben Orte mit eigener Komposition, je 3 Varianten + Wächter-Szene, alle Knoten-Szenen, Labor; 60 fps |
| M9 Inhalte und Balance | fertig (Abweichung) | 23 Items, 25 Ereignisse, Krämer je Biom, Fundpools, Gegner-Beute; Gewinnrate 22–32 %, Pforte knapp über 40 % der Niederlagen |
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

### M4 Musik im Spiel (fertig, nicht angehört)

Erweitert von einem Musik-Subagenten (`js/audio/music.js`, `musik.html`, `data/audio.json`, `tools/musik-pruefen.js`), eingehängt von mir über `js/ui/feedback.js`: Szene (Menü, Karte, Kampf, Wächter, Finale), Biom und Akt (Grundgefahr +0,03 je Akt), Gegnerstimmen bei Kampfbeginn/Tod/Ruf, Leben und angekündigter Schaden, eigene Angriffe und Block, Reaktionen und Hochreaktion, Treffer, Sieg, Niederlage, Übergang (Glockenschlag), Ende (Bleiben löst sich in den Grundton auf, Umkehren endet gekippt), Rollen-Instrument nach Figur, Stoff-Färbung nach dem dominanten Stoff im Loadout. Lautstärke Musik/Effekte in den Einstellungen; Musik startet erst nach dem ersten Klick. Effekte etwas leiser gemischt (Limiter-Last).

- **Sieben Biom-Fassungen**: Hafen d-Moll, Moorwald c-Moll (Holz und Knochen), Kapelle e-Moll, Salzstollen f-Moll (Hacke auf Stein, Tropfen), Namenlose Stadt b-Moll (Trommel ohne Spieler), Schwarzes Eis fis-Moll (Knacken, Dröhnen, ferne Stimme aus Formanten), Pforte es-Moll dauerhaft halb gekippt. Im Dev-Modus (Reiter Musik) und im Labor umschaltbar.
- **Gegnerstimmen** für alle Gegner aus 04, Abschnitt 9; Wächter = Biom-Stimme eine Oktave tiefer, gedoppelt.

**Abnahme** (`node tools/musik-pruefen.js`): Spitze am Ausgang höchstens −0,64 dBFS (Härtetest mit Boss, 4 Leben, 3 Hochreaktionen), im normalen Kampf −1,0 bis −1,1 dBFS → kein Clipping. Tempo über 137 Takte 80–88 BPM, größter Sprung 1 BPM pro Takt. Tonal: alle Stimmen und tonalen Effekte nehmen Töne aus `Music.harmony()` bzw. der aktuellen Tonleiter (Code-Prüfung); bewusst leicht verstimmt sind nur Netzflickerin (±15 Cent), Kneipenklavier, Kapellen-Orgel. Reaktion auf Kampfbeginn, Tod eines Typs (Abgesang), letzten Gegner (Duell), Hochreaktion, Sieg: im Log `Music.onEvent` sichtbar, Dev-Reiter Musik zeigt sie.

**Einschätzung:** Gemessen ist alles sauber, **angehört hat es niemand** (die Sitzung hat keinen Ton). Ob die neuen Biome und Stimmen gut klingen, muss Ace prüfen. Vor dem Limiter kommen viele Effekte auf einmal auf +4 dBFS; der Limiter fängt das, aber Ace sollte auf Pumpen achten.

### M5 Meta und Progression (fertig)

- Konzept `docs/auftrag/progression.md`: drei Varianten verglichen (nur Fragmente / Fragmente + Schwellen + Stufen / Währung), **gewählt B**, weil es die Lücke „Run ohne Wandbild bringt nichts“ schließt und fast kein neues System braucht.
- `data/fragmente.json`: 21 Fragmente (drei je Biom), auch als `docs/auftrag/fragmente.md` zum Gegenlesen. 12 nehmen ein Item in den Fundpool auf. Geschrieben von einem Inhalts-Subagenten, von mir eingebaut.
- `js/core/meta.js` (`saltmoor.meta.v1`): Fragmente, Items, tiefster Akt, Startvarianten, Stufen, Runs, Siege, Enden, beste Tiefe, erreichte Biome, Verlauf.
- Figurwahl am Strand mit Ausrede, Set (vorhandene Teile in Gold), Deckgröße, Vorliebe; gesperrte Figuren mit Bedingung. Startvarianten und Stufen erscheinen, sobald frei.
- Wandbild mit Relief und Zettel, Tagebuch im Titel, Ankunft mit Wahrheit der Figur und Bleiben/Umkehren, Ende mit Schlusstext, Strand mit Zusammenfassung und allem Neuen.

**Abnahme:** 20 Runs hintereinander mit gemeinsamem Meta-Speicher (`node tools/test-meta.js 20 1`), Autospieler ohne Sieg:

| Run | Figur | Ergebnis | Tiefe | Fragmente gesamt | neu |
|---|---|---|---|---|---|
| 1 | fischer | Strand | 7 | 0 | Startvariante „Ersparnisse“ |
| 2 | friedhofswaerter | Strand | 10 | 1 | Fragment „Der Kerbstein“, Sense, Startvariante „Ein Erbstück“ |
| 3 | pfarrerin | Strand | 7 | 3 | Fragment „Die zwei Kreise“, Hexenflasche, Fragment „Das Taufbecken“, Priesterkragen, Detektiv |
| 4 | detektiv | Strand | 12 | 5 | Fragment „Der Glockenguss“, Spieluhr, Fragment „Das Reliefband: Die Küste“, Tarotkarten |
| 5 | fischer | Strand | 7 | 5 | – |
| 6 | friedhofswaerter | Strand | 12 | 6 | Fragment „Die letzte Predigt“, Okkultist |
| 7 | friedhofswaerter | Strand | 7 | 6 | – |
| 8 | pfarrerin | Strand | 18 | 6 | Startvariante „Zähe Natur“ |
| 9 | detektiv | Strand | 8 | 7 | Fragment „Die Stufen unter der Kaimauer“, Bootshaken |
| 10 | okkultist | Strand | 4 | 8 | Fragment „Der Hirte“ |
| 11 | fischer | Strand | 7 | 8 | – |
| 12 | friedhofswaerter | Strand | 8 | 9 | Fragment „Kerben im Kutterbalken“, Ankerkette, Kneipenschläger |
| 13 | fischer | Strand | 12 | 9 | – |
| 14 | friedhofswaerter | Strand | 10 | 9 | – |
| 15 | pfarrerin | Strand | 12 | 10 | Fragment „Das Reliefband: Der Auszug“ |
| 16 | detektiv | Strand | 9 | 10 | – |
| 17 | okkultist | Strand | 16 | 11 | Fragment „Die gefrorene Welle“, Leuchtpistole |
| 18 | kneipenschlaeger | Strand | 8 | 11 | – |
| 19 | fischer | Strand | 7 | 11 | – |
| 20 | friedhofswaerter | Strand | 15 | 13 | Fragment „Die Liste im Leuchtturm“, Fragment „Das Zeichen der Legion“, Grubenlampe |

In 12 von 20 Runs wird etwas Neues frei (Fragment, Item, Figur oder Startvariante). Detektiv nach Run 3, Okkultist nach Run 6, Kneipenschläger nach Run 12. Die Runs ohne Neues sind die, in denen der Autospieler kein Wandbild nimmt oder früh stirbt. Meta bleibt nach Neuladen (localStorage), Dev-Reset leert alles (geprüft). Enden und Strand zeigen Ausrede/Wahrheit der gewählten Figur.

**Einschätzung:** Die Freischaltungen kommen in einem guten Takt, und die Fragmente erzählen tatsächlich etwas. Schwach: Die Schwierigkeitsstufen sind ungetestet, weil der Autospieler noch nicht gewinnt (Balance kommt in M9). Das Tagebuch ist schlicht. Bilder: `bilder/M5/`.

### M6 Sprite-Pipeline (fertig, Ersatzweg)

Kein Bild-Generator in der Sitzung → Ersatzweg: Jedes Sprite ist als Formen in einem Skript gezeichnet (`tools/sprites/gegner/<id>.js`) und läuft durch die Licht-/Randlicht-/Dither-Kette aus `zielbild/referenz/render.js` (`tools/sprites/lib.js`). `bauen.js` schreibt PNG-Sheets + JSON nach `prototype/assets/gegner/`, `pruefen.js` prüft die harten Regeln (Größe, nur Zonenpalette + Augen, Alpha nur 0/255, kein schwarzer Umriss, Randlicht oben rechts, hellste Pixel nur in Augen/Lichtern, kein Flackern). Weg dokumentiert in `docs/auftrag/sprites.md`. Gebaut von einem Subagenten, Lader und Einbau im Spiel von mir (`js/scenes/buehne.js`: Sheets vorladen, Idle-Schleife, Angriff beim Gegnerzug, Treffer, Tod, gedithertes Augenglühen, hintere Reihe 90 % und im Nebel). Das alte Teile-Labor (`foes.js`) ist aus dem Spiel raus und bleibt nur für die Galerie.

**Abnahme:** `node tools/sprites/pruefen.js` → 41 Sprites geprüft, 0 Verstöße. Kontaktbögen: `bilder/M6/favoriten-vergleich.png` (neben den Referenzbildern), `favoriten-animation.png`, `silhouetten.png` (schwarz gefüllt, alle erkennbar), `serie-kampf.png` (Idle, Treffer, Angriff, Auflösen im Spiel).

**Einschätzung je Favorit:** Hirte am nächsten am Zielbild (hoher, zerfetzter Mantel, Sternbild-Gesicht, Geweih mit Knoten), Finger etwas dünn. Chorknabe trifft die Richtung (drei Köpfe, die nacheinander singen, Kerzenkranz), der Kerzenschein ist schwächer als im Zielbild. Netzflickerin ist die schwächste der drei: Haltung und abknickende Arme stimmen, der Rücken wirkt aber wie ein glatter Block statt spinnenhaft. Generell: Treffer und Tod sind bei allen gleich gebaut (heller + Rückstoß, Zerfall von oben), ruhig, aber wenig eigen.

### M7 Gegner-Besetzung (fertig, drei Typen im Mindeststand)

Konzepte zuerst in `docs/auftrag/gegner.md` (Motiv, wer er war, was falsch ist, Silhouette, Kampfverhalten mit Schwachstelle und Grund, Stimme). Gestrichen, weil das Konzept dadurch stärker wird: Kultist (geht im Ertrunkenen auf), Schatten (in der Windgestalt), Eisgesicht (im Chor).

| Biom | Gegner | Wächter / Boss |
|---|---|---|
| Hafen | Netzflickerin, Tiefling, Schmuggler | Lotse (ruft Tiefling alle 3 Züge) |
| Moorwald | Hirte, Torfstecherin, Nest | Der Opfernde (ruft Nest alle 4 Züge) |
| Kapelle | Chorknabe, Ertrunkener | Glockenmutter (ruft Chorknabe alle 3 Züge) |
| Salzstollen | Schlundträger, Salzläufer, Grabwächter | Wurm im Salz (wechselt die Schwachstelle W/F/V) |
| Namenlose Stadt | Bote, Erbauer-Mumie | Der Wind, der Gestalt hat (wechselt L/W/S) |
| Schwarzes Eis | Rufer, Nachgeher | Chor im Eis (ruft Rufer alle 3 Züge) |
| Pforte | Augen im Rand | Das, was ruft (3 Phasen mit eigenem Sprite, ruft Augen) |

Je normalem Typ zwei Varianten, Wächter 128 × 160, Boss 160 × 160. Alle acht Stoffe kommen als Schwachstelle vor. `data/foes.json` vollständig mit `biom`, `rang`, `sprite`, `varianten`, `konzept`, `stimme`, `beute`, `besonders`.

**Abnahme:** Jedes Biom hat 2–3 Typen und einen Wächter, die Pforte den Boss. Gegner-Regel nach Tiefe sichtbar (Hafen/Moor menschlich, Kapelle verwandelt, Salz/Stadt fremd, Eis Nachahmer, Pforte formlos). Autospieler 50 Seeds ohne Fehler. Kontaktbögen je Biom in `bilder/M7/<biom>.png` (alle Typen und Varianten), im Spiel `bilder/M7/im-spiel-*.png`.

**Einschätzung:** Die Favoriten und die Wächter (Lotse, Glockenmutter, Wurm) tragen den Look. Schwach und im Mindeststand: Erbauer-Mumie (liest sich als Raupe), Nachgeher (wie ein Tisch mit hängendem Kopf), Ertrunkener (Silhouette ein Klumpen). Der Tiefling sieht eher nach Leuchtbrille als nach Fisch aus, das Nest eher nach Spinne als nach Hügel. Galerie mit Konzepten folgt in M10.

### M8 Hintergründe (fertig, Pforte vereinfacht)

Gebaut von einem Hintergrund-Subagenten, eingebunden von mir. Kompositionen zuerst in Worten (`docs/auftrag/hintergruende-kompositionen.md`, je Ort und Variante Horizont, Blickpunkt, Licht, Wahrzeichen, falsches Detail, wo was steht und warum; unten die ehrlich beantworteten Prüffragen je Bild). Renderer `prototype/js/scenes/world/` (`basis.js` + eine Datei je Biom; Strand und Titel in `hafen.js`, Ankunft in `pforte.js`): Formen aus parametrisierten Funktionen mit Fase, Randlicht oben rechts, Kontaktschatten, Bayer-Dither, Perspektive, Lichtkegel, Glühen, Nebel nur als Band/Tiefenhinweis, Partikel. Jede Ebene einmal gerendert, dann nur verschoben. Je Ort drei Varianten (andere Stellen desselben Ortes), Wächter-Szene, eigene Ausschnitte für Weg, Rast (Feuer), Werkstatt (Werkbank), Krämer (Stand), Ereignis, Wandbild, Fund, Übergang (Kirchmauer, Kirchpfad, Treppe hinter dem Altar, Spalt im Salz/Stadt, Loch im Eis). `fremdheit` steigt mit der Ebene im Akt. Labor: `prototype/hintergrund.html` (Biom, Variante, Art, Seed, fremdheit, Ebenen an/aus, PNG speichern). Die alten Zonen-Szenen sind aus dem Spiel raus.

**Abnahme:** Bildschirmfoto je Biom mit Gegnern im Spiel: `bilder/M8/im-spiel-*.png`; Übersicht aller sieben: `bilder/M8/uebersicht.png`; drei Varianten je Ort: `bilder/M8/<biom>-varianten.png`; Arten und fremdheit: `<biom>-arten.png`, `<biom>-fremdheit.png`. Prüffragen je Bild: in der Kompositions-Datei. Bildrate im Spiel (Kampf, drei Gegner, headless Chromium, 240 Bilder): Hafen, Kapelle, Salz, Eis je 16,6 ms im Mittel, 95-%-Wert 16,7–16,8 ms → 60 fps. Szene allein (Labor): 0,3–2 ms pro Bild, Aufbau einmalig 35–220 ms.

**Einschätzung:** Die Orte sind jetzt klar unterscheidbar und haben echte Tiefe; am stärksten Kapelle (grünes Rundfenster von unten, schräges Wasser, Kerzen unter Wasser) und Salzstollen (hell, gewachsene Säulen, Fossilien, die nach unten blicken). Hafen gut (Kegel sucht landeinwärts, zugemauerte Fenster), Eis gut (gefrorene Brecher, Umriss unter dem Eis immer an derselben Stelle). Schwach: Moor-Variante Torfstich zu dunkel, die fremden Sterne im Wasser lesen sich wie Glühwürmchen; in der Stadt wirken die Relieffiguren wie Strichmännchen; die Pforte wirkt eher nach Science-Fiction als nach Lovecraft (vereinfacht, wie erlaubt). Variante 0 ist je Ort am gründlichsten. Im hellen Salzstollen braucht die Schrift eine dunkle Unterlage (eingebaut).

### M9 Inhalte und Balance (fertig, eine begründete Abweichung)

- **Items:** 23 neue aus der Ideenkiste in `data/items.json`, jedes mit 12×12-Sprite in `js/sprites/items.js` (Inhalts-Subagent). Neu im Kern: „Eröffnung“ (Bonus als erste Karte im Zug), „verbraucht“ (einmal pro Kampf), Geschwächt und Block-Weg auf Karten, passive Talismane (Hasenpfote: ein Fund mehr; Kompass: erste Karte im Kampf kostet 0). Keine Sog-Wirkungen, keine verfluchten Items. Übernommene und gestrichene Ideen sind in `ideas.json` per `status` markiert.
- **Fundpools** je Biom (Zonen-Beute), Items aus Fragmenten kommen nach dem Lesen dazu; **Gegner-Beute** (`beute` in foes.json, 20 % Chance in der Auswahl). Jedes neue Item liegt in mindestens einem Pool (direkt oder über ein Fragment), geprüft per Skript.
- **Ereignisse:** 25 (4 allgemeine + 3–4 je Biom), mit Preis und Folge (Leben, Gold, Items, Streichen, Verwandeln, Kampf, Reaktion entdecken). Nur drei mit `stummfilm: true` (Glocke in der Kapelle, Wind in der Stadt, der Name im Eis).
- **Krämer** je Biom mit Figur, Ort und Zeile (Witwe Haskins, Torfmann, Küster, letzter Hauer, Vermesserin, Schlittenführer), Sortiment aus dem Fundpool, Laudanum, Karte streichen. Werkstatt und Rast haben je Biom einen eigenen Ausschnitt (M8).
- **Fundstelle** als zusätzliche einfache Knotenart.

**Balance-Änderungen (nur Daten):**

| Datei | Änderung | Grund |
|---|---|---|
| balance.json | `start_hp` 40 → 50, `victory_heal_pct` 0,15 → 0,28 | Runs endeten im Schnitt auf Tiefe 8 |
| balance.json | `enemy_scaling`: Leben +7 % → +4 % je Tiefe, Angriff +1 alle 3 → alle 4 Tiefen | späte Akte zu hart |
| run.json | Gegnerzahl je Akt/Ebene `[[1,1,2],[1,2,2],[2,2,2],[1,2,2],[2,2,2]]`, Rast heilt 40 % | Kapelle und Eis zu dicht |
| foes.json | Stärke-Züge mit 3 → 2, Wächter-Leben ×0,85, Boss ruft 1 statt 2 Augen, Phasen-Spitzen 16→12 und 20→15, 6×3→5×3 | lange Kämpfe eskalierten, Finale fast unschaffbar |
| combat.js (Regel, keine Zahl) | Wächter und Boss skalieren nicht mehr mit der Tiefe | siehe Entscheidungen |
| jobs.json | Startausrüstung der drei Zusatzfiguren mehrfach angepasst | Veteran gewann 83 %, Wahrsagerin 0–17 % |

**Abnahme (Autospieler, gierig):**

| Lauf | Gewinnrate | Ø Tiefe | Ø Züge je Kampf | Niederlagen je Biom | Fehler |
|---|---|---|---|---|---|
| Seeds 1–50, sechs Grundfiguren | 32 % | 16,6 | 4,7 | Pforte 44 %, Eis 41 %, Stadt 6 %, Salz 6 %, Kapelle 3 % | 0 |
| Seeds 101–154, alle neun Figuren | 22 % | 16,2 | 4,4 | Pforte 48 %, Eis 31 %, Stadt 14 %, Salz 7 % | 0 |

Gewinnrate im Ziel (25–50 %) bzw. knapp darunter, Kampfdauer im Ziel (4–8 Züge). **Abweichung:** Die Pforte hat 44–48 % der Niederlagen statt höchstens 40 %. Begründung: Wer bis zum Finale kommt, verliert dort oder gewinnt den Run; je höher die Gewinnrate, desto mehr ballen sich die übrigen Niederlagen am Ende. Ein weicheres Finale würde die Gewinnrate über das Ziel heben. Kriegsveteran (54 % allein) ist stärker als die Grundfiguren; er wird erst nach 18 Fragmenten frei.

**Einschätzung:** Inhaltlich deutlich reicher: Jedes Biom hat eigene Funde, einen Krämer mit Gesicht und Ereignisse im Ton des Ortes. Schwach: Der gierige Autospieler ist ein grober Maßstab (er nutzt Werkstatt und Gold schlecht), Menschen werden vermutlich besser abschneiden. Artboard folgt in M10.

## Entscheidungen unterwegs

| Datum | Meilenstein | Entscheidung | Warum |
|---|---|---|---|
| 2026-11-03 | M0 | Branch heißt `claude/jolly-mendel-ia28ci` statt `auftrag/prototyp-run`. | Die Sitzungsumgebung erlaubt nur Pushes auf diesen vorgegebenen Branch. Ziel (Draft-PR gegen `main`, nie selbst mergen) bleibt gleich. |
| 2026-11-03 | M1 | Jede Karte eines Items kommt zweimal ins Deck (`balance.card_copies = 2`). | Startdecks sollen 8–10 Karten haben (04, Abschnitt 5), Figuren starten aber mit 4–5 Items zu je einer Karte. Verdoppeln braucht kein neues System. |
| 2026-11-03 | M1 | Tiefe zählt jede besuchte Ebene: Akte I–IV = Tiefe 1–16, Vorraum 17, Finale 18. | 04 nennt 17 fürs Finale, zählt aber den Vorraum nicht mit. 18 ist die ehrliche Zählung. |
| 2026-11-03 | M1 | „Karte entfernen“ heißt hier „Karte streichen“: Das Item bleibt angelegt (Leben, Set), gibt aber keine Karte mehr. | Karten entstehen aus Items. Ein ganzes Item entfernen kann man schon durch Ablegen, das wäre kein Preis. |
| 2026-11-03 | M1 | Neue Knotenart Fundstelle (Ebene 2): Item oder Gold, manchmal mit Haken (−5 Leben). | Briefing Abschnitt 7 schlägt sie vor, sie braucht kein neues System. |
| 2026-11-03 | M1 | Bis M7 vorläufige Wächter (`vorlaeufig: true` in foes.json) mit alten Grafiken. | Damit jeder Akt schon einen Wächter hat. |
| 2026-11-03 | M5 | Progression Variante B (Fragmente + Startvarianten bei Akt II/III/IV + Schwierigkeitsstufen nach dem ersten Sieg). | Siehe progression.md: wenig neues System, jeder Run kann etwas bringen. |
| 2026-11-03 | M7 | Wächter und Boss skalieren nicht mehr mit der Tiefe, nur normale Gegner. | Sie sind je Akt eigens ausgelegt; mit Skalierung hatte der Boss auf Tiefe 18 302 statt 180 Leben. |
| 2026-11-03 | M0 | Kein Bild-Generator verfügbar, M6 nimmt den Ersatzweg (Sprites per Skript selbst gezeichnet). | In der Sitzung gibt es kein Werkzeug zur Bilderzeugung. |

## Autospieler-Ergebnisse

| Datum | Stand | Seeds | Gewinnrate | Ø Tiefe | häufigste Niederlage | Fehler |
|---|---|---|---|---|---|---|
| 2026-11-03 | M3, Browser (`tools/bot-browser.js 20 1`) | 1–20 | 0 % | 10,3 | Kapelle (7 von 20) | 0 |
| 2026-11-04 | M9, Node (`tools/balance.js 50 1`, Grundfiguren) | 1–50 | 32 % | 16,6 | Pforte (15 von 34) | 0 |
| 2026-11-04 | M9, Node, alle neun Figuren | 101–154 | 22 % | 16,2 | Pforte (20 von 42) | 0 |

## Probleme und Ersatzwege

## Bericht

(Am Ende, nach 01-regeln.md Abschnitt 9.)
