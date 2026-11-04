// Saltmoor 1925 · Hintergründe: Akt I, Die Konservenfabrik (Biom-Paket fabrik).
// Komposition: docs/auftrag-2/biome/fabrik.md. Bildaufbau „Takt“: gleiche Dinge in gleichen Abständen.
// Wahrzeichen: der Schornstein, dessen Rauch nach unten fällt. Falsches Detail: Dosen ohne Etikett,
// jede mit demselben Datumsstempel. Gegenlicht: Natriumlicht vom Hof, rechts hinten durch die Fenster.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#040605', '#09110e', '#122019', '#1d3327'], rand: ['#8c5a24', '#ffcf6a'], augen: '#e4f2d8', nebel: ['#141d17', '#3a3c28'] };
const KACHEL = ['#050a07', '#09130e', '#0e1d15', '#14281d', '#1b3526', '#244430', '#2e543c'];
const KALK = ['#080706', '#0f0c09', '#17120d', '#201912', '#2a2117', '#352a1c'];
const BODEN = ['#040605', '#080c0a', '#0d1310', '#131b16', '#1a251e', '#22302a'];
const ROST = ['#0a0503', '#160a05', '#24100a', '#361a0e', '#4c2614', '#64341c'];
const ZIEGEL = ['#0a0605', '#140b08', '#20110c', '#2c1810', '#3a2014', '#4a2a1a'];
const BLECH = ['#0b120f', '#152019', '#203027', '#2e4336', '#3e5747', '#566e5c'];
const HOF = ['#120f08', '#1c170c', '#282010', '#352a14', '#463718', '#5a461e', '#73581f'];
const RAUCH = ['#34342a', '#4c4a38', '#686448', '#88825a'];
const NAT = '#ffb84a', NAT_K = '#fff2c4', NAT_G = '#3a2a0c', NAT_G2 = '#5a400e';
const MET = { k: ['#040605', '#09110e', '#122019', '#1d3327', '#2a4636'] };

const quad = (K, eb, pts, tiefe, mat) => { const m = B.maske(); m.poly(pts); K.form(eb, m, tiefe, mat || {}); return m; };
const frac = v => v - Math.floor(v);

// ---------- Bausteine ----------
// Dose: blank, ohne Etikett, mit Stempelfleck. x = Mitte, yb = Unterkante, w = Breite in px
function dose(K, eb, x, yb, w, tiefe) {
  w = Math.max(2, w); const h = Math.max(3, Math.round(w * 1.2)), m = B.maske();
  m.rect(x - w / 2, yb - h, w, h); if (w >= 4) { m.ell(x, yb - h, w / 2, Math.max(.6, w * .16)); m.ell(x, yb, w / 2, Math.max(.6, w * .16)); }
  K.form(eb, m, tiefe, { k: BLECH, ton: 2.2, fase: w > 5 ? 1 : 0, rand: w > 5 ? 2 : 1, verlaufX: -.8 });
  if (w >= 5) { const e = K.e[eb], c = B.pk(B.mix(ROST[4], '#000', tiefe * .6)); e.set(x - 1, yb - h * .5, c); e.set(x, yb - h * .5, c); if (w >= 8) e.set(x + 1, yb - h * .5, c); }
}
// Dosenturm (Pyramide), Reihen von unten nach oben
function dosenturm(K, eb, x, yb, w, reihen, tiefe) {
  for (let r = 0; r < reihen; r++) { const n = reihen - r, y = yb - r * Math.round(w * 1.2); for (let i = 0; i < n; i++) dose(K, eb, Math.round(x + (i - (n - 1) / 2) * (w + 1)), y, w, tiefe); }
}
// Hängelampe unter Blechschirm. x,y = Birne, s = Schirmbreite/2 in px, an = brennt
function haengelampe(K, eb, x, y, s, an, tiefe, kabelBis) {
  const m = B.maske(); m.kap(x, kabelBis === undefined ? -M : kabelBis, x, y - s * .7, .5, .5);
  m.poly([[x - s * .3, y - s * .8], [x + s * .3, y - s * .8], [x + s, y], [x - s, y]]);
  K.form(eb, m, tiefe, Object.assign({ ton: 1.4, fase: 0, rand: 1 }, MET));
  if (!an) return;
  const e = K.e[eb]; e.set(x, y, B.pk(NAT_K)); if (s > 3) { e.set(x - 1, y, B.pk(NAT)); e.set(x + 1, y, B.pk(NAT)); }
  K.licht(x, y, NAT, s * 8, .8);
}
// Lichtkegel einer Hängelampe nach unten und Fleck auf Boden/Band
function lampenLicht(K, x, y, s, yBoden, ebenen) {
  for (const i of ebenen) B.kegel(K.e[i], x, y + 1, Math.PI / 2, .42, (yBoden - y) * 1.1, NAT_G2, .55);
  K.glut(x, yBoden, s * 5, NAT_G, .9, ebenen);
}
// Schornstein: Ziegelsäule, Mündung oben, Rauch fällt außen herab (statisch gedithert; Bewegung über rauchAnim)
function schornstein(K, eb, x, yTop, yBot, wTop, wBot, tiefe) {
  const m = B.maske(); m.poly([[x - wTop / 2, yTop], [x + wTop / 2, yTop], [x + wBot / 2, yBot], [x - wBot / 2, yBot]]);
  m.rect(x - wTop / 2 - 2, yTop - 3, wTop + 4, 4);
  K.form(eb, m, tiefe, { k: ZIEGEL, ton: 1.6, fase: 1.5, verlauf: -.3, muster: (px, py) => { const row = Math.floor(py / 3); return (py % 3 === 0 ? -.5 : 0) + ((Math.floor(px + (row & 1) * 3) % 6) === 0 ? -.35 : 0) + (B.hash(px >> 2, row, 11) - .5) * .3; } });
  // Eisenringe
  for (let y = yTop + 10; y < yBot - 6; y += 22) { const q = (y - yTop) / (yBot - yTop), w = wTop + (wBot - wTop) * q, r = B.maske(); r.rect(x - w / 2 - 1, y, w + 2, 2); K.form(eb, r, tiefe, { k: ROST, ton: 2.6, fase: 0, rand: 1 }); }
}
// Rauch, der fällt: Dichte d(x,y) 0..1; statisch als Dither in eb, dazu Bewegung (Schlieren nach unten)
function rauchFaellt(K, eb, x0, y0, x1, y1, dichte, maske, p) {
  const C = RAUCH.map(B.pk);
  B.feld(K.e[eb], x0, y0, x1, y1, RAUCH, (x, y) => { if (maske && !maske(x, y)) return -1; const d = dichte(x, y) * (.6 + .55 * B.fbm(x * .07, y * .03, 21, 3)); if (d < .18) return -1; return (d - .18) * 1.25; });
  void C;
  // Bewegung: Pixelliste mit Dichte, Rauschen wandert nach unten
  const pts = [];
  for (let y = Math.max(-M, Math.floor(y0)); y < Math.min(H + M, y1); y++) for (let x = Math.max(-M, Math.floor(x0)); x < Math.min(W + M, x1); x++) { if (maske && !maske(x, y)) continue; const d = dichte(x, y); if (d > .15) pts.push(x, y, d); }
  const N = new Float32Array(64 * 128); for (let j = 0; j < 128; j++) for (let i = 0; i < 64; i++) N[j * 64 + i] = B.fbm(i * .11, j * .07, 33, 2);
  const cs = [B.css(RAUCH[2]), B.css(RAUCH[3])];
  K.anim.push({ p: p === undefined ? B.PAR[eb] : p, f(ctx, t, ox, oy) {
    const sh = Math.floor(t * 9);
    for (let k = 0; k < pts.length; k += 3) { const x = pts[k], y = pts[k + 1], d = pts[k + 2]; const n = N[(((y - sh) & 127) * 64) + (x & 63)]; const v = d * n * 1.25 - .3; if (v > B.bay(x, y)) { ctx.fillStyle = cs[v > .55 ? 1 : 0]; ctx.fillRect(x + ox, y + oy, 1, 1); } }
  } });
}
// Rauch quillt über den Rand der Mündung und läuft außen am Schornstein herab (über der Mündung: nichts)
function ueberlauf(sx, sTop, sBot, h0, h1) {
  return (x, y) => {
    const q = (y - sTop) / (sBot - sTop), d = Math.abs(x - sx), inn = h0 + (h1 - h0) * Math.max(0, q);
    if (y < sTop - 5) return 0;
    if (y < sTop + 2) return d < h0 + 5 ? Math.min(1, (y - sTop + 6) / 5) : 0; // Wulst auf dem Rand
    if (d < inn) return 0;
    const breit = 4 + q * 22 + Math.pow(Math.max(0, q - .82) / .18, 2) * 60;
    return Math.max(0, 1 - (d - inn) / breit) * (q > .85 ? Math.max(0, 1 - (q - .85) / .2) : 1) * (.8 + .2 * Math.sin(y * .13 + (x > sx ? 2 : 0)));
  };
}
// Fenster mit Sprossen (Rechteck in Bildkoordinaten); die Öffnung bleibt frei (hinten sieht man e0)
function sprossen(K, eb, x0, y0, x1, y1, nx, ny, tiefe) {
  const m = B.maske(); m.rect(x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4); m.rect(x0, y0, x1 - x0, y1 - y0, 0);
  for (let i = 1; i < nx; i++) m.rect(Math.round(x0 + (x1 - x0) * i / nx), y0, 1, y1 - y0);
  for (let j = 1; j < ny; j++) m.rect(x0, Math.round(y0 + (y1 - y0) * j / ny), x1 - x0, 1);
  K.form(eb, m, tiefe, Object.assign({ ton: 1.2, fase: 0, rand: 1 }, MET));
}
// Hof hinter den Fenstern (Ebene 0): nebliges Natriumlicht, Schornstein mit fallendem Rauch
function hofDraussen(K, sx, sTop, sBot, sw, maskeFenster) {
  B.feld(K.e[0], -M, -M, W + M, H + M, HOF, (x, y) => .3 + .55 * Math.max(0, 1 - Math.hypot((x - 470) / 300, (y - 30) / 220)) + B.fbm(x * .02, y * .03, 4, 2) * .2);
  schornstein(K, 0, sx, sTop, sBot, sw, sw * 1.35, .35);
  rauchFaellt(K, 0, sx - sw * 3, sTop - 6, sx + sw * 3, sBot, ueberlauf(sx, sTop, sBot, sw / 2, sw * .675), maskeFenster, 0);
}
// Fliesenboden (Welt-Raster) mit Rinne und nassen Glanzflecken unter den Lampen
function fliesen(K, P, y0, glanz, rinneX) {
  K.boden(y0, H + M, BODEN, (x, y) => {
    const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z) * .5;
    const fx = frac(X * 2), fz = frac(Z * 2);
    let t = .42 + (B.hash(Math.floor(X * 2), Math.floor(Z * 2), 7) - .5) * .18 - Math.max(0, 1 - Z / 3) * .12 + Math.min(.15, Z / 40);
    if (fx * k < 1 || fz * k * k / P.h * 2 < .7) t -= .22;
    if (rinneX !== undefined && Math.abs(X - rinneX) < .06) t = .14 + (Math.sin(Z * 5) > .6 ? .3 : 0);
    for (const g of glanz) { const d = Math.hypot((X - g[0]) * 1.4, (Z - g[1]) * .7); if (d < g[2]) t += (1 - d / g[2]) * .5 * (B.fbm(X * 3, Z * 2, 9, 2) > .45 ? 1 : .3); }
    return t;
  });
}

// =====================================================================
// Variante 0: Die Packhalle. Zwei Bänder links und rechts in die Tiefe, Lampen im Takt, gekachelte
// Längswand links, rechts hohe Fenster zum Hof; im vorderen Fenster der Schornstein.
function packhalle(K, cfg) {
  const fr = K.fr, P = B.persp(282, 128), Zb = 13, XL = -3.7, XR = 4.3, YD = 4.4; K.split = [146, 160];
  const fenster = [[2.6, 4.3], [5.4, 6.8], [8.1, 9.2], [10.4, 11.2]], fy0 = 1.25, fy1 = 3.7;
  const inFenster = (Z, Y) => Y > fy0 && Y < fy1 && fenster.some(([a, b]) => Z > a && Z < b);
  // Ebene 0: Hof (sichtbar durch die Fenster rechts)
  const offen = (x, y) => { if (x <= P.vx) return false; const Z = XR * P.h / (x - P.vx), Y = 1 - (y - P.vy) * Z / P.h; return inFenster(Z, Y); };
  hofDraussen(K, 458, -20, 150, 24, offen);
  // Decke, Wände, Rückwand: je Pixel aus der Raumgeometrie, nach Tiefe auf die Ebenen verteilt
  const ebZ = Z => Z < 3.2 ? 3 : Z < 7 ? 2 : 1;
  const L = [new Uint8Array((W + 2 * M) * (H + 2 * M))];
  for (let y = -M; y < P.vy + 20; y++) for (let x = -M; x < W + M; x++) {
    let Z, kind = '', Yw = 0, u = 0;
    const Zl = x < P.vx ? XL * P.h / (x - P.vx) : 1e9, Zr = x > P.vx ? XR * P.h / (x - P.vx) : 1e9, Zd = y < P.vy ? (1 - YD) * P.h / (y - P.vy) : 1e9;
    Z = Math.min(Zl, Zr, Zd, Zb);
    if (Z === Zb) { kind = 'rueck'; Yw = 1 - (y - P.vy) * Z / P.h; u = (x - P.vx) * Z / P.h; if (Yw < 0) continue; }
    else if (Z === Zd) { kind = 'decke'; u = (x - P.vx) * Z / P.h; }
    else { kind = Z === Zl ? 'links' : 'rechts'; Yw = 1 - (y - P.vy) * Z / P.h; if (Yw < 0) continue; }
    if (kind === 'rechts' && inFenster(Z, Yw)) continue;
    const e = K.e[ebZ(Z)], nebel = Math.min(.8, Z / 16);
    let cols, t;
    if (kind === 'decke') { cols = KALK; t = .2 + (frac(Z / 2) < .1 ? .5 : 0) + (Math.abs(u) < .08 ? .4 : 0); }
    else if (kind === 'links' && Yw < 1.6) { const fz = frac(Z * 4), fv = frac(Yw * 6), k = P.k(Z) / 4; cols = KACHEL; t = .55 - (fz * k < .9 || fv * k / 1.5 < .9 ? .3 : 0) + (B.hash(Math.floor(Z * 4), Math.floor(Yw * 6), 3) - .5) * .12 + (Yw > 1.5 ? -.25 : 0) - (1 - Math.min(1, Z / 4)) * .15; }
    else if (kind === 'links' || kind === 'rueck') { cols = KALK; t = .35 + B.fbm(Z * .8, Yw * 1.2, 5, 3) * .4 - (frac(Z / 2.6) < .06 && kind === 'links' ? .3 : 0); if (kind === 'links' && Yw < 1.75) t -= .2; }
    else { cols = KALK; t = .42 + B.fbm(Z * .7, Yw, 6, 2) * .3 + (Yw > fy0 - .12 && Yw < fy0 && fenster.some(([a, b]) => Z > a - .1 && Z < b + .1) ? .5 : 0); }
    t = B.clamp(t + nebel * .5, 0, .999);
    const n = cols.length - 1, tt = t * n, kk = Math.floor(tt); const c = B.mix(cols[Math.min(n, (tt - kk) > B.bay(x, y) ? kk + 1 : kk)], pal.nebel[1], nebel * .55);
    e.set(x, y, B.pk(c)); L[0][(y + M) * (W + 2 * M) + x + M] = 1;
  }
  // Fensterlaibungen mit Randlicht (Licht kommt von draußen) und Sprossen in Perspektive
  fenster.forEach(([a, b]) => {
    const eb = ebZ(a), Q = (Z, Y) => P.q(XR, Y, Z);
    const m = B.maske(); m.poly([Q(a, fy0), Q(b, fy0), Q(b, fy0 - .08), Q(a, fy0 - .08)]); K.form(eb, m, Math.min(.6, a / 18), { k: KALK, ton: 2.5, fase: 0 });
    const sp = B.maske(); for (let i = 1; i < 4; i++) { const Z = a + (b - a) * i / 4; sp.kap(...Q(Z, fy0), ...Q(Z, fy1), .5, .5); }
    for (let j = 1; j < 5; j++) { const Y = fy0 + (fy1 - fy0) * j / 5; sp.kap(...Q(a, Y), ...Q(b, Y), .5, .5); }
    K.form(eb, sp, Math.min(.6, a / 18), Object.assign({ ton: .8, fase: 0, rand: 0 }, MET));
    // Natriumlicht fällt durchs Fenster schräg auf den Boden
    const [lx, ly] = Q((a + b) / 2, (fy0 + fy1) / 2);
    for (const i of [2, 3, 4]) B.kegel(K.e[i], lx, ly, Math.PI - .55, .22, 260 / Math.sqrt(a), NAT_G2, .45 * (1 - fr * .5));
  });
  // Boden mit Rinne in der Mitte und Lichtflecken unter den Lampen
  const lampen = []; for (let Z = 2.2; Z < Zb - 1; Z += 1.9) for (const X of [-2.5, 2.4]) lampen.push([X, Z]);
  fliesen(K, P, P.vy, lampen.map(([X, Z]) => [X, Z, .9]), -.2);
  // Bänder: links und rechts entlang der Tiefe, Höhe 0,45, Beine im Takt; Dosen in gleichen Abständen
  const baender = [[-3.0, -2.0], [1.9, 2.9]], YB = .62;
  for (let Z = Zb - 1; Z >= 1.2; Z -= .8) {
    const Z2 = Z + .8, tf = Math.min(.7, Z / 18);
    for (const [xa, xb] of baender) {
      const yFuss = P.q(xa, 0, Z)[1], eb = K.eb(yFuss), seite = xa < 0 ? xb : xa;
      quad(K, eb, [P.q(xa, YB, Z), P.q(xb, YB, Z), P.q(xb, YB, Z2), P.q(xa, YB, Z2)], tf, { k: BLECH, ton: 1.0, fase: 0, rand: 1, muster: (px, py) => (frac(P.z(py) * 2.5) < .18 ? -.5 : 0) });
      quad(K, eb, [P.q(seite, YB, Z), P.q(seite, YB, Z2), P.q(seite, YB - .16, Z2), P.q(seite, YB - .16, Z)], tf, Object.assign({ ton: 1.6, fase: 0, rand: 1 }, MET));
      if (Math.abs(frac(Z / 1.6)) < .3) { const m = B.maske(); for (const X of [xa + .1, xb - .1]) { const [x1, y1] = P.q(X, YB - .1, Z), [x2, y2] = P.q(X, 0, Z); m.kap(x1, y1, x2, y2, Math.max(.6, P.k(Z) * .035), Math.max(.6, P.k(Z) * .035)); } K.form(eb, m, tf, Object.assign({ ton: 1.4, fase: 0 }, MET)); }
    }
    // Schemel an jedem Platz (vor dem linken Band), leer
    if (Math.abs(frac((Z + .4) / 1.9)) < .2 && Z < 10) { const [sx, sy] = P.q(-1.6, 0, Z + .3), k = P.k(Z + .3), m = B.maske(); m.rect(sx - k * .14, sy - k * .32, k * .28, Math.max(1, k * .04)); m.kap(sx - k * .1, sy - k * .3, sx - k * .12, sy, Math.max(.5, k * .015), Math.max(.5, k * .015)); m.kap(sx + k * .1, sy - k * .3, sx + k * .12, sy, Math.max(.5, k * .015), Math.max(.5, k * .015)); K.form(K.eb(sy), m, tf, Object.assign({ ton: 1.2, fase: 0 }, MET)); }
  }
  // Dosen auf den Bändern, alle gleich weit auseinander
  for (let Z = Zb - 1.2; Z >= 1.6; Z -= .3) for (const [xa, xb] of baender) for (const X of [xa + .3, xb - .3]) { const [x, y] = P.q(X, YB, Z), k = P.k(Z); if (x < -M || x > W + M) continue; dose(K, K.eb(P.q(xa, 0, Z)[1]), Math.round(x), Math.round(y), Math.max(2, Math.round(k * .085)), Math.min(.7, Z / 18)); }
  // Dosenturm am Ende des linken Bandes (vorne), Kübel
  if (!cfg.ohneTurm) dosenturm(K, 4, 64, 214, 9, 5, 0);
  // Lampen im Takt über den Bändern; mit fremdheit gehen sie aus (die hinteren zuerst)
  lampen.slice().reverse().forEach(([X, Z], i) => {
    const [x, y] = P.q(X, 2.5, Z), k = P.k(Z), eb = Math.min(3, ebZ(Z) + 1), an = fr < .5 || (fr < .85 ? (Z < 7 || i % 3) : Z < 4);
    haengelampe(K, eb, Math.round(x), Math.round(y), Math.max(2, k * .22), an, Math.min(.6, Z / 18), Math.round(P.q(X, YD, Z)[1]));
    if (an) lampenLicht(K, Math.round(x), Math.round(y), Math.max(2, k * .2), P.q(X, YB, Z)[1], [K.eb(P.q(X, 0, Z)[1])]);
  });
  // Abreißkalender neben der Tür in der Rückwand; das oberste Blatt liegt am Boden
  const [tx0, ty0] = P.q(-1.4, 2.1, Zb), [tx1, ty1] = P.q(.6, 0, Zb); const tm = B.maske(); tm.rect(tx0, ty0, tx1 - tx0, ty1 - ty0); K.form(1, tm, .3, { k: ROST, ton: 1.5, fase: 1, rand: 1, muster: (px) => (Math.round(px - tx0) % 4 === 0 ? -.4 : 0) });
  B.nebel(K.e[2], { y0: P.vy - 40, y1: P.vy + 18, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .3, xs: [140, 470, 60], seed: 3 });
  // Vordergrund: Bandkopf unten links (angeschnitten), Kettenzug oben rechts
  const v = B.maske(); v.poly([[-M, 226], [44, 218], [52, 230], [52, H + M], [-M, H + M]]); v.rect(-M, 232, 70, 4, 0);
  v.kap(420, -M, 420, 60, 1, 1); v.kap(426, -M, 426, 52, 1, 1); for (let y = 60; y < 90; y += 4) v.ell(423, y, 2.2, 1.5); v.poly([[414, 92], [432, 92], [428, 100], [418, 100]]);
  K.form(5, v, 0, { k: ['#020302', '#050806', '#0a110d', '#121c16'], ton: 1, fase: 2, rand: 2 });
  // Luft: Dampf zieht langsam, Fischschuppen glitzern im Lampenlicht
  B.partikel(K, { n: 50, farben: ['#3a3c2c', '#525036'], vx: -3, vy: -1, wob: 5, wf: .3, x0: 0, x1: 480, y0: 40, y1: 200, hellSelten: 1.2 });
  B.partikel(K, { n: 18, farben: ['#c8d8b0', NAT], vx: 0, vy: 2, wob: 2, wf: .8, x0: 60, x1: 460, y0: 60, y1: 220, blink: 2.3 });
  K.reihen = [{ y: 168, skala: .9, nebel: .35 }, { y: 191, skala: 1, nebel: .15 }, { y: 214, skala: 1, nebel: 0 }];
  void L;
  return { mitte: [250, 206] };
}

// =====================================================================
// Variante 1: Das Kesselhaus. Frontal eine Reihe runder Retortentüren, darüber Rohrbündel.
// Rechts der Fuß des Schornsteins; aus der Reinigungsklappe fließt der Rauch über den Boden.
function kesselhaus(K, cfg) {
  const fr = K.fr, P = B.persp(220, 150), Zw = 4.2, kw = P.k(Zw); K.split = [168, 178];
  const yw = P.q(0, 0, Zw)[1];
  // Rückwand: Kacheln bis Brusthöhe, darüber Kalk mit Rostfahnen
  B.feld(K.e[0], -M, -M, W + M, H + M, KALK, (x, y) => .3 + B.fbm(x * .03, y * .02, 8, 3) * .35 + (B.fbm(x * .2, y * .01, 9, 2) > .62 ? .25 : 0));
  const yk = P.q(0, 1.3, Zw)[1];
  B.feld(K.e[1], -M, yk, W + M, yw, KACHEL, (x, y) => { const fx = (x + 3) % 9, fy = (y - yk) % 7; return .5 - (fx === 0 || fy === 0 ? .3 : 0) + (B.hash(Math.floor((x + 3) / 9), Math.floor((y - yk) / 7), 4) - .5) * .15; });
  // Rohrbündel waagerecht unter der Decke, mit Flanschen; senkrechte Abgänge zu den Türen
  const rm = B.maske(); [[18, 3.2], [30, 2.6], [40, 2.2], [48, 1.8]].forEach(([y, r]) => rm.kap(-M, y, W + M, y + 2, r, r));
  const xs = [-3.4, -1.7, 0, 1.7, 3.4].map(X => P.q(X, 0, Zw)[0]);
  xs.forEach(x => { rm.kap(x + 14, 30, x + 14, yk - 26, 1.6, 1.6); rm.rect(x + 11, 44, 7, 3); });
  for (let x = 30; x < W; x += 64) for (const y of [18, 30]) rm.rect(x, y - 4, 3, 9);
  K.form(1, rm, .12, { k: ROST, ton: 1.6, fase: 1, rand: 2 });
  // Retorten: runde Türen mit Ring, Handrad, Schrauben; eine steht einen Spalt offen
  const R = Math.round(kw * .68), yc = P.q(0, 1.25, Zw)[1];
  xs.forEach((x, i) => {
    const offen = i === 3;
    const ring = B.maske(); ring.ell(x, yc, R + 4, R + 4); K.form(1, ring, .1, { k: ROST, ton: 1.5, fase: 2, rand: 2, schatten: 2 });
    if (offen) { const sp = B.maske(); sp.ell(x, yc, R, R); B.form(K.e[1], sp, K.mat(0, { k: ['#1a1a10', '#3a3418', '#6a5a20', '#a08a30'], ton: 2.2, rand: 0, fase: 0, verlaufX: 1 })); K.glut(x + R * .4, yc, R * 2.2, NAT_G, .9, [1, 2]); K.licht(x, yc, '#c8b060', R * 2, .7); }
    const tuer = B.maske(); tuer.ell(offen ? x - R * .45 : x, yc, offen ? R * .55 : R, R); K.form(1, tuer, .08, Object.assign({ ton: 1.4, fase: 2, rand: 2, schatten: offen ? 3 : 0, muster: (px, py) => (Math.hypot(px - x, py - yc) > R - 3 && Math.hypot(px - x, py - yc) < R - 2 ? -.6 : 0) }, MET));
    if (!offen) { const rad = B.maske(); rad.ell(x, yc, R * .35, R * .35); rad.ell(x, yc, R * .35 - 1.5, R * .35 - 1.5, 0); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + .3; rad.kap(x, yc, x + Math.cos(a) * R * .35, yc + Math.sin(a) * R * .35, .6, .6); } K.form(1, rad, 0, { k: ROST, ton: 2.4, fase: 0, rand: 1 }); }
    for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; K.e[1].set(Math.round(x + Math.cos(a) * (R + 2)), Math.round(yc + Math.sin(a) * (R + 2)), B.pk(ROST[5])); }
    // Manometer darüber, der Zeiger steht über dem Strich
    const mx = x - R * .2, my = yc - R - 12, mm = B.maske(); mm.ell(mx, my, 5, 5); K.form(1, mm, 0, { k: ['#1a1a14', '#2e2c22', '#4a4632', '#6a6448'], ton: 2.4, fase: 1, rand: 2 });
    B.linie(K.e[1], mx, my, mx + 3, my - 2, B.pk(ROST[2])); K.e[1].set(Math.round(mx + 3), Math.round(my - 4), B.pk('#a03018'));
  });
  // Schornsteinfuß rechts: Ziegelsäule durch Decke und Boden, Reinigungsklappe offen
  const sx = 432; schornstein(K, 2, sx, -M - 4, yw + 18, 58, 64, 0);
  const kl = B.maske(); kl.rect(sx - 14, yw - 18, 26, 20); B.form(K.e[2], kl, K.mat(0, { k: ['#000000', '#030302', '#070605', '#0c0a08'], ton: 0, rand: 0, fase: 0 }));
  const kd = B.maske(); kd.poly([[sx - 16, yw - 20], [sx - 30, yw - 14], [sx - 30, yw + 4], [sx - 16, yw + 2]]); K.form(2, kd, 0, { k: ROST, ton: 2, fase: 1, rand: 2 });
  // Boden: Beton mit Gitterrosten in die Tiefe
  K.boden(yw - 2, H + M, BODEN, (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z); let t = .45 + B.fbm(X * 2, Z * 2, 6, 2) * .2 - Math.max(0, 1 - Z / 2.5) * .15; if (Math.abs(X - .4) < .9 && frac(X * 6) * k / 6 < 1) t -= .25; if (Math.abs(X - .4) < .9 && frac(Z * 3) < .12) t -= .2; return t; });
  // Rauch fließt aus der Klappe und läuft nach links über den Boden, ein flaches Band
  const yr = yw + 6;
  rauchFaellt(K, 3, -M, yw - 22, sx + 6, yw + 34, (x, y) => { const q = (sx - x) / (sx + 30); const top = yr - 16 + q * 12, bot = yr + 8 + q * 18; if (y < top || y > bot) return 0; return Math.min(1, (y - top) / 6) * Math.min(1, (bot - y) / 5) * (1 - q * .55) * (x > sx - 14 ? (yw + 2 - y) > 0 ? 1 : .5 : 1); }, null);
  // Kohlenhaufen und Schaufel vorne rechts, Kesselmann heizt hier
  const kh = B.maske(); kh.poly([[350, 236], [372, 214], [392, 206], [416, 210], [450, 236]]); for (let i = 0; i < 9; i++) kh.ell(360 + i * 9, 222 - Math.sin(i * .7) * 6, 5, 4);
  K.form(4, kh, 0, { k: ['#030303', '#070707', '#0d0e0c', '#161814'], ton: 1.2, fase: 1, rand: 2, muster: (px, py) => (B.hash(px >> 1, py >> 1, 4) - .5) * .6 });
  const sch = B.maske(); sch.kap(404, 170, 420, 222, 1.2, 1.2); sch.poly([[414, 220], [426, 216], [432, 232], [418, 236]]); K.form(4, sch, 0, Object.assign({ ton: 1.4, fase: 0 }, MET));
  // Käfiglampen an der Wand
  for (const [x, y, an] of [[96, 70, fr < .7], [310, 66, fr < .9]]) { const m = B.maske(); m.rect(x - 1, y - 8, 3, 6); m.ell(x, y, 4, 5); m.ell(x, y, 2.6, 3.6, 0); K.form(1, m, 0, Object.assign({ ton: 1.4, fase: 0, rand: 1 }, MET)); if (an) { K.e[1].set(x, y, B.pk(NAT_K)); K.e[1].set(x, y + 1, B.pk(NAT)); K.glut(x, y, 46, NAT_G, 1, [0, 1]); K.licht(x, y, NAT, 46, .8); } }
  B.nebel(K.e[3], { y0: yw - 70, y1: yw + 10, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .22, xs: [20, 400, 60], seed: 4 });
  // Vordergrund: Rohr senkrecht links, Geländer unten
  const v = B.maske(); v.kap(14, -M, 14, H + M, 7, 7); for (let y = 20; y < H; y += 46) v.rect(4, y, 21, 4);
  v.rect(-M, 240, W + 2 * M, 3); for (let x = 40; x < W; x += 60) v.rect(x, 240, 3, 40);
  K.form(5, v, 0, { k: ['#020302', '#050806', '#0a110d', '#121c16'], ton: 1, fase: 2, rand: 2 });
  B.partikel(K, { n: 40, farben: ['#3a3c2c', '#525036'], vx: -2, vy: -4, wob: 4, wf: .4, x0: 0, x1: 480, y0: 0, y1: 200 });
  K.reihen = [{ y: 176, skala: .9, nebel: .3 }, { y: 196, skala: 1, nebel: .12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [230, 210], yw, sx };
}

// =====================================================================
// Variante 2: Der Hof. Der Schornstein steht rechts der Mitte, groß; sein Rauch fällt an ihm herab
// und breitet sich als flaches Band aus. Links die Fassade mit grün erleuchteten Fenstern.
function hof(K) {
  const fr = K.fr, P = B.persp(200, 160); K.split = [176, 186];
  // Himmel: Natriumdunst unten, oben schwarz, wenige Sterne
  B.feld(K.e[0], -M, -M, W + M, H + M, HOF, (x, y) => .05 + Math.max(0, (y + 40) / 260) * .75 + Math.max(0, 1 - Math.hypot((x - 450) / 140, (y - 40) / 120)) * .3);
  B.sterne(K.e[0], K.r, 40, 220, -M, W + M, 60, ['#3a3420', '#5a5030']);
  // Ferne: Dächer der Stadt, flach
  const fm = B.maske(); let hx = 230; while (hx < W + M) { const w = 14 + K.r.i(0, 20), h = 6 + K.r.i(0, 14); fm.rect(hx, P.vy - h, w, h + 2); if (K.r.ja(.4)) fm.poly([[hx, P.vy - h], [hx + w / 2, P.vy - h - 6], [hx + w, P.vy - h]]); hx += w + K.r.i(0, 4); }
  K.form(1, fm, .6, { ton: 1, fase: 0, rand: 1 });
  // Fassade links in Flucht: Fenster grün erleuchtet (innen Kacheln), eins pro Achse
  const Xf = -2.2, Zf0 = 1.1, Zf1 = 9, Yf = 3.3;
  const fass = B.maske(); fass.poly([P.q(Xf, Yf, Zf0), P.q(Xf, Yf, Zf1), P.q(Xf, 0, Zf1), P.q(Xf, 0, Zf0)]); fass.poly([P.q(Xf, Yf, Zf1), P.q(Xf - .6, Yf + .7, Zf1 + .4), P.q(Xf - .6, Yf + .7, Zf0), P.q(Xf, Yf, Zf0)]);
  K.form(2, fass, .05, { k: ZIEGEL, ton: 1.3, fase: 1, rand: 2, muster: (px, py) => (py % 3 === 0 ? -.3 : 0) });
  for (let Z = 1.4; Z < Zf1 - .4; Z += .9) for (const [Y0, Y1] of [[.7, 1.45], [1.95, 2.7]]) {
    const m = B.maske(); m.poly([P.q(Xf, Y1, Z), P.q(Xf, Y1, Z + .42), P.q(Xf, Y0, Z + .42), P.q(Xf, Y0, Z)]); m.kap(...P.q(Xf, Y1, Z + .21), ...P.q(Xf, Y0, Z + .21), .6, .6, 0); m.kap(...P.q(Xf, (Y0 + Y1) / 2, Z), ...P.q(Xf, (Y0 + Y1) / 2, Z + .42), .6, .6, 0);
    const an = fr < .6 || B.hash(Math.round(Z * 10), Y0 * 10, 3) > fr * .8;
    B.form(K.e[Z < 2.5 ? 3 : 2], m, K.mat(0, { k: an ? ['#08140c', '#0e2a18', '#184426', '#2a6038', '#4a7a40'] : KALK, ton: an ? 1.6 : .6, verlauf: an ? .8 : 0, fase: 0, rand: 0, muster: (px, py) => (B.hash(px, py >> 1, 2) - .5) * .5 }));
    if (an) K.glut(...P.q(Xf + .4, (Y0 + Y1) / 2, Z + .25), P.k(Z) * .7, '#0e2a14', .7, [2, 3]);
  }
  // Ladetor mit Paletten voller Dosentürme
  const [gx0, gy0] = P.q(Xf, 1.6, 7.2), [gx1, gy1] = P.q(Xf, 0, 8.3); const tor = B.maske(); tor.poly([[gx0, gy0], [gx1, P.q(Xf, 1.6, 8.3)[1]], [gx1, gy1], [gx0, P.q(Xf, 0, 7.2)[1]]]);
  B.form(K.e[2], tor, K.mat(0, { k: ['#1c1a0c', '#3a3214', '#5a4a1a', '#7a6420'], ton: 1.2, fase: 0, rand: 0 }));
  for (const [X, Z, n] of [[-1.5, 6.4, 4], [-1.6, 5.2, 3], [-1.3, 3.9, 5]]) { const [x, y] = P.q(X, 0, Z), k = P.k(Z); const pm = B.maske(); pm.rect(x - k * .45, y - k * .08, k * .9, k * .08); K.form(K.eb(y), pm, 0, { k: KALK, ton: 1.8, fase: 0 }); dosenturm(K, K.eb(y), x, Math.round(y - k * .08), Math.max(3, Math.round(k * .12)), n, Math.min(.5, Z / 16)); }
  // Gleis: kommt von rechts unten und läuft zum Ladetor
  const gl = [];
  for (let s = 0; s <= 1; s += .004) { const Z = 1 + s * 6.4, X = 3.2 - s * 4.5 + Math.sin(s * 2) * .3; gl.push([X, Z]); }
  // Boden: nasses Pflaster mit Pfützen, die die Lampe spiegeln
  const lampX = 3.4, lampZ = 3.6;
  K.boden(P.vy, H + M, BODEN, (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z) * .35; let t = .38 + (B.hash(Math.floor(X * 3 + (Math.floor(Z * 4) & 1) * .5), Math.floor(Z * 4), 5) - .5) * .2; const fx = frac(X * 3 + (Math.floor(Z * 4) & 1) * .5), fz = frac(Z * 4); if (fx * k < .8 || fz * k * k / P.h * 4 < .6) t -= .2; const pf = B.fbm(X * .9, Z * .7, 13, 3); if (pf > .58) { t = .22 + (Math.abs(X - lampX) < .4 + (Z - lampZ) * .05 && Z > lampZ ? .6 : 0) + (B.hash(x, y, 1) > .9 ? .2 : 0); } return t; });
  const sch = B.maske(); for (const off of [-.28, .28]) for (let i = 0; i + 1 < gl.length; i += 1) { const a = P.q(gl[i][0] + off, 0, gl[i][1]), b = P.q(gl[i + 1][0] + off, 0, gl[i + 1][1]); sch.kap(a[0], a[1], b[0], b[1], Math.max(.5, P.k(gl[i][1]) * .02), Math.max(.5, P.k(gl[i][1]) * .02)); }
  for (let i = 0; i < gl.length; i += 12) { const a = P.q(gl[i][0] - .45, 0, gl[i][1]), b = P.q(gl[i][0] + .45, 0, gl[i][1]); B.linie(K.e[K.eb(a[1])], a[0], a[1], b[0], b[1], B.pk(BODEN[0])); }
  for (const eb of [2, 3, 4]) { const part = B.maske(); for (let y = 0; y < H + M; y++) for (let x = -M; x < W + M; x++) if (sch.has(x, y) && K.eb(y) === eb) part.put(x, y, 1), part._grow(x, y, x, y); K.form(eb, part, 0, { k: ROST, ton: 2.8, fase: 0, rand: 1 }); }
  // Güterwagen am Gleisende, vor dem Tor
  { const [x0, y0] = P.q(-.4, 1.5, 7.4), [x1, y1] = P.q(.8, 0, 7.4), m = B.maske(); m.rect(x0, y0, x1 - x0, y1 - y0 - 2); m.poly([[x0 - 1, y0], [(x0 + x1) / 2, y0 - 4], [x1 + 1, y0]]); for (const xx of [x0 + 3, x1 - 3]) m.ell(xx, y1 - 1, 2.5, 2.5); K.form(2, m, .1, { k: ROST, ton: 1.4, fase: 1, rand: 2, muster: (px) => (Math.round(px) % 3 === 0 ? -.3 : 0) }); }
  // Der Schornstein: groß, rechts der Mitte; Rauch fällt außen herab und breitet sich am Boden aus
  const sx = 336, sBot = P.q(0, 0, 5)[1];
  const sTop = 22, innen = y => 8 + Math.max(0, (y - sTop) / (sBot - sTop)) * 7;
  rauchFaellt(K, 1, sx - 150, sTop - 8, sx + 150, sBot + 16, ueberlauf(sx, sTop, sBot, 8, 15), null);
  schornstein(K, 2, sx, sTop, sBot, 16, 30, 0);
  const sk = B.maske(); sk.rect(sx - 24, sBot - 8, 48, 10); K.form(2, sk, 0, { k: ZIEGEL, ton: 1.5, fase: 1, rand: 2 });
  // Schleier vor dem Schornstein: Rauch, der über die Vorderseite herabläuft
  rauchFaellt(K, 2, sx - 22, sTop - 6, sx + 22, sBot + 16, (x, y) => { const d = Math.abs(x - sx), i = innen(y); if (y < sTop - 5) return 0; if (y < sTop + 1) return d < 14 ? 1 : 0; if (d >= i + 1) return 0; const s2 = B.rausch1(x * .35, 77); return s2 > .55 ? (s2 - .55) * 2.2 * (1 - Math.max(0, (y - 20)) / (sBot * 1.4)) : 0; }, null);
  rauchFaellt(K, 3, sx - 160, sBot - 18, sx + 160, sBot + 22, (x, y) => { const d = Math.abs(x - sx) / 150, v = (y - (sBot - 10)) / 22; return Math.max(0, 1 - d) * Math.max(0, 1 - Math.abs(v - .5) * 2) * .9; }, null);
  // Natriumlampe am Mast rechts oben: das Gegenlicht
  const [mx, my] = [452, 26], mast = B.maske(); mast.kap(mx + 8, my, mx + 10, 200, 1.6, 2.2); mast.kap(mx - 10, my - 2, mx + 9, my, 1, 1); mast.poly([[mx - 18, my], [mx - 4, my], [mx - 7, my + 5], [mx - 15, my + 5]]);
  K.form(3, mast, 0, Object.assign({ ton: 1.3, fase: 0, rand: 1 }, MET));
  K.e[3].set(mx - 11, my + 5, B.pk(NAT_K)); K.e[3].set(mx - 10, my + 5, B.pk(NAT)); K.e[3].set(mx - 12, my + 5, B.pk(NAT));
  for (const i of [1, 2, 3, 4]) B.kegel(K.e[i], mx - 11, my + 6, Math.PI / 2 + .25, .45, 230, NAT_G2, .55);
  K.glut(mx - 11, my + 4, 60, NAT_G, 1, [0, 1, 2, 3]); K.licht(mx - 11, my + 5, NAT, 120, 1);
  B.nebel(K.e[2], { y0: P.vy - 30, y1: P.vy + 14, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .25, xs: [150, 470, 60], seed: 6 });
  // Vordergrund: Zaunpfosten und Fass links unten, Kante einer Palette rechts
  const v = B.maske(); v.rect(-M, 120, 9, 160); v.rect(-M, 130, 30, 3); v.rect(-M, 170, 30, 3); v.poly([[18, 250], [22, 214], [48, 214], [52, 250], [52, H + M], [18, H + M]]); v.poly([[440, 246], [W + M, 240], [W + M, H + M], [436, H + M]]);
  K.form(5, v, 0, { k: ['#020302', '#050806', '#0a110d', '#121c16'], ton: 1, fase: 2, rand: 2 });
  B.partikel(K, { n: 30, farben: ['#3e3c2c', '#525036'], vx: -1, vy: 6, wob: 3, wf: .4, x0: 280, x1: 420, y0: 0, y1: 170 });
  K.reihen = [{ y: 182, skala: .9, nebel: .3 }, { y: 199, skala: 1, nebel: .12 }, { y: 215, skala: 1, nebel: 0 }];
  return { mitte: [230, 210] };
}

// =====================================================================
// Wächter: Am Hauptband. Frontal, drei sehr hohe Fenster; im mittleren steht der Schornstein nah,
// der Rauch fällt außen an der Scheibe herab. Ein langes Band hinter der Schicht, Lampen tief gehängt.
function hauptband(K) {
  const fr = K.fr, P = B.persp(240, 152), Zw = 5.5; K.split = [168, 180];
  const yw = P.q(0, 0, Zw)[1];
  const fen = [[52, 150], [196, 300], [348, 432]], fy0 = 8, fy1 = 118;
  const inF = (x, y) => fen.some(([a, b]) => x > a && x < b && y > fy0 + Math.max(0, 1 - ((x - a) / (b - a) - .5) ** 2 * 4) * -0 && y < fy1 && (y > fy0 + 14 || Math.hypot((x - (a + b) / 2) / ((b - a) / 2), (y - fy0 - 14) / 14) < 1));
  hofDraussen(K, 250, 40, 140, 30, inF);
  // Wand mit den Fensteröffnungen (Rundbogen oben), Kacheln unten
  const wm = B.maske(); wm.rect(-M, -M, W + 2 * M, yw + M + 1); wm.fn(-M, -M, W + M, yw, inF, 0);
  K.form(1, wm, .08, { k: KALK, ton: 1.4, fase: 2, verlauf: -.4, schatten: 2, muster: (x, y) => (y > fy1 + 10 ? (((x + 2) % 10 === 0 || (y - fy1) % 7 === 0) ? -.4 : .2) : B.fbm(x * .05, y * .04, 3, 2) * .4 - .2) });
  fen.forEach(([a, b]) => { sprossen(K, 1, a + 2, fy0 + 16, b - 2, fy1 - 2, 4, 5, .05); const lb = B.maske(); lb.rect(a - 4, fy1, b - a + 8, 5); K.form(1, lb, 0, { k: KALK, ton: 2.6, fase: 1, rand: 2 }); for (const i of [2, 3]) B.kegel(K.e[i], (a + b) / 2, fy1 - 20, Math.PI / 2 + .45, .35, 170, NAT_G2, .4); });
  // Boden: Fliesen frontal, nass
  fliesen(K, P, yw - 1, [[-2, 2.6, 1], [0, 2.6, 1], [2, 2.6, 1]]);
  // Langes Band quer hinter dem Wächter, mit Dosen in gleichen Abständen
  const Zb = 3.4, [bx0, by0] = P.q(-9, .48, Zb), [, by1] = P.q(0, .36, Zb), [, byF] = P.q(0, 0, Zb);
  const bm = B.maske(); bm.rect(-M, by0, W + 2 * M, by1 - by0); for (let x = 6; x < W + M; x += 44) bm.rect(x, by1, 3, byF - by1);
  K.form(3, bm, .06, Object.assign({ ton: 1.5, fase: 1, rand: 2, muster: (x, y) => (y === Math.round(by0) + 1 && x % 6 === 0 ? -.5 : 0) }, MET));
  for (let x = 4; x < W; x += 15) dose(K, 3, x, Math.round(by0), 5, .08);
  void bx0;
  // Lampen tief über dem Band, eine pro Platz
  for (let i = 0; i < 6; i++) { const x = 30 + i * 84, an = fr < .6 || i % 2 === 0; haengelampe(K, 3, x, Math.round(by0 - 34), 5, an, 0); if (an) lampenLicht(K, x, Math.round(by0 - 34), 5, by0, [3]); }
  B.nebel(K.e[2], { y0: yw - 50, y1: yw + 8, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .25, xs: [30, 450, 60], seed: 8 });
  const v = B.maske(); v.rect(-M, -M, 24, H + 2 * M); v.rect(460, -M, 40, H + 2 * M); v.rect(-M, -M, W + 2 * M, 6);
  K.form(5, v, 0, { k: ['#020302', '#050806', '#0a110d', '#121c16'], ton: 1, fase: 2, rand: 2, muster: (x, y) => ((y % 7 === 0 || (x + 3) % 10 === 0) ? -.4 : 0) });
  B.partikel(K, { n: 40, farben: ['#3a3c2c', '#525036'], vx: -2, vy: -2, wob: 4, wf: .3, x0: 0, x1: 480, y0: 0, y1: 200 });
  K.reihen = [{ y: 180, skala: .9, nebel: .3 }, { y: 198, skala: 1, nebel: .12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 212] };
}

// ---------- Zusätze je Art ----------
// Krämerin: Spinde im Umkleideraum, einer offen, darin die Ware; eine Glühbirne darüber
function spinde(K, x, y) {
  const m = B.maske(); for (let i = 0; i < 4; i++) { const sx = x - 44 + i * 22; m.rect(sx, y - 70, 20, 70); }
  m.rect(x - 2, y - 68, 16, 66, 0);
  K.form(4, m, 0, { k: BLECH, ton: 1.3, fase: 1, rand: 2, schatten: 2, muster: (px, py) => (((px - x + 44) % 22 === 10 || (py - y + 70) % 9 === 3) && (px - x + 44) % 22 > 3 ? -.4 : 0) });
  const tuer = B.maske(); tuer.poly([[x + 14, y - 70], [x + 26, y - 66], [x + 26, y - 4], [x + 14, y]]); K.form(4, tuer, 0, { k: BLECH, ton: 1.8, fase: 1, rand: 2 });
  const innen = B.maske(); innen.rect(x - 2, y - 68, 16, 66); B.form(K.e[4], innen, K.mat(0, { k: ['#0a0805', '#1a140a', '#2c2210', '#3e3014'], ton: 1, fase: 0, rand: 0, verlauf: .6 }));
  const ware = B.maske(); ware.rect(x, y - 50, 12, 2); ware.rect(x, y - 30, 12, 2); dose(K, 4, x + 3, y - 50, 4, 0); dose(K, 4, x + 9, y - 50, 4, 0); ware.ell(x + 6, y - 38, 4, 7); ware.kap(x + 2, y - 62, x + 10, y - 56, 1, 1);
  K.form(4, ware, 0, { k: ROST, ton: 2, fase: 0, rand: 1 });
  haengelampe(K, 4, x + 6, y - 92, 5, true, 0, -M); K.glut(x + 6, y - 60, 60, NAT_G, 1, [3, 4]);
}
// Ereignis/Fund: eine offene Dose am Boden, der Deckel aufgerollt, innen trüber Schein
function offeneDose(K, x, y) {
  const m = B.maske(); m.rect(x - 9, y - 18, 18, 18); m.ell(x, y, 9, 2.5); K.form(4, m, 0, { k: BLECH, ton: 2, fase: 1, rand: 2, schatten: 2 });
  const o = B.maske(); o.ell(x, y - 18, 9, 3); B.form(K.e[4], o, K.mat(0, { k: ['#1e2a1e', '#3a5a40', '#5a8a62', '#8ab890'], ton: 1.8, fase: 0, rand: 0 }));
  const rl = B.maske(); rl.ell(x + 10, y - 22, 3.5, 3.5); rl.kap(x + 12, y - 24, x + 18, y - 28, .8, .8); rl.ell(x + 19, y - 29, 2, 2); K.form(4, rl, 0, { k: BLECH, ton: 2.2, fase: 0, rand: 2 });
  K.e[4].set(x - 1, y - 9, B.pk(ROST[5])); K.e[4].set(x + 1, y - 9, B.pk(ROST[5]));
  K.glut(x, y - 22, 26, '#0e2a18', 1, [3, 4]); K.licht(x, y - 20, '#8ab890', 30, .7);
}
// Übergang: Bodenablauf im Kesselhaus offen, Eisenleiter nach unten in grünes Licht; der Rauch fließt hinein
function abstieg(K, x, y) {
  const m = B.maske(); m.ell(x, y, 46, 12); B.form(K.e[4], m, K.mat(0, { k: ['#000000', '#020403', '#06100a', '#0a1a10'], ton: 0, rand: 0, fase: 0, verlauf: 1.6 }));
  const rr = B.maske(); rr.ell(x, y, 50, 14); rr.ell(x, y, 46, 12, 0); K.form(4, rr, 0, { k: ROST, ton: 2.2, fase: 0, rand: 2 });
  const le = B.maske(); le.kap(x - 10, y - 30, x - 8, y + 10, 1.2, 1.2); le.kap(x + 10, y - 30, x + 8, y + 10, 1.2, 1.2); for (let k = 0; k < 6; k++) le.rect(x - 9, y - 26 + k * 6, 18, 1.5);
  K.form(4, le, 0, { k: ROST, ton: 2.4, fase: 0, rand: 1 });
  K.glut(x, y + 6, 50, '#0c3a20', 1, [3, 4]); K.licht(x, y, '#6ae0a0', 60, .8);
  const g = B.glanzSprite(30, '#0c3a20', .6);
  K.anim.push({ p: .5, f(ctx, t, ox, oy) { if (Math.sin(t * .6) < -.3) return; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, x - g.R + ox, y + 4 - g.R + oy); ctx.globalCompositeOperation = 'source-over'; } });
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante, info;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'kraemer' ? 0 : art === 'rast' || art === 'uebergang' ? 1 : art === 'ereignis' || art === 'fund' ? 0 : (o.seed + v) % 3;
  if (art === 'waechter') info = hauptband(K);
  else info = [k => packhalle(k, { ohneTurm: art === 'kraemer' }), kesselhaus, hof][v](K, {});
  if (art === 'kraemer') spinde(K, 300, 206);
  else if (art === 'ereignis' || art === 'fund') offeneDose(K, info.mitte[0], info.mitte[1]);
  else if (art === 'uebergang') abstieg(K, 236, 214);
  else B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.fabrik = { pal, build: bauen, reliefStil: { figuren: 6, gelenke: 2, knick: .2, grossX: 112 } };
})();
