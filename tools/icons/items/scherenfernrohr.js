// Scherenfernrohr: zwei lange Rohre als V gespreizt wie Hörner, unten das Gelenk mit den zwei Okularen
// und dem Stativstummel. Oben in den Objektiven sieht etwas zurück.
'use strict';
module.exports = {
  form(A) {
    const { C, E, Pg } = A;
    const rohrL = [C(21, 30, 8, 5, 2.6, 2.2)], rohrR = [C(27, 30, 40, 5, 2.6, 2.2)];
    const koepfe = [C(8, 6, 7, 3, 2.8, 2.8), C(40, 6, 41, 3, 2.8, 2.8)];
    const gelenk = [Pg([[17, 28], [31, 28], [32, 36], [16, 36]], null, { b: 1.6, rd: 1.2 })];
    const okulare = [C(19, 36, 18, 41, 1.8, 1.8), C(29, 36, 30, 41, 1.8, 1.8)];
    const stativ = [C(24, 36, 24, 47, 1.6, 1.6)];
    return {
      gruppen: [{ p: stativ, mat: 'holz', k: 0 }, { p: [...rohrL, ...rohrR, ...koepfe], mat: 'gruenstoff', k: 0.8 }, { p: gelenk, mat: 'gruenstoff', k: 0, tone: 0.06 }, { p: okulare, mat: 'gummi', k: 0 }, { p: [E(24, 32, 2, 2)], mat: 'messing', k: 0 }],
      details(P) { P.set(7, 3, 'a3'); P.set(41, 3, 'a3'); P.set(7, 4, 'a2'); P.set(41, 4, 'a2'); for (const y of [12, 18, 24]) { P.stufe(12 + (y - 12) * 0.5, y, -1); P.stufe(36 - (y - 12) * 0.5, y, -1); } },
    };
  },
};
