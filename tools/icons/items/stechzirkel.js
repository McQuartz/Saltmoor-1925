// Stechzirkel aus Messing: zwei lange Schenkel, schräg im Licht, oben das Gelenk mit gerändeltem Knauf,
// die Spitzen aus Stahl stehen offen, genau eine Mondbreite auseinander.
'use strict';
module.exports = {
  form(A) {
    const { C, E } = A;
    const s1 = [C(26, 8, 9, 42, 2, 1.2), C(9, 42, 7, 46, 0.9, 0.5)];
    const s2 = [C(26, 8, 38, 43, 2, 1.2), C(38, 43, 39, 47, 0.9, 0.5)];
    const bogen = [C(14, 30, 33, 31, 0.9, 0.9)];
    const kopf = [E(26, 8, 4.2, 4.2, null, { pf: 'bevel', hz: 0.5 })];
    const knauf = [C(26, 4, 26, 1, 1.8, 1.4)];
    return {
      gruppen: [{ p: bogen, mat: 'messing', k: 0, tone: -0.1 }, { p: s2, mat: 'messing', k: 0 }, { p: s1, mat: 'messing', k: 0, tone: 0.08 }, { p: knauf, mat: 'messing', k: 0 }, { p: kopf, mat: 'messing', k: 0 }],
      details(P) {
        for (const [x, y] of [[8, 44], [7, 45], [38, 45], [39, 46]]) P.auf(x, y, 'stahl3');
        P.set(7, 46, 'a3'); P.set(39, 47, 'a3');
        P.el(26, 8, 1.4, 1.4, 'messing0', true); P.set(25, 7, 'a3');
        for (let y = 1; y < 5; y++) P.stufe(25, y, y % 2 ? +1 : -1);
        for (let k = 0; k < 6; k++) P.stufe(17 + k * 3, 30.5, -2);
      },
    };
  },
};
