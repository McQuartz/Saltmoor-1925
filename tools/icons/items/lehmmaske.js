// Lehmmaske: die Form eines Gesichts aus gebranntem Lehm, leicht schräg, rau, mit einem Riss von der Stirn
// zum Kinn. Augen und Mund sind Löcher; hinter dem linken Auge glimmt noch etwas, warm.
'use strict';
module.exports = {
  form(A) {
    const { E, Pg } = A;
    const maske = [Pg([[16, 5], [30, 4], [38, 12], [40, 26], [35, 38], [26, 44], [18, 42], [11, 33], [9, 18]], null, { b: 3.2, rd: 2 })];
    const nase = [Pg([[23, 18], [27, 18], [28, 29], [22, 29]], null, { b: 1.4, rd: 1 })];
    const loecher = [E(18, 20, 3.4, 2.2), E(32, 19, 3.2, 2.1), E(25, 35, 4.2, 1.4)];
    const band = [E(8, 18, 2, 3.2), E(41, 16, 2, 3)];
    return {
      gruppen: [{ p: band, mat: 'leder', k: 0 }, { p: maske, mat: 'torf', k: 0, tone: 0.18 }, { p: nase, mat: 'torf', k: 0.8, tone: 0.3 }, { p: loecher, mat: 'kohle', k: 0, tone: -0.6, ohneRand: true }],
      details(P) {
        P.ritz(26, 5, 24, 13, -2); P.ritz(24, 13, 27, 17, -2); P.ritz(29, 30, 31, 37, -1); P.ritz(31, 37, 29, 43, -2);
        for (const [x, y] of [[14, 10], [35, 27], [13, 30], [33, 9], [19, 40], [37, 20]]) P.stufe(x, y, -1);
        for (const [x, y] of [[20, 8], [31, 33], [15, 25], [36, 14]]) P.stufe(x, y, +1);
        P.glow(18, 20, 4, 1, 'glutMittel', 'glutDim'); P.set(18, 20, 'flamme'); P.set(17, 20, 'glutMittel');
      },
    };
  },
};
