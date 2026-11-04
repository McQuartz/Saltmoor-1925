// Brandmal: die Faust drückt ein glühendes Brandeisen kurz auf ein Brett; die Form raucht schon.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, C, Pg, ring, armGruppen } = A;
    const brett = [Pg([[0, 25], [48, 22], [48, 32], [0, 32]], null, { b: 1.4 })];
    const stiel = [C(18, 6, 28, 18, 1.1, 1.1)];
    const zeichen = ring(30, 21, 3.4, 1.6, 0.9, null, {}, 10);
    const f = faust({ x: 9, y: 0, a: 0.85, s: 1.3, seite: 1, arm: 6 });
    return { gruppen: [{ p: brett, mat: 'holz', k: 0 }, { p: stiel, mat: 'eisen', k: 0 }, { p: zeichen, mat: 'eisen', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { for (let a = 0; a < 6.3; a += 0.4) P.set(30 + Math.cos(a) * 3.4, 21 + Math.sin(a) * 1.6, a > 3 ? 'flamme' : 'glutMittel'); P.glow(30, 23, 6, 0.9, 'glutDim'); P.rauch(36, 14, 4, 'stoff2', 0.45); P.rauch(40, 9, 3, 'stoff1', 0.3); } };
  },
};
