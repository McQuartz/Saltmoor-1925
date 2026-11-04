// Kurkarte: eine aufgeklappte Karte aus zwei Hälften, die linke steht schräg hoch wie ein offener Deckel,
// rechts ein Raster mit runden Kurstempeln, die letzten Stempel schon gesetzt. Breit und flach, keine hohe Stechkarte.
'use strict';
module.exports = {
  form(A) {
    const { Pg } = A;
    const links = [Pg([[4, 9], [20, 18], [22, 42], [7, 34]], null, { b: 0.9, rd: 0.4 })];
    const rechts = [Pg([[20, 18], [44, 15], [45, 39], [22, 42]], null, { b: 0.9, rd: 0.4 })];
    return {
      gruppen: [{ p: links, mat: 'papier', k: 0, tone: -0.12 }, { p: rechts, mat: 'papier', k: 0, tone: 0.05 }],
      details(P) {
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const x = 27 + c * 6, y = 23 + r * 6.5; P.el(x, y, 2.2, 2.2, (r * 3 + c) > 5 ? 'a2' : 'kohle1', true); P.set(x, y, 'papier2'); }
        for (const y of [17, 21, 25]) P.line(8, y, 18, y + 5, 'papier1', true);
        P.el(13, 30, 2.6, 2.2, 'a1', true);
      },
    };
  },
};
