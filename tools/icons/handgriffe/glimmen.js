// Glimmen: eine offene, hohle Hand trägt ein Stück Glut im Handteller. Dass es nicht weh tut, ist das Falsche.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, E, armGruppen } = A;
    const h = hand({ x: 10, y: 24, a: -0.12, s: 1.5, seite: -1, curl: [0.12, 0.16, 0.2, 0.25], spreiz: 0.05, daumen: 0.1, daumenWinkel: 0.8, arm: 12 });
    const kohle = [E(19, 19, 3.4, 2.6, null, { pf: 'bevel', hz: 0.6 })];
    return { gruppen: [...armGruppen(h, 'wolle'), { p: h.alle(), mat: 'haut', k: 1 }, { p: kohle, mat: 'kohle', k: 0 }],
      details(P) { P.glow(19, 19, 6, 1.3, 'glutMittel', 'glutDim'); P.set(19, 19, 'flamme'); P.set(20, 18, 'flammeHell'); P.rauch(21, 10, 3, 'stoff1', 0.3); } };
  },
};
