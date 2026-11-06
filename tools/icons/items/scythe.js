// Sense: langer, geschwungener Wurf von unten rechts nach oben, mit zwei Handgriffen, oben das
// lange gebogene Blatt nach links. Das Blatt ist rostig, nur auf einer Seite.
'use strict';
module.exports = {
  form(A) {
    const { kurve, acap, achse, apg } = A;
    const wurf = kurve([[36, 46], [40, 30], [33, 16], [36, 5]], 1.5, 1.4, null, {}, 14);
    const g1 = [acap(achse(37, 30, 0), 0, 0, -6, -1, 1.3, 1.1)], g2 = [acap(achse(35, 15, 0), 0, 0, -5, 1.5, 1.2, 1)];
    const blatt = [A.Pg([[37, 6], [30, 2], [18, 2], [7, 7], [2, 14], [10, 9], [20, 6.5], [30, 7], [36, 9]], null, { b: 1.4, rd: 0.4 })];
    void apg;
    return {
      gruppen: [{ p: wurf, mat: 'holz', k: 0 }, { p: [...g1, ...g2], mat: 'holz', k: 0 }, { p: blatt, mat: 'eisen', k: 0 }],
      details(P) {
        for (let x = 6; x < 34; x++) { const y = Math.round(8 - (x - 6) * 0.05 + (x < 18 ? (18 - x) * 0.15 : 0)); if ((x * 7) % 3) P.auf(x, y, 'rost2'); }
        P.set(36, 5, 'eisen3');
      },
    };
  },
};
