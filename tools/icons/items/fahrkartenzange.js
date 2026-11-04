// Fahrkartenzange: Lochzange des Schaffners, zwei geschwungene Griffe offen, vorn das Maul mit dem Locheisen.
// Ein ausgestanztes Plättchen fällt heraus.
'use strict';
module.exports = {
  form(A) {
    const { kurve, apg, achse, E } = A;
    const g1 = kurve([[24, 18], [16, 26], [10, 36], [6, 44]], 1.9, 1.6, null, {}, 12);
    const g2 = kurve([[26, 20], [27, 30], [24, 38], [22, 46]], 1.9, 1.6, null, {}, 12);
    const ax = achse(25, 19, -0.85);
    const maul = [apg(ax, [[-3, -3.5], [12, -4], [17, -2], [17, 2], [3, 4], [-3, 3.5]], null, { b: 1.4, rd: 0.6 })];
    const kopf = [E(...ax.P(13, -5), 3, 2.6, null, { pf: 'bevel', hz: 0.5 })];
    const gelenk = [E(25, 19, 2.6, 2.6, null, { pf: 'bevel', hz: 0.5 })];
    return {
      gruppen: [{ p: g2, mat: 'eisen', k: 0 }, { p: g1, mat: 'eisen', k: 0 }, { p: [...maul, ...kopf], mat: 'stahl', k: 0.8 }, { p: gelenk, mat: 'messing', k: 0 }],
      details(P) {
        const [x, y] = ax.P(13, 0); P.set(x, y, 'kohle0'); P.set(x + 1, y, 'kohle0');
        P.set(x + 4, y + 6, 'papier3'); P.set(x + 5, y + 6, 'papier2');
        for (let k = 0; k < 4; k++) { const [a, b] = g1.B(0.4 + k * 0.15); P.stufe(a, b, -1); }
      },
    };
  },
};
