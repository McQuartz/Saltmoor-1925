// Zündeln: Daumennagel und Streichholz; das Hölzchen flammt sofort auf, beim ersten Mal.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, C, armGruppen } = A;
    const h = hand({ x: 14, y: 28, a: -0.75, s: 1.45, seite: -1, curl: [0.5, 0.9, 0.95, 1], spreiz: 0.05, daumen: 0.1, daumenWinkel: 1.1, arm: 12 });
    const holz = [C(22, 17, 31, 9, 0.8, 0.8)];
    return { gruppen: [...armGruppen(h), { p: holz, mat: 'holzhell', k: 0 }, { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { P.set(31, 9, 'wachsrot3'); P.glow(32, 8, 6, 1, 'glutDim'); P.flamme(32, 9, 8, 2.2, 0.4); } };
  },
};
