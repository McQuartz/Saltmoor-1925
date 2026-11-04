// Fortsetzen: eine Hand gibt einem Pendel den Schwung weiter; das Pendel schwingt, man sieht seine letzten Lagen.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, C, E, armGruppen } = A;
    const g = []; [[-0.55, -0.35], [-0.25, -0.2], [0.1, 0]].forEach(([a, t], i) => { const x = 24 + Math.sin(a) * 22, y = 2 + Math.cos(a) * 22; g.push({ p: [C(24, 2, x, y, 0.7, 0.7), E(x, y, 3.4, 3.4, null, { pf: 'bevel', hz: 0.5 })], mat: 'messing', k: 0, tone: t, ohneRand: i < 2 }); });
    const h = hand({ x: 46, y: 26, a: -2.9, s: 1.25, seite: -1, curl: [0.05, 0.05, 0.1, 0.15], spreiz: 0.05, daumen: 0.2, arm: 6 });
    return { gruppen: [...g, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }], details(P) { P.set(24, 2, 'a3'); P.set(26, 24, 'a3'); } };
  },
};
