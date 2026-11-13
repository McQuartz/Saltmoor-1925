// Die Wasseruhr (Gezeitenwerk). Das Werk misst seine Zeit nicht mit Pendeln, sondern mit Wasser,
// und jemand musste die Gefäße tragen. Eine Trägerin, deren Leib ein Gefäß aus Bronze geworden ist,
// oben weit, unten eng, mit Strichen für die Stunden. Aus einem Loch am Boden tropft es. Wenn das
// Wasser bei der untersten Marke ist, schlägt sie zu. Angriff: sie kippt sich aus.
'use strict';
module.exports = {
  id: 'wasseruhr', biom: 'gezeitenwerk', zone: 'gezeitenwerk', w: 96, h: 120, fuss: [48, 115], kopf: [46, 22], rimBis: 112,
  varianten: {
    wasseruhr_a: { weit: 1, henkel: 1 },
    wasseruhr_b: { weit: 1.15, henkel: 0 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, kipp = 0, fall = 0, glanz = 1, tropf = 0;
    if (p.idle) { tropf = f; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [1, 2, -6, -2][f]; kipp = [-1, -2, 5, 2][f]; tropf = f; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50, ox = lean, sy = 34 + fall, w = v.weit, k = kipp;
    const gefaess = Pg([[cx - 18 * w + ox - k, sy + 4], [cx + 18 * w + ox + k * 0.3, sy + 4 + k], [cx + 8 + ox * 0.5, sy + 52], [cx + 4, sy + 60], [cx - 4, sy + 60], [cx - 8 + ox * 0.5, sy + 52]], null, { rd: 1.5, pf: 'bevel' });
    const rand = C(cx - 19 * w + ox - k, sy + 3, cx + 19 * w + ox + k * 0.3, sy + 3 + k, 1.8, 1.8, null, { pf: 'flat' });
    const henkel = v.henkel ? [glied([[cx - 18 * w + ox, sy + 8], [cx - 24 * w + ox, sy + 16], [cx - 16 * w + ox, sy + 26]], 1.4, 1.4, null), glied([[cx + 18 * w + ox, sy + 8], [cx + 24 * w + ox, sy + 16], [cx + 16 * w + ox, sy + 26]], 1.4, 1.4, null)].flat() : [];
    const beine = [...glied([[cx - 3, sy + 58], [cx - 7, 96], [cx - 8, 113]], 2.4, 1.8, null), ...glied([[cx + 3, sy + 58], [cx + 7, 96], [cx + 8, 113]], 2.4, 1.8, null)];
    // Kopf und Schultern ragen aus dem Wasser im Gefäß
    const kx = cx - 2 + ox * 1.2, ky = sy - 8;
    const schultern = E(cx + ox, sy + 4, 10, 4, null);
    const kopf = Pg([[kx - 6, ky + 4], [kx - 5, ky - 5], [kx + 3, ky - 8], [kx + 7, ky - 1], [kx + 5, ky + 6]], null, { rd: 1.6 });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine, k: 1 },
      { p: [kopf, schultern], k: 1.5 },
      { p: [gefaess], k: 1, pf: 'bevel' },
      { p: [rand, ...henkel], k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Stundenstriche und Bronze
      for (let i = 0; i < 6; i++) { const y = sy + 12 + i * 7, hw = (14 - i * 1.8) * w; P.line(r(cx - hw + ox * 0.8), y, r(cx - hw + 4 + ox * 0.8), y, i === 4 ? 'bronze' : 'k0', true); }
      P.line(r(cx - 16 * w + ox), sy + 3, r(cx + 16 * w + ox), sy + 3 + k, 'bronze', true);
      // Wasserspiegel und Tropfen am Boden
      P.line(r(cx - 14 * w + ox), sy + 6, r(cx + 14 * w + ox), sy + 6, 'wasser', true);
      if (!tot) { P.set(cx, sy + 62 + (tropf % 2) * 2, 'wasser'); if (tropf % 2) P.set(cx, sy + 68, 'r1'); }
      if (p.angriff && f === 2) [[-24, 4], [-28, 8], [-26, 12], [-30, 2]].forEach(([dx, dy]) => P.set(r(cx + dx + ox), r(sy + dy), 'wasser'));
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky - 1);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey - 1, 'kern');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey - 1]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
