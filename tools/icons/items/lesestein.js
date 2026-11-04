// Lesestein: ein halbes Ei aus geschliffenem Beryll, hoch gewölbt, liegt auf einer aufgeschlagenen Buchseite;
// unter ihm sind die Buchstaben groß, daneben klein. Licht sammelt sich in der Kuppe.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E } = A;
    const blatt = [Pg([[2, 30], [24, 25], [46, 28], [46, 42], [24, 39], [3, 44]], null, { b: 0.8 })];
    const stein = [E(25, 26, 12, 13, null, { pf: 'dome', hz: 0.8 })];
    return {
      gruppen: [{ p: blatt, mat: 'papier', k: 0, tone: -0.05 }, { p: stein, mat: 'glas', k: 0, tone: 0.1 }],
      details(P) {
        P.ritz(24, 26, 24, 39, -2);
        for (const q of [33, 36, 39]) { P.line(5, q, 13, q - 1.6, 'papier1', true); P.line(37, q - 3, 44, q - 2, 'papier1', true); }
        for (let x = 16; x < 34; x++) if (x % 5 < 3) { P.auf(x, 29, 'kohle1'); P.auf(x, 30, 'kohle1'); P.auf(x, 31, 'kohle0'); }
        P.glow(29, 20, 6, 1.1, 'a2', 'a1'); P.set(30, 18, 'aH'); P.set(31, 18, 'a4'); P.set(29, 19, 'a4');
      },
    };
  },
};
