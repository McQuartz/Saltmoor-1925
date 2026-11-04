// Abrollen: der Rücken rundet sich zur Rolle über die Schulter, die flache Hand schlägt seitlich auf den Boden ab,
// links und rechts stiebt Staub. Wie man es nur einmal beigebracht bekommt.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, kurve, armGruppen } = A;
    const boden = [Pg([[0, 29], [48, 29], [48, 32], [0, 32]], null, { b: 0.6 })];
    const ruecken = kurve([[22, 27], [20, 10], [34, 4], [44, 14], [40, 26]], 5, 4, null, { cr: true }, 20);
    const h = hand({ x: 18, y: 22, a: Math.PI - 0.35, s: 1.4, seite: -1, curl: [0, 0, 0.03, 0.06], spreiz: 0.12, daumen: 0.2, arm: 10 });
    return { gruppen: [{ p: boden, mat: 'stein', k: 0, tone: -0.15 }, { p: ruecken, mat: 'stoff', k: 2 }, ...armGruppen(h, 'stoff'), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { P.rauch(2, 25, 3.5, 'stein2', 0.5); P.rauch(13, 24, 3, 'stein1', 0.4); P.rauch(46, 25, 3, 'stein2', 0.4); P.ritz(26, 12, 38, 9, -1); } };
  },
};
