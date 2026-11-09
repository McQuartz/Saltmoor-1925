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
| M7 Sehen und gesehen werden | fertig | drei Blick-Items, drei Gesehene, 44 Wächter-Schritte, Wahl zu Kampfbeginn |
| M8 Die Farbe | fertig | Stoff X #c800ff, Brunnen etwa jeder zweite Run, Wandern, Spur, Binden, Tilgen |
| M9 Begegnungen | fertig | Run-Zettel, alle vier Begegnungen, `art` für alle 143 Gegner |
| M10 Metaebene | fertig | Strand zählt mit, Ausrede in Stufen, Ankunftszeile, Notizen des Vorgängers, Erbe, Fehlzeit, Pause |
| M11 Würze | fertig | Zeitungsausschnitte, Der falsche Brief, Barmherzige Trennung, Zanns Takt; Grabbeigabe, Licht im Turm, Lügender Kartentext per Schalter aus |
| M12 Balance und Abschluss | fertig | generisch 53 %, Builds 40–62 %, kein Akt über 35 %; geklickter Run (114 Stationen), Galerie, Artboard, Daten-README, Bericht |
| Zugabe | fertig | keine Mindestens-Lücke offen; Krämer mit tausend Masken (Probe); 14 Ereignisse zu den Regelbiegungen mit Bildern; zweite Fassung aller 70 Notizen; 30 Zeitungsausschnitte |

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

### M7 Sehen und gesehen werden

**Plan.** Kern selbst: `js/core/blick.js` mit `Blick.kampfStart` (Wahl auslegen), `Blick.waehlen(ja)`, `Blick.siehtAbsicht` (Einhakpunkt aus M6 in `Hoeren.istStumm`), Gesehener dazu, Wächter-Zusatz, Schatten, Beute und Bot-Regel. Sperre von `playCard`/`endTurn`, solange die Wahl offen ist. `verborgen` wird beim Hinsehen voll angezeigt (Plakette, Vorschau, Tooltip). Oberfläche: Wahl über der Hand, Gesehene halb durchsichtig und schwebend, Schatten in der Bühne, Marke „sieht dich“ am Zusatzschritt. Agenten (alle Sonnet): Blick-Items mit Icons, Gesehener 1 und 2, Gesehener 3, `gesehen`-Schritte für alle Wächter.

**Schritte und Entscheidungen.**
- **Wahl:** Liegt nach der ersten Hand über dem Tisch, die Hand ist abgedunkelt, Zugende gesperrt. „NICHT HINSEHEN“ ist hervorgehoben (Standard). Im Finale gibt es keine Wahl, weil danach keine Beute kommt.
- **Hinsehen:** `Blick.aktiv()` macht stumme Absichten sichtbar (die Musik hört dann auf, sie anzuspielen), zeigt verborgene Werte und zählt sie in der Vorschau mit; der Tooltip-Satz „Verborgen: …“ entfällt dann.
- **Gesehene:** Akt I–III „Der Danebenhängende“, Akt IV „Der Umfaltende“, Akt V „Der Hohe am Rand“. Sie stehen in keinem Biom-Pool, nur `Blick.gesehenerDazu()` stellt sie auf (hinten, auf dem freiesten Platz, höchstens vier Gegner). Werte ohne Tiefe (`ohne_tiefe`), zuerst 26/40/54 Leben; nach dem Bot-Vergleich auf 16/22/28 (×1,35 Wächter-Faktor = 22/30/38) und schwächere Muster gesenkt. Stimme „schatten“, weil `music.js` keine eigene hat.
- **Durchsichtig:** Macht die Bühne zur Laufzeit (wanderndes Bayer-Raster, kühler Ton, Schweben ohne Bodenschatten). Darum ließ ich die festen Dither-Lücken aus den Sprites wieder entfernen.
- **Wächter:** `gesehen`-Schritt aus den Paketdaten (44 von 44, Tabelle [m7-waechter-gesehen.md](m7-waechter-gesehen.md)); er kommt direkt nach dem aktuellen Schritt ins Muster. Fallback ohne Daten: der stärkste Schritt ein zweites Mal (nicht mehr nötig, aber im Code).
- **Beute:** nach Hinsehen Handgriffe 1 aus 4 und das Item-Angebot sicher. Der Zufallswurf für das Item läuft trotzdem, damit die Seeds gleich bleiben.
- **Fundorte:** Die Items sind `rare` wie die anderen seltenen Talismane. Der Krämer und schwere Kämpfe ziehen aus dem globalen `rarePool`. Darum habe ich `blickAb(id)` eingebaut: Ein Blick-Item gibt es erst ab dem Akt, in dessen Fundpools es steht (Linse ab II, Resonator ab III, Lampe ab IV).
- **Schatten:** Ohne Hinsehen mit 50 % per Seed, höchstens einmal je Akt, nur normale und schwere Kämpfe. Umriss des Gesehenen des Akts, dunkel gedithert, eine halbe Sekunde, abseits der Gegner. Kein Text.
- **Bot:** hinsieht, wenn Leben über 60 %. `selbst-spielen.js` klickt die Wahl wie der Bot.

#### Abnahme M7
- Abnahmekriterien:
  - `test-kern.js` (Teil Blick) grün: ✓ 21 Prüfungen ([test-kern.txt](bilder/M7/test-kern.txt)): drei Items mit Fundorten, Krämer erst ab Akt, Wahl nur mit Item, gesperrt bis gewählt, nicht im Finale, Schalter aus, nicht hinsehen ändert nichts, hinsehen macht den Astronomen lesbar, Gesehener je Akt (II, III, IV, V) und im schweren Kampf, verborgen 0 → 8 in der Vorschau, Wächter ein Schritt mehr, Beute 1 aus 4 und 12/12 Item-Angebote (ohne: 1 aus 3, 6/12), Schatten einmal je Akt und nie beim Hinsehen, Speicherstand, Bot-Regel
  - Gesehene Note ≥ 4: ✓ alle drei mit 4, je nach einer Rückgabe (Tabelle Noten)
  - Fotos, selbst angesehen: ✓ [Wahl](bilder/M7/01-wahl.png), [Hinsehen, Astronom zeigt Block 7 statt nichts](bilder/M7/02-hinsehen-akt4.png) neben [nicht hinsehen](bilder/M7/03-nicht-hinsehen-akt4.png), Gesehene [Akt II](bilder/M7/04-gesehener-akt2.png), [Akt III schwer](bilder/M7/05-gesehener-akt3-schwer.png), [Akt V](bilder/M7/06-gesehener-akt5.png), [Wächter mit Zusatzschritt „sieht dich“](bilder/M7/07-waechter-zusatz.png), [Beute 1 aus 4 mit Fund](bilder/M7/08-beute-1-aus-4.png), [Schatten](bilder/M7/09-schatten.png). Erzeugt mit `tools/m7-fotos.js`, keine Konsolenfehler.
  - Bot-Vergleich: ✓ `tools/blick-vergleich.js 40` ([blick-vergleich-40.txt](bilder/M7/blick-vergleich-40.txt)). Ohne Item finden die Bots die seltenen Items kaum (5 Wahlen in 40 Runs), Siege gleich (50 %). Mit Linse ab Start: Blick aus 53 %, Blick an 43 %. Der Bot sieht in 284 von 303 Kämpfen hin und besiegt dabei 208 Gesehene. Mit den ersten Werten (26/40/54) waren es 40 % gegen 53 %. Ein Gegenversuch ohne Wächter-Zusatz brachte 18 statt 17 Siege, der Unterschied liegt also bei den Gesehenen. Bei 40 Runs ist das Rauschen etwa ±8 Pp. Immer hinsehen kostet den gierigen Bot damit rund 10 Pp. Hinsehen ist eine echte Abwägung und nicht umsonst, wie gewollt. Feinabstimmung kommt in M12.
- Tests: `test-kern`, `test-run`, `test-deckbau`, `test-speicher`, `test-biegungen`, `test-oberflaeche`, `test-plakette`, `test-karte-ui`, `test-rucksack` alle „Alles gut.“; `sprites/pruefen.js` 256 Sprites 0 Verstöße; `icons/pruefen.js` 245 Bilder 0 Verstöße
- texte-pruefen: `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 288, alle als Entwurf markiert.`
- Regelprüfung: Tabelle unten, bestanden.
- Agenten (alle Sonnet, Worktree): Blick-Items und Icons; Gesehener 1 und 2 (Grund zurückgegeben); Gesehener 3 (zurückgegeben); `gesehen`-Schritte für 44 Wächter. Alle drei Bild-Agenten starteten auf altem `main` und haben sich laut Auftrag selbst auf den Branch gesetzt.
- Mindestens erfüllt? Mehr: eigene `gesehen`-Schritte für alle Wächter statt des Fallbacks.

### M8 Die Farbe

**Plan.** Kern selbst: `js/core/farbe.js` (planen, Brunnen-Ereignis, annehmen, Stoffe der Karte davor, Binden mit Salz, Wandern nach jedem Sieg, Spur, Tilgen), `def(it)` liest `it.st`, Werkstatt-Aktion „Spur tilgen“, Bot-Strategie. Haiku: Farbton-Prüfung (`tools/farbe-ton.js`). Sonnet: Schimmern, Zeichen X, Kartenrand, Baum-Rahmen, Spur-Linie, Brunnenbild.

**Schritte und Entscheidungen.**
- **Ton:** #c800ff, Mindestabstand 19,1 dE00 zu allen Zonen- und Biompaletten ([m8-farbton.md](m8-farbton.md), dort auch, warum die Vorlagen im Effekt-Baukasten nicht zählen). Fünf Schimmer-Stufen in `stoffe.json → X`. X steht auf keinem Item.
- **Ankunft:** `Farbe.planen` würfelt zu Run-Beginn (85 %), ob der Brunnen in Akt II oder III kommt; er ersetzt dann das nächste Ereignis. Mit nur Akt II kam er bei den Bots in 20–28 % der Runs an, darum darf er nach Akt III weiterrutschen: jetzt 19 von 40 (etwa jeder zweite Run, wie verlangt).
- **Karte nimmt an:** `Farbe.hand()` setzt `c.st` jeder Handkarte des Farbe-Items auf die Stoffe der Karte davor (die erste Karte im Zug behält ihre). So sehen Hand, Baum, Vorschau und Bot dasselbe, ohne zweite Regel.
- **Binden:** direkt nach einer Karte des Farbe-Items eine Karte mit eigenem Salz. Ein angenommenes Salz zählt nicht.
- **Wandern und Spur:** nach jedem Sieg auf ein anderes angelegtes Item, nie zurück auf das letzte. Das verlassene Item tauscht einen Stoff (nie X, nie doppelt), `it.spuren` merkt es fürs Tilgen.
- **Bot:** +8 für eine Salzkarte direkt nach einer Farbe-Karte, +4 für eine Farbe-Karte, wenn danach noch Salz bezahlbar ist.

#### Abnahme M8
- Abnahmekriterien:
  - `test-kern.js` (Teil Farbe) grün: ✓ 18 Prüfungen (Ton, Plan, Brunnen nur einmal, Schalter, Annehmen, Stoffe der Karte davor mit Reaktion, Wandern 30-mal nie zurück, Spur, nie X, nur ein Item, Binden, Tilgen, Speicherstand, Bots: Brunnen 19 von 40, 10-mal gebunden)
  - `test-speicher.js` mit Farbe grün: ✓ (Speicherstand trägt Farbe, Bindung, Spuren; Teil von test-kern und test-speicher)
  - Fotos, selbst angesehen: ✓ [Farbe auf Item](bilder/M8/01-farbe-auf-item-rucksack.png) ([Zoom](bilder/M8/01b-farbe-auf-item-zoom.png)), [Karte nimmt Stoff an](bilder/M8/04b-karte-nimmt-stoff-an-kampf.png) mit [Baum](bilder/M8/04d-baum-zoom.png) und [Hand](bilder/M8/04c-hand-zoom.png), [Spur im Rucksack](bilder/M8/02-spur-rucksack.png) ([Zoom](bilder/M8/02b-spur-zoom.png)), Tilgen ([Knopf](bilder/M8/06-werkstatt-spur-tilgen-knopf.png), [Wahl](bilder/M8/07-spur-tilgen-wahl.png), [danach](bilder/M8/08-nach-dem-tilgen.png)), [gebunden](bilder/M8/03-gebunden-rucksack.png), [Brunnen](bilder/M8/05-ereignis-brunnen.png). Erzeugt mit `tools/farbe-fotos.js` und `tools/m8-tilgen-foto.js`, keine Konsolenfehler.
  - Bot-Vergleich aller Kern-Systeme: ✓ `tools/kern-alle.js 100` ([kern-alle-100.txt](bilder/M8/kern-alle-100.txt)): alle aus 51 %, nur Regelbiegung 53 %, nur Hören 51 %, nur Blick 51 %, nur Farbe 57 %, alle an 49 %. Kein System liegt mehr als 5 Pp unter „aus“; alle vier zusammen −2 Pp. Die Farbe hilft dem Bot etwas (+6 Pp), weil Wandern Reaktionen öffnet und der Bot gezielt bindet. Feinabstimmung in M12.
- Tests: siehe M9 (gleicher Stand), alle grün.
- Regelprüfung: Tabelle unten, bestanden.
- Agenten: Haiku (Farbton-Skript), Sonnet (Farbe im Bild, Brunnenbild; eine Rückgabe).
- Mindestens erfüllt? Ja, alles oben.

### M9 Begegnungen

**Plan.** Kern selbst: `js/core/begegnungen.js` mit Run-Zettel, Diener, Spuren, Asche, Tiefe und der fremden Fassung (`fremdeFassung`, `it.fremd` in `kartenVon`). Einbau in Peilkarte (Spuren), Wächter (Diener), Kampf (Verbündeter, Begegnung), Krämer, Stoff-Baum, Bot. Haiku: `art` für alle Gegner, Asche-Kandidaten, Tiefe-Wahlen vorschlagen; Sonnet prüft gegen die Steckbriefe; ich gebe frei. Sonnet: Bild der Karte „Das Zeichen“.

**Schritte und Entscheidungen.**
- **Run-Zettel:** `Zettel.wuerfeln` beim Start: zwei der vier Begegnungen (Seed `zettel`), dazu später die Würze. Im Dev-Reiter „Tiefe“ sichtbar und änderbar (höchstens zwei), im Spiel unsichtbar.
- **Diener:** gezählt je Karte (`uid:s<ci>` oder `uid:h<k>`). Ab 8 Einsätzen kommt beim nächsten Wächter die meistgespielte Karte als Schritt direkt nach dem aktuellen in sein Muster, mit deinen Stoffen. Die Plakette zeigt das Kartenbild und den Schaden. Sieg: −1 Kosten (Schliff), bei 0 Kosten oder schon geschliffen die fremde Fassung.
- **Spuren:** ein Kampfknoten je Akt I–IV (bevorzugt ein normaler Kampf zwischen zweiter und vorletzter Ebene; fehlt einer, ein schwerer Kampf oder ein Kampf auf einer anderen Ebene außer der Wächter-Ebene). Jeder andere Knoten lässt die Spuren eine Stufe wachsen. Im Bild Abdrücke, die auf den Knoten zulaufen: mehr, größer, tiefer. Der Gegner ist eine Elite des Bioms, sonst der zäheste normale Gegner; Leben, Angriff und Größe je Stufe aus `balance.json → spuren`. Stufe 1–2 normaler Kampf, 3 schwerer, 4 schwerer mit Reliquie.
- **Asche:** 15 Gegner tragen `asche: true` (je Biom der Akte II–IV einer). Das Gezeitenwerk hat keinen: seine normalen Gegner waren nie Menschen (Ölerin laut Steckbrief „Es gab sie, bevor jemand sie so genannt hätte“). Salz → Feuer (eigene Stoffe) ruft die jüngste Asche. Der Verbündete steht links, gespiegelt und aschgrau, mit eigener Plakette („AUS DER ASCHE · FÜR DICH“). Er greift nach deinem Zug dein Ziel mit den Angriffen seines Musters an. Feuer → Salz löst auf. Gerufene kommen zwei Akte später in einem normalen oder schweren Kampf wieder, mit derselben Asche-Spur an der Plakette. Der Stoff-Baum zeigt „Asche rufen“ / „Asche zerfällt“ als eigenen Ast.
- **Die Tiefe erkennt dich:** `tiefe: 1` an 11 Ereigniswahlen (Texte unverändert). Nach zwei liegt „Das Zeichen“ lose im Deck (`S.lose`), streichbar wie jede Karte. Gespielt: Seitenwechsel. Kämpfe nur gegen `tiefe`/`nachahmer` werden zur Begegnung (Weitergehen, halbes Gold, kein Item). Kämpfe mit `mensch`/`veraendert` bekommen einen Gegner mehr aus dem Menschen-Pool des Bioms. Der Krämer hat zu. Wächter und Finale bleiben Kämpfe.
- **`art`:** Haiku schlug 143 Einordnungen vor (11/76/12/44). Sonnet prüfte gegen die Steckbriefe und änderte 12, ich habe die Prüfung gelesen und freigegeben: mensch 17, veraendert 68, nachahmer 14, tiefe 44 ([pruefung.md](m9-vorschlaege/pruefung.md)). Kein Grund nennt Herkunft oder Blut.
- **Bot:** ruft Asche (Salz, dann Feuer, +10/+4), löst sie nicht absichtlich auf und spielt das Zeichen, sobald er es zieht. In der Begegnung geht er weiter.

#### Abnahme M9
- Abnahmekriterien:
  - `test-begegnungen.js` grün: ✓ 48 Prüfungen, 0 Fehler ([test-begegnungen-100.txt](bilder/M9/test-begegnungen-100.txt))
  - 100 Seeds: höchstens zwei Begegnungen je Run: ✓ jeder Zettel genau zwei. Häufigkeit auf dem Zettel (Seeds 1–100): Diener 47, Asche 35, Spuren 67, Tiefe 51; über 1000 Seeds Diener 486, Asche 481, Spuren 554, Tiefe 479 (gleich verteilt, die 100 schwanken). In den Bot-Runs (100, alle Figuren): Diener erhoben 44, Karte zurück 42; Asche liegt 68, gerufen 22, aufgelöst 7, wiedergekehrt 7; Spuren-Kämpfe 101; das Zeichen kam bei den Bots nie von selbst (zwei Tiefe-Wahlen in einem Run sind selten). Darum ein zweiter Lauf mit Zeichen ab Start (33 Runs): 33 Seitenwechsel, 23 Begegnungen, 77-mal Krämer zu, 7 Siege.
  - Fotos, selbst angesehen: ✓ [Wächter mit deiner Karte als Absicht](bilder/M9/01-waechter-deine-karte.png), [Asche-Ast im Baum](bilder/M9/02-asche-ast-im-baum.png), [gerufen, Verbündeter](bilder/M9/03-asche-gerufen-verbuendeter.png), [kehrt wieder mit Asche-Spur](bilder/M9/04-asche-kehrt-wieder.png), Spuren in vier Stufen ([1](bilder/M9/05-spuren-stufe-1.png), [2](bilder/M9/06-spuren-stufe-2.png), [3](bilder/M9/07-spuren-stufe-3.png), [4](bilder/M9/08-spuren-stufe-4.png)), Spuren-Kampf [Stufe 1](bilder/M9/10-spuren-kampf-stufe-1.png) und [Stufe 4](bilder/M9/09-spuren-kampf-stufe-4.png), [Das Zeichen](bilder/M9/11-das-zeichen-in-der-hand.png), [Begegnung statt Kampf](bilder/M9/12-begegnung-statt-kampf.png), [Krämer verweigert](bilder/M9/13-kraemer-verweigert.png), [ein Gegner mehr](bilder/M9/14-seitenwechsel-ein-gegner-mehr.png). Erzeugt mit `tools/m9-fotos.js`, keine Konsolenfehler.
  - Regelprüfung aller vier: Tabellen unten, bestanden.
- Auffällig für M12: Mit gespieltem Zeichen gewinnen die Bots nur 7 von 33 (sonst etwa die Hälfte). Der Bot spielt es sofort und hat damit in Akt I–III fast nur Kämpfe mit einem Gegner mehr. Ein Spieler wählt den Zeitpunkt selbst. Der Preis ist trotzdem zu hoch, Stellschrauben für M12: ein Gegner mehr erst ab Akt III, Begegnung mit voller Heilung.
- Tests ([tests.txt](bilder/M9/tests.txt)): `test-kern`, `test-run`, `test-deckbau`, `test-speicher`, `test-biegungen`, `test-oberflaeche`, `test-plakette`, `test-karte-ui`, `test-rucksack` „Alles gut.“, `test-stoffbaum` 33 Prüfungen; `sprites/pruefen.js` 256 Sprites, `icons/pruefen.js` 246 Bilder, je 0 Verstöße
- texte-pruefen: `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 299, alle als Entwurf markiert.`
- Agenten: Haiku (Vorschläge `art`, `asche`, `tiefe`), Sonnet (Prüfung gegen Steckbriefe), Sonnet (Bild „Das Zeichen“, Note 4 ohne Rückgabe).
- Mindestens erfüllt? Mehr: alle vier Begegnungen an, nicht nur Zettel, Diener und Spuren.

### M10 Metaebene

**Plan.** Kern selbst: Meta Version 2 mit Migration (`js/core/meta.js`), die Metaebene in `js/core/metaebene.js`, Texte in `data/meta.json`. Sonnet: Texte (Ausrede-Stufen, Ankunftszeile, Pausen-Zeilen, Erbe, Fehlzeit), Sonnet: Tagebuch-Notizen (je Wächter und Biom wahr/falsch, mit Belegen aus den Daten), Sonnet: Strand-Stufen als Bild in `hafen.js strand(o)`.

**Schritte und Entscheidungen.**
- **Meta v2:** Schlüssel bleibt `saltmoor.meta.v1`, das Feld `v` sagt die Fassung. Neue Felder: `runsJob`, `umkehrenGewaehlt`, `ankunftOffen`, `letzter` (verloren, Tiefe, Biome, Wächter), `letzterOrt`, `erbe`, `fehlzeitAngebot`/`fehlzeitNaechster`, `zuletzt`/`pauseGezeigt`, `seiten` (Tagebuch, höchstens 12), `wuerzeZuletzt` (für M11). Alter Stand: alles bleibt, wer schon umgekehrt ist, bekommt die Ankunftszeile nicht mehr.
- **Das Spiel zählt mit:** `szenenWahl` gibt dem Strand `spuren` 0–4 (ab dem 2., 5., 15., 40. Abstieg). Eine Spur, mehrere, viele mit Trittflecken, ein ausgetretener Pfad. Keine Zahl.
- **Ausrede:** Stufe 0 bleibt `jobs.json` wörtlich, 1 ab dem 3., 2 ab dem 8. Run mit der Figur, 3 ab dem 15.: „Ich gehe hinunter.“ Überall, wo die Ausrede steht (Figurwahl, Zwischentitel Akt I, Rucksack, Log).
- **Bleiben ist der Sog:** erstes Umkehren überhaupt → beim nächsten Start steht auf der Figurwahl statt „Du wachst am Strand von Saltmoor auf …“ einmal die eigene Ankunftszeile. Danach nie wieder.
- **Notizen des Vorgängers:** nach einem verlorenen Run mit 1/3 an der ersten Rast, ein bis drei Sätze über Biome und Wächter, die er gesehen hat; falsch mit Tiefe/40, höchstens 60 %. Auf einem Zettel in der Rast und als eigene Seite im Tagebuch.
- **Erbe:** der meistgespielte Handgriff des letzten Runs (aus der Zählung der Diener) mit den Stoffen seines Items. Angebot nach der Figurwahl, „NEHMEN“ legt ihn lose ins Deck (`S.loseHg`), mit abgegriffenem Rahmen, streichbar. Ablehnen geht immer.
- **Fehlzeit:** nach einem Run, der in Akt V endet, auf dem Endschirm. Angenommen: Der nächste Run lässt den Autospieler Akt I still spielen (Bus stumm, keine Meta-Wirkung), danach beginnt man in Akt II bei der Kapelle mit seinem Deck, Gold und Items, seine Handgriffe in fremder Fassung. Stirbt er: Startdeck, Kapelle und ein fremder Handgriff von ihm. Seine Tagebucheinträge sind die wahren Notizen zu dem, was er gesehen hat; der Zwischentitel sagt den Satz zur Fehlzeit.
- **Pause:** Beim Laden der Seite: mehr als 14 Tage seit der letzten Sitzung, höchstens einmal in 30 Tagen → eine Zeile zum Ort, an dem der letzte Run endete, auf dem Titel.
- **Schalter:** `auftrag3.meta` (alles), dazu `fehlzeit` und `pause` einzeln, im Dev-Reiter „Tiefe“.
- **Nachtrag M9:** Die fremde Fassung hatte noch keinen eigenen Rahmen (Abschnitt 5 verlangt ihn). Jetzt `.karte.fremd`: dunkler, Schrift kursiv und leicht geneigt.

#### Abnahme M10
- Abnahmekriterien:
  - `test-meta.js` erweitert und grün: ✓ 30 Prüfungen der Metaebene ([test-meta.txt](bilder/M10/test-meta.txt)), u. a. Notizen in 110 von 300 Runs, je Fund 1,9 Sätze, falsch 37 % bei Tiefe 8/30 gemischt; Fehlzeit über 20 Seeds immer in Akt II (19 mit seinem Deck, 1 nach seinem Tod).
  - `test-speicher.js` mit altem Meta-Stand grün: ✓ v1-Stand wird gelesen, ergänzt und zählt weiter; Erbe-Karte übersteht Speichern und Laden.
  - Fotos, selbst angesehen: Strand [0](bilder/M10/strand-0.png) [1](bilder/M10/strand-1.png) [2](bilder/M10/strand-2.png) [3](bilder/M10/strand-3.png) [4](bilder/M10/strand-4.png); Ausrede Fischer [0](bilder/M10/ausrede-fischer-0.png) [1](bilder/M10/ausrede-fischer-1.png) [2](bilder/M10/ausrede-fischer-2.png) [3](bilder/M10/ausrede-fischer-3.png), Pfarrerin [0](bilder/M10/ausrede-pfarrerin-0.png) [1](bilder/M10/ausrede-pfarrerin-1.png) [2](bilder/M10/ausrede-pfarrerin-2.png) [3](bilder/M10/ausrede-pfarrerin-3.png); [Figurwahl mit Ankunftszeile](bilder/M10/figurwahl-ankunftzeile.png); [Pausen-Zeile](bilder/M10/pause-titel.png); [Erbe-Angebot](bilder/M10/erbe-angebot.png), [Erbe in der Hand](bilder/M10/erbe-in-der-hand.png); [Notizen an der Rast](bilder/M10/notizen-rast.png), [Tagebuch](bilder/M10/tagebuch-notizen.png); [Fehlzeit-Angebot](bilder/M10/fehlzeit-angebot.png), [Start bei der Kapelle](bilder/M10/fehlzeit-start-akt2.png), [fremde Handgriffe](bilder/M10/fehlzeit-fremde-handgriffe.png), [Einträge im Tagebuch](bilder/M10/fehlzeit-tagebuch.png). Erzeugt mit `tools/m10-fotos.js` und `tools/strand-fotos.js`, keine Konsolenfehler.
  - Jeder neue Text von mir gelesen: ✓ (eine Änderung: Fehlzeit-Knopf „SEIN LASSEN“ → „ANNEHMEN“, eindeutiger).
- Tests ([tests.txt](bilder/M10/tests.txt)): `test-speicher` 246 Prüfungen, `test-kern`, `test-run`, `test-deckbau`, `test-begegnungen`, `test-biegungen`, `test-oberflaeche`, `test-karte-ui`, `test-rucksack`, `test-plakette` „Alles gut.“, `test-stoffbaum` 33 Prüfungen.
- texte-pruefen: `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 494, alle als Entwurf markiert.`
- Agenten: Sonnet Texte (eine Änderung), Sonnet Notizen (70 Paare, Belege in [notizen-belege.md](m10-texte/notizen-belege.md)), Sonnet Strand (eine Rückgabe).
- Mindestens erfüllt? Mehr: auch Fehlzeit und Pause sind an (per Schalter abschaltbar).

### M11 Würze

**Plan.** Kern selbst in `js/core/wuerze.js` (Würfeln der Stücke, Zeitung, Brief, Trennung, Zann), Daten in `data/wuerze.json`. Sonnet: Texte aller Stücke als Entwurf (`m11-texte/wuerze-texte.json`), Sonnet: Bilder (Zanns Geige, drei Trennungs-Karten, Brief-Ereignis), Sonnet: Geigenebene in `js/audio/music.js`. Die 100-Seed-Zählung steckt in `test-wuerze.js`, ein eigener Haiku-Auftrag war dafür nicht nötig.

**Schritte und Entscheidungen.**
- **Würfeln:** Zu Runbeginn mit `R('wuerze')`, jedes Stück mit seiner Chance (Zeitung 0,6, Brief 0,5, Trennung 0,5, Zann 0,5), höchstens drei, kein Stück aus dem letzten Run (`Meta.wuerzeZuletzt`). Steht auf dem Run-Zettel neben den Begegnungen. Grabbeigabe, Licht im Turm und Lügender Kartentext stehen mit `an: false` in den Daten.
- **Zeitungsausschnitte:** In jedem zweiten Akt-Übergang ein Ausschnitt (12 Stück) auf dem Zwischentitel. Ab dem 10. Run mit 30 % einmal je Run die Vermisstenanzeige der eigenen Figur.
- **Der falsche Brief:** Das erste Ereignis in Akt I ist der Brief. Eingesteckt verspricht er ein Biom zwei Akte weiter. Das Biom steht dann sicher in der Biomwahl, und auf der Peilkarte trägt ein Knoten, der kein Kampf ist, einen Umschlag. Dort bietet der Vorgänger (letzter verlorener Run) eines seiner Items an. Gab es keinen, ist der Knoten leer und der Brief wandert ins Tagebuch.
- **Barmherzige Trennung:** Drei Teile (Relief, Ausschnitt, Aussage) an Fundstellen und Wandbildern, je ein 0-Kosten-Karte. Zwei Teile direkt nacheinander gespielt öffnen nach dem Sieg „Zwei Teile, ein Seil“: Ein Handgriff deiner Wahl liegt von da an in fremder Fassung. Einmal je Run.
- **Zanns Takt:** In der Glockengießerei ist Zanns Geige die nächste sichere Beute (Talisman, Karte „Der Takt“). Mit der Geige gegen die Ungetaufte gilt: Ein Zug ohne Geigenkarte öffnet das Fenster, und der nächste Schritt des Wächters ist sein stärkster. Mit der Karte bleibt alles wie immer. Musik: eine Geigenebene, die mit dem Takt kommt und beim offenen Fenster abreißt.
- **Bot:** wertet die Geigenkarte hoch, wenn das Fenster sonst aufginge, spielt Teile nacheinander, trägt die Geige und steckt den Brief ein.
- **Dev:** Reiter „Tiefe“ mit Abschnitt Würze; Cheats `wuerze` (Stück auf den Zettel) und `wuerzeTun` (Zeitung, Brief, Trennung, Zann sofort).
- **Schalter:** `auftrag3.wuerze`.

#### Abnahme M11
- Abnahmekriterien:
  - Jedes Stück im Dev-Reiter erzwingbar: ✓ ([Foto](bilder/M11/14-dev-wuerze.png)).
  - `test-wuerze.js` grün: ✓ 34 Prüfungen ([test-wuerze.txt](bilder/M11/test-wuerze.txt)).
  - 100 Seeds: ✓ höchstens drei je Run (0/1/2/3: 10/45/40/5), Mittel 1,40 (soll etwa 1,5), 0 Wiederholungen in aufeinanderfolgenden Runs; je Stück Zann 29, Trennung 35, Brief 39, Zeitung 37.
  - 30 Bot-Runs mit allen vier Stücken: ✓ ohne Fehler, 21 Siege (Zeitungen 51, Brief eingesteckt 19, Teile gefunden 83, Trennung ausgelöst 24).
  - Fotos, selbst angesehen: [Zeitung im Übergang](bilder/M11/01-zeitung-uebergang.png), [Vermisstenanzeige](bilder/M11/02-vermisstenanzeige.png), [Brief-Ereignis](bilder/M11/03-brief-ereignis.png), [Biomwahl](bilder/M11/04-brief-biomwahl.png), [Peilkarte mit Umschlag](bilder/M11/05-brief-peilkarte.png), [Knoten mit dem Vorgänger](bilder/M11/06-brief-knoten-vorgaenger.png), [Teil an der Fundstelle](bilder/M11/07-trennung-fundstelle.png), [Teile in der Hand](bilder/M11/08-trennung-teile-in-der-hand.png), [Wahl](bilder/M11/09-trennung-wahl.png), [fremde Fassung](bilder/M11/10-trennung-fremde-fassung.png), [Geige als Beute](bilder/M11/11-zann-geige-als-beute.png), [Kampf mit Geige](bilder/M11/12-zann-kampf-mit-geige.png), [Fenster offen](bilder/M11/13-zann-fenster-offen.png). Erzeugt mit `tools/m11-fotos.js`, keine Konsolenfehler. Bilder: [Kontaktbogen](bilder/M11/bilder-kontakt.png).
  - Regelprüfung aller vier: ✓ (unten).
- Tests: `test-wuerze` 34 Prüfungen, `test-kern`, `test-run`, `test-deckbau`, `test-begegnungen`, `test-biegungen`, `test-meta`, `test-speicher`, `test-oberflaeche`, `test-karte-ui`, `test-rucksack`, `test-plakette` „Alles gut.“, `test-stoffbaum` 33 Prüfungen, `icons/pruefen` 250 Bilder ohne Verstoß.
- texte-pruefen: `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 578, alle als Entwurf markiert.`
- Agenten: Sonnet Texte (ohne Änderung übernommen), Sonnet Bilder (eine Rückgabe), Sonnet Klang (ohne Rückgabe übernommen; Klang ungehört).
- Mindestens erfüllt: ✓ genau die vier verlangten Stücke; der Rest ist per Schalter aus.

### M12 Balance und Abschluss

**Plan.** Balance und Bericht selbst. Sonnet: Galerie und Artboard zeigen alles Neue; Sonnet: `data/README.md` erklärt alle neuen Daten. Geklickter Run mit eigenem Skript.

**Schritte und Entscheidungen.**
- **Messung vorher** (alle Systeme an, Werte aus M11): generisch 58 % ([balance-vorher.txt](bilder/M12/balance-vorher.txt)), Builds 34–58 % ([build-bots-vorher.txt](bilder/M12/build-bots-vorher.txt)). Akt V verursachte 55 % der Niederlagen des generischen Bots (Basis M0: 31 %), bei Glutnest und Brackwasser über 50 %. Tode durch Eliten stiegen von 6 auf 21 %.
- **Ursache gesucht** (je 100 Runs, [aus/](bilder/M12/aus/), [beg/](bilder/M12/beg/)): Alle Systeme aus: 52 %, Akt V 33 %. Einzeln aus: Begegnungen 52 % / 33 %, Würze 51 % / 37 %, Regelbiegung 60 % / 42 %, Blick, Farbe, Hören ohne Wirkung auf den Anteil. Je eine Begegnung allein: 33–42 %. Die Systeme machen Akt I bis IV leichter (Diener, Spuren-Beute, Asche, Brief), Akt V bleibt gleich schwer. Darum verschieben sich die Niederlagen nach hinten; keine einzelne Mechanik ist schuld.
- **Kandidaten** ([kandidat/](bilder/M12/kandidat/), über Seeds 1–100, 101–200, 201–300): `hp_per_depth` 0,04 (Akt V 46 %), `elite.chance` 0,35 (keine Wirkung), Spuren weicher oder härter (52–53 %), `waechter_faktor` 1,45 oder 1,5 allein (je nach Seeds 33–46 %, weil der Faktor auch das Finale stärker macht). Gewählt: **`waechter_faktor` 1,35 → 1,5** und neu **`boss_faktor` 1,2** (nur das Finale „ruft“, vorher galt der Wächter-Faktor). Seeds 1–100: 53 % / Akt V 32 %; 101–200: 56 % / 30 %; 201–300: 62 % / 29 %.
- **`boss_faktor`:** neuer Schlüssel in `balance.json → enemy_scaling`; `combat.js → mkEnemy` liest ihn für Rang `boss`, sonst gilt wie bisher `waechter_faktor`. Eine Zeile Code, damit der Ausgleich in `balance.json` bleibt.
- **Geklickter Run** (`tools/m12-geklickt.js detektiv 21`): Seed 21 mit dem Detektiv per Suche über 120 Seeds gefunden (keine Dev-Zettel gesetzt). Im Run: drei Biegungen (Ebbe und Flut, Der Schlag, Aufgewogen), ein Kampf mit stummem Gegner, sieben Blick-Wahlen, Farbe (fünf Meldungen), Begegnungen Asche und Die Tiefe erkennt dich, Würze Trennung, Brief und Zeitung; Sieg in Tiefe 31. Die Entscheidungen trifft der Autospieler (`Bot.schritt`) in der laufenden Seite, vor jedem Schritt wird die Station gezeichnet und fotografiert. Echte Mausklicks sind es nicht; die Oberfläche läuft aber vollständig mit, mit allen Animationen. 114 Stationen, keine Konsolenfehler.
- **Galerie und Artboard** (Sonnet, übernommen mit zwei Nachbesserungen von mir: die Überschriften der Biegungs-Kacheln saßen zur Hälfte links außerhalb, weil `karte.css` die Klasse `.kn` für Peilkarten-Knoten nutzt; die Karten standen gedreht wie in der Hand). Neu in der Galerie: Silhouetten mit Anschlusspunkten, Gesehene, 14 Biegungs-Zeichen mit Kopfleiste und Tooltip, Farbe (Schimmer, Spur, gebunden), neue Items und Karten, Strand-Stufen 0–4. Neu im Artboard: Regelbiegungen, Begegnungen (mit `art`-Zuordnung aller Gegner und Asche-Liste), Metaebene, Würze, Stoff X, Etiketten an Gegnern und Items, alles über die Suche findbar. Nebenbei behoben: `artboard.html` lud `combat.js` nicht.
- **Daten-README:** neuer Abschnitt „Auftrag 3“ mit allen neuen Dateien und Feldern samt Lesestelle im Code.
- **Kleinigkeit:** „Das Zeichen“ zeigte „… nicht.. Verbraucht“; `kampf.js` hängt „Verbraucht“ jetzt ohne doppelten Punkt an.

#### Abnahme M12
- Abnahmekriterien:
  - Generischer Bot 50–65 %: ✓ 53 % ([balance-nachher.txt](bilder/M12/balance-nachher.txt)), auf zwei weiteren Seed-Bereichen 56 % und 62 %.
  - Builds 40–65 %: ✓ 40–62 % ([build-bots-nachher.txt](bilder/M12/build-bots-nachher.txt)).
  - Kein Akt über 35 % der Niederlagen: ✓ Builds zusammen I 17 % · II 20 % · III 14 % · IV 18 % · V 31 %; generisch ([haeufigkeit.txt](bilder/M12/haeufigkeit.txt)) I 7 % · II 31 % · III 12 % · IV 17 % · V 33 %.
  - Geklickter Run nach 09-pruefen §6: ✓ [Kontaktbogen](bilder/M12/run-uebersicht.png), Einzelbilder in [run/](bilder/M12/run/), [Protokoll](bilder/M12/run-protokoll.json).
  - Galerie und Artboard zeigen alles Neue: ✓ [Silhouetten](bilder/M12/galerie-1-silhouetten.png), [Gesehene](bilder/M12/galerie-2-gesehene.png), [Biegungs-Zeichen](bilder/M12/galerie-3-biegungs-zeichen.png), [Farbe](bilder/M12/galerie-4-farbe-frei.png), [neue Items](bilder/M12/galerie-5-neue-items-und-karten.png), [Strand](bilder/M12/galerie-6-strand-stufen.png); Artboard [Biegungen](bilder/M12/artboard-1-biegungen.png), [Begegnungen](bilder/M12/artboard-2-begegnungen.png), [Metaebene](bilder/M12/artboard-3-metaebene.png), [Würze](bilder/M12/artboard-4-wuerze.png). Erzeugt mit `tools/m12-galerie-fotos.js`, keine Konsolenfehler.
  - `data/README.md` erklärt alle neuen Daten: ✓
  - Alle Tests grün: ✓ `test-kern`, `test-run`, `test-deckbau`, `test-begegnungen`, `test-biegungen`, `test-ereignisse`, `test-speicher` „Alles gut.“, `test-meta` 30, `test-wuerze` 34, `test-vorschau` 398 Karten ohne Abweichung; [Oberfläche](bilder/M12/ui-tests.txt): `test-oberflaeche`, `test-karte-ui`, `test-rucksack`, `test-plakette` „Alles gut.“, `test-stoffbaum` 33, Icons 250 und Sprites 256 ohne Verstoß.
  - texte-pruefen: ✓ `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 578, alle als Entwurf markiert.`
- Agenten: Sonnet Galerie/Artboard (zwei Nachbesserungen von mir), Sonnet README (ohne Änderung übernommen).

### Zugabe

**Plan.** Liste aus 03-meilensteine.md: (1) fehlende Mindestens-Punkte, (2) Krämer mit tausend Masken als Probe, (3) je tiefem Biom ein Ereignis zur Regelbiegung, (4) mehr Notizen und Zeitungsausschnitte. Kern (Krämer, Notiz-Fassungen) selbst, Texte und Bilder Sonnet.

**Schritte und Entscheidungen.**
- **(1) Mindestens:** Alle Abnahmen M1 bis M11 haben „Mindestens erfüllt“ (M7–M10 sogar mehr). Nichts nachzuholen.
- **(2) Der Krämer mit tausend Masken (Probe):** fünftes Würze-Stück `masken` mit eigenem Schalter `auftrag3.masken` (Dev-Reiter TIEFE), Chance 0,25. Der erste Krämer in Akt II bis IV hat ein anderes Gesicht und denselben Ring: Ein Stück aus seinem Sortiment gibt es ohne Gold („ANSCHREIBEN“, einmal je Run). Am Anfang des nächsten Akts wartet er am Übergang und nimmt einen Handgriff deiner Wahl mit (fest eingeritzte ausgenommen); hast du keinen, nimmt er das Stück zurück. Kein Masken-Krämer, wenn der Krämer zu ist (Seitenwechsel) oder ein Tausch-Krämer. Bot: schreibt das beste Stück an, gibt den schwächsten Handgriff. Code in `wuerze.js` (Abschnitt Masken), Hooks in `run.js` (Krämer-Knoten, `enterAct`), Oberfläche `maskenHtml` und Wahl „Der Ring“ in `bildschirme.js`.
- **(3) 14 Ereignisse**, eines je Biom mit Regelbiegung (Übersicht in [zugabe/ereignisse-biegung.md](zugabe/ereignisse-biegung.md)). Sie spielen über Text und Folgen mit der Regel (z. B. Über Eck: zwei Hemden, deren Ärmel sich über die Gasse fast berühren; Aufgewogen: der Schalter für Reste), nur mit vorhandenen `fx`. Zehn nach „Der Geruch zuerst“, eines mit `tiefe: 1` (Der Restposten; die übrigen drei habe ich gestrichen, weil M9 höchstens zwölf solche Wahlen vorsieht). Die Pforte hatte bisher kein eigenes Ereignis; `pforte_nebentueren` kommt über die Ebene „Rast oder Ereignis“ in Akt V.
- **(4) Notizen und Zeitung:** Jede der 70 Notizen (45 Wächter, 25 Biome) hat eine zweite Fassung in `mehr` (wahr und falsch, Belege in [zugabe/notizen-belege.md](zugabe/notizen-belege.md)); `Metaebene.notizenAnRast` wählt per Seed eine Fassung. 18 neue Zeitungsausschnitte (jetzt 30), sechs nach „Der Geruch zuerst“.

#### Abnahme Zugabe
- `test-wuerze.js` 43 Prüfungen grün, davon 9 für den Krämer (Angebot, ohne Gold, nur eins, kassiert am Anfang des nächsten Akts, ein Handgriff weniger, nur einmal, ohne Zettel nichts, Schalter aus); 100 Seeds mit fünf Stücken: höchstens drei, Mittel 1,58, keine Wiederholung; 30 Bot-Runs mit allen fünf Stücken ohne Fehler.
- `test-ereignisse.js` grün (534 Wahlen gespielt, alle 14 neuen dabei), `test-meta.js` 30 grün, `test-run.js` grün.
- Fotos, selbst angesehen: Krämer [Angebot](bilder/Zugabe/masken-1-angebot.png), [angeschrieben](bilder/Zugabe/masken-2-angeschrieben.png), [Der Ring kassiert](bilder/Zugabe/masken-3-der-ring-kassiert.png); die 14 Ereignisse im Spiel `bilder/Zugabe/ereignis-*.png` (`tools/zugabe-fotos.js`); Bilder [Kontaktbogen](bilder/Zugabe/ereignisse-kontakt.png).
- texte-pruefen: `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 849, alle als Entwurf markiert.`
- Agenten: Sonnet Ereignisse (ohne Änderung übernommen), Sonnet Notizen und Zeitung (ohne Änderung übernommen; Stichprobe Lotse gegen `foes.json` stimmt), Sonnet Bilder (eine Rückgabe).

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

### M7 Sehen und gesehen werden

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | Hinsehen tauscht Wissen und Beute gegen einen Gegner mehr; der Kampf spielt sich mit offenen Karten anders |
| Das Deck bleibt deins | Ja | Nichts wird eingemischt; die Items bringen eigene Karten wie jedes Item |
| Selten ist stark | Ja | Drei seltene Items, erst ab Akt II; ohne Item gibt es keine Wahl |
| Kein Fragezeichen | Ja | Ohne Hinsehen ist nichts angedeutet außer dem einen Schatten ohne Text; mit Hinsehen ist alles offen |
| Einwilligung vor Kontrollverlust | Ja | Der Spieler wählt jedes Mal selbst, Standard ist nicht hinsehen |
| Unheimlich, nicht anstrengend | Ja | Eine Wahl je Kampf mit zwei Knöpfen, danach nichts zu verwalten |
| Nie Herkunft als Bedrohung | Nein | Rein mechanisch |

Lovecraft-Prinzip: Wissen ist irreversibel und hat seinen Preis (From Beyond: wer hinsieht, wird gesehen).

### M8 Die Farbe

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | Die Karten des Items tragen andere Stoffe und öffnen andere Reaktionen; nichts wird schwächer |
| Das Deck bleibt deins | Ja | Keine Karte kommt dazu oder geht weg; nur Stoffe wandern, und Spuren lassen sich tilgen |
| Selten ist stark | Ja | Einmal je Run, etwa jeder zweite Run, nur über das eine Ereignis |
| Kein Fragezeichen | Ja | Der Baum zeigt die angenommenen Stoffe, die Karte zeigt das Zeichen X, die Spur steht im Rucksack |
| Einwilligung vor Kontrollverlust | Ja | Die Farbe kommt nur, wenn man die Hand in den Brunnen hält; Binden und Tilgen stehen jederzeit offen |
| Unheimlich, nicht anstrengend | Ja | Eine Regel (Stoffe der Karte davor), sichtbar in der Hand, kein Zähler |
| Nie Herkunft als Bedrohung | Ja | Eine Farbe aus dem All, kein Mensch, keine Abstammung |

### M9 Die Diener erheben sich

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | Der Wächter bekommt einen Schritt, du verlierst nichts; die Karte kommt besser zurück |
| Das Deck bleibt deins | Ja | Die Karte bleibt im Deck und spielbar; sie kommt geschliffen oder in der fremden Fassung zurück |
| Selten ist stark | Ja | Höchstens einmal je Run, nur beim Wächter, nur mit einer Karte, die man achtmal gespielt hat |
| Kein Fragezeichen | Ja | Die Absicht zeigt das Bild deiner Karte und den Schaden |
| Einwilligung vor Kontrollverlust | Ja | Man spielt die Karte selbst so oft; kein Kontrollverlust |
| Unheimlich, nicht anstrengend | Ja | Nichts zu verwalten, die eigene Lieblingskarte steht plötzlich gegenüber |
| Nie Herkunft als Bedrohung | Ja | Es geht um deine Gewohnheit, nicht um Herkunft |

### M9 Asche

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | Ein Verbündeter für einen Kampf, später ein Gegner mehr; beides verändert, nichts wird abgezogen |
| Das Deck bleibt deins | Ja | Asche hat keine Karten und keinen Platz |
| Selten ist stark | Ja | Höchstens drei Aschen, ein Verbündeter, nur auf dem Zettel |
| Kein Fragezeichen | Ja | Der Baum zeigt „Asche rufen“ mit dem Preis im Tooltip; die Wiederkehr trägt dieselbe Spur |
| Einwilligung vor Kontrollverlust | Ja | Rufen nur durch eine bewusste Folge Salz → Feuer; Auflösen geht immer |
| Unheimlich, nicht anstrengend | Ja | Eine Folge von zwei Stoffen, ein sichtbarer Ast |
| Nie Herkunft als Bedrohung | Ja | Asche aus Gestalten, die einmal Menschen waren; ihre Herkunft spielt keine Rolle |

### M9 Spuren

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | Der Zeitpunkt verändert den Kampf und die Beute, früh leicht und klein, spät schwer mit Reliquie |
| Das Deck bleibt deins | Ja | Nichts am Deck |
| Selten ist stark | Ja | Ein Knoten je Akt, nur auf dem Zettel |
| Kein Fragezeichen | Ja | Die Stufe steht im Bild (Abdrücke), keine Zahl, kein Rätsel; nichts greift unsichtbar an |
| Einwilligung vor Kontrollverlust | Ja | Man entscheidet selbst, wann (oder ob) man hingeht |
| Unheimlich, nicht anstrengend | Ja | Eine Spur auf der Karte, die wächst, während man wegsieht |
| Nie Herkunft als Bedrohung | Ja | Ein Ding, kein Mensch |

### M9 Die Tiefe erkennt dich

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | Seitenwechsel: manche Kämpfe fallen weg, andere werden härter, der Krämer schließt |
| Das Deck bleibt deins | Ja | Die eine Karte ist streichbar wie jede andere und verschwindet nach dem Spielen |
| Selten ist stark | Ja | Nur nach zwei bestimmten Entscheidungen, nur auf dem Zettel |
| Kein Fragezeichen | Ja | Der Kartentext sagt, was passiert |
| Einwilligung vor Kontrollverlust | Ja | Nie erzwungen: solange man sie nicht spielt, passiert nichts |
| Unheimlich, nicht anstrengend | Ja | Eine Karte, eine Entscheidung, danach nur Folgen |
| Nie Herkunft als Bedrohung | Ja | Die Tiefe erkennt dich, weil du ihr gefolgt bist; `art` ordnet nach Körper und Form, kein Grund nennt Herkunft oder Blut |

### M10 Metaebene

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | Erbe und Fehlzeit geben etwas, Notizen informieren (manchmal falsch); nichts nimmt dem Run Stärke |
| Das Deck bleibt deins | Ja | Erbe nur auf Wunsch und streichbar; Fehlzeit nur nach eigener Wahl am Ende eines Runs, und es ist dein Seed und deine Figur |
| Selten ist stark | Ja | Ankunftszeile einmal im Leben, Pause höchstens alle 30 Tage, Notizen jeder dritte verlorene Run |
| Kein Fragezeichen | Ja | Fehlzeit sagt vorher, was sie bedeutet; alles andere ist Text und Bild |
| Einwilligung vor Kontrollverlust | Ja | Fehlzeit ist der einzige Kontrollverlust und geschieht nur nach „ANNEHMEN“ und nur am Runstart |
| Unheimlich, nicht anstrengend | Ja | keine Zahl, keine Leiste; der Strand und die Ausrede ändern sich still |
| Nie Herkunft als Bedrohung | Ja | Die Texte handeln von Wiederkehr und Spuren, nicht von Abstammung (vom Text-Agenten und von mir geprüft) |

### M11 Zeitungsausschnitte

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | nur Text im Übergang, keine Wirkung auf Werte |
| Das Deck bleibt deins | Ja | berührt das Deck nicht |
| Selten ist stark | Ja | in etwa jedem zweiten Übergang, die Vermisstenanzeige erst ab dem 10. Run und höchstens einmal je Run |
| Kein Fragezeichen | Ja | der Ausschnitt ist lesbar, nichts Verborgenes |
| Einwilligung vor Kontrollverlust | Ja | kein Kontrollverlust |
| Unheimlich, nicht anstrengend | Ja | ein Zettel auf dem Zwischentitel, nichts zu tun |
| Nie Herkunft als Bedrohung | Ja | Texte über Verschwinden und den Ort, nicht über Abstammung |

### M11 Der falsche Brief

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | verspricht ein Biom und gibt im besten Fall ein Item; nimmt nichts |
| Das Deck bleibt deins | Ja | das Item des Vorgängers wird nur auf Wunsch genommen |
| Selten ist stark | Ja | höchstens ein Brief je Run, in etwa einem von drei Runs |
| Kein Fragezeichen | Ja | der Umschlag auf der Peilkarte sagt, wo es ist |
| Einwilligung vor Kontrollverlust | Ja | einstecken oder liegen lassen; die Biomwahl bleibt deine |
| Unheimlich, nicht anstrengend | Ja | der Brief kennt dich, der Knoten ist manchmal leer |
| Nie Herkunft als Bedrohung | Ja | der Absender ist der Vorgänger, nicht eine Familie |

### M11 Barmherzige Trennung

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | der Handgriff wird fremd, behält aber seine Werte |
| Das Deck bleibt deins | Ja | du wählst den Handgriff; die Teile sind 0-Kosten-Karten, die man liegen lassen kann |
| Selten ist stark | Ja | einmal je Run, braucht zwei Teile direkt nacheinander |
| Kein Fragezeichen | Ja | die Wahl zeigt alle Handgriffe offen |
| Einwilligung vor Kontrollverlust | Ja | ausgelöst nur durch dein eigenes Spielen zweier Teile |
| Unheimlich, nicht anstrengend | Ja | ein Satz und eine Wahl nach dem Sieg |
| Nie Herkunft als Bedrohung | Ja | handelt von einem Seil und einer Entscheidung, nicht von Herkunft |

### M11 Zanns Takt

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | die Geige gibt Block; nur das Aussetzen kostet |
| Das Deck bleibt deins | Ja | die Geige ist ein Item wie jedes, ablegbar |
| Selten ist stark | Ja | nur in der Glockengießerei und nur gegen die Ungetaufte |
| Kein Fragezeichen | Ja | die Absicht zeigt den stärksten Schritt offen, eine Meldung sagt „Das Fenster steht offen.“ |
| Einwilligung vor Kontrollverlust | Ja | wer die Geige nicht anlegt, spielt den Wächter wie immer |
| Unheimlich, nicht anstrengend | Ja | eine Karte je Zug, die Musik sagt es mit |
| Nie Herkunft als Bedrohung | Ja | Musik und Fenster, keine Herkunft |

### Zugabe: Der Krämer mit tausend Masken (Probe)

| Regel | Ja/Nein | Begründung |
|---|---|---|
| Verändern statt schwächen | Ja | gibt jetzt ein Stück und nimmt später einen Handgriff; ein Tausch, keine Schwächung |
| Das Deck bleibt deins | Ja | du wählst, ob du anschreibst und welchen Handgriff er nimmt |
| Selten ist stark | Ja | Würze-Stück mit Chance 0,25, einmal je Run |
| Kein Fragezeichen | Ja | Preis und Zeitpunkt stehen vor dem Anschreiben da |
| Einwilligung vor Kontrollverlust | Ja | nur nach „ANSCHREIBEN“; ohne Klick passiert nichts |
| Unheimlich, nicht anstrengend | Ja | ein Satz, ein Knopf, eine Wahl am Übergang |
| Nie Herkunft als Bedrohung | Ja | Gesicht und Ring, keine Herkunft |

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
| Linse, Resonator, Lampe aus dem Grab | 4 | `prototype/assets/items/{linse,resonator,grablampe}.png`, [Kontakt](bilder/M7/items-kontakt.png) | lesbar neben Weihwasser und Silbermesser; Lichtkegel der Linse bei 32 px nur ein Strich |
| Gesehener Tief („Der Danebenhängende“) | 4 | `prototype/assets/gegner/gesehener_tief.png`, [Kontakt](bilder/M7/gesehen-kontakt-1.png) | Qualle mit Knopfaugen, klar; feste Lücken auf meine Bitte entfernt |
| Gesehener Grund („Der Umfaltende“) | 4 | `…/gesehener_grund.png`, ebenda | nach Rückgabe (erst 3: flache Lappen, Lückenmuster): geschlossene Klammer, Mund als Brennpunkt, kräftiger Rand |
| Gesehener Letzt („Der Hohe am Rand“) | 4 | `…/gesehener_letzt.png`, [Kontakt](bilder/M7/gesehen-letzt-kontakt.png) | nach Rückgabe (erst 3: Tausendfüßler aus Fäden): hohe gebeugte Säule mit Haube; Säule etwas flächig |

| Ereignisbild Der Brunnen im Hof | 4 | `prototype/assets/ereignisse/farbe_brunnen.png`, [Foto](bilder/M8/05-ereignis-brunnen.png) | nach Rückgabe (erst 3: flache Fläche im Schacht, Hof zu dunkel): Blick hinunter mit dichter werdendem Schimmer, Hof lesbar |
| Farbe im Bild (Schimmern, Kristall, Spur-Linie, Zeichen X) | 4 | `prototype/js/ui/farbe.js`, Fotos M8 | Schimmer wandert am Umriss, gebunden starr in Facetten; Kartenrand etwas dick |
| Strand-Stufen (Fußspuren, Pfad) | 4 | `prototype/js/scenes/world/hafen.js` (`strandSpuren`), [Stufen](bilder/M10/strand-1.png) | nach Rückgabe (erst 2: Abdrücke wie Grabsteine): kleine Mulden in Paaren, Stufe 4 ein Pfad mit Wall; rechte Pfadkante noch etwas hart |
| Erbe-Rahmen und fremde Fassung | 4 | `prototype/css/meta.css`, [Erbe](bilder/M10/erbe-in-der-hand.png), [fremd](bilder/M10/fehlzeit-fremde-handgriffe.png) | gestrichelt und vergilbt bzw. dunkler und kursiv; die fremde Fassung ist im Spielbild eher leise |
| Karte Das Zeichen | 4 | `prototype/assets/karten/zeichen.png`, [×4](bilder/M9/zeichen-x4.png) | Auge mit Gezeitenstrudel auf nassem Holz, klar lesbar im Bogen; etwas sauber und symmetrisch |
| Zanns Geige | 4 | `prototype/assets/items/zanns_geige.png` | nach Rückgabe: Korpus mit Taille, Bogen neben dem Hals, gerissene Saite lesbar |
| Karte „Das Relief“ | 3 (angenommen, offen) | `prototype/assets/karten/relief.png` | zwei Gestalten und Schnitt lesbar, aber flach und warmbraun statt Stein; für später offen |
| Karte „Der Ausschnitt“ | 4 | `prototype/assets/karten/ausschnitt.png` | Zeitungsspalte mit Seil, klar |
| Karte „Die Aussage“ | 4 | `prototype/assets/karten/aussage.png` | nach Rückgabe: klare Zeilen, Teer-Daumenabdruck, Tauknoten; kühler als der Ausschnitt |
| Brief-Ereignis | 4 | `prototype/assets/ereignisse/falscher_brief.png` | nach Rückgabe: kleineres, geknicktes Blatt mit ansteigender Schrift und Siegelrest, Spiegelung darunter |
| Geigenebene (Klang) | offen | `prototype/js/audio/music.js` (`Music.geige`), Labor-Knopf „GEIGE AN/AUS“ in `musik.html` | Mechanik geprüft (`musik-pruefen --schnell`: Einsatz auf der Taktgrenze, harter Abbruch in 45 ms mit Kratzer, Wiedereinsatz, Spitze −0,43 dBFS ohne Clipping); in der Cloud nicht gehört, darum keine Note. Lautstärke über `GEIGE_V` |
| Ereignis Die Probe | 4 | `prototype/assets/ereignisse/salz_probe.png` | drei Gläser Salz, Wasser, Blut auf dem Zinntisch, klar |
| Ereignis Die Wäscheleine | 4 | `prototype/assets/ereignisse/stadt_waescheleine.png` | nach Rückgabe: Hemden mit Kragen, Lichtstreif genau in der Lücke |
| Ereignis Der Stumpf | 4 | `prototype/assets/ereignisse/wald_stumpf.png` | Ringe wachsen aus dem Schnitt, Axt lesbar |
| Ereignis Das Staubecken | 4 | `prototype/assets/ereignisse/gezeitenwerk_staubecken.png` | Schütz, Handrad, Pegel am Wasserspiegel |
| Ereignis Der Ringgang | 4 | `prototype/assets/ereignisse/ziegelgruben_ringgang.png` | Gang in Flucht, glühendes Ende, Stempelziegel |
| Ereignis Die Abfahrtstafel | 4 | `prototype/assets/ereignisse/station_abfahrt.png` | Tafel, offener Wagen, Koffer |
| Ereignis Die Peilung | 4 | `prototype/assets/ereignisse/eis_peilung.png` | Dreibein, zwei Stangen hintereinander |
| Ereignis Der dritte Schlag | 4 | `prototype/assets/ereignisse/walkathedrale_dritter_schlag.png` | nach Rückgabe (erst 2): drei wachsende Mulden, Kreide am Pfeiler |
| Ereignis Der Rucksack unter dem Glas | 4 | `prototype/assets/ereignisse/glasmeer_vorrat.png` | nach Rückgabe: Rucksack klar unter heller Glaskante |
| Ereignis Der zweite Schatten | 3 | `prototype/assets/ereignisse/mond_zweiter_schatten.png` | angenommen: Fels und kurzer Schatten klar, der lange weiche Schatten nur schwach lesbar |
| Ereignis Dreimal kurz | 4 | `prototype/assets/ereignisse/funkstation_dreimal.png` | Lautsprecher, Röhren, drei Kreidestriche |
| Ereignis Die Nebentüren | 4 | `prototype/assets/ereignisse/pforte_nebentueren.png` | vier Türen, je eine Herkunft, Plan am Boden |
| Ereignis Die Brandung | 4 | `prototype/assets/ereignisse/ufer_brandung.png` | Meer fällt als Vorhang, Gegenstände in Reihe |
| Ereignis Der Restposten | 4 | `prototype/assets/ereignisse/waage_restposten.png` | Rechenmaschine, Lade mit Röllchen |

## Neue Texte (Entwurf)

*Je neuer Text: Datei, ID, erste Worte. Für Philip und Mo.*

- **Zugabe, Daten:** `wuerze.json → texte.masken` (Krämer mit tausend Masken: „Hinter dem Tresen steht ein anderer als beim letzten Mal …“, „ANSCHREIBEN“, „Der Ring“, „Du schuldest mir noch etwas.“), 18 neue Zeitungsausschnitte (z. B. „Es roch nach Lampenöl und kaltem Salz …“), zweite Fassung aller 70 Notizen in `meta.json → notizen.*.mehr`, 14 Ereignisse (Liste in [zugabe/ereignisse-biegung.md](zugabe/ereignisse-biegung.md), z. B. `stadt_waescheleine` „Die Wäscheleine“, `waage_restposten` „Der Restposten“).
- **M11, Daten (`data/wuerze.json`):** 12 Zeitungsausschnitte (z. B. „Der Kutter Margaret Hale lief im Februar leer in den Hafen ein …“), Kopf „SALTMOOR GAZETTE · Vermisst“ und neun Vermisstenanzeigen (z. B. Fischer „VERMISST seit dem Frühjahr: ein Fischer, wettergegerbt …“), Brief „Ein Brief ohne Marke“ („Unter der Tür steckt ein Umschlag, auf dem dein Name steht …“, „Den Brief einstecken“, „Den Brief liegen lassen“) mit einem Brief je Biom, Trennung „Das Relief“, „Der Ausschnitt“, „Die Aussage“, „Zwei Teile, ein Seil“ („Du siehst, wer gehalten hat und wer gehalten wurde …“), Zanns Geige („Der Bogen ist bis aufs Holz abgespielt …“), Karte „Der Takt“, „Der Takt reißt ab. Das Fenster steht offen.“, „Du spielst wieder. Das Fenster schließt sich.“ Oberfläche: Würze-Zeile auf dem Run-Zettel, Brief-Knoten und Brief-Seite im Tagebuch.
- **M10, Daten (`data/meta.json`):** Ausrede-Stufen je Figur (z. B. Fischer „Mein Bruder ist nicht zurückgekommen. Das Boot lag am Morgen trocken im Hafen.“), „Ich gehe hinunter.“, Ankunftszeile „Du wachst am Strand auf. Deine Stiefel stehen im Sand, und die Spur dazu fehlt.“, 25 Pausen-Zeilen (z. B. Kapelle „Das Wasser in der Kapelle steht höher als zuletzt …“), Erbe („Dein Griff vom letzten Mal …“, NEHMEN, LIEGEN LASSEN), Fehlzeit („Jemand anderes wird an deiner Stelle gehen …“, ANNEHMEN, SELBST GEHEN, zwei Sätze zum Start), 45 Wächter- und 25 Biom-Notizen je wahr und falsch, Oberfläche „DAS ERBE“, „NOTIZEN“, „Unter dem Stein liegt ein Heft. Die Schrift ist nicht deine.“, „Notizen des Vorgängers“, „Einträge, die du nicht geschrieben hast“.
- **M9, Daten:** `run.json → karten.zeichen` „Das Zeichen“ („Für den Rest des Runs: Die Tiefe lässt dich gehen. Die Menschen nicht.“), `run.json → begegnungen` „Sie stehen da und sehen dich an. Keiner hebt die Hand.“, „WEITERGEHEN“, „Der Laden ist zu, als du kommst. Hinter dem Glas dreht jemand das Schild um.“ Oberfläche: „AUS DER ASCHE · FÜR DICH“, Baum-Äste „Asche rufen“ / „Asche zerfällt“ mit Tooltips, Meldungen der Begegnungen (Bus `why`).
- **M8, Daten:** `stoffe.json → X` „Die Farbe“, `events.json → farbe_brunnen` „Der Brunnen im Hof“ mit zwei Wahlen. Oberfläche: „SPUR TILGEN“, „Welches Item bekommt seinen Stoff zurück?“, Meldungen der Farbe.
- **M7, Daten:** `items.json` Linse (Karte „Brennpunkt“, „Ein Messingring mit einem Glas darin …“), Resonator („Nachklang“, „Eine Stimmgabel auf einem Eisenfuß …“), Lampe aus dem Grab („Schwelen“, „Man gibt sie den Toten mit …“); `foes.json` „Der Danebenhängende“, „Der Umfaltende“, „Der Hohe am Rand“ mit Konzeptsätzen. Oberfläche: „HINSEHEN“, „NICHT HINSEHEN“, „sieht dich“, Eigenschaft „Zu Kampfbeginn: hinsehen oder nicht“.
- **M6, Oberfläche:** Einstellung „Klänge als Zeichen“, Tooltip „Klang“, Musik-Labor „HÖREN STATT SEHEN“ mit Knöpfen.
- **M5, `data/biegungen.json`:** 14 Namen und Regeltexte (z. B. „Über Eck: Die erste und die letzte Karte …“), drei Reaktionen (Sole, Pökeln, Gezeitenblut) und Funkspruch. Oberfläche: „Oben: …“, „Handkarte wählen“, „danach …“, „Ebbe“/„Flut“, „Dieser Zug …/Nächster Zug …“ in Tooltips.

- **M4, Oberfläche (`js/ui/rucksack.js`, `kampf.js`, `bildschirme.js`):** „AM KÖRPER (R)“, „n im Rucksack“, „Klick ein Item, dann den Platz, an den es soll. Rechts siehst du, was das mit deinem Deck macht.“, „Trag drei passende Teile, um ein Set zu bilden.“, „· Ziehen oder anklicken zum Tauschen.“, Überschriften RUCKSACK, WERKBANK, DECK, Knöpfe „WEITER ›“, „ZURÜCK“, „Verkaufen“. `jobs.json → koerper` sind nur Zahlen.

## Entscheidungen unterwegs

- **Zugabe:** Krämer mit tausend Masken als Würze-Stück statt als eigenes System (Zettel, Chance, Sperre gelten mit), mit eigenem Probe-Schalter; er kassiert am Anfang des nächsten Akts, nicht beim nächsten Krämer, damit die Schuld sicher fällig wird. Pforten-Ereignis in `events.json` mit `biom: pforte`. Notiz-Fassungen als `mehr` am Eintrag statt eigener Liste, damit alte Daten gültig bleiben.
- **M12:** Ausgleich über `waechter_faktor` 1,5 und neuen `boss_faktor` 1,2 statt über Leben je Tiefe, weil nur so Akt V auf allen drei Seed-Bereichen unter 35 % blieb; `boss_faktor` braucht eine Zeile in `combat.js`, der Wert steht in `balance.json`. Der geklickte Run lässt den Autospieler in der Seite entscheiden statt echter Mausklicks (siehe M12). Seed per Suche statt per Dev-Zettel.
- **M11:** Grabbeigabe, Licht im Turm und Lügender Kartentext aus (Mindestens verlangt nur die vier anderen); die Geige ist in der Glockengießerei die nächste sichere Beute, sonst sah man Zanns Takt fast nie; Trennungs-Teile auch an Wandbildern, damit drei Teile in einem Run zu finden sind; Mittel 1,40 statt 1,5 gelassen, weil die Sperre für das letzte Stück die Chancen drückt und höhere Chancen zu oft drei Stücke ergaben; „Das Relief“ mit Note 3 angenommen.
- **M7, Fortsetzung:** Mo hat am 2026-11-09 gesagt, nach M6 weiterzumachen („we completed through m6, can you continue from there again?“). Ich habe `claude/project-thread-flvf7e` auf den M6-Stand von `claude/project-thread-hifkqz` vorgespult und arbeite ab M7 dort weiter.
- **M10:** Ausrede-Stufe 3 und alle Meta-Texte als Entwurf markiert, auch der Satz aus dem Steckbrief; Fehlzeit-Start fest bei der Kapelle (Steckbrief), nicht per Biomwahl; das Erbe nimmt der Bot immer; Notizen kommen nach der Fehlzeit, damit der Autospieler sie nicht an seiner Rast findet; Pausen-Zeile auf dem Titel statt am Runstart, weil sie dort zuerst gesehen wird.
- **M9:** Gezeitenwerk ohne Asche (kein Gegner war je ein Mensch, `m9-vorschlaege.js` erlaubt 0 nur dann); Begegnung = halbes Gold und kein Item; Spuren weichen auf schwere oder Rand-Kämpfe aus, wenn das Netz keinen normalen Kampf in der Mitte hat; Text der Karte „Das Zeichen“ von mir, nicht von Sonnet (kürzer, damit er auf die Karte passt).
- **M8:** #c800ff statt des `--alles`-Tons; Brunnen darf bis Akt III rutschen (sonst kam er nur in jedem vierten Run).
- **M7:** keine Wahl im Finale; Blick-Items erst ab ihrem Akt auch beim Krämer (`blickAb`); Gesehene ohne Tiefenskalierung und nach dem Bot-Vergleich schwächer.
- **M6, Stopp:** Philip hat am 2026-11-09 gesagt, nach Abnahme und Push von M6 nicht weiterzumachen. M7 bis M12 und die Zugabe sind nicht begonnen.
- **M4, Übernahme:** Philip hat am 2026-11-09 entschieden, dass ab M4 weitergearbeitet wird. M4 und folgende liegen auf `claude/project-thread-hifkqz` (von dieser Sitzung vorgegeben), aufgebaut auf Mos Branch `claude/project-thread-flvf7e`, als eigener Draft-PR dagegen.
- **M4, Rucksack:** Tausch gilt sofort statt Übernehmen/Verwerfen; Deck-Diff gegen den Stand beim Öffnen. Automatisch öffnen nur nach einem Fund, sonst Knopf und Taste R. Im Kampf nur lesend.

- **M0, Branch:** Die Sitzung gibt `claude/project-thread-flvf7e` vor, darum dieser Name statt `auftrag/run-3` (01-regeln.md Abschnitt 7 erlaubt das).
- **M0, Ausführung:** Mo hat den Auftrag am 2026-11-09 in einer Projekt-Sitzung gestartet („do it all in succession and in the cloud“).
- **M3, Umfang:** Mo hat während M3 entschieden, nach M3 aufzuhören („we can stop after m3“). M4 bis M12 und die Zugabe sind nicht begonnen.
- **M3, Agenten-Arbeitsbäume:** Zwei Worktrees entstanden auf altem `main` statt auf dem Branch; die Agenten haben sie selbst auf den Branch-Stand gebracht. Ihre Änderungen habe ich als Diff gelesen und übernommen.

## Rückgaben an Sub-Agenten

- **Zugabe, Ereignisbilder:** erste Runde Dritter Schlag Note 2 (keine Schläge zu sehen), Rucksack unter dem Glas, Wäscheleine und Zweiter Schatten Note 3, mit Punkten je Bild zurück; zweite Runde drei davon Note 4, der Zweite Schatten 3 (angenommen).
- **M11, Bilder:** erste Runde Geige, Relief, Aussage und Brief Note 3 (Geige: Bogen über dem Hals, Korpus ohne Taille, Hals grau; Relief: Gestalten ohne Köpfe und Arme, nicht erhaben, oranger Glanz; Aussage: Zeilen und Knoten unklar, Ton wie der Ausschnitt; Brief: Blatt zu groß, Schrift ungleichmäßig, keine Nässe), mit Punkten je Bild zurück; zweite Runde alle Note 4 außer dem Relief (3, angenommen).
- **M10, Strand:** Note 2 (Abdrücke lasen sich als Grabsteine, zu dunkel, zu groß) mit sechs Punkten zurück; zweite Runde Note 4.
- **M8, Brunnenbild:** Note 3 (flache Fläche im Schacht, Hof zu dunkel, Seil zu kurz) mit fünf Punkten zurück; zweite Runde Note 4.
- **M7, Gesehene:** Grund (Note 3: flache, bananenförmige Lappen, Lückenmuster) und Letzt (Note 3: unruhige Silhouette aus vielen Fäden, „hoch“ nicht lesbar) mit konkreten Punkten zurück; beide in der zweiten Runde Note 4. Bei allen drei sollten die festen Dither-Lücken raus, weil die Bühne die Durchsichtigkeit selbst macht.
- **M4, Silhouetten (Sonnet):** Friedhofswärter, Pfarrerin, Detektiv, Kneipenschläger und Veteran kamen in der ersten Runde auf Note 3 (zu glatt, Werkzeuge und Kopfbedeckung nicht lesbar, Haltung steif). Rückgabe mit konkreten Punkten je Figur, zweite Runde je Note 4.

- Keine Rückgabe nötig. In M3 habe ich zwei Punkte selbst nachgezogen statt zurückzugeben, weil sie außerhalb der erlaubten Dateien lagen: den Einsturz im Nebel (Kern) und das Kästchen „Übergänge kürzer“ (`ueberlagerungen.js`).

## Probleme

## Bericht

Stand nach der Zugabe. Fertig und abgenommen: M0 bis M12 und die Zugabe (M4 bis M6 von Philip auf `claude/project-thread-hifkqz`, hier vorgespult). Zugabe: keine Mindestens-Lücke offen; **Probe:** Der Krämer mit tausend Masken (Schalter `auftrag3.masken`, Würze-Stück, schreibt ein Stück an und kassiert einen Handgriff); 14 Ereignisse zu den Regelbiegungen mit Bildern; zweite Fassung aller 70 Notizen; 30 statt 12 Zeitungsausschnitte.

### Kernsysteme

Jedes System hat einen Schalter in `balance.json → auftrag3` und im Dev-Reiter TIEFE (`?dev=1`, Knopf DEV). `?a3aus=alle` schaltet alle aus.

| System | Gebaut | Erzwingen | Regelprüfung | Bild |
|---|---|---|---|---|
| Rucksack am Körper | Silhouette je Figur, Items am Körper, Deck-Diff rechts | Taste R außerhalb des Kampfs | alle sieben Ja (M4) | [Fischer](bilder/M4/rucksack-fischer-1440x900.png) |
| Regelbiegung | 14 Biegungen, eine je Biom in Akt III–V, Zeichen in Kopfleiste und Peilkarte | Reiter TIEFE „Nur eine Biegung“, CHEATS „Biom erzwingen“ | alle Ja, keine Biegung mehr als 5 Pp unter „aus“ (M5) | [Aufgewogen](bilder/M5/kampf-aufgewogen-1440x900.png) |
| Hören statt sehen | sechs stumme Gegner in Akt IV/V, drei Einsätze in der Musik, Klänge als Zeichen | CHEATS „spawn“ mit einem stummen Gegner in Akt IV | alle Ja (M6) | [stumm](bilder/M6/plakette-stumm.png) |
| Sehen und gesehen werden | Linse, Resonator, Lampe; Wahl zu Kampfbeginn; drei Gesehene; 44 Wächter-Schritte | CHEATS „Item“ Linse, dann Kampf | alle Ja (M7) | [Wahl](bilder/M7/01-wahl.png) |
| Die Farbe | Stoff X, Brunnen, Wandern, Spur, Binden, Tilgen | per Seed (etwa jeder zweite Run, `Farbe.planen`) | alle Ja (M8) | [auf dem Item](bilder/M8/01-farbe-auf-item-rucksack.png) |
| Begegnungen | Run-Zettel mit zwei von vier: Diener, Asche, Spuren, Die Tiefe erkennt dich | Reiter TIEFE Zettel-Knöpfe, „Asche geben“, „Spuren-Stufe“, „Zeichen geben“ | alle vier Ja (M9) | [Diener](bilder/M9/01-waechter-deine-karte.png) |
| Metaebene | Strand zählt, Ausrede in Stufen, Ankunftszeile, Notizen, Erbe, Fehlzeit, Pause | Run verlieren (CHEATS „tod“), neu starten; „Meta zurücksetzen“ | alle Ja (M10) | [Erbe](bilder/M10/erbe-angebot.png) |
| Würze | Zeitung, Falscher Brief, Barmherzige Trennung, Zanns Takt | Reiter TIEFE Abschnitt Würze, CHEATS `wuerze`/`wuerzeTun` | alle vier Ja (M11) | [Fenster offen](bilder/M11/13-zann-fenster-offen.png) |

### Alle Systeme an und aus (Werte nach M12)

| Build | an: Siege | an: Niederlagen je Akt I/II/III/IV/V | aus: Siege | aus: Niederlagen je Akt |
|---|---|---|---|---|
| Glutnest | 48 % | 7/4/2/5/8 | 46 % | 4/4/5/5/9 |
| Brackwasser | 40 % | 2/7/3/3/15 | 36 % | 4/4/7/9/8 |
| Bollwerk | 56 % | 6/3/2/4/7 | 42 % | 5/4/6/7/7 |
| Aderlass | 62 % | 2/2/7/3/5 | 50 % | 2/4/9/5/5 |
| Kettenwerk | 46 % | 5/6/5/4/7 | 46 % | 4/4/3/13/3 |
| Hagel | 46 % | 2/4/3/10/8 | 46 % | 2/7/8/5/5 |
| Ballast | 54 % | 4/9/2/3/5 | 44 % | 4/9/5/3/7 |
| Kollekte | 50 % | 5/5/4/4/7 | 44 % | 5/6/5/5/7 |
| **Generisch** (100) | **53 %** | Akt V 32 % | **48 %** | Akt V 35 % |

„Aus“ heißt alle neun Schalter aus, mit den Werten aus M12 ([build-bots-aus.txt](bilder/M12/build-bots-aus.txt), [balance-aus.txt](bilder/M12/balance-aus.txt)). Mit den Systemen gewinnen die Builds im Mittel 50 % statt 45 %. Brackwasser bleibt der schwächste Build und verliert mit allen Systemen die Hälfte seiner Runs in Akt V.

### Häufigkeit je Run (100 Seeds, Autospieler, [haeufigkeit.txt](bilder/M12/haeufigkeit.txt))

- Regelbiegungen: Ø 2,33 verschiedene je Run, 5,9 von 12,1 Kämpfen mit Biegung.
- Stumme Gegner: Ø 0,49 Kämpfe je Run, in 38 von 100 Runs.
- Blick: Ein Blick-Item trug der Bot am Ende nur in 3 Runs. Er nimmt sie selten (siehe offene Fragen).
- Farbe: in 53 von 100 Runs.
- Begegnungen: immer genau zwei auf dem Zettel (Spuren 67, Die Tiefe erkennt dich 51, Diener 47, Asche 35). Das Zeichen bekam der Bot in 1 Run, Asche rief er in 12.
- Würze: höchstens drei je Run. In den Bot-Runs liegt das Mittel bei 2,11, weil Dev-Runs nichts im Meta-Stand ablegen und die Sperre für das Stück des letzten Runs dort nicht greift. In einer echten Folge von Runs (`test-wuerze.js`, 100 Seeds nacheinander) liegt es bei 1,40, ohne Wiederholung. Je Stück: Zeitung 66, Trennung 52, Zann 50, Brief 43.

### Neue Texte

Alle neuen Texte tragen `"entwurf": true`. Sie stehen nach Meilenstein geordnet mit Datei und ersten Worten im Abschnitt „Neue Texte (Entwurf)“ oben. `node tools/texte-pruefen.js` zählt 578 und findet keinen geänderten alten Text. Im Artboard findet die Suche jeden davon.

### Fünf Dinge zum Ausprobieren

1. **Der ganze Run aus dem Bericht:** `index.html?job=detektiv&seed=21`. Er hat drei Biegungen, einen stummen Gegner, den Blick, die Farbe, Asche, den Brief, die Trennung und Zeitungen.
2. **Eine Regelbiegung im Kampf:** `index.html?job=fischer&seed=4&springe=kampf&akt=3` (Akt IV). Danach im Reiter TIEFE eine andere Biegung wählen.
3. **Peilkarte und Fahrt:** `index.html?job=pfarrerin&seed=7&springe=weg&akt=1`. Einen Knoten wählen und der Fahrt zusehen.
4. **Metaebene:** einen Run absichtlich verlieren (DEV → CHEATS „tod“) und neu starten. Dann zeigen sich der Strand mit Spuren, das Erbe und die Notizen an der ersten Rast.
5. **Klang:** `musik.html`, Abschnitt „Hören statt sehen“, die drei Einsätze und „GEIGE AN/AUS“. Die Geige hat noch niemand gehört.

### Offene Fragen an Philip und Mo

1. Die Geigenebene (Zanns Takt) ist ungehört. Klingt sie richtig, und ist sie leiser als die Gegnerstimme? Den Pegel regelt `GEIGE_V` in `music.js`.
2. Für den Ausgleich habe ich Wächter und Eliten stärker gemacht (`waechter_faktor` 1,5) und das Finale schwächer (`boss_faktor` 1,2). Passt das Gefühl in den Wächterkämpfen?
3. Blick-Items kommen selten an den Körper (beim Bot in 3 von 100 Runs). Sollen sie öfter im Fund liegen?
4. „Das Zeichen“ kommt selten (beim Bot in 1 von 100 Runs), der Seitenwechsel war in M9 hart. Ist das so gewollt?
5. Bild „Das Relief“ hat nur Note 3 (flach, warmbraun statt Stein). Soll es neu?
6. Grabbeigabe, Licht im Turm und Lügender Kartentext sind gebaut als Daten, aber aus. Sollen sie in einer späteren Runde an?
7. Fehlzeit und Pause sind an. Sollen sie im ersten Spieltest an bleiben?
8. 578 Entwurfstexte warten auf Durchsicht. Gibt es Stellen, die zuerst gelesen werden sollen?
