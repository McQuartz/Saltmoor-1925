// Pfandschein Nr. 1925: ein schräger Pappanhänger des Leihhauses mit Messingöse und Bindfaden. Die rechte Kante ist
// an der Perforation abgerissen, darauf ein runder Stempel und Zahlenreihen ohne lesbare Ziffern.
'use strict';
module.exports = {
  form(A) {
    const { Pg, ring, kurve } = A;
    const schein = [Pg([[7, 22], [13, 14], [40, 8], [44, 31], [18, 40], [10, 36]], null, { b: 1.4, rd: 0.5 })];
    const oese = ring(14, 23, 2.6, 2.6, 1, null, {}, 10);
    const faden = kurve([[13, 21], [6, 13], [9, 5], [4, 2]], 0.8, 0.7, null, { cr: true }, 12);
    return {
      gruppen: [{ p: faden, mat: 'wolle', k: 0, tone: 0.15 }, { p: schein, mat: 'papier', k: 0, tone: 0.08 }, { p: oese, mat: 'messing', k: 0 }],
      details(P) {
        P.loesch(14, 23); P.loesch(14, 24); P.loesch(15, 23);
        // Perforation: Zacken an der rechten Kante und eine gepunktete Abrisslinie
        for (let y = 9; y < 32; y += 2) { const x = 40 + (y - 8) * 0.17; P.loesch(Math.round(x) + 3, y); P.stufe(x - 1, y + 1, -2); }
        // runder Stempel in Rot
        for (let a = 0; a < 20; a++) { const w = a / 20 * Math.PI * 2; P.auf(31 + Math.cos(w) * 4.5, 22 + Math.sin(w) * 4, 'wachsrot2'); }
        P.auf(31, 22, 'wachsrot2'); P.auf(30, 21, 'wachsrot1'); P.auf(32, 23, 'wachsrot1');
        // Zahlenreihen als Striche
        for (const [x, y, l] of [[18, 22, 7], [19, 26, 9], [20, 30, 6], [21, 34, 10]]) for (let i = 0; i < l; i += (i % 3 === 2 ? 2 : 1)) P.stufe(x + i, y - i * 0.22, -2);
      },
    };
  },
};
