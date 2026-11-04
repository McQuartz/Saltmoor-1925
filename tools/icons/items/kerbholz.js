// Kerbholz: ein flacher Stab aus hellem Holz, schräg, mit tiefen Kerben quer über die Oberkante (in der Silhouette
// sichtbar). Die letzte Kerbe ist frisch und hell, daneben der Name. Die zweite Hälfte liegt versetzt darunter.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg } = A;
    const ax = achse(4, 38, -0.62);
    const oben = [[0, -4.5]]; for (let t = 4; t < 42; t += 3.4) { oben.push([t, -4.5], [t + 1, -1.8], [t + 2, -4.5]); } oben.push([46, -4.5], [48, -1.5]);
    const stab = [apg(ax, [...oben, [48, 2], [46, 3.5], [0, 3.5]], null, { b: 1.4, rd: 0.2 })];
    const haelfte = [apg(ax, [[6, 3.5], [36, 3.5], [36, 7.5], [6, 7.5]], null, { b: 0.8 })];
    return {
      gruppen: [{ p: haelfte, mat: 'holzhell', k: 0, tone: -0.2 }, { p: stab, mat: 'holzhell', k: 0, tone: 0.05 }],
      details(P) {
        for (let t = 4; t < 42; t += 3.4) { const [a, b] = ax.P(t + 1, -1.2), [c, d] = ax.P(t + 1, 2.5); P.ritz(a, b, c, d, -2); }
        const [a, b] = ax.P(42.8, -1.4), [c, d] = ax.P(42.8, 2.5); P.line(a, b, c, d, 'holzhellR2', true);
        for (let t = 9; t < 30; t += 1.5) { const [x, y] = ax.P(t, 5.5); if ((t * 2) % 3 < 1.5) P.stufe(x, y, -2); }
        P.set(...ax.P(44, 0.5), 'a3');
      },
    };
  },
};
