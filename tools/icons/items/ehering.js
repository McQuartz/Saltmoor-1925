// Ehering einer Ertrunkenen: schmaler Goldring, schräg stehend, die Gravur innen sichtbar,
// daneben ein Tropfen Wasser, der nicht trocknet. Klein in der Mitte, viel Luft drumherum.
'use strict';
module.exports = {
  form(A) {
    const { ring, E } = A;
    const hinten = ring(24, 24, 12, 7, 2.2, null, {}, 18, Math.PI, Math.PI * 2);
    const vorne = ring(24, 24, 12, 7, 2.6, null, {}, 18, 0, Math.PI);
    const tropfen = [E(37, 40, 2.4, 2.8, null, { pf: 'bevel', hz: 0.6 })];
    return {
      gruppen: [{ p: hinten, mat: 'gold', k: 0, tone: -0.1 }, { p: vorne, mat: 'gold', k: 0 }, { p: tropfen, mat: 'akzent', k: 0, tone: 0.3 }],
      details(P) { for (const x of [17, 19, 21, 24, 26, 29]) P.stufe(x, 18, -1); P.set(36, 39, 'aH'); P.set(36, 36, 'a3'); },
    };
  },
};
