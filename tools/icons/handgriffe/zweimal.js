// Zweimal: zwei Läufe einer Doppelflinte, aus beiden kommt kurz nacheinander Feuer.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { gewehr, acap, faust, armGruppen } = A;
    const g = gewehr(0, 21, -0.2, 34);
    const lauf2 = [acap(g.ax, 22, 1.2, 34, 1.2, 1.2, 1.1)];
    const f = faust({ x: 6, y: 31, a: -0.9, s: 1.15, seite: 1, arm: 6 });
    return { gruppen: [{ p: [...g.schaft, ...g.vorder], mat: 'holz', k: 0.5 }, { p: lauf2, mat: 'eisen', k: 0 }, { p: [...g.system, ...g.lauf], mat: 'eisen', k: 0.5 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }],
      details(P) { const [x, y] = g.muendung; P.blitz(x + 4, y - 1, 5, -0.2); P.blitz(x + 2, y + 4, 3.5, -0.2); } };
  },
};
