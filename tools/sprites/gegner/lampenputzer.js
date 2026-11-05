// Leuchtturmhof: Der Lampenputzer. Der Hilfswärter, der seit 1917 jeden Morgen die Linse putzt.
// Er steht auf seiner Trittleiter mitten im Hof und putzt in kleinen Kreisen die Luft vor sich,
// mit Leinenschürze und Ledertuch, wie es Vorschrift ist. Falsch ist sein Gesicht: Er hat es mit
// geputzt. Es ist blank wie der Reflektor, und darin steht ein Punkt Licht, auch wenn er wegsieht.
'use strict';
const LIB = require('../lib');
// Innenkanten: vordere Teile (gruppe.kante) fangen an ihrer Lichtkante eine Linie Randlicht
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
  id: 'lampenputzer', biom: 'leuchtturm', zone: 'leuchtturm', w: 96, h: 120, fuss: [48, 115], kopf: [42, 8], rimBis: 113,
  varianten: {
    // a: Trittleiter mit zwei Stufen, Schirmmütze, lange Schürze
    lampenputzer_a: { leiter: 2, top: 92, muetze: 'schirm', schuerze: 84, buckel: 0 },
    // b: höhere Leiter, gebeugt, Wollmütze, das Tuch hängt länger
    lampenputzer_b: { leiter: 3, top: 86, muetze: 'woll', schuerze: 78, buckel: 4, tuch: 1.4 },
  },
  // Silhouetten-Proben (nicht gebaut): ohne Leiter auf dem Boden stehend las er sich wie ein beliebiger
  // Mann mit erhobenem Arm (zu nah am Kirchenvogt und am Echo); die Leiter macht ihn eindeutig.
  proben: {
    probe_ohne_leiter: { leiter: 0, top: 114, muetze: 'schirm', schuerze: 104, buckel: 0 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, W = 96, H = 120;
    // Kreis des Tuchs (Leerlauf), Ausholen und Peitschen (Angriff)
    let lean = 0, bob = 0, fall = 0, hand = null, tuchA = 0, schnapp = 0;
    const kr = [[0, 0], [-2, -2], [-4, 0], [-2, 2]];
    if (p.idle) { const k = kr[f]; hand = [k[0], k[1]]; bob = 0; tuchA = [0, 0.15, 0.05, -0.1][f]; }
    if (p.angriff) { lean = [3, 5, -5, -2][f]; hand = [[14, -8], [22, -10], [-12, 10], [-4, 4]][f]; schnapp = [0, 0, 1, 0.4][f]; tuchA = [0.6, 0.9, -1.2, -0.4][f]; }
    if (p.treffer) { lean = [3, 1][f]; hand = [6, 6]; tuchA = 0.4; }
    if (p.tod) { fall = r(p.q * 16); lean = r(p.q * 4); hand = [8, 18 + r(p.q * 10)]; tuchA = 0.6; }
    if (!hand) hand = [0, 0];
    const top = v.top, T = bob + fall, bu = v.buckel || 0;
    const cx = 46 + lean;
    // Leiter: zwei Holme vorn (hell von rechts), ein Bein hinten, Stufen; steht fest, bewegt sich nicht
    const leiter = [], leiterH = [];
    if (v.leiter) {
      leiter.push(C(40, top, 31, 114, 1.5, 1.6, null), C(56, top, 47, 114, 1.4, 1.5, null));
      leiterH.push(C(54, top, 66, 114, 1.4, 1.5, null));
      leiter.push(Pg([[37, top - 2], [59, top - 2], [59, top + 1], [37, top + 1]], null, { rd: 0.4 }));
      for (let i = 1; i <= v.leiter; i++) { const y = top + (114 - top) * i / (v.leiter + 1), q = (y - top) / (114 - top); leiter.push(C(40 - 9 * q, y, 56 - 9 * q, y, 1.1, 1.1, null)); }
    }
    const fy = top - 2; // Fußsohle
    // Beine: Hose, schwere Stiefel; leicht auseinander
    const huefte = [cx + 2, fy - 29 + T];
    const beine = [...glied([[huefte[0] - 4, huefte[1]], [cx - 4 + lean * 0.3, fy - 14 + T * 0.5], [cx - 6, fy - 3]], 4.8, 3.4, null),
      ...glied([[huefte[0] + 4, huefte[1]], [cx + 6, fy - 14 + T * 0.5], [cx + 5, fy - 3]], 4.6, 3.2, null),
      E(cx - 8, fy - 1.5, 5, 2.4, 'dunkel'), E(cx + 4, fy - 1.5, 5, 2.2, 'dunkel')];
    // Rumpf: Uniformjacke, zweireihig, etwas vorgebeugt (Buckel bei b)
    const sh = [cx - 1 - bu, fy - 58 + T + bu * 0.5];
    const rumpf = Pg([[sh[0] - 11, sh[1] + 2], [sh[0] + 9, sh[1] - 2], [sh[0] + 15 + bu * 0.5, sh[1] + 7], [huefte[0] + 11, huefte[1] + 2], [huefte[0] + 10, huefte[1] + 9], [huefte[0] - 11, huefte[1] + 9], [huefte[0] - 12, huefte[1] - 2], [sh[0] - 13, sh[1] + 11]], null, { rd: 2.5 });
    // Schürze: Leinen, eine Stufe heller, vorn von der Brust bis unters Knie, mit Falten
    const sy0 = sh[1] + 9, sy1 = v.schuerze + T * 0.5;
    const schuerze = Pg([[sh[0] - 10, sy0], [sh[0] + 3, sy0 - 1], [huefte[0] + 4, huefte[1] + 3], [huefte[0] + 5, sy1], [huefte[0] - 18, sy1 + 1], [huefte[0] - 14, huefte[1] + 2]], 'haut', { rd: 1.2 });
    // Kopf: tief zwischen den Schultern, Gesicht = blanke Scheibe
    const kx = sh[0] - 4, ky = sh[1] - 8;
    const nacken = E(kx + 3, ky + 5, 5, 4, null);
    const kopf = E(kx, ky, 6.8, 7.4, null, { pf: 'bevel' });
    const gesicht = E(kx - 3, ky + 0.5, 4.2, 5.6, 'haut', { pf: 'dome' });
    const muetze = v.muetze === 'schirm'
      ? [Pg([[kx - 6, ky - 4], [kx + 6, ky - 6], [kx + 7, ky - 11], [kx - 5, ky - 10]], null, { rd: 1 }), Pg([[kx - 12, ky - 4], [kx - 2, ky - 5], [kx - 2, ky - 3], [kx - 11, ky - 2]], 'dunkel', { rd: 0.4 })]
      : [E(kx + 1, ky - 6, 7, 5, null), E(kx + 5, ky - 10, 3, 2.5, null)];
    // Putzarm (vorn): Schulter -> Ellbogen -> Hand, die Hand kreist vorn auf Kopfhöhe
    const hx = kx - 20 + hand[0], hy = ky + 1 + hand[1];
    const ell = [sh[0] - 12 + hand[0] * 0.3, sh[1] + 12 + hand[1] * 0.4];
    const arm = [...glied([[sh[0] - 6, sh[1] + 4], ell, [hx, hy]], 3.6, 2.6, null), E(hx, hy, 2.8, 2.4, 'haut')];
    // Tuch: hängt von der Hand, schwingt; beim Schlag peitscht es lang nach vorn
    const tl = 16 * (v.tuch || 1);
    const ta = Math.PI / 2 + tuchA + schnapp * 0.2;
    const te = [hx + Math.cos(ta) * tl - schnapp * 16, hy + Math.sin(ta) * tl - schnapp * 6];
    const tuch = [Pg([[hx - 3, hy + 1], [hx + 4, hy + 1], [te[0] + 5, te[1]], [te[0] + 1, te[1] + 3], [te[0] - 3, te[1] + 1], [te[0] - 6, te[1] - 1]], 'haut', { rd: 0.8 })];
    // hinterer Arm: hält sich am Leiterholm fest
    const armH = glied([[sh[0] + 8, sh[1] + 5], [sh[0] + 13, sh[1] + 18], [56, top - 3]], 3, 2.2, 'dunkel');
    const gruppen = [
      { p: leiterH, k: 0, tone: -0.15 },
      { p: armH, k: 1, anker: [lean, T] },
      { p: beine, k: 1.5, anker: [lean, 0] },
      { p: [rumpf, nacken], k: 2, anker: [lean, T] },
      { p: [schuerze], k: 0, kante: true, tone: 0.22, anker: [lean, T] },
      { p: [kopf], k: 0, kante: true, anker: [lean, T] },
      { p: muetze, k: 0.5, kante: true, anker: [lean, T] },
      { p: [gesicht], k: 0, noRim: true, anker: [lean, T] },
      { p: leiter, k: 0, kante: true },
      { p: tuch, k: 0, kante: true, tone: 0.3 },
      { p: arm, k: 1.2, kante: true },
    ];
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('leuchtturm'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      innenKanten(P, gid, gruppen, W, H, 'r1');
      const imG = (x, y, i) => gid[Math.round(y) * W + Math.round(x)] === i;
      // Jacke: Knopfreihen (Messing, nur die oberen fangen Licht), Kragen, Gürtelnaht
      for (let i = 0; i < 4; i++) { const y = sh[1] + 4 + i * 5; if (imG(sh[0] + 4, y, 3)) P.set(sh[0] + 4, y, i < 2 ? 'messing' : 'k3'); if (imG(sh[0] + 9, y + 1, 3)) P.set(sh[0] + 9, y + 1, 'k3'); }
      P.line(sh[0] - 4, sh[1] + 2, sh[0] + 1, sh[1] + 9, 'k0', true);
      P.line(huefte[0] - 6, huefte[1] + 1, huefte[0] + 8, huefte[1], 'k0', true);
      // Schürze: helles Leinen im Gegenlicht (k3, oben gedithert heller), damit der Rumpf eine Binnenform hat
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== 4) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const q = (y - sy0) / Math.max(1, sy1 - sy0); const rechts = gid[y * W + x + 1] !== 4 || gid[y * W + x + 2] !== 4; P.set(x, y, rechts && q < 0.9 ? 'r1' : 'k3'); }
      // Jacke: Revers, Taschenklappe, Ärmelnaht
      P.line(sh[0] + 1, sh[1], sh[0] + 6, sy0 + 6, 'k0', true); P.line(sh[0] + 2, sh[1], sh[0] + 7, sy0 + 6, 'k3', true);
      P.line(huefte[0] + 5, huefte[1] - 4, huefte[0] + 10, huefte[1] - 4, 'k3', true);
      // Rückennaht und Rockschoß: eine Linie Licht, darunter der Schlitz
      P.line(sh[0] + 11, sh[1] + 6, huefte[0] + 8, huefte[1] - 1, 'k3', true); P.line(huefte[0] + 8, huefte[1] + 2, huefte[0] + 7, huefte[1] + 8, 'k0', true);
      P.line(sh[0] + 7, sh[1] + 14, sh[0] + 9, sh[1] + 24, 'k1', true);
      // Schürze: senkrechte Falten (Tal dunkel, Grat hell), Bänder am Hals
      for (const dx of [-13, -7, -1]) { const x0 = huefte[0] + dx; P.line(x0 + 2, sy0 + 8, x0, sy1 - 1, 'k1', true); P.line(x0 + 3, sy0 + 10, x0 + 1, sy1 - 2, 'r1', true); }
      P.line(sh[0] - 9, sy0, sh[0] - 3, sh[1] - 2, 'k3', true);
      P.line(huefte[0] - 15, sy1, huefte[0] + 2, sy1 - 1, 'k1', true);
      // Ölfleck auf der Schürze
      P.auf(huefte[0] - 4, huefte[1] + 6, 'k1'); P.auf(huefte[0] - 3, huefte[1] + 6, 'k1'); P.auf(huefte[0] - 4, huefte[1] + 7, 'k2');
      // Leiter: Holzmaserung, Stufen mit heller Oberkante
      if (v.leiter) for (let i = 1; i <= v.leiter; i++) { const y = r(top + (114 - top) * i / (v.leiter + 1)), q = (y - top) / (114 - top); for (let x = r(41 - 9 * q); x <= 55 - 9 * q; x++) P.auf(x, y - 1, 'r1'); }
      // Mützenabzeichen
      if (v.muetze === 'schirm') P.auf(kx - 3, ky - 6, 'messing');
      // Gesicht: blanke Scheibe ohne Züge. Darin gespiegelt ein Fensterkreuz (Licht von hinten) und ein Punkt Licht
      if (!p.tod || f < 1) {
        const gx = r(kx - 3), gy = r(ky);
        // die Scheibe: gewölbt wie ein Reflektor, rechts die Lichtkante, oben ein Bogen Glanz
        for (let y = gy - 6; y <= gy + 6; y++) for (let x = gx - 5; x <= gx + 4; x++) { if (gid[y * W + x] !== 7) continue; const rr = Math.hypot((x - gx) / 4.2, (y - gy) / 5.6);
          P.set(x, y, gid[y * W + x + 1] !== 7 ? 'r1' : rr > 0.75 ? 'k2' : 'k3'); }
        P.line(gx - 2, gy - 4, gx + 1, gy - 5, 'r1'); P.set(gx + 2, gy - 4, 'r2');
        P.glow(gx + 0.5, gy + 0.5, 5, 0.8);
        P.set(gx, gy, 'kern'); P.set(gx - 1, gy, 'glut'); P.set(gx, gy + 1, 'glut');
        augen.push([gx, gy]);
        // die Hand ist blank geputzt wie das Gesicht
        P.auf(r(hx) - 1, r(hy) - 1, 'r1');
      }
      // Tuch: Ledertuch, hell im Gegenlicht, Saum und eine Falte
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== 9) continue; const c = P.get(x, y); if (c >= 1 && c <= 4) P.set(x, y, gid[y * W + x + 1] !== 9 || gid[(y - 1) * W + x] !== 9 ? 'r1' : 'k3'); }
      P.line(hx - 1, hy + 3, te[0] - 1, te[1], 'k1', true);
      if (p.tod) for (let y = 115; y < H; y++) for (let x = 0; x < W; x++) P.loesch(x, y);
    };
    return { gruppen, details, augen };
  },
};
