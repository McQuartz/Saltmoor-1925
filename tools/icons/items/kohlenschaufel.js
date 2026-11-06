// Kohlenschaufel des Heizers: flache, breite Schaufel mit hochgezogenen Seitenwänden, kurzer Stiel mit Querholz,
// im Blatt liegen glühende Kohlen. Anders als die Spatenschaufel: kantig, kurz, schwer.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, apg, E } = A;
    const ax = achse(7, 9, 0.72);
    const stiel = [acap(ax, 2, 0, 24, 0, 1.9, 2.1)];
    const quer = [acap(ax, 0, -4, 0, 4, 1.6, 1.6)];
    const blatt = [apg(ax, [[22, -6.5], [44, -10], [45, 10], [22, 6.5]], null, { b: 2.6, rd: 0.5 })];
    const wand = [apg(ax, [[22, -7], [44, -10.5], [44, -8], [24, -5]], null, { b: 0.8 })];
    const kohlen = [E(...ax.P(36, -2), 3, 2.6), E(...ax.P(40, 3), 2.8, 2.4), E(...ax.P(33, 3.5), 2.4, 2.2), E(...ax.P(41, -5), 2.2, 2)];
    return {
      gruppen: [{ p: quer, mat: 'holz', k: 0 }, { p: stiel, mat: 'holz', k: 0 }, { p: blatt, mat: 'eisen', k: 0 }, { p: wand, mat: 'eisen', k: 0 }, { p: kohlen, mat: 'kohle', k: 0.5 }],
      details(P) {
        for (const [t, q] of [[35, 0], [39, 1], [34, 2], [41, -3]]) { const [x, y] = ax.P(t, q); P.set(x, y, 'flamme'); P.set(x + 1, y, 'glutMittel'); }
        const [x, y] = ax.P(37, -1); P.set(x, y, 'flammeHell');
        const [a, b] = ax.P(4, 0); P.set(a, b, 'a3');
      },
    };
  },
};
