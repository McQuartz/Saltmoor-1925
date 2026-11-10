// Auftrag 3 M5: Zeichen der 14 Regelbiegungen (data/biegungen.json → zeichen)
// Variante A: schwarz mit Messing, 9×9, '#' = Pixel. Wird nach zeichen.js geladen.
Object.assign(GLY,{
 bg_alte_stoffe:['....#....','...###...','....#....','...#.#...','..#...#..','.#.....#.','.#.....#.','#########','.#.....#.'],
 bg_ueber_eck:['##.#.#.##','#.......#','#.......#','#.......#','#.......#','#.......#','#.......#','#########','.........'],
 bg_rueckwaerts:['#########','....#....','..#.#.#..','...###...','.#..#..#.','..#.#.#..','...###...','....#....','.........'],
 bg_gezeiten:['.........','..#...#..','.#.#.#.#.','#...#...#','.........','.........','#.#.#.#.#','.#.#.#.#.','.........'],
 bg_ringofen:['..###....','.#.......','#.......#','#...#...#','#.......#','.#.....#.','..#####..','.........','.........'],
 bg_keiner_faehrt:['.......#.','......###','.......#.','.......#.','#########','.#..#..#.','#########','.........','.........'],
 bg_falsche_winkel:['.......#.','......#..','.....#...','....#...#','...#...#.','..#...#..','.#...#...','#########','.........'],
 bg_schlag:['......#..','......#..','......#..','..#.#.#..','##.#.#.##','.......#.','.......#.','.......#.','........#'],
 bg_spiegelbild:['..#......','.#.#.....','#####....','.........','#########','.........','....#####','.....#.#.','......#..'],
 bg_rueckseite:['..####...','.##......','##.......','##..###..','##.#.#.#.','##..###..','##.......','.##......','..####...'],
 bg_funkspruch:['.#.......','###.##...','.#.......','.#..##...','.#.......','.#..#####','.#.......','.#.......','###......'],
 bg_ausser_zeit:['..#####..','.#.....#.','#.#####.#','#..###..#','#...#...#','#..#.#..#','#.#####.#','#.......#','#.......#'],
 bg_wellen_oben:['..#...#..','.#.#.#.#.','#...#...#','.........','#########','....#....','..#.#.#..','...###...','....#....'],
 bg_aufgewogen:['....#....','.##.#....','#.#.###..','###.#.##.','....#.#.#','....#.###','....#....','....#....','..#####..'],
});
Object.assign(FXC,{
 bg_alte_stoffe:'#e8e0d0',bg_ueber_eck:'#d8c890',bg_rueckwaerts:'#b0c890',bg_gezeiten:'#8cc0d0',
 bg_ringofen:'#e0a070',bg_keiner_faehrt:'#c8b480',bg_falsche_winkel:'#9fc4e8',bg_schlag:'#e89080',
 bg_spiegelbild:'#a8d0e0',bg_rueckseite:'#c8d0e8',bg_funkspruch:'#d8c890',bg_ausser_zeit:'#d0a8ff',
 bg_wellen_oben:'#8cb8d8',bg_aufgewogen:'#d8c890'});
Object.assign(STN,{
 bg_alte_stoffe:'Alte Stoffe erinnern sich',bg_ueber_eck:'Über Eck',bg_rueckwaerts:'Rückwärts gewachsen',
 bg_gezeiten:'Ebbe und Flut',bg_ringofen:'Der Ringofen',bg_keiner_faehrt:'Keiner fährt ab',
 bg_falsche_winkel:'Falsche Winkel',bg_schlag:'Der Schlag',bg_spiegelbild:'Das Spiegelbild ist voraus',
 bg_rueckseite:'Die Rückseite',bg_funkspruch:'Funkspruch',bg_ausser_zeit:'Außerhalb der Zeit',
 bg_wellen_oben:'Die Wellen kommen von oben',bg_aufgewogen:'Aufgewogen'});
