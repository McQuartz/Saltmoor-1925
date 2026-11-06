// Weihwasser: flache, runde Pilgerflasche aus Glas mit Kreuz in Relief und Korken, an einer Schnur.
// Das Wasser darin steht schief, obwohl die Flasche gerade steht.
'use strict';
module.exports = {
  form(A) {
    const { E, C, kurve } = A;
    const flasche = [E(24, 29, 14, 14, null, { pf: 'bevel', hz: 0.3 })];
    const hals = [C(24, 16, 24, 9, 3.2, 2.8)];
    const korken = [C(24, 8, 24, 4, 3.2, 3)];
    const schnur = kurve([[21, 11], [10, 8], [8, 20], [11, 26]], 0.7, 0.7, null, {}, 10);
    return {
      gruppen: [{ p: schnur, mat: 'wolle', k: 0, ohneR2: true }, { p: [...flasche, ...hals], mat: 'glas', k: 1.5 }, { p: korken, mat: 'holz', k: 0 }],
      details(P) {
        // schiefes Wasser: Spiegel kippt nach rechts oben
        for (let y = 15; y < 44; y++) for (let x = 10; x < 39; x++) { const i = P.info(x, y); if (!i || i.mat !== 'glas' || i.stufe >= 4) continue; const sp = 28 - (x - 24) * 0.55; if (y > sp && Math.hypot(x - 24, y - 29) < 12) P.set(x, y, y < sp + 1.5 ? 'b3' : (x + y) % 4 ? 'akzent1' : 'akzent2'); }
        P.line(24, 22, 24, 37, 'b3', true); P.line(19, 27, 29, 27, 'b3', true);
        P.set(31, 21, 'glas3'); P.set(32, 22, 'glas3');
      },
    };
  },
};
