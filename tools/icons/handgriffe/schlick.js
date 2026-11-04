// Schlick werfen: eine Hand schleudert eine Handvoll Grund, die Klumpen fliegen nach rechts auseinander.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, E, armGruppen } = A;
    const h = hand({ x: 12, y: 24, a: -0.5, s: 1.35, seite: -1, curl: [0.15, 0.1, 0.15, 0.2], spreiz: 0.2, daumen: 0.2, arm: 12 });
    const klumpen = [E(30, 12, 2.6, 2.2), E(36, 8, 2, 1.8), E(38, 15, 1.8, 1.6), E(43, 10, 1.4, 1.2), E(33, 18, 1.4, 1.3)];
    return { gruppen: [...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }, { p: klumpen, mat: 'torf', k: 0 }],
      details(P) { for (const [x, y] of [[30, 11], [36, 8], [43, 10]]) P.set(x, y, 'a2'); for (const [x, y] of [[26, 14], [41, 5], [46, 13]]) P.set(x, y, 'torf2'); P.auf(20, 18, 'torf1'); P.auf(21, 17, 'torf1'); } };
  },
};
