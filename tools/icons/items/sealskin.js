// Robbenfell: ein ausgebreitetes Fell, oben der Kopfteil mit Augenlöchern, seitlich die vier Flossen,
// unten die Schwanzflossen, grau gefleckt. Es atmet: die Mitte ist leicht gewölbt.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C } = A;
    const leib = [Pg([[24, 3], [30, 6], [33, 14], [34, 28], [31, 38], [24, 41], [17, 38], [14, 28], [15, 14], [18, 6]], null, { b: 4, rd: 1 })];
    const flossen = [C(15, 15, 6, 22, 2.6, 1.6), C(33, 15, 42, 22, 2.6, 1.6), C(16, 32, 9, 40, 2.4, 1.6), C(32, 32, 39, 40, 2.4, 1.6), C(24, 39, 18, 46, 2.2, 1.4), C(24, 39, 30, 46, 2.2, 1.4)];
    return {
      gruppen: [{ p: flossen, mat: 'fell', k: 0, tone: -0.1 }, { p: leib, mat: 'fell', k: 0 }],
      details(P) {
        P.set(22, 8, 'kohle0'); P.set(26, 8, 'kohle0');
        for (const [x, y] of [[20, 16], [27, 14], [23, 22], [29, 25], [19, 28], [25, 31], [21, 35], [28, 34]]) { P.stufe(x, y, -2); P.stufe(x + 1, y, -2); P.stufe(x, y + 1, -1); }
        P.glow(24, 24, 7, 0.6, 'fell3');
      },
    };
  },
};
