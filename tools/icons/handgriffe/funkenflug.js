// Funkenflug: ein Holzscheit, dagegen schlägt die Faust mit einem Stock, und die Funken stieben nach rechts oben.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, C, glutHaufen, armGruppen } = A;
    const glut = glutHaufen(22, 31, 26, 6, 4);
    const scheit = [C(10, 24, 30, 21, 3, 2.8)];
    const f = faust({ x: 9, y: 6, a: 0.2, s: 1.25, seite: 1, arm: 10 });
    const stock = [C(14, 7, 26, 18, 1.1, 1)];
    return { gruppen: [{ p: glut, mat: 'kohle', k: 0.6 }, { p: scheit, mat: 'holz', k: 0 }, { p: stock, mat: 'holz', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.glow(27, 19, 3, 1.2, 'flamme', 'glutMittel'); for (const [x, y, c] of [[31, 15, 'flammeKern'], [34, 12, 'flammeHell'], [37, 8, 'flamme'], [40, 11, 'flammeHell'], [42, 5, 'flamme'], [36, 4, 'glutMittel'], [45, 8, 'glutMittel'], [33, 9, 'flamme']]) P.set(x, y, c); } };
  },
};
