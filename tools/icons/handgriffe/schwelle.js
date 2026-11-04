// Schwelle: eine Hand lässt Salz aus der Faust rieseln, eine weiße Linie über die Türschwelle, ohne abzusetzen.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, Pg, armGruppen } = A;
    const schwelle = [Pg([[0, 24], [48, 21], [48, 28], [0, 31]], null, { b: 1.4 })];
    const pfosten = [Pg([[42, 0], [48, 0], [48, 22], [42, 22]], null, { b: 1 })];
    const f = faust({ x: 22, y: 2, a: 1.3, s: 1.3, seite: 1, arm: 6 });
    return { gruppen: [{ p: pfosten, mat: 'holz', k: 0 }, { p: schwelle, mat: 'holz', k: 0 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { for (let y = 15; y < 23; y += 2) P.set(25 + (y % 3 ? 0 : 1), y, 'papier3'); for (let x = 3; x < 26; x++) { P.set(x, Math.round(25 - x * 0.06), (x % 3) ? 'papierR2' : 'papier3'); } } };
  },
};
