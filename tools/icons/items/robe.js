// Kultistenrobe: bodenlange Kutte mit spitzer Kapuze, weite Trichterärmel, der Saum zerfranst und steif
// von etwas Dunklem. Ein Strick als Gürtel.
'use strict';
module.exports = {
  form(A) {
    const { mantel, C, Pg } = A;
    const m = mantel({ cx: 24, y0: 15, y1: 46, sb: 8, sb2: 14, aerm: 22, aw: 3.4, kragen: 'kapuze', zacken: 7, seed: 5 });
    const trichter = [Pg([[12, 30], [7, 39], [15, 38]], null, { b: 1 }), Pg([[36, 30], [41, 39], [33, 38]], null, { b: 1 })];
    const strick = [C(15, 28, 33, 28, 1, 1), C(19, 28, 18, 38, 0.8, 0.7)];
    return {
      gruppen: [{ p: [...m.aermelL, trichter[0]], mat: 'rotstoff', k: 1.5 }, { p: m.koerper, mat: 'rotstoff', k: 0 }, { p: [...m.aermelR, trichter[1]], mat: 'rotstoff', k: 1.5 }, { p: m.kragen, mat: 'rotstoff', k: 0 }, { p: strick, mat: 'wolle', k: 0, ohneR2: true }],
      details(P) {
        P.el(23, 10, 3.5, 5, 'kohle0', true); P.el(23, 12, 2.5, 3, 'kohle0', true);
        for (const x of [20, 27]) P.ritz(x, 30, x + (x > 24 ? 1 : -1), 45, -2);
        for (let x = 11; x < 38; x++) if (x % 3) P.stufe(x, 43 + (x % 2), -1);
      },
    };
  },
};
