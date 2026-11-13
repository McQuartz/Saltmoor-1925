// Der Wald, der nach unten wächst, dritter Wächter: Die Wölfin. Ein Standbild aus Bronze, das die Legion
// in den Hain gebracht hat, damit er Rom gehört. Der Hain hat sie behalten, und sie hat sich verändert:
// zu lange Beine, ein Rücken voller Wurzeln, und unter ihr hängen keine Kinder, sondern Waben aus Harz,
// in denen etwas schläft. Ihr Biss geht durch jede Deckung. Angriff: sie springt.
'use strict';
module.exports = {
  id: 'woelfin', biom: 'wald', zone: 'wald', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [36, 54], rimBis: 172,
  varianten: { woelfin: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let sprung = 0, kopfY = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; kopfY = [0, 1, 1, 0][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { sprung = [2, 6, -14, -4][f]; kopfY = [-2, -4, 6, 2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { sprung = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 34); glanz = f < 2 ? 0.6 : 0; }
    const bx = 92 + sprung, by = 84 + fall + atem * 0.5;
    const rumpf = Pg([[bx - 40, by - 4], [bx - 24, by - 14], [bx + 10, by - 12], [bx + 36, by - 18], [bx + 46, by - 4], [bx + 40, by + 14], [bx + 10, by + 18], [bx - 20, by + 16], [bx - 40, by + 10]], null, { rd: 2.6 });
    const hals = C(bx - 34, by - 4, bx - 50, by - 20 + kopfY, 9, 7, null);
    const kx = bx - 56, ky = by - 26 + kopfY;
    const kopf = Pg([[kx + 10, ky - 8], [kx, ky - 10], [kx - 14, ky - 4], [kx - 24, ky + 2], [kx - 22, ky + 6], [kx - 8, ky + 6], [kx + 8, ky + 8]], null, { rd: 1.6 });
    const ohren = [C(kx + 4, ky - 8, kx + 6, ky - 18, 2.4, 1, null), C(kx + 9, ky - 7, kx + 12, ky - 16, 2.2, 1, null)];
    const kiefer = Pg([[kx - 22, ky + 6], [kx - 8, ky + 6], [kx + 4, ky + 9], [kx - 6, ky + 12 + Math.max(0, -sprung) * 0.4], [kx - 20, ky + 9]], null, { rd: 1 });
    const L = 1.3;
    const bein = (x0, y0, k, e, w) => glied([[x0, y0], k, e], w, 2.2, null);
    const beine = [
      bein(bx - 30, by + 8, [bx - 38 - sprung * 0.6, by + 40 * L], [bx - 34 - sprung, 172], 4.6),
      bein(bx - 18, by + 10, [bx - 20, by + 42 * L], [bx - 16, 172], 4),
      bein(bx + 30, by + 8, [bx + 42, by + 34 * L], [bx + 34, 172], 5),
      bein(bx + 40, by + 4, [bx + 52, by + 32 * L], [bx + 46, 172], 4.4),
    ];
    const schwanz = glied([[bx + 44, by - 8], [bx + 58, by - 2], [bx + 64, by + 18]], 3.4, 1.6, null);
    const waben = [-14, -2, 10, 22].map((dx, i) => E(bx + dx, by + 22 + (i % 2) * 3, 4.4, 6, null, { pf: 'dome', tone: 0.1 }));
    const wurzeln = [];
    for (let i = 0; i < 6; i++) { const x = bx - 24 + i * 11; wurzeln.push(glied([[x, by - 12 - (i % 2) * 3], [x + 4, by - 22 - (i % 3) * 3], [x + 2 + (i % 2) * 6, by - 30 - (i % 3) * 5]], 1.6, 0.6, null)); }
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [beine[1], beine[3]].flat(), k: 1 },
      { p: wurzeln.flat(), k: 1 },
      { p: schwanz, k: 1 },
      { p: [rumpf], k: 3 },
      { p: tot ? [] : waben, k: 1, pf: 'dome' },
      { p: [hals], k: 2 },
      { p: [kopf, kiefer], k: 2 },
      { p: ohren, k: 1 },
      { p: [beine[0], beine[2]].flat(), k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Bronzepatina: Harz in den Waben, Zähne
      for (let i = 0; i < 4; i++) P.set(r(bx - 14 + i * 12), r(by + 23 + (i % 2) * 3), 'harz');
      for (let x = kx - 20; x < kx - 6; x += 3) P.set(r(x), r(ky + 7), 'r1');
      for (let x = bx - 30; x < bx + 40; x += 8) P.auf(r(x), r(by - 10), 'harzhell');
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky - 3);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut');
        P.glow(ex, ey, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
