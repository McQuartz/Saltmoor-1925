// Harpune des Echos: eine schwere Walharpune mit zweiflügeliger Kipp-Spitze, senkrechter als die einfache Harpune,
// an der Öse ein Stück Leine, das straff nach rechts gespannt bleibt, obwohl nichts daran hängt.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, apg, C } = A;
    const ax = achse(14, 46, -1.25);
    const schaft = [acap(ax, 0, 0, 30, 0, 1.7, 1.5)];
    const spitze = [apg(ax, [[30, -2], [36, -2], [45, 0], [36, 2], [30, 2]], null, { b: 1 }), apg(ax, [[33, -1.5], [39, -6], [41, -5], [36, -1]], null, { b: 0.6 }), apg(ax, [[33, 1.5], [39, 6], [41, 5], [36, 1]], null, { b: 0.6 })];
    const [ox, oy] = ax.P(29, 0);
    const leine = [C(ox, oy, 46, oy + 2, 0.8, 0.8)];
    return {
      gruppen: [{ p: leine, mat: 'wolle', k: 0 }, { p: schaft, mat: 'holz', k: 0 }, { p: spitze, mat: 'eisen', k: 0.4 }],
      details(P) { for (const t of [4, 6, 8]) { const [x, y] = ax.P(t, 0); P.stufe(x, y, -2); } P.set(46, oy + 2, 'a3'); P.set(45, oy + 1, 'a2'); },
    };
  },
};
