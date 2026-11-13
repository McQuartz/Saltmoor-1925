// Glockengießerei, dritter Wächter: Die Gussform. Die Form für die große Glocke von 1641, die nie gegossen
// wurde, weil der Meister in die Grube fiel. Sie hat ihn behalten. Ein Mantel aus Lehm, glockenförmig,
// mit Eisenreifen, steht in der Grube auf vier kurzen Beinen, und durch den Einguss oben schaut er heraus.
// Er zählt die Züge bis zum Guss. Angriff: die Bronze läuft über.
'use strict';
module.exports = {
  id: 'gussform', biom: 'glockengiesserei', zone: 'glockengiesserei', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 30], rimBis: 172,
  varianten: { gussform: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let guss = 0, X = 0, fall = 0, glanz = 1, wack = 0;
    if (p.idle) { wack = [0, 1, 0, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { guss = [0.3, 0.6, 1.6, 1][f]; X = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.8, 1.2][f]; }
    if (p.treffer) { X = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 80 + X, top = 30 + fall;
    const mantel = Pg([[cx - 14, top + 10], [cx - 18, top], [cx + 18, top], [cx + 14, top + 10], [cx + 30, top + 50], [cx + 40, top + 100], [cx + 54, 150], [cx - 54, 150], [cx - 40, top + 100], [cx - 30, top + 50]], null, { rd: 3 });
    const einguss = E(cx, top + 2, 12, 4, 'dunkel', { pf: 'flat' });
    const reifen = [top + 36, top + 76, top + 112].map((y, i) => C(cx - 30 - i * 10, y, cx + 30 + i * 10, y, 2, 2, 'dunkel', { pf: 'bevel' }));
    const beine = [[-44, -1], [-18, 0], [18, 0], [44, 1]].map(([dx, s]) => glied([[cx + dx, 146], [cx + dx + s * 4, 160], [cx + dx + s * 2, 172]], 4, 3.4, 'dunkel'));
    const meister = E(cx, top - 4 + wack, 7, 7, null, { rd: 1.4 });
    const arme = [glied([[cx - 30, top + 50], [cx - 46, top + 64], [cx - 50, top + 86]], 4, 3.2, null), glied([[cx + 30, top + 50], [cx + 46, top + 66], [cx + 50, top + 88]], 4, 3.2, null)];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine.flat(), k: 1 },
      { p: arme.flat(), k: 1 },
      { p: [mantel], k: 3 },
      { p: reifen, k: 0, pf: 'bevel' },
      { p: [einguss], k: 0, pf: 'flat', noRim: true },
      { p: tot ? [] : [meister], k: 2 },
    ];
    const augen = [];
    const details = P => {
      // Lehmrisse, Bronze im Einguss und am Rand, Inschrift
      for (const [x0, y0, x1, y1] of [[-20, 60, -10, 80], [16, 90, 26, 116], [-34, 120, -24, 140]]) P.line(r(cx + x0), r(top + y0), r(cx + x1), r(top + y1), 'lehm');
      for (let x = -24; x <= 24; x += 4) P.set(r(cx + x), r(top + 60), 'guss');
      if (guss > 0) { for (let y = top + 4; y < top + 4 + 40 * guss; y += 2) { P.set(r(cx + 14 + (y - top) * 0.4), r(y), 'bronze'); P.set(r(cx - 14 - (y - top) * 0.4), r(y), 'bronze'); } P.glow(cx, top + 2, 10 * guss, 0.7, 'glutDim', 'k3'); }
      if (glanz > 0 && !tot) {
        const ex = r(cx - 3), ey = r(top - 4 + wack);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
