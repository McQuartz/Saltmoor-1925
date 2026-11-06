// Die Funkenstrecke: zwei Kupferkugeln auf Messingstäben über einem kleinen Sockel aus Bakelit, ein Finger
// breit auseinander; dazwischen springt ein Funke, gezackt, in der Farbe des Stoffs.
'use strict';
module.exports = {
  form(A) {
    const { C, E, Pg } = A;
    const sockel = [Pg([[6, 40], [40, 34], [44, 38], [10, 45]], null, { rd: 1 })];
    const stabL = [C(12, 39, 12, 24, 1.3, 1.1), C(12, 24, 14, 21, 1.1, 1)];
    const stabR = [C(37, 35, 37, 22, 1.3, 1.1), C(37, 22, 35, 19, 1.1, 1)];
    const kugelL = [E(15, 19, 4.4, 4.4, null, { pf: 'dome' })];
    const kugelR = [E(34, 17, 4.4, 4.4, null, { pf: 'dome' })];
    const fuss = [E(12, 39, 3, 1.6, null), E(37, 35, 3, 1.6, null)];
    return {
      gruppen: [{ p: sockel, mat: 'kohle', k: 0 }, { p: fuss, mat: 'kohle', k: 0, tone: 0.2 }, { p: [...stabL, ...stabR], mat: 'messing', k: 0 }, { p: kugelR, mat: 'kupfer', k: 0 }, { p: kugelL, mat: 'kupfer', k: 0, tone: 0.1 }],
      details(P) {
        // Funke: gezackter Strich zwischen den Kugeln
        const pts = [[19, 18], [21, 16], [23, 19], [25, 15], [27, 18], [29, 16], [30, 17]];
        for (let i = 0; i < pts.length - 1; i++) P.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 'a4');
        P.set(23, 18, 'a5'); P.set(25, 16, 'a5'); P.set(27, 17, 'a5'); P.glow(24.5, 17.5, 8, 0.9, 'a2', 'a1', false);
        P.set(17, 17, 'kupferR2'); P.set(36, 15, 'kupferR2');
        for (let x = 12; x < 40; x += 5) P.ritz(x, 41 - (x - 12) * 0.17, x + 2, 41 - (x - 10) * 0.17, -1);
      },
    };
  },
};
