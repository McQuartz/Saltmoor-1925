// Korkweste der Seenotretter: eine ärmellose Weste von vorn, zwei Hälften aus je drei dicken Korkblöcken in
// Segeltuch, mit Teer verfugt, Schulterriemen und ein Bindeband über der Brust.
'use strict';
module.exports = {
  form(A) {
    const { Pg, C } = A;
    const tuch = [Pg([[8, 12], [19, 9], [21, 45], [8, 44], [6, 28]], null, { b: 1.4, rd: 0.8 }), Pg([[28, 9], [39, 12], [42, 28], [40, 44], [27, 45]], null, { b: 1.4, rd: 0.8 })];
    const kork = [];
    for (let k = 0; k < 3; k++) { const y = 14 + k * 10; kork.push(Pg([[9, y + 0.5], [19, y - 1], [20, y + 7.5], [9, y + 8.5]], null, { b: 1.6, rd: 1 })); kork.push(Pg([[28, y - 1], [38, y + 0.5], [39.5, y + 8.5], [28, y + 7.5]], null, { b: 1.6, rd: 1 })); }
    const riemen = [C(14, 11, 19, 3, 1.6, 1.4), C(19, 3, 28, 3, 1.4, 1.4), C(28, 3, 33, 11, 1.4, 1.6)];
    const band = [C(19, 29, 28, 29, 1, 1), C(23.5, 29, 21, 35, 0.9, 0.8), C(23.5, 29, 26, 35, 0.9, 0.8)];
    return {
      gruppen: [{ p: riemen, mat: 'leder', k: 0 }, { p: tuch, mat: 'oelzeug', k: 0, tone: -0.12 }, { p: kork, mat: 'holzhell', k: 0, tone: 0.08 }, { p: band, mat: 'wolle', k: 0, tone: 0.1 }],
      details(P) {
        // Korkporen
        for (let y = 13; y < 44; y++) for (let x = 8; x < 41; x++) { const i = P.info(x, y); if (i && i.mat === 'holzhell' && i.stufe < 3 && (x * 5 + y * 11) % 9 === 0) P.stufe(x, y, -1); }
        // Wassertropfen am Saum
        P.tropfen(14, 46, 'a2', 'a3'); P.tropfen(35, 46.5, 'a2', 'a3');
      },
    };
  },
};
