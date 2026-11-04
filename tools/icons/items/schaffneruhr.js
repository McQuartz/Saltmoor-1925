// Taschenuhr des Schaffners: dicke Eisenbahneruhr mit offenem Gesicht, großer Krone und Bügel,
// an einer kurzen Kette hängt die Schaffnerpfeife. Variante der Taschenuhr: kein Deckel, dafür Pfeife.
'use strict';
module.exports = {
  form(A) {
    const { E, C, ring, kettenglieder, achse, acap } = A;
    const gehaeuse = [E(20, 28, 13, 13, null, { pf: 'bevel', hz: 0.25 })];
    const krone = [C(20, 15, 20, 12, 2.4, 2.4)];
    const buegel = ring(20, 9, 4.2, 3.6, 1.1, null, {}, 10);
    const kette = kettenglieder([[23, 6], [31, 3], [38, 8], [39, 16]], 6, 1.5, null);
    const ax = achse(39, 18, 1.25);
    const pfeife = [acap(ax, 0, 0, 14, 0, 2.6, 2.4), acap(ax, 11, 0, 14, 0, 3.4, 3.4)];
    return {
      gruppen: [{ p: [...kette.flach, ...kette.kant], mat: 'stahl', k: 0 }, { p: pfeife, mat: 'messing', k: 0.8 }, { p: buegel, mat: 'stahl', k: 0 }, { p: krone, mat: 'stahl', k: 0 }, { p: gehaeuse, mat: 'stahl', k: 0 }],
      details(P) {
        P.el(20, 28.5, 10.5, 10.5, 'papier3', true); P.el(20, 28.5, 9, 9, 'papier2', true);
        for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; P.set(20 + Math.cos(a) * 8.4, 28.5 + Math.sin(a) * 8.4, i % 3 ? 'kohle1' : 'kohle0'); }
        P.line(20, 28, 13, 26, 'kohle0'); P.line(20, 28, 22, 21, 'kohle0'); P.set(20, 28, 'a3');
        P.el(20, 33, 2.4, 2.4, 'papier1', true);
        const [x, y] = ax.P(4, 0); P.set(x, y, 'kohle0');
      },
    };
  },
};
