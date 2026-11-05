// Zweiter Wächter Kloster: Der Adler vom Lesepult. Der Messingadler, auf dessen Flügeln im Refektorium das
// Buch lag, aus dem vorgelesen wurde. Er ist von seiner Säule gestiegen und steht auf eigenen Krallen, das
// Buch trägt er weiter auf dem Rücken. Seine Federn sind Seiten, beschrieben, und jede Nacht wächst eine nach;
// die Federkiele der Schreiber sind alle aus ihm gerupft, und wo sie fehlen, ist es nass von Tinte.
// Phase 2 (adlerpult_p2): Das Buch fällt, die Flügel gehen hoch wie im Wappen, der Kopf schreit.
// Randlicht Messing (Zone kloster_w2): Die Wächter-Szene ist Pergament und Silbergrau, Messing kommt dort nicht vor.
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
  id: 'adlerpult', biom: 'kloster', zone: 'kloster_w2', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 4], rimBis: 172,
  varianten: { adlerpult: { flug: 0 }, adlerpult_p2: { flug: 1 } },
  // Silhouetten-Probe (verworfen): der Adler noch auf seiner Säule. Schwarz ein Kapitell mit Flügeln auf einem
  // Schaft, zu nah am Kreuzgangwächter im selben Biom. Genommen: von der Säule gestiegen, auf eigenen Krallen.
  proben: { probe_saeule: { flug: 0, saeule: true } },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, W = 160, H = 180, FY = 175, fl = v.flug;
    // ang: Flügelwinkel (Grad über der Waagerechten), kx/ky: Kopf, lean: Körper, hub: Körper hebt sich (Phase 2)
    let ang = fl ? 52 : 8, lean = 0, kopfV = 0, schrei = fl ? 1 : 0, fall = 0, hub = fl ? -8 : 0, atem = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; kopfV = [0, 1, 1, 0][f]; }
    if (p.angriff) { ang += fl ? [12, 20, -40, -18][f] : [22, 36, -14, -6][f]; lean = [3, 5, -13, -6][f]; kopfV = [-2, -4, 6, 3][f]; schrei = [0, 1, 2, 1][f] || schrei; }
    if (p.treffer) { lean = [4, 2][f]; ang += 6; }
    if (p.tod) { fall = r(p.q * 30); ang = (fl ? 52 : 8) - p.q * 50; lean = r(p.q * 4); }
    const L = lean, T = atem + fall + hub;
    const saeule = !!v.saeule, SY = saeule ? -46 : 0; // Probe: alles höher auf einer Säule
    const cx = 82 + L * 0.4, cy = 108 + T + SY;
    // Rumpf: Brust tropfenförmig, Hals nach vorn links, Kopf mit Hakenschnabel
    const brust = E(cx, cy, 15, 25, null);
    const bauch = Pg([[cx - 13, cy + 6], [cx + 13, cy + 6], [cx + 8, cy + 30], [cx - 8, cy + 30]], null, { rd: 3 });
    const kx = cx - 22 + L * 0.8 - kopfV * 0.3 + (fl ? 6 : 0), ky = cy - (fl ? 44 : 40) + kopfV + (fl ? 0 : 0);
    const hals = C(cx - 4, cy - 16, kx + 3, ky + 3, 8, 5, null);
    const kopf = E(kx, ky, 9, 8, null);
    const sp = schrei >= 2 ? 6 : schrei ? 3 : 0;
    const schnabelO = Pg([[kx - 5, ky - 3], [kx - 17, ky - 1], [kx - 20, ky + 3], [kx - 18, ky + 6], [kx - 15, ky + 2], [kx - 6, ky + 2]], 'haut', { rd: 0.6 });
    const schnabelU = Pg([[kx - 6, ky + 3 + sp * 0.3], [kx - 15, ky + 4 + sp], [kx - 13, ky + 6 + sp], [kx - 4, ky + 6]], 'haut', { rd: 0.5 });
    // Schwanz: Fächer aus Seiten hinter den Beinen
    const schwanz = [Pg([[cx - 6, cy + 24], [cx + 8, cy + 24], [cx + 22, cy + 56], [cx + 4, cy + 60], [cx - 14, cy + 56]], null, { rd: 1.5 })];
    // Beine: befiederte Hosen, nackte Läufe, Krallen auf dem Boden (bzw. auf der Säule)
    const bodenY = saeule ? 128 : FY;
    const bein = s => { const hx = cx + s * 7, hy = cy + 26, fx = cx + s * 10 - (fl ? 6 : 0), fy = fl ? cy + 52 : bodenY - 3;
      const o = [E(hx, hy, 6, 7, null), C(hx, hy + 4, fx, fy, 2.4, 2, 'haut')];
      for (const k of [-1, 0, 1]) o.push(C(fx, fy, fx - 6 + k * 5, fy + (fl ? 5 : 3) + Math.abs(k), 1.4, 0.8, 'haut'));
      o.push(C(fx, fy, fx + 5, fy + 2, 1.2, 0.8, 'haut')); return o; };
    // Flügel: Knochen in zwei Gliedern, daran Seiten-Federn wie ein Fächer
    const fluegel = s => {
      const a = ang * Math.PI / 180, sx0 = cx + s * 9, sy0 = cy - 14;
      const ell = [sx0 + s * Math.cos(a * 0.7) * 18, sy0 - Math.sin(a * 0.7) * 18];
      const hand = [ell[0] + s * Math.cos(a) * 21, ell[1] - Math.sin(a) * 21];
      const o = [C(sx0, sy0, ell[0], ell[1], 7, 5.5, null), C(ell[0], ell[1], hand[0], hand[1], 5.5, 3.2, null)];
      const fed = [];
      const n = 8;
      for (let i = 0; i < n; i++) {
        const q = 0.12 + i / (n - 1) * 0.88;
        const bx = q < 0.45 ? sx0 + (ell[0] - sx0) * (q / 0.45) : ell[0] + (hand[0] - ell[0]) * ((q - 0.45) / 0.55);
        const by = q < 0.45 ? sy0 + (ell[1] - sy0) * (q / 0.45) : ell[1] + (hand[1] - ell[1]) * ((q - 0.45) / 0.55);
        const fa = a - (Math.PI / 2) * (1.05 - q * 0.75) - (fl ? 0 : 0.08); // Feder zeigt nach unten außen
        const len = 17 + q * 12;
        const dx = s * Math.cos(fa), dy = -Math.sin(fa);
        const nx = -dy * s, ny = dx * s; const b = 3.4 - q * 0.6;
        const tx = bx + dx * len, ty = by + dy * len;
        fed.push({ i, pts: [[bx - nx * b, by - ny * b], [bx + nx * b, by + ny * b], [tx + nx * b * 0.9, ty + ny * b * 0.9], [tx - nx * b * 0.4 + dx * 3, ty - ny * b * 0.4 + dy * 3], [tx - nx * b, ty - ny * b]], dx, dy, nx, ny, bx, by, len });
      }
      return { arm: o, fed, hand };
    };
    const FL = fluegel(-1), FR = fluegel(1);
    // Buch auf dem Rücken (Phase 1) bzw. aufgeschlagen am Boden (Phase 2)
    const buch = [];
    let bx0 = cx + 6, by0 = cy - 30;
    if (fl || (p.tod && f >= 2)) { bx0 = 30; by0 = FY - 8; }
    const bw = 25;
    buch.push(Pg([[bx0 - bw, by0 + 2], [bx0, by0 + 6], [bx0 + bw, by0 + 2], [bx0 + bw + 1, by0 - 4], [bx0, by0], [bx0 - bw - 1, by0 - 4]], 'haut', { rd: 0.5, pf: 'flat', tone: 0.35 }));
    const deckel = [Pg([[bx0 - bw - 2, by0 + 3], [bx0, by0 + 8], [bx0 + bw + 2, by0 + 3], [bx0 + bw + 2, by0 + 6], [bx0, by0 + 10], [bx0 - bw - 2, by0 + 6]], 'dunkel', { rd: 0.4 })];
    const saeuleF = saeule ? [Pg([[74, 130], [90, 130], [88, 168], [96, 175], [64, 175], [72, 168]], null, { rd: 1 }), E(82, 130, 14, 4, null)] : [];
    const gruppen = [
      { p: saeuleF, k: 1, kante: true },
      { p: FR.arm, k: 1.5, kante: true },
      { p: FR.fed.map(q => Pg(q.pts, null, { rd: 0.5 })), k: 0, kante: true, feder: FR },
      { p: schwanz, k: 1, kante: true },
      { p: bein(1), k: 1, kante: true },
      { p: [brust, bauch], k: 3, kante: true },
      { p: bein(-1), k: 1, kante: true },
      { p: deckel, k: 0, kante: true },
      { p: buch, k: 0, kante: true },
      { p: FL.arm, k: 1.5, kante: true },
      { p: FL.fed.map(q => Pg(q.pts, null, { rd: 0.5 })), k: 0, kante: true, feder: FL },
      { p: [hals, kopf], k: 3, kante: true },
      { p: [schnabelU], k: 0, kante: true },
      { p: [schnabelO], k: 0, kante: true },
    ];
    const FEDR = 2, SCHWANZ = 3, BRUST = 5, BUCH = 8, FEDL = 10, KOPF = 11, SCHO = 13;
    gruppen.forEach((g, i) => { g.anker = [r(L * 0.4), T]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('kloster_w2'), { rimBis: 172 });
    const augen = [];
    const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
    const details = P => {
      const B = (x, y) => LIB.bay(x - r(L * 0.4), y - T);
      // Federn: jede eine Seite. Helle Fläche zur Lichtseite, Zeilen in Tinte, Kiel dunkel, Kante zwischen den Federn
      for (const [gi, F] of [[FEDR, FR], [FEDL, FL]]) {
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          if (!ist(x, y, gi)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
          // welche Feder?
          let best = null, bd = 1e9; for (const q of F.fed) { const ux = x + 0.5 - q.bx, uy = y + 0.5 - q.by; const along = ux * q.dx + uy * q.dy, quer = ux * q.nx + uy * q.ny; if (along < -1 || along > q.len + 3) continue; const d = Math.abs(quer); if (d < bd) { bd = d; best = { q, along, quer }; } }
          if (!best) continue; const { q, along, quer } = best;
          if (Math.abs(quer) < 0.6 && along < q.len * 0.85) { P.set(x, y, 'k0'); continue; }
          const zeile = Math.floor(along / 2.2) % 2 === 0 && along > 4 && along < q.len - 2 && Math.abs(quer) > 1.2;
          const hell = quer > 0 === (gi === FEDR) ? 1 : 0;
          if (zeile && ((r(along) * 7 + r(quer) * 3) % 5)) P.set(x, y, hell ? 'k2' : 'k0');
          else P.set(x, y, hell ? (along > q.len * 0.55 ? (B(x, y) < 0.6 ? 'r1' : 'k3') : (B(x, y) < 0.3 ? 'r1' : 'k3')) : (B(x, y) < 0.35 ? 'k3' : 'k2'));
        }
      }
      // Brust: Federschuppen (Bögen), Licht von rechts als Fase
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, BRUST)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const u = x - cx, w = y - cy; const row = Math.floor((w + 40) / 5), off = row % 2 ? 3 : 0; const sx = ((u + 40 + off) % 6 + 6) % 6, sy = ((w + 40) % 5 + 5) % 5;
        if (sy === 4 && sx > 0 && sx < 5) P.set(x, y, 'k0'); else if (sy === 3 && sx > 1 && sx < 4 && u > -4) P.set(x, y, 'k3');
        else if (u > 8 && B(x, y) < 0.5) P.set(x, y, 'k3');
      }
      // Kopf: Federn am Hinterkopf, Auge, Schnabel hell (Messing blank gegriffen)
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (ist(x, y, SCHO) && P.get(x, y) <= 4) P.set(x, y, (x + y) % 3 ? 'r1' : 'k3'); }
      const ex = r(kx - 2), ey = r(ky - 2);
      if (!(p.tod && f >= 1)) { P.glow(ex, ey, 6, 0.8, 'glutDim', 'k3'); P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex - 1, ey - 1, 'k0'); P.set(ex, ey - 1, 'k0'); augen.push([ex, ey]); }
      // Buch: Seiten mit Zeilen, Bundsteg dunkel, eine Initiale glimmt (inneres Licht)
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, BUCH)) continue; const c = P.get(x, y); if (c < 1 || c > 6) continue;
        const u = x - bx0; if (Math.abs(u) < 1) { P.set(x, y, 'k0'); continue; }
        const yy = y - by0 + Math.abs(u) * 0.18; P.set(x, y, (Math.floor(yy) % 2 === 0 && Math.abs(u) > 3 && Math.abs(u) < bw - 2 && (x % 5)) ? 'k1' : (u > 0 ? 'r1' : 'k3'));
      }
      if (!p.tod) { const ix = bx0 - 14, iy = by0 + 1; P.set(ix, iy, 'glut'); P.set(ix + 1, iy, 'glutDim'); P.set(ix, iy - 1, 'glutDim'); P.glow(ix, iy, 4, 0.5, 'glutDim', 'k3'); }
      // Tinte tropft, wo Kiele gerupft sind (Phase 2 stärker)
      if (!p.tod) for (const q of [FL.fed[2], FR.fed[3], FL.fed[5]]) { const tx = q.bx + q.dx * q.len * 0.5, ty = q.by + q.dy * q.len * 0.5; P.auf(tx, ty, 'glutDim'); if (fl) { P.set(tx, ty + 3 + (f % 2) * 2, 'glutDim'); } }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Randlicht kräftig zur Lichtseite
      { const leer = (x, y) => x < 0 || y < 0 || x >= W || y >= H || !P.get(x, y), z = [];
        for (let y = 0; y < 172; y++) for (let x = 0; x < W; x++) { const c = P.get(x, y); if (c < 1 || c > 5) continue;
          if (leer(x + 1, y) && leer(x, y - 1)) z.push([x, y, 'r2']); else if (leer(x + 1, y) || leer(x + 1, y - 1)) z.push([x, y, 'r1']); }
        for (const [x, y, c] of z) P.set(x, y, c); }
    };
    return { gruppen, details, augen };
  },
};
