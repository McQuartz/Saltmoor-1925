// Familienbibel: dickes Buch schräg gestellt, Lederdeckel mit Messingecken und Schließe,
// ein Lesebändchen hängt heraus, auf dem Deckel ein eingeprägtes Kreuz.
'use strict';
module.exports = {
  form(A) {
    const { Pg, C } = A;
    // Deckel (vorne), Schnitt (Seiten) rechts unten sichtbar
    const schnitt = [Pg([[14, 12], [40, 7], [43, 33], [17, 40]], null, { b: 1.2 })];
    const deckel = [Pg([[8, 13], [36, 7], [39, 34], [11, 41]], null, { b: 2.2, rd: 0.5 })];
    const ruecken = [Pg([[5, 14], [9, 12], [12, 41], [8, 42]], null, { b: 1.5, rd: 0.6 })];
    const ecken = [Pg([[33, 7], [37, 6.5], [37.5, 11]], null, { b: 0.8 }), Pg([[38.5, 30], [39.5, 35], [35, 35.5]], null, { b: 0.8 })];
    const schliesse = [C(39, 20, 44, 21, 1.6, 1.6), C(42, 18, 42, 24, 1.3, 1.3)];
    const band = [C(25, 39, 24, 46, 1, 1), C(24, 46, 26, 47, 1, 1)];
    return {
      gruppen: [
        { p: band, mat: 'akzent', k: 0 },
        { p: schnitt, mat: 'papier', k: 0 },
        { p: ruecken, mat: 'leder', k: 0 },
        { p: deckel, mat: 'leder', k: 0 },
        { p: ecken, mat: 'messing', k: 0 },
        { p: schliesse, mat: 'messing', k: 0 },
      ],
      details(P) {
        // eingeprägtes Kreuz und Rahmenlinie
        P.ritz(23, 15, 25, 33, -2); P.ritz(17, 21, 31, 18, -2);
        P.ritz(12, 16, 34, 11, -1); P.ritz(14, 37, 36, 32, -1);
        // Seitenlinien im Schnitt
        for (let k = 0; k < 4; k++) P.ritz(40 + k * 0.6 - 1, 10 + k * 6, 42, 12 + k * 6, -1);
      },
    };
  },
};
