// Siegel des Abts: eine dicke Bleibulle an einer geflochtenen Schnur, schräg, mit dem Relief eines
// aufgeschlagenen Buchs und einer Umschrift aus Punkten.
'use strict';
module.exports = {
  form(A) {
    const { E, kurve } = A;
    const bulle = [E(26, 29, 14, 13, null, { pf: 'bevel', hz: 0.25 })];
    const schnur = [...kurve([[23, 17], [16, 6], [26, 1], [30, 8], [28, 17]], 1.2, 1.2, null, { cr: true }, 16), ...kurve([[25, 40], [22, 45], [17, 47]], 1, 0.8, null, {}, 6), ...kurve([[27, 40], [31, 45], [34, 47]], 1, 0.8, null, {}, 6)];
    return {
      gruppen: [{ p: schnur, mat: 'rotstoff', k: 0 }, { p: bulle, mat: 'stein', k: 0, tone: 0.06 }],
      details(P) {
        for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; P.stufe(26 + Math.cos(a) * 10.5, 29 + Math.sin(a) * 9.6, -2); }
        // aufgeschlagenes Buch
        P.line(19, 26, 26, 28, 'stein3', true); P.line(26, 28, 33, 26, 'stein3', true); P.line(19, 26, 19, 33, 'stein3', true); P.line(33, 26, 33, 33, 'stein3', true);
        P.line(19, 33, 26, 35, 'stein0', true); P.line(26, 35, 33, 33, 'stein0', true); P.line(26, 28, 26, 35, 'stein0', true);
        P.set(22, 30, 'a2'); P.set(30, 30, 'a2');
      },
    };
  },
};
