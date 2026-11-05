// Knochen: ein langes Fingerglied, viel zu lang, schräg liegend: ein schlanker, leicht gekrümmter Schaft und an BEIDEN
// Enden dicke Gelenkköpfe mit zwei Knubbeln; in der Mitte ein drittes, überzähliges Gelenk. Am oberen Ende ein Nagel.
'use strict';
module.exports = {
  form(A) {
    const { kurve, E, achse } = A;
    const schaft = kurve([[10, 38], [20, 30], [28, 21], [38, 11]], 2.1, 1.8, null, {}, 14);
    const kopf = (x, y, a, r) => { const ax = achse(x, y, a); return [E(...ax.P(0, -r * 0.75), r, r, null, { pf: 'bevel', hz: 0.5 }), E(...ax.P(0, r * 0.75), r, r, null, { pf: 'bevel', hz: 0.5 }), E(...ax.P(r * 0.6, 0), r * 0.9, r * 0.9, null, { pf: 'bevel', hz: 0.5 })]; };
    const k1 = kopf(8, 40, 2.4, 3.6), k2 = kopf(40, 9, -0.75, 3.2), mitte = [E(24, 25, 3.4, 3.4, null, { pf: 'bevel', hz: 0.5 })];
    return {
      gruppen: [{ p: [...schaft, ...k1, ...k2, ...mitte], mat: 'knochen', k: 1.2, tone: 0.05 }],
      details(P) { P.ritz(22, 27, 26, 23, -2); P.ritz(6, 38, 10, 42, -2); P.ritz(38, 7, 42, 11, -2); P.set(44, 5, 'knochenR2'); P.set(43, 6, 'a3'); for (const [x, y] of [[15, 34], [32, 17]]) P.stufe(x, y, -1); },
    };
  },
};
