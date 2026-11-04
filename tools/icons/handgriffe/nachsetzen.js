// Nachsetzen: eine Faust vorn, die zweite Faust schon hinterher, versetzt dahinter.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, armGruppen } = A;
    const f1 = faust({ x: 30, y: 13, a: -0.15, s: 1.35, seite: -1, arm: 18 });
    const f2 = faust({ x: 18, y: 22, a: -0.05, s: 1.35, seite: -1, arm: 16 });
    return { gruppen: [...armGruppen(f1), { p: f1.alle(), mat: 'haut', k: 1 }, { p: f1.daumen, mat: 'haut', k: 0 }, ...armGruppen(f2, 'wolle'), { p: f2.alle(), mat: 'haut', k: 1, tone: 0.05 }, { p: f2.daumen, mat: 'haut', k: 0 }] };
  },
};
