// Flasche: hohe, leere Schnapsflasche mit langem Hals, verblasstes Etikett einer abgebrannten Brennerei,
// etwas schräg gestellt. Nur ein Rest am Boden.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg } = A;
    const ax = achse(22, 45, -1.42);
    const glas = [apg(ax, [[0, -7.5], [22, -7.5], [27, -3], [38, -2.4], [42, -2.8], [43, -2.8], [43, 2.8], [42, 2.8], [38, 2.4], [27, 3], [22, 7.5], [0, 7.5]], null, { b: 2.2, rd: 1 })];
    const etikett = [apg(ax, [[6, -7.8], [17, -7.8], [17, 7.8], [6, 7.8]], null, { b: 0.8 })];
    const rest = [apg(ax, [[1, -6.5], [4, -6.5], [4, 6.5], [1, 6.5]], null, { b: 0.6 })];
    return {
      gruppen: [{ p: glas, mat: 'glas', k: 0 }, { p: rest, mat: 'akzent', k: 0, ohneRand: true }, { p: etikett, mat: 'papier', k: 0, tone: -0.1 }],
      details(P) {
        // Glanzstreifen im Glas und Brandfleck auf dem Etikett
        for (let t = 20; t < 36; t++) { const [x, y] = ax.P(t, t < 26 ? -4.5 + (t - 20) * 0.3 : -1.2); P.auf(x, y, 'glas3'); }
        for (const [t, q] of [[11, 2], [12, 3], [11, 3], [10, 4], [12, 1]]) { const [x, y] = ax.P(t, q); P.auf(x, y, 'kohle1'); }
        const [a, b] = ax.P(9, -5), [c, d] = ax.P(9, 3); P.ritz(a, b, c, d, -1);
      },
    };
  },
};
