// Zanns Geige: eine alte Geige, schräg im Gegenlicht, Korpus unten links mit klarer Taille, Hals dunkelbraun,
// Schnecke hell. Der Bogen liegt daneben (parallel unten rechts), nichts kreuzt den Hals.
// Eine Saite ist gerissen: ein kleiner heller Bogen steht vom Steg ab. Stoff Salz und Wasser (Glanz, Körner).
'use strict';
module.exports = {
  st: ['S', 'W'], rar: 'selten',
  form(A) {
    const { achse, apg, acap } = A;
    const ax = achse(4, 38, -0.82);
    // Korpus: Unterbügel und Oberbügel als zwei Rundungen, dazwischen eine tiefe Taille
    const korpus = [apg(ax, [[0, -5], [2.5, -8.6], [6.5, -9.2], [10, -7.4], [12, -4.2], [13.5, -3.6], [15, -4.4], [17.5, -6.8], [20.5, -6.6], [22.5, -3.6], [22.5, 3.6], [20.5, 6.6], [17.5, 6.8], [15, 4.4], [13.5, 3.6], [12, 4.2], [10, 7.4], [6.5, 9.2], [2.5, 8.6], [0, 5]], null, { b: 1.9, rd: 1.2 })];
    const hals = [acap(ax, 21, 0, 33.5, 0, 1.6, 1.4)];
    const griffbrett = [apg(ax, [[20, -1.4], [33, -1.1], [33, 1.1], [20, 1.4]], null, { b: 0.5 })];
    const kasten = [apg(ax, [[32.5, -1.9], [37, -2.1], [37, 2.1], [32.5, 1.9]], null, { b: 0.9, rd: 0.4 })];
    const schnecke = [A.E(...ax.P(39, 0), 2.7, 2.7, null, { pf: 'bevel', hz: 0.6 })];
    // Bogen daneben: parallel zur Geigenachse, nach unten rechts versetzt
    const bax = achse(13, 47, -0.82);
    const stab = [acap(bax, 0, 0, 36, 0, 0.8, 0.7)];
    const frosch = [acap(bax, 0, 0, 5, 0, 1.7, 1.7)];
    return {
      gruppen: [
        { p: stab, mat: 'holzhell', k: 0, tone: 0.0 },
        { p: frosch, mat: 'kohle', k: 0, tone: 0.1 },
        { p: hals, mat: 'holz', k: 0, tone: -0.3 },
        { p: korpus, mat: 'holz', k: 0, tone: 0.05 },
        { p: griffbrett, mat: 'holz', k: 0, tone: -0.4 },
        { p: kasten, mat: 'holz', k: 0, tone: -0.2 },
        { p: schnecke, mat: 'holzhell', k: 0, tone: 0.2 },
      ],
      details(P) {
        // Maserung: längs, wenige dunkle Fasern
        for (let q = -7; q <= 7; q += 2.4) for (let t = 1; t < 22; t += 0.7) { const [x, y] = ax.P(t, q); if (Math.abs(q) < 8 - Math.abs(t - 12.5) * 0.15 && ((t * 4 | 0) + (q * 2 | 0)) % 5 === 0) P.stufe(x, y, -1); }
        // F-Löcher: je 2 dunkle Pixel
        for (const s of [-1, 1]) { P.set(...ax.P(10.2, s * 3.3), 'kohle0'); P.set(...ax.P(11.6, s * 3.0), 'kohle0'); }
        // Steg
        for (let q = -2.4; q <= 2.4; q += 0.6) P.set(...ax.P(12.5, q), 'messing2');
        // Saiten: zwei straffe Linien vom Steg zum Kasten
        for (const q of [-0.6, 0.6]) for (let t = 13.5; t < 33; t += 0.6) P.auf(...ax.P(t, q), 'a3');
        // gerissene Saite: ein kleiner heller Bogen, der vom Steg absteht
        const [bx, by] = ax.P(12.5, 0);
        [[0, 0], [1, -2], [3, -3], [5, -2]].forEach(([dx, dy], i) => P.set(bx + dx - 1, by + dy - 1, i === 3 ? 'aH' : 'a4'));
        // Wirbel am Kasten
        for (const [t, q] of [[34, -3], [36, 3.1]]) P.set(...ax.P(t, q), 'holzR1');
        // Bogenhaar: heller Streifen am Stab, Salz am Ende
        for (let t = 7; t < 35; t += 0.6) P.auf(...bax.P(t, -1.0), t % 4 < 2 ? 'a3' : 'a2');
        P.set(...bax.P(36.5, 0), 'aH');
        // Salz auf dem Korpus
        for (const [t, q] of [[3, -5], [6, 5.5], [17, 3.5], [19, -4]]) P.set(...ax.P(t, q), 'a4');
      },
    };
  },
};
