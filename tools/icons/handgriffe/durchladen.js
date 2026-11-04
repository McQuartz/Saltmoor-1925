// Durchladen: die Hand reißt den Kammerstängel zurück, die leere Hülse springt heraus.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { gewehr, hand, C, achse, acap, armGruppen } = A;
    const g = gewehr(0, 20, -0.12, 46);
    const [sx, sy] = g.ax.P(18, -3);
    const kammer = [C(sx, sy, sx - 4, sy - 7, 0.9, 0.9), C(sx - 4, sy - 7, sx - 5, sy - 8, 1.6, 1.6)];
    const h = hand({ x: 4, y: 2, a: 0.6, s: 1.2, seite: 1, curl: [0.75, 0.8, 0.85, 0.9], spreiz: 0.03, daumen: 0.4, arm: 6 });
    const huelse = [acap(achse(30, 7, -0.8), 0, 0, 4, 0, 1, 1)];
    return { gruppen: [{ p: [...g.schaft, ...g.vorder], mat: 'holz', k: 0.5 }, { p: [...g.system, ...g.lauf], mat: 'eisen', k: 0.5 }, { p: kammer, mat: 'stahl', k: 0 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }, { p: huelse, mat: 'messing', k: 0 }],
      details(P) { P.set(33, 4, 'a3'); P.rauch(26, 12, 2.5, 'stoff2', 0.3); } };
  },
};
