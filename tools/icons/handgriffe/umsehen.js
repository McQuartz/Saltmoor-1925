// Umsehen: eine erhobene Hand hält einen Kerzenstummel hoch und dreht sich; der Schein fällt nach rechts.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, C, armGruppen } = A;
    const f = faust({ x: 17, y: 17, a: -1.2, s: 1.35, seite: -1, arm: 14 });
    const kerze = [C(22, 11, 23, 4, 1.6, 1.5)];
    return { gruppen: [...armGruppen(f), { p: kerze, mat: 'wachs', k: 0, tone: 0.25 }, { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.flamme(23, 3, 4, 1.2, 0.5); P.rauch(34, 8, 7, 'stoff1', 0.25); P.rauch(40, 14, 5, 'stoff1', 0.2); } };
  },
};
