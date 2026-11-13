// Der Antennenmann (Funkstation am Pol, Elite). Der zweite Funker, der 1912 auf den Mast stieg, um die
// Antenne zu verlängern, damit das Signal deutlicher wird. Er ist selbst die Verlängerung geworden: Aus
// seinem Rücken wächst der Mast, Drähte spannen sich zu den Händen, und er kündigt an, was das Signal
// gleich sagt. Je nach Frequenz trifft ihn anderes. Angriff: ein Funke springt über.
'use strict';
module.exports = {
  id: 'antennenmann', biom: 'funkstation', zone: 'funkstation', w: 128, h: 160, fuss: [64, 155], kopf: [56, 60], rimBis: 152, rang: 'elite',
  varianten: { antennenmann: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let funk = 0, lean = 0, fall = 0, glanz = 1, wipp = 0;
    if (p.idle) { wipp = [0, 1, 0, -1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { funk = [0, 1, 3, 1][f]; lean = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.8, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 36); glanz = f < 2 ? 0.6 : 0; }
    const cx = 62 + lean, sy = 70 + fall;
    const mantel = Pg([[cx - 14, sy + 2], [cx - 6, sy - 6], [cx + 10, sy - 6], [cx + 16, sy + 4], [cx + 20, sy + 40], [cx + 22, 146], ...saum(cx + 22, cx - 20, 150, 6, 2, 4), [cx - 20, 146], [cx - 18, sy + 40]], null, { rd: 2.2 });
    const kx = cx - 4, ky = sy - 14;
    const kopf = E(kx, ky, 7, 7.5, null, { rd: 1.4 });
    const muetze = Pg([[kx - 8, ky - 2], [kx - 6, ky - 10], [kx + 6, ky - 10], [kx + 9, ky - 2], [kx + 10, ky + 6], [kx - 9, ky + 6]], null, { rd: 1.6 });
    // Mast aus dem Rücken bis oben, mit Querstäben
    const mx = cx + 14 + wipp * 0.3, my = 8;
    const mast = C(cx + 10, sy + 10, mx, my, 2.2, 1.2, 'dunkel', { pf: 'bevel' });
    const quer = [0.25, 0.5, 0.75].map((t, i) => { const x = cx + 10 + (mx - cx - 10) * t, y = sy + 10 + (my - sy - 10) * t, w = 14 - i * 3; return C(x - w, y + 2, x + w, y - 2, 1, 1, 'dunkel', { pf: 'flat' }); });
    const hx = cx - 24, hy = sy + 22;
    const arme = [glied([[cx - 10, sy + 4], [cx - 20, sy + 14], [hx, hy]], 2.8, 2.4, null), glied([[cx + 12, sy + 4], [cx + 22, sy + 18], [cx + 24, sy + 34]], 2.8, 2.4, null)];
    const isolator = [E(hx, hy, 3, 3, 'dunkel', { pf: 'dome' })];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : [mast, ...quer], k: 0, pf: 'bevel' },
      { p: arme[1], k: 1 },
      { p: [mantel], k: 3 },
      { p: [kopf], k: 2 },
      { p: [muetze], k: 2 },
      { p: arme[0], k: 1 },
      { p: isolator, k: 0, pf: 'dome' },
    ];
    const augen = [];
    const details = P => {
      // Drähte vom Mast zu den Händen, Kupferspulen, Funke
      if (!tot) { P.line(r(mx), r(my + 4), r(hx), r(hy), 'kupfer'); P.line(r(mx), r(my + 4), r(cx + 24), r(sy + 34), 'kupfer'); }
      for (let y = sy + 10; y < sy + 40; y += 6) P.set(r(cx + 4), y, 'kupfer');
      if (funk > 0) { let x = hx, y = hy; for (let i = 0; i < 5 * funk; i++) { const nx = x - 3, ny = y + ((i % 2) ? -3 : 3); P.line(r(x), r(y), r(nx), r(ny), 'kern'); x = nx; y = ny; } }
      if (glanz > 0) {
        P.set(r(mx), r(my), 'glut'); P.glow(mx, my, 4 * glanz, 0.6 * glanz, 'glutDim', 'k3');
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'glut');
        P.glow(ex + 2.5, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 5, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
