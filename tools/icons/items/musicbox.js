// Spieluhr: kleines Holzkästchen schräg von oben, Deckel aufgeklappt (Spiegel innen), vorn die Kurbel,
// innen die Messingwalze mit Stiften. Sie spielt das Lied der Mutter.
'use strict';
module.exports = {
  form(A) {
    const { Pg, acap, achse, E } = A;
    const kasten = [Pg([[6, 26], [32, 20], [42, 28], [42, 38], [16, 45], [6, 36]], null, { b: 1.6, rd: 0.6 })];
    const oben = [Pg([[6, 26], [32, 20], [42, 28], [16, 34]], null, { b: 1.2 })];
    const deckel = [Pg([[6, 26], [32, 20], [30, 4], [5, 11]], null, { b: 1.8, rd: 0.6 })];
    const ax = achse(42, 34, 0.15);
    const kurbel = [acap(ax, 0, 0, 4, 0, 1, 1), acap(ax, 4, 0, 4, 5, 1, 1), acap(ax, 4, 5, 6.5, 5, 1.2, 1.2)];
    const walze = [acap(achse(15, 29, -0.24), 0, 0, 17, 0, 2.6, 2.6)];
    void E;
    return {
      gruppen: [{ p: deckel, mat: 'holz', k: 0 }, { p: kasten, mat: 'holz', k: 0, tone: -0.05 }, { p: oben, mat: 'holz', k: 0, tone: -0.35, ohneRand: true }, { p: walze, mat: 'messing', k: 0 }, { p: kurbel, mat: 'messing', k: 0 }],
      details(P) {
        P.el(18, 14, 8, 5, 'glas2', true); P.el(18, 14, 6, 3.5, 'glas1', true); P.set(21, 12, 'a3');
        for (let k = 0; k < 7; k++) P.set(17 + k * 2.3, 28 - k * 0.55, 'messing3');
        P.ritz(16, 34, 42, 28, -1); P.ritz(16, 35, 16, 44, -1);
      },
    };
  },
};
