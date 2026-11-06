// Sand vom Anfang: eine flache, offene Hand mit der Fläche nach oben, die Finger geschlossen nach rechts, darauf ein heller
// Sandhaufen; zwischen kleinem Finger und Ballen rieselt ein dünner Faden herab auf ein Häufchen. Warm wie am ersten Morgen.
'use strict';
module.exports = {
  form(A) {
    const { hand, E } = A;
    const h = hand({ x: 4, y: 26, a: -0.05, s: 1.9, seite: -1, curl: [0.05, 0.05, 0.08, 0.1], spreiz: 0.02, daumen: 0.15, daumenWinkel: 0.7, arm: 6 });
    const sand = [E(20, 22, 10, 5, null, { pf: 'bevel', hz: 0.45 })];
    const haufen = [E(28, 45, 8, 2.6, null, { pf: 'bevel', hz: 0.5 })];
    return {
      gruppen: [{ p: [...h.arm, ...h.alle()], mat: 'haut', k: 1, tone: 0.15 }, { p: sand, mat: 'papier', k: 0, tone: 0.18 }, { p: haufen, mat: 'papier', k: 0, tone: 0.18 }],
      details(P) { for (let y = 30; y < 43; y++) P.set(27 + (y % 3 === 0 ? 1 : 0), y, y % 3 ? 'papier3' : 'a3'); for (const [x, y] of [[16, 19], [22, 18], [25, 21], [13, 22], [30, 44]]) P.set(x, y, 'a4'); },
    };
  },
};
