// Gefrorenes Fahnentuch: eine Fahne, steif gefroren mitten im Wehen, an einer kurzen Stange; die Falten stehen
// wie Bretter, an der Unterkante hängen Eiszapfen. Eine Stelle wölbt sich, als atme etwas dahinter.
'use strict';
module.exports = {
  form(A) {
    const { C, Pg, E } = A;
    const stange = [C(8, 46, 9, 3, 1.3, 1.2), E(9, 3, 2, 2, null, { pf: 'bevel', hz: 0.5 })];
    const tuch = [Pg([[9, 6], [18, 9], [27, 5], [36, 9], [45, 6], [43, 16], [45, 27], [36, 24], [27, 28], [18, 25], [9, 28]], null, { b: 2.4, rd: 0.4 })];
    const zapfen = [C(18, 25, 18, 31, 1, 0.4), C(27, 28, 27, 35, 1.1, 0.4), C(36, 24, 36, 29, 1, 0.4), C(13, 27, 13, 31, 0.8, 0.3)];
    return {
      gruppen: [{ p: stange, mat: 'holz', k: 0 }, { p: tuch, mat: 'blaustoff', k: 0 }, { p: zapfen, mat: 'glas', k: 0, tone: 0.2 }],
      details(P) {
        for (const x of [18, 27, 36]) { P.ritz(x, x === 27 ? 6 : 9, x, x === 27 ? 27 : 24, -2); P.ritz(x + 1, 9, x + 1, 23, +1); }
        P.glow(30, 16, 4, 0.8, 'blaustoff3');
        for (const [x, y] of [[12, 12], [22, 15], [40, 12], [33, 20]]) P.set(x, y, 'a3');
      },
    };
  },
};
