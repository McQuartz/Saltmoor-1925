// Glockenklöppel von St. Brendan: schwerer Eisenkolben, oben eine Öse mit Lederschlaufe,
// unten die dicke Birne, glatt geschlagen. Hängt leicht schräg.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, E, ring, apg } = A;
    const ax = achse(18, 6, 1.32);
    const oese = ring(...ax.P(0, 0), 3.6, 3.6, 1.2, null, {}, 12);
    const schaft = [acap(ax, 3, 0, 28, 0, 1.8, 2.6)];
    const birne = [E(...ax.P(33, 0), 7.5, 7.5, null, { pf: 'bevel', hz: 0.5 }), acap(ax, 26, 0, 31, 0, 3.4, 6)];
    const fahne = [apg(ax, [[39, -2], [43, -1.5], [43, 1.5], [39, 2]], null, { b: 0.8 })];
    return {
      gruppen: [{ p: oese, mat: 'eisen', k: 0 }, { p: schaft, mat: 'eisen', k: 0 }, { p: [...birne, ...fahne], mat: 'eisen', k: 1.2 }],
      details(P) {
        const [x, y] = ax.P(34, -3); P.set(x, y, 'a3'); P.set(x + 1, y, 'a2');
        for (const t of [12, 13]) { const [a, b] = ax.P(t, 0); P.stufe(a, b, -1); }
        // Wasserglanz: ein Tropfen an der Birne
        const [tx, ty] = ax.P(40, 4); P.set(tx, ty + 2, 'blaustoff3');
      },
    };
  },
};
