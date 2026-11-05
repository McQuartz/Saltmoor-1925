// Ansteckung: eine große, offene Hand mit der Fläche nach vorn, darauf breiten sich grüne Flecken aus, an den Fingern
// schon dicht; eine Fliege sitzt auf dem Ballen. Was einer hat, haben bald alle im Haus.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, armGruppen } = A;
    const h = hand({ x: 22, y: 32, a: -1.45, s: 1.75, seite: 1, curl: [0.05, 0, 0.05, 0.1], spreiz: 0.16, daumen: 0.2, arm: 4 });
    return { gruppen: [...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) {
        for (const [x, y, r] of [[22, 20, 2.4], [27, 23, 1.8], [19, 25, 1.5], [25, 15, 1.4], [29, 12, 1.2], [20, 12, 1.3], [16, 18, 1.2]]) { P.el(x, y, r, r, 'akzent2', true); P.set(x, y, 'a3'); }
        P.set(33, 24, 'kohle0'); P.set(34, 24, 'kohle0'); P.set(32, 23, 'glas3'); P.set(35, 23, 'glas3');
      } };
  },
};
