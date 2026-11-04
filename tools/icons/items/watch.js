// Taschenuhr: Savonnette mit aufgeklapptem Sprungdeckel (links), Krone und Bügel oben, an der Uhrkette.
// Der Zeiger steht falsch herum.
'use strict';
module.exports = {
  form(A) {
    const { E, ring, C, kettenglieder } = A;
    const gehaeuse = [E(28, 28, 12, 12, null, { pf: 'bevel', hz: 0.25 })];
    const deckel = [E(12, 26, 6, 11.5, null, { pf: 'bevel', hz: 0.3 })];
    const krone = [C(28, 15, 28, 13, 2, 2)];
    const buegel = ring(28, 10, 3.6, 3.2, 1, null, {}, 10);
    const kette = kettenglieder([[30, 7], [36, 4], [42, 6], [44, 12]], 6, 1.6, null);
    return {
      gruppen: [{ p: deckel, mat: 'gold', k: 0, tone: -0.1 }, { p: [...kette.flach, ...kette.kant], mat: 'gold', k: 0 }, { p: buegel, mat: 'gold', k: 0 }, { p: krone, mat: 'gold', k: 0 }, { p: gehaeuse, mat: 'gold', k: 0 }],
      details(P) {
        P.el(28, 28.5, 9.5, 9.5, 'papier3', true); P.el(28, 28.5, 8, 8, 'papier2', true);
        for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; P.set(28 + Math.cos(a) * 7.6, 28.5 + Math.sin(a) * 7.6, 'kohle1'); }
        P.line(28, 28, 28, 35, 'kohle0'); P.line(28, 28, 24, 26, 'kohle0'); P.set(28, 28, 'a3');
        P.el(12, 26, 3.5, 8, 'gold1', true);
      },
    };
  },
};
