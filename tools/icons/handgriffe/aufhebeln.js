// Aufhebeln: ein Brecheisen steckt im Spalt zwischen zwei Steinen, die Hand drückt es mit ganzem Gewicht nieder.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, Pg, C, kurve, armGruppen } = A;
    const s1 = [Pg([[0, 22], [20, 20], [21, 32], [0, 32]], null, { b: 2, rd: 0.6 })], s2 = [Pg([[22, 23], [48, 21], [48, 32], [23, 32]], null, { b: 2, rd: 0.6 })];
    const eisen = [C(38, 6, 22, 25, 1.4, 1.4), ...kurve([[22, 25], [20, 27], [23, 29]], 1.3, 1, null, {}, 5)];
    const f = faust({ x: 33, y: 2, a: 0.9, s: 1.4, seite: 1, arm: 10 });
    return { gruppen: [{ p: s1, mat: 'stein', k: 0 }, { p: s2, mat: 'stein', k: 0, tone: -0.05 }, { p: eisen, mat: 'eisen', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.set(21, 21, 'a3'); P.line(21, 22, 22, 31, 'kohle0'); } };
  },
};
