// Der Ausschnitt (Barmherzige Trennung, Teil 2): ein vergilbter Zeitungsausschnitt, schräg, der Rand ausgerissen.
// Eine Titelzeile aus dicken Strichen, darunter zwei Spalten aus Zeilenstrichen, in der linken Spalte ein
// Foto-Rechteck (dunkel, mit einer Reihe heller Punkte: Menschen am Kai). Kein lesbarer Text.
'use strict';
module.exports = {
  w: 48, h: 48, st: ['S', 'G'], rar: 'selten',
  form(A) {
    const { Pg } = A;
    // Papier: rechteckig, schief, Rand an drei Seiten ausgerissen (Zacken), links glatt geschnitten
    const rand = [[9, 6], [14, 5], [19, 7], [24, 5], [30, 7], [35, 5], [41, 8], [40, 13], [42, 18], [40, 24], [43, 30], [41, 36], [42, 41], [36, 43], [31, 41], [26, 44], [20, 42], [15, 44], [10, 42], [8, 36], [8, 20]];
    const blatt = [Pg(rand, null, { b: 1.2, rd: 0.3 })];
    return {
      gruppen: [{ p: blatt, mat: 'papier', k: 0, tone: 0.18 }],
      details(P) {
        const auf = (x, y, c) => P.auf(x, y, c);
        // Alterung: Vergilbung gedithert vom Rand nach innen (dunklere Stufe), Stockflecken
        for (let y = 5; y < 45; y++) for (let x = 8; x < 44; x++) { const i = P.info(x, y); if (!i || i.stufe >= 4) continue; const q = Math.min(x - 8, 43 - x, y - 5, 44 - y) / 12; if (q < 1 && (1 - q) > ((x * 3 + y * 5) % 8) / 8) P.stufe(x, y, -1); }
        for (const [x, y] of [[33, 33], [34, 33], [18, 37], [37, 22]]) P.stufe(x, y, -1);
        // Titelzeile: dicke Striche, Höhe 2
        const titel = [[11, 9, 21], [23, 9, 36], [11, 12, 17], [19, 12, 34]];
        for (const [x0, y, x1] of titel) { for (let x = x0; x <= x1; x++) { if ((x * 7) % 11 === 0) continue; auf(x, y, 'papier0'); if (y === 9) auf(x, y + 1, 'papier0'); } }
        // Trennlinie unter dem Titel
        for (let x = 10; x <= 40; x++) auf(x, 15, 'papier1');
        // Spalten: links (x 11..22), rechts (x 26..38) und mittlere Zeile
        const spalte = (x0, x1, y0, y1) => { for (let y = y0; y <= y1; y += 2) { const e = x1 - ((y * 5) % 4 === 0 ? 3 : 0); for (let x = x0; x <= e; x++) if ((x * 3 + y) % 7 !== 0) auf(x, y, ((x + y) & 1) ? 'papier0' : 'papier1'); } };
        spalte(26, 38, 17, 40);
        spalte(11, 22, 36, 41);
        for (let y = 17; y < 41; y++) auf(24, y, 'papier1');   // Spaltenlinie
        // Foto: dunkles Rechteck in der linken Spalte, mit Rahmenlinie, Himmel, Kai, Menschenreihe
        for (let y = 18; y <= 33; y++) for (let x = 11; x <= 22; x++) { const i = P.info(x, y); if (!i) continue; const rahmen = x === 11 || x === 22 || y === 18 || y === 33; P.set(x, y, rahmen ? 'papier1' : y < 25 ? 'a0' : 'a1'); }
        for (let x = 12; x <= 21; x++) { if ((x + 25) % 2) P.set(x, 24, 'a2'); P.set(x, 25, 'a2'); }   // Wasserlinie hinter dem Kai
        // Leute am Kai: vier schmale Gestalten, eine fehlt (die Lücke)
        for (const x of [13, 15, 19, 21]) { P.set(x, 28, 'a3'); P.set(x, 29, 'a3'); P.set(x, 30, 'a2'); P.set(x, 31, 'a2'); }
        P.set(17, 30, 'a0'); P.set(17, 31, 'a0');
        P.set(13, 28, 'aG'); P.set(21, 28, 'aG');
        // Reißkante oben rechts: ein Stück Rand hell (Randlicht kommt von der Maske), eine Knickfalte quer
        for (let t = 0; t < 14; t++) { P.stufe(26 + t, 29 + Math.round(t * 0.15), -1); }
      },
    };
  },
};
