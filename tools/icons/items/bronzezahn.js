// Bronzezahn: ein einzelner, riesiger Zahn aus einem Zahnrad, gebrochen; breiter Fuß mit Bruchkante, verjüngt zur
// abgerundeten Spitze, grün angelaufen. Als Waffe in der Faust zu halten, schräg gestellt.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg } = A;
    const ax = achse(8, 40, -0.85);
    const zahn = [apg(ax, [[0, -9], [3, -11], [5, -8], [7, -10.5], [9, -9], [30, -4.5], [36, -2.5], [37.5, 0], [36, 2.5], [30, 4.5], [9, 9], [6, 10.5], [3, 8.5], [0, 10]], null, { b: 3, rd: 0.6 })];
    return {
      gruppen: [{ p: zahn, mat: 'kupfer', k: 0 }],
      details(P) {
        for (let t = 2; t < 9; t++) for (let q = -8; q <= 8; q += 2) { const [x, y] = ax.P(t, q + (t % 2)); if ((t * 7 + q) % 3 === 0) P.stufe(x, y, -2); }
        for (const [t, q] of [[14, -3], [20, 2], [25, -1], [12, 4], [28, 1]]) { const [x, y] = ax.P(t, q); P.set(x, y, 'akzent2'); P.set(x + 1, y, 'akzent1'); }
        const [a, b] = ax.P(33, -2); P.set(a, b, 'a3');
      },
    };
  },
};
