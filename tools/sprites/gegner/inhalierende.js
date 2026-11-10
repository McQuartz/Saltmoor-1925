// Die Inhalierende (Kurhaus). Eine Kurpatientin vom Inhalatorium, die nie aufgehört hat zu atmen,
// was aus dem Kessel kommt. Sie sitzt nicht mehr, sie steht gebeugt, die Gummimaske vor dem Gesicht,
// der Schlauch läuft zum Kupferkessel, den sie auf dem Rücken trägt. Aus dem Ventil oben steigt
// Dampf. Sie bläst den anderen davon in die Wunden. Angriff: ein heißer Stoß aus der Maske.
'use strict';
module.exports = {
  id: 'inhalierende', biom: 'kurhaus', zone: 'kurhaus', w: 96, h: 120, fuss: [48, 115], kopf: [36, 34], rimBis: 112,
  varianten: {
    inhalierende_a: { kessel: 1, schlauch: 0 },
    inhalierende_b: { kessel: 1.2, schlauch: 1 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, stoss = 0, fall = 0, glanz = 1, dampf = 0;
    if (p.idle) { dampf = f; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; stoss = [0, 1, 3, 1][f]; dampf = f; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 30); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 52, ox = lean, sy = 50 + fall;
    // Bademantel, gebeugt
    const leib = Pg([[cx - 16 + ox, sy + 2], [cx - 4 + ox, sy - 6], [cx + 12 + ox, sy - 2], [cx + 14, sy + 30], [cx + 16, 104], ...saum(cx + 16, cx - 16, 112, 4, 2, 8), [cx - 16, 104], [cx - 14, sy + 30]], null, { rd: 1.6 });
    const kz = v.kessel, qx = cx + 14 + ox, qy = sy - 2;
    const kessel = Pg([[qx - 9 * kz, qy - 6 * kz], [qx + 9 * kz, qy - 6 * kz], [qx + 11 * kz, qy + 10 * kz], [qx + 6 * kz, qy + 18 * kz], [qx - 6 * kz, qy + 18 * kz], [qx - 11 * kz, qy + 10 * kz]], null, { rd: 2, pf: 'bevel' });
    const ventil = C(qx, qy - 6 * kz, qx, qy - 12 * kz, 1.5, 1.2, null, { pf: 'flat' });
    // Kopf weit vorn, Maske mit Rüssel
    const kx = cx - 14 + ox * 1.3, ky = sy - 6;
    const kopf = E(kx + 3, ky - 1, 6, 6.5, null);
    const maske = Pg([[kx - 4, ky - 4], [kx + 2, ky - 5], [kx + 3, ky + 5], [kx - 3, ky + 6], [kx - 7 - stoss, ky + 2]], null, { rd: 1.2, pf: 'bevel', tone: 0.12 });
    const sl = v.schlauch;
    const schlauch = glied([[kx - 2, ky + 5], [kx + 2, ky + 18 + sl * 8], [cx + 4, sy + 24 + sl * 6], [qx - 6, qy + 12]], 1.4, 1.4, 'dunkel', { noRim: true });
    const armV = glied([[cx - 10 + ox, sy + 4], [cx - 18 + ox, sy + 18], [cx - 16 + ox, sy + 30]], 2.8, 2.2, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: [kessel, ventil], k: 1, pf: 'bevel' },
      { p: [leib], k: 3 },
      { p: schlauch, k: 0, noRim: true },
      { p: [kopf], k: 1 },
      { p: [maske], k: 0.5, pf: 'bevel' },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Kupfer: Nieten, Manometer
      for (let i = -1; i <= 1; i++) P.auf(r(qx + i * 6 * kz), r(qy + 2), 'messing');
      P.auf(r(qx), r(qy + 8 * kz), 'messing'); P.auf(r(qx + 1), r(qy + 8 * kz), 'messing');
      // Dampf aus dem Ventil, in Stufen
      if (!tot) for (let k = 0; k < 4; k++) { const y = r(qy - 14 * kz - k * 4 - (dampf % 2) * 2), x = r(qx + Math.sin(k + dampf) * 2); P.set(x, y, k < 2 ? 'r1' : 'k3'); }
      if (p.angriff && f === 2) [[-10, 0], [-13, -2], [-12, 3], [-16, 1]].forEach(([dx, dy]) => P.set(r(kx + dx), r(ky + 2 + dy), 'wasser'));
      // Augen hinter den Maskengläsern
      if (glanz > 0) {
        const ex = r(kx - 2), ey = r(ky - 2);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey - 1, 'kern');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey - 1]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
