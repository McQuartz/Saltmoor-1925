// Glas mit Moorwasser: Einmachglas mit Bügelverschluss und Gummiring, randvoll braunes Wasser,
// der Schlamm setzt sich nach oben ab statt nach unten.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C, kurve } = A;
    const glas = [Pg([[13, 18], [33, 18], [40, 28], [40, 40], [35, 46], [11, 46], [6, 40], [6, 28]], null, { b: 2.4, rd: 2 })];
    const deckel = [E(23, 16, 11, 3.4, null, { pf: 'bevel', hz: 0.4 })];
    const ring = [C(13, 19, 33, 19, 1.1, 1.1)];
    const buegel = [...kurve([[8, 30], [6, 12], [16, 3], [23, 3]], 0.9, 0.9, null, {}, 10), ...kurve([[38, 30], [40, 12], [30, 3], [23, 3]], 0.9, 0.9, null, {}, 10)];
    return {
      gruppen: [{ p: glas, mat: 'glas', k: 0 }, { p: ring, mat: 'rotstoff', k: 0, ohneRand: true }, { p: deckel, mat: 'glas', k: 0, tone: 0.08 }, { p: buegel, mat: 'eisen', k: 0, ohneR2: true, tone: 0.1 }],
      details(P) {
        for (let y = 21; y < 46; y++) for (let x = 7; x < 40; x++) { const i = P.info(x, y); if (!i || i.mat !== 'glas' || i.stufe >= 4 || !P.get(x - 1, y) || !P.get(x, y + 1) || !P.get(x + 1, y) || !P.get(x, y - 1)) continue; P.set(x, y, y < 26 ? ((x + y) % 2 ? 'torf2' : 'torf3') : y < 29 ? ((x + y) % 2 ? 'torf1' : 'torf2') : (x * 7 + y * 3) % 11 ? 'torf1' : 'akzent2'); }
        // Glaswand unten und links im Schatten (Gegenlicht kommt von oben rechts)
        for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) { const i = P.info(x, y); if (i && i.mat === 'glas' && i.stufe < 4 && (!P.get(x - 1, y) || !P.get(x, y + 1)) && P.get(x + 1, y) && P.get(x, y - 1)) P.set(x, y, 'glas1'); }
        P.set(36, 32, 'glas3'); P.set(36, 33, 'glas3'); P.set(36, 35, 'glas2');
        for (const [x, y] of [[18, 36], [26, 40], [22, 32]]) P.set(x, y, 'a3');
      },
    };
  },
};
