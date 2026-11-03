// Torfstecherin (Moorwald). Gebückte Frau mit Kopftuch; wo sie den Boden berührt hat,
// ist die Haut Rinde geworden. Der Spaten ist mit dem Arm verwachsen.
'use strict';
module.exports = {
  id: 'torfstecherin', biom: 'moor', zone: 'moor', w: 96, h: 120, fuss: [52, 115], kopf: [44, 34],
  varianten: {
    torfstecherin_a: { buckel: 0, spaten: 1 },
    torfstecherin_b: { buckel: 4, spaten: 1.15, zone: 'moor_gruen' },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, pose } = A;
    const P0 = pose(p, { lunge: 4, fall: 20 }), f = p.f, B = v.buckel;
    const lean = P0.lean, T = P0.atem + P0.fall;
    // Spaten: im Angriff hebt sie ihn und sticht nach vorn unten
    const hebe = p.angriff ? [6, 14, -4, 0][f] : p.idle ? [0, 0, 1, 1][f] : 0;
    const vor = p.angriff ? [2, 0, -10, -4][f] : 0;
    const rock = Pg([[42, 74 + T], [64, 72 + T], [68, 108], ...saum(69, 38, 112, 5, 3, 31, p.idle ? [0, 1, 1, 0][f] : 0), [38, 106]], null, { rd: 1.5 });
    const ruecken = Pg([[40 + lean, 62 + T], [46 + lean, 48 - B + T], [58 + lean, 44 - B + T], [66 + lean, 52 + T], [66, 76 + T], [44, 78 + T]], null, { rd: 3 });
    const kopf = E(38 + lean, 52 + T + B / 2, 6.5, 7, 'haut');
    const tuch = Pg([[31 + lean, 52 + T + B / 2], [36 + lean, 43 + T + B / 2], [46 + lean, 45 + T + B / 2], [50 + lean, 54 + T], [44 + lean, 60 + T]], 'dunkel', { rd: 1.5 });
    const beine = [C(48, 104, 46, 113, 2.6, 2.2, null), C(60, 104, 62, 113, 2.6, 2.2, null)];
    const S = v.spaten;
    const hx = 30 + lean + vor, hy = 72 + T - hebe;
    const armR = glied([[60 + lean, 54 + T], [52 + lean, 66 + T], [hx + 6, hy]], 3, 2.2, null);
    const armL = glied([[46 + lean, 56 + T], [36 + lean, 64 + T], [hx, hy + 2]], 2.8, 2, 'haut');
    const sx2 = hx - 6 - (vor < -5 ? 6 : 0), sy2 = hy + 38 * S;
    const schaft = [C(hx + 10, hy - 16, sx2, sy2, 1.2, 1.2, 'dunkel', { pf: 'flat' })];
    const blatt = [Pg([[sx2 - 4, sy2 - 2], [sx2 + 4, sy2 - 2], [sx2 + 3, sy2 + 8], [sx2 - 3, sy2 + 8]], null, { rd: 0.5, pf: 'flat' })];
    const gruppen = [
      { p: beine, k: 1 },
      { p: [rock], k: 1 },
      { p: [ruecken], k: 3 },
      { p: schaft, k: 0 },
      { p: blatt, k: 0 },
      { p: armR, k: 1 },
      { p: [kopf], k: 0 },
      { p: [tuch], k: 1 },
      { p: armL, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Rinde: senkrechte Risse an Hand, Knien und der linken Gesichtshälfte
      const rinde = (x0, y0, w, h) => { for (let x = x0; x < x0 + w; x += 2) for (let y = y0; y < y0 + h; y++) if ((y + x * 3) % 5) P.auf(x, y, (x + y) % 4 ? 'k0' : 'k3'); };
      rinde(r(32 + lean), r(50 + T + B / 2), 5, 8); rinde(r(hx - 2), r(hy), 5, 4); rinde(44, 104, 4, 8);
      const ex = r(39 + lean), ey = r(52 + T + B / 2);
      if (!P0.aus) { P.auge(ex, ey, 2); P.set(ex - 4, ey, 'glutDim'); augen.push([ex, ey]); }
      P.line(ex - 3, ey + 4, ex + 1, ey + 4, 'k0', true);
    };
    return { gruppen, details, augen };
  },
};
