// Letzter Tropfen: zwei Finger halten eine fast leere Phiole kopfüber; ein einzelner, sehr roter Tropfen hängt an der Öffnung.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, achse, apg, armGruppen } = A;
    const ax = achse(28, 2, 1.45);
    const phiole = [apg(ax, [[0, -3.2], [13, -3.2], [16, -1.4], [19, -1.4], [19, 1.4], [16, 1.4], [13, 3.2], [0, 3.2]], null, { b: 1.2, rd: 0.8 })];
    const h = hand({ x: 12, y: 8, a: 0.05, s: 1.3, seite: 1, curl: [0.5, 0.6, 0.9, 1], spreiz: 0.05, daumen: 0.5, daumenWinkel: 0.5, arm: 12 });
    return { gruppen: [...armGruppen(h), { p: phiole, mat: 'glas', k: 0 }, { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { const [x, y] = ax.P(20.5, 0); P.set(x, y, 'a2'); P.set(x, y + 1, 'a3'); P.set(x, y + 2, 'aG'); const [a, b] = ax.P(15, 0); P.set(a, b, 'a1'); P.set(a, b + 1, 'a2'); P.el(29, 30, 3, 0.8, 'akzent1'); } };
  },
};
