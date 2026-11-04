// Spucken: eine Hand wischt sich über den Mund (Handrücken), ein Bogen grüner Speicheltropfen fliegt nach rechts zu Boden.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, armGruppen } = A;
    const f = faust({ x: 10, y: 22, a: -1.1, s: 1.35, seite: 1, arm: 12 });
    return { gruppen: [...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { const pts = [[18, 6], [23, 4], [28, 5], [32, 8], [36, 13], [39, 19], [41, 25]]; pts.forEach(([x, y], i) => { P.set(x, y, i % 2 ? 'a3' : 'a2'); if (i > 3) P.set(x, y - 1, 'akzent1'); }); P.set(42, 29, 'a2'); P.set(41, 29, 'a1'); P.set(43, 29, 'a1'); } };
  },
};
