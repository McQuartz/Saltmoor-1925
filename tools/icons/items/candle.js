// Schwarze Kerze: dicke schwarze Kerze in einem schlichten Eisenleuchter mit Tropfschale und Fingerring,
// rotes Wachs läuft herab. Die Flamme brennt ruhig.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, ring, C } = A;
    const kerze = [Pg([[18, 16], [29, 15], [29, 38], [18, 38]], null, { b: 2.2, rd: 0.8 })];
    const schale = [E(24, 39, 13, 3.6, null, { pf: 'bevel', hz: 0.4 })];
    const fuss = [E(24, 44, 8, 2.4, null, { pf: 'bevel', hz: 0.4 }), C(24, 40, 24, 43, 2.2, 2.2)];
    const griff = ring(39, 40, 3.6, 3.2, 1, null, {}, 10);
    const tropfen = [C(20, 17, 20, 26, 1, 1.3), C(27, 16, 27, 21, 1, 1.1), C(23, 16, 23, 31, 0.9, 1.2)];
    return {
      gruppen: [{ p: griff, mat: 'eisen', k: 0 }, { p: fuss, mat: 'eisen', k: 0 }, { p: schale, mat: 'eisen', k: 0 }, { p: kerze, mat: 'wachs', k: 0 }, { p: tropfen, mat: 'wachsrot', k: 0 }],
      details(P) {
        P.set(24, 14, 'kohle0'); P.set(24, 13, 'kohle1');
        P.glow(24, 12, 7, 0.9, 'glutDim', null, false === true);
        P.flamme(24, 13, 9, 2.4, 0.2);
      },
    };
  },
};
