// Spiegelscherbe: ein Bruchstück einer belichteten Glasplatte, rechteckig mit einer abgebrochenen Ecke und einem
// Sprung, schräg gestellt; darin ein blasses Gesicht, das erst morgen dir gehört.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg } = A;
    const ax = achse(24, 25, -0.3);
    const platte = [apg(ax, [[-13, -12], [-4, -20], [6, -16], [14, -19], [12, -4], [15, 6], [6, 20], [-2, 13], [-12, 18], [-9, 2]], null, { b: 1.4, rd: 0.1 })];
    return {
      gruppen: [{ p: platte, mat: 'silber', k: 0, tone: -0.25 }],
      details(P) {
        const [fx, fy] = ax.P(-1, -1); P.el(fx, fy, 5.5, 7, 'silber1', true); P.el(fx, fy, 4.5, 6, 'silber2', true);
        P.set(fx - 2, fy - 1, 'kohle0'); P.set(fx + 2, fy - 1, 'kohle0'); P.line(fx - 1, fy + 3, fx + 1, fy + 3, 'silber0', true);
        const [a, b] = ax.P(4, -16), [c, d] = ax.P(-3, 4), [e, f] = ax.P(-10, 16); P.line(a, b, c, d, 'silberR2', true); P.line(c, d, e, f, 'silberR1', true);
        const [g, h] = ax.P(9, 12); P.set(g, h, 'a3');
      },
    };
  },
};
