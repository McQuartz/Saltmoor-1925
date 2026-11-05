// Atemholen: eine große Faust drückt fest gegen die Brust (Weste mit Knopfleiste), so fest, dass die Knöchel hell werden;
// dahinter schlägt das Herz schneller als die Angst, ein rotes Glühen unter dem Stoff.
'use strict';
module.exports = {
  w: 48, h: 32, st: ['B'],
  form(A) {
    const { faust, Pg, armGruppen } = A;
    const weste = [Pg([[12, 32], [14, 12], [24, 7], [34, 12], [36, 32]], null, { b: 1.6, rd: 1 })];
    const f = faust({ x: 47, y: 28, a: -2.65, s: 1.7, seite: 1, arm: 8 });
    return { gruppen: [{ p: weste, mat: 'stoff', k: 0, tone: 0.05 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.glow(22, 17, 9, 1.1, 'a2', 'a1'); P.set(22, 17, 'a3'); P.set(21, 16, 'a4'); for (const y of [15, 21, 27]) P.set(16, y, 'messing3'); P.ritz(18, 9, 17, 31, -1); } };
  },
};
