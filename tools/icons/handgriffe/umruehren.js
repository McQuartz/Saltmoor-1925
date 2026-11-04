// Umrühren: die Faust führt einen Stock im Tümpel im Kreis, mit der Sonne; die Ringe laufen nach außen.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, C, E, armGruppen } = A;
    const tuempel = [E(24, 25, 23, 7, null, { pf: 'flat' })];
    const stock = [C(30, 8, 22, 25, 1.1, 1)];
    const f = faust({ x: 37, y: 2, a: 2.3, s: 1.25, seite: 1, arm: 8 });
    return { gruppen: [{ p: tuempel, mat: 'akzent', k: 0, tone: -0.45 }, { p: stock, mat: 'holz', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { for (const [rx, ry, c] of [[5, 2, 'a3'], [10, 3.5, 'a2'], [16, 5, 'a1']]) for (let a = 0; a < 6.3; a += 0.12) P.auf(22 + Math.cos(a) * rx, 25 + Math.sin(a) * ry, c); } };
  },
};
