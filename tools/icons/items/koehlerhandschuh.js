// Köhlerhandschuh: ein dicker, rußgeschwärzter Fäustling mit abgesetztem Daumen und langer, weiter Stulpe,
// schräg liegend; an den Fingerkuppen glimmt noch ein Rest Kohle. Kein Fingerhandschuh wie die Arbeitshandschuhe.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, E } = A;
    const ax = achse(8, 40, -0.7);
    const stulpe = [apg(ax, [[0, -10], [14, -8], [14, 8], [0, 10]], null, { b: 1.6, rd: 1 })];
    const faeustling = [apg(ax, [[13, -7], [26, -8], [33, -5], [36, 0], [33, 5], [26, 7], [13, 7]], null, { b: 3, rd: 1.5 })];
    const daumen = [acap(ax, 17, -7, 25, -12, 2.8, 2.3)];
    void E;
    return {
      gruppen: [{ p: stulpe, mat: 'leder', k: 0, tone: 0.06 }, { p: daumen, mat: 'leder', k: 0, tone: -0.06 }, { p: faeustling, mat: 'leder', k: 0, tone: -0.08 }],
      details(P) {
        for (const q of [-9, -4, 1, 6]) { const [a, b] = ax.P(1, q), [c, d] = ax.P(13, q * 0.8); P.ritz(a, b, c, d, -1); }
        const [a, b] = ax.P(14, -7), [c, d] = ax.P(14, 7); P.ritz(a, b, c, d, -2);
        for (const [t, q] of [[28, -2], [30, 2], [24, 0], [20, 4], [32, -1]]) { const [x, y] = ax.P(t, q); P.set(x, y, 'kohle0'); P.set(x + 1, y, 'kohle1'); }
        const [gx, gy] = ax.P(35, 0); P.glow(gx, gy, 4, 1.2, 'glutMittel', 'glutDim'); P.set(gx, gy, 'flamme');
      },
    };
  },
};
