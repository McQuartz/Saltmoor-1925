// Das schräge Lot: ein spitzes Messinglot an einer gewachsten Schnur, die von einem Haken oben links ausgeht
// und nicht senkrecht hängt, sondern deutlich schräg nach rechts, als ziehe jemand daran.
'use strict';
module.exports = {
  form(A) {
    const { C, Pg, ring, achse, apg } = A;
    const balken = [C(2, 4, 22, 4, 1.6, 1.6)];
    const haken = ring(10, 7, 2, 2, 0.8, null, {}, 8);
    const schnur = [C(10, 9, 30, 30, 0.7, 0.7)];
    const ax = achse(30, 30, Math.atan2(21, 20));
    const lot = [apg(ax, [[-1, -3.4], [3, -5], [8, -4.5], [16, 0], [8, 4.5], [3, 5], [-1, 3.4]], null, { b: 2, rd: 0.6 })];
    void Pg;
    return {
      gruppen: [{ p: balken, mat: 'holz', k: 0 }, { p: haken, mat: 'eisen', k: 0 }, { p: schnur, mat: 'wolle', k: 0, tone: 0.1 }, { p: lot, mat: 'messing', k: 0 }],
      details(P) {
        const [a, b] = ax.P(3, -4.5), [c, d] = ax.P(3, 4.5); P.ritz(a, b, c, d, -2);
        for (let y = 10; y < 46; y += 3) P.set(10, y, 'stoff1');
        const [x, y] = ax.P(16.5, 0); P.set(x, y, 'a3');
      },
    };
  },
};
