// Der Klöppel (Glockengießerei). Der Klöppel der großen Glocke, die 1641 gesprungen ist. Er ist
// herausgefallen und hat sich auf den Weg gemacht, um eine neue Glocke zu finden: ein schwerer Bronzetropfen
// auf zwei dünnen Beinen, der Kopf ist die Kugel. Er holt zweimal aus, dann schlägt er an.
// Angriff: der Klöppel schlägt.
'use strict';
module.exports = {
  id: 'kloeppel', biom: 'glockengiesserei', zone: 'glockengiesserei', w: 96, h: 120, fuss: [48, 115], kopf: [48, 70], rimBis: 112,
  varianten: { kloeppel_a: { kugel: 1, lang: 1 }, kloeppel_b: { kugel: 1.2, lang: 0.9 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let a = 0, fall = 0, glanz = 1;
    if (p.idle) { a = [0, 0.006, 0, -0.006][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { a = [0.3, 0.5, -0.6, -0.2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { a = [0.15, 0.05][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); a = p.q * 0.3; glanz = f < 2 ? 0.6 : 0; }
    const ax = 50, ay = 18 + fall, L = 52 * v.lang;
    const kx = ax + Math.sin(a) * L, ky = ay + Math.cos(a) * L;
    const oese = E(ax, ay, 5, 5, 'dunkel', { pf: 'flat' });
    const schaft = C(ax, ay + 4, kx, ky, 3, 5, null, { pf: 'bevel' });
    const kugel = E(kx, ky + 8, 14 * v.kugel, 14 * v.kugel, null, { pf: 'dome', rd: 1.4 });
    const by = ky + 8 + 12 * v.kugel;
    const beine = [glied([[kx - 6, by - 4], [kx - 14, by + 8], [kx - 12, 113]], 2.2, 1.8, 'dunkel'), glied([[kx + 6, by - 4], [kx + 14, by + 8], [kx + 12, 113]], 2.2, 1.8, 'dunkel')];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine.flat(), k: 1 },
      { p: [oese], k: 0, pf: 'flat' },
      { p: [schaft], k: 2, pf: 'bevel' },
      { p: [kugel], k: 3, pf: 'dome' },
    ];
    const augen = [];
    const details = P => {
      // Gussnaht, Grünspan, die Augen in der Kugel
      P.line(r(kx - 12 * v.kugel), r(ky + 8), r(kx + 12 * v.kugel), r(ky + 8), 'guss', true);
      for (const [dx, dy] of [[-6, 14], [5, 2], [8, 16]]) P.set(r(kx + dx), r(ky + dy), 'bronze');
      if (glanz > 0 && !tot) {
        const ex = r(kx - 5), ey = r(ky + 4);
        P.set(ex, ey, 'kern'); P.set(ex + 8, ey, 'glut');
        P.glow(ex + 4, ey, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 8, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
