// Standhalten: zwei Stiefel fest auf den Fliesen, breitbeinig, die Schuhspitzen nach außen. Wie der Küster 1912.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { Pg } = A;
    const fliesen = [Pg([[0, 24], [48, 24], [48, 32], [0, 32]], null, { b: 0.6 })];
    const st = (x, s) => Pg([[x - 3, 0], [x + 3, 0], [x + 3.5, 18], [x + s * 10, 21], [x + s * 11, 25], [x - s * 4, 25], [x - 3.5, 18]], null, { b: 1.6, rd: 1 });
    return { gruppen: [{ p: fliesen, mat: 'stein', k: 0, tone: -0.1 }, { p: [st(14, -1)], mat: 'leder', k: 0 }, { p: [st(34, 1)], mat: 'leder', k: 0 }],
      details(P) { for (let x = 0; x < 48; x += 6) for (let y = 25; y < 32; y++) if (((x / 6) + (y > 28 ? 1 : 0)) % 2) P.auf(x + (y % 3 === 0 ? 1 : 0), y, 'stein1'); for (let x = 0; x < 48; x += 6) P.line(x, 25, x - 2, 31, 'stein0', true); P.line(0, 28, 48, 28, 'stein0', true); P.set(24, 23, 'a3'); } };
  },
};
