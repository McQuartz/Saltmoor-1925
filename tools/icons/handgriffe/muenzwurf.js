// Münzwurf: eine große Faust unten links, der Daumen eben hochgeschnellt. Rechts oben dreht sich die Münze in der
// Luft, hell an der Kante; dazwischen ihr Bogen als Reihe blasser Punkte.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, E, armGruppen } = A;
    const f = faust({ x: 3, y: 26, a: -0.45, s: 1.7, seite: -1, arm: 4 });
    const muenze = [E(37, 8, 5.4, 2.8, null, { pf: 'bevel', hz: 0.5 })];
    const kante = [E(37, 9.6, 5.4, 2.8, null, { pf: 'bevel', hz: 0.3 })];
    return { gruppen: [...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }, { p: kante, mat: 'gold', k: 0, tone: -0.1 }, { p: muenze, mat: 'gold', k: 0, tone: 0.18 }],
      details(P) {
        // Bogen der Münze: von der Daumenspitze nach oben rechts
        for (const [x, y] of [[18, 14], [21, 10], [25, 7], [29, 5]]) { P.set(x, y, 'aG'); P.set(x + 1, y, 'a2'); }
        P.set(35, 7, 'goldR2'); P.set(39, 8, 'gold3'); P.set(41, 5, 'aH'); P.set(42, 4, 'a3'); P.set(43, 6, 'a3');
      },
    };
  },
};
