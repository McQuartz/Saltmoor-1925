// Die Streckenlaterne: eine kantige Bahnwärterlampe aus Blech, schräg im Licht, oben der Bügel, vorn eine runde
// Linse, in der das kalte Licht in der Farbe des Stoffs steht; seitlich ein grünes Signalglas.
'use strict';
module.exports = {
  form(A) {
    const { E, C, Pg, ring } = A;
    const buegel = ring(24, 10, 9, 6, 0.9, null, {}, 12, Math.PI, Math.PI * 2);
    const koerper = [Pg([[12, 12], [34, 10], [36, 40], [13, 42]], null, { b: 2, rd: 1 })];
    const seite = [Pg([[34, 10], [40, 13], [41, 38], [36, 40]], null, { b: 1, rd: 0.6 })];
    const dach = [Pg([[10, 12], [24, 6], [38, 9], [41, 13], [34, 11], [12, 13]], null, { b: 1, rd: 0.5 })];
    const linse = [E(24, 26, 8, 8.5, null, { pf: 'bevel', hz: 0.5 })];
    const gruen = [Pg([[36, 18], [40, 20], [40, 30], [36, 31]], null, { b: 0.8 })];
    const fuss = [Pg([[11, 40], [37, 38], [41, 37], [41, 41], [37, 43], [11, 44]], null, { b: 1, rd: 0.4 })];
    return {
      gruppen: [
        { p: buegel, mat: 'eisen', k: 0 },
        { p: seite, mat: 'eisen', k: 0, tone: -0.15 },
        { p: koerper, mat: 'eisen', k: 0 },
        { p: dach, mat: 'eisen', k: 0, tone: 0.1 },
        { p: fuss, mat: 'eisen', k: 0, tone: -0.05 },
        { p: gruen, mat: 'gruenstoff', k: 0, tone: 0.2 },
        { p: linse, mat: 'glas', k: 0, tone: -0.2 },
      ],
      details(P) {
        // Messingring um die Linse, Licht darin
        for (let a = 0; a < 6.28; a += 0.25) P.set(Math.round(24 + Math.cos(a) * 8.5), Math.round(26 + Math.sin(a) * 9), Math.cos(a) - Math.sin(a) > 0.5 ? 'messingR1' : 'messing1');
        P.glow(24, 26, 10, 1.3, 'a2', 'a1');
        for (let y = 21; y <= 31; y++) for (let x = 19; x <= 29; x++) { const d = ((x - 24) ** 2 + (y - 26) ** 2) / 25; if (d <= 1) P.set(x, y, d < 0.2 ? 'a5' : d < 0.55 ? 'a4' : 'a3'); }
        P.set(23, 25, 'a5'); P.set(24, 25, 'a4'); P.set(23, 26, 'a4'); P.set(22, 24, 'a3');
        P.set(27, 22, 'glasR2'); P.set(28, 23, 'glasR1');
        // Nieten, Lüftungsschlitze im Dach
        for (const [x, y] of [[14, 15], [32, 13], [15, 38], [33, 36]]) P.stufe(x, y, +2);
        for (let x = 18; x < 32; x += 3) P.ritz(x, 10, x + 1, 9, -2);
      },
    };
  },
};
