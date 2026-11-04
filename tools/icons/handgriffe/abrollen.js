// Abrollen: ein Arm schützt den Kopf, der Körper rollt über die Schulter ab; Staub stiebt vom Boden.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { E, faust, Pg, armGruppen } = A;
    const boden = [Pg([[0, 29], [48, 29], [48, 32], [0, 32]], null, { b: 0.6 })];
    const ruecken = [E(22, 18, 12, 10, null, { pf: 'bevel', hz: 0.4 })];
    const f = faust({ x: 12, y: 6, a: 0.4, s: 1.2, seite: 1, arm: 10 });
    return { gruppen: [{ p: boden, mat: 'stein', k: 0, tone: -0.15 }, { p: ruecken, mat: 'stoff', k: 0 }, ...armGruppen(f, 'stoff'), { p: f.alle(), mat: 'haut', k: 1 }],
      details(P) { P.rauch(38, 26, 5, 'stein2', 0.45); P.rauch(44, 23, 3, 'stein1', 0.35); P.ritz(14, 12, 26, 26, -1); for (let a = 3.6; a < 5.2; a += 0.15) P.set(22 + Math.cos(a) * 15, 18 + Math.sin(a) * 13, 'a1'); } };
  },
};
