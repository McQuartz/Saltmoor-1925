// Kniefall: eine große Hand hält die abgenommene Schiebermütze an der Krempe gesenkt vor sich,
// wie man sie hält, wenn man niederkniet, damit es über einen hinweggeht.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, E, armGruppen } = A;
    const muetze = [Pg([[16, 18], [22, 9], [34, 8], [42, 14], [40, 22], [24, 24]], null, { b: 2.4, rd: 2 })];
    const schirm = [Pg([[14, 18], [26, 23], [28, 28], [16, 27], [11, 22]], null, { b: 1, rd: 1 })];
    const knopf = [E(30, 8.5, 1.8, 1.2, null, { pf: 'bevel', hz: 0.5 })];
    const h = hand({ x: 2, y: 30, a: -0.55, s: 1.6, seite: -1, curl: [0.75, 0.8, 0.85, 0.9], spreiz: 0.03, daumen: 0.1, daumenWinkel: 0.6, arm: 4 });
    return { gruppen: [{ p: [...muetze, ...knopf], mat: 'wolle', k: 0, tone: 0.1 }, { p: schirm, mat: 'wolle', k: 0, tone: 0 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { P.ritz(30, 10, 24, 22, -1); P.ritz(31, 10, 38, 20, -1); P.set(35, 11, 'a3'); } };
  },
};
