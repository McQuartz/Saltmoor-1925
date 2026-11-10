// Saltmoor 1925 · Hintergründe: Akt 3b, Die namenlose Stadt (vor dem Menschen).
// Komposition: docs/auftrag/hintergruende-kompositionen.md
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#080404', '#140a0a', '#241212', '#3a1c18'], rand: ['#a0402a', '#ffc0a0'], augen: '#ffe060', nebel: ['#1c0e0a', '#4a2a1c'] };
const STEIN = ['#070303', '#100707', '#1a0d0a', '#26130e', '#341b13', '#44241a', '#583022', '#6e3e2a', '#8a5034'];
const SAND = ['#5a3420', '#7a4a2a', '#9a6438', '#c08a50'];
const OCKER = '#5a2a08';

// Quader in unmenschlichen Proportionen: sehr breit und flach
const quader = (zh, bw, s) => (x, y) => { const row = Math.floor(y / zh), xx = x + B.hash(row, 0, s || 1) * bw; return (y % zh === 0 ? -.6 : 0) + ((Math.floor(xx) % bw) === 0 ? -.5 : 0) + (B.hash(Math.floor(xx / bw), row, 5) - .5) * .4; };

// Reliefband: Figuren mit zu vielen Gelenken wenden sich einem Großen zu (beten) oder fliehen davor
function reliefBand(K, eb, x0, x1, yT, yB, tiefe, o) {
  o = o || {}; const r = B.rng(o.seed || 41), hb = yB - yT, gx = o.gx || B.lerp(x0, x1, .66);
  const grund = B.maske(); grund.rect(x0, yT, x1 - x0, hb);
  K.form(eb, grund, tiefe, { k: STEIN.slice(2, 8), ton: 2.4, fase: 0, rand: 0, muster: (x, y) => (B.hash(x >> 1, y >> 1, 3) - .5) * .4 });
  // Gesimse oben und unten
  const ges = B.maske(); ges.rect(x0, yT - hb * .14, x1 - x0, hb * .14); ges.rect(x0, yB, x1 - x0, hb * .12);
  K.form(eb, ges, tiefe, { k: STEIN.slice(1, 8), ton: 2.6, fase: Math.max(1, hb * .04), muster: quader(Math.max(3, Math.round(hb * .14)), Math.round(hb * 1.6)) });
  const fig = B.maske();
  // das Große: Masse mit Ringen und strahlenden Furchen
  const gr = hb * .46; fig.ell(gx, yT + hb * .52, gr * 1.1, gr); fig.ell(gx, yT + hb * .52, gr * .78, gr * .7, 0); fig.ell(gx, yT + hb * .52, gr * .58, gr * .5);
  for (let i = 0; i < 11; i++) { const a = Math.PI * (1.05 + i / 10 * .9) + r.j(.05); fig.kap(gx + Math.cos(a) * gr * 1.1, yT + hb * .52 + Math.sin(a) * gr, gx + Math.cos(a) * gr * 1.45, yT + hb * .52 + Math.sin(a) * gr * 1.25, Math.max(.6, hb * .02), .5); }
  for (let i = 0; i < 3; i++) fig.ell(gx - gr * .25 + i * gr * .25, yT + hb * .5 + (i === 1 ? -gr * .1 : 0), hb * .04, hb * .04, 0);
  // Figuren: Abstand unregelmäßig
  let x = x0 + hb * .3;
  while (x < x1 - hb * .2) {
    if (Math.abs(x - gx) < gr * 1.6) { x += gr * .6; continue; }
    const links = x < gx, flieht = !links && r() < .7, n = 5 + r.i(0, 3), seg = hb * .78 / n * (flieht ? 1.1 : 1);
    let a = -Math.PI / 2 + (links ? .25 : flieht ? .35 : -.3), px = x, py = yB - 1; const pts = [[px, py]];
    for (let i = 0; i < n; i++) { a += (i % 2 ? 1 : -1) * r.f(.4, 1.0) + (links ? .12 : flieht ? .1 : -.1); px += Math.cos(a) * seg; py += Math.sin(a) * seg * .8; py = Math.max(py, yT + hb * .12); pts.push([px, py]); }
    fig.pfad(pts, Math.max(.7, hb * .03), Math.max(.6, hb * .022));
    fig.ell(px + (links ? 1 : -1) * hb * .02, py - hb * .03, hb * .045, hb * .04);
    const mi = pts[Math.floor(n * .6)]; let aa = links ? -.4 : flieht ? -2.6 : -.6, qx = mi[0], qy = mi[1]; const arm = [[qx, qy]];
    for (let i = 0; i < 4; i++) { aa += (i % 2 ? .9 : -.7); qx += Math.cos(aa) * seg * .8 * (links ? 1 : -1) * (flieht ? -1 : 1); qy += Math.sin(aa) * seg * .6; arm.push([qx, Math.min(qy, yB - 2)]); }
    fig.pfad(arm, Math.max(.6, hb * .02), .5);
    x += hb * r.f(.42, .85);
  }
  K.form(eb, fig, Math.max(0, tiefe - .05), { k: STEIN.slice(2, 9), ton: 3.2, fase: 1, rand: tiefe > .5 ? 1 : 2, schatten: 1, sk: B.pk(STEIN[1]) });
  // Sand an der Unterseite des oberen Gesimses (er sammelt sich oben, nicht am Boden)
  B.dith(K.e[eb], x0, yT, x1, yT + hb * .18, SAND[1], (px, py) => (1 - (py - yT) / (hb * .18)) * .55 * B.rausch2(px * .08, 0, 3));
  return gx;
}
function tuer(K, eb, x, yb, w, h, tiefe, glut) {
  const m = B.maske(); m.rect(x - w / 2 - 3, yb - h - 4, w + 6, h + 4); m.rect(x - w / 2, yb - h, w, h, 0);
  K.form(eb, m, tiefe, { k: STEIN.slice(1, 8), ton: 2.8, fase: 1.5 });
  const i = B.maske(); i.rect(x - w / 2, yb - h, w, h); K.form(eb, i, tiefe, { k: ['#030101', '#060202', '#0a0404', '#100606'], ton: 1, rand: 0, fase: 0, verlauf: -.6 });
  if (glut) { K.glut(x, yb - 2, w * .8, OCKER, 1, [eb, 2, 3, 4]); B.dith(K.e[eb], x - w / 2, yb - h * .5, x + w / 2, yb, '#7a3a10', (px, py) => (py - (yb - h * .5)) / (h * .5) * .7); }
}
// Stufen, zu niedrig für Füße: viele dünne Kanten
function stufenBoden(K, P, y0, y1, o) {
  o = o || {}; const sd = K.o.seed;
  K.boden(y0, y1, STEIN, (x, y) => {
    const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z), f = 1 - (y - P.vy) / P.h;
    if (o.nur && !o.nur(X, Z)) return -1;
    let t = .26 + f * .32 + (B.hash(Math.floor(X / 3.4 + (Math.floor(Z / .9) & 1) * .5), Math.floor(Z / .9), sd) - .5) * .12;
    const plat = (X / 3.4 + (Math.floor(Z / .9) & 1) * .5) % 1; if (plat * 3.4 * k < 1 || (Z / .9 % 1) * .9 * k * k / P.h < .7) t -= .14;
    if (o.stufen && Z < o.stufen) { const s = Z / .3 % 1; t = .22 + (s < .18 ? .35 : 0) + f * .2; }
    return t;
  });
}
function sandSaeulen(K, xs, y0, y1) {
  for (const x of xs) B.partikel(K, { n: 18, farben: SAND, x0: x - 5, x1: x + 5, y0, y1, vy: -14, wob: 3, wf: 1.2, p: .5, hellSelten: 1.2 });
}

// =====================================================================
// Variante 0: Reliefhalle, frontale Wand, Band über die ganze Breite
function halle(K) {
  const fr = K.fr, P = B.persp(240, 152), Zw = 9, kw = P.k(Zw), yw = P.q(0, 0, Zw)[1]; K.split = [158, 166];
  B.feld(K.e[0], -M, -M, W + M, H + M, STEIN, (x, y) => .3 + y / H * .3);
  const wm = B.maske(); wm.rect(-M, -M, W + 2 * M, yw + M + 1);
  B.form(K.e[1], wm, K.mat(.05, { k: STEIN.slice(0, 8), ton: 2.7, fase: 0, rand: 0, verlauf: .5, muster: quader(9, 74, 3) }));
  const gx = reliefBand(K, 1, -M, W + M, 30, 66, .02, { gx: 336, seed: K.o.seed + 40 });
  // Absatz unter dem Band, dort stand etwas
  const ab = B.maske(); ab.rect(300, 92, 72, 7); K.form(1, ab, .05, { k: STEIN.slice(1, 8), ton: 2.4, fase: 1, schatten: 2 });
  // Türen am Wandfuß: breit und flach, verschieden breit
  for (const [x, w, g] of [[64, 74, false], [206, 92, true], [400, 66, false]]) tuer(K, 1, x, yw, w, 18, .05, g || fr > .6);
  K.licht(206, yw - 4, '#c08a50', 50, .7);
  // Lichtschacht oben rechts: kühles Licht über die Wand
  B.kegel(K.e[1], 470, -20, Math.PI * .66, .16, 300, '#4a2818', .75);
  B.nebel(K.e[2], { y0: 90, y1: 168, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .26, xs: [30, 450, 60], seed: 2 });
  stufenBoden(K, P, yw, H + M, { stufen: 4.2 });
  // Sand steigt aus Fugen im Boden nach oben
  sandSaeulen(K, [118, 292, 438], 90, 200);
  B.partikel(K, { n: 70, farben: SAND, vx: 2, vy: -9, wob: 4, wf: .6, hellSelten: 1.5, p: 1 });
  const v = B.maske(); v.poly([[-M, -M], [24, -M], [30, H + M], [-M, H + M]]); v.poly([[W + M, -M], [452, -M], [448, H + M], [W + M, H + M]]);
  K.form(5, v, 0, { k: STEIN.slice(0, 5), ton: 1, fase: 2, muster: quader(14, 90, 9) });
  K.reihen = [{ y: 170, skala: .9, nebel: .3 }, { y: 192, skala: 1, nebel: .12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 208] };
}

// Variante 1: Niedriger Gang öffnet sich in eine riesige Halle
function gang(K) {
  const fr = K.fr, P = B.persp(260, 140); K.split = [150, 160];
  B.feld(K.e[0], -M, -M, W + M, H + M, STEIN, (x, y) => .38 + Math.max(0, 1 - Math.hypot(x - 300, y - 110) / 260) * .3 + (B.fbm(x * .01, y * .02, 5, 2) - .5) * .2);
  // riesige Pfeiler in der Halle, ungleich verteilt, fern hell
  for (const [X, Z, w] of [[-14, 30, 3], [-5, 46, 2.6], [6, 38, 2.8], [16, 26, 3.4], [-26, 22, 3.6], [30, 34, 3]]) { const k = P.k(Z), [x, y] = P.q(X, 0, Z), m = B.maske(); m.rect(x - w * k / 2, -M, w * k, y + M); m.rect(x - w * k * .7, y - k * 1.2, w * k * 1.4, k * 1.2); K.form(Z > 30 ? 1 : 2, m, Math.min(.6, Z / 60), { k: STEIN.slice(1, 8), ton: 1.8, fase: 2, verlauf: .5, muster: quader(Math.max(3, Math.round(k * .8)), Math.round(k * 7), X) }); }
  reliefBand(K, 1, 120, 420, 74, 88, .45, { gx: 300, seed: 7 });
  stufenBoden(K, P, P.vy + 1, H + M, {});
  B.nebel(K.e[2], { y0: 70, y1: 156, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .26, xs: [60, 460, 60], seed: 4 });
  // vorne: die hüfthohe Decke als Platte, mit dem Band nah und groß
  const pl = B.maske(); pl.rect(-M, -M, W + 2 * M, 62 + M); pl.rect(-M, -M, 44, H + 2 * M); pl.rect(440, -M, 52, H + 2 * M);
  K.form(5, pl, 0, { k: STEIN.slice(0, 6), ton: 1.2, fase: 3, muster: quader(10, 80, 2) });
  reliefBand(K, 5, -M, W + M, 30, 56, 0, { gx: 120, seed: 9 });
  if (fr < .6) { K.glut(260, 150, 80, OCKER, .6, [1, 2]); }
  sandSaeulen(K, [210, 330], 70, 160);
  B.partikel(K, { n: 60, farben: SAND, vx: 1, vy: -8, wob: 4, wf: .6, hellSelten: 1.5 });
  K.reihen = [{ y: 164, skala: .9, nebel: .3 }, { y: 189, skala: 1, nebel: .12 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [250, 206] };
}

// Variante 2: Am Abgrund. Sand steigt in Schleiern nach oben, von unten ocker beleuchtet
function abgrund(K, o) {
  o = o || {}; const fr = K.fr, P = B.persp(230, 128); K.split = [150, 160];
  B.feld(K.e[0], -M, -M, W + M, H + M, STEIN, (x, y) => .2 + Math.max(0, (y - 40) / 230) * .45 * Math.max(0, 1 - Math.abs(x - 380) / 220) + (B.fbm(x * .01, y * .02, 8, 2) - .5) * .15);
  // ferne Wand jenseits des Abgrunds, mit dem Band klein
  const fw = B.maske(); fw.rect(-M, -M, W + 2 * M, 112 + M); B.form(K.e[1], fw, K.mat(.4, { k: STEIN.slice(1, 7), ton: 1.6, fase: 0, rand: 0, muster: quader(5, 40, 4) }));
  reliefBand(K, 1, -M, W + M, 70, 84, .45, { gx: 160, seed: 13 });
  for (const [x, w] of [[90, 44], [300, 52]]) tuer(K, 1, x, 112, w, 10, .45, true);
  // Abgrund: Leuchten von unten
  K.glut(390, 230, 160, OCKER, 1, [0]);
  // Boden endet rechts an einer zackigen Kante
  const kante = y => 300 + (H - y) * .62 + Math.sin(y * .3) * 6 + Math.sin(y * .11) * 10;
  stufenBoden(K, P, P.vy + 1, H + M, { nur: (X, Z) => true, stufen: 0 });
  for (let y = P.vy + 1; y < H + M; y++) { const e = K.e[K.eb(y)], xk = kante(y); for (let x = Math.floor(xk); x < W + M; x++) e.set(x, y, 0); }
  const km = B.maske(); km.fn(-M, P.vy, W + M, H + M, (x, y) => x < kante(y) && x > kante(y) - 10 && y > P.vy + 2);
  B.form(K.e[4], km, K.mat(0, { k: STEIN.slice(1, 8), ton: 2.2, fase: 1 }));
  // zu niedrige Stufen führen links an der Kante hinab
  const st = B.maske(); for (let i = 0; i < 16; i++) { const y = 170 + i * 6; st.rect(kante(y) - 34 + i * 3, y, 30, 2); }
  K.form(4, st, 0, { k: STEIN.slice(2, 9), ton: 2.6, fase: 0 });
  // Sandschleier steigen aus dem Abgrund
  for (let i = 0; i < 3; i++) B.partikel(K, { n: 60, farben: SAND, x0: 330 + i * 40, x1: 380 + i * 40, y0: 40, y1: H, vy: -16 - i * 4, wob: 6, wf: .5, p: .3, hellSelten: 1.3 });
  B.nebel(K.e[2], { y0: 80, y1: 150, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .25, xs: [20, 300, 60], seed: 6 });
  if (o.spalt) { const sp = B.maske(); sp.poly([[340, H + M], [380, 170], [420, 150], [460, 180], [480 + M, H + M]]); B.form(K.e[3], sp, K.mat(0, { k: ['#02030a', '#050a14', '#0a1426', '#14243a'], r: ['#5a8ab0', '#e8f6ff'], ton: 1.2 })); K.glut(410, 200, 70, '#0a1a30', 1, [3]); }
  if (fr < .7) B.flamme(K, 120, 160, { p: .3 });
  K.reihen = [{ y: 166, skala: .9, nebel: .3 }, { y: 190, skala: 1, nebel: .12 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [200, 206] };
}

// Wächter: das Band nah und groß
function waechter(K) {
  const P = B.persp(240, 176), Zw = 4, yw = P.q(0, 0, Zw)[1]; K.split = [180, 190];
  B.feld(K.e[0], -M, -M, W + M, H + M, STEIN, () => .3);
  const wm = B.maske(); wm.rect(-M, -M, W + 2 * M, yw + M); B.form(K.e[1], wm, K.mat(.05, { k: STEIN.slice(0, 7), ton: 1.8, fase: 0, rand: 0, muster: quader(14, 120, 6) }));
  reliefBand(K, 1, -M, W + M, 22, 150, 0, { gx: 300, seed: 3 });
  tuer(K, 1, 120, yw, 120, 22, .05, true);
  stufenBoden(K, P, yw, H + M, { stufen: 3 });
  sandSaeulen(K, [80, 220, 420], 30, 200);
  B.partikel(K, { n: 70, farben: SAND, vx: 2, vy: -10, wob: 4, wf: .6, hellSelten: 1.5 });
  K.reihen = [{ y: 190, skala: .9, nebel: .25 }, { y: 202, skala: 1, nebel: .1 }, { y: 215, skala: 1, nebel: 0 }];
  return { mitte: [240, 210] };
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'kraemer' ? 1 : art === 'wandbild' ? 0 : (o.seed + v) % 3;
  K.kulisse = art === 'waechter' ? 'waechter' : v; // M3: welche Kulisse die Szene zeigt (Schlüssel für die Fahrt, data/fahrt.json)
  let info;
  if (art === 'waechter') info = waechter(K);
  else if (art === 'uebergang') info = abgrund(K, { spalt: true });
  else info = [halle, gang, abgrund][v](K);
  B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.stadt = { pal, build: bauen, reliefStil: { figuren: 5, gelenke: 6, knick: 1 } };
})();
