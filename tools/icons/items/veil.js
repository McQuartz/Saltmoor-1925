// Trauerschleier: ein schwarzer Damenhut von der Seite, flacher Kopf mit Stoffblume, breite Krempe;
// von der Krempe fällt ein Tüllschleier wie ein Vorhang bis tief herab, mit gewelltem Saum. Durch den Tüll sieht man hindurch.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, saum } = A;
    const kopf = [Pg([[14, 13], [16, 5], [32, 4], [35, 13]], null, { b: 1.6, rd: 1.5 })];
    const krempe = [E(24, 14, 20, 3.6, null, { pf: 'bevel', hz: 0.3 })];
    const blume = [E(33, 8, 3.6, 3.2, null, { pf: 'bevel', hz: 0.5 })];
    const schleier = [Pg([[6, 15], [42, 15], [44, 42], ...saum(44, 4, 44, 6, 3, 4), [4, 42]], null, { b: 1, rd: 0.6 })];
    return {
      gruppen: [{ p: schleier, mat: 'tuch', k: 0, tone: 0.16 }, { p: krempe, mat: 'tuch', k: 0, tone: 0.12 }, { p: kopf, mat: 'tuch', k: 0, tone: 0.16 }, { p: blume, mat: 'tuch', k: 0, tone: 0.26 }],
      details(P) {
        // Tüll: Netz aus Rauten, nur jedes dritte Pixel bleibt stehen; Ränder bleiben geschlossen (Randlicht)
        for (let y = 19; y < 47; y++) for (let x = 6; x < 43; x++) { const i = P.info(x, y); if (!i || i.mat !== 'tuch' || i.stufe >= 4) continue; if ((x + y) % 4 === 0 || (x - y + 64) % 4 === 0) continue; let rand = false; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!P.get(x + dx, y + dy)) rand = true; if (!rand && x > 7 && x < 41) P.set(x, y, 'tuch0'); }
        P.set(33, 7, 'a3'); P.set(32, 8, 'a2'); P.ritz(15, 11, 34, 11, -1);
      },
    };
  },
};
