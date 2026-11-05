// Umsehen: eine große Faust hält einen Kerzenstummel hoch, die Flamme neigt sich, der Schein fällt weit nach rechts.
// Danach ist es nie ganz dieselbe Richtung.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, C, armGruppen } = A;
    const f = faust({ x: 12, y: 34, a: -1.3, s: 1.6, seite: -1, arm: 6 });
    const kerze = [C(17, 22, 18, 8, 2.4, 2.2)];
    return { gruppen: [{ p: kerze, mat: 'wachs', k: 0, tone: 0.4 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.set(18, 7, 'kohle0'); P.flamme(19, 7, 8, 2.4, 0.7); P.glow(18, 16, 12, 0.6, 'warmDim'); P.rauch(32, 10, 6, 'glutDim', 0.25); P.rauch(40, 14, 5, 'glutDim', 0.18); } };
  },
};
