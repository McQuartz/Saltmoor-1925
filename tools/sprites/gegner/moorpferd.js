// Moorwald, zweiter Wächter: Das Moorpferd. Der Kaltblüter der Torfstecher, der 1881 mit dem vollen Torfwagen
// am Steinkreis eingebrochen ist. Er steht wieder, bis über die Fesseln im Moor, und seine Beine sind doppelt
// so lang wie die eines Pferdes. Der Kopf ist blank bis auf den Knochen, am Kummet hängt noch die Laterne der
// Torfstecher. Die Zugstränge und die Leine laufen vom Kummet straff nach unten ins Moor: Unten hält sie
// jemand und fährt.
'use strict';
const KA = require('./hilfe/kanten');
const LIB = require('../lib');

module.exports = {
  id: 'moorpferd', biom: 'moor', zone: 'moor_pferd', rang: 'waechter', w: 160, h: 180, fuss: [100, 174], kopf: [96, 30], rimBis: 168,
  varianten: { moorpferd: {} },
  // Silhouetten-Probe (nicht gebaut): ein Pferd mit gewöhnlich langen Beinen und erhobenem Kopf. Schwarz ein
  // Reiterdenkmal ohne Reiter, nichts Falsches daran. Genommen: Stelzenbeine und der Kopf tief vorn am Boden.
  proben: { probe_normal: { normal: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, saum, r } = A;
    const f = p.f, W = 160, H = 180;
    let X = 0, Y = 0, kopfY = 0, kopfX = 0, huf = 0, fall = 0, lat = 0, schweif = 0;
    if (p.idle) { kopfY = [0, 1, 2, 1][f]; lat = [0, 1, 0, -1][f]; schweif = [0, 1, 1, 0][f]; }
    if (p.angriff) { X = [3, 5, -7, -3][f]; Y = [-2, -4, 1, 0][f]; kopfY = [-10, -18, 6, 2][f]; kopfX = [4, 8, -12, -5][f]; huf = [0.3, 1, 0.2, 0][f]; lat = [2, 3, -4, -1][f]; schweif = [2, 3, -2, 0][f]; }
    if (p.treffer) { X = [3, 1][f]; kopfY = -3; }
    if (p.tod) { fall = r(p.q * 30); kopfY = r(p.q * 10); }
    const lang = v.normal ? 0.55 : 1;
    const FY = 170;                       // Moorspiegel
    const by = FY - 92 * lang - 4 + Y + fall; // Rücken-Unterkante etwa
    const bx = 102 + X;
    // Rumpf: schwerer Kaltblüter, Bauch hängt
    const rumpf = [E(bx + 2, by - 6, 24, 12, null), E(bx, by - 1, 20, 9, null), E(bx - 20, by - 12, 14, 15, null), E(bx + 23, by - 12, 15, 14, null), E(bx - 24, by - 24, 6, 5, null)];
    // Hals: von der Schulter steil nach vorn und tief hinunter, der Kopf hängt fast am Boden
    const hx = 50 + kopfX + X * 0.4, hy = (v.normal ? by - 30 : FY - 62) + kopfY;
    const hals = [C(bx - 26, by - 16, bx - 40, by - 4, 11, 9, null), C(bx - 40, by - 4, hx + 14, hy - 8, 9, 6, null)];
    // Kopf: Pferdeschädel, lang, blank; Unterkiefer leicht offen
    const kopf = [Pg([[hx + 16, hy - 14], [hx + 8, hy - 16], [hx + 1, hy - 10], [hx - 6, hy + 6], [hx - 9, hy + 20], [hx - 6, hy + 25], [hx - 1, hy + 24], [hx + 4, hy + 12], [hx + 14, hy], [hx + 19, hy - 7]], 'haut', { rd: 1.6 })];
    const kiefer = Pg([[hx + 12, hy + 1], [hx + 5, hy + 12], [hx + 1, hy + 23], [hx + 4, hy + 24], [hx + 8, hy + 14], [hx + 15, hy + 4]], 'haut', { rd: 0.8 });
    const ohren = [C(hx + 14, hy - 12, hx + 20, hy - 22, 2, 1, null), C(hx + 10, hy - 13, hx + 13, hy - 23, 1.8, 0.9, null)];
    // Kummet: dicker Ring um den Halsansatz, Holz und Leder
    const kx = bx - 36, ky = by - 10;
    const kummet = [];
    for (let i = 0; i < 18; i++) { const a0 = i / 18 * Math.PI * 2, a1 = (i + 1) / 18 * Math.PI * 2; kummet.push(C(kx + Math.cos(a0) * 8, ky + Math.sin(a0) * 15, kx + Math.cos(a1) * 8, ky + Math.sin(a1) * 15, 3.4, 3.4, null)); }
    kummet.push(C(kx + 2, ky - 15, kx + 6, ky - 22, 2, 1.4, null), C(kx - 2, ky - 15, kx - 4, ky - 22, 2, 1.4, null)); // Kummetspitzen
    // Laterne am Kummet, hängt nach vorn
    const lx = kx - 8 + lat, ly = ky + 18;
    const laterne = [C(kx - 6, ky + 8, lx, ly - 5, 0.7, 0.7, null, { pf: 'flat' }), Pg([[lx - 3.5, ly - 4], [lx + 3.5, ly - 4], [lx + 3, ly + 5], [lx - 3, ly + 5]], null, { rd: 0.8 }), E(lx, ly - 5, 3, 1.4, null)];
    // Beine: lange Stelzen, vorn gerade mit Knie, hinten mit Sprunggelenk; die Hufe verschwinden im Moor
    const bein = (x0, y0, kn, ende, r0) => glied([[x0, y0], kn, ende], r0, 1.6, null);
    const lb = 92 * lang;
    const beine = [
      bein(bx - 22, by + 2, [bx - 24 - huf * 10, by + lb * 0.45 - huf * 14], [bx - 22 - huf * 16, FY + 2 - huf * 22], 4),
      bein(bx - 14, by + 2, [bx - 14, by + lb * 0.45], [bx - 12, FY + 2], 3.4),
      bein(bx + 18, by, [bx + 26, by + lb * 0.38], [bx + 20, FY + 2], 4.4),
      bein(bx + 26, by - 2, [bx + 34, by + lb * 0.36], [bx + 28, FY + 2], 3.8),
    ];
    // Mähne: zerfetzt, hängt vom Hals; Schweif lang bis zum Moor
    const maehne = Pg([[bx - 26, by - 26], [bx - 40, by - 16], [hx + 18, hy - 14], ...saum(hx + 18, bx - 26, hy + 2, 7, 10, 3, 0).map(([x, y]) => [x, y + (x - hx) * 0.25 - 4]).reverse()], 'dunkel', { rd: 0.6 });
    const schweifP = Pg([[bx + 42, by - 18], [bx + 49, by - 14], [bx + 52 + schweif * 0.5, by + 6], [bx + 54 + schweif, by + 34], ...saum(bx + 46 + schweif * 2, bx + 56 + schweif * 2, by + 52, 4, 8, 7, 0).reverse(), [bx + 47 + schweif, by + 30], [bx + 45, by + 4], [bx + 40, by - 10]], 'dunkel', { rd: 0.8 });
    // Zugstränge und Leine: vom Kummet straff schräg nach hinten unten ins Moor
    const straenge = [C(kx + 4, ky + 8, bx + 4, FY + 1, 0.8, 0.7, null, { pf: 'flat' }), C(kx + 6, ky - 2, bx + 36, FY + 1, 0.7, 0.6, null, { pf: 'flat' })];
    // Moor: flache Lache um die Hufe
    const lache = [E(bx, FY + 4, 46, 4.5, 'dunkel', { pf: 'flat' })];
    const gruppen = [
      { p: lache, k: 0, noRim: true },                  // 0
      { p: [beine[1], beine[3]].flat(), k: 1, kante: true, tone: -0.1 }, // 1 hintere Beine
      { p: [schweifP], k: 0, kante: true },             // 2
      { p: rumpf, k: 6, kante: true, tone: 0.02 },      // 3
      { p: [beine[0], beine[2]].flat(), k: 1, kante: true }, // 4 vordere Beine
      { p: hals, k: 4, kante: true },                   // 5
      { p: [maehne], k: 0, kante: true },               // 6
      { p: [...ohren, ...kopf, kiefer], k: 1, kante: true, tone: 0.05 }, // 7 Kopf
      { p: kummet, k: 1.2, kante: true, tone: 0.1 },    // 8
      { p: straenge, k: 0, kante: true },               // 9
      { p: laterne, k: 0.4, kante: true },              // 10
    ];
    const LACHE = 0, RUMPF = 3, HALS = 5, MAEHNE = 6, KOPF = 7, KUM = 8, LAT = 10;
    gruppen.forEach((g, i) => { g.anker = i === 0 ? [0, 0] : [X, Y + fall]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('moor_pferd'), { rimBis: 168 });
    const augen = [];
    const details = P => {
      const B = (x, y) => LIB.bay(x - X, y - Y - fall);
      // Fell: nass, in Strähnen; Rippen zeichnen sich ab; Schulterblatt; Licht am Rücken
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const g = gid[y * W + x]; if (g !== RUMPF && g !== HALS) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        let t = c;
        if (g === RUMPF) { const u = x - bx; if (u > -14 && u < 18 && y > by - 14 && y < by + 2 && ((u + 40) % 6) < 1) t = 1; else if (u > -14 && u < 18 && y > by - 14 && y < by + 2 && ((u + 40) % 6) < 2 && B(x, y) < 0.6) t = 3; }
        if (y < by - 18 && B(x, y) < 0.4) t = Math.min(4, t + 1);
        if (((x * 3 + y * 7) % 19) === 0) t = Math.max(1, t - 1);
        P.set(x, y, t);
      }
      // Mähne: Strähnen
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (gid[y * W + x] === MAEHNE && P.get(x, y) <= 4 && (x % 3 === 0)) P.set(x, y, 'k0');
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Schädel: Knochen hell (Fase), Augenhöhle mit Irrlicht, Nasenloch, Zähne
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (gid[y * W + x] !== KOPF) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const u = x - hx, w = y - hy;
        let t = c;
        if (u > 8 - w * 0.5 && w < 8 && B(x, y) < 0.7) t = 4; // Stirn im Licht
        if (Math.abs(u - 4 + w * 0.3) < 0.7 && w > -4 && w < 14) t = 1; // Jochbogen
        P.set(x, y, t);
      }
      const ex = hx + 7, ey = hy - 7;
      P.el(ex, ey, 3.2, 2.6, 'k0', true);
      if (!(p.tod && f >= 1)) { P.glow(ex, ey, 9, 0.9, 'glutDim', 'k3'); P.set(ex, ey, 'kern'); P.set(ex - 1, ey, 'glut'); augen.push([r(ex), r(ey)]); }
      P.el(hx - 6, hy + 20, 1.4, 1.4, 'k0', true);
      for (let k = 0; k < 5; k++) { P.auf(hx + 1 + k * 0.6, hy + 22 - k * 2.4, k % 2 ? 'r1' : 'k3'); P.auf(hx + 2 + k * 0.6, hy + 22 - k * 2.4, 'k0'); }
      // Kummet: Lederpolster, Messingbeschläge (Kummethörner hell)
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== KUM) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const a = Math.atan2(y - ky, x - kx); if (((a * 18 / Math.PI) % 2 + 2) % 2 < 0.5) P.set(x, y, 'k0'); else if (Math.cos(a) - Math.sin(a) > 0.8) P.set(x, y, 'k3'); }
      KA.licht(P, kummet, { c: 'r1', c2: null });
      // Laterne: Irrlicht darin, grün; das Licht fällt auf Brust und Hals
      for (let yy = r(ly - 3); yy <= r(ly + 4); yy++) for (let xx = r(lx - 3); xx <= r(lx + 3); xx++) { if (gid[yy * W + xx] !== LAT) continue; const d = Math.hypot(xx + 0.5 - lx, (yy + 0.5 - ly) * 0.8); P.set(xx, yy, Math.abs(xx + 0.5 - lx) < 0.6 && yy < ly ? 'k1' : d < 1.5 ? 'kern' : d < 2.8 ? 'glut' : 'glutDim'); }
      if (!(p.tod && f >= 2)) { P.glow(lx + 4, ly - 6, 16, 0.7, 'glutDim', 'k3'); augen.push([r(lx), r(ly)]); }
      // Stränge: straff, hell an der Oberkante; wo sie ins Moor gehen, Ringe
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (gid[y * W + x] === 9 && P.get(x, y) >= 5 && P.get(x, y) <= 6) P.set(x, y, (x + y) % 3 ? 'k2' : 'r1');
      for (const sx of [bx + 4, bx + 36, bx - 22 - huf * 16, bx - 12, bx + 20, bx + 28]) { if (huf > 0.5 && sx === bx - 22 - huf * 16) continue; for (let k = -3; k <= 3; k++) P.set(sx + k, FY + 2, Math.abs(k) === 3 ? 'k2' : 'r1'); }
      // Lache: Spiegel dunkel, Glanz der Laterne
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== LACHE) continue; if (P.get(x, y) > 4) continue; P.set(x, y, Math.abs(x - lx) < 3 && B(x, y) < 0.5 ? 'glutDim' : (y === FY + 1 && B(x, y) < 0.3 ? 'k3' : 'k1')); }
      // Hufe im Angriff: der vordere Huf kommt aus dem Moor, tropft
      if (huf > 0.5) { const hfx = bx - 22 - huf * 16, hfy = FY + 2 - huf * 22; P.el(hfx, hfy, 3, 2.4, 'k2'); P.set(hfx, hfy + 3, 'k3'); P.set(hfx + 1, hfy + 6, 'k3'); }
      // Randlicht oben rechts kräftig
      { const z = []; for (let y = 0; y < 168; y++) for (let x = 0; x < W - 1; x++) { const c = P.get(x, y); if (c < 1 || c > 5) continue; if (!P.get(x + 1, y) && !P.get(x, y - 1)) z.push([x, y, 'r2']); } for (const [x, y, c] of z) P.set(x, y, c); }
    };
    return { gruppen, details, augen };
  },
};
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
