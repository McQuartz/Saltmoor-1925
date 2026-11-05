// Wiederholung: eine große Faust dreht einen Schlüssel in einem Schlossblech; dieselbe Drehung steht noch einmal als
// dunkles Nachbild daneben. Die Welt hat sie beim ersten Mal nicht geglaubt.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, Pg, C, ring, armGruppen } = A;
    const blech = [Pg([[34, 2], [46, 2], [46, 30], [34, 30]], null, { b: 1.4, rd: 1 })];
    const f = faust({ x: 8, y: 16, a: 0, s: 1.7, seite: -1, arm: 10 });
    const schluessel = (t, a) => ({ p: [C(20, 16, 36, 16 + a, 1, 1), ...ring(20, 16, 3, 3 + a * 0.3, 1, null, {}, 10)], mat: 'messing', k: 0, tone: t, ohneR2: t < 0 });
    return { gruppen: [{ p: blech, mat: 'eisen', k: 0, tone: 0.1 }, { p: [C(20, 9, 34, 6, 1, 1), ...ring(20, 9, 2.6, 2.6, 0.9, null, {}, 10)], mat: 'messing', k: 0, tone: -0.3, ohneR2: true }, schluessel(0.12, 0), ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { P.el(40, 16, 1.6, 2.6, 'kohle0', true); for (const [x, y] of [[36, 5], [44, 5], [36, 27], [44, 27]]) P.set(x, y, 'eisen3'); P.set(30, 15, 'a3'); } };
  },
};
