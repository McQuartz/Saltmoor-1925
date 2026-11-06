// Gummischürze: schwere Fabrikschürze bis zu den Knöcheln, oben das Latzteil mit Nackenband,
// seitlich die Bänder. Flecken darauf, die wandern.
'use strict';
module.exports = {
  form(A) {
    const { Pg, kurve, C } = A;
    const schuerze = [Pg([[17, 10], [31, 10], [32, 20], [38, 22], [40, 46], [8, 46], [10, 22], [16, 20]], null, { b: 2.4, rd: 1 })];
    const nacken = kurve([[18, 10], [17, 3], [24, 0.5], [31, 3], [30, 10]], 0.9, 0.9, null, {}, 12);
    const baender = [C(10, 23, 3, 30, 1, 0.8), C(38, 23, 45, 28, 1, 0.8), C(3, 30, 4, 37, 0.8, 0.7)];
    return {
      gruppen: [{ p: nacken, mat: 'gummi', k: 0, ohneR2: true }, { p: baender, mat: 'gummi', k: 0 }, { p: schuerze, mat: 'gummi', k: 0 }],
      details(P) {
        for (const [x, y, r] of [[18, 30, 2.4], [29, 36, 3], [24, 24, 1.6], [14, 41, 2]]) P.el(x, y, r, r * 0.8, 'akzent1', true);
        P.set(29, 35, 'a2'); P.ritz(24, 22, 23, 45, -1); P.ritz(16, 20, 32, 20, -1);
      },
    };
  },
};
