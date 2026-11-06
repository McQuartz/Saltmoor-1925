// Stockdegen: ein Spazierstock mit Silberknauf, auseinandergezogen: unten die dunkle Hülle, darüber mit deutlichem
// Abstand die blanke, schmale Klinge, oben der Griff mit dem Knauf, leicht seitlich versetzt wie im Ziehen.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, E, apg } = A;
    const ax = achse(9, 46, -1.08);
    const huelle = [acap(ax, 0, 0, 20, 0, 2, 2.2)];
    const zwinge = [acap(ax, 0, 0, 2, 0, 2.1, 2.1), acap(ax, 18.5, 0, 20.5, 0, 2.6, 2.6)];
    const klinge = [apg(ax, [[17, -1.4], [36, -1.2], [36, 1.2], [17, 1.4]], null, { b: 0.8 })];
    const ay = achse(...ax.P(36, 1.5), -1.0);
    const griff = [acap(ay, 0, 0, 8, 0, 2.2, 2.2)];
    const knauf = [E(...ay.P(11, 0), 3.4, 3.6, null, { pf: 'bevel', hz: 0.5 }), acap(ay, 7.5, 0, 9, 0, 2.8, 2.8)];
    return {
      gruppen: [{ p: huelle, mat: 'holz', k: 0 }, { p: zwinge, mat: 'messing', k: 0 }, { p: klinge, mat: 'silber', k: 0, tone: 0.1 }, { p: griff, mat: 'holz', k: 0 }, { p: knauf, mat: 'silber', k: 0.8 }],
      details(P) { for (let t = 22; t < 35; t++) { const [x, y] = ax.P(t, 0); P.stufe(x, y, -1); } const [x, y] = ax.P(28, -1); P.set(x, y, 'a4'); },
    };
  },
};
