// Zweiter Wächter Grotte: Der Ungeheilte. Einer, der kam und nicht geheilt wurde. Er hat keine Beine mehr,
// nur zwei umwickelte Stümpfe. Er hat sich die Krücken genommen, die die Geheilten an die Wand gehängt haben,
// alle, und für jede Krücke ist ihm ein Arm gewachsen. Jetzt hängt er zwischen ihnen wie zwischen Stelzen und
// geht. Um den Hals trägt er ein Wachsherz an der Schnur, das noch warm ist: seine eigene Gabe, nie angenommen.
// Phase 2 (ungeheilter_p2): Die Hälfte der Krücken ist gebrochen, er hängt tiefer und schief.
// Randlicht kalt (Zone grotte_w2): das Nachtlicht aus dem Spalt zur Küste; die Wächter-Szene ist ganz Kerzengold.
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
// Krücken: Polster oben (x, y), Fuß unten (x, y), hinten = dünner und dunkler
const KR1 = [
  { t: [38, 60], f: [10, 174], h: 1 }, { t: [58, 44], f: [44, 174], h: 1 },
  { t: [104, 44], f: [120, 174], h: 1 }, { t: [124, 60], f: [150, 174], h: 1 },
  { t: [42, 100], f: [56, 175], h: 0, schlag: true }, { t: [120, 100], f: [98, 175], h: 0 },
];
// Phase 2: fünf heile, drei gebrochen (Stumpf endet in der Luft)
const KR2 = [
  { t: [38, 76], f: [10, 174], h: 1 }, { t: [56, 66], f: [40, 174], h: 1, bruch: 0.45 }, { t: [96, 62], f: [112, 174], h: 1 },
  { t: [120, 74], f: [146, 174], h: 1, bruch: 0.5 }, { t: [44, 112], f: [56, 175], h: 0, schlag: true }, { t: [116, 110], f: [96, 175], h: 0, bruch: 0.55 },
];
module.exports = {
  id: 'ungeheilter', biom: 'grotte', zone: 'grotte_w2', rang: 'waechter', w: 160, h: 180, fuss: [80, 175], kopf: [80, 6], rimBis: 171,
  varianten: { ungeheilter: { p2: 0 }, ungeheilter_p2: { p2: 1 } },
  // Silhouetten-Probe (verworfen): vier Krücken, zwei Arme, der Mann aufrecht dazwischen. Schwarz ein Gestell
  // mit Puppe, zu nah am Geheilten (Stelzen) und ohne das Falsche. Genommen: acht Krücken, acht Arme, er hängt.
  proben: { probe_vier: { p2: 0, vier: true } },
  bild(p, v, A) {
    const { E, C, Pg, r } = A;
    const f = p.f, W = 160, H = 180;
    let sw = 0, hub = 0, fall = 0, lean = 0, aus = 0, sch = 0; // sch: Schlag-Krücke 0 ruht, 1/2 ausgeholt, 3 schlägt, 4 Nachschwung
    let nick = 0; if (p.idle) { sw = [0, 1, 1, 0][f]; nick = [0, 0, 1, 1][f]; }
    if (p.angriff) { sch = [1, 2, 3, 4][f]; lean = [3, 5, -8, -4][f]; hub = [-3, -6, 2, 0][f]; }
    if (p.treffer) { lean = [3, 2][f]; hub = 1; }
    if (p.tod) { fall = r(p.q * 40); lean = r(p.q * 5); aus = p.q; }
    let KR = v.p2 ? KR2 : KR1; if (v.vier) KR = [KR1[0], KR1[3], KR1[4], KR1[5]];
    const T = hub + fall + (v.p2 ? 20 : 0), L = lean;
    const bx = 80 + L, by = 70 + T;
    // Rumpf: hängender Sack aus Haut und Hemd, nach vorn gekippt; Stümpfe umwickelt
    const rumpf = Pg([[bx - 16, by - 10], [bx - 8, by - 20], [bx + 4, by - 24], [bx + 14, by - 20], [bx + 19, by - 8], [bx + 15, by + 8], [bx + 7, by + 20], [bx - 4, by + 22], [bx - 10, by + 12], [bx - 15, by + 2]], null, { rd: 3 });
    const wirbel = []; for (let i = 0; i < 6; i++) { const a = -2.4 + i * 0.36; wirbel.push(E(bx + 2 + Math.cos(a) * 20, by - 2 + Math.sin(a) * 22, 2.4, 2, null)); }
    const stumpf = [C(bx - 3, by + 18, bx - 6, by + 34, 5.6, 4.4, null), C(bx + 7, by + 16, bx + 10, by + 30, 5, 4, null)];
    const kx = bx - 21, ky = by + 2 + nick + (p.angriff ? [0, -2, 4, 2][f] : 0);
    const kopf = E(kx, ky, 8, 9, 'haut', { pf: 'bevel' });
    const haar = [Pg([[kx - 2, ky - 8], [kx + 6, ky - 7], [kx + 6, ky + 8], [kx + 3, ky + 20], [kx - 1, ky + 24], [kx - 3, ky + 14]], null, { rd: 0.8 }), C(kx + 4, ky - 5, bx - 10, by - 12, 4, 5.5, null)];
    // Krücken und Arme
    const kr = [], armeH = [], armeV = [];
    KR.forEach((k, i) => {
      const kt = p.idle ? (v.p2 ? 20 : 0) : T * 0.8, kl = p.idle ? 0 : L * 0.6;
      let t = [k.t[0] + kl, k.t[1] + kt], fu = [k.f[0], k.f[1]];
      if (fall) fu = [fu[0] + (fu[0] - 80) * aus * 0.3, fu[1]];
      if (k.schlag && sch) { const fs = { 1: [t[0] + 14, t[1] - 76], 2: [t[0] + 44, t[1] - 66], 3: [t[0] - 60, t[1] + 62], 4: [t[0] - 46, t[1] + 84] }[sch]; fu = fs; }
      const dx = fu[0] - t[0], dy = fu[1] - t[1], dl = Math.hypot(dx, dy), ux = dx / dl, uy = dy / dl, nx = -uy, ny = ux;
      const bis = k.bruch ? k.bruch : 1;
      const g = [t[0] + ux * dl * 0.42, t[1] + uy * dl * 0.42];
      const dk = k.h ? 1 : 1.35;
      const o = [C(t[0] - nx * 5, t[1] - ny * 5, t[0] + nx * 5, t[1] + ny * 5, 2.2 * dk, 2.2 * dk, null),
        C(t[0] - nx * 3.5, t[1] - ny * 3.5, g[0], g[1], 1.1 * dk, 1 * dk, null), C(t[0] + nx * 3.5, t[1] + ny * 3.5, g[0], g[1], 1.1 * dk, 1 * dk, null),
        C(g[0] - nx * 3, g[1] - ny * 3, g[0] + nx * 1.5, g[1] + ny * 1.5, 1.2, 1.2, null)];
      const end = [t[0] + ux * dl * bis, t[1] + uy * dl * bis];
      o.push(C(g[0], g[1], end[0], end[1], 1.5 * dk, 1.3 * dk, null));
      if (k.bruch) o.push(Pg([[end[0] - 2, end[1]], [end[0] + 2, end[1]], [end[0] + 1, end[1] + 5], [end[0] - 1, end[1] + 3]], null, { rd: 0.3 }));
      else o.push(E(fu[0], fu[1] - 1, 2.2, 1.6, null));
      // Arm: aus dem Rumpf zur Krücke, die Hand am Griff
      const sx = bx + (t[0] - 80) * 0.18, sy = by - 6 + (t[1] - 60) * 0.25;
      const ell = [t[0] + nx * (t[0] < 80 ? 6 : -6) * 0, t[1] - 4];
      const arm = [C(sx, sy, ell[0], ell[1], 2.6, 1.8, null), C(ell[0], ell[1], g[0] + nx * 0.5, g[1], 1.8, 1.5, null), E(g[0], g[1], 2.2, 2, 'haut')];
      (k.h ? kr : armeV).push({ o, i, k, hinten: k.h });
      (k.h ? armeH : armeV).push({ arm, i });
    });
    const herz = E(bx - 6, by + 4 + sw, 3.2, 3, 'haut');
    const schnur = C(kx + 3, ky + 6, bx - 6, by + 2, 0.5, 0.5, null, { pf: 'flat' });
    const gruppen = [];
    for (const q of kr) gruppen.push({ p: q.o, k: 0.4, kante: true, kruecke: 1, tone: -0.1 });
    for (const q of armeH) gruppen.push({ p: q.arm, k: 0.8, kante: true, arm: 1 });
    gruppen.push({ p: [rumpf, ...wirbel, ...stumpf], k: 2.5, kante: true, rumpf: 1 });
    gruppen.push({ p: haar, k: 0.5, kante: true });
    gruppen.push({ p: [kopf], k: 0.5, kante: true, kopf: 1 });
    gruppen.push({ p: [schnur], k: 0, kante: false, noRim: true });
    gruppen.push({ p: [herz], k: 0, kante: true, herz: 1 });
    for (const q of armeV) gruppen.push({ p: q.o || q.arm, k: q.o ? 0.4 : 0.8, kante: true, kruecke: q.o ? 1 : 0, arm: q.o ? 0 : 1 });
    const RUMPF = gruppen.findIndex(g => g.rumpf), KOPF = gruppen.findIndex(g => g.kopf), HERZ = gruppen.findIndex(g => g.herz);
    gruppen.forEach(g => { g.anker = g.kruecke ? [0, 0] : [r(L), r(T)]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('grotte_w2'), { rimBis: 171 });
    const augen = [];
    const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
    const details = P => {
      const B = LIB.bay;
      // Krücken: Holz mit Maserung, Polster umwickelt (Wachsflecken)
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const g = gid[y * W + x]; if (g < 0 || !gruppen[g].kruecke) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        if (c >= 3 && (y % 3 === 0)) P.set(x, y, 'k2');
      }
      // Rumpf: Rippen, Hemdfetzen, Licht der Kerzen von unten (warm) auf dem Bauch
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, RUMPF)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const u = x - bx, w = y - by;
        if (w > -10 && w < 8 && u > -6 && u < 10 && ((w + 20) % 4 === 0)) P.set(x, y, 'k0');
        else if (w > -10 && w < 8 && u > -6 && u < 10 && ((w + 20) % 4 === 1) && u > 2) P.set(x, y, 'k3');
        if (w > 16) { P.set(x, y, ((y + (x >> 1)) % 4 === 0) ? 'k1' : (u > 2 && B(x, y) < 0.6 ? 'k3' : 'k2')); if (!ist(x, y + 1, RUMPF) || !ist(x, y + 2, RUMPF)) P.set(x, y, 'glutDim'); } // Binden an den Stümpfen, unten Kerzenschein
      }
      // Kopf: hängt, Haar strähnig, Gesicht nach unten, Augen offen
      for (let y = r(ky - 9); y < r(ky + 10); y++) for (let x = r(kx - 8); x < r(kx + 8); x++) {
        if (!ist(x, y, KOPF)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const dx = x - kx, dy = y - ky; if (dy < -3 || dx > 3) P.set(x, y, (x + y) % 3 ? 'k1' : 'k2'); else P.set(x, y, dx < -5 ? 'k2' : 'k3');
      }
      P.auf(kx - 4, ky + 5, 'k0'); P.auf(kx - 3, ky + 5, 'k0'); P.auf(kx - 4, ky + 6, 'k0');
      if (!(p.tod && f >= 1)) { P.glow(kx - 3, ky + 1, 6, 0.8, 'glutDim', 'k3'); P.set(kx - 5, ky + 1, 'kern'); P.set(kx - 4, ky + 1, 'glut'); P.set(kx - 1, ky + 1, 'glut'); augen.push([r(kx - 5), r(ky + 1)], [r(kx - 1), r(ky + 1)]); }
      // Wachsherz: glimmt (inneres Licht)
      if (!(p.tod && f >= 2)) { const hx = r(bx - 6), hy = r(by + 4 + sw); for (let y = hy - 3; y <= hy + 3; y++) for (let x = hx - 3; x <= hx + 3; x++) if (ist(x, y, HERZ)) P.set(x, y, (x + y) % 2 ? 'wachs' : 'kerzenrot'); P.set(hx, hy, 'glut'); P.set(hx - 1, hy - 1, 'kern'); P.glow(hx, hy, 9, 0.6, 'glutDim', 'k3'); }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      { const leer = (x, y) => x < 0 || y < 0 || x >= W || y >= H || !P.get(x, y), z = [];
        for (let y = 0; y < 171; y++) for (let x = 0; x < W; x++) { const c = P.get(x, y); if (c < 1 || c > 5) continue;
          if (leer(x + 1, y) && leer(x, y - 1)) z.push([x, y, 'r2']); else if (leer(x + 1, y) || leer(x + 1, y - 1)) z.push([x, y, 'r1']); }
        for (const [x, y, c] of z) P.set(x, y, c); }
    };
    return { gruppen, details, augen };
  },
};
