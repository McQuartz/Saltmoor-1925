// Der Gießer (Glockengießerei). Der Meister, der 1641 die Glocken für St. Brendan goss. Breit, gebeugt,
// im Lederschurz, die Gugel über dem Kopf. Vor dem Gesicht trägt er eine Maske aus Lehm, die Form seines
// eigenen Gesichts; hinter den Augenlöchern steht flüssige Bronze. Er trägt den Gießlöffel an einer
// Stange, doppelt so lang wie er, waagerecht vor sich (b: einen Tiegel in der Tiegelzange).
'use strict';
const LIB = require('../lib');
function innenKanten(P, gid, gruppen, W, H, stufe = 'r1') {
  const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : gid[y * W + x]);
  const ziel = [];
  for (let y = 1; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const gi = g(x, y); if (gi < 0 || !gruppen[gi] || !gruppen[gi].kante) continue;
    const c = P.get(x, y); if (c < 1 || c > 4) continue;
    const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1);
    const hinten = v => v >= 0 && v < gi;
    if (hinten(a) || (hinten(b) && hinten(d))) ziel.push([x, y]);
  }
  for (const [x, y] of ziel) P.set(x, y, stufe);
}
module.exports = {
  id: 'giesser', biom: 'glockengiesserei', zone: 'glockengiesserei', w: 96, h: 120, fuss: [56, 115], kopf: [44, 24], rimBis: 113,
  varianten: {
    giesser_a: { werkzeug: 'loeffel' },
    giesser_b: { werkzeug: 'tiegel', sprung: true },
  },
  // Silhouetten-Probe (verworfen): aufrecht mit dem Löffel senkrecht wie ein Spieß; das las sich als Wächter
  // mit Hellebarde (Fahnenträger, Holzfäller). Erst die waagerechte Stange und der Buckel zeigen die Last.
  proben: { sil_aufrecht: { werkzeug: 'loeffel', aufrecht: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let atem = 0, lean = 0, hub = 0, kipp = 0, fall = 0, knie = 0, wall = 0, spritz = 0;
    // hub: Stange (Winkel nach oben, Bogenmaß), kipp: Löffel gekippt (0..1)
    if (p.idle) { atem = [0, 0, 1, 1][f]; wall = f; }
    if (p.angriff) { lean = [2, 3, -5, -2][f]; hub = [0.35, 0.75, -0.12, 0.05][f]; kipp = [0, 0.1, 1, 0.5][f]; spritz = [0, 0, 1, 0.5][f]; wall = f; }
    if (p.treffer) { lean = [2, 1][f]; hub = 0.08; }
    if (p.tod) { knie = Math.min(1, p.q * 1.5); fall = r(p.q * 14); hub = -0.25 * p.q; kipp = p.q; }
    if (v.aufrecht) hub = 1.35;
    const T = atem + fall, cx = 62 + lean;
    // Beine: gespreizt, gebeugt, schwere Stiefel
    const hy = 82 + T;
    const beinL = glied([[cx - 7, hy], [cx - 12 - knie * 4, 97 + knie * 6], [cx - 11 - knie * 2, 111]], 5, 3.8, null);
    const beinR = glied([[cx + 6, hy], [cx + 9, 97 + knie * 6], [cx + 8, 111]], 5, 3.8, null);
    const stiefel = [Pg([[cx - 18 - knie * 2, 108], [cx - 7 - knie * 2, 106], [cx - 7 - knie * 2, 115], [cx - 20 - knie * 2, 115]], 'dunkel', { rd: 1 }), Pg([[cx + 3, 106], [cx + 12, 106], [cx + 12, 115], [cx, 115]], 'dunkel', { rd: 1 })];
    // Rumpf: breit, Buckel nach rechts oben, Schultern vorn tief
    const sy = 52 + T;
    const rumpf = Pg([[cx - 18, sy + 4], [cx - 10, sy - 5], [cx + 2, sy - 11], [cx + 12, sy - 9], [cx + 19, sy + 2], [cx + 18, hy - 6], [cx + 12, hy], [cx - 12, hy + 2], [cx - 17, sy + 20]], null, { rd: 3 });
    // Schulterkragen der Gugel
    const kragen = Pg([[cx - 21, sy + 2], [cx - 10, sy - 7], [cx + 2, sy - 13], [cx + 13, sy - 10], [cx + 19, sy - 1], [cx + 14, sy + 6], [cx + 2, sy + 2], [cx - 12, sy + 9], [cx - 22, sy + 10]], null, { rd: 2 });
    // Lederschurz: vom Hals bis zu den Schienbeinen, vorn
    const schurz = Pg([[cx - 16, sy + 8], [cx - 4, sy + 8], [cx + 3, hy - 4], [cx + 1, 98], [cx - 9, 100], [cx - 21, 97], [cx - 21, sy + 24]], 'dunkel', { rd: 2 });
    // Kopf: tief vorn, Gugel spitz nach hinten, Maske vorn
    const kx = cx - 17, ky = 49 + T + (v.aufrecht ? -10 : 0);
    const gugel = Pg([[kx - 6, ky - 7], [kx + 1, ky - 11], [kx + 9, ky - 11], [kx + 15, ky - 7], [kx + 22, ky - 4], [kx + 27, ky + 2], [kx + 23, ky + 3], [kx + 14, ky + 4], [kx + 4, ky + 9], [kx - 6, ky + 5]], null, { rd: 2.5 });
    const maske = E(kx - 4, ky + 1, 7, 8.6, 'haut', { pf: 'bevel' });
    // Stange: von den Händen nach links; hinten ragt sie über die Schulter
    const hx = cx - 16, hyy = 76 + T; // Griff (vordere Hand)
    const len = v.werkzeug === 'loeffel' ? 30 : 26, ang = Math.PI + hub; // nach links
    const ex = hx + Math.cos(ang) * len, ey = hyy - Math.sin(hub) * len * 1 + 0;
    const eyy = hyy + Math.sin(-hub) * len; // y wächst nach unten
    const end = [hx - Math.cos(hub) * len, eyy];
    void ex; void ey;
    const hinten = [hx + Math.cos(hub) * 26, hyy + Math.sin(hub) * 26];
    const stange = [C(hinten[0], hinten[1], end[0], end[1], 1.4, 1.2, 'dunkel', { pf: 'flat' })];
    const werk = [];
    let schale = null;
    if (v.werkzeug === 'loeffel') {
      // Gießlöffel: Halbkugel, Mund nach oben, beim Kippen dreht er nach links
      const ka = -kipp * 1.3, bx = end[0] - 6, by = end[1] + 2;
      const rotk = (x, y) => [bx + x * Math.cos(ka) - y * Math.sin(ka), by + x * Math.sin(ka) + y * Math.cos(ka)];
      const pts = []; for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12; pts.push(rotk(Math.cos(t) * 9, Math.sin(t) * 7.5)); }
      pts.push(rotk(-10, -1.2), rotk(10, -1.2));
      werk.push(Pg(pts, null, { rd: 0.6 }));
      werk.push(C(...rotk(9, 0), end[0], end[1], 1.4, 1.2, null)); // Hals
      schale = { rotk, b: 9 };
    } else {
      // Tiegelzange: zwei Schenkel, vorn ein hoher Tiegel
      const tx = end[0] - 2, ty = end[1];
      werk.push(C(end[0] + 3, end[1] - 2, tx + 2, ty + 2, 1, 1, 'dunkel'), C(end[0] + 3, end[1] + 2, tx + 2, ty + 8, 1, 1, 'dunkel'));
      const ka = -kipp * 1.1, bx = tx - 3, by = ty + 4;
      const rotk = (x, y) => [bx + x * Math.cos(ka) - y * Math.sin(ka), by + x * Math.sin(ka) + y * Math.cos(ka)];
      werk.push(Pg([rotk(-6, -6), rotk(6, -6), rotk(5, 7), rotk(2, 10), rotk(-2, 10), rotk(-5, 7)], null, { rd: 1 }));
      schale = { rotk, b: 6, tiegel: true };
    }
    // Arme: beide vorn an der Stange
    const sv = [cx - 12, sy + 4], shh = [cx + 6, sy];
    const armV = glied([sv, [cx - 21, sy + 14], [hx, hyy]], 4.4, 3.2, null);
    const armH = glied([shh, [cx + 2, sy + 16], [hx + 12 * Math.cos(hub), hyy + 12 * Math.sin(hub)]], 4.2, 3.2, null);
    const haende = [E(hx, hyy, 3.4, 3, 'haut'), E(hx + 12 * Math.cos(hub), hyy + 12 * Math.sin(hub), 3.2, 2.8, 'haut')];
    const gruppen = [
      { p: beinR, k: 1.5 },
      { p: [stiefel[1]], k: 0, kante: true },
      { p: armH, k: 1.5, kante: true },
      { p: [rumpf], k: 2 },
      { p: beinL, k: 1.5 },
      { p: [stiefel[0]], k: 0, kante: true },
      { p: [schurz], k: 1, kante: true },
      { p: [kragen], k: 1 },
      { p: [gugel], k: 1, kante: true },
      { p: [maske], k: 0, kante: true },
      { p: stange, k: 0, kante: true },
      { p: werk, k: 0.6, kante: true },
      { p: armV, k: 1.5, kante: true },
      { p: haende, k: 0.5, kante: true },
    ];
    const SCHURZ = 6, KRAGEN = 7, GUGEL = 8, MASKE = 9, WERK = 11, RUMPF = 3;
    gruppen.forEach((g, i) => { g.anker = [lean, T]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('glockengiesserei'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      const ist = (x, y, g) => gid[r(y) * W + r(x)] === g;
      // Schurz: Ledernähte am Rand (Stichreihe), zwei Falten, Brandflecken vom Guss
      for (let y = r(sy + 10); y < 101; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, SCHURZ)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const lin = !ist(x - 2, y, SCHURZ);
        if (lin && (y & 1)) P.set(x + 1, y, 'k3');
        if (Math.abs(x - (cx - 12 + (y - sy) * 0.08)) < 0.6 || Math.abs(x - (cx - 4 + (y - sy) * 0.14)) < 0.6) P.set(x, y, 'k0');
        if (Math.abs(x - (cx - 11 + (y - sy) * 0.08)) < 0.6 && LIB.bay(x - lean, y - T) < 0.6) P.set(x, y, 'k3');
      }
      for (const [bx, by] of [[cx - 15, 88], [cx - 7, 93], [cx - 17, 74]]) { P.auf(bx, by + T, 'lehm'); P.auf(bx + 1, by + T, 'k3'); P.auf(bx, by + 1 + T, 'k3'); }
      // Gürtel quer über dem Schurz
      for (let x = cx - 22; x <= cx + 16; x++) { const y = r(hy - 6 + (x - cx) * 0.12); if (ist(x, y, SCHURZ) || ist(x, y, RUMPF)) { P.set(x, y, 'k0'); P.set(x, y - 1, x > cx - 2 ? 'r1' : 'k3'); } }
      P.auf(cx - 8, r(hy - 7 + -0.96), 'bronze');
      // Rumpf: Falten des Kittels am Rücken
      for (let i = 0; i < 3; i++) for (let y = sy + 6; y < hy - 2; y++) { const x = r(cx + 6 + i * 4 + (y - sy) * 0.1); if (ist(x, y, RUMPF) && P.get(x, y) <= 4) P.set(x, y, i === 1 ? 'k3' : 'k0'); }
      // Kragen: Saum dunkel, Licht am Buckel
      for (let x = 0; x < W; x++) for (let y = sy - 8; y < sy + 13; y++) if (ist(x, y, KRAGEN) && !ist(x, y + 1, KRAGEN) && P.get(x, y) <= 4) P.set(x, y, 'k0');
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Maske: Lehm, rissig; Augenlöcher und Mund mit flüssiger Bronze dahinter
      const mx = kx - 4, my = ky + 1;
      for (let y = r(my - 8); y <= r(my + 8); y++) for (let x = r(mx - 7); x <= r(mx + 7); x++) {
        if (!ist(x, y, MASKE)) continue; const c = P.get(x, y); if (c > 5) continue;
        const dx = x + 0.5 - mx, dy = y + 0.5 - my;
        if (c >= 5) continue;
        if (dx > -2.5 && dy < 4.5 && (dx > 0 || LIB.bay(x - lean, y - T) < 0.6)) P.set(x, y, 'lehm'); else if (((x * 7 + y * 13) % 11) === 0) P.set(x, y, 'k1');
        if (Math.abs(dy - 6) < 0.6 || (Math.abs(dx + 5.5) < 0.6 && dy > -3)) P.set(x, y, 'k1');
      }
      if (v.sprung) for (let i = 0; i < 9; i++) P.auf(mx - 3 + i * 0.7, my - 7 + i * 1.6, i % 3 ? 'k0' : 'guss');
      if (!p.tod || f < 1) {
        const ey = r(my - 1.5);
        P.glow(mx, my, 9, 0.8, 'glutDim', 'k3');
        P.set(r(mx - 3.5), ey, 'kern'); P.set(r(mx - 2.5), ey, 'glut'); P.set(r(mx + 1), ey, 'glut'); P.set(r(mx + 2), ey, 'guss');
        P.set(r(mx - 2), ey - 1, 'k0'); P.set(r(mx + 1.5), ey - 1, 'k0');
        for (let x = r(mx - 2); x <= r(mx + 1); x++) P.set(x, r(my + 4), x === r(mx - 1) ? 'guss' : 'glutDim');
        augen.push([r(mx - 3.5), ey], [r(mx + 1), ey]);
      }
      // die Bronze im Löffel leuchtet ihn von unten an: Hände, Unterarme, Schurzkante
      if (schale && !p.tod) { const [gx, gy] = schale.rotk(0, -3); P.glow(Math.max(gx + 14, hx - 4), Math.max(gy, hyy - 2), 15, 0.55, 'glutDim', 'k3'); }
      // Schale: oben flüssige Bronze, wallend; der Rand nimmt Licht; beim Kippen fliegt ein Schwall
      if (schale) {
        const { rotk } = schale; const n = schale.b;
        for (let i = -n + 1; i <= n - 1; i++) { const [x, y] = rotk(i, -1.2); const t = Math.abs(i) / n; P.set(x, y, t < 0.35 && !p.tod ? ((i + wall) % 3 === 0 ? 'kern' : 'glut') : t < 0.75 ? 'guss' : 'r1'); }
        const [gx, gy] = rotk(0, 1); P.glow(gx, gy, 10, 0.7, 'glutDim', 'k3');
        for (let i = -n; i <= n; i++) { const [x, y] = rotk(i, -2.2); if (!P.get(r(x), r(y)) && Math.abs(i) < n - 2 && !p.tod && ((i + wall) % 4 === 0)) P.set(x, y, 'guss'); }
        if (p.idle && f >= 2) { const [x, y] = rotk(-n - 0.5, 1 + (f - 2) * 4); P.set(x, y, 'guss'); P.set(x, y + 1, 'glutDim'); }
        if (spritz) {
          const [sx, sy2] = rotk(-n, -1);
          for (let i = 0; i < 18 * spritz; i++) { const t = i / 18, x = sx - t * 10 - (i % 3), y = sy2 + t * 34 + (i % 2); P.set(x, y, i % 4 === 0 ? 'glut' : 'guss'); if (i % 2) P.set(x - 1, y + 1, 'glutDim'); }
        }
        augen.push([r(gx), r(gy - 2)]);
      }
    };
    return { gruppen, details, augen };
  },
};
