# Fortschritt Auftrag 4

Wird vom Agenten geführt. Neueste Einträge oben in jedem Abschnitt.

## Stand

| Teil | Status | Notiz |
|---|---|---|
| Phase 0 Grundlagen (Raster, 16:9, Bildraum 560 × 315, Szenen erweitern, Bausteine, Schriften) | fertig | Commits fd2233a, 2fc1217 |
| Phase 1 Tiefe im Kampfbild | fertig | Commit 8f8b9d5 |
| Phase 2 Kampfoberfläche | fertig, ein Kriterium ✗ | Commits 2fc1217, 54c6646. Verdeckung in der Kapelle 11 bis 12 % statt höchstens 2 % (siehe Abnahme und Fragen) |
| Phase 3 Bewegung | fertig | Commit 75a4902 |
| Phase 4 Andere Bildschirme | fertig | Commit 1705a44 |
| Momentum Stufe 1 (Reliquien aus dem Rucksack, Vorschlag beim Ritzen, Wächter-Slot) | fertig | Commits 8424b9a, b18627a, Schalter `BAL.momentum` |

## Basis (vor jeder Änderung gemessen)

- Tests: [bilder/basis/basis-tests.txt](bilder/basis/basis-tests.txt). Rot schon auf `main`: test-run 1 FEHLER, test-karte 31 FEHLER, test-kern 1 Fehler, texte-pruefen 2 Abweichungen.
- Bilder: [Kampf Kapelle](bilder/basis/kampf-kapelle-1920x1080.png), [Kampf Salzstollen](bilder/basis/kampf-salz-1920x1080.png), Rast und Krämer in beiden Biomen (`bilder/basis/`).
- Bildzeit: im Mittel rund 5 ms je Bild (headless, 1920 × 1080).

## Entscheidungen

- **Momentum als Schalter:** Die drei Hebel stehen in `balance.json` unter `momentum` und lassen sich einzeln abschalten, weil Philip den Flow getrennt vom Look testen soll.
- **Wächter-Slot vor der Beute:** Der Moment kommt direkt nach dem Wächter und vor Handgriff und Reliquie, weil der neue Slot die Wahl der Reliquie beeinflusst. Sind alle Bereiche voll (4), entfällt er.
- **Vorschlag beim Ritzen:** Angelegte Items vor dem Rucksack, dann die Zahl der Reaktionen mit dem Deck, dann die Zahl der Stoffe. Der Grund steht als Satz daneben (zum Beispiel „Angelegt, wird Wasser“). Klick bestätigt, Ziehen des neuen Handgriffs auf ein anderes Item ritzt dort.
- **Reliquien aus dem Rucksack:** Nur Reliquien (Seltenheit `reliquie`), keine gewöhnlichen oder seltenen Items, so wie es der Plan sagt.
- **Zwischentitel der Szenen 4 Pixel tiefer** (46 statt 42), weil sonst die Lebenszahl in der Kopfleiste verdeckt war.
- **Szenen statt Kästen vor allem über CSS:** Die Bildschirme behalten ihren Aufbau und ihre Texte, nur Rahmen, Lage und Bewegung sind neu, damit kein Text und keine Regel verloren geht.
- **Titel ohne flackernde Fenster:** Der Titel hat Leuchtturmkegel, Nebel und das Schriftmenü mit Licht. Flackernde Fenster gibt es nicht, weil das Titelbild keine einzelnen Fenster als Ebene hat und Malen am Bild nicht Teil des Auftrags ist.
- **Rucksack heißt „AM KÖRPER“** mit der Zeile „Tiefe N · Phase · Biom“ darunter, weil „TIEFE I · KARTE“ kein Titel war.
- **Baum „Klar“ zeigt höchstens die letzten zwei Glieder der Kette** und bei einem Duo nur den ersten Stoff, weil 88 × 36 sonst nicht reicht.
- **Ziehstapel und Ablage als Pixelstapel** mit Zahl darunter, außen auf den Schultern (Standard aus dem Plan).
- **Randfarbe aus den Biomdaten** (`BIOMES[id].rand[1]`), weil jedes Biom schon eine Randfarbe hat. In der Kapelle ist sie gold, nicht grün.
- **Licht je Biom als Daten** (`biomes.json`, Feld `licht`: Punkt, Farbe, Raumfarbe, Wasser, Strahlen), weil der Plan „als Daten“ verlangt und so jedes neue Biom sein Licht mitbringt.
- **Verdeckung nur als Messung im Test:** Das Ergebnis (11 bis 12 %) steht im Test als Zahl und lässt ihn nicht scheitern, weil die Ursache in den Gegnerpositionen (`stell`) liegt, die der Plan nicht ändern lässt.
- **Bildraum 560 × 315** mit leichter Kantenglättung beim Vergrößern (Vergleich in `bilder/p0/glatt-vergleich.png`). 640 × 360 war nicht nötig.
- **Schultern eckig**, geschwungen als Schalter in den Einstellungen („Fußleiste mit geschwungenen Schultern“). Standard aus dem Plan.
- **Reaktions-Band über der Unterkante des Bildfensters.** Standard aus dem Plan.
- **Keine Sub-Agenten:** Alles ist in einer Sitzung selbst gebaut und geprüft, weil die Phasen dieselben Dateien berühren und jede Zusammenführung sonst geprüft werden müsste.

## Abnahmeprotokolle

#### Abnahme Momentum Stufe 1
- Abnahmekriterien aus plan.md:
  - ✓ Reliquien wirken auch aus dem Rucksack: test-momentum „Reliquie im Rucksack wirkt: Der Ofen unter der Fabrik (brand_springt) 0 → 1, Schalter aus 0, gewöhnliches Item im Rucksack +0“.
  - ✓ Der Handgriff liegt beim Ritzen schon im besten freien Item, mit Grund. Ein Klick bestätigt, Ziehen ändert: test-momentum (Vorschlag, Klick, Ziehen, Schalter aus), Bild [ritzen-vorschlag.png](bilder/momentum/ritzen-vorschlag.png).
  - ✓ Jeder besiegte Wächter gibt einen Slot im Bereich deiner Wahl (bis 4), als eigener Moment im Stil A: test-momentum „Wahl Kleidung: 2 → 3 Slots, danach die Beute“, „Alle Bereiche bei 4: keine Wahl“, Bild [waechter-slot.png](bilder/momentum/waechter-slot.png).
- Tests: `node tools/test-momentum.js` → `Alles gut.`, ganze Reihe siehe Bericht.
- texte-pruefen: siehe Bericht. Neue Texte: „EIN PLATZ MEHR“, „Der Wächter liegt still. Wo trägst du künftig mehr?“, „VORSCHLAG“, „HIER RITZEN“, „Vorschlag: hier ritzen“, die Gründe („Angelegt“, „Im Rucksack“, „wird …“, „bleibt stofflos“, „reagiert mit …“, „die einzige freie Kerbe“).
- Bots: `balance.js 100` mit Momentum an **47 %** Siege (Ø Tiefe 22,1), alle drei Hebel aus **32 %** (Ø Tiefe 20,4), je 0 Fehler. Der Flow macht das Spiel für den Bot deutlich leichter. Das gehört in den Spieltest.
- Bilder: `bilder/momentum/ritzen-vorschlag.png`, `bilder/momentum/waechter-slot.png`, selbst angesehen: ja.
- Abweichungen: Der Vorschlag steht im heutigen Ritzen-Bild, wie der Plan es für den ersten Test sagt.
- Agenten: keine.
- Offen: Ob der Wächter-Slot zu stark ist, zeigt erst ein Spieltest. Der Schalter `waechter_slot` nimmt ihn heraus.

#### Abnahme Phase 4
- Abnahmekriterien aus plan.md:
  - ✓ Rast, Beute, Werkstatt, Fundstelle und Krämer liegen frei über ihrer Szene, Ortsname als Zwischentitel oben links, Knöpfe als Plaketten mit vier Zuständen. Bilder `bilder/nachher/`.
  - ✓ Akt-Wechsel als Zwischentitel: Irisblende, Viragierung in Zonenfarbe, Korn, Buchstaben flackern herein.
  - ✓ Titel mit Leuchtturmkegel, Nebel und Schriftmenü mit Licht. Spielmenü mit Plakettenknöpfen.
  - ✓ Rucksack heißt „AM KÖRPER“, passt ins 16:9-Bild. Der Menüknopf verdeckt „Deck“ nicht (Bild Kampf).
  - ✗ teilweise: Ereignis-Zettel, Streichen und die Wahl-Listen (Schleifen, Kerbe, Umritzen) sind noch Kästen. Der Plan nennt nur die fünf Bildschirme oben, die Abnahme sagt „kein Bildschirm“.
- Tests: test-rucksack → `Alles gut.` (vorher 5 FEHLER durch die Höhe), ganze Reihe siehe Bericht.
- Bilder: `bilder/nachher/*-kapelle-*.png`, `bilder/vorher/*.png`, selbst angesehen: ja.
- Abweichungen: Titel ohne flackernde Fenster (siehe Entscheidungen).
- Agenten: keine.
- Offen: Ereignis-Zettel und Wahl-Listen als Szene.

#### Abnahme Phase 3
- Abnahmekriterien aus plan.md:
  - ✓ Drei Karten in unter zwei Sekunden, kein Klick geht verloren: test-bewegung „drei Karten in 548 ms gespielt, je Klick bis zur Wirkung 4, 1, 1 ms“. Flüge sind Klone über der Oberfläche, die Regel läuft sofort.
  - ✓ Austeilen vom Ziehstapel mit Umdrehen (`--sx`, `--sy` je Karte), Hand fliegt am Zugende zur Ablage.
  - ✓ Ausspielen mit Ausholen und Flug zum Ziel oder zum Leben, Hitstop und Zahl aus feedback.js, Splitter in Zonenfarbe.
  - ✓ Rauten erlöschen beim Bezahlen und leuchten zu Zugbeginn nacheinander auf (test-bewegung), Reaktionen als Stempel.
- Tests: `node tools/test-bewegung.js` → `Alles gut.`
- Bilder: Bewegung lässt sich im Standbild nicht zeigen, die Prüfung steht im Test.
- Abweichungen: keine. Bei `prefers-reduced-motion` und im Schnelllauf entfällt jede Bewegung.
- Agenten: keine.
- Offen: nichts.

#### Abnahme Phase 2
- Abnahmekriterien aus plan.md:
  - ✓ Sieht aus wie Look-Runde 7: Fußleiste mit Schultern in Zonenfarbe, Leben unter der Hand, Stapel außen, Baum „Klar“, Rauten 11, „ZUG BEENDEN“ 84, Karte 50 × 70, Plakette 50 × 26. Bilder `bilder/nachher/kampf-*.png`.
  - ✓ Keine Überlappung bei 5, 7 und 10 Karten und mit den 10 längsten Texten (bis 85 Zeichen), in 1920 × 1080, 1280 × 720 und 1000 × 700: test-fussleiste.
  - ✓ Alle Kartentexte passen (keine `.warn`).
  - ✗ Verdeckung der Gegner in der Kapelle höchstens 2 %: gemessen 11,0 bis 12,4 % (auf den deckenden Pixeln jedes Gegners im Bildraum). Grund: Der vordere mittlere Gegner steht laut `stell` auf Bodenlinie 222 (Oberfläche 188), also direkt hinter der Hand. Das Mockup hatte die Gegner höher stehen. Vorschlag in „Fragen an Philip“.
- Tests: `node tools/test-fussleiste.js` → `Alles gut.`, test-plakette, test-oberflaeche, test-karte-ui, test-stoffbaum → `Alles gut.`
- Bilder: `bilder/nachher/kampf-kapelle-*.png`, `kampf-salz-*.png`, `kampf10-*.png`, selbst angesehen: ja.
- Abweichungen: Baum zeigt höchstens zwei Glieder der Kette.
- Agenten: keine.
- Offen: Verdeckung.

#### Abnahme Phase 1
- Abnahmekriterien aus plan.md:
  - ✓ Kapelle und Salzstollen wie im Lichtpult mit „Alles“ ohne Vordergrund: Licht je Biom, Randlicht und Relight (je Bild gecacht), Schatten vom Licht weg, Spiegelung mit Füßen im Wasser, Bayer-Dunst zwischen den Ebenen und über dem Boden, Strahlen mit Staub, Augenlicht, Vignette. Bilder `bilder/nachher/kampf-*.png`.
  - ✓ Flüssig bei 60 fps: im Mittel rund 7 ms je Bild (vorher 5 ms), Spitzen um 20 ms, headless bei 1920 × 1080.
  - ✓ Keine Skalierung mehr (0,9, 0,92 und 1,3 entfernt), `stell` behält x und Bodenlinie. Wiegen und Atmen zeilenweise, Angriff mit Ausholen.
- Tests: test-run, test-kern → `Alles gut.`
- Bilder: siehe oben, selbst angesehen: ja.
- Abweichungen: keine.
- Agenten: keine.
- Offen: Bildzeit auf schwachen Rechnern nicht gemessen.

#### Abnahme Phase 0
- Abnahmekriterien aus plan.md:
  - ✓ Kampf und Rast haben dieselbe Bildbreite (16:9, 480 × 270 Oberflächenpixel).
  - ✓ Plaketten sind bei drei Fenstergrößen gleich groß (50 × 26 Oberflächenpixel).
  - ✓ Keine Szene zeigt am Rand Schwarz: `node tools/a4-rand.js` → „275 Szenen, mittlere Lücke 0.000 %, Szenen mit Lücke: 0“.
- Bilder: `bilder/p0/glatt-vergleich.png`, selbst angesehen: ja.
- Abweichungen: keine.
- Agenten: keine.
- Offen: nichts.

## Fragen an Philip

1. **Verdeckung:** Die vordere Reihe in der Kapelle steht hinter der Hand (11 bis 12 % der Gegnerfläche verdeckt statt 2 %). Sollen wir die vordere Reihe in `stell` um etwa 20 Szenenpixel anheben?
2. **Schultern:** eckig als Standard, geschwungen in den Einstellungen. Passt eckig?
3. **Stapel außen** auf den Schultern (Standard). Passt das?
4. **Reaktions-Band über der Unterkante des Bildfensters** (Standard). Passt das?
5. **Bildraum 560 × 315** mit leichter Kantenglättung beim Vergrößern. Passt das, oder lieber ganz scharf?
6. **Wächter-Slot:** Ist ein Slot je Wächter zu stark? Er lässt sich mit `momentum.waechter_slot` abschalten.

## Bericht

Stand 2026-11-15. Auf Moriz' Wunsch ohne Vorher-nachher-Bilder.

**Tests** (`sh tools/alle-tests.sh`): alles grün bis auf test-karte → 31 FEHLER und texte-pruefen → 2 Abweichungen, beide genau wie auf `main` (Basis). test-run und test-kern sind jetzt grün (auf `main` je 1 Fehler). sprites/pruefen 407 Sprites, 0 Verstöße. icons/pruefen 250 Bilder, 0 Verstöße.

**Bots:** Momentum an 47 %, aus 32 % (100 Seeds, 0 Fehler).

**Zuerst ausprobieren:**
1. Kampf in der Kapelle: `index.html?springe=kampf&akt=1`. Fußleiste, Hand, Bewegung, Licht.
2. Einen Wächter besiegen: `index.html?springe=waechter&akt=1`. Danach Slot-Wahl, Beute, Ritzen mit Vorschlag.
3. Rast, Krämer, Werkstatt: `index.html?springe=rast&akt=1` (oder `kraemer`, `werkstatt`).
4. Titel: `index.html`.
5. Einstellungen: „Fußleiste mit geschwungenen Schultern“.

**Offene Fragen:** siehe „Fragen an Philip“ oben.
