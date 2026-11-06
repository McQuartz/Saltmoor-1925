// Strumpf voller Pfennige: ein grauer Wollstrumpf mit zwei roten Ringeln am Bund, oben zusammengerafft und mit
// Bindfaden abgebunden. Er hängt schwer durch: das Bein schräg, die Ferse geknickt, der Fuß prall von Münzen.
// An der gestopften Spitze ist er aufgerissen, Kupferpfennige rutschen heraus.
'use strict';
module.exports = {
  form(A) {
    const { C, E, Pg } = A;
    const raff = [Pg([[12, 4], [19, 4], [21, 10], [10, 10]], null, { b: 1.4, rd: 1.2 })];
    const bein = [Pg([[9, 10], [22, 10], [25, 27], [12, 30]], null, { b: 3, rd: 2.5 })];
    const fuss = [E(26, 36, 14, 8.5, null, { pf: 'dome' }), C(17, 28, 22, 35, 7, 8)];
    const spitze = [E(37, 37, 5.5, 5.5, null, { pf: 'dome' })];
    const muenzen = [E(44, 41, 2.6, 1.4, null, { pf: 'bevel' }), E(40, 46, 3.2, 1.5, null, { pf: 'bevel' }), E(45.5, 46, 2.2, 1.2, null, { pf: 'bevel' })];
    return {
      gruppen: [{ p: muenzen, mat: 'kupfer', k: 0, tone: 0.15 }, { p: raff, mat: 'stoff', k: 0, tone: 0.16 }, { p: [...bein, ...fuss], mat: 'stoff', k: 0, tone: 0.12 }, { p: spitze, mat: 'wolle', k: 0, tone: 0.04 }],
      details(P) {
        // Bindfaden um die Raffung, zwei rote Ringel am Bund
        P.line(10, 9, 21, 9, 'papier3', true); P.set(22, 8, 'papier3'); P.set(23, 7, 'papier2');
        for (const y of [13, 16]) for (let x = 8; x < 25; x++) P.auf(x, y + (x - 9) * 0.05, (x + y) % 2 ? 'rotstoff3' : 'rotstoffR1');
        // Strickreihen, Raffalten
        for (let y = 20; y < 28; y += 3) P.ritz(12, y, 23, y + 0.5, -1);
        for (const x of [13, 15.5, 18]) P.ritz(x, 5, x - 0.5, 9, -1);
        // Beulen der Münzen im Fuß
        for (const [x, y] of [[16, 35], [21, 33], [27, 36], [21, 40], [31, 39], [26, 41], [32, 33]]) { P.stufe(x, y, +1); P.stufe(x + 1, y + 1, -1); }
        // gestopfte Spitze (Kreuzstiche) und Riss mit Kupfer
        for (const [x, y] of [[35, 35], [37, 37], [35, 39], [37, 33]]) P.stufe(x, y, -1);
        for (const [x, y] of [[41, 38], [41, 39], [40, 40]]) P.set(x, y, 'kupfer3'); P.set(42, 37, 'kupferR2'); P.set(44, 40, 'kupferR2'); P.set(39, 45, 'kupferR1');
      },
    };
  },
};
