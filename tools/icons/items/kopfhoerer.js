// Kopfhörer der Station: der Bügel aus Federstahl als Bogen, zwei Muscheln aus Bakelit mit Kupferring,
// in der vorderen Muschel glimmt es in der Farbe des Stoffs; das Kabel hängt herab und rollt sich.
'use strict';
module.exports = {
  form(A) {
    const { C, E, ring } = A;
    const buegel = ring(24, 24, 16, 15, 1.6, null, {}, 16, Math.PI * 1.05, Math.PI * 1.95);
    const hinten = [E(38, 26, 5, 7, null, { pf: 'bevel', hz: 0.6 })];
    const vorn = [E(10, 28, 7, 8.5, null, { pf: 'bevel', hz: 0.6 })];
    const ringV = ring(10, 28, 5.6, 7, 0.9, null, {}, 16);
    const kabel = [C(12, 36, 16, 42, 1, 1), C(16, 42, 26, 44, 1, 1), C(26, 44, 32, 40, 1, 1), C(32, 40, 28, 37, 1, 1), C(28, 37, 24, 40, 0.9, 0.9)];
    return {
      gruppen: [{ p: hinten, mat: 'kohle', k: 0, tone: -0.1 }, { p: buegel, mat: 'stahl', k: 0 }, { p: kabel, mat: 'kupfer', k: 0 }, { p: vorn, mat: 'kohle', k: 0, tone: 0.1 }, { p: ringV, mat: 'kupfer', k: 0 }],
      details(P) {
        P.el(10, 28, 3.2, 4.2, 'kohle0', true); P.glow(10, 28, 6, 0.9, 'a2', 'a1');
        P.set(10, 28, 'a5'); P.set(10, 27, 'a4'); P.set(9, 29, 'a3'); P.set(11, 29, 'a3');
        for (let i = 0; i < 5; i++) P.auf(9 + (i % 2), 25 + i * 1.5, i % 2 ? 'a2' : 'kohle0');
        P.set(40, 23, 'kohleR2'); P.stufe(37, 21, +1, true);
      },
    };
  },
};
