// Wärmflasche: ovale Kupfer-Bettflasche schräg gelegt, oben der Schraubverschluss mit Ring,
// die untere Hälfte steckt in einem Flanellbezug mit Zugband. Sie ist warm, und keiner hat sie gefüllt.
'use strict';
module.exports = {
  form(A) {
    const { E, achse, acap, apg } = A;
    const ax = achse(24, 26, -0.6);
    const flasche = [E(24, 26, 19, 12, null, { pf: 'bevel', hz: 0.3 })];
    const bezug = [apg(ax, [[-20, -13], [2, -14], [3, 14], [-20, 13]], null, { b: 1.4, rd: 2 })];
    const hals = [acap(ax, 17, 0, 23, 0, 3, 3)];
    const deckel = [acap(ax, 22.5, 0, 25, 0, 4.2, 4.2)];
    const zug = [acap(ax, 2, -13, 2, 13, 1, 1), acap(ax, 3, 6, 9, 14, 0.7, 0.6)];
    return {
      gruppen: [{ p: flasche, mat: 'kupfer', k: 0 }, { p: hals, mat: 'kupfer', k: 0 }, { p: deckel, mat: 'messing', k: 0 }, { p: bezug, mat: 'wolle', k: 0, tone: 0.04 }, { p: zug, mat: 'leder', k: 0 }],
      details(P) {
        for (let t = 6; t < 16; t += 3) { const [a, b] = ax.P(t, -9), [c, d] = ax.P(t, 9); P.ritz(a, b, c, d, -1); }
        for (let t = -18; t < 0; t += 4) { const [a, b] = ax.P(t, -12), [c, d] = ax.P(t, 12); P.ritz(a, b, c, d, -1); }
        for (const q of [-6, 0, 6]) { const [a, b] = ax.P(-19, q), [c, d] = ax.P(1, q); P.ritz(a, b, c, d, -1); }
        const [gx, gy] = ax.P(-6, 2); P.glow(gx, gy, 9, 0.75, 'a1');
      },
    };
  },
};
