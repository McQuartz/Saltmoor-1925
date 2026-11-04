// Nachladen: die Revolvertrommel ist ausgeschwenkt, Finger schieben eine Patrone nach der anderen hinein, ohne hinzusehen.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { E, hand, achse, acap, apg, armGruppen } = A;
    const ax = achse(4, 24, -0.25);
    const rahmen = [apg(ax, [[0, -3], [26, -3], [26, 2], [0, 2]], null, { b: 1.2 })];
    const trommel = [E(30, 15, 7, 7, null, { pf: 'bevel', hz: 0.4 })];
    const patr = acap(achse(38, 4, 2.0), 0, 0, 6, 0, 1.2, 1.2);
    const h = hand({ x: 47, y: 6, a: 2.6, s: 1.2, seite: -1, curl: [0.4, 0.5, 0.9, 1], spreiz: 0.05, daumen: 0.5, arm: 4 });
    return { gruppen: [{ p: rahmen, mat: 'eisen', k: 0 }, { p: trommel, mat: 'stahl', k: 0 }, { p: [patr], mat: 'messing', k: 0 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const x = 30 + Math.cos(a) * 4, y = 15 + Math.sin(a) * 4; P.el(x, y, 1.3, 1.3, i < 4 ? 'messing3' : 'kohle0', true); } P.set(30, 15, 'a3'); } };
  },
};
