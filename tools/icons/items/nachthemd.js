// Nachthemd Nr. 41: grobes Leinen, gefaltet, oben der Kragen mit zwei Knöpfen und die Nummer in rotem Garn.
// Die untere Hälfte ist dunkel vor Nässe, unten hängt ein Tropfen.
'use strict';
module.exports = {
  form(A) {
    const { E, Pg } = A;
    const koerper = [Pg([[8, 14], [40, 12], [42, 38], [10, 41]], null, { b: 2.4, rd: 2 })];
    const kragen = [Pg([[15, 10], [24, 15], [33, 9], [36, 14], [24, 21], [12, 15]], null, { b: 1.6, rd: 1 })];
    const knoepfe = [E(24, 25, 1.4, 1.4), E(24, 31, 1.4, 1.4)];
    const nummer = [Pg([[30, 17], [36, 16], [36, 20], [30, 21]], null, { b: 0.6 })];
    const tropfen = [E(20, 45, 1.2, 1.7)];
    return {
      gruppen: [{ p: koerper, mat: 'stoff', k: 0, tone: 0.25 }, { p: kragen, mat: 'stoff', k: 0, tone: 0.35 }, { p: knoepfe, mat: 'knochen', k: 0 }, { p: nummer, mat: 'rotstoff', k: 0, tone: 0.2 }, { p: tropfen, mat: 'akzent', k: 0 }],
      details(P) {
        P.ritz(10, 27, 41, 25, -2); P.ritz(24, 21, 24, 40, -1);
        for (let y = 30; y < 41; y++) for (let x = 9; x < 42; x++) { const i = P.info(x, y); if (i && i.mat === 'stoff' && i.stufe < 4 && (x + y) % 3 !== 0) P.stufe(x, y, -1); }
        P.set(31, 18, 'rotstoff3'); P.set(34, 18, 'rotstoff3');
        P.set(20, 42, 'a2');
      },
    };
  },
};
