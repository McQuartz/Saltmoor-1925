// Die Stirnlampe (Reliquie): die runde Stirnlampe eines Triebwagens, schräg von der Seite: eine kurze Trommel aus
// Eisen, vorn der dicke Messingring um die gewölbte Linse, darüber ein Blendschirm, hinten der Bügel, mit dem sie
// an der Stirn saß. In der Linse steht das Licht in der Farbe des Stoffs, kalt und hell, als käme etwas näher.
'use strict';
module.exports = {
  form(A) {
    const { E, C, Pg } = A;
    const trommel = [C(30, 25, 38, 27, 12, 11)];
    const deckel = [E(38, 27, 4.5, 11, null, { pf: 'bevel', hz: 0.5 })];
    const buegel = [Pg([[36, 36], [44, 36], [44, 44], [30, 44], [30, 41], [36, 41]], null, { b: 1, rd: 0.5 })];
    const ring = [E(21, 24, 7, 13.5, null, { pf: 'bevel', hz: 0.5 })];
    const linse = [E(19.5, 24, 5, 10.5, null, { pf: 'dome', hz: 0.7 })];
    const schirm = [Pg([[14, 10], [30, 11], [32, 14], [17, 14]], null, { b: 1, rd: 0.4 })];
    return {
      gruppen: [{ p: buegel, mat: 'eisen', k: 0, tone: -0.1 }, { p: deckel, mat: 'eisen', k: 0, tone: -0.15 }, { p: trommel, mat: 'eisen', k: 0 }, { p: schirm, mat: 'eisen', k: 0, tone: 0.1 }, { p: ring, mat: 'messing', k: 0, tone: 0.15 }, { p: linse, mat: 'glas', k: 0, tone: -0.1 }],
      details(P) {
        P.glow(19, 24, 12, 1.3, 'a2', 'a1', false);
        for (let y = 16; y <= 32; y++) for (let x = 15; x <= 24; x++) { const d = ((x - 19.5) / 4.2) ** 2 + ((y - 24) / 8.5) ** 2; if (d <= 1) P.set(x, y, d < 0.25 ? 'a5' : d < 0.6 ? 'a4' : 'a3'); }
        P.set(22, 18, 'glasR2'); P.set(22, 19, 'glasR1');
        // Lichtstrahl nach links vorn, gestuft
        for (let i = 0; i < 6; i++) { P.set(10 - i, 22 + (i % 2), 'a2'); P.set(11 - i, 26 - (i % 2), 'a1'); }
        // Nieten auf der Trommel, Reifen
        for (const x of [28, 32, 36]) { P.stufe(x, 15, +2); P.stufe(x, 35, -1); }
        P.ritz(26, 14, 26, 36, -2);
      },
    };
  },
};
