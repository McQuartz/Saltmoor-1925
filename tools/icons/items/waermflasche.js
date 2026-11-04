// Wärmflasche: flache Kupferflasche, halb in einem karierten Flanellbezug, oben der Schraubverschluss
// mit Griffmulde. Sie ist warm, und keiner hat sie gefüllt.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C } = A;
    const flasche = [Pg([[10, 14], [38, 12], [42, 22], [40, 38], [10, 40], [6, 26]], null, { b: 3, rd: 2 })];
    const bezug = [Pg([[7, 25], [41, 23], [41, 39], [9, 42], [6, 34]], null, { b: 1.6, rd: 1 })];
    const hals = [C(22, 12, 22, 7, 3, 3)];
    const deckel = [E(22, 6, 4.4, 2.2, null, { pf: 'bevel', hz: 0.5 }), C(22, 4, 22, 3, 1.4, 1.4)];
    return {
      gruppen: [{ p: flasche, mat: 'kupfer', k: 0 }, { p: hals, mat: 'kupfer', k: 0 }, { p: deckel, mat: 'messing', k: 0 }, { p: bezug, mat: 'wolle', k: 0, tone: 0.05 }],
      details(P) {
        for (let x = 9; x < 41; x += 5) P.ritz(x, 25, x - 1, 41, -1);
        for (let y = 28; y < 41; y += 5) P.ritz(8, y, 40, y - 2, -1);
        for (const x of [12, 17, 22, 27, 32]) P.ritz(x, 16, x, 22, -1);
        P.glow(24, 32, 8, 0.7, 'a1');
      },
    };
  },
};
