// Radiermesser des Kopisten: ein Schabmesser in Halbmondform, wie Mönche es zum Abschaben von Pergament hielten.
// Oben quer der Knochengriff mit Messingkappen, darunter die breite, gebogene Klinge mit heller Schneide.
// Unter der Schneide kräuselt sich ein abgeschabter Pergamentspan.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg, acap, kurve, C } = A;
    const ax = achse(24, 22, -0.32);
    const griff = [acap(ax, -15, -9, 15, -9, 2.6, 2.6)];
    const kappen = [acap(ax, -17.5, -9, -15, -9, 3.1, 3.1), acap(ax, 15, -9, 17.5, -9, 3.1, 3.1)];
    const hals = [apg(ax, [[-2.5, -7], [2.5, -7], [2, -3], [-2, -3]], null, { b: 0.8 })];
    const klinge = [];
    const pts = [];
    for (let i = 0; i <= 16; i++) { const w = Math.PI * (0.06 + 0.88 * i / 16); pts.push([-Math.cos(w) * 19, -4 + Math.sin(w) * 15]); }
    for (let i = 16; i >= 0; i--) { const w = Math.PI * (0.18 + 0.64 * i / 16); pts.push([-Math.cos(w) * 12, -4 + Math.sin(w) * 6]); }
    klinge.push(apg(ax, pts, null, { b: 1.4, rd: 0.3 }));
    const span = kurve([[30, 41], [35, 38], [40, 41], [38, 45], [33, 44]], 0.9, 0.7, null, { cr: true }, 12);
    void C;
    return {
      gruppen: [{ p: span, mat: 'papier', k: 0, tone: 0.12 }, { p: klinge, mat: 'stahl', k: 0 }, { p: hals, mat: 'messing', k: 0 }, { p: griff, mat: 'knochen', k: 0 }, { p: kappen, mat: 'messing', k: 0 }],
      details(P) {
        // helle Schneide entlang des äußeren Bogens
        for (let i = 0; i <= 40; i++) { const w = Math.PI * (0.08 + 0.84 * i / 40); const [x, y] = ax.P(-Math.cos(w) * 18.2, -4 + Math.sin(w) * 14.2); P.auf(x, y, 'stahlR1'); }
        for (let i = 0; i <= 20; i++) { const w = Math.PI * (0.2 + 0.6 * i / 20); const [x, y] = ax.P(-Math.cos(w) * 14, -4 + Math.sin(w) * 9); P.stufe(x, y, -1); }
        for (const t of [-8, 0, 8]) { const [a, b] = ax.P(t, -11), [c, d] = ax.P(t, -7); P.ritz(a, b, c, d, -1); }
      },
    };
  },
};
