// Sturmlaterne: Blechhaube, Glaskolben mit Drahtkorb, Bügel oben. Die Flamme neigt sich zur Seite.
'use strict';
module.exports = {
  form(A) {
    const { E, C, Pg, ring } = A;
    const cx = 23;
    const buegel = ring(cx, 11, 9, 8, 0.8, null, {}, 12, Math.PI, Math.PI * 2);
    const haube = [Pg([[cx - 8, 15], [cx + 8, 15], [cx + 5, 10], [cx - 5, 10]], null, { b: 1.5, rd: 0.6 }), C(cx, 9, cx, 7, 1.5, 1.5)];
    const kolben = [E(cx, 25, 8, 9, null, { pf: 'bevel', hz: 0.45 })];
    const korb = [C(cx - 6, 17, cx - 6, 33, 0.6, 0.6), C(cx + 6, 17, cx + 6, 33, 0.6, 0.6), C(cx, 16, cx, 34, 0.6, 0.6)];
    const tank = [Pg([[cx - 10, 33], [cx + 10, 33], [cx + 11, 40], [cx - 11, 40]], null, { b: 2, rd: 1 })];
    const rohr = [C(cx + 11, 37, cx + 13, 18, 1.2, 1.0), C(cx - 11, 37, cx - 13, 18, 1.2, 1.0)];
    return {
      gruppen: [
        { p: buegel, mat: 'eisen', k: 0 },
        { p: rohr, mat: 'eisen', k: 0 },
        { p: kolben, mat: 'glas', k: 0 },
        { p: korb, mat: 'eisen', k: 0, ohneR2: true },
        { p: haube, mat: 'eisen', k: 1 },
        { p: tank, mat: 'eisen', k: 0 },
      ],
      details(P) {
        P.glow(cx - 1, 27, 9, 1.1, 'glutMittel', 'glutDim');
        P.flamme(cx - 1, 30, 7, 2.2, -0.7);
        for (let x = cx - 9; x <= cx + 9; x += 3) P.stufe(x, 36, -2);
      },
    };
  },
};
