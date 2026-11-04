// Schulterstoß: eine Schulter im Mantel rammt von links gegen eine Bohlentür, die Bretter splittern,
// die Faust ist vor die Brust gezogen. Staub springt aus dem Spalt.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, E, Pg, armGruppen } = A;
    const tuer = [Pg([[30, 0], [46, 0], [46, 32], [33, 32], [31, 22], [34, 16], [30, 10]], null, { b: 1.4 })];
    const schulter = [E(18, 15, 13, 12, null, { pf: 'bevel', hz: 0.4 })];
    const f = faust({ x: 14, y: 30, a: -0.6, s: 1.2, seite: -1, arm: 8 });
    return { gruppen: [{ p: tuer, mat: 'holz', k: 0 }, { p: schulter, mat: 'stoff', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { for (const x of [37, 42]) P.ritz(x, 0, x, 31, -2); P.line(31, 10, 38, 14, 'holz0', true); P.line(34, 16, 41, 21, 'holz0', true); P.ritz(9, 5, 25, 9, -1); P.rauch(30, 4, 3, 'holz2', 0.4); P.rauch(31, 28, 3, 'holz2', 0.4); P.set(30, 15, 'a2'); } };
  },
};
