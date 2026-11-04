// Teerfackel: eiserner Feuerkorb aus vier Bändern auf einem kurzen Stiel, voll Teer, der in schwarzen
// Tropfen herabläuft. Die Flamme brennt hell und freundlich (Licht), anders als die Fackel.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, apg, C } = A;
    const ax = achse(15, 46, -1.18);
    const stiel = [acap(ax, 0, 0, 24, 0, 1.9, 1.9)];
    const teer = [apg(ax, [[22, -4], [33, -6.5], [34, 6.5], [22, 4]], null, { b: 2, rd: 1 })];
    const korb = [acap(ax, 21, -3.5, 34, -7.2, 0.9, 0.9), acap(ax, 21, 3.5, 34, 7.2, 0.9, 0.9), acap(ax, 21, 0, 34, 0, 0.8, 0.8), acap(ax, 33.5, -7.5, 33.5, 7.5, 1, 1), acap(ax, 27, -5.3, 27, 5.3, 0.9, 0.9)];
    const tropfen = [acap(ax, 23, 4.2, 18, 5.2, 1, 0.8), acap(ax, 26, -4.8, 21, -5.4, 0.9, 0.7), acap(ax, 21, 0, 15, 1.6, 1, 0.8)];
    return {
      gruppen: [{ p: stiel, mat: 'holz', k: 0 }, { p: [...teer, ...tropfen], mat: 'kohle', k: 1.5 }, { p: korb, mat: 'eisen', k: 0, ohneR2: false }],
      details(P) {
        const [fx, fy] = ax.P(33, 0); P.glow(fx, fy + 2, 9, 1.2, 'glutMittel', 'glutDim');
        P.flamme(fx + 1, fy + 2, 15, 5.5, 0.4); P.set(fx + 1, fy - 2, 'b4');
        const [sx, sy] = ax.P(35, 6); P.set(sx + 4, sy - 12, 'flammeHell'); P.set(sx - 6, sy - 15, 'flamme');
      },
    };
  },
};
