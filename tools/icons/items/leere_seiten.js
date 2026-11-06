// Gesangbuch mit leeren Seiten: ein kleines, schwarzes Gesangbuch steht schräg, mit goldenem Kreuz auf dem Deckel.
// Oben rechts rutschen zwei leere Blätter heraus und treiben weg, als wäre unter Wasser.
'use strict';
module.exports = {
  form(A) {
    const { Pg } = A;
    const ruecken = [Pg([[6, 17], [11, 15], [14, 45], [9, 46]], null, { b: 1.3, rd: 0.8 })];
    const schnitt = [Pg([[28, 12], [32, 14], [34, 43], [30, 43]], null, { b: 0.8 })];
    const deckel = [Pg([[10, 15], [29, 11], [31, 42], [13, 46]], null, { b: 2, rd: 0.6 })];
    const blatt1 = [Pg([[27, 9], [37, 3], [43, 11], [33, 17]], null, { b: 1, rd: 0.3 })];
    const blatt2 = [Pg([[35, 19], [44, 17], [46, 26], [37, 28]], null, { b: 1, rd: 0.3 })];
    return {
      gruppen: [{ p: schnitt, mat: 'papier', k: 0 }, { p: ruecken, mat: 'tuch', k: 0 }, { p: deckel, mat: 'tuch', k: 0, tone: 0.06 }, { p: blatt2, mat: 'papier', k: 0, tone: 0.18 }, { p: blatt1, mat: 'papier', k: 0, tone: 0.22 }],
      details(P) {
        // Goldkreuz und Goldrand auf dem Deckel
        P.line(20, 19, 21.5, 33, 'a3', true); P.line(15, 24, 26, 22, 'a3', true); P.set(20.5, 23, 'aG');
        P.ritz(12, 17, 28, 13.5, -1); P.ritz(15, 43, 30, 40, -1);
        for (let y = 15; y < 42; y += 2) P.stufe(31 + (y - 15) * 0.08, y, -1);
        // leere Blätter: nur ein Knick, sonst nichts darauf
        P.ritz(31, 12, 39, 8, -1); P.ritz(38, 22, 44, 21, -1);
      },
    };
  },
};
