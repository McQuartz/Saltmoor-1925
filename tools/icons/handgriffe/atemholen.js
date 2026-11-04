// Atemholen: eine Faust drückt gegen die Brust, dahinter schlägt das Herz schneller als die Angst (Glühen).
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, Pg, armGruppen } = A;
    const brust = [Pg([[10, 32], [12, 4], [26, 0], [40, 3], [44, 32]], null, { b: 2, rd: 2 })];
    const f = faust({ x: 9, y: 24, a: -0.35, s: 1.5, seite: 1, arm: 12 });
    return { gruppen: [{ p: brust, mat: 'stoff', k: 0 }, ...armGruppen(f, 'wolle'), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.glow(28, 14, 9, 1, 'rotstoff3', 'rotstoff2'); P.set(28, 13, 'fleisch3'); P.ritz(26, 2, 27, 31, -1); } };
  },
};
