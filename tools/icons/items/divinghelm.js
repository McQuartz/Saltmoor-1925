// Taucherhelm: runder Messinghelm Baujahr 1898, großes Frontfenster mit Gitter, zwei Seitenfenster,
// Schulterstück mit Schrauben. Im Glas der Atem eines anderen (beschlagen).
'use strict';
module.exports = {
  form(A) {
    const { E, Pg, C } = A;
    const kugel = [E(24, 20, 15, 15, null, { pf: 'bevel', hz: 0.35 })];
    const schulter = [Pg([[6, 33], [42, 33], [45, 44], [3, 44]], null, { b: 2, rd: 1.5 })];
    const front = [E(21, 21, 7, 7, null, { pf: 'bevel', hz: 0.4 })];
    const seite = [E(36, 19, 3.2, 4.2, null, { pf: 'bevel', hz: 0.4 })];
    const ventil = [C(34, 6, 38, 3, 2, 1.6)];
    return {
      gruppen: [{ p: schulter, mat: 'kupfer', k: 0 }, { p: [...kugel, ...ventil], mat: 'messing', k: 1.5 }, { p: [...front, ...seite], mat: 'messing', k: 0, tone: 0.1 }],
      details(P) {
        P.el(21, 21, 5, 5, 'glas1'); P.el(36, 19, 1.8, 2.8, 'glas1');
        P.line(16, 21, 26, 21, 'messing2', true); P.line(21, 16, 21, 26, 'messing2', true);
        for (const [x, y] of [[18, 18], [23, 23], [19, 24], [24, 18]]) P.set(x, y, 'glas3');
        for (const x of [8, 15, 24, 33, 40]) P.set(x, 38, 'messing3');
        P.set(37, 18, 'a3');
      },
    };
  },
};
