// Stoßen: eine Faust um ein kurzes Eisenstück, gerade nach rechts gestoßen. Was man gerade in der Hand hat.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, acap, achse, armGruppen } = A;
    const f = faust({ x: 22, y: 16, a: -0.08, s: 1.5, seite: -1, arm: 20 });
    const ax = achse(28, 16, -0.08);
    const eisen = [acap(ax, -3, 6, 4, -9, 1.5, 1.3)];
    return { gruppen: [...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: eisen, mat: 'eisen', k: 0 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.rauch(42, 15, 3, 'stoff1', 0.35); } };
  },
};
