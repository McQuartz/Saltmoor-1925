// Läutwerk: eine Faust zieht am Glockenseil, oben schlagen drei Glocken nacheinander an.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, Pg, C, armGruppen } = A;
    const glocke = (x, y, s) => Pg([[x - 2 * s, y], [x + 2 * s, y], [x + 3 * s, y + 5 * s], [x + 4 * s, y + 6 * s], [x - 4 * s, y + 6 * s], [x - 3 * s, y + 5 * s]], null, { b: 1.2, rd: 0.6 });
    const balken = [C(2, 2, 46, 2, 1.4, 1.4)];
    const seil = [C(12, 10, 14, 24, 0.8, 0.8), C(26, 9, 26, 12, 0.6, 0.6), C(38, 8, 38, 11, 0.6, 0.6)];
    const f = faust({ x: 22, y: 30, a: -2.2, s: 1.2, seite: 1, arm: 6 });
    return { gruppen: [{ p: balken, mat: 'holz', k: 0 }, { p: [glocke(12, 3, 1.1), glocke(26, 3, 0.95), glocke(38, 3, 0.8)], mat: 'messing', k: 0 }, { p: seil, mat: 'wolle', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { for (const [x, y] of [[18, 7], [31, 6], [42, 5]]) P.set(x, y, 'a3'); } };
  },
};
