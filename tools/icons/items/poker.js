// Schürhaken: langer Eisenstab schräg, unten ein geschmiedeter Ring als Griff mit gedrehtem Hals,
// oben Spitze mit seitlichem Haken. Die Spitze glimmt noch (seit 1911 nicht ganz abgekühlt).
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, apg, ring } = A;
    const ax = achse(9, 40, -0.86);
    const stab = [acap(ax, 4, 0, 40, 0, 1.5, 1.2)];
    const [rx, ry] = ax.P(0, 0);
    const griff = ring(rx, ry, 4.2, 4.2, 1.3, null, {}, 14);
    const hals = [acap(ax, 3, 0, 12, 0, 2, 1.7)];
    const spitze = [apg(ax, [[38, -1.3], [46, 0], [38, 1.3]], null, { b: 0.8 }), acap(ax, 35, 0, 37, -6, 1.2, 0.9), acap(ax, 37, -6, 40, -8, 0.9, 0.7)];
    return {
      gruppen: [{ p: griff, mat: 'eisen', k: 0 }, { p: [...stab, ...spitze], mat: 'eisen', k: 0.6 }, { p: hals, mat: 'eisen', k: 0 }],
      details(P) {
        for (let t = 4; t < 12; t += 2) { const [x, y] = ax.P(t, 0); P.ritz(x - 1, y - 1, x + 1, y + 1, -2); }
        const [gx, gy] = ax.P(42, 0); P.glow(gx, gy, 7, 1.2, 'glutMittel', 'glutDim');
        const [kx, ky] = ax.P(44.5, 0); P.set(kx, ky, 'flamme');
      },
    };
  },
};
