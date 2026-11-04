// Zunderbüchse des Leuchtturmwärters: flache Blechdose, Deckel aufgeklappt nach hinten, darin Zunder
// (an einem Ende angekohlt) und ein Feuerstein; davor liegt der geschwungene Feuerstahl.
'use strict';
module.exports = {
  form(A) {
    const { Pg, kurve, E } = A;
    const deckel = [Pg([[7, 22], [33, 15], [36, 6], [10, 12]], null, { b: 1.4, rd: 0.5 })];
    const dose = [Pg([[7, 22], [33, 15], [40, 24], [40, 30], [14, 38], [7, 30]], null, { b: 1.8, rd: 0.6 })];
    const innen = [Pg([[10, 23], [32, 17.5], [37, 24], [15, 30]], null, { b: 0.8 })];
    const zunder = [E(19, 25, 5.5, 2.8, null, { pf: 'bevel', hz: 0.6 })];
    const stein = [Pg([[27, 20], [32, 21], [31, 25], [26, 25]], null, { b: 0.8 })];
    const stahl = kurve([[8, 44], [20, 41], [30, 42], [38, 39], [40, 43], [35, 46]], 1.5, 1.3, null, { cr: true }, 16);
    return {
      gruppen: [{ p: deckel, mat: 'eisen', k: 0, tone: -0.1 }, { p: dose, mat: 'eisen', k: 0 }, { p: innen, mat: 'eisen', k: 0, tone: -0.4, ohneRand: true }, { p: zunder, mat: 'wolle', k: 0, ohneRand: true }, { p: stein, mat: 'stein', k: 0, ohneRand: true }, { p: stahl, mat: 'stahl', k: 0 }],
      details(P) {
        P.set(14, 26, 'kohle0'); P.set(15, 26, 'kohle0'); P.set(14, 25, 'glutMittel'); P.set(15, 27, 'glutDim');
        P.set(30, 22, 'stein3'); P.set(41, 41, 'flammeHell'); P.set(43, 39, 'flamme');
        P.ritz(12, 13, 33, 8, -1);
      },
    };
  },
};
