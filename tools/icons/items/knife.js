// Fischmesser: kurzes, breites Ausnehmermesser mit Hakenspitze, Holzgriff mit drei Nieten,
// die Klinge vom Schleifen hohl. Liegt schräg, Schneide nach unten.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg } = A;
    const ax = achse(7, 39, -0.72);
    const griff = [apg(ax, [[0, -2.6], [16, -2.9], [17, 2.9], [0, 2.4], [-1.2, 0]], null, { b: 1.8, rd: 1 })];
    const zwinge = [apg(ax, [[16, -3.2], [18.5, -3.2], [18.5, 3.2], [16, 3.2]], null, { b: 0.8 })];
    const klinge = [apg(ax, [[18, -3], [37, -3.2], [42, -1.5], [44, 1], [40, 3.8], [33, 5.6], [24, 5], [18, 3]], null, { b: 1.4 })];
    return {
      gruppen: [{ p: griff, mat: 'holz', k: 0 }, { p: zwinge, mat: 'eisen', k: 0 }, { p: klinge, mat: 'stahl', k: 0 }],
      details(P) {
        for (const t of [4, 8.5, 13]) { const [x, y] = ax.P(t, 0); P.set(x, y, 'messing3'); }
        // Schliff-Linie und Wate (Schneide hell, entlang der Unterkante)
        for (let t = 20; t < 40; t++) { const [x, y] = ax.P(t, 2.2 + (t - 20) * 0.04); P.stufe(x, y, -1); }
        const [a, b] = ax.P(28, 4.6); P.set(a, b, 'a3');
      },
    };
  },
};
