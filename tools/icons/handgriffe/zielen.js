// Zielen: ganz nah über Kimme und Korn eines Revolvers; das Korn steht auf einer kleinen hellen Stelle in der Ferne.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { Pg, faust, armGruppen } = A;
    const lauf = [Pg([[4, 24], [44, 20], [44, 24], [6, 30]], null, { b: 1.4, rd: 0.6 })];
    const kimme = [Pg([[4, 22], [10, 21], [10, 24], [4, 25]], null, { b: 0.6 }), Pg([[4, 20], [6, 20], [6, 23], [4, 23]], null, { b: 0.4 })];
    const korn = [Pg([[39, 17], [41, 17], [42, 21], [38, 21]], null, { b: 0.6 })];
    const f = faust({ x: 0, y: 32, a: -0.6, s: 1.3, seite: 1, arm: 0 });
    return { gruppen: [{ p: lauf, mat: 'stahl', k: 0 }, { p: [...kimme, ...korn], mat: 'stahl', k: 0 }, { p: [...f.alle(), ...f.daumen], mat: 'haut', k: 1 }],
      details(P) { P.set(40, 13, 'a3'); P.set(40, 12, 'a2'); P.set(41, 13, 'a2'); for (let x = 0; x < 48; x += 3) P.set(x, 8, 'stoff1'); } };
  },
};
