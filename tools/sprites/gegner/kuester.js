// Der Küster (überflutete Kapelle). Er hat die Kapelle abgeschlossen, als das Wasser kam, mit allen drin,
// damit keiner in Panik hinausläuft. Er hat den Schlüsselbund noch, und der Talar klebt nass an ihm.
// Wo er hinschaut, wird es kalt wie Wasser im Turm. Angriff: der Schlüsselbund schlägt zu.
'use strict';
module.exports = {
  id: 'kuester', biom: 'kapelle', zone: 'kapelle', w: 96, h: 120, fuss: [48, 115], kopf: [50, 24], rimBis: 112,
  varianten: { kuester_a: { lang: 1, bund: 1 }, kuester_b: { lang: 1.08, bund: 1.4 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let sw = 0, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { sw = [0, 1, 0, -1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { sw = [-4, -8, 14, 4][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); glanz = f < 2 ? 0.6 : 0; }
    const cx = 52 + lean, sy = 36 + fall;
    const talar = Pg([[cx - 8, sy], [cx + 8, sy - 1], [cx + 11, sy + 30], [cx + 14, 108], ...saum(cx + 14, cx - 14, 112, 6, 3, 4), [cx - 14, 108], [cx - 11, sy + 30]], null, { rd: 1.8 });
    const kx = cx - 1, ky = sy - 9;
    const kopf = E(kx, ky, 5.5, 7, null, { rd: 1.3 });
    const haar = Pg([[kx - 6, ky - 2], [kx - 4, ky - 8], [kx + 5, ky - 8], [kx + 7, ky + 2], [kx + 6, ky + 10], [kx + 3, ky - 2]], null, { rd: 1 });
    const hx = cx - 18 - Math.max(0, sw) * 0.6, hy = sy + 24 - Math.max(0, sw) * 0.3;
    const armV = glied([[cx - 7, sy + 4], [cx - 14, sy + 14], [hx, hy]], 2.4, 2, null);
    const ring = E(hx - 2, hy + 6, 4 * v.bund, 4 * v.bund, 'dunkel', { pf: 'flat' });
    const schluessel = [0, 1, 2, 3].map(i => C(hx - 2, hy + 6, hx - 6 + i * 3 + sw * 0.2, hy + 14 + (i % 2) * 2, 0.8, 0.8, 'dunkel', { pf: 'flat' }));
    const armH = glied([[cx + 7, sy + 4], [cx + 10, sy + 16], [cx + 6, sy + 26]], 2.4, 2, null);
    const gruppen = [
      { p: armH, k: 1 },
      { p: [talar], k: 3 },
      { p: [kopf], k: 2 },
      { p: [haar], k: 1.5 },
      { p: armV, k: 1 },
      { p: [ring, ...schluessel], k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // nasser Talar: Tropfen am Saum, Linien
      for (let x = cx - 12; x <= cx + 12; x += 5) P.set(r(x), 113, 'r1');
      for (let y = sy + 10; y < 104; y += 12) P.line(r(cx - 4), y, r(cx - 5), y + 8, 'k1', true);
      P.set(r(hx - 2), r(hy + 2), 'flamme');
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 4 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
