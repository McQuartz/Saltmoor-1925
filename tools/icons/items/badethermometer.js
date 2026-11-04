// Badethermometer: ein schwimmendes Holzthermometer mit breitem, oben gerundetem Brett und Loch für die Kordel,
// in der Mitte die Glasröhre mit Skala; die Säule steht unter null (der rote Faden ist fast ganz unten).
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, kurve } = A;
    const ax = achse(24, 4, Math.PI / 2 + 0.3);
    const brett = [apg(ax, [[0, -3], [3, -6], [38, -6.5], [42, -3], [42, 3], [38, 6.5], [3, 6], [0, 3]], null, { b: 2, rd: 1 })];
    const roehre = [acap(ax, 6, 0, 36, 0, 1.4, 1.4)];
    const kugel = [acap(ax, 36, 0, 37, 0, 2.4, 2.4)];
    const [kx, ky] = ax.P(2, 0);
    const kordel = kurve([[kx, ky], [kx + 8, ky - 2], [kx + 12, ky + 5], [kx + 16, ky + 2]], 0.7, 0.6, null, {}, 10);
    return {
      gruppen: [{ p: kordel, mat: 'wolle', k: 0 }, { p: brett, mat: 'holzhell', k: 0 }, { p: roehre, mat: 'glas', k: 0, tone: 0.15 }, { p: kugel, mat: 'rotstoff', k: 0, tone: 0.2 }],
      details(P) {
        P.set(kx, ky, 'kohle0');
        for (let t = 33; t < 37; t++) P.set(...ax.P(t, 0), 'rotstoff3');
        for (let t = 8; t < 36; t += 2.5) { P.set(...ax.P(t, -3), 'holz0'); P.set(...ax.P(t, -4), 'holz0'); if (Math.round(t) % 5 === 0) P.set(...ax.P(t, -5), 'holz0'); }
        for (let t = 8; t < 36; t += 5) P.set(...ax.P(t, 3.5), 'holz1');
        P.set(...ax.P(30, -2.6), 'a3');
      },
    };
  },
};
