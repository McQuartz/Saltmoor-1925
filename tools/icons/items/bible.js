// Familienbibel: dickes Buch schräg von oben gesehen. Lederdeckel mit Messingecken und Schließe,
// der Seitenschnitt rechts und unten sichtbar, ein Lesebändchen hängt heraus, eingeprägtes Kreuz.
'use strict';
module.exports = {
  form(A) {
    const { Pg, C } = A;
    // Buchblock: Deckel oben (Parallelogramm), Schnitt rechts/unten als Dicke
    const D = 5; // Dicke
    const deckel = [[7, 15], [33, 6], [41, 31], [15, 40]];
    const block = [Pg([[7, 15], [33, 6], [41, 31], [41, 31 + D], [15, 40 + D], [7, 15 + D]], null, { b: 1 })];
    const deck = [Pg(deckel, null, { b: 2.2, rd: 0.6 })];
    const ruecken = [Pg([[5, 15], [9, 14], [17, 40], [15, 46], [12, 45], [5, 20]], null, { b: 1.5, rd: 0.8 })];
    const ecken = [Pg([[30, 6.5], [34, 5.5], [35.5, 10]], null, { b: 0.8 }), Pg([[40, 27], [42, 32], [37, 33]], null, { b: 0.8 })];
    const schliesse = [C(41, 21, 45, 22, 1.6, 1.6), C(44, 19, 45, 27, 1.3, 1.3)];
    const band = [C(29, 37, 31, 44, 1, 1), C(31, 44, 30, 47, 1, 0.8)];
    return {
      gruppen: [
        { p: block, mat: 'papier', k: 0, tone: 0.1 },
        { p: band, mat: 'akzent', k: 0 },
        { p: ruecken, mat: 'leder', k: 0 },
        { p: deck, mat: 'leder', k: 0 },
        { p: ecken, mat: 'messing', k: 0 },
        { p: schliesse, mat: 'messing', k: 0 },
      ],
      details(P) {
        // eingeprägtes Kreuz (Glanz in der Stofffarbe) und Rahmenlinie
        P.line(22, 14, 26, 30, 'a2', true); P.line(16, 21, 31, 17, 'a2', true); P.set(24, 22, 'a3');
        P.ritz(11, 17, 31, 10, -1); P.ritz(17, 37, 37, 30, -1);
        // Seitenlinien im Schnitt
        for (let k = 1; k < 5; k++) P.ritz(16, 40 + k, 41, 31 + k, k % 2 ? -1 : 0);
      },
    };
  },
};
