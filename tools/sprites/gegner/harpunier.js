// Walkathedrale, dritter Wächter: Der Harpunier. Er hat den Wal getroffen, und die Leine ist nicht
// gerissen. Er ist ihr gefolgt, hinein. Jetzt steht er im Gewölbe aus Rippen, ein riesiger Mann im
// Ölzeug, die Harpune in der Faust, und die Leine geht von seinem Gürtel in die Wand. Er kündigt an,
// wohin er wirft. Angriff: die Harpune fliegt.
'use strict';
module.exports = {
  id: 'harpunier', biom: 'walkathedrale', zone: 'walkathedrale', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [76, 34], rimBis: 172,
  varianten: { harpunier: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let wurf = 0, X = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { wurf = [-6, -12, 30, 10][f]; X = [3, 5, -8, -3][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { X = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 40); glanz = f < 2 ? 0.6 : 0; }
    const cx = 86 + X, sy = 56 + fall;
    const leib = Pg([[cx - 24, sy + 4], [cx - 12, sy - 8], [cx + 14, sy - 8], [cx + 26, sy + 4], [cx + 30, sy + 50], [cx + 26, sy + 74], [cx - 22, sy + 74], [cx - 28, sy + 50]], null, { rd: 2.4 });
    const oelzeug = Pg([[cx - 26, sy + 50], [cx + 30, sy + 48], [cx + 36, sy + 90], ...saum(cx + 36, cx - 32, sy + 94, 7, 3, 4), [cx - 32, sy + 90]], null, { rd: 2, pf: 'bevel', tone: 0.1 });
    const beine = [C(cx - 12, sy + 88, cx - 16, 168, 7, 6, 'dunkel'), C(cx + 14, sy + 88, cx + 18, 168, 7, 6, 'dunkel')];
    const stiefel = [E(cx - 20, 171, 10, 4, 'dunkel'), E(cx + 18, 171, 9, 4, 'dunkel')];
    const kx = cx - 6, ky = sy - 14 + atem * 0.5;
    const kopf = E(kx, ky, 10, 10, null, { rd: 1.5 });
    const suedwester = Pg([[kx - 16, ky - 2], [kx - 10, ky - 12], [kx + 8, ky - 14], [kx + 16, ky - 4], [kx + 22, ky + 6], [kx + 10, ky + 2], [kx - 8, ky + 2]], null, { rd: 1.4 });
    // Harpune hoch über der Schulter, nach vorn
    const hx = cx - 30 - Math.max(0, wurf) * 0.6, hy = sy - 6 + Math.max(0, wurf) * 0.6;
    const armV = glied([[cx - 20, sy + 2], [cx - 30, sy - 4 + Math.max(0, wurf) * 0.3], [hx, hy]], 5, 4, null);
    const hl = 70, ha = -0.25 + wurf * 0.01;
    const tx = hx - Math.cos(ha) * hl * 0.6, ty = hy + Math.sin(ha) * hl * 0.6, bx = hx + Math.cos(ha) * hl * 0.4, by = hy - Math.sin(ha) * hl * 0.4;
    const schaft = C(bx, by, tx, ty, 1.6, 1.6, 'dunkel', { pf: 'flat' });
    const spitze = Pg([[tx, ty - 3], [tx - 12, ty + 1], [tx, ty + 4], [tx - 3, ty]], 'dunkel', { rd: 0.4, pf: 'bevel' });
    const armH = glied([[cx + 22, sy + 2], [cx + 34, sy + 26], [cx + 30, sy + 48]], 5, 4, null);
    // Rippen des Wals im Hintergrund
    const rippen = [10, 150].map(x => glied([[x, 176], [x + (x < 80 ? 6 : -6), 90], [x + (x < 80 ? 26 : -26), 8]], 4, 2, 'dunkel'));
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: rippen.flat(), k: 0 },
      { p: armH, k: 1 },
      { p: beine, k: 1 },
      { p: stiefel, k: 0 },
      { p: [leib], k: 3 },
      { p: [oelzeug], k: 2, pf: 'bevel' },
      { p: [kopf], k: 2 },
      { p: [suedwester], k: 1.5 },
      { p: tot ? [] : [schaft, spitze], k: 0, pf: 'flat' },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Leine vom Gürtel in die Wand, Tranflecken, Knochenknöpfe
      P.line(r(cx + 26), r(sy + 50), 156, r(sy + 10), 'r1');
      for (let y = sy + 10; y < sy + 46; y += 8) P.set(r(cx + 2), y, 'bein');
      for (const [x, y] of [[-14, 60], [12, 80], [20, 30]]) P.set(r(cx + x), r(sy + y), 'tran');
      if (glanz > 0) {
        const ex = r(kx - 5), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 7, ey, 'glut');
        P.glow(ex + 3.5, ey, 7 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 7, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
