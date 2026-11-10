// Saltmoor 1925 · Hintergründe: Akt IV, Die Walkathedrale (Biom-Paket walkathedrale).
// Komposition: docs/auftrag-2/biome/walkathedrale.md. Ein Walskelett, so groß wie ein Berg, im Eis eingeschlossen.
// Man geht durch die Rippen wie durch ein Kirchenschiff. Wahrzeichen: das Herz, ein dunkler Raum am Ende, in dem es
// sehr langsam schlägt (Glimmen, das pulsiert). Falsches Detail: Das Skelett ist nicht fertig, es wächst nach innen
// (Rippenenden haken nach innen, junge Rippen treiben aus dem Boden zur Mitte). Licht: kalt durch einen Riss im Eis
// hinten oben rechts (Gegenlicht), warm aus dem Mark der Knochen und aus den Tranlampen der Walfänger.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#04050a', '#0a0c15', '#161a26', '#2a2e3e'], rand: ['#958a74', '#f2e8ce'], augen: '#ff8c70', nebel: ['#080a12', '#2a2e3c'] };
const KNOCHEN = ['#06070b', '#0f1016', '#1a1b21', '#28282c', '#3a3835', '#534e45', '#71695a', '#968a72'];
const EIS = ['#020308', '#04070f', '#070c18', '#0b1322', '#111c30', '#19283f', '#24364f', '#33496a'];
const EISBODEN = ['#030409', '#060a12', '#0a101c', '#101828', '#172235', '#202e44'];
const HOLZ = ['#070504', '#110b07', '#1c130c', '#2a1c11', '#3a2717'];
const MARK = '#ff8c70', MARK_K = '#fff0e4', MARK_G = '#2c1014', MARK_G2 = '#4a1a20', MARK_D = '#a8362f';
const TRAN = '#e8a447', TRAN_K = '#fff2c8', TRAN_G = '#2e1e08';
const KALT = '#b8d0ec', KALT_G = '#141e30', KALT_G2 = '#1e2c44';
const frac = v => v - Math.floor(v);

// ---------- Bausteine ----------
// Knochen-Material: Poren und Längsrillen als Muster, Fase und Randlicht wie die Figuren
const knochenMat = (ton, x) => Object.assign({ k: KNOCHEN, ton, fase: 1.5, rand: 2, schatten: 2, muster: (px, py, d) => (B.hash(px >> 1, py >> 1, 17) < .07 ? -1.2 : 0) + (B.hash(px, py, 5) < .04 ? .8 : 0) + (d > 3 ? -.25 : 0) }, x || {});
// Eine Rippe als Kurve in 3D (X seitlich, Y Höhe, Z Tiefe) -> Bildpunkte, Dicke in Welt-Einheiten
function rippe3(K, P, eb, pts3, dicke, tiefe, ton, glimmen) {
  const pts = pts3.map(([X, Y, Z]) => P.q(X, Y, Z)), rs = pts3.map(([, , Z]) => Math.max(.7, dicke * P.k(Z)));
  const m = B.maske(); for (let i = 0; i < pts.length - 1; i++) m.kap(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], rs[i], rs[i + 1]);
  K.form(eb, m, tiefe, knochenMat(ton));
  // Riss im Knochen, aus dem das Mark glimmt
  if (glimmen) {
    const e = K.e[eb], a = Math.floor(pts.length * .3), b = Math.floor(pts.length * .62);
    for (let i = a; i < b; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], n = Math.ceil(Math.hypot(x1 - x0, y1 - y0)); for (let j = 0; j <= n; j++) { const x = x0 + (x1 - x0) * j / n + Math.sin(j * 1.7 + i) * .6, y = y0 + (y1 - y0) * j / n; const q = (i - a + j / n) / (b - a), v = Math.sin(q * Math.PI) * glimmen; e.set(x, y, B.pk(v > .7 ? MARK : v > .35 ? MARK_D : MARK_G2)); } }
    const [gx, gy] = pts[Math.floor((a + b) / 2)]; K.glut(gx, gy, Math.max(6, rs[a] * 4) * glimmen, MARK_G, .9 * glimmen, [eb]); K.licht(gx, gy, MARK, rs[a] * 5, .5 * glimmen);
  }
  return pts;
}
// Eis als Hintergrund (Ebene 0): Schichten, eingeschlossene Luft, hell nur dort, wo der Riss Licht hereinlässt
function eisWand(K, rx, ry, o) {
  o = o || {};
  B.feld(K.e[0], -M, -M, W + M, H + M, EIS, (x, y) => {
    const schicht = Math.sin((y + B.fbm(x * .01, y * .02, 3, 2) * 40) * .09) * .06, licht = Math.max(0, 1 - Math.hypot((x - rx) / 260, (y - ry) / 200));
    return .12 + licht * .55 + schicht + B.fbm(x * .015, y * .03, 8, 3) * .22 + (o.unten ? Math.max(0, (y - o.unten) / 200) * .2 : 0);
  });
  // eingeschlossene Luftblasen, in Schnüren nach oben
  const r = K.r; for (let i = 0; i < 26; i++) { let x = r.f(0, W), y = r.f(0, H * .8); const n = r.i(3, 9); for (let k = 0; k < n; k++) { K.e[0].set(x, y, B.pk(k % 3 ? EIS[6] : EIS[7])); y -= r.f(2, 6); x += r.j(1.5); } }
}
// Riss im Eis, durch den kaltes Licht fällt (Gegenlicht von hinten oben rechts)
function lichtRiss(K, x, y, len, ang, ebenen) {
  const e = K.e[0], r = B.rng(x * 7 + y); let px = x, py = y;
  for (let k = 0; k < len; k++) { e.set(px, py, B.pk(k % 5 ? KALT : '#ffffff')); e.set(px + 1, py, B.pk(EIS[7])); px += Math.cos(ang) + r.j(.9); py += Math.sin(ang) + r.j(.4); }
  B.gluehen(e, x + Math.cos(ang) * len / 2, y + Math.sin(ang) * len / 2, len * .9, KALT_G2, .9);
  for (const i of ebenen || [1, 2, 3]) B.kegel(K.e[i], x + Math.cos(ang) * len / 2, y + Math.sin(ang) * len / 2, Math.PI * .72, .28, 330, KALT_G, .5);
  K.licht(x, y, KALT, 160, .6);
}
// Tranlampe der Walfänger auf einem Stock (Harpunenschaft). Warmes Licht; mit der Fremdheit aus
function tranlampe(K, P, X, Z, an) {
  const [x0, y0] = P.q(X, 0, Z), [x1, y1] = P.q(X, 1.15, Z), k = P.k(Z), eb = K.eb(y0), m = B.maske();
  m.kap(x0, y0, x1, y1, Math.max(.5, k * .018), Math.max(.5, k * .014)); m.rect(x1 - k * .05, y1 - k * .02, k * .1, Math.max(1, k * .03));
  m.kap(x1, y1, x1 + k * .04, y1 + k * .06, .5, .5); m.rect(x1 + k * .01, y1 + k * .06, Math.max(2, k * .07), Math.max(2, k * .09));
  K.form(eb, m, Math.min(.6, Z / 20), { k: HOLZ, ton: 1.5, fase: 0, rand: 1 });
  if (!an) return;
  const lx = Math.round(x1 + k * .045), ly = Math.round(y1 + k * .11);
  B.flamme(K, lx, ly, { p: B.PAR[eb], kern: TRAN_K, mitte: TRAN, aussen: '#8a4a10', glut: TRAN_G, gross: k > 60 ? 2 : 1 });
  K.glut(lx, ly, k * .5, TRAN_G, .9, [eb]); K.glut(x0, y0, k * .35, TRAN_G, .7, [K.eb(y0)]);
}
// Das Herz in der Ferne: dunkle Öffnung (Spitzbogen) mit Glimmen, das langsam schlägt
function herzFerne(K, x, y, w, h, eb) {
  const m = B.maske(); m.fn(x - w / 2, y - h, x + w / 2, y, (px, py) => { const q = (y - py) / h; return Math.abs(px - x) < w / 2 * Math.min(1, Math.sqrt(Math.max(0, 1 - q * q * q)) * 1.05); });
  B.form(K.e[eb], m, K.mat(0, { k: ['#000000', '#020103', '#050206', '#0a0309'], ton: .5, fase: 0, rand: 0, verlauf: -1 }));
  B.gluehen(K.e[eb], x, y - h * .35, w * .9, MARK_G, 1);
  K.licht(x, y - h * .35, MARK, w * 2, .7);
  const g1 = B.glanzSprite(w * .55, MARK_G2, .9), g2 = B.glanzSprite(w * .75, MARK_G2, .95);
  // Schlag: kurz zweimal, dann lange Pause (sehr langsam)
  K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) {
    const ph = frac(t / 4.2), s = ph < .08 ? 1 : ph < .14 ? .3 : ph < .22 ? .8 : 0;
    if (s <= 0) return; const g = s > .6 ? g2 : g1;
    ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, x - g.R + ox, y - h * .35 - g.R + oy); ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = s > .6 ? MARK : MARK_D; ctx.fillRect(Math.round(x) + ox, Math.round(y - h * .35) + oy, 1, 2);
  } });
}
// Eisboden mit Bohlenweg der Expedition (Planken quer) und eingefrorenen Knochensplittern
function boden(K, P, y0, wegB) {
  K.bodenStoffe(y0, H + M, [{ cols: EISBODEN, tf: (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; const n = B.fbm(X * 1.4, Z * 1.1, 21, 3), riss = Math.abs(B.fbm(X * 2.2, Z * 1.6, 44, 2) - .5) < .018 * Math.min(3, Z); return .3 + n * .35 + Math.min(.3, Z / 30) - (riss ? .3 : 0) + (B.hash(Math.floor(X * 9), Math.floor(Z * 9), 9) < .006 ? .5 : 0) - Math.max(0, 1.6 - Z) * .15; } },
    { cols: HOLZ, tf: (x, y) => { const Z = P.z(y + .5); return frac(Z * 2.6) < .16 ? 0 : .22 + B.hash(Math.floor(Z * 2.6), 1, 4) * .3 + (frac(Z * 2.6) > .82 ? .18 : 0) + Math.min(.25, Z / 40); } }],
  (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; return wegB && Math.abs(X - wegB[0]) < wegB[1] && Z < wegB[2] ? 1 : 0; });
}
// Junge Rippe, die aus dem Boden treibt und sich zur Mitte krümmt (falsches Detail)
function trieb(K, P, X, Z, gross) {
  const s = Math.sign(X) || 1, pts = []; for (let i = 0; i <= 6; i++) { const q = i / 6; pts.push([X - s * q * q * .7 * gross, q * .95 * gross, Z]); }
  rippe3(K, P, K.eb(P.q(X, 0, Z)[1]), pts, .055 * gross, Math.min(.5, Z / 20), 1.6 + Z * .08);
}

// =====================================================================
// Variante 0: Das Kirchenschiff. Blick entlang der Wirbelsäule; die Rippen bilden Spitzbögen links und rechts,
// die in die Tiefe kleiner werden. Ein Bohlenweg der Expedition in der Mitte, Tranlampen an Stöcken.
// Am Ende, im Fluchtpunkt: die dunkle Öffnung zum Herzen.
function schiff(K, cfg) {
  const fr = K.fr, P = B.persp(250, 128); K.split = [146, 166];
  eisWand(K, 430, 20);
  lichtRiss(K, 392, -4, 70, 1.15);
  // Ferne: Herz am Fluchtpunkt
  const [hx, hy] = P.q(0, 0, 22); herzFerne(K, hx, hy, 26, 40, 1);
  // Rippen: Spitzbögen von vorn nach hinten, die Enden haken nach innen
  const Xw = 3.3, Ya = 6.4;
  for (let i = 11; i >= 0; i--) {
    const Z = 1.25 * Math.pow(1.3, i), tiefe = Math.min(.82, Z / 20), eb = Z < 1.75 ? 5 : Z < 2.6 ? 4 : Z < 5 ? 3 : Z < 10 ? 2 : 1;
    for (const s of [-1, 1]) {
      const pts = [];
      // Hakenende (nach innen, frei über dem Boden), dann der Bogen hinauf zum Grat
      pts.push([s * (Xw - .75), .55, Z], [s * (Xw - .35), .3, Z], [s * Xw, .7, Z]);
      for (let k = 1; k <= 9; k++) { const u = k / 9; pts.push([s * Xw * Math.pow(Math.cos(u * Math.PI / 2), .75), .7 + (Ya - .7) * Math.pow(Math.sin(u * Math.PI / 2), .85), Z + u * .15]); }
      rippe3(K, P, eb, pts, .14 + (i % 2) * .02, tiefe, 1.3 + tiefe * 1.6, (i % 3 === 1 && Z > 2.4 && Z < 16) ? .9 + fr * .3 : 0);
    }
    // Wirbel am Grat: Knoten mit Dornfortsatz
    const [vx, vy] = P.q(0, Ya + .25, Z + .15), k = P.k(Z), m = B.maske(); m.ell(vx, vy, k * .32, k * .2); m.kap(vx, vy, vx + k * .05, vy - k * .38, k * .07, k * .03);
    K.form(eb, m, tiefe, knochenMat(1.3 + tiefe * 1.6));
  }
  // Grat zwischen den Wirbeln
  const g = B.maske(); for (let i = 0; i < 11; i++) { const Z1 = 1.25 * Math.pow(1.3, i), Z2 = Z1 * 1.3; g.kap(...P.q(0, Ya + .25, Z1), ...P.q(0, Ya + .25, Z2), P.k(Z1) * .08, P.k(Z2) * .08); }
  K.form(2, g, .3, knochenMat(1.6));
  boden(K, P, P.vy, [0, .38, 24]);
  // Junge Rippen aus dem Boden, zur Mitte gekrümmt
  for (const [X, Z, gr] of [[-1.6, 2.6, 1], [1.9, 3.3, .8], [-2.2, 5.5, .9], [1.4, 7.5, .7], [-1.2, 11, .6]]) trieb(K, P, X, Z, gr * (1 + fr * .4));
  // Tranlampen am Weg; mit der Fremdheit verlöschen die hinteren
  [[-.8, 2.2], [.8, 3.1], [-.8, 4.6], [.8, 6.8], [-.8, 10]].forEach(([X, Z], i) => tranlampe(K, P, X, Z, fr < .45 || (fr < .8 ? i < 3 : i < 1)));
  B.nebel(K.e[2], { y0: P.vy - 26, y1: P.vy + 14, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .22, xs: [80, 420, 60], seed: 4 });
  B.partikel(K, { n: 34, farben: ['#2a3448', '#46546c', '#6a7a94'], vx: -1.5, vy: 4, wob: 3, wf: .4, x0: 180, x1: 480, y0: 0, y1: 200 });
  K.reihen = [{ y: 172, skala: .9, nebel: .3 }, { y: 193, skala: 1, nebel: .12 }, { y: 215, skala: 1, nebel: 0 }];
  return { mitte: [250, 214], P };
}

// =====================================================================
// Variante 1: Die Flanke. Von außen, auf dem Eis neben dem Wal: Die Rippen stehen als riesige Bögen in einer Reihe
// in die Tiefe, oben läuft die Wirbelsäule wie ein Grat. Man sieht, dass er so groß ist wie ein Berg. Im Bauch
// glimmt das Herz durch die Rippen. Vorn das Lager der Expedition (Zelt, Schlitten, Lampe) als Maßstab.
function flanke(K, cfg) {
  const fr = K.fr, P = B.persp(250, 150); K.split = [160, 176];
  eisWand(K, 460, 40, { unten: 120 });
  lichtRiss(K, 452, 10, 70, 1.85);
  // Das ganze Gerippe in der Ferne, halb im Eis: Grat von links (Schädel) bis rechts (Schwanz), Rippen als Bögen
  const grat = t => [20 + t * 470, 150 - Math.sin(Math.min(1, t * 1.25) * Math.PI * .5) * 118 * (1 - Math.max(0, t - .55) * 1.2) - 6];
  const [hx0, hy0] = grat(.5); herzFerne(K, hx0 + 10, 133, 26, 40, 1);
  const gm = B.maske(); const gp = []; for (let k = 0; k <= 30; k++) gp.push(grat(.12 + k / 30 * .86)); gm.pfad(gp, 4, 2);
  for (let i = 0; i < 20; i++) { const t = .14 + i * .043, [x, y] = grat(t), lh = 150 - y; if (lh < 8) continue; const pts = []; for (let k = 0; k <= 8; k++) { const u = k / 8; pts.push([x - Math.sin(u * Math.PI) * lh * .22 + u * 6, y + u * lh * 1.02]); } pts.push([x + 2, 150 - lh * .1]); gm.pfad(pts, 3, 1.5); gm.ell(x, y - 3, 4, 3); }
  // Schädel links: lang, flach, mit Augenhöhle, in der Mark glimmt
  gm.poly([[-M, 150], [-M, 112], [30, 100], [70, 106], [96, 124], [104, 150]]);
  K.form(1, gm, .42, knochenMat(1.1, { verlauf: .5 }));
  B.gluehen(K.e[1], 62, 118, 16, MARK_G, 1); K.e[1].set(62, 118, B.pk(MARK)); K.licht(62, 118, MARK, 30, .4);
  // Eisrücken, in dem das Gerippe steckt: davor, bis über die Rippenansätze
  const er = B.maske(); er.fn(-M, 100, W + M, 160, (x, y) => y > 136 - Math.sin(x * .03) * 6 - B.fbm(x * .02, 1, 5, 2) * 14);
  K.form(2, er, .32, { k: EIS.slice(1), ton: 2, fase: 1.5, rand: 2, verlauf: -.6, muster: (x, y) => (Math.abs(frac((x * .35 + y * 1.2 + B.fbm(x * .05, y * .1, 3, 2) * 18) / 9) - .5) < .06 ? -.7 : 0) + (B.hash(x >> 1, y >> 1, 12) < .03 ? .8 : 0) });
  // Eis, das an den Rippen hochgeworfen ist (Schollen), dahinter Dunst
  B.nebel(K.e[2], { y0: P.vy - 30, y1: P.vy + 12, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .22, xs: [100, 480, 80], seed: 7 });
  boden(K, P, P.vy, [-3.2, .3, 6]);
  for (let i = 0; i < 7; i++) { const [x, y] = P.q(-1.4 + (i % 3) * .3, 0, 2 + i * 1.3), k = P.k(2 + i * 1.3), m = B.maske(); m.poly([[x - k * .3, y], [x - k * .1, y - k * .25], [x + k * .25, y - k * .12], [x + k * .35, y]]); K.form(K.eb(y), m, Math.min(.6, i / 10), { k: EIS.slice(1), ton: 2.4, fase: 1.5, rand: 2, schatten: 2 }); }
  // Lager der Expedition: Zelt, Schlitten, Lampe
  const [tx, ty] = P.q(-4.2, 0, 4.2), k = P.k(4.2), zm = B.maske();
  zm.poly([[tx - k * .7, ty], [tx - k * .05, ty - k * .85], [tx + k * .1, ty - k * .9], [tx + k * .75, ty], [tx + k * .2, ty + 2]]);
  K.form(3, zm, .05, { k: ['#08090c', '#121318', '#1e1f26', '#2c2d35', '#3e3e46'], ton: 1.4, fase: 1.5, rand: 2, schatten: 2, muster: (px, py) => ((px - tx) % 7 === 0 ? -.4 : 0) });
  const zo = B.maske(); zo.poly([[tx - k * .12, ty], [tx - k * .02, ty - k * .5], [tx + k * .1, ty]]); B.form(K.e[3], zo, K.mat(0, { k: ['#000000', '#140a04', '#2a1608'], ton: fr < .6 ? 1.6 : .4, fase: 0, rand: 0 }));
  if (fr < .6) { K.glut(tx, ty - k * .1, k * .4, TRAN_G, 1, [3]); K.e[3].set(tx, ty - 3, B.pk(TRAN)); K.e[3].set(tx, ty - 2, B.pk(TRAN_K)); K.licht(tx, ty - 6, TRAN, 30, .6); }
  const [sx, sy] = P.q(-3.9, 0, 2.6), ks = P.k(2.6), sl = B.maske(); sl.rect(sx - ks * .5, sy - ks * .18, ks, ks * .05); sl.kap(sx - ks * .55, sy, sx + ks * .5, sy, 1, 1); sl.kap(sx - ks * .55, sy, sx - ks * .62, sy - ks * .1, 1, 1);
  for (let j = 0; j < 3; j++) sl.rect(sx - ks * .4 + j * ks * .35, sy - ks * .18, 1.5, ks * .18); sl.rect(sx - ks * .35, sy - ks * .34, ks * .5, ks * .16);
  K.form(3, sl, .05, { k: HOLZ, ton: 1.4, fase: 1, rand: 2, schatten: 2 });
  tranlampe(K, P, -3, 2.1, fr < .5);
  // Vorn: Rippenbruchstücke im Eis, und junge Rippen, die aus dem Eis treiben, alle zum Wal hin gekrümmt
  rippe3(K, P, 4, [[3.6, 0, 1.6], [3.3, 1, 1.6], [2.6, 2.2, 1.6], [1.8, 2.6, 1.6], [1.4, 2.4, 1.6]], .12, 0, 1.2, 0);
  rippe3(K, P, 3, [[4.4, 0, 2.6], [4.2, 1.2, 2.6], [3.6, 2.4, 2.6], [3, 2.8, 2.6]], .12, .05, 1.4, .8);
  trieb(K, P, 1.6, 2.4, 1); trieb(K, P, -1.4, 3.6, .8); trieb(K, P, 2.6, 5, .7);
  // Vordergrund: Eisscholle unten links, Rippenende oben rechts angeschnitten
  const v = B.maske(); v.poly([[-M, 236], [40, 228], [80, 246], [70, H + M], [-M, H + M]]); K.form(5, v, 0, { k: EIS.slice(0, 5), ton: 1, fase: 2, rand: 2 });
  B.partikel(K, { n: 34, farben: ['#2a3448', '#46546c', '#6a7a94'], vx: -2, vy: 3, wob: 2, wf: .4, x0: 0, x1: 480, y0: 0, y1: 220 });
  K.reihen = [{ y: 180, skala: .9, nebel: .28 }, { y: 199, skala: 1, nebel: .1 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [200, 214], P };
}

// =====================================================================
// Variante 2: Die Wirbelkrypta. Die Wirbel stehen wie Säulen einer Krypta in einer Reihe in die Tiefe (links),
// durch jeden geht der Rückenmarkskanal, und im Kanal glimmt das Mark: eine Reihe Lichter in die Ferne.
// Rechts die Rippenansätze wie Strebepfeiler, die Decke ist Eis.
function krypta(K, cfg) {
  const fr = K.fr, P = B.persp(300, 140); K.split = [156, 172];
  eisWand(K, 470, -10);
  lichtRiss(K, 470, 4, 50, 2.2);
  const [hx, hy] = P.q(-.9, 0, 26); herzFerne(K, hx, hy, 16, 26, 1);
  boden(K, P, P.vy, [.9, .36, 20]);
  for (let i = 9; i >= 0; i--) {
    const Z = 2.3 * Math.pow(1.3, i), tiefe = Math.min(.8, Z / 22), eb = Z < 2.9 ? 4 : Z < 4.5 ? 3 : Z < 9 ? 2 : 1, k = P.k(Z);
    // Wirbelkörper (Scheibe), Bogen mit Kanal, Dornfortsatz nach hinten oben, Querfortsätze
    const [cx, cy] = P.q(-2.4, .95, Z), m = B.maske();
    m.ell(cx, cy, k * .46, k * .62); m.poly([[cx - k * .36, cy - k * .7], [cx - k * .3, cy - k * 1.3], [cx, cy - k * 1.48], [cx + k * .3, cy - k * 1.3], [cx + k * .36, cy - k * .7]]); m.kap(cx, cy - k * 1.3, cx + k * .35, cy - k * 2.7, k * .16, k * .06);
    m.kap(cx - k * .25, cy - k * .75, cx - k * .75, cy - k * .95, k * .1, k * .04); m.kap(cx + k * .25, cy - k * .75, cx + k * .7, cy - k * .92, k * .1, k * .04);
    m.ell(cx, cy - k * 1.02, k * .17, k * .16, 0);
    K.form(eb, m, tiefe, knochenMat(1.2 + tiefe * 1.8, { verlauf: .4 }));
    // Bandscheibe darunter zum Boden: Eis, in dem der Wirbel steht
    const s = B.maske(); s.ell(cx, cy + k * .78, k * .55, k * .08); B.form(K.e[eb], s, K.mat(tiefe, { k: EIS.slice(1, 6), ton: 2, fase: 0, rand: 1 }));
    // Kanal: das Mark glimmt
    const gl = (.85 + fr * .3) * (i % 2 ? 1 : .8), e = K.e[eb];
    B.gluehen(e, cx, cy - k * 1.02, k * .45, MARK_G2, gl); e.set(cx, cy - k * 1.02, B.pk(i < 4 ? MARK : MARK_D)); if (k > 40) { e.set(cx + 1, cy - k * 1.02, B.pk(MARK)); e.set(cx, cy - k * 1.02 + 1, B.pk(MARK_K)); }
    K.licht(cx, cy - k * 1.02, MARK, k * .9, .45);
    // Rippenansatz rechts als Strebepfeiler, haken nach innen
    if (i < 8) rippe3(K, P, eb, [[3.6, 0, Z], [3.4, 1.6, Z], [3.2, 3.2, Z], [2.4, 4.4, Z], [1.6, 4.1, Z], [1.3, 3.6, Z]], .16, tiefe, 1.2 + tiefe * 1.7, i === 4 ? 1 : 0);
  }
  // Decke: Eis mit Zapfen, die nach innen (zur Wirbelreihe) gebogen sind
  for (let i = 0; i < 14; i++) { const x = 20 + i * 34 + (i % 3) * 7, l = 14 + (i * 13 % 17), m = B.maske(); m.poly([[x - 5, -M], [x + 5, -M], [x + 1, l], [x - 3, l + 6]]); K.form(2, m, .3, { k: EIS.slice(2), ton: 2, fase: 1, rand: 2 }); }
  trieb(K, P, .2, 2.4, .8); trieb(K, P, 2.1, 3.6, 1);
  tranlampe(K, P, .4, 2, fr < .5); tranlampe(K, P, 1.4, 4.5, fr < .3);
  B.nebel(K.e[2], { y0: P.vy - 24, y1: P.vy + 12, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .25, xs: [120, 480, 60], seed: 9 });
  B.partikel(K, { n: 26, farben: ['#4a1a20', '#a8362f'], vx: 0, vy: -2, wob: 2, wf: .5, x0: 0, x1: 300, y0: 40, y1: 200, blink: 1.3 });
  K.reihen = [{ y: 178, skala: .9, nebel: .3 }, { y: 197, skala: 1, nebel: .12 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [260, 214], P };
}

// =====================================================================
// Wächter: Die Herzkammer. Frontal, ein dunkler Raum; Wände aus Muskelbalken wie Säulen, von der Decke hängen
// Sehnenfäden wie Glockenseile; von allen Seiten wachsen Knochendorne nach innen, zur Mitte, wo das Herz steht.
// Das Glimmen hinter dem Herzen schlägt mit.
function kammer(K, cfg) {
  const fr = K.fr, P = B.persp(240, 150); K.split = [170, 184];
  B.feld(K.e[0], -M, -M, W + M, H + M, ['#030104', '#06030a', '#0a0510', '#120818', '#1a0c1e', '#24101e'], (x, y) => .15 + Math.max(0, 1 - Math.hypot((x - 240) / 230, (y - 120) / 150)) * .7 + B.fbm(x * .03, y * .02, 12, 3) * .2);
  lichtRiss(K, 430, -6, 40, 1.8, [1, 2]);
  // Muskelbalken der Kammerwand: senkrechte, verdrehte Säulen in drei Tiefen
  [[.55, 1, 12], [.3, 2, 9], [.12, 3, 7]].forEach(([tiefe, eb, n], j) => {
    for (let i = 0; i < n; i++) {
      const x = (i + .5) / n * (W + 40) - 20 + j * 13, m = B.maske(), w = 5 + j * 3 + (i % 2) * 2, pts = [];
      for (let k = 0; k <= 8; k++) pts.push([x + Math.sin(k * .9 + i) * (3 + j), -M + k * (H * .72 + 2 * M) / 8]);
      if (Math.abs(x - 240) < 70 + j * 10 && j > 0) continue;
      m.pfad(pts, w, w * .7); m.ell(pts[8][0], pts[8][1], w * 1.8, w * .8);
      K.form(eb, m, tiefe, { k: ['#050208', '#0c0510', '#150a18', '#201022', '#2c1628', '#3a1e30'], ton: 1.6, fase: 1.5, rand: 2, schatten: 2, muster: (px, py) => (frac((py + px * .3) / 6) < .2 ? -.6 : 0) });
    }
  });
  // Sehnenfäden von der Decke, wie Glockenseile
  const se = B.maske(); for (let i = 0; i < 9; i++) { const x = 90 + i * 37, l = 60 + (i * 29 % 50); se.kap(x, -M, x + Math.sin(i) * 6, l, .8, .6); se.ell(x + Math.sin(i) * 6, l + 2, 2, 3); }
  K.form(2, se, .2, knochenMat(2.8));
  // Glimmen hinter dem Herzen (schlägt mit dem Herzen)
  B.gluehen(K.e[1], 240, 110, 120, MARK_G, .9); K.licht(240, 110, MARK, 140, .7);
  const ga = B.glanzSprite(70, MARK_G2, .8), gb = B.glanzSprite(95, MARK_G2, .85);
  K.anim.push({ p: .05, f(ctx, t, ox, oy) { const ph = frac(t / 2.4), s = ph < .1 ? 1 : ph < .18 ? .4 : ph < .26 ? .8 : 0; if (!s) return; const g = s > .6 ? gb : ga; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, 240 - g.R + ox, 112 - g.R + oy); ctx.globalCompositeOperation = 'source-over'; } });
  // Boden: Schale aus Knochen, Fluchtlinien als Rillen zur Mitte
  K.boden(P.vy, H + M, KNOCHEN.slice(0, 6), (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, a = Math.atan2(Z - 3, X); return .3 + B.fbm(X, Z, 31, 2) * .3 + (frac(a * 5) < .08 ? -.25 : 0) + Math.max(0, .3 - Math.abs(X) * .1) * .5; });
  // Knochendorne von beiden Seiten nach innen, zur Mitte, knapp vor dem Herzen
  for (const [X, Z, l] of [[-4.5, 2, 2.4], [4.4, 2.2, 2.3], [-3.6, 3.4, 1.8], [3.8, 3.1, 1.9], [-5.2, 1.5, 3], [5, 1.6, 2.8]]) {
    const s = Math.sign(X), pts = []; for (let i = 0; i <= 7; i++) { const q = i / 7; pts.push([X - s * l * q, .2 + Math.sin(q * 2.2) * 1.1 + q * .4, Z - q * .2]); }
    rippe3(K, P, Z < 1.8 ? 4 : 3, pts, .1, Math.min(.4, Z / 12), 2.6, Math.abs(X) < 4 ? .8 : 0);
  }
  // Rahmen: große Rippenbögen vorn oben links und rechts
  const v = B.maske(); v.pfad([[-M, 200], [10, 120], [40, 50], [90, -M]], 16, 10); v.pfad([[W + M, 210], [470, 120], [440, 40], [390, -M]], 16, 10);
  K.form(5, v, 0, knochenMat(1.4));
  B.partikel(K, { n: 30, farben: ['#4a1a20', '#a8362f', '#ff8c70'], vx: 0, vy: -3, wob: 3, wf: .5, x0: 120, x1: 360, y0: 40, y1: 220, blink: 1.5, hellSelten: 2.5 });
  K.reihen = [{ y: 186, skala: .9, nebel: .25 }, { y: 202, skala: 1, nebel: .1 }, { y: 218, skala: 1, nebel: 0 }];
  return { mitte: [240, 216], P };
}

// ---------- Zusätze je Art ----------
// Krämer: der Walfänger. Tranfässer, ein Gestell mit Harpunen und Flenseisen, eine Lampe
function kraemerStand(K, x, y) {
  const m = B.maske();
  for (let i = 0; i < 3; i++) { const fx = x - 50 + i * 22; m.ell(fx, y - 13, 10, 13); }
  m.ell(x - 39, y - 36, 10, 11);
  m.rect(x + 10, y - 70, 3, 70); m.rect(x + 52, y - 70, 3, 70); m.rect(x + 8, y - 72, 50, 4); m.rect(x + 8, y - 30, 50, 3);
  for (let i = 0; i < 4; i++) m.kap(x + 16 + i * 10, y - 68, x + 18 + i * 10, y - 2, 1, 1);
  K.form(4, m, 0, { k: HOLZ, ton: 1.7, fase: 1, rand: 2, schatten: 2, muster: (px, py) => ((py - y) % 5 === 0 && px < x ? -.6 : 0) });
  const ei = B.maske(); for (let i = 0; i < 4; i++) { const hx = x + 17 + i * 10; ei.poly([[hx - 3, y - 70], [hx + 1, y - 84], [hx + 4, y - 70]]); } ei.poly([[x + 44, y - 26], [x + 60, y - 22], [x + 44, y - 18]]);
  K.form(4, ei, 0, knochenMat(3.2, { k: ['#0a0b0e', '#1c1d22', '#30313a', '#4a4c56', '#7a7e8a', '#b0b4c0'] }));
  B.flamme(K, x - 39, y - 49, { p: .5, kern: TRAN_K, mitte: TRAN, aussen: '#8a4a10', glut: TRAN_G, gross: 2 }); K.glut(x - 39, y - 46, 70, TRAN_G, 1, [3, 4]);
}
// Ereignis / Fund: ein Walzahn mit Ritzzeichnung auf einer Seekiste, daneben eine Lampe
function walzahn(K, x, y) {
  const m = B.maske(); m.rect(x - 16, y - 14, 32, 14); m.poly([[x - 17, y - 14], [x - 14, y - 19], [x + 14, y - 19], [x + 17, y - 14]]);
  K.form(4, m, 0, { k: HOLZ, ton: 1.7, fase: 1, rand: 2, schatten: 2, muster: (px, py) => (py === y - 8 ? -1 : 0) });
  const z = B.maske(); z.poly([[x - 9, y - 19], [x + 8, y - 19], [x + 4, y - 30], [x - 2, y - 38], [x - 5, y - 32]]);
  K.form(4, z, 0, knochenMat(4.4));
  const e = K.e[4]; for (let k = 0; k < 6; k++) e.set(x - 3 + k, y - 25 + (k % 2), B.pk(KNOCHEN[1]));
  e.set(x - 1, y - 29, B.pk(MARK)); B.gluehen(e, x - 1, y - 29, 12, MARK_G2, .9); K.licht(x, y - 28, MARK, 26, .5);
  B.flamme(K, x + 26, y - 6, { p: .5, kern: TRAN_K, mitte: TRAN, aussen: '#8a4a10', glut: TRAN_G }); K.glut(x + 26, y - 6, 40, TRAN_G, .9, [3, 4]);
}
// Übergang: Unter dem Herzen ist der Boden kein Eis mehr, nur eine Öffnung nach unten, und von unten kommt Wasser-Licht
function abstieg(K, x, y) {
  const m = B.maske(); m.ell(x, y, 60, 14); B.form(K.e[4], m, K.mat(0, { k: ['#000000', '#010204', '#030509', '#060a12'], ton: 0, rand: 0, fase: 0, verlauf: 1.4 }));
  const rr = B.maske(); rr.ell(x, y, 66, 17); rr.ell(x, y, 60, 14, 0); K.form(4, rr, 0, knochenMat(3));
  for (let i = 0; i < 9; i++) { const a = Math.PI + i / 8 * Math.PI, d = B.maske(); d.kap(x + Math.cos(a) * 64, y + Math.sin(a) * 16, x + Math.cos(a) * 46, y + Math.sin(a) * 9 + 3, 2.4, .6); K.form(4, d, 0, knochenMat(3.4)); }
  K.glut(x, y + 4, 60, '#0a1a24', 1, [3, 4]); K.licht(x, y, '#8ad0e0', 60, .6);
  const g = B.glanzSprite(34, '#0c2430', .7);
  K.anim.push({ p: .5, f(ctx, t, ox, oy) { if (Math.sin(t * .5) < -.4) return; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, x - g.R + ox, y + 2 - g.R + oy); ctx.globalCompositeOperation = 'source-over'; } });
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante, info;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'kraemer' ? 1 : art === 'rast' ? 0 : art === 'werkstatt' ? 2 : art === 'ereignis' || art === 'fund' ? 0 : art === 'uebergang' ? 3 : (o.seed + v) % 3;
  K.kulisse = art === 'waechter' ? 'waechter' : v; // M3: welche Kulisse die Szene zeigt (Schlüssel für die Fahrt, data/fahrt.json)
  if (art === 'waechter' || v === 3) info = kammer(K, {});
  else info = [schiff, flanke, krypta][v](K, {});
  if (art === 'kraemer') kraemerStand(K, 330, 210);
  else if (art === 'ereignis' || art === 'fund') walzahn(K, info.mitte[0] - 10, info.mitte[1]);
  else if (art === 'uebergang') abstieg(K, 240, 222);
  else if (art !== 'kampf' && art !== 'waechter') B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.walkathedrale = { pal, build: bauen, reliefStil: { figuren: 5, gelenke: 4, knick: .9, grossX: 104 } };
})();
