// Der Eisfischer (Glasmeer). Er sitzt auf einem Klappschemel über einem Loch im Glas und angelt.
// Was anbeißt, wird an ihm größer: jede Runde, die er sitzen bleibt, wächst er ein Stück.
// Ein runder Rücken unter Pelzmütze, die Rute lang nach vorn, darunter das schwarze Loch mit
// grünem Schimmer. Angriff: er reißt die Rute hoch, die Schnur schlägt aus.
'use strict';
module.exports = {
  id: 'eisfischer', biom: 'glasmeer', zone: 'glasmeer', w: 96, h: 120, fuss: [48, 115], kopf: [52, 52], rimBis: 112,
  varianten: {
    eisfischer_a: { ruecken: 1, rute: 1 },
    eisfischer_b: { ruecken: 1.15, rute: 1.2 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let hub = 0, lean = 0, fall = 0, glanz = 1, wipp = 0;
    if (p.idle) { wipp = [0, 1, 2, 1][f]; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { hub = [2, 5, 14, 6][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 20); lean = r(p.q * 6); glanz = f < 2 ? 0.6 : 0; }
    const z = v.ruecken, cx = 58 + lean, sy = 66 + fall;
    // Loch im Glas vorn links
    const loch = E(26, 110, 14, 3.5, 'dunkel', { pf: 'flat' });
    const schemel = [C(cx - 6, 112, cx + 6, 98, 1.2, 1.2, null, { pf: 'flat' }), C(cx + 6, 112, cx - 6, 98, 1.2, 1.2, null, { pf: 'flat' })];
    const ruecken = Pg([[cx - 14 * z, sy + 30], [cx - 16 * z, sy + 10], [cx - 8, sy - 6 * z], [cx + 6, sy - 8 * z], [cx + 16 * z, sy + 4], [cx + 16 * z, sy + 26], ...saum(cx + 14, cx - 14, sy + 34, 5, 2, 3)], null, { rd: 2.4 });
    const kx = cx - 10, ky = sy - 6 * z;
    const kopf = E(kx, ky, 7, 6.5, null, { rd: 1.5 });
    const muetze = Pg([[kx - 8, ky - 2], [kx - 6, ky - 9], [kx + 3, ky - 11], [kx + 9, ky - 5], [kx + 8, ky]], null, { rd: 2 });
    const beine = [glied([[cx - 6, sy + 30], [cx - 16, sy + 34], [cx - 16, 113]], 3.2, 2.6, null), glied([[cx + 4, sy + 30], [cx - 6, sy + 36], [cx - 8, 113]], 3.2, 2.6, null)];
    // Rute: von der Hand nach vorn links oben
    const hx = cx - 18, hy = sy + 14;
    const L = 40 * v.rute, a = 0.55 + hub * 0.05 + wipp * 0.01;
    const tx = hx - Math.cos(a) * L, ty = hy - Math.sin(a) * L;
    const rute = C(hx, hy, tx, ty, 1.3, 0.8, null, { pf: 'flat' });
    const arm = glied([[cx - 6, sy + 2], [cx - 14, sy + 12], [hx, hy]], 3.4, 2.8, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [loch], k: 0, pf: 'flat', noRim: true },
      { p: schemel, k: 0, pf: 'flat', noRim: true },
      { p: beine.flat(), k: 1 },
      { p: [ruecken], k: 3 },
      { p: [kopf], k: 2 },
      { p: [muetze], k: 2 },
      { p: tot ? [] : [rute], k: 0, pf: 'flat' },
      { p: arm, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Schnur von der Rutenspitze ins Loch, Schimmer im Loch
      if (!tot) {
        const ex2 = hub > 8 ? tx - 10 : 26, ey2 = hub > 8 ? ty + 8 : 109;
        P.line(r(tx), r(ty), r(ex2), r(ey2), 'r1');
      }
      for (let x = -10; x <= 10; x += 4) P.set(r(26 + x), 110, 'nordlicht');
      P.glow(26, 110, 8, 0.5, 'glutDim', 'k3');
      for (let x = -6; x <= 6; x += 3) P.auf(r(kx + x), r(ky - 9 + Math.abs(x) * 0.3), 'r1');
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 3, ey, 'glut');
        P.glow(ex + 1.5, ey, 4 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 3, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
