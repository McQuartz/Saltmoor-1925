// Die Fischhändlerin (Hafenviertel). Sie steht seit 1919 jeden Morgen an der Fischhalle, auch wenn
// keiner mehr kauft. Breite Frau mit Kopftuch und Schürze, auf der Hüfte die Kiepe voller Heringe;
// alle Fische in der Kiepe haben die Köpfe nach dir gedreht und die Augen offen. Sie flickt die
// anderen mit Fischhaut. Angriff: sie schlägt mit einem Fisch zu wie mit einem Knüppel.
'use strict';
module.exports = {
  id: 'fischhaendlerin', biom: 'hafen', zone: 'hafen', w: 96, h: 120, fuss: [48, 115], kopf: [40, 30], rimBis: 112,
  varianten: {
    fischhaendlerin_a: { kiepe: 1, tuch: 0 },
    fischhaendlerin_b: { kiepe: 1.25, tuch: 1 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, schlag = 0, fall = 0, glanz = 1, nick = 0;
    if (p.idle) { nick = [0, 0, 1, 1][f]; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; schlag = [6, 12, -8, -2][f]; glanz = [1, 1.2, 1.5, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50, ox = lean, sy = 46 + fall;
    const rock = Pg([[cx - 13 + ox, sy], [cx + 11 + ox, sy - 1], [cx + 16, sy + 34], [cx + 20, 104], ...saum(cx + 20, cx - 20, 112, 5, 2, 3), [cx - 20, 104], [cx - 16, sy + 34]], null, { rd: 1.6 });
    const schuerze = Pg([[cx - 12 + ox, sy + 18], [cx + 2 + ox, sy + 18], [cx + 4, 106], [cx - 14, 106]], null, { rd: 0.8, pf: 'flat', tone: 0.12 });
    const kx = cx - 4 + ox * 1.2, ky = sy - 9 + nick;
    const kopf = E(kx, ky, 6, 7, null);
    const tuch = Pg([[kx - 8, ky + 2], [kx - 7, ky - 6], [kx + 2, ky - 9], [kx + 9, ky - 3], [kx + 10 + v.tuch * 4, ky + 8 + v.tuch * 4], [kx + 4, ky + 4]], 'dunkel', { rd: 1.2 });
    // Kiepe auf der Hüfte, hinten
    const kz = v.kiepe, qx = cx + 18 + ox, qy = sy + 26;
    const kiepe = Pg([[qx - 10 * kz, qy - 8 * kz], [qx + 10 * kz, qy - 9 * kz], [qx + 7 * kz, qy + 12 * kz], [qx - 7 * kz, qy + 12 * kz]], null, { rd: 1, pf: 'bevel' });
    const fische = [0, 1, 2, 3].map(i => E(qx - 7 * kz + i * 4.5 * kz, qy - 9 * kz - (i % 2) * 2, 2.2, 3.4, null, { pf: 'bevel' }));
    const armH = glied([[cx + 8 + ox, sy + 3], [cx + 16 + ox, sy + 14], [qx - 4, qy - 4]], 3, 2.4, null);
    // vorn: der Fisch als Knüppel
    const hx = cx - 20 + ox + r(schlag * 0.3), hy = sy + 26 - schlag;
    const armV = glied([[cx - 9 + ox, sy + 3], [cx - 17 + ox, sy + 14], [hx, hy]], 3, 2.4, null);
    const fy = r(schlag / 3), fisch = Pg([[hx - 2, hy + 1], [hx - 4, hy - 6 + fy], [hx - 9, hy - 18 + fy], [hx - 6, hy - 26 + fy], [hx - 1, hy - 19 + fy], [hx + 3, hy - 7 + fy], [hx + 2, hy + 1]], null, { rd: 1.2 });
    const flosse = Pg([[hx - 2, hy + 1], [hx - 6, hy + 6], [hx + 5, hy + 6], [hx + 2, hy + 1]], null, { pf: 'flat' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : fische, k: 0, pf: 'bevel' },
      { p: [kiepe], k: 0.5, pf: 'bevel' },
      { p: armH, k: 1 },
      { p: [rock], k: 3 },
      { p: [schuerze], k: 0, pf: 'flat' },
      { p: [kopf], k: 1 },
      { p: [tuch], k: 1 },
      { p: tot ? [] : [fisch, flosse], k: 1 },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Flechtwerk der Kiepe
      for (let y = r(qy - 4 * kz); y < qy + 11 * kz; y += 3) P.line(r(qx - 7 * kz), y, r(qx + 7 * kz), y, 'k0', true);
      // Fischaugen in der Kiepe: alle sehen her
      if (!tot && glanz > 0) fische.forEach((e, i) => P.set(r(e.x - 1), r(e.y - 1), i === 1 ? 'kern' : 'glutDim'));
      if (!tot) { P.set(r(hx - 6), r(hy - 21 + fy), 'glutDim'); for (let k = 0; k < 4; k++) P.auf(r(hx - 3 - k), r(hy - 4 - k * 3 + fy), 'k3'); }
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey, 'kern');
        P.glow(ex + 2, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
