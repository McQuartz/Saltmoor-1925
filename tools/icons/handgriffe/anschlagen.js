// Anschlagen: eine große Faust umfasst den Kolbenhals eines Gewehrs, der Zeigefinger liegt am Messingabzug,
// der Lauf zeigt lang nach rechts oben. Ein Auge zu, das andere sieht genauer, als dir lieb ist.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { gewehr, faust, achse, acap, armGruppen } = A;
    const g = gewehr(0, 24, -0.32, 50);
    const f = faust({ x: 10, y: 31, a: -1.4, s: 1.6, seite: 1, arm: 4 });
    const finger = [acap(achse(...f.ax.P(7, 1), -0.3), 0, 0, 4, 0, 1.2, 1)];
    return { gruppen: [{ p: [...g.schaft, ...g.vorder], mat: 'holz', k: 0.5, tone: 0.08 }, { p: [...g.system, ...g.lauf], mat: 'eisen', k: 0.5, tone: 0.08 }, ...armGruppen(f), { p: [...f.alle(), ...f.daumen], mat: 'haut', k: 1 }, { p: finger, mat: 'haut', k: 0 }],
      details(P) { const [x, y] = g.ax.P(19, 2.8); P.set(x, y, 'messing3'); P.set(x + 1, y, 'messing2'); const [k, l] = g.ax.P(47, -3.5); P.set(k, l, 'a3'); } };
  },
};
