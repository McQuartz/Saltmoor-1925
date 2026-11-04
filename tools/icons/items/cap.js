// Schiebermütze: flache Tuchmütze im Profil schräg von vorn, der Schirm tief nach unten links,
// Knopf oben, Nähte der acht Bahnen. Unter dem Schirm ist es dunkler, als es sein dürfte.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E } = A;
    const kopf = [Pg([[7, 30], [10, 20], [20, 13], [33, 12], [42, 16], [44, 24], [40, 30], [24, 33]], null, { b: 2.6, rd: 2 })];
    const schirm = [Pg([[5, 28], [22, 31], [30, 34], [22, 38], [8, 36], [3, 32]], null, { b: 1.2, rd: 1 })];
    const knopf = [E(31, 12.5, 2, 1.4, null, { pf: 'bevel', hz: 0.5 })];
    return {
      gruppen: [{ p: kopf, mat: 'wolle', k: 0 }, { p: schirm, mat: 'wolle', k: 0, tone: -0.12 }, { p: knopf, mat: 'wolle', k: 0 }],
      details(P) {
        P.ritz(31, 14, 22, 30, -1); P.ritz(32, 14, 40, 28, -1); P.ritz(30, 14, 12, 26, -1);
        for (let x = 6; x < 28; x++) P.stufe(x, Math.round(34 + (x - 6) * 0.1), -2);
        for (let x = 8; x < 24; x += 3) P.stufe(x, 31, -1);
      },
    };
  },
};
