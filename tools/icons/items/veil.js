// Trauerschleier: kleiner schwarzer Hut (Pillbox) schräg, daran ein langer Tüllschleier, der in Bahnen fällt.
// Der Tüll ist ein lichtes Netz, durch das man hindurchsieht.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E } = A;
    const hut = [Pg([[12, 12], [32, 8], [34, 15], [14, 19]], null, { b: 1.6, rd: 1.5 })];
    const krempe = [E(23, 17, 13, 3, null, { pf: 'bevel', hz: 0.3 })];
    const schleier = [Pg([[10, 17], [36, 13], [40, 30], [42, 44], [30, 41], [20, 46], [8, 43], [6, 30]], null, { b: 1.2, rd: 1 })];
    const blume = [E(30, 10, 3, 2.6, null, { pf: 'bevel', hz: 0.5 })];
    return {
      gruppen: [{ p: schleier, mat: 'tuch', k: 0 }, { p: krempe, mat: 'tuch', k: 0, tone: 0.1 }, { p: hut, mat: 'tuch', k: 0, tone: 0.12 }, { p: blume, mat: 'tuch', k: 0, tone: 0.2 }],
      details(P) {
        // Netz: jedes zweite Pixel im Inneren des Schleiers durchsichtig (Tüll), Kanten bleiben
        for (let y = 21; y < 44; y++) for (let x = 8; x < 41; x++) { const i = P.info(x, y); if (!i || i.mat !== 'tuch' || i.stufe >= 4) continue; if ((x + y) % 2 === 0 && P.get(x + 1, y) && P.get(x - 1, y) && P.get(x, y + 1)) P.loesch(x, y); }
        for (const x of [16, 24, 32]) for (let y = 22; y < 42; y += 2) P.stufe(x + (y % 4 ? 0 : 1), y, -1);
        P.set(30, 10, 'a3');
      },
    };
  },
};
