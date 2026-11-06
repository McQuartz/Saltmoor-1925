// Hafenviertel, zweiter Wächter: Die Galionsfigur. Die Frau vom Bug der „Gesine“, die im Winter 1917 an der
// Klippe unter dem Leuchtturm gesunken ist. Sie ist ohne ihr Schiff an Land gekommen, nur mit dem Stück Bug,
// an dem sie festgenagelt ist: Vorsteven, ein paar Planken, der Bugspriet mit dem Toplicht. Das Stück macht
// noch Fahrt. Am Steven teilt sich Wasser, das es nicht gibt, und läuft als Bugwelle an ihr hoch.
// Sie ist geschnitzt, das Haar ist geschnitzt, nur ein Auge ist offen und nass.
// Phase 2 (galionsfigur_p2): Das Holz springt auf, längs durch Brust und Gesicht. Darunter ist es hell.
'use strict';
const KA = require('./hilfe/kanten');

module.exports = {
  id: 'galionsfigur', biom: 'hafen', zone: 'hafen_galion', rang: 'waechter', w: 160, h: 180, fuss: [96, 176], kopf: [70, 18], rimBis: 174,
  todStart: 0.2,
  varianten: { galionsfigur: { riss: false }, galionsfigur_p2: { riss: true } },
  // Silhouetten-Probe (nicht gebaut): die Figur aufrecht ohne Bug, nur auf ihrem Sockel aus Schnitzwerk.
  // Schwarz eine stehende Frau im Kleid, zu nah an Fensterzählerin und Heimleiterin. Genommen: der Bug als
  // schräger Keil mit dem Bugspriet, die Figur liegt nach vorn in der Diagonale.
  proben: { probe_ohne_bug: { riss: false, ohneBug: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180;
    let dx = 0, dy = 0, a = 0, fall = 0, haar = 0, lampe = 0, welle = 1;
    if (p.idle) { dy = [0, 0, 1, 1][f]; haar = [0, 1, 1, 0][f]; lampe = [0, 1, 0, -1][f]; }
    if (p.angriff) { dx = [4, 7, -9, -4][f]; dy = [-1, -2, 2, 1][f]; a = [0.05, 0.09, -0.08, -0.03][f]; haar = [1, 2, -2, 0][f]; lampe = [2, 3, -4, -1][f]; welle = [0.6, 0.4, 1.6, 1.2][f]; }
    if (p.treffer) { dx = [3, 1][f]; a = [0.03, 0.01][f]; welle = 0.5; }
    if (p.tod) { fall = r(p.q * 22); a = p.q * 0.12; welle = Math.max(0, 1 - p.q * 2); }
    // Drehpunkt am Kiel, alles im Bugmaß gezeichnet und dann gedreht
    const px = 104, py = 176;
    const rot = (x, y) => { const X = x - px, Y = y - py; return [px + dx + X * Math.cos(a) - Y * Math.sin(a), py + dy + fall + X * Math.sin(a) + Y * Math.cos(a)]; };
    const R = pts => pts.map(([x, y]) => rot(x, y));
    const ohneBug = !!v.ohneBug;
    // Rumpfstück: Vorsteven vorn (fällt nach vorn über), Reling oben, rechts Planke um Planke abgebrochen
    const rumpf = ohneBug ? [] : [Pg(R([[100, 176], [94, 150], [89, 124], [85, 98], [82, 74], [80, 64], [96, 62], [118, 66], [140, 72], [158, 75], [150, 82], [156, 90], [146, 96], [151, 104], [143, 110], [146, 121], [137, 124], [142, 133], [134, 139], [138, 150], [130, 154], [134, 166], [126, 170], [130, 176]]), null, { rd: 1 })];
    // Reling (Schanzkleid) als eigene Leiste oben
    const reling = ohneBug ? [] : [Pg(R([[78, 64], [80, 57], [98, 56], [136, 64], [157, 69], [157, 76], [136, 71], [98, 63]]), null, { rd: 0.8 })];
    // Bugspriet: dicker Stamm schräg nach vorn oben, am Ende das Toplicht
    const sp0 = rot(118, 66), sp1 = rot(82, 54), sp2 = v.riss ? rot(46, 36) : rot(22, 24);
    const spriet = ohneBug ? [] : [C(sp0[0], sp0[1], sp1[0], sp1[1], 4.6, 4.2, null), C(sp1[0], sp1[1], sp2[0], sp2[1], 4.2, 2.2, null)];
    const tip = rot(26, 26);
    const lx = tip[0] + lampe * 0.5, ly = tip[1] + 9;
    const laterne = ohneBug || v.riss ? [] : [C(tip[0], tip[1] + 1, lx, ly - 4, 0.7, 0.7, null, { pf: 'flat' }), Pg([[lx - 4, ly - 4], [lx + 4, ly - 4], [lx + 3, ly + 5], [lx - 3, ly + 5]], null, { rd: 0.8 }), E(lx, ly - 5, 3.4, 1.6, null)];
    // Die Figur: weit vor den Steven gelehnt, nur Haar, Hände und Schnitzrolle halten sie am Bug.
    // Zwischen ihrem Rücken und dem Steven bleibt ein Dreieck Luft.
    const fig = [];
    fig.push(Pg(R([[92, 134], [78, 132], [64, 118], [52, 102], [42, 90], [36, 80], [40, 70], [50, 67], [60, 74], [70, 90], [82, 106], [92, 118], [97, 126]]), 'haut', { rd: 2.4 }));
    const br = rot(42, 82);
    fig.push(E(br[0], br[1], 8.5, 9, 'haut'));
    const kp = rot(36, 58);
    const kopf = E(kp[0], kp[1], 8.2, 9.4, 'haut');
    const kinn = Pg(R([[29, 61], [33, 68], [40, 66], [38, 60]]), 'haut', { rd: 1 });
    const halsF = C(...rot(40, 64), ...rot(46, 72), 4.2, 5, 'haut');
    // Haar: geschnitzte Strähnen, nach hinten unter den Spriet gestrichen bis an den Steven
    const haarF = [];
    for (let k = 0; k < 5; k++) {
      const y0 = 50 + k * 3, x0 = 38 + k * 1.5;
      haarF.push(...glied(R([[x0, y0], [x0 + 16 + haar, y0 - 1 + k * 0.5], [x0 + 32 + haar * 2, y0 + 4 + k * 1.5], [x0 + 44 + haar, y0 + 10 + k * 3]]), 3.2 - k * 0.2, 1.6, null));
    }
    // Arme: nach hinten gestreckt über die Luft bis an den Steven, die Hände flach ans Holz genagelt
    const armV = glied(R([[48, 76], [62, 86], [76, 92], [88, 92]]), 3.4, 2.4, 'haut');
    const handV = Pg(R([[86, 88], [95, 87], [97, 92], [87, 95]]), 'haut', { rd: 0.8 });
    const armH = glied(R([[52, 70], [64, 74], [76, 76], [86, 72]]), 3, 2.2, 'haut');
    // Schnitzrolle unten (Volute), in die der Leib ausläuft, am Steven
    const rp = rot(93, 134);
    const rolle = [E(rp[0], rp[1], 8, 7, null), C(...rot(86, 128), ...rot(96, 146), 4, 3, null)];
    const kette = [];
    const gruppen = [
      { p: rumpf, k: 0, kante: true, tone: -0.08 },   // 0
      { p: reling, k: 0, kante: true, tone: 0.06 },   // 1
      { p: kette, k: 0, kante: true, tone: 0.2 },     // 2
      { p: haarF, k: 1.2, kante: true, tone: -0.05 }, // 3
      { p: spriet, k: 0.5, kante: true, tone: 0.08 }, // 4
      { p: laterne, k: 0.4, kante: true },            // 5
      { p: [...armH], k: 1, kante: true, tone: 0.05 },// 6
      { p: rolle, k: 1.4, kante: true },              // 7
      { p: fig, k: 2, kante: true, tone: 0.02 },      // 8
      { p: [kopf, kinn, halsF], k: 1.2, kante: true }, // 9
      { p: [...armV, handV], k: 1, kante: true, tone: 0.1 }, // 10
    ];
    const RUMPF = 0, RELING = 1, HAAR = 3, LAT = 5, FIG = 8, KOPF = 9, ARMV = 10;
    gruppen.forEach(g => { g.anker = [dx, dy + fall]; });
    const LIB = require('../lib');
    const { gid } = LIB.render(W, H, gruppen, LIB.palette(v.zone || 'hafen_galion'), { rimBis: 174 });
    const augen = [];
    const inv = (x, y) => { const X = x - px - dx, Y = y - py - dy - fall; return [px + X * Math.cos(-a) - Y * Math.sin(-a), py + X * Math.sin(-a) + Y * Math.cos(-a)]; };
    const details = P => {
      const B = (x, y) => LIB.bay(x - dx, y - dy - fall);
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
      // Planken: waagerechte Fugen im Bugmaß, leicht zum Steven hochgezogen; Kupfernägel in Reihen
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (gid[y * W + x] !== RUMPF) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const [u, w] = inv(x + 0.5, y + 0.5); const ww = w + (u - 150) * 0.12;
        const fuge = ((ww % 9) + 9) % 9;
        if (fuge < 0.9) P.set(x, y, 'k0');
        else if (fuge < 1.9 && u > 96) P.set(x, y, B(x, y) < 0.55 ? 'k3' : c);
        else if (u > 120 && B(x, y) < (u - 120) / 60 * 0.35) P.set(x, y, 'k3');
        if (w > 146 && fuge > 1.9) { const kq = ((u + Math.floor(ww / 4.5) * 3) % 6 + 6) % 6; if (kq < 0.8 || ((ww % 4.5) + 4.5) % 4.5 < 0.8) P.set(x, y, 'k0'); else if (B(x, y) < 0.18 + (u - 100) / 120) P.set(x, y, 'k3'); }
        else if (fuge > 4.2 && fuge < 5.2 && (Math.floor(ww / 9) * 7 + (u | 0)) % 23 === 0) P.set(x, y, 'k3');
      }
      // Bruchkante rechts: helles Holz in der Faser (Randlicht innen), Splitter
      for (let y = 0; y < H; y++) for (let x = W - 2; x > 0; x--) { if (gid[y * W + x] === RUMPF) { if (P.get(x, y) <= 4) { P.set(x, y, 'r1'); if ((y % 3) === 0) P.set(x - 1, y, 'r1'); } break; } }
      // Reling: Nagelköpfe
      for (let x = 72; x < 152; x += 6) { const [nx, ny] = rot(x, 58 + (x - 70) * 0.13); P.auf(nx, ny, 'k3'); }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Schnitzwerk der Figur: Gewandfalten in Bögen, die Brust glatt, die Hüfte läuft in Kerben aus
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const gi = gid[y * W + x]; if (gi !== FIG) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const [u, w] = inv(x + 0.5, y + 0.5);
        const t = (u - 40) * 0.6 + (w - 70) * 0.8; // längs der Figur
        const quer = (u - 40) * 0.8 - (w - 70) * 0.6;
        // Gewand: lange Falten längs des Leibs, unter der Brust ein Gürtel, unten Kerben zur Schnitzrolle
        if (t > 30) { const fq = ((quer + t * 0.08) % 4.5 + 4.5) % 4.5; if (fq < 0.9) P.set(x, y, 'k0'); else if (fq < 1.8 && B(x, y) < 0.7) P.set(x, y, 'k3'); else if (fq > 3.6 && B(x, y) < 0.3) P.set(x, y, 'k1'); }
        if (Math.abs(t - 30) < 1.1) P.set(x, y, t < 30 ? 'k3' : 'k0');
      }
      // Arme: Licht an der Oberkante
      KA.licht(P, [...armV, handV], { c: 'r1', c2: 'k3' });
      KA.licht(P, armH, { c: 'r1', c2: null });
      // Finger als Kerben an der Hand, Nagelköpfe durch den Handrücken
      { const h = handV.v; for (let k = 0; k < 3; k++) P.auf(h[1][0] - 1 - k * 2, h[1][1] + 2, 'k0'); const [nx, ny] = rot(92, 91); P.auf(nx, ny, 'gischt'); }
      // Haar: Strähnen gekerbt, die Spitzen fangen Licht
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== HAAR) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const [u, w] = inv(x + 0.5, y + 0.5); if (((w * 1.0 + u * 0.3) % 3 + 3) % 3 < 0.9) P.set(x, y, 'k0'); else if (B(x, y) < 0.25) P.set(x, y, 'k3'); }
      // Gesicht: geschnitzt, glatt; das linke Auge geschlossen (Lidkerbe), das rechte offen und nass
      const [kx, ky] = kp;
      P.auf(kx - 5, ky - 1, 'k0'); P.auf(kx - 4, ky - 1, 'k0'); P.auf(kx - 6, ky + 4, 'k0'); P.auf(kx - 5, ky + 4, 'k1');
      P.auf(kx - 7, ky + 1, 'k3'); P.auf(kx - 7, ky + 2, 'k3'); // Nase
      for (let yy = -6; yy <= 6; yy++) { if (B(kx + 3, ky + yy) < 0.6) P.auf(kx + 3, ky + yy, 'k3'); }
      if (!(p.tod && f >= 1)) {
        P.glow(kx - 1, ky - 2, 7, 0.9, 'glutDim', 'k3');
        P.set(kx - 1, ky - 2, 'kern'); P.set(kx - 2, ky - 2, 'glut');
        P.set(kx - 1, ky - 1, 'gischt'); P.set(kx - 1, ky + 1, 'gischt'); // Tränen aus Seewasser
        augen.push([r(kx - 1), r(ky - 2)]);
      }
      // Toplicht: warmes Glas, Rahmen, das Licht fällt auf die Spriet-Unterseite
      if (!ohneBug && !v.riss) {
        for (let yy = r(ly - 3); yy <= r(ly + 4); yy++) for (let xx = r(lx - 3); xx <= r(lx + 3); xx++) { if (!ist(xx, yy, LAT)) continue; const d = Math.hypot(xx + 0.5 - lx, (yy + 0.5 - ly) * 0.8); if (Math.abs(xx + 0.5 - lx) < 0.6) P.set(xx, yy, 'k1'); else P.set(xx, yy, d < 1.6 ? 'kern' : d < 2.8 ? 'glut' : 'glutDim'); }
        if (!(p.tod && f >= 2)) { P.glow(lx, ly, 14, 0.6, 'glutDim', 'k3'); augen.push([r(lx), r(ly)]); }
      }
      // Phase 2: Das Holz ist längs aufgesprungen, durch Brust und Gesicht; darunter Licht und ein zweites Auge
      if (v.riss) {
        const weg = [[33, 49], [37, 60], [41, 72], [44, 84], [52, 96], [62, 108], [74, 119], [86, 128]]; const pts = [];
        for (let k = 0; k < weg.length - 1; k++) for (let i = 0; i < 14; i++) { const t = i / 14, j = ((k * 14 + i) % 9 < 3 ? 1 : (k * 14 + i) % 11 < 3 ? -1 : 0); pts.push(rot(weg[k][0] + (weg[k + 1][0] - weg[k][0]) * t + j, weg[k][1] + (weg[k + 1][1] - weg[k][1]) * t)); }
        pts.forEach(([x, y], i) => { if (i % 8 === 0) P.glow(x + 1, y, 9, 0.9, 'glutDim', 'k3'); });
        pts.forEach(([x, y], i) => { const q = i / pts.length, breit = q < 0.06 ? 1 : q < 0.16 ? 2 : q < 0.75 ? 3 : q < 0.88 ? 2 : 1; for (let k = 0; k < breit; k++) { if (P.get(r(x) + k, r(y))) P.set(r(x) + k, r(y), (i % 13 === 6 && k === 1) ? 'kern' : (k === 1 || breit === 1) ? 'glut' : 'glutDim'); } P.auf(r(x) - 1, r(y), 'k0'); if (P.get(r(x) + breit, r(y))) P.set(r(x) + breit, r(y), 'r1'); });
        const [ex, ey] = rot(45, 84); P.glow(ex, ey, 10, 0.8, 'glutDim', 'k3'); P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex, ey - 1, 'k0');
        augen.push([r(ex), r(ey)]);
        // gebrochener Spriet: Splitter am Ende
        { const [x, y] = sp2; P.set(x - 4, y - 1, 'r1'); P.set(x - 5, y - 2, 'r2'); P.set(x - 4, y + 2, 'r1'); P.set(x - 6, y + 3, 'k3'); }
        // Splitter, die vom Riss abstehen
        for (const [s, t] of [[38, 60], [46, 86], [58, 106]]) { const [x, y] = rot(s, t); P.set(x - 2, y - 1, 'r1'); P.set(x - 3, y - 2, 'r2'); }
      }
      // Die Bugwelle, die es nicht gibt: läuft am Steven hoch, Gischt fliegt nach vorn
      if (!ohneBug && welle > 0) {
        for (let i = 0; i < 26; i++) {
          const t = i / 25, [sx, sy] = rot(100 - t * 8, 176 - t * 34);
          const bx = r(sx - 2 - Math.sin(t * Math.PI) * 6 * welle), by = r(sy);
          if (B(bx, by) < 0.85) P.set(bx, by, t > 0.7 ? 'r2' : 'gischt'); P.set(bx - 1, by + 1, 'r1');
          if (i % 3 === 0 && welle > 0.5) P.set(bx - 3 - r(t * 6 * welle), by - 2, t > 0.5 ? 'r2' : 'gischt');
        }
        for (let k = 0; k < 7 * welle; k++) { const [sx, sy] = rot(84 - k * 5, 154 - (k % 3) * 8 - k * 2); if (!P.get(r(sx), r(sy))) P.set(sx, sy, k % 2 ? 'gischt' : 'r1'); }
      }
      // Randlicht oben rechts an allen Teilen kräftig (das grüne Seitenlicht von hinten)
      { const z = []; for (let y = 0; y < 172; y++) for (let x = 0; x < W - 1; x++) { const c = P.get(x, y); if (c < 1 || c > 5) continue; if (!P.get(x + 1, y) && !P.get(x, y - 1)) z.push([x, y, 'r2']); else if (!P.get(x + 1, y - 1) && !P.get(x + 1, y)) z.push([x, y, 'r1']); } for (const [x, y, c] of z) P.set(x, y, c); }
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
