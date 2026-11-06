// Schlüsselbund der Wärterfrau: ein eiserner Ring, daran viele lange Bartschlüssel gefächert, einer aus
// Messing, und der glüht schwach, als hätte ihn eben noch jemand in der Hand gehabt.
'use strict';
module.exports = {
  form(A) {
    const { ring, achse, apg, acap, E } = A;
    const r1 = ring(16, 14, 8, 8, 1.4, null, {}, 18);
    const keys = [], messing = [];
    const winkel = [0.55, 0.85, 1.15, 1.45, 1.75];
    winkel.forEach((w, i) => {
      const ax = achse(16 + Math.cos(w) * 8, 14 + Math.sin(w) * 8, w); const L = 22 - Math.abs(i - 2) * 2;
      const teile = [A.E(...ax.P(2.5, 0), 3, 3, null, { pf: 'bevel' }), acap(ax, 4, 0, L, 0, 1.1, 1.0), apg(ax, [[L - 5, 0], [L, 0], [L, 4], [L - 2, 4], [L - 2, 2.4], [L - 5, 2.4]], null, { b: 0.6 })];
      (i === 3 ? messing : keys).push(...teile);
    });
    return {
      gruppen: [{ p: r1, mat: 'eisen', k: 0 }, { p: keys, mat: 'eisen', k: 0 }, { p: messing, mat: 'messing', k: 0 }],
      details(P) {
        P.glow(30, 34, 6, 0.9, 'glutMittel', 'glutDim'); P.set(30, 33, 'warm');
      },
    };
  },
};
