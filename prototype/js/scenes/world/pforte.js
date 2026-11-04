// Saltmoor 1925 · Hintergründe: Akt 5, Die Pforte (außerhalb der Zeit). Dazu die Sonderszene „ankunft“.
// Komposition: docs/auftrag/hintergruende-kompositionen.md
// Falsches Detail: alles ist gespiegelt, das Licht kommt von LINKS.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#030606', '#081010', '#0e1c1c', '#163030'], rand: ['#2a8a7a', '#a0fff0'], augen: '#ff6ad8', nebel: ['#061212', '#1a3a3a'] };
const LEER = ['#010303', '#030707', '#050c0c', '#081414', '#0c1e1e', '#122a2a', '#1a3a3a'];
const LL = [-.75, -.66];
// Farbweg Magenta <-> Türkis in festen Stufen (keine Zwischentöne pro Bild)
const WEG = [0, .2, .4, .6, .8, 1].map(t => B.mix('#ff6ad8', '#6affe8', t));
const WEG_G = [0, .2, .4, .6, .8, 1].map(t => B.mix('#3a0c30', '#0c3a34', t));

function gespiegelt(K) { const m0 = K.mat; K.mat = (t, x) => m0(t, Object.assign({ L: LL }, x || {})); }
// Umriss der Pforte: hohe Linse mit Spitze oben, leicht unsymmetrisch
function pforteMaske(cx, cy, rx, ry) {
  const m = B.maske();
  m.fn(cx - rx - 2, cy - ry - 2, cx + rx + 2, cy + ry + 2, (x, y) => { const u = (x - cx) / rx, v = (y - cy) / ry; const w = 1 - Math.pow(Math.abs(v), 1.6); return Math.abs(u) < w * (1 + v * .08); });
  return m;
}
function pforte(K, cx, cy, rx, ry, o) {
  o = o || {}; const m = pforteMaske(cx, cy, rx, ry), e1 = K.e[1], ruhig = !!o.ruhig;
  // innen: Ringe, die immer kleiner werden (nah und unendlich fern zugleich)
  for (let y = m.y0; y <= m.y1; y++) for (let x = m.x0; x <= m.x1; x++) {
    if (!m.has(x, y)) continue; const d = Math.hypot((x - cx) / rx, (y - cy) / ry), ring = Math.floor(Math.log(Math.max(.02, d)) * -5);
    const t = ruhig ? .9 - d * .5 : .05 + (ring & 1 ? .1 : 0) + Math.max(0, .25 - d) * 1.2;
    e1.set(x, y, B.pk((ruhig ? ['#0a2a28', '#1a4a44', '#3a7a70', '#8ae0d0', '#e0fff8'] : LEER)[Math.min(ruhig ? 4 : 6, Math.floor(t * (ruhig ? 5 : 7) + B.bay(x, y) * .9))]));
  }
  // Randpunkte für die Animation
  const pts = [];
  for (let y = m.y0; y <= m.y1; y++) for (let x = m.x0; x <= m.x1; x++) if (m.has(x, y) && (!m.has(x - 1, y) || !m.has(x + 1, y) || !m.has(x, y - 1) || !m.has(x, y + 1))) pts.push([x, y, (x - cx) < 0 ? 1 : 0]);
  const pts2 = pts.filter((p, i) => i % 2 === 0).map(([x, y]) => [Math.round(cx + (x - cx) * 1.09), Math.round(cy + (y - cy) * 1.05)]);
  const glo = WEG_G.map(c => B.glanzSprite(Math.max(rx, ry) * .9, c, .55));
  const spiegel = o.spiegelY;
  K.licht(cx, cy, '#a0fff0', Math.max(rx, ry) * 2, 1);
  K.anim.push({ p: .05, f(ctx, t, ox, oy) {
    const ph = (Math.sin(t * (ruhig ? .15 : .3)) + 1) / 2, i = Math.min(5, Math.floor(ph * 6)), j = Math.min(5, Math.floor(((Math.sin(t * .3 + 1.6) + 1) / 2) * 6));
    const g = glo[i]; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, cx - g.R + ox, cy - g.R + oy); ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = B.css(WEG[i]); for (const [x, y, l] of pts) if (l || (x + y + Math.floor(t * 4)) % 3) ctx.fillRect(x + ox, y + oy, 1, 1);
    ctx.fillStyle = B.css(B.mix(WEG[j], '#000000', .45)); for (const [x, y] of pts2) ctx.fillRect(x + ox, y + oy, 1, 1);
    if (spiegel) { ctx.fillStyle = B.css(B.mix(WEG[i], '#000000', .5)); for (const [x, y] of pts) { const ry2 = Math.round(spiegel + (spiegel - y) * .55); if ((ry2 + Math.floor(t * 3)) % 3 && ry2 < H + M) ctx.fillRect(x + ox, ry2 + oy, 1, 1); } }
  } });
}
// Treppe, die zu sich selbst führt: Stufenring, jede Stufe steigt in Umlaufrichtung
function treppenRing(K, eb, cx, cy, rx, ry, n, s, tiefe) {
  const sch = B.maske(); sch.poly([[cx - rx * .18, cy + ry * .3], [cx - rx * .1, cy + ry + s * 9], [cx + rx * .12, cy + ry + s * 9], [cx + rx * .2, cy + ry * .3]]);
  K.form(eb, sch, tiefe + .1, { k: pal.koerper, r: pal.rand, ton: 1, fase: 1 });
  const steps = [];
  for (let i = 0; i < n; i++) { const a = i / n * 6.283, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry; steps.push([a, x, y, i]); }
  steps.sort((p, q) => p[2] - q[2]);
  for (const [a, x, y, i] of steps) {
    const m = B.maske(), w = s * (1.2 + .4 * Math.abs(Math.cos(a))), h = s * .55, lift = Math.sin(a * 2) * s * .3 + (i % 2) * s * .15;
    m.poly([[x - w, y - lift], [x - w + s * .4, y - h - lift], [x + w + s * .4, y - h - lift], [x + w, y - lift], [x + w, y + h * 1.6 - lift], [x - w, y + h * 1.6 - lift]]);
    K.form(eb, m, tiefe, { k: pal.koerper, r: pal.rand, ton: 1.4 + (i % 3) * .3, fase: 1, schatten: 1 });
  }
}
function boden(K, hor, wolb, P) {
  const sd = K.o.seed;
  K.boden(hor - wolb - 2, H + M, LEER, (x, y) => {
    const yh = hor - wolb * Math.pow((x - 240) / 240, 2); if (y < yh) return -1;
    const Z = P.h / Math.max(.5, y - yh), X = (x + .5 - P.vx) * Z / P.h, k = P.h / Z;
    let t = .3 + Math.min(.35, Z / 24) + (B.fbm(X * .5, Z * .4, sd, 2) - .5) * .12;
    const f = X / 1.4 - Math.floor(X / 1.4), g = Z / 1.4 - Math.floor(Z / 1.4);
    if (f * 1.4 * k < .9) t += .4; if (g * 1.4 * k * k / P.h < .7) t += .25;
    return t;
  });
}
function void0(K, cx, cy, sterne) {
  B.feld(K.e[0], -M, -M, W + M, H + M, LEER, (x, y) => { const d = Math.hypot(x - cx, (y - cy) * 1.3); return .1 + Math.max(0, 1 - d / 300) * .35 + ((Math.floor(d / 14) & 1) ? .05 : 0); });
  if (sterne) B.sterne(K.e[0], K.r, 140, -M, -M, W + M, H + M, ['#122a2a', '#2a8a7a', '#a0fff0'], null);
}
function sog(K, cx, cy) {
  // Lichtfunken treiben langsam auf die Öffnung zu (Math.random: Kosmetik)
  const P = []; for (let i = 0; i < 46; i++) P.push({ a: Math.random() * 6.28, r: 60 + Math.random() * 260, v: .02 + Math.random() * .04, c: Math.random() < .3 });
  K.luft.push({ p: .9, f(ctx, t, ox, oy) { for (const q of P) { const rr = ((q.r - t * 18 * q.v * 30) % 300 + 300) % 300 + 20; const x = cx + Math.cos(q.a + t * q.v) * rr * 1.2, y = cy + Math.sin(q.a + t * q.v) * rr * .6; ctx.fillStyle = q.c ? '#ff6ad8' : '#6affe8'; if (rr > 30) ctx.fillRect(Math.round(x) + ox, Math.round(y) + oy, 1, 1); } } });
}

// =====================================================================
function v0(K, o) {
  o = o || {}; gespiegelt(K); const hor = 132, P = B.persp(240, hor); K.split = [150, 162];
  void0(K, 240, 100, true);
  // gewölbter Horizont
  boden(K, hor, 44, P);
  treppenRing(K, 2, 82, 116, 50, 14, 18, 7, .25); treppenRing(K, 2, 400, 112, 44, 12, 16, 6, .3);
  treppenRing(K, 1, 150, 92, 22, 6, 12, 3, .5);
  pforte(K, 240, 92, 34, 58, { spiegelY: 150, ruhig: o.ruhig });
  B.nebel(K.e[2], { y0: 100, y1: 160, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .2, xs: [30, 450, 60], seed: 3 });
  if (!o.ruhig) sog(K, 240, 100);
  B.partikel(K, { n: 30, farben: ['#2a8a7a', '#a0fff0', '#ff6ad8'], vx: 2, vy: -1, wob: 5, wf: .3, wobY: 3, hellSelten: 2.5 });
  K.reihen = [{ y: 166, skala: .9, nebel: .3 }, { y: 190, skala: 1, nebel: .12 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [240, 206] };
}
function v1(K) {
  gespiegelt(K); const hor = 140, P = B.persp(330, hor); K.split = [156, 166];
  void0(K, 380, 100, true);
  boden(K, hor, 24, P);
  pforte(K, 392, 96, 14, 26, { spiegelY: 130 });
  treppenRing(K, 3, 150, 132, 96, 30, 26, 11, .05);
  treppenRing(K, 2, 300, 110, 30, 8, 14, 4, .35);
  B.nebel(K.e[2], { y0: 90, y1: 160, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .22, xs: [30, 450, 60], seed: 4 });
  sog(K, 392, 96);
  K.reihen = [{ y: 168, skala: .9, nebel: .3 }, { y: 191, skala: 1, nebel: .12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 206] };
}
function v2(K) {
  // der Boden ist ein zweiter Himmel: Sterne oben und gespiegelt unten
  gespiegelt(K); const hor = 136;
  void0(K, 240, hor, false);
  const r = K.r, e = K.e[0], st = [];
  for (let i = 0; i < 120; i++) st.push([r.f(-M, W + M), r.f(-M, hor - 4), r() < .15 ? 2 : r() < .5 ? 1 : 0]);
  const C = ['#122a2a', '#2a8a7a', '#a0fff0'].map(B.pk);
  for (const [x, y, c] of st) { e.set(x, y, C[c]); const ys = hor + (hor - y) * .9; if (B.hash(Math.round(x), Math.round(y), 2) > .25) e.set(x + Math.sin(ys * .2) * 1.5, ys, C[Math.max(0, c - 1)]); }
  B.dith(e, -M, hor - 1, W + M, hor + 1, '#2a8a7a', () => .6);
  pforte(K, 240, 92, 26, 42, { spiegelY: hor });
  treppenRing(K, 2, 80, 128, 36, 9, 16, 5, .3); treppenRing(K, 2, 420, 126, 30, 8, 14, 4, .35);
  sog(K, 240, 92);
  K.reihen = [{ y: 168, skala: .9, nebel: .3 }, { y: 191, skala: 1, nebel: .12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 206] };
}
function waechter(K) {
  gespiegelt(K); const hor = 170, P = B.persp(240, hor); K.split = [180, 190];
  void0(K, 240, 90, true);
  boden(K, hor, 30, P);
  pforte(K, 240, 92, 90, 130, { spiegelY: 200 });
  treppenRing(K, 3, 50, 176, 50, 14, 18, 7, .05); treppenRing(K, 3, 430, 172, 44, 12, 16, 6, .05);
  sog(K, 240, 92);
  K.reihen = [{ y: 184, skala: .9, nebel: .25 }, { y: 200, skala: 1, nebel: .1 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 208] };
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = waechter(K);
  else info = [v0, v1, v2][v](K);
  B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.pforte = { pal, build: bauen, reliefStil: { figuren: 1, gelenke: 3, knick: .3 } };
// Sonderszene: Ankunft. Die offene Pforte, ruhig, ohne Sog
World._spezial.ankunft = function (o) { const K = B.kontext(pal, Object.assign({}, o, { art: 'ankunft' })); v0(K, { ruhig: true }); return K.fertig(); };
})();
