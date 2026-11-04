// Arbeitshandschuhe: ein schwerer Lederhandschuh, gespreizt, mit Nieten über den Knöcheln und breiter Stulpe.
// Er hat sechs Finger, der sechste ist zugenäht.
'use strict';
module.exports = {
  form(A) {
    const { hand, Pg } = A;
    const h = hand({ x: 22, y: 33, a: -1.45, s: 1.9, seite: -1, curl: [0.05, 0, 0.05, 0.1], spreiz: 0.2, daumen: 0.1, daumenWinkel: 1.0, arm: 0 });
    const stulpe = [Pg([[13, 34], [31, 33], [33, 46], [11, 46]], null, { b: 1.6, rd: 0.8 })];
    const sechster = A.glied([[31, 22], [36, 18], [38, 14]], 2, 1.6, null);
    return {
      gruppen: [{ p: sechster, mat: 'leder', k: 0, tone: -0.12 }, { p: h.alle(), mat: 'leder', k: 1.2 }, { p: stulpe, mat: 'leder', k: 0, tone: 0.06 }],
      details(P) {
        for (const x of [17, 21, 25, 29]) P.set(x, 20, 'messing3');
        for (let y = 15; y < 22; y++) { if (y % 2) { P.set(35 + (21 - y) * 0.4, y, 'wolle3'); } }
        P.ritz(12, 37, 33, 36, -2); for (let x = 13; x < 33; x += 4) P.set(x, 41, 'messing2');
      },
    };
  },
};
