// Saltmoor 1925 · Hintergründe: Akt 4, Das schwarze Eis (vor dem Leben an Land).
// Komposition: docs/auftrag/hintergruende-kompositionen.md
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#030508', '#070c14', '#0e1624', '#18243a'], rand: ['#5a8ab0', '#e8f6ff'], augen: '#ff4a4a', nebel: ['#060a12', '#1a2a40'] };
const EIS = ['#020306', '#04070c', '#070c16', '#0b1422', '#111e32', '#1a2a44', '#26405e', '#3a5a80', '#5a80a8'];
const FELS = ['#030406', '#06080c', '#0a0e14', '#10161e', '#18202c'];
const UMRISS = ['#0c2a36', '#15485a', '#2a7088', '#5ab0c8'];

// Der Umriss unter dem Eis: immer an derselben Stelle des Bildes (nicht vom Seed abhängig)
const UM = { x: 250, y: 214 };
function umrissMaske() {
  const m = B.maske(), cx = UM.x, cy = UM.y, pts = [];
  // langer Leib mit Rücken aus Türmen, ein Ende rund mit Ringen
  for (let i = 0; i <= 40; i++) { const q = i / 40, x = cx - 190 + q * 380, y = cy - 6 + Math.sin(q * 3.2 + .4) * 14 - Math.sin(q * Math.PI) * 22; pts.push([x, y - (8 + Math.sin(q * Math.PI) * 26)]); }
  for (let i = 40; i >= 0; i--) { const q = i / 40, x = cx - 190 + q * 380, y = cy - 6 + Math.sin(q * 3.2 + .4) * 14 - Math.sin(q * Math.PI) * 22; pts.push([x, y + 10 + Math.sin(q * Math.PI) * 20]); }
  m.poly(pts);
  for (const [q, h, w, kn] of [[.21, 22, 7, .5], [.29, 40, 9, -.3], [.44, 52, 12, .4], [.47, 30, 6, -.6], [.6, 58, 11, .2], [.7, 30, 8, .8], [.77, 18, 6, -.2]]) { const x = cx - 190 + q * 380, yb = cy - 6 + Math.sin(q * 3.2 + .4) * 14 - Math.sin(q * Math.PI) * 22 - (8 + Math.sin(q * Math.PI) * 26); m.poly([[x - w, yb + 4], [x - w * .6 + kn * 3, yb - h * .45], [x - w * .2 + kn * 9, yb - h * .85], [x + kn * 14, yb - h], [x + w * .25 + kn * 8, yb - h * .7], [x + w * .55 + kn * 2, yb - h * .35], [x + w * 1.1, yb + 4]]); }
  m.ell(cx + 172, cy - 18, 34, 26);
  return m;
}
function umriss(K, staerke, sichtbar) {
  const m = umrissMaske(), s = staerke * (1 + K.fr * .4), P = UMRISS.map(B.pk);
  for (let y = Math.max(m.y0 - 3, -M); y <= Math.min(m.y1 + 3, H + M - 1); y++) {
    const e = K.e[K.eb(y)];
    for (let x = Math.max(m.x0 - 3, -M); x <= Math.min(m.x1 + 3, W + M - 1); x++) {
      if (sichtbar && !sichtbar(x, y)) continue;
      const inn = m.has(x, y); let rand = false;
      if (inn) rand = !m.has(x + 1, y) || !m.has(x - 1, y) || !m.has(x, y - 1) || !m.has(x, y + 1) || !m.has(x + 2, y) || !m.has(x, y - 2);
      const tief = B.fbm(x * .035, y * .06, 61, 3), sicht = Math.max(0, tief - .38) * 2.4;
      if (rand && s * sicht > B.bay(x, y) * 1.1) e.set(x, y, P[s * sicht > 1.1 ? 2 : 1]);
      else if (inn && s * sicht * .18 > B.bay(x, y)) e.set(x, y, P[0]);
      else if (inn && Math.hypot(x - UM.x - 172, y - UM.y + 18) < 20 && ((Math.round(Math.hypot(x - UM.x - 172, y - UM.y + 18)) % 6) === 0) && s > B.bay(x, y)) e.set(x, y, P[1]);
    }
  }
  K.glut(UM.x, UM.y - 10, 150, '#06141c', .6 * s, [2, 3, 4]);
  K.licht(UM.x, UM.y - 10, '#2a7088', 150, .4 * s);
}
// Eisfläche mit Rissen als Fluchtlinien
function eisBoden(K, P, y0, o) {
  o = o || {}; const sd = K.o.seed;
  K.boden(y0, H + M, EIS, (x, y) => {
    const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z), f = 1 - (y - P.vy) / P.h;
    if (o.nur && !o.nur(X, Z, x, y)) return -1;
    let t = .16 + Math.pow(f, 4) * .45 + (B.fbm(X * .4, Z * .5, sd, 3) - .5) * .12;
    const glanz = Math.max(0, 1 - Math.abs(x - (o.glanzX || 360)) / 40) * Math.pow(f, 2) * .3; t += glanz * (Math.sin(y * 1.1) > 0 ? 1 : .4);
    for (let i = 0; i < 9; i++) { const Xr = (i - 4) * 1.7 + Math.sin(Z * .7 + i * 2.1) * .5 + Math.sin(Z * 2.3 + i) * .12; if (Math.abs(X - Xr) * k < .6) { t = .58 + f * .2; break; } if (Math.abs(X - Xr) * k < 1.6 && X > Xr) t -= .06; }
    if (B.hash(x, y, 4) > .992) t += .3;
    return t;
  });
}
// gefrorene Welle (Querschnitt): Anstieg, überhängender Kamm, Röhre
function welle(K, eb, x, yb, w, h, tiefe, o) {
  o = o || {}; const m = B.maske(), pts = [], n = 30, d = o.dir || 1;
  for (let i = 0; i <= n; i++) { const q = i / n, xx = x + d * q * w * .78, yy = yb - h * Math.pow(Math.sin(q * Math.PI / 2), 1.6); pts.push([xx, yy]); }
  for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + i / 12 * Math.PI * 1.15, cx = x + d * w * .78, cy = yb - h * .72; pts.push([cx + d * Math.cos(a) * w * .2, cy + Math.sin(a) * h * .28]); }
  pts.push([x + d * w * .82, yb - h * .5], [x + d * w * .7, yb - h * .3], [x + d * w * .9, yb - h * .12], [x + d * w, yb]);
  m.poly(pts);
  K.form(eb, m, tiefe, { k: EIS.slice(1, 8), r: pal.rand, ton: 1.6, fase: Math.max(1, h * .05), verlauf: 1.2, muster: (px, py) => (Math.sin((px * d) * .25 + py * .4) > .7 ? .5 : 0) + (B.hash(px, py >> 1, 9) - .5) * .25, schatten: 2 });
  // Narbe im Eis: dort stand der Kamm vorher
  if (o.narbe) { const e = K.e[eb], c = B.pk(B.mix(EIS[7], K.fern, tiefe)); for (let i = 0; i < w * .5; i++) { const xx = x + d * (w * .62 - o.narbe - i * .3), yy = yb - h * .95 + i * .5 + Math.sin(i) * .5; e.set(xx, yy, c); } }
}
function decke(K, y1) {
  const sd = K.o.seed;
  B.feld(K.e[0], -M, -M, W + M, y1, FELS, (x, y) => .2 + y / y1 * .45 + (B.fbm(x * .02, y * .06, sd, 3) - .5) * .3);
  // fahle Spalte in der Decke oben rechts: Quelle des kalten Randlichts
  B.dith(K.e[0], 340, -M, W + M, 30, '#3a5a80', (x, y) => Math.max(0, 1 - Math.abs(y - 6 - (x - 340) * .04) / 6) * Math.max(0, 1 - Math.abs(x - 430) / 110) * .9);
  B.dith(K.e[0], 380, -M, W + M, 20, '#8ab0d0', (x, y) => Math.max(0, 1 - Math.abs(y - 6 - (x - 340) * .04) / 2.5) * Math.max(0, 1 - Math.abs(x - 430) / 60) * .7);
  B.gluehen(K.e[0], 430, 10, 110, '#0e1a2a', .9);
}

// =====================================================================
// Variante 0: Eisfeld, Aufsicht, gefrorene Brecher rechts hinten
function eisfeld(K) {
  const fr = K.fr, P = B.persp(310, 96); K.split = [130, 150];
  decke(K, 100);
  B.feld(K.e[1], -M, 60, W + M, 98, EIS, (x, y) => .55 + (y - 60) / 40 * .25);
  eisBoden(K, P, 96);
  umriss(K, .7);
  // Reihe gefrorener Brecher rechts hinten, verschieden weit gebrochen
  [[300, 100, 60, 26, .5], [350, 103, 80, 36, .4], [420, 108, 90, 46, .3], [470, 114, 80, 40, .22]].forEach(([x, yb, w, h, t], i) => welle(K, K.eb(yb) === 2 ? (t > .35 ? 1 : 2) : 2, x, yb, w, h, t, { narbe: i === 2 ? 10 + fr * 10 : 0 }));
  // links flache Schollen mit Kanten
  for (const [x, y, w] of [[60, 112, 50], [150, 106, 34]]) { const m = B.maske(); m.poly([[x - w, y], [x - w * .7, y - 6], [x + w * .5, y - 7], [x + w, y]]); K.form(2, m, .3, { k: EIS.slice(1, 8), r: pal.rand, ton: 1.6, fase: 1 }); }
  B.nebel(K.e[2], { y0: 80, y1: 140, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .26, xs: [20, 460, 60], seed: 3 });
  const v = B.maske(); welle(K, 5, 486, H + 4, 90, 70, 0, { dir: -1 }); void v;
  B.partikel(K, { n: 50, farben: ['#3a5a80', '#8ab0d0', '#e8f6ff'], vx: -4, vy: 6, wob: 4, wf: .4, hellSelten: 2.5 });
  K.reihen = [{ y: 160, skala: .9, nebel: .3 }, { y: 188, skala: 1, nebel: .12 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [240, 206] };
}

// Variante 1: gefrorene Brandung, wir stehen im Wellental
function brandung(K) {
  const fr = K.fr, P = B.persp(300, 140); K.split = [150, 160];
  decke(K, 144);
  B.feld(K.e[1], -M, 100, W + M, 142, EIS, (x, y) => .5 + (y - 100) / 42 * .3);
  eisBoden(K, P, 140, { glanzX: 330 });
  umriss(K, .8);
  welle(K, 1, 330, 142, 70, 26, .45, {}); welle(K, 1, 390, 144, 80, 30, .4, { narbe: 8 + fr * 8 }); welle(K, 2, 440, 150, 100, 46, .25, {});
  B.nebel(K.e[2], { y0: 90, y1: 152, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .26, xs: [100, 470, 60], seed: 4 });
  welle(K, 3, -40, 150, 250, 132, .05, {});
  welle(K, 5, -60, H + 10, 200, 150, 0, {});
  B.partikel(K, { n: 50, farben: ['#3a5a80', '#8ab0d0', '#e8f6ff'], vx: -4, vy: 6, wob: 4, wf: .4, hellSelten: 2.5 });
  K.reihen = [{ y: 164, skala: .9, nebel: .3 }, { y: 190, skala: 1, nebel: .12 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [260, 206] };
}

// Variante 2: Lager der Expedition (letztes menschliches Licht)
function lager(K, o) {
  o = o || {}; const fr = K.fr, P = B.persp(250, 118); K.split = [138, 152];
  decke(K, 122);
  B.feld(K.e[1], -M, 80, W + M, 120, EIS, (x, y) => .5 + (y - 80) / 40 * .3);
  welle(K, 1, 30, 120, 80, 20, .5, {}); welle(K, 1, 120, 121, 60, 16, .5, {});
  eisBoden(K, P, 118, { glanzX: 140 });
  if (o.loch) {
    const lm = B.maske(); lm.ell(250, 196, 90, 26); B.form(K.e[4], lm, K.mat(0, { k: ['#000000', '#010203', '#02040a', '#04081a'], r: pal.rand, ton: .4, fase: 2, L: [.2, -1] }));
    K.glut(250, 200, 60, '#0a1830', .8, [4]);
  } else umriss(K, .85);
  // Stangen mit Führungsseil, ungleiche Abstände, einige umgefallen
  const st = [[-2.2, 2.6], [-1.8, 3.6], [-1.1, 5.4], [-.4, 7.9], [.2, 11], [.6, 16], [1.1, 24]], pos = [];
  for (const [X, Z] of st) { const k = P.k(Z), [x, y] = P.q(X, 0, Z), um = B.hash(Math.round(Z * 10), 0, 3) < .25 + fr * .3; const m = B.maske(); if (um) m.kap(x, y, x + k * .9, y - k * .15, Math.max(.6, k * .03), .5); else { m.kap(x, y, x + k * .03, y - k * 1.3, Math.max(.6, k * .03), Math.max(.5, k * .02)); pos.push([x + k * .03, y - k * 1.2, um]); } if (!um && Z < 12) m.poly([[x + k * .03, y - k * 1.3], [x + k * .4, y - k * 1.2], [x + k * .03, y - k * 1.1]]); K.form(K.eb(y), m, Math.min(.5, Z / 40), { ton: 1.6, fase: 0, rand: 1 }); }
  for (let i = 0; i + 1 < pos.length; i++) { const [x0, y0] = pos[i], [x1, y1] = pos[i + 1], e = K.e[K.eb(y1 + 20)]; for (let q = 0; q <= 1; q += .02) e.set(B.lerp(x0, x1, q), B.lerp(y0, y1, q) + Math.sin(q * Math.PI) * 4, B.pk(EIS[6])); }
  // Zelt mit Laterne, Schlitten eingefroren
  const [zx, zy] = P.q(2.4, 0, 4.2), zk = P.k(4.2), zm = B.maske();
  zm.poly([[zx - zk * 1.1, zy], [zx - zk * .1, zy - zk * 1.2], [zx + zk * .9, zy - zk * 1.1], [zx + zk * 1.4, zy]]); zm.kap(zx - zk * .1, zy - zk * 1.2, zx - zk * .1, zy - zk * 1.45, 1, 1);
  K.form(K.eb(zy), zm, 0, { k: ['#05080c', '#0c121a', '#161e28', '#222c38'], r: pal.rand, ton: 1.6, fase: 2, verlauf: .4, schatten: 2 });
  const ein = B.maske(); ein.poly([[zx - zk * .4, zy], [zx - zk * .1, zy - zk * .8], [zx + zk * .2, zy]]);
  if (fr < .75) { B.form(K.e[K.eb(zy)], ein, { k: ['#3a2410', '#6a4418', '#a0702a'].map(B.pk), ton: 1.2, rand: 0, fase: 0, verlauf: 1 }); K.glut(zx - zk * .1, zy - zk * .3, 70, '#3a2408', 1, [2, 3, 4]); K.licht(zx, zy - zk * .3, '#ffb060', 70, .8); B.flamme(K, Math.round(zx - zk * .1), Math.round(zy - 3), { p: .3 }); }
  else B.form(K.e[K.eb(zy)], ein, { k: ['#000000', '#020304'].map(B.pk), ton: .5, rand: 0, fase: 0 });
  const [sx, sy] = P.q(-3.2, 0, 3.4), sk = P.k(3.4), sm = B.maske();
  sm.rect(sx - sk * .9, sy - sk * .45, sk * 1.8, sk * .25); sm.kap(sx - sk * 1.0, sy - sk * .1, sx + sk * 1.1, sy - sk * .1, 1.2, 1.2); sm.kap(sx + sk * 1.1, sy - sk * .1, sx + sk * 1.25, sy - sk * .35, 1.2, 1);
  sm.poly([[sx - sk * .85, sy - sk * .45], [sx - sk * .7, sy - sk * .9], [sx + sk * .2, sy - sk * .95], [sx + sk * .8, sy - sk * .7], [sx + sk * .85, sy - sk * .45]]);
  K.form(K.eb(sy), sm, 0, { ton: 1.3, fase: 1, schatten: 2, rimF: .5, muster: (x, y) => (B.hash(x >> 2, y >> 1, 3) - .5) * .5 });
  B.nebel(K.e[2], { y0: 70, y1: 130, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .25, seed: 6 });
  B.partikel(K, { n: 60, farben: ['#3a5a80', '#8ab0d0', '#e8f6ff'], vx: -8, vy: 8, wob: 4, wf: .4, hellSelten: 2.5 });
  K.reihen = [{ y: 162, skala: .9, nebel: .3 }, { y: 189, skala: 1, nebel: .12 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [220, 206] };
}

// Wächter: ein breiter Riss vorne, darunter der Umriss näher und heller
function waechter(K) {
  const fr = K.fr, P = B.persp(260, 120); K.split = [150, 170];
  decke(K, 124);
  B.feld(K.e[1], -M, 80, W + M, 122, EIS, (x, y) => .5 + (y - 80) / 40 * .3);
  welle(K, 1, 340, 124, 120, 50, .35, { narbe: 12 }); welle(K, 1, 60, 124, 90, 30, .45, {});
  eisBoden(K, P, 120);
  const riss = (x, y) => Math.abs(y - (206 + Math.sin(x * .04) * 10 + Math.sin(x * .13) * 3)) < 14 + Math.sin(x * .07) * 6;
  B.dith(K.e[4], -M, 170, W + M, 240, '#010204', (x, y) => riss(x, y) ? 1 : 0);
  umriss(K, 1.4, (x, y) => riss(x, y) || y < 190);
  const km = B.maske(); km.fn(-M, 170, W + M, 240, (x, y) => !riss(x, y) && (riss(x, y + 2) || riss(x, y - 2))); B.form(K.e[4], km, K.mat(0, { k: EIS.slice(3, 9), r: pal.rand, ton: 2, fase: 0 }));
  B.nebel(K.e[2], { y0: 90, y1: 150, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .25, seed: 7 });
  B.partikel(K, { n: 50, farben: ['#3a5a80', '#8ab0d0', '#e8f6ff'], vx: -4, vy: 6, wob: 4, wf: .4, hellSelten: 2.5 });
  void fr;
  K.reihen = [{ y: 172, skala: .9, nebel: .28 }, { y: 188, skala: 1, nebel: .12 }, { y: 200, skala: 1, nebel: 0 }];
  return { mitte: [240, 196] };
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'kraemer' || art === 'rast' || art === 'werkstatt' ? 2 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = waechter(K);
  else if (art === 'uebergang') info = lager(K, { loch: true });
  else info = [eisfeld, brandung, lager][v](K);
  B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.eis = { pal, build: bauen, reliefStil: { figuren: 3, gelenke: 4, knick: .7 } };
})();
