// Konservenfabrik, zweiter Wächter: Der Fang. Der letzte Kabeljau der „Anna Thormählen“, so lang wie zwei
// Männer, hängt am Haken des Laufkrans über dem Hauptband, um gewogen zu werden. Er wird seit dem 4. November
// gewogen. Auf der Flanke trägt er denselben Stempel wie die Dosen, das Datum von morgen. Wo die Brustflossen
// sein müssten, hängen zwei Arme mit Händen, an der linken ein Ehering. Das Auge folgt dir. Er schwingt.
// Phase 2 (fang_p2): Er ist aufgeschlitzt, vom Kiemendeckel bis zum Bauch, wie am Band. Drinnen brennt Licht,
// und es ist jemand drin, der herauswill.
'use strict';
const KA = require('./hilfe/kanten');
const LIB = require('../lib');

module.exports = {
  id: 'fang', biom: 'fabrik', zone: 'fabrik_fang', rang: 'waechter', w: 160, h: 180, fuss: [86, 176], kopf: [88, 6], rimBis: 176,
  todStart: 0.25,
  varianten: { fang: { offen: false }, fang_p2: { offen: true } },
  // Silhouetten-Probe (nicht gebaut): der Fisch liegend auf dem Band, quer. Schwarz ein Wal oder ein Sarg,
  // zu nah am Liegenden (Kurhaus) und am Kanalaal. Genommen: senkrecht am Kranhaken, Kopf oben, die Kette.
  proben: { probe_liegend: { offen: false, liegend: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180;
    let a = 0, fall = 0, schw = 0, arm = 0, maul = 0.4, schwanz = 0;
    if (p.idle) { schwanz = [0, 1, 1, 0][f]; maul = [0.4, 0.45, 0.5, 0.45][f]; }
    if (p.angriff) { a = [0.06, 0.12, -0.16, -0.06][f]; arm = [0.2, 0.4, 1, 0.5][f]; maul = [0.6, 0.9, 1, 0.6][f]; schwanz = [-2, -4, 5, 2][f]; }
    if (p.treffer) { a = [0.05, 0.02][f]; schwanz = 2; }
    if (p.tod) { fall = r(Math.max(0, p.q - 0.2) * 40); a = -p.q * 0.08; schwanz = r(p.q * 4); }
    if (v.offen) a += 0.07; // ein Haken ist ausgerissen, er hängt schief
    if (v.liegend) return liegend(p, v, A);
    // Drehpunkt: Laufkatze oben (Pendel)
    const px = 88, py = 2;
    const rot = (x, y) => { const X = x - px, Y = y - py; return [px + X * Math.cos(a) - Y * Math.sin(a), py + fall + X * Math.sin(a) + Y * Math.cos(a)]; };
    const R = pts => pts.map(([x, y]) => rot(x, y));
    // Kette und Flasche (Rollenblock) mit Haken
    const kette = []; for (let i = 0; i < 7; i++) { const [x, y] = rot(88, 4 + i * 3.2); kette.push(i % 2 ? C(x, y - 1.6, x, y + 1.6, 1.3, 1.3, null) : E(x, y, 2.6, 2, null)); }
    const block = [Pg(R([[81, 25], [95, 25], [96, 36], [80, 36]]), null, { rd: 1.2 }), E(...rot(88, 30), 3.4, 3.4, null)];
    const haken = [...glied(R([[88, 36], [88, 44], [84, 50], [79, 48], [78, 44]]), 2.4, 1.6, null)];
    // Der Fisch: Kopf oben (das Maul am Haken), Leib spindelförmig, unten die Schwanzflosse
    const prof = [[0, 0.12], [0.05, 0.42], [0.12, 0.74], [0.18, 0.9], [0.28, 1], [0.48, 0.96], [0.66, 0.78], [0.8, 0.5], [0.9, 0.3], [1, 0.22]];
    const yT = 44, yB = 150, Rb = 23, cx = 88;
    const re = [], li = [];
    for (const [q, w] of prof) { const y = yT + q * (yB - yT), sw = Math.sin(q * Math.PI) * 0 + (q > 0.6 ? schwanz * (q - 0.6) * 2 : 0); re.push([cx + w * Rb + sw, y]); li.push([cx - w * Rb * 0.92 + sw, y]); }
    const leib = Pg(R([...re, ...li.reverse()]), null, { rd: 1.5 });
    // Maul: Unterkiefer hängt offen am Haken
    const kiefer = Pg(R([[86, 43], [78, 45], [64, 51 + maul * 8], [57, 57 + maul * 10], [62, 60 + maul * 10], [80, 57]]), 'haut', { rd: 1 });
    // Rückenflossen (drei, wie beim Kabeljau) zur Lichtseite, Afterflosse links
    const fl = [];
    const flosse = (q0, q1, aus, s) => { const y0 = yT + q0 * (yB - yT), y1 = yT + q1 * (yB - yT), x0 = cx + s * Rb * Math.max(0.5, 1 - Math.abs(q0 - 0.3) * 1.2); fl.push(Pg(R([[x0 - s * 4, y0], [x0 + s * aus * 0.5, y0 - 1], [x0 + s * aus, y1 + 4], [x0 + s * aus * 0.3, y1], [x0 - s * 4, y1]]), null, { rd: 0.4 })); };
    flosse(0.22, 0.38, 9, 1); flosse(0.44, 0.58, 8, 1); flosse(0.64, 0.76, 6, 1); flosse(0.6, 0.74, 6, -1);
    // Schwanzflosse: breiter Fächer
    const sx = schwanz;
    const schwanzF = Pg(R([[cx - 5 + sx, 146], [cx + 5 + sx, 146], [cx + 20 + sx * 2, 170], [cx + 13 + sx * 2, 172], [cx + 1 + sx * 2, 164], [cx - 10 + sx * 2, 173], [cx - 17 + sx * 2, 170]]), 'dunkel', { rd: 1 });
    // Arme statt Brustflossen: aus dem Kiemenwinkel, hängen am Leib herab; im Angriff greifen sie nach vorn
    const ag = arm;
    const armL = [...glied(R([[70, 74], [58 - ag * 8, 88 - ag * 6], [52 - ag * 16, 104 - ag * 12], [58 - ag * 26, 116 - ag * 22]]), 4, 2.6, 'haut')];
    const handL = Pg(R([[55 - ag * 26, 114 - ag * 22], [62 - ag * 26, 115 - ag * 22], [63 - ag * 27, 122 - ag * 22], [57 - ag * 27, 124 - ag * 22]]), 'haut', { rd: 1 });
    const armR = [...glied(R([[104, 70], [112, 90], [114, 108], [112 - ag * 4, 118 - ag * 4]]), 3, 2.2, 'haut')];
    const handR = E(...rot(111 - ag * 4, 122 - ag * 4), 3, 3.6, 'haut');
    const gruppen = [
      { p: kette, k: 0, kante: true },                 // 0
      { p: block, k: 0.8, kante: true, tone: 0.05 },   // 1
      { p: [...armR, handR], k: 1, kante: true, tone: -0.05 }, // 2 hinterer Arm
      { p: fl, k: 0.5, kante: true },                  // 3 Flossen
      { p: [schwanzF], k: 0, kante: true },            // 4
      { p: [leib], k: 0, kante: true, tone: 0.04 },    // 5
      { p: [kiefer], k: 0, kante: true },              // 6
      { p: haken, k: 0, kante: true, tone: 0.2 },      // 7
      { p: [...armL, handL], k: 1, kante: true, tone: 0.1 }, // 8 vorderer Arm
    ];
    const LEIB = 5, KIEFER = 6, ARML = 8, FL = 3, SCHW = 4;
    gruppen.forEach(g => { g.anker = [0, fall]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette(v.zone || 'fabrik_fang'), { rimBis: 176 });
    const inv = (x, y) => { const X = x - px, Y = y - py - fall; return [px + X * Math.cos(-a) - Y * Math.sin(-a), py + X * Math.sin(-a) + Y * Math.cos(-a)]; };
    const augen = [];
    const details = P => {
      const B = (x, y) => LIB.bay(x, y - fall);
      // Leib: Schuppen in versetzten Bögen, Seitenlinie, Rücken (rechts) dunkel, Bauch (links) eine Stufe heller
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (gid[y * W + x] !== LEIB) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const [u, w] = inv(x + 0.5, y + 0.5); const q = (w - yT) / (yB - yT); const s = (u - cx) / Rb;
        let t = c;
        if (s < -0.35 && B(x, y) < 0.5 + (-s - 0.35)) t = 3;
        if (s > 0.42 && s < 0.78 && B(x, y) < 0.55 - Math.abs(q - 0.4)) t = 4; else if (s > 0.78) t = Math.min(t, 2);
        { const row = Math.floor((w + 0.5) / 4), off = (row & 1) * 3; const sc = ((u + off) % 6 + 6) % 6, wy = ((w % 4) + 4) % 4; if (q > 0.16 && q < 0.9) { if (wy < 0.9 && sc > 0.8 && sc < 5.2) t = Math.max(1, t - 1); else if (wy < 1.9 && sc > 1.6 && sc < 4.4 && s > -0.1) t = Math.min(4, t + 1); } }
        // Seitenlinie
        if (Math.abs(s - 0.18 + q * 0.12) < 0.04 && q > 0.12 && q < 0.85) t = (B(x, y) < 0.6 ? 4 : 3);
        P.set(x, y, t);
      }
      // Kiemendeckel: Bogen hinter dem Kopf, darin das innere Licht (Phase 1: es scheint durch die Kiemen)
      const kmY = 66;
      for (let k = 0; k < 30; k++) { const t = k / 29, ang = -1.3 + t * 2.4; const [x, y] = rot(cx + 6 + Math.cos(ang) * 12, kmY - 12 + Math.sin(ang) * 14); if (P.get(r(x), r(y)) && gid[r(y) * W + r(x)] === LEIB) { P.set(x, y, 'k0'); P.set(x + 1, y + 1, t > 0.3 && t < 0.8 && !v.offen ? 'glutDim' : 'k3'); } }
      if (!v.offen && !(p.tod && f >= 1)) { for (let k = 0; k < 4; k++) { const [x, y] = rot(cx + 14, kmY - 8 + k * 4); P.set(x, y, k === 1 ? 'glut' : 'glutDim'); } augen.push([r(rot(cx + 14, kmY - 4)[0]), r(rot(cx + 14, kmY - 4)[1])]); }
      // Stempel auf der Flanke: das Datum von morgen, eingestanzt (rost), drei Ziffergruppen
      { const [sx0, sy0] = rot(cx - 12, 100); for (let yy = 0; yy < 5; yy++) for (let xx = 0; xx < 13; xx++) { const X = r(sx0 + xx), Y = r(sy0 + yy); if (gid[Y * W + X] !== LEIB) continue; const rand = (yy === 0 || yy === 4 || xx === 0 || xx === 12) && (xx + yy) % 2 === 0; const ziff = yy === 2 && xx > 1 && xx < 11 && xx !== 4 && xx !== 8; if (rand || ziff) P.set(X, Y, 'stempel'); else P.set(X, Y, 'k1'); } }
      // Flossen: Strahlen
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const g = gid[y * W + x]; if (g !== FL && g !== SCHW) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const [u, w] = inv(x, y); if (g === SCHW ? ((u - cx) * 0.6 + (w - 146) * 0.15 + 30) % 3 < 1 : (w % 3) < 1) P.set(x, y, 'k0'); else if (B(x, y) < 0.3) P.set(x, y, 'k3'); }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // Arme: Licht an der Oberkante, Hände mit Fingern, der Ehering
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (gid[y * W + x] === ARML && P.get(x, y) <= 4 && gid[y * W + x + 1] !== ARML) P.set(x, y, 'r1');
      { const [hx, hy] = rot(59 - arm * 27, 123 - arm * 22); for (let k = -1.5; k <= 1.5; k++) P.line(hx + k * 1.7, hy, hx + k * 2.6 - arm * 3, hy + 7 - Math.abs(k), 'k3'); P.set(hx + 2, hy + 1, 'r2'); }
      // Kopf: Auge groß und rund, milchig, mit Glühen; Maul innen dunkel, Haken durch den Kiefer
      if (!(p.tod && f >= 1)) {
        const [ex, ey] = rot(84, 58);
        P.glow(ex, ey, 9, 0.9, 'glutDim', 'k3');
        P.el(ex, ey, 3.6, 3.6, 'k0', true); P.el(ex, ey, 2.6, 2.6, 'glut', true); P.set(ex - 1, ey, 'kern'); P.set(ex, ey, 'kern'); P.set(ex + 1, ey + 1, 'k1');
        augen.push([r(ex), r(ey)]);
      }
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== KIEFER) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const [u, w] = inv(x, y); if (u < 86 && w > 47 && w < 53 + maul * 4) P.set(x, y, 'k0'); }
      for (let k = 0; k < 10; k++) { const [x, y] = rot(84 - k * 2, 46 + k * (0.8 + maul * 0.9)); P.set(x, y, 'k0'); P.set(x + 1, y, 'k0'); if (k > 3) P.set(x + 2, y, 'k1'); }
      // Barteln unter dem Kinn
      { const [bx, by] = rot(60, 60 + maul * 10); P.line(bx, by, bx - 2, by + 6, 'k2'); P.set(bx - 2, by + 6, 'r1'); }
      // Kette und Block: Glieder hell an der Lichtseite, Block mit Bolzen
      KA.licht(P, block, { c: 'r2', c2: 'r1' }); { const [bx, by] = rot(88, 30); P.set(bx, by, 'eisen'); }
      // Phase 2: aufgeschlitzt vom Kiemendeckel bis zum Bauch; innen Licht und eine Hand, die den Schnitt aufhält
      if (v.offen) {
        const sch = []; for (let k = 0; k < 60; k++) { const t = k / 59; sch.push([t, rot(cx - 9 + Math.sin(t * Math.PI) * -4, 70 + t * 66)]); }
        for (const [t, [x, y]] of sch) { const br = Math.round(1 + Math.sin(t * Math.PI) * 4); for (let k = -br; k <= br; k++) { const X = r(x) + k, Y = r(y); if (gid[Y * W + X] !== LEIB) continue; const m = Math.abs(k) / (br + 0.5); P.set(X, Y, m > 0.8 ? 'k0' : m > 0.55 ? 'glutDim' : (B(X, Y) < 0.2 && m < 0.3) ? 'kern' : 'glut'); } if (t > 0.1 && t < 0.9) P.glow(x, y, 8, 0.5, 'glutDim', 'k3'); }
        // Finger, die von innen den Rand greifen
        for (const t of [0.35, 0.45, 0.58]) { const [x, y] = sch[Math.round(t * 59)][1]; const br = Math.round(1 + Math.sin(t * Math.PI) * 4); P.set(r(x) - br - 1, r(y), 'k3'); P.set(r(x) - br - 1, r(y) + 1, 'k3'); P.set(r(x) - br, r(y), 'k2'); }
        // ein Gesicht im Licht, oben im Schnitt
        { const [x, y] = sch[22][1]; P.set(r(x) - 1, r(y), 'k1'); P.set(r(x) + 1, r(y), 'k1'); P.set(r(x), r(y) + 3, 'k1'); }
        augen.push([r(sch[30][1][0]), r(sch[30][1][1])]);
      }
      // Randlicht oben rechts kräftig (das kalte Licht vom Kühlhaus)
      { const z = []; for (let y = 0; y < 176; y++) for (let x = 0; x < W - 1; x++) { const c = P.get(x, y); if (c < 1 || c > 5) continue; if (!P.get(x + 1, y) && !P.get(x, y - 1)) z.push([x, y, 'r2']); } for (const [x, y, c] of z) P.set(x, y, c); }
    };
    return { gruppen, details, augen };
  },
};
// Probe: liegend auf dem Band (nur für den Silhouetten-Vergleich)
function liegend(p, v, A) {
  const { E, Pg } = A;
  const gruppen = [{ p: [E(80, 150, 60, 16, null), Pg([[132, 140], [156, 126], [152, 170]], null, {})], k: 1 }];
  return { gruppen, details: P => P.auge(30, 146, 2), augen: [[30, 146]] };
}
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
