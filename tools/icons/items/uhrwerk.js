// Offenes Uhrwerk: ohne Gehäuse und Zifferblatt, eine durchbrochene Platine mit drei ineinandergreifenden
// Rädern verschiedener Größe und der Unruh mit Spirale oben. Kleinteilig, anders als das große Gezeitenrad.
'use strict';
module.exports = {
  form(A) {
    const { zahnrad, E, ring, Pg } = A;
    const platine = [Pg([[8, 20], [20, 8], [36, 10], [42, 26], [34, 40], [16, 42], [6, 32]], null, { b: 1.4, rd: 1 })];
    const r1 = [zahnrad(19, 29, 9, 14, 2)], r2 = [zahnrad(32, 30, 5.5, 10, 1.8)], r3 = [zahnrad(29, 18, 4, 8, 1.6)];
    const unruh = ring(17, 13, 6, 6, 1, null, {}, 14);
    const steine = [E(19, 29, 1.6, 1.6), E(32, 30, 1.4, 1.4), E(29, 18, 1.2, 1.2)];
    return {
      gruppen: [{ p: platine, mat: 'messing', k: 0, tone: -0.3 }, { p: r1, mat: 'messing', k: 0 }, { p: r2, mat: 'stahl', k: 0 }, { p: r3, mat: 'messing', k: 0 }, { p: unruh, mat: 'stahl', k: 0 }, { p: steine, mat: 'akzent', k: 0, tone: 0.2 }],
      details(P) {
        for (let a = 0; a < 12; a += 0.25) { const r = 0.6 + a * 0.35; P.auf(17 + Math.cos(a) * r, 13 + Math.sin(a) * r, 'stahl3'); }
        for (const [x, y, r] of [[19, 29, 5.5]]) for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4; P.el(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, 1.6, 1.6, 'messing0', true); }
        P.set(18, 28, 'aH');
      },
    };
  },
};
