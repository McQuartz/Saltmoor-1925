# Fortschritt Auftrag 3

Wird vom Agenten geführt. Neueste Einträge oben in jedem Abschnitt.

## Stand

| Meilenstein | Status | Notiz |
|---|---|---|
| M0 Einrichten und Basis | fertig | Branch `claude/project-thread-flvf7e` (von der Sitzung vorgegeben), Text-Basis, Schalter, Dev-Reiter TIEFE |
| M1 Welle 1: sieben Fixes | fertig | Panzer 15 %, Fragmente 75 |
| M2 Kampf-HUD, Stoff-Baum, Plakette, Aufstellung | offen | |
| M3 Peilkarte und Fahrt nach vorne | offen | |
| M4 Rucksack am Körper | offen | |
| M5 Die Tiefe biegt die Regeln | offen | |
| M6 Hören statt sehen | offen | |
| M7 Sehen und gesehen werden | offen | |
| M8 Die Farbe | offen | |
| M9 Begegnungen | offen | |
| M10 Metaebene | offen | |
| M11 Würze | offen | |
| M12 Balance und Abschluss | offen | |
| Zugabe | offen | |

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

## Noten

*Je neues Bild: Name, Note, Bildpfad, Kurzbegründung.*

## Neue Texte (Entwurf)

*Je neuer Text: Datei, ID, erste Worte. Für Philip und Mo.*

## Entscheidungen unterwegs

- **M0, Branch:** Die Sitzung gibt `claude/project-thread-flvf7e` vor, darum dieser Name statt `auftrag/run-3` (01-regeln.md Abschnitt 7 erlaubt das).
- **M0, Ausführung:** Mo hat den Auftrag am 2026-11-09 in einer Projekt-Sitzung gestartet („do it all in succession and in the cloud“).

## Rückgaben an Sub-Agenten

## Probleme

## Bericht
