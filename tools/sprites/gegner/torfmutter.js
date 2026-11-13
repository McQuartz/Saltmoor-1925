// Moorwald, dritter Wächter: Die Torfmutter. Die Torfstecher haben ihr jedes Jahr die ersten Soden
// gegeben, aufgeschichtet am Rand des Stichs. Sie hat sich daraus gebaut: eine riesige, gebückte Frau
// aus gestapelten Torfsoden, in der Schürze trägt sie, was das Moor bewahrt hat. Was sie trifft, hält
// nicht an ihr, der Torf schluckt es. Angriff: sie legt die schwere Hand auf dich.
'use strict';
module.exports = {
  id: 'torfmutter', biom: 'moor', zone: 'moor', rang: 'waechter', w: 160, h: 180, fuss: [84, 176], kopf: [66, 40], rimBis: 172,
  varianten: { torfmutter: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let hand = 0, X = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { hand = [4, 10, 30, 12][f]; X = [2, 4, -8, -3][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { X = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 40); glanz = f < 2 ? 0.6 : 0; }
    const cx = 88 + X, sy = 56 + fall;
    const leib = Pg([[cx - 34, sy + 10], [cx - 20, sy - 8], [cx + 6, sy - 16], [cx + 30, sy - 6], [cx + 40, sy + 20], [cx + 44, 166], ...saum(cx + 44, cx - 40, 172, 9, 3, 4), [cx - 40, 166], [cx - 42, sy + 40]], null, { rd: 2.6 });
    const schuerze = Pg([[cx - 30, sy + 50], [cx + 20, sy + 46], [cx + 26, sy + 92], [cx - 34, sy + 96]], null, { rd: 3, pf: 'bevel', tone: 0.12 });
    const kx = cx - 16, ky = sy - 20 + atem;
    const kopf = Pg([[kx - 12, ky], [kx - 10, ky - 12], [kx + 2, ky - 18], [kx + 14, ky - 12], [kx + 14, ky + 4], [kx + 2, ky + 12], [kx - 8, ky + 10]], null, { rd: 2 });
    const tuch = Pg([[kx - 14, ky - 2], [kx - 10, ky - 16], [kx + 4, ky - 22], [kx + 18, ky - 14], [kx + 22, ky + 6], [kx + 12, ky - 4], [kx - 6, ky - 8]], null, { rd: 1.6 });
    const hx = cx - 44 - hand, hy = sy + 40 - hand * 0.4;
    const armV = glied([[cx - 30, sy + 4], [cx - 42 - hand * 0.4, sy + 22], [hx, hy]], 7, 6, null);
    const handP = Pg([[hx - 8, hy - 6], [hx + 4, hy - 8], [hx + 6, hy + 4], [hx - 2, hy + 10], [hx - 12, hy + 6]], null, { rd: 2 });
    const armH = glied([[cx + 32, sy + 4], [cx + 42, sy + 30], [cx + 26, sy + 52]], 7, 6, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: [leib], k: 3 },
      { p: [schuerze], k: 2, pf: 'bevel' },
      { p: [tuch], k: 2 },
      { p: [kopf], k: 1.5 },
      { p: armV, k: 1 },
      { p: [handP], k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Fugen zwischen den Soden: Ziegelverband
      for (let y = sy; y < 166; y += 8) { P.line(r(cx - 36), y, r(cx + 40), y, 'k0', true); for (let x = cx - 34 + ((y / 8) % 2) * 6; x < cx + 40; x += 12) P.line(r(x), y, r(x), y + 7, 'k0', true); }
      // was das Moor bewahrt: Dinge in der Schürze
      if (!tot) { P.set(r(cx - 14), r(sy + 60), 'r1'); P.set(r(cx - 4), r(sy + 66), 'r2'); P.set(r(cx + 8), r(sy + 58), 'r1'); P.line(r(cx - 20), r(sy + 72), r(cx - 10), r(sy + 70), 'k3'); }
      if (glanz > 0) {
        const ex = r(kx - 6), ey = r(ky - 2);
        P.set(ex, ey, 'kern'); P.set(ex + 7, ey, 'glut');
        P.glow(ex + 3.5, ey, 8 * glanz, 0.9 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 7, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
