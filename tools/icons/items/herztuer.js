// Die Tür im Herzen: eine einzelne, dicke Türplanke, senkrecht und leicht schräg, mit zwei Eisenbändern und einem
// Riegel auf der falschen Seite; aus den Fugen dringt ein warmes, rotes Pochen.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap } = A;
    const ax = achse(24, 24, -Math.PI / 2 + 0.18);
    const planke = [apg(ax, [[-21, -8], [21, -9], [22, 9], [-21, 8]], null, { b: 2, rd: 0.6 })];
    const baender = [apg(ax, [[11, -10], [15, -10], [15, 10], [11, 10]], null, { b: 0.8 }), apg(ax, [[-15, -10], [-11, -10], [-11, 10], [-15, 10]], null, { b: 0.8 })];
    const riegel = [acap(ax, -1, -10, -1, -16, 1.6, 1.6), acap(ax, -3, -16, 1, -16, 1.6, 1.6)];
    return {
      gruppen: [{ p: planke, mat: 'holz', k: 0 }, { p: [...baender, ...riegel], mat: 'eisen', k: 0.4 }],
      details(P) {
        for (const q of [-3, 3]) { const [a, b] = ax.P(-20, q), [c, d] = ax.P(20, q); P.line(a, b, c, d, 'a1', true); }
        const [gx, gy] = ax.P(0, 0); P.glow(gx, gy, 7, 0.9, 'a2', 'a1'); P.set(gx, gy, 'a3');
        for (const t of [-13, 13]) for (const q of [-6, 6]) P.set(...ax.P(t, q), 'eisen3');
      },
    };
  },
};
