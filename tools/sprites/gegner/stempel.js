// Der Stempel (Ziegelgruben). Der Mann, der den Stempel der Legion in jeden Rohling drückte, tausendmal am Tag.
// Er hat keine Hände mehr: Der hintere Unterarm endet in einem schweren rechteckigen Stempel aus Bronze, den
// er über den Kopf hebt wie einen Hammer, der vordere in einem halbmondförmigen, der bis zum Knie hängt. Die
// Stempelflächen glühen, in Spiegelschrift. Er hat keine Finger, und trotzdem ist der Abdruck in jedem Ziegel.
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
  id: 'stempel', biom: 'ziegelgruben', zone: 'ziegelgruben', w: 96, h: 120, fuss: [52, 115], kopf: [46, 4], rimBis: 113,
  varianten: {
    stempel_a: { block: [22, 12], hub: 1, mond: 'mond' },
    stempel_b: { block: [16, 16], hub: 1, mond: 'rund', gross: 2 },
  },
  // Silhouetten-Probe (verworfen): beide Stempel hängend las sich als Mann mit zwei Eimern (zu nah am Lampenputzer
  // und an der Ölerin). Der erhobene Block über dem Kopf ist die Absicht, die man schon im Stehen sieht.
  proben: { sil_haengend: { block: [22, 12], hub: 0, mond: 'mond' } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let atem = 0, lean = 0, fall = 0, schw = 0, knie = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; schw = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [3, 4, -6, -2][f]; knie = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [2, 1][f]; }
    if (p.tod) { fall = r(p.q * 16); knie = p.q * 3; lean = r(p.q * 3); }
    const T = fall, G = v.gross || 0;
    const cx = 54 + lean;
    // Beine: lang, dünn, Knie leicht durchgedrückt
    const hy = 76 + T;
    const beinV = glied([[cx - 5, hy], [cx - 9 - knie * 2, 95 + knie], [cx - 8, 112]], 3.6, 2.6, null);
    const beinH = glied([[cx + 4, hy], [cx + 6, 95], [cx + 5, 112]], 3.4, 2.4, null);
    const fuesse = [Pg([[cx - 15, 110], [cx - 6, 109], [cx - 6, 115], [cx - 16, 115]], 'dunkel', { rd: 1 }), Pg([[cx + 1, 109], [cx + 9, 109], [cx + 9, 115], [cx, 115]], 'dunkel', { rd: 1 })];
    // Rumpf: hager, vorn eingesunken, die Schultern hochgezogen (der Kopf eingezogen)
    const sy = 38 + T - G;
    const rumpf = Pg([[cx - 12, sy + 3], [cx - 4, sy - 3], [cx + 8, sy - 3], [cx + 14, sy + 3], [cx + 11, sy + 16], [cx + 7, hy - 8], [cx + 8, hy + 3], [cx - 7, hy + 3], [cx - 6, hy - 8], [cx - 10, sy + 16]], null, { rd: 2.5 });
    // Tunika-Schurz bis zum Knie, Gürtel
    const schurz = Pg([[cx - 7, hy - 10], [cx + 7, hy - 11], [cx + 12, hy + 12], [cx + 5, hy + 15], [cx - 3, hy + 12], [cx - 13, hy + 15]], 'haut', { rd: 1.5 });
    // Kopf: schmal, kahl, tief zwischen den Schultern, nach vorn geneigt
    const kx = cx - 13, ky = sy + 2;
    const kopf = Pg([[kx - 6, ky - 4], [kx - 1, ky - 7], [kx + 5, ky - 6], [kx + 6, ky + 2], [kx + 1, ky + 7], [kx - 5, ky + 6], [kx - 7, ky + 1]], 'haut', { rd: 2 });
    const hals = C(kx + 3, ky - 2, cx - 2, sy - 1, 3.4, 4.4, null);
    const schulterKragen = Pg([[cx - 13, sy + 4], [cx - 6, sy - 5], [cx + 2, sy - 1], [cx + 10, sy - 6], [cx + 15, sy + 2], [cx + 8, sy + 6], [cx - 6, sy + 7]], null, { rd: 2 });
    // hinterer Arm: Hand-Schlüsselbilder (relativ zu Schulter), Richtung des Blocks von der Hand aus (Grad)
    const shx = cx + 9, shy = sy + 1;
    let hand = [-4, -20], dir = -105;
    if (!v.hub) { hand = [8, 30]; dir = 90; }
    if (p.angriff) { hand = [[2, -22], [10, -20], [-30, 44], [-22, 20]][f]; dir = [-80, -30, 95, 170][f]; }
    if (p.treffer) { hand = [-2, -18]; dir = -100; }
    if (p.tod) { const q = Math.min(1, p.q * 1.4); hand = [-4 + q * -10, -20 + q * 60]; dir = -105 + q * 200; }
    const hx = shx + hand[0], hyy = shy + hand[1];
    const mxe = (shx + hx) / 2, mye = (shy + hyy) / 2, dl = Math.hypot(hx - shx, hyy - shy) || 1;
    const ex = mxe + (hyy - shy) / dl * 5 + 3, ey = mye - (hx - shx) / dl * 5 * (hand[0] < 0 ? -1 : 1);
    const armH = glied([[shx, shy], [ex, ey], [hx, hyy]], 4.4, 3.2, null);
    // Block: von der Hand in Richtung dir, die Stempelfläche am fernen Ende
    const [bw, bh] = v.block, ra = dir * Math.PI / 180;
    const dx = Math.cos(ra), dy = Math.sin(ra);
    const nx = -dy, ny = dx;
    const bc = [hx + dx * (bh / 2 + 3), hyy + dy * (bh / 2 + 3)];
    const ecke = (u, w) => [bc[0] + nx * u + dx * w, bc[1] + ny * u + dy * w];
    const block = Pg([ecke(-bw / 2, -bh / 2), ecke(bw / 2, -bh / 2), ecke(bw / 2, bh / 2), ecke(-bw / 2, bh / 2)], null, { rd: 0.8, b: 3 });
    const griff = C(hx, hyy, bc[0] - dx * (bh / 2 - 1), bc[1] - dy * (bh / 2 - 1), 2.4, 2.4, 'dunkel');
    // vorderer Arm: hängt, endet in einem Halbmond-Stempel auf Kniehöhe
    const svx = cx - 9, svy = sy + 3;
    const mx = cx - 17 + schw * 0.5, my = 84 + T - G;
    const armV = glied([[svx, svy], [cx - 15, sy + 20], [mx, my - 6]], 3.2, 2.6, null);
    const mond = v.mond === 'mond'
      ? Pg([[mx - 9, my - 3], [mx - 3, my - 6], [mx + 3, my - 6], [mx + 9, my - 3], [mx + 9, my + 1], [mx + 5, my - 1], [mx, my - 2], [mx - 5, my - 1], [mx - 9, my + 1]], null, { rd: 1.2 })
      : E(mx, my - 2, 7, 5.5, null, { pf: 'bevel' });
    const mondHals = C(mx, my - 6, mx, my - 3, 2, 2.4, 'dunkel');
    const gruppen = [
      { p: armH, k: 1.2, kante: true },
      { p: beinH, k: 1.5 },
      { p: [fuesse[1]], k: 0, kante: true },
      { p: [rumpf], k: 2 },
      { p: [schurz], k: 1, kante: true, tone: -0.1 },
      { p: beinV, k: 1.5, kante: true },
      { p: [fuesse[0]], k: 0, kante: true },
      { p: [schulterKragen], k: 1, kante: true },
      { p: [hals], k: 1 },
      { p: [kopf], k: 0, kante: true },
      { p: [griff], k: 0, kante: true },
      { p: [block], k: 0, kante: true, tone: 0.15 },
      { p: armV, k: 1.2, kante: true },
      { p: [mondHals], k: 0 },
      { p: [mond], k: 0, kante: true, tone: 0.15 },
    ];
    const RUMPF = 3, SCHURZ = 4, KRAGEN = 7, KOPF = 9, BLOCK = 11, MOND = 14;
    gruppen.forEach(g => { g.anker = [lean, T]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('ziegelgruben'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      const ist = (x, y, g) => gid[r(y) * W + r(x)] === g;
      // Tunika: drei Falten vom Gürtel nach unten, Saum dunkel, Gürtel mit Schnalle
      for (let i = 0; i < 3; i++) for (let y = r(hy - 8); y < hy + 14; y++) { const x = r(cx - 6 + i * 6 + (y - hy) * (i - 1) * 0.15); if (ist(x, y, SCHURZ) && P.get(x, y) <= 4) { P.set(x, y, 'k0'); if (ist(x + 1, y, SCHURZ) && P.get(x + 1, y) <= 4 && LIB.bay(x - lean, y - T) < 0.6) P.set(x + 1, y, 'k3'); } }
      for (let x = r(cx - 12); x <= r(cx + 12); x++) { const y = r(hy - 10 + (x - cx) * -0.05); if (ist(x, y, SCHURZ) || ist(x, y, RUMPF)) { P.set(x, y, 'k0'); P.set(x, y - 1, x > cx ? 'r1' : 'k3'); } }
      P.auf(r(cx - 2), r(hy - 11), 'ziegel');
      // Rumpf: Schlüsselbein und eingesunkene Brust
      for (let i = 0; i < 4; i++) for (let t = 0; t < 1; t += 0.1) { const x = r(cx - 6 + t * 10), y = r(sy + 8 + i * 4 + Math.sin(t * 3) * 1); if (ist(x, y, RUMPF) && P.get(x, y) <= 4) P.set(x, y, i % 2 ? 'k3' : 'k0'); }
      // Kragen: Saum
      for (let x = 0; x < W; x++) for (let y = r(sy - 7); y < sy + 9; y++) if (ist(x, y, KRAGEN) && !ist(x, y + 1, KRAGEN) && P.get(x, y) <= 4) P.set(x, y, 'k0');
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Stempelfläche des Blocks: die Kante in Schlagrichtung glüht, darin Zeichen in Spiegelschrift (dunkle Striche)
      {
        const glutig = p.tod ? Math.max(0, 1 - p.q * 2) : 1;
        for (let u = -bw / 2 + 1; u <= bw / 2 - 1; u += 0.5) for (let w = bh / 2 - 2.5; w <= bh / 2 - 0.5; w += 0.5) {
          const [x, y] = ecke(u, w); if (!ist(x, y, BLOCK)) continue; const tief = w > bh / 2 - 1.2;
          if (glutig > 0.3) P.set(x, y, tief ? (Math.abs(u) < bw * 0.3 ? 'glut' : 'glutDim') : (((Math.round(u * 2) % 5) === 0) ? 'k0' : 'glutDim'));
        }
        if (glutig > 0.3) { const [gx, gy] = ecke(0, bh / 2); P.glow(gx, gy, 8, 0.55 * glutig, 'glutDim', 'k3'); augen.push([r(gx), r(gy)]); }
        // Bronze-Fase: die andere Seite des Blocks fängt Licht in Ziegelrot (Patina der Glut)
        for (let u = -bw / 2 + 1; u <= bw / 2 - 1; u += 0.5) { const [x, y] = ecke(u, -bh / 2 + 1.5); if (ist(x, y, BLOCK) && P.get(r(x), r(y)) <= 4) P.set(x, y, 'k3'); }
        // ein Fingerabdruck auf dem Block, obwohl er keine Finger hat
        { const [x, y] = ecke(bw * 0.18, 0); if (ist(x, y, BLOCK)) { P.set(x, y, 'ziegel'); P.set(x + 1, y, 'k0'); P.set(x - 1, y, 'k0'); P.set(x, y - 1, 'k0'); P.set(x, y + 1, 'k0'); } }
      }
      // Halbmond: die Unterkante glüht
      for (let x = r(mx - 9); x <= r(mx + 9); x++) { let y = r(my + 4); while (y > my - 8 && !ist(x, y, MOND)) y--; if (ist(x, y, MOND) && !p.tod) { P.set(x, y, Math.abs(x - mx) < 4 ? 'glut' : 'glutDim'); } }
      if (!p.tod) { P.glow(mx, my + 2, 7, 0.5, 'glutDim', 'k3'); augen.push([r(mx), r(my + 1)]); }
      // Augen: zwei schmale Schlitze, nach unten auf den nächsten Rohling gerichtet
      if (!p.tod || f < 1) {
        const ex = r(kx - 3), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey, 'glut'); P.glow(ex + 2, ey + 0.5, 3.5, 0.5);
        P.auf(ex, ey - 1, 'k0'); P.auf(ex + 1, ey - 1, 'k0'); P.auf(ex + 4, ey - 1, 'k0');
        for (let i = 0; i < 3; i++) P.auf(ex + i, ey + 4, 'k0');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, dy: atem };
  },
};
