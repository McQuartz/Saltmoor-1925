// Glut in der Faust: eine große Faust ist um eine Kohle geschlossen; zwischen den Fingern dringt das Licht heraus,
// die Knöchel glühen von innen, Rauch steigt auf. Wer lässt zuerst los?
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, armGruppen } = A;
    const f = faust({ x: 16, y: 20, a: -0.45, s: 1.9, seite: -1, arm: 16 });
    return { gruppen: [...armGruppen(f, 'wolle'), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) {
        const ax = f.ax; const s = 1.9; for (let i = 0; i < 3; i++) { const q = -(1.65 - i * 1.1 - 0.55) * s; for (let t = 5; t < 16; t++) { const [x, y] = ax.P(t, q); if (P.get(x, y)) P.set(x, y, t > 13 ? 'flammeKern' : t > 9 ? 'flammeHell' : 'flamme'); } }
        const [gx, gy] = ax.P(12, 0); P.glow(gx, gy, 10, 0.9, 'glutMittel', 'glutDim');
        const [sx, sy] = ax.P(17, 0); P.set(sx, sy, 'flammeHell'); P.rauch(sx + 6, sy - 8, 4, 'stoff2', 0.45); P.rauch(sx + 10, sy - 14, 3, 'stoff1', 0.35);
      } };
  },
};
