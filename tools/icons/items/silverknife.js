// Salzklinge: gerades, schlankes Messer mit zweischneidiger Silberklinge über Eisenkern, kurze Parierstange,
// Salzkristalle kleben an der Klinge. Steht steiler als das Fischmesser.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, E } = A;
    const ax = achse(13, 44, -1.06);
    const griff = [acap(ax, 1, 0, 12, 0, 2.0, 2.0)];
    const knauf = [E(...ax.P(0, 0), 2.6, 2.6, null, { pf: 'bevel', hz: 0.5 })];
    const parier = [acap(ax, 13, -6, 13, 6, 1.4, 1.4)];
    const klinge = [apg(ax, [[14, -3], [38, -2.2], [45, 0], [38, 2.2], [14, 3]], null, { b: 2.5 })];
    return {
      gruppen: [{ p: griff, mat: 'holz', k: 0 }, { p: knauf, mat: 'eisen', k: 0 }, { p: klinge, mat: 'silber', k: 0 }, { p: parier, mat: 'eisen', k: 0 }],
      details(P) {
        for (let t = 15; t < 41; t++) { const [x, y] = ax.P(t, 0); P.stufe(x, y, -1); }
        for (const [t, q] of [[20, -2], [24, 1.5], [29, -1.5], [33, 1], [36, -1]]) { const [x, y] = ax.P(t, q); P.set(x, y, 'a4'); }
        for (let t = 2; t < 12; t += 2) { const [x, y] = ax.P(t, 0); P.stufe(x, y, -2); }
      },
    };
  },
};
