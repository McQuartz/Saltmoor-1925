// Stempelkarte: schmale, hohe Stechkarte aus Karton, oben die Kerbe für die Stechuhr, Raster mit
// gestempelten Zeilen, die letzte Zeile ist schon gestempelt. Steckt schräg in einem Blechhalter.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg } = A;
    const ax = achse(24, 24, -0.22);
    const karte = [apg(ax, [[-9, -20], [-3, -20], [-2, -18], [2, -18], [3, -20], [9, -20], [9, 21], [-9, 21]], null, { b: 0.9, rd: 0.4 })];
    const halter = [apg(ax, [[-11, 9], [11, 9], [11, 22], [-11, 22]], null, { b: 1.4, rd: 0.6 })];
    return {
      gruppen: [{ p: karte, mat: 'papier', k: 0, tone: 0.05 }, { p: halter, mat: 'eisen', k: 0 }],
      details(P) {
        for (let r = 0; r < 7; r++) { const q = -14 + r * 3.4; const [a, b] = ax.P(-7, q), [c, d] = ax.P(7, q); P.line(a, b, c, d, 'papier1', true); if (r < 6 && r !== 3) { const [e, f] = ax.P(-5 + (r % 3), q + 1.6), [g, h] = ax.P(1 + (r % 2), q + 1.6); P.line(e, f, g, h, r === 5 ? 'a2' : 'kohle1', true); } }
        const [a, b] = ax.P(0, -21), [c, d] = ax.P(0, 9); P.line(a, b, c, d, 'papier1', true);
        for (const q of [-6, 0, 6]) { const [x, y] = ax.P(q, 15); P.set(x, y, 'eisen3'); }
      },
    };
  },
};
