// Gegenstemmen: zwei flache Hände gegen eine Bohlentür gestemmt, die Tür ist einen Spalt offen und drückt zurück.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, armGruppen } = A;
    const tuer = [Pg([[30, 0], [44, 0], [42, 32], [30, 32]], null, { b: 1.4 })];
    const h1 = hand({ x: 12, y: 9, a: 0.0, s: 1.3, seite: -1, curl: [0, 0, 0.02, 0.05], spreiz: 0.08, daumen: 0.2, arm: 12 });
    const h2 = hand({ x: 12, y: 22, a: 0.05, s: 1.3, seite: -1, curl: [0, 0, 0.02, 0.05], spreiz: 0.08, daumen: 0.2, arm: 12 });
    return { gruppen: [{ p: tuer, mat: 'holz', k: 0 }, ...armGruppen(h1), ...armGruppen(h2), { p: h1.alle(), mat: 'haut', k: 1 }, { p: h2.alle(), mat: 'haut', k: 1 }],
      details(P) { for (const x of [35, 39]) P.ritz(x, 0, x - 0.3, 31, -2); for (let y = 2; y < 30; y += 3) P.set(45, y, 'kohle0'); P.set(46, 14, 'a2'); } };
  },
};
