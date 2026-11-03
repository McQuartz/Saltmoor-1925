// Grabwächter (Salzstollen). Römischer Legionär im Salz, der Helm mit dem Schädel verwachsen.
// Schild links vor dem Körper, Speer rechts, die Schultern salzverkrustet.
'use strict';
module.exports = {
  id: 'grabwaechter', biom: 'salz', zone: 'salz', w: 96, h: 120, fuss: [50, 115], kopf: [50, 16],
  varianten: {
    grabwaechter_a: { kamm: true, schild: 13 },
    grabwaechter_b: { kamm: false, schild: 11, gebeugt: 3 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, pose } = A;
    const P0 = pose(p, { lunge: 3, fall: 26 }), f = p.f, G = v.gebeugt || 0;
    const lean = P0.lean, T = P0.atem + P0.fall;
    const cx = 50 + lean;
    const beine = [C(45, 88, 43, 113, 3.4, 2.4, null), C(56, 88, 58, 113, 3.4, 2.4, null)];
    const rumpf = Pg([[cx - 11, 46 + T + G], [cx + 11, 46 + T], [cx + 9, 74 + T / 2], [cx - 9, 74 + T / 2]], null, { rd: 2 });
    const rock = Pg([[cx - 11, 72 + T / 2], [cx + 11, 72 + T / 2], [cx + 13, 90], [cx - 13, 90]], 'dunkel', { rd: 1 });
    const schultern = [E(cx - 10, 49 + T + G, 6, 4, null), E(cx + 10, 48 + T, 6, 4, null)];
    const hx = cx - G, hy = 34 + T + G;
    const helm = E(hx, hy, 8, 9, null, { pf: 'bevel' });
    const wangen = Pg([[hx - 8, hy], [hx - 2, hy + 2], [hx - 4, hy + 11], [hx - 8, hy + 8]], 'dunkel', { rd: 1 });
    const kamm = v.kamm ? [Pg([[hx - 6, hy - 9], [hx + 2, hy - 15], [hx + 9, hy - 12], [hx + 7, hy - 7]], 'dunkel', { rd: 1 })] : [];
    // Speer rechts, im Angriff nach vorn gekippt
    const kipp = p.angriff ? [0.1, -0.4, -1.25, -0.5][f] : p.tod ? Math.min(1.2, p.q * 1.6) : 0;
    const sx = cx + 16, sy = 70 + T;
    const a = -Math.PI / 2 + kipp; const sp = [C(sx - Math.cos(a) * 30, sy - Math.sin(a) * 30, sx + Math.cos(a) * 52, sy + Math.sin(a) * 52, 0.9, 0.9, 'dunkel', { pf: 'flat' })];
    const spitze = [Pg([[sx + Math.cos(a) * 52 + Math.cos(a + 1.57) * 2, sy + Math.sin(a) * 52 + Math.sin(a + 1.57) * 2], [sx + Math.cos(a) * 60, sy + Math.sin(a) * 60], [sx + Math.cos(a) * 52 - Math.cos(a + 1.57) * 2, sy + Math.sin(a) * 52 - Math.sin(a + 1.57) * 2]], null, { rd: 0.3 })];
    const armR = glied([[cx + 10, 50 + T], [cx + 16, 62 + T], [sx, sy]], 2.8, 2, null);
    const S = v.schild;
    const schild = Pg([[cx - 20, 52 + T], [cx - 20 + S, 50 + T], [cx - 18 + S, 88 + T / 2], [cx - 22, 90 + T / 2]], null, { rd: 2, pf: 'bevel' });
    const gruppen = [
      { p: beine, k: 1 },
      { p: [rock], k: 1 },
      { p: [rumpf, ...schultern], k: 2 },
      { p: sp, k: 0 }, { p: spitze, k: 0 },
      { p: armR, k: 1 },
      { p: [helm, ...kamm], k: 1 },
      { p: [wangen], k: 0 },
      { p: [schild], k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Brustpanzer-Streifen und Schildbuckel
      for (let y = 54; y < 72; y += 4) P.line(cx - 8, y + T, cx + 8, y + T, 'k0', true);
      P.el(cx - 15 + S / 2, 70 + T, 2.5, 2.5, 'r1', true); P.el(cx - 15 + S / 2, 70 + T, 1.5, 1.5, 'k3', true);
      // Salzkruste auf Schultern und Helm
      for (const [x0, y0] of [[cx - 14, 45 + T + G], [cx + 6, 44 + T], [hx - 4, hy - 8]]) for (let i = 0; i < 9; i++) P.auf(x0 + (i * 3) % 8, y0 + ((i * 5) % 4), i % 3 ? 'r1' : 'r2');
      // Helmgesicht: Sehschlitz mit zwei glühenden Punkten
      P.line(hx - 6, hy + 1, hx + 4, hy + 1, 'k0', true);
      if (!P0.aus) { P.set(hx - 4, hy + 1, 'glut'); P.set(hx + 1, hy + 1, 'kern'); P.glow(hx - 1, hy + 1, 5, 0.6); augen.push([hx - 4, hy + 1], [hx + 1, hy + 1]); }
    };
    return { gruppen, details, augen };
  },
};
