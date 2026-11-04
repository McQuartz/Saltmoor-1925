// Glimmen: eine offene, hohle Hand trägt ein Stück Glut im Handteller. Dass es nicht weh tut, ist das Falsche.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, E, armGruppen } = A;
    const h = hand({ x: 12, y: 24, a: -0.2, s: 1.55, seite: -1, curl: [0.35, 0.4, 0.45, 0.5], spreiz: 0.08, daumen: 0.15, daumenWinkel: 1.2, arm: 14 });
    const kohle = [E(22, 19, 3.4, 2.6, null, { pf: 'bevel', hz: 0.6 })];
    return { gruppen: [...armGruppen(h, 'wolle'), { p: h.alle(), mat: 'haut', k: 1 }, { p: kohle, mat: 'kohle', k: 0 }],
      details(P) { P.glow(22, 19, 6, 1.3, 'glutMittel', 'glutDim'); P.set(22, 19, 'flamme'); P.set(23, 18, 'flammeHell'); P.rauch(24, 10, 3, 'stoff1', 0.3); } };
  },
};
