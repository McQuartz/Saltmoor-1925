# Belege zu den weiteren Tagebuch-Notizen (Zugabe)

Je neuer wahrer Notiz (`mehr` in `prototype/data/meta.json` → notizen): der Beleg mit Datei und Feld. Danach, woran die falsche Fassung scheitert. Schwächen: E Eisen, F Feuer, W Wasser, S Salz, B Blut, G Glaube, L Licht, V Fäulnis.

## Wächter

- lotse: foes.json lotse: pat[0] blk, pat[1] atk; weak W; besonders ruft tiefling alle 3. Falsch: weak ist W, pat beginnt mit blk, ruft wiederholt.
- opfernde: foes.json opfernde: pat blk, atk h2, buff, atk 15 (zuletzt); weak B; besonders ruft nest alle 4. Falsch: weak B, schwerer Schlag zuletzt, ruft wiederholt.
- glockenmutter: foes.json glockenmutter: pat[0] atk 8, letzter Schritt atk 13 nach buff; weak E; besonders ruft chorknabe alle 3. Falsch: weak E, Reihenfolge, ruft wiederholt.
- wurm: foes.json wurm: pat atk 10, blk 12, atk 5 h3, buff, atk 16; besonders schwach_wechsel [W,F,V] (combat.js: stoffe[turns % länge]). Falsch: Reihenfolge, Schwäche wechselt.
- windgestalt: foes.json windgestalt: weak W; pat atk 4 h3, blk 8, buff 2, atk 18, atk 9 (zuletzt ein kleinerer Schlag). Falsch: weak W, Reihenfolge.
- chor: foes.json chor: weak S; besonders ruft rufer alle 3; pat buff, atk h2, blk 14, atk h3, atk 18. Falsch: weak S, ruft wiederholt.
- ruft: foes.json ruft: besonders phasen bei [0.66,0.33] (drei Gestalten), schwach [G,V], ruft augen alle 2 (combat.js: nur ab Phase 1). Falsch: Gestalten wechseln, Rufen erst ab Phase 1, alle 2.
- erhoerte: foes.json erhoerte: pat atk 7, buff 2, atk 3 h4, blk 10, atk 12; kniff waechst; weak S; besonders ruft wachshand alle 3. Falsch: weak S, waechst, ruft alle 3.
- ungeheilter: foes.json/biome/grotte.json ungeheilter: weak F; phasen bei [0.5] schwach [G]; pat atk 10, atk 4 h3, blk 20, atk 15; kniff teurer. Falsch: weak F, kniff teurer.
- oberschwester: biome/kurhaus.json oberschwester: weak B; pat[0] blk 12; phasen bei [0.5] mit ruft genesender alle 3 (combat.js: nur ab Phase 1). Falsch: weak B, Rufen erst ab Phase 1.
- badekarren: biome/kurhaus.json badekarren: weak F; pat atk 13, blk 8 unverw (Vorhang zu), ...; besonders ruft badefrau alle 3. Falsch: weak F, Vorhang unverwundbar, ruft alle 3.
- uhrmacher: biome/nachtzug.json uhrmacher: weak E; kniff brecher; kniffe teurer; besonders ruft mitreisender alle 3. Falsch: weak E, brecher durchbricht Block, ruft.
- oberkellner: biome/nachtzug.json oberkellner: weak W; kniff verstopfen n1 Die Rechnung (unspielbar, jeden Zug); phasen bei [0.5] mit neuem Muster. Falsch: weak W, Rechnung jeden Zug und unspielbar.
- abschreiber: biome/kloster.json abschreiber: weak F; pat letzter Schritt atk 2 h5; besonders ruft novize alle 3. Falsch: weak F, letzter Schritt, ruft.
- adlerpult: biome/kloster.json adlerpult: weak E; kniff dornen v3; phasen bei [0.5] schwach [B], neues Muster. Falsch: weak E, dornen, Phase.
- schicht: biome/fabrik.json schicht: weak F; besonders ruft dosenkind alle 3; kniff waechst v2. Falsch: weak F, waechst, ruft wiederholt.
- fang: biome/fabrik.json fang: weak S; pendel true; kniff abschrift Gräte (jeden Zug, tut nichts). Falsch: weak S, Gräte jeden Zug.
- regulator: biome/gezeitenwerk.json regulator: besonders schwach_wechsel [W,E]; kniff waechst v1; pendel true. Falsch: Schwäche wechselt, waechst.
- griff: biome/gezeitenwerk.json griff: weak B; kniff kopie; phasen bei [0.5] schwach [E] mit neuem Muster. Falsch: weak B, kopie, Phase.
- wurzelstock: biome/wald.json wurzelstock: weak F; phasen bei [0.66,0.33] mit zwei neuen Mustern. Falsch: weak F, zwei Phasenwechsel.
- kronengaenger: biome/wald.json kronengaenger: schwach_wechsel [F,E]; kniff verstopfen n1 Harztropfen (unspielbar). Falsch: Schwäche wechselt, Tropfen unspielbar.
- voraus: biome/glasmeer.json voraus: weak L; kniff voraus (spielt deine nächste Karte, Seltenes nicht). Falsch: weak L, Neues/Seltenes.
- lichtqualle: biome/glasmeer.json lichtqualle: weak S; besonders ruft vorhergehende alle 3; kniff einfrieren. Falsch: weak S, ruft, einfrieren.
- herz: biome/walkathedrale.json herz: weak B; kniff takt v7; besonders ruft rippenkriecher alle 3. Falsch: weak B, Takt umgekehrt, ruft von Anfang an.
- kalb: biome/walkathedrale.json kalb: weak L; phasen bei [0.5] schwach [B]; kniff waechst v3. Falsch: weak L, waechst, Phase.
- linse: biome/leuchtturm.json linse: weak S; kniff takt; phasen bei [0.5] mit ruft strahlgaenger alle 3 (nur ab Phase 1). Falsch: weak S, Rufen erst ab Phase 1.
- nebelhorn: biome/leuchtturm.json nebelhorn: weak E; kniff ansage zuege 2 (laedt, laedt, atk); besonders ruft rueckmoewen alle 3. Falsch: weak E, Ansage, ruft.
- ungetaufte: biome/glockengiesserei.json ungetaufte: weak W; kniff takt klang glocke; besonders ruft kloeppelmann alle 3. Falsch: weak W, Takt, ruft.
- tretrad: biome/glockengiesserei.json tretrad: schwach_wechsel [F,B]; kniff waechst v2. Falsch: Schwäche wechselt, waechst.
- brennofen: biome/ziegelgruben.json brennofen: weak W; kniff loeschen; phasen bei [0.5] (brennofen_glut) mit größerem Schlussschlag. Falsch: weak W, Phase wird härter.
- neununddreissigste: biome/ziegelgruben.json neununddreissigste: weak E; besonders ruft stempel alle 4; kniff dornen v2. Falsch: weak E, alle 4, dornen wirken.
- rueckseite: biome/mond.json rueckseite: weak E; phasen bei [0.66,0.33], ruft mondmotte alle 3 (nur ab Phase 1); Phase 3 blk unverw (Neumond). Falsch: weak E, Rufen ab Phase 1, Neumond unverwundbar.
- mondmann: biome/mond.json mondmann: weak F; phasen bei [0.5] schwach [E]; kniff abschrift n2 Reisig. Falsch: weak F, Reisig bleibt.
- sender: biome/funkstation.json sender: weak S; phasen bei [0.5] schwach [G], ruft rauschen alle 3 (ab Phase 1); kniff verborgen. Falsch: weak S, verborgen, Rufen ab Phase 1.
- kastendrachen: biome/funkstation.json kastendrachen: schwach_wechsel [W,F]; kniff dornen v3. Falsch: Schwäche wechselt, dornen wirken.
- heimleiterin: biome/waisenhaus.json heimleiterin: weak F; kniff ruf gegner [zwillinge,zugedeckte] alle 3; kniffe abschrift Nummer 41 (tut nichts). Falsch: weak F, Gegnerarten, Nummer nutzlos.
- fotograf: biome/waisenhaus.json fotograf: weak L; phasen bei [0.5] schwach [F]; kniff einfrieren (eine Karte). Falsch: weak L, nur eine Karte.
- einfahrt: biome/station.json einfahrt: weak S; kniff ansage zuege 2; phasen bei [0.5] schwach [B], ruft wartende alle 3 (ab Phase 1). Falsch: weak S, Rufen ab Phase 1.
- menge: biome/station.json menge: schwach_wechsel [L,B]; kniff teurer v1. Falsch: Schwäche wechselt, teurer.
- galionsfigur: biome/hafen_plus.json galionsfigur: weak F; kniff brecher; phasen bei [0.5] mit stärkerem Muster. Falsch: weak F, brecher.
- moorpferd: biome/moor_plus.json moorpferd: schwach_wechsel [F,B]; kniff einfrieren (eine Karte). Falsch: Schwäche, nur eine Karte.
- prediger: biome/kapelle_plus.json prediger: schwach_wechsel [W,F,G]; kniff ansage zuege 1 (laedt, atk 16, im Wechsel). Falsch: Schwäche, Urteil nicht jeden Zug.
- eingesalzene: biome/salz_plus.json eingesalzene: weak W; phasen bei [0.5] schwach [B]; kniff einfrieren. Falsch: weak W, einfrieren.
- getragene: biome/stadt_plus.json getragene: weak F; kniff schuetzer v5; besonders ruft mumie alle 3. Falsch: weak F, schuetzer, ruft.
- welle: biome/eis_plus.json welle: weak E; phasen bei [0.5] schwach [G]; kniff ansage zuege 1 v30. Falsch: weak E, Ansage.

## Biome

- hafen: biomes.json hafen: gegner netzflickerin (foes.json weak E), tiefling (weak L); uebergang Kirchenmauer halb im Wasser. Falsch: weak, Übergang.
- moor: biomes.json moor: gegner hirte (foes.json weak L), torfstecherin (weak V); uebergang Kirchpfad zur Kapelle. Falsch: weak, Ziel.
- kapelle: biomes.json kapelle: gegner chorknabe (weak G), ertrunkener (weak S); uebergang Treppe hinter dem Altar nach unten, nass. Falsch: weak, Übergang.
- salz: biomes.json salz: gegner schlundtraeger (weak B); kraemer Der letzte Hauer, zeile seit 1911, Schichtende. Falsch: weak, Dauer.
- stadt: biomes.json stadt: kraemer Die Vermesserin, zeile 1903, Türen; uebergang Wind trägt Sand nach oben. Falsch: Jahr, Gegenstand, Richtung.
- eis: biomes.json eis: gegner nachgeher (foes.json weak G); kraemer Schlittenführer, zeile Name vergessen, Preise nicht. Falsch: weak, Umkehrung.
- pforte: biomes.json pforte: waechter ruft (foes.json weak S); biegungen.json ausser_zeit: nie zweimal dieselbe hintereinander. Falsch: weak, Regel bleibt.
- grotte: biome/grotte.json: gegner geheilter (weak G), quellwaerter (weak V); biom.uebergang Stufen ausgetreten von Knien. Falsch: weak, Stufen.
- kurhaus: biome/kurhaus.json: gegner liegender (weak L), kurgast (weak W); waechter oberschwester, waechter_alt badekarren. Falsch: weak, immer.
- nachtzug: biome/nachtzug.json: gegner kontrolleurin (weak G), schlafwagenkind (weak L); waechter uhrmacher, waechter_alt oberkellner. Falsch: weak, immer.
- kloster: biome/kloster.json: gegner novize (weak L), leser (weak G); waechter abschreiber, waechter_alt adlerpult. Falsch: weak, immer.
- fabrik: biome/fabrik.json: gegner ausnehmerin (weak F), kuehlhausgast (weak F); waechter schicht, waechter_alt fang. Falsch: weak, immer.
- gezeitenwerk: biome/gezeitenwerk.json: gegner zahnradwaerter (weak S), oelerin (weak F); kraemer Ingenieur, Taschenuhr zehn nach zwei. Falsch: weak, Uhrzeit.
- wald: biome/wald.json: gegner holzfaeller (weak G), bernsteinlarve (weak W); kraemer Köhler, zeile morgen fängt er Feuer. Falsch: weak, Meiler.
- ufer: biome/ufer.json: kraemer Strandwärter, zeile einer ist noch frei, der neben deinem; uebergang Spuren gehen ins Wasser. Falsch: Korb, Richtung.
- glasmeer: biome/glasmeer.json: gegner glasschwimmer (weak W), splitterchor (weak L); kraemer Dein Spiegelbild, zeile nennt den Preis, bevor du fragst. Falsch: weak, Reihenfolge.
- walkathedrale: biome/walkathedrale.json: gegner echo (weak G), markfresser (weak F); waechter herz, waechter_alt kalb. Falsch: weak, immer.
- leuchtturm: biome/leuchtturm.json: gegner lampenputzer (weak F), fensterzaehlerin (weak W); biom.anreise Strahl fällt auf den eigenen Hof. Falsch: weak, Strahl.
- glockengiesserei: biome/glockengiesserei.json: gegner giesser (weak W), kloeppelmann (weak G); waechter ungetaufte, waechter_alt tretrad. Falsch: weak, immer.
- ziegelgruben: biome/ziegelgruben.json: gegner brennmeister (weak W), ziegeltraeger (weak S); waechter brennofen, waechter_alt neununddreissigste. Falsch: weak, immer.
- mond: biome/mond.json: gegner astronom (weak L), mondmotte (weak W); biom.anreise Strickleiter von 1890 reicht bis auf den Staub. Falsch: weak, Leiter.
- waage: biome/waage.json: gegner schreiber (weak F), tarierte (weak S); kraemer Asservatenverwalter, zeile Seine Schale ist immer leichter. Falsch: weak, Gewicht.
- funkstation: biome/funkstation.json: gegner funker (weak W), mastkletterer (weak F); kraemer Proviantmeister art tausch, zeile Für jedes Stück, das du nimmst, kommt eins von dir auf die Liste. Falsch: weak, Tausch.
- waisenhaus: biome/waisenhaus.json: gegner nachtschwester (weak G), zwillinge (weak L); waechter heimleiterin, waechter_alt fotograf. Falsch: weak, immer.
- station: biome/station.json: gegner sperrenschaffner (weak F), streckengaenger (weak L); waechter einfahrt, waechter_alt menge. Falsch: weak, immer.
