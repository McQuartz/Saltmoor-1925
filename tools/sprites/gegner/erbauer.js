// Der Erbauer-Priester (versunkene Stadt, Elite). Er hat die Stadt nicht gebaut, er baut sie
// noch: jede Nacht einen Stein höher, nach Plänen, die keine rechten Winkel kennen. Er steht
// hinter einem Gerüst aus Zollstöcken, die Mitra aus Ziegeln, und solange du ihn nicht siehst,
// wächst sein Bau. Angriff: das Lot fährt herab.
'use strict';
module.exports = {
  id: 'erbauer', biom: 'stadt', zone: 'stadt', w: 128, h: 160, fuss: [64, 155], kopf: [62, 34], rimBis: 152, rang: 'elite',
  varianten: { erbauer: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, lot = 0, fall = 0, glanz = 1, pendel = 0;
    if (p.idle) { pendel = [0, 1, 0, -1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { lot = [2, -6, 26, 10][f]; lean = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 38); glanz = f < 2 ? 0.6 : 0; }
    const cx = 68, ox = lean, sy = 50 + fall;
    const robe = Pg([[cx - 12 + ox, sy], [cx + 12 + ox, sy - 2], [cx + 20, sy + 40], [cx + 24, 146], ...saum(cx + 24, cx - 22, 150, 7, 3, 5), [cx - 22, 146], [cx - 18, sy + 40]], null, { rd: 2 });
    const kx = cx - 2 + ox * 1.2, ky = sy - 8;
    const kopf = E(kx, ky, 6.5, 7, null, { rd: 1.4 });
    // Mitra aus Ziegelreihen, schief
    const mitra = Pg([[kx - 8, ky - 5], [kx - 6, ky - 20], [kx + 1, ky - 30], [kx + 7, ky - 20], [kx + 9, ky - 5]], null, { rd: 1, pf: 'bevel' });
    // Gerüst vor ihm: schräge Latten, nicht rechtwinklig
    const latten = [
      C(24, 152, 30, 70, 1.6, 1.6, 'dunkel', { pf: 'flat' }), C(44, 152, 40, 64, 1.6, 1.6, 'dunkel', { pf: 'flat' }),
      C(20, 120, 48, 112, 1.3, 1.3, 'dunkel', { pf: 'flat' }), C(22, 92, 46, 98, 1.3, 1.3, 'dunkel', { pf: 'flat' }), C(26, 74, 44, 70, 1.3, 1.3, 'dunkel', { pf: 'flat' }),
    ];
    // Arm hält das Lot an der Schnur über das Gerüst
    const hx = cx - 26 + ox, hy = sy + 6;
    const armV = glied([[cx - 10 + ox, sy + 4], [cx - 20 + ox, sy + 2], [hx, hy]], 3, 2.4, null);
    const lx = hx - 4 + pendel, ly = hy + 26 + lot;
    const lotK = Pg([[lx - 3, ly], [lx + 3, ly], [lx, ly + 7]], null, { rd: 0.4, pf: 'bevel' });
    const armH = glied([[cx + 12 + ox, sy + 4], [cx + 18 + ox, sy + 20], [cx + 12 + ox, sy + 30]], 3, 2.4, null);
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: [robe], k: 3 },
      { p: [kopf], k: 2 },
      { p: [mitra], k: 1.5, pf: 'bevel' },
      { p: armV, k: 1 },
      { p: tot ? [] : [lotK], k: 0, pf: 'bevel' },
      { p: latten, k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Ziegelfugen in der Mitra, Schnur des Lots, Maßstriche auf den Latten
      for (let i = 1; i < 5; i++) P.line(r(kx - 7 + i * 0.6), r(ky - 5 - i * 4.5), r(kx + 7 - i * 0.6), r(ky - 5 - i * 4.5), 'k0', true);
      if (!tot) P.line(r(hx), r(hy), r(lx), r(ly), 'r1');
      for (let y = 76; y < 150; y += 6) P.set(r(24 + (152 - y) * 0.073), y, 'r1');
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
