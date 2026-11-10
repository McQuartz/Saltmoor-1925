// Der Fährmann (Pforte, Vorraum-Elite). Vor der Pforte liegt ein Wasser, das es oben nicht gibt,
// und wer hinüber will, muss mit ihm fahren. Er fragt nicht nach Geld. Er fragt nach dem, was du
// am Körper trägst. Ein sehr langer, dünner Mann im Bug eines Kahns, der Kahn ist mit ihm
// verwachsen; am Bug die Laterne mit dem blassen Licht der Pforte. Angriff: das Stakruder stößt zu.
'use strict';
module.exports = {
  id: 'faehrmann', biom: 'pforte', zone: 'pforte', w: 128, h: 160, fuss: [64, 155], kopf: [70, 30], rimBis: 152, rang: 'elite',
  varianten: { faehrmann: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let stak = 0, lean = 0, fall = 0, glanz = 1, wiege = 0;
    if (p.idle) { wiege = [0, 1, 1, 0][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { stak = [-4, -10, 20, 8][f]; lean = [2, 4, -8, -3][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 36); glanz = f < 2 ? 0.6 : 0; }
    const cx = 72, ox = lean, sy = 40 + fall;
    // Kahn unten: flach, Bug nach links hochgezogen
    const kahn = Pg([[4, 124 + wiege], [16, 136], [112, 138], [124, 128], [120, 146], [24, 148], [8, 138]], 'dunkel', { rd: 2 });
    const wasser = Pg([[0, 148], [128, 148], [128, 156], [0, 156]], 'dunkel', { rd: 0.6, pf: 'flat' });
    // Körper wächst aus dem Kahn
    const leib = Pg([[cx - 8 + ox, sy + 4], [cx + 8 + ox, sy + 2], [cx + 12, sy + 40], [cx + 16, 138], [cx - 14, 138], [cx - 10, sy + 40]], null, { rd: 2 });
    const kx = cx - 2 + ox * 1.2, ky = sy - 6;
    const kopf = Pg([[kx - 5, ky - 8], [kx + 4, ky - 10], [kx + 7, ky], [kx + 3, ky + 10], [kx - 4, ky + 9], [kx - 7, ky]], null, { rd: 1.6 });
    const krempe = Pg([[kx - 14, ky - 6], [kx - 4, ky - 12], [kx + 8, ky - 12], [kx + 14, ky - 6], [kx + 4, ky - 4], [kx - 6, ky - 4]], null, { rd: 1.2, pf: 'bevel' });
    // Stakruder diagonal, Hand oben
    const hx = cx - 14 + ox, hy = sy + 14 + stak * 0.3;
    const sx0 = hx + 10 - stak * 0.3, sy0 = hy - 22, sx1 = hx - 36 - stak, sy1 = hy + 104 - stak * 0.2;
    const ruder = C(sx0, sy0, sx1, Math.min(sy1, 152), 1.6, 1.6, 'dunkel', { pf: 'bevel' });
    const armV = glied([[cx - 6 + ox, sy + 6], [cx - 14 + ox, sy + 6], [hx, hy]], 2.6, 2.2, null);
    const armH = glied([[cx + 6 + ox, sy + 6], [cx + 4 + ox, sy + 24], [hx - 4 + (sx1 - hx) * 0.2, hy + (sy1 - hy) * 0.2]], 2.6, 2.2, null);
    const pfahl = C(10, 124, 10, 102, 1.2, 1.2, 'dunkel', { pf: 'flat' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [wasser], k: 0, pf: 'flat', noRim: true },
      { p: armH, k: 1 },
      { p: [leib], k: 3 },
      { p: [kopf], k: 2 },
      { p: [krempe], k: 1.5, pf: 'bevel' },
      { p: tot ? [] : [ruder], k: 0, pf: 'bevel' },
      { p: armV, k: 1 },
      { p: [kahn], k: 2 },
      { p: [pfahl], k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Laterne am Bug, Spiegelung im Wasser (seitenverkehrt), Planken
      P.line(10, 102, 14, 104, 'r1');
      if (glanz > 0) { P.set(14, 106, 'kern'); P.set(14, 107, 'glut'); P.glow(14, 106, 7 * glanz, 0.7 * glanz, 'glutDim', 'k3'); P.set(14, 152, 'glutDim'); P.set(14, 154, 'glut'); }
      for (let x = 24; x < 116; x += 10) P.line(x, 140 + wiege * 0, x + 6, 141, 'k3', true);
      for (let x = 20; x < 124; x += 9) P.set(x, 150, 'r1');
      if (glanz > 0) {
        const ex = r(kx - 3), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
