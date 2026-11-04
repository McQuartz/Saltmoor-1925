// Saltmoor 1925 · Hintergründe: Akt II, Das Kloster der Abschrift (Biom-Paket kloster).
// Komposition: docs/auftrag-2/biome/kloster.md
// Pergament, Eisengallustinte, Kerzenocker; silbernes Watt-Licht von hinten rechts.
// Wahrzeichen: das Buch im Kreuzgang, so groß wie eine Kirche. Falsches Detail: die Schrift passt nicht mehr
// auf die Seiten und läuft über den Boden; die Abschriften werden immer dicker; die Priele liegen in Zeilen.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#08070a', '#110e14', '#1d1822', '#2c2532'], rand: ['#867c68', '#e6dcc2'], augen: '#e6aa4a', nebel: ['#2e2a32', '#7a7468'], fern: '#9a948a' };
const HIMMEL = ['#3a3a42', '#4a4a52', '#5c5c62', '#706e72', '#868480', '#9e9a92', '#b6b0a4', '#ccc6b6', '#dcd6c6'];
const STEIN = ['#0c0a0e', '#151216', '#1f1a1e', '#2a2428', '#383032', '#463d3c', '#564b46', '#6a5c52', '#7e6e5e'];
const PERG = ['#3c3630', '#4e4740', '#635a4e', '#7a705e', '#92876f', '#aa9e84', '#c2b69a', '#d6ccb0', '#e6dcc2'];
const BODEN = ['#0e0c10', '#18141a', '#231d22', '#2e262a', '#3b3134', '#4a3e3e', '#584a48'];
const SAND = ['#1c1a1a', '#2a2624', '#38322e', '#48403a', '#5a5046', '#6c6054'];
const HOLZ = ['#08060a', '#100c0e', '#1a1416', '#261d1e', '#342828', '#443430'];
const WATT = ['#141418', '#1c1c22', '#26262c', '#323238', '#404046', '#525256', '#686866', '#828078'];
const TINTE = '#1e1a26', TINTE2 = '#2c2a44', ROT = '#8a3a20', KERZE = '#e6aa4a', KGLUT = '#4a3010';

// Schrift: Zeilen aus kurzen Strichen (Wörtern) auf einer Fläche. zeile(y) -> [x0, x1] oder null
function schrift(e, y0, y1, dz, zeile, farbe, seed, dicht) {
  const c = B.pk(farbe || TINTE);
  for (let y = Math.ceil(y0); y < y1; y += dz) {
    const b = zeile(y); if (!b) continue; let x = b[0] + (B.hash(y, 1, seed) < .2 ? 4 : 1);
    while (x < b[1]) { const l = 1 + Math.floor(B.hash(x, y, seed) * 5); if (B.hash(x, y, seed + 3) < (dicht || .92)) for (let k = 0; k < l && x + k < b[1]; k++) e.set(x + k, y, c); x += l + 1 + (B.hash(x, y, seed + 5) < .2 ? 1 : 0); }
  }
}
function himmel(K, eb, hell) {
  const sd = K.o.seed;
  B.feld(K.e[eb], -M, -M, W + M, H + M, HIMMEL, (x, y) => {
    const r = Math.max(0, 1 - Math.hypot((x - 470) * .7, (y - 40) * 1.2) / 380); // hell hinten rechts (Westen, Watt)
    const band = B.fbm(x * .006, y * .045, sd, 3);
    return (hell || .35) + r * .5 - y / H * .15 + (band - .5) * .35 + (Math.sin(y * .09 + band * 4) > .82 ? .08 : 0);
  });
}
// Kerze auf einer Ebene (mit Glut auf den nahen Ebenen)
function kerze(K, eb, x, y, h, an) {
  const e = K.e[eb], c = B.pk('#c8bea2'), c2 = B.pk('#7a705e');
  for (let j = 0; j < h; j++) { e.set(x, y - j, c); e.set(x + 1, y - j, c2); }
  if (an) { B.flamme(K, x, y - h, { p: B.PAR[eb], glut: '#3a2408', kern: '#fff8e2', mitte: '#f0b450', aussen: '#b06a20' }); K.glut(x, y - h, 26, KGLUT, .9, [Math.max(1, eb - 1), eb]); }
}
// Das Buch, frontal: zwei Seiten wie Dächer über dem Rücken, darunter der Buchblock. Schrift auf den Seiten,
// die über die Kante hinausläuft und den Block hinunter. o.links/rechts/oben/basis in Bildkoordinaten.
function buch(K, eb, o) {
  const e = K.e[eb], fr = K.fr, sd = K.o.seed, x0 = o.x0, x1 = o.x1, xm = (x0 + x1) / 2, yb = o.basis, yo = o.oben, blk = o.block;
  const ws = x1 - x0, tief = o.tiefe || 0;
  // Seitenoberkante: außen hoch, zur Mitte (Falz) hin abfallend, leicht gewölbt
  const top = x => { const u = Math.abs(x - xm) / (ws / 2); return yo + (1 - Math.sin(Math.min(1, u) * Math.PI * .5)) * (o.falz || 40) + Math.pow(u, 6) * 10; };
  // Buchblock (Seitenlagen von der Seite) und Deckel
  const bm = B.maske(); bm.poly([[x0 - 4, yb - blk], [x1 + 4, yb - blk], [x1 + 6, yb], [x0 - 6, yb]]);
  K.form(eb, bm, tief, { k: PERG.slice(0, 6), r: ['#c2b69a', '#ece4cc'], ton: 2.2, fase: 1, verlauf: .8, muster: (x, y) => ((y - yb) % 2 === 0 ? -.5 : 0) + (B.fbm(x * .03, y * .2, sd + 7, 2) - .5) * .8 - (B.rausch2(x * .02, y * .05, sd) > .7 ? .8 : 0) });
  const dk = B.maske(); dk.rect(x0 - 8, yb - 3, ws + 16, 4); dk.rect(x0 - 8, yb - blk - 3, ws + 16, 3); B.form(e, dk, K.mat(tief, { k: STEIN.slice(1, 6), ton: 1.4, fase: 1 }));
  // Seiten: zwei Flächen, Licht von rechts hinten: rechte Seite heller
  const pm = B.maske(); pm.fn(x0, yo - 2, x1, yb - blk, (x, y) => y > top(x) && Math.abs(x - xm) > 1.5);
  K.form(eb, pm, tief, { k: PERG.slice(2, 9), r: ['#ece4cc', '#fff8e2'], ton: 3.2, fase: 2, muster: (x, y) => (x > xm ? .9 : -.3) + (y - top(x)) / (yb - blk - yo) * -1.4 + (B.fbm(x * .02, y * .02, sd + 2, 2) - .5) * .6, rimF: .1 });
  // Falz: dunkle Rinne
  for (let y = Math.floor(top(xm)) - 1; y < yb - blk; y++) { e.set(xm - 1, y, B.pk(PERG[1])); e.set(xm, y, B.pk(PERG[0])); e.set(xm + 1, y, B.pk(PERG[2])); }
  // Schrift auf den Seiten, Zeilen folgen der Wölbung (zwei Spalten je Seite)
  const zr = Math.max(3, Math.round(o.zeile || 4));
  for (const s of [-1, 1]) {
    const a = s < 0 ? x0 + ws * .07 : xm + ws * .05, b = s < 0 ? xm - ws * .05 : x1 - ws * .07;
    schrift(e, yo, yb - blk - 4, zr, y => { const l = [], rr = []; for (let x = a; x < b; x++) if (y > top(x) + 4) { l.push(x); } if (!l.length) return null; return [l[0], l[l.length - 1]]; }, s < 0 ? TINTE : TINTE2, sd + (s < 0 ? 1 : 2), .78);
  }
  // Initiale auf der linken Seite: ein großer Buchstabe aus Tinte mit Ocker
  const ix = x0 + ws * .1, iy = top(ix) + 8, is = Math.max(4, ws * .035);
  const im = B.maske(); im.kap(ix, iy, ix, iy + is * 2.2, is * .35, is * .35); im.kap(ix, iy, ix + is * 1.3, iy + is * .5, is * .3, is * .3); im.kap(ix + is * 1.3, iy + is * .5, ix, iy + is * 1.1, is * .3, is * .3);
  for (let y = im.y0; y <= im.y1; y++) for (let x = im.x0; x <= im.x1; x++) if (im.has(x, y)) e.set(x, y, B.pk((x + y) % 4 === 0 ? '#c07a30' : ROT));
  // Falsches Detail: die Zeilen laufen über die Seitenkante hinaus, den Block hinunter (rechts, wo Platz fehlt)
  const lauf = 3 + Math.round(fr * 6);
  for (let k = 0; k < lauf; k++) {
    const sx = x1 - 6 - k * 5 - (k % 2) * 2; let y = top(sx) + 6 + k * zr;
    for (let yy = yb - blk; yy < yb; yy++) { if (B.hash(sx, yy, sd + k) < .62) e.set(sx + Math.round(Math.sin(yy * .3 + k) * .6), yy, B.pk(TINTE)); }
    void y;
  }
  return { top, xm, yb };
}
// Säulenpfeiler der Arkade (Doppelsäule mit Würfelkapitell), stehend auf (x, yb), Höhe hh, Breite w
function doppelsaeule(K, eb, x, yb, hh, w, tief) {
  const m = B.maske(), d = Math.max(1, w * .34), sw = Math.max(1, w * .22), ht = yb - hh;
  m.rect(x - w * .65, yb - w * .25, w * 1.3, w * .25 + 1); // Plinthe
  for (const s of [-1, 1]) m.kap(x + s * d, yb - w * .2, x + s * d, ht + w * .5, sw * 1.05, sw);
  m.poly([[x - w * .7, ht], [x + w * .7, ht], [x + w * .45, ht + w * .55], [x - w * .45, ht + w * .55]]); // Kapitell
  m.rect(x - w * .8, ht - w * .18, w * 1.6, w * .2); // Deckplatte
  K.form(eb, m, tief, { k: STEIN.slice(1, 9), r: pal.rand, ton: 3.4, fase: Math.max(1, w * .1), verlauf: .6, schatten: 2, muster: (px, py) => (B.hash(px >> 1, py >> 2, 9) - .5) * .5 });
}
// Pult mit schräger Platte, Buch und optional Kerze; Bodenpunkt (x, y), Maßstab s (1 = nah)
function pult(K, eb, x, y, s, an, o) {
  o = o || {}; const m = B.maske(), h = 30 * s, w = 22 * s;
  m.poly([[x - w * .5, y - h], [x + w * .5, y - h + 7 * s], [x + w * .5, y - h + 10 * s], [x - w * .5, y - h + 3 * s]]);
  m.rect(x - w * .42, y - h + 3 * s, w * .84, 9 * s); m.kap(x - w * .35, y - h + 10 * s, x - w * .38, y, Math.max(.6, 1.4 * s), Math.max(.6, 1.4 * s)); m.kap(x + w * .35, y - h + 12 * s, x + w * .38, y, Math.max(.6, 1.4 * s), Math.max(.6, 1.4 * s));
  m.kap(x - w * .38, y - 4 * s, x + w * .38, y - 4 * s, Math.max(.5, s), Math.max(.5, s));
  K.form(eb, m, o.tief || 0, { k: HOLZ, r: pal.rand, ton: 2.2, fase: 1, schatten: 2 });
  // offenes Buch auf der Platte: helle Seiten
  const e = K.e[eb], bx0 = Math.round(x - w * .36), bx1 = Math.round(x + w * .36);
  for (let xx = bx0; xx <= bx1; xx++) { const yy = Math.round(y - h + (xx - (x - w * .5)) / w * 7 * s) - 1; const c = B.pk(PERG[o.tief ? 4 : 6 - (xx === Math.round(x) ? 3 : 0)]); e.set(xx, yy, c); if (s > .6) e.set(xx, yy - 1, B.pk(PERG[5])); if (s > .6 && xx % 2 === 0 && xx !== Math.round(x)) e.set(xx, yy, B.pk(PERG[3])); }
  // Tintenhorn im Pult, nasse Feder
  e.set(Math.round(x + w * .42), Math.round(y - h + 6 * s), B.pk(TINTE2)); B.linie(e, x + w * .42, y - h + 6 * s, x + w * .42 + 3 * s, y - h - 4 * s, B.pk(PERG[5]));
  if (o.kerze !== false) kerze(K, eb, Math.round(x - w * .45), Math.round(y - h + 1), Math.max(2, Math.round(4 * s)), an);
}

// =====================================================================
// Variante 0: Im Kreuzgang. Wir stehen im Garten; links läuft die Arkade nach hinten, rechts liegt das Buch,
// größer als der Kreuzgang. Die Schrift läuft vom Buch über den Sand bis vor unsere Füße und in die Arkade.
function kreuzgang(K, cfg) {
  cfg = cfg || {};
  const fr = K.fr, sd = K.o.seed, P = B.persp(150, 128), XA = -2.6, YD = 2.3; K.split = [163, 182];
  himmel(K, 0, .48);
  // Kirchturm hinten links über dem Kreuzgangdach (fern, flach)
  const tm = B.maske(); tm.rect(96, 36, 22, 96); tm.poly([[92, 38], [107, 12], [122, 38]]); K.form(1, tm, .6, { ton: 1.3, fase: 1, rand: 1 });
  B.feld(K.e[1], 104, 50, 110, 60, ['#2a2622', '#3a342e'], (x, y) => ((x + y) % 3 ? .2 : .8));
  // Garten: blasser Sand mit Salzgras, Wege an den Rändern
  K.boden(P.vy + 1, H + M, SAND, (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; return .5 + Math.min(.38, Z / 22) + (B.fbm(X * .9, Z * .9, sd, 2) - .5) * .5 + (B.hash(x, y, 4) > .95 ? -.3 : 0) + (X < XA + .7 ? -.25 : 0); });
  // Das Buch: steht im Garten rechts, Seiten bis an den Bildrand
  const bk = buch(K, 2, { x0: 196, x1: 492, oben: 4, basis: 162, block: 26, falz: 52, zeile: 3, tiefe: .03 });
  // Arkade links: dunkler Gang dahinter, davor Doppelsäulen mit Rundbögen, darüber Mauer und Pultdach
  const Zs = [1.05, 1.5, 2.1, 2.9, 3.9, 5.2, 7, 9.4, 12.6, 17];
  const innen = B.maske(), [i0x, i0y] = P.q(XA - .9, YD + .2, 1.0), [i1x, i1y] = P.q(XA - .9, YD + .2, 18), [, if1] = P.q(XA - .9, 0, 18), [, if0] = P.q(XA - .9, 0, 1.0);
  innen.poly([[i0x, i0y], [i1x, i1y], [i1x, if1], [i0x, if0]]);
  K.form(2, innen, .05, { k: STEIN.slice(0, 5), ton: 1.1, fase: 0, rand: 0, verlauf: .4 });
  const aw = B.maske(), [a0x, a0y] = P.q(XA, YD, 1.0), [a1x, a1y] = P.q(XA, YD, 18), [, af1] = P.q(XA, 0, 18), [, af0] = P.q(XA, 0, 1.0);
  aw.poly([[a0x, a0y], [a1x, a1y], [a1x, af1], [a0x, af0]]);
  const ZvonX = x => XA * P.h / Math.min(-.001, x - P.vx);
  for (let i = 0; i < Zs.length - 1; i++) {
    const za = Zs[i] + .07 * Zs[i] / 2, zb = Zs[i + 1] - .07 * Zs[i + 1] / 2, zm = (za + zb) / 2, r = (zb - za) / 2, ys = 1.5;
    aw.fn(P.q(XA, 0, za)[0] - 1, -M, P.q(XA, 0, zb)[0] + 1, H + M, (x, y) => { const Z = ZvonX(x), Y = 1 - (y - P.vy) * Z / P.h; if (Z < za || Z > zb || Y < .05) return false; return Y < ys || Math.hypot((Z - zm) / r, (Y - ys) / .55) < 1; }, 0);
  }
  K.form(3, aw, 0, { k: STEIN.slice(1, 9), r: pal.rand, ton: 4.2, fase: 2, verlauf: .3, schatten: 2, muster: (x, y) => { const Z = ZvonX(x), Y = 1 - (y - P.vy) * Z / P.h; return (Math.abs((Y * 4) % 1) < .07 ? -.8 : 0) + (B.hash(Math.floor(Z * 3), Math.floor(Y * 4), 3) - .5) * .5; } });
  for (let i = 1; i < Zs.length - 1; i++) { const Z = Zs[i], [x, yb] = P.q(XA, 0, Z), [, yt] = P.q(XA, 1.5, Z), w = P.k(Z) * .2; doppelsaeule(K, K.eb(yb), x, yb, yb - yt, w, Math.min(.45, Z / 30)); }
  const dach = B.maske(), [d0x, d0y] = P.q(XA, YD, 1.0), [d1x, d1y] = P.q(XA, YD, 18), [d2x, d2y] = P.q(XA - 1.2, YD + .9, 18), [d3x, d3y] = P.q(XA - 1.2, YD + .9, 1.0);
  dach.poly([[d0x, d0y], [d1x, d1y], [d2x, d2y], [d3x, d3y]]);
  K.form(3, dach, 0, { k: HOLZ, r: pal.rand, ton: 2, fase: 1, muster: (x, y) => { const Z = ZvonX(x); return (Math.abs((Z * 4) % 1) < .12 ? -.6 : 0) + ((y % 3) === 0 ? -.3 : 0); } });
  // im Gang ein Pult mit Kerze (durch einen Bogen zu sehen)
  if (!cfg.ohnePult) { const [px, py] = P.q(XA - .45, 0, 2.5); pult(K, 3, px, py, P.k(2.5) / 130, fr < .8, { tief: .05 }); }
  // Falsches Detail: Schrift läuft vom Buchblock über den Sand zu uns, eine Zeile biegt in die Arkade
  const zeilen = 4 + Math.round(fr * 5);
  for (let k = 0; k < zeilen; k++) {
    let prev = null; const zurArkade = k === 1 || k === 4;
    for (let t = 0; t <= 1; t += .0025) {
      const Z0 = 4.55, Z = Z0 - t * (zurArkade ? 1.2 : 3.4), X = 1.2 + k * .35 - t * (zurArkade ? 3.6 + k * .1 : .9 + k * .3) + Math.sin(t * 6 + k) * .07;
      const [x, y] = P.q(X, 0, Z); const kk = P.k(Z), e = K.e[K.eb(y)];
      if (prev && Math.round(x) === prev[0] && Math.round(y) === prev[1]) continue; prev = [Math.round(x), Math.round(y)];
      const ph = (t * 90 + k * 7) % 6; if (ph > 4.2) continue;
      e.set(x, y, B.pk(TINTE)); if (kk > 50) e.set(x + 1, y, B.pk(TINTE)); if (kk > 80) { e.set(x, y + 1, B.pk(TINTE)); if (B.hash(Math.round(x), Math.round(y), k) > .6) e.set(x - 1, y - 1, B.pk(TINTE2)); }
    }
  }
  B.nebel(K.e[2], { y0: 120, y1: 166, col: B.mix(pal.nebel[1], K.fern, .4), dichte: .2, xs: [60, 300, 60], seed: 3 });
  // Vordergrund: Säule der Arkade vorne links angeschnitten, Salzgras am Rand
  doppelsaeule(K, 5, -6, H + 6, 290, 70, 0);
  const g = B.maske(); for (let i = 0; i < 14; i++) { const x = 440 + i * 3.4, h = 8 + B.hash(i, 1, sd) * 16; g.kap(x, H + 4, x + (B.hash(i, 2, sd) - .3) * 6, H - h, 1, .5); } K.form(5, g, 0, { k: STEIN.slice(0, 5), r: pal.rand, ton: 1.6, fase: 0, rand: 1 });
  B.partikel(K, { n: 40, farben: ['#7a705e', '#aa9e84', '#d6ccb0'], vx: -2, vy: 3, wob: 3, wf: .3, x0: 160, x1: 480, y0: 0, y1: 200, hellSelten: 2 });
  K.reihen = [{ y: 172, skala: .9, nebel: .28 }, { y: 192, skala: 1, nebel: .12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [230, 208], buch: bk };
}

// =====================================================================
// Variante 1: Das Skriptorium. Pultreihen zum hohen Fenster am Ende; links die Abschriften, jede dicker.
function skriptorium(K, cfg) {
  cfg = cfg || {};
  const fr = K.fr, sd = K.o.seed, P = B.persp(300, 116), XL = -3.2, XR = 3.0, YD = 3.0, ZE = 6.2; K.split = [150, 172];
  // Wände (Kalkputz, pergamentfarben), Rückwand mit Fenster
  B.feld(K.e[0], -M, -M, W + M, H + M, STEIN, (x, y) => .55 + (B.fbm(x * .03, y * .03, sd, 3) - .5) * .4);
  const [rx0, ry0] = P.q(XL, YD, ZE), [rx1, ry1] = P.q(XR, 0, ZE);
  const rw = B.maske(); rw.rect(rx0, ry0, rx1 - rx0, ry1 - ry0);
  const fx = P.q(.7, 0, ZE)[0], fw = P.k(ZE) * 1.5, fyT = P.q(0, 2.1, ZE)[1], fyB = P.q(0, .55, ZE)[1];
  rw.fn(fx - fw / 2, fyT - fw, fx + fw / 2, fyB, (x, y) => y > fyT || Math.hypot(x - fx, y - fyT) < fw / 2, 0);
  K.form(1, rw, .15, { k: STEIN.slice(2, 9), r: pal.rand, ton: 4.4, fase: 1, verlauf: .4, muster: (x, y) => (B.fbm(x * .05, y * .05, sd + 3, 2) - .5) * .7 });
  // Fenster: Watt-Himmel und Watt, hell; Sprossen
  B.feld(K.e[0], fx - fw / 2, fyT - fw / 2, fx + fw / 2, fyB, HIMMEL, (x, y) => y > fyB - (fyB - fyT) * .35 ? .5 + (Math.sin(y * 1.7) > .6 ? .3 : 0) : .82 - (y - fyT) / (fyB - fyT) * .3);
  const sm = B.maske(); sm.rect(fx - .6, fyT - fw / 2, 1.2, fyB - fyT + fw / 2); sm.rect(fx - fw / 2, fyT + (fyB - fyT) * .45, fw, 1.2); K.form(1, sm, .1, { k: HOLZ, ton: 1, fase: 0, rand: 0 });
  K.licht(fx, (fyT + fyB) / 2, '#d6d0c6', 120, .8);
  // Lichtbahnen vom Fenster schräg nach vorn links auf den Boden
  for (const L of [K.e[1], K.e[2], K.e[3]]) B.kegel(L, fx, fyT + 10, Math.PI * .62, .13, 300, '#3a3630', .55);
  // Seitenwände (Fluchtlinien)
  for (const X of [XL, XR]) { const m = B.maske(), [a0, a1] = P.q(X, YD, .9), [b0, b1] = P.q(X, YD, ZE), [c0, c1] = P.q(X, 0, ZE), [d0, d1] = P.q(X, 0, .9); m.poly([[a0, a1], [b0, b1], [c0, c1], [d0, d1]]); K.form(2, m, .06, { k: STEIN.slice(1, 8), r: pal.rand, ton: X < 0 ? 2.6 : 3.4, fase: 0, rand: 0, verlauf: -.4, muster: (x, y) => (B.fbm(x * .04, y * .04, sd + 5, 2) - .5) * .6 }); }
  // Decke mit Bindern (Balken quer), oben dunkel
  const dm = B.maske(), [q0x, q0y] = P.q(XL, YD, .9), [q1x, q1y] = P.q(XR, YD, .9), [q2x, q2y] = P.q(XR, YD, ZE), [q3x, q3y] = P.q(XL, YD, ZE); dm.poly([[q0x, q0y], [q1x, q1y], [q2x, q2y], [q3x, q3y]]);
  K.form(2, dm, .05, { k: HOLZ, ton: 1.3, fase: 0, rand: 0 });
  for (const Z of [1.5, 2.4, 3.6, 5.2]) { const m = B.maske(), [a, b] = P.q(XL, YD, Z), [c, d] = P.q(XR, YD, Z), k = P.k(Z); m.poly([[a, b - k * .14], [c, d - k * .14], [c, d + k * .1], [a, b + k * .1]]); K.form(2, m, Math.min(.3, Z / 30), { k: HOLZ, r: pal.rand, ton: 1.6, fase: 1 }); }
  // Dielenboden zum Fenster hin
  K.boden(P.vy + 1, H + M, BODEN, (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z), f = X / .45 - Math.floor(X / .45); if (Z > ZE) return -1; let t = .4 + Math.min(.3, Z / 18) + B.hash(Math.floor(X / .45), 3, sd) * .15; if (f * .45 * k < 1) t -= .25; return t; });
  // Tintenflecken auf den Dielen
  for (let i = 0; i < 9; i++) { const X = -1.8 + B.hash(i, 1, sd) * 3.6, Z = 1.6 + B.hash(i, 2, sd) * 6, [x, y] = P.q(X, 0, Z), r = Math.max(1, P.k(Z) * .06 * (.5 + B.hash(i, 3, sd))); const m = B.maske(); m.ell(x, y, r * 1.8, r * .6); const e = K.e[K.eb(y)]; for (let yy = m.y0; yy <= m.y1; yy++) for (let xx = m.x0; xx <= m.x1; xx++) if (m.has(xx, yy)) e.set(xx, yy, B.pk(TINTE)); }
  // Falsches Detail: die Abschriften auf dem Bord an der linken Wand, jede dicker als die davor (nach vorn hin)
  // eine niedrige Bank an der Wand, darauf die Abschriften stehend: oben die hellen Schnitte, vorn die Rücken
  let Z = ZE - .2, n = 0; const bordY = .42, D = .42, XS = XL + D;
  const bm = B.maske(), q1 = P.q(XS + .04, bordY, ZE), q2 = P.q(XS + .04, bordY, 1.25), q3 = P.q(XS + .04, 0, 1.25), q4 = P.q(XS + .04, 0, ZE); bm.poly([q1, q2, q3, q4]); K.form(3, bm, .02, { k: HOLZ, r: pal.rand, ton: 1.6, fase: 1 });
  const buecher = [];
  while (Z > 1.35 && n < 40) {
    const dick = .045 + n * n * .0055, hoch = .42 + (n % 3) * .05 + Math.min(.32, n * .022);
    const za = Z, zb = Z - dick; if (zb < 1.3) break;
    buecher.push({ za, zb, hoch, n }); Z = zb - .02 - Math.min(.03, n * .002); n++;
  }
  for (const bu of buecher) {
    const { za, zb, hoch } = bu, Y = bordY + hoch, kk = P.k(za);
    const r1 = B.maske(); r1.poly([P.q(XS, Y, za), P.q(XS, Y, zb), P.q(XS, bordY, zb), P.q(XS, bordY, za)]);
    const mitte = P.q(XS, bordY + hoch * .5, za)[1];
    K.form(3, r1, Math.min(.3, za / 22), { k: (bu.n % 3 === 1 ? HOLZ : STEIN.slice(0, 6)), r: [PERG[3], PERG[7]], ton: 1.3 + (bu.n % 2) * .5, fase: 1, rand: 2, muster: (x, y) => (Math.abs(y - (mitte - kk * hoch * .3)) < Math.max(.6, kk * .018) || Math.abs(y - (mitte + kk * hoch * .3)) < Math.max(.6, kk * .018) ? 1.3 : 0) });
    const sc = B.maske(); sc.poly([P.q(XL, Y, za), P.q(XS, Y, za), P.q(XS, Y, zb), P.q(XL, Y, zb)]);
    K.form(3, sc, Math.min(.3, za / 22), { k: PERG.slice(2, 8), ton: 3.5, fase: 0, rand: 0, muster: (x, y) => ((y + x) % 2 ? -.6 : 0) });
  }
  // die letzte Abschrift liegt quer auf dem Boden, so dick wie eine Truhe
  { const m = B.maske(), a = P.q(XL + .3, .55, 1.6), b2 = P.q(XL + 1.2, .55, 1.6), c = P.q(XL + 1.2, 0, 1.6), d = P.q(XL + .3, 0, 1.6), e2 = P.q(XL + .3, .55, 2.4); m.poly([e2, a, b2, c, d]); K.form(4, m, 0, { k: STEIN.slice(0, 6), r: [PERG[4], PERG[8]], ton: 1.8, fase: 2, muster: (x, y) => ((y % 3 === 0 && x > d[0] + 3) ? .9 : 0) }); }
  // Pultreihen links und rechts des Gangs, Kerzen nur an einigen
  const Zp = [1.9, 2.8, 3.8, 4.9];
  for (const X of [-1.5, 1.6]) Zp.slice().reverse().forEach((Zz, i) => { const [x, y] = P.q(X, 0, Zz); pult(K, K.eb(y), x, y, P.k(Zz) / 72, (i + (X > 0 ? 1 : 0)) % 2 === 0 && fr < .85, { tief: Math.min(.4, Zz / 18) }); });
  // Leine mit Pergamentbögen zum Trocknen (Licht scheint durch)
  { const [l0x, l0y] = P.q(XL, 2.6, 3.4), [l1x, l1y] = P.q(XR, 2.6, 3.4), e = K.e[2]; B.linie(e, l0x, l0y, l1x, l1y, B.pk(HOLZ[3])); const k = P.k(3.4) * .7; for (let i = 0; i < 5; i++) { const t = .12 + i * .17, x = B.lerp(l0x, l1x, t), y = B.lerp(l0y, l1y, t) + Math.sin(t * Math.PI) * 3; B.feld(e, x, y, x + k * .32, y + k * .42, PERG.slice(1, 6), (xx, yy) => .45 + (xx - x) / (k * .32) * .3 + (B.hash(xx, yy, i) - .5) * .2 - ((yy - y) % 3 === 0 ? .35 : 0)); } }
  B.nebel(K.e[2], { y0: 96, y1: 150, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .2, xs: [150, 440, 60], seed: 5 });
  // Vordergrund: Pultkante unten links, Binder oben
  const v = B.maske(); v.poly([[-M, 236], [64, 226], [70, 236], [-M, 252]]); v.kap(56, 232, 52, H + M, 2.4, 2.4); v.poly([[-M, -M], [W + M, -M], [W + M, 6], [-M, 14]]);
  K.form(5, v, 0, { k: HOLZ, r: pal.rand, ton: 1.4, fase: 2 });
  B.partikel(K, { n: 50, farben: ['#7a705e', '#aa9e84', '#d6ccb0'], vx: -3, vy: 2, wob: 2, wf: .3, x0: 120, x1: 380, y0: 20, y1: 220, hellSelten: 2, maske: (x, y) => Math.abs((x - fx) + (y - fyT) * .7) < 70 });
  K.reihen = [{ y: 166, skala: .9, nebel: .3 }, { y: 190, skala: 1, nebel: .12 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [250, 206] };
}

// =====================================================================
// Variante 2: Am Watt. Klostermauer schräg links, darüber Dächer, Turm und die Oberkante des Buchs; rechts das Watt.
function watt(K) {
  const fr = K.fr, sd = K.o.seed, P = B.persp(250, 150); K.split = [160, 180];
  himmel(K, 0, .5);
  // Kloster hinter der Mauer: Kirche, Turm, Dächer; über den Dächern das Buch (größer als die Kirche)
  buch(K, 1, { x0: 40, x1: 212, oben: 30, basis: 130, block: 14, falz: 22, zeile: 2, tiefe: .32 });
  const km = B.maske(); km.poly([[60, 150], [60, 96], [100, 74], [140, 96], [140, 150]]); km.rect(140, 54, 26, 96); km.poly([[136, 56], [153, 34], [170, 56]]); km.poly([[166, 150], [166, 110], [196, 96], [222, 110], [222, 150]]);
  K.form(1, km, .22, { k: STEIN.slice(1, 8), r: pal.rand, ton: 2.2, fase: 1, verlauf: .3, muster: (x, y) => ((x > 140 && x < 166 && (y % 14) < 2) ? -.6 : 0) });
  for (const [x, y] of [[150, 70], [156, 70], [182, 118], [76, 112]]) B.feld(K.e[1], x, y, x + 3, y + 6, ['#1a1618', '#2a2426'], () => .2);
  // Watt: nasser Schlick bis zum Horizont, Priele in Zeilen (falsches Detail), Glanz
  const zeilenAbst = .55;
  B.feld(K.e[2], 200, P.vy, W + M, P.vy + 12, WATT, (x, y) => .55 + (y - P.vy) / 12 * -.2);
  K.boden(P.vy + 1, H + M, WATT, (x, y) => {
    const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z);
    const zeile = Z / zeilenAbst, fz = zeile - Math.floor(zeile), zi = Math.floor(zeile);
    const einzug = B.hash(zi, 2, sd) < .2 ? 1.8 : 0, ende = 6 + B.hash(zi, 3, sd) * 22;
    const prielX = X > 1.2 + einzug && X < ende;
    const priel = prielX && fz * zeilenAbst * k * k / P.h < Math.max(.9, k * .025) && B.hash(Math.floor(X * 2), zi, sd + 1) < .8;
    let t = .42 + Math.min(.3, Z / 30) + (B.fbm(X * .4, Z * .4, sd, 2) - .5) * .35;
    if (priel) t = .82 + Math.min(.15, Z / 60);
    return t;
  });
  // Steinweg entlang der Mauer (wo die Gegner stehen), Muscheln
  K.bodenStoffe(P.vy + 6, H + M, [{ cols: BODEN, tf: (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z), fx = X / .5 - Math.floor(X / .5), fz = Z / .4 - Math.floor(Z / .4); let t = .5 + Math.min(.25, Z / 25) + (B.hash(Math.floor(X / .5) + Math.floor(Z / .4) * 7, 3, sd) - .5) * .3; if (fx * .5 * k < 1.2 || fz * .4 * k * k / P.h < 1) t -= .3; return t; } }], (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; return X > -3.2 && X < 1.0 + Z * .02 ? 0 : -1; });
  // Klostermauer: von links vorn schräg nach hinten, mit Pforte und Wegkreuz
  const XM = -3.3, YM = 2.1, mm = B.maske(), [m0x, m0y] = P.q(XM, YM, 1.1), [m1x, m1y] = P.q(XM, YM, 12), [, mf1] = P.q(XM, 0, 12), [, mf0] = P.q(XM, 0, 1.1);
  mm.poly([[-M, m0y], [m1x, m1y], [m1x, mf1], [-M, mf0 + 10]]);
  const pz = 3.4, [p0x] = P.q(XM, 0, pz), [p1x] = P.q(XM, 0, pz + .7);
  mm.fn(p1x, -M, p0x, H + M, (x, y) => { const Z = -XM * P.h / Math.max(.001, P.vx - x), Y = 1 - (y - P.vy) * Z / P.h; return Z > pz && Z < pz + .7 && Y > 0 && (Y < 1.1 || Math.hypot(Z - pz - .35, Y - 1.1) < .35); }, 0);
  K.form(3, mm, 0, { k: STEIN.slice(1, 9), r: pal.rand, ton: 3.2, fase: 2, verlauf: .4, schatten: 2, muster: (x, y) => { const Z = -XM * P.h / Math.max(.001, P.vx - x), Y = 1 - (y - P.vy) * Z / P.h; return (Math.abs((Y * 5) % 1) < .08 ? -.7 : 0) + (Math.abs(((Z * 2.2) + Math.floor(Y * 5) * .5) % 1) < .05 ? -.6 : 0) + (B.hash(Math.floor(Z * 2.2), Math.floor(Y * 5), 3) - .5) * .5 - (Y < .35 ? .6 : 0); } });
  const tor = B.maske(); tor.fn(p1x, -M, p0x, H + M, (x, y) => { const Z = -XM * P.h / Math.max(.001, P.vx - x), Y = 1 - (y - P.vy) * Z / P.h; return Z > pz + .05 && Z < pz + .65 && Y > 0 && (Y < 1.1 || Math.hypot(Z - pz - .35, Y - 1.1) < .3); });
  K.form(3, tor, 0, { k: HOLZ, ton: 1.2, fase: 1, rand: 1, muster: x => (x % 3 === 0 ? -.5 : 0) });
  { const [cx, cy] = P.q(XM + .5, 0, pz - .4), k = P.k(pz - .4), m = B.maske(); m.kap(cx, cy, cx, cy - k * 1.5, k * .04, k * .035); m.kap(cx - k * .3, cy - k * 1.2, cx + k * .3, cy - k * 1.2, k * .035, k * .035); K.form(K.eb(cy), m, 0, { k: STEIN.slice(0, 6), r: pal.rand, ton: 2, fase: 1 }); }
  // Pricken: Reihe zum Festland (nach rechts hinten), eine Reihe biegt ins offene Watt
  for (let i = 0; i < 16; i++) {
    const Z = 2.2 + i * 1.1, X = 2.2 + i * .25, [x, y] = P.q(X, 0, Z), k = P.k(Z), e = K.e[K.eb(y)];
    B.linie(e, x, y, x + k * .02, y - k * .9, B.pk(B.mix(HOLZ[3], K.fern, Math.min(.6, Z / 30))));
    for (let j = 0; j < 3 + k * .03; j++) e.set(x + B.hash(i, j, 3) * k * .12 - k * .06, y - k * .9 - B.hash(i, j, 4) * k * .14, B.pk(B.mix(HOLZ[4], K.fern, Math.min(.6, Z / 30))));
  }
  for (let i = 0; i < 9; i++) { const Z = 6.6 + i * .9, X = 3.4 + i * .9 + i * i * .12, [x, y] = P.q(X, 0, Z), k = P.k(Z), e = K.e[K.eb(y)]; B.linie(e, x, y, x, y - k * .85, B.pk(B.mix(HOLZ[3], K.fern, Math.min(.6, Z / 25)))); e.set(x - 1, y - k * .85, B.pk(HOLZ[4])); e.set(x + 1, y - k * .9, B.pk(HOLZ[4])); }
  // Ruderboot auf dem Schlick, schief
  { const [bx, by] = P.q(3.6, 0, 3.4), k = P.k(3.4), m = B.maske(); m.poly([[bx - k * .9, by - k * .32], [bx + k * .8, by - k * .2], [bx + k * .6, by], [bx - k * .7, by + k * .02]]); K.form(K.eb(by), m, 0, { k: HOLZ, r: pal.rand, ton: 1.8, fase: 1, muster: (x, y) => ((y % 3) === 0 ? -.4 : 0) }); }
  B.wasserGlanz(K, { x0: 240, x1: 480, y0: P.vy + 2, y1: H, n: 70, farben: ['#828078', '#a6a29a', '#d6d0c2'], p: .5, pow: 1.4, schwelle: .7, laengeNah: 3 });
  B.nebel(K.e[2], { y0: P.vy - 26, y1: P.vy + 12, col: B.mix(pal.nebel[1], K.fern, .5), dichte: .3, xs: [180, 490, 80], seed: 9 });
  // Vordergrund: Pricke rechts angeschnitten, Mauerecke links
  const v = B.maske(); v.kap(462, H + M, 452, 120, 3.4, 2.6); for (let j = 0; j < 9; j++) v.kap(452, 122, 452 + (j - 4) * 4, 100 - (j % 3) * 4, 1, .6);
  K.form(5, v, 0, { k: HOLZ, r: pal.rand, ton: 1.5, fase: 1 });
  B.partikel(K, { n: 26, farben: ['#9a948a', '#c2bcb0'], vx: -8, vy: 1, wob: 4, wf: .4, x0: 0, x1: 480, y0: 0, y1: 200, hellSelten: 2 });
  K.reihen = [{ y: 168, skala: .9, nebel: .32 }, { y: 191, skala: 1, nebel: .14 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [210, 206] };
}

// =====================================================================
// Wächter: Am Fuß des Buchs. Untersicht, der Buchblock als Wand aus Papier, die Seite kragt wie ein Dach darüber.
// Übergang: dieselbe Stelle, unter dem Buchrücken führt eine Treppe nach unten; die Stufen sind beschrieben.
function fussDesBuchs(K, cfg) {
  cfg = cfg || {};
  const fr = K.fr, sd = K.o.seed, P = B.persp(200, 196); K.split = [200, 214];
  himmel(K, 0, .5);
  // die aufgeschlagene Seite von unten: Gegenlicht scheint durch das Pergament, Schrift spiegelverkehrt sichtbar
  const sm = B.maske(); sm.poly([[110, -M], [W + M, -M], [W + M, 70], [430, 58], [360, 44], [270, 30], [190, 18], [130, 8]]);
  K.form(1, sm, 0, { k: PERG.slice(1, 9), r: ['#ece4cc', '#fff8e2'], ton: 4.6, fase: 2, verlauf: -1.2, muster: (x, y) => (B.fbm(x * .02, y * .05, sd + 4, 2) - .5) * .8 });
  schrift(K.e[1], -M, 62, 3, y => { const l = 140 + y * 2.6; return l < W ? [Math.max(l, 150), W - 10] : null; }, '#8a7e66', sd + 9, .6);
  // Buchblock: Wand aus Papierlagen rechts der Mitte, Feuchtigkeitsflecken, Schrift läuft herab
  const bx0 = 236, bx1 = W + M, byT = 62;
  const bm = B.maske(); bm.poly([[bx0 + 8, byT], [bx1, byT + 6], [bx1, 214], [bx0, 204]]);
  K.form(2, bm, 0, { k: PERG.slice(0, 7), r: ['#c2b69a', '#ece4cc'], ton: 3, fase: 2, verlauf: .5, schatten: 2, muster: (x, y) => ((y % 2) === 0 ? -.45 : 0) + ((y % 9) === 0 ? -.4 : 0) + (B.fbm(x * .015, y * .04, sd, 3) - .5) * 1.2 - (B.rausch2(x * .03, y * .01, sd + 1) > .68 ? .9 : 0) });
  // Kapitalband/Deckel unten und Rücken links als dunkle Kante
  const dk = B.maske(); dk.poly([[bx0 - 6, 200], [bx1, 210], [bx1, 220], [bx0 - 8, 208]]); dk.poly([[bx0 + 4, byT - 4], [bx0 + 14, byT - 2], [bx0 + 6, 204], [bx0 - 4, 204]]);
  K.form(2, dk, 0, { k: STEIN.slice(0, 6), r: pal.rand, ton: 1.6, fase: 1 });
  // Schrift läuft den Block hinunter und über den Boden nach vorn
  const n = 6 + Math.round(fr * 6);
  for (let k = 0; k < n; k++) {
    const sx = bx0 + 24 + k * 18 + (k % 3) * 4, e2 = K.e[2];
    for (let y = byT + 10 + (k % 4) * 9; y < 204; y++) if (B.hash(sx, y, sd + k) < .65) e2.set(sx + Math.round(Math.sin(y * .2 + k) * .7), y, B.pk(TINTE));
  }
  // Boden (Garten), Schrift in Zeilen zu uns
  K.boden(P.vy + 1, H + M, SAND, (x, y) => { const Z = P.z(y + .5); return .55 + Math.min(.3, Z / 20) + (B.fbm(x * .05, y * .2, sd, 2) - .5) * .5; });
  for (let k = 0; k < 4 + Math.round(fr * 4); k++) {
    for (let t = 0; t < 1; t += .003) { const Z = 5 - t * 4, X = 1.2 - t * (2.2 + k * .25) + k * .3, [x, y] = P.q(X, 0, Z); if ((t * 120 + k * 5) % 7 < 5) { const e = K.e[K.eb(y)]; e.set(x, y, B.pk(TINTE)); if (P.k(Z) > 60) e.set(x + 1, y, B.pk(TINTE)); } }
  }
  // Säule der Arkade links, angeschnitten; dahinter Bogenansatz
  doppelsaeule(K, 3, 46, 212, 230, 58, 0);
  const bg = B.maske(); bg.pfad([[58, -10], [110, -20], [150, -40]], 14, 12); K.form(3, bg, 0, { k: STEIN.slice(1, 9), r: pal.rand, ton: 3.2, fase: 2 });
  // Kerzenstümpfe am Fuß des Buchs (hier saß jemand und schrieb)
  if (!cfg.treppe) for (const [x, y, h] of [[214, 206, 3], [224, 210, 2], [180, 212, 4]]) kerze(K, 4, x, y, h, fr < .85 || x === 224);
  if (cfg.treppe) {
    const tm = B.maske(); tm.poly([[262, 204], [330, 207], [322, 160], [272, 158]]); K.form(2, tm, 0, { k: ['#020203', '#050406', '#09070a', '#0e0b0e'], ton: .4, rand: 0, fase: 0 });
    for (let i = 0; i < 7; i++) { const y = 200 - i * 6, e = K.e[2]; B.linie(e, 268 + i * 1.4, y, 324 - i * 1, y + 1, B.pk(PERG[3 - Math.min(2, i >> 1)])); schrift(e, y + 1, y + 3, 1, () => [272 + i, 320 - i], TINTE, sd + i, .6); }
    K.glut(296, 170, 40, '#2a2418', .8, [2]);
  }
  B.nebel(K.e[2], { y0: 176, y1: 206, col: B.mix(pal.nebel[1], K.fern, .4), dichte: .22, xs: [80, 300, 50], seed: 4 });
  B.partikel(K, { n: 40, farben: ['#aa9e84', '#d6ccb0', '#ece4cc'], vx: -2, vy: 4, wob: 3, wf: .3, x0: 100, x1: 480, y0: 0, y1: 200, hellSelten: 2 });
  K.reihen = [{ y: 196, skala: .9, nebel: .25 }, { y: 206, skala: 1, nebel: .1 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [170, 212] };
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'kraemer' || art === 'rast' ? 1 : art === 'werkstatt' ? 1 : art === 'ereignis' || art === 'fund' || art === 'wandbild' ? 0 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = fussDesBuchs(K, {});
  else if (art === 'uebergang') info = fussDesBuchs(K, { treppe: true });
  else info = [k => kreuzgang(k, { ohnePult: art === 'ereignis' || art === 'fund' }), skriptorium, watt][v](K);
  if (art === 'rast') { for (let i = 0; i < 4; i++) B.dith(K.e[i], -M, -M, W + M, H + M, pal.koerper[0], (px) => .22 + .1 * i - Math.abs(px - 240) / 1600); B.feuer(K, 240, 220); }
  else if (art === 'kraemer') { B.stand(K, 290, 204); }
  else if (art !== 'uebergang') B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.kloster = { pal, build: bauen, reliefStil: { figuren: 5, gelenke: 2, knick: .25, stein: ['#5a5046', '#6c6054', '#8a7c68', '#bcae90'] } };
if (World.BIOME.indexOf('kloster') < 0) World.BIOME.push('kloster');
})();
