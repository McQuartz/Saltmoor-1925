// Wachsauge: eine Votivgabe, ein mandelförmiges Auge aus hellem Wachs auf einem kleinen Täfelchen,
// mit Lidern und Wimpernritzen. Die Pupille schaut seitlich, in die Richtung, in die du gleich gehst.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, ring } = A;
    const tafel = [Pg([[5, 14], [43, 10], [44, 38], [6, 40]], null, { b: 2, rd: 2 })];
    const auge = [Pg([[9, 26], [17, 18], [27, 16], [38, 22], [40, 25], [31, 32], [20, 34], [12, 31]], null, { b: 2, rd: 1 })];
    const oese = ring(24, 8, 2.6, 2.6, 0.9, null, {}, 8);
    return {
      gruppen: [{ p: oese, mat: 'messing', k: 0 }, { p: tafel, mat: 'wachsrot', k: 0, tone: -0.15 }, { p: auge, mat: 'wachsrot', k: 0, tone: 0.18 }],
      details(P) {
        P.el(30, 25, 5, 5, 'wachsrot1', true); P.el(31, 25, 2.4, 2.4, 'kohle0', true); P.set(32, 24, 'a3');
        for (const x of [14, 18, 22, 26, 30, 34]) P.ritz(x, 18 - (x > 22 ? (34 - x) * 0.1 : (x - 14) * 0.15), x + 1, 15 - (x > 22 ? (34 - x) * 0.1 : (x - 14) * 0.15), -1);
        P.ritz(10, 26, 38, 24, 0);
      },
    };
  },
};
