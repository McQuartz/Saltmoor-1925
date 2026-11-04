// Hasenpfote: die lange Hinterpfote, fellig, mit Krallen, die noch wachsen, oben eine Messingkappe
// mit Kettchen. Hängt schräg.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, kettenglieder, ring } = A;
    const ax = achse(30, 10, 1.95);
    const pfote = [apg(ax, [[2, -4], [14, -5], [26, -4.6], [33, -3], [35, 1], [30, 4.6], [14, 4.4], [2, 3.6]], null, { b: 3, rd: 1.6 })];
    const kappe = [acap(ax, -2, 0, 3, 0, 4.4, 4.2)];
    const krallen = [acap(ax, 33, -2.5, 39, -3.5, 0.9, 0.5), acap(ax, 34, 0, 40, 0.5, 0.9, 0.5), acap(ax, 32, 2.5, 37.5, 4.5, 0.9, 0.5)];
    const [ox, oy] = ax.P(-5, 0); const oese = ring(ox, oy, 2, 2, 0.7, null, {}, 8);
    const kette = kettenglieder([[ox + 1, oy - 2], [ox + 5, oy - 5], [ox + 10, oy - 5]], 4, 1.4, null);
    return {
      gruppen: [{ p: [...kette.flach, ...kette.kant], mat: 'messing', k: 0 }, { p: oese, mat: 'messing', k: 0 }, { p: krallen, mat: 'knochen', k: 0 }, { p: pfote, mat: 'fell', k: 0 }, { p: kappe, mat: 'messing', k: 0 }],
      details(P) {
        for (let t = 6; t < 32; t += 2.5) for (const q of [-2.5, 0.5, 3]) { const [x, y] = ax.P(t + (q > 0 ? 1 : 0), q); P.stufe(x, y, -1); }
        const [x, y] = ax.P(1, -1); P.set(x, y, 'a3');
      },
    };
  },
};
