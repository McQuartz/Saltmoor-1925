// Fischmesser des Akkords: langes, sehr dünnes Filetiermesser, die Schneide von tausend Schnitten
// hohl geschliffen (sichelförmig), Holzgriff mit Blechmarke und Nummer.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg } = A;
    const ax = achse(5, 43, -0.68);
    const griff = [apg(ax, [[0, -2.4], [13, -2.6], [14, 2.6], [0, 2.2], [-1, 0]], null, { b: 1.6, rd: 0.8 })];
    const marke = [apg(ax, [[4, -3.4], [8, -3.4], [8, -1], [4, -1]], null, { b: 0.6 })];
    const klinge = [apg(ax, [[14, -1.8], [44, -1.4], [53, 0.4], [44, 0.4], [32, 0.6], [22, 1.4], [14, 2]], null, { b: 0.9 })];
    return {
      gruppen: [{ p: griff, mat: 'holz', k: 0 }, { p: klinge, mat: 'stahl', k: 0 }, { p: marke, mat: 'messing', k: 0 }],
      details(P) {
        for (const t of [3, 9.5]) { const [x, y] = ax.P(t, 0.8); P.set(x, y, 'eisen3'); }
        const [x, y] = ax.P(6, -2.3); P.set(x, y, 'messing0');
        for (let t = 16; t < 44; t += 1) { const [a, b] = ax.P(t, -1.2); P.stufe(a, b, +1); }
      },
    };
  },
};
