// Das stille Wasser: ein schweres Wasserglas, leicht schräg gehalten, aber der Wasserspiegel bleibt
// vollkommen waagerecht und glatt wie Stein. Ein Lichtstreif liegt darauf.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, E } = A;
    const ax = achse(24, 26, -0.2);
    const glas = [apg(ax, [[-11, -19], [11, -19], [9, 19], [-9, 19]], null, { b: 2.4, rd: 0.8 })];
    const rand = [E(...ax.P(0, -19), 11.5, 3, null, { pf: 'bevel', hz: 0.4 })];
    const boden = [apg(ax, [[-9, 15], [9, 15], [9, 19], [-9, 19]], null, { b: 1 })];
    return {
      gruppen: [{ p: glas, mat: 'glas', k: 0 }, { p: boden, mat: 'glas', k: 0, tone: 0.15 }, { p: rand, mat: 'glas', k: 0, tone: 0.1 }],
      details(P) {
        for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) { const i = P.info(x, y); if (!i || i.mat !== 'glas' || i.stufe >= 4) continue; if (y > 17) P.set(x, y, y === 18 ? 'b3' : (x + y) % 3 ? 'akzent1' : 'akzent2'); }
        for (let x = 16; x < 31; x++) if (P.get(x, 18)) P.set(x, 18, x % 5 ? 'b4' : 'b3');
        P.set(22, 18, 'bH');
      },
    };
  },
};
