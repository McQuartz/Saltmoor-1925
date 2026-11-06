// Abbinden: eine große Faust zieht einen Ledergürtel straff, der Gürtel läuft durch die Messingschnalle und wird
// zur Schlinge; ein Blutstropfen am Leder. Fest, bis die Finger kalt werden.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, kurve, Pg, armGruppen } = A;
    const f = faust({ x: 32, y: 13, a: -0.2, s: 1.75, seite: -1, arm: 10 });
    const gurt = kurve([[33, 18], [20, 22], [8, 22], [5, 14], [12, 9], [16, 16], [12, 26]], 1.7, 1.7, null, { cr: true }, 30);
    const schnalle = [Pg([[14, 18], [20, 18], [20, 25], [14, 25]], null, { b: 0.6 })];
    return { gruppen: [{ p: gurt, mat: 'leder', k: 0, tone: 0.1 }, { p: schnalle, mat: 'messing', k: 0, tone: 0.1 }, ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.set(17, 21, 'kohle0'); P.line(17, 20, 17, 23, 'kohle0', true); P.tropfen(9, 25); P.tropfen(9, 28, 'a2', 'a3'); P.set(24, 22, 'a3'); } };
  },
};
