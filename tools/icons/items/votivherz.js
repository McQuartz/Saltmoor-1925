// Votivherz: ein Herz aus rotem Wachs, groß wie eine Faust, mit einer kleinen Flamme oben (Herz-Jesu-Form),
// einem Dornenkranz als Ritzung und einer Öse zum Aufhängen in der Grotte.
'use strict';
module.exports = {
  form(A) {
    const { E, Pg, ring } = A;
    const herz = [E(18, 22, 9, 9, null, { pf: 'bevel', hz: 0.5 }), E(30, 22, 9, 9, null, { pf: 'bevel', hz: 0.5 }), Pg([[10, 25], [38, 25], [24, 44]], null, { b: 3, rd: 2 })];
    const oese = ring(24, 11, 2.4, 2.4, 0.9, null, {}, 8);
    return {
      gruppen: [{ p: oese, mat: 'messing', k: 0 }, { p: herz, mat: 'wachsrot', k: 3 }],
      details(P) {
        for (let x = 12; x < 37; x++) { const y = 26 + Math.sin((x - 12) * 0.9) * 1.2; P.stufe(x, y, -2); if (x % 3 === 0) P.stufe(x, y - 2, -1); }
        P.flamme(24, 15, 6, 1.6, 0.2); P.glow(22, 30, 8, 0.7, 'wachsrot3');
        P.set(16, 19, 'a3');
      },
    };
  },
};
