// Seltsame Muschel: Wellhornschnecke, deren Windungen nach links laufen (falsch herum),
// die Spitze schräg nach oben rechts, unten die weite Öffnung wie ein Ohr, in der es schwach leuchtet.
'use strict';
module.exports = {
  form(A) {
    const { E, achse, Pg } = A;
    const ax = achse(18, 33, -0.85);
    const windungen = [[0, 11, 10], [11, 8, 7], [19, 6, 5.2], [25, 4.4, 3.8], [30, 3, 2.6], [34, 1.8, 1.6]].map(([t, rx, ry]) => E(...ax.P(t, 0), rx, ry, null, { pf: 'bevel', hz: 0.45 }));
    const spitze = [Pg([ax.P(33, -1.6), ax.P(39, 0), ax.P(33, 1.6)], null, { b: 0.6 })];
    const lippe = [Pg([ax.P(-6, -10), ax.P(-12, -4), ax.P(-11, 6), ax.P(-4, 11), ax.P(2, 6)], null, { b: 1.4, rd: 1 })];
    return {
      gruppen: [{ p: [...windungen, ...spitze], mat: 'perlmutt', k: 1 }, { p: lippe, mat: 'perlmutt', k: 0, tone: 0.12 }],
      details(P) {
        const [ox, oy] = ax.P(-6, 2); P.el(ox, oy, 4.2, 4.6, 'perlmutt0', true); P.glow(ox, oy, 5, 1.1, 'a2', 'a1');
        for (const t of [6, 15, 22, 28]) { const [a, b] = ax.P(t, -9 + t * 0.25), [c, d] = ax.P(t + 3, 8 - t * 0.22); P.ritz(a, b, c, d, -2); }
        P.set(ox, oy, 'a3');
      },
    };
  },
};
