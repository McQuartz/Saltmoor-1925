// Bannspruch: eine Hand ist zum Schwur erhoben, die Fläche nach vorn; um sie herum ein schwaches goldenes Flirren.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, armGruppen } = A;
    const h = hand({ x: 24, y: 31, a: -1.57, s: 1.45, seite: 1, curl: [0, 0, 0, 0.05], spreiz: 0.06, daumen: 0.15, arm: 6 });
    return { gruppen: [...armGruppen(h, 'tuch'), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (let a = -2.8; a < -0.3; a += 0.18) { const r = 15 + Math.sin(a * 7) * 1.2; P.set(24 + Math.cos(a) * r, 18 + Math.sin(a) * r * 0.95, Math.round(a * 10) % 3 ? 'a1' : 'a2'); } P.set(24, 2, 'a3'); P.set(9, 13, 'a3'); P.set(39, 13, 'a3'); } };
  },
};
