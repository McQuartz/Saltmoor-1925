// Wollmantel: langer, gerader Mantel aus grober Wolle, breiter Umlegekragen (Revers), eine Knopfreihe,
// aufgesetzte Tasche mit dem Zettel, der herausschaut. Grundform wie der Ölmantel, aber lang und gerade.
'use strict';
module.exports = {
  form(A) {
    const { mantel, Pg, kurve, C } = A;
    const m = mantel({ cx: 24, y0: 11, y1: 47, sb: 9, sb2: 12, aerm: 26, aw: 3.6, kragen: 'revers' });
    // Kleiderbügel aus Holz mit Drahthaken: der Mantel hängt, statt zu stehen
    const haken = kurve([[24, 9], [24, 4], [27, 1.5], [29, 4]], 0.8, 0.7, null, {}, 8);
    const buegel = [C(12, 12, 24, 8.5, 1.4, 1.4), C(24, 8.5, 36, 12, 1.4, 1.4)];
    const tasche = [Pg([[27, 29], [33, 29], [33, 35], [27, 35]], null, { b: 0.8 })];
    return {
      gruppen: [{ p: haken, mat: 'eisen', k: 0 }, { p: buegel, mat: 'holz', k: 0 }, { p: m.aermelL, mat: 'wolle', k: 0 }, { p: m.koerper, mat: 'wolle', k: 0 }, { p: m.aermelR, mat: 'wolle', k: 0 }, { p: m.kragen, mat: 'wolle', k: 0, tone: 0.08 }, { p: tasche, mat: 'wolle', k: 0, tone: -0.1 }],
      details(P) {
        P.ritz(24, 20, 24, 45, -2);
        for (const y of [21, 27, 33, 39]) P.set(22, y, 'holz3');
        P.set(29, 28, 'papier3'); P.set(30, 28, 'papier3'); P.set(30, 27, 'papier2');
        for (const y of [21, 27, 33, 39]) P.set(22, y + 2, 'holz3');
        for (let y = 12; y < 46; y += 2) { P.stufe(13 + (y % 4 ? 1 : 0), y, -1); }
      },
    };
  },
};
