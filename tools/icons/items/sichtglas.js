// Sichtglas des Helmtauchers: ein dickes rundes Bullauge aus einem Taucherhelm, in einem quadratischen Messingflansch
// mit vier Flügelmuttern an den Ecken; das Glas innen beschlagen, und dahinter sieht jemand zurück.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C } = A;
    const flansch = [Pg([[7, 7], [41, 6], [42, 41], [6, 42]], null, { b: 2.4, rd: 2.5 })];
    const ring = [E(24, 24, 13, 13, null, { pf: 'bevel', hz: 0.35 })];
    const muttern = [[9, 9], [39, 8], [40, 39], [8, 40]].map(([x, y]) => [C(x - 3, y, x + 3, y, 1.1, 1.1), E(x, y, 1.8, 1.8)]).flat();
    return {
      gruppen: [{ p: flansch, mat: 'messing', k: 0, tone: -0.1 }, { p: ring, mat: 'messing', k: 0 }, { p: muttern, mat: 'messing', k: 0, tone: 0.1 }],
      details(P) {
        P.el(24, 24, 9.5, 9.5, 'glas1', true);
        for (let y = 15; y < 34; y++) for (let x = 15; x < 34; x++) if (Math.hypot(x - 24, y - 24) < 9 && (x * 3 + y * 5) % 7 === 0) P.set(x, y, 'glas2');
        P.set(21, 25, 'a3'); P.set(27, 25, 'a3'); P.set(30, 18, 'glasR2'); P.set(31, 19, 'glas3');
      },
    };
  },
};
