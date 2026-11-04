// Salzbeutel: Leinensäckchen, oben mit Schnur zugebunden, die Zipfel stehen ab. Aus einer Ecke rieselt
// grobes Meersalz, die Körner glänzen.
'use strict';
module.exports = {
  form(A) {
    const { Pg, C, E } = A;
    const sack = [Pg([[15, 17], [31, 16], [38, 26], [38, 38], [32, 43], [14, 43], [9, 36], [10, 25]], null, { b: 3.5, rd: 2 })];
    const kopf = [Pg([[19, 16], [21, 9], [18, 4], [24, 7], [29, 3], [27, 9], [29, 16]], null, { b: 1.2, rd: 0.8 })];
    const schnur = [C(15, 16, 33, 16, 1.2, 1.2), C(32, 16, 37, 20, 0.8, 0.7), C(32, 16, 36, 13, 0.8, 0.7)];
    const haufen = [E(41, 45, 5, 2, null, { pf: 'bevel', hz: 0.6 })];
    return {
      gruppen: [{ p: haufen, mat: 'papier', k: 0, tone: 0.15 }, { p: sack, mat: 'wolle', k: 0, tone: 0.05 }, { p: kopf, mat: 'wolle', k: 0 }, { p: schnur, mat: 'leder', k: 0 }],
      details(P) {
        for (const [x, y] of [[38, 39], [39, 41], [40, 40], [38, 42], [41, 43], [43, 44], [39, 44], [42, 42]]) P.set(x, y, (x + y) % 3 ? 'a4' : 'a3');
        P.ritz(20, 22, 18, 40, -1); P.ritz(28, 21, 33, 39, -1);
        for (let k = 0; k < 9; k++) P.stufe(12 + k * 3, 34 + (k % 2), -1);
      },
    };
  },
};
