// Der Zeltbewohner (schwarzes Eis, Elite). Das Zelt der Expedition von 1903 steht noch, und es
// ist bewohnt. Er ist das Zelt: Segeltuch über einem Gestell aus Schneeschuhen, und durch den
// Schlitz schaut, was drin wohnt. Er ruft die anderen herein, die draußen erfroren sind.
// Angriff: die Zeltplane schlägt auf, ein langer Arm greift heraus.
'use strict';
module.exports = {
  id: 'zeltbewohner', biom: 'eis', zone: 'eis', w: 128, h: 160, fuss: [64, 155], kopf: [60, 80], rimBis: 152, rang: 'elite',
  varianten: { zeltbewohner: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let auf = 0, griff = 0, lean = 0, fall = 0, glanz = 1, flatter = 0;
    if (p.idle) { flatter = [0, 1, 0, -1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { auf = [2, 5, 9, 4][f]; griff = [0, 6, 26, 10][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.8, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 34); glanz = f < 2 ? 0.6 : 0; }
    const cx = 66, ox = lean, top = 46 + fall;
    const zelt = Pg([[cx + ox, top], [cx + 10 + ox, top + 6], [cx + 40, 148], ...saum(cx + 40, cx - 40, 152, 8, 2, 4), [cx - 40, 148], [cx - 10 + ox, top + 6]], null, { rd: 2.2 });
    // Schlitz: dunkle Öffnung vorn, öffnet beim Angriff
    const sl = Pg([[cx - 2 + ox, top + 24], [cx + 3 + auf + ox, top + 50], [cx + 6 + auf, 146], [cx - 8 - auf, 146], [cx - 6 - auf * 0.6 + ox, top + 50]], 'dunkel', { rd: 1.2, pf: 'flat' });
    const lappen = Pg([[cx - 6 - auf * 0.6 + ox, top + 50], [cx - 14 - auf * 2 + flatter, top + 80], [cx - 14 - auf * 2, 146], [cx - 8 - auf, 146]], null, { rd: 1, pf: 'bevel', tone: 0.12 });
    // Gestell: Stangen oben raus
    const stangen = [C(cx + ox, top + 2, cx - 6 + ox, top - 12, 1.2, 1, 'dunkel', { pf: 'flat' }), C(cx + ox, top + 2, cx + 8 + ox, top - 10, 1.2, 1, 'dunkel', { pf: 'flat' })];
    const schuhe = [Pg([[cx + 28, 120], [cx + 38, 108], [cx + 44, 112], [cx + 36, 128]], 'dunkel', { rd: 2, pf: 'flat' })];
    const leinen = [];
    // Arm aus dem Schlitz
    const hx = cx - 6 - griff, hy = top + 70 - griff * 0.2;
    const arm = griff > 0 ? glied([[cx - 2 + ox, top + 64], [cx - 6 - griff * 0.5, top + 64 - griff * 0.1], [hx, hy]], 2.4, 1.8, null) : [];
    const finger = griff > 4 ? [0, 1, 2].map(i => C(hx, hy, hx - 8, hy - 3 + i * 3, 0.9, 0.6, null, { pf: 'flat' })) : [];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: leinen, k: 0, pf: 'flat', noRim: true },
      { p: tot ? [] : stangen, k: 0, pf: 'flat' },
      { p: [zelt], k: 3 },
      { p: schuhe, k: 0, pf: 'flat', noRim: true },
      { p: [sl], k: 0, pf: 'flat', noRim: true },
      { p: [lappen], k: 2, pf: 'bevel' },
      { p: arm, k: 1 },
      { p: finger, k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Nähte, Reif an der Plane
      for (let y = top + 20; y < 146; y += 9) P.line(r(cx + 6 + (y - top) * 0.2), y, r(cx + 14 + (y - top) * 0.25), y + 1, 'k3', true);
      for (let x = -36; x <= 36; x += 5) P.auf(r(cx + x), 149, 'r1');
      if (glanz > 0) {
        // viele Augen im Schlitz, übereinander
        const ys = [top + 44, top + 58, top + 74];
        for (const [i, y] of ys.entries()) { const ex = r(cx - 2 + (i % 2)), ey = r(y); P.set(ex, ey, i ? 'glut' : 'kern'); P.glow(ex, ey, 4 * glanz, 0.6 * glanz, 'glutDim', 'k3'); augen.push([ex, ey]); }
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
