// Der Turnlehrer (Waisenhaus am Deich). Er hat den Kindern im Herbst 1913 die Waage beigebracht, auf dem Deich,
// bei Wind. Er hält sie noch: der Leib waagerecht, die Arme wie Schwingen zurückgenommen, auf einem Bein,
// das zu lang ist für einen Menschen. Er atmet nicht. Die Trillerpfeife hängt ihm an der Schnur senkrecht
// unter der Brust, und aus ihr tropft Wasser.
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
  id: 'turnlehrer', biom: 'waisenhaus', zone: 'waisenhaus', w: 96, h: 120, fuss: [56, 115], kopf: [26, 34], rimBis: 113,
  varianten: {
    // a: Schwalbe, beide Arme zurück, die Pfeife hängt
    turnlehrer_a: { keule: false, bein: 0 },
    // b: eine Turnkeule in der vorgestreckten Hand, das freie Bein höher
    turnlehrer_b: { keule: true, bein: 0.18 },
  },
  // Silhouetten-Probe (verworfen): aufrecht stehend mit Pfeife und Keule; schwarz ein Mann wie der Holzfäller,
  // der Lotse oder der Vermesser. Die Waage auf dem zu langen Bein gibt es sonst nicht (ein „T“ auf einem Stiel).
  proben: { sil_aufrecht: { keule: true, bein: 0, aufrecht: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let kipp = 0, atem = 0, fall = 0, knick = 0, armV = 0, pfeife = 0, beinHub = v.bein;
    // kipp: Neigung des Leibs um die Hüfte (positiv = Kopf nach unten); armV: vorderer Arm 0 zurück .. 1 vorn
    if (p.idle) { kipp = [0, 0.02, 0.03, 0.01][f]; atem = 0; pfeife = f; }
    if (p.angriff) { kipp = [-0.25, -0.42, 0.42, 0.18][f]; armV = [0.2, 0.1, 1, 0.6][f]; beinHub = v.bein + [-0.1, -0.2, 0.35, 0.15][f]; pfeife = f; }
    if (p.treffer) { kipp = [-0.15, -0.06][f]; }
    if (p.tod) { knick = Math.min(1, p.q * 1.5); fall = r(p.q * 36); kipp = p.q * 0.5; }
    if (v.aufrecht) kipp = -1.45;
    const hx = 58 + r(knick * 4), hy = 46 + fall;
    const ck = Math.cos(kipp), sk = Math.sin(kipp);
    const R = (lx, ly) => [hx - lx * ck - ly * sk, hy + lx * sk - ly * ck];
    const PR = pts => pts.map(([a, b]) => R(a, b));
    // Standbein: senkrecht, zu lang, gerade; Fuß im Turnschuh zeigt nach vorn
    const fy = 114;
    const kn = [hx + 1 + knick * 8, (hy + fy) / 2 + 2], an = [hx, fy - 3];
    const bein = [...glied([[hx + 1, hy + 2], kn, an], 4.2, 2.4, null), Pg([[an[0] - 2, fy - 4], [an[0] + 2, fy - 4], [an[0] + 3, fy + 1], [an[0] - 8, fy + 1], [an[0] - 8, fy - 1]], 'dunkel', { rd: 0.8 })];
    // freies Bein: nach hinten gestreckt, Fuß gestreckt
    const bw = -beinHub;
    const bk = R(-15, 1 + bw * 16 * 0.5), be = R(-29, 3 + bw * -27);
    const frei = [...glied([R(-3, 0), bk, be], 4.4, 2.6, null), C(be[0], be[1], ...R(-33, 3 + bw * -31), 2.2, 1.2, 'dunkel')];
    // Leib: Turnhemd, waagerecht; Brust vorn tiefer
    const leib = Pg(PR([[-5, 5], [6, 7], [18, 8], [26, 6], [29, 1], [27, -5], [18, -8], [7, -7], [-3, -6], [-6, 0]]), 'haut', { rd: 2, tone: 0.1 });
    const guertel = Pg(PR([[-1, 6.5], [4, 7], [4, -6.5], [-1, -6]]), 'dunkel', { rd: 0.5 });
    // Kopf: nach vorn, Gesicht leicht nach unten; Schnurrbart
    const kopf = E(...R(35, 2), 5, 5.6, 'haut', { pf: 'bevel' });
    const hals = C(...R(27, 1), ...R(32, 1), 3, 2.8, null);
    // Arme: Schwalbe (zurück und hoch). Im Angriff schwingt der vordere Arm nach vorn unten
    const sch = R(23, 3);
    const zur = [R(13, 10), R(2, 13)], vor = [R(36, -3), R(48, -6)];
    const armVorn = [...glied([sch, [zur[0][0] + (vor[0][0] - zur[0][0]) * armV, zur[0][1] + (vor[0][1] - zur[0][1]) * armV], [zur[1][0] + (vor[1][0] - zur[1][0]) * armV, zur[1][1] + (vor[1][1] - zur[1][1]) * armV]], 2.8, 2, null)];
    const handV = armVorn[armVorn.length - 1]; const hv = [handV.x2, handV.y2];
    armVorn.push(E(hv[0], hv[1], 2.2, 2, 'haut'));
    const armHinten = [...glied([R(22, 5), R(12, 12), R(1, 15)], 2.6, 1.8, null)];
    // Keule (b): in der vorderen Hand, zeigt nach vorn/oben
    const keule = [];
    if (v.keule && !p.tod) { const a = armV > 0.5 ? Math.PI * 0.85 : -0.4 - kipp; const dx = Math.cos(a), dy = Math.sin(a); const k0 = [hv[0] + dx * 2, hv[1] + dy * 2], k1 = [hv[0] + dx * 18, hv[1] + dy * 18];
      keule.push(C(k0[0], k0[1], hv[0] + dx * 7, hv[1] + dy * 7, 1, 1, null), C(hv[0] + dx * 7, hv[1] + dy * 7, k1[0], k1[1], 1.6, 3.6, null), E(k0[0] - dx, k0[1] - dy, 1.6, 1.6, null)); }
    // Pfeife an der Schnur: hängt senkrecht unter dem Hals (Schwerkraft), schwingt beim Kippen
    const sn = R(27, -4); const pl = 13 + (p.tod ? 0 : 0); const pe = [sn[0] + (p.angriff ? [2, 3, -4, -2][f] : 0), sn[1] + pl];
    const schnur = [C(sn[0], sn[1], pe[0], pe[1], 0.75, 0.75, null, { pf: 'flat' })];
    const pf = [C(pe[0] - 2, pe[1] + 1, pe[0] + 2, pe[1] + 1, 1.3, 1.3, null), E(pe[0] + 2, pe[1] + 1.6, 1.8, 1.6, null)];
    const gruppen = [
      { p: armHinten, k: 1, kante: true },
      { p: bein, k: 1, kante: true },
      { p: frei, k: 1, kante: true },
      { p: [leib], k: 1.5, kante: true },
      { p: [guertel], k: 0, kante: true },
      { p: [hals], k: 1 },
      { p: [kopf], k: 0.5, kante: true },
      { p: schnur, k: 0 },
      { p: pf, k: 0.4, kante: true },
      { p: armVorn, k: 1, kante: true },
      { p: keule, k: 0.8, kante: true },
    ];
    const BEIN = 1, FREI = 2, LEIB = 3, KOPF = 6, PF = 8, KEULE = 10;
    gruppen.forEach(g => { g.anker = [0, fall]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('waisenhaus'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
      const b = (x, y) => LIB.bay(x, y - fall);
      // Turnhemd: quergestreift (Ringel), unten Schatten; die Streifen folgen der Neigung
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, LIB_ID(LEIB))) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const lx = -((x + 0.5 - hx) * ck - (y + 0.5 - hy) * sk), ly = -((x + 0.5 - hx) * sk + (y + 0.5 - hy) * ck);
        if (((Math.floor(lx / 3)) & 1) && lx > 5 && lx < 27) P.set(x, y, ly > -2 ? 'k3' : 'k2'); else if (lx > 5 && lx < 27 && ly < 0) P.set(x, y, 'k1');
        if (ly < -4.5) P.set(x, y, 'k0');
      }
      // Hose: Bügelfalte am Standbein, Knie
      for (let y = hy + 4; y < 110; y++) { const t = (y - hy) / (fy - hy); const x = hx + 1 + (kn[0] - hx - 1) * Math.min(1, t * 2) + 0.5; if (ist(x, y, BEIN) && P.get(x, y) <= 4) P.set(x, y, (y & 1) ? 'k3' : 'k2'); }
      P.auf(kn[0] + 1, kn[1], 'k0'); P.auf(kn[0] - 1, kn[1] + 1, 'k0');
      { const [gx, gy] = R(1.5, -6); P.auf(gx, gy, 'ocker'); P.auf(gx, gy - 1, 'ocker'); }
      // Turnschuh: weiße Kappe (Kalk)
      P.auf(an[0] - 7, fy - 1, 'kalk'); P.auf(an[0] - 6, fy - 1, 'kalk'); P.auf(an[0] - 7, fy, 'k3');
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Gesicht: Auge rot, Schnurrbart dunkel, Wasser im Bart; Haar kurz geschoren, nass
      const [kx, ky] = R(35, 2);
      const [ax, ay] = R(38, 2.5);
      if (!(p.tod && f >= 1)) { P.glow(ax, ay, 5, 0.9, 'glutDim', 'k3'); P.set(ax, ay, 'kern'); P.set(ax + 1, ay, 'glut'); augen.push([r(ax), r(ay)]); }
      const [mx, my] = R(38, -1.5);
      for (let i = -2; i <= 2; i++) { P.auf(mx + i, my, 'k0'); P.auf(mx + i, my + (Math.abs(i) === 2 ? 1 : 0), 'k0'); }
      P.set(mx - 2, my + 2, 'nass'); if (!p.tod) P.set(mx - 2, my + 4 + (pfeife % 2) * 2, 'nass');
      for (let x = r(kx - 4); x <= r(kx + 4); x++) for (let y = r(ky - 6); y <= r(ky - 2); y++) if (ist(x, y, KOPF) && P.get(x, y) <= 4 && b(x, y) < 0.5) P.set(x, y, 'nass');
      // Pfeife: Messing, fängt das rote Licht; es tropft
      P.auf(pe[0] - 1, pe[1] + 1, 'ocker'); P.auf(pe[0], pe[1], 'ocker'); P.set(pe[0] + 3, pe[1] + 1, 'k0');
      if (!(p.tod && f >= 1)) { P.set(pe[0] + 1, pe[1] + 1, 'glut'); P.glow(pe[0] + 1, pe[1] + 1, 3, 0.6, 'glutDim', 'k2'); }
      if (!p.tod) { P.set(pe[0] + 2, pe[1] + 4 + (pfeife % 2) * 2, 'nass'); P.set(pe[0] + 2, pe[1] + 9 + ((pfeife + 1) % 2) * 2, 'nass'); }
      // Pfütze unter dem Standfuß
      if (!p.tod || f < 2) for (let x = an[0] - 12; x <= an[0] + 8; x++) if (!P.get(x, fy + 1) && (x + f) % 3) P.set(x, fy + 1, (x & 1) ? 'nass' : 'k1');
      // Keule: Holz, Ringe
      if (keule.length) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, KEULE) && P.get(x, y) <= 4 && ((x + y) % 5 === 0)) P.set(x, y, 'ocker');
      // Lichtkante oben auf Rücken und Bein kräftig
      const z = [];
      for (let y = 0; y < 112; y++) for (let x = 0; x < W; x++) { const g = gid[y * W + x]; if (g !== LEIB && g !== FREI) continue; const c = P.get(x, y); if (c < 1 || c > 5) continue; if (!P.get(x, y - 1) && !P.get(x + 1, y - 1)) z.push([x, y]); }
      for (const [x, y] of z) P.set(x, y, 'r2');
    };
    function LIB_ID(i) { return i; }
    return { gruppen, details, augen };
  },
};
