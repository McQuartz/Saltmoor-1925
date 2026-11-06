// Stimmeisen: ein langer Flachmeißel zum Stimmen der Glocken, schräg, oben der vom Hammer gestauchte Kopf,
// unten die breite, blank geschliffene Schneide. An der Schneide klebt etwas Dunkles, das kein Metall ist.
'use strict';
module.exports = {
  form(A) {
    const { acap, achse, apg } = A;
    const ax = achse(39, 7, 2.3);
    const kopf = [acap(ax, -1, 0, 4, 0, 3.6, 3)];
    const schaft = [apg(ax, [[3, -2.4], [30, -2.4], [37, -4.6], [42, -4.4], [42, 4.4], [37, 4.6], [30, 2.4], [3, 2.4]], null, { b: 1.4, rd: 0.6 })];
    const wicklung = [acap(ax, 8, 0, 16, 0, 3.2, 3.2)];
    const klebt = [apg(ax, [[38, -1], [42.6, -2.6], [43.4, 1.4], [40, 2.8]], null, { b: 0.8, rd: 0.5 })];
    return {
      gruppen: [{ p: schaft, mat: 'stahl', k: 0 }, { p: kopf, mat: 'eisen', k: 1 }, { p: wicklung, mat: 'leder', k: 0 }, { p: klebt, mat: 'fleisch', k: 0.6, tone: -0.2 }],
      details(P) {
        for (let t = 9; t <= 15; t += 2) { const [a, b] = ax.P(t, -3), [c, d] = ax.P(t + 1, 3); P.ritz(a, b, c, d, -2); }
        const [s1, s2] = ax.P(41, -3.6); P.set(s1, s2, 'a3');
        for (let t = 20; t <= 34; t += 7) { const [a, b] = ax.P(t, 1.5); P.stufe(a, b, -1); }
        const [k1, k2] = ax.P(0, -2); P.stufe(k1, k2, +1);
      },
    };
  },
};
