// Bodensatz: eine Hand schwenkt ein bauchiges Glas; der Satz steigt in einer Spirale auf, und darin dreht sich
// etwas um (ein heller Punkt, der zurückschaut).
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, E, C, armGruppen } = A;
    const f = faust({ x: 8, y: 18, a: -0.25, s: 1.25, seite: -1, arm: 8 });
    const glas = [E(29, 19, 10, 11, null, { pf: 'bevel', hz: 0.3 }), C(29, 8, 29, 4, 3.4, 3.4)];
    return { gruppen: [...armGruppen(f), { p: [...f.alle(), ...f.daumen], mat: 'haut', k: 1 }, { p: glas, mat: 'glas', k: 1 }],
      details(P) {
        for (let y = 9; y < 31; y++) for (let x = 19; x < 40; x++) { const i = P.info(x, y); if (!i || i.mat !== 'glas' || i.stufe >= 4 || !P.get(x - 1, y) || !P.get(x, y + 1)) continue; if (y < 13) continue; const a = Math.atan2(y - 21, x - 29), r = Math.hypot(x - 29, y - 21); const v = Math.sin(a * 2 + r * 0.7); P.set(x, y, v > 0.4 ? 'torf2' : v > -0.3 ? 'akzent1' : 'akzent0'); }
        P.set(30, 20, 'a3'); P.set(31, 20, 'aG'); P.set(36, 12, 'glas3'); P.set(37, 13, 'glas3');
      } };
  },
};
