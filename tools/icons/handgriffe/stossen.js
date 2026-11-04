// Stoßen: eine Faust mit einem kurzen Eisenstück darin, gerade nach rechts gestoßen,
// der Ärmel rafft sich am Unterarm. Was man gerade in der Hand hat.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, acap, achse } = A;
    const f = faust({ x: 22, y: 17, a: -0.08, s: 1.5, seite: -1, arm: 18 });
    const ax = achse(28, 17, -0.08);
    const eisen = [acap(ax, -6, 3.5, 18, 3.5, 1.4, 1.2)];
    return {
      gruppen: [{ p: f.aermel, mat: 'wolle', k: 0 }, { p: f.arm, mat: 'haut', k: 0 }, { p: eisen, mat: 'eisen', k: 0 }, { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
    };
  },
};
