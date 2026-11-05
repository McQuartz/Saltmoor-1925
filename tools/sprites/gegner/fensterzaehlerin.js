// Leuchtturmhof: Die Fensterzählerin. Die Frau des Oberwärters. Seit der Strahl nach innen fällt,
// geht sie nachts über den Hof und zählt die Fenster der Wärterhäuser, die er trifft. Es ist jede Nacht
// eins mehr. Eins hat sie ausgehängt und trägt es vor sich her. Falsch ist, was in den Scheiben ist:
// Licht, als stünde ein Zimmer dahinter, und in einer Scheibe steht eine Frau und zählt.
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
  id: 'fensterzaehlerin', biom: 'leuchtturm', zone: 'leuchtturm', w: 96, h: 120, fuss: [54, 115], kopf: [56, 6], rimBis: 113,
  varianten: {
    // a: Sprossenfenster mit sechs Scheiben, vor der Brust, Haarknoten
    fensterzaehlerin_a: { sp: 2, zl: 3, fw: 30, fh: 40, fy: 32, fdx: -22, knoten: true },
    // b: vier Scheiben, tiefer gehalten, Gardine halb vorgezogen, Kopftuch
    fensterzaehlerin_b: { sp: 2, zl: 2, fw: 30, fh: 32, fy: 44, fdx: -24, gardine: true },
  },
  // Probe ohne Fenster (nicht gebaut): Frau im Rock mit Schultertuch, nicht von der Badefrau und der
  // Tintenfrau zu unterscheiden; das Fenster ist die Figur.
  proben: { probe_ohne_fenster: { sp: 0, zl: 0, fw: 0, fh: 0, fy: 40, knoten: true }, probe_vor_der_brust: { sp: 2, zl: 3, fw: 28, fh: 34, fy: 40, fdx: -4, knoten: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, W = 96, H = 120;
    let lean = 0, atem = 0, fall = 0, hebe = 0, zaehl = 0, kipp = 0;
    if (p.idle) { atem = 0; zaehl = f; }
    if (p.angriff) { lean = [2, 3, -8, -3][f]; hebe = [14, 24, -4, 4][f]; kipp = [0, 0.1, -0.35, -0.1][f]; zaehl = 5; }
    if (p.treffer) { lean = [3, 1][f]; hebe = 2; }
    if (p.tod) { fall = r(p.q * 12); lean = r(p.q * 3); hebe = -r(p.q * 30); }
    const T = atem + fall, cx = 60 + lean;
    // Rock: lang, glockig, Saum am Boden
    const rock = Pg([[cx - 9, 62 + T], [cx + 10, 62 + T], [cx + 18, 100], [cx + 20, 113], [cx - 18, 113], [cx - 15, 100]], null, { rd: 2 });
    const saum = Pg([[cx - 19, 110], [cx + 21, 110], [cx + 21, 114], [cx - 19, 114]], 'dunkel', { rd: 0.6 });
    // Oberkörper: schmal, ein Schultertuch mit Fransen darüber
    const leib = Pg([[cx - 7, 30 + T], [cx + 8, 30 + T], [cx + 10, 46 + T], [cx + 9, 64 + T], [cx - 9, 64 + T], [cx - 10, 46 + T]], null, { rd: 2.5 });
    const tuch = Pg([[cx - 12, 31 + T], [cx + 12, 30 + T], [cx + 15, 40 + T], [cx + 4, 56 + T], [cx - 2, 58 + T], [cx - 14, 42 + T]], 'haut', { rd: 1.5 });
    // Kopf: geneigt, sie sieht auf das Fenster hinunter; Haarknoten oder Kopftuch
    const kx = cx - 3, ky = 21 + T;
    const kopf = E(kx, ky, 6.2, 7.2, 'haut', { pf: 'bevel' });
    const haar = v.knoten ? [E(kx + 2, ky - 3, 6.6, 5.2, null), E(kx + 7, ky - 7, 3.6, 3.4, null)] : [Pg([[kx - 7, ky - 3], [kx + 1, ky - 9], [kx + 8, ky - 5], [kx + 12, ky + 8], [kx + 4, ky + 2]], null, { rd: 1.5 })];
    const hals = C(cx, 26 + T, cx - 1, 32 + T, 3, 3.2, null);
    // Fenster: Rahmen und Sprossen, vor der Brust; beim Angriff gehoben, dann geschlagen
    const fw = v.fw, fh = v.fh, fx = cx + (v.fdx || 0) - fw / 2, fyy = v.fy + T - hebe;
    const ca = Math.cos(kipp), sa = Math.sin(kipp), M0 = [fx + fw / 2, fyy + fh];
    const rot = ([x, y]) => [M0[0] + (x - M0[0]) * ca - (y - M0[1]) * sa, M0[1] + (x - M0[0]) * sa + (y - M0[1]) * ca];
    const rahmen = [], sprossen = [];
    if (fw) {
      const R = (x0, y0, x1, y1) => Pg([[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(rot), null, { rd: 0.3 });
      rahmen.push(R(fx, fyy, fx + fw, fyy + 3), R(fx, fyy + fh - 3, fx + fw, fyy + fh), R(fx, fyy, fx + 3, fyy + fh), R(fx + fw - 3, fyy, fx + fw, fyy + fh));
      for (let i = 1; i < v.sp; i++) { const x = fx + fw * i / v.sp; sprossen.push(R(x - 0.8, fyy + 2, x + 0.8, fyy + fh - 2)); }
      for (let i = 1; i < v.zl; i++) { const y = fyy + fh * i / v.zl; sprossen.push(R(fx + 2, y - 0.8, fx + fw - 2, y + 0.8)); }
    }
    // Glas: eine Fläche hinter den Sprossen (wird im Detail als Licht gemalt)
    const glas = fw ? [Pg([[fx + 2, fyy + 2], [fx + fw - 2, fyy + 2], [fx + fw - 2, fyy + fh - 2], [fx + 2, fyy + fh - 2]].map(rot), 'haut', { rd: 0 })] : [];
    // Hände: links hält sie den Rahmen, rechts zählt ein Finger an den Scheiben
    const lh = rot([fx + fw - 6, fyy + fh - 1]);
    const armL = [...glied([[cx - 8, 34 + T], [cx - 12, 52 + T - hebe * 0.6], lh], 3, 2.3, null), E(lh[0], lh[1], 2.6, 2.4, 'haut')];
    // Zählhand: an der rechten Rahmenkante, ein Finger tippt in die Scheibe der rechten Spalte, Reihe für Reihe
    const zr = zaehl % Math.max(1, v.zl);
    const rh0 = rot([fx + fw + 2, fyy + fh * (zr + 0.5) / Math.max(1, v.zl)]);
    const ziel = fw ? rot([fx + fw - 6, fyy + fh * (zr + 0.5) / Math.max(1, v.zl)]) : [cx, 40];
    const armR = glied([[cx + 8, 34 + T], [cx + 10, 44 + T - hebe * 0.4], [cx - 2, rh0[1] + 2], rh0], 2.8, 2.2, 'dunkel');
    const finger = fw ? [C(rh0[0], rh0[1], ziel[0], ziel[1], 1, 0.8, 'haut'), E(rh0[0] + 1, rh0[1], 2.4, 2.2, 'haut')] : [];
    const gruppen = [
      { p: armR, k: 1, anker: [lean, T] },
      { p: [rock], k: 2, anker: [lean, 0] },
      { p: [saum], k: 0, kante: true },
      { p: [leib, hals], k: 2, anker: [lean, T] },
      { p: [tuch], k: 0, kante: true, anker: [lean, T] },
      { p: haar, k: 1, kante: true, anker: [lean, T] },
      { p: [kopf], k: 0, kante: true, anker: [lean, T] },
      { p: glas, k: 0, noRim: true },
      { p: [...rahmen, ...sprossen], k: 0, kante: true },
      { p: armL, k: 1, kante: true, anker: [lean, T] },
      { p: finger, k: 0, kante: true },
    ];
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('leuchtturm'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      innenKanten(P, gid, gruppen, W, H, 'r1');
      const istG = (x, y, i) => gid[y * W + x] === i;
      // Rock: Falten von der Hüfte zum Saum, auf jeder ein Grat Licht
      for (const [dx0, dx1] of [[-5, -13], [0, -3], [5, 8], [9, 16]]) { P.line(cx + dx0, 66 + T, cx + dx1, 109, 'k0', true); P.line(cx + dx0 + 1, 68 + T, cx + dx1 + 1, 108, 'k3', true); }
      // Schlüsselbund am Rockbund (Messing), ein Bund Fensterschlüssel
      if (!p.tod) { P.auf(cx + 6, 66 + T, 'messing'); P.auf(cx + 7, 68 + T, 'k3'); P.auf(cx + 5, 69 + T, 'messing'); P.auf(cx + 7, 70 + T, 'k3'); }
      P.line(cx - 9, 64 + T, cx + 9, 64 + T, 'k3', true);
      // Schultertuch: Strickmuster in Reihen, Fransen unten
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (istG(x, y, 4) && P.get(x, y) >= 1 && P.get(x, y) <= 4) { if ((y - T) % 3 === 0) P.set(x, y, 'k2'); else if (!istG(x + 1, y, 4) || !istG(x, y - 1, 4)) P.set(x, y, 'r1'); }
      for (let i = 0; i < 6; i++) { const x = r(cx - 12 + i * 2.4), y = r(43 + T + i * 2.4); P.set(x, y + 1, 'k3'); P.set(x, y + 2, 'k2'); }
      // Gesicht: zum Fenster geneigt, der Mund zählt; heller Spitzenkragen
      P.auf(kx - 4, ky + 4, 'k1'); P.auf(kx - 3, ky + 4, 'k0');
      P.line(cx - 4, 30 + T, cx + 4, 30 + T, 'r1', true); P.line(cx - 3, 31 + T, cx + 3, 31 + T, 'k3', true);
      // Glas: Licht, als stünde ein Zimmer dahinter; die gezählte Scheibe hell, in einer steht eine kleine Frau
      if (fw && (!p.tod || f < 2)) {
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          if (!istG(x, y, 7)) continue;
          const t = 0.85 - 0.45 * ((y - fyy) / fh) + (v.gardine && x < fx + fw * 0.45 ? -0.4 : 0);
          P.set(x, y, LIB.bay(x, y) < t ? 'glutDim' : 'k2');
        }
        if (v.gardine) for (let x = r(fx + 3); x < fx + fw * 0.45; x += 3) for (let y = r(fyy + 3); y < fyy + fh - 3; y++) if (istG(x, y, 7)) P.set(x, y, 'k3');
        // die Frau in der Scheibe unten rechts: Kopf, Rock, ein erhobener Finger
        const fsx = r(fx + fw * 0.5 / v.sp) + 1, fsy = r(fyy + fh * (v.zl - 0.5) / v.zl) + 1;
        if (!p.angriff) { P.el(fsx + 0.5, fsy - 4.5, 1.6, 1.6, 'k0', true); P.auf(fsx + 1, fsy - 6, 'k0'); for (let k = 0; k < 6; k++) P.line(fsx - 1 - (k >> 1), fsy - 2 + k, fsx + 1 + (k >> 1), fsy - 2 + k, 'k0', true); P.line(fsx - 1, fsy - 2, fsx - 3, fsy - 5, 'k1', true); }
        // gezählte Scheibe: hell
        const zx = r(ziel[0]), zy = r(ziel[1]);
        P.set(zx + 1, zy - 1, 'glut'); P.set(zx + 2, zy - 1, 'kern'); P.set(zx + 2, zy, 'glut'); augen.push([zx + 2, zy - 1]);
        // Kitt und Rahmen: Lichtkante oben rechts schon durch das Rendern; Fuge zwischen Glas und Holz
      }
      // Auge: eines, offen, schräg im Haar (es sieht dich, während sie zählt)
      if (!p.tod || f < 1) { const ex = r(kx - 4), ey = r(ky); P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.glow(ex + 0.5, ey + 0.5, 3.5, 0.6); augen.push([ex, ey]); }
      if (p.tod) for (let y = 115; y < H; y++) for (let x = 0; x < W; x++) P.loesch(x, y);
    };
    return { gruppen, details, augen };
  },
};
