// Rum: Zwiebelflasche aus dunklem Glas, gedrungen und bauchig, schräg gekippt, langer Hals mit Wachssiegel,
// eine Schnur um den Hals. Der Pegel steht zu hoch, die Luftblase oben ist zu klein.
'use strict';
module.exports = {
  form(A) {
    const { E, achse, acap, kurve } = A;
    const ax = achse(21, 32, -0.55);
    const bauch = [E(21, 32, 13, 11, null, { pf: 'bevel', hz: 0.3 })];
    const hals = [acap(ax, 8, 0, 23, 0, 4.2, 2.6)];
    const siegel = [acap(ax, 22.5, 0, 26, 0, 3.6, 3.4)];
    const [sx, sy] = ax.P(15, 0);
    const schnur = kurve([[sx - 2, sy - 3], [sx + 6, sy + 2], [sx + 7, sy + 10], [sx + 4, sy + 16]], 0.7, 0.6, null, {}, 10);
    return {
      gruppen: [{ p: [...bauch, ...hals], mat: 'glas', k: 3, tone: -0.12 }, { p: siegel, mat: 'wachsrot', k: 0 }, { p: schnur, mat: 'wolle', k: 0, ohneR2: true }],
      details(P) {
        for (let y = 20; y < 44; y++) for (let x = 8; x < 36; x++) { const i = P.info(x, y); if (i && i.mat === 'glas' && i.stufe < 4 && Math.hypot((x - 21) / 12, (y - 32) / 10) < 1 && y > 24 - (x - 21) * 0.3) P.set(x, y, (x * 3 + y) % 7 ? 'akzent0' : 'akzent1'); }
        for (let x = 12; x < 32; x++) { const y = Math.round(24 - (x - 21) * 0.3); P.auf(x, y, 'a2'); }
        P.set(14, 26, 'glas3'); P.set(13, 27, 'glas3'); const [kx, ky] = ax.P(26, 0); P.set(kx, ky, 'wachsrot3');
      },
    };
  },
};
