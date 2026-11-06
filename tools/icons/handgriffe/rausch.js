// Rausch: eine Faust umklammert ein Messer, Klinge nach unten, die Adern am Unterarm treten rot hervor,
// Spritzer fliegen. Nicht mehr zählen.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, achse, apg, armGruppen } = A;
    const f = faust({ x: 22, y: 11, a: -0.3, s: 1.5, seite: -1, arm: 20 });
    const ax = achse(...f.ax.P(4.5, 1), 1.27);
    const klinge = [apg(ax, [[2, -1.6], [15, -1.1], [19, 0.8], [2, 1.6]], null, { b: 0.8 })];
    return { gruppen: [{ p: klinge, mat: 'stahl', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { const [a, b] = f.ax.P(-12, 1), [c, d] = f.ax.P(-1, 0); P.line(a, b, c, d, 'a1', true); const [e, g] = f.ax.P(-9, -1), [h, i] = f.ax.P(-3, 1.6); P.line(e, g, h, i, 'a1', true); for (const [x, y] of [[38, 6], [41, 10], [40, 2], [45, 7], [43, 14], [36, 13]]) P.set(x, y, (x + y) % 2 ? 'a2' : 'a3'); const [kx, ky] = ax.P(19, 0.8); P.set(kx, ky + 1, 'a3'); } };
  },
};
