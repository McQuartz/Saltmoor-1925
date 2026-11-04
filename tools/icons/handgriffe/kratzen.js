// Kratzen: eine verkrampfte Hand mit langen Nägeln zieht drei frische Furchen über ein Brett.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, armGruppen } = A;
    const brett = [Pg([[0, 20], [48, 14], [48, 32], [0, 32]], null, { b: 1.4 })];
    const h = hand({ x: 33, y: 7, a: 2.2, s: 1.4, seite: -1, curl: [0.6, 0.65, 0.6, 0.55], spreiz: 0.16, daumen: 0.5, arm: 16, krumm: 0.8 });
    return { gruppen: [{ p: brett, mat: 'holz', k: 0 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (const [x0, x1] of [[10, 22], [12, 25], [15, 28]]) { P.line(x0, 25 + (x0 - 10) * 0.3, x1, 21 + (x0 - 10) * 0.4, 'holz0', true); P.line(x0, 26 + (x0 - 10) * 0.3, x1, 22 + (x0 - 10) * 0.4, 'holzR1', true); } for (const [x, y] of h.spitzen) P.set(x, y, 'knochen3'); } };
  },
};
