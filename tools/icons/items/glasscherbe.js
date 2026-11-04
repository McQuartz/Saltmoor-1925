// Glasscherbe: ein langer, schwarzer Splitter vulkanischen Glases, gezackt gebrochen, schärfer als jedes Messer;
// das untere Ende ist mit einem Lederstreifen umwickelt. In der Bruchkante ein Lichtstreif.
'use strict';
module.exports = {
  form(A) {
    const { Pg, achse, acap } = A;
    const splitter = [Pg([[12, 38], [14, 28], [9, 21], [19, 17], [23, 5], [29, 11], [44, 2], [35, 16], [30, 17], [32, 24], [25, 29], [20, 40]], null, { b: 2, rd: 0.1 })];
    const ax = achse(15, 40, 2.1);
    const wickel = [acap(ax, 0, 0, 7, 0, 3.4, 2.8)];
    return {
      gruppen: [{ p: splitter, mat: 'kohle', k: 0, tone: 0.1 }, { p: wickel, mat: 'leder', k: 0 }],
      details(P) {
        P.line(17, 30, 23, 8, "kohleR1", true); P.line(25, 18, 38, 7, "tuch3", true);
        for (let t = 1; t < 7; t += 2) { const [a, b] = ax.P(t, -3), [c, d] = ax.P(t + 1, 3); P.ritz(a, b, c, d, -2); }
        P.set(22, 26, 'a2'); P.set(31, 14, 'a3');
      },
    };
  },
};
