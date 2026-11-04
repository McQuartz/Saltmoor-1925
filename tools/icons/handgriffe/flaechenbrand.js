// Flächenbrand: eine Fackel wird durch das trockene Schilf gezogen, und die Flammen laufen in einer Reihe davon.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, C, armGruppen } = A;
    const schilf = []; for (let x = 2; x < 48; x += 3) schilf.push(C(x, 32, x + ((x * 7) % 5) - 2, 20 + ((x * 3) % 6), 0.7, 0.5));
    const f = faust({ x: 36, y: 6, a: 2.3, s: 1.2, seite: 1, arm: 10 });
    const fackel = [C(33, 9, 24, 19, 1.2, 1.4), C(24, 19, 22, 21, 2.2, 2.2)];
    return { gruppen: [{ p: schilf, mat: 'torf', k: 0 }, { p: fackel, mat: 'holz', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { for (const [x, h] of [[22, 6], [16, 5], [10, 7], [5, 4], [28, 3]]) P.flamme(x, 26 + (x % 3), h, 1.6, 0.4); P.flamme(22, 20, 5, 1.8, 0.3); } };
  },
};
