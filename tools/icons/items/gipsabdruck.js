// Gipsabdruck: eine flache, gebrochene Gipsplatte mit dem eingetieften Abdruck eines nackten Fußes, die Zehen
// zeigen nach oben rechts (zum Meer); an einer Ecke ist die Platte abgebrochen, Sand haftet am Rand.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, achse } = A;
    const platte = [Pg([[4, 18], [30, 6], [44, 22], [40, 34], [20, 44], [8, 36]], null, { b: 2, rd: 0.6 })];
    const ax = achse(18, 33, -0.75);
    const fuss = [E(...ax.P(0, 0), 4, 3.5), E(...ax.P(8, 0.5), 4.2, 5), E(...ax.P(15, 0), 3.6, 5.5)];
    const zehen = [[19.5, -4], [20.5, -1.4], [20.5, 1], [20, 3.2], [19, 5]].map(([t, q], i) => E(...ax.P(t, q), 1.5 - i * 0.12, 1.5 - i * 0.12));
    return {
      gruppen: [{ p: platte, mat: 'papier', k: 0, tone: 0.05 }, { p: [...fuss, ...zehen], mat: 'papier', k: 0.8, tone: -0.35, ohneRand: true }],
      details(P) { for (const [x, y] of [[8, 35], [12, 39], [38, 33], [41, 27]]) P.set(x, y, 'holzhell2'); P.ritz(30, 6, 34, 18, -1); P.set(33, 16, 'a3'); },
    };
  },
};
