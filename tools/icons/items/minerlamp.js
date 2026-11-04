// Grubenlampe: Karbidlampe aus Messing, unten der Wassertank, darüber der Brenner mit großem
// runden Reflektor, aus dessen Mitte die Flamme schießt. Haken am Griff.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C, kurve } = A;
    const tank = [Pg([[12, 30], [26, 30], [27, 45], [11, 45]], null, { b: 2, rd: 1.2 })];
    const deckel = [E(19, 29, 8, 2.4, null, { pf: 'bevel', hz: 0.5 })];
    const rohr = [C(23, 26, 28, 22, 1.4, 1.2)];
    const reflektor = [E(33, 19, 7, 11, null, { pf: 'bevel', hz: 0.35 })];
    const haken = kurve([[16, 28], [14, 18], [17, 10], [21, 9], [22, 13]], 1, 0.9, null, {}, 12);
    const schraube = [C(19, 27, 19, 24, 1.4, 1.4)];
    return {
      gruppen: [{ p: haken, mat: 'eisen', k: 0 }, { p: tank, mat: 'messing', k: 0 }, { p: [...deckel, ...schraube], mat: 'messing', k: 0 }, { p: rohr, mat: 'messing', k: 0 }, { p: reflektor, mat: 'messing', k: 0, tone: 0.1 }],
      details(P) {
        P.el(33, 19, 5, 8.5, 'messing1', true); P.el(33, 19, 3, 5.5, 'messing2', true);
        P.glow(33, 19, 7, 1.1, 'glutMittel', 'glutDim');
        P.flamme(36, 21, 9, 1.8, 1.3);
        for (let x = 12; x < 27; x += 3) P.stufe(x, 38, -1);
      },
    };
  },
};
