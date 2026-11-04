// Letzter Tropfen: Daumen und Zeigefinger halten eine fast leere Phiole kopfüber; ein einzelner, sehr roter Tropfen
// hängt an der Öffnung, unten auf dem Boden ein Fleck.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, armGruppen } = A;
    const phiole = [Pg([[20, 2], [28, 2], [28, 13], [25.5, 16], [25.5, 19], [22.5, 19], [22.5, 16], [20, 13]], null, { b: 1.2, rd: 0.8 })];
    const h = hand({ x: 42, y: 0, a: 2.55, s: 1.3, seite: -1, curl: [0.25, 0.85, 0.95, 1], spreiz: 0.04, daumen: 0.3, daumenWinkel: 0.9, arm: 6 });
    return { gruppen: [{ p: phiole, mat: 'glas', k: 0, tone: 0.1 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { P.set(24, 15, 'a1'); P.set(24, 16, 'a2'); P.set(24, 20, 'a2'); P.set(24, 21, 'a3'); P.set(24, 22, 'aG'); P.el(24, 30, 3.5, 1, 'akzent1'); P.set(24, 30, 'a2'); P.set(26, 4, 'glas3'); } };
  },
};
