// Qualm: nasses Holz auf der Glut, die Hand wedelt flach den dicken Rauch zur Seite, wo er hin soll.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, C, glutHaufen, armGruppen } = A;
    const glut = glutHaufen(14, 31, 22, 6, 7);
    const holz = [C(5, 25, 22, 24, 2.4, 2.2)];
    const h = hand({ x: 45, y: 17, a: Math.PI + 0.3, s: 1.3, seite: -1, curl: [0.05, 0.05, 0.08, 0.1], spreiz: 0.06, daumen: 0.2, arm: 10 });
    return { gruppen: [{ p: glut, mat: 'kohle', k: 0.6 }, { p: holz, mat: 'holz', k: 0, tone: -0.15 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { P.rauch(14, 14, 7, 'stoff3', 0.55); P.rauch(22, 7, 6, 'stoff2', 0.5); P.rauch(30, 4, 5, 'stoff2', 0.4); P.rauch(9, 6, 4, 'stoff1', 0.3); } };
  },
};
