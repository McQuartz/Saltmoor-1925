// Handschnitt: eine offene Handfläche nach oben, ein Messer zieht schnell quer darüber, wie beim Fischeausnehmen.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, achse, apg, acap, armGruppen } = A;
    const h = hand({ x: 6, y: 22, a: -0.1, s: 1.45, seite: -1, curl: [0.15, 0.18, 0.2, 0.25], spreiz: 0.1, daumen: 0.1, daumenWinkel: 0.9, arm: 8 });
    const ax = achse(30, 3, 2.3);
    const klinge = [apg(ax, [[0, -1.6], [12, -1.4], [15, 0.4], [0, 1.6]], null, { b: 0.8 })];
    const griff = [acap(ax, -9, 0, 0, 0, 1.8, 1.8)];
    return { gruppen: [...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }, { p: griff, mat: 'holz', k: 0 }, { p: klinge, mat: 'stahl', k: 0 }],
      details(P) { P.line(9, 23, 18, 20, 'a2', true); P.tropfen(13, 26); P.tropfen(16, 28, 'a1', 'a2'); } };
  },
};
