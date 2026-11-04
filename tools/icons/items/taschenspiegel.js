// Taschenspiegel des Reisenden: eine aufgeklappte runde Messingdose, zwei Scheiben nebeneinander am Scharnier:
// links der Deckel mit Gravur, rechts der Spiegel, in dem ein Gesicht schon einen Schritt weiter ist.
'use strict';
module.exports = {
  form(A) {
    const { E, C } = A;
    const deckel = [E(14, 26, 11, 12, null, { pf: 'bevel', hz: 0.3 })];
    const spiegel = [E(35, 24, 11, 12, null, { pf: 'bevel', hz: 0.3 })];
    const scharnier = [C(24.5, 18, 24.5, 31, 1.6, 1.6)];
    return {
      gruppen: [{ p: deckel, mat: 'messing', k: 0, tone: -0.05 }, { p: scharnier, mat: 'messing', k: 0 }, { p: spiegel, mat: 'messing', k: 0 }],
      details(P) {
        P.el(35, 24, 8.5, 9.5, 'silber2', true); P.el(35, 24, 7, 8, 'silber1', true);
        P.el(37, 22, 2.8, 3.6, 'silber2', true); P.set(36, 21, 'kohle0'); P.set(38, 21, 'kohle0');
        for (let a = 0; a < 6.3; a += 0.5) P.stufe(14 + Math.cos(a) * 6, 26 + Math.sin(a) * 6.5, -2);
        P.stufe(14, 26, -2); P.set(40, 18, 'silberR2'); P.set(41, 19, 'a3');
      },
    };
  },
};
