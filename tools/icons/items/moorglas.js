// Glas mit Moorwasser: Einmachglas mit Bügelverschluss und Gummiring, randvoll braunes Wasser,
// der Schlamm setzt sich nach oben ab statt nach unten.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C, kurve } = A;
    const glas = [Pg([[11, 14], [35, 14], [37, 18], [37, 42], [33, 45], [13, 45], [9, 42], [9, 18]], null, { b: 2.4, rd: 1.4 })];
    const deckel = [E(23, 12, 13, 3.4, null, { pf: 'bevel', hz: 0.4 })];
    const ring = [C(11, 15.5, 35, 15.5, 1.1, 1.1)];
    const buegel = [...kurve([[9, 22], [7, 13], [16, 9], [23, 9]], 0.8, 0.8, null, {}, 8), ...kurve([[37, 22], [39, 13], [30, 9], [23, 9]], 0.8, 0.8, null, {}, 8)];
    return {
      gruppen: [{ p: glas, mat: 'glas', k: 0 }, { p: ring, mat: 'rotstoff', k: 0, ohneRand: true }, { p: deckel, mat: 'glas', k: 0, tone: 0.08 }, { p: buegel, mat: 'eisen', k: 0 }],
      details(P) {
        for (let y = 18; y < 44; y++) for (let x = 11; x < 36; x++) { const i = P.info(x, y); if (!i || i.mat !== 'glas' || i.stufe >= 4) continue; P.set(x, y, y < 24 ? ((x + y) % 2 ? 'torf2' : 'torf3') : y < 27 ? ((x + y) % 2 ? 'torf1' : 'torf2') : (x * 7 + y * 3) % 11 ? 'torf1' : 'akzent2'); }
        P.set(33, 30, 'glas3'); P.set(33, 31, 'glas3'); P.set(33, 33, 'glas2');
        for (const [x, y] of [[18, 36], [26, 40], [22, 32]]) P.set(x, y, 'a3');
      },
    };
  },
};
