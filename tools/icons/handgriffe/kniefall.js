// Kniefall: ein Knie auf dem Steinboden, daneben stützt sich eine Hand flach auf; über den Rücken geht es hinweg.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, C, armGruppen } = A;
    const boden = [Pg([[0, 27], [48, 27], [48, 32], [0, 32]], null, { b: 0.6 })];
    const bein = [C(6, 8, 18, 22, 4, 3.4), C(18, 22, 36, 26, 3.4, 2.8)];
    const schuh = [Pg([[34, 22], [40, 22], [41, 27], [34, 27]], null, { b: 1 })];
    const h = hand({ x: 4, y: 22, a: 0.15, s: 1.25, seite: 1, curl: [0, 0, 0.05, 0.08], spreiz: 0.12, daumen: 0.2, arm: 0 });
    return { gruppen: [{ p: boden, mat: 'stein', k: 0, tone: -0.1 }, { p: bein, mat: 'stoff', k: 2 }, { p: schuh, mat: 'leder', k: 0 }, { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { P.rauch(12, 3, 5, 'stoff1', 0.3); P.rauch(28, 6, 6, 'stoff1', 0.25); P.set(18, 25, 'a2'); } };
  },
};
