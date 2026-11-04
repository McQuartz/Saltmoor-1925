// Saltmoor 1925 · Hintergründe: Akt 1b, Der Moorwald.
// Komposition: docs/auftrag/hintergruende-kompositionen.md
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#060508', '#0e0b14', '#1a1424', '#2a2238'], rand: ['#6a5a9a', '#e0d0ff'], augen: '#9affe0', nebel: ['#120e1c', '#2e2644'] };
const GRUEN = { koerper: ['#050704', '#0c100a', '#162012', '#22321c'], rand: ['#6a8a3a', '#e0ffa0'] };
const HIMMEL = ['#040308', '#07060d', '#0c0a16', '#120e20', '#1a142c', '#231c3a', '#2e2648', '#3c3258', '#4e426c'];
const TORF = ['#040306', '#08060c', '#0e0b14', '#15111c', '#1e1828', '#2a2238', '#3a3050'];
const MWASSER = ['#020304', '#05080b', '#0a1014', '#121a22', '#1c2434', '#2a3048', '#3c4060'];
const HOLZ = ['#050408', '#0b0910', '#141019', '#1e1824', '#2a2232', '#3a3046'];
const STERNE = ['#3a3058', '#6a5a9a', '#b0a0d8', '#f0e8ff'];
const FREMD = ['#2a6a5a', '#5ac0a0', '#9affe0', '#e0fff4'];

function himmel(K, hor, o) {
  o = o || {}; const e = K.e[0], s = K.o.seed;
  // Milchstraße als heller Schleier von oben rechts (Herkunft des Gegenlichts)
  const band = (x, y) => { const d = ((x - 480) * .55 + (y + 30) * .83); const q = Math.abs(d + 150) / 70; return Math.max(0, 1 - q) * (.7 + .5 * B.fbm(x * .02, y * .03, s + 5, 3)); };
  const gl = o.glow || [400, hor, 160];
  B.feld(e, -M, -M, W + M, hor + 3, HIMMEL, (x, y) => { const v = (y + M) / (hor + M); return Math.pow(v, 2.4) * .72 + band(x, y) * .3 + Math.exp(-(((x - gl[0]) / gl[2]) ** 2) - (((y - gl[1]) / (gl[2] * .5)) ** 2)) * .28 + (B.fbm(x * .01, y * .03, s, 2) - .5) * .08; });
  const r = K.r;
  for (let i = 0; i < 260; i++) { const x = r.f(-M, W + M), y = r.f(-M, hor - 6), b = band(x, y); if (r() > .25 + b) continue; const c = Math.min(3, Math.floor(Math.pow(r(), 2.6) * 3.4 + b)); e.set(x, y, B.pk(STERNE[c])); }
  sternbild(K, o.sbX || 336, o.sbY || 44, o.sbS || 1);
}
// Ein Sternbild, das man zu kennen glaubt: wie der Orion, aber der Gürtel hat vier Sterne
function sternbild(K, cx, cy, s) {
  const e = K.e[0], hell = (x, y, g) => { e.set(x, y, B.pk(STERNE[3])); if (g) { for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) e.set(x + dx, y + dy, B.pk(STERNE[1])); } };
  const P = [[-15, -21, 1], [13, -18, 1], [-7, 0, 0], [-2, 1, 0], [3, 2, 0], [8, 3, 0], [14, 23, 1], [-13, 25, 1], [0, -30, 0]];
  for (const [x, y, g] of P) hell(Math.round(cx + x * s), Math.round(cy + y * s), g);
}
const zielWinkel = (x, y, zx, zy) => Math.atan2(zy - y, zx - x);
// Baumgruppe: jeder Baum neigt sich zum Steinkreis
function baum(K, eb, x, yb, hoch, tiefe, ziel, o) {
  o = o || {}; const m = B.maske(), r = B.rng(Math.round(x * 31 + yb * 7) + K.o.seed);
  const zug = zielWinkel(x, yb - hoch * .5, ziel[0], ziel[1]), st = (o.neig || .16) + .22 * K.fr;
  B.baum(m, r, x, yb + 1, hoch * .42, -Math.PI / 2, Math.max(.6, hoch * (o.dick || .035)), o.tiefe || 4, { zug, zugStaerke: st, krumm: .14, spreiz: o.spreiz || .5, kuerz: .72, verj: .66, drei: .25, minLen: 2.5 });
  // Wurzelanlauf
  m.poly([[x - hoch * .05, yb + 1], [x - hoch * .012, yb - hoch * .05], [x + hoch * .014, yb - hoch * .05], [x + hoch * .05, yb + 1]]);
  K.form(eb, m, tiefe, { ton: o.birke ? 1.8 : 1, fase: 1, verlauf: .4, k: o.k, r: o.r, rand: tiefe > .5 ? 1 : 2, rimF: .42 });
}
function stein(K, eb, x, yb, w, h, tiefe, o) {
  o = o || {}; const r = B.rng(Math.round(x * 13 + yb * 17) + 3), m = B.maske(), j = v => r.j(v);
    const sch = (o.kipp || 0) + r.j(.08), sp = r.f(-.25, .25);
  m.poly([[x - w / 2 + j(w * .06), yb + 1], [x - w * .48 + sch * h * .3 + j(w * .08), yb - h * .45], [x - w * .3 + sch * h * .75, yb - h * .82], [x + w * sp + sch * h + j(w * .05), yb - h], [x + w * .26 + sch * h * .8, yb - h * .7 + j(h * .06)], [x + w * .46 + sch * h * .35, yb - h * .38], [x + w / 2 + j(w * .06), yb + 1]]);
  const mus = (px, py) => (B.rausch2(px * .3, py * .15, 9) - .5) * .7 + (o.flechte && B.rausch2(px * .2, py * .2, 4) > .7 ? .8 : 0);
  K.form(eb, m, tiefe, { ton: 1.1, fase: Math.max(1, w * .12), verlauf: .4, muster: mus, schatten: 2 });
  // Kerben, die zur Mitte zeigen
  if (o.kerbe && w > 10) { const dir = o.kerbe, e = K.e[eb], c = B.pk(B.mix(pal.koerper[0], K.fern, tiefe)); for (let i = 0; i < 3; i++) { const ky = yb - h * (.35 + i * .15); for (let k = 0; k < w * .22; k++) e.set(x + dir * (k - w * .05), ky + k * .4 * (i - 1), c); } }
}
function binsen(K, eb, x, y, s, tiefe) {
  const m = B.maske(), r = B.rng(Math.round(x * 7 + y * 11));
  const n = 4 + r.i(0, 4);
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + r.j(.45), l = (6 + r.f(0, 10)) * s; m.pfad([[x + r.j(3 * s), y], [x + Math.cos(a) * l * .5, y + Math.sin(a) * l * .5], [x + Math.cos(a + r.j(.2)) * l, y + Math.sin(a) * l]], .6, .45); }
  K.form(eb, m, tiefe, { k: GRUEN.koerper, r: GRUEN.rand, ton: 1.4, fase: 0, rand: 1 });
}
// Fremde Sterne in Wasserflächen (es gibt sie am Himmel nicht)
function wasserSterne(K, istW, x0, y0, x1, y1, n, kreis) {
  const r = B.rng(K.o.seed * 3 + 77), P = FREMD.map(B.pk);
  for (let i = 0; i < n * (1 + K.fr); i++) { const x = r.f(x0, x1), y = r.f(y0, y1); if (!istW(x, y)) continue; const e = K.e[K.eb(y)]; e.set(x, y, P[Math.floor(Math.pow(r(), 2) * 4)]); }
  if (kreis) { const [cx, cy, rr] = kreis; for (let i = 0; i < 7; i++) { const a = i / 7 * 6.283 + .3; const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * .35; if (istW(x, y)) { K.e[K.eb(y)].set(x, y, P[3]); K.e[K.eb(y)].set(x + 1, y, P[1]); } } }
}
function irrlichter(K, liste) {
  for (const [x, y, ph] of liste) {
    const g = B.glanzSprite(6, '#1a4a3a', .9);
    K.anim.push({ p: .15, f(ctx, t, ox, oy) { const v = Math.sin(t * .6 + ph); if (v < -.2) return; const dx = Math.sin(t * .23 + ph) * 6, dy = Math.sin(t * .41 + ph * 2) * 2; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, Math.round(x + dx) - g.R + ox, Math.round(y + dy) - g.R + oy); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = v > .5 ? '#9affe0' : '#5ac0a0'; ctx.fillRect(Math.round(x + dx) + ox, Math.round(y + dy) + oy, 1, 1); } });
  }
}
function torfstapel(K, eb, x, yb, s, tiefe) {
  const m = B.maske(); let h = 0;
  for (let reihe = 0; reihe < 4; reihe++) { const n = 4 - reihe; for (let i = 0; i < n; i++) m.rect(x - n * 3 * s + i * 6 * s + reihe * .5, yb - (reihe + 1) * 3.2 * s, 5.4 * s, 3 * s); h += 3.2 * s; }
  K.form(eb, m, tiefe, { ton: 1.3, fase: 0, schatten: 2, muster: (px, py) => (B.hash(px >> 1, py >> 1, 4) - .5) * .5 });
}
function laternePfahl(K, eb, x, yb, h) {
  const m = B.maske(); m.kap(x, yb, x + 1, yb - h, 1.2, .9); m.kap(x + 1, yb - h, x + 7, yb - h + 1, .8, .8); m.kap(x + 7, yb - h + 1, x + 7, yb - h + 5, .4, .4); m.rect(x + 5, yb - h + 5, 5, 6);
  K.form(eb, m, 0, { ton: 1.2, fase: 0 });
  B.dith(K.e[eb], x + 6, yb - h + 6, x + 9, yb - h + 10, '#e0c070', () => .9);
  K.glut(x + 7, yb - h + 8, 46, '#3a2a10', .9, [2, 3, 4]);
  B.flamme(K, x + 7, yb - h + 10, { p: B.PAR[eb], glut: '#2a1a08' });
}

// =====================================================================
// Variante 0: Bohlenweg zur Anhöhe mit dem Steinkreis
function bohlenweg(K, o) {
  o = o || {}; const r = K.r, fr = K.fr, P = B.persp(240, 150); K.split = [158, 168];
  const kreis = [428, 100];
  himmel(K, 152, { glow: [430, 112, 120] });
  // Anhöhe mit Steinkreis (Ebene 1)
  const hug = B.maske(); hug.poly([[230, 153], [280, 143], [330, 128], [372, 112], [404, 102], [452, 100], [480 + M, 104], [480 + M, 153], [230, 153]]);
  K.form(1, hug, .4, { ton: 1.1, fase: 1, verlauf: .3, muster: (x, y) => (B.hash(x, y >> 1, 2) - .5) * .4 });
  if (!o.uebergang) {
    for (const [a, w, h, k] of [[3.4, 5, 10, 0], [3.0, 4, 8, 0], [2.4, 4, 9, 0], [1.9, 5, 11, 0], [1.2, 4, 8, .1], [.75, 5, 10, 0], [.35, 4, 7, 0], [-.2, 6, 12, 0], [4.0, 6, 12, 0]]) {
      const x = kreis[0] + Math.cos(a) * 38, y = kreis[1] + 1 - Math.sin(a) * 5; stein(K, 1, x, y, w * 1.4, h * 1.5, .36, { kipp: k });
    }
    for (const [a, w, h] of [[-1.1, 7, 14], [-2.0, 6, 12], [-.6, 8, 15], [-2.6, 7, 13]]) stein(K, 1, kreis[0] + Math.cos(a) * 40, kreis[1] + 2 - Math.sin(a) * 7, w * 1.5, h * 1.6, .3, { kerbe: Math.cos(a) > 0 ? -1 : 1 });
    if (fr > .4) { K.glut(kreis[0], kreis[1] - 4, 26, '#123a30', .5 + fr * .5, [0, 1]); K.licht(kreis[0], kreis[1] - 4, '#9affe0', 30, fr); }
  } else kapelleFern(K, 1, 372, 128);
  // Baumreihe am Horizont: Haine, nicht gleichmäßig, alle zum Kreis geneigt
  for (const [g0, g1, n] of [[-6, 70, 5], [104, 150, 3], [180, 236, 4], [300, 340, 2]]) for (let i = 0; i < n; i++) { const x = B.lerp(g0, g1, (i + r.f(.1, .9)) / n), yb = x > 236 ? 153 - (x - 230) * .21 : 152; baum(K, 1, x, yb, r.f(14, 28), .55, kreis, { tiefe: 3 }); }
  // Nebel über dem Moor, hinter den Figuren
  B.nebel(K.e[1], { y0: 136, y1: 160, col: B.mix(pal.nebel[1], K.fern, .5), dichte: .4, seed: 3 });
  B.nebel(K.e[2], { y0: 110, y1: 164, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .26, xs: [20, 460, 80], seed: 6 });
  // Boden: Torf, Wasserlöcher, der Bohlenweg in S-Form
  const pfad = Z => { const pts = [[1, -1.4], [2.2, .9], [3.6, -.3], [6, 2.4], [10, 8.6], [16, 18], [30, 40]]; for (let i = 0; i < pts.length - 1; i++) if (Z <= pts[i + 1][0]) { const q = B.glatt((Z - pts[i][0]) / (pts[i + 1][0] - pts[i][0])); return B.lerp(pts[i][1], pts[i + 1][1], q); } return 40; };
  const breite = .62, sd = K.o.seed;
  const welt = (x, y) => { const Z = P.z(y + .5); return [(x + .5 - P.vx) * Z / P.h, Z]; };
  const istWasser = (X, Z) => B.fbm(X * .5, Z * .9, sd + 11, 3) > .56 - (Z < 3 && X < -1 ? .1 : 0);
  const klasse = (x, y) => { const [X, Z] = welt(x, y); const d = Math.abs(X - pfad(Z)); if (d < breite && !(B.hash(Math.floor(Z / .17), 0, sd) < .07 && d < breite * .8)) return 2; return istWasser(X, Z) ? 1 : 0; };
  K.bodenStoffe(151, H + M, [
    { cols: TORF, tf: (x, y) => { const [X, Z] = welt(x, y), f = 1 - (y - 150) / 120; return .18 + Math.pow(f, 5) * .55 + (B.fbm(X * 2, Z * 3, sd, 2) - .5) * .25 + (B.hash(x, y, 1) > .93 ? .15 : 0); } },
    { cols: MWASSER, tf: (x, y) => { const f = 1 - (y - 150) / 120; return .32 + Math.pow(f, 3) * .5 + (Math.sin(y * 1.5 + x * .05) > .85 ? .15 : 0); } },
    { cols: HOLZ, tf: (x, y) => { const [X, Z] = welt(x, y), d = X - pfad(Z), f = 1 - (y - 150) / 120; let t = .3 + Math.pow(f, 5) * .5 + B.hash(Math.floor(Z / .17), 1, sd) * .12; if ((Z / .17) % 1 < .2 && P.k(Z) > 8) t = .08; if (Math.abs(Math.abs(d) - breite) * P.k(Z) < 1.1) t = .62; return t; } }
  ], klasse);
  const iw = (x, y) => { if (y < 151) return false; const [X, Z] = welt(x, y); return klasse(x, y) === 1; };
  wasserSterne(K, iw, -M, 152, W + M, H, 160, [70, 212, 22]);
  // Binsen an Wasserrändern (wo sie wachsen), nicht gestreut
  for (let Z = 1.6; Z < 9; Z += .32) for (let X = -9; X < 9; X += .55) { if (!istWasser(X, Z) || istWasser(X + .5, Z) || B.hash(Math.round(X * 9), Math.round(Z * 9), 3) > .22) continue; if (Math.abs(X - pfad(Z)) < breite + .2) continue; const [x, y] = P.q(X + .3, 0, Z); if (x < -M || x > W + M) continue; binsen(K, K.eb(y), x, y, P.k(Z) / 40, Z > 5 ? .3 : 0); }
  // Bäume am Weg, wo der Boden trägt
  for (const [X, Z, h, b] of [[-3.6, 4.0, 150, 0], [-1.4, 7.2, 70, 1], [2.9, 5.2, 120, 0], [-6, 12, 48, 1], [5.4, 9, 64, 0]]) { const [x, y] = P.q(X, 0, Z); baum(K, K.eb(y), x, y, h, Z > 8 ? .3 : Z > 5 ? .12 : 0, kreis, { birke: b, tiefe: 4, dick: .03 }); }
  const [tx, ty] = P.q(pfad(3.0) + 1.25, 0, 3.0); torfstapel(K, K.eb(ty), tx, ty, 1.3, 0);
  if (fr < .6) { const [lx, ly] = P.q(pfad(4.4) - .9, 0, 4.4); laternePfahl(K, K.eb(ly), lx, ly, 46); }
  // Vordergrund: toter Stamm links, der sich zur Mitte neigt, Binsen rechts unten
  const v = B.maske(), rv = B.rng(sd + 5);
  B.baum(v, rv, 4, H + M, 230, -1.5, 8, 3, { zug: zielWinkel(-6, 100, kreis[0], kreis[1]), zugStaerke: .06, krumm: .06, spreiz: .5, kuerz: .5, minLen: 8 });
  K.form(5, v, 0, { ton: .6, fase: 2, k: ['#020203', '#050408', '#0b0910', '#141019'] });
  binsen(K, 5, 456, H + 4, 2.4, 0); binsen(K, 5, 470, H + 8, 2.8, 0);
  irrlichter(K, [[132, 160, 0], [300, 156, 2], [56, 172, 4]]);
  B.wasserGlanz(K, { x0: -M, x1: W + M, y0: 152, y1: H, n: 80, farben: ['#2a3a3c', '#4a5a6a'], p: .5, pow: 1.5, maske: iw, schwelle: .7 });
  B.partikel(K, { n: 30, farben: ['#3a3058', '#6a5a9a', '#9affe0'], vx: 3, vy: -2, wob: 5, wf: .5, wobY: 3, hellSelten: 2.5 });
  K.reihen = [{ y: 167, skala: .9, nebel: .35 }, { y: 190, skala: 1, nebel: .15 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [250, 206] };
}

// Variante 1: Torfstich (wir stehen im Graben, rechts die getreppte Stichwand)
function torfstich(K) {
  const r = K.r, fr = K.fr, P = B.persp(236, 124); K.split = [146, 158];
  const kreis = [196, 110];
  himmel(K, 126, { sbX: 300, sbY: 40, glow: [200, 120, 130] });
  // ferne Anhöhe links der Mitte mit Kreis, klein
  const hug = B.maske(); hug.poly([[110, 126], [160, 116], [190, 108], [214, 109], [250, 118], [300, 126]]); K.form(1, hug, .55, { ton: 1.1, fase: 1 });
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283, x = kreis[0] + Math.cos(a) * 16, y = kreis[1] - Math.sin(a) * 2.5; if (Math.sin(a) < -.2) continue; stein(K, 1, x, y, 3, 5 + (i % 3), .5); }
  // linkes Ufer: niedrig, Bäume neigen sich zum Kreis
  const ufer = B.maske(); ufer.poly([[-M, 126], [60, 124], [140, 125], [236, 125], [236, 128], [-M, 150]]); K.form(1, ufer, .52, { ton: 1, fase: 1 });
  for (const [x, yb, h] of [[22, 132, 46], [64, 128, 30], [100, 127, 22], [14, 140, 64]]) baum(K, x > 30 ? 1 : 2, x, yb, h, x > 30 ? .5 : .32, kreis, { tiefe: 4 });
  // rechte Stichwand: drei Stufen, läuft zum Fluchtpunkt
  const wand = [{ X: 2.6, Y: 1.2 }, { X: 3.3, Y: 2.1 }, { X: 4.0, Y: 3.0 }];
  for (let i = wand.length - 1; i >= 0; i--) {
    const { X, Y } = wand[i], Yu = i ? wand[i - 1].Y : -.05, m = B.maske();
    m.poly([P.q(X, Yu, .8), P.q(X, Y, .8), P.q(X, Y, 80), P.q(X, Yu, 80)]);
    // Stichfläche (zeigt zur Grabenmitte) mit waagerechten Spatenspuren
    const mus = (x, y) => { const Z = (x - P.vx) > 1 ? X * P.h / (x - P.vx) : 80, Yw = 1 - (y - P.vy) * Z / P.h; return ((Math.floor(Yw * 6) & 1) ? .25 : 0) + (B.hash(x >> 1, y, 2) - .5) * .3 + (Math.floor(Z * 2.2) % 3 === 0 ? -.2 : 0); };
    K.form(i ? 2 : 3, m, .04 + i * .06, { ton: 1.6 + i * .3, fase: 2, verlauf: .5, muster: mus, k: TORF.slice(0, 6), schatten: 0 });
  }
  // Torfringel auf den Stufen (zum Trocknen), dort wo gestochen wurde
  for (const [X, Y, Z] of [[3.0, 1.2, 6.4], [3.6, 2.1, 5.0], [3.7, 2.1, 11], [4.4, 3.0, 4.2], [4.4, 3.0, 8.5], [4.3, 3.0, 20]]) { const [x, y] = P.q(X, Y, Z); torfstapel(K, 2, x, y, P.k(Z) / 30, .1); }
  // Spaten steckt in der frischen Stichkante
  const [sx, sy] = P.q(2.6, .6, 2.6), sk = P.k(2.6) / 50; const sp = B.maske(); sp.kap(sx - 2, sy, sx - 12 * sk, sy - 46 * sk, 1.2, 1); sp.kap(sx - 15 * sk, sy - 46 * sk, sx - 9 * sk, sy - 46 * sk, 1.2, 1.2); sp.poly([[sx - 5, sy - 2], [sx + 4, sy - 2], [sx + 3, sy + 10 * sk], [sx - 4, sy + 10 * sk]]);
  K.form(3, sp, 0, { ton: 1.8, fase: 0 });
  // Grabenboden: nasser Torf mit Pfützen und fremden Sternen
  const sd = K.o.seed, welt = (x, y) => { const Z = P.z(y + .5); return [(x + .5 - P.vx) * Z / P.h, Z]; };
  const istW = (X, Z) => B.fbm(X * .7, Z * 1.1, sd + 3, 2) > .6 && X < 2.3;
  K.bodenStoffe(125, H + M, [
    { cols: TORF, tf: (x, y) => { const [X, Z] = welt(x, y), f = 1 - (y - 124) / 146; return .2 + Math.pow(f, 5) * .5 + (B.fbm(X * 2, Z * 3, sd, 2) - .5) * .25 + ((Z * 3) % 1 < .08 ? -.1 : 0); } },
    { cols: MWASSER, tf: (x, y) => { const f = 1 - (y - 124) / 146; return .2 + Math.pow(f, 3) * .6; } }
  ], (x, y) => { const [X, Z] = welt(x, y); if (X > 2.62) return -1; return istW(X, Z) ? 1 : 0; });
  const iw = (x, y) => { const [X, Z] = welt(x, y); return y > 125 && X < 1.6 && istW(X, Z); };
  wasserSterne(K, iw, -M, 128, 330, H, 140, [120, 200, 18]);
  // Schubkarre im Graben
  const [bx, by] = P.q(-1.5, 0, 3.6), bk = P.k(3.6) / 40; const sk2 = B.maske();
  sk2.poly([[bx - 14 * bk, by - 12 * bk], [bx + 10 * bk, by - 14 * bk], [bx + 8 * bk, by - 4 * bk], [bx - 10 * bk, by - 3 * bk]]); sk2.ell(bx + 12 * bk, by - 3 * bk, 4 * bk, 4 * bk); sk2.kap(bx - 14 * bk, by - 10 * bk, bx - 26 * bk, by - 4 * bk, 1, 1); sk2.kap(bx - 8 * bk, by - 4 * bk, bx - 10 * bk, by, 1, 1);
  K.form(K.eb(by), sk2, 0, { ton: 1.4, schatten: 2 });
  B.nebel(K.e[2], { y0: 104, y1: 150, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .28, xs: [-20, 360, 60], seed: 6 });
  if (fr < .6) laternePfahl(K, 3, 120, 152, 40);
  const v = B.maske(); v.poly([[480 + M, -M], [440, -M], [452, 80], [446, 170], [458, H + M], [480 + M, H + M]]); binsen(K, 5, 20, H + 6, 2.6, 0);
  K.form(5, v, 0, { ton: .6, fase: 2, k: TORF.slice(0, 4), muster: (x, y) => ((y >> 2) & 1) * .3 });
  irrlichter(K, [[60, 150, 1], [180, 142, 3]]);
  B.partikel(K, { n: 26, farben: ['#3a3058', '#6a5a9a', '#9affe0'], vx: 2, vy: -2, wob: 5, wf: .5, wobY: 3, hellSelten: 2.5 });
  K.reihen = [{ y: 160, skala: .9, nebel: .35 }, { y: 186, skala: 1, nebel: .15 }, { y: 212, skala: 1, nebel: 0 }];
  return { mitte: [210, 204] };
}

// Variante 2: Im Steinkreis (Steine auf einer Ellipse um uns, großer Himmel)
function steinkreis(K, waechter) {
  const r = K.r, fr = K.fr, hor = waechter ? 176 : 162, P = B.persp(240, hor); K.split = waechter ? [182, 190] : [168, 174];
  himmel(K, hor + 2, { sbX: 300, sbY: 58, sbS: 1.3, glow: [240, hor, 200] });
  // Horizont: Baumkronen hinter der Kuppe, alle neigen sich herein
  const hor2 = B.maske(); hor2.poly([[-M, hor + 2], [-M, hor - 6], [120, hor - 9], [240, hor - 10], [360, hor - 8], [480 + M, hor - 5], [480 + M, hor + 2]]); K.form(1, hor2, .5, { ton: 1 });
  for (let i = 0; i < 16; i++) { const x = -10 + i * 31 + r.j(10); if (Math.abs(x - 240) < 30 && r() < .7) continue; baum(K, 1, x, hor - 8, r.f(16, 34), .5, [240, hor + 40], { tiefe: 3, neig: .3 }); }
  B.nebel(K.e[1], { y0: hor - 18, y1: hor + 4, col: B.mix(pal.nebel[1], K.fern, .5), dichte: .45, seed: 4 });
  const sd = K.o.seed, welt = (x, y) => { const Z = P.z(y + .5); return [(x + .5 - P.vx) * Z / P.h, Z]; };
  const istW = (X, Z) => B.fbm(X * .6, Z * 1.2, sd + 21, 2) > .66;
  K.bodenStoffe(hor + 1, H + M, [
    { cols: TORF, tf: (x, y) => { const [X, Z] = welt(x, y), f = 1 - (y - hor) / (H - hor); return .26 + Math.pow(f, 4) * .45 + (B.fbm(X * 1.5, Z * 2, sd, 2) - .5) * .3; } },
    { cols: MWASSER, tf: (x, y) => .25 + Math.pow(1 - (y - hor) / (H - hor), 3) * .5 }
  ], (x, y) => { const [X, Z] = welt(x, y); return istW(X, Z) ? 1 : 0; });
  wasserSterne(K, (x, y) => { if (y <= hor) return false; const [X, Z] = welt(x, y); return istW(X, Z); }, -M, hor + 2, W + M, H, 120, null);
  // Steine auf dem Kreis: Mitte (0, Zc), Radius R, Lücken und zwei umgefallene
  const Zc = waechter ? 5 : 6.5, R = waechter ? 5 : 8.5, steine = [];
  for (let i = 0; i < 15; i++) { const a = -0.5 + i * (Math.PI + 1) / 14 + r.j(.06); if (i === 4 || i === 9) continue; steine.push([a, i === 6 || i === 11]); }
  steine.sort((p, q) => Math.sin(q[0]) - Math.sin(p[0]));
  for (const [a, liegt] of steine) {
    const X = R * Math.cos(a), Z = Zc + R * Math.sin(a); if (Z < 1.3) continue; const [x, y] = P.q(X, 0, Z), k = P.k(Z);
    const h = (1.7 + B.hash(Math.round(a * 50), 0, 3) * .9) * k, w = (.7 + B.hash(Math.round(a * 50), 1, 3) * .4) * k;
    if (liegt) { const m = B.maske(); m.poly([[x - h * .5, y], [x - h * .48, y - w * .45], [x + h * .45, y - w * .5], [x + h * .5, y]]); K.form(K.eb(y), m, Z > 9 ? .3 : 0, { ton: 1.1, fase: 2, schatten: 2 }); continue; }
    stein(K, K.eb(y), x, y, w, h, Z > 10 ? .3 : Z > 6 ? .12 : 0, { kerbe: x < 240 ? 1 : -1, flechte: true });
  }
  if (waechter) {
    // Der Opferstein: flach, mit Kerbe, nah
    const m = B.maske(), cx = 300, cy = 214;
    m.poly([[cx - 110, cy], [cx - 104, cy - 34], [cx - 60, cy - 46], [cx - 8, cy - 44], [cx + 6, cy - 30], [cx + 20, cy - 46], [cx + 80, cy - 50], [cx + 112, cy - 36], [cx + 120, cy]]);
    K.form(4, m, 0, { ton: 1.2, fase: 3, verlauf: .4, schatten: 2, muster: (x, y) => (B.rausch2(x * .15, y * .1, 3) - .5) * .7 });
    K.glut(cx + 12, cy - 34, 30 + fr * 20, '#12483a', .7 + fr * .4, [3, 4]); K.licht(cx + 12, cy - 34, '#9affe0', 40, .7);
    const e = K.e[4]; for (let i = 0; i < 9; i++) e.set(cx + 6 + i * 1.6, cy - 33 + Math.abs(i - 4) * 1.4, B.pk(FREMD[i % 3 === 0 ? 3 : 1]));
  }
  // Pfützen in den Fußmulden der Steine
  if (fr < .6 && !waechter) laternePfahl(K, 4, 120, 196, 44);
  const v = B.maske(); stein(K, 5, -20, H + 4, 70, 240, 0, { kerbe: 1 }); stein(K, 5, 500, H + 4, 80, 220, 0, { kerbe: -1 });
  void v;
  irrlichter(K, [[200, hor + 2, 0], [330, hor + 4, 2.4]]);
  B.partikel(K, { n: 30, farben: ['#3a3058', '#6a5a9a', '#9affe0'], vx: 2, vy: -3, wob: 5, wf: .5, wobY: 3, hellSelten: 2.5 });
  K.reihen = waechter ? [{ y: 190, skala: .9, nebel: .3 }, { y: 202, skala: 1, nebel: .12 }, { y: 214, skala: 1, nebel: 0 }] : [{ y: 172, skala: .9, nebel: .35 }, { y: 192, skala: 1, nebel: .15 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [240, 208] };
}
// Übergang: am Ende des Kirchpfads die Kapelle (ferne Silhouette)
function kapelleFern(K, eb, x, yb) {
  const m = B.maske(); m.rect(x - 26, yb - 22, 44, 22); m.poly([[x - 28, yb - 22], [x - 4, yb - 36], [x + 20, yb - 22]]); m.rect(x + 10, yb - 50, 10, 30); m.poly([[x + 8, yb - 50], [x + 15, yb - 62], [x + 22, yb - 50]]);
  K.form(eb, m, .45, { ton: 1.1, fase: 1 });
  B.dith(K.e[eb], x - 4, yb - 18, x + 1, yb - 12, '#7a9a4a', () => .8); K.glut(x - 2, yb - 15, 14, '#1a3a10', .9, [0, 1]);
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'kraemer' ? 0 : art === 'rast' ? 1 : art === 'wandbild' ? 2 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = steinkreis(K, true);
  else if (art === 'uebergang') info = bohlenweg(K, { uebergang: true });
  else info = [bohlenweg, torfstich, (k) => steinkreis(k, false)][v](K);
  B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.moor = { pal, build: bauen, reliefStil: { figuren: 5, gelenke: 3, knick: .8 } };
})();
