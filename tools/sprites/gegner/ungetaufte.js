// Wächter Glockengießerei: Die Ungetaufte. Die große Glocke für St. Brendan, so hoch wie ein Haus, nie
// geweiht, nie hinaufgezogen. Sie hängt an einer Kette unter dem Galgenbalken über ihrer Grube. Links ist
// sie noch in ihrem Lehmmantel, mit Eisenbändern gefasst, rechts ist der Mantel abgeschlagen und die
// Bronze liegt bloß, mit Schriftband und einem Sprung, der glüht. Aus dem glühenden Mund hängen zwei
// nackte Füße, groß wie Ruderblätter. Wenn sie schlägt, schwingen sie nach.
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
const PROFIL = [[0, 0.5], [0.04, 0.6], [0.12, 0.66], [0.35, 0.68], [0.55, 0.73], [0.7, 0.81], [0.82, 0.91], [0.92, 0.99], [0.98, 1.02], [1, 1.0]];
const breiteBei = q => { for (let i = 1; i < PROFIL.length; i++) if (q <= PROFIL[i][0]) { const [q0, w0] = PROFIL[i - 1], [q1, w1] = PROFIL[i]; return w0 + (w1 - w0) * (q - q0) / (q1 - q0 || 1); } return 1; };
module.exports = {
  id: 'ungetaufte', biom: 'glockengiesserei', zone: 'glockengiesserei', rang: 'waechter', w: 160, h: 180, fuss: [80, 176], kopf: [80, 2], rimBis: 178,
  varianten: { ungetaufte: {} },
  // Silhouetten-Probe (verworfen): die Glocke ganz im Mantel, ohne bloße Bronze; das las sich als Bienenkorb
  // oder Hügel (zu nah an der Formerin). Erst die halb abgeschlagene Hälfte zeigt, dass darin eine Glocke ist.
  proben: { probe_mantel: { ganzMantel: true } },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, W = 160, H = 180;
    let a = 0, fall = 0, glueh = 0.7, fl = 0, fr = 0, kette = true, welle = 0;
    if (p.idle) { fl = [0, 1, 0, -1][f]; fr = [0, -1, 0, 1][f]; glueh = [0.7, 0.78, 0.66, 0.74][f]; }
    if (p.angriff) { a = [0.07, 0.13, -0.15, -0.06][f]; fl = [-2, -4, 6, 3][f]; fr = [-3, -5, 5, 2][f]; glueh = [0.8, 0.9, 1.35, 1][f]; welle = f === 2 ? 1 : f === 3 ? 0.5 : 0; }
    if (p.treffer) { a = [0.04, 0.02][f]; fl = 2; fr = 1; glueh = 0.45; }
    if (p.tod) { fall = r(Math.max(0, p.q - 0.15) * 30); kette = f < 2; glueh = Math.max(0, 0.7 - p.q); a = -p.q * 0.05; }
    const px = 80, py = 14 + fall;
    const rot = (x, y) => [px + (x - 80) * Math.cos(a) - (y - 14) * Math.sin(a), py + (x - 80) * Math.sin(a) + (y - 14) * Math.cos(a)];
    const cx = 80, yt = 38, h = 112, R = 64, yb = yt + h;
    // Galgenbalken oben (fest), Bolzen, Kette zur Krone
    const balken = [Pg([[30, 3], [130, 2], [131, 13], [29, 14]], null, { rd: 0.8 }), Pg([[26, 0], [36, 0], [36, 16], [26, 16]], null, { rd: 0.6 }), Pg([[124, 0], [134, 0], [134, 16], [124, 16]], null, { rd: 0.6 })];
    const glieder = [];
    if (kette) for (let i = 0; i < 6; i++) { const [x, y] = rot(80, 16 + i * 3.6); glieder.push(i % 2 ? C(x, y - 1.8, x, y + 1.8, 1.6, 1.6, null) : E(x, y, 3.2, 2.4, null)); }
    // Krone: vier Henkel
    const krone = [];
    for (let i = 0; i < 4; i++) { const u = -12 + i * 8; const p0 = rot(cx + u - 3, yt + 1), p1 = rot(cx + u - 2.5, yt - 8), p2 = rot(cx + u + 2.5, yt - 8), p3 = rot(cx + u + 3, yt + 1); krone.push(C(...p0, ...p1, 2.2, 2, null), C(...p1, ...p2, 2, 2, null), C(...p2, ...p3, 2, 2.2, null)); }
    const kp = rot(cx, yt - 1); krone.push(E(kp[0], kp[1], 14, 3, null));
    // Glocke
    const rechts = PROFIL.map(([q, w]) => [cx + w * R, yt + q * h]);
    const links = PROFIL.slice().reverse().map(([q, w]) => [cx - w * R, yt + q * h]);
    const mund = [[cx + R * 0.72, yb + 2], [cx, yb + 3.5], [cx - R * 0.72, yb + 2]];
    const glocke = [Pg([...rechts, ...mund, ...links].map(([x, y]) => rot(x, y)), null, { rd: 1, hz: 1.6 })];
    // Lehmmantel links: etwas größer als die Glocke, rechte Kante abgeschlagen (zackig)
    const mantel = [];
    { const bruch = v.ganzMantel ? () => R * 1.2 : q => -R * 0.12 + Math.sin(q * 23) * 5 + Math.sin(q * 7.3) * 7 + (q > 0.75 ? -R * 0.25 * (q - 0.75) * 4 : 0);
      const pts = [];
      for (let i = 0; i <= 20; i++) { const q = 0.03 + i / 20 * 0.95; pts.push([cx + Math.min(breiteBei(q) * R + 2, bruch(q)), yt + q * h]); }
      for (let i = 20; i >= 0; i--) { const q = 0.03 + i / 20 * 0.95; pts.push([cx - breiteBei(q) * R - 3, yt + q * h]); }
      mantel.push(Pg(pts.map(([x, y]) => rot(x, y)), 'haut', { rd: 1, hz: 1.2 })); }
    // Füße: hängen aus dem Mund, groß; Knöchel und Schienbein im Dunkel des Munds
    const fuss = (x0, dx, s) => { const k0 = rot(x0, yb - 8), k1 = [k0[0] + dx * 0.5, yb + 6 + fall], an = [k0[0] + dx, yb + 12 + fall];
      return [C(k0[0], k0[1], k1[0], k1[1], 5.6, 5, 'haut'), C(k1[0], k1[1], an[0], an[1], 5, 4.4, 'haut'),
        Pg([[an[0] - 4, an[1] - 3], [an[0] + 4, an[1] - 3], [an[0] + 6, an[1] + 2], [an[0] + 5, an[1] + 6], [an[0] + 1 * s, an[1] + 11], [an[0] - 5, an[1] + 18], [an[0] - 9, an[1] + 18], [an[0] - 9, an[1] + 14], [an[0] - 6, an[1] + 7], [an[0] - 5, an[1] + 1]], 'haut', { rd: 1.4 })]; };
    const fussL = fuss(cx - 15, fl - 3, 1), fussR = fuss(cx + 12, fr - 1, 0.8);
    // Grubenrand: Ring am Boden, darin Glut (fest)
    const grube = [Pg([[18, 170], [50, 166], [110, 166], [142, 170], [150, 175], [110, 178], [50, 178], [10, 175]], null, { rd: 1, pf: 'flat' })];
    const mi = rot(cx, yb + 1);
    const mundInnen = [E(mi[0], mi[1], R * 0.86, 3.4, 'dunkel', { pf: 'flat' })];
    const gruppen = [
      { p: grube, k: 0, kante: true },
      { p: balken, k: 0.5, kante: true },
      { p: glieder, k: 0, kante: true },
      { p: fussR, k: 1.5, kante: true, tone: 0.22 },
      { p: krone, k: 0.8, kante: true },
      { p: glocke, k: 0, kante: true },
      { p: mantel, k: 0, kante: true },
      { p: mundInnen, k: 0, noRim: true },
      { p: fussL, k: 1.5, kante: true, tone: 0.3 },
    ];
    const GRUBE = 0, BALKEN = 1, GL = 5, MANTEL = 6, MUND = 7, FL = 8, FR = 3;
    gruppen.forEach((g, i) => { g.anker = i <= 1 ? [0, 0] : [0, fall]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('glockengiesserei'), { rimBis: 178 });
    const inv = (x, y) => { const X = x - px, Y = y - py; return [80 + X * Math.cos(-a) - Y * Math.sin(-a), 14 + X * Math.sin(-a) + Y * Math.cos(-a)]; };
    const augen = [];
    const details = P => {
      const B = (x, y) => LIB.bay(x, y - fall);
      // Bronze: Rippen, Schriftband, Glanzbänder, Licht von unten; Mantel: Lehm, Risse, Eisenbänder
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const gi = gid[y * W + x]; if (gi !== GL && gi !== MANTEL) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const [u, w] = inv(x + 0.5, y + 0.5); const q = (w - yt) / h, s = (u - cx) / R, sn = s / breiteBei(q), b = B(x, y);
        if (gi === GL) {
          for (const l of [0.13, 0.17, 0.33, 0.8, 0.84, 0.9]) { if (Math.abs(q - l) * h < 0.6) P.set(x, y, 'k0'); else if (Math.abs(q - l + 1.2 / h) * h < 0.6) P.set(x, y, sn > 0.2 ? 'r1' : 'k3'); }
          if (q > 0.19 && q < 0.31) { const gx = Math.floor(sn * 22), gy = Math.floor((q - 0.19) / 0.12 * 4); const hs = Math.abs(Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453 % 1); if (gy >= 1 && gy <= 2 && hs > 0.35 && ((x + y) % 3)) P.set(x, y, sn > 0.35 ? 'bronze' : 'k3'); }
          if (q > 0.36 && q < 0.95) { if (sn > 0.3 && sn < 0.5 && b < 0.5) P.set(x, y, 'k3'); else if (sn > 0.55 && sn < 0.64 && q < 0.86 && (y & 1) && b < 0.8) P.set(x, y, 'bronze'); else if (sn > 0.64 && sn < 0.78 && b < 0.35) P.set(x, y, 'k3'); }
          if (q > 0.86 && q < 0.99 && sn > -0.2 && b < (q - 0.86) * 5 * glueh) P.set(x, y, 'glutDim');
        } else {
          // Lehm: rau, Strohhalme, Risse; Licht von rechts oben schwach, unten Glut aus der Grube
          let t = c; if (((x * 13 + y * 7) % 17) === 0) t = 1; if (((x * 5 + y * 11) % 23) === 0) t = 4;
          if (sn > -0.2 && b < 0.3) t = 4;
          P.set(x, y, t);
          for (const l of [0.22, 0.5, 0.76]) { const d = (q - l) * h; if (Math.abs(d) < 1.6) P.set(x, y, d < -0.6 ? (sn > -0.4 ? 'r1' : 'k3') : 'k1'); }
          if (q > 0.78 && sn < -0.6 && b < (q - 0.78) * 3 * glueh) P.set(x, y, 'glutDim');
        }
      }
      // Risse im Lehm (fest im Glockenmaß)
      for (const [s0, q0, n] of [[-0.7, 0.35, 14], [-0.45, 0.6, 10], [-0.85, 0.66, 9], [-0.3, 0.12, 8]]) { let s = s0, q = q0; for (let i = 0; i < n; i++) { const [x, y] = rot(cx + s * R, yt + q * h); if (gid[r(y) * W + r(x)] === MANTEL) P.set(x, y, 'k0'); q += 0.012; s += (i % 3 === 0 ? 0.02 : -0.01); } }
      // Abbruchkante des Mantels: Dicke sichtbar (heller Lehm an der Kante, Schatten auf der Bronze)
      for (let y = 0; y < H; y++) for (let x = 1; x < W - 1; x++) { if (gid[y * W + x] !== MANTEL) continue; if (gid[y * W + x + 1] === GL) { P.set(x, y, 'lehm'); P.set(x - 1, y, 'k3'); P.set(x + 1, y, 'k0'); if (B(x, y) < 0.5) P.set(x + 2, y, 'k0'); } }
      // Sprung: vom Rand rechts nach oben, glüht innen
      { let s = 0.45, q = 0.99; for (let i = 0; i < 34; i++) { const [x, y] = rot(cx + s * R, yt + q * h); if (gid[r(y) * W + r(x)] === GL) { P.set(x, y, i < 10 ? 'guss' : i < 22 ? 'glutDim' : 'k0'); if (i < 6 && glueh > 0.9) P.set(x + 1, y, 'glut'); } q -= 0.0095; s += (i % 4 === 0 ? 0.012 : i % 7 === 0 ? -0.01 : 0); } }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // kräftiges Randlicht an Glocke, Krone und Balken zur Lichtseite
      { const leer = (x, y) => x < 0 || y < 0 || x >= W || y >= H || !P.get(x, y), z = [];
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const gi = gid[y * W + x]; if (gi !== GL && gi !== MANTEL && gi !== 4 && gi !== BALKEN) continue; const c = P.get(x, y); if (c < 1 || c > 5) continue; if (gi === GL || gi === MANTEL) { const [, w] = inv(x + 0.5, y + 0.5); if ((w - yt) / h > 0.97) continue; }
          if (leer(x + 1, y) || leer(x + 1, y - 1)) z.push([x, y, 'r2']); else if (leer(x + 2, y) || leer(x + 2, y - 1) || leer(x, y - 1)) z.push([x, y, 'r1']); }
        for (const [x, y, c] of z) P.set(x, y, c); }
      // Balken: Maserung, Bolzen
      for (let y = 4; y < 13; y++) for (let x = 30; x < 130; x++) if (gid[y * W + x] === BALKEN && P.get(x, y) <= 4 && ((y === 7 && x % 9 > 2) || (y === 10 && (x + 4) % 13 > 5))) P.set(x, y, 'k0');
      for (const bx of [31, 129]) { P.set(bx, 6, 'bronze'); P.set(bx, 11, 'k3'); }
      // Mund: glüht von innen, auf die Füße fällt Licht von unten
      if (glueh > 0) {
        const [mx, my] = rot(cx, yb + 1);
        for (let y = r(my - 4); y <= r(my + 4); y++) for (let x = r(mx - R); x <= r(mx + R); x++) {
          if (x < 0 || x >= W || y < 0 || y >= H || gid[y * W + x] !== MUND) continue; const d = Math.abs(x + 0.5 - mx) / (R * 0.86), t = glueh * (1.05 - d * d) - (y > my + 1 ? 0.3 : 0) + (B(x, y) - 0.5) * 0.15;
          P.set(x, y, t > 0.95 ? 'glut' : t > 0.55 ? 'guss' : t > 0.25 ? 'glutDim' : 'k0');
        }
        P.glow(mx, my - 4, 34 * Math.min(1.2, glueh), 0.65, 'glutDim', 'k2');
        P.set(mx, my, glueh > 1 ? 'kern' : 'glut'); P.set(mx - 1, my, 'glut');
        augen.push([r(mx), r(my)]);
      }
      // Füße: Zehen, Nägel, Sohle; Licht von unten (aus der Grube) an der Unterseite
      for (const [Fz, gi] of [[fussL, FL], [fussR, FR]]) {
        const pg = Fz[2]; const pts = pg.v; const [ax, ay] = [pts[0][0] + 4, pts[0][1] + 2];
        for (let y = r(ay) - 2; y < r(ay) + 26; y++) for (let x = r(ax) - 18; x < r(ax) + 10; x++) { if (x < 0 || y >= H || gid[y * W + x] !== gi) continue; const c = P.get(x, y); if (c < 1 || c > 5) continue; if (gid[(y + 1) * W + x] !== gi && y + 1 < H) P.set(x, y, 'glutDim'); else if (gid[(y + 2) * W + x] !== gi && B(x, y) < 0.5) P.set(x, y, 'glutDim'); }
        for (let i = 0; i < 3; i++) { const tx = pts[6][0] + 1 + i * 1.6, ty = pts[6][1] - 1 - i * 1.4; P.auf(tx, ty, 'k0'); P.auf(tx - 1, ty - 1, 'k0'); }
        P.auf(pts[3][0] - 1, pts[3][1], 'k3'); P.auf(pts[3][0] - 1, pts[3][1] + 1, 'k3'); P.auf(pts[2][0] - 2, pts[2][1] + 1, 'k0');
        // Knöchel und Sehne: Binnenform am Schienbein
        const sb = Fz[1]; for (let t = 0.1; t < 0.9; t += 0.1) P.auf(sb.x1 + (sb.x2 - sb.x1) * t + 1.5, sb.y1 + (sb.y2 - sb.y1) * t, 'k3');
      }
      // Grube: der Ring glüht innen, die Füße hängen darüber
      for (let y = 165; y < 179; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== GRUBE) continue; const c = P.get(x, y); if (c > 6) continue; const inn = Math.abs((x - 80) / 52) ** 2 + ((y - 172) / 3.6) ** 2; if (inn < 1) P.set(x, y, inn < 0.35 ? (B(x, y) < 0.4 ? 'guss' : 'glutDim') : inn < 0.7 ? 'glutDim' : 'k0'); }
      // Schallwellen beim Schlag: Bögen links neben dem Rand
      if (welle) for (let k = 0; k < 3; k++) { const rr = 16 + k * 7; for (let t = -0.7; t <= 0.7; t += 0.03) { const x = 16 - k * 5 + Math.cos(Math.PI + t) * rr * 0.4, y = 120 + Math.sin(t) * rr; if (!P.get(r(x), r(y)) && (k < 2 || welle > 0.6) && B(x, y) < 0.8 - k * 0.2) P.set(x, y, k === 0 ? 'r2' : 'r1'); } }
    };
    return { gruppen, details, augen };
  },
};
