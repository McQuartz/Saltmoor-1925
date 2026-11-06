// Die Knotenschnur: eine Lotschnur, die in einem Zickzack herabhängt, mit großen, hellen Knoten (einer je Faden Tiefe,
// unten immer dichter) und unten dem schweren, kegeligen Bleilot. Unten sind mehr Knoten, als die Schnur lang ist.
'use strict';
module.exports = {
  form(A) {
    const { kurve, E, Pg, ring } = A;
    const oese = ring(10, 4, 2.4, 2.4, 0.9, null, {}, 10);
    const schnur = kurve([[10, 6], [30, 10], [14, 18], [32, 24], [20, 30], [26, 34]], 0.9, 0.9, null, { cr: true }, 40);
    const qs = [0.1, 0.25, 0.4, 0.53, 0.64, 0.73, 0.8, 0.86, 0.91]; const knoten = qs.map(q => { const [x, y] = schnur.B(q); return E(x, y, 2.8, 2.6, null, { pf: 'bevel', hz: 0.6 }); });
    const lot = [Pg([[21, 34], [31, 34], [32, 38], [26, 47], [20, 38]], null, { b: 2, rd: 0.8 })];
    return {
      gruppen: [{ p: oese, mat: 'eisen', k: 0 }, { p: schnur, mat: 'wolle', k: 0, tone: 0.1 }, { p: knoten, mat: 'wolle', k: 0, tone: 0.2 }, { p: lot, mat: 'eisen', k: 0, tone: 0.05 }],
      details(P) { for (const q of qs) { const [x, y] = schnur.B(q); P.stufe(x - 1, y + 1, -2); P.stufe(x + 1, y - 1, -1); } P.set(26, 45, 'a3'); P.set(25, 44, 'a2'); },
    };
  },
};
