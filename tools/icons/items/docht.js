// Docht der Erhörten: ein gedrehter Docht ohne Kerze, in einer losen S-Kurve, schwebend wie ein Faden,
// an der Spitze brennt er, unten ein paar erstarrte Wachstropfen.
'use strict';
module.exports = {
  form(A) {
    const { kurve, E } = A;
    const docht = kurve([[16, 46], [12, 36], [22, 30], [28, 22], [24, 16]], 1.6, 1.3, null, { cr: true }, 24);
    const tropfen = [E(17, 45, 3.2, 2.2, null, { pf: 'bevel', hz: 0.6 }), E(14, 39, 1.6, 1.6, null, { pf: 'bevel', hz: 0.6 })];
    return {
      gruppen: [{ p: docht, mat: 'wolle', k: 0 }, { p: tropfen, mat: 'wachs', k: 0, tone: 0.25 }],
      details(P) {
        for (let k = 0; k < 14; k++) { const [x, y] = docht.B(k / 14); P.stufe(x + (k % 2), y, -1); }
        P.set(24, 16, 'kohle0'); P.set(24, 15, 'glutMittel');
        P.glow(24, 11, 7, 0.8, 'glutDim'); P.flamme(24, 15, 11, 2.8, -0.2);
      },
    };
  },
};
