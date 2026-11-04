// Lesestein: ein halbes Ei aus geschliffenem Beryll, liegt auf einem Pergamentstreifen mit Zeilen;
// was darunter ist, erscheint größer. Licht sammelt sich im Stein.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E } = A;
    const blatt = [Pg([[3, 26], [42, 20], [45, 36], [6, 42]], null, { b: 0.8 })];
    const stein = [E(24, 28, 13, 10, null, { pf: 'dome', hz: 0.7 })];
    return {
      gruppen: [{ p: blatt, mat: 'papier', k: 0, tone: -0.05 }, { p: stein, mat: 'glas', k: 0, tone: 0.05 }],
      details(P) {
        for (const q of [27, 31, 35, 39]) { P.line(7, q, 42, q - 5.5, 'papier1', true); }
        // vergrößerte Zeile im Stein
        for (let x = 15; x < 33; x++) { const y = Math.round(30 - (x - 15) * 0.14); if (x % 4) { P.auf(x, y, 'kohle1'); P.auf(x, y + 1, 'kohle1'); } }
        P.glow(28, 24, 6, 1.1, 'a2', 'a1'); P.set(30, 22, 'aH'); P.set(31, 22, 'a4'); P.set(29, 23, 'a4');
      },
    };
  },
};
