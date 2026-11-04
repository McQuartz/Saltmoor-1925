// Nachlegen: eine offene Hand legt ein Scheit quer auf die Glut, ein zweites liegt schon da.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, C, glutHaufen, armGruppen } = A;
    const glut = glutHaufen(24, 31, 34, 8, 6);
    const scheit1 = [C(8, 25, 28, 26, 2.6, 2.6)], scheit2 = [C(18, 15, 40, 19, 2.8, 2.8)];
    const h = hand({ x: 40, y: 6, a: 2.3, s: 1.3, seite: 1, curl: [0.7, 0.75, 0.8, 0.85], spreiz: 0.05, daumen: 0.6, arm: 10 });
    return { gruppen: [{ p: glut, mat: 'kohle', k: 0.6 }, { p: scheit1, mat: 'holz', k: 0 }, { p: scheit2, mat: 'holzhell', k: 0 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { P.el(18, 15, 1.4, 2, 'holzhell1', true); P.el(28, 26, 1.3, 1.8, 'holz1', true); P.set(29, 25, 'glutMittel'); } };
  },
};
