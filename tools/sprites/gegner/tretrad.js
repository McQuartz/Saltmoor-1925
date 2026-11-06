// Zweiter Wächter Glockengießerei: Das Tretrad. Der Kran, mit dem 1641 die Glocken aus den Gruben und durch
// den Schacht gezogen wurden: ein Rad aus Eiche, so hoch wie zwei Männer, daneben der Mast mit dem Ausleger.
// Im Rad geht einer, seit 1641. Die Achse geht ihm mitten durch den Leib; wenn er geht, dreht er das Rad und
// das Rad dreht ihn. Seine Beine sind zu lang geworden vom Gehen. Am Haken hängt ein Gießtiegel voll Speise,
// der nie leer wird, und das Seil läuft ab, nicht auf: Was er hochzieht, kommt oben nie an.
// Randlicht kalt (Zone glockengiesserei_w2): das Licht aus dem Schacht, der einzige kalte Ton im Biom;
// die Wächter-Szene ist ganz Ofenglut und Kirschrot.
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
  id: 'tretrad', biom: 'glockengiesserei', zone: 'glockengiesserei_w2', rang: 'waechter', w: 160, h: 180, fuss: [96, 176], kopf: [96, 4], rimBis: 172,
  varianten: { tretrad: {} },
  // Silhouetten-Probe (verworfen): das Rad allein ohne Mast und Haken. Schwarz ein Wagenrad oder Mühlrad mit
  // Männchen, ohne Bezug zur Gießerei und ohne Waffe. Erst Mast, Ausleger und der hängende Tiegel machen den Kran.
  proben: { probe_nurRad: { nurRad: true } },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, W = 160, H = 180, FY = 175;
    const RX = 108, RY = 114, RR = 50;
    // rot: Drehung des Rads; hk: Hakenhöhe (y des Tiegels), hs: Seitenschwung des Tiegels; schritt: Beine
    let rot = 0, hk = 108, hs = 0, schritt = f % 2, fall = 0, lean = 0, kipp = 0, glueh = 0.7, spritz = 0;
    if (p.idle) { rot = 0; hs = [0, 1, 0, -1][f]; glueh = [0.7, 0.76, 0.68, 0.74][f]; }
    if (p.angriff) { rot = [0.2, 0.5, -0.3, -0.15][f]; hk = [80, 56, 120, 112][f]; hs = [8, 14, -2, 0][f]; kipp = [0.2, 0.35, -1.1, -0.5][f]; lean = [2, 3, -4, -2][f]; glueh = [0.8, 0.9, 1.3, 1][f]; spritz = f === 2 ? 1 : f === 3 ? 0.5 : 0; }
    if (p.treffer) { hs = [4, 2][f]; lean = [2, 1][f]; glueh = 0.5; }
    if (p.tod) { fall = r(p.q * 26); hk = 108 + r(p.q * 60); glueh = Math.max(0, 0.7 - p.q); rot = -p.q * 0.6; }
    // Unterbau: Grundbalken, Bock unter der Achse, Mast mit Ausleger und Strebe
    const bau = [Pg([[30, 168], [158, 168], [158, 175], [30, 175]], null, { rd: 0.6 }),
      C(RX, RY, RX - 30, 170, 3, 3.4, null), C(RX, RY, RX + 30, 170, 3, 3.4, null)];
    const mast = v.nurRad ? [] : [Pg([[40, 8], [48, 8], [49, 170], [39, 170]], null, { rd: 0.8 }), C(44, 12, 8, 30, 3.4, 2.6, null), C(44, 50, 18, 26, 2, 1.6, null),
      C(44, 120, 60, 168, 2, 2, null), E(44, 10, 4.5, 4.5, null), E(9, 30, 3.6, 3.6, null)];
    // Seil: Achse -> Rolle am Mast -> Rolle am Auslegerende -> Haken
    const tx = 9 + hs, ty = hk + fall;
    const seil = v.nurRad ? [] : [C(RX - 6, RY - 6, 46, 12, 0.7, 0.7, null), C(42, 8, 10, 27, 0.7, 0.7, null), C(8, 32, tx, ty - 12, 0.8, 0.8, null)];
    // Haken und Tiegel (kippt beim Schlag nach vorn)
    const tg = [];
    if (!v.nurRad) {
      tg.push(C(tx, ty - 13, tx, ty - 6, 1.4, 1.4, null), E(tx, ty - 5, 3.2, 2.4, null));
      const ca = Math.cos(kipp), sa = Math.sin(kipp), R = (x, y) => [tx + x * ca - y * sa, ty + x * sa + y * ca];
      tg.push(C(...R(-9, 0), ...R(0, -5), 0.6, 0.6, null), C(...R(9, 0), ...R(0, -5), 0.6, 0.6, null));
      tg.push(Pg([R(-10, 0), R(10, 0), R(8, 10), R(4, 14), R(-4, 14), R(-8, 10)], null, { rd: 1 }));
    }
    // Rad: Kranz aus Kapseln, Speichen, Trittlatten innen, Nabe
    const kranz = [], speichen = [], latten = [];
    const N = 36; for (let i = 0; i < N; i++) { const a0 = i / N * 2 * Math.PI, a1 = (i + 1) / N * 2 * Math.PI; kranz.push(C(RX + Math.cos(a0) * RR, RY + Math.sin(a0) * RR, RX + Math.cos(a1) * RR, RY + Math.sin(a1) * RR, 3.2, 3.2, null)); }
    for (let i = 0; i < 6; i++) { const a = rot + 0.26 + i * Math.PI / 3; speichen.push(C(RX + Math.cos(a) * 6, RY + Math.sin(a) * 6, RX + Math.cos(a) * (RR - 2), RY + Math.sin(a) * (RR - 2), 1.6, 1.2, null)); }
    for (let i = 0; i < 24; i++) { const a = rot + i * Math.PI / 12; latten.push(C(RX + Math.cos(a) * (RR - 3), RY + Math.sin(a) * (RR - 3), RX + Math.cos(a) * (RR - 7), RY + Math.sin(a) * (RR - 7), 1.2, 1.2, null)); }
    const nabe = [E(RX, RY, 7, 7, null), C(RX - 9, RY, RX + 9, RY, 2.2, 2.2, null)];
    // Der Gehende: Füße unten im Rad, Achse durch den Bauch, Oberkörper gebeugt nach vorn (links), Kopf gesenkt
    const gx = RX + lean, gy = RY;
    const fussY = RY + RR - 6;
    const bein = (s, w) => { const hip = [gx + s * 2, gy + 4], knie = [gx - 8 + w * 10, gy + 24], fu = [gx - 14 + w * 16, fussY];
      return [C(...hip, ...knie, 3.6, 2.8, 'haut'), C(...knie, ...fu, 2.8, 2, 'haut'), C(fu[0], fu[1], fu[0] - 5, fu[1] + 1, 1.6, 1.4, 'haut')]; };
    const beinH = bein(1, schritt ? 1 : 0), beinV = bein(-1, schritt ? 0 : 1);
    const rumpf = Pg([[gx - 8, gy + 6], [gx + 7, gy + 6], [gx + 6, gy - 18], [gx - 4, gy - 32], [gx - 17, gy - 28], [gx - 12, gy - 8]], null, { rd: 2.6 });
    const kx = gx - 20, ky = gy - 32;
    const kopf = E(kx, ky, 7, 8, 'haut', { pf: 'bevel' });
    // Arme greifen nach den Speichen vor ihm
    const arm = [C(gx - 10, gy - 26, gx - 26, gy - 14, 2.8, 2, null), C(gx - 26, gy - 14, gx - 36, gy - 28, 2, 1.6, 'haut'), C(gx - 6, gy - 24, gx - 20, gy - 6, 2.6, 1.8, null), C(gx - 20, gy - 6, gx - 34, gy - 8, 1.8, 1.5, 'haut')];
    const gruppen = [
      { p: bau, k: 1, kante: true },
      { p: mast, k: 1, kante: true },
      { p: seil, k: 0, kante: false, noRim: true },
      { p: latten, k: 0, kante: true },
      { p: speichen, k: 0.5, kante: true },
      { p: kranz, k: 1.5, kante: true },
      { p: beinH, k: 1, kante: true },
      { p: [rumpf], k: 2, kante: true },
      { p: [kopf], k: 0.5, kante: true },
      { p: beinV, k: 1, kante: true },
      { p: arm, k: 1, kante: true },
      { p: nabe, k: 1, kante: true },
      { p: tg, k: 0.6, kante: true },
    ];
    const MAST = 1, SEIL = 2, KRANZ = 5, RUMPF = 7, KOPF = 8, NABE = 11, TG = 12;
    gruppen.forEach(g => { g.anker = [0, 0]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('glockengiesserei_w2'), { rimBis: 172 });
    const augen = [];
    const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
    const details = P => {
      const B = LIB.bay;
      // Kranz: Holz mit Fugen zwischen den Felgenstücken und Eisenbeschlägen; unten Glutschein von der Grube
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, KRANZ)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const a = Math.atan2(y + 0.5 - RY, x + 0.5 - RX) - rot; const seg = ((a / (Math.PI / 4)) % 1 + 1) % 1;
        if (seg < 0.04) P.set(x, y, 'k0'); else if (seg > 0.46 && seg < 0.54) P.set(x, y, Math.hypot(x - RX, y - RY) > RR ? 'bronze' : 'k3');
        if (y > RY + RR - 12 && B(x, y) < (y - RY - RR + 12) * 0.05 * glueh) P.set(x, y, 'glutDim');
      }
      // Nabe: Eisen, Achse durch den Leib (Glanz), Bolzen
      for (let y = RY - 7; y <= RY + 7; y++) for (let x = RX - 9; x <= RX + 9; x++) { if (!ist(x, y, NABE)) continue; const d = Math.hypot(x - RX, y - RY); if (d > 5.5 && d < 6.6) P.set(x, y, 'k0'); else if (d < 2) P.set(x, y, 'k3'); }
      P.set(RX + 2, RY - 3, 'bronze'); P.set(RX - 3, RY + 2, 'k3');
      // Kopf: gesenkt, kahl, ein Auge offen
      for (let y = r(ky - 8); y < r(ky + 8); y++) for (let x = r(kx - 7); x < r(kx + 7); x++) { if (!ist(x, y, KOPF)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const dx = x - kx, dy = y - ky; P.set(x, y, dx > 2 || dy < -4 ? ((x + y) % 3 ? 'k1' : 'k2') : 'k3'); }
      if (!(p.tod && f >= 1)) { P.glow(kx - 3, ky + 1, 6, 0.8, 'glutDim', 'k3'); P.set(kx - 4, ky + 1, 'kern'); P.set(kx - 3, ky + 1, 'glut'); P.set(kx - 1, ky + 2, 'glut'); augen.push([r(kx - 4), r(ky + 1)]); }
      P.auf(kx - 5, ky + 5, 'k0'); P.auf(kx - 4, ky + 5, 'k0');
      // Rumpf: Rippen, Wirbel auf dem Rücken
      for (let y = r(gy - 34); y < r(gy + 6); y++) for (let x = r(gx - 18); x < r(gx + 8); x++) { if (!ist(x, y, RUMPF)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; if ((y % 4 === 0) && x < gx) P.set(x, y, 'k0'); else if ((y % 4 === 1) && x < gx && x > gx - 9) P.set(x, y, 'k3'); }
      // Mast: Maserung, Eisenbänder
      for (let y = 12; y < 168; y++) for (let x = 39; x < 50; x++) { if (!ist(x, y, MAST)) continue; if (y % 26 === 0 || y % 26 === 1) P.set(x, y, y % 26 ? 'k3' : 'k0'); else if (x === 42 && (y * 7) % 11 > 4) P.set(x, y, 'k0'); }
      // Tiegel: Speise glüht oben, läuft beim Schlag aus
      if (glueh > 0 && !v.nurRad) {
        const ca = Math.cos(kipp), sa = Math.sin(kipp);
        for (let y = r(ty - 16); y < r(ty + 18); y++) for (let x = r(tx - 16); x < r(tx + 16); x++) { if (!ist(x, y, TG)) continue; const u = (x - tx) * ca + (y - ty) * sa, w = -(x - tx) * sa + (y - ty) * ca; if (w > -1 && w < 2.5 && Math.abs(u) < 9) P.set(x, y, w < 0.5 && glueh > 0.9 ? 'glut' : (B(x, y) < glueh ? 'guss' : 'glutDim')); else if (w > 2.5 && w < 4 && Math.abs(u) < 8) P.set(x, y, 'k0'); }
        P.set(tx, ty, glueh > 1 ? 'kern' : 'glut'); augen.push([r(tx), r(ty)]);
        P.glow(tx, ty + 4, 10, 0.5 * glueh, 'glutDim', 'k3');
        if (spritz) for (let k = 0; k < 7; k++) { const x = tx - 6 - k * 3, y = ty + 6 + k * k * 0.9 * spritz; P.set(x, y, k < 3 ? 'guss' : 'glutDim'); if (k < 4) P.set(x + 1, y, 'glutDim'); }
      }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      { const leer = (x, y) => x < 0 || y < 0 || x >= W || y >= H || !P.get(x, y), z = [];
        for (let y = 0; y < 168; y++) for (let x = 0; x < W; x++) { const c = P.get(x, y); if (c < 1 || c > 5) continue; if (gid[y * W + x] === SEIL) continue;
          if (leer(x + 1, y) && leer(x, y - 1)) z.push([x, y, 'r2']); else if (leer(x + 1, y) || leer(x + 1, y - 1)) z.push([x, y, 'r1']); }
        for (const [x, y, c] of z) P.set(x, y, c); }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
