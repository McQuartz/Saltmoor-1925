// Stempelkarte: schmale, hohe Stechkarte aus Karton, leicht schräg, oben die Kerbe für die Stechuhr,
// darin Zeilen mit violetten Stempeln; die letzte Zeile, für morgen, ist schon gestempelt (in der Stofffarbe).
'use strict';
module.exports = {
  form(A) {
    const { achse, apg } = A;
    const ax = achse(24, 24, -0.22);
    const karte = [apg(ax, [[-10, -21], [-3, -21], [-2, -18], [2, -18], [3, -21], [10, -21], [10, 22], [-10, 22]], null, { b: 1, rd: 0.4 })];
    return {
      gruppen: [{ p: karte, mat: 'papier', k: 0, tone: 0.08 }],
      details(P) {
        const [ka, kb] = ax.P(-8, -16), [kc, kd] = ax.P(8, -16); P.line(ka, kb, kc, kd, 'kohle1', true);
        for (let r = 0; r < 9; r++) { const q = -13 + r * 3.8; const [a, b] = ax.P(-8, q), [c, d] = ax.P(8, q); P.line(a, b, c, d, 'papier1', true); if (r < 8) { const [e, f] = ax.P(-6, q + 1.9), [g, h] = ax.P(-1 + (r % 3), q + 1.9); P.line(e, f, g, h, r === 7 ? 'a3' : 'tuch3', true); const [i, j] = ax.P(2, q + 1.9), [k, l] = ax.P(6 - (r % 2), q + 1.9); if (r < 7 && r !== 4) P.line(i, j, k, l, 'tuch3', true); } }
        const [a, b] = ax.P(0, -12), [c, d] = ax.P(0, 21); P.line(a, b, c, d, 'papier1', true);
      },
    };
  },
};
