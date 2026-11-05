// Kreidekreis: eine Hand zieht mit einem Stück Kreide einen Kreis auf den Boden; er schließt sich von selbst.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, C, armGruppen } = A;
    const f = faust({ x: 36, y: 6, a: 2.0, s: 1.3, seite: 1, arm: 10 });
    const kreide = [C(30, 16, 28, 21, 1, 1)];
    return { gruppen: [...armGruppen(f), { p: kreide, mat: 'papier', k: 0, tone: 0.2 }, { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { for (let a = 0; a < 6.1; a += 0.05) { const x = 22 + Math.cos(a) * 18, y = 25 + Math.sin(a) * 5; P.set(x, y, a > 5.4 ? 'a3' : 'papierR2'); } } };
  },
};
