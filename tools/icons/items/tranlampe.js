// Tranlampe: eine flache, schnabelförmige Öllampe aus Ton (wie ein Schuh), mit Henkel hinten; aus der Tülle vorn
// brennt eine ruhige Flamme, im Inneren glänzt der Tran.
'use strict';
module.exports = {
  form(A) {
    const { Pg, ring, E } = A;
    const lampe = [Pg([[6, 30], [10, 24], [24, 22], [36, 26], [44, 28], [42, 32], [32, 36], [14, 38], [6, 35]], null, { b: 2.4, rd: 1.2 })];
    const henkel = ring(7, 27, 4, 5, 1.2, null, {}, 10, Math.PI * 0.5, Math.PI * 1.5);
    const oeffnung = [E(22, 25, 5, 1.8, null, { pf: 'flat' })];
    return {
      gruppen: [{ p: henkel, mat: 'rost', k: 0 }, { p: lampe, mat: 'rost', k: 0 }, { p: oeffnung, mat: 'akzent', k: 0, tone: -0.35, ohneRand: true }],
      details(P) { P.set(21, 25, 'a3'); P.glow(42, 22, 6, 0.9, 'glutDim'); P.flamme(42, 27, 10, 2.6, 0.2); P.ritz(10, 33, 36, 30, -1); },
    };
  },
};
