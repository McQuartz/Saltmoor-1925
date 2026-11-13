// Das Puppenkind (Waisenhaus am Deich). Ein Mädchen, das die Puppe aus dem Spendenpaket bekommen hat, die
// zu groß für es war. Es trägt sie immer noch, und die Puppe ist größer geworden, das Kind nicht. Man sieht
// nur die Puppe mit dem Porzellangesicht, die Füße des Kindes schauen unten heraus. Was es vorhat,
// verdeckt die Puppe. Angriff: die Puppe kippt nach vorn.
'use strict';
module.exports = {
  id: 'puppenkind', biom: 'waisenhaus', zone: 'waisenhaus', w: 96, h: 120, fuss: [48, 115], kopf: [46, 30], rimBis: 112,
  varianten: { puppenkind_a: { puppe: 1 }, puppenkind_b: { puppe: 1.15 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let kipp = 0, lean = 0, fall = 0, glanz = 1, wack = 0;
    if (p.idle) { wack = [0, 1, 0, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { kipp = [2, 4, -10, -3][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 24); glanz = f < 2 ? 0.6 : 0; }
    const cx = 48 + lean, s = v.puppe, base = 100 + fall;
    const kleid = Pg([[cx - 10 * s + kipp, base - 58 * s], [cx + 10 * s + kipp, base - 58 * s], [cx + 18 * s, base - 30 * s], [cx + 20 * s, base], ...saum(cx + 20 * s, cx - 20 * s, base + 4, 6, 2, 3), [cx - 20 * s, base], [cx - 18 * s, base - 30 * s]], null, { rd: 2.2 });
    const kx = cx + kipp * 1.4, ky = base - 70 * s + wack * 0.5;
    const kopf = E(kx, ky, 11 * s, 12 * s, null, { pf: 'dome', rd: 1.4, tone: 0.18 });
    const locken = [-1, 1].map(sd => glied([[kx + sd * 9 * s, ky - 6 * s], [kx + sd * 13 * s, ky + 6 * s], [kx + sd * 11 * s, ky + 18 * s]], 3 * s, 2, null));
    const puppenarme = [-1, 1].map(sd => glied([[cx + sd * 10 * s + kipp, base - 54 * s], [cx + sd * 18 * s, base - 40 * s], [cx + sd * 18 * s, base - 28 * s]], 2.4, 2, null, { pf: 'dome', tone: 0.1 }));
    const kinderbeine = [C(cx - 4, base + 2, cx - 5, 113, 2, 1.8, null), C(cx + 4, base + 2, cx + 5, 113, 2, 1.8, null)];
    const kinderhaende = [E(cx - 8, base - 26 * s, 2.4, 2.2, 'haut'), E(cx + 8, base - 24 * s, 2.4, 2.2, 'haut')];
    const gruppen = [
      { p: kinderbeine, k: 1 },
      { p: locken.flat(), k: 1.5 },
      { p: [kleid], k: 3 },
      { p: puppenarme.flat(), k: 1, pf: 'dome' },
      { p: kinderhaende, k: 0 },
      { p: [kopf], k: 2, pf: 'dome' },
    ];
    const augen = [];
    const details = P => {
      // Sprung im Porzellan, Schleife in Ocker, Rüschen
      P.line(r(kx + 3 * s), r(ky - 8 * s), r(kx + 6 * s), r(ky + 2 * s), 'k0');
      P.set(r(cx - 2), r(base - 56 * s), 'ocker'); P.set(r(cx + 2), r(base - 56 * s), 'ocker');
      for (let x = cx - 16 * s; x < cx + 16 * s; x += 4) P.set(r(x), r(base - 2), 'kalk');
      if (glanz > 0) {
        // Puppenaugen sind gemalt, aber sie leuchten
        const ex = r(kx - 5 * s), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + r(9 * s), ey, 'glut');
        P.glow(ex + 4, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + r(9 * s), ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
