// Lesestein: ein großer, gewölbter Beryll wie ein halbes Ei liegt auf einem aufgeschlagenen Buch (zwei Seiten, Falz in
// der Mitte); unter dem Stein ist ein einzelner Buchstabe riesig vergrößert, daneben die Zeilen klein.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E } = A;
    const links = [Pg([[1, 30], [23, 27], [24, 44], [3, 46]], null, { b: 0.8 })];
    const rechts = [Pg([[23, 27], [46, 30], [45, 46], [24, 44]], null, { b: 0.8 })];
    const stein = [E(27, 25, 12, 12, null, { pf: 'dome', hz: 0.85 })];
    return {
      gruppen: [{ p: links, mat: 'papier', k: 0, tone: -0.05 }, { p: rechts, mat: 'papier', k: 0, tone: 0.05 }, { p: stein, mat: 'glas', k: 0, tone: 0.12 }],
      details(P) {
        P.ritz(23, 28, 24, 44, -2);
        for (const y of [34, 37, 40, 43]) { P.line(4, y - 2, 13, y - 3, 'papier1', true); P.line(38, y - 2, 44, y - 1, 'papier1', true); }
        // großer Buchstabe im Stein (ein „R“ aus dicken Strichen)
        P.line(22, 20, 22, 31, 'kohle0', true); P.line(23, 20, 23, 31, 'kohle0', true); P.line(23, 20, 28, 20, 'kohle0', true); P.line(29, 21, 29, 24, 'kohle0', true); P.line(23, 25, 28, 25, 'kohle0', true); P.line(25, 26, 30, 31, 'kohle0', true);
        P.glow(32, 18, 5, 1.1, 'a2', 'a1'); P.set(33, 16, 'aH'); P.set(34, 17, 'a4'); P.set(32, 17, 'a4');
      },
    };
  },
};
