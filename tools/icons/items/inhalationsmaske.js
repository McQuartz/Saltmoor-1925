// Inhalationsmaske: trichterförmige Porzellanmaske für den Soledampf, ein Gummischlauch läuft in
// einen Bogen zur kleinen Messingdüse. Aus dem Rand steigt etwas Dampf.
'use strict';
module.exports = {
  form(A) {
    const { Pg, kurve, E } = A;
    const trichter = [Pg([[8, 8], [26, 4], [30, 10], [28, 28], [22, 31], [14, 26]], null, { b: 2.8, rd: 2 })];
    const rand = [E(17, 7, 9.5, 4, null, { pf: 'bevel', hz: 0.4 })];
    const schlauch = kurve([[26, 27], [34, 34], [42, 30], [43, 40], [36, 45]], 1.7, 1.7, null, { cr: true }, 16);
    const duese = [E(35, 45, 3, 2.2, null, { pf: 'bevel', hz: 0.5 })];
    return {
      gruppen: [{ p: schlauch, mat: 'gummi', k: 0 }, { p: duese, mat: 'messing', k: 0 }, { p: trichter, mat: 'knochen', k: 0, tone: 0.05 }, { p: rand, mat: 'knochen', k: 0, tone: 0.12 }],
      details(P) {
        P.el(17, 7, 7, 2.4, 'knochen0', true);
        for (const [x, y] of [[13, 3], [15, 1], [20, 2], [22, 0]]) P.set(x, y, 'a2');
        P.ritz(14, 12, 22, 27, -1);
      },
    };
  },
};
