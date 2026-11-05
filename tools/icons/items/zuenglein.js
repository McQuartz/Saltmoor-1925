// Das Zünglein (Reliquie): die Zunge der großen Waage, Messing, oben der Lagerring, unten ein Stück der Skala aus
// Papier mit Teilstrichen. Die Zunge steht schief und zeigt nach links, auf dich; die Spitze glimmt im Stoff-Ton.
'use strict';
module.exports = {
  form(A) {
    const { Pg, E, C, ring } = A;
    const skala = ring(26, 10, 27, 27, 2.2, null, {}, 18, Math.PI * 0.3, Math.PI * 0.72);
    const zunge = [Pg([[27, 9], [30, 12], [16, 38], [14, 41], [14, 36]], null, { b: 1.4, rd: 0.7 })];
    const lager = [E(28, 10, 5.4, 5.4, null, { pf: 'bevel', hz: 0.45 })];
    return {
      gruppen: [{ p: skala, mat: 'papier', k: 0, tone: 0.1 }, { p: zunge, mat: 'messing', k: 0, tone: 0.05 }, { p: lager, mat: 'messing', k: 0, tone: 0.12 }],
      details(P) {
        // Teilstriche auf der Skala, die Null rot
        for (let i = 0; i <= 10; i++) { const a = Math.PI * 0.34 + i / 10 * Math.PI * 0.36; const x = 26 + Math.cos(a) * 27.6, y = 10 + Math.sin(a) * 27.6; P.auf(x, y, 'papier0'); if (i % 5 === 0) P.auf(26 + Math.cos(a) * 26.4, 10 + Math.sin(a) * 26.4, 'papier0'); }
        P.auf(26, 35, 'wachsrot3'); P.auf(26, 34, 'wachsrot3');
        P.el(28, 10, 2.2, 2.2, 'messing0', true); P.set(28, 10, 'a4');
        P.line(27, 13, 16, 36, 'a2', true);
        P.glow(15, 39, 6, 0.8); P.set(14, 40, 'a5'); P.set(15, 39, 'a4'); P.set(16, 37, 'a3');
      },
    };
  },
};
