// Tiefling-Schuppe: eine einzelne Schuppe groß wie ein Handteller, schildförmig mit gezacktem Rand,
// perlmuttgrün schillernd, Wachstumsringe, an der Wurzel ein Rest Haut.
'use strict';
module.exports = {
  form(A) {
    const { Pg, C } = A;
    const schuppe = [Pg([[10, 10], [24, 4], [38, 9], [42, 22], [38, 34], [30, 42], [24, 46], [17, 41], [9, 32], [6, 20]], null, { b: 3.6, rd: 1.4 })];
    const haut = [C(14, 8, 34, 6, 2, 2)];
    return {
      gruppen: [{ p: haut, mat: 'fleisch', k: 0 }, { p: schuppe, mat: 'perlmutt', k: 0 }],
      details(P) {
        for (const s of [0.82, 0.62, 0.42]) for (let a = 0.15; a < Math.PI - 0.15; a += 0.05) { const x = 24 + Math.cos(a) * 15 * s, y = 10 + Math.sin(a) * 30 * s; P.stufe(x, y, -1); }
        for (const [x, y] of [[30, 16], [32, 18], [33, 21], [28, 13]]) P.set(x, y, 'a3');
        for (const [x, y] of [[18, 26], [20, 30], [16, 22]]) P.set(x, y, 'b2');
      },
    };
  },
};
