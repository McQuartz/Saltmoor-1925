// Kurkarte: eine aufgeklappte Karte aus zwei Hälften (wie ein kleines Heft), auf der rechten Seite
// ein Raster mit runden Kurstempeln, die letzten Stempel schon gesetzt. Breit und flach, nicht hoch wie die Stempelkarte.
'use strict';
module.exports = {
  form(A) {
    const { Pg } = A;
    const links = [Pg([[3, 16], [23, 13], [24, 37], [5, 40]], null, { b: 0.9, rd: 0.4 })];
    const rechts = [Pg([[23, 13], [44, 14], [45, 38], [24, 37]], null, { b: 0.9, rd: 0.4 })];
    return {
      gruppen: [{ p: links, mat: 'papier', k: 0, tone: -0.05 }, { p: rechts, mat: 'papier', k: 0, tone: 0.05 }],
      details(P) {
        P.ritz(23, 14, 24, 37, -2);
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const x = 29 + c * 6, y = 20 + r * 6.5; P.el(x, y, 2.2, 2.2, (r * 3 + c) > 5 ? 'a2' : 'kohle1', true); P.set(x, y, 'papier2'); }
        for (const y of [20, 24, 28]) P.line(7, y, 20, y - 1.5, 'papier1', true);
        P.el(13, 33, 3, 2.4, 'a1', true);
      },
    };
  },
};
