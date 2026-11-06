// Kurze Stöße: eine Pistole in der Faust, drei kleine Mündungsblitze hintereinander, wie beim Nebelsignal.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, achse, apg, armGruppen } = A;
    const f = faust({ x: 10, y: 20, a: -0.15, s: 1.25, seite: -1, arm: 10 });
    const ax = achse(...f.ax.P(3, -3), -0.15);
    const pistole = [apg(ax, [[0, -2.6], [16, -2.6], [16, 0.8], [0, 1.2]], null, { b: 1 })];
    return { gruppen: [{ p: pistole, mat: 'eisen', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { const [x, y] = ax.P(18, -1); P.blitz(x + 2, y, 3, -0.15); P.blitz(x + 10, y - 2, 2.4, -0.15); P.blitz(x + 17, y - 3, 2, -0.15); } };
  },
};
