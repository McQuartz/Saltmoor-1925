// Robbenfell: eine liegende Robbe als ganzes Fell, der Leib wie eine Banane gebogen, links der erhobene Kopf mit runder
// Schnauze, Barthaaren und großen dunklen Augen, darunter eine breite Vorderflosse, rechts die zwei Hinterflossen als Fächer.
// Grau gefleckt; es atmet, wenn du stillstehst.
'use strict';
module.exports = {
  form(A) {
    const { kurve, E, Pg, C } = A;
    const leib = kurve([[13, 20], [18, 31], [30, 35], [41, 31]], 7.5, 4.2, null, {}, 16);
    const kopf = [E(11, 15, 7, 6.2, null, { pf: 'bevel', hz: 0.5 }), E(5.5, 18, 3.6, 3, null, { pf: 'bevel', hz: 0.5 })];
    const vorne = [Pg([[18, 34], [24, 36], [21, 45], [15, 46], [16, 40]], null, { b: 1.4, rd: 0.8 })];
    const hinten = [Pg([[39, 30], [47, 22], [47, 27], [44, 31], [47, 36], [46, 40], [39, 34]], null, { b: 1.2, rd: 0.5 })];
    void C;
    return {
      gruppen: [{ p: hinten, mat: 'fell', k: 0, tone: -0.05 }, { p: [...leib, ...kopf], mat: 'fell', k: 2.5 }, { p: vorne, mat: 'fell', k: 0, tone: -0.08 }],
      details(P) {
        P.el(9, 13, 1.5, 1.5, 'kohle0'); P.el(14, 12, 1.4, 1.4, 'kohle0'); P.set(9, 12, 'fellR2'); P.set(14, 11, 'fellR2');
        P.set(3, 17, 'kohle0'); P.set(4, 17, 'kohle0');
        for (const [x0, y0, x1, y1] of [[4, 19, 0, 17], [4, 20, 0, 21], [6, 20, 2, 24], [7, 20, 4, 25]]) P.line(x0, y0, x1, y1, 'fell3');
        for (const [x, y] of [[20, 24], [27, 30], [33, 28], [22, 31], [36, 33], [17, 27]]) { P.stufe(x, y, -2); P.stufe(x + 1, y, -2); P.stufe(x, y + 1, -1); }
        for (const [x, y] of [[19, 44], [21, 43]]) P.stufe(x, y, -2);
      },
    };
  },
};
