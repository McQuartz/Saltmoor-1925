// Schaufel: spitzes Spatenblatt unten rechts, langer Stiel mit D-Griff oben links. Erde am Blatt.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, apg, ring } = A;
    const ax = achse(10, 9, 0.84);
    const stiel = [acap(ax, 4, 0, 28, 0, 1.6, 1.7)];
    const [gx, gy] = ax.P(0, 0);
    const dgriff = [...ring(gx, gy, 4, 3.4, 1.1, null, {}, 12), acap(ax, -3.5, -3, -3.5, 3, 1.3, 1.3)];
    const tuelle = [apg(ax, [[26, -2], [31, -3.4], [31, 3.4], [26, 2]], null, { b: 0.8 })];
    const blatt = [apg(ax, [[30, -7], [42, -7.5], [49, 0], [42, 7.5], [30, 7]], null, { b: 2.4, rd: 0.6 })];
    return {
      gruppen: [{ p: dgriff, mat: 'holz', k: 0 }, { p: stiel, mat: 'holz', k: 0 }, { p: blatt, mat: 'eisen', k: 0 }, { p: tuelle, mat: 'eisen', k: 0 }],
      details(P) {
        // Erde an der Spitze (Torf), dunkel
        for (let t = 40; t < 48; t++) for (let q = -4; q <= 4; q++) { const [x, y] = ax.P(t, q); if ((t + q * 3) % 5 === 0 && t > 41 + Math.abs(q) * 0.5) P.auf(x, y, 'torf2'); }
        const [a, b] = ax.P(32, 0), [c, d] = ax.P(44, 0); P.ritz(a, b, c, d, -1);
      },
    };
  },
};
