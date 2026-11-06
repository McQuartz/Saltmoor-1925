// Wache halten: zwei Hände schirmen eine Kerze ab, der Schein fällt auf die Handflächen.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, C, armGruppen } = A;
    const kerze = [C(24, 28, 24, 15, 2.4, 2.2)];
    const h1 = hand({ x: 9, y: 30, a: -1.05, s: 1.3, seite: 1, curl: [0.12, 0.12, 0.15, 0.2], spreiz: 0.04, daumen: 0.3, arm: 8 });
    const h2 = hand({ x: 39, y: 30, a: -2.09, s: 1.3, seite: -1, curl: [0.12, 0.12, 0.15, 0.2], spreiz: 0.04, daumen: 0.3, arm: 8 });
    return { gruppen: [{ p: kerze, mat: 'wachs', k: 0, tone: 0.2 }, ...armGruppen(h1), ...armGruppen(h2), { p: h1.alle(), mat: 'haut', k: 1 }, { p: h2.alle(), mat: 'haut', k: 1 }],
      details(P) { P.flamme(24, 14, 6, 1.6, 0); P.glow(24, 12, 12, 0.6, 'warmDim'); } };
  },
};
