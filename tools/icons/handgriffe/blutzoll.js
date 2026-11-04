// Blutzoll: eine Faust über der dunklen Erde öffnet sich einen Spalt; zwei Tropfen fallen, einer ist schon versickert.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, Pg, armGruppen } = A;
    const erde = [Pg([[0, 26], [48, 25], [48, 32], [0, 32]], null, { b: 1 })];
    const f = faust({ x: 22, y: 1, a: 1.45, s: 1.35, seite: -1, arm: 6 });
    return { gruppen: [{ p: erde, mat: 'torf', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { const [x, y] = f.spitze; P.tropfen(x, y + 2); P.tropfen(x, y + 8); P.el(x, 27, 3, 1, 'akzent1', true); P.set(x, 27, 'a2'); for (const xx of [8, 15, 34, 40]) P.set(xx, 26 + (xx % 2), 'torf3'); } };
  },
};
