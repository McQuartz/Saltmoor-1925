// Mondkarte von 1890: ein Blatt, halb entrollt, die obere Kante noch eingerollt. Darauf getuscht die Scheibe
// mit Kratern und Zahlen; eine Ecke ist umgeschlagen, und auf der Rückseite sieht ein Krater als Auge heraus.
'use strict';
module.exports = {
  form(A) {
    const { Pg, C, E } = A;
    const blatt = [Pg([[8, 14], [38, 9], [42, 38], [12, 43]], null, { b: 1.2, rd: 0.6 })];
    const rolle = [C(7, 13, 39, 8, 3.4, 3.4)];
    const ecke = [Pg([[42, 38], [34, 39], [38, 31]], null, { b: 0.8, rd: 0.3 })];
    const scheibe = [E(25, 26, 10, 10, null, { pf: 'flat' })];
    return {
      gruppen: [{ p: blatt, mat: 'papier', k: 0 }, { p: scheibe, mat: 'papier', k: 0, tone: -0.15 }, { p: rolle, mat: 'papier', k: 0, tone: 0.1 }, { p: ecke, mat: 'papier', k: 0, tone: -0.3 }],
      details(P) {
        // Tuschekreis und Krater
        for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; P.auf(25 + Math.cos(a) * 10, 26 + Math.sin(a) * 10, 'kohle1'); }
        for (const [x, y, r] of [[21, 22, 2.2], [29, 24, 1.6], [24, 31, 2.6], [30, 31, 1.2], [19, 28, 1.1]]) { P.el(x, y, r, r, 'kohle2', true); P.auf(x - r * 0.6, y + r * 0.6, 'papier3'); }
        // Beschriftung: Ziffern als kurze Striche
        for (const [x, y] of [[33, 18], [12, 33], [33, 36], [14, 20]]) { P.auf(x, y, 'kohle1'); P.auf(x + 1, y, 'kohle1'); P.auf(x + 2, y - 1, 'kohle1'); }
        for (let x = 9; x < 39; x += 4) P.stufe(x, 11 - (x - 9) * 0.15, +1);
        // Rückseite in der umgeschlagenen Ecke: ein Auge
        P.set(38, 35, 'kohle0'); P.set(39, 35, 'a3'); P.set(37, 35, 'kohle0');
      },
    };
  },
};
