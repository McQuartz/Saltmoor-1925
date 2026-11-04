// Siebenfinger-Schlüssel: ein schwerer Bronzeschlüssel, der Griff ein langer Stab mit sieben Fingermulden
// (gewellte Unterkante), der Schaft schräg nach rechts unten, vorn ein Bart mit Stufen.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap } = A;
    const ax = achse(5, 16, 0.62);
    const unten = []; for (let i = 0; i <= 7; i++) { unten.push([i * 2.6, 3.4]); if (i < 7) unten.push([i * 2.6 + 1.3, 5.2]); }
    const griff = [apg(ax, [[-1, -3.4], [19, -3.6], [20, 3.4], ...unten.reverse()], null, { b: 1.4, rd: 0.6 })];
    const schaft = [acap(ax, 18, 0, 42, 0, 1.8, 1.7)];
    const bart = [apg(ax, [[33, 1], [41, 1], [41, 8], [39, 8], [39, 5], [37, 5], [37, 9], [35, 9], [35, 5], [33, 5]], null, { b: 0.8 })];
    return {
      gruppen: [{ p: schaft, mat: 'kupfer', k: 0 }, { p: bart, mat: 'kupfer', k: 0 }, { p: griff, mat: 'kupfer', k: 0, tone: 0.05 }],
      details(P) { for (let i = 0; i < 7; i++) { const [x, y] = ax.P(i * 2.6 + 1.3, 2.4); P.stufe(x, y, -2); } const [a, b] = ax.P(2, -1); P.set(a, b, 'a3'); const [c, d] = ax.P(9, -1.5); P.set(c, d, 'b3'); },
    };
  },
};
