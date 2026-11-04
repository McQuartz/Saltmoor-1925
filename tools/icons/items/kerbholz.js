// Kerbholz: ein langer Vierkantstab aus hellem Holz, schräg liegend, voller Kerben, eine Kerbe ist frisch
// (hell), daneben eingeritzt ein Name. Der Stab ist der Länge nach gespalten (Schuldner- und Gläubigerhälfte).
'use strict';
module.exports = {
  form(A) {
    const { achse, apg } = A;
    const ax = achse(5, 40, -0.62);
    const stab = [apg(ax, [[0, -3.4], [44, -3.6], [46, -1.5], [46, 1.6], [44, 3.6], [0, 3.4]], null, { b: 1.6, rd: 0.4 })];
    const haelfte = [apg(ax, [[2, 3.6], [30, 3.8], [30, 6.2], [2, 6]], null, { b: 0.8 })];
    return {
      gruppen: [{ p: haelfte, mat: 'holzhell', k: 0, tone: -0.15 }, { p: stab, mat: 'holzhell', k: 0 }],
      details(P) {
        for (let t = 4; t < 42; t += 2.6) { const [a, b] = ax.P(t, -3.6), [c, d] = ax.P(t + 0.8, 1); P.line(a, b, c, d, 'holzhell0', true); const [e, f] = ax.P(t + 0.6, -3.6); P.set(e, f, 'holz0'); }
        const [x, y] = ax.P(42.5, -3.5), [x2, y2] = ax.P(43.3, 1); P.line(x, y, x2, y2, 'holzhellR2', true);
        for (let t = 6; t < 26; t += 1.5) { const [a, b] = ax.P(t, 2.4); if ((t * 2) % 3 < 1.5) P.stufe(a, b, -2); }
        P.set(...ax.P(43, -1), 'a3');
      },
    };
  },
};
