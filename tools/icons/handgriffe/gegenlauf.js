// Gegenlauf: zwei Zahnräder greifen ineinander; die Hand dreht das kleine an seiner Kurbel gegen den Takt.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { zahnrad, faust, C, armGruppen } = A;
    const r1 = [zahnrad(14, 17, 10, 14, 2.4)], r2 = [zahnrad(31, 12, 6, 9, 2)];
    const kurbel = [C(31, 12, 38, 20, 1.2, 1.2), C(38, 20, 40, 18, 1.4, 1.4)];
    const f = faust({ x: 46, y: 30, a: -2.4, s: 1.15, seite: 1, arm: 6 });
    return { gruppen: [{ p: r1, mat: 'messing', k: 0 }, { p: r2, mat: 'stahl', k: 0 }, { p: kurbel, mat: 'stahl', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.el(14, 17, 3, 3, 'messing0', true); P.set(31, 12, 'a3'); P.set(14, 17, 'a2'); } };
  },
};
