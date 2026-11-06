// Walzahn-Messer: ein großer, gebogener Pottwalzahn, zur Klinge geschliffen, die Wurzel mit Schnur umwickelt als Griff;
// auf der Fläche eine dunkle Ritzung (Scrimshaw): ein kleines Schiff.
'use strict';
module.exports = {
  form(A) {
    const { kurve, achse, acap } = A;
    const zahn = kurve([[8, 42], [14, 28], [26, 14], [42, 5]], 4.4, 0.8, null, {}, 18);
    const ax = achse(9, 42, -1.2);
    const wickel = [acap(ax, 0, 0, 9, 0, 4.8, 4.4)];
    return {
      gruppen: [{ p: zahn, mat: 'knochen', k: 0, tone: 0.05 }, { p: wickel, mat: 'wolle', k: 0 }],
      details(P) {
        for (let t = 1; t < 9; t += 2) { const [a, b] = ax.P(t, -4.5), [c, d] = ax.P(t + 1, 4.5); P.ritz(a, b, c, d, -2); }
        P.line(17, 27, 23, 25, 'kohle1', true); P.line(19, 26, 20, 21, 'kohle1', true); P.line(20, 22, 22, 24, 'kohle1', true);
        P.set(40, 6, 'a3'); P.set(38, 7, 'a2');
      },
    };
  },
};
