// Ölmantel: kurze, steife Fischerjacke aus gelbem Ölzeug, Kapuze mit Bindeband, Kordelzug am Saum,
// breite Ärmel. Gleiche Grundform wie der Wollmantel, aber kurz, mit Kapuze und glänzenden Knicken.
'use strict';
module.exports = {
  form(A) {
    const { mantel, C } = A;
    const m = mantel({ cx: 24, y0: 15, y1: 41, sb: 10, sb2: 14, aerm: 22, aw: 4.4, kragen: 'kapuze', aermSpreiz: 5 });
    const band = [C(21, 20, 20, 27, 0.6, 0.6), C(27, 20, 28, 26, 0.6, 0.6)];
    return {
      gruppen: [{ p: m.aermelL, mat: 'oelzeug', k: 0 }, { p: m.koerper, mat: 'oelzeug', k: 0 }, { p: m.aermelR, mat: 'oelzeug', k: 0 }, { p: m.kragen, mat: 'oelzeug', k: 0 }, { p: band, mat: 'wolle', k: 0, ohneR2: true }],
      details(P) {
        P.el(23, 10, 3.6, 4.5, 'oelzeug0', true);
        // harte Knickfalten: helle Kante neben dunkler Rinne
        for (const [x0, y0, x1, y1] of [[17, 25, 15, 38], [31, 24, 33, 38], [24, 26, 24, 40]]) { P.ritz(x0, y0, x1, y1, -2); P.ritz(x0 + 1, y0, x1 + 1, y1, +1); }
        for (let x = 12; x < 38; x += 3) P.stufe(x, 39, -2);
        P.set(29, 33, 'a3'); P.set(29, 34, 'a2');
      },
    };
  },
};
