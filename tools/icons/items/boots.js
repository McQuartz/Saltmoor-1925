// Gummistiefel: ein Paar hohe Stiefel, der hintere etwas versetzt, umgeschlagener Schaft,
// grobe Sohle, ein Flicken aus anderem Gummi. Wasser tropft vom Rand.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E } = A;
    const stiefel = (dx, dy) => Pg([[10 + dx, 4 + dy], [21 + dx, 4 + dy], [21.5 + dx, 30 + dy], [27 + dx, 34 + dy], [29 + dx, 38 + dy], [28 + dx, 41 + dy], [9 + dx, 41 + dy], [9 + dx, 30 + dy]], null, { b: 2, rd: 1.2 });
    const sohle = (dx, dy) => Pg([[8.5 + dx, 40 + dy], [29 + dx, 40 + dy], [29 + dx, 43 + dy], [8.5 + dx, 43 + dy]], null, { b: 0.8, rd: 0.5 });
    const rand = (dx, dy) => Pg([[9 + dx, 3 + dy], [22 + dx, 3 + dy], [22 + dx, 8 + dy], [9 + dx, 8 + dy]], null, { b: 1, rd: 0.5 });
    return {
      gruppen: [
        { p: [stiefel(13, 2), sohle(13, 2)], mat: 'gummi', k: 0, tone: -0.1 }, { p: [rand(13, 2)], mat: 'gummi', k: 0 },
        { p: [stiefel(0, 0)], mat: 'gummi', k: 0 }, { p: [sohle(0, 0)], mat: 'gummi', k: 0, tone: -0.2 }, { p: [rand(0, 0)], mat: 'gummi', k: 0, tone: 0.08 },
        { p: [E(14, 24, 3.5, 3)], mat: 'leder', k: 0 },
      ],
      details(P) {
        for (let x = 10; x < 29; x += 2) P.stufe(x, 42, -2);
        P.ritz(12, 22, 16, 26, -1);
        P.set(35, 10, 'a3'); P.set(35, 11, 'a2'); P.set(10, 9, 'a3');
      },
    };
  },
};
