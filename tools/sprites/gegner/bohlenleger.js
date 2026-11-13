// Der Bohlenleger (Moorwald). Er hat den Bohlenweg übers Moor gelegt, Brett für Brett, und das Moor hat
// jedes Brett genommen. Er legt weiter. Ein krummer Mann, die Bohle quer über der Schulter, so lang, dass
// sie an beiden Seiten aus dem Bild ragt; die Beine sind bis zum Knie schwarz vom Torf.
// Er stellt die Bohle vor die anderen. Angriff: die Bohle schwingt herum.
'use strict';
module.exports = {
  id: 'bohlenleger', biom: 'moor', zone: 'moor', w: 96, h: 120, fuss: [48, 115], kopf: [44, 34], rimBis: 112,
  varianten: { bohlenleger_a: { lang: 1, buckel: 1 }, bohlenleger_b: { lang: 1.15, buckel: 1.2 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let a = -0.15, lean = 0, fall = 0, glanz = 1;
    if (p.idle) { a = [-0.15, -0.14, -0.15, -0.16][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { a = [-0.3, -0.45, 0.35, 0.1][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50 + lean, sy = 44 + fall, b = v.buckel;
    const leib = Pg([[cx - 12, sy + 6], [cx - 4, sy - 4 * b], [cx + 10, sy - 2 * b], [cx + 14, sy + 10], [cx + 12, sy + 40], [cx - 10, sy + 40]], null, { rd: 2 });
    const beine = [C(cx - 5, sy + 38, cx - 8, 113, 3, 2.6, 'dunkel'), C(cx + 6, sy + 38, cx + 8, 113, 3, 2.6, 'dunkel')];
    const kx = cx - 9, ky = sy - 10;
    const kopf = E(kx, ky, 5.5, 6, null, { rd: 1.3 });
    const muetze = Pg([[kx - 6, ky - 3], [kx - 4, ky - 8], [kx + 5, ky - 7], [kx + 6, ky - 2]], null, { rd: 1 });
    const L = 46 * v.lang, bx = cx + 2, by = sy + 2;
    const bohle = Pg([[bx - Math.cos(a) * L, by + Math.sin(a) * L - 3], [bx + Math.cos(a) * L * 0.6, by - Math.sin(a) * L * 0.6 - 3], [bx + Math.cos(a) * L * 0.6, by - Math.sin(a) * L * 0.6 + 3], [bx - Math.cos(a) * L, by + Math.sin(a) * L + 3]], null, { rd: 0.6, pf: 'bevel' });
    const arme = [glied([[cx - 8, sy + 6], [cx - 14, sy + 4], [bx - 12, by + 2]], 2.4, 2, null), glied([[cx + 8, sy + 6], [cx + 12, sy + 2], [bx + 10, by]], 2.4, 2, null)];
    const gruppen = [
      { p: beine, k: 1 },
      { p: [leib], k: 3 },
      { p: [kopf], k: 2 },
      { p: [muetze], k: 2 },
      { p: [bohle], k: 1, pf: 'bevel' },
      { p: arme.flat(), k: 1 },
    ];
    const augen = [];
    const details = P => {
      for (let x = -20; x < 20; x += 7) { const t = x / L; P.set(r(bx + Math.cos(a) * x), r(by - Math.sin(a) * x), 'k0'); }
      for (let y = 96; y < 113; y += 3) { P.set(r(cx - 7), y, 'k0'); P.set(r(cx + 7), y, 'k0'); }
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
