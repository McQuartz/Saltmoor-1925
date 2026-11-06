// Stempel der neununddreißigsten: ein rechteckiger Ziegelstempel aus Bronze mit kurzem Griff, schräg gekippt, so
// dass man die Stempelfläche sieht: erhabene Zeichen in Spiegelschrift und ein Rahmen. Abgegriffen am Griff.
'use strict';
module.exports = {
  form(A) {
    const { E, Pg, acap, achse } = A;
    const ax = achse(31, 15, -2.4);
    const griff = [acap(ax, 0, 0, 12, 0, 3.4, 4), E(36, 9, 4.6, 4)];
    const platte = [Pg([[6, 24], [30, 15], [40, 28], [16, 38]], null, { b: 2.6, rd: 1 })];
    const flaeche = [Pg([[9, 25], [29, 18], [37, 28], [17, 36]], null, { b: 1, rd: 0.6 })];
    return {
      gruppen: [{ p: platte, mat: 'messing', k: 0 }, { p: flaeche, mat: 'kupfer', k: 0, tone: 0.2 }, { p: griff, mat: 'holz', k: 1.2 }],
      details(P) {
        // erhabene Zeichen: drei Gruppen Striche und ein Kreis, im Licht heller (Spiegelschrift, nicht lesbar)
        const z = [[14, 27, 17, 30], [16, 26, 19, 29], [20, 25, 23, 28], [22, 24, 25, 27], [26, 23, 29, 26]];
        for (const [a, b, c, d] of z) { P.ritz(a, b, c, d, +2); P.ritz(a + 1, b + 1, c + 1, d + 1, -1); }
        for (let t = 0; t < 6.28; t += 0.4) { const x = Math.round(30 + Math.cos(t) * 2.2), y = Math.round(30 + Math.sin(t) * 1.5); if (P.info(x, y)) P.stufe(x, y, +2); }
        // Rahmen
        P.ritz(10, 26, 28, 19, -1); P.ritz(28, 19, 36, 28, -1); P.ritz(17, 35, 36, 28, -1);
        // blank gegriffen am Griff
        P.stufe(37, 7, +1); P.stufe(38, 8, +1);
      },
    };
  },
};
