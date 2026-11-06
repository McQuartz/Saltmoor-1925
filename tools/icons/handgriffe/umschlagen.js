// Umschlagen: eine große Hand wendet eine Karte im Flug, Zeige- und Mittelfinger dahinter; auf der Vorderseite ein Auge.
// Sie ist schon die richtige.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, achse, apg, armGruppen } = A;
    const ax = achse(31, 14, -0.45);
    const karte = [apg(ax, [[-11, -7], [11, -7], [11, 7], [-11, 7]], null, { b: 0.9, rd: 0.6 })];
    const h = hand({ x: 2, y: 30, a: -0.7, s: 1.6, seite: 1, curl: [0.05, 0.1, 0.8, 0.9], spreiz: 0.05, daumen: 0.3, arm: 4 });
    return { gruppen: [{ p: karte, mat: 'papier', k: 0, tone: 0.12 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (let t = -9.5; t <= 9.5; t++) { P.stufe(...ax.P(t, -5.8), -1); P.stufe(...ax.P(t, 5.8), -1); } const [cx, cy] = ax.P(1, 0); P.el(cx, cy, 4, 2.2, 'papier1', true); P.el(cx, cy, 1.4, 1.4, 'a2', true); P.set(cx, cy, 'kohle0'); } };
  },
};
