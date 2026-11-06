// Offenes Uhrwerk: ohne Gehäuse, ein Haufen ineinandergreifender Räder verschiedener Größe, deren Zähne
// frei nach außen stehen, oben die Unruh mit ihrer Spirale. Kleinteilig, anders als das große Gezeitenrad.
'use strict';
module.exports = {
  form(A) {
    const { zahnrad, E, ring, C } = A;
    const r1 = [zahnrad(18, 30, 11, 18, 2.4)], r2 = [zahnrad(35, 33, 7, 12, 2.2)], r3 = [zahnrad(31, 16, 5, 10, 2)];
    const unruh = ring(13, 11, 6.5, 6.5, 1, null, {}, 16);
    const bruecke = [C(13, 11, 31, 16, 1.2, 1.2), C(31, 16, 35, 33, 1.2, 1.2)];
    const steine = [E(18, 30, 1.6, 1.6), E(35, 33, 1.4, 1.4), E(31, 16, 1.2, 1.2), E(13, 11, 1.2, 1.2)];
    return {
      gruppen: [{ p: r1, mat: 'messing', k: 0 }, { p: r2, mat: 'stahl', k: 0 }, { p: r3, mat: 'messing', k: 0 }, { p: unruh, mat: 'stahl', k: 0 }, { p: bruecke, mat: 'stahl', k: 0, tone: -0.1 }, { p: steine, mat: 'akzent', k: 0, tone: 0.2 }],
      details(P) {
        for (let a = 0; a < 10; a += 0.3) { const r = 0.8 + a * 0.45; P.set(13 + Math.cos(a) * r, 11 + Math.sin(a) * r, 'stahl2'); }
        for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + 0.4; P.el(18 + Math.cos(a) * 6, 30 + Math.sin(a) * 6, 1.8, 1.8, 'messing0', true); }
        P.set(17, 29, 'aH');
      },
    };
  },
};
