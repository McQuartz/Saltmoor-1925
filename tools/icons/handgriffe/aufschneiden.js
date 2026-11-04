// Aufschneiden: eine Klinge liegt am Unterarm, ein frischer roter Strich darunter; für einen Atemzug sieht man alles klar.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, achse, apg, acap, C } = A;
    const unterarm = [C(2, 24, 30, 18, 4, 3.4)];
    const fa = faust({ x: 30, y: 18, a: -0.2, s: 1.3, seite: 1, arm: 0 });
    const ax = achse(20, 6, 0.45);
    const klinge = [apg(ax, [[0, -1.5], [13, -1.2], [16, 0.5], [0, 1.4]], null, { b: 0.8 })];
    const griff = [acap(ax, -9, 0, 0, 0, 1.6, 1.6)];
    return { gruppen: [{ p: unterarm, mat: 'haut', k: 0 }, { p: [...fa.alle(), ...fa.daumen], mat: 'haut', k: 1 }, { p: griff, mat: 'holz', k: 0 }, { p: klinge, mat: 'stahl', k: 0 }],
      details(P) { P.line(12, 20, 26, 17, 'a2', true); P.line(13, 21, 25, 18, 'a1', true); P.tropfen(17, 25); P.set(35, 14, 'a3'); } };
  },
};
