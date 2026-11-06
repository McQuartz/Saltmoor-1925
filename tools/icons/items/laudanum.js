// Laudanum: kleines braunes Apothekerfläschchen mit Glasstopfen, großem Etikett mit rotem Rand,
// daneben ein Zuckerwürfel, auf den ein Tropfen gefallen ist.
'use strict';
module.exports = {
  form(A) {
    const { Pg, C, E } = A;
    const flasche = [Pg([[12, 17], [30, 17], [32, 22], [32, 44], [10, 44], [10, 22]], null, { b: 2.4, rd: 1.2 })];
    const hals = [C(21, 17, 21, 10, 3, 3)];
    const stopfen = [E(21, 6, 4, 3.6, null, { pf: 'bevel', hz: 0.5 }), C(21, 9, 21, 10, 2.4, 2.4)];
    const etikett = [Pg([[11, 25], [31, 25], [31, 37], [11, 37]], null, { b: 0.8 })];
    const zucker = [Pg([[34, 38], [42, 37], [43, 44], [35, 45]], null, { b: 1.2, rd: 0.4 })];
    return {
      gruppen: [{ p: [...flasche, ...hals], mat: 'kupfer', k: 1 }, { p: stopfen, mat: 'glas', k: 0 }, { p: etikett, mat: 'papier', k: 0 }, { p: zucker, mat: 'papier', k: 0, tone: 0.1 }],
      details(P) {
        P.line(12, 26, 30, 26, 'a2', true); P.line(12, 36, 30, 36, 'a2', true);
        for (const y of [29, 31, 33]) P.line(14, y, y === 31 ? 25 : 28, y, 'papier1', true);
        P.set(38, 40, 'a3'); P.set(39, 40, 'a2'); P.set(38, 39, 'a2');
        P.set(27, 20, 'kupfer3'); P.set(27, 21, 'kupfer3');
      },
    };
  },
};
