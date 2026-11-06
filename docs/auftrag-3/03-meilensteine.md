# Meilensteine M0 bis M12 (und Zugabe)

Der Reihe nach. Ein Meilenstein ist fertig, wenn seine Abnahme erfüllt, **von dir selbst geprüft** und im Abnahmeprotokoll belegt ist ([09-pruefen.md](09-pruefen.md) Abschnitt 5). **Mindestens** beschreibt den sauberen Stand, auf den du einen Meilenstein bringst, wenn das Budget drängt. Mindestens heißt: weniger Umfang, nie weniger Sorgfalt. Was unter Mindestens fehlt, ist per Schalter aus und steht im Bericht.

Vor jedem Meilenstein schreibst du den Umsetzungsplan in `fortschritt.md` ([08-dirigent.md](08-dirigent.md) Abschnitt 2). Die Spalte „Agenten“ ist ein Vorschlag, wie sich die Arbeit sinnvoll teilen lässt. Du darfst anders aufteilen, wenn du es begründest, aber die Regeln aus [08-dirigent.md](08-dirigent.md) Abschnitt 1 („nie abgeben“) gelten immer.

**Budget:** M0 bis M4 zusammen etwa 40 %, M5 bis M8 etwa 35 %, M9 bis M12 der Rest. Die Kern-Systeme sind der Grund für diesen Auftrag, sie dürfen nicht an einer zu langen Oberflächen-Phase verhungern. Wenn M4 fertig ist und mehr als 45 % verbraucht sind, bringst du M5 bis M8 auf Mindestens, bevor du ausbaust.

---

## M0 Einrichten und Basis

- Branch `auftrag/run-3` vom aktuellen `main` (siehe [01-regeln.md](01-regeln.md) Abschnitt 7), Draft-Pull-Request mit Kurzbeschreibung und Link auf `docs/auftrag-3/README.md`.
- Alles in `docs/auftrag-3/` selbst lesen, dazu die Dateien aus Schritt 1 des Prompts. Die Mockups in `vorlagen/` mit Playwright öffnen und durchklicken.
- **Basis-Messung** nach [09-pruefen.md](09-pruefen.md) Abschnitt 1, inklusive `tools/texte-basis.js` und `tools/texte-pruefen.js`.
- `balance.json → auftrag3` mit allen Schaltern anlegen (alle zunächst `true`, die Systeme gibt es noch nicht).
- Dev-Reiter „Tiefe“ als leere Hülle anlegen, die in jedem Meilenstein wächst.

| Agenten | Haiku: Basis-Läufe starten und Ausgaben wörtlich zurückgeben. Alles andere du |
|---|---|

**Abnahme:** Draft-PR offen. Basis-Tabelle in `fortschritt.md`. `texte-basis.json` liegt im Repo, `texte-pruefen.js` läuft grün. Basis-Fotos in `bilder/M0/`.

## M1 Welle 1: sieben Fixes

Alles aus [04-welle-1.md](04-welle-1.md), je Fix erst den Test (rot), dann der Fix (grün).

| Agenten | Du: Fixes 2 bis 7 (Kern-Dateien). Sonnet ×3 (parallel, je eine Akt-Gruppe): 54 Fragment-Texte als Entwurf. Sonnet: Relief-Maler erweitern, wo Motive fehlen. Haiku: Suche nach allen `<s>`, `<del>`, `line-through`, „Leben“-Zeilen und weiteren Stellen für Fix 4 und 5 |
|---|---|

**Abnahme:** `test-welle1.js` grün mit Beleg, dass jeder Test vorher rot war. Alle 75 Fragmente vorhanden, jedes von dir gelesen. Fotos laut [04-welle-1.md](04-welle-1.md). Build-Bots nach Fix 6 und 7 mit Basis verglichen. `texte-pruefen` grün.
**Mindestens:** alles oben. Reliefs, für die der Maler nicht reicht, nutzen ein vorhandenes Motiv, das zum Text passt, und stehen im Bericht.

## M2 Kampf-HUD, Stoff-Baum, Plakette, Aufstellung

[05-oberflaeche.md](05-oberflaeche.md) Abschnitte 1 bis 5.

1. **Du:** `js/ui/oberflaeche.js` in Module aufteilen, ohne Verhalten zu ändern (Beleg: Tests grün, Fotos pixelgleich).
2. **Du:** HUD-Gerüst (Kopfleiste, Szene, Footer als Tisch, eigener Balken mit Blau und Schraffur, Karten mit Reaktions-Band), Kamera im Kampf raus, Fragezeichen raus.
3. **Parallel:** Sonnet baut den Stoff-Baum (Ansicht und Mitrücken, Logik nur über `reactionsFor`), Sonnet baut die Gegner-Plakette, Haiku schlägt für jede Szene aller 25 Biome die Stellplätze `stell` vor.
4. **Du:** Stellplätze prüfen (Kontaktbogen je Biom mit 1, 2 und 3 Gegnern, selbst ansehen), korrigieren, einbauen. Stoffrad und alte Anzeigen entfernen.

**Abnahme:** `test-oberflaeche.js` grün (keine Überlappung, Baum = Kampf-Reaktionen, kein Fragezeichen, keine Kamera). Fotos aller drei Auflösungen neben `vorlagen/hud-variante-2.png`: Kampf mit 1, 2, 3 Gegnern, mit Wächter, mit Sackgasse, mit Hochreaktion, nach dem Gegnerzug. Kontaktbögen der Stellplätze aller 25 Biome. Autospieler 50 Seeds ohne Fehler.
**Mindestens:** alles außer der Mitrück-Animation des Baums (dann springt er ohne Bewegung weiter).

## M3 Peilkarte im Nebel und Fahrt nach vorne

[05-oberflaeche.md](05-oberflaeche.md) Abschnitte 6 und 7.

1. **Du:** Netz-Erzeugung je Akt in `run.js` (ersetzt `genWeg`), Speicherstand, Folgen (Abkürzung, Brüchiger Gang, Dunkler Stollen), Wandbild hebt Nebel. `test-karte.js`.
2. **Parallel:** Sonnet zeichnet die Peilkarte (feine Pixel, Nebel, Pfade, Knoten, Kopfleiste, Biom-Wahl als zwei Ausschnitte, Platz für die Regelbiegung). Haiku schlägt `weg_richtung` und Zielpunkt für jede Szene vor. Sonnet baut den Fahrt-Renderer aus den Szenen-Ebenen (Technik wie `vorlagen/saltmoor-kampf-kamera-probe-2.html`).
3. **Du:** jede Weg-Richtung mit einer Bildfolge (Anfang, Mitte, Ende) prüfen, keine Fahrt in eine Wand. Alte Wegwahl entfernen. Bots auf das Netz umstellen.

**Abnahme:** `test-karte.js` und `test-speicher.js` grün. Fotos der Karte am Aktanfang, nach zwei Schritten, nach dem Wandbild, mit verborgenem und aufgedecktem Einsturz, Biom-Wahl, alle neben `vorlagen/karte-b-peilkarte.png`. Bildfolgen der Fahrt für jedes Biom (Kontaktbogen). Autospieler 50 Seeds, Ø Knoten je Run wie Basis (±2).
**Mindestens:** Karte mit Nebel, Wandbild, Brüchigem Gang und Biom-Wahl, Fahrt für alle Szenen. Abkürzung und Dunkler Stollen dürfen fehlen.

## M4 Rucksack am Körper

[05-oberflaeche.md](05-oberflaeche.md) Abschnitt 8.

| Agenten | Sonnet ×3 (parallel, je drei Figuren): Silhouetten durch die Pipeline, Note vergibst du. Sonnet: Rucksack-Ansicht nach Vorlage. Du: Fächer-Logik an `S.areas`/`S.slots`, Anschlusspunkte `jobs.json → koerper`, Deck-Diff, Einbau an Rast, Werkstatt, Krämer, Fund, Taste R, alten Rucksackmodus und alte Itemleiste entfernen |
|---|---|

**Abnahme:** alle 9 Silhouetten Note ≥ 4 (Kontaktbogen neben den Favoriten und `vorlagen/fischer-figur-silhouette.png`). Fotos: jede Figur im Rucksack, Tausch mit Grün/Rot, gesperrte Plätze, Kerben, alle drei Auflösungen neben `vorlagen/rucksack-b-am-koerper.png`. Bots können weiter umbauen. `test-deckbau.js` grün.
**Mindestens:** alles außer Ziehen mit der Maus (Klicken reicht).

## M5 Kern 1: Die Tiefe biegt die Regeln

[06-lovecraft-kern.md](06-lovecraft-kern.md) Abschnitte 2 und 3.

1. **Du:** `js/core/biegung.js` mit den Einhakpunkten, `data/biegungen.json`, Anzeige in Kopfleiste, Peilkarte, Biom-Wahl und Stoff-Baum, Dev-Schalter.
2. **Erste Probe: Über Eck** in der namenlosen Stadt, ganz fertig (Logik, Baum, Bot-Strategie, Test, Foto, Regelprüfung, `kern-vergleich.js` mit nur dieser Biegung). Erst wenn sie besteht, weiter.
3. Die anderen drei Biegungen aus V2 (Salzstollen, Schwarzes Eis, Pforte), dann die zehn Biegungen des Plans.
4. **Agenten:** Sonnet schreibt Tests und Bot-Strategien je Biegung nach deiner Logik, Sonnet zeichnet die 14 Biegungs-Zeichen (Note ≥ 4), Haiku lässt die Vergleichsläufe laufen.

**Abnahme:** `test-biegungen.js` grün, Schalter aus = Basis-Verhalten (Bot-Vergleich). Regelprüfung aller 14 bestanden oder umgebaut. `kern-vergleich.js`: keine Biegung mehr als 10 Prozentpunkte unter „alle aus“ (sonst umgebaut und begründet). Fotos: jede Biegung im Kampf mit Baum, auf der Peilkarte und auf der Biom-Wahl.
**Mindestens:** Modul, Anzeige und die vier Biegungen aus V2. Die Biome ohne fertige Biegung spielen sich normal und stehen im Bericht.

## M6 Kern 2: Hören statt sehen

[06-lovecraft-kern.md](06-lovecraft-kern.md) Abschnitt 4.

| Agenten | Haiku: Kandidaten für `stumm` je Akt-IV-Biom und Akt-V-Vorraum mit Musterübersicht. Du: Auswahl, Logik, Schnittstelle `hoerbareAbsicht(e)`, Plakette ohne Absicht, Vorschau ohne stumme. Sonnet: die drei Einsätze in `music.js` je Biom-Fassung und der Abschnitt im Musik-Labor. Sonnet: Einstellung „Klänge als Zeichen“ |
|---|---|

**Abnahme:** `test-kern.js` (Teil Hören) grün. `musik-pruefen.js` grün (kein Clipping, Tonart, Tempo). Du hörst dir jeden Einsatz in jeder Akt-IV/V-Fassung selbst an (Aufnahme mit dem vorhandenen Werkzeug, Spektrum und Pegel im Protokoll) und beschreibst in einem Satz, ob man ihn heraushört. Foto der stummen Plakette, mit und ohne „Klänge als Zeichen“. Bot-Vergleich.
**Mindestens:** alles oben, das gehört zum Kern.

## M7 Kern 3: Sehen und gesehen werden

[06-lovecraft-kern.md](06-lovecraft-kern.md) Abschnitt 5.

| Agenten | Sonnet: drei Blick-Items mit Karten und Icons. Sonnet ×3 (parallel): die drei Gesehenen durch die Pipeline. Sonnet: je Wächter ein `gesehen`-Schritt als Vorschlag. Du: Wahl zu Kampfbeginn, Aufdecken, Gesehener, Beute, Bot-Regel, Einbau |
|---|---|

**Abnahme:** `test-kern.js` (Teil Blick) grün. Gesehene Note ≥ 4. Fotos: Wahl, Kampf mit Hinsehen (stummer Gegner wird lesbar), Gesehener, Wächter mit Zusatzschritt, Beute 1 aus 4. Bot-Vergleich.
**Mindestens:** alles außer den eigenen `gesehen`-Schritten je Wächter; dann bekommt jeder Wächter als stärkeren Zug seinen stärksten Musterschritt ein zweites Mal, und das steht im Bericht.

## M8 Kern 4: Die Farbe

[06-lovecraft-kern.md](06-lovecraft-kern.md) Abschnitt 6.

| Agenten | Haiku: Farbton-Prüfung über alle Zonenpaletten (Skript, Abstand je Palette). Sonnet: das Ereignis (Text als Entwurf, Bild) und das Schimmern. Du: Stoff `X`, Wandern, Spur, Tilgen in der Werkstatt, Binden mit Salz, Baum und Rucksack, Bot-Strategie |
|---|---|

**Abnahme:** `test-kern.js` (Teil Farbe) grün, `test-speicher.js` mit Farbe grün. Fotos: Farbe auf Item, Karte nimmt Stoff an (Baum), Spur im Rucksack, Tilgen, gebunden. Bot-Vergleich alle vier Kern-Systeme zusammen.
**Mindestens:** alles oben. Wenn das Budget hier schon knapp ist, bleibt die Farbe per Schalter aus und M9 bis M11 werden auf Mindestens gebracht, nicht umgekehrt.

## M9 Begegnungen

[07-begegnungen-meta-wuerze.md](07-begegnungen-meta-wuerze.md) Abschnitte 1 und 2.

| Agenten | Haiku: `art` für alle Gegner vorschlagen, Kandidaten für `asche`, Kandidaten-Ereigniswahlen für `tiefe: 1`. Sonnet: diese Vorschläge gegen Steckbriefe prüfen. Du: Run-Zettel, die vier Begegnungen, Verbündeter, Einbau in Peilkarte (Spuren) und Wächter (Diener). Sonnet: Karte „Das Zeichen“ (Bild, Entwurfstext) |
|---|---|

**Abnahme:** `test-begegnungen.js` grün. 100 Seeds: höchstens zwei Begegnungen je Run, Häufigkeiten im Protokoll. Fotos: Wächter mit deiner Karte als Absicht, Asche rufen und Verbündeter, Spuren in vier Stufen, Seitenwechsel (Begegnung statt Kampf, Krämer verweigert). Regelprüfung aller vier.
**Mindestens:** Run-Zettel, Die Diener erheben sich und Spuren. Asche und Die Tiefe erkennt dich per Schalter aus.

## M10 Metaebene

[07-begegnungen-meta-wuerze.md](07-begegnungen-meta-wuerze.md) Abschnitt 3.

| Agenten | Sonnet: Texte als Entwurf (Ausrede-Stufen, Tagebuch-Notizen je Wächter und Biom, Ankunftszeile nach Umkehren, Pausen-Zeilen). Sonnet: Strand-Stufen als Bild. Du: Meta-Zähler mit Migration, Erbe, Fehlzeit (Autospieler im Hintergrund), Einbau ins Tagebuch |
|---|---|

**Abnahme:** `test-meta.js` erweitert und grün, `test-speicher.js` mit altem Meta-Stand grün. Fotos: Strand in allen Stufen, Ausrede in allen Stufen für zwei Figuren, Tagebuch mit Notizen, Erbe-Angebot, Fehlzeit-Angebot und Start bei der Kapelle mit fremden Handgriffen, Pausen-Zeile. Jeder neue Text von dir gelesen.
**Mindestens:** Spiel zählt mit, Ausrede bröckelt, Bleiben ist der Sog, Erbe, Tagebuch. Fehlzeit und Pause per Schalter aus.

## M11 Würze

[07-begegnungen-meta-wuerze.md](07-begegnungen-meta-wuerze.md) Abschnitt 4 (ohne den Krämer mit tausend Masken).

| Agenten | Sonnet je Stück ein Bauauftrag für Daten, Texte (Entwurf), Bilder und Klang nach deiner Logik-Vorgabe; Logik in Kern-Dateien baust du. Haiku: 100-Seed-Zählung der Würze |
|---|---|

**Abnahme:** Jedes Stück erzwingbar im Dev-Reiter, getestet, fotografiert, Regelprüfung bestanden. 100 Seeds: höchstens drei Würze-Stücke je Run, Mittel etwa 1,5, kein Stück in zwei aufeinanderfolgenden Runs.
**Mindestens:** Zanns Takt, Barmherzige Trennung, Zeitungsausschnitte und Der falsche Brief. Der Rest per Schalter aus.

## M12 Balance und Abschluss

- `kern-vergleich.js` und `build-bots.js 50` mit allen Systemen an. Zielbereich wie Auftrag 2 (Builds 40 bis 65 %, generischer Bot 50 bis 65 %, kein Akt über 35 % der Niederlagen). Ausgleich nur über `balance.json`, jede Änderung mit Grund.
- Geklickter Run nach [09-pruefen.md](09-pruefen.md) Abschnitt 6.
- Galerie und Artboard zeigen alles Neue (Silhouetten, Gesehene, Biegungs-Zeichen, Farbe, neue Items, Strand-Stufen).
- `prototype/data/README.md` erklärt alle neuen Daten und Felder.
- Bericht nach [01-regeln.md](01-regeln.md) Abschnitt 9 in `fortschritt.md` und im PR.

**Abnahme:** alle Tests grün, `texte-pruefen` grün, Bericht vollständig.

## Zugabe (nach M12, bis das Budget aufgebraucht ist)

In dieser Reihenfolge:

1. Alles, was in M1 bis M11 unter „Mindestens“ fehlt, nachholen.
2. **Der Krämer mit tausend Masken** als Probe ([07-begegnungen-meta-wuerze.md](07-begegnungen-meta-wuerze.md) Abschnitt 4), per Schalter, im Bericht als „Probe“.
3. Je tiefem Biom ein neues Ereignis, das mit seiner Regelbiegung spielt (Texte als Entwurf, „Der Geruch zuerst“ bei manchen).
4. Mehr Tagebuch-Notizen und Zeitungsausschnitte, damit sie sich seltener wiederholen.

**Nicht in die Zugabe:** Deck-Progression, alte Götter, NG+, neue Biome, Kamera im Kampf. Das ist ausgeklammert.
