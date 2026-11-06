// Salzflinte: kurze Doppelflinte schräg, Holzschaft unten links, zwei Läufe, Hahn gespannt.
// Vor der Mündung rieseln ein paar Salzkörner.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap } = A;
    const ax = achse(4, 40, -0.62);
    const schaft = [apg(ax, [[0, -1], [14, -3.5], [18, -3], [18, 2.5], [14, 3], [6, 7.5], [0, 7]], null, { b: 2, rd: 1 })];
    const system = [apg(ax, [[16, -4], [24, -4], [24, 2], [16, 2.5]], null, { b: 1.2 })];
    const lauf1 = [acap(ax, 22, -2.8, 47, -2.8, 1.6, 1.5)];
    const lauf2 = [acap(ax, 22, 0.3, 46, 0.3, 1.6, 1.5)];
    const hahn = [acap(ax, 19, -4, 17, -7, 0.9, 0.8)];
    const buegel = A.ring(...ax.P(19.5, 3.5), 2.4, 2.4, 0.7, null, {}, 8, 0, Math.PI);
    return {
      gruppen: [{ p: schaft, mat: 'holz', k: 0 }, { p: lauf2, mat: 'eisen', k: 0 }, { p: lauf1, mat: 'eisen', k: 0 }, { p: [...system, ...hahn], mat: 'eisen', k: 0.6 }, { p: buegel, mat: 'eisen', k: 0, ohneR2: true }],
      details(P) {
        const [mx, my] = ax.P(48, -1.2);
        for (const [dx, dy] of [[2, -1], [3, 2], [1, 3], [-1, 4]]) P.set(mx + dx, my + dy, 'a4');
        for (let k = 0; k < 3; k++) { const [x, y] = ax.P(8 + k * 2, 3); P.stufe(x, y, -1); }
      },
    };
  },
};
