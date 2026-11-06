// Weihen: ein Daumen zeichnet ein Kreuz; wo er war, glimmt es golden. Drei Kreuze, mit Daumen und Spucke.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, armGruppen } = A;
    const h = hand({ x: 10, y: 28, a: -0.6, s: 1.4, seite: -1, curl: [0.85, 0.9, 0.95, 1], spreiz: 0.03, daumen: 0, daumenWinkel: 0.5, arm: 12 });
    return { gruppen: [...armGruppen(h, 'tuch'), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { const [dx, dy] = h.daumenSpitze; P.line(dx + 3, dy - 6, dx + 3, dy + 2, 'a3'); P.line(dx, dy - 3, dx + 6, dy - 3, 'a3'); P.set(dx + 3, dy - 3, 'aH'); for (const [x, y] of [[36, 8], [42, 14]]) { P.line(x, y - 3, x, y + 3, 'a1'); P.line(x - 2, y - 1, x + 2, y - 1, 'a1'); } } };
  },
};
