// Die Knotenschnur: eine Lotschnur, die in einer großen Schlaufe von links oben herabfällt, mit einem dicken Knoten
// je Faden Tiefe (unten immer dichter), am Ende das schwere, kegelige Bleilot. Unten mehr Knoten, als die Schnur lang ist.
'use strict';
module.exports = {
  form(A) {
    const { kurve, E, Pg } = A;
    const schnur = kurve([[6, 4], [18, 2], [26, 12], [14, 20], [20, 28], [30, 30], [34, 34]], 1, 1, null, { cr: true }, 40);
    const knoten = []; const qs = [0.12, 0.26, 0.38, 0.49, 0.58, 0.66, 0.73, 0.79, 0.84, 0.88, 0.92]; for (const q of qs) { const [x, y] = schnur.B(q); knoten.push(E(x, y, 2, 2, null, { pf: 'bevel', hz: 0.6 })); }
    const lot = [Pg([[31, 33], [38, 32], [44, 42], [40, 46], [33, 44]], null, { b: 2, rd: 1 })];
    return {
      gruppen: [{ p: [...schnur, ...knoten], mat: 'wolle', k: 0.4 }, { p: lot, mat: 'eisen', k: 0 }],
      details(P) { P.set(40, 44, 'a3'); P.set(39, 43, 'a2'); P.set(36, 35, 'eisen3'); },
    };
  },
};
