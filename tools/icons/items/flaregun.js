// Leuchtpistole: Messing-Signalpistole mit kurzem, dickem Lauf (weite Mündung), Holzgriff.
// In der Mündung glimmt schon das Rot der Leuchtpatrone.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, E } = A;
    const ax = achse(9, 25, -0.3);
    const lauf = [apg(ax, [[11, -7], [35, -7.5], [35, 1.5], [11, 1]], null, { b: 2.2, rd: 0.8 })];
    const muendung = [acap(ax, 33.5, -7.8, 33.5, 1.8, 1.8, 1.8)];
    const rahmen = [apg(ax, [[4, -5.5], [13, -6], [13, 2], [11, 4], [5, 3.5]], null, { b: 1.4, rd: 0.5 })];
    const hahn = [apg(ax, [[5, -4.5], [1.5, -8], [-0.5, -7.5], [3, -3]], null, { b: 0.7 })];
    const griff = [apg(ax, [[3, -1], [10, 1.5], [9.5, 12], [8, 19], [2, 19], [0, 12]], null, { b: 2, rd: 1.4 })];
    const buegel = A.ring(...ax.P(13, 4.5), 3, 3, 0.8, null, {}, 10, -0.2, Math.PI - 0.2);
    return {
      gruppen: [{ p: griff, mat: 'holz', k: 0 }, { p: [...rahmen, ...hahn], mat: 'messing', k: 0.6 }, { p: buegel, mat: 'messing', k: 0, ohneR2: true }, { p: lauf, mat: 'messing', k: 0 }, { p: muendung, mat: 'messing', k: 0 }],
      details(P) {
        const [mx, my] = ax.P(35, -3); P.el(mx, my, 1.2, 3.2, 'kohle0'); P.set(mx, my - 1, 'aG'); P.set(mx, my, 'a3'); P.set(mx, my + 1, 'aG');
        const [a, b] = ax.P(14, -3), [c, d] = ax.P(31, -3.5); P.ritz(a, b, c, d, -1);
        for (let k = 0; k < 4; k++) { const [x, y] = ax.P(3 + k * 1.3, 6 + k * 2.8); P.stufe(x, y, -1); P.stufe(x + 2, y, -1); }
      },
    };
  },
};
