// Die letzte Kachel: eine weiß glasierte Wandfliese, schräg gekippt, die Kante mit Fase; auf der Rückseite, die
// unten hervorsieht, klebt noch grauer Mörtel. Ein feiner Sprung, der Glanz der Glasur oben rechts, und in der
// Fuge ein kaltes Glimmen in der Farbe des Stoffs.
'use strict';
module.exports = {
  form(A) {
    const { Pg } = A;
    const ruecken = [Pg([[7, 22], [33, 12], [42, 30], [16, 41]], null, { b: 1, rd: 1 })];
    const moertel = [Pg([[8, 25], [30, 17], [38, 32], [17, 42]], null, { b: 1.4, rd: 1.6 })];
    const kachel = [Pg([[6, 19], [32, 8], [41, 26], [15, 37]], null, { b: 1.8, rd: 0.8 })];
    return {
      gruppen: [{ p: moertel, mat: 'stein', k: 1, tone: -0.1 }, { p: ruecken, mat: 'stein', k: 0, tone: -0.25 }, { p: kachel, mat: 'knochen', k: 0, tone: 0.15 }],
      details(P) {
        // Glasurglanz: eine helle Linie parallel zur oberen Kante
        P.line(12, 18, 29, 11, 'knochenR2', true); P.line(13, 19, 28, 13, 'knochen3', true);
        // feiner Sprung
        P.ritz(22, 14, 25, 21, -2); P.ritz(25, 21, 23, 27, -2); P.ritz(23, 27, 27, 32, -1);
        // Mörtelkrümel unten, kaltes Glimmen in der Fuge
        for (const [x, y] of [[18, 41], [24, 40], [33, 35], [38, 33]]) P.stufe(x, y, +1);
        P.set(30, 36, 'a2'); P.set(31, 35, 'a3'); P.set(29, 37, 'a1');
      },
    };
  },
};
