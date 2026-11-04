// Stockdegen: Spazierstock mit Silberknauf, oben ein Stück herausgezogen, darunter blitzt die Klinge.
// Die Hülle unten, der Griff oben versetzt, dazwischen die blanke Klinge.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, E } = A;
    const ax = achse(11, 46, -1.12);
    const huelle = [acap(ax, 0, 0, 24, 0, 1.8, 2.0)];
    const zwinge = [acap(ax, 0, 0, 2, 0, 1.9, 1.9)];
    const klinge = [acap(ax, 23, 0, 36, 0, 1.1, 1.1)];
    const griff = [acap(ax, 35, 0, 43, 0, 2.0, 2.0)];
    const [kx, ky] = ax.P(46, 0); const knauf = [E(kx, ky, 3.2, 3.6, null, { pf: 'bevel', hz: 0.5 }), acap(ax, 43, 0, 44.5, 0, 2.6, 2.6)];
    return {
      gruppen: [{ p: huelle, mat: 'holz', k: 0 }, { p: zwinge, mat: 'messing', k: 0 }, { p: klinge, mat: 'stahl', k: 0 }, { p: griff, mat: 'holz', k: 0 }, { p: knauf, mat: 'silber', k: 0.8 }],
      details(P) { const [a, b] = ax.P(24, 0); P.set(a, b, 'silber3'); const [x, y] = ax.P(30, 0); P.set(x, y, 'a4'); },
    };
  },
};
