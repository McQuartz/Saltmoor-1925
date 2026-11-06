// Kompass, der nach unten zeigt: Messing-Taschenkompass von vorn, leicht gedreht, mit Ring oben und aufgeklapptem
// Deckelrand. Auf der Rose stehen N oben, aber die lange Nadel zeigt mit ihrer roten Spitze steil nach unten.
'use strict';
module.exports = {
  form(A) {
    const { E, ring, C, apg, achse } = A;
    const dose = [E(24, 26, 17, 17, null, { pf: 'bevel', hz: 0.25 })];
    const oese = ring(24, 6, 3.4, 3, 1.1, null, {}, 10);
    const krone = [C(24, 9, 24, 11, 2, 2)];
    const ax = achse(24, 26, Math.PI / 2 + 0.06);
    const nadel = [apg(ax, [[-12, 0], [0, -2.2], [14, 0], [0, 2.2]], null, { b: 0.8 })];
    return {
      gruppen: [{ p: oese, mat: 'messing', k: 0 }, { p: krone, mat: 'messing', k: 0 }, { p: dose, mat: 'messing', k: 0 }, { p: nadel, mat: 'eisen', k: 0 }],
      details(P) {
        P.el(24, 26, 13.5, 13.5, 'papier2', true); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; P.auf(24 + Math.cos(a) * 12, 26 + Math.sin(a) * 12, i % 4 ? 'papier1' : 'kohle0'); }
        P.line(23, 15, 23, 17, 'kohle0', true); P.line(25, 15, 25, 17, 'kohle0', true); P.set(24, 16, 'kohle0');
        for (let t = 1; t < 14; t++) { const [x, y] = ax.P(t, 0); P.set(x, y, t > 6 ? 'fleisch3' : 'fleisch2'); const [x2, y2] = ax.P(t, t < 7 ? 1 : 0.6); if (t < 11) P.set(x2, y2, 'fleisch1'); }
        for (let t = -11; t < 0; t++) { const [x, y] = ax.P(t, 0); P.set(x, y, 'eisen3'); }
        P.el(24, 26, 1.4, 1.4, 'messing3'); const [sx, sy] = ax.P(14, 0); P.set(sx, sy + 1, 'a3');
      },
    };
  },
};
