// Kultmaske: längliche Maske aus gebleichtem Holz, leicht gedreht, zwei Augenlöcher und auf der Stirn
// ein drittes, das von innen leuchtet. Schmaler, verschlossener Mund, Bindeband an der Seite.
'use strict';
module.exports = {
  form(A) {
    const { Pg, kurve } = A;
    const maske = [Pg([[16, 5], [32, 4], [38, 13], [36, 28], [30, 40], [24, 45], [17, 40], [11, 28], [10, 13]], null, { b: 3, rd: 1.2 })];
    const band = kurve([[11, 18], [5, 20], [3, 28], [6, 34]], 0.8, 0.6, null, {}, 8);
    const nase = [Pg([[23, 18], [27, 18], [28, 29], [22, 29]], null, { b: 1.5 })];
    return {
      gruppen: [{ p: band, mat: 'leder', k: 0, ohneR2: true }, { p: maske, mat: 'knochen', k: 0 }, { p: nase, mat: 'knochen', k: 0, tone: 0.1 }],
      details(P) {
        P.el(18.5, 19, 3, 2.2, 'kohle0'); P.el(31, 19, 3, 2.2, 'kohle0');
        P.el(24.5, 10, 1.6, 2.4, 'kohle0'); P.set(24, 10, 'a4'); P.set(24, 9, 'a3'); P.set(25, 11, 'a2');
        P.line(20, 35, 29, 35, 'kohle1', true);
        for (let y = 6; y < 40; y += 3) P.stufe(13 + (y % 2), y, -1);
      },
    };
  },
};
