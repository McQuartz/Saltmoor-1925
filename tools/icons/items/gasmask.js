// Gasmaske: Gummimaske aus dem Krieg, zwei runde Glasaugen mit Messingfassung, unten die Filterdose
// am kurzen Faltenschlauch, Kopfriemen seitlich. Der Filter riecht nach Mandeln.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, kurve, C } = A;
    const maske = [Pg([[13, 6], [35, 6], [40, 16], [36, 30], [24, 34], [12, 30], [8, 16]], null, { b: 3, rd: 2 })];
    const augen = [E(17, 17, 4.2, 4.2, null, { pf: 'bevel', hz: 0.4 }), E(31, 17, 4.2, 4.2, null, { pf: 'bevel', hz: 0.4 })];
    const schlauch = kurve([[24, 31], [26, 36], [30, 39], [33, 41]], 2.6, 2.6, null, {}, 8);
    const dose = [C(32, 42, 38, 45, 4, 4)];
    const riemen = [C(8, 13, 3, 11, 1, 1), C(40, 13, 45, 11, 1, 1)];
    return {
      gruppen: [{ p: riemen, mat: 'gummi', k: 0, ohneR2: true }, { p: maske, mat: 'gummi', k: 0 }, { p: schlauch, mat: 'gummi', k: 0 }, { p: dose, mat: 'eisen', k: 0 }, { p: augen, mat: 'messing', k: 0 }],
      details(P) {
        P.el(17, 17, 2.8, 2.8, 'glas1'); P.el(31, 17, 2.8, 2.8, 'glas1'); P.set(18, 16, 'glas3'); P.set(32, 16, 'glas3');
        for (let k = 0; k < 4; k++) { const [x, y] = schlauch.B(0.15 + k * 0.22); P.stufe(x, y, -2); P.stufe(x + 1, y - 1, -2); }
        for (const x of [33, 35, 37]) P.stufe(x, 44, -2);
        P.set(36, 46, 'a3');
      },
    };
  },
};
