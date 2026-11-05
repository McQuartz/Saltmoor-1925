// Der Brennmeister (Ziegelgruben). Der Meister, der durch das Schauloch die Farbe der Glut las und wusste,
// wann der Brand gar war. Schwer, aufrecht, etwas nach hinten gelehnt, im Lederschurz. Vor dem Gesicht eine
// Maske aus Ton mit einem einzigen Schauloch; durch das Loch sieht man nicht sein Auge, sondern weiße Glut.
// Er hält eine lange Eisenstange über den eigenen Kopf nach vorn wie eine Angel; an der Kette hängt die
// Brennprobe, ein Ziegel, der nicht abkühlt.
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
// Punkt auf einer quadratischen Kurve
const qb = (a, b, c, t) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1]];

module.exports = {
  id: 'brennmeister', biom: 'ziegelgruben', zone: 'ziegelgruben', w: 96, h: 120, fuss: [60, 115], kopf: [40, 4], rimBis: 113,
  varianten: {
    brennmeister_a: { bogen: 1, probe: 'ziegel', kette: 12 },
    brennmeister_b: { bogen: 0.8, probe: 'zwei', kette: 18, haken: true },
  },
  // Silhouetten-Probe (verworfen): die Stange waagerecht vor dem Bauch, die Probe am Ende, las sich wie der Gießer
  // aus der Glockengießerei (Mann mit Löffel an der Stange). Der Bogen über den Kopf, wie eine Angel, ist eigen.
  proben: { sil_waagerecht: { bogen: 0, probe: 'ziegel', kette: 6, flach: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let atem = 0, lean = 0, fall = 0, schw = 0, pend = 0, knie = 0;
    // schw: Ausholen der Stange (−1 nach hinten, 0 Ruhe, +1 nach vorn geschlagen)
    if (p.idle) { atem = [0, 0, 1, 1][f]; pend = [0, 1, 0, -1][f]; }
    if (p.angriff) { lean = [3, 4, -5, -2][f]; schw = [-0.5, -1, 1, 0.4][f]; knie = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [2, 1][f]; pend = 2; }
    if (p.tod) { fall = r(p.q * 16); schw = p.q * 1.3; knie = p.q * 4; lean = r(p.q * 3); }
    const T = fall;
    const cx = 60 + lean;
    // Beine: kurz und schwer, breit gestellt
    const hy = 84 + T;
    const beinV = glied([[cx - 7, hy], [cx - 12 - knie, 99 + knie], [cx - 12, 111]], 5, 4, null);
    const beinH = glied([[cx + 6, hy], [cx + 10, 99], [cx + 9, 111]], 4.8, 3.8, null);
    const stiefel = [Pg([[cx - 20, 108], [cx - 8, 107], [cx - 7, 115], [cx - 21, 115]], 'dunkel', { rd: 1 }), Pg([[cx + 4, 107], [cx + 14, 107], [cx + 14, 115], [cx + 3, 115]], 'dunkel', { rd: 1 })];
    // Rumpf: breit, Bauch vorn, nach hinten gelehnt
    const sy = 44 + T;
    const rumpf = Pg([[cx - 11, sy + 2], [cx - 3, sy - 5], [cx + 10, sy - 4], [cx + 15, sy + 6], [cx + 14, hy - 8], [cx + 9, hy + 2], [cx - 11, hy + 2], [cx - 16, hy - 12], [cx - 14, sy + 16]], null, { rd: 3 });
    // Lederschurz: Brust bis Schienbein, mit Latz
    const schurz = Pg([[cx - 12, sy + 6], [cx + 1, sy + 4], [cx + 4, sy + 14], [cx + 6, hy + 14], [cx - 2, hy + 18], [cx - 14, hy + 16], [cx - 20, hy - 10], [cx - 16, sy + 16]], 'haut', { rd: 2 });
    // Kopf: kahl, nach hinten geneigt; vor dem Gesicht die Tonmaske
    const kx = cx - 6, ky = sy - 9;
    const schaedel = E(kx + 3, ky - 1, 6.5, 7, null, { pf: 'bevel' });
    const maske = E(kx - 2, ky + 1, 6.2, 7.2, 'haut', { pf: 'bevel' });
    // Hände: beide an der Stange vor der Brust; die Stange steigt über den Kopf und biegt nach vorn
    const hand = [cx - 18 + schw * 3, sy + 20 - schw * 2], hand2 = [cx - 8 + schw * 2, sy + 12];
    let mitte = [cx + 8 - schw * 18, sy - 40 + Math.abs(schw) * 8], tip = [Math.max(14, cx - 34 - schw * 6), sy - 30 + (schw > 0 ? schw * 40 : 0)];
    if (schw < 0) { mitte = [cx - 6 - schw * 6, sy - 46]; tip = [cx - 16 - schw * 26, sy - 40 + schw * 4]; }
    if (v.flach) { mitte = [cx - 30, sy + 18]; tip = [cx - 46, sy + 18]; }
    else { mitte = [mitte[0], mitte[1] + (1 - v.bogen) * 10]; }
    const stange = [];
    let prev = [hand[0] + 8, hand[1] + 6];
    const stz = [prev, hand]; for (let i = 1; i <= 12; i++) stz.push(qb(hand, mitte, tip, i / 12));
    for (let i = 0; i < stz.length - 1; i++) stange.push(C(stz[i][0], stz[i][1], stz[i + 1][0], stz[i + 1][1], 1.3, 1.2, 'dunkel', { pf: 'flat' }));
    if (v.haken) stange.push(C(tip[0], tip[1], tip[0] - 3, tip[1] + 3, 1.1, 1, 'dunkel'));
    // Kette und Probe: hängt senkrecht (im Schlag nach hinten weggeschleudert)
    const kl = v.kette, pw = schw > 0.5 ? -0.9 : schw < -0.5 ? 0.7 : pend * 0.08;
    const pk = [tip[0] + Math.sin(pw) * kl, tip[1] + Math.cos(pw) * kl];
    const kette = []; for (let i = 0; i < 4; i++) { const a = qb(tip, tip, pk, i / 4), b = qb(tip, tip, pk, (i + 1) / 4); kette.push(C(a[0], a[1], b[0], b[1], 0.7, 0.7, null, { pf: 'flat' })); }
    const pa = pw;
    const rotp = (u, w) => [pk[0] + u * Math.cos(pa) + w * Math.sin(pa) * -1 * 0, pk[1] + w + u * Math.sin(pa) * 0];
    const probe = v.probe === 'zwei'
      ? [Pg([rotp(-5, 1), rotp(5, 1), rotp(5, 6), rotp(-5, 6)], null, { rd: 0.5, b: 2 }), Pg([rotp(-4, 7), rotp(6, 7), rotp(6, 12), rotp(-4, 12)], null, { rd: 0.5, b: 2 })]
      : [Pg([rotp(-7, 1), rotp(7, 1), rotp(7, 8), rotp(-7, 8)], null, { rd: 0.6, b: 2 })];
    const armV = glied([[cx - 9, sy + 1], [cx - 24, sy + 12], hand], 4.6, 3.4, null);
    const armH = glied([[cx + 8, sy], [cx + 4, sy + 16], hand2], 4.2, 3.2, null);
    const haende = [E(hand[0], hand[1], 3.4, 3, 'haut'), E(hand2[0], hand2[1], 3.2, 2.8, 'haut')];
    const gruppen = [
      { p: beinH, k: 1.5 },
      { p: [stiefel[1]], k: 0, kante: true },
      { p: armH, k: 1.2, kante: true },
      { p: [rumpf], k: 2 },
      { p: beinV, k: 1.5, kante: true },
      { p: [stiefel[0]], k: 0, kante: true },
      { p: [schurz], k: 1, kante: true, tone: -0.05 },
      { p: [schaedel], k: 0, kante: true },
      { p: [maske], k: 0, kante: true },
      { p: kette, k: 0, noRim: true },
      { p: probe, k: 0, kante: true, tone: 0.2 },
      { p: stange, k: 0, kante: true },
      { p: armV, k: 1.2, kante: true },
      { p: haende, k: 0.4, kante: true },
    ];
    const RUMPF = 3, SCHURZ = 6, MASKE = 8, PROBE = 10;
    gruppen.forEach(g => { g.anker = [lean, T]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('ziegelgruben'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      const ist = (x, y, g) => gid[r(y) * W + r(x)] === g;
      // Schurz: Stichnaht am Rand, Brandflecken (Ziegelrot), zwei Falten; Latz-Kante
      for (let y = r(sy + 5); y < hy + 18; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, SCHURZ)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        if (!ist(x - 2, y, SCHURZ) && (y & 1)) P.set(x + 1, y, 'k3');
        if (Math.abs(x - (cx - 9 + (y - sy) * 0.05)) < 0.6 || Math.abs(x - (cx - 2 + (y - sy) * 0.1)) < 0.6) P.set(x, y, 'k0');
        if (Math.abs(x - (cx - 8 + (y - sy) * 0.05)) < 0.6 && LIB.bay(x - lean, y - T) < 0.6) P.set(x, y, 'k3');
      }
      for (const [bx, by] of [[cx - 14, 70], [cx - 5, 92], [cx - 10, 99]]) { P.auf(bx, by + T, 'ziegel'); P.auf(bx + 1, by + T, 'k3'); }
      for (let x = r(cx - 16); x <= r(cx + 16); x++) { const y = r(hy - 6 + (x - cx) * 0.1); if (ist(x, y, SCHURZ) || ist(x, y, RUMPF)) { P.set(x, y, 'k0'); P.set(x, y - 1, x > cx - 4 ? 'r1' : 'k3'); } }
      // Rumpf hinten: Falten im Kittel
      for (let i = 0; i < 3; i++) for (let y = sy + 6; y < hy - 4; y++) { const x = r(cx + 6 + i * 3.5 + (y - sy) * 0.06); if (ist(x, y, RUMPF) && P.get(x, y) <= 4) P.set(x, y, i === 1 ? 'k3' : 'k0'); }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Probe: gebrannter Ziegel, glüht; Kanten Ziegelrot, Mitte Glut, der Abdruck dunkel darin
      if (!(p.tod && f >= 4)) {
        const glu = p.tod ? 0.5 : 1;
        for (let y = r(pk[1]); y <= r(pk[1] + 13); y++) for (let x = r(pk[0] - 8); x <= r(pk[0] + 8); x++) {
          if (!ist(x, y, PROBE)) continue; const c = P.get(x, y); const kante = !ist(x - 1, y, PROBE) || !ist(x + 1, y, PROBE) || !ist(x, y - 1, PROBE) || !ist(x, y + 1, PROBE);
          if (kante) { if (c <= 4) P.set(x, y, 'ziegel'); continue; }
          const q = Math.hypot((x - pk[0]) / 6, (y - pk[1] - 4) / 3);
          P.set(x, y, q < 0.45 * glu ? 'kern' : q < 0.9 * glu ? 'glut' : 'glutDim');
        }
        P.set(r(pk[0]) + 1, r(pk[1]) + 4, 'glutDim'); P.set(r(pk[0]) + 2, r(pk[1]) + 4, 'glutDim');
        P.glow(pk[0], pk[1] + 4, 13, 0.6 * glu, 'glutDim', 'k3');
        augen.push([r(pk[0]), r(pk[1] + 4)]);
      }
      // die Probe wirft ihr Licht auf Schurz und Schulter (vorn links)
      if (!p.tod) P.glow(cx - 14, sy + 10, 16, 0.45, 'glutDim', 'k3');
      // Maske: Ton, gerissen, ein Schauloch mit weißer Glut, sonst nichts
      const mx = kx - 2, my = ky + 1;
      for (let y = r(my - 7); y <= r(my + 7); y++) for (let x = r(mx - 6); x <= r(mx + 6); x++) {
        if (!ist(x, y, MASKE)) continue; const c = P.get(x, y); if (c > 4) continue;
        if (((x * 7 + y * 13) % 13) === 0) P.set(x, y, 'k1'); else if (x > mx - 4 && y < my + 5 && LIB.bay(x - lean, y - T) < 0.5) P.set(x, y, 'ziegel'); else if (LIB.bay(x - lean, y - T) < 0.5) P.set(x, y, 'k3');
      }
      for (let i = 0; i < 6; i++) P.auf(mx + 2 - i * 0.5, my + 2 + i, i % 2 ? 'k0' : 'k1');
      if (!p.tod || f < 1) {
        const ex = r(mx - 2), ey = r(my - 1);
        P.glow(ex + 0.5, ey + 0.5, 7, 0.75, 'glutDim', 'k3');
        P.set(ex, ey, 'kern'); P.set(ex - 1, ey, 'glut'); P.set(ex + 1, ey, 'glut'); P.set(ex, ey - 1, 'glut'); P.set(ex, ey + 1, 'glut');
        P.set(ex - 1, ey - 1, 'k0'); P.set(ex + 1, ey + 1, 'k0'); P.set(ex + 1, ey - 1, 'k0'); P.set(ex - 1, ey + 1, 'k0');
        augen.push([ex, ey]);
      }
    };
    return { gruppen, details, augen, dy: atem };
  },
};
