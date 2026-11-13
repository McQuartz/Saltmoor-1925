// Der Staubmann (Mond unter dem Eis). Aus dem Mondstaub, der sich in den Kratern sammelt, steht manchmal
// jemand auf. Er hat die Form des Gehilfen, aber nicht ganz, und er rieselt beim Gehen. Was er vorhat,
// sieht man nicht durch den Staub, den er aufwirbelt. Angriff: er zerfällt nach vorn und schlägt zu.
'use strict';
module.exports = {
  id: 'staubmann', biom: 'mond', zone: 'mond', w: 96, h: 120, fuss: [48, 115], kopf: [48, 30], rimBis: 112,
  varianten: { staubmann_a: { breit: 1 }, staubmann_b: { breit: 1.15 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let griff = 0, lean = 0, fall = 0, glanz = 1, ries = 0;
    if (p.idle) { ries = f; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { griff = [2, 6, 16, 6][f]; lean = [1, 2, -5, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; ries = f; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50 + lean, sy = 42 + fall, w = v.breit;
    const leib = Pg([[cx - 10 * w, sy], [cx + 10 * w, sy - 1], [cx + 14 * w, sy + 30], [cx + 18 * w, 104], ...saum(cx + 18 * w, cx - 18 * w, 112, 7, 4, 5), [cx - 18 * w, 104], [cx - 14 * w, sy + 30]], null, { rd: 2.4 });
    const kx = cx, ky = sy - 10;
    const kopf = Pg([[kx - 6, ky + 6], [kx - 7, ky - 4], [kx - 2, ky - 9], [kx + 5, ky - 8], [kx + 7, ky + 2], [kx + 4, ky + 8]], null, { rd: 1.6 });
    const arme = [glied([[cx - 9, sy + 4], [cx - 18 - griff * 0.5, sy + 16], [cx - 22 - griff, sy + 30 - griff * 0.4]], 3, 1.6, null), glied([[cx + 9, sy + 4], [cx + 16, sy + 18], [cx + 18, sy + 32]], 3, 1.6, null)];
    const gruppen = [
      { p: arme[1], k: 1 },
      { p: [leib], k: 3 },
      { p: [kopf], k: 2 },
      { p: arme[0], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Staub rieselt aus Fingern und Saum, Krater am Boden
      for (let i = 0; i < 6; i++) { P.set(r(cx - 22 - griff + (i % 2)), r(sy + 32 + ((i * 4 + ries * 2) % 20)), 'asche'); P.set(r(cx - 14 + i * 6), r(113 - ((i + ries) % 3)), 'asche'); }
      for (let x = cx - 20; x < cx + 20; x += 5) P.set(r(x), 115, 'bleich');
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
