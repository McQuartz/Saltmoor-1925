// Knochen: ein einzelnes Fingerglied, viel zu lang, mit drei Gelenken statt zwei, leicht gekrümmt,
// schräg liegend: dicke Gelenkköpfe, schlanke Schäfte. Am Ende ein Nagel, der noch wächst.
'use strict';
module.exports = {
  form(A) {
    const { C, E } = A;
    const pts = [[8, 42], [18, 32], [28, 22], [36, 13], [41, 6]];
    const schaft = []; for (let i = 0; i < 4; i++) { const [a, b] = pts[i], [c, d] = pts[i + 1]; schaft.push(C(a, b, (a + c) / 2, (b + d) / 2, 2.6 - i * 0.3, 1.5 - i * 0.15), C((a + c) / 2, (b + d) / 2, c, d, 1.5 - i * 0.15, 2.4 - i * 0.3)); }
    const gelenke = pts.slice(0, 4).map(([x, y], i) => E(x, y, 3.6 - i * 0.4, 3.2 - i * 0.4, null, { pf: 'bevel', hz: 0.5 }));
    const nagel = [E(41.5, 5.5, 2, 1.8, null, { pf: 'bevel', hz: 0.5 })];
    return {
      gruppen: [{ p: [...schaft, ...gelenke], mat: 'knochen', k: 1.4 }, { p: nagel, mat: 'knochen', k: 0, tone: 0.15 }],
      details(P) { for (const [x, y] of [[13, 37], [23, 27], [32, 18]]) { P.stufe(x, y, -1); } for (const [x, y] of pts.slice(0, 4)) P.stufe(x - 1, y + 1, -2); P.set(42, 4, 'a3'); },
    };
  },
};
