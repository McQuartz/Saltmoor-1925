// Der Säulensteher (namenlose Stadt). Ein Mönch aus einem Wüstenkloster, der hinunterkam, weil er
// gehört hatte, dass hier die höchsten Säulen stehen. Er hat sich auf den Stumpf einer gestellt und
// ist nie wieder abgestiegen; die Säule ist mit ihm gewachsen und er mit ihr, die Beine sind Stein
// geworden. Er hockt oben, ausgemergelt, und hält schützend die Hände über die anderen. Angriff:
// er schleudert einen Brocken von seinem Kapitell.
'use strict';
module.exports = {
  id: 'saeulensteher', biom: 'stadt', zone: 'stadt', w: 96, h: 120, fuss: [48, 115], kopf: [46, 16], rimBis: 112,
  varianten: {
    saeulensteher_a: { hoch: 1, bart: 1 },
    saeulensteher_b: { hoch: 1.12, bart: 0 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, wurf = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [1, 2, -5, -2][f]; wurf = [6, 12, -6, -2][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 2); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50, ox = lean, H = v.hoch;
    const top = 114 - 64 * H;
    // Säule: Trommeln mit Fugen, oben ein Kapitell
    const saeule = Pg([[cx - 9, top + 6], [cx + 9, top + 6], [cx + 11, 112], [cx - 11, 112]], null, { rd: 0.6, pf: 'bevel' });
    const basis = Pg([[cx - 16, 108], [cx + 16, 108], [cx + 17, 114], [cx - 17, 114]], null, { rd: 0.4, pf: 'flat' });
    const kapitell = Pg([[cx - 16, top], [cx + 16, top - 1], [cx + 12, top + 7], [cx - 12, top + 7]], null, { rd: 0.6, pf: 'bevel' });
    // der Mann hockt oben
    const sy = top - 16 + fall + atem;
    const leib = Pg([[cx - 10 + ox, sy + 16], [cx - 8 + ox, sy], [cx + 2 + ox, sy - 4], [cx + 10 + ox, sy + 2], [cx + 12 + ox, sy + 16]], null, { rd: 2 });
    const knie = [E(cx - 8 + ox, sy + 12, 5, 4, null), E(cx + 6 + ox, sy + 13, 5, 4, null)];
    const kx = cx - 6 + ox * 1.3, ky = sy - 8;
    const kopf = Pg([[kx - 5, ky - 5], [kx + 3, ky - 7], [kx + 7, ky - 1], [kx + 4, ky + 6], [kx - 4, ky + 6]], 'haut', { rd: 1.6 });
    const bart = v.bart ? [Pg([[kx - 5, ky + 4], [kx + 3, ky + 5], [kx - 1, ky + 18], [kx - 4, ky + 14]], 'dunkel', { rd: 0.8 })] : [];
    // Arme: dürr, einer zum Wurf erhoben
    const hx = cx - 18 + ox + r(wurf / 3), hy = sy - wurf;
    const armV = glied([[cx - 6 + ox, sy + 2], [cx - 16 + ox, sy + 4], [hx, hy]], 1.8, 1.4, 'haut');
    const brocken = Pg([[hx - 3, hy - 4], [hx + 3, hy - 5], [hx + 4, hy + 1], [hx - 2, hy + 2]], null, { rd: 0.4, pf: 'bevel' });
    const armH = glied([[cx + 6 + ox, sy + 2], [cx + 16 + ox, sy + 6], [cx + 22 + ox, sy - 2]], 1.8, 1.4, 'haut');
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [saeule, basis], k: 0.5, pf: 'bevel' },
      { p: [kapitell], k: 0.5, pf: 'bevel' },
      { p: armH, k: 1 },
      { p: [leib, ...knie], k: 2 },
      { p: [kopf, ...bart], k: 1 },
      { p: armV, k: 1 },
      { p: tot ? [] : [brocken], k: 0, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Trommelfugen, Kanneluren, das Reliefband der Erbauer
      for (let y = top + 16; y < 108; y += 12) P.line(cx - 10, y, cx + 10, y, 'k0', true);
      for (let x = cx - 6; x <= cx + 6; x += 4) P.line(x, top + 8, x, 106, 'k1', true);
      P.line(cx - 14, top + 2, cx + 14, top + 1, 'k3', true);
      // wo die Beine in den Stein übergehen: Risse
      P.auf(cx - 8 + ox, sy + 16, 'k0'); P.auf(cx + 7 + ox, sy + 17, 'k0');
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky - 1);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey - 1, 'kern');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey - 1]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
