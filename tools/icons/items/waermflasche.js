// Wärmflasche: eine flache Kupfer-Bettflasche in Linsenform mit kurzem Hals und Schraubverschluss,
// an einer Seite schaut sie aus einem karierten Flanellbeutel mit Zugband. Sie ist warm, und keiner hat sie gefüllt.
'use strict';
module.exports = {
  form(A) {
    const { E, achse, acap, apg } = A;
    const ax = achse(22, 28, -0.75);
    const flasche = [apg(ax, Array.from({ length: 20 }, (_, i) => { const w = i / 20 * Math.PI * 2; return [Math.cos(w) * 18, Math.sin(w) * 13]; }), null, { b: 3, rd: 0.5 })];
    const hals = [acap(ax, 17, 0, 23, 0, 3.2, 3)];
    const deckel = [acap(ax, 23, 0, 26, 0, 4.4, 4.4)];
    const beutel = [apg(ax, [[-19, -14], [-4, -14.5], [-2, 0], [-4, 14.5], [-19, 14], [-21, 0]], null, { b: 1.4, rd: 2 })];
    const zug = [acap(ax, -3, -14, -3, 14, 1, 1), acap(ax, -3, 13, 2, 19, 0.8, 0.7)];
    void E;
    return {
      gruppen: [{ p: flasche, mat: 'kupfer', k: 0 }, { p: hals, mat: 'kupfer', k: 0 }, { p: deckel, mat: 'messing', k: 0 }, { p: beutel, mat: 'rotstoff', k: 0, tone: 0.02 }, { p: zug, mat: 'leder', k: 0 }],
      details(P) {
        for (let t = -18; t < -3; t += 4) { const [a, b] = ax.P(t, -13), [c, d] = ax.P(t, 13); P.ritz(a, b, c, d, -1); }
        for (const q of [-8, -2, 4, 10]) { const [a, b] = ax.P(-19, q), [c, d] = ax.P(-4, q); P.ritz(a, b, c, d, -1); }
        for (const q of [-6, 0, 6]) { const [a, b] = ax.P(2, q), [c, d] = ax.P(14, q * 0.7); P.ritz(a, b, c, d, -1); }
        const [gx, gy] = ax.P(8, 0); P.glow(gx, gy, 9, 0.75, 'a1');
      },
    };
  },
};
