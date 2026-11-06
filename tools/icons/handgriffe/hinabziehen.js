// Hinabziehen: aus dem Wasser greift eine Hand nach einem Stiefel und hält ihn fest. Man zieht nie allein.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg } = A;
    const stiefel = [Pg([[20, 0], [30, 0], [30, 16], [38, 18], [39, 23], [20, 23]], null, { b: 1.6, rd: 1 })];
    const wasser = [Pg([[0, 22], [48, 22], [48, 32], [0, 32]], null, { b: 0.8 })];
    const h = hand({ x: 18, y: 32, a: -1.0, s: 1.35, seite: 1, curl: [0.75, 0.8, 0.85, 0.9], spreiz: 0.05, daumen: 0.6, arm: 0 });
    return { gruppen: [{ p: stiefel, mat: 'gummi', k: 0 }, { p: wasser, mat: 'akzent', k: 0, tone: -0.4 }, { p: h.alle(), mat: 'haut', k: 1, tone: -0.05 }],
      details(P) { for (let x = 4; x < 46; x += 2) P.set(x, 22, x % 4 ? 'a2' : 'a1'); P.set(24, 21, 'a3'); P.set(14, 21, 'a3'); } };
  },
};
