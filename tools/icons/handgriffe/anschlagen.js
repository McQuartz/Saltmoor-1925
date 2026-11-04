// Anschlagen: das Gewehr liegt angelegt, Kolben an der Wange (Kieferlinie links), die Hand am Vorderschaft, ein Auge zu.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { gewehr, faust, Pg, armGruppen } = A;
    const g = gewehr(4, 15, -0.05, 44);
    const wange = [Pg([[0, 0], [10, 0], [12, 8], [9, 13], [0, 14]], null, { b: 2, rd: 2 })];
    const f = faust({ x: 26, y: 30, a: -1.5, s: 1.2, seite: 1, arm: 6 });
    return { gruppen: [{ p: wange, mat: 'haut', k: 0, tone: -0.12 }, { p: [...g.schaft, ...g.vorder], mat: 'holz', k: 0.5 }, { p: [...g.system, ...g.lauf], mat: 'eisen', k: 0.5 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.line(4, 6, 8, 6, 'haut0'); P.set(9, 7, 'a2'); } };
  },
};
