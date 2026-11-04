// Polarlicht im Glas: eine Kugel aus schwarzem Glas auf einem kleinen Holzfuß; darin weht ein grüner Lichtvorhang
// in senkrechten Falten, oben Glanzpunkt.
'use strict';
module.exports = {
  form(A) {
    const { E, Pg } = A;
    const kugel = [E(24, 21, 16, 16, null, { pf: 'bevel', hz: 0.3 })];
    const fuss = [Pg([[13, 36], [35, 36], [38, 44], [10, 44]], null, { b: 1.6, rd: 0.8 })];
    return {
      gruppen: [{ p: fuss, mat: 'holz', k: 0 }, { p: kugel, mat: 'glas', k: 0, tone: -0.3 }],
      details(P) {
        for (let x = 12; x < 37; x++) { const w = Math.sin(x * 0.55) * 3 + Math.sin(x * 0.21) * 2; const y0 = Math.round(16 + w), y1 = Math.round(26 + w * 0.6 + Math.sin(x * 0.9)); for (let y = y0; y <= y1; y++) { const i = P.info(x, y); if (!i || i.stufe >= 4 || Math.hypot(x - 24, y - 21) > 13.5) continue; const v = (y - y0) / (y1 - y0 + 1); P.set(x, y, v < 0.2 ? 'gruenstoffR2' : (x + y) % 3 === 0 ? 'gruenstoffR1' : v < 0.6 ? 'gruenstoff3' : 'gruenstoff2'); } }
        P.set(30, 11, 'glasR2'); P.set(31, 12, 'glas3'); P.ritz(12, 38, 36, 38, -1);
      },
    };
  },
};
