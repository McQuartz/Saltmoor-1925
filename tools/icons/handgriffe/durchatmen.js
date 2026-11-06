// Durchatmen: eine große, offene Hand liegt flach auf der Brust, auf der Knopfleiste der Weste; darüber steigt
// ein heller Atemhauch in zwei Wölkchen auf. Die Luft schmeckt nach nichts, auch nicht nach Luft.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, E, armGruppen } = A;
    const weste = [Pg([[14, 32], [16, 14], [24, 10], [32, 14], [34, 32]], null, { b: 1.6, rd: 1 })];
    const hauch = [E(30, 6, 4, 2.6), E(37, 4, 3.4, 2.2)];
    const h = hand({ x: 46, y: 28, a: -2.75, s: 1.7, seite: -1, curl: [0.05, 0.05, 0.08, 0.12], spreiz: 0.04, daumen: 0.25, arm: 6 });
    return { gruppen: [{ p: weste, mat: 'stoff', k: 0, tone: 0.05 }, { p: hauch, mat: 'papier', k: 2, tone: 0.1, ohneR2: true }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (const y of [17, 23, 29]) P.set(21, y, 'messing3'); P.ritz(23, 11, 22, 31, -1); P.rauch(23, 8, 3, 'papier2', 0.35); } };
  },
};
