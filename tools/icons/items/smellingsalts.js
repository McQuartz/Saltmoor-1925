// Riechsalz: winziges geschliffenes Fläschchen mit Silberkappe an einer Kette, schräg geneigt,
// aus dem offenen Hals steigt ein dünner Faden Dampf in Schleifen.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, kurve, kettenglieder } = A;
    const ax = achse(18, 42, -1.05);
    const glas = [apg(ax, [[0, -5], [14, -5.5], [18, -2.5], [18, 2.5], [14, 5.5], [0, 5]], null, { b: 2, rd: 1 })];
    const kappe = [acap(ax, 17, 0, 22, 0, 3, 2.6)];
    const kette = kettenglieder([ax.P(1, 0), [10, 44], [4, 40], [5, 32]], 5, 1.4, null);
    const [dx, dy] = ax.P(24, 0);
    const dampf = kurve([[dx, dy], [dx + 6, dy - 4], [dx + 1, dy - 9], [dx + 7, dy - 14], [dx + 3, dy - 20]], 0.9, 0.5, null, { cr: true }, 18);
    return {
      gruppen: [{ p: [...kette.flach, ...kette.kant], mat: 'silber', k: 0 }, { p: dampf, mat: 'akzent', k: 0, ohneR2: true, tone: 0.2 }, { p: glas, mat: 'glas', k: 0 }, { p: kappe, mat: 'silber', k: 0 }],
      details(P) {
        for (let t = 2; t < 16; t += 3) { const [a, b] = ax.P(t, -4.5), [c, d] = ax.P(t + 2, 4.5); P.ritz(a, b, c, d, +1); }
        for (const [t, q] of [[4, -2], [7, 1], [10, -1], [6, 3]]) { const [x, y] = ax.P(t, q); P.set(x, y, 'a3'); }
      },
    };
  },
};
