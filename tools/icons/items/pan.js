// Bratpfanne: Gusseisenpfanne schräg von oben, schwerer Rand, langer Stiel mit Loch nach links unten.
'use strict';
module.exports = {
  form(A) {
    const { E, achse, apg } = A;
    const rand = [E(29, 19, 16, 13, null, { pf: 'bevel', hz: 0.25 })];
    const boden = [E(29.5, 19.5, 12.5, 9.5, 'dunkel', { pf: 'flat' })];
    const ax = achse(18, 29, 2.35);
    const stiel = [apg(ax, [[0, -2.6], [19, -2.2], [22, 0], [19, 2.2], [0, 2.6]], null, { b: 1.4, rd: 0.6 })];
    return {
      gruppen: [{ p: stiel, mat: 'eisen', k: 0 }, { p: rand, mat: 'eisen', k: 0 }, { p: boden, mat: 'eisen', k: 0, tone: -0.3, ohneRand: true }],
      details(P) {
        const [x, y] = ax.P(18, 0); P.el(x, y, 1.1, 1.1, 0); P.set(x, y, 0);
        // Fettglanz im Boden, schwach in der Stofffarbe
        P.set(33, 16, 'a2'); P.set(34, 16, 'a1'); P.set(32, 17, 'a1');
      },
    };
  },
};
