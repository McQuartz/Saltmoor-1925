// Hasenpfote: eine lange, pelzige Hinterpfote, an der Ferse dick, vorn in vier Zehen gespalten, aus denen
// gebogene Krallen wachsen; oben eine Messingkappe mit Öse und Kettchen. Hängt schräg.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, kettenglieder, ring, E } = A;
    const ax = achse(30, 9, 2.0);
    const pfote = [apg(ax, [[1, -5.5], [10, -6.5], [22, -5.5], [28, -5], [30, 0], [28, 5], [20, 5.5], [8, 6], [1, 5]], null, { b: 3.5, rd: 1.8 })];
    const zehen = [-3.6, -1.2, 1.2, 3.6].map(q => E(...ax.P(30.5, q), 2.6, 2.6, null, { pf: 'bevel', hz: 0.5 }));
    const kappe = [acap(ax, -2, 0, 3, 0, 5.2, 5)];
    const krallen = [-3.6, -1.2, 1.2, 3.6].map((q, i) => acap(ax, 32, q, 36.5, q * 1.25 + (i - 1.5) * 0.4, 0.9, 0.5));
    const [ox, oy] = ax.P(-5.5, 0); const oese = ring(ox, oy, 2, 2, 0.7, null, {}, 8);
    const kette = kettenglieder([[ox + 1, oy - 2], [ox + 5, oy - 4], [ox + 10, oy - 4]], 4, 1.4, null);
    return {
      gruppen: [{ p: [...kette.flach, ...kette.kant], mat: 'messing', k: 0 }, { p: oese, mat: 'messing', k: 0 }, { p: krallen, mat: 'knochen', k: 0, tone: 0.1 }, { p: [...pfote, ...zehen], mat: 'fell', k: 1.4, tone: 0.06 }, { p: kappe, mat: 'messing', k: 0 }],
      details(P) {
        for (let t = 6; t < 28; t += 2) for (const q of [-3.5, -1, 1.5, 4]) { const [x, y] = ax.P(t + (q > 0 ? 1 : 0), q); P.stufe(x, y, (t + q) % 3 > 1 ? -1 : 1); }
        for (const q of [-2.4, 0, 2.4]) { const [a, b] = ax.P(29, q), [c, d] = ax.P(33, q); P.ritz(a, b, c, d, -2); }
        const [x, y] = ax.P(1, -2); P.set(x, y, 'messing3');
      },
    };
  },
};
