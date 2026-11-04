// Federkiel: lange Gänsefeder schräg, Fahne mit einzelnen Strähnen, unten die schräg geschnittene Spitze,
// von der ein Tropfen Tinte fällt.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, apg } = A;
    const ax = achse(8, 43, -0.92);
    const kiel = [acap(ax, 0, 0, 44, 0, 0.9, 0.6)];
    const fahne = [apg(ax, [[11, 0], [16, -4.5], [30, -7], [42, -4], [47, 0], [40, 3.5], [28, 5], [16, 3.2]], null, { b: 1.8, rd: 0.6 })];
    return {
      gruppen: [{ p: fahne, mat: 'knochen', k: 0, tone: -0.1 }, { p: kiel, mat: 'knochen', k: 0 }],
      details(P) {
        for (let t = 14; t < 44; t += 3) { const [a, b] = ax.P(t, 0), [c, d] = ax.P(t + 3, t < 30 ? -6 : -4); P.ritz(a, b, c, d, -1); const [e, f] = ax.P(t + 2.5, t < 30 ? 4 : 2.5); P.ritz(a, b, e, f, -1); }
        // Kerben in der Fahne
        for (const [t, q] of [[22, -6.2], [34, 4.6], [36, -5.6]]) { const [x, y] = ax.P(t, q); P.loesch(x, y); }
        const [sx, sy] = ax.P(-0.5, 0); P.set(sx, sy, 'kohle0'); P.set(sx - 1, sy + 2, 'a2'); P.set(sx - 1, sy + 3, 'a3');
      },
    };
  },
};
