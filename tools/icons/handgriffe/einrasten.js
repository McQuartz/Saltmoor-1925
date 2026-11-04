// Einrasten: zwei Finger drücken eine Sperrklinke in ein Zahnrad, bis es leise klickt.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, zahnrad, C, E, armGruppen } = A;
    const rad = [zahnrad(16, 18, 10, 14, 2.4)];
    const klinke = [C(34, 6, 26, 12, 1.4, 1.1), E(34, 6, 2, 2)];
    const h = hand({ x: 46, y: 20, a: -2.6, s: 1.25, seite: -1, curl: [0, 0.1, 0.9, 1], spreiz: 0.04, daumen: 0.5, arm: 6 });
    return { gruppen: [{ p: rad, mat: 'messing', k: 0 }, { p: klinke, mat: 'stahl', k: 0 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { P.el(16, 18, 3, 3, 'messing0', true); P.set(16, 18, 'a3'); P.set(26, 12, 'a3'); } };
  },
};
