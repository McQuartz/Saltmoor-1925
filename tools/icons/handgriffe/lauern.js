// Lauern: aus dem Schilf und dem dunklen Wasser ragt nur eine Hand, die Finger gespreizt, still wie das Moor.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, C, Pg } = A;
    const wasser = [Pg([[0, 24], [48, 24], [48, 32], [0, 32]], null, { b: 0.8 })];
    const schilf = []; for (const x of [4, 8, 13, 33, 38, 42, 46]) schilf.push(C(x, 32, x + (x % 3) - 1, 6 + (x * 5) % 9, 0.8, 0.5));
    const h = hand({ x: 24, y: 30, a: -1.62, s: 1.35, seite: -1, curl: [0.2, 0.15, 0.2, 0.3], spreiz: 0.22, daumen: 0.3, arm: 0 });
    return { gruppen: [{ p: schilf, mat: 'torf', k: 0 }, { p: h.alle(), mat: 'haut', k: 1, tone: -0.1 }, { p: wasser, mat: 'akzent', k: 0, tone: -0.4 }],
      details(P) { for (let x = 16; x < 33; x++) if (x % 3) P.set(x, 24, 'a2'); P.set(21, 23, 'a3'); P.set(27, 23, 'a3'); } };
  },
};
