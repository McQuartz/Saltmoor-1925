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
  hsh,
};

module.exports = {
  id: 'glasschwimmer', biom: 'glasmeer', zone: 'glasmeer', w: 96, h: 120, fuss: [50, 110], kopf: [30, 50], rimBis: 112,
  varianten: {
    glasschwimmer_a: { bogen: 1, kappe: 'leder', perlen: 7, fuss: true },
    glasschwimmer_b: { bogen: 0.85, kappe: 'streifen', perlen: 5, fuss: true, breit: 3, spaet: true },
  },
  skizzen: { skizze_kopfsprung: { kopfsprung: true } },
  glas,
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    // ha: Armstellung 0 Ruhe (Bogen oben), 1 weit ausgeholt (hinten), 2 Schlag (vorn unten); sink: Tod
    let ha = 0, lean = 0, bob = 0, mund = 1, sink = 0, spritz = 0, glanz = 1, licht = 1;
    if (p.idle) { bob = [0, 0, 1, 1][f]; mund = [1, 1, 0, 1][f]; glanz = f; }
    if (p.angriff) { ha = [0.5, 1, 2, 1.6][f]; lean = [2, 4, -6, -3][f]; spritz = [0, 0, 1, 0.6][f]; licht = [1.1, 1.3, 1.6, 1.2][f]; mund = [1, 1, 0, 1][f]; }
    if (p.treffer) { lean = [3, 1][f]; ha = -0.4; licht = 0.6; mund = 0; }
    if (p.tod) { sink = r(p.q * 22); licht = Math.max(0, 1 - p.q * 1.6); ha = -0.6 * p.q; }
    const WY = 103; // Oberfläche des Glases im Bild
    if (v.kopfsprung) { // verworfene Skizze: senkrecht, nur Arme und Kopf aus dem Glas
      const g = [E(48, 70, 9, 10, null), C(44, 62, 40, 22, 4, 2.5, null), C(52, 62, 56, 22, 4, 2.5, null), Pg([[10, 112], [30, 98], [48, 94], [70, 98], [88, 112]], null)];
      return { gruppen: [{ p: g, k: 2 }], augen: [] };
    }
    const B0 = v.bogen, S = sink, lx = lean;
    // Rumpf: liegt flach, Rücken knapp über dem Glas, Hüfte rechts taucht ein
    const sx = 38 + lx, sy = 86 + bob + S;
    const rumpf = Pg([[sx - 4, sy - 2], [sx + 6, sy - 7], [sx + 22, sy - 6], [sx + 38, sy + 1], [sx + 46, sy + 9], [sx + 46, WY + 6], [sx - 6, WY + 6], [sx - 8, sy + 6]], null, { rd: 2 });
    const kopfX = 25 + lx + (ha === 2 ? -2 : 0), kopfY = 80 + bob + S;
    const kopf = E(kopfX, kopfY, 7.5, 7, 'haut', { pf: 'bevel' });
    const kappe = Pg([[kopfX - 7, kopfY - 1], [kopfX - 5, kopfY - 6], [kopfX + 1, kopfY - 8.5], [kopfX + 7, kopfY - 5], [kopfX + 8, kopfY + 1], [kopfX + 3, kopfY - 2], [kopfX - 3, kopfY - 2]], null, { rd: 0.8 });
    const hals = C(kopfX + 4, kopfY + 3, sx + 2, sy + 1, 4, 5, null);
    // Arm im Bogen (nah): Schulter -> Ellbogen hoch -> Unterarm hängt -> Hand
    const sh = [sx + 4, sy - 3];
    let ell, hand;
    if (ha <= 0) { ell = [sx + 12 - ha * 4, sy - 40 * B0 - ha * 18]; hand = [sx - 8 - ha * 6, sy - 30 * B0 - ha * 22]; }
    else if (ha < 1.5) { ell = [sx + 16 + ha * 4, sy - 44 * B0 - ha * 6]; hand = [sx + 18 + ha * 16, sy - 58 * B0 + ha * 2]; }
    else { ell = [sx - 10, sy - 22]; hand = [sx - 30, sy + 2]; }
    if (S) { ell = [ell[0], ell[1] + S * 1.6]; hand = [hand[0], hand[1] + S * 1.9]; }
    const arm = [...glied([sh, [sh[0] + (ell[0] - sh[0]) * 0.5 + 3, sh[1] + (ell[1] - sh[1]) * 0.5], ell], 4.2, 3.4, null), ...glied([ell, hand], 3.2, 2.4, null), E(hand[0], hand[1] + 2, 2.6, 3.4, 'haut')];
    // vorderer Arm taucht vor dem Kopf ins Glas (nur Ansatz)
    const unterArm = glied([[sx - 2, sy + 4], [kopfX - 10, WY - 2], [kopfX - 14, WY + 4]], 3.4, 2.8, null);
    // Fuß hinten: ein Schlag mit dem Bein, Ferse aus dem Glas
    const fussX = 84 + (p.idle ? [0, 1, 1, 0][f] : 0), fussY = WY - 12 + (p.angriff ? [0, -2, -5, -3][f] : 0) + S * 1.3;
    const bein = v.fuss ? [C(sx + 40, WY + 2, fussX - 2, fussY + 6, 4, 3, null), Pg([[fussX - 5, fussY + 5], [fussX - 1, fussY - 2], [fussX + 2, fussY - 4], [fussX + 4, fussY + 1], [fussX + 1, fussY + 7]], null, { rd: 0.8 })] : [];
    // Bugwelle aus Glas vor dem Kopf (Kamm nach links gerollt), Kielwasser als flache Furchen nach rechts
    const bw = v.breit || 0;
    const welle = Pg([[0, 113], [1, 106], [5, 100], [9, 94 - bw], [6, 91 - bw], [10, 88 - bw], [16, 90], [20, 96], [26, 99], [36, 101], [52, 102], [66, 101], [76, 102], [86, 100], [93, 104], [95, 113]], null, { rd: 1 });
    const kiel = [E(62, 104, 22, 3, null, { pf: 'flat' }), E(40, 106, 34, 3.4, null, { pf: 'flat' })];
    // Spritzer: Glasperlen, die in der Luft hängen (beim Schlag mehr)
    const perlen = [];
    const np = v.perlen + r(spritz * 6);
    for (let i = 0; i < np; i++) { const a = -2.6 + i * 0.5 + (glanz % 2) * 0.05, rr = 12 + (i * 7 % 9) + spritz * 6, cx0 = i % 2 ? 12 : fussX - 2, cy0 = i % 2 ? 88 : fussY; perlen.push(E(cx0 + Math.cos(a) * rr * (i % 2 ? 0.8 : 0.5), cy0 + Math.sin(a) * rr * 0.6 - 4, 1.2 + (i % 3) * 0.4, 1.2 + (i % 3) * 0.4, null, { pf: 'bevel' })); }
    const sinkt = S > 0;
    const gruppen = [
      { p: unterArm, k: 1 },
      { p: bein, k: 1 },
      { p: [rumpf, hals], k: 2, anker: [lx, bob] },
      { p: [kopf], k: 0 },
      { p: [kappe], k: 0 },
      { p: kiel, k: 2 },
      { p: [welle], k: 2 },
      { p: sinkt && S > 14 ? [] : arm, k: 1.5 },
      { p: p.tod && f > 3 ? [] : perlen, k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Streifen des Wollbadeanzugs: quer über den Rücken, folgen der Rundung
      for (let x = r(sx - 2); x <= sx + 44; x++) for (let y = r(sy - 8); y <= WY; y++) { const c = P.get(x, y); if (!c || c > 4) continue; const band = Math.floor((x - sx + (y - sy) * 0.55) / 4); if (band % 2 === 0) P.auf(x, y, c >= 3 ? 2 : 1); }
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
      // Wo er die Fläche bricht: grünes Licht von unten, ein dünner Saum entlang der Wasserlinie
      if (licht > 0) {
        for (let x = 4; x < 92; x++) {
          let y = -1; for (let yy = 86; yy < WY + 4; yy++) { if (P.get(x, yy) && P.get(x, yy) <= 6) { y = yy; break; } }
          if (y < 0) continue;
          const nahe = Math.abs(x - (sx + 18)) < 28 || Math.abs(x - fussX) < 6 || Math.abs(x - (kopfX - 12)) < 5;
          if (!nahe) continue;
          const t = licht * (0.6 + 0.4 * Math.sin(x * 0.7 + (p.idle ? f : 0)));
          // Saum liegt an der Unterkante des Körpers, knapp über der Welle
          for (let yy = WY + 3; yy > 90; yy--) { const c = P.get(x, yy), c2 = P.get(x, yy + 1); if (c && c2 && c <= 4 && c2 <= 4 && yy >= WY - 2 && yy <= WY + 1) { P.set(x, yy, t > 0.85 ? 'glut' : t > 0.5 ? 'nordlicht' : 'glutDim'); break; } }
        }
        P.glow(sx + 18, WY + 2, 18 * licht, 0.55);
        P.glow(kopfX - 12, WY, 8 * licht, 0.6);
      }
      // Welle: gefrorene Ringe (Muschelbruch) und Spiegelglanz auf dem Kamm
      glas.muschel(P, 10, 100, 12, -2.6, -0.9, 3);
      glas.streif(P, [3, 108], [9, 93 - bw], 1, { hell: 0.6 });
      for (let x = 22; x < 92; x += 6) P.auf(x, 106 + (x % 12 ? 0 : 1), 'k3');
      // Glanz auf dem Rücken: Spiegelung der Eisdecke
      glas.streif(P, [sx + 14, sy - 6], [sx + 34, sy - 1], 1, { hell: 0.4 });
      // Perlen: winziger Glanzpunkt oben rechts, eine leuchtet grün (sie hat Licht von unten mitgenommen)
      perlen.forEach((e, i) => { P.auf(r(e.x + 0.6), r(e.y - 0.6), i === 2 && licht > 0.5 ? 'nordlicht' : 'r2'); });
    };
    return { gruppen, details, augen };
  },
};
