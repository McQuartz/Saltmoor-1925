// Antippen: Zeige- und Mittelfinger berühren ganz sanft die Schläfe eines Kopfes im Profil (Nase, Ohr, Hinterkopf),
// genau im richtigen Augenblick. Das Auge ist schon zu.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, E, armGruppen } = A;
    const kopf = [Pg([[34, 1], [44, 2], [48, 9], [48, 22], [44, 27], [44, 32], [36, 32], [35, 27], [31, 26], [30, 22], [28, 21], [29, 18], [27, 15], [30, 12], [30, 6]], null, { b: 2.4, rd: 1.5 })];
    const ohr = [E(41, 14, 2.2, 3.2, null, { pf: 'bevel', hz: 0.5 })];
    const h = hand({ x: 4, y: 20, a: -0.42, s: 1.3, seite: 1, curl: [0, 0, 0.95, 1], spreiz: 0.03, daumen: 0.7, arm: 8 });
    return { gruppen: [{ p: kopf, mat: 'haut', k: 0, tone: -0.12 }, { p: ohr, mat: 'haut', k: 0, tone: -0.05 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { P.line(31, 13, 33, 13, 'haut0'); P.ritz(30, 8, 34, 7, -1); const [x, y] = h.spitzen[0]; P.set(x + 1, y, 'a3'); P.set(x + 1, y - 1, 'a2'); } };
  },
};
