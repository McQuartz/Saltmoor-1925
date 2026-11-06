// Harzklumpen: ein unregelmäßiger Klumpen dunklen Baumharzes, wie von einer Rinde abgebrochen (Rindenreste an der
// Unterseite); aus der Mitte läuft ein Tropfen, der noch fließt, nach unten weg.
'use strict';
module.exports = {
  form(A) {
    const { Pg, kurve, E } = A;
    const klumpen = [Pg([[8, 22], [14, 12], [24, 9], [34, 11], [41, 19], [40, 29], [32, 34], [20, 35], [10, 31]], null, { b: 4, rd: 2 })];
    const rinde = [Pg([[9, 30], [20, 34], [32, 33], [30, 37], [18, 38], [8, 35]], null, { b: 1, rd: 0.4 })];
    const lauf = kurve([[27, 33], [28, 38], [26, 42]], 2, 1.6, null, {}, 6);
    const tropfen = [E(26, 44, 2.4, 2.8, null, { pf: 'bevel', hz: 0.6 })];
    return {
      gruppen: [{ p: rinde, mat: 'holz', k: 0, tone: -0.1 }, { p: [...klumpen, ...lauf, ...tropfen], mat: 'akzent', k: 1.5, tone: -0.3 }],
      details(P) { P.glow(24, 21, 7, 1, 'a4', 'a3'); P.set(23, 20, 'aH'); for (const [x, y] of [[15, 20], [33, 24], [20, 28]]) P.stufe(x, y, -1); P.set(27, 43, 'aH'); for (let x = 10; x < 32; x += 3) P.stufe(x, 35, -2); },
    };
  },
};
