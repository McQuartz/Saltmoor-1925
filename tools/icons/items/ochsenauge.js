// Das Ochsenauge: das Mittelfeld der Gürtellinse in seinem Messingrahmen, von schräg vorn. Konzentrische
// Glasringe, Stufe um Stufe, in der Mitte ein Licht; darin, klein und vergrößert zugleich, ein Auge.
'use strict';
module.exports = {
  form(A) {
    const { E, ring, C } = A;
    const rahmen = ring(24, 24, 19, 19, 2.6, null, {}, 28);
    const glas = [E(24, 24, 17, 17, null, { pf: 'bevel', hz: 0.3 })];
    const halter = [C(24, 3, 24, 0, 1.6, 1.4), C(24, 45, 24, 47, 1.6, 1.4)];
    return {
      gruppen: [{ p: halter, mat: 'messing', k: 0 }, { p: glas, mat: 'glas', k: 0, tone: 0.1 }, { p: rahmen, mat: 'messing', k: 0 }],
      details(P) {
        for (const rr of [5, 9, 13]) for (let a = 0; a < Math.PI * 2; a += 0.03) { const x = 24 + Math.cos(a) * rr, y = 24 + Math.sin(a) * rr; P.stufe(x, y, Math.cos(a - 5.5) > 0.3 ? 3 : -2); }
        P.el(24, 24, 6.5, 3.6, 'glas0', true); P.el(24, 24, 5, 2.6, 'warmDim', true); P.el(24, 24, 3, 2.2, 'warm', true); P.set(24, 24, 'warmKern'); P.set(23, 24, 'flammeHell'); P.set(25, 24, 'flammeHell');
        P.set(31, 15, 'glasR2'); P.set(32, 16, 'glasR2');
      },
    };
  },
};
