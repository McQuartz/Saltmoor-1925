// Lampe aus dem Grab: eine schmale Laterne mit Spitzdach und Ring, unten statt eines Fußes ein Eisendorn zum Einstecken
// in die Erde, an dem noch Erde klebt. Hinter dem Glas brennt ein grünes Licht, das nicht zur Flamme gehört.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C, ring } = A;
    const oese = ring(24, 4.5, 3.4, 3.4, 1, null, {}, 10);
    const dach = [Pg([[24, 8], [33, 16], [15, 16]], null, { b: 1.2, rd: 0.5 }), Pg([[14, 15], [34, 15], [34, 18], [14, 18]], null, { b: 1, rd: 0.4 })];
    const glas = [Pg([[16, 18], [32, 18], [31, 36], [17, 36]], null, { b: 1.6, rd: 0.8 })];
    const boden = [Pg([[15, 36], [33, 36], [29, 40], [19, 40]], null, { b: 1, rd: 0.5 })];
    const dorn = [C(24, 40, 24, 47.5, 2.8, 0.5)];
    const erde = [E(19, 42, 3.2, 2.2, null, { pf: 'bevel', hz: 0.4 }), E(29, 44, 2.6, 2.2, null, { pf: 'bevel', hz: 0.4 }), E(24, 46, 2, 1.4)];
    return {
      gruppen: [{ p: dorn, mat: 'eisen', k: 0 }, { p: erde, mat: 'torf', k: 0 }, { p: [...oese, ...dach, ...boden], mat: 'eisen', k: 0, tone: 0.1 }, { p: glas, mat: 'glas', k: 0, tone: -0.1 }],
      details(P) {
        // Licht im Glas: grüne Flamme, Ränder gedithert, Schein auf dem Glas
        P.glow(24, 28, 11, 1.2, 'a2', 'a1', false);
        for (let y = 20; y <= 35; y++) { const t = (35 - y) / 15; const w = 3.6 * Math.sin(Math.PI * Math.min(1, (t + 0.12) / 1.05)) * (1 - t * 0.3); for (let x = 15; x <= 33; x++) { const dx = Math.abs(x + 0.5 - 24); if (dx > w) continue; const v = 1 - dx / (w + 0.4) - t * 0.5; P.set(x, y, v > 0.6 ? 'a5' : v > 0.35 ? 'a4' : (x + y) % 2 ? 'a3' : 'a2'); } }
        // Gestänge vor dem Glas: zwei Streben und ein Band
        P.line(17, 18, 17, 36, 'eisen2'); P.line(31, 18, 31, 36, 'eisen3'); P.line(16, 27, 32, 27, 'eisen1');
        P.set(32, 19, 'eisenR2'); P.set(32, 20, 'eisenR2'); P.set(33, 16, 'eisenR2'); P.set(30, 12, 'eisenR2');
        // Erde tropft
        P.set(20, 40, 'torf2'); P.set(30, 43, 'torf1');
      },
    };
  },
};
