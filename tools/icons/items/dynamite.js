// Dynamit: drei Stangen, mit Draht zum Bündel geschnürt, schräg gestellt. Aus der mittleren ringelt
// sich die Lunte, die schon einmal brannte, am Ende ein einzelner Funke.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, kurve } = A;
    const ax = achse(13, 40, -0.95);
    const st = [acap(ax, 0, -4.6, 24, -4.6, 2.6, 2.6), acap(ax, 1, 4.6, 25, 4.6, 2.6, 2.6), acap(ax, -1, 0, 26, 0, 2.7, 2.7)];
    const [ex, ey] = ax.P(26.5, 0);
    const lunte = kurve([[ex, ey], [ex + 5, ey - 6], [ex + 1, ey - 11], [ex + 7, ey - 13]], 0.9, 0.8, null, {}, 12);
    return {
      gruppen: [{ p: [st[0]], mat: 'rotstoff', k: 0 }, { p: [st[1]], mat: 'rotstoff', k: 0 }, { p: [st[2]], mat: 'rotstoff', k: 0 }, { p: lunte, mat: 'wolle', k: 0, ohneR2: true }],
      details(P) {
        for (const t of [5, 19]) { const [a, b] = ax.P(t, -7.5), [c, d] = ax.P(t, 7.5); P.line(a, b, c, d, 'eisen3', true); const [x, y] = ax.P(t, 0); P.set(x, y, 'eisenR2'); }
        for (const q of [-4.6, 0, 4.6]) { const [x, y] = ax.P(12, q); P.set(x, y, 'papier2'); P.set(x + 1, y, 'papier2'); }
        const [fx, fy] = lunte.B(1); P.set(fx + 1, fy - 1, 'flammeKern'); P.set(fx + 2, fy - 1, 'flamme'); P.set(fx + 1, fy - 2, 'flamme'); P.set(fx + 3, fy - 3, 'flammeHell');
      },
    };
  },
};
