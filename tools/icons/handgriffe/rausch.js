// Rausch: eine Faust umklammert ein Messer, Klinge nach unten; ein dunkles Nachbild schlägt schon wieder zu, Spritzer fliegen.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, achse, apg } = A;
    const g = []; [[12, 14, -0.9, -0.3], [22, 10, -0.2, 0]].forEach(([x, y, a, t], i) => { const f = faust({ x, y, a, s: 1.3, seite: -1, arm: 10 }); const ax = achse(...f.ax.P(4, 2.5), a + 1.57); g.push({ p: [apg(ax, [[1, -1.3], [12, -1], [15, 0.8], [1, 1.3]], null, { b: 0.6 })], mat: 'stahl', k: 0, tone: t, ohneRand: i === 0 }, { p: [...f.arm, ...f.alle(), ...f.daumen], mat: 'haut', k: 1, tone: t, ohneRand: i === 0 }); });
    return { gruppen: g, details(P) { for (const [x, y] of [[38, 8], [42, 12], [40, 4], [45, 9], [43, 17], [36, 14]]) P.set(x, y, (x + y) % 2 ? 'a2' : 'a3'); } };
  },
};
