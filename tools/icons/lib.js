// Saltmoor 1925 · Icon-Werkzeug: Item-Icons 48 × 48 und Handgriff-Bilder 48 × 32.
// Nutzt die Lichtkette aus tools/sprites/lib.js (Distanzfelder -> Höhe -> Normalen -> Licht ->
// Rampe mit Bayer-Dither, Randlicht an der Außenkante gegen oben rechts, Kontaktschatten, kein Umriss).
// Neu gegenüber den Gegnern: mehrere Materialien je Bild (Holz, Eisen, Messing, Glas …), jede Gruppe
// trägt ihr Material. Das Randlicht ist mit der Stofffarbe des Items getönt (gedämpft), dazu kommen
// Akzent-Rampen in der Stofffarbe (Flüssigkeit, Glut, Steine). Alpha nur 0/255, keine Zwischentöne.
'use strict';
const fs = require('fs');
const path = require('path');
const S = require('../sprites/lib.js');
const { hx, mix, bay, clamp } = S;

const WURZEL = path.resolve(__dirname, '../..');
const STOFFE = JSON.parse(fs.readFileSync(path.join(WURZEL, 'prototype/data/stoffe.json'), 'utf8')).stoffe;

// ---------------------------------------------------------------------------
// Materialien: 4 dunkle Körperstufen (dunkel -> hell) und eine Eigenfarbe für das Randlicht (hell).
// Bewusst etwas heller als die Gegner-Körper, damit das Icon auf dem fast schwarzen Feld (#0a0806) steht.
const MAT = {
  eisen:   { body: ['#0a0b0d', '#15171b', '#22262c', '#343a42'], hell: '#c8d0d8' },
  rost:    { body: ['#0d0806', '#1a0f0b', '#2a1810', '#3e2416'], hell: '#d8a080' },
  stahl:   { body: ['#0b0c0f', '#181b20', '#292e36', '#3e4550'], hell: '#dde6f0' },
  silber:  { body: ['#0d0e11', '#1c1f24', '#30343c', '#4a5059'], hell: '#eef2f6' },
  messing: { body: ['#0f0b04', '#20170a', '#382810', '#55401c'], hell: '#f0d898' },
  gold:    { body: ['#110c03', '#251a07', '#41300e', '#664c18'], hell: '#ffe6a0' },
  kupfer:  { body: ['#100806', '#21110b', '#3a1d12', '#56301c'], hell: '#f0b08a' },
  holz:    { body: ['#0d0805', '#1a100a', '#2b1b10', '#40291a'], hell: '#d8b088' },
  holzhell:{ body: ['#100b07', '#21170e', '#362617', '#4e3922'], hell: '#e8cca0' },
  leder:   { body: ['#0c0706', '#180e0b', '#271812', '#3a251b'], hell: '#d4a888' },
  stoff:   { body: ['#0a0909', '#151313', '#221f1e', '#332f2c'], hell: '#cfc6b8' },
  wolle:   { body: ['#0b0907', '#17130f', '#262019', '#382f25'], hell: '#d6c8b0' },
  oelzeug: { body: ['#100c03', '#211907', '#382a0c', '#544014'], hell: '#f0d880' },
  tuch:    { body: ['#070608', '#0f0d11', '#19161c', '#26222b'], hell: '#b8b0c8' },
  rotstoff:{ body: ['#0d0505', '#1b0a0a', '#2d1110', '#431a17'], hell: '#e09080' },
  gruenstoff:{ body: ['#070908', '#0f1410', '#19211a', '#263226'], hell: '#b8d0a8' },
  blaustoff:{ body: ['#06080c', '#0d121a', '#161e2a', '#222e40'], hell: '#a8c0e0' },
  gummi:   { body: ['#080908', '#111311', '#1c1f1c', '#2a2e2a'], hell: '#b8c0b0' },
  knochen: { body: ['#100e0b', '#211d17', '#373027', '#52483a'], hell: '#f0e6d0' },
  papier:  { body: ['#12100c', '#24201a', '#3a342a', '#554c3e'], hell: '#f4ead4' },
  wachs:   { body: ['#09080a', '#141216', '#211d25', '#302b36'], hell: '#c8bcd8' },
  wachsrot:{ body: ['#120807', '#24110d', '#3c1d16', '#582c21'], hell: '#f0b098' },
  glas:    { body: ['#070b0b', '#0f1817', '#1a2827', '#2a3c3a'], hell: '#d8f0ea' },
  stein:   { body: ['#0b0b0c', '#171719', '#252528', '#38383c'], hell: '#d0d0d4' },
  haut:    { body: ['#110b09', '#21150f', '#342218', '#4a3222'], hell: '#e8b890' },
  fell:    { body: ['#0c0b0a', '#1a1715', '#2a2521', '#3d362f'], hell: '#d8ccbc' },
  perlmutt:{ body: ['#080c0b', '#121c1a', '#1f2f2b', '#30463f'], hell: '#d8f4e8' },
  fleisch: { body: ['#110607', '#220c0d', '#381414', '#521e1c'], hell: '#f0a090' },
  kohle:   { body: ['#070606', '#0e0c0b', '#171412', '#221e1b'], hell: '#c0a890' },
  torf:    { body: ['#0a0805', '#151008', '#221a0e', '#322615'], hell: '#c8b088' },
};
const MAT_NAMEN = Object.keys(MAT);
const OHNE_STOFF = '#bdb3a0';
// Gedämpfte Stofffarbe: etwas zum warmen Grau gezogen, damit nichts knallt
function stoffFarbe(code) { const s = STOFFE[code]; return s ? mix(s.c, '#a49c8c', 0.22) : OHNE_STOFF; }

// Lichter und Akzente (feste Farben)
const LICHT = {
  flamme: '#e8902e', flammeHell: '#ffd28a', flammeKern: '#fff2d0', glutDim: '#5c2a10', glutMittel: '#a8501c',
  warm: '#d89a4a', warmDim: '#3c2612', warmKern: '#fff0c8',
};

// Palette eines Bildes: 0 leer; je Material 6 Farben (k0..k3, r1, r2); dann Lichter; dann Akzente a/b (4 Stufen + hell)
function palette(st = [], rar = 'gewoehnlich') {
  const glanzA = stoffFarbe(st[0]), glanzB = stoffFarbe(st[1] || st[0]);
  const rimStaerke = rar === 'selten' ? 0.72 : rar === 'reliquie' ? 0.55 : 0.6;
  const farben = [null], namen = [''], idx = {}, matBase = {};
  const add = (n, c) => { idx[n] = farben.length; namen.push(n); farben.push(c); };
  for (const m of MAT_NAMEN) {
    const M = MAT[m]; matBase[m] = farben.length;
    let r2 = mix(M.hell, glanzA, rimStaerke);
    if (rar === 'reliquie') r2 = mix(r2, '#ffd890', 0.3);
    const r1 = mix(M.body[3], mix(M.hell, glanzA, 0.75), 0.42);
    M.body.forEach((c, i) => add(m + i, c)); add(m + 'R1', r1); add(m + 'R2', r2);
  }
  for (const [k, v] of Object.entries(LICHT)) add(k, v);
  // Akzent-Rampen in der Stofffarbe (Flüssigkeiten, Steine, Glut): dunkel -> hell, dazu 'aH' (Glanzlicht)
  const rampe = (c) => [mix(c, '#000000', 0.86), mix(c, '#000000', 0.72), mix(c, '#000000', 0.55), mix(c, '#000000', 0.36), mix(c, '#000000', 0.12), mix(c, '#ffffff', 0.35)];
  rampe(glanzA).forEach((c, i) => add('a' + (i < 4 ? i : i === 4 ? 'G' : 'H'), c));
  rampe(glanzB).forEach((c, i) => add('b' + (i < 4 ? i : i === 4 ? 'G' : 'H'), c));
  idx.a4 = idx.aG; idx.a5 = idx.aH; idx.b4 = idx.bG; idx.b5 = idx.bH;
  // Akzent als Material (Gruppen mit mat:'akzent'/'akzent2' rendern in der Stofffarbe)
  matBase.akzent = farben.length; ['a0', 'a1', 'a2', 'a3'].forEach(n => { add('akzent' + n.slice(1), farben[idx[n]]); }); add('akzentR1', farben[idx.aG]); add('akzentR2', farben[idx.aH]);
  matBase.akzent2 = farben.length; ['b0', 'b1', 'b2', 'b3'].forEach(n => { add('akzent2' + n.slice(1), farben[idx[n]]); }); add('akzent2R1', farben[idx.bG]); add('akzent2R2', farben[idx.bH]);
  // Rückweg: Index -> {mat, stufe}
  const info = namen.map(n => { const m = /^([a-z0-9]+?)(\d|R1|R2)$/.exec(n); if (!m) return null; const mat = m[1]; if (!(mat in matBase)) return null; const s = m[2] === 'R1' ? 4 : m[2] === 'R2' ? 5 : +m[2]; return { mat, stufe: s }; });
  return { farben, namen, idx, matBase, info, glanzA, glanzB };
}

// ---------------------------------------------------------------------------
// Formen-Helfer (zusätzlich zu E, C, Pg, chain, glied, saum aus tools/sprites/lib.js)
const { E, C, Pg, chain, glied, saum } = S;
const rad = d => d * Math.PI / 180;
// Punkt entlang einer Achse: Ursprung (x,y), Richtung a, Abstand t, quer q (rechts der Richtung positiv)
function achse(x, y, a) {
  const c = Math.cos(a), s = Math.sin(a);
  const P = (t, q = 0) => [x + c * t - s * q, y + s * t + c * q];
  return { P, a, c, s, x, y };
}
// Polygon in Achsenkoordinaten [[t,q],…]
function apg(ax, pts, m, o) { return Pg(pts.map(([t, q]) => ax.P(t, q)), m, o); }
// Kapsel in Achsenkoordinaten
function acap(ax, t0, q0, t1, q1, r0, r1, m, o) { const [a, b] = ax.P(t0, q0), [c, d] = ax.P(t1, q1); return C(a, b, c, d, r0, r1 ?? r0, m, o); }
// Ring (Torus) aus Kapseln
function ring(cx, cy, rx, ry, r, m, o = {}, n = 14, a0 = 0, a1 = Math.PI * 2) {
  const out = []; for (let i = 0; i < n; i++) { const q0 = a0 + (a1 - a0) * i / n, q1 = a0 + (a1 - a0) * (i + 1) / n; out.push(C(cx + Math.cos(q0) * rx, cy + Math.sin(q0) * ry, cx + Math.cos(q1) * rx, cy + Math.sin(q1) * ry, r, r, m, o)); }
  return out;
}
// Catmull-Rom-Pfad durch alle Punkte, t in 0..1 gleichmäßig nach Abschnitten
function pfad(pts) {
  const n = pts.length - 1;
  return t => { const u = Math.min(n - 1e-6, Math.max(0, t * n)); const i = Math.floor(u), f = u - i;
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n, i + 2)];
    const k = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (-a + 3 * b - 3 * c + d) * f * f * f);
    return [k(p0[0], p1[0], p2[0], p3[0]), k(p0[1], p1[1], p2[1], p3[1])]; };
}
// Bezier-Kurve als Kapselkette (für Seile, Ketten, Schnüre)
function kurve(pts, r0, r1, m, o = {}, n = 12) {
  let B = t => { let p = pts.map(q => q.slice()); while (p.length > 1) { const nx = []; for (let i = 0; i < p.length - 1; i++) nx.push([p[i][0] + (p[i + 1][0] - p[i][0]) * t, p[i][1] + (p[i + 1][1] - p[i][1]) * t]); p = nx; } return p[0]; };
  if (o.cr) B = pfad(pts); // Catmull-Rom: Kurve geht durch alle Punkte
  const out = []; let a = B(0); for (let i = 1; i <= n; i++) { const b = B(i / n); out.push(C(a[0], a[1], b[0], b[1], r0 + (r1 - r0) * (i - 1) / n, r0 + (r1 - r0) * i / n, m, o)); a = b; }
  out.B = B; return out;
}

// Hand (für Handgriff-Bilder). Handgelenk bei (x,y), Finger zeigen in Richtung a.
// curl: Krümmung je Finger [Zeige, Mittel, Ring, Klein] 0 = gestreckt, 1 = eingerollt; daumen: Krümmung des Daumens;
// seite: +1/-1, auf welcher Seite der Daumen sitzt (quer zur Richtung); s: Größe; spreiz: Fächer der Finger.
function hand(o) {
  const s = o.s ?? 1, a = o.a ?? 0, seite = o.seite ?? 1, curl = o.curl ?? [0, 0, 0, 0], spreiz = o.spreiz ?? 0.12;
  const ax = achse(o.x, o.y, a);
  const pl = 6.5 * s, pb = 2.7 * s; // Handteller-Länge, halbe Breite
  const out = { teller: [], finger: [], daumen: [], spitzen: [] };
  out.teller.push(apg(ax, [[0, -pb * 0.8], [pl * 0.9, -pb], [pl, 0], [pl * 0.9, pb], [0, pb * 0.8]], null, { rd: 1.1 * s, b: 1.4 }));
  const fl = [[3.2, 2.4, 1.9], [3.5, 2.6, 2.0], [3.3, 2.4, 1.9], [2.6, 1.9, 1.5]];
  const rr = [1.15, 1.2, 1.1, 0.95];
  for (let i = 0; i < 4; i++) {
    const q = (-seite) * (i - 1.5) * pb * 0.62 * -1; // Zeigefinger auf Daumenseite
    let [px, py] = ax.P(pl * (i === 3 ? 0.88 : 0.97), seite * (1.5 - i) * pb * 0.6);
    let ang = a + seite * (1.5 - i) * spreiz * -1 * -1;
    const pts = [[px, py]];
    for (let j = 0; j < 3; j++) { ang += -seite * curl[i] * (j === 0 ? 0.9 : 1.15) * (o.krumm ?? 1); px += Math.cos(ang) * fl[i][j] * s; py += Math.sin(ang) * fl[i][j] * s; pts.push([px, py]); }
    if (o.ohne && o.ohne.includes(i)) continue;
    out.finger.push(...glied(pts, rr[i] * s, rr[i] * 0.8 * s, null)); out.spitzen.push([px, py]); void q;
  }
  // Daumen: vom Handballen schräg nach vorn auf der Daumenseite
  const dc = o.daumen ?? 0.2; let [dx, dy] = ax.P(pl * 0.25, seite * pb * 0.9); let da = a + seite * (o.daumenWinkel ?? 0.85); const dp = [[dx, dy]];
  const dl = [2.8, 2.4, 1.9];
  for (let j = 0; j < 3; j++) { da += -seite * dc * 0.9; dx += Math.cos(da) * dl[j] * s; dy += Math.sin(da) * dl[j] * s; dp.push([dx, dy]); }
  out.daumen.push(...glied(dp, 1.35 * s, 1.0 * s, null)); out.daumenSpitze = [dx, dy];
  // Unterarm mit Ärmel nach hinten
  const al = o.arm ?? 12; if (al > 0) { out.arm = [acap(ax, -al, 0, 0.5, 0, 2.6 * s, 2.1 * s, null)]; out.aermel = o.aermel === false ? [] : [acap(ax, -al - 2, 0, -al * 0.35, 0, 3.4 * s, 3.0 * s, null)]; } else { out.arm = []; out.aermel = []; }
  out.alle = () => [...out.teller, ...out.finger, ...out.daumen];
  out.ax = ax;
  return out;
}
// Faust (geschlossene Hand), Knöchel zeigen in Richtung a
function faust(o) {
  const s = o.s ?? 1, a = o.a ?? 0, seite = o.seite ?? 1; const ax = achse(o.x, o.y, a);
  const teller = [apg(ax, [[0, -2.4 * s], [5.5 * s, -3.3 * s], [7.5 * s, -2 * s], [7.5 * s, 2.4 * s], [5.5 * s, 3.4 * s], [0, 2.4 * s]], null, { rd: 1.2 * s, b: 1.5 })];
  const knoechel = [0, 1, 2, 3].map(i => { const [x, y] = ax.P(7.2 * s, seite * (1.6 - i * 1.1) * s * 1.05); return E(x, y, 1.3 * s, 1.3 * s, null, { pf: 'bevel' }); });
  const [d0x, d0y] = ax.P(2 * s, seite * 2.8 * s), [d1x, d1y] = ax.P(6.2 * s, seite * 1.0 * s);
  const daumen = [C(d0x, d0y, d1x, d1y, 1.4 * s, 1.15 * s, null)];
  const al = o.arm ?? 12;
  const arm = al > 0 ? [acap(ax, -al, 0, 0.5, 0, 2.6 * s, 2.2 * s, null)] : [];
  const aermel = al > 0 && o.aermel !== false ? [acap(ax, -al - 2, 0, -al * 0.35, 0, 3.4 * s, 3.0 * s, null)] : [];
  return { teller, knoechel, daumen, arm, aermel, ax, alle: () => [...teller, ...knoechel], spitze: ax.P(8.5 * s, 0) };
}

// ---------------------------------------------------------------------------
// Bausteine, die mehrere Icons teilen (jedes Icon setzt sie anders zusammen)
// Perlenschnur entlang einer Bezier-Kurve: n Perlen mit Radius r
function perlen(pts, n, r, m, o = {}) {
  const k = kurve(pts, 0.4, 0.4, m, { cr: true, ...o }, 40); const out = [];
  for (let i = 0; i < n; i++) { const [x, y] = k.B(i / (n - 1)); out.push(E(x, y, r, r, m, { pf: 'bevel', ...o })); }
  out.B = k.B; return out;
}
// Kettenglieder entlang einer Kurve, abwechselnd flach (Ring) und hochkant (Stab)
function kettenglieder(pts, n, gr, m, o = { cr: true }) {
  const k = kurve(pts, 0.4, 0.4, m, o, 40); const flach = [], kant = [];
  for (let i = 0; i < n; i++) {
    const q = i / (n - 1), [x2, y2] = k.B(Math.min(1, q + 0.02)), [x1, y1] = k.B(Math.max(0, q - 0.02)); const [x, y] = k.B(q);
    const ax = achse(x, y, Math.atan2(y2 - y1, x2 - x1));
    if (i % 2) kant.push(acap(ax, -gr * 1.1, 0, gr * 1.1, 0, gr * 0.42));
    else { const N = 10; for (let j = 0; j < N; j++) { const a0 = j / N * Math.PI * 2, a1 = (j + 1) / N * Math.PI * 2; flach.push(C(...ax.P(Math.cos(a0) * gr * 1.25, Math.sin(a0) * gr * 0.75), ...ax.P(Math.cos(a1) * gr * 1.25, Math.sin(a1) * gr * 0.75), gr * 0.33, gr * 0.33)); } }
  }
  return { flach, kant, B: k.B };
}
// Zahnrad: Scheibe mit n Zähnen
function zahnrad(cx, cy, R, n, zh = 2.2, m, o = {}) {
  const pts = []; for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2, w = Math.PI / n;
    pts.push([cx + Math.cos(a - w * 0.62) * R, cy + Math.sin(a - w * 0.62) * R], [cx + Math.cos(a - w * 0.32) * (R + zh), cy + Math.sin(a - w * 0.32) * (R + zh)], [cx + Math.cos(a + w * 0.32) * (R + zh), cy + Math.sin(a + w * 0.32) * (R + zh)], [cx + Math.cos(a + w * 0.62) * R, cy + Math.sin(a + w * 0.62) * R]);
  }
  return Pg(pts, m, { b: 1.4, ...o });
}
// Mantel/Jacke von vorn: o = {cx, y0 (Schulter), y1 (Saum), sb (halbe Schulterbreite), sb2 (halbe Saumbreite), aerm, aw,
// kragen: 'revers'|'steh'|'kapuze'|'hoch', zacken (zerfetzter Saum), schraeg}
function mantel(o) {
  const { cx, y0, y1, sb, sb2 } = o; const aerm = o.aerm ?? (y1 - y0) * 0.6, aw = o.aw ?? 3.6, sch = o.schraeg ?? 0;
  const saumPts = o.zacken ? saum(cx + sb2 + sch, cx - sb2 + sch, y1, o.zacken, 3, o.seed || 3) : [[cx + sb2 + sch, y1], [cx - sb2 + sch, y1]];
  const koerper = Pg([[cx - sb + 2, y0 - 1], [cx + sb - 2, y0 - 1], [cx + sb + 1, y0 + 3], [cx + sb2 * 0.92 + sch, y1 - 6], ...saumPts, [cx - sb2 * 0.92 + sch, y1 - 6], [cx - sb - 1, y0 + 3]], null, { b: 2.2, rd: 0.8 });
  const ae = o.aermSpreiz ?? 3;
  const aermelL = [C(cx - sb, y0 + 2, cx - sb - ae + sch * 0.5, y0 + aerm, aw, aw * 0.85)], aermelR = [C(cx + sb, y0 + 2, cx + sb + ae + sch * 0.5, y0 + aerm, aw, aw * 0.85)];
  const stulpe = [C(cx - sb - ae + sch * 0.5, y0 + aerm - 2, cx - sb - ae + sch * 0.5, y0 + aerm + 0.5, aw * 0.95, aw * 0.95), C(cx + sb + ae + sch * 0.5, y0 + aerm - 2, cx + sb + ae + sch * 0.5, y0 + aerm + 0.5, aw * 0.95, aw * 0.95)];
  let kragen = [];
  if (o.kragen === 'revers') kragen = [Pg([[cx - 5, y0 - 2], [cx - 1, y0 + 9], [cx - 2, y0 + 13], [cx - 7, y0 + 3]], null, { b: 1 }), Pg([[cx + 5, y0 - 2], [cx + 1, y0 + 9], [cx + 2, y0 + 13], [cx + 7, y0 + 3]], null, { b: 1 })];
  if (o.kragen === 'steh') kragen = [Pg([[cx - 6, y0 - 4], [cx + 6, y0 - 4], [cx + 6, y0 + 1], [cx - 6, y0 + 1]], null, { b: 1, rd: 0.6 })];
  if (o.kragen === 'hoch') kragen = [Pg([[cx - 7, y0 - 6], [cx + 7, y0 - 6], [cx + 8, y0 + 2], [cx, y0 + 5], [cx - 8, y0 + 2]], null, { b: 1.2, rd: 0.6 })];
  if (o.kragen === 'kapuze') kragen = [Pg([[cx - 8, y0 + 2], [cx - 7, y0 - 8], [cx - 1, y0 - 14], [cx + 4, y0 - 12], [cx + 8, y0 - 5], [cx + 8, y0 + 2], [cx, y0 + 6]], null, { b: 1.6, rd: 1 })];
  return { koerper: [koerper], aermelL, aermelR, stulpe, kragen };
}

// ---------------------------------------------------------------------------
const TON_FLACH = 0.235;
// Arm und Ärmel einer Hand als Gruppen (Haut, darüber der Ärmel bis kurz vor das Handgelenk)
function armGruppen(h, aermelMat = 'stoff') { return [{ p: h.arm, mat: 'haut', k: 0 }, { p: h.aermel, mat: aermelMat, k: 0 }]; }
// Rendern: gruppen (hinten -> vorne), jede mit mat. Rückgabe Index-Puffer in die Bild-Palette.
function rendern(W, H, gruppen, pal) {
  const gs = gruppen.filter(g => g && g.p && (g.p.flat ? g.p.flat(3) : g.p).length);
  // Grundton: flache Flächen landen ohne Dither auf Stufe k2 (TON_FLACH), nur Fasen bekommen Übergänge
  const { buf, gid } = S.render(W, H, gs.map(g => ({ ...g, tone: (g.tone ?? 0) + TON_FLACH, p: g.p.flat ? g.p.flat(3) : g.p })), null, { rimBis: H + 10 });
  const out = new Uint8Array(W * H);
  for (let i = 0; i < out.length; i++) {
    if (!buf[i]) continue; const g = gs[gid[i]]; const m = g.mat || 'eisen';
    if (!(m in pal.matBase)) throw new Error('Unbekanntes Material ' + m);
    let st = buf[i] - 1; // 0..3 Körper, 4 r1, 5 r2
    if (g.ohneR2 && st === 5) st = 4;
    if (g.ohneRand && st >= 4) st = 3;
    out[i] = pal.matBase[m] + st;
  }
  return { buf: out, gid, gs };
}

// Pinsel auf dem Index-Puffer
function pinsel(buf, W, H, pal) {
  const I = n => { if (typeof n === 'number') return n; const v = pal.idx[n]; if (v == null) throw new Error('Unbekannte Farbe ' + n); return v; };
  const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
  const P = {
    W, H, pal,
    get: (x, y) => (inb(x, y) ? buf[y * W + x] : 0),
    info: (x, y) => (inb(x, y) ? pal.info[buf[y * W + x]] : null),
    set(x, y, c) { x = Math.round(x); y = Math.round(y); if (inb(x, y)) buf[y * W + x] = I(c); },
    auf(x, y, c) { x = Math.round(x); y = Math.round(y); if (inb(x, y) && buf[y * W + x]) buf[y * W + x] = I(c); },
    loesch(x, y) { x = Math.round(x); y = Math.round(y); if (inb(x, y)) buf[y * W + x] = 0; },
    // Stufe eines Körperpixels ändern (Ritzen, Kerben, Glanz auf dem eigenen Material)
    stufe(x, y, d, maxR = false) {
      x = Math.round(x); y = Math.round(y); if (!inb(x, y)) return; const v = buf[y * W + x]; const inf = pal.info[v]; if (!inf) return;
      let s = inf.stufe; if (s >= 4 && !maxR) return; s = clamp(s + d, 0, maxR ? 5 : 3); buf[y * W + x] = pal.matBase[inf.mat] + s;
    },
    line(x0, y0, x1, y1, c, nurAuf = false) { const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))); for (let k = 0; k <= n; k++) { const q = k / (n || 1); (nurAuf ? P.auf : P.set)(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q, c); } },
    ritz(x0, y0, x1, y1, d = -2) { const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))); for (let k = 0; k <= n; k++) { const q = k / (n || 1); P.stufe(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q, d); } },
    el(cx, cy, rx, ry, c, nurAuf = false) { for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) if (((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1) (nurAuf ? P.auf : P.set)(x, y, c); },
    // Glühen, gedithert, nur auf vorhandenen Pixeln: innen 'stark', außen 'schwach'
    glow(cx, cy, r, a = 1, stark = 'glutDim', schwach = null, nurKoerper = true) {
      for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) {
        if (!inb(x, y)) continue; const i = y * W + x; if (nurKoerper && !buf[i]) continue;
        const q = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / r; if (q >= 1) continue;
        const inf = pal.info[buf[i]]; if (buf[i] && (!inf || inf.stufe >= 4)) continue; // Lichter und Randlicht bleiben
        const v = a * (1 - q) * (1 - q);
        if (v > 0.45 + bay(x, y) * 0.4) buf[i] = I(stark); else if (schwach && v > bay(x, y) * 0.9) buf[i] = I(schwach);
        else if (!schwach && inf && v > bay(x, y) * 0.9) P.stufe(x, y, +1);
      }
    },
    // Flamme: Tropfenform nach oben, Kern unten, gedithert
    flamme(x, y, h, b, neig = 0) {
      for (let yy = Math.floor(y - h); yy <= y + 1; yy++) for (let xx = Math.floor(x - b - 1); xx <= x + b + 1; xx++) {
        const t = (y - yy) / h; if (t < -0.1 || t > 1) continue; const w = b * Math.sin(Math.PI * Math.min(1, (t + 0.15) / 1.1)) * (1 - t * 0.35);
        const cx = x + neig * t * t * h * 0.5; const dx = Math.abs(xx + 0.5 - cx); if (dx > w + 0.2) continue;
        const v = 1 - dx / (w + 0.5) - t * 0.55;
        P.set(xx, yy, v > 0.62 ? 'flammeKern' : v > 0.38 ? 'flammeHell' : v > 0.14 + bay(xx, yy) * 0.12 ? 'flamme' : 'glutMittel');
      }
    },
    // Mündungsfeuer: kurzer, gezackter Stern, gedithert
    blitz(x, y, r = 4, a = 0) {
      for (let yy = Math.floor(y - r); yy <= y + r; yy++) for (let xx = Math.floor(x - r); xx <= x + r; xx++) {
        const dx = xx + 0.5 - x, dy = yy + 0.5 - y, d = Math.hypot(dx, dy); if (d > r) continue;
        const w = Math.atan2(dy, dx) - a; const strahl = Math.pow(Math.abs(Math.cos(w * 2)), 6) * (Math.cos(w) > 0 ? 1 : 0.5);
        const v = (1 - d / r) * (0.45 + strahl * 0.9);
        if (v > 0.75) P.set(xx, yy, 'flammeKern'); else if (v > 0.5) P.set(xx, yy, 'flammeHell'); else if (v > 0.3 + bay(xx, yy) * 0.2) P.set(xx, yy, 'flamme');
      }
    },
    // Tropfen (2 px, oben dunkler)
    tropfen(x, y, c1 = 'a2', c2 = 'a3') { P.set(x, y, c1); P.set(x, y + 1, c2); },
    // Rauch/Dampf: lockerer geditherter Fleck in einer Farbe, nur auf leerem Grund
    rauch(cx, cy, r, c = 'stoff2', dichte = 0.5) {
      for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) {
        if (!inb(x, y) || buf[y * W + x]) continue; const q = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / r; if (q >= 1) continue;
        if ((1 - q) * dichte * 2 > bay(x, y) + 0.15) buf[y * W + x] = I(c);
      }
    },
    // Funken/Glitzer: einzelne Pixel
    funke(x, y, c = 'flammeHell') { P.set(x, y, c); },
  };
  return P;
}

// Reliquie: leichtes warmes Glühen im Inneren und zwei, drei Lichtstäubchen oben rechts am Rand
function reliquieGlanz(buf, W, H, pal) {
  let sx = 0, sy = 0, n = 0, x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (buf[y * W + x]) { sx += x; sy += y; n++; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  if (!n) return; const cx = sx / n, cy = sy / n, r = Math.max(x1 - x0, y1 - y0) * 0.3;
  // nur die dunkelsten Stufen, dünn gedithert: ein Schimmer, kein Fleck
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; const inf = pal.info[buf[i]]; if (!inf || inf.stufe >= 2) continue;
    const q = Math.hypot(x - cx, y - cy) / r; if (q >= 1) continue; const v = (1 - q) * 0.55;
    if (v > 0.2 + bay(x, y) * 0.8) buf[i] = pal.idx.warmDim;
  }
  // Stäubchen: freie Pixel in der Nähe der oberen rechten Kante
  const staub = [];
  for (let y = y0; y <= y0 + (y1 - y0) * 0.6; y++) for (let x = x1; x >= x0 + (x1 - x0) * 0.4; x--) {
    const i = y * W + x; if (buf[i]) { const tx = x + 2, ty = y - 2; if (tx < W && ty >= 0 && !buf[ty * W + tx] && !buf[(ty + 1) * W + tx] && !buf[ty * W + tx - 1]) staub.push([tx, ty]); break; }
  }
  const wahl = [0.15, 0.5, 0.85].map(q => staub[Math.floor(q * (staub.length - 1))]).filter(Boolean);
  wahl.forEach(([x, y], k) => { buf[y * W + x] = k === 1 ? pal.idx.warmKern : pal.idx.warm; });
}

// Ein Bild bauen: def = Modul aus items/<id>.js oder handgriffe/<id>.js, o = {st, rar}
function bauen(def, o = {}) {
  const W = def.w || 48, H = def.h || 48;
  const st = o.st ?? def.st ?? [], rar = o.rar ?? def.rar ?? 'gewoehnlich';
  const pal = palette(st, rar);
  const A = { armGruppen, pfad, E, C, Pg, chain, glied, saum, achse, apg, acap, ring, kurve, hand, faust, perlen, kettenglieder, zahnrad, mantel, rad, r: Math.round, PI: Math.PI, sin: Math.sin, cos: Math.cos, mix, st, rar, W, H };
  const res = def.form(A, { st, rar });
  const { buf } = rendern(W, H, res.gruppen, pal);
  const P = pinsel(buf, W, H, pal);
  if (res.details) res.details(P);
  if (rar === 'reliquie' && res.glanz !== false) reliquieGlanz(buf, W, H, pal);
  return { buf, W, H, pal, rgba: S.zuRGBA(buf, pal) };
}

// Akzentfarbe der Handgriff-Bilder je Build-Familie (Handgriffe haben keinen eigenen Stoff)
const FAMILIE_ST = { glutnest: ['F'], brackwasser: ['V'], bollwerk: ['G'], aderlass: ['B'], kettenwerk: ['E'], hagel: ['F'], neutral: [] };
module.exports = { FAMILIE_ST, pfad, perlen, kettenglieder, zahnrad, mantel, S, MAT, LICHT, STOFFE, stoffFarbe, palette, rendern, pinsel, bauen, achse, apg, acap, ring, kurve, hand, faust, rad, WURZEL };
