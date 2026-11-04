// Öllappen: ein zerknüllter, fleckiger Lappen, an einer Ecke hängt ein Zipfel herab; im Stoff leuchten
// sieben kleine Punkte in einer Reihe nebeneinander.
'use strict';
module.exports = {
  form(A) {
    const { Pg } = A;
    const lappen = [Pg([[6, 18], [13, 9], [22, 12], [30, 6], [40, 12], [43, 22], [38, 30], [41, 38], [30, 36], [22, 42], [18, 36], [8, 34], [10, 26]], null, { b: 3, rd: 1.2 })];
    const zipfel = [Pg([[18, 36], [22, 41], [20, 47], [16, 46], [15, 40]], null, { b: 1, rd: 0.5 })];
    return {
      gruppen: [{ p: zipfel, mat: 'wolle', k: 0, tone: -0.08 }, { p: lappen, mat: 'wolle', k: 0 }],
      details(P) {
        for (const [a, b, c, d] of [[13, 12, 20, 30], [22, 13, 26, 34], [31, 8, 34, 28], [10, 25, 38, 28], [16, 18, 40, 16]]) P.ritz(a, b, c, d, -2);
        for (const [x, y, r] of [[18, 22, 3], [33, 31, 2.5]]) P.el(x, y, r, r * 0.7, 'kohle1', true);
        for (let i = 0; i < 7; i++) { const x = 13 + i * 3.6, y = 24 - i * 0.5; P.set(x, y, 'a3'); P.glow(x, y, 2, 0.6, 'glutDim'); P.set(x, y, 'a3'); }
      },
    };
  },
};
