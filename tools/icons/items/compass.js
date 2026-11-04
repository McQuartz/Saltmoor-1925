// Kompass, der nach unten zeigt: Messing-Taschenkompass mit Deckel und Ring, schräg liegend wie eine Scheibe.
// Die Nadel steht senkrecht aufrecht in der Dose und zeigt mit der roten Spitze nach unten.
'use strict';
module.exports = {
  form(A) {
    const { E, ring, C } = A;
    const dose = [E(24, 30, 16, 11, null, { pf: 'bevel', hz: 0.3 })];
    const deckel = [E(22, 14, 15, 6, null, { pf: 'bevel', hz: 0.35 })];
    const oese = ring(39, 24, 3.4, 3, 1, null, {}, 10);
    const nadel = [C(24, 21, 24, 29, 1.2, 0.5), C(24, 29, 24, 38, 0.5, 1.4)];
    return {
      gruppen: [{ p: deckel, mat: 'messing', k: 0, tone: -0.1 }, { p: oese, mat: 'messing', k: 0 }, { p: dose, mat: 'messing', k: 0 }, { p: nadel, mat: 'eisen', k: 0 }],
      details(P) {
        P.el(24, 30, 12.5, 8, 'papier2', true);
        for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; P.auf(24 + Math.cos(a) * 11, 30 + Math.sin(a) * 7, i % 4 ? 'papier1' : 'kohle0'); }
        P.line(24, 22, 24, 38, 'eisen2'); for (let y = 31; y < 39; y++) P.set(24, y, y > 35 ? 'fleisch3' : 'fleisch2'); P.set(24, 39, 'fleisch3');
        P.set(24, 30, 'messing3'); P.el(22, 14, 11, 3.5, 'messing1', true);
        P.set(25, 39, 'a3');
      },
    };
  },
};
