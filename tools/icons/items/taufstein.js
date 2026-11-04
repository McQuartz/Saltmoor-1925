// Taufstein-Splitter: ein grober Granitbrocken mit gebrochenen Kanten, oben eine glatte Rinne,
// in der Wasser steht, das nie verdunstet. Eine Hälfte eines eingemeißelten Kreuzes an der Bruchkante.
'use strict';
module.exports = {
  form(A) {
    const { Pg } = A;
    const stein = [Pg([[6, 26], [12, 14], [24, 9], [38, 12], [43, 22], [40, 36], [30, 43], [14, 42], [6, 36]], null, { b: 3, rd: 0.8 })];
    const rinne = [Pg([[12, 19], [24, 13], [37, 16], [36, 22], [24, 20], [13, 25]], null, { b: 1.2, rd: 1 })];
    return {
      gruppen: [{ p: stein, mat: 'stein', k: 0 }, { p: rinne, mat: 'stein', k: 0, tone: -0.35, ohneRand: true }],
      details(P) {
        for (let x = 14; x < 36; x++) { const y = Math.round(19.5 - (x < 24 ? (x - 14) * 0.45 : (34 - x) * 0.2 + 0) + (x >= 24 ? 0.5 : 0)); P.auf(x, y + 1, x % 4 ? 'akzent2' : 'aG'); P.auf(x, y + 2, 'akzent1'); }
        P.ritz(30, 28, 30, 38, -2); P.ritz(26, 32, 34, 32, -2);
        for (const [x, y] of [[10, 30], [17, 36], [36, 28], [22, 39], [40, 30]]) P.stufe(x, y, -1);
      },
    };
  },
};
