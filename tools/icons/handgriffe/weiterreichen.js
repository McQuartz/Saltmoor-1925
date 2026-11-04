// Weiterreichen: eine Hand gibt ein kleines Kästchen weiter an eine zweite, die schon danach greift.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, armGruppen } = A;
    const h1 = hand({ x: 5, y: 24, a: -0.15, s: 1.3, seite: -1, curl: [0.15, 0.2, 0.25, 0.3], spreiz: 0.05, daumen: 0.2, daumenWinkel: 0.9, arm: 8 });
    const h2 = hand({ x: 44, y: 12, a: Math.PI - 0.3, s: 1.3, seite: 1, curl: [0.3, 0.35, 0.4, 0.45], spreiz: 0.12, daumen: 0.3, arm: 8 });
    const kiste = [Pg([[18, 14], [27, 12], [29, 20], [19, 22]], null, { b: 1.2, rd: 0.4 })];
    return { gruppen: [...armGruppen(h1), { p: h1.alle(), mat: 'haut', k: 1 }, { p: kiste, mat: 'holz', k: 0 }, ...armGruppen(h2, 'wolle'), { p: h2.alle(), mat: 'haut', k: 1, tone: 0.05 }],
      details(P) { P.ritz(19, 17, 28, 15, -1); P.set(23, 16, 'messing3'); } };
  },
};
