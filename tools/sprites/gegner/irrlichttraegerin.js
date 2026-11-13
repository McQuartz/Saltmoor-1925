// Die Irrlichtträgerin (Moorwald, Elite). Die Frau, die man früher die Lichtermuhme nannte: Sie
// führt Leute vom Bohlenweg, damit das Moor satt bleibt. Krumm unter einem schweren Schultertuch,
// über der Schulter eine lange, krumme Weidenstange, an der Einmachgläser an Schnüren hängen. In
// jedem Glas schwebt ein Licht. Unter dem Tuch ist kein Gesicht: Ihre Augen trägt sie in den
// Gläsern, und sie sehen dich von dort an. Angriff: sie schwingt die Stange nach vorn.
'use strict';
module.exports = {
  id: 'irrlichttraegerin', biom: 'moor', zone: 'moor', w: 128, h: 160, fuss: [70, 155], kopf: [56, 50], rimBis: 152, rang: 'elite',
  varianten: { irrlichttraegerin: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, schwung = 0, atem = 0, fall = 0, glanz = 1, pendel = 0, hem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; pendel = [0, 0.4, 0, -0.4][f]; glanz = [1, 0.95, 1.05, 1][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; schwung = [-4, -8, 14, 6][f]; pendel = [1, 2, -3, -1][f]; glanz = [1, 1.2, 1.6, 1.1][f]; hem = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; pendel = 2; }
    if (p.tod) { fall = r(p.q * 40); lean = r(p.q * 4); glanz = f < 2 ? 0.6 : 0; }
    const cx = 72, ox = lean, sy = 70 + fall;
    // Rock und Schultertuch: krumm, der Buckel oben rechts
    const rock = Pg([[cx - 14 + ox, sy + 10], [cx + 12 + ox, sy + 8], [cx + 16, 130], [cx + 24, 146], ...saum(cx + 24, cx - 24, 152, 6, 3, 4, hem), [cx - 24, 146], [cx - 20, 134]], null, { rd: 1.5 });
    const tuch = Pg([[cx - 30 + ox, sy + 2], [cx - 14 + ox, sy - 14], [cx + 6 + ox, sy - 22], [cx + 20 + ox, sy - 14], [cx + 22 + ox, sy + 10], [cx + 12 + ox, sy + 24], [cx - 8 + ox, sy + 28], [cx - 26 + ox, sy + 18]], null, { rd: 2 });
    // Kopf unter dem Tuch, weit vorgebeugt, leer
    const kx = cx - 28 + ox * 1.3, ky = sy - 4 + atem;
    const kappe = Pg([[kx - 10, ky + 8], [kx - 9, ky - 4], [kx, ky - 10], [kx + 12, ky - 8], [kx + 16, ky + 4], [kx + 4, ky + 12]], null, { rd: 1.5 });
    const loch = E(kx - 4, ky + 3, 5, 6, 'dunkel', { pf: 'flat' });
    // Weidenstange: von der hinteren Hand über die Schulter nach vorn
    const hx0 = cx + 18 + ox, hy0 = sy + 18;
    const sx1 = 8 + ox + schwung, sy1 = sy - 30 + r(schwung / 2);
    const mx = cx - 24 + ox + schwung / 2, my = sy - 42 + r(schwung / 3);
    const stange = glied([[hx0, hy0], [cx + 6 + ox, sy - 22], [mx, my], [sx1, sy1]], 2.2, 1.4, 'dunkel');
    const arm = glied([[cx + 14 + ox, sy - 6], [cx + 24 + ox, sy + 6], [hx0, hy0]], 3.6, 3, null);
    const hand = E(hx0, hy0, 3, 3, 'haut');
    const armV = glied([[cx - 20 + ox, sy + 10], [cx - 30 + ox, sy + 22], [cx - 34 + ox, sy + 34]], 3.2, 2.4, null);
    const finger = glied([[cx - 34 + ox, sy + 34], [cx - 38 + ox, sy + 38], [cx - 37 + ox, sy + 43]], 1.4, 0.8, null);
    // Gläser an Schnüren, entlang der Stange verteilt
    const pts = [[(cx + 6 + ox + mx) / 2, (sy - 22 + my) / 2], [mx, my], [(mx + sx1) / 2, (my + sy1) / 2], [sx1 + 1, sy1]];
    const glaeser = pts.map(([x, y], i) => { const lang = 12 + (i % 2) * 9, gx = x + pendel * (i + 1) * 0.6, gy = y + lang; return { x, y, gx, gy }; });
    const schnur = glaeser.map(g => C(g.x, g.y, g.gx, g.gy - 4, 0.5, 0.5, 'dunkel', { noRim: true }));
    const glas = glaeser.map(g => Pg([[g.gx - 4, g.gy - 5], [g.gx + 4, g.gy - 5], [g.gx + 5, g.gy + 6], [g.gx - 5, g.gy + 6]], null, { rd: 1, pf: 'bevel' }));
    const deckel = glaeser.map(g => C(g.gx - 4, g.gy - 5, g.gx + 4, g.gy - 5, 1, 1, 'dunkel', { pf: 'flat' }));
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : stange, k: 0 },
      { p: tot ? [] : schnur, k: 0, noRim: true },
      { p: tot ? [] : glas, k: 0, pf: 'bevel' },
      { p: tot ? [] : deckel, k: 0, pf: 'flat' },
      { p: arm, k: 1 },
      { p: [rock], k: 3 },
      { p: [tuch], k: 3 },
      { p: [kappe], k: 1.5 },
      { p: [loch], k: 0, pf: 'flat', noRim: true },
      { p: [...armV, ...finger], k: 1 },
      { p: [hand], k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Fransen am Tuch
      for (let x = cx - 18; x < cx + 22; x += 3) P.auf(r(x + ox), r(sy + 22 + Math.abs(x - cx) * -0.15), 'k0');
      // Im Glas ein Auge: je eins, das letzte am hellsten
      if (!tot && glanz > 0) glaeser.forEach((g, i) => {
        const ex = r(g.gx), ey = r(g.gy + 1);
        P.set(ex, ey, 'kern'); P.set(ex - 1, ey, 'glut'); P.set(ex + 1, ey, 'glut');
        P.set(ex, ey - 1, 'glut'); P.set(ex, ey + 1, 'glut');
        P.glow(ex + 0.5, ey + 0.5, (6 + i) * glanz, 1 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey]);
      });
      // im leeren Gesicht nur ein schwacher Abglanz
      if (glanz > 0) P.auf(r(kx - 5), r(ky + 4), 'k1');
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
