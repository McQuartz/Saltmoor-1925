// Schulterstoß: eine Schulter mit Mantel prallt hinter einem Brett hervor nach rechts, die Faust hält das Brett.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, E, Pg, armGruppen } = A;
    const schulter = [E(16, 16, 13, 11, null, { pf: 'bevel', hz: 0.4 })];
    const brett = [Pg([[29, 2], [35, 1], [37, 31], [31, 31]], null, { b: 1.2 })];
    const f = faust({ x: 22, y: 26, a: -0.2, s: 1.2, seite: -1, arm: 10 });
    return { gruppen: [{ p: schulter, mat: 'stoff', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: brett, mat: 'holz', k: 0 }],
      details(P) { P.ritz(10, 6, 26, 10, -1); P.rauch(42, 10, 4, 'stoff1', 0.35); P.rauch(44, 20, 3, 'stoff1', 0.3); P.set(33, 15, 'a2'); } };
  },
};
