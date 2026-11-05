// Bleigürtel des Tauchers: ein breiter Segeltuchgurt, als U hängend, mit fünf stumpfen Bleiplatten quer darauf.
// Links die Messingschnalle, rechts der Schnellverschluss, dessen Haken verbogen ist.
'use strict';
module.exports = {
  form(A) {
    const { kurve, achse, apg, C } = A;
    const gurt = kurve([[8, 5], [7, 28], [24, 42], [41, 28], [40, 5]], 3.6, 3.6, null, { cr: true }, 26);
    const platten = [];
    for (const t of [0.24, 0.37, 0.5, 0.63, 0.76]) { const [x, y] = gurt.B(t), [x2, y2] = gurt.B(t + 0.01); const ax = achse(x, y, Math.atan2(y2 - y, x2 - x)); platten.push(apg(ax, [[-2.4, -5.2], [2.4, -5.2], [2.4, 5.2], [-2.4, 5.2]], null, { b: 1.3, rd: 0.4 })); }
    const schnalle = [C(3.5, 3, 12.5, 3, 1.2, 1.2), C(3.5, 3, 3.5, 9, 1.2, 1.2), C(12.5, 3, 12.5, 9, 1.2, 1.2), C(3.5, 9, 12.5, 9, 1.2, 1.2), C(8, 3, 8, 9, 0.8, 0.8)];
    const haken = [C(40, 5, 40, 1.5, 1.4, 1.2), C(40, 1.5, 44.5, 2.5, 1.2, 1.1), C(44.5, 2.5, 45.5, 7.5, 1.1, 1)];
    return {
      gruppen: [{ p: gurt, mat: 'wolle', k: 0, tone: 0.14 }, { p: platten, mat: 'stein', k: 0, tone: 0.16 }, { p: schnalle, mat: 'messing', k: 0 }, { p: haken, mat: 'eisen', k: 0, tone: 0.1 }],
      details(P) {
        // Steppnähte an beiden Kanten des Gurts
        for (let i = 1; i < 52; i += 2) { const q = i / 52; const [x, y] = gurt.B(q), [x2, y2] = gurt.B(Math.min(1, q + 0.01)); const a = Math.atan2(y2 - y, x2 - x); for (const s of [-2.4, 2.4]) P.stufe(x - Math.sin(a) * s, y + Math.cos(a) * s, -1); }
        for (const t of [0.24, 0.5, 0.76]) { const [x, y] = gurt.B(t); P.auf(x + 1, y - 3, 'steinR1'); }
      },
    };
  },
};
