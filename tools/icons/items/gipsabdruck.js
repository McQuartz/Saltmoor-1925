// Gipsabdruck: eine helle, gebrochene Gipsplatte, darin tief und dunkel der Abdruck eines nackten Fußes: Ferse,
// Ballen und fünf deutlich getrennte Zehen, die nach oben rechts zeigen, zum Meer. Sand haftet am Rand.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, achse } = A;
    const platte = [Pg([[3, 14], [26, 3], [45, 15], [44, 33], [24, 46], [5, 37]], null, { b: 2.4, rd: 0.6 })];
    const ax = achse(15, 36, -0.72);
    const fuss = [E(...ax.P(0, 0), 4.8, 4.2), E(...ax.P(9, 1), 4.2, 4.6), E(...ax.P(18, 0.5), 5, 6.4)];
    const zehen = [[25, -5], [26.6, -1.8], [26.6, 1.2], [25.8, 4], [24, 6.4]].map(([t, q], i) => E(...ax.P(t, q), 1.9 - i * 0.18, 1.9 - i * 0.18));
    return {
      gruppen: [{ p: platte, mat: 'papier', k: 0, tone: 0.12 }, { p: [...fuss, ...zehen], mat: 'papier', k: 1.2, tone: -0.45, ohneRand: true }],
      details(P) { for (const [x, y] of [[6, 35], [10, 39], [42, 30], [43, 22], [8, 17]]) P.set(x, y, 'holzhell2'); P.ritz(26, 3, 30, 17, -2); P.ritz(30, 17, 44, 22, -1); P.set(34, 12, 'a3'); },
    };
  },
};
