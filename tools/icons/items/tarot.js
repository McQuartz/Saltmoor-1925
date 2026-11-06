// Tarotkarten: drei Karten aufgefächert, die oberste zeigt ein Auge in einem Strahlenkranz,
// die Rückseiten mit Rautenmuster. Ein Blatt fehlt im Satz und liegt doch obenauf.
'use strict';
module.exports = {
  form(A) {
    const { achse, apg } = A;
    const karte = (x, y, a) => { const ax = achse(x, y, a); return { ax, p: apg(ax, [[-8, -13], [8, -13], [8, 13], [-8, 13]], null, { b: 1, rd: 0.8 }) }; };
    const k1 = karte(15, 26, -0.45), k2 = karte(24, 24, -0.05), k3 = karte(32, 25, 0.38);
    return {
      gruppen: [{ p: [k1.p], mat: 'tuch', k: 0, tone: 0.1 }, { p: [k2.p], mat: 'tuch', k: 0, tone: 0.1 }, { p: [k3.p], mat: 'papier', k: 0 }],
      details(P) {
        // Rautenmuster auf den Rückseiten
        for (const k of [k1, k2]) for (let t = -10; t <= 10; t += 3) for (let q = -6; q <= 2; q += 3) { const [x, y] = k.ax.P(q + ((t / 3) & 1 ? 1.5 : 0), t); P.stufe(x, y, +1); }
        // Vorderseite: Rahmen, Auge, Strahlen
        const ax = k3.ax; for (let t = -11; t <= 11; t++) { const [a, b] = ax.P(-6.5, t), [c, d] = ax.P(6.5, t); P.stufe(a, b, -1); P.stufe(c, d, -1); }
        const [cx, cy] = ax.P(0, -2);
        for (let i = 0; i < 8; i++) { const w = i / 8 * Math.PI * 2; P.line(cx + Math.cos(w) * 3.5, cy + Math.sin(w) * 3.5, cx + Math.cos(w) * 5.5, cy + Math.sin(w) * 5.5, 'a1', true); }
        P.el(cx, cy, 3, 1.8, 'papier1', true); P.set(cx, cy, 'a3'); P.set(cx - 1, cy, 'a2');
        const [lx, ly] = ax.P(-4, 8), [mx, my] = ax.P(4, 8); P.line(lx, ly, mx, my, 'papier1', true);
      },
    };
  },
};
