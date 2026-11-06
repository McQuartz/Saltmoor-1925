// Korkring der Gesine: ein Rettungsring aus Kork unter Segeltuch, schräg von oben, vier rote Bänder,
// rundum eine Greifleine in Schlaufen. Das Tuch ist dunkel vor Nässe, unten hängt Tang.
'use strict';
module.exports = {
  form(A) {
    const { E, ring, C } = A;
    const r1 = ring(24, 24, 15, 12, 5.2, null, {}, 26);
    const leine = [];
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.3; leine.push(C(24 + Math.cos(a) * 20.5, 24 + Math.sin(a) * 16.5, 24 + Math.cos(a + 0.39) * 20.5, 24 + Math.sin(a + 0.39) * 16.5, 0.6, 0.6)); }
    const tang = [C(14, 34, 12, 41, 0.9, 0.5), C(16, 35, 17, 43, 0.8, 0.4)];
    return {
      gruppen: [{ p: tang, mat: 'gruenstoff', k: 0 }, { p: r1, mat: 'stoff', k: 1, tone: 0.25 }, { p: leine, mat: 'holzhell', k: 0, ohneR2: true }],
      details(P) {
        for (const a0 of [0.55, 2.1, 3.7, 5.25]) for (let a = a0 - 0.2; a <= a0 + 0.2; a += 0.04) for (let rr = 10; rr <= 20; rr += 0.5) { const x = Math.round(24 + Math.cos(a) * rr), y = Math.round(24 + Math.sin(a) * rr * 0.8); const i = P.info(x, y); if (i && i.mat === 'stoff') P.set(x, y, i.stufe >= 4 ? 'rotstoffR2' : 'rotstoff' + Math.min(3, i.stufe + 1)); }
        for (let a = 3.4; a < 5.8; a += 0.08) P.stufe(24 + Math.cos(a) * 12, 24 + Math.sin(a) * 9.6, -1);
        P.set(31, 15, 'a3'); P.set(36, 19, 'a2');
      },
    };
  },
};
