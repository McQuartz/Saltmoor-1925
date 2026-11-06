// Bootshaken: lange Stange von unten links, oben ein Eisenkopf mit Dorn und rückwärts gebogenem Haken.
// Am Haken hängt ein Fetzen Tang.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, apg, kurve } = A;
    const ax = achse(4, 46, -0.79);
    const stange = [acap(ax, 0, 0, 44, 0, 1.6, 1.6)];
    const tuelle = [acap(ax, 40, 0, 46, 0, 2.3, 2)];
    const dorn = [apg(ax, [[45, -1.4], [56, 0], [45, 1.4]], null, { b: 0.8 })];
    const [hx, hy] = ax.P(48, 0);
    const haken = kurve([ax.P(47, 0), ax.P(48, -6), ax.P(43, -9), ax.P(40, -6.5)], 1.5, 1, null, {}, 10);
    const tang = kurve([ax.P(41, -6.5), [hx - 9, hy + 1], [hx - 7, hy + 8], [hx - 11, hy + 13]], 1.4, 0.6, null, {}, 10);
    return {
      gruppen: [{ p: stange, mat: 'holz', k: 0 }, { p: tang, mat: 'gruenstoff', k: 0, ohneR2: true }, { p: [...tuelle, ...dorn], mat: 'eisen', k: 0.6 }, { p: haken, mat: 'eisen', k: 0 }],
      details(P) { for (const t of [8, 9.5, 11]) { const [x, y] = ax.P(t, 0); P.stufe(x, y, -2); P.stufe(x + 1, y, -2); } const [x, y] = tang.B(0.95); P.set(x, y + 1, 'a3'); },
    };
  },
};
