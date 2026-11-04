// Gummistiefel: ein Paar hohe Stiefel, der hintere etwas versetzt, umgeschlagener Schaft,
// grobe Sohle, ein Flicken aus anderem Gummi. Wasser tropft vom Rand.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E } = A;
    const stiefel = (dx, dy) => Pg([[5 + dx, 8 + dy], [14 + dx, 8 + dy], [14.5 + dx, 33 + dy], [20 + dx, 36 + dy], [22 + dx, 40 + dy], [21 + dx, 43 + dy], [4 + dx, 43 + dy], [4 + dx, 33 + dy]], null, { b: 2, rd: 1.2 });
    const sohle = (dx, dy) => Pg([[3.5 + dx, 42 + dy], [22 + dx, 42 + dy], [22 + dx, 45 + dy], [3.5 + dx, 45 + dy]], null, { b: 0.8, rd: 0.5 });
    const rand = (dx, dy) => Pg([[4 + dx, 7 + dy], [15 + dx, 7 + dy], [15 + dx, 12 + dy], [4 + dx, 12 + dy]], null, { b: 1, rd: 0.5 });
    return {
      gruppen: [
        { p: [stiefel(17, -3), sohle(17, -3)], mat: 'gummi', k: 0, tone: -0.1 }, { p: [rand(17, -3)], mat: 'gummi', k: 0 },
        { p: [stiefel(0, 0)], mat: 'gummi', k: 0 }, { p: [sohle(0, 0)], mat: 'gummi', k: 0, tone: -0.2 }, { p: [rand(0, 0)], mat: 'gummi', k: 0, tone: 0.08 },
        { p: [E(9, 26, 3, 2.6)], mat: 'leder', k: 0 },
      ],
      details(P) {
        for (let x = 5; x < 22; x += 2) P.stufe(x, 44, -2);
        P.ritz(6, 22, 10, 30, -1);
        P.set(36, 6, 'a3'); P.set(36, 7, 'a2'); P.set(6, 13, 'a3'); P.set(6, 14, 'a2');
      },
    };
  },
};
