// Ritualdolch: geflammte (gewellte) Klinge, nach unten geschwungene Parierstange, Griff mit Schnurwicklung,
// im Knauf ein dunkelroter Stein. Der Griff ist warm.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, E } = A;
    const ax = achse(9, 39, -0.8);
    const wel = []; for (let t = 0; t <= 26; t += 2) wel.push([13 + t, (3.6 - t * 0.1) + Math.sin(t * 0.55) * 1.0]);
    const wel2 = []; for (let t = 26; t >= 0; t -= 2) wel2.push([13 + t, -(3.6 - t * 0.1) + Math.sin(t * 0.55) * 1.0]);
    const klinge = [apg(ax, [...wel, [43, 0], ...wel2], null, { b: 1.2 })];
    const parier = [acap(ax, 12, -6, 11, 0, 1.2, 1.4), acap(ax, 11, 0, 12, 6, 1.4, 1.2), acap(ax, 12, -6, 14, -7.5, 1.2, 1), acap(ax, 12, 6, 14, 7.5, 1.2, 1)];
    const griff = [acap(ax, 2, 0, 11, 0, 2.1, 1.8)];
    const [kx, ky] = ax.P(0.5, 0); const knauf = [E(kx, ky, 2.8, 2.8, null, { pf: 'bevel', hz: 0.5 })];
    return {
      gruppen: [{ p: klinge, mat: 'stahl', k: 0 }, { p: griff, mat: 'leder', k: 0 }, { p: parier, mat: 'eisen', k: 0.6 }, { p: knauf, mat: 'eisen', k: 0 }],
      details(P) {
        for (let t = 3; t < 11; t += 1.6) { const [x, y] = ax.P(t, 0); P.stufe(x, y, -2); }
        P.el(kx, ky, 1.4, 1.4, 'a2'); P.set(Math.round(kx), Math.round(ky) - 1, 'aG');
        for (let t = 15; t < 38; t += 1) { const [x, y] = ax.P(t, Math.sin((t - 13) * 0.55) * 1.1); P.stufe(x, y, -1); }
      },
    };
  },
};
