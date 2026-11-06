// Schüren: die Hand stochert mit dem Schürhaken in der Glut, bis sie antwortet (Funken an der Spitze).
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, C, glutHaufen, armGruppen } = A;
    const glut = glutHaufen(26, 31, 30, 8, 2);
    const f = faust({ x: 12, y: 10, a: 0.55, s: 1.3, seite: 1, arm: 12 });
    const haken = [C(14, 9, 31, 26, 1, 1), C(31, 26, 34, 24, 0.9, 0.8)];
    return { gruppen: [{ p: glut, mat: 'kohle', k: 0.6 }, { p: haken, mat: 'eisen', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.glow(31, 26, 4, 1.2, 'flamme', 'glutMittel'); for (const [x, y] of [[36, 19], [33, 17], [38, 15]]) P.set(x, y, 'flammeHell'); } };
  },
};
