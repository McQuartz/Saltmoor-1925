// Umschlagen: zwei Finger wenden eine Karte im Flug, ohne hinzusehen; darunter liegt der Stapel.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, achse, apg, Pg, armGruppen } = A;
    const stapel = [Pg([[4, 24], [24, 22], [26, 30], [6, 32]], null, { b: 0.8 })];
    const ax = achse(28, 14, -0.9);
    const karte = [apg(ax, [[-7, -4.5], [7, -4.5], [7, 4.5], [-7, 4.5]], null, { b: 0.8 })];
    const h = hand({ x: 46, y: 6, a: 2.75, s: 1.3, seite: 1, curl: [0.1, 0.15, 0.9, 1], spreiz: 0.05, daumen: 0.4, arm: 6 });
    return { gruppen: [{ p: stapel, mat: 'papier', k: 0, tone: -0.05 }, { p: karte, mat: 'papier', k: 0, tone: 0.08 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { const [x, y] = ax.P(0, 0); P.set(x, y, 'a3'); P.set(x + 1, y, 'kohle0'); for (const yy of [25, 27, 29]) P.line(6, yy + 1, 24, yy - 1, 'papier1', true); } };
  },
};
