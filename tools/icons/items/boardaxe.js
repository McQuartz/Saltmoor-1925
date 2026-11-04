// Enterbeil: kurzes Beil mit breitem, nach unten gezogenem Blatt und einem Dorn auf der Rückseite,
// Stiel aus Eiche mit Lederband. Liegt schräg, Blatt oben rechts.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, apg } = A;
    const ax = achse(8, 44, -0.92);
    const stiel = [acap(ax, 0, 0, 40, 0, 2.0, 2.0)];
    const kopf = [apg(ax, [[33, -2.5], [41, -3], [41, 3], [33, 2.5]], null, { b: 1 })];
    const blatt = [apg(ax, [[34, 2], [41, 2.5], [45, 7], [47, 14], [41, 15], [36, 11], [34, 6]], null, { b: 1.8, rd: 0.4 })];
    const dorn = [apg(ax, [[35, -2], [40, -2], [38, -11]], null, { b: 0.8 })];
    return {
      gruppen: [{ p: stiel, mat: 'holz', k: 0 }, { p: [...kopf, ...dorn], mat: 'eisen', k: 0.5 }, { p: blatt, mat: 'eisen', k: 0 }],
      details(P) {
        for (let t = 3; t < 11; t += 1.5) { const [x, y] = ax.P(t, 0); P.ritz(x - 1, y - 1, x + 1, y + 1, -1); }
        for (let k = 0; k < 9; k++) { const [x, y] = ax.P(46 - k * 0.6, 7 + k); P.stufe(x, y, +1); }
        const [a, b] = ax.P(43, 12); P.set(a, b, 'a3'); P.set(a - 1, b + 1, 'a2');
      },
    };
  },
};
