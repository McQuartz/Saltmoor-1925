// Das Aufnahmebuch: ein dickes Folio in schwarzem Leder mit Messingecken, aufgeschlagen, die Seiten voll enger
// Zeilen. Die letzte Zeile ist frisch, in roter Tinte. Ein Lesebändchen hängt heraus.
'use strict';
module.exports = {
  form(A) {
    const { Pg, C } = A;
    const deckel = [Pg([[3, 30], [24, 38], [45, 28], [45, 33], [24, 43], [3, 35]], null, { b: 1.4, rd: 1 })];
    const links = [Pg([[4, 29], [23, 36], [23, 13], [5, 7]], null, { b: 1.2, rd: 0.6 })];
    const rechts = [Pg([[25, 36], [44, 27], [43, 5], [25, 13]], null, { b: 1.2, rd: 0.6 })];
    const ecken = [Pg([[3, 30], [7, 32], [3, 35]], null), Pg([[45, 28], [41, 30], [45, 33]], null)];
    const band = [C(24, 38, 25, 46, 0.9, 0.9, null)];
    return {
      gruppen: [{ p: deckel, mat: 'leder', k: 0 }, { p: links, mat: 'papier', k: 0, tone: 0.1 }, { p: rechts, mat: 'papier', k: 0, tone: 0.25 }, { p: ecken, mat: 'messing', k: 0 }, { p: band, mat: 'rotstoff', k: 0 }],
      details(P) {
        for (let i = 0; i < 6; i++) { P.ritz(7, 11 + i * 3.6, 21, 15 + i * 3.4, -2); P.ritz(27, 15 + i * 3.4 - 1, 41, 9 + i * 3.6, -2); }
        P.ritz(27, 35, 41, 29, -2);
        for (let x = 28; x <= 38; x += 2) P.set(x, 34 - (x - 28) * 0.43, 'flamme');
        P.ritz(24, 13, 24, 37, -3);
      },
    };
  },
};
