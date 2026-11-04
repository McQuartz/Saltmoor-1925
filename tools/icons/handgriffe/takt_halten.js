// Takt halten: ein Metronom mit schwingendem Zeiger, ein Finger tippt oben auf das Gehäuse und zählt mit.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, C, E, armGruppen } = A;
    const geh = [Pg([[10, 31], [26, 31], [21, 4], [15, 4]], null, { b: 1.6, rd: 0.6 })];
    const zeiger = [C(18, 26, 26, 7, 0.7, 0.6), E(24.5, 11, 1.6, 1.2)];
    const h = hand({ x: 44, y: 10, a: Math.PI + 0.35, s: 1.25, seite: 1, curl: [0, 0.9, 0.95, 1], spreiz: 0.05, daumen: 0.5, arm: 6 });
    return { gruppen: [{ p: geh, mat: 'holz', k: 0 }, { p: zeiger, mat: 'stahl', k: 0 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (let y = 10; y < 28; y += 2) P.set(17, y, 'messing2'); P.set(20, 27, 'a3'); P.line(14, 29, 22, 29, 'holz0', true); } };
  },
};
