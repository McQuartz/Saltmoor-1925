// Zielen: eine große Faust hält einen Revolver weit nach rechts ausgestreckt, Kimme und Korn in einer Linie,
// ganz hinten ein kleines Licht, an der Stelle, an der bei Menschen das Herz sitzt.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, achse, apg, E, armGruppen } = A;
    const f = faust({ x: 4, y: 22, a: -0.1, s: 1.6, seite: -1, arm: 4 });
    const ax = achse(...f.ax.P(5, -4), -0.1);
    const rahmen = [apg(ax, [[-2, -3], [8, -3], [8, 2], [-2, 2]], null, { b: 1 })];
    const trommel = [apg(ax, [[1, -3.6], [7, -3.6], [7, 1.6], [1, 1.6]], null, { b: 1.4, rd: 0.6 })];
    const lauf = [apg(ax, [[7, -3], [26, -2.8], [26, -0.6], [7, -0.4]], null, { b: 0.8 })];
    const korn = [apg(ax, [[24, -2.8], [25.5, -2.8], [25.5, -4.6], [24.5, -4.6]], null, { b: 0.4 })];
    void E;
    return { gruppen: [{ p: [...rahmen, ...lauf, ...korn], mat: 'eisen', k: 0.5, tone: 0.12 }, { p: trommel, mat: 'stahl', k: 0, tone: 0.1 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.set(44, 10, 'a3'); P.set(45, 10, 'a2'); P.set(44, 9, 'a2'); for (let x = 36; x < 44; x += 3) P.set(x, 11, 'glutDim'); for (const t of [3, 5]) { const [a, b] = ax.P(t, -3.4), [c, d] = ax.P(t, 1.4); P.ritz(a, b, c, d, -2); } } };
  },
};
