// Ankerkette: schwere Glieder in einer S-Schleife, oben ein Schäkel, unten das letzte Glied mit Kratzspuren.
'use strict';
module.exports = {
  form(A) {
    const { kettenglieder, ring } = A;
    const k = kettenglieder([[33, 6], [16, 8], [8, 18], [16, 28], [32, 30], [38, 38], [28, 44]], 12, 3.4, null);
    const schaekel = ring(34, 5, 3.5, 3, 1.1, null, {}, 10, Math.PI, Math.PI * 2);
    return {
      gruppen: [{ p: schaekel, mat: 'eisen', k: 0 }, { p: k.kant, mat: 'eisen', k: 0 }, { p: k.flach, mat: 'eisen', k: 0 }],
      details(P) { const [x, y] = k.B(1); P.set(x - 1, y, 'a3'); P.set(x + 1, y + 1, 'a3'); P.set(x, y - 2, 'a2'); },
    };
  },
};
