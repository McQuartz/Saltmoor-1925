// Nachsetzen: eine große Faust mit einem Schlagring aus Messing schlägt nach rechts nach, solange der andere noch schwankt.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, apg, armGruppen } = A;
    const f = faust({ x: 22, y: 16, a: -0.12, s: 1.85, seite: -1, arm: 22 });
    const ring = [apg(f.ax, [[9.2, -5], [11.6, -5], [11.6, 5], [9.2, 5]], null, { b: 0.8, rd: 0.8 })];
    return { gruppen: [...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }, { p: ring, mat: 'messing', k: 0, tone: 0.15 }],
      details(P) { for (const q of [-3.4, -1.2, 1, 3.2]) { const [x, y] = f.ax.P(11.8, q); P.set(x, y, 'messing3'); } P.rauch(45, 12, 2.5, 'stoff2', 0.4); P.rauch(45, 21, 2, 'stoff1', 0.35); } };
  },
};
