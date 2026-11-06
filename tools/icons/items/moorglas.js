// Glas mit Moorwasser: ein gedrungenes Einmachglas, breiter als hoch, gläserner Deckel mit rotem Gummiring und
// einer Federklammer darüber. Randvoll braunes Wasser; der Schlamm setzt sich oben ab statt unten (dunkle Schicht oben).
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C } = A;
    const glas = [Pg([[12, 15], [36, 15], [39, 20], [39, 42], [35, 46], [13, 46], [9, 42], [9, 20]], null, { b: 2.4, rd: 1.6 })];
    const ring = [C(11, 14, 37, 14, 1.4, 1.4)];
    const deckel = [E(24, 11, 14, 3.4, null, { pf: 'bevel', hz: 0.4 })];
    const klammer = [C(17, 7, 31, 7, 1.2, 1.2), C(17, 7, 16, 11, 1, 1), C(31, 7, 32, 11, 1, 1)];
    return {
      gruppen: [{ p: glas, mat: 'glas', k: 0 }, { p: deckel, mat: 'glas', k: 0, tone: 0.1 }, { p: ring, mat: 'rotstoff', k: 0, tone: 0.15 }, { p: klammer, mat: 'eisen', k: 0, tone: 0.1 }],
      details(P) {
        for (let y = 17; y < 46; y++) for (let x = 9; x < 40; x++) { const i = P.info(x, y); if (!i || i.mat !== 'glas' || i.stufe >= 4 || !P.get(x - 1, y) || !P.get(x, y + 1) || !P.get(x + 1, y)) continue; P.set(x, y, y < 24 ? ((x + y) % 2 ? 'torf0' : 'torf1') : (x * 7 + y * 3) % 13 ? 'torf2' : 'akzent3'); }
        for (let x = 10; x < 39; x++) if (P.info(x, 24)) P.set(x, 24, x % 3 ? 'torf3' : 'a2');
        for (let y = 26; y < 43; y++) P.set(34, y, y % 4 ? 'glas3' : 'glasR1');
        for (let y = 17; y < 47; y++) for (let x = 0; x < 48; x++) { const i = P.info(x, y); if (i && i.mat === 'glas' && i.stufe < 4 && (!P.get(x - 1, y) || !P.get(x, y + 1))) P.set(x, y, 'glas1'); }
      },
    };
  },
};
