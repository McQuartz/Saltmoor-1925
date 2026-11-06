// Durch die Zähne: eine Zahnreihe oben und unten zwischen dunklen Lippen, fest um einen Lederriemen gebissen.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { kurve, C, E } = A;
    const oberlippe = kurve([[4, 14], [14, 7], [34, 6], [44, 13]], 3, 3, null, {}, 14);
    const unterlippe = kurve([[5, 18], [15, 26], [33, 26], [43, 18]], 3, 3, null, {}, 14);
    const riemen = [C(0, 16, 48, 15.5, 2, 2)];
    const zaehne = []; for (let i = 0; i < 8; i++) { const x = 10 + i * 4, d = Math.abs(x - 24) * 0.12; zaehne.push(E(x, 11.5 + d, 1.6, 2.3, null, { pf: 'bevel', hz: 0.5 }), E(x + 1, 20 - d, 1.6, 2.2, null, { pf: 'bevel', hz: 0.5 })); }
    return { gruppen: [{ p: riemen, mat: 'leder', k: 0 }, { p: zaehne, mat: 'knochen', k: 0, tone: 0.05 }, { p: [...oberlippe, ...unterlippe], mat: 'fleisch', k: 1, tone: -0.15 }],
      details(P) { P.tropfen(21, 24); P.tropfen(29, 28, 'a1', 'a2'); P.set(30, 31, 'a2'); } };
  },
};
