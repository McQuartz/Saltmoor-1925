// Schneebrille: ein geschnitztes Holzbrett über beide Augen, gebogen, mit zwei schmalen Schlitzen und einer
// Nasenkerbe, innen mit Ruß geschwärzt; seitlich ein Lederband, das hinter dem Kopf herumläuft.
'use strict';
module.exports = {
  form(A) {
    const { Pg, kurve } = A;
    const brett = [Pg([[3, 20], [12, 15], [24, 14], [36, 15], [45, 20], [44, 27], [32, 29], [27, 28], [24, 24], [21, 28], [16, 29], [4, 27]], null, { b: 2.4, rd: 1 })];
    const band = kurve([[44, 23], [47, 34], [24, 44], [1, 34], [4, 23]], 1.1, 1.1, null, { cr: true }, 24);
    return {
      gruppen: [{ p: band, mat: 'leder', k: 0, tone: -0.1 }, { p: brett, mat: 'holzhell', k: 0 }],
      details(P) {
        P.line(9, 21, 20, 20, 'kohle0', true); P.line(28, 20, 39, 21, 'kohle0', true); P.line(10, 22, 19, 21, 'kohle0', true); P.line(29, 21, 38, 22, 'kohle0', true);
        P.set(14, 20, 'a3'); P.set(33, 20, 'a3');
        for (const x of [8, 40]) P.ritz(x, 17, x, 26, -1);
      },
    };
  },
};
