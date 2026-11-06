// Wunde Hand: eine Faust mit blutdurchtränkter Binde schlägt zu; sie spürt nichts mehr, nur die Richtung.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, armGruppen } = A;
    const f = faust({ x: 24, y: 17, a: -0.2, s: 1.6, seite: -1, arm: 20 });
    return { gruppen: [...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { const ax = f.ax; for (let t = 0; t < 7; t += 1) for (let q = -4; q <= 4; q++) { const [x, y] = ax.P(t * 1.6, q * 1.3); if (P.info(x, y) && (t + q) % 3 !== 0) P.set(x, y, (t * 3 + q) % 4 ? 'papier2' : 'akzent2'); } const [x, y] = ax.P(4, 0); P.set(x, y, 'a3'); P.set(x + 1, y, 'a2'); P.rauch(42, 10, 3, 'stoff1', 0.3); } };
  },
};
