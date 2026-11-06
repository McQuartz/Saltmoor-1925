// Das Zugedeckte (Waisenhaus am Deich). Ein Kind im Nachthemd, die Decke um die Schultern gezogen, mit beiden
// Fäusten vor der Brust zusammengehalten. Die Decke geht mit: grobe Anstaltswolle mit zwei Streifen und einer
// Nummer, nass seit 1913, und sie ist viel zu lang. Sie schleppt hinter dem Kind über das Linoleum, und unter
// der Schleppe liegen noch welche. Am Saum schauen ihre Hände heraus.
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
  id: 'zugedeckte', biom: 'waisenhaus', zone: 'waisenhaus', w: 96, h: 120, fuss: [32, 115], kopf: [30, 52], rimBis: 113,
  varianten: {
    // a: zwei Buckel unter der Schleppe, drei Hände am Saum
    zugedeckte_a: { buckel: [[60, 21], [79, 13]], haende: [55, 70, 86], kx: 30 },
    // b: die Decke über den Kopf gezogen wie eine Kapuze; drei Buckel, unter dem vordersten schaut ein Gesicht heraus
    zugedeckte_b: { buckel: [[56, 18], [70, 22], [85, 11]], haende: [64, 78], kx: 30, kapuze: true, gesicht2: true },
  },
  // Silhouetten-Proben (verworfen): 1) das Kind kriecht ganz unter der Decke, vorn schaut der Kopf heraus; schwarz ein
  // Felsbrocken, vom Kind blieb nichts. 2) das Kind steht, die Decke über dem Kopf bis zum Boden: ein Kegel mit Augen,
  // das Bettlaken-Gespenst (Klischee) und zu nah am Chorknaben. Genommen: Kind sichtbar, die Decke als lange Schleppe.
  proben: { sil_kegel: { buckel: [], haende: [], kx: 46, kegel: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120, FY = 114;
    let atem = 0, lean = 0, dx = 0, platt = 0, auf = 0, buck = 0, tropf = f;
    // lean: Kind neigt sich (negativ nach vorn), auf: die Decke wird vorn aufgeschlagen (Arme auseinander), buck: Buckel heben sich
    if (p.idle) { atem = [0, 0, 1, 1][f]; buck = [0, 1, 1, 0][f]; }
    if (p.angriff) { lean = [2, 4, -6, -2][f]; dx = [1, 2, -7, -3][f]; auf = [0.3, 0.8, 1, 0.4][f]; buck = [1, 2, 0, 0][f]; }
    if (p.treffer) { lean = [3, 1][f]; dx = [2, 1][f]; }
    if (p.tod) { platt = Math.min(1, p.q * 1.4); }
    const cx = v.kx + dx, T = r(platt * 30);
    // Kind: Beine nackt und dünn unter dem Nachthemd, Kopf groß
    const beine = platt > 0.5 ? [] : [...glied([[cx - 3, FY - 16], [cx - 4, FY - 6], [cx - 4, FY - 1]], 2, 1.6, 'haut'), ...glied([[cx + 3, FY - 16], [cx + 3, FY - 6], [cx + 4, FY - 1]], 2, 1.6, 'haut'), C(cx - 4, FY, cx - 8, FY, 1.3, 1, 'haut'), C(cx + 4, FY, cx, FY, 1.3, 1, 'haut')];
    const hemd = Pg([[cx - 9 + lean * 0.5, FY - 44 + T], [cx + 8 + lean * 0.5, FY - 44 + T], [cx + 10, FY - 14], [cx - 11, FY - 14]], 'haut', { rd: 1.5, tone: 0.15 });
    const ky = FY - 54 + T + atem, kx = cx - 1 + lean;
    const kopf = E(kx, ky, 7.2, 7.8, 'haut', { pf: 'bevel' });
    // Decke: über die Schultern, vorn zwei Zipfel zu den Fäusten, hinten die Schleppe mit Buckeln
    const sch = FY - 46 + T;
    let schleppe = [];
    if (v.kegel) schleppe = [Pg([[cx - 14, FY], [cx - 10, FY - 40], [cx - 4, FY - 66], [cx + 6, FY - 66], [cx + 12, FY - 40], [cx + 16, FY]], null, { rd: 3 })];
    else {
      const k = 1 - platt * 0.8;
      const pts = [[cx - 10 + lean, sch + 2], [cx - 6 + lean, sch - 3 - (v.kapuze ? 14 : 0)], [cx + 4 + lean, sch - 4 - (v.kapuze ? 16 : 0)], [cx + 12 + lean * 0.5, sch - (v.kapuze ? 6 : 0)], [cx + 16, sch + 10]];
      // Rücken der Schleppe mit Buckeln (darunter liegen welche)
      let lx = cx + 18;
      const bk = v.buckel.map(([bx, bh], i) => [bx + dx * 0.4, bh * k + (p.idle ? (i === v.buckel.length - 1 ? buck : 0) : buck)]);
      pts.push([lx, FY - 28 * k]);
      for (const [bx, bh] of bk) { pts.push([bx - 7, FY - Math.max(8, bh - 6) * 1]); pts.push([bx - 2, FY - bh]); pts.push([bx + 3, FY - bh + 1]); pts.push([bx + 7, FY - Math.max(6, bh - 7)]); }
      pts.push([94, FY - 2], [94, FY], [cx + 12, FY], [cx + 12, FY - 12], [cx + 10, sch + 14]);
      schleppe = [Pg(pts, null, { rd: 1.8 })];
    }
    // vordere Zipfel: von der Schulter zu den Fäusten vor der Brust; im Angriff aufgeschlagen
    const fx = cx - 6 + lean - auf * 8, fy = FY - 36 + T - auf * 10;
    const zipfel = v.kegel ? [] : [Pg([[cx - 10 + lean, sch + 1], [cx - 4 + lean, sch - 1], [fx + 4, fy + 2], [fx + 1, fy + 10 + auf * 6], [cx - 12 + lean - auf * 6, FY - 18 - auf * 8]], null, { rd: 1.5 })];
    const faust = v.kegel ? [] : [E(fx, fy, 2.6, 2.6, 'haut'), E(fx + 3, fy + 1, 2.2, 2.2, 'haut')];
    // Hände unter dem Saum der Schleppe
    const haende = [];
    if (!v.kegel) v.haende.forEach((hx, i) => {
      if (platt > 0.5 && i > 0) return;
      const x = hx + dx * 0.5 - (p.angriff && f === 2 ? 3 : 0), y = FY;
      haende.push(E(x + 1, y - 1.2, 2.4, 1.5, 'haut'));
      for (let j = 0; j < 4; j++) haende.push(C(x, y - 2.2 + j * 0.85, x - 3.4 - (j === 1 || j === 2 ? 0.8 : 0), y - 2.4 + j * 1.05, 0.5, 0.45, 'haut', { pf: 'flat' }));
    });
    const gesicht2 = v.gesicht2 && platt < 0.5 ? [E(v.buckel[0][0] - 9 + dx * 0.4, FY - 3, 3.4, 3.2, 'haut', { pf: 'bevel' })] : [];
    const gruppen = [
      { p: schleppe, k: 1.5, kante: true },
      { p: beine, k: 0.6, kante: true },
      { p: [hemd], k: 1, kante: true },
      { p: v.kegel ? [] : [kopf], k: 0.5, kante: true },
      { p: zipfel, k: 1, kante: true },
      { p: faust, k: 0.4, kante: true },
      { p: haende, k: 0.3, kante: true },
      { p: gesicht2, k: 0.3, kante: true },
    ];
    const DECKE = 0, BEIN = 1, HEMD = 2, KOPF = 3, ZIPF = 4, FAUST = 5, HAND = 6, G2 = 7;
    gruppen.forEach(g => { g.anker = [dx, 0]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('waisenhaus'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
      const b = (x, y) => LIB.bay(x - dx, y);
      const hs = (x, y) => { const h = Math.sin((x - dx) * 12.9898 + (y - T) * 78.233) * 43758.5453; return h - Math.floor(h); };
      // Decke: Streifen am Saum entlang (Abstand zum Rand), Falten, nasse Flecken, Saum dunkel
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const g = gid[y * W + x]; if (g !== DECKE && g !== ZIPF) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const u = FY - y;
        if (g === DECKE && x > cx + 14) {
          if (u === 6 || u === 7 || u === 10) P.set(x, y, u === 7 ? 'k3' : 'k0');
          if (u === 6 && b(x, y) < 0.25) P.set(x, y, 'kalk');
          if (u <= 1) P.set(x, y, 'k0');
          // Falten fallen von den Buckeln
          for (const [bx] of v.buckel) for (const o of [-6, 4]) { const lx = bx + dx * 0.4 + o - (u - 6) * 0.25 * Math.sign(o); if (Math.abs(x - lx) < 0.6 && u > 2 && u < 20) P.set(x, y, 'k0'); else if (Math.abs(x - lx - 1) < 0.6 && u > 2 && u < 20 && b(x, y) < 0.5) P.set(x, y, 'k3'); }
        }
        if (g === ZIPF) { const d = x - (cx - 12 + lean); if (!ist(x - 1, y, ZIPF)) P.set(x, y, 'k3'); else if (!ist(x - 2, y, ZIPF) && (y % 4 === 0)) P.set(x, y, 'kalk'); }
        if (hs(x, y) > 0.975 && u > 8) P.set(x, y, 'nass');
      }
      // gestempelte Nummer auf der Schleppe
      if (!v.kegel && platt < 0.7) { const nx = r(cx + 26 + dx * 0.4), ny = FY - 15; for (let yy = ny - 2; yy <= ny + 2; yy++) for (let xx = nx - 3; xx <= nx + 3; xx++) if (ist(xx, yy, DECKE)) P.set(xx, yy, (xx === nx - 1 || xx === nx + 1) && yy > ny - 2 && yy < ny + 2 ? 'k0' : 'k3'); }
      // Nachthemd: Knopfleiste, Saum, Falte; hell an der Lichtseite
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, HEMD)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; if (!ist(x, y + 1, HEMD)) P.set(x, y, 'k1'); else if (Math.abs(x - (cx + 3)) < 0.6 && b(x, y) < 0.6) P.set(x, y, 'k1'); else if (x > cx + 6 && !ist(x + 1, y, HEMD) && (y & 1)) P.set(x, y, 'kalk'); }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Kopf: Haar nass und angeklebt, Strähnen bis auf die Schultern; Gesicht blass; Augen rot
      if (!v.kegel) {
        for (let y = r(ky - 9); y <= r(ky + 9); y++) for (let x = r(kx - 8); x <= r(kx + 8); x++) {
          if (!ist(x, y, KOPF)) continue; const c = P.get(x, y); if (c < 1 || c > 6) continue; const dx2 = x + 0.5 - kx, dy2 = y + 0.5 - ky;
          const haar = dy2 < -2.5 + Math.max(0, dx2) * 0.35 || dx2 > 2.5;
          if (haar) { if (c <= 4) P.set(x, y, ((x + 2 * y) % 7 === 0) ? 'nass' : (dy2 < -5 ? 'k2' : 'k1')); }
          else if (c <= 4) P.set(x, y, dx2 < -4 ? 'k2' : 'k3');
        }
        // Strähnen über die Stirn und hinter dem Ohr herab
        for (const [sx, l] of [[kx - 4, 4], [kx - 1, 3], [kx + 4, 10], [kx + 6, 12]]) for (let i = 0; i < l; i++) P.set(sx, ky - 3 + i + (sx > kx ? 3 : 0), i % 3 === 2 ? 'nass' : 'k0');
        if (!p.tod) P.set(kx + 6, ky + 11 + (tropf % 2) * 2, 'nass');
        if (!(p.tod && f >= 1)) { P.glow(kx - 3, ky + 1, 6, 0.8, 'glutDim', 'k3'); P.set(kx - 5, ky + 1, 'kern'); P.set(kx - 4, ky + 1, 'glut'); P.set(kx - 1, ky + 1, 'glut'); augen.push([r(kx - 5), r(ky + 1)]); }
        P.auf(kx - 4, ky + 4, 'k1'); P.auf(kx - 3, ky + 5, 'k0');
      }
      if (gesicht2.length && !(p.tod && f >= 1)) { const g2 = gesicht2[0]; P.set(g2.x - 2, g2.y - 0.5, 'glut'); P.set(g2.x, g2.y - 0.5, 'glut'); for (let i = -3; i <= 2; i++) P.auf(g2.x + i, g2.y - 3, 'nass'); }
      // Fäuste und Hände: Knöchel blass
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const g = gid[y * W + x]; if (g !== FAUST && g !== HAND) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; if (!ist(x - 1, y, g) && (y & 1)) P.set(x, y, 'kalk'); }
      // Beine: Schienbein mit Licht, Schatten innen
      for (let y = FY - 15; y < FY; y++) for (let x = 0; x < W; x++) if (ist(x, y, BEIN) && P.get(x, y) <= 4) P.set(x, y, ist(x + 1, y, BEIN) ? (ist(x - 1, y, BEIN) ? 'k2' : 'k1') : 'r1');
      // Tropfen vom Saum und eine nasse Spur auf dem Linoleum
      if (!p.tod) for (let i = 0; i < 5; i++) { const tx = r(cx - 14 + i * 5), ty = FY + 1; if (!P.get(tx, ty) && (i + f) % 2) P.set(tx, ty, 'nass'); }
      // Lichtkante oben auf Schleppe und Schultern kräftig
      const z = [];
      for (let y = 0; y < 112; y++) for (let x = 0; x < W; x++) { const g = gid[y * W + x]; if (g !== DECKE) continue; const c = P.get(x, y); if (c < 1 || c > 5) continue; if (!P.get(x, y - 1) || !P.get(x + 1, y - 1)) z.push([x, y, 'r2']); else if ((!P.get(x, y - 2) || !P.get(x + 2, y - 1)) && b(x, y) < 0.7) z.push([x, y, 'r1']); }
      for (const [x, y, c] of z) P.set(x, y, c);
    };
    return { gruppen, details, augen };
  },
};
