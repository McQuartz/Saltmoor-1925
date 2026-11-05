// Aschekelle: ein flaches eisernes Blatt an einem langen Stiel, schräg; im Blatt ein Häufchen graue Asche, darin
// zwei Glutkrümel und etwas Kleines, Gebranntes, das man nicht ansehen will.
'use strict';
module.exports = {
  form(A) {
    const { E, Pg, acap, achse } = A;
    const ax = achse(18, 30, -0.78);
    const stiel = [acap(ax, 10, 0, 40, 0, 1.4, 1.3)];
    const griff = [acap(ax, 32, 0, 42, 0, 2.4, 2.4)];
    const blatt = [Pg([[3, 32], [16, 22], [26, 32], [13, 44]], null, { b: 1.6, rd: 1 })];
    const asche = [E(14, 33, 7, 4.5, null, { pf: 'bevel' })];
    return {
      gruppen: [{ p: griff, mat: 'holz', k: 0.6 }, { p: stiel, mat: 'eisen', k: 0 }, { p: blatt, mat: 'eisen', k: 0.8 }, { p: asche, mat: 'stein', k: 1.5, tone: 0.3 }],
      details(P) {
        P.set(12, 33, 'flamme'); P.set(13, 33, 'glutMittel'); P.set(17, 35, 'flammeHell'); P.glow(14, 34, 6, 0.6, 'glutMittel', 'glutDim');
        // das kleine Gebrannte: ein Fingerglied aus Ton
        P.ritz(15, 30, 18, 29, +1); P.set(18, 29, 'glutMittel');
        for (const [x, y] of [[10, 31], [16, 31], [19, 34]]) P.stufe(x, y, +1);
      },
    };
  },
};
