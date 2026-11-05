// Wärmflasche: die klassische Bettflasche, flach und rechteckig mit runden Schultern, kurzem Hals und großem
// Schraubstopfen, aus Kupfer, die untere Hälfte steckt in einem karierten Flanellbezug. Sie ist warm, und keiner hat sie gefüllt.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap } = A;
    const ax = achse(24, 26, -0.18);
    const flasche = [apg(ax, [[-13, -10], [-10, -15], [-5, -16], [5, -16], [10, -15], [13, -10], [13, 19], [-13, 19]], null, { b: 2.6, rd: 1.5 })];
    const hals = [acap(ax, 0, -16, 0, -19.5, 3.2, 3.2)];
    const stopfen = [apg(ax, [[-4.5, -24], [4.5, -24], [4.5, -19.5], [-4.5, -19.5]], null, { b: 1, rd: 0.6 })];
    const bezug = [apg(ax, [[-14, 3], [14, 3], [14, 20], [-14, 20]], null, { b: 1.4, rd: 1.2 })];
    return {
      gruppen: [{ p: flasche, mat: 'kupfer', k: 0 }, { p: hals, mat: 'kupfer', k: 0 }, { p: stopfen, mat: 'messing', k: 0 }, { p: bezug, mat: 'rotstoff', k: 0, tone: 0.05 }],
      details(P) {
        for (let q = -9; q < 2; q += 3) { const [a, b] = ax.P(-10, q), [c, d] = ax.P(10, q); P.ritz(a, b, c, d, -1); }
        for (const t of [-8, -2, 4, 10]) { const [a, b] = ax.P(t, 4), [c, d] = ax.P(t, 19); P.line(a, b, c, d, 'rotstoff1', true); }
        for (const q of [8, 14]) { const [a, b] = ax.P(-13, q), [c, d] = ax.P(13, q); P.line(a, b, c, d, 'rotstoff1', true); }
        const [a, b] = ax.P(-14, 3), [c, d] = ax.P(14, 3); P.line(a, b, c, d, 'wolle3', true);
        const [gx, gy] = ax.P(0, -4); P.glow(gx, gy, 9, 0.7, 'a1'); for (const q of [-23, -21]) { const [x0, y0] = ax.P(-3.5, q), [x1, y1] = ax.P(3.5, q); P.ritz(x0, y0, x1, y1, -2); }
      },
    };
  },
};
