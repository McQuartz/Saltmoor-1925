// Reiseplaid: eine gerollte Wolldecke im Karomuster, mit zwei Lederriemen und Tragegriff geschnürt,
// an den Enden hängen die Fransen.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, E, kurve } = A;
    const ax = achse(8, 32, -0.42);
    const rolle = [acap(ax, 2, 0, 34, 0, 8, 8)];
    const ende = [E(...ax.P(35, 0), 4.5, 7.6, null, { pf: 'bevel', hz: 0.6 })];
    const riemen = [acap(ax, 9, -8.6, 9, 8.6, 1.4, 1.4), acap(ax, 27, -8.6, 27, 8.6, 1.4, 1.4)];
    const [g0x, g0y] = ax.P(9, -8.4), [g1x, g1y] = ax.P(27, -8.4);
    const griff = kurve([[g0x, g0y], [g0x + 4, g0y - 8], [g1x - 4, g1y - 8], [g1x, g1y]], 1.1, 1.1, null, {}, 12);
    const fransen = []; for (let q = -6; q <= 6; q += 2) { const [x, y] = ax.P(-1, q); fransen.push(acap(ax, 0, q, -3.5, q + 0.6, 0.6, 0.5)); void x; void y; }
    return {
      gruppen: [{ p: griff, mat: 'leder', k: 0 }, { p: fransen, mat: 'rotstoff', k: 0, ohneR2: true }, { p: rolle, mat: 'rotstoff', k: 0 }, { p: ende, mat: 'rotstoff', k: 0, tone: 0.06 }, { p: riemen, mat: 'leder', k: 0 }],
      details(P) {
        for (let t = 4; t < 34; t += 5) { const [a, b] = ax.P(t, -7.5), [c, d] = ax.P(t, 7.5); P.ritz(a, b, c, d, -2); }
        for (const q of [-4, 0, 4]) { const [a, b] = ax.P(3, q), [c, d] = ax.P(34, q); P.ritz(a, b, c, d, -1); }
        for (const q of [-3, 2]) { const [a, b] = ax.P(4, q + 0.5), [c, d] = ax.P(33, q + 0.5); P.line(a, b, c, d, 'akzent2', true); }
        const [ex, ey] = ax.P(35, 0); P.el(ex, ey, 2.4, 4.4, 'rotstoff1', true); P.el(ex, ey, 1, 2, 'rotstoff0', true);
      },
    };
  },
};
