// Pegellatte des Ingenieurs: eine lange flache Messlatte, rot und weiß im Fußtakt gestrichen, mit Zoll-Strichen,
// steil schräg; unten nass und dunkel, oben ein Messingbeschlag mit Öse.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, ring } = A;
    const ax = achse(14, 46, -1.2);
    const latte = [apg(ax, [[0, -3.4], [44, -3.4], [44, 3.4], [0, 3.4]], null, { b: 1.2, rd: 0.3 })];
    const kappe = [apg(ax, [[42, -3.8], [46, -3.8], [46, 3.8], [42, 3.8]], null, { b: 0.8 })];
    const oese = ring(...ax.P(48, 0), 1.8, 1.8, 0.7, null, {}, 8);
    return {
      gruppen: [{ p: latte, mat: 'papier', k: 0, tone: -0.05 }, { p: kappe, mat: 'messing', k: 0 }, { p: oese, mat: 'messing', k: 0 }],
      details(P) {
        for (let t = 0; t < 42; t++) for (let q = -2.5; q <= 2.5; q += 1) { const [x, y] = ax.P(t, q); const i = P.info(Math.round(x), Math.round(y)); if (!i || i.stufe >= 4) continue; if (Math.floor(t / 6) % 2 === 0) P.set(x, y, i.stufe >= 2 ? 'rotstoff3' : 'rotstoff2'); }
        for (let t = 2; t < 42; t += 2) { const [x, y] = ax.P(t, -3); P.auf(x, y, 'kohle1'); if (t % 6 === 0) { const [a, b] = ax.P(t, -1.5); P.auf(a, b, 'kohle1'); } }
        for (let t = 0; t < 7; t++) for (let q = -2; q <= 2; q++) { const [x, y] = ax.P(t, q); if ((t + q) % 2) P.stufe(x, y, -1); }
        const [a, b] = ax.P(8, 3.6); P.set(a, b, 'a3');
      },
    };
  },
};
