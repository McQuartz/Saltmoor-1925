// Der Laternenanzünder (Mondkrater). Er geht die Kraterränder ab und zündet Laternen an, die
// niemand aufgestellt hat. Solange er seine Runde macht, flicken sich die anderen im Licht.
// Ein dürrer Mann im langen Mantel mit Schirmmütze, eine Stange mit Haken und Docht doppelt so
// hoch wie er. Angriff: er schlägt mit der brennenden Stange zu.
'use strict';
module.exports = {
  id: 'laternenanzuender', biom: 'mond', zone: 'mond', w: 96, h: 120, fuss: [48, 115], kopf: [46, 40], rimBis: 112,
  varianten: {
    laternenanzuender_a: { lang: 1, mantel: 1 },
    laternenanzuender_b: { lang: 1.1, mantel: 1.15 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let a = 0.12, lean = 0, fall = 0, glanz = 1, flamme = 1;
    if (p.idle) { flamme = [1, 1.2, 0.9, 1.1][f]; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { a = [0.05, -0.1, 0.9, 0.5][f]; lean = [1, 2, -5, -2][f]; glanz = [1, 1.2, 1.6, 1.1][f]; flamme = [1, 1.2, 1.6, 1.2][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; flamme = 0.6; }
    if (p.tod) { fall = r(p.q * 28); lean = r(p.q * 4); glanz = f < 2 ? 0.6 : 0; flamme = f < 2 ? 0.5 : 0; }
    const cx = 52 + lean, sy = 46 + fall, z = v.mantel;
    const mantel = Pg([[cx - 7, sy], [cx + 7, sy - 1], [cx + 10 * z, sy + 30], [cx + 13 * z, 104], ...saum(cx + 13 * z, cx - 12 * z, 108, 5, 2, 4), [cx - 12 * z, 104], [cx - 9 * z, sy + 30]], null, { rd: 2 });
    const beine = [C(cx - 4, 104, cx - 5, 113, 2.4, 2.2, null), C(cx + 4, 104, cx + 5, 113, 2.4, 2.2, null)];
    const kx = cx - 1, ky = sy - 8;
    const kopf = E(kx, ky, 5.5, 6.5, null, { rd: 1.4 });
    const muetze = Pg([[kx - 7, ky - 4], [kx - 5, ky - 9], [kx + 5, ky - 9], [kx + 6, ky - 5], [kx - 9, ky - 3]], null, { rd: 1.2 });
    // Stange: Hand vorn rechts, Stange fast senkrecht, kippt beim Schlag nach links vorn
    const hx = cx - 9, hy = sy + 18;
    const L = 72 * v.lang;
    const tx = hx - Math.sin(a) * L * 0.75, ty = hy - Math.cos(a) * L * 0.75;
    const bx = hx + Math.sin(a) * L * 0.25, by = hy + Math.cos(a) * L * 0.25;
    const stange = C(bx, by, tx, ty, 1.2, 1.0, null, { pf: 'flat' });
    const haken = C(tx, ty, tx - 3, ty + 3, 1, 1, null, { pf: 'flat' });
    const arm = glied([[cx - 4, sy + 2], [cx - 9, sy + 10], [hx, hy]], 2.6, 2.2, null);
    const arm2 = glied([[cx + 5, sy + 2], [cx + 7, sy + 14], [cx + 6, sy + 24]], 2.6, 2.2, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine, k: 1 },
      { p: [mantel], k: 3 },
      { p: arm2, k: 1 },
      { p: [kopf], k: 2 },
      { p: [muetze], k: 2 },
      { p: tot ? [] : [stange, haken], k: 0, pf: 'flat' },
      { p: arm, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Mützenschild aus Messing, Knöpfe, Docht mit Flamme
      P.line(r(kx - 8), r(ky - 3), r(kx - 3), r(ky - 3), 'messing');
      for (let y = sy + 6; y < 100; y += 10) P.set(r(cx - 2), y, 'messing');
      if (!tot && flamme > 0) {
        P.set(r(tx), r(ty - 1), 'kern'); P.set(r(tx), r(ty - 2), 'glut'); P.set(r(tx - 1), r(ty), 'bleich');
        P.glow(tx, ty - 1, 6 * flamme, 0.7 * flamme, 'glutDim', 'k3');
      }
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 3, ey, 'glut');
        P.glow(ex + 1.5, ey, 4 * glanz, 0.7 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 3, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
