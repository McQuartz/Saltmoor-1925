// Badethermometer: schwimmendes Holzthermometer in Form eines kleinen Bootskörpers, oben eine Öse mit Kordel,
// in der Mitte die Glasröhre, deren Säule unter null steht.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, ring } = A;
    const ax = achse(24, 3, Math.PI / 2 + 0.25);
    const koerper = [apg(ax, [[4, -4], [30, -5.6], [40, -3.2], [44, 0], [40, 3.2], [30, 5.6], [4, 4], [1, 0]], null, { b: 2.2, rd: 1 })];
    const roehre = [acap(ax, 9, 0, 37, 0, 1.3, 1.3)];
    const kugel = [acap(ax, 37, 0, 38, 0, 2.2, 2.2)];
    const oese = ring(...ax.P(-1, 0), 2.4, 2.4, 0.8, null, {}, 8);
    return {
      gruppen: [{ p: oese, mat: 'messing', k: 0 }, { p: koerper, mat: 'holzhell', k: 0 }, { p: roehre, mat: 'glas', k: 0, tone: 0.1 }, { p: kugel, mat: 'akzent', k: 0, tone: 0.1 }],
      details(P) {
        for (let t = 30; t < 37; t++) P.set(...ax.P(t, 0), 'a3');
        for (let t = 10; t < 37; t += 3) { P.set(...ax.P(t, -3), 'holz0'); if (t % 2) P.set(...ax.P(t, -3.8), 'holz0'); }
        P.set(...ax.P(29, -3.4), 'a2');
      },
    };
  },
};
