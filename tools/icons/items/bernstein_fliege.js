// Bernstein mit Fliege: ein polierter, tropfenförmiger Bernstein an einer Lederschnur durch ein gebohrtes Loch;
// darin, warm erleuchtet, eine Fliege mit ausgebreiteten Flügeln.
'use strict';
module.exports = {
  form(A) {
    const { Pg, kurve, E } = A;
    const stein = [Pg([[24, 9], [32, 17], [36, 28], [33, 39], [24, 44], [15, 39], [12, 28], [16, 17]], null, { b: 3.5, rd: 2 })];
    const schnur = kurve([[22, 11], [16, 2], [32, 1], [26, 11]], 0.8, 0.8, null, { cr: true }, 14);
    void E;
    return {
      gruppen: [{ p: schnur, mat: 'leder', k: 0 }, { p: stein, mat: 'akzent', k: 0, tone: -0.35 }],
      details(P) {
        P.set(24, 12, 'kohle0'); P.glow(24, 28, 10, 1, 'a4', 'a3');
        // Fliege: Leib, Kopf, zwei Flügel
        P.line(24, 25, 24, 32, 'kohle0'); P.set(24, 24, 'kohle1'); P.set(23, 24, 'kohle0'); P.set(25, 24, 'kohle0');
        P.line(23, 27, 19, 24, 'a1'); P.line(23, 28, 18, 27, 'a1'); P.line(25, 27, 29, 24, 'a1'); P.line(25, 28, 30, 27, 'a1');
        for (const [x, y] of [[21, 32], [27, 32], [20, 30], [28, 30]]) P.set(x, y, 'kohle1');
        P.set(30, 18, 'aH'); P.set(31, 19, 'a4');
      },
    };
  },
};
