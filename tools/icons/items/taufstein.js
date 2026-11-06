// Taufstein-Splitter: ein kantiger Granitbrocken mit scharfen Bruchkanten, eine Ecke des alten Beckens:
// oben die glatte Rinne mit Wasser, das nie verdunstet; an der Bruchkante ein halbes eingemeißeltes Kreuz.
'use strict';
module.exports = {
  form(A) {
    const { Pg } = A;
    const stein = [Pg([[3, 30], [9, 13], [20, 16], [27, 5], [37, 10], [45, 24], [41, 34], [44, 44], [26, 41], [12, 45]], null, { b: 2.4, rd: 0.2 })];
    const rinne = [Pg([[10, 17], [20, 19], [27, 10], [36, 14], [34, 18], [27, 15], [21, 23], [11, 21]], null, { b: 1.2, rd: 0.6 })];
    return {
      gruppen: [{ p: stein, mat: 'stein', k: 0 }, { p: rinne, mat: 'stein', k: 0, tone: -0.35, ohneRand: true }],
      details(P) {
        P.line(12, 19, 20, 21, 'akzent2', true); P.line(21, 20, 27, 12, 'akzent2', true); P.line(27, 12, 34, 15, 'aG', true); P.set(24, 16, 'aH');
        P.ritz(33, 27, 33, 38, -2); P.ritz(28, 31, 38, 31, -2);
        P.ritz(20, 16, 18, 40, -1); P.ritz(37, 10, 41, 34, -1);
      },
    };
  },
};
