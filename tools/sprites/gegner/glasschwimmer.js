// Der Glasschwimmer (Glasmeer). Ein Langstreckenschwimmer von 1925 in gestreiftem Wollbadeanzug,
// Lederkappe und Schwimmbrille. Er krault durch das schwarze Glas, als wäre es Wasser: Oberkörper und
// ein Arm im Bogen ragen heraus, vor dem Kopf steht eine Bugwelle aus Glas, die Spritzer hängen als
// Glasperlen in der Luft. Wo er die Fläche durchbricht, leuchtet von unten das grüne Licht heraus.
// Exportiert zusätzlich `glas`: Pixel-Hilfen für alle Glasmeer-Figuren (Riss, Spiegelstreif, Muschelbruch).
'use strict';

// ---------- Glas-Hilfen (auf dem Pinsel P nach dem Rendern) ----------
const hsh = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
const glas = {
  // Riss mit grünem Licht: Zickzack von a nach b, Kern hell, Ränder gedimmt. staerke 0..1 (Licht an/aus)
  riss(P, a, b, o = {}) {
    const n = o.zacken || 4, seed = o.seed || 1, st = o.staerke ?? 1, pts = [a];
    for (let i = 1; i < n; i++) { const q = i / n, nx = -(b[1] - a[1]), ny = b[0] - a[0], l = Math.hypot(nx, ny) || 1, j = (hsh(seed, i) - 0.5) * (o.zick ?? 4); pts.push([a[0] + (b[0] - a[0]) * q + nx / l * j, a[1] + (b[1] - a[1]) * q + ny / l * j]); }
    pts.push(b);
    const pix = [];
    for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], m = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))) || 1; for (let k = 0; k <= m; k++) pix.push([Math.round(x0 + (x1 - x0) * k / m), Math.round(y0 + (y1 - y0) * k / m)]); }
    if (st <= 0) { pix.forEach(([x, y]) => P.auf(x, y, 'k0')); return pts; }
    if (st > 0.3) pix.forEach(([x, y], i) => { if (i % 3 === 0) P.glow(x + 0.5, y + 0.5, 2.6 * st + 0.5, 0.55 * st); });
    pix.forEach(([x, y], i) => {
      if (!P.get(x, y)) return;
      const t = st * (0.55 + 0.45 * Math.sin(i * 0.9 + seed));
      P.auf(x, y, t > 0.92 && o.kern !== false ? 'glut' : t > 0.45 ? 'nordlicht' : t > 0.15 ? 'glutDim' : 'k0');
      // dunkle Bruchkante unten links am Riss (Fase gegen das Licht)
      if (P.get(x - 1, y + 1) && P.get(x - 1, y + 1) <= 4) P.auf(x - 1, y + 1, 'k0');
    });
    return pts;
  },
  // Spiegelstreif: schräger Glanz der Eisdecke auf glattem Glas (k3, Mitte r1 sparsam)
  streif(P, a, b, br = 1, o = {}) {
    const m = Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]))) || 1;
    for (let k = 0; k <= m; k++) {
      const q = k / m, x = a[0] + (b[0] - a[0]) * q, y = a[1] + (b[1] - a[1]) * q, w = br * Math.sin(Math.PI * Math.min(1, q * 1.15 + 0.05));
      for (let d = -Math.ceil(w); d <= Math.ceil(w); d++) {
        const xx = Math.round(x + d), yy = Math.round(y); const c = P.get(xx, yy); if (!c || c > 4) continue;
        if (Math.abs(d) <= w * 0.35 && (o.hell ?? 0.5) > hsh(xx, yy) && q > 0.2 && q < 0.8) P.auf(xx, yy, 'r1');
        else if (Math.abs(d) <= w) P.auf(xx, yy, c < 3 ? 3 : 4);
      }
    }
  },
  // Muschelbruch (Obsidian): konzentrische Bögen, abwechselnd hell/dunkel, nur auf Körper
  muschel(P, cx, cy, r, a0 = -2.4, a1 = -0.6, ringe = 3) {
    for (let k = 1; k <= ringe; k++) { const rr = r * k / ringe; for (let a = a0; a <= a1; a += 0.6 / rr) { const x = Math.round(cx + Math.cos(a) * rr), y = Math.round(cy + Math.sin(a) * rr * 0.8); const c = P.get(x, y); if (!c || c > 4) continue; P.auf(x, y, k % 2 ? 4 : 1); } }
  },
  // Unterlicht: Polarlicht aus dem Glas hellt die Unterseiten auf (gedithert, nur auf Körper, nicht auf Randlicht)
  // yU = Boden (stärkstes Licht), h = Höhe, in der es ausläuft; maske(x,y) optional
  unterlicht(P, yU, h, st = 1, maske) {
    for (let y = Math.max(0, Math.floor(yU - h)); y <= yU + 2; y++) for (let x = 0; x < P.W; x++) {
      const c = P.get(x, y); if (!c || c > 4) continue; if (maske && !maske(x, y)) continue;
      const q = Math.min(1, (y - (yU - h)) / h), v = st * q * q * 0.8, b = A_bay(x, y);
      // Unterkante: freie Zelle darunter -> heller Saum
      const unten = !P.get(x, y + 1);
      if (unten && v > 0.35) P.set(x, y, v > 0.8 && b < 0.5 ? 'nordlicht' : 'glutDim');
      else if (v > 0.55 + b * 0.45) P.set(x, y, 'glutDim');
      else if (v > b * 0.9 && c < 4) P.set(x, y, c + 1);
    }
  },
  hsh,
};
const A_bay = (x, y) => [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5][(y & 3) * 4 + (x & 3)] / 16;

module.exports = {
  id: 'glasschwimmer', biom: 'glasmeer', zone: 'glasmeer', w: 96, h: 120, fuss: [50, 110], kopf: [30, 50], rimBis: 112,
  varianten: {
    glasschwimmer_a: { bogen: 1, kappe: 'leder', perlen: 7, fuss: true },
    glasschwimmer_b: { bogen: 0.9, kappe: 'streifen', perlen: 5, fuss: true, breit: 3, reich: true },
  },
  skizzen: { skizze_kopfsprung: { kopfsprung: true } },
  glas,
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    // ha: Armstellung 0 Ruhe (Bogen oben), 1 weit ausgeholt (hinten), 2 Schlag (vorn unten); sink: Tod
    let ha = 0, lean = 0, bob = 0, mund = 1, sink = 0, spritz = 0, glanz = 1, licht = 1;
    if (p.idle) { bob = 0; mund = [1, 1, 0, 1][f]; glanz = f; }
    if (p.angriff) { ha = [0.5, 1, 2, 1.6][f]; lean = [2, 4, -6, -3][f]; spritz = [0, 0, 1, 0.6][f]; licht = [1.1, 1.3, 1.6, 1.2][f]; mund = [1, 1, 0, 1][f]; }
    if (p.treffer) { lean = [3, 1][f]; ha = -0.4; licht = 0.6; mund = 0; }
    if (p.tod) { sink = r(p.q * 22); licht = Math.max(0, 1 - p.q * 1.6); ha = -0.6 * p.q; }
    const WY = 103; // Oberfläche des Glases im Bild
    if (v.kopfsprung) { // verworfene Skizze: senkrecht, nur Arme und Kopf aus dem Glas
      const g = [E(48, 70, 9, 10, null), C(44, 62, 40, 22, 4, 2.5, null), C(52, 62, 56, 22, 4, 2.5, null), Pg([[10, 112], [30, 98], [48, 94], [70, 98], [88, 112]], null)];
      return { gruppen: [{ p: g, k: 2 }], augen: [] };
    }
    const B0 = v.bogen, S = sink, lx = lean;
    // Rumpf: Schulter links vorn, Rücken als flacher Bogen, Hüfte taucht rechts ins Glas
    const sx = 40 + lx, sy = 84 + bob + S;
    const rumpf = Pg([[sx - 7, sy + 2], [sx - 3, sy - 4], [sx + 6, sy - 7], [sx + 18, sy - 6], [sx + 30, sy - 2], [sx + 40, sy + 6], [sx + 46, WY], [sx - 9, WY]], null, { rd: 2 });
    const kopfX = 26 + lx + (ha === 2 ? -2 : 0), kopfY = 79 + bob + S;
    const kopf = E(kopfX, kopfY, 7.5, 7.2, 'haut', { pf: 'bevel' });
    const kappe = Pg([[kopfX - 7.5, kopfY], [kopfX - 6, kopfY - 6], [kopfX, kopfY - 8.8], [kopfX + 6, kopfY - 6.5], [kopfX + 8, kopfY - 1], [kopfX + 3, kopfY - 2.5], [kopfX - 3, kopfY - 2.5]], null, { rd: 0.8 });
    const hals = C(kopfX + 4, kopfY + 3, sx, sy + 1, 4, 5.5, null);
    // Arm im Bogen (nah): Schulter -> Ellbogen hoch -> Unterarm hängt locker -> Hand mit Fingern nach unten
    const sh = [sx + 3, sy - 4];
    let ell, hand, fa = 1.9; // fa: Richtung der Finger
    if (ha <= 0) { ell = [sx + 10 - ha * 4, sy - 46 * B0 - ha * 18]; hand = [sx - 8 - ha * 6, sy - 26 * B0 - ha * 22]; fa = 1.95; }
    else if (ha < 1.5) { ell = [sx + 18 + ha * 4, sy - 48 * B0 - ha * 6]; hand = [sx + 22 + ha * 14, sy - 62 * B0 + ha * 2]; fa = -0.6; }
    else { ell = [sx - 8, sy - 24]; hand = [sx - 28, sy + 2]; fa = 2.4; }
    if (v.reich && ha <= 0) { ell = [sx - 2 + ha * 3, sy - 34 - ha * 10 + bob]; hand = [sx - 16 + ha * 4, sy - 52 - ha * 14]; fa = -2.2; }
    if (p.idle) { hand = [hand[0] + [0, 1, 1, 0][f], hand[1] + [0, 0, 1, 1][f]]; ell = [ell[0], ell[1] + [0, 0, 1, 0][f]]; }
    if (S) { ell = [ell[0], ell[1] + S * 1.6]; hand = [hand[0], hand[1] + S * 1.9]; }
    const ober = glied([sh, [sh[0] + (ell[0] - sh[0]) * 0.55 + 2, sh[1] + (ell[1] - sh[1]) * 0.55], ell], 4.6, 3.4, null);
    const unter = glied([ell, hand], 3.2, 2.1, null);
    const hf = [hand[0] + Math.cos(fa) * 6, hand[1] + Math.sin(fa) * 6];
    const handF = [Pg([[hand[0] - 2.4, hand[1] - 1], [hand[0] + 2.4, hand[1] - 1], [hf[0] + 1.4, hf[1]], [hf[0] - 1.6, hf[1] + 0.5]], 'haut', { rd: 0.6 }), C(hand[0] + 1, hand[1], hand[0] + 3.5, hand[1] + 3, 0.9, 0.7, 'haut')];
    // vorderer Arm taucht vor dem Kopf ins Glas (nur Ansatz)
    const unterArm = glied([[sx - 4, sy + 5], [kopfX - 9, WY - 4], [kopfX - 13, WY + 1]], 3.4, 2.8, null);
    // Fuß hinten: ein Schlag mit dem Bein, Ferse aus dem Glas
    const fussX = 86 + (p.idle ? [0, 1, 1, 0][f] : 0), fussY = WY - 13 + (p.angriff ? [0, -2, -5, -3][f] : 0) + S * 1.3;
    const bein = v.fuss ? [C(sx + 42, WY, fussX - 2, fussY + 6, 3.6, 2.6, null), Pg([[fussX - 4, fussY + 5], [fussX - 1, fussY - 2], [fussX + 2, fussY - 4], [fussX + 4, fussY + 1], [fussX + 1, fussY + 7]], null, { rd: 0.8 })] : [];
    // Bugwelle aus Glas vor dem Kopf (Kamm nach links gerollt); um den Körper wirft das Glas einen Rand auf
    const bw = v.breit || 0;
    const welle = Pg([[2, 106], [4, 100], [8, 94 - bw], [5, 91 - bw], [8, 87 - bw], [14, 88], [18, 94], [22, 99], [28, 102], [24, 106]], null, { rd: 0.8 });
    // Lippe: der vordere Rand des Lochs im Glas, ein flacher Bogen vor dem Körper
    const lip = x => WY + 2 - 3.5 * Math.sin(Math.PI * Math.min(1, Math.max(0, (x - 14) / 80)));
    const lp = []; for (let x = 12; x <= 96; x += 4) lp.push([x, lip(x) - 1]); for (let x = 96; x >= 12; x -= 4) lp.push([x, lip(x) + 2.4]);
    const rand = [Pg(lp, null, { rd: 0.3 })];
    const kiel = [];
    // Spritzer: Glasperlen, die in der Luft hängen (beim Schlag mehr)
    const perlen = [];
    const np = v.perlen + r(spritz * 6);
    for (let i = 0; i < np; i++) { const a = -2.6 + i * 0.5 + (glanz % 2) * 0.05, rr = 12 + (i * 7 % 9) + spritz * 6, cx0 = i % 2 ? 12 : fussX - 2, cy0 = i % 2 ? 88 : fussY; perlen.push(E(cx0 + Math.cos(a) * rr * (i % 2 ? 0.8 : 0.5), cy0 + Math.sin(a) * rr * 0.6 - 4, 1.2 + (i % 3) * 0.4, 1.2 + (i % 3) * 0.4, null, { pf: 'bevel' })); }
    const arm = [...ober, ...unter];
    const sinkt = S > 0;
    const gruppen = [
      { p: unterArm, k: 1 },
      { p: bein, k: 1 },
      { p: [rumpf, hals], k: 2, anker: [lx, bob] },
      { p: [kopf], k: 0 },
      { p: [kappe], k: 0 },
      
      { p: [welle], k: 2 },
      { p: rand, k: 0 },
      { p: sinkt && S > 14 ? [] : arm, k: 1.5, anker: [lx, bob] },
      { p: sinkt && S > 14 ? [] : handF, k: 0.5 },
      { p: p.tod && f > 3 ? [] : perlen, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Streifen des Wollbadeanzugs: quer über den Rücken, folgen der Rundung (helle Bänder gedithert)
      for (let x = r(sx - 6); x <= sx + 46; x++) for (let y = r(sy - 8); y <= WY; y++) { const c = P.get(x, y); if (!c || c > 4) continue; const u = (x - sx + (y - sy) * 0.7) / 5, band = Math.floor(u), fr = u - band; if (band % 2 === 0 && fr > 0.15 && fr < 0.85) P.set(x, y, y < sy + 4 ? 4 : c < 3 ? 3 : 4); else if (band % 2) P.set(x, y, c > 2 ? c - 1 : c); }
      // Wirbelsäule und Schulterblatt
      for (let x = r(sx + 6); x <= sx + 36; x++) { const y = r(sy - 5 + Math.pow((x - sx - 10) / 26, 2) * 9); P.auf(x, y + 2, 'k0'); }
      P.el(sx + 9.5, sy - 2.5, 4.5, 2.6, 'k3', true); P.line(sx + 6, sy, sx + 12, sy + 1, 'k0', true);
      // Kappe: Naht und Riemen, Schwimmbrille (zwei runde Gläser, leuchten von unten grün)
      const kx = r(kopfX), ky = r(kopfY);
      if (v.kappe === 'streifen') for (let x = kx - 6; x <= kx + 6; x += 3) P.auf(x, ky - 5 + (Math.abs(x - kx) > 4 ? 2 : 0), 'k3');
      else P.line(kx - 5, ky - 6, kx + 4, ky - 7, 'k3', true);
      P.line(kx - 7, ky, kx + 7, ky - 1, 'k0', true);
      if (!p.tod || f < 1) {
        const g = licht;
        P.el(kx - 3.5 + 0.5, ky + 0.5, 2.3, 2.1, 'k0', true); P.el(kx + 2.5 + 0.5, ky - 0.5, 2.3, 2.1, 'k0', true);
        P.set(kx - 4, ky, 'kern'); P.set(kx - 3, ky + 1, 'glut'); P.set(kx + 2, ky - 1, 'kern'); P.set(kx + 3, ky, 'glut');
        if ((glanz | 0) % 2) { P.set(kx - 3, ky - 1, 'glut'); } else P.set(kx + 3, ky - 1, 'glut');
        P.glow(kx - 0.5, ky + 0.5, 6 * g, 0.5);
        augen.push([kx - 4, ky], [kx + 2, ky - 1]);
        // offener Mund: Atemholen, seit Jahren
        if (mund) { P.auf(kx - 1, ky + 4, 'k0'); P.auf(kx, ky + 4, 'k0'); P.auf(kx - 1, ky + 5, 'k0'); P.auf(kx, ky + 5, 'glutDim'); }
      }
      // Licht von unten: wo er die Fläche bricht, leuchtet das Polarlicht unter dem Glas hervor
      if (licht > 0) {
        glas.unterlicht(P, WY - 3, 16, licht, (x, y) => y < lip(x) - 2);
        for (let x = 16; x < 94; x++) { const t = licht * (0.55 + 0.45 * Math.sin(x * 0.45 + (p.idle ? f * 0.8 : 0)) * Math.sin(x * 0.17 + 1)); const y = Math.round(lip(x) - 2); const c = P.get(x, y); if (!c || c > 4) continue; P.set(x, y, t > 0.85 ? 'glut' : t > 0.45 ? 'nordlicht' : 'glutDim'); if (t > 0.6 && P.get(x, y - 1) && P.get(x, y - 1) <= 4) P.set(x, y - 1, 'glutDim'); }
        P.glow(sx + 18, WY + 2, 14 * licht, 0.5);
      }
      // Welle: gefrorene Ringe (Muschelbruch) und Spiegelglanz auf dem Kamm
      glas.muschel(P, 10, 100, 12, -2.6, -0.9, 3);
      glas.streif(P, [3, 108], [9, 93 - bw], 1, { hell: 0.6 });
      
      // Glanz auf dem Rücken: Spiegelung der Eisdecke
      glas.streif(P, [sx + 14, sy - 6], [sx + 34, sy - 1], 1, { hell: 0.4 });
      // Perlen: winziger Glanzpunkt oben rechts, eine leuchtet grün (sie hat Licht von unten mitgenommen)
      perlen.forEach((e, i) => { P.auf(r(e.x + 0.6), r(e.y - 0.6), i === 2 && licht > 0.5 ? 'nordlicht' : 'r2'); });
    };
    return { gruppen, details, augen };
  },
};
