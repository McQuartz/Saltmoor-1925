// Glut in der Faust: die Faust ist um eine Kohle geschlossen, das Licht dringt zwischen den Fingern heraus.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, armGruppen } = A;
    const f = faust({ x: 18, y: 18, a: -0.5, s: 1.7, seite: -1, arm: 16 });
    return { gruppen: [...armGruppen(f, 'wolle'), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) {
        const ax = f.ax; for (let i = 0; i < 3; i++) { const q = -(1.6 - i * 1.1 - 0.55) * 1.7 * 1.05; for (let t = 6; t < 13; t++) { const [x, y] = ax.P(t, q); if (P.get(x, y)) P.set(x, y, t > 10 ? 'flammeHell' : 'flamme'); } }
        const [gx, gy] = ax.P(9, 0); P.glow(gx, gy, 9, 0.9, 'glutMittel', 'glutDim'); const [sx, sy] = ax.P(14.5, 0); P.set(sx, sy, 'glutMittel');
      } };
  },
};
