// Faulen lassen: eine Hand liegt reglos mit der Fläche nach oben im Moos, aus dem Handgelenk wachsen zwei Pilze.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, E, C } = A;
    const moos = [Pg([[0, 26], [48, 24], [48, 32], [0, 32]], null, { b: 1.2 })];
    const h = hand({ x: 10, y: 25, a: -0.05, s: 1.35, seite: 1, curl: [0.35, 0.4, 0.45, 0.55], spreiz: 0.05, daumen: 0.3, arm: 12 });
    const pilze = [C(16, 22, 16, 15, 0.8, 0.8), E(16, 14, 3, 1.6, null, { pf: 'bevel', hz: 0.5 }), C(20, 22, 21, 18, 0.7, 0.7), E(21, 17.5, 2.2, 1.2, null, { pf: 'bevel', hz: 0.5 })];
    return { gruppen: [{ p: moos, mat: 'gruenstoff', k: 0 }, { p: [...h.arm, ...h.alle()], mat: 'haut', k: 1, tone: -0.1 }, { p: pilze, mat: 'knochen', k: 0 }],
      details(P) { for (const [x, y] of [[24, 22], [28, 23], [12, 23], [31, 21]]) P.auf(x, y, 'akzent2'); P.set(15, 13, 'a3'); } };
  },
};
