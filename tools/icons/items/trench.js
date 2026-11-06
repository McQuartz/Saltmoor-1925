// Trenchcoat: zweireihiger Mantel mit Schulterpasse, Gürtel mit Schnalle, dessen Ende herabhängt,
// hochgestellter Kragen. Aus der Innentasche schaut die Akte.
'use strict';
module.exports = {
  form(A) {
    const { mantel, C, Pg } = A;
    const m = mantel({ cx: 24, y0: 10, y1: 46, sb: 9, sb2: 16, aerm: 25, aw: 3.6, kragen: 'hoch' });
    const guertel = [C(12, 29, 36, 29, 1.6, 1.6)], ende = [C(30, 29, 33, 39, 1.2, 1.1), C(14, 29, 8, 37, 1.2, 1.1), C(8, 37, 7, 41, 1.1, 1)];
    const schnalle = [Pg([[25, 27], [29, 27], [29, 31.5], [25, 31.5]], null, { b: 0.6 })];
    const akte = [Pg([[18, 13], [22, 12], [23, 20], [19, 21]], null, { b: 0.8 })];
    return {
      gruppen: [{ p: m.aermelL, mat: 'stoff', k: 0 }, { p: akte, mat: 'papier', k: 0 }, { p: m.koerper, mat: 'stoff', k: 0, tone: 0.06 }, { p: m.aermelR, mat: 'stoff', k: 0 }, { p: m.kragen, mat: 'stoff', k: 0, tone: 0.1 }, { p: [...guertel, ...ende], mat: 'stoff', k: 0, tone: -0.1 }, { p: schnalle, mat: 'messing', k: 0 }],
      details(P) {
        for (const y of [18, 23, 34]) { P.set(20, y, 'holz3'); P.set(28, y, 'holz3'); }
        P.ritz(15, 14, 33, 14, -1); P.ritz(26, 17, 25, 45, -2);
        P.set(27, 29, 'kohle0');
      },
    };
  },
};
