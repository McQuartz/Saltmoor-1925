// Die Salzbraut (Salzstollen, Elite). Eine Braut, die 1907 in den Stollen gestiegen ist, um ihren
// Bräutigam heraufzuholen, und unten geblieben ist. Das Salz hat ihr Kleid zu Kristall gemacht,
// der Schleier ist eine Kruste bis zum Boden. Wer sie trifft, dem bleibt nichts haften, sie wäscht
// alles ab, und sie flickt die anderen mit Sole. Angriff: der Schleier peitscht.
'use strict';
module.exports = {
  id: 'salzbraut', biom: 'salz', zone: 'salz', w: 128, h: 160, fuss: [64, 155], kopf: [58, 34], rimBis: 152, rang: 'elite',
  varianten: { salzbraut: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, peit = 0, fall = 0, glanz = 1, wehen = 0;
    if (p.idle) { wehen = [0, 1, 0, -1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { peit = [2, 6, -14, -4][f]; lean = [2, 4, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 36); glanz = f < 2 ? 0.6 : 0; }
    const cx = 64, ox = lean, sy = 50 + fall;
    const kleid = Pg([[cx - 8 + ox, sy], [cx + 8 + ox, sy], [cx + 12 + ox, sy + 18], [cx + 24, sy + 60], [cx + 32, 148], ...saum(cx + 32, cx - 30, 152, 8, 3, 5), [cx - 30, 148], [cx - 22, sy + 60], [cx - 12 + ox, sy + 18]], null, { rd: 2.2 });
    const kx = cx - 2 + ox * 1.2, ky = sy - 10;
    const kopf = E(kx, ky, 6.5, 7.5, null, { rd: 1.4 });
    // Schleier: vom Kopf nach hinten-rechts bis zum Boden, mit Wehen
    const schleier = Pg([[kx - 4, ky - 8], [kx + 6, ky - 10], [kx + 18 + wehen, ky + 10], [cx + 38 + wehen * 2 - peit, sy + 60], [cx + 44 + wehen - peit * 1.4, 146], [cx + 30, 150], [cx + 20, sy + 50], [kx + 8, ky + 8]], null, { rd: 2, pf: 'bevel', tone: 0.15 });
    const kranz = [0, 1, 2, 3, 4].map(i => E(kx - 6 + i * 3, ky - 7 - (i % 2), 1.6, 1.4, null, { pf: 'dome' }));
    // Arme vor der Brust, Strauß aus Salzkristallen
    const armV = glied([[cx - 8 + ox, sy + 4], [cx - 14 + ox, sy + 16], [cx - 4 + ox, sy + 24]], 2.6, 2.2, null);
    const armH = glied([[cx + 8 + ox, sy + 4], [cx + 10 + ox, sy + 16], [cx - 1 + ox, sy + 24]], 2.6, 2.2, null);
    const strauss = [[-4, 0], [0, -3], [3, 1], [-1, 3]].map(([dx, dy]) => Pg([[cx - 3 + dx + ox, sy + 24 + dy], [cx - 1 + dx + ox, sy + 18 + dy], [cx + 1 + dx + ox, sy + 24 + dy]], null, { rd: 0.4, pf: 'bevel' }));
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [schleier], k: 2, pf: 'bevel' },
      { p: [kleid], k: 3 },
      { p: [kopf], k: 2 },
      { p: tot ? [] : kranz, k: 1, pf: 'dome' },
      { p: armH, k: 1 },
      { p: tot ? [] : strauss, k: 0, pf: 'bevel' },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Kristall im Kleid: helle Facetten
      for (let y = sy + 22; y < 148; y += 4) for (let x = cx - 26; x < cx + 30; x += 4) if (((x * 5 + y * 3) % 7) === 0) P.auf(r(x), r(y), 'r1');
      // Solerinnsal am Saum
      for (let x = cx - 26; x < cx + 30; x += 7) P.set(r(x), 153, 'r1');
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
