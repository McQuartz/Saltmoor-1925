// Robbenfell: ein abgezogenes Fell, quer gelegt, links der Kopf mit Schnauze, Barthaaren und leeren Augen,
// zwei kurze Vorderflossen, rechts die Hinterflossen als Fächer. Grau gefleckt, in der Mitte leicht gewölbt: es atmet.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C } = A;
    const leib = [Pg([[4, 24], [9, 16], [20, 13], [33, 15], [40, 21], [40, 29], [32, 34], [18, 35], [8, 31]], null, { b: 4, rd: 1.5 })];
    const kopf = [E(9, 22, 7, 6.5, null, { pf: 'bevel', hz: 0.5 }), E(3, 25, 3, 2.6, null, { pf: 'bevel', hz: 0.5 })];
    const vorne = [C(17, 32, 13, 41, 2.4, 1.4), C(25, 33, 25, 42, 2.4, 1.4)];
    const hinten = [C(38, 24, 46, 17, 2.4, 1.6), C(46, 17, 47, 14, 1.6, 1.2), C(38, 29, 45, 36, 2.4, 1.6), C(45, 36, 47, 39, 1.6, 1.2)];
    return {
      gruppen: [{ p: [...vorne, ...hinten], mat: 'fell', k: 0, tone: -0.1 }, { p: leib, mat: 'fell', k: 0 }, { p: kopf, mat: 'fell', k: 0, tone: 0.08 }],
      details(P) {
        P.el(7, 19.5, 1.2, 1.2, 'kohle0'); P.el(11, 19.5, 1.2, 1.2, 'kohle0');
        for (const [x0, y0, x1, y1] of [[2, 25, 0, 23], [2, 26, 0, 27], [4, 27, 1, 30]]) P.line(x0, y0, x1, y1, 'fellR1');
        P.set(1, 24, 'kohle0');
        for (const [x, y] of [[16, 19], [23, 17], [29, 21], [21, 26], [33, 26], [14, 28], [27, 29]]) { P.stufe(x, y, -2); P.stufe(x + 1, y, -2); P.stufe(x, y + 1, -1); }
        P.glow(24, 24, 7, 0.6, 'fell3');
      },
    };
  },
};
