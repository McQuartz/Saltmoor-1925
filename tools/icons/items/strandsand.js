// Sand vom Anfang: eine offene, hohle Hand voll hellem Sand, der zwischen den Fingern in einem dünnen Faden
// herabrieselt und unten ein kleines Häufchen bildet. Warm wie am ersten Morgen.
'use strict';
module.exports = {
  form(A) {
    const { hand, E } = A;
    const h = hand({ x: 6, y: 28, a: -0.25, s: 1.9, seite: -1, curl: [0.3, 0.35, 0.4, 0.45], spreiz: 0.04, daumen: 0.2, daumenWinkel: 0.9, arm: 6 });
    const sand = [E(22, 21, 9, 4, null, { pf: 'bevel', hz: 0.4 })];
    const haufen = [E(30, 45, 7, 2.5, null, { pf: 'bevel', hz: 0.5 })];
    return {
      gruppen: [{ p: [...h.arm, ...h.alle()], mat: 'haut', k: 1 }, { p: sand, mat: 'papier', k: 0, tone: 0.1 }, { p: haufen, mat: 'papier', k: 0, tone: 0.1 }],
      details(P) { for (let y = 30; y < 43; y++) P.set(29 + (y % 2), y, y % 3 ? 'papier3' : 'a3'); for (const [x, y] of [[19, 19], [24, 20], [26, 22], [30, 44]]) P.set(x, y, 'a4'); },
    };
  },
};
