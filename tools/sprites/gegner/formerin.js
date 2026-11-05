// Die Formerin (Glockengießerei). Die Magd, die den Lehm mit Haaren und Mist trat und die Kerne formte.
// Ab der Hüfte ist sie selbst ein Glockenkern aus Lehm, ein Bienenkorb mit Ringwülsten, durch den die
// Spindel läuft; unten im Feuerloch glimmt die Kohle, die den Kern trocknet. Sie beugt sich mit zu langen
// Armen über die eigene Wölbung und drückt Gesichter hinein, Reihe um Reihe. Das jüngste hat offene Augen.
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
  id: 'formerin', biom: 'glockengiesserei', zone: 'glockengiesserei', w: 96, h: 120, fuss: [50, 115], kopf: [40, 18], rimBis: 113,
  varianten: {
    // a: hoher Kern, vier Gesichter, die Spindel ragt hinter ihr auf
    formerin_a: { kr: 26, ktop: 66, gesichter: 3, spindel: true },
    // b: breiter, niedriger Kern, die Drehschablone lehnt rechts daran, zwei offene Augenpaare
    formerin_b: { kr: 30, ktop: 74, gesichter: 4, schablone: true, offen2: true },
  },
  // Silhouetten-Probe (verworfen): die Frau kniend neben einem freistehenden Kern; das waren zwei Dinge
  // nebeneinander (eine Gestalt und ein Hügel). Erst verwachsen liest sich der Kern als ihr Leib.
  proben: { sil_neben: { kr: 22, ktop: 72, gesichter: 3, neben: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let auf = 0, vor = 0, druck = 0, fall = 0, hand = 0, nick = 0, glut = 0.7;
    if (p.idle) { hand = [0, 1, 2, 1][f]; nick = [0, 0, 1, 1][f]; glut = [0.7, 0.8, 0.65, 0.75][f]; }
    if (p.angriff) { auf = [4, 8, -2, 1][f]; vor = [2, 4, -8, -3][f]; druck = [0.6, 1, -1, -0.3][f]; glut = [0.8, 0.9, 1.2, 0.9][f]; }
    if (p.treffer) { auf = [1, 0][f]; vor = [3, 1][f]; glut = 0.4; }
    if (p.tod) { fall = r(p.q * 26); glut = Math.max(0, 0.7 - p.q); }
    const cx = v.neben ? 62 : 52, kb = 114, kt = v.ktop, R = v.kr;
    // Kern: Bienenkorb mit Ringwülsten; Profil halbe Breite über der Höhe
    const kern = []; const pts = [];
    const NP = 14;
    for (let i = 0; i <= NP; i++) { const q = i / NP; const w = R * (0.34 + 0.66 * Math.pow(Math.sin(Math.min(1, q * 1.25) * Math.PI / 2), 0.55)) * (q > 0.9 ? 1.03 : 1); pts.push([cx + w, kt + q * (kb - kt)]); }
    const kontur = [...pts, ...pts.slice().reverse().map(([x, y]) => [2 * cx - x, y])];
    kern.push(Pg(kontur, null, { rd: 1.5, hz: 1.3 }));
    // Kappe oben (wo sie herauswächst), Spindel durch den Kern
    const spindel = [];
    if (v.spindel) { spindel.push(C(cx + 9, kt + 4, cx + 11, 30, 1.6, 1.3, null), C(cx + 6, 30, cx + 16, 29, 1.3, 1.3, null), E(cx + 11, 30, 2.2, 2.2, null)); }
    const schablone = [];
    if (v.schablone) { const sx = cx + R - 2; schablone.push(Pg([[sx, 112], [sx + 4, 112], [sx + 13, 70], [sx + 15, 50], [sx + 11, 50], [sx + 8, 68], [sx + 2, 92]], null, { rd: 0.5 }), C(sx + 13, 50, sx + 13, 46, 1, 1, null)); }
    // Oberkörper: wächst aus der Kappe, schmal, nach vorn gebeugt
    const hx = cx + 2 + (v.neben ? -22 : 0), hy = kt + 4 + fall;
    const sx = hx - 10 + vor, sy = hy - 24 - auf;
    const rumpf = Pg([[hx - 7, hy + 2], [hx + 7, hy + 2], [hx + 5, hy - 8], [sx + 8, sy + 2], [sx + 2, sy - 2], [sx - 6, sy + 1], [sx - 6, sy + 6], [hx - 6, hy - 6]], null, { rd: 2 });
    // Kopf gesenkt mit Kopftuch, Knoten hinten
    const kx = sx - 6 + vor * 0.3, ky = sy - 1 + nick - (druck > 0 ? 2 : 0);
    const kopf = [E(kx, ky, 5.2, 5.8, 'haut', { pf: 'bevel' })];
    const tuch = [Pg([[kx - 5, ky - 3], [kx - 1, ky - 7], [kx + 5, ky - 6], [kx + 7, ky - 1], [kx + 6, ky + 4], [kx + 2, ky + 1], [kx - 3, ky - 1]], null, { rd: 1.5 }), C(kx + 6, ky + 1, kx + 10, ky + 5, 1.6, 1, null)];
    // Arme: zu lang, zwei Gelenke, die Hände flach auf der Wölbung (Angriff: hoch, dann nach vorn unten)
    const sh = [sx - 3, sy + 3], sh2 = [sx + 4, sy + 2];
    let hand1, hand2, ell1, ell2;
    if (druck > 0.5) { hand1 = [sx - 12, sy - 14 * druck]; hand2 = [sx - 4, sy - 18 * druck]; ell1 = [sx - 14, sy - 2]; ell2 = [sx - 8, sy - 6]; }
    else if (druck < 0) { hand1 = [cx - R - 12, kb - 22]; hand2 = [cx - R - 6, kb - 12]; ell1 = [sx - 20, sy + 12]; ell2 = [sx - 14, sy + 20]; }
    else { hand1 = [cx - R * 0.78 - 1, kt + 22 + hand]; hand2 = [cx - R * 0.95, kt + 36 - hand]; ell1 = [sx - 16, sy + 12]; ell2 = [sx - 10, sy + 18]; }
    if (v.neben) { hand1 = [hand1[0] + 6, hand1[1]]; hand2 = [hand2[0] + 6, hand2[1]]; }
    const arm1 = glied([sh, ell1, hand1], 2.4, 1.5, null), arm2 = glied([sh2, ell2, hand2], 2.4, 1.5, null);
    const finger = (h, a) => { const out = [E(h[0], h[1], 2.6, 1.8, 'haut')]; for (let i = 0; i < 4; i++) out.push(C(h[0] - 1, h[1] - 1 + i * 1.1, h[0] - 5 - (i % 2), h[1] - 2 + i * 1.6, 0.6, 0.5, 'haut')); return out; };
    const haende1 = finger(hand1), haende2 = finger(hand2);
    const gruppen = [
      { p: spindel, k: 0, kante: true },
      { p: schablone, k: 0, kante: true },
      { p: arm2, k: 1, kante: true },
      { p: haende2, k: 0.5, kante: true },
      { p: kern, k: 0, kante: true },
      { p: [rumpf], k: 2, kante: true },
      { p: tuch, k: 1, kante: true },
      { p: kopf, k: 0, kante: true },
      { p: arm1, k: 1, kante: true },
      { p: haende1, k: 0.5, kante: true },
    ];
    const KERN = 4, RUMPF = 5;
    gruppen.forEach((g, i) => { g.anker = i === KERN || i <= 1 ? [0, 0] : [vor, fall - auf]; });
    if (fall) { /* Tod: der Oberkörper sinkt in den Kern */ }
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('glockengiesserei'), { rimBis: 113 });
    const augen = [];
    const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
    const details = P => {
      // Tod: Teile des Oberkörpers, die unter die Kappe gesunken sind, verschwinden im Kern
      if (fall) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const gi = gid[y * W + x]; if (gi > KERN && y > kt + 6 && ist(x, y, gi) && !ist(x, y - fall, gi)) { /* bleibt */ } }
      // Kern: Ringwülste (Grat hell, Tal dunkel), Lehmstruktur, Strohhalme
      const ringe = v.schablone ? [0.18, 0.42, 0.68] : [0.15, 0.35, 0.58, 0.8];
      for (let y = kt; y <= kb; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, KERN)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const q = (y - kt) / (kb - kt), s = (x - cx) / R;
        for (const rq of ringe) { const d = (q - rq) * (kb - kt) - s * s * 2.2; if (Math.abs(d) < 0.6) P.set(x, y, 'k0'); else if (Math.abs(d + 1.2) < 0.6) P.set(x, y, s > 0.1 ? 'r1' : 'k3'); }
        const b = LIB.bay(x, y);
        if (s > 0.12 && s < 0.55 && b < 0.45 && P.get(x, y) <= 4) P.set(x, y, 'k3');
        if (s < -0.5 && b < 0.5 && P.get(x, y) <= 4) P.set(x, y, 'k1');
        if (((x * 31 + y * 17) % 37) === 0 && P.get(x, y) <= 4) P.set(x, y, 'k3');
      }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Gesichter in der Wölbung: helle Ovale, darin Augen und Mund als Löcher; das jüngste hat offene Augen
      const gs = v.gesichter, gy0 = kt + (kb - kt) * (v.schablone ? 0.3 : 0.25);
      for (let i = 0; i < gs; i++) {
        const row = i % 2, s = -0.55 + (i / Math.max(1, gs - 1)) * 1.05, gx = cx + s * R * (0.72 + row * 0.12), gy = gy0 + row * 14 + Math.abs(s) * 4;
        if (!ist(gx, gy, KERN)) continue;
        for (let y = -4; y <= 4; y++) for (let x = -3; x <= 3; x++) if ((x / 3.2) ** 2 + (y / 4.2) ** 2 <= 1 && ist(gx + x, gy + y, KERN) && P.get(r(gx + x), r(gy + y)) <= 6) P.set(gx + x, gy + y, x > 0 && y < 2 ? 'lehm' : 'k3');
        const offen = i === gs - 1 || (v.offen2 && i === 1);
        if (offen && (!p.tod || f < 1)) { P.set(gx - 1, gy - 1, 'kern'); P.set(gx + 1, gy - 1, 'glut'); P.glow(gx, gy - 1, 5, 0.6, 'glutDim', 'k3'); augen.push([r(gx - 1), r(gy - 1)]); }
        else { P.set(gx - 1, gy - 1, 'k0'); P.set(gx + 1, gy - 1, 'k0'); }
        P.set(gx, gy + 1, 'k1'); P.set(gx - 1, gy + 2.5, 'k0'); P.set(gx, gy + 2.5, 'k0'); P.set(gx - 3, gy, 'k1');
      }
      // Feuerloch unten vorn: Kohle trocknet den Kern von innen
      if (glut > 0) {
        const fx = cx - R * 0.35, fy = kb - 1;
        for (let y = fy - 7; y <= fy; y++) for (let x = r(fx - 5); x <= r(fx + 5); x++) {
          const d = Math.hypot((x + 0.5 - fx) / 5, (y + 0.5 - fy) / 7); if (d > 1 || !ist(x, y, KERN)) continue;
          const t = glut * (1.1 - d) + ((x * 3 + y + f) % 4 - 1.5) * 0.06;
          P.set(x, y, d > 0.82 ? 'k0' : t > 0.7 ? 'glut' : t > 0.45 ? 'guss' : t > 0.2 ? 'glutDim' : 'k0');
        }
        P.glow(fx, fy - 4, 13 * glut + 3, 0.7, 'glutDim', 'k3');
        P.set(fx, fy - 2, glut > 0.9 ? 'kern' : 'glut');
        augen.push([r(fx), r(fy - 2)]);
      }
      // Gesicht der Formerin: gesenkt, ein Auge sichtbar, schwach
      if (!p.tod || f < 1) { const ex = r(kx - 3), ey = r(ky + 1); P.set(ex, ey, 'glut'); P.set(ex + 2, ey, 'glutDim'); P.auf(ex, ey - 1, 'k0'); augen.push([ex, ey]); }
      // Lehm an ihren Unterarmen, Haar unter dem Tuch
      for (const h of [hand1, hand2]) { P.auf(h[0] + 2, h[1] - 1, 'lehm'); P.auf(h[0] + 3, h[1], 'lehm'); }
    };
    return { gruppen, details, augen };
  },
};
