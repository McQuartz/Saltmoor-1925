// Kratzen: eine große, verkrampfte Hand mit langen, hellen Nägeln zieht drei frische Furchen in ein Stück Brett.
// Die Nägel wachsen hier unten schneller.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, armGruppen } = A;
    const brett = [Pg([[4, 23], [34, 19], [36, 30], [6, 32]], null, { b: 1.4 })];
    const h = hand({ x: 44, y: 2, a: 2.35, s: 1.75, seite: -1, curl: [0.45, 0.5, 0.45, 0.4], spreiz: 0.16, daumen: 0.5, arm: 4, krumm: 0.8 });
    return { gruppen: [{ p: brett, mat: 'holzhell', k: 0, tone: 0.05 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (const [x0, y0] of [[7, 27], [9, 29], [11, 31]]) { P.line(x0, y0 - 1, x0 + 15, y0 - 5, 'holz0', true); P.line(x0, y0, x0 + 15, y0 - 4, 'holzhellR1', true); } for (const [x, y] of h.spitzen) { P.set(x, y, 'knochenR2'); P.set(x + 0.7, y + 0.7, 'knochen3'); } } };
  },
};
