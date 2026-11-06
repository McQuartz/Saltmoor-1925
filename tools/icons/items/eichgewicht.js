// Das Eichgewicht: ein Messinggewicht in der klassischen Form, aufrechter Zylinder mit Hals und Knauf, im Gegenlicht.
// Auf dem Knauf der Eichstempel; der Glanz an der oberen Kante in der Farbe des Stoffs.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C } = A;
    const leib = [Pg([[11, 24], [37, 24], [37, 41], [11, 41]], null, { b: 2.5, rd: 1.5 }), E(24, 41, 13, 4, null, { pf: 'bevel', hz: 0.3 })];
    const deckel = [E(24, 24, 13, 4.4, null, { pf: 'bevel', hz: 0.4 })];
    const hals = [C(24, 22, 24, 15, 3.6, 3)];
    const knauf = [E(24, 11, 6, 5, null, { pf: 'bevel', hz: 0.6 })];
    return {
      gruppen: [{ p: leib, mat: 'messing', k: 1 }, { p: deckel, mat: 'messing', k: 0, tone: 0.15 }, { p: hals, mat: 'messing', k: 0 }, { p: knauf, mat: 'messing', k: 0, tone: 0.1 }],
      details(P) {
        for (let i = 0; i < 20; i++) { const a = Math.PI * 1.05 + i / 19 * Math.PI * 0.9; P.auf(24 + Math.cos(a) * 12.4, 24 + Math.sin(a) * 4, i % 3 ? 'a3' : 'a4'); }
        P.el(24, 10.5, 2.2, 1.6, 'messing0', true); P.set(25, 10, 'a4');
        for (let k = 0; k < 5; k++) P.stufe(17 + k * 3, 33, -2);
        P.line(34, 27, 34, 41, 'a2', true);
        for (const [x, y] of [[15, 42], [21, 44], [30, 43]]) P.stufe(x, y, +1);
      },
    };
  },
};
