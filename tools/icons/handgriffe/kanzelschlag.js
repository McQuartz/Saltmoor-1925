// Kanzelschlag: die flache Hand schlägt auf das Pult, der Staub springt auf, das Gesangbuch hüpft.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, armGruppen } = A;
    const pult = [Pg([[0, 24], [48, 20], [48, 26], [0, 30]], null, { b: 1.4 })];
    const kante = [Pg([[0, 21], [48, 17], [48, 20], [0, 24]], null, { b: 0.8 })];
    const buch = [Pg([[30, 12], [42, 10], [43, 14], [31, 16]], null, { b: 1 })];
    const h = hand({ x: 4, y: 16, a: 0.12, s: 1.7, seite: 1, curl: [0, 0, 0.02, 0.05], spreiz: 0.04, daumen: 0.1, arm: 10 });
    return { gruppen: [{ p: pult, mat: 'holz', k: 0 }, { p: kante, mat: 'holz', k: 0, tone: 0.1 }, { p: buch, mat: 'leder', k: 0 }, ...armGruppen(h, 'tuch'), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (const [x, y] of [[26, 13], [28, 9], [6, 9], [22, 8], [35, 6]]) P.set(x, y, 'a2'); P.line(31, 13, 41, 11, 'papier2', true); } };
  },
};
