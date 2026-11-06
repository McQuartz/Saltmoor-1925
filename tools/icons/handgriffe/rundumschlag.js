// Rundumschlag: eine große Faust schwingt einen kurzen Knüppel im Bogen; die früheren Lagen des Knüppels stehen
// als dunkle Nachbilder dahinter, wie in der Hafenkneipe, wenn das Licht ausgeht.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { faust, achse, acap, armGruppen } = A;
    const f = faust({ x: 10, y: 24, a: -0.75, s: 1.7, seite: -1, arm: 8 });
    const [hx, hy] = f.ax.P(5, 0);
    const knueppel = (a, t) => ({ p: [acap(achse(hx, hy, a), 0, 0, 24, 0, 2, 3)], mat: 'holz', k: 0, tone: t, ohneR2: t < 0 });
    return { gruppen: [knueppel(-2.1, -0.35), knueppel(-1.45, -0.2), knueppel(-0.55, 0.1), ...armGruppen(f), { p: f.alle(), mat: 'haut', k: 1 }, { p: f.daumen, mat: 'haut', k: 0 }],
      details(P) { const [x, y] = achse(hx, hy, -0.55).P(24, 0); P.set(x, y - 2, 'holzR2'); } };
  },
};
