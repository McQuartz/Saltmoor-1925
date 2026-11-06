// Zweiter Wächter Waisenhaus: Der Fotograf von 1913. Er kam nach der Sturmflut für das Gruppenbild, das im
// Flur hängt und auf dem zu viele Köpfe sind. Die Plattenkamera steht noch auf ihrem Dreibein, der Balg
// ausgezogen, er selbst unter dem schwarzen Tuch, den Arm mit der Blitzlampe hoch erhoben. Unter dem Saum des
// Tuchs stehen seine Schuhe, und daneben, still, kleine nackte Füße, nass. Mehr, als unter ein Tuch passen.
// Phase 2 (fotograf_p2): Das Tuch fällt. Es war nie einer darunter: Die Kinder stehen da und halten die Lampe.
// Palette waisenhaus: Das warme Rot-Ocker-Randlicht gibt es in der kalten grauen Halle nicht.
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
  id: 'fotograf', biom: 'waisenhaus', zone: 'waisenhaus', rang: 'waechter', w: 160, h: 180, fuss: [92, 176], kopf: [92, 6], rimBis: 172,
  varianten: { fotograf: { p2: 0 }, fotograf_p2: { p2: 1 } },
  // Silhouetten-Probe (verworfen): die Kamera auf dem Dreibein ohne Tuch und Lampe, der Fotograf aufrecht
  // daneben. Schwarz ein Mann neben einem Gestell, zwei Dinge statt eines. Genommen: unter dem Tuch verschmolzen,
  // der Arm mit der Lampe hoch über allem.
  proben: { probe_ohne_tuch: { p2: 0, ohneTuch: true } },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, W = 160, H = 180, FY = 175;
    // balg: Länge des Balgs (Angriff schnellt vor), blitz: Lampe zündet, hebe: Lampe hoch, lean: Gestell kippt
    let balg = 0, blitz = 0, hebe = 0, lean = 0, atem = 0, fall = 0, tuch = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; }
    if (p.angriff) { hebe = [0.5, 1, 0.6, 0.2][f]; balg = [-4, -6, 30, 14][f]; blitz = [0, 0.4, 1, 0.3][f]; lean = [3, 5, -7, -3][f]; }
    if (p.treffer) { lean = [3, 1][f]; }
    if (p.tod) { fall = r(p.q * 24); lean = r(p.q * 6); }
    const T = atem, L = lean, p2 = !!v.p2;
    // Kamera: Kasten, Balg nach links, Objektiv
    const kx0 = 70 + L, ky0 = 70 + fall * 0.5;
    const kasten = Pg([[kx0, ky0], [kx0 + 30, ky0], [kx0 + 30, ky0 + 26], [kx0, ky0 + 26]], null, { rd: 1 });
    const bl = 18 + balg, bx1 = kx0 - bl;
    const balgF = Pg([[kx0 + 1, ky0 + 2], [bx1 + 2, ky0 + 6], [bx1 + 2, ky0 + 21], [kx0 + 1, ky0 + 24]], null, { rd: 0.8 });
    const brett = Pg([[bx1 - 3, ky0 + 2], [bx1 + 3, ky0 + 2], [bx1 + 3, ky0 + 25], [bx1 - 3, ky0 + 25]], null, { rd: 0.6 });
    const objektiv = [C(bx1 - 2, ky0 + 13, bx1 - 11, ky0 + 13, 5.2, 4.6, null)];
    // Dreibein
    const bein = [C(kx0 + 14, ky0 + 26, 50 + L * 0.3, FY, 2.4, 1.8, null), C(kx0 + 16, ky0 + 26, 118, FY, 2.4, 1.8, null), C(kx0 + 15, ky0 + 26, 92, FY - 2, 1.8, 1.5, null)];
    const fuesse = [];
    // Tuch über Fotograf und Kastenrücken, bis zum Boden; darunter Schuhe und Kinderfüße
    const tuchF = []; const arm = []; const lampe = []; const kinder = [];
    const lx = 132 + L * 0.5, ly = 34 - hebe * 14 + fall;
    if (!p2 && !v.ohneTuch) {
      tuchF.push(Pg([[kx0 + 20, ky0 - 2], [kx0 + 34, ky0 - 10 + T], [110, 50 + T], [130, 54 + T], [136, 72], [141, 120], [148, FY - 9], [103, FY - 9], [104, 140], [kx0 + 30, ky0 + 26], [kx0 + 22, ky0 + 10]], null, { rd: 3 }), E(118, 50 + T, 11, 10, null));
      arm.push(C(124, 62 + T, lx - 2, ly + 10, 3.2, 2.4, null), E(lx - 2, ly + 9, 2.6, 2.6, 'haut'));
      fuesse.push(Pg([[108, FY - 4], [118, FY - 4], [118, FY], [104, FY]], null, { rd: 0.5 }), Pg([[128, FY - 4], [138, FY - 4], [139, FY], [126, FY]], null, { rd: 0.5 }));
      for (const [x, s] of [[112, 0.8], [122, 0.75], [133, 0.85], [143, 0.7]]) fuesse.push(E(x, FY - 1.5, 2.6 * s + 0.6, 1.6, 'haut'), C(x + 1, FY - 2, x + 1, FY - 7, 1.3, 1.1, 'haut'));
    } else if (v.ohneTuch) {
      arm.push(C(124, 62, lx - 2, ly + 10, 3.2, 2.4, null));
      tuchF.push(Pg([[112, 56], [126, 56], [128, 120], [130, FY], [108, FY], [110, 120]], null, { rd: 2 }), E(118, 46, 7, 8, 'haut'));
    } else {
      // Phase 2: Tuch am Boden, die Kinder stehen da; das größte hält die Lampe an einer Stange
      tuchF.push(Pg([[96, FY], [104, FY - 8], [120, FY - 12], [140, FY - 9], [154, FY - 3], [156, FY], [130, FY + 1]], null, { rd: 2 }));
      const K = [[99, 0.95], [121, 1.3], [143, 1.05]];
      K.forEach(([x, s], i) => { const fy = FY - 4 - (i % 2) * 2, hh = 52 * s, top = fy - hh, xx = x + L * 0.3;
        kinder.push({ i, s, x: xx, fy, top, formen: [
          Pg([[xx - 4 * s, top + 15 * s], [xx + 4 * s, top + 15 * s], [xx + 7 * s, top + 22 * s], [xx + 10 * s, fy - 3], [xx - 9 * s, fy - 3], [xx - 6 * s, top + 22 * s]], 'haut', { rd: 1.2, tone: 0.1 }),
          E(xx - 1, top + 8 * s, 7.6 * s, 8 * s, 'haut', { pf: 'bevel' }),
          Pg([[xx + 1 * s, top + 1 * s], [xx + 6.5 * s, top + 5 * s], [xx + 5 * s, top + 26 * s], [xx + 2 * s, top + 23 * s]], null, { rd: 0.6 }),
          C(xx - 3 * s, fy - 3, xx - 3 * s, fy, 1.3, 1.1, 'haut'), C(xx + 3 * s, fy - 3, xx + 3 * s, fy, 1.3, 1.1, 'haut')] }); });
      const k1 = kinder[1]; arm.push(C(k1.x + 5, k1.top + 20, k1.x + 9, k1.top + 4, 1.8, 1.4, 'haut'), C(k1.x + 9, k1.top + 4, lx - 2, ly + 10, 1.6, 1.4, null));
    }
    // Blitzlampe: Stab mit Pulverrinne
    lampe.push(C(lx - 2, ly + 12, lx - 2, ly + 2, 1.2, 1.2, null), Pg([[lx - 14, ly - 1], [lx + 10, ly - 3], [lx + 10, ly + 1], [lx - 14, ly + 3]], null, { rd: 0.6 }));
    const gruppen = [];
    for (const k of kinder.slice().reverse()) gruppen.push({ p: k.formen, k: 0.6, kante: true, kind: k });
    gruppen.push(
      { p: bein, k: 0.5, kante: true },
      { p: fuesse, k: 0.4, kante: true, fuesse: 1 },
      { p: arm, k: 1, kante: true, arm: 1 },
      { p: lampe, k: 0.3, kante: true, lampe: 1 },
      { p: [balgF], k: 0, kante: true, balg: 1 },
      { p: [brett], k: 0, kante: true },
      { p: objektiv, k: 0.5, kante: true, obj: 1 },
      { p: [kasten], k: 0, kante: true, kasten: 1 },
      { p: tuchF, k: 2, kante: true, tuch: 1 },
    );
    const idx = key => gruppen.findIndex(g => g[key]);
    const BALG = idx('balg'), OBJ = idx('obj'), KASTEN = idx('kasten'), TUCH = idx('tuch'), FUESSE = idx('fuesse');
    gruppen.forEach(g => { g.anker = [0, 0]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('waisenhaus'), { rimBis: 172 });
    const augen = [];
    const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
    const details = P => {
      const B = LIB.bay;
      // Balg: Falten quer (Ziehharmonika), hell an den Graten
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, BALG)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const u = ((x - bx1) % 4 + 4) % 4; P.set(x, y, u === 0 ? 'k0' : u === 1 ? (y < ky0 + 10 ? 'r1' : 'k3') : 'k1'); }
      // Kasten: Holz (Ocker gedämpft), Messingbeschläge, Kassette
      for (let y = r(ky0); y < r(ky0 + 27); y++) for (let x = r(kx0); x < r(kx0 + 31); x++) { if (!ist(x, y, KASTEN)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        if ((x - kx0 < 2 || kx0 + 30 - x < 2) && (y - ky0 < 3 || ky0 + 26 - y < 3)) P.set(x, y, 'ocker'); else if (y === r(ky0 + 8) || x === r(kx0 + 20)) P.set(x, y, 'k0'); else if (x > kx0 + 20 && B(x, y) < 0.4) P.set(x, y, 'k3'); }
      // Objektiv: Messingring, Glas mit Spiegelung; das Glas ist das Auge
      const ox = r(bx1 - 11), oy = r(ky0 + 13);
      for (let y = oy - 6; y <= oy + 6; y++) for (let x = ox - 2; x <= r(bx1); x++) if (ist(x, y, OBJ) && P.get(x, y) <= 6 && (x === r(bx1 - 4) || x === r(bx1 - 8))) P.set(x, y, 'ocker');
      if (!(p.tod && f >= 1)) { P.el(ox - 1, oy, 2.2, 4, 'k0', true); P.glow(ox - 1, oy, 6, 0.8, 'glutDim', 'k3'); P.set(ox - 1, oy, 'kern'); P.set(ox - 1, oy + 1, 'glut'); P.set(ox - 1, oy - 1, 'glut'); augen.push([ox - 1, oy]); }
      // Tuch: schwerer Samt, Falten senkrecht, Saum
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, TUCH)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        if (!p2) { for (const o of [108, 116, 125, 134, 142]) { const lx2 = o + (y - 100) * (o - 116) * 0.004; if (y > 70 && Math.abs(x - lx2) < 0.6) P.set(x, y, 'k0'); else if (y > 70 && Math.abs(x - lx2 - 1) < 0.6 && B(x, y) < 0.5) P.set(x, y, 'k3'); }
          if (y > FY - 13 && y < FY - 10) P.set(x, y, y === FY - 12 ? 'k0' : 'k2');
          { let rr = x; while (ist(rr + 1, y, TUCH)) rr++; const d = rr - x; if (d < 8 && d > 1 && B(x, y) < 0.6 - d * 0.07) P.set(x, y, d < 4 ? 'k3' : 'k2'); } }
        else if ((x + y * 2) % 7 === 0) P.set(x, y, 'k0'); }
      // Füße unter dem Tuch: nass glänzend
      for (let y = FY - 8; y <= FY; y++) for (let x = 100; x < 150; x++) if (ist(x, y, FUESSE) && P.get(x, y) <= 4 && (x + y) % 4 === 0) P.set(x, y, 'nass');
      if (!p.tod && !p2) for (const x of [111, 132]) P.set(x + (f % 2), FY, 'nass');
      // Kinder (Phase 2): Nachthemd, nasses Haar, rote Augenpunkte
      for (const k of kinder) {
        const gi = gruppen.findIndex(g => g.kind === k); const hx = k.x - 1, hy = k.top + 8 * k.s;
        for (let y = r(k.top - 1); y < k.fy + 1; y++) for (let x = r(k.x - 11); x < r(k.x + 11); x++) {
          if (!ist(x, y, gi)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const dx = x + 0.5 - hx, dy = y + 0.5 - hy;
          if (Math.hypot(dx / (7.6 * k.s), dy / (8 * k.s)) < 1) { if (dy < -4.5 * k.s || dx > 3.5) P.set(x, y, (x + y) % 5 ? 'k1' : 'nass'); else P.set(x, y, dx < -5 ? 'k2' : (dy > 5 * k.s ? 'k2' : 'k3')); }
          else if (y > hy + 8 * k.s) { const u = x - k.x; P.set(x, y, Math.abs(u + 3 * k.s) < 0.6 || Math.abs(u - 2 * k.s) < 0.6 ? 'k1' : (u > 2 ? (B(x, y) < 0.15 ? 'kalk' : 'k3') : 'k2')); }
        }
        if (!(p.tod && f >= 1)) { P.set(hx - 3.5 * k.s, hy, 'glut'); P.set(hx + 0.5, hy, 'glut'); P.set(hx - 1.5 * k.s, hy + 4 * k.s, 'k0'); P.set(hx - 1.5 * k.s + 1, hy + 4 * k.s, 'k0'); }
      }
      // Blitz: Pulver glimmt (Leerlauf) oder flammt (Angriff); Lichtkranz gedithert, nur Akzente
      { const px = lx - 2, py = ly - 2;
        if (!p.tod) { for (let x = r(lx - 13); x <= r(lx + 9); x++) if ((x + f) % 3 === 0) P.set(x, r(ly - 1), 'glutDim'); P.set(px, py, blitz > 0.2 ? 'kern' : 'glut'); augen.push([r(px), r(py)]); }
        if (blitz > 0.5) { for (let k = 0; k < 16; k++) { const a = k / 16 * 2 * Math.PI, rr = 6 + blitz * 6; for (let d = 3; d < rr; d += 1) if (B(r(px + Math.cos(a) * d), r(py + Math.sin(a) * d)) < 0.6 - d / rr * 0.4) P.set(px + Math.cos(a) * d, py + Math.sin(a) * d, d < 5 ? 'kern' : d < 8 ? 'glut' : 'kalk'); } }
        else if (blitz > 0.2) { P.set(px - 1, py, 'glut'); P.set(px + 1, py, 'glut'); P.set(px, py - 1, 'glut'); }
      }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      { const leer = (x, y) => x < 0 || y < 0 || x >= W || y >= H || !P.get(x, y), z = [];
        for (let y = 0; y < 170; y++) for (let x = 0; x < W; x++) { const c = P.get(x, y); if (c < 1 || c > 5) continue;
          if (leer(x + 1, y) && leer(x, y - 1)) z.push([x, y, 'r2']); else if (leer(x + 1, y) || leer(x + 1, y - 1)) z.push([x, y, 'r1']); }
        for (const [x, y, c] of z) P.set(x, y, c); }
    };
    return { gruppen, details, augen };
  },
};
