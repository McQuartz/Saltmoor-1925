// Letzter Tropfen: eine große Hand von oben hält eine fast leere Phiole kopfüber zwischen Daumen und Fingern;
// ein einzelner, sehr roter Tropfen hängt an der Öffnung.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, Pg, armGruppen } = A;
    const f = faust({ x: 44, y: 0, a: 2.45, s: 1.6, seite: 1, arm: 6 });
    const phiole = [Pg([[23, 6], [31, 6], [31, 17], [28.5, 20], [28.5, 23], [25.5, 23], [25.5, 20], [23, 17]], null, { b: 1.2, rd: 0.8 })];
    return { gruppen: [{ p: phiole, mat: 'glas', k: 0, tone: 0.18 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.set(27, 19, 'a1'); P.set(27, 20, 'a2'); P.set(27, 24, 'a2'); P.set(27, 25, 'a3'); P.set(27, 26, 'aG'); P.set(29, 8, 'glasR2'); P.set(29, 9, 'glas3'); P.el(27, 31, 3, 0.8, 'akzent2'); } };
  },
};
