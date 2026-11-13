// Der Glasläufer (Glasmeer). Er ist auf Stelzen über das Glas gegangen, damit es nicht bricht, und ist
// nie angekommen. Die Stelzen sind seine Beine geworden, dünn und lang, und unten sind sie Glas. Wo er
// hintritt, friert es zu: Deine Hand bleibt an der Karte kleben. Angriff: er tritt mit der Stelze zu.
'use strict';
module.exports = {
  id: 'glaslaeufer', biom: 'glasmeer', zone: 'glasmeer', w: 96, h: 120, fuss: [48, 115], kopf: [48, 14], rimBis: 112,
  varianten: { glaslaeufer_a: { lang: 1 }, glaslaeufer_b: { lang: 1.1 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let tritt = 0, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { tritt = [2, 6, 18, 6][f]; lean = [1, 2, -3, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50 + lean, L = v.lang, sy = 113 - 76 * L + fall;
    const leib = Pg([[cx - 8, sy], [cx + 8, sy - 1], [cx + 10, sy + 22], [cx - 10, sy + 22]], null, { rd: 2 });
    const kx = cx, ky = sy - 9;
    const kopf = E(kx, ky, 5.5, 6.5, null, { rd: 1.3 });
    const kappe = Pg([[kx - 6, ky - 3], [kx - 4, ky - 8], [kx + 5, ky - 8], [kx + 6, ky - 3]], null, { rd: 1 });
    const beine = [glied([[cx - 4, sy + 20], [cx - 10 - tritt * 0.5, sy + 50 - tritt * 0.4], [cx - 12 - tritt, 113 - tritt * 0.6]], 2.2, 1.2, null), glied([[cx + 4, sy + 20], [cx + 8, sy + 50], [cx + 10, 113]], 2.2, 1.2, null)];
    const arme = [glied([[cx - 7, sy + 3], [cx - 14, sy + 14], [cx - 12, sy + 26]], 1.8, 1.4, null), glied([[cx + 7, sy + 3], [cx + 14, sy + 14], [cx + 12, sy + 26]], 1.8, 1.4, null)];
    const glasf = [E(cx - 12 - tritt, 112 - tritt * 0.6, 2.2, 3, null, { pf: 'dome', tone: 0.2 }), E(cx + 10, 112, 2.2, 3, null, { pf: 'dome', tone: 0.2 })];
    const gruppen = [
      { p: beine.flat(), k: 1 },
      { p: glasf, k: 2, pf: 'dome' },
      { p: [leib], k: 3 },
      { p: arme.flat(), k: 1 },
      { p: [kopf], k: 2 },
      { p: [kappe], k: 2 },
    ];
    const augen = [];
    const details = P => {
      // Glas unten an den Stelzen: helle Kanten; Spiegelung im Boden
      for (const x of [cx - 12 - tritt, cx + 10]) { P.set(r(x), r(108), 'nordlicht'); P.set(r(x), r(104), 'r1'); }
      for (let x = 10; x < 90; x += 6) P.set(x, 115, 'violett');
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
