// Wartemarke Nr. 1: ein Kärtchen aus grauer Pappe, schräg, oben gelocht, die Eins mit der Hand nachgezogen.
// Die Pappe ist an den Ecken weich vom Wasser; die Eins leuchtet in der Farbe des Stoffs.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C } = A;
    const karte = [Pg([[10, 14], [34, 6], [40, 34], [16, 42]], null, { b: 1.6, rd: 1.6 })];
    const schnur = [C(20, 13, 16, 3, 0.7, 0.7), C(16, 3, 11, 2, 0.7, 0.6)];
    return {
      gruppen: [{ p: schnur, mat: 'stoff', k: 0 }, { p: karte, mat: 'papier', k: 0, tone: 0.05 }],
      details(P) {
        // Loch oben
        P.el(21, 14, 1.8, 1.8, 'papier0'); P.set(22, 13, 'papier3');
        // Die Eins: groß, nachgezogen
        P.line(27, 17, 30, 34, 'a3'); P.line(28, 17, 31, 34, 'a2'); P.line(24, 21, 27, 17, 'a3'); P.line(26, 34, 34, 32, 'a2');
        P.set(28, 18, 'a5'); P.set(29, 24, 'a4');
        // Rand: Druckrahmen, verwischt
        P.ritz(14, 19, 34, 12); P.ritz(18, 38, 37, 31);
        // Wasserflecken
        for (const [x, y] of [[15, 34], [17, 37], [36, 12], [35, 25]]) P.stufe(x, y, -1);
      },
    };
  },
};
