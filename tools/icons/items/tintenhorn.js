// Tintenhorn: ein gebogenes Kuhhorn als Tintenfass, die Spitze nach unten rechts, oben offen mit
// schwarzgrüner Eisengallustinte, die über den Rand gelaufen ist. Ein Lederriemen zum Umhängen.
'use strict';
module.exports = {
  form(A) {
    const { kurve, E } = A;
    const horn = kurve([[14, 12], [16, 30], [28, 40], [42, 38]], 7, 1.2, null, {}, 18);
    const rand = [E(14, 11, 7.5, 3.6, null, { pf: 'bevel', hz: 0.4 })];
    const riemen = kurve([[8, 14], [3, 26], [12, 36], [22, 37]], 0.9, 0.9, null, {}, 12);
    return {
      gruppen: [{ p: riemen, mat: 'leder', k: 0, ohneR2: true }, { p: horn, mat: 'knochen', k: 0 }, { p: rand, mat: 'knochen', k: 0, tone: 0.08 }],
      details(P) {
        P.el(14, 11, 5.6, 2.2, 'akzent0', true); P.set(16, 10, 'a3');
        for (const [x, y] of [[19, 14], [19, 15], [20, 16], [20, 17], [20, 19]]) P.auf(x, y, 'akzent1');
        for (let k = 0; k < 6; k++) { const [x, y] = horn.B(0.2 + k * 0.12); P.stufe(x, y - 1, -1); P.stufe(x + 1, y + 1, -1); }
      },
    };
  },
};
