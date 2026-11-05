// Spucken: eine große Hand hält ein zerknülltes Taschentuch, darin ein grüner Fleck vom bitteren Speichel
// nach einem Tag im Torf; ein Tropfen hängt noch.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, Pg, armGruppen } = A;
    const tuch = [Pg([[16, 10], [30, 3], [44, 8], [40, 18], [46, 30], [34, 25], [22, 28], [18, 20]], null, { b: 1.8, rd: 0.5 })];
    const f = faust({ x: 4, y: 28, a: -0.55, s: 1.6, seite: -1, arm: 6 });
    return { gruppen: [{ p: tuch, mat: 'papier', k: 0, tone: 0.12 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { for (const [a, b, c, d] of [[22, 8, 28, 24], [31, 5, 34, 25], [19, 16, 42, 13]]) P.ritz(a, b, c, d, -1); P.el(31, 14, 4, 3, 'akzent2', true); P.el(31, 14, 2, 1.5, 'a3', true); P.tropfen(45, 31); for (let x = 18; x < 44; x += 3) P.set(x, 7 - (x - 18) * 0.1, 'papierR2'); } };
  },
};
