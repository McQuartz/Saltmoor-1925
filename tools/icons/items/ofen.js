// Der Ofen unter der Fabrik: eine gusseiserne Ofentür, klein wie eine Hand, mit Zierrahmen, Riegel und
// Luftschlitzen. Hinter den Schlitzen brennt es, obwohl kein Ofen daran hängt. Leicht schräg.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, E } = A;
    const ax = achse(24, 25, -0.12);
    const tuer = [apg(ax, [[-15, -14], [15, -14], [16, 14], [-16, 14]], null, { b: 2.6, rd: 1.2 })];
    const rahmen = [apg(ax, [[-11, -10], [11, -10], [11.5, 9], [-11.5, 9]], null, { b: 1.6, rd: 0.6 })];
    const riegel = [acap(ax, 12, -3, 21, -3, 1.6, 1.6), E(...ax.P(21, -3), 2.6, 2.6, null, { pf: 'bevel', hz: 0.5 })];
    const scharnier = [acap(ax, -17, -9, -17, -5, 1.6, 1.6), acap(ax, -17, 5, -17, 9, 1.6, 1.6)];
    return {
      gruppen: [{ p: scharnier, mat: 'eisen', k: 0 }, { p: tuer, mat: 'eisen', k: 0 }, { p: rahmen, mat: 'eisen', k: 0, tone: 0.1 }, { p: riegel, mat: 'eisen', k: 0 }],
      details(P) {
        for (let k = 0; k < 5; k++) { const q = -6 + k * 3; const [a, b] = ax.P(q, -5), [c, d] = ax.P(q, 5); P.line(a, b, c, d, 'glutDim', true); const [e, f] = ax.P(q, -3), [g, h] = ax.P(q, 3); P.line(e, f, g, h, k % 2 ? 'flamme' : 'glutMittel', true); P.set(...ax.P(q, 0), 'flammeHell'); }
        const [gx, gy] = ax.P(0, 2); P.glow(gx, gy, 14, 0.5, 'glutDim');
        for (const [t, q] of [[-13, -12], [13, -12], [-13, 12], [13, 12]]) P.set(...ax.P(t, q), 'eisen3');
      },
    };
  },
};
