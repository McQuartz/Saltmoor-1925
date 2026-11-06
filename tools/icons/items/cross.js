// Silberkreuz: Standkreuz aus Silber mit verbreiterten Enden auf einem kleinen Stufensockel,
// die Punze auf dem Fuß. Schräg gedreht, damit das Randlicht die Kanten zeichnet.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, Pg } = A;
    const ax = achse(24, 38, -Math.PI / 2 + 0.12);
    const stamm = [apg(ax, [[0, -2.4], [30, -2.4], [34, -3.6], [34, 3.6], [30, 2.4], [0, 2.4]], null, { b: 1.6 })];
    const balken = [apg(ax, [[20, -12], [22, -10.5], [22, 10.5], [20, 12], [26, 12], [24, 10.5], [24, -10.5], [26, -12]], null, { b: 1.6 })];
    const sockel = [Pg([[14, 39], [34, 39], [36, 43], [12, 43]], null, { b: 1.2, rd: 0.4 }), Pg([[18, 35.5], [30, 35.5], [31, 39.5], [17, 39.5]], null, { b: 1.2, rd: 0.4 })];
    return {
      gruppen: [{ p: sockel, mat: 'silber', k: 0, tone: -0.08 }, { p: [...stamm, ...balken], mat: 'silber', k: 0.5 }],
      details(P) { const [x, y] = ax.P(23, 0); P.set(x, y, 'a3'); P.set(19, 41, 'silber1'); P.set(20, 41, 'silber1'); for (let t = 3; t < 30; t++) { const [a, b] = ax.P(t, 0); P.stufe(a, b, -1); } },
    };
  },
};
