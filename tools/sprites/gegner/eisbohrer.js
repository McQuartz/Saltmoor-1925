// Der Eisbohrer (schwarzes Eis). Er hat für die Expedition von 1903 Löcher ins Eis gebohrt, um zu
// messen, wie dick es ist, und er hat keinen Grund gefunden. Ein vermummter Mann im Pelz, gebeugt
// über den Bohrer, dessen Kurbel und Schaft ihm aus dem Arm gewachsen sind; die Spirale reicht bis
// in den Boden. Er bohrt durch deine Deckung wie durch Eis. Angriff: der Bohrer stößt vor.
'use strict';
module.exports = {
  id: 'eisbohrer', biom: 'eis', zone: 'eis', w: 96, h: 120, fuss: [48, 115], kopf: [36, 34], rimBis: 112,
  varianten: {
    eisbohrer_a: { pelz: 1, lang: 1 },
    eisbohrer_b: { pelz: 1.15, lang: 1.15 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, stoss = 0, dreh = 0, fall = 0, glanz = 1;
    if (p.idle) { dreh = f % 2; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [2, 3, -7, -2][f]; stoss = [2, 4, -12, -4][f]; dreh = f % 2; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 56, ox = lean, sy = 48 + fall, z = v.pelz;
    const pelz = Pg([[cx - 16 * z + ox, sy + 4], [cx - 4 + ox, sy - 8], [cx + 14 * z + ox, sy - 2], [cx + 16 * z, sy + 30], [cx + 16, 104], ...saum(cx + 16, cx - 16, 110, 6, 3, 5), [cx - 16, 104], [cx - 18 * z, sy + 30]], null, { rd: 2.2 });
    const kx = cx - 14 + ox * 1.3, ky = sy - 4;
    const kapuze = Pg([[kx - 9, ky + 6], [kx - 8, ky - 6], [kx + 2, ky - 11], [kx + 12, ky - 4], [kx + 12, ky + 8], [kx, ky + 12]], null, { rd: 2 });
    const loch = E(kx - 3, ky + 2, 4, 5, 'dunkel', { pf: 'flat' });
    // Bohrer: Kurbel oben, Schaft schräg nach vorn unten, Spirale am Ende
    const L = 52 * v.lang, a = 1.25 - stoss * 0.03;
    const bx0 = cx - 20 + ox + stoss, by0 = sy + 14;
    const bx1 = bx0 - Math.cos(a) * L * 0.3, by1 = by0 + Math.sin(a) * L;
    const schaft = C(bx0, by0, bx1, by1, 1.6, 1.4, null, { pf: 'bevel' });
    const spirale = [];
    for (let i = 0; i < 6; i++) { const t = 0.55 + i * 0.075, x = bx0 + (bx1 - bx0) * t, y = by0 + (by1 - by0) * t, s = ((i + dreh) % 2 ? 1 : -1) * 3; spirale.push(C(x - s, y - 1, x + s, y + 2, 1.1, 1.1, null, { pf: 'bevel' })); }
    const kurbel = [C(bx0, by0, bx0 + 6, by0 - 6 + dreh * 2, 1.4, 1.4, null, { pf: 'flat' }), C(bx0 + 6, by0 - 6 + dreh * 2, bx0 + 6, by0 - 12 + dreh * 2, 1.4, 1.4, null, { pf: 'flat' })];
    const armV = glied([[cx - 10 + ox, sy + 4], [cx - 18 + ox, sy + 10], [bx0, by0]], 3.2, 2.6, null);
    const armH = glied([[cx + 8 + ox, sy + 2], [cx + 2 + ox, sy - 4], [bx0 + 6, by0 - 12 + dreh * 2]], 3.2, 2.6, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [pelz], k: 3 },
      { p: [kapuze], k: 2 },
      { p: [loch], k: 0, pf: 'flat', noRim: true },
      { p: tot ? [] : [schaft, ...spirale, ...kurbel], k: 0, pf: 'bevel' },
      { p: armH, k: 1 },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Reif im Pelzrand, Eissplitter am Bohrer
      for (let x = -8; x <= 10; x += 3) P.auf(r(kx + x), r(ky - 8 + Math.abs(x) * 0.3), 'r1');
      if (!tot) { P.set(r(bx1 - 3), r(by1), 'r2'); P.set(r(bx1 + 3), r(by1 - 1), 'r1'); }
      if (glanz > 0) {
        const ex = r(kx - 5), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
