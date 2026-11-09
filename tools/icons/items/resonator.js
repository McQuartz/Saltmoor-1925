// Resonator: eine große Stimmgabel aus Stahl, der Stiel steckt in einem offenen Resonanzkasten aus Holz.
// Um die Zinken liegen Schallringe, rechts drei, links nur einer: Rechts antwortet etwas, links nicht.
'use strict';
module.exports = {
  form(A) {
    const { E, C, Pg, ring } = A;
    const kasten = [Pg([[10, 33], [38, 31], [40, 46], [8, 46]], null, { b: 1.6, rd: 0.8 })];
    const mund = [Pg([[13, 37], [21, 36], [21, 44], [13, 44]], null, { b: 0.4, rd: 0.2 })];
    const stiel = [C(24, 33, 24, 24, 1.7, 1.7)];
    const boden = ring(24, 20, 5, 4.6, 1.5, null, {}, 14, 0, Math.PI);
    const zinkeL = [C(19, 20, 18.5, 3, 1.9, 2.2)], zinkeR = [C(29, 20, 29.5, 3, 1.9, 2.2)];
    return {
      gruppen: [{ p: kasten, mat: 'holz', k: 0 }, { p: mund, mat: 'holz', k: 0, tone: -0.4, ohneRand: true }, { p: [...stiel, ...boden, ...zinkeL, ...zinkeR], mat: 'stahl', k: 0.8 }],
      details(P) {
        // Schallringe, gedithert, nur auf leerem Grund
        const bogen = (cx, cy, r, a0, a1, c, dith = true) => { for (let a = a0; a < a1; a += 0.04) { const x = Math.round(cx + Math.cos(a) * r), y = Math.round(cy + Math.sin(a) * r); if (!P.get(x, y) && (!dith || (x + y) % 2 === 0)) P.set(x, y, c); } };
        bogen(30, 11, 7, -1.0, 1.0, 'a3', false); bogen(30, 11, 11, -0.9, 0.9, 'a2'); bogen(30, 11, 15, -0.75, 0.75, 'a1');
        bogen(18, 11, 7, Math.PI - 1.0, Math.PI + 1.0, 'a2');
        // Spitzen der Zinken blank, Glanz an der rechten Kante
        P.set(18, 3, 'a5'); P.set(29, 3, 'a5'); P.set(30, 5, 'a4'); P.set(31, 8, 'stahlR2');
        // Maserung am Kasten, Nagelköpfe
        P.ritz(24, 38, 37, 37, -1); P.ritz(24, 43, 38, 43, -1); P.stufe(10, 34, +2); P.stufe(36, 32, +2); P.stufe(38, 33, +1);
        
      },
    };
  },
};
