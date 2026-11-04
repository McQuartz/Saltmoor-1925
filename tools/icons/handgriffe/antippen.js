// Antippen: Zeige- und Mittelfinger berühren ganz sanft eine Schläfe im Profil, genau im richtigen Augenblick.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, armGruppen } = A;
    const kopf = [Pg([[30, 0], [44, 0], [48, 8], [48, 32], [34, 32], [32, 22], [29, 16], [28, 8]], null, { b: 2.5, rd: 3 })];
    const h = hand({ x: 6, y: 22, a: -0.3, s: 1.35, seite: 1, curl: [0, 0, 0.95, 1], spreiz: 0.03, daumen: 0.6, arm: 10 });
    return { gruppen: [{ p: kopf, mat: 'haut', k: 0, tone: -0.15 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { P.set(30, 13, 'a3'); P.set(29, 12, 'a2'); P.ritz(33, 6, 38, 5, -2); } };
  },
};
