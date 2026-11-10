// Kurhaus, dritter Wächter: Der Kurdirektor. Er hat das Kurhaus 1899 eröffnet und hält jedes Jahr die
// Rede zum Saisonende, nur dass die Saison nicht mehr endet. Ein dicker Herr im Gehrock, der Bauch ein
// Kurbrunnen mit Messinghahn, aus dem warmes Wasser läuft. In der Hand die Kurtaxliste: wer bleiben will,
// zahlt mehr. Angriff: er schlägt mit dem Spazierstock.
'use strict';
module.exports = {
  id: 'kurdirektor', biom: 'kurhaus', zone: 'kurhaus', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [70, 36], rimBis: 172,
  varianten: { kurdirektor: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let stock = 0.2, X = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { stock = [-0.6, -1.2, 1.2, 0.6][f]; X = [2, 4, -8, -3][f]; glanz = [1, 1.3, 1.7, 1.1][f]; }
    if (p.treffer) { X = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 40); glanz = f < 2 ? 0.6 : 0; }
    const cx = 82 + X, sy = 58 + fall;
    const bauch = E(cx, sy + 50 + atem, 38, 36, null, { rd: 2 });
    const rock = Pg([[cx - 28, sy + 6], [cx - 14, sy - 6], [cx + 16, sy - 6], [cx + 30, sy + 6], [cx + 40, sy + 60], [cx + 36, 150], [cx + 20, 152], [cx + 24, sy + 70], [cx - 24, sy + 70], [cx - 20, 152], [cx - 36, 150], [cx - 40, sy + 60]], null, { rd: 2 });
    const beine = [C(cx - 14, sy + 84, cx - 16, 168, 7, 6, 'dunkel'), C(cx + 14, sy + 84, cx + 16, 168, 7, 6, 'dunkel')];
    const schuhe = [E(cx - 20, 171, 10, 4, 'dunkel'), E(cx + 18, 171, 9, 4, 'dunkel')];
    const kx = cx - 4, ky = sy - 14;
    const kopf = E(kx, ky, 11, 11, null, { rd: 1.6 });
    const zylinder = Pg([[kx - 10, ky - 8], [kx - 9, ky - 28], [kx + 9, ky - 28], [kx + 10, ky - 8], [kx + 15, ky - 6], [kx - 15, ky - 6]], null, { rd: 0.8, pf: 'bevel' });
    // Brunnenhahn im Bauch
    const hahn = [C(cx - 6, sy + 50, cx - 20, sy + 52, 2.6, 2, 'dunkel', { pf: 'bevel' }), C(cx - 20, sy + 52, cx - 22, sy + 58, 2, 1.6, 'dunkel', { pf: 'bevel' })];
    // Spazierstock in der vorderen Hand
    const hx = cx - 40, hy = sy + 30;
    const L = 56, tx = hx - Math.sin(stock) * L, ty = hy + Math.cos(stock) * L;
    const stab = C(hx, hy - 4, tx, Math.min(ty, 170), 1.6, 1.4, 'dunkel', { pf: 'flat' });
    const knauf = E(hx, hy - 6, 3, 3, 'dunkel', { pf: 'dome' });
    const armV = glied([[cx - 26, sy + 6], [cx - 40, sy + 18], [hx, hy]], 5, 4, null);
    // Kurtaxliste in der hinteren Hand
    const armH = glied([[cx + 26, sy + 6], [cx + 42, sy + 22], [cx + 46, sy + 40]], 5, 4, null);
    const liste = Pg([[cx + 40, sy + 36], [cx + 54, sy + 34], [cx + 56, sy + 70], [cx + 42, sy + 72]], null, { rd: 0.6, pf: 'flat', tone: 0.2 });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine, k: 1 },
      { p: schuhe, k: 0 },
      { p: armH, k: 1 },
      { p: tot ? [] : [liste], k: 1, pf: 'flat' },
      { p: [rock], k: 3 },
      { p: [bauch], k: 2 },
      { p: hahn, k: 0, pf: 'bevel' },
      { p: [kopf], k: 2 },
      { p: [zylinder], k: 1.5, pf: 'bevel' },
      { p: tot ? [] : [stab, knauf], k: 0, pf: 'flat' },
      { p: armV, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Wasser aus dem Hahn, Messing, Uhrkette, Zeilen auf der Liste
      if (!tot) for (let y = sy + 60; y < 168; y += 3) P.set(r(cx - 22 + ((y / 3) % 2)), y, 'wasser');
      P.set(r(cx - 20), r(sy + 52), 'messing'); P.set(r(cx - 6), r(sy + 50), 'messing');
      P.line(r(cx + 2), r(sy + 22), r(cx + 18), r(sy + 28), 'messing');
      for (let y = sy + 40; y < sy + 68; y += 4) P.line(r(cx + 44), y, r(cx + 52), y, 'k1', true);
      P.line(r(kx - 8), r(ky + 6), r(kx + 2), r(ky + 7), 'k0', true);
      if (glanz > 0) {
        const ex = r(kx - 6), ey = r(ky - 1);
        P.set(ex, ey, 'kern'); P.set(ex + 6, ey, 'glut');
        P.glow(ex + 3, ey, 7 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 6, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
