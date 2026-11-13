// Der Speisewagenkoch (Nachtzug). Er kocht seit der Abfahrt das Menü für die erste Klasse, und keiner
// isst. Also isst er. Ein runder Mann mit hoher Mütze, die Schürze voller Flecken, in der einen Hand das
// Hackbeil, in der anderen den Topf, aus dem es raucht. Mit jedem Zug wird er stärker.
// Angriff: das Hackbeil fährt herunter.
'use strict';
module.exports = {
  id: 'speisewagenkoch', biom: 'nachtzug', zone: 'nachtzug', w: 96, h: 120, fuss: [48, 115], kopf: [46, 24], rimBis: 112,
  varianten: { speisewagenkoch_a: { bauch: 1, muetze: 1 }, speisewagenkoch_b: { bauch: 1.15, muetze: 1.35 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let hack = 0, lean = 0, fall = 0, glanz = 1, dampf = 0;
    if (p.idle) { dampf = f; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { hack = [-6, -12, 10, 4][f]; lean = [1, 2, -4, -1][f]; glanz = [1, 1.3, 1.7, 1.1][f]; dampf = f; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); glanz = f < 2 ? 0.6 : 0; }
    const cx = 48 + lean, sy = 40 + fall, b = v.bauch;
    const bauch = E(cx, sy + 34, 18 * b, 22, null, { rd: 2 });
    const oben = Pg([[cx - 12, sy + 2], [cx - 6, sy - 4], [cx + 8, sy - 4], [cx + 14, sy + 4], [cx + 14, sy + 20], [cx - 14, sy + 20]], null, { rd: 2 });
    const schuerze = Pg([[cx - 12, sy + 22], [cx + 8, sy + 20], [cx + 10, sy + 64], [cx - 14, sy + 64]], null, { rd: 1.6, pf: 'flat', tone: 0.12 });
    const beine = [C(cx - 7, sy + 54, cx - 8, 113, 3.4, 3, 'dunkel'), C(cx + 7, sy + 54, cx + 8, 113, 3.4, 3, 'dunkel')];
    const kx = cx - 2, ky = sy - 10;
    const kopf = E(kx, ky, 6.5, 6.5, null, { rd: 1.3 });
    const mH = 14 * v.muetze;
    const muetze = Pg([[kx - 6, ky - 4], [kx - 8, ky - 4 - mH * 0.7], [kx - 4, ky - 4 - mH], [kx + 4, ky - 4 - mH], [kx + 8, ky - 4 - mH * 0.7], [kx + 6, ky - 4]], null, { rd: 2, pf: 'dome', tone: 0.14 });
    const hx = cx - 20, hy = sy + 14 + hack;
    const armV = glied([[cx - 10, sy + 4], [cx - 18, sy + 2 + hack * 0.4], [hx, hy]], 3, 2.6, null);
    const beil = Pg([[hx - 2, hy - 2], [hx - 12, hy - 4], [hx - 13, hy + 4], [hx - 2, hy + 3]], 'dunkel', { rd: 0.4, pf: 'bevel' });
    const armH = glied([[cx + 10, sy + 4], [cx + 18, sy + 14], [cx + 22, sy + 22]], 3, 2.6, null);
    const topf = Pg([[cx + 16, sy + 20], [cx + 30, sy + 20], [cx + 29, sy + 32], [cx + 17, sy + 32]], 'dunkel', { rd: 1.2, pf: 'bevel' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine, k: 1 },
      { p: armH, k: 1 },
      { p: [bauch], k: 3 },
      { p: [oben], k: 3 },
      { p: [schuerze], k: 1, pf: 'flat' },
      { p: [topf], k: 0, pf: 'bevel' },
      { p: [kopf], k: 2 },
      { p: [muetze], k: 1.5, pf: 'dome' },
      { p: tot ? [] : [beil], k: 0, pf: 'bevel' },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      for (const [dx, dy] of [[-6, 34], [2, 44], [-2, 54]]) P.set(r(cx + dx), r(sy + dy), 'k0');
      if (!tot) for (let i = 0; i < 3; i++) P.set(r(cx + 22 + ((i + dampf) % 3) * 2), r(sy + 16 - i * 4), 'r1');
      P.set(r(cx + 24), r(sy + 22), 'messing');
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
