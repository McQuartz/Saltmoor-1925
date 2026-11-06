// Lakeeimer: Holzeimer aus Dauben mit zwei Eisenreifen und Drahtbügel, schräg von oben, voll trüber Lake,
// aus der etwas Helles herausragt, das man nicht hineinlegen sollte.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, kurve } = A;
    const eimer = [Pg([[9, 16], [39, 16], [36, 44], [12, 44]], null, { b: 1.8, rd: 1 })];
    const rand = [E(24, 16, 15, 5, null, { pf: 'bevel', hz: 0.4 })];
    const lake = [E(24, 16.5, 12.5, 3.4, null, { pf: 'flat' })];
    const buegel = kurve([[9, 18], [10, 3], [38, 3], [39, 18]], 0.8, 0.8, null, {}, 14);
    return {
      gruppen: [{ p: buegel, mat: 'eisen', k: 0 }, { p: eimer, mat: 'holz', k: 0 }, { p: rand, mat: 'holz', k: 0, tone: 0.06 }, { p: lake, mat: 'akzent', k: 0, tone: -0.1, ohneRand: true }],
      details(P) {
        for (const y of [24, 37]) P.line(10 + (y - 16) * 0.1, y, 38 - (y - 16) * 0.1, y, 'eisen2', true);
        for (const y of [24, 37]) P.line(10 + (y - 16) * 0.1, y - 1, 38 - (y - 16) * 0.1, y - 1, 'eisen3', true);
        for (const x of [15, 21, 27, 33]) P.ritz(x, 21, x - (x - 24) * 0.1, 43, -1);
        P.set(27, 15, 'knochen3'); P.set(28, 15, 'knochen3'); P.set(28, 14, 'knochen2'); P.set(26, 16, 'knochen1');
        P.set(18, 16, 'aH'); P.set(19, 16, 'a4');
      },
    };
  },
};
