// Tragreff: ein Gestell aus Holz für den Rücken, zwei Holme mit Sprossen, unten ein Brett als Ablage, zwei Gurte.
// Darauf liegen noch zwei Ziegel, schräg verrutscht; der obere hat den Abdruck.
'use strict';
module.exports = {
  form(A) {
    const { E, Pg, C } = A;
    const holme = [C(14, 6, 18, 42, 1.8, 2), C(32, 4, 36, 40, 1.8, 2)];
    const sprossen = [C(15, 12, 33, 10, 1.2, 1.2), C(16, 22, 34, 20, 1.2, 1.2), C(17, 31, 35, 29, 1.2, 1.2)];
    const brett = [Pg([[12, 38], [40, 35], [42, 39], [14, 43]], null, { b: 1.4, rd: 0.6 })];
    const gurte = [C(12, 10, 10, 30, 1, 1), C(38, 8, 39, 28, 1, 1)];
    const ziegel = [Pg([[17, 28], [33, 26], [35, 34], [19, 36]], null, { b: 1.8, rd: 0.6 }), Pg([[20, 20], [35, 17], [37, 25], [22, 28]], null, { b: 1.8, rd: 0.6 })];
    return {
      gruppen: [{ p: gurte, mat: 'leder', k: 0 }, { p: holme, mat: 'holz', k: 0 }, { p: sprossen, mat: 'holz', k: 0, tone: -0.1 }, { p: brett, mat: 'holzhell', k: 0 }, { p: ziegel, mat: 'rost', k: 0, tone: 0.3 }],
      details(P) {
        P.ritz(19, 30, 33, 28, -1); P.ritz(22, 22, 35, 19, -1);
        for (const r of [1, 2.2]) for (let a = 0; a < 6.28; a += 0.4) { const x = Math.round(28 + Math.cos(a) * r * 1.4), y = Math.round(22 + Math.sin(a) * r * 0.7); if (P.info(x, y)) P.stufe(x, y, -1); }
        P.ritz(25, 23, 31, 21, +1);
        for (const [x, y] of [[16, 15], [34, 14], [17, 26]]) P.stufe(x, y, +1);
      },
    };
  },
};
