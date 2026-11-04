// Fackel: Holzstiel leicht schräg, oben ein Kopf aus Werg und Lappen, mit Draht umwickelt, die Flamme darüber.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, apg } = A;
    const ax = achse(19, 46, -1.32);
    const stiel = [acap(ax, 0, 0, 26, 0, 1.8, 2.2)];
    const kopf = [apg(ax, [[22, -3.5], [33, -4.4], [35, 0], [33, 4.6], [22, 3.6]], null, { b: 1.8, rd: 1.2 })];
    const lappen = [apg(ax, [[24, 3], [29, 4.5], [27, 8], [25.5, 6.5]], null, { b: 0.8 })];
    return {
      gruppen: [{ p: stiel, mat: 'holz', k: 0 }, { p: kopf, mat: 'wolle', k: 0 }, { p: lappen, mat: 'stoff', k: 0 }],
      details(P) {
        for (const t of [24, 28, 31.5]) { const [a, b] = ax.P(t, -4.2), [c, d] = ax.P(t + 1, 4.2); P.line(a, b, c, d, 'eisen3', true); }
        const [fx, fy] = ax.P(33, 0); P.glow(fx, fy + 1, 7, 1.0, 'glutMittel', 'glutDim'); P.flamme(fx + 1, fy + 1, 14, 4.2, 0.6);
      },
    };
  },
};
