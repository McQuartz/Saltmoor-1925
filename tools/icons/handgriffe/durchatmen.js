// Durchatmen: eine Hand liegt flach auf der Brust (Mantelknöpfe), darüber steigt ein Atemhauch auf.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, armGruppen } = A;
    const brust = [Pg([[4, 32], [6, 6], [18, 2], [30, 4], [36, 32]], null, { b: 2, rd: 2 })];
    const h = hand({ x: 33, y: 26, a: -2.7, s: 1.4, seite: -1, curl: [0.1, 0.05, 0.1, 0.15], spreiz: 0.06, daumen: 0.3, arm: 14 });
    return { gruppen: [{ p: brust, mat: 'stoff', k: 0 }, ...armGruppen(h, 'wolle'), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (const y of [10, 19, 28]) P.set(14, y, 'holz3'); P.ritz(16, 4, 15, 31, -1); P.rauch(30, 3, 4, 'stoff3', 0.4); P.rauch(37, 2, 3, 'stoff2', 0.3); } };
  },
};
