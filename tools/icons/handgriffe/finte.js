// Finte: eine Hand zeigt mit gestrecktem Zeigefinger nach links, die andere Faust wartet tief rechts.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, faust, armGruppen } = A;
    const h = hand({ x: 26, y: 10, a: Math.PI + 0.1, s: 1.4, seite: 1, curl: [0, 0.95, 0.95, 0.9], spreiz: 0.05, daumen: 0.6, arm: 18 });
    const f = faust({ x: 34, y: 26, a: -0.6, s: 1.3, seite: -1, arm: 12 });
    return { gruppen: [...armGruppen(f, 'wolle'), { p: f.alle(), mat: 'haut', k: 1, tone: -0.08 }, { p: f.daumen, mat: 'haut', k: 0 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }] };
  },
};
