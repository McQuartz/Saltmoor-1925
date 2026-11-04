// Der Harzkern: eine runde, goldene Harzperle, groß wie eine Kirsche, liegt in einem geschnitzten Holzlöffel;
// in ihr ein dunkler Keim mit feinen Wurzeln, ein Wald, der noch nicht gewachsen ist.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, E } = A;
    const ax = achse(5, 41, -0.62);
    const stiel = [acap(ax, 0, 0, 24, 0, 1.8, 2.2)];
    const laffe = [E(...ax.P(32, 0), 11, 8, null, { pf: 'bevel', hz: 0.35 })];
    const kern = [E(...ax.P(32, -1), 7, 7, null, { pf: 'dome', hz: 0.7 })];
    return {
      gruppen: [{ p: stiel, mat: 'holzhell', k: 0 }, { p: laffe, mat: 'holzhell', k: 0, tone: -0.1 }, { p: kern, mat: 'akzent', k: 0, tone: -0.15 }],
      details(P) {
        const [cx, cy] = ax.P(32, -1); P.glow(cx, cy, 6, 1, 'a4', 'a3');
        P.set(cx, cy + 1, 'kohle0'); P.set(cx - 1, cy + 1, 'kohle1'); P.line(cx, cy + 1, cx - 2, cy + 4, 'a1'); P.line(cx, cy + 1, cx + 2, cy + 4, 'a1'); P.line(cx, cy, cx, cy - 3, 'a1');
        P.set(cx + 2, cy - 4, 'aH');
        for (let t = 4; t < 22; t += 3) { const [x, y] = ax.P(t, 0); P.stufe(x, y, -1); }
      },
    };
  },
};
