// Das Strandbuch des Vogts: ein aufgeschlagenes, vom Wasser gewelltes Kontobuch, quer liegend, liniert,
// mit Einträgen ohne lesbare Schrift. Über die linke Seite hängt ein Strang Seetang, unten ein Wasserfleck.
'use strict';
module.exports = {
  form(A) {
    const { Pg, kurve } = A;
    const deckel = [Pg([[2, 23], [23, 26], [44, 19], [46, 37], [24, 45], [3, 40]], null, { b: 1.2, rd: 0.6 })];
    const links = [Pg([[4, 19], [14, 19], [23, 23], [23, 41], [14, 38], [5, 37]], null, { b: 1.6, rd: 0.8 })];
    const rechts = [Pg([[25, 23], [34, 17], [44, 16], [44, 34], [34, 36], [25, 41]], null, { b: 1.6, rd: 0.8 })];
    const tang = kurve([[3, 14], [10, 22], [9, 31], [15, 40], [12, 46]], 1.3, 0.8, null, { cr: true }, 16);
    return {
      gruppen: [{ p: deckel, mat: 'leder', k: 0, tone: 0.12 }, { p: links, mat: 'papier', k: 0, tone: 0.05 }, { p: rechts, mat: 'papier', k: 0, tone: 0.12 }, { p: tang, mat: 'gruenstoff', k: 0, tone: 0.1 }],
      details(P) {
        // Linien und Einträge (kurze Striche, keine Schrift)
        for (let k = 0; k < 5; k++) { P.ritz(7, 23 + k * 3, 21, 27 + k * 3, -1); P.ritz(27, 26 + k * 3, 42, 20 + k * 3, -1); }
        for (const [x, y, l] of [[29, 25, 5], [30, 28, 7], [28, 31, 4], [31, 34, 6]]) for (let i = 0; i < l; i++) P.stufe(x + i, y - i * 0.4, -2);
        // Wasserfleck unten rechts, ausgefranst
        for (let y = 28; y < 40; y++) for (let x = 30; x < 44; x++) { const i = P.info(x, y); if (!i || i.mat !== 'papier') continue; const d = Math.hypot((x - 37) / 1.3, y - 34); if (d < 4) P.set(x, y, (x + y) % 2 ? 'a1' : 'a2'); else if (d < 5.5 && (x * 7 + y * 3) % 3 === 0) P.set(x, y, 'a2'); }
        // Falz in der Mitte
        P.line(24, 23, 24, 42, 'leder0', true);
      },
    };
  },
};
