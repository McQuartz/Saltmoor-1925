// Patronengurt des Lotsen: ein breiter Ledergurt quer durchs Bild, darauf in einer Reihe die Messingpatronen in Schlaufen,
// alle gleich ausgerichtet, die letzte Schlaufe leer; am einen Ende die große Messingschnalle mit Dorn.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap } = A;
    const ax = achse(3, 34, -0.42);
    const gurt = [apg(ax, [[0, -3.6], [46, -3.6], [46, 3.6], [0, 3.6]], null, { b: 1.2, rd: 0.4 })];
    const schlaufen = [], patronen = [], spitzen = [];
    for (let i = 0; i < 9; i++) { const t = 9 + i * 4.2; schlaufen.push(apg(ax, [[t - 1.6, -4], [t + 1.6, -4], [t + 1.6, 1.5], [t - 1.6, 1.5]], null, { b: 0.6 })); if (i < 8) { patronen.push(acap(ax, t, -4, t, -11, 1.5, 1.5)); spitzen.push(acap(ax, t, -11, t, -13.5, 1.3, 0.7)); } }
    const schnalle = [apg(ax, [[-1, -5.2], [6, -5.2], [6, 5.2], [-1, 5.2]], null, { b: 1, rd: 0.6 })];
    return {
      gruppen: [{ p: gurt, mat: 'leder', k: 0 }, { p: patronen, mat: 'messing', k: 0 }, { p: spitzen, mat: 'kupfer', k: 0 }, { p: schlaufen, mat: 'leder', k: 0, tone: 0.08 }, { p: schnalle, mat: 'messing', k: 0 }],
      details(P) {
        { const [a, b] = ax.P(0.8, -3.8), [c, d] = ax.P(0.8, 3.8); P.line(a, b, c, d, 'kohle0', true); const [e, f] = ax.P(0.8, 0), [g, h] = ax.P(5, 0); P.line(e, f, g, h, 'messing3', true); }
        for (let i = 0; i < 9; i++) { const [x, y] = ax.P(9 + i * 4.2, -2); P.stufe(x, y, -1); }
        const [lx, ly] = ax.P(9 + 8 * 4.2, -1.5); P.set(lx, ly, 'kohle0');
        const [kx, ky] = ax.P(9 + 3 * 4.2, -12); P.set(kx, ky, 'a3');
      },
    };
  },
};
