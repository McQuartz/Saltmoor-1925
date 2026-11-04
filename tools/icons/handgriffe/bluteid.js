// Bluteid: zwei Hände fest ineinander gedrückt, zwischen den Handflächen tropft Blut herab. Der Schwur gilt, solange es tropft.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, armGruppen } = A;
    const h1 = hand({ x: 12, y: 13, a: 0.15, s: 1.35, seite: 1, curl: [0.2, 0.2, 0.25, 0.3], spreiz: 0.03, daumen: 0.3, arm: 12 });
    const h2 = hand({ x: 36, y: 13, a: Math.PI - 0.15, s: 1.35, seite: -1, curl: [0.2, 0.2, 0.25, 0.3], spreiz: 0.03, daumen: 0.3, arm: 12 });
    return { gruppen: [...armGruppen(h1), ...armGruppen(h2, 'wolle'), { p: h1.alle(), mat: 'haut', k: 1 }, { p: h2.alle(), mat: 'haut', k: 1, tone: 0.05 }],
      details(P) { P.line(23, 15, 24, 19, 'a2', true); for (const [x, y] of [[24, 22], [24, 26], [23, 30]]) P.tropfen(x, y); } };
  },
};
