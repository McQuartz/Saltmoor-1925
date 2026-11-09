# Fortschritt Auftrag 3

Wird vom Agenten geführt. Neueste Einträge oben in jedem Abschnitt.

## Stand

| Meilenstein | Status | Notiz |
|---|---|---|
| M0 Einrichten und Basis | fertig | Branch `claude/project-thread-flvf7e` (von der Sitzung vorgegeben), Text-Basis, Schalter, Dev-Reiter TIEFE |
| M1 Welle 1: sieben Fixes | fertig | Panzer 15 %, Fragmente 75 |
| M2 Kampf-HUD, Stoff-Baum, Plakette, Aufstellung | fertig | HUD, Baum, Plakette, 100 Stellplätze |
| M3 Peilkarte und Fahrt nach vorne | fertig | Netz, Karte, Fahrt, 75 Weg-Richtungen |
| M4 Rucksack am Körper | fertig | 9 Silhouetten, Ansicht am Körper, Branch `claude/project-thread-hifkqz` (Philip) |
| M5 Die Tiefe biegt die Regeln | fertig | 14 Biegungen, keine mehr als 5 Pp unter „aus“ |
| M6 Hören statt sehen | fertig | sechs stumme Gegner, drei Einsätze, Klänge als Zeichen |
| M7 Sehen und gesehen werden | nicht begonnen | Stopp nach M6 (Philip) |
| M8 Die Farbe | nicht begonnen | Stopp nach M6 (Philip) |
| M9 Begegnungen | nicht begonnen | Stopp nach M6 (Philip) |
| M10 Metaebene | nicht begonnen | Stopp nach M6 (Philip) |
| M11 Würze | nicht begonnen | Stopp nach M6 (Philip) |
| M12 Balance und Abschluss | nicht begonnen | Stopp nach M6 (Philip) |
| Zugabe | nicht begonnen | Stopp nach M6 (Philip) |

## Basis (M0, unverändertes main)

Gemessen auf `main` `7e1497e` (Merge PR #15, enthält `80c4ea0` und nur den Auftrag-3-Plan), vor jeder Änderung. Ausgaben der Tests: [bilder/M0/basis-tests.txt](bilder/M0/basis-tests.txt).

| Messung | Wert |
|---|---|
| Tests | test-run, test-deckbau, test-ereignisse, test-vorschau (483 Karten, 0 Abweichungen), test-meta grün; sprites/pruefen 253 / 0 Verstöße; icons/pruefen 242 / 0 Verstöße |
| Generischer Autospieler (`balance.js 100`) | **48 %** Siege, Ø Tiefe 26,1, **Ø Züge je Kampf 4,3**, 0 Fehler |
| Niederlagen je Akt (generisch, 52) | I 4 (8 %) · II 9 (17 %) · III 10 (19 %) · IV 13 (25 %) · V 16 (31 %) |
| Niederlagen je Kampfart | normal 58 % · Finale 23 % · Wächter 13 % · Elite 6 % |
| Ø Knoten je vollem Run | 31 (test-run, 10 Runs mit viel Leben) |

Build-Bots (`build-bots.js 50`):

| Build | Siege | Niederlagen je Akt I/II/III/IV/V | Reaktionen/Zug |
|---|---|---|---|
| Glutnest | 46 % | 1/7/9/4/6 | 2,67 |
| Brackwasser | 30 % | 1/6/8/9/11 | 2,11 |
| Bollwerk | 58 % | 3/5/5/2/6 | 2,38 |
| Aderlass | 52 % | 4/4/10/5/1 | 2,34 |
| Kettenwerk | 44 % | 1/2/7/6/12 | 2,77 |
| Hagel | 34 % | 3/3/9/8/10 | 2,05 |
| Ballast | 44 % | 5/3/7/1/12 | 2,39 |
| Kollekte | 50 % | 3/5/4/6/7 | 2,32 |

Basis-Fotos 1440×900: [Kampf](bilder/M0/kampf-1440x900.png), [Wegwahl](bilder/M0/weg-1440x900.png), [Rucksackmodus](bilder/M0/rucksack-1440x900.png), [Belohnung](bilder/M0/belohnung-1440x900.png), [Wandbild](bilder/M0/wandbild-1440x900.png).

## Einträge je Meilenstein

*Je Meilenstein: Umsetzungsplan (vor dem Code), Arbeitsschritte, Abnahmeprotokoll ([09-pruefen.md](09-pruefen.md) Abschnitt 5), Agenten.*

### M0 Einrichten und Basis

**Plan.** Neu: `tools/texte-lib.js`, `tools/texte-basis.js`, `tools/texte-pruefen.js`, `tools/ui-fotos.js`, `docs/auftrag-3/texte-basis.json`. Geändert: `data/balance.json` (`auftrag3`), `js/core/state.js` (`a3(k)`), `js/dev/dev.js` (Reiter TIEFE), `js/main.js` (`?a3aus=`). Alles selbst, Bot-Läufe im Hintergrund (kein Sub-Agent: die Läufe sind ein Befehl, die Ausgabe lese ich selbst).

**Schritte.** Basis-Tests und Bots auf unverändertem `main`; Text-Basis (3653 Datentexte mit Datei und Pfad, Array-Einträge über ihre `id` adressiert, dazu 120 feste UI-Texte); Prüfer; Schalter; Dev-Reiter; Fotos; Mockups angesehen.

**Text-Prüfung, wie sie arbeitet.** Datentexte: an derselben Stelle gleich, oder (falls der Eintrag umgezogen ist) derselbe Text im selben Feld derselben Datei. UI-Texte: irgendwo in `prototype/js/` (die Oberfläche wird in M2 in Module geteilt). Alte Anzeigen, die der Auftrag ausdrücklich ersetzt (z. B. die Zeile „−x Leben“), stehen mit Grund in `texte-entfernt.json`. Neue Datentexte brauchen `"entwurf": true` am Datensatz oder einem Vorfahren.

#### Abnahme M0
- Draft-PR offen: ✓ (Link im PR-Abschnitt unten)
- Basis-Tabelle in `fortschritt.md`: ✓ (oben)
- `texte-basis.json` im Repo, `texte-pruefen.js` grün: ✓
- Basis-Fotos in `bilder/M0/`: ✓, selbst angesehen: ja
- Schalter `balance.json → auftrag3` (alle `true`), `a3(k)` im Kern, `?a3aus=` in der Adresse: ✓
- Dev-Reiter „Tiefe“ als Hülle mit den Schaltern: ✓
- Tests: siehe Basis-Tabelle; `node tools/texte-pruefen.js` → `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 0, alle als Entwurf markiert.`
- Mockups `vorlagen/*.png` angesehen: HUD Variante 2, C1 gestaffelt, Peilkarte B, Rucksack B.
- Agenten: keine.
- Offen: nichts.

### M1 Welle 1: sieben Fixes

**Plan.** Zuerst `tools/test-welle1.js` (Kern in Node, dazu Fix 3/4/5 im Browser), rot belegen. Fragmente: drei Sonnet-Agenten je eine Akt-Gruppe (54 Entwürfe), ich lese jedes. Relief-Maler: ein Sonnet-Agent im Worktree, nur `World.relief`/`B.relief` in `basis.js` und `tools/relief-bogen.js`, ohne Motiv pixelgleich. Fixes 2, 3, 6, 7 in `run.js`, `combat.js`, `rules.js` selbst; Fix 4, 5 und die Anzeige von Fix 3 und 7 in `oberflaeche.js` und `spiel.css`. Danach alle Tests, Bots, Fotos.

**Schritte und Entscheidungen.**
- **Fix 1:** 54 neue Fragmente (`entwurf: true`), je Biom 3, zusammen 75. Jedes hat ein `motiv` für das Relief; Motiv-Überschreibungen nach Text (grotte_1, glockengiesserei_1, waage_1/2/3 → waage, mond_1 → auge), waage_3 Relief-Satz an den Text angepasst. Sechs schalten eine Figur frei (`schaltet`: fabrik_2 gasmask, grotte_2 veil, wald_2 boardaxe, station_2 pick, glasmeer_2 woolcoat, waage_2 bible). `reliefMalen` gibt das Motiv weiter, `pforte.js` reicht es durch.
- **Fix 2:** `beuteSatzWaehlen` in `run.js`: stärkster besiegter Gegner mit `beute_satz`, sonst `beute_saetze` des Bioms, sonst die `beute_satz` der Gegner dieses Bioms. Grund für die dritte Stufe: Die sieben Grundbiome (Hafen bis Pforte) haben keine `beute_saetze`, ohne sie lag der Ersatztext bei 17,8 %. Es wird kein Text neu geschrieben, nur vorhandene Sätze an einer zweiten Stelle gezeigt. Nie zweimal hintereinander derselbe (`S.letzterBeuteSatz`).
- **Fix 3:** Gegner bekommen beim Handeln `gehandelt`, nach dem letzten `S.nachGegnerzug`; `absichtSichtbar(e)` und `incomingSichtbar()` blenden sie aus. Neues Bus-Ereignis `gegnerzug_ende`, danach 380 ms Pause, dann `startTurn` (dort wird alles zurückgesetzt). `busy` bleibt in der Pause gesetzt, damit „Zug beenden“ nicht doppelt greift.
- **Fix 4:** Absicht zeigt nur den echten Wert; „Geschwächt: halber Schaden“ im Tooltip der Plakette und als `title`. Weitere `<s>`, `<del>`, `line-through` in Kampfanzeigen: keine (nur `galerie.css`, Ideen-Kacheln, kein Kampf). Die Suche war ein `grep`, darum kein Haiku-Agent.
- **Fix 5:** Zeile `.swarn` weg. Im Balken: roter Rest schraffiert (`.schraffur`, Breite = max(0, eingehend − Block) / max. Leben), darunter ein blauer Block-Streifen, dessen brechender Teil schraffiert ist. Die bisherigen Worte der Zeile stehen unverändert im Tooltip des Balkens, darum ist kein UI-Text entfernt. In M2 zieht das in den neuen Balken.
- **Fix 6:** `verstaerkt(v, mult)` in `rules.js`, in `applyMain` für Ziehen, Stärke, Gold; Energie nicht. `previewCard` meldet `draw`. Kartentext zeigt den verstärkten Wert, wenn alle Reaktionen der Karte bekannt sind (sonst würde der Text eine unentdeckte Reaktion verraten), farbig markiert.
- **Fix 7:** `unverwJetzt(e)` gilt nur, solange ein anderer Gegner lebt (`dienerVon`), dynamisch, also fällt der Schutz im selben Zug. Allein: `panzerZugbeginn()` gibt Panzer = max(5, round(max × anteil / 5) × 5), `anteil` 0,15 in `balance.json → panzer` (erst 0,4, gemessen und gesenkt, siehe Abnahme), fängt nur direkten Schaden (`hit(..., {dot:true})` für Gift/Brand und `poison_burst` geht vorbei), fällt im Zug des Bosses. Plakette: Panzerwert mit Schild-Zeichen und Tooltip-Satz (Entwurf); im Unverwundbar-Zug gestrichelte Linien zu den Dienern. Das Wort „unverwundbar“ an der Absicht erscheint nur noch, wenn es gilt.
- **Alter Test angepasst:** `test-deckbau.js` Abschnitte 10 und 12 prüften Unverwundbarkeit mit einem einzelnen Gegner. Das ist genau das Verhalten, das Fix 7 ändert; dort steht jetzt ein Tiefling als Diener daneben (Kommentar im Test).

#### Abnahme M1
- `test-welle1.js` grün, vorher rot: ✓ [vorher](bilder/M1/test-welle1-vorher.txt) (22 FEHLER), [nachher](bilder/M1/test-welle1-nachher.txt) (`Alles gut.`)
- 75 Fragmente, jedes von mir gelesen: ✓ (test-welle1 Fix 1: 75, je Biom 3, 176 Wandbild-Knoten in 50 Runs, keiner leer)
- Fotos laut 04-welle-1.md: ✓ Wandbild aus drei neuen Biomen [fabrik](bilder/M1/wandbild_fabrik-1440x900.png), [waage](bilder/M1/wandbild_waage-1440x900.png), [leuchtturm](bilder/M1/wandbild_leuchtturm-1440x900.png); [Belohnung mit Satz](bilder/M1/belohnung-1440x900.png); [nach dem Gegnerzug](bilder/M1/gegnerzug-1440x900.png); [geschwächt](bilder/M1/geschwaecht-1440x900.png); [Schraffur](bilder/M1/schraffur-1440x900.png); [Verstärkt + Ziehen](bilder/M1/verstaerkt-1440x900.png); [Boss mit Panzer](bilder/M1/panzer-1440x900.png); [Schutz an Dienern](bilder/M1/schutz-1440x900.png); Relief-Bögen [1](bilder/M1/relief-bogen.png) [2](bilder/M1/relief-bogen-2.png) [3](bilder/M1/relief-bogen-3.png). Selbst angesehen: ja
- Build-Bots nach Fix 6 und 7 mit Basis verglichen: ✓ (unten)
- Tests (Ausgaben in [tests-nachher.txt](bilder/M1/tests-nachher.txt)): test-run → `Alles gut.`; test-deckbau → `Alles gut.`; test-ereignisse → `Alles gut.`; test-vorschau → `Gespielte Karten mit Vorschau: 336, Abweichungen: 0`; test-meta grün (45 Fragmente gespeichert, nach Reset 0); sprites/pruefen → `253 Sprites geprüft, 0 Verstöße.`; icons/pruefen → `242 Bilder geprüft, 0 Verstöße.`; test-welle1 → `Alles gut.`
- texte-pruefen: `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 162, alle als Entwurf markiert.`
- Bots: generisch (`balance.js 100`) **52 %** (Basis 48 %), Ø Züge je Kampf 4,3 (4,3), 0 Fehler. Je Build (50 Seeds, Basis in Klammern): Glutnest 44 (46), Brackwasser 36 (30), Bollwerk 52 (58), Aderlass 52 (52), Kettenwerk 52 (44), Hagel 44 (34), Ballast 48 (44), Kollekte 52 (50). Hagel lag über 8 Punkte: mit 200 Seeds auf Basis und jetzt nachgemessen, 36 % → 38 % ([vorher](bilder/M1/hagel-200-vorher.txt), [nachher](bilder/M1/hagel-200-nachher.txt)), also Streuung der 50er-Stichprobe, kein Ausgleich nötig. Kettenwerk +8 genau an der Grenze.
- Panzer (`tools/panzer-messen.js`, ganze Bot-Runs mit erzwungenem Wächter, je Kampf mit und ohne Panzer): Ziel ist, dass ein Panzer-Zug den Kampf um höchstens etwa einen Zug verlängert. Der Anteil 0,4 ist nur mit einer ersten, verworfenen Messung (Startdeck, unendlich Leben) belegt, dort verlängerte der Panzer jeden Wächterkampf um 2 bis 6 Züge. Mit dem endgültigen Werkzeug bei 0,2 gewichtet Ø 1,15 Züge je Panzer-Zug ([0,20](bilder/M1/panzer-messen-0.20.txt)). Bei **0,15** gewichtet Ø 0,89 Züge je Panzer-Zug (Wächter einzeln 0,33 bis 1,40, kleine Stichproben) ([0,15](bilder/M1/panzer-messen.txt)). Danach `balance.js 100` mit 0,15: 48 % Siege, Ø 4,1 Züge je Kampf, 0 Fehler ([balance-0.15](bilder/M1/balance-0.15.txt)).
- Regelprüfung: Panzer statt Unverwundbarkeit: 7/7 bestanden (Tabelle in „Regelprüfung“)
- Abweichungen von Vorlage oder Konzept: Fix 2 dritte Stufe (Gegner-Sätze des Bioms), Grund oben. Fix 5 Block als Streifen unter dem Balken statt im Balken, bis M2 den Balken neu baut. Kein Haiku für die Suche (ein `grep`).
- Agenten: Sonnet: Fragmente Akt-Gruppe I–II; Sonnet: Fragmente Akt-Gruppe III; Sonnet: Fragmente Akt-Gruppe IV–V; Sonnet: Relief-Maler (13 Motive, ohne Motiv pixelgleich, 125 Canvas-Hashes verglichen)
- Offen: Reliefs malen je Motiv eine allgemeine Komposition, keine Fragment-Einzelheiten (Farben der Lichter, Wachshände). Von 25 Biomen lädt `index.html` nur 7 Szenen-Skripte vorab; die übrigen kommen über die Pakete, das Relief nimmt die Palette des geladenen Bioms.

### M2 Kampf-HUD, Stoff-Baum, Plakette, Aufstellung

**Plan.** Zuerst `oberflaeche.js` in Module teilen (`oberflaeche.js` Kopf/Spieler/render, `kampf.js`, `bildschirme.js`, `ueberlagerungen.js`) und mit `ui-fotos.js --dom` belegen, dass das HTML aller Ansichten gleich bleibt. Dann das HUD-Gerüst selbst (Kopfleiste, Footer als Tisch, eigener Balken mit Block und Schraffur, Reaktions-Band an der Karte, keine Kamera im Kampf, keine Fragezeichen). Parallel in eigenen Worktrees: Sonnet Stoff-Baum (nur über `reactionsFor`), Sonnet Gegner-Plakette (nur der Gegner-Abschnitt von `kampf.js`), Haiku Stellplätze `stell.json` für alle 100 Szenen. Danach Kontaktbögen im Spiel (`tools/stell-bogen.js`), `tools/test-oberflaeche.js`, Fotos, Bots.

**Schritte und Entscheidungen.**
- **Aufteilung:** HTML aller 13 Ansichten vor und nach der Teilung gleich (`ui-fotos.js --dom`), Tests grün (Commit 0c69dc3).
- **Reaktionen immer mit Namen:** Das Band an der Karte, der Stoff-Baum, das Ritzen und die Rucksack-Vorschau nennen jede Reaktion, auch unentdeckte. „Kein Fragezeichen“ geht vor dem Verstecken. Das Buch listet nur entdeckte Reaktionen; die alten Zeilen „? ? ?“ stehen nur noch im toten `render.js`.
- **Band an der Karte:** hängt unten an der Karte und wächst nach unten, bricht um, wenn es breiter als die Karte wäre (bei drei Reaktionen sonst über der Nachbarkarte, im Foto gesehen und behoben).
- **Plakette:** vom Sonnet-Agenten übernommen (`plaketteHtml`, `js/ui/plakette.js` ordnet die Höhen per MutationObserver nach jedem Einsetzen, `css/plakette.css`). Die alten Regeln `.feind .info/.nm/.zl/.sts` in `spiel.css` habe ich entfernt, die Galerie zeigt Zustände jetzt in der Plakette. Block steht als blauer Wert am Balkenende, nicht als proportional lange Verlängerung (lesbarer bei kleinen Werten). Verwundbar nutzt das Zeichen `atk2` in Orange.
- **Stellplätze:** 100 Szenen aus dem Haiku-Vorschlag. Alle 25 Kontaktbögen im Spiel (je Szene 1, 2, 3 Gegner) selbst angesehen, zum Teil verkleinert als Bogen zu sechst: kein Gegner schwebt, steht in einer Wand oder verdeckt einen anderen. Keine Korrektur nötig. `aufstellen` setzt `platzWunsch` (großer Gegner Platz 0; einer [0]; zwei [1,2]; sonst [0..4]), die Zeichenreihenfolge folgt der Tiefe.
- **Kamera:** im Kampf fest bei 0 (kein Mausfolgen, kein Atmen), das Wackeln bei Treffern bleibt.
- **Tests:** Plaketten werden einen Zeitschlitz nach `render()` geordnet; `test-oberflaeche.js` wartet darum vor dem Messen.

#### Abnahme M2
- Abnahmekriterien:
  - `test-oberflaeche.js` grün: ✓ 3 Auflösungen × 4 Biome × Kampf/Wächter × 1 bis 3 Gegner, keine Überlappung (Plaketten, Balken, Karten), Baum = `reactionsFor`, kein Fragezeichen, keine Kamera, keine Konsolenfehler → `Alles gut.`
  - Fotos aller drei Auflösungen: ✓ [1 Gegner](bilder/M2/kampf-1440x900.png), [2](bilder/M2/kampf2-1440x900.png), [3](bilder/M2/kampf3-1440x900.png), [Wächter](bilder/M2/waechter-1440x900.png), [Sackgasse](bilder/M2/sackgasse-1440x900.png), [Hochreaktion](bilder/M2/hochreaktion-1440x900.png), [nach dem Gegnerzug](bilder/M2/gegnerzug-1440x900.png), je auch `-1280x720` und `-1920x1080`. Neben der Vorlage: [vergleich-vorlage-1440x900.png](bilder/M2/vergleich-vorlage-1440x900.png)
  - Kontaktbögen der Stellplätze aller 25 Biome: ✓ [bilder/M2/stell-spiel/](bilder/M2/stell-spiel/)
  - Autospieler 50 Seeds ohne Fehler: ✓ 48 %, 0 Fehler ([balance-50.txt](bilder/M2/balance-50.txt))
- Tests ([tests-nachher.txt](bilder/M2/tests-nachher.txt)): test-run → `Alles gut.`; test-deckbau → `Alles gut.`; test-ereignisse → `Alles gut.`; test-vorschau → `Gespielte Karten mit Vorschau: 400, Abweichungen: 0`; test-welle1 → `Alles gut.`; test-stoffbaum → `Alles gut (33 Prüfungen).`; test-plakette → `Alles gut.`; test-oberflaeche → `Alles gut.`
- texte-pruefen: `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 162, alle als Entwurf markiert.`
- Bots: generisch 50 Seeds 48 % (Basis 48 %), Ø 3,9 Züge je Kampf, 0 Fehler. Je Build nicht neu gemessen: M2 ändert keine Regel.
- Bilder: oben, dazu [Plakette](bilder/M2/plakette-3-gegner.png) und [Stoff-Baum](bilder/M2/baum-3-lang.png) vom Agenten, selbst angesehen: ja (Plakette 2, 3, 4 Gegner, Wächter, Block, Panzer, Geschwächt, Vorschau, Verborgen, Stumm; HUD alle sieben Ansichten bei 1440×900, Fußleiste von Hochreaktion auch bei 1280×720)
- Regelprüfung: keine neue Mechanik in M2.
- Abweichungen von Vorlage oder Konzept: Block am Gegner als Wert statt proportionaler Verlängerung; Plakette etwas breiter als in der Vorlage, weil sie den Namen trägt; Reaktionen auch unentdeckt mit Namen (Grund oben). Der Baum zeigt zu Zugbeginn nur den leeren Ausgangspunkt.
- Agenten:
  - Sonnet: Stoff-Baum (`stoffbaum.js`, `stoffbaum.css`, `test-stoffbaum.js`)
  - Sonnet: Gegner-Plakette (`plakette.js`, `plakette.css`, Gegner-Abschnitt von `kampf.js`, `test-plakette.js`)
  - Haiku: Stellplätze aller 100 Szenen (`stell.json`)
- Offen: Die Rückfallregel der Plaketten-Staffelung (Plakette weicht nach unten aus, wenn oben kein Platz ist) kam in keinem Test vor. Stumme Gegner gibt es in den Daten noch nicht (M6).

### M3 Peilkarte im Nebel und Fahrt nach vorne

**Plan.** Kern selbst: `js/core/netz.js` erzeugt beim Betreten eines Akts das ganze Netz aus dem Seed (gleiche Ebenen-Regeln wie das alte `genWeg`, das ersetzt ist), Folgen, Speicherstand, Wandbild hebt Nebel; `test-karte.js`, `test-speicher.js`. Jede Szene meldet ihre Kulisse (`sz.kulisse`), `data/fahrt.json` trägt je Kulisse Weg-Richtung und Zielpunkt, `chooseWeg` ruft die Fahrt (im FAST-Modus übersprungen, reine Animation). Parallel: Sonnet Peilkarte (Ansicht, Biom-Wahl, Taste M), Sonnet Fahrt-Renderer, Haiku Weg-Richtungen der 75 Kulissen. Danach jede Fahrt selbst als Bildfolge prüfen und korrigieren.

**Schritte und Entscheidungen.**
- **Netz:** je Ebene die Knoten nach `pool`, `wege`, `mindestens`, `verschiedene`, `einer_von`, `fest`, `fest_wahl`; Pfade nur zur nächsten Ebene, ohne Kreuzung, jeder Knoten hat Aus- und Eingang, alle führen zum Wächter. `S.weg` bleibt die Liste der erreichbaren Knoten, darum laufen Bots und Eingabe unverändert über `chooseWeg`.
- **Folgen** (je Akt höchstens zwei, über den Seed): Abkürzung (überspringt eine Ebene, nur am oberen oder unteren Rand, damit sie nichts kreuzt, führt in einen schweren Kampf), Dunkler Stollen (leere, verschattete Raute bis direkt davor oder bis zum Wandbild), Brüchiger Gang.
- **Brüchiger Gang:** Der Agent fand, dass ein Gang, der direkt am Ort der Tat hängt, nie hinter dem Nebel einstürzen kann (Sicht = Stelle + 2). Ich habe den Kern geändert: Der Gang hängt an einem Ort (`bruch.ort`, Werkstatt, Krämer oder Rast) und liegt mindestens drei Ebenen dahinter, also beim Einsturz immer im Nebel. Man hört das Rumpeln und sieht den Einsturz erst, wenn der Nebel weicht. `test-karte.js` prüft das für alle Netze aus 150 Seeds. Dadurch kommt der Gang seltener vor (80 statt 197 in 750 Netzen).
- **Kulisse:** Alle 25 Biome bauen Kampf, Ereignis, Krämer usw. auf drei Hintergründe. `World.build` meldet jetzt `kulisse` (0, 1, 2 oder `waechter`), der Schlüssel für die Fahrt ist `biom:kulisse` (75 Einträge).
- **Weg-Richtungen:** Haiku schlug 75 vor (32 unsicher). Ich habe alle 75 Bildfolgen (Anfang, Mitte, Ende) angesehen und 14 korrigiert, wo die Fahrt in eine Wand lief: fabrik:1, funkstation:1, glockengiesserei:2, kapelle:2, kurhaus:1, leuchtturm:2, stadt:0/1/2, station:0/1/2 (station:2 jetzt `auf`, die Treppe), wald:1, ziegelgruben:2. gezeitenwerk:2 (Zahnräder ringsum) bleibt `vor`, weil jede Seite gleich zugebaut ist.
- **Fahrt:** Ebenen mit Nähe je Tiefe, Boden in Streifen zu 2 Zeilen, `links`/`rechts` erst gegenläufige Drehung, dann Drift; danach gedithertes Nebel-Überblenden in den Nebelfarben des Bioms. Einstellung „Übergänge kürzer“ halbiert die Dauer (Kästchen im Einstellungs-Dialog).
- **Peilkarte:** Canvas 720×405 (Kartenpixel = 2/3 Szenenpixel, also feiner), unsichtbare Knöpfe über den Rauten, Kopfleiste wie im Kampf mit Knopf „Karte“, Taste M und Esc, im Kampf nur lesend. Platz für die Regelbiegung liest `BIOMES[b].biegung` (kommt in M5, bis dahin leer ohne Hinweis).
- **Entfernt:** die alte Wegwahl (`wegHtml` zeigt die Karte), Überschrift „WOHIN?“ (in `texte-entfernt.json` mit Grund). Alle übrigen Texte der alten Wegwahl stehen wörtlich in der Karte oder ihren Tooltips.

#### Abnahme M3
- Abnahmekriterien:
  - `test-karte.js` grün: ✓ `Netze: 750, Knoten: 10313, Folgen: {"bruch":80,"kurz":125,"dunkel":238}` → `Alles gut.`
  - `test-speicher.js` grün: ✓ 30 Seeds, 240 Prüfungen (Netz, Position, gegangene Wege, Nebel, Einsturz nach Laden gleich, Weiterspielen im selben Netz) → `Alles gut.`
  - Fotos der Karte neben [karte-b-peilkarte.png](vorlagen/karte-b-peilkarte.png), je in drei Auflösungen: ✓ [Aktanfang](bilder/M3/karte-anfang-1440x900.png), [nach zwei Schritten](bilder/M3/karte-zwei-schritte-1440x900.png), [nach dem Wandbild](bilder/M3/karte-wandbild-1440x900.png), [Einsturz verborgen](bilder/M3/karte-bruch-verborgen-1440x900.png), [Einsturz aufgedeckt](bilder/M3/karte-bruch-sichtbar-1440x900.png), [Dunkler Stollen](bilder/M3/karte-dunkel-1440x900.png), [Biom-Wahl](bilder/M3/karte-biomwahl-1440x900.png), [im Kampf, nur lesend](bilder/M3/karte-im-kampf-1440x900.png)
  - Bildfolgen der Fahrt je Biom: ✓ [bilder/M3/fahrt/](bilder/M3/fahrt/) (25 Bögen, je Kulisse Anfang, Mitte, Ende), dazu [im Spiel](bilder/M3/fahrt/spiel-2.png)
  - Autospieler 50 Seeds, Ø Knoten je Run wie Basis (±2): ✓ 48 %, 0 Fehler ([balance-50.txt](bilder/M3/balance-50.txt)); Knoten je vollem Run 31, 31, 31, 31, 31, 30, 31, 31, 31, 28 (Ø 30,6, Basis 31; die Abkürzung spart eine Ebene)
- Tests ([tests-nachher.txt](bilder/M3/tests-nachher.txt)): test-run → `Alles gut.`; test-deckbau → `Alles gut.`; test-ereignisse → `Alles gut.`; test-vorschau → `Gespielte Karten mit Vorschau: 400, Abweichungen: 0`; test-welle1 → `Alles gut.`; test-stoffbaum → `Alles gut (33 Prüfungen).`; test-karte → `Alles gut.`; test-speicher → `Alles gut.`; test-plakette → `Alles gut.`; test-oberflaeche → `Alles gut.`; test-karte-ui → `Alles gut.` (1500 Karten, 26035 Pfade, keine Kreuzung)
- texte-pruefen: `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 237, alle als Entwurf markiert.`
- Bots: generisch 50 Seeds 48 % (Basis 48 %), Ø 3,9 Züge je Kampf, 0 Fehler.
- Bilder: oben, selbst angesehen: ja (Karte zwei Schritte, Einsturz aufgedeckt, Biom-Wahl bei 1440×900 neben der Vorlage; alle 25 Fahrt-Bögen und die 14 korrigierten Fahrten erneut)
- Regelprüfung: Folgen auf der Karte: 7/7 bestanden (Tabelle in „Regelprüfung“)
- Abweichungen von Vorlage oder Konzept: Nebel gedithert statt weich (Regel: kein Weichzeichner); Brüchiger Gang hängt an einem Ort drei Ebenen davor (Grund oben); das Kurzbild der Biom-Wahl ist ein kleines Netz aus dem Seed, keine Szene; Spuren (M9) fehlen noch.
- Agenten:
  - Sonnet: Peilkarte (`karte.js`, `karte.css`, Biom-Wahl, Taste M, `test-karte-ui.js`)
  - Sonnet: Fahrt-Renderer (`fahrt.js`, `fahrt-bogen.js`)
  - Haiku: Weg-Richtung und Zielpunkt der 75 Kulissen (`fahrt.json`)
- Offen: Die Fahrt hat bei großen Verschiebungen dunkle Ränder, wo hinter einer nahen Ebene nichts gemalt ist (nachtzug Gangende), und stehende Dinge kippen am Rand leicht. Die Klänge für Rumpeln und Nebel sind nur im Code geprüft (headless kein Ton).

### M4 Rucksack am Körper

**Plan.** Silhouetten: neues Werkzeug `tools/sprites/figuren.js` (Zone `silhouette`, 110×172, Fuß-, Körper- und Augenpunkt als JSON), Fischer selbst als Muster, die übrigen acht von Sonnet-Agenten (je drei Figuren, parallel), jede Figur von mir benotet. Ansicht selbst statt durch einen weiteren Agenten, weil sie eng an `S.areas`/`S.slots`, `move()` und das Deck hängt: neu `js/ui/rucksack.js` und `css/rucksack.css`, `jobs.json → koerper` (Anschlusspunkte je Figur), Deck-Diff gegen den Stand beim Öffnen. Alter Rucksackmodus (`ueberlagerungen.js`) und alte Itemleiste (`gearHtml`) raus, Test `tools/test-rucksack.js`.

**Schritte und Entscheidungen.**
- **Öffnen:** Taste R und Knopf „AM KÖRPER (R)“ in der Leiste an Rast, Werkstatt und Krämer; nach einem Fund öffnet sich die Ansicht von selbst (Bus-Ereignis `item`). Im Kampf öffnet R die Ansicht nur lesend (keine Ziele, kein Tausch). Esc und „WEITER ›“ schließen.
- **Kein Übernehmen/Verwerfen mehr:** Jeder Tausch gilt sofort, wie überall sonst im Spiel. Der Deck-Diff rechts vergleicht mit dem Stand beim Öffnen (grün dazu, rot weg), so sieht man trotzdem, was die ganze Umstellung bewirkt.
- **Fächer:** Waffe als Säule links an der Hand, Kleidung als Block rechts am Leib, Talismane als Reihe oben am Hals; gestrichelte Linien vom Fach zum Anschlusspunkt der Figur. Gesperrte Plätze tragen ein Pixel-Schloss, Kerben sitzen als Stoff-Striche am Platz.
- **Werkbank und Krämer:** In der Werkstatt hat der Fuß der Ansicht die zwei Werkbank-Plätze, beim Krämer gibt es „Verkaufen“ in der Ansicht und eine Itemreihe im Krämer-Fenster.
- **Leiste außerhalb des Kampfs:** statt der alten Itemleiste der „Tisch“ mit den angelegten Items, dem Knopf und „n im Rucksack“.
- **Bots:** bauen weiter über `move()` um; `tools/m3-fotos.js` nutzt jetzt `move` statt `rsKlick`.
- **Nebel:** der Hintergrund ist gedithert und bewegt sich in 125-ms-Schritten (im FAST-Modus aus).

#### Abnahme M4
- Abnahmekriterien:
  - Alle 9 Silhouetten Note ≥ 4: ✓ ([Kontaktbogen](bilder/M4/silhouetten-kontaktbogen.png), oben auf Nebel, unten auf Schwarz, links die Vorlage `fischer-figur-silhouette.png`; Noten unten)
  - Fotos jede Figur im Rucksack: ✓ [Fischer](bilder/M4/rucksack-fischer-1440x900.png), [Friedhofswärter](bilder/M4/rucksack-friedhofswaerter-1440x900.png), [Pfarrerin](bilder/M4/rucksack-pfarrerin-1440x900.png), [Detektiv](bilder/M4/rucksack-detektiv-1440x900.png), [Okkultist](bilder/M4/rucksack-okkultist-1440x900.png), [Kneipenschläger](bilder/M4/rucksack-kneipenschlaeger-1440x900.png), [Geologe](bilder/M4/rucksack-geologe-1440x900.png), [Wahrsagerin](bilder/M4/rucksack-wahrsagerin-1440x900.png), [Veteran](bilder/M4/rucksack-veteran-1440x900.png)
  - Tausch mit Grün/Rot: ✓ [gewählt](bilder/M4/rucksack-gewaehlt-1440x900.png), [nach dem Tausch](bilder/M4/rucksack-tausch-1440x900.png); gesperrte Plätze und Kerben in jedem Figurenfoto
  - Drei Auflösungen: ✓ [1280×720](bilder/M4/rucksack-fischer-1280x720.png), [1440×900](bilder/M4/rucksack-fischer-1440x900.png), [1920×1080](bilder/M4/rucksack-fischer-1920x1080.png); `test-rucksack.js` prüft alle 9 Figuren in allen drei Auflösungen (Fächer überlappen nicht, nichts im Fuß, kein „?“)
  - Weitere Fotos: [Krämer](bilder/M4/rucksack-kraemer-1440x900.png), [Werkbank](bilder/M4/rucksack-werkbank-1440x900.png), [nach einem Fund](bilder/M4/rucksack-fund-1440x900.png), [im Kampf, nur lesend](bilder/M4/rucksack-kampf-lesend-1440x900.png)
  - Bots können weiter umbauen: ✓ `balance.js 50` 48 %, 0 Fehler ([balance-50.txt](bilder/M4/balance-50.txt))
  - `test-deckbau.js` grün: ✓
  - Ziehen mit der Maus: ✓ (zusätzlich zum Klicken)
- Tests ([tests-nachher.txt](bilder/M4/tests-nachher.txt)): test-run → `Alles gut.`; test-deckbau → `Alles gut.`; test-ereignisse → `Alles gut.`; test-vorschau → `Gespielte Karten mit Vorschau: 400, Abweichungen: 0`; test-welle1 → `Alles gut.`; test-stoffbaum → `Alles gut (33 Prüfungen).`; test-karte → `Alles gut.`; test-speicher → `Alles gut.`; test-meta → `Fragmente gespeichert: 40, nach Reset: 0`; test-plakette → `Alles gut.`; test-oberflaeche → `Alles gut.`; test-karte-ui → `Alles gut.`; test-rucksack → `Alles gut.`; sprites/pruefen → `253 Sprites geprüft, 0 Verstöße.`; icons/pruefen → `242 Bilder geprüft, 0 Verstöße.`
- texte-pruefen: `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 237, alle als Entwurf markiert.`
- Bots: generisch 50 Seeds 48 % (Basis 48 %), Ø 3,9 Züge je Kampf, 0 Fehler.
- Bilder: oben, selbst angesehen: ja (alle neun Figuren bei 1440×900 neben `rucksack-b-am-koerper.png`, Fischer in allen drei Auflösungen, Kontaktbogen)
- Regelprüfung: keine neue Mechanik (reine Oberfläche).
- Abweichungen von Vorlage oder Konzept: kein Übernehmen/Verwerfen, Tausch gilt sofort (Grund oben); die Ansicht öffnet nur nach einem Fund von selbst, an Rast, Werkstatt und Krämer über den Knopf, damit man dort nicht jedes Mal durch sie hindurch muss.
- Agenten:
  - Sonnet ×3: Silhouetten (Friedhofswärter, Pfarrerin, Detektiv / Okkultist, Kneipenschläger, Geologe / Wahrsagerin, Veteran); Fischer selbst als Muster
  - Ansicht, Fächer-Logik, Anschlusspunkte, Einbau und Test selbst (Abweichung vom Plan: kein eigener Agent für die Ansicht, Grund oben)
- Offen: Detektiv ohne sichtbare Zigarettenglut, Wahrsagerin ohne Ohrringe, Veteran (Note 4, schwächste) mit kastigem Mantel. Die Silhouetten stehen noch nirgends außer im Rucksack und in der Galerie.

### M5 Die Tiefe biegt die Regeln

**Plan.** Kern selbst: `js/core/biegung.js` (ein Objekt `Bieg` mit den Einhakpunkten `extraReaktionen`, `quelleReaktion`, `zugEnde`, `ziehen`, `ablegen`/`abwerfen`, `absichtenSichtbar` und der Zugbuchhaltung), `data/biegungen.json` (14 Biegungen, `entwurf: true`), Aufrufe in `rules.js` (`reactionsFor` nimmt die Zusatzpaare, sonst keine Kopie der Regeln) und `combat.js` (Zugbeginn, Karte gespielt, Zugende, Ablage, Mischen). Schalter `auftrag3.regelbiegung`, für Vergleichsläufe `auftrag3.biegung_nur`. Anzeige selbst: Kopfleiste, Stoff-Baum (Über-Eck-Bogen, Quelle bei Falsche Winkel und Der Schlag, Funkspruch blinkt), Stapel (Spiegelbild, Keiner fährt ab, Wellen von oben), Plakette (zweite Absicht), Peilkarte und Biom-Wahl (Platz aus M3), Dev-Reiter TIEFE. Erste Probe Über Eck ganz fertig (Logik, Baum, Bot, Test, Foto, `kern-vergleich.js`), danach die übrigen 13. Agenten: Sonnet zeichnet die 14 Zeichen (Note vergebe ich), Sonnet schreibt die Tests der übrigen 13 Biegungen nach meiner Logik. Die Bot-Strategien schreibe ich selbst, weil sie an denselben Einhakpunkten hängen (Über Eck, Aufgewogen, Spiegelbild; die übrigen sieht der Bot über die Vorschau, die dieselbe Regel rechnet). Vergleichsläufe lasse ich selbst im Hintergrund laufen (ein Befehl).

**Schritte und Entscheidungen.**
- **Ein Modul, keine Kopie der Regeln:** `reactionsFor` (rules.js) nimmt die Zusatzpaare der Biegung (`rxPaare`), alles andere biegt nur, welche Stoffe als „Karte davor“ gelten (`S.last`), wohin Karten gehen und was am Zugbeginn und Zugende geschieht. Kampf, Vorschau (`previewCard` spielt die Karte auf einer Kopie), Stoff-Baum und Bots lesen dieselbe Stelle. Mit Schalter aus ist das Spiel gleich: sechs Seeds spielen sich mit Schalter aus genau wie ganz ohne Biegungsdaten (`test-biegungen.js`), 100 Seeds ergeben die Basis 48 %, Ø Tiefe 26,1.
- **Über Eck:** wertet beim Drücken von „Zug beenden“ nur die Paare zwischen erster und letzter Karte aus (was die letzte Karte in sich trägt, hat schon reagiert). Verstärkt und Opfer haben keine eigene Wirkung, sie wirken auf eine Karte. Hier lässt Verstärkt die letzte Karte um 50 % nachwirken, Opfer lässt sie für das Leben noch einmal wirken. Hochreaktionen zählen mit, wenn sie in diesem Zug noch frei sind.
- **Alte Stoffe:** Sole (SW: 6 Block, 1 Karte), Pökeln (BS: 6 Schaden, 3 Heilung), Gezeitenblut (BW: alle Gegner verwundbar 1). Dafür gibt es den neuen Effekt `draw` in `runFx`. Die drei Namen landen im Buch, Funkspruch nicht (er ist kein Stoffpaar).
- **Ebbe und Flut:** Die geraden Züge sind Flut. Unspielbare Karten werden auch in der Flut abgeworfen, damit Störkarten nicht dauerhaft die Hand blockieren.
- **Keiner fährt ab:** Verbrauchte Karten kehren nicht zurück. Der Stapel zeigt „Oben: …“, solange die zurückgekehrte Karte oben liegt.
- **Falsche Winkel:** Die Fassung „nur die vorletzte“ hat den Vergleich bestanden (+2 Pp), die Ausweichfassung „letzte und vorletzte“ liegt als Schalter `auftrag3.falsche_winkel_beide` im Dev-Reiter.
- **Außerhalb der Zeit:** Die Folge ist je Kampf neu, aus dem Strom `biegung` per Seed, und nie zweimal hintereinander dieselbe. Die Kopfleiste zeigt die Biegung dieses Zuges und klein die des nächsten. Die Pforte behält zusätzlich ihr altes falsches Detail im Finale (Kosten ±1).
- **Bots:** Der Bot rechnet Über Eck mit (Karte, die mit der ersten den Kreis schließt), tauscht beim Spiegelbild eine klar bessere offene Karte und bewertet bei Aufgewogen die übrige Energie als Block. Die anderen Biegungen sieht er über die Vorschau. Der erste Entwurf für Aufgewogen hat jede Karte mit 3 Block je Energie bestraft. Dadurch hat der Bot in einem Kampf gar nicht mehr angegriffen und mit 900 Leben verloren (`test-run.js` rot). Jetzt zählt nur der Block, der wirklich einen Treffer fängt.
- **Anzeige:** Zeichen und Name rechts neben dem Biom, Tooltip mit dem Regeltext (Pforte und Gezeiten mit Zusatz), Peilkarte und Biom-Wahl über den Platz aus M3. Im Stoff-Baum zeigt Über Eck einen Bogen über der Kette (gestrichelt ab zwei Karten, durchgezogen mit Namen, sobald der Kreis eine Reaktion ergibt, leuchtet beim Zugende). Bei Falsche Winkel und Der Schlag leuchten die Glieder, von denen die Äste ausgehen. Funkspruch blinkt kurz-kurz-lang. Die Rückseite hat eine zweite, kleinere Zeile „danach …“ auf der Plakette. Das Spiegelbild zeigt „Oben: …“ am Stapel zum Anklicken.
- **Test angepasst:** `test-karte-ui.js` hat die Biegung über `window.BIEGUNGEN` vorgetäuscht. Seit M5 kommt sie aus dem Modul, darum schiebt der Test jetzt einen Probe-Eintrag in `BIEGUNGEN`.

#### Abnahme M5
- Abnahmekriterien:
  - `test-biegungen.js` grün: ✓ 92 Prüfungen, `Alles gut.` (Daten, Schalter aus = ohne Biegung, je Biegung ein fester Zug mit Gegenprobe, Vorschau = Kampf für fünf Biegungen)
  - Schalter aus = Basis: ✓ `balance.js 100` mit Schalter aus 48 %, Ø Tiefe 26,1, wie die Basis ([balance-100-aus.txt](bilder/M5/balance-100-aus.txt))
  - Regelprüfung aller 14: ✓ bestanden (Tabelle in „Regelprüfung“), umgebaut wurde keine
  - `kern-vergleich.js` (60 Seeds, gleicher Weg, nur diese Biegung an gegen alle aus): ✓ keine Biegung mehr als 10 Pp darunter, die schwächsten liegen bei −5 Pp (Ebbe und Flut, Keiner fährt ab, Wellen von oben), Aufgewogen +12 Pp ([kern-vergleich-60.txt](bilder/M5/kern-vergleich-60.txt), Nachlauf mit Zählern [kern-vergleich-60-nachlauf.txt](bilder/M5/kern-vergleich-60-nachlauf.txt)). Jede Biegung wird ausgelöst (z. B. Über Eck 156-mal, Keiner fährt ab 1081, Funkspruch 142, Pökeln 59 in je 60 Runs).
  - Alle an, generisch 100 Seeds: 42 % gegen 48 % (−6 Pp, [balance-100-an.txt](bilder/M5/balance-100-an.txt))
  - Fotos: ✓ jede Biegung im Kampf mit Baum und Tooltip (`bilder/M5/kampf-<id>-1440x900.png`), auf der Peilkarte (`karte-<id>-1440x900.png`), Biom-Wahl Akt III bis V (`biomwahl-akt3…5`), Über Eck in [1280×720](bilder/M5/kampf-ueber_eck-1280x720.png) und [1920×1080](bilder/M5/kampf-ueber_eck-1920x1080.png), Zeichen-Bogen [zeichen-bogen.png](bilder/M5/zeichen-bogen.png)
- Tests ([tests-nachher.txt](bilder/M5/tests-nachher.txt)): alle grün, test-run und test-karte-ui nach den zwei Korrekturen oben erneut gelaufen (`Alles gut.`)
- texte-pruefen: `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 273, alle als Entwurf markiert.`
- Bilder: selbst angesehen: ja (alle 14 Kampffotos als Bogen, Peilkarte Über Eck, Biom-Wahl Akt IV, Plakette im Mond vergrößert, Zeichen-Bogen)
- Abweichungen: Funkspruch-Zeichen mit Strichen statt Bögen (auf 9×9 zerfielen die Bögen); Über Eck wirkt mit Verstärkt auf die letzte Karte nach (die Regel sagt nicht, worauf Verstärkt wirkt, wenn keine Karte gespielt wird).
- Agenten:
  - Sonnet: 14 Zeichen (`js/ui/zeichen-biegung.js`, `tools/biegung-zeichen-bogen.js`), Note je ≥ 4 nach eigener Nacharbeit (siehe Noten)
  - Sonnet: Tests der 13 übrigen Biegungen in `tools/test-biegungen.js` (fand keinen Logikfehler; ich habe Ebbe und Flut, Wellen von oben und Aufgewogen im Lauf nachgelesen)
  - Logik, Anzeige, Bots, Über-Eck-Test und Vergleichsläufe selbst
- Offen: Die Bots spielen Ebbe und Flut, Ringofen und Rückwärts gewachsen nur über die Vorschau, ohne zu planen, welche Karte zuletzt kommt. Die Peilkarte zeigt Ereignisse weiter mit Mos altem Zeichen (Fragezeichen-Form aus M3), das gehört nicht zu M5.

### M6 Hören statt sehen

**Plan.** Kern selbst: `js/core/hoeren.js` mit `Hoeren.istStumm(e)`, `hoerbareAbsicht(e)` (die eine Schnittstelle für Musik, Einstellung und Bots), `incomingGehoert()` für die Bots; `stumm: true` an sechs Gegnern; `absichtSichtbar` blendet stumme aus (damit fallen Plakette, Vorschau im Balken und Tooltip-Hinweise weg); höchstens ein stummer je Kampf, auch beim Rufen. Brücke `Bus → Music.hoeren(liste)` in `feedback.js`. Sonnet: die drei Einsätze in `music.js`, Abschnitt im Musik-Labor, Messung je Biom. Sonnet: Einstellung „Klänge als Zeichen“. Die Auswahl der stummen Gegner habe ich selbst mit einem Skript über die Muster gemacht statt mit Haiku (eine Abfrage, zwölf Zeilen Ausgabe).

**Schritte und Entscheidungen.**
- **Stumm:** Rufer (Schwarzes Eis, Stärke/Angriff), Echo (Walkathedrale, Laden/Angriff), Splitterchor (Glasmeer), Astronom (Mond), Rauschen (Funkstation, heilt) und im Vorraum von Akt V die Tarierte (Waage, heilt). Alle haben mindestens zwei Absicht-Arten, keiner hat schon „verborgen“. Der Rufer wird auch in frühen Akten gerufen. Darum gilt stumm nur, wenn das Biom in Akt IV oder V liegt, und nur für normale Gegner.
- **Arten:** Angriff (Stufe nach Gesamtschaden: bis 6, bis 14, darüber → 1, 2, 4 Schläge je Takt), Schutz (Block, und bei Heilern jeder Nicht-Angriff), Zauber (Stärke, Laden, Ruf).
- **Bots:** Sie hören wie ein Spieler. Sichtbare Absichten zählen genau, stumme werden je Stufe geschätzt (5, 11, 18). Mit Schalter aus spielt sich alles wie vorher (`test-kern.js`, 4 Seeds gleich; `balance.js 50` mit Biegung und Hören aus = Basis 48 %).
- **Musik (Sonnet, von mir nachgepegelt):** Angriff als gezupfter Kontrabass auf dem Akkordbass, Schutz als Glocke auf der Eins, Zauber als Formant-„oh“ auf der Terz, schwillt über den Takt. Die Einsätze setzen auf der nächsten Taktgrenze ein. Layer 2, 3 und die Stimmen gehen dabei um 25 % zurück. Die erste Messung hatte die Glocke nur 0,2 dB über dem Rest (Glasmeer, Walkathedrale) und den Zauber in der Waage bei 0,1 dB. Darum habe ich die Glocke von 0,2 auf 0,32 und den Zauber von 1 auf 1,4 angehoben und neu gemessen.
- **Test angepasst:** `test-plakette.js` hat `stumm` in Akt I gesetzt. Seit M6 zählt stumm nur in Akt IV und V, darum erzwingt der Test es dort jetzt über `Hoeren.istStumm`.

#### Abnahme M6
- Abnahmekriterien:
  - `test-kern.js` (Teil Hören) grün: ✓ 17 Prüfungen (sechs stumme, je Akt-IV-Biom einer, einer in Akt V, nie Wächter, Plakette und Vorschau ohne Absicht, Arten und Stufen, höchstens einer je Kampf, nicht in Akt I, Schalter aus, Speicherstand, Bots mit Schalter aus wie ohne)
  - `musik-pruefen.js` grün: ✓ größte Spitze am Ausgang −0,52 dBFS, Tempo 80–88, neuer Härtetest „Hören“ (alle drei Einsätze mit Boss, Hochreaktion, Feuer, wenig Leben)
  - Jeder Einsatz in jeder Akt-IV/V-Fassung aufgenommen und gemessen ([hoeren-messung.txt](bilder/M6/hoeren-messung.txt), `tools/hoeren-aufnahme.js`): Pegel, Spitze, Spektrum (Zentroid, stärkste Frequenz), Grundtöne alle auf der Biom-Leiter (höchstens 13 Cent daneben). Ein Satz je Biom, ob man es heraushört: nach dem Nachpegeln liegt in allen acht Biomen jeder Einsatz kurzzeitig 2,5 bis 5,6 dB über dem Rest. Der Angriff ist am Anschlag zu hören, nicht im Tiefbass. Am knappsten ist der Zauber in der Waage (+3,2 dB). Selbst gehört habe ich nichts (headless kein Ton), das Urteil steht allein auf den Messwerten.
  - Foto der stummen Plakette ohne und mit „Klänge als Zeichen“: ✓ [plakette-stumm.png](bilder/M6/plakette-stumm.png), [plakette-klangzeichen.png](bilder/M6/plakette-klangzeichen.png) (selbst angesehen: nur Name und Leben, mit Einstellung ein rötlicher Notenkreis links)
  - Bot-Vergleich: ✓ `balance.js 100` Hören an 42 %, aus 42 % ([an](bilder/M6/balance-100-hoeren-an.txt), [aus](bilder/M6/balance-100-hoeren-aus.txt)). In 30 Runs gab es 15 Kämpfe mit einem stummen Gegner. Die Schätzung wich in 79 von 5100 Bot-Entscheidungen ab, ohne dass sich ein Ergebnis änderte. Hören kostet den Bot also fast nichts.
- Tests ([tests-nachher.txt](bilder/M6/tests-nachher.txt)): alle grün, dazu `test-klangzeichen.js` (Browser, 11 Prüfungen)
- texte-pruefen: `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 273, alle als Entwurf markiert.`
- Regelprüfung: Tabelle unten, bestanden.
- Agenten:
  - Sonnet: Musik-Einsätze, Musik-Labor, `hoeren-aufnahme.js`, Härtetest in `musik-pruefen.js`. Nachgepegelt habe ich selbst.
  - Sonnet: „Klänge als Zeichen“ (`klangzeichen.js`, Einstellung, Plakette, `test-klangzeichen.js`, Fotos)
- Offen: Der Blick (M7) soll stumme Absichten sichtbar machen; der Platz dafür ist in `Hoeren.istStumm` vorbereitet (`Blick.siehtAbsicht`).

## Regelprüfung

*Je Mechanik eine Tabelle mit den sieben Prüffragen aus [01-regeln.md](01-regeln.md) Abschnitt 3: Ja/Nein und Halbsatz.*

### M1 Panzer statt Unverwundbarkeit (Fix 7)

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | Allein gestellt verlangt der Boss Gift, Brand oder Block statt Zug beenden; der Zug spielt sich anders |
| Das Deck bleibt deins | Ja | Nichts wird ins Deck gemischt oder weggenommen |
| Selten ist stark | Ja | Nur sechs Wächter, nur im unverw-Schritt ohne Diener |
| Kein Fragezeichen | Nein | Panzer steht als Zahl an der Plakette, die Schutzlinie zeigt, woran es hängt |
| Einwilligung vor Kontrollverlust | Ja | Keine Kontrolle wird genommen, vorher konnte man nur Zug beenden |
| Unheimlich, nicht anstrengend | Ja | Eine Zahl, die im Bosszug fällt; keine Buchhaltung |
| Nie Herkunft als Bedrohung | Nein | Rein mechanisch |

Lovecraft-Prinzip: das Unbegreifliche hängt an etwas Sichtbarem (Diener tragen den Schutz), Fix des Konzepts, nicht neue Wucht.

### M3 Folgen auf der Karte (Abkürzung, Brüchiger Gang, Dunkler Stollen)

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | Die Wegwahl wird zur Abwägung über mehrere Ebenen (Abkürzung gegen schweren Kampf, Werkstatt gegen späteren Gang) |
| Das Deck bleibt deins | Ja | Keine Folge berührt das Deck |
| Selten ist stark | Ja | Höchstens zwei Folgen je Akt; der Brüchige Gang in rund jedem zehnten Netz |
| Kein Fragezeichen | Ja | Der Dunkle Stollen ist eine leere Raute ohne „?“; der Riss im Gang ist sichtbar, aber ohne Warnzeichen |
| Einwilligung vor Kontrollverlust | Ja | Der Einsturz nimmt nur einen von mehreren Wegen, jeder Knoten behält einen Ausgang |
| Unheimlich, nicht anstrengend | Ja | Man hört ein Rumpeln im Nebel und sieht später den verschütteten Gang; nichts zu zählen |
| Nie Herkunft als Bedrohung | Nein | Rein räumlich |

### M5 Regelbiegungen (14)

Gemeinsam für alle 14: **Das Deck bleibt deins** Ja (keine Biegung mischt eine Karte ein oder nimmt eine weg; Spiegelbild und Keiner fährt ab ordnen nur den Stapel), **Nie Herkunft als Bedrohung** Nein (rein mechanisch), **Kein Fragezeichen** Nein (Zeichen und Name in der Kopfleiste, Regeltext im Tooltip, auf Peilkarte und Biom-Wahl vor dem Akt). Je Biegung die übrigen vier Fragen:

| Biegung | Verändern statt schwächen | Selten ist stark | Einwilligung vor Kontrollverlust | Unheimlich, nicht anstrengend |
|---|---|---|---|---|
| Alte Stoffe erinnern sich | Ja, drei neue Paare, nichts fällt weg | Ja, nur ein Biom, nur Salz/Wasser/Blut | Ja, keine Kontrolle genommen | Ja, die Äste im Baum zeigen die neuen Paare von selbst |
| Über Eck | Ja, die Reihenfolge des Zuges zählt doppelt | Ja, ab drei Karten und nur, wenn erste und letzte passen | Ja, wirkt nur zusätzlich | Ja, ein Bogen im Baum mit dem Namen der Reaktion |
| Rückwärts gewachsen | Ja, die letzte Karte wird planbar | Ja, eine Karte je Zug | Ja, man wählt selbst, welche Karte zuletzt kommt | Ja, die Karte ist einfach wieder da |
| Ebbe und Flut | Ja, jeder zweite Zug erlaubt Aufsparen | Ja, jeder zweite Zug | Ja, die Hand bleibt, nichts wird genommen | Ja, „Ebbe“/„Flut“ steht in der Kopfleiste |
| Der Ringofen | Ja, Züge hängen aneinander | Ja, nur die erste Karte eines Zuges | Ja | Ja, der Baum beginnt mit dem Glied des Vorzugs |
| Keiner fährt ab | Ja, gute Karten kommen wieder | Ja, höchstens zwei je Zug | Ja (der Stapel zeigt die zurückgekommene Karte) | Ja |
| Falsche Winkel | Ja, man plant zwei Karten voraus | Ja, ein Biom | Ja | Ja, der Baum hebt das vorletzte Glied als Quelle hervor |
| Der Schlag | Ja, die dritte Karte wird zum Knoten | Ja, einmal je Zug | Ja | Ja, beide Glieder leuchten als Quelle |
| Das Spiegelbild ist voraus | Ja, mehr Wissen und eine Wahl | Ja, einmal je Zug | Ja, freiwillig | Ja, eine Karte offen, ein Klick |
| Die Rückseite | Ja, mehr Wissen statt weniger | Ja, ein Biom | Ja | Ja, eine zweite, kleinere Zeile |
| Funkspruch | Ja, Kosten werden zu einem Stoff | Ja, einmal je Zug | Ja | Ja, das Glied blinkt kurz-kurz-lang |
| Außerhalb der Zeit | Ja, jede Runde eine andere Regel | Ja, nur die Pforte | Ja, die nächste Regel ist vorher zu sehen | Grenzfall: zwei Namen in der Kopfleiste; dafür vorher sichtbar, damit man nicht rät |
| Die Wellen kommen von oben | Ja, das Deck wird planbar | Ja, ein Biom | Ja | Ja, der Stapel zeigt nur noch seine Länge |
| Aufgewogen | Ja, Energie sparen wird eine Wahl | Ja, ein Biom | Ja | Ja, Block kommt mit Grund im Log |

Lovecraft-Prinzip je Biegung: 1 (das Grauen ändert Regeln, nicht Werte) bei allen; dazu Wissen ist irreversibel (Die Rückseite, Spiegelbild), Substanz verfällt oder wird ersetzt (Wellen von oben, Rückwärts gewachsen), das Ding ist gleichgültig (Außerhalb der Zeit).

### M6 Hören statt sehen

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | Die Absicht ist nicht weg, sie kommt über ein anderes Sinnesorgan; man spielt auf den Takt hin |
| Das Deck bleibt deins | Ja | Nichts am Deck |
| Selten ist stark | Ja | Sechs Gegnertypen, nur Akt IV und V, höchstens einer je Kampf |
| Kein Fragezeichen | Ja | Die Plakette zeigt nur Leben, kein leerer Kasten, kein „?“, kein Tooltip |
| Einwilligung vor Kontrollverlust | Ja | Keine Kontrolle genommen; „Klänge als Zeichen“ für alle, die nicht hören können |
| Unheimlich, nicht anstrengend | Ja | Drei Klangfarben, einmal je Takt; der Bot zeigt, dass grobes Hören reicht |
| Nie Herkunft als Bedrohung | Nein | Rein mechanisch |

Lovecraft-Prinzip: Andeuten statt zeigen (Erich Zann).

## Noten

*Je neues Bild: Name, Note, Bildpfad, Kurzbegründung.*

| Bild | Note | Pfad | Begründung |
|---|---|---|---|
| Fischer | 4 | `prototype/assets/figuren/fischer.png` | Südwester, Ölzeug, Netz über der Schulter, klar lesbar |
| Friedhofswärter | 4 | `…/friedhofswaerter.png` | nach Rückgabe: Spaten und Laterne deutlich, Haltung gebeugt |
| Pfarrerin | 4 | `…/pfarrerin.png` | nach Rückgabe: Talar mit Saum, Buch vor der Brust |
| Detektiv | 4 | `…/detektiv.png` | nach Rückgabe: Hut und Trenchcoat gut, Zigarettenglut nicht sichtbar |
| Okkultist | 4 | `…/okkultist.png` | Kapuze, Stab, gute Kontur |
| Kneipenschläger | 4 | `…/kneipenschlaeger.png` | nach Rückgabe: breite Schultern, Fäuste lesbar |
| Geologe | 4 | `…/geologe.png` | Hammer, Grubenlampe |
| Wahrsagerin | 4 | `…/wahrsagerin.png` | Kopftuch und Rock gut, Ohrringe fehlen |
| Veteran | 4 | `…/veteran.png` | nach Rückgabe: Stahlhelm und Gewehr, Mantel noch kastig (schwächste) |
| Zeichen Alte Stoffe, Ringofen, Falsche Winkel, Der Schlag, Spiegelbild, Rückseite, Außerhalb der Zeit, Wellen von oben, Aufgewogen, Ebbe und Flut | 4 | `docs/auftrag-3/bilder/M5/zeichen-bogen.png` | klar, unterscheidbar (Sonnet) |
| Zeichen Über Eck, Rückwärts gewachsen, Keiner fährt ab, Funkspruch | 4 | ebenda | vom Agenten mit 4 gemeldet, von mir mit 3 bewertet (Quadrat ohne Kreis, Baum wie Schriftzeichen, Prellbock wie Stuhl, Funkspruch wie das Salz-Dreieck) und selbst neu gezeichnet |

## Neue Texte (Entwurf)

*Je neuer Text: Datei, ID, erste Worte. Für Philip und Mo.*

- **M6, Oberfläche:** Einstellung „Klänge als Zeichen“, Tooltip „Klang“, Musik-Labor „HÖREN STATT SEHEN“ mit Knöpfen.
- **M5, `data/biegungen.json`:** 14 Namen und Regeltexte (z. B. „Über Eck: Die erste und die letzte Karte …“), drei Reaktionen (Sole, Pökeln, Gezeitenblut) und Funkspruch. Oberfläche: „Oben: …“, „Handkarte wählen“, „danach …“, „Ebbe“/„Flut“, „Dieser Zug …/Nächster Zug …“ in Tooltips.

- **M4, Oberfläche (`js/ui/rucksack.js`, `kampf.js`, `bildschirme.js`):** „AM KÖRPER (R)“, „n im Rucksack“, „Klick ein Item, dann den Platz, an den es soll. Rechts siehst du, was das mit deinem Deck macht.“, „Trag drei passende Teile, um ein Set zu bilden.“, „· Ziehen oder anklicken zum Tauschen.“, Überschriften RUCKSACK, WERKBANK, DECK, Knöpfe „WEITER ›“, „ZURÜCK“, „Verkaufen“. `jobs.json → koerper` sind nur Zahlen.

## Entscheidungen unterwegs

- **M6, Stopp:** Philip hat am 2026-11-09 gesagt, nach Abnahme und Push von M6 nicht weiterzumachen. M7 bis M12 und die Zugabe sind nicht begonnen.
- **M4, Übernahme:** Philip hat am 2026-11-09 entschieden, dass ab M4 weitergearbeitet wird. M4 und folgende liegen auf `claude/project-thread-hifkqz` (von dieser Sitzung vorgegeben), aufgebaut auf Mos Branch `claude/project-thread-flvf7e`, als eigener Draft-PR dagegen.
- **M4, Rucksack:** Tausch gilt sofort statt Übernehmen/Verwerfen; Deck-Diff gegen den Stand beim Öffnen. Automatisch öffnen nur nach einem Fund, sonst Knopf und Taste R. Im Kampf nur lesend.

- **M0, Branch:** Die Sitzung gibt `claude/project-thread-flvf7e` vor, darum dieser Name statt `auftrag/run-3` (01-regeln.md Abschnitt 7 erlaubt das).
- **M0, Ausführung:** Mo hat den Auftrag am 2026-11-09 in einer Projekt-Sitzung gestartet („do it all in succession and in the cloud“).
- **M3, Umfang:** Mo hat während M3 entschieden, nach M3 aufzuhören („we can stop after m3“). M4 bis M12 und die Zugabe sind nicht begonnen.
- **M3, Agenten-Arbeitsbäume:** Zwei Worktrees entstanden auf altem `main` statt auf dem Branch; die Agenten haben sie selbst auf den Branch-Stand gebracht. Ihre Änderungen habe ich als Diff gelesen und übernommen.

## Rückgaben an Sub-Agenten

- **M4, Silhouetten (Sonnet):** Friedhofswärter, Pfarrerin, Detektiv, Kneipenschläger und Veteran kamen in der ersten Runde auf Note 3 (zu glatt, Werkzeuge und Kopfbedeckung nicht lesbar, Haltung steif). Rückgabe mit konkreten Punkten je Figur, zweite Runde je Note 4.

- Keine Rückgabe nötig. In M3 habe ich zwei Punkte selbst nachgezogen statt zurückzugeben, weil sie außerhalb der erlaubten Dateien lagen: den Einsturz im Nebel (Kern) und das Kästchen „Übergänge kürzer“ (`ueberlagerungen.js`).

## Probleme

## Bericht

Stand nach M3 (Stopp auf Wunsch von Mo). Fertig und abgenommen: M0 bis M3.

- **M1:** Alle sieben Fixes sind drin. Dazu gehören 75 Fragmente (54 neu, Entwurf), die Beutesätze ohne Ersatztext und dass nach dem Gegnerzug keine Absicht mehr zu sehen ist. Außerdem: ehrliche Absichten ohne Durchstreichen, die Schraffur im Balken, Verstärkt für Ziehen, Stärke und Gold, und Panzer statt Unverwundbarkeit. Den Panzer habe ich auf 15 % des Lebens gemessen, ein Panzer-Zug verlängert den Kampf damit um etwa 0,9 Züge.
- **M2:** Das HUD hat Variante 2. Der Stoff-Baum ersetzt das Stoffrad, es gibt eine Gegner-Plakette und 100 Stellplätze für Gegner. Im Kampf gibt es keine Kamera mehr und keine Fragezeichen.
- **M3:** Die Peilkarte im Nebel ist das ganze Netz des Akts, mit Abkürzung, Brüchigem Gang und Dunklem Stollen. Das Wandbild hebt den Nebel, und das Netz liegt im Speicherstand. Nach jeder Wahl folgt eine Fahrt nach vorne durch die Ebenen, mit geprüfter Weg-Richtung für alle 75 Kulissen.
- **Bots:** Die Siegrate liegt durchgehend bei 48 % wie die Basis, ohne Fehler.
- **Für Philip und Mo zum Ansehen:** die neuen Texte (Fragmente, Panzer-Tooltip, Kartenwörter „UNKARTIERT“, „Aufbruch“, „Wähle den nächsten Abschnitt …“, „Übergänge kürzer“) und die Fotos unter `bilder/M1` bis `bilder/M3`.
