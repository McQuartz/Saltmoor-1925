// Ziegelgruben, dritter Wächter: Der Zenturio. Er hat die Ziegelei für das Lager beaufsichtigt, und jeden
// Ziegel hat er gestempelt, mit seiner Legion und seinem Namen. Dann hat man ihn in die Mauer gesetzt,
// als Opfer für den Bau. Er ist herausgekommen, und die Mauer mit ihm: Schild und Rücken sind ein Stück
// Ziegelwand. Er ruft seine Wasserträger. Angriff: der Schild rammt vor.
'use strict';
module.exports = {
  id: 'zenturio', biom: 'ziegelgruben', zone: 'ziegelgruben', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [74, 30], rimBis: 172,
  varianten: { zenturio: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let stoss = 0, X = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { stoss = [2, 6, -16, -6][f]; X = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { X = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 40); glanz = f < 2 ? 0.6 : 0; }
    const cx = 86 + X, sy = 56 + fall;
    const wand = Pg([[cx - 6, sy - 10], [cx + 40, sy - 16], [cx + 50, sy + 20], [cx + 46, sy + 70], [cx + 20, sy + 80], [cx - 4, sy + 60]], null, { rd: 1.2, pf: 'bevel', tone: 0.1 });
    const leib = Pg([[cx - 20, sy + 2], [cx - 8, sy - 8], [cx + 16, sy - 8], [cx + 26, sy + 4], [cx + 24, sy + 56], [cx - 18, sy + 56]], null, { rd: 2 });
    const rock = Pg([[cx - 22, sy + 50], [cx + 26, sy + 50], [cx + 30, sy + 74], ...saum(cx + 30, cx - 26, sy + 78, 6, 3, 4), [cx - 26, sy + 74]], null, { rd: 1.6 });
    const beine = [C(cx - 10, sy + 74, cx - 14, 168, 6, 5, null), C(cx + 14, sy + 74, cx + 18, 168, 6, 5, null)];
    const sandalen = [E(cx - 18, 171, 9, 3.5, 'dunkel'), E(cx + 16, 171, 8, 3.5, 'dunkel')];
    const kx = cx - 2, ky = sy - 16 + atem * 0.5;
    const kopf = E(kx, ky, 9, 10, null, { rd: 1.4 });
    const helm = Pg([[kx - 10, ky - 2], [kx - 8, ky - 12], [kx + 8, ky - 12], [kx + 11, ky - 2], [kx + 6, ky + 8], [kx - 6, ky + 8]], null, { rd: 1.4, pf: 'bevel' });
    const busch = Pg([[kx - 12, ky - 11], [kx - 10, ky - 20], [kx - 2, ky - 26], [kx + 10, ky - 24], [kx + 16, ky - 16], [kx + 10, ky - 11]], null, { rd: 1.6, tone: 0.1 });
    // Schild vorn: großes Rechteck, gewölbt
    const sx = cx - 40 + stoss, sy0 = sy + 10;
    const schild = Pg([[sx - 16, sy0], [sx + 14, sy0 - 2], [sx + 16, sy0 + 64], [sx - 14, sy0 + 66]], null, { rd: 2.2, pf: 'bevel' });
    const buckel = E(sx, sy0 + 32, 5, 5, 'dunkel', { pf: 'dome' });
    const armV = glied([[cx - 16, sy + 4], [cx - 28, sy + 20], [sx + 8, sy0 + 30]], 5, 4, null);
    const armH = glied([[cx + 22, sy + 4], [cx + 34, sy + 24], [cx + 30, sy + 46]], 5, 4, null);
    const stab = C(cx + 30, sy + 46, cx + 36, sy - 26, 1.4, 1.2, 'dunkel', { pf: 'flat' });
    const gruppen = [
      { p: [wand], k: 2, pf: 'bevel' },
      { p: armH, k: 1 },
      { p: [stab], k: 0, pf: 'flat' },
      { p: beine, k: 1 },
      { p: sandalen, k: 0 },
      { p: [leib], k: 3 },
      { p: [rock], k: 2 },
      { p: [busch], k: 1.5 },
      { p: [kopf], k: 2 },
      { p: [helm], k: 1.5, pf: 'bevel' },
      { p: armV, k: 1 },
      { p: [schild], k: 2, pf: 'bevel' },
      { p: [buckel], k: 0, pf: 'dome' },
    ];
    const augen = [];
    const details = P => {
      // Ziegelverband auf Rücken und Schild, Stempel
      for (let y = sy - 10; y < sy + 74; y += 6) for (let x = cx + 4 + ((y / 6) % 2) * 5; x < cx + 46; x += 10) P.line(r(x), y, r(x + 7), y, 'ziegel', true);
      for (let y = sy0 + 6; y < sy0 + 62; y += 8) P.line(r(sx - 12), y, r(sx + 12), y, 'k1', true);
      P.set(r(sx - 6), r(sy0 + 12), 'ziegel'); P.set(r(sx + 6), r(sy0 + 12), 'ziegel');
      for (let i = 0; i < 4; i++) P.line(r(cx - 16 + i * 10), r(sy + 52), r(cx - 16 + i * 10), r(sy + 74), 'k0', true);
      if (glanz > 0) {
        const ex = r(kx - 5), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 6, ey, 'glut');
        P.glow(ex + 3, ey, 7 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 6, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
