// Herz im Glas: hohes Präparatglas mit Glasdeckel und Etikett, darin ein dunkles Herz in Formalin,
// zwei Gefäßstümpfe ragen nach oben. Es schlägt, wenn du blutest.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C } = A;
    const glas = [Pg([[12, 11], [34, 11], [35, 44], [11, 44]], null, { b: 2.2, rd: 2 })];
    const deckel = [E(23, 9.5, 12.5, 3, null, { pf: 'bevel', hz: 0.4 }), C(23, 7, 23, 4, 3, 2.4)];
    const herz = [E(21, 29, 6.5, 7.5, null, { pf: 'bevel', hz: 0.5 }), E(26, 27, 5, 6, null, { pf: 'bevel', hz: 0.5 }), C(22, 22, 20, 16, 1.8, 1.4), C(26, 21, 29, 17, 1.6, 1.2)];
    const etikett = [Pg([[14, 36], [32, 36], [32, 42], [14, 42]], null, { b: 0.6 })];
    return {
      gruppen: [{ p: glas, mat: 'glas', k: 0, tone: 0.05 }, { p: herz, mat: 'fleisch', k: 1.5, ohneRand: false }, { p: deckel, mat: 'glas', k: 0, tone: 0.1 }, { p: etikett, mat: 'papier', k: 0 }],
      details(P) {
        for (let y = 14; y < 36; y++) for (let x = 13; x < 34; x++) { const i = P.info(x, y); if (i && i.mat === 'glas' && i.stufe < 4 && (x + y) % 3 === 0) P.stufe(x, y, +1); }
        P.line(16, 38, 29, 38, 'kohle1', true); P.line(16, 40, 24, 40, 'kohle1', true);
        P.set(24, 25, 'a3'); P.set(19, 30, 'a2'); P.set(32, 15, 'glas3'); P.set(32, 16, 'glas3');
      },
    };
  },
};
