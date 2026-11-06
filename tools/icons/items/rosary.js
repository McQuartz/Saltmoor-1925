// Rosenkranz: Perlenschnur als hängende Schlaufe, unten das Mittelstück und ein kleines Kruzifix.
// Neunundfünfzig Perlen, beim Beten sechzig.
'use strict';
module.exports = {
  form(A) {
    const { perlen, C, E } = A;
    const schlaufe = perlen([[22, 30], [10, 22], [10, 8], [24, 3], [36, 9], [36, 22], [26, 30]], 22, 1.6, null);
    const mittel = [E(24, 32, 2.4, 2.2, null, { pf: 'bevel', hz: 0.5 })];
    const kette = perlen([[24, 34], [24, 38]], 3, 1.3, null);
    const kreuz = [C(24, 38, 24, 47, 1.3, 1.3), C(20, 41.5, 28, 41.5, 1.2, 1.2)];
    return {
      gruppen: [{ p: schlaufe, mat: 'holz', k: 0 }, { p: kette, mat: 'holz', k: 0 }, { p: mittel, mat: 'silber', k: 0 }, { p: kreuz, mat: 'silber', k: 0.8 }],
      details(P) { P.set(24, 42, 'a3'); P.set(24, 41, 'a2'); },
    };
  },
};
