// Abbinden: ein Gürtel ist um den Oberarm geschlungen, die andere Hand zieht ihn fest, bis die Finger kalt werden.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, C, Pg, armGruppen } = A;
    const arm = [C(0, 20, 34, 16, 4.4, 3.8)];
    const guertel = [C(18, 12, 19, 24, 1.8, 1.8)];
    const schnalle = [Pg([[16, 9], [21, 9], [21, 13], [16, 13]], null, { b: 0.6 })];
    const ende = [C(20, 10, 30, 2, 1.6, 1.6)];
    const f = faust({ x: 40, y: 2, a: 2.5, s: 1.2, seite: 1, arm: 6 });
    return { gruppen: [{ p: arm, mat: 'haut', k: 0 }, { p: guertel, mat: 'leder', k: 0 }, { p: ende, mat: 'leder', k: 0 }, { p: schnalle, mat: 'messing', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }],
      details(P) { for (let x = 22; x < 34; x += 3) P.stufe(x, 15, -1); P.line(22, 17, 32, 15, 'a1', true); } };
  },
};
