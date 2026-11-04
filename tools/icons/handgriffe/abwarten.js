// Abwarten: zwei Hände ineinandergelegt, ruhig, die Daumen zählen. Die Finger der einen umfassen die Faust der anderen.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, faust, armGruppen } = A;
    const f = faust({ x: 15, y: 18, a: 0.15, s: 1.4, seite: 1, arm: 14 });
    const h = hand({ x: 34, y: 20, a: Math.PI - 0.15, s: 1.4, seite: 1, curl: [0.75, 0.8, 0.85, 0.9], spreiz: 0.04, daumen: 0.5, daumenWinkel: 0.6, arm: 14 });
    return { gruppen: [...armGruppen(f), ...armGruppen(h), { p: f.alle(), mat: 'haut', k: 1 }, { p: h.alle(), mat: 'haut', k: 1, tone: 0.05 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.set(24, 12, 'a3'); } };
  },
};
