// Uhr ohne Zeiger: ein großes, gebrochenes Emaille-Zifferblatt ohne Gehäuse, schräg wie eine Scheibe,
// römische Stundenstriche, in der Mitte nur das leere Loch. Ein Splitter fehlt am Rand.
'use strict';
module.exports = {
  form(A) {
    const { E, Pg } = A;
    const blatt = [E(24, 24, 20, 17, null, { pf: 'bevel', hz: 0.15 })];
    const splitter = [Pg([[38, 30], [44, 36], [39, 40]], null, { b: 0.6 })];
    return {
      gruppen: [{ p: blatt, mat: 'papier', k: 0 }, { p: splitter, mat: 'papier', k: 0 }],
      details(P) {
        for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 - Math.PI / 2; const x = 24 + Math.cos(a) * 15, y = 24 + Math.sin(a) * 12.5; P.line(x, y, 24 + Math.cos(a) * 13, 24 + Math.sin(a) * 10.8, 'kohle1', true); if (i % 3 === 0) P.set(24 + Math.cos(a) * 15.5 + 1, 24 + Math.sin(a) * 13, 'kohle1'); }
        P.el(24, 24, 1.5, 1.5, 'kohle0', true); P.set(24, 23, 'a3');
        // Bruch: dunkle Linie von der Lücke zum Rand
        P.line(36, 30, 30, 26, 'papier0', true); P.line(30, 26, 27, 27, 'papier0', true);
        for (let y = 33; y < 42; y++) for (let x = 36; x < 46; x++) { if (y - 30 > (x - 36) * 1.4 && y > 30 && x < 41 + (y - 33) * 0.2 && P.info(x, y) && P.info(x, y).stufe < 4) P.loesch(x, y); }
      },
    };
  },
};
