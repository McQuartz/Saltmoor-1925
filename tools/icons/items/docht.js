// Docht der Erhörten: ein gedrehter Docht ohne Kerze, in einer losen S-Kurve, schwebend wie ein Faden,
// an der Spitze brennt er, unten ein paar erstarrte Wachstropfen.
'use strict';
module.exports = {
  form(A) {
    const { kurve, E } = A;
    const docht = kurve([[14, 46], [8, 36], [22, 30], [32, 22], [25, 14]], 2.4, 1.8, null, { cr: true }, 24);
    const tropfen = [E(16, 45, 5, 2.8, null, { pf: 'bevel', hz: 0.6 }), E(9, 39, 2.2, 2.2, null, { pf: 'bevel', hz: 0.6 }), E(30, 26, 1.8, 1.8, null, { pf: 'bevel', hz: 0.6 })];
    return {
      gruppen: [{ p: docht, mat: 'wolle', k: 0 }, { p: tropfen, mat: 'wachs', k: 0, tone: 0.25 }],
      details(P) {
        for (let k = 0; k < 14; k++) { const [x, y] = docht.B(k / 14); P.stufe(x + (k % 2), y, -1); }
        P.set(25, 14, 'kohle0'); P.set(25, 13, 'glutMittel');
        P.glow(25, 10, 8, 0.8, 'glutDim'); P.flamme(25, 13, 12, 3.2, -0.2);
      },
    };
  },
};
