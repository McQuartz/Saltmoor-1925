// Ledertuch des Lampenputzers: ein gefaltetes Rehleder, schräg liegend, die obere Lage zurückgeschlagen;
// darauf ein kleiner blanker Kreis, so sauber, dass er das Licht spiegelt wie ein Reflektor.
'use strict';
module.exports = {
  form(A) {
    const { Pg } = A;
    const unten = [Pg([[6, 30], [30, 20], [43, 30], [19, 42]], null, { b: 1.4, rd: 1.4 })];
    const mitte = [Pg([[8, 25], [30, 15], [40, 24], [18, 35]], null, { b: 1.4, rd: 1.4 })];
    const oben = [Pg([[12, 18], [29, 9], [37, 18], [30, 23], [20, 27]], null, { b: 1.6, rd: 1.6 })];
    const lasche = [Pg([[29, 9], [37, 18], [40, 13], [34, 6]], null, { b: 1, rd: 1 })];
    return {
      gruppen: [{ p: unten, mat: 'holzhell', k: 0, tone: 0.05 }, { p: mitte, mat: 'holzhell', k: 0, tone: 0.12 }, { p: oben, mat: 'holzhell', k: 0, tone: 0.2 }, { p: lasche, mat: 'holzhell', k: 0, tone: 0.32 }],
      details(P) {
        P.ritz(10, 28, 30, 18, -2); P.ritz(13, 33, 36, 23, -1);
        for (const [x, y] of [[15, 24], [22, 20], [26, 31], [33, 27]]) P.stufe(x, y, -1);
        // blanker Kreis: spiegelt
        P.el(24, 18, 3.6, 2.4, 'a1', true); P.el(24, 18, 2.4, 1.4, 'a2', true); P.set(25, 17, 'aH'); P.set(24, 17, 'aG');
        P.glow(24, 18, 7, 0.8, 'a1', null);
      },
    };
  },
};
