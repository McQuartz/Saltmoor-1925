// Glas mit Moorwasser: ein gedrungenes Einmachglas, breiter als hoch, gläserner Deckel mit rotem Gummiring und
// einer Federklammer darüber. Randvoll braunes Wasser; der Schlamm setzt sich oben ab statt unten (dunkle Schicht oben).
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C } = A;
    const glas = [Pg([[7, 17], [41, 17], [42, 40], [38, 44], [10, 44], [6, 40]], null, { b: 2.4, rd: 1.6 })];
    const ring = [C(7, 16, 41, 16, 1.4, 1.4)];
    const deckel = [E(24, 13, 17, 3.4, null, { pf: 'bevel', hz: 0.4 })];
    const klammer = [C(24, 8, 24, 11, 1.2, 1.2), C(18, 8, 30, 8, 1.1, 1.1), C(18, 8, 13, 19, 0.9, 0.9), C(30, 8, 35, 19, 0.9, 0.9)];
    return {
      gruppen: [{ p: glas, mat: 'glas', k: 0 }, { p: deckel, mat: 'glas', k: 0, tone: 0.1 }, { p: ring, mat: 'rotstoff', k: 0, tone: 0.15 }, { p: klammer, mat: 'eisen', k: 0, tone: 0.1 }],
      details(P) {
        for (let y = 19; y < 44; y++) for (let x = 7; x < 42; x++) { const i = P.info(x, y); if (!i || i.mat !== 'glas' || i.stufe >= 4 || !P.get(x - 1, y) || !P.get(x, y + 1) || !P.get(x + 1, y)) continue; P.set(x, y, y < 25 ? ((x + y) % 2 ? 'torf0' : 'torf1') : (x * 7 + y * 3) % 13 ? 'torf2' : 'akzent3'); }
        for (let x = 8; x < 41; x++) if (P.info(x, 25)) P.set(x, 25, x % 3 ? 'torf3' : 'a2');
        for (let y = 27; y < 42; y++) P.set(36, y, y % 4 ? 'glas3' : 'glasR1');
        for (let y = 19; y < 44; y++) for (let x = 0; x < 48; x++) { const i = P.info(x, y); if (i && i.mat === 'glas' && i.stufe < 4 && (!P.get(x - 1, y) || !P.get(x, y + 1))) P.set(x, y, 'glas1'); }
      },
    };
  },
};
