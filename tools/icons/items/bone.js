// Knochen: ein einzelnes Fingerglied, viel zu lang, mit drei Gelenken statt zwei: an jedem Gelenk ein dicker,
// zweiknöchriger Kopf, dazwischen schlanke Schäfte; leicht gekrümmt, schräg. Am Ende ein Nagel, der noch wächst.
'use strict';
module.exports = {
  form(A) {
    const { C, E } = A;
    const pts = [[7, 42], [17, 32], [27, 22], [35, 13], [40, 6]];
    const schaft = []; for (let i = 0; i < 4; i++) { const [a, b] = pts[i], [c, d] = pts[i + 1]; schaft.push(C(a, b, c, d, 1.6 - i * 0.15, 1.4 - i * 0.15)); }
    const gelenke = []; pts.slice(0, 4).forEach(([x, y], i) => { const r = 3.1 - i * 0.35; gelenke.push(E(x - 1.6, y - 1.6, r, r, null, { pf: 'bevel', hz: 0.5 }), E(x + 1.6, y + 1.6, r, r, null, { pf: 'bevel', hz: 0.5 })); });
    const nagel = [E(41, 5, 2.2, 2, null, { pf: 'bevel', hz: 0.5 })];
    return {
      gruppen: [{ p: [...schaft, ...gelenke], mat: 'knochen', k: 1 }, { p: nagel, mat: 'knochen', k: 0, tone: 0.15 }],
      details(P) { for (const [x, y] of pts.slice(0, 4)) { P.ritz(x - 2, y + 2, x + 2, y - 2, -2); } P.set(42, 4, 'a3'); },
    };
  },
};
