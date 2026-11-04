// Bodensatz: eine Hand schwenkt ein Glas, der Satz steigt auf und darin dreht sich etwas um (ein heller Fleck).
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, armGruppen } = A;
    const glas = [Pg([[18, 4], [34, 4], [33, 29], [19, 29]], null, { b: 1.6, rd: 1 })];
    const h = hand({ x: 7, y: 22, a: -0.15, s: 1.3, seite: 1, curl: [0.8, 0.85, 0.85, 0.9], spreiz: 0.03, daumen: 0.5, daumenWinkel: 0.6, arm: 10 });
    return { gruppen: [{ p: glas, mat: 'glas', k: 0 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (let y = 10; y < 28; y++) for (let x = 19; x < 33; x++) { const i = P.info(x, y); if (i && i.mat === 'glas' && i.stufe < 4) { const v = Math.sin((x - 26) * 0.5 + y * 0.35); P.set(x, y, v > 0.5 ? 'torf2' : v > -0.2 ? 'akzent1' : 'akzent0'); } } P.set(26, 16, 'a3'); P.set(27, 16, 'a2'); P.set(26, 17, 'a2'); } };
  },
};
