// Die Knotenschnur: eine Lotschnur, oben zur losen Rolle gewickelt, hängt senkrecht herab, mit einem Knoten
// je Faden Tiefe (unten immer dichter), am Ende das schwere Bleilot.
'use strict';
module.exports = {
  form(A) {
    const { kurve, E, Pg, ring } = A;
    const rolle = [...ring(24, 9, 8, 5, 1.3, null, {}, 16), ...ring(24, 10, 6, 3.6, 1.2, null, {}, 14)];
    const schnur = kurve([[27, 13], [25, 22], [23, 30], [24, 36]], 0.9, 0.9, null, {}, 14);
    const knoten = []; let y = 16; for (let i = 0; i < 9; i++) { const [x, yy] = schnur.B(Math.min(1, (y - 13) / 23)); knoten.push(E(x, yy, 1.8, 1.6, null, { pf: 'bevel', hz: 0.6 })); y += 4 - i * 0.38; }
    const lot = [Pg([[21, 36], [27, 36], [29, 44], [24, 47], [19, 44]], null, { b: 2, rd: 1 })];
    return {
      gruppen: [{ p: rolle, mat: 'wolle', k: 0.6 }, { p: [...schnur, ...knoten], mat: 'wolle', k: 0 }, { p: lot, mat: 'eisen', k: 0 }],
      details(P) { P.set(24, 45, 'a3'); P.set(23, 44, 'a2'); P.set(26, 39, 'eisen3'); },
    };
  },
};
