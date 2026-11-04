// Ansteckung: zwei Hände im Händedruck, auf der einen grüne Flecken, die schon auf die andere überwandern.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, armGruppen } = A;
    const h1 = hand({ x: 9, y: 20, a: -0.2, s: 1.35, seite: -1, curl: [0.7, 0.75, 0.8, 0.85], spreiz: 0.03, daumen: 0.3, arm: 12 });
    const h2 = hand({ x: 39, y: 16, a: Math.PI - 0.2, s: 1.35, seite: -1, curl: [0.7, 0.75, 0.8, 0.85], spreiz: 0.03, daumen: 0.3, arm: 12 });
    return { gruppen: [...armGruppen(h1, 'wolle'), { p: h1.alle(), mat: 'haut', k: 1 }, ...armGruppen(h2), { p: h2.alle(), mat: 'haut', k: 1, tone: 0.05 }],
      details(P) { for (const [x, y] of [[8, 19], [12, 21], [16, 18], [19, 22], [23, 19], [27, 17]]) { P.auf(x, y, 'akzent2'); P.auf(x + 1, y, 'akzent1'); } P.auf(31, 15, 'akzent1'); } };
  },
};
