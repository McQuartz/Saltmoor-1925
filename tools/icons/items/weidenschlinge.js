// Weidenschlinge: drei dünne Weidenruten, miteinander verdreht und zu einer Schlinge gebogen, unten der alte Knoten,
// aus dem die drei Enden abstehen. Moorbraun, siebzehnhundert Jahre alt.
'use strict';
module.exports = {
  form(A) {
    const { kurve, E, C } = A;
    const strang = []; for (let k = 0; k < 3; k++) { const pts = []; for (let i = 0; i <= 24; i++) { const a = -Math.PI / 2 + 0.35 + i / 24 * (Math.PI * 2 - 0.7); const r = 15 + Math.sin(i * 1.2 + k * 2.1) * 1.4; pts.push([24 + Math.cos(a + Math.PI) * r * 0.85, 21 - Math.sin(a + Math.PI) * r]); } strang.push(...kurve(pts, 1.1, 1.1, null, { cr: true }, 40)); }
    const knoten = [E(24, 37, 4.4, 3.6, null, { pf: 'bevel', hz: 0.6 })];
    const enden = [C(24, 39, 18, 47, 1, 0.7), C(25, 40, 27, 47, 1, 0.7), C(26, 39, 33, 45, 1, 0.7)];
    return {
      gruppen: [{ p: strang, mat: 'torf', k: 0.5, tone: 0.1 }, { p: enden, mat: 'torf', k: 0, tone: 0.1 }, { p: knoten, mat: 'torf', k: 0, tone: 0.15 }],
      details(P) { P.ritz(21, 35, 27, 39, -2); P.ritz(21, 39, 27, 35, -2); P.set(22, 9, 'a2'); P.set(36, 16, 'a3'); },
    };
  },
};
