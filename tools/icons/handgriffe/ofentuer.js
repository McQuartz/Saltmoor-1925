// Ofentür: eine Hand legt den Riegel der Feuertür um; aus dem Spalt fällt rotes Licht. Was drinnen wartet, war nie Kohle.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, C, armGruppen } = A;
    const wand = [Pg([[0, 0], [30, 0], [30, 32], [0, 32]], null, { b: 1 })];
    const tuer = [Pg([[4, 4], [26, 3], [27, 29], [5, 30]], null, { b: 2, rd: 1 })];
    const riegel = [C(20, 15, 34, 15, 1.4, 1.4)];
    const h = hand({ x: 44, y: 22, a: -2.2, s: 1.3, seite: 1, curl: [0.6, 0.7, 0.75, 0.8], spreiz: 0.05, daumen: 0.4, arm: 8 });
    return { gruppen: [{ p: tuer, mat: 'eisen', k: 0 }, { p: riegel, mat: 'eisen', k: 0 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (let y = 5; y < 29; y++) { P.set(27, y, y % 3 ? 'flamme' : 'flammeHell'); P.set(28, y, 'glutMittel'); } P.rauch(36, 26, 6, 'glutDim', 0.4); for (const y of [9, 13, 17, 21]) P.line(9, y, 21, y, 'eisen0', true); } };
  },
};
