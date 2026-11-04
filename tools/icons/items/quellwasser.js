// Quellwasser: eine getrocknete Kürbisflasche (Pilgerflasche), zwei Bäuche übereinander, mit einer
// Schnur um die Taille, der Korken mit Wachs versiegelt, Wasser perlt außen ab.
'use strict';
module.exports = {
  form(A) {
    const { E, C, kurve } = A;
    const unten = [E(22, 34, 12, 11, null, { pf: 'bevel', hz: 0.35 })];
    const oben = [E(25, 16, 7, 7, null, { pf: 'bevel', hz: 0.4 })];
    const hals = [C(26, 9, 27, 5, 2.4, 2.2)];
    const korken = [C(27, 4, 27.5, 1.5, 2.8, 2.6)];
    const schnur = [...kurve([[16, 24], [24, 27], [32, 23]], 1.1, 1.1, null, {}, 8), ...kurve([[17, 25], [10, 30], [9, 40]], 0.8, 0.7, null, {}, 8)];
    return {
      gruppen: [{ p: [...unten, ...oben, ...hals], mat: 'holzhell', k: 3 }, { p: korken, mat: 'wachs', k: 0, tone: 0.2 }, { p: schnur, mat: 'wolle', k: 0 }],
      details(P) { for (const [x, y] of [[30, 30], [27, 38], [31, 35], [28, 14]]) { P.set(x, y, 'a3'); P.set(x, y + 1, 'a1'); } P.set(9, 41, 'a2'); },
    };
  },
};
