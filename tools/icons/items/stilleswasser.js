// Das stille Wasser: ein Kelchglas mit Stiel und rundem Fuß, leicht schräg gehalten, aber der Wasserspiegel darin
// bleibt vollkommen waagerecht und glatt wie Stein. Ein Lichtstreif liegt darauf.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, E } = A;
    const ax = achse(24, 22, -0.22);
    const kelch = [apg(ax, [[-12, -18], [12, -18], [10, -4], [5, 2], [-5, 2], [-10, -4]], null, { b: 2.2, rd: 1 })];
    const stiel = [acap(ax, 0, 2, 0, 16, 1.4, 1.4)];
    const fuss = [E(...ax.P(0, 17), 9, 2.6, null, { pf: 'bevel', hz: 0.5 })];
    return {
      gruppen: [{ p: fuss, mat: 'glas', k: 0, tone: 0.1 }, { p: stiel, mat: 'glas', k: 0, tone: 0.1 }, { p: kelch, mat: 'glas', k: 0 }],
      details(P) {
        for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) { const i = P.info(x, y); if (!i || i.mat !== 'glas' || i.stufe >= 4 || y < 12 || y > 23 || !P.get(x - 1, y) || !P.get(x, y + 1)) continue; P.set(x, y, y === 12 ? 'b3' : (x + y) % 3 ? 'akzent1' : 'akzent2'); }
        for (let x = 15; x < 33; x++) if (P.info(x, 12)) P.set(x, 12, x % 5 ? 'b4' : 'b3');
        P.set(21, 12, 'bH');
      },
    };
  },
};
