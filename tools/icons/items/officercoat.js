// Offiziersmantel: tailliert, Stehkragen, Schulterstücke mit Fransen, zwei Reihen Messingknöpfe,
// ein Riss im Futter an der Seite. Kürzer und strenger als Woll- und Trenchmantel.
'use strict';
module.exports = {
  form(A) {
    const { mantel, E, Pg } = A;
    const m = mantel({ cx: 24, y0: 12, y1: 44, sb: 11, sb2: 13, aerm: 24, aw: 3.3, kragen: 'steh', aermSpreiz: 2 });
    const taille = [Pg([[11, 25], [14, 27], [14, 31], [11, 33]], null), Pg([[37, 25], [34, 27], [34, 31], [37, 33]], null)];
    const epau = [E(12.5, 12, 5, 2.2, null, { pf: 'bevel', hz: 0.5 }), E(35.5, 12, 5, 2.2, null, { pf: 'bevel', hz: 0.5 })];
    const riss = [Pg([[31, 34], [35, 36], [33, 41]], null, { b: 0.6 })];
    return {
      gruppen: [{ p: m.aermelL, mat: 'gruenstoff', k: 0 }, { p: m.koerper, mat: 'gruenstoff', k: 0 }, { p: m.aermelR, mat: 'gruenstoff', k: 0 }, { p: m.kragen, mat: 'gruenstoff', k: 0, tone: 0.1 }, { p: epau, mat: 'messing', k: 0 }, { p: riss, mat: 'rotstoff', k: 0, ohneRand: true }],
      details(P) {
        for (const y of [17, 22, 27, 32, 37]) { P.set(20, y, 'messing3'); P.set(28, y, 'messing3'); P.set(28, y - 1, 'a3'); }
        P.ritz(24, 14, 24, 43, -2); P.ritz(14, 28, 34, 28, -1);
        for (const x of [8, 10, 12, 14, 16]) { P.set(x, 14, 'messing2'); P.set(x, 15, 'messing1'); } for (const x of [32, 34, 36, 38, 40]) { P.set(x, 14, 'messing2'); P.set(x, 15, 'messing1'); }
        // Taille: eingezogen (Pixel an den Seiten weg)
        void taille;
      },
    };
  },
};
