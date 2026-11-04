// Saltmoor 1925 · Hintergründe (M8): gemeinsame Bausteine.
// Klassisches Skript ohne Abhängigkeiten. Stellt window.World bereit.
// Bildsprache wie die Figuren (docs/spritegen/zielbild.md): dunkle Flächen in Zonenfarbe,
// Gegenlicht von hinten oben rechts mit 1–2 px Randlicht, Fase statt Kuppel, Bayer-Dither,
// Lichtquellen als hellste Punkte mit gedithertem Glühen. Keine Verläufe, kein Weichzeichner.
(function () {
'use strict';
const W = 480, H = 270, M = 12, EW = W + 2 * M, EH = H + 2 * M;
const World = window.World = window.World || {};
const B = World.B = { W, H, M, EW, EH };
World._biome = World._biome || {};
World._spezial = World._spezial || {};

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
B.clamp = clamp;
B.lerp = (a, b, t) => a + (b - a) * t;
B.glatt = t => t * t * (3 - 2 * t);

// ---------- Zufall (splitmix32, nur per Seed) ----------
B.rng = function (seed) {
  let a = (seed | 0) ^ 0x2545f491;
  const r = function () {
    a = a + 0x9e3779b9 | 0; let t = a ^ a >>> 16; t = Math.imul(t, 0x21f0aaad);
    t = t ^ t >>> 15; t = Math.imul(t, 0x735a2d97); return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
  };
  r.f = (x, y) => x + (y - x) * r();
  r.i = (x, y) => Math.floor(x + (y - x + 1) * r());
  r.j = v => (r() * 2 - 1) * v;
  r.pick = l => l[Math.floor(r() * l.length)];
  r.ja = p => r() < p;
  return r;
};
B.hash = function (x, y, s) {
  let h = Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1) ^ Math.imul((s | 0) + 0x3c6ef372, 0x9e3779b1);
  h = Math.imul(h ^ h >>> 15, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};
B.rausch1 = function (x, s) { const i = Math.floor(x), f = B.glatt(x - i); return B.lerp(B.hash(i, 0, s), B.hash(i + 1, 0, s), f); };
B.rausch2 = function (x, y, s) {
  const i = Math.floor(x), j = Math.floor(y), fx = B.glatt(x - i), fy = B.glatt(y - j);
  return B.lerp(B.lerp(B.hash(i, j, s), B.hash(i + 1, j, s), fx), B.lerp(B.hash(i, j + 1, s), B.hash(i + 1, j + 1, s), fx), fy);
};
B.fbm = function (x, y, s, o) { let v = 0, a = .5, n = 0; for (let k = 0; k < (o || 3); k++) { v += a * B.rausch2(x, y, s + k * 17); n += a; x *= 2.03; y *= 2.03; a *= .5; } return v / n; };

// ---------- Bayer 4×4 ----------
const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + .5) / 16);
const bay = (x, y) => BAY[((y | 0) & 3) * 4 + ((x | 0) & 3)];
B.bay = bay;

// ---------- Farben ----------
B.hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
B.col = c => typeof c === 'string' ? B.hex(c) : c;
B.mix = (a, b, t) => { a = B.col(a); b = B.col(b); return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)]; };
B.mal = (a, f) => { a = B.col(a); return [clamp(Math.round(a[0] * f), 0, 255), clamp(Math.round(a[1] * f), 0, 255), clamp(Math.round(a[2] * f), 0, 255)]; };
B.pk = c => { c = B.col(c); return ((255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0]) >>> 0; };
B.css = c => { c = B.col(c); return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; };
B.unpk = p => [p & 255, p >>> 8 & 255, p >>> 16 & 255];

// ---------- Ebene: Pixelpuffer mit Rand M ----------
function Ebene() { this.d = new Uint32Array(EW * EH); }
B.Ebene = Ebene;
const E = Ebene.prototype;
E.set = function (x, y, c) { x = Math.floor(x) + M; y = Math.floor(y) + M; if (x < 0 || y < 0 || x >= EW || y >= EH) return; this.d[y * EW + x] = c; };
E.get = function (x, y) { x = Math.floor(x) + M; y = Math.floor(y) + M; if (x < 0 || y < 0 || x >= EW || y >= EH) return 0; return this.d[y * EW + x]; };
E.dset = function (x, y, c, a) { if (a > bay(x, y)) this.set(x, y, c); };
E.add = function (x, y, rgb, a) {
  x = Math.floor(x) + M; y = Math.floor(y) + M; if (x < 0 || y < 0 || x >= EW || y >= EH) return;
  const i = y * EW + x, p = this.d[i]; if (!(p >>> 24)) return;
  const r = Math.min(255, (p & 255) + rgb[0] * a), g = Math.min(255, (p >>> 8 & 255) + rgb[1] * a), b = Math.min(255, (p >>> 16 & 255) + rgb[2] * a);
  this.d[i] = ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
};
E.rect = function (x, y, w, h, c) { for (let j = Math.floor(y); j < y + h; j++) for (let i = Math.floor(x); i < x + w; i++) this.set(i, j, c); };
E.leinwand = function () {
  const c = document.createElement('canvas'); c.width = EW; c.height = EH;
  const x = c.getContext('2d'); x.putImageData(new ImageData(new Uint8ClampedArray(this.d.buffer.slice(0)), EW, EH), 0, 0); return c;
};
// Ebene b auf a legen (nur deckende Pixel)
E.auf = function (b) { const d = this.d, s = b.d; for (let i = 0; i < d.length; i++) if (s[i] >>> 24) d[i] = s[i]; };

// Feld: Fläche mit Farbrampe, t = tf(x,y) in 0..1, geordnet gedithert
B.feld = function (e, x0, y0, x1, y1, cols, tf) {
  const P = cols.map(B.pk), n = P.length - 1;
  x0 = Math.max(Math.floor(x0), -M); y0 = Math.max(Math.floor(y0), -M); x1 = Math.min(Math.ceil(x1), W + M); y1 = Math.min(Math.ceil(y1), H + M);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    let t = tf(x, y); if (t !== t || t < -0.5) continue; t = clamp(t, 0, .9999) * n;
    const k = Math.floor(t); e.d[(y + M) * EW + x + M] = P[Math.min(n, (t - k) > bay(x, y) ? k + 1 : k)];
  }
};
// Dither-Streuung einer Farbe mit Dichte a(x,y)
B.dith = function (e, x0, y0, x1, y1, c, af) {
  const p = B.pk(c);
  x0 = Math.max(Math.floor(x0), -M); y0 = Math.max(Math.floor(y0), -M); x1 = Math.min(Math.ceil(x1), W + M); y1 = Math.min(Math.ceil(y1), H + M);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const a = af(x, y); if (a > bay(x, y)) e.d[(y + M) * EW + x + M] = p; }
};
B.linie = function (e, x0, y0, x1, y1, c, a) {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))));
  for (let k = 0; k <= n; k++) { const q = k / n, x = x0 + (x1 - x0) * q, y = y0 + (y1 - y0) * q; if (a === undefined || a > bay(x, y)) e.set(x, y, c); }
};
// Glühen: hellt deckende Pixel gedithert auf (Lichtspur auf nahen Flächen)
B.gluehen = function (e, cx, cy, r, col, a, luft) {
  const C = B.col(col), pl = luft ? B.pk(luft) : 0;
  for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) {
    const q = Math.hypot(x + .5 - cx, y + .5 - cy) / r; if (q >= 1) continue;
    const v = a * (1 - q) * (1 - q); if (v <= bay(x, y) * .95) continue;
    if (pl && !(e.get(x, y) >>> 24)) { if (v > .55 + bay(x, y) * .4) e.set(x, y, pl); } else e.add(x, y, C, .5);
  }
};
// Lichtkegel (statisch), gedithert aufhellend
B.kegel = function (e, x, y, win, breite, laenge, col, a) {
  const C = B.col(col);
  const x0 = Math.floor(x - laenge), x1 = Math.ceil(x + laenge), y0 = Math.floor(y - laenge), y1 = Math.ceil(y + laenge);
  for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) {
    const dx = i - x, dy = j - y, d = Math.hypot(dx, dy); if (d > laenge || d < 1) continue;
    let da = Math.atan2(dy, dx) - win; da = Math.atan2(Math.sin(da), Math.cos(da)); if (Math.abs(da) > breite) continue;
    const v = a * (1 - d / laenge) * (1 - Math.abs(da) / breite); if (v > bay(i, j)) e.add(i, j, C, .5);
  }
};
B.sterne = function (e, r, n, x0, y0, x1, y1, cols, maske) {
  const P = cols.map(B.pk);
  for (let i = 0; i < n; i++) { const x = r.f(x0, x1), y = y0 + (y1 - y0) * Math.pow(r(), 1.4); if (maske && !maske(x, y)) continue; e.set(x, y, P[Math.floor(Math.pow(r(), 2.2) * P.length)]); }
};
// Nebelband: dichte(x,y) gedithert in Nebelfarbe (setzt Pixel, auch auf Leere)
B.nebel = function (e, o) {
  const p = B.pk(o.col), s = o.seed || 7, y0 = o.y0, y1 = o.y1, x0 = o.x0 === undefined ? -M : o.x0, x1 = o.x1 === undefined ? W + M : o.x1;
  B.dith(e, x0, y0, x1, y1, o.col, (x, y) => {
    const v = Math.sin(clamp((y - y0) / (y1 - y0), 0, 1) * Math.PI);
    let h = 1; if (o.xs) h = clamp(Math.min((x - o.xs[0]) / o.xs[2], (o.xs[1] - x) / o.xs[2]), 0, 1);
    return o.dichte * v * h * (.55 + .45 * B.fbm(x * .018, y * .06, s, 2)) * (o.f ? o.f(x, y) : 1);
  });
  void p;
};

// ---------- Maske: Formen aus Funktionen ----------
function Maske() { this.d = new Uint8Array(EW * EH); this.x0 = 1e9; this.y0 = 1e9; this.x1 = -1e9; this.y1 = -1e9; }
B.Maske = Maske;
const Mk = Maske.prototype;
B.maske = () => new Maske();
Mk._bb = function (x0, y0, x1, y1) {
  x0 = Math.max(Math.floor(x0), -M); y0 = Math.max(Math.floor(y0), -M); x1 = Math.min(Math.ceil(x1), W + M - 1); y1 = Math.min(Math.ceil(y1), H + M - 1);
  return [x0, y0, x1, y1];
};
Mk._grow = function (x0, y0, x1, y1) { if (x1 < x0 || y1 < y0) return; if (x0 < this.x0) this.x0 = x0; if (y0 < this.y0) this.y0 = y0; if (x1 > this.x1) this.x1 = x1; if (y1 > this.y1) this.y1 = y1; };
Mk.has = function (x, y) { x = Math.floor(x) + M; y = Math.floor(y) + M; if (x < 0 || y < 0 || x >= EW || y >= EH) return false; return this.d[y * EW + x] > 0; };
Mk.put = function (x, y, v) { const i = (y + M) * EW + x + M; this.d[i] = v; };
Mk.fn = function (x0, y0, x1, y1, f, v) {
  v = v === undefined ? 1 : v; const b = this._bb(x0, y0, x1, y1); let hit = false;
  for (let y = b[1]; y <= b[3]; y++) for (let x = b[0]; x <= b[2]; x++) if (f(x + .5, y + .5)) { this.put(x, y, v); hit = true; }
  if (v && hit) this._grow(b[0], b[1], b[2], b[3]); return this;
};
Mk.poly = function (pts, v) {
  v = v === undefined ? 1 : v; let ya = 1e9, yb = -1e9, xa = 1e9, xb = -1e9;
  for (const p of pts) { ya = Math.min(ya, p[1]); yb = Math.max(yb, p[1]); xa = Math.min(xa, p[0]); xb = Math.max(xb, p[0]); }
  const b = this._bb(xa, ya, xb, yb); const n = pts.length;
  for (let y = b[1]; y <= b[3]; y++) {
    const yc = y + .5, xs = [];
    for (let i = 0; i < n; i++) { const a = pts[i], c = pts[(i + 1) % n]; if ((a[1] <= yc && c[1] > yc) || (c[1] <= yc && a[1] > yc)) xs.push(a[0] + (yc - a[1]) / (c[1] - a[1]) * (c[0] - a[0])); }
    xs.sort((p, q) => p - q);
    for (let i = 0; i + 1 < xs.length; i += 2) { const s = Math.max(b[0], Math.ceil(xs[i] - .5)), e = Math.min(b[2], Math.ceil(xs[i + 1] - .5) - 1); for (let x = s; x <= e; x++) this.put(x, y, v); }
  }
  if (v) this._grow(b[0], b[1], b[2], b[3]); return this;
};
Mk.ell = function (cx, cy, rx, ry, v) { return this.fn(cx - rx - 1, cy - ry - 1, cx + rx + 1, cy + ry + 1, (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1, v); };
Mk.rect = function (x, y, w, h, v) { return this.fn(x, y, x + w - 1, y + h - 1, () => true, v); };
// Kapsel mit Verjüngung r1 -> r2
Mk.kap = function (x1, y1, x2, y2, r1, r2, v) {
  const R = Math.max(r1, r2);
  const bx = x2 - x1, by = y2 - y1, bb = bx * bx + by * by || 1;
  return this.fn(Math.min(x1, x2) - R - 1, Math.min(y1, y2) - R - 1, Math.max(x1, x2) + R + 1, Math.max(y1, y2) + R + 1, (x, y) => {
    const ax = x - x1, ay = y - y1, h = clamp((ax * bx + ay * by) / bb, 0, 1);
    return Math.hypot(ax - bx * h, ay - by * h) <= r1 + (r2 - r1) * h;
  }, v);
};
// Pfad aus Punkten mit Dicken (Ast, Tau, Rippe)
Mk.pfad = function (pts, r0, r1, v) {
  const n = pts.length - 1;
  for (let i = 0; i < n; i++) this.kap(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], r0 + (r1 - r0) * i / n, r0 + (r1 - r0) * (i + 1) / n, v);
  return this;
};
Mk.leer = function () { return this.x1 < this.x0 || this.y1 < this.y0; };

// ---------- Form: Maske mit Fase, Randlicht, Kontaktschatten rendern ----------
B.L = [.75, -.66];
B.form = function (e, m, mat) {
  if (m.leer()) return;
  const L = mat.L || B.L, k = mat.k, r = mat.r || [], n = k.length - 1;
  const fase = mat.fase === undefined ? 1.5 : mat.fase, rand = mat.rand === undefined ? 2 : mat.rand;
  const X0 = Math.max(m.x0 - 3, -M), Y0 = Math.max(m.y0 - 3, -M), X1 = Math.min(m.x1 + 3, W + M - 1), Y1 = Math.min(m.y1 + 3, H + M - 1);
  const bw = X1 - X0 + 1, bh = Y1 - Y0 + 1, D = new Float32Array(bw * bh), md = m.d;
  const ins = (x, y) => { const xx = x + M, yy = y + M; if (xx < 0 || yy < 0 || xx >= EW || yy >= EH) return true; return md[yy * EW + xx] > 0; };
  for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) D[y * bw + x] = ins(x + X0, y + Y0) ? 99 : 0;
  // Chamfer-Distanz: Bildrand der Ebene zählt als innen (kein Randlicht am Bildrand)
  const edgeL = X0 === -M, edgeR = X1 === W + M - 1, edgeT = Y0 === -M, edgeB = Y1 === H + M - 1;
  for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
    const i = y * bw + x; let v = D[i]; if (!v) continue;
    if (x > 0) v = Math.min(v, D[i - 1] + 1); else if (!edgeL) v = Math.min(v, 1);
    if (y > 0) { v = Math.min(v, D[i - bw] + 1); if (x > 0) v = Math.min(v, D[i - bw - 1] + 1.41); if (x < bw - 1) v = Math.min(v, D[i - bw + 1] + 1.41); } else if (!edgeT) v = Math.min(v, 1);
    D[i] = v;
  }
  for (let y = bh - 1; y >= 0; y--) for (let x = bw - 1; x >= 0; x--) {
    const i = y * bw + x; let v = D[i]; if (!v) continue;
    if (x < bw - 1) v = Math.min(v, D[i + 1] + 1); else if (!edgeR) v = Math.min(v, 1);
    if (y < bh - 1) { v = Math.min(v, D[i + bw] + 1); if (x < bw - 1) v = Math.min(v, D[i + bw + 1] + 1.41); if (x > 0) v = Math.min(v, D[i + bw - 1] + 1.41); } else if (!edgeB) v = Math.min(v, 1);
    D[i] = v;
  }
  const ton0 = mat.ton === undefined ? 1 : mat.ton, verl = mat.verlauf || 0, vx = mat.verlaufX || 0, mus = mat.muster;
  const hY = Math.max(1, m.y1 - m.y0 + 1), hX = Math.max(1, m.x1 - m.x0 + 1), ed = e.d;
  const rimF = mat.rimF === undefined ? .3 : mat.rimF;
  for (let y = m.y0; y <= m.y1; y++) for (let x = m.x0; x <= m.x1; x++) {
    if (!md[(y + M) * EW + x + M]) continue;
    const d = D[(y - Y0) * bw + x - X0];
    let t = ton0 + verl * (1 - (y - m.y0) / hY) + vx * ((x - m.x0) / hX);
    if (mus) t += mus(x, y, d);
    let rim = 0;
    if (d < 4) {
      let nx = 0, ny = 0;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { if (!dx && !dy) continue; if (!ins(x + dx, y + dy)) { const w = 1 / (dx * dx + dy * dy); nx += dx * w; ny += dy * w; } }
      const nl = Math.hypot(nx, ny);
      if (nl > .05) {
        nx /= nl; ny /= nl; const f = nx * L[0] + ny * L[1];
        const thin = !ins(Math.round(x - nx * 2.6), Math.round(y - ny * 2.6));
        if (d <= fase + .5) { if (f > .3) t += 1; else if (f < -.45) t -= .8; }
        if (rand > 0 && f > rimF) {
          if (d < 1.5) { rim = (f > .5 && rand >= 2 && !thin) ? 2 : 1; if (f < rimF + .2 && (f - rimF) / .2 < bay(x, y)) rim = 0; }
          else if (d < 2.5 && rand >= 2 && f > .55 && !thin) rim = 1;
        }
      }
    }
    let c;
    if (rim && r.length) c = r[Math.min(rim, r.length) - 1];
    else { t = clamp(t, 0, n - .0001); const kk = Math.floor(t); c = k[Math.min(n, (t - kk) > bay(x, y) ? kk + 1 : kk)]; }
    ed[(y + M) * EW + x + M] = c;
  }
  // Kontaktschatten: dunkelste Stufe auf der lichtabgewandten Seite, auf dem, was schon da ist
  if (mat.schatten) {
    const sc = mat.sk || k[0];
    for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
      if (ins(x, y)) continue; const i = (y + M) * EW + x + M; if (!(ed[i] >>> 24)) continue;
      let vx2 = 0, vy2 = 0, dmin = 9;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if ((dx || dy) && m.has(x + dx, y + dy)) { vx2 += dx; vy2 += dy; dmin = Math.min(dmin, Math.max(Math.abs(dx), Math.abs(dy))); }
      if (dmin > 2) continue; const vl = Math.hypot(vx2, vy2) || 1;
      const f = (vx2 * L[0] + vy2 * L[1]) / vl;
      if (f > .2 && (dmin === 1 || bay(x, y) < .5) && dmin <= mat.schatten) ed[i] = sc;
    }
  }
};

// ---------- Baum aus Ästen per Regel ----------
// zug: Winkel, zu dem sich der ganze Baum neigt (z. B. zum Steinkreis), staerke 0..1
B.baum = function (m, r, x, y, len, ang, dicke, tiefe, o) {
  o = o || {}; const zug = o.zug, st = o.zugStaerke || 0;
  if (zug !== undefined) { let d = zug - ang; d = Math.atan2(Math.sin(d), Math.cos(d)); ang += d * st; }
  const krumm = o.krumm || .12, n = 4, pts = [[x, y]]; let a = ang, px = x, py = y;
  for (let i = 0; i < n; i++) { a += r.j(krumm); px += Math.cos(a) * len / n; py += Math.sin(a) * len / n; pts.push([px, py]); }
  m.pfad(pts, dicke, Math.max(.45, dicke * (o.verj || .62)));
  if (tiefe <= 0 || len < (o.minLen || 3)) return;
  const k = r() < (o.drei || .3) ? 3 : 2, spread = o.spreiz || .55;
  for (let i = 0; i < k; i++) {
    const s = (i - (k - 1) / 2) * spread * 2 / Math.max(1, k - 1) + r.j(.25);
    const t = .55 + r() * .3; // Abzweig entlang des Asts
    const bi = Math.floor(t * n), bx = pts[bi][0] + (pts[bi + 1][0] - pts[bi][0]) * (t * n - bi), by = pts[bi][1] + (pts[bi + 1][1] - pts[bi][1]) * (t * n - bi);
    const useEnd = i === 0 && k === 2 ? 0 : 1;
    B.baum(m, r, useEnd ? px : bx, useEnd ? py : by, len * (o.kuerz || .7) * (.85 + r() * .3), a + s, Math.max(.45, dicke * (o.verj || .62)), tiefe - 1, Object.assign({}, o, { zugStaerke: st * .6 }));
  }
};

// ---------- Perspektive: Boden mit Fluchtpunkt ----------
// s = 1/Tiefe (1 = Unterkante y0u, 0 = Horizont). X in Einheiten der Augenhöhe.
B.persp = function (vx, vy, yu) {
  yu = yu === undefined ? H : yu; const h = yu - vy;
  return { vx, vy, h, y: s => vy + h * s, x: (X, s) => vx + X * h * s, s: y => (y - vy) / h, X: (x, y) => (x - vx) / Math.max(.001, y - vy), pt: (X, s) => [vx + X * h * s, vy + h * s],
    // 3D-Punkt: X seitlich, Y Höhe (1 = Augenhöhe), Z Tiefe (1 = Bildunterkante)
    q: (X, Y, Z) => [vx + X * h / Z, vy + h / Z * (1 - Y)], z: y => h / Math.max(.01, y - vy), k: Z => h / Z };
};

// Wandernder Lichtkegel (Leuchtturm, Fenster): pro Bild nur die Pixel im Kegel, gedithert, additiv
B.lichtkegelAnim = function (K, o) {
  const L = o.laenge, bx = Math.floor(o.x - L), by = Math.floor(o.y - L), bw = Math.ceil(2 * L), bh = Math.ceil(2 * L);
  const c = document.createElement('canvas'); c.width = bw; c.height = bh; const cx = c.getContext('2d');
  const id = cx.createImageData(bw, bh), d32 = new Uint32Array(id.data.buffer);
  const C1 = B.pk(o.farbe), C2 = B.pk(o.kern || o.farbe); let letzt = 1e9;
  K.anim.push({ p: o.p === undefined ? .05 : o.p, f(ctx, t, ox, oy) {
    const a = o.winkel(t), st = o.staerke ? o.staerke(t) : 1;
    if (st <= .01) return;
    if (Math.abs(a - letzt) > .0025 || o.staerke) {
      letzt = a; d32.fill(0); const br = o.breite, ca = Math.cos(a), sa = Math.sin(a);
      for (let r = 2; r < L; r++) {
        const w = Math.max(.6, r * Math.tan(br) + (o.basis || 0)), q = 1 - r / L, n = Math.ceil(w);
        for (let k = -n; k <= n; k++) {
          const px = Math.round(o.x + ca * r - sa * k), py = Math.round(o.y + sa * r + ca * k), ix = px - bx, iy = py - by;
          if (ix < 0 || iy < 0 || ix >= bw || iy >= bh) continue;
          const v = st * o.staerkeMax * Math.pow(q, o.abfall || .7) * (1 - Math.abs(k) / (w + 1));
          const b = bay(px, py); if (v > b) d32[iy * bw + ix] = v > b + .45 ? C2 : C1;
        }
      }
      cx.putImageData(id, 0, 0);
    }
    ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(c, bx + ox, by + oy); ctx.globalCompositeOperation = 'source-over';
  } });
};
// Glitzern auf Wasser: kurze waagerechte Striche, die ruhig an- und ausgehen
B.wasserGlanz = function (K, o) {
  const P = [], cols = o.farben.map(B.css);
  for (let i = 0; i < (o.n || 60); i++) {
    const x = o.x0 + Math.random() * (o.x1 - o.x0), y = Math.floor(o.y0 + Math.pow(Math.random(), o.pow || 1) * (o.y1 - o.y0));
    if (o.maske && !o.maske(x, y)) continue;
    const nah = (y - o.y0) / Math.max(1, o.y1 - o.y0);
    P.push({ x, y, l: Math.max(1, Math.round((1 + Math.random() * 4) * (o.laengeNah ? 1 + nah * o.laengeNah : 1))), ph: Math.random() * 6.28, sp: .4 + Math.random() * .8, c: Math.floor(Math.random() * cols.length) });
  }
  K.anim.push({ p: o.p === undefined ? .5 : o.p, f(ctx, t, ox, oy) {
    for (const q of P) { const v = Math.sin(t * q.sp + q.ph); if (v < (o.schwelle || .5)) continue; ctx.fillStyle = cols[q.c]; ctx.fillRect(Math.round(q.x + Math.sin(t * .3 + q.ph) * 2) + ox, q.y + oy, q.l, 1); }
  } });
};

// ---------- Kontext je Szene ----------
// pal: {koerper[4], rand[2], augen, nebel[2], ...}. tiefe 0 = vorne, 1 = ganz fern (in Nebelfarbe aufgelöst)
B.kontext = function (pal, o) {
  const K = { pal, o, fr: clamp(o.fremdheit || 0, 0, 1), r: B.rng((o.seed | 0) * 7919 + (o.variante | 0) * 104729 + 13), e: [], anim: [], luft: [], lichter: [] };
  for (let i = 0; i < 6; i++) K.e.push(new Ebene());
  K.fern = pal.fern || B.mix(pal.nebel[1], pal.rand[0], .35);
  K.mat = function (tiefe, x) {
    x = x || {}; const nf = x.nebelFarbe || K.fern, tf = tiefe;
    const kc = (x.k || pal.koerper).map(c => B.pk(B.mix(c, nf, tf)));
    const rc = (x.r || pal.rand).map(c => B.pk(B.mix(c, nf, Math.min(1, tf * 1.15))));
    return Object.assign({ k: kc, r: tf > .85 ? [] : rc, ton: 1, fase: 1.5, rand: tf > .55 ? 1 : 2 }, x, { k: kc, r: x.ohneRand ? [] : (tf > .85 ? [] : rc) });
  };
  K.form = (ebene, m, tiefe, x) => B.form(K.e[ebene], m, K.mat(tiefe, x));
  K.licht = (x, y, farbe, rad, staerke) => K.lichter.push({ x, y, farbe: typeof farbe === 'string' ? farbe : '#' + B.col(farbe).map(v => v.toString(16).padStart(2, '0')).join(''), r: rad, staerke });
  K.reihen = [{ y: 166, skala: .9, nebel: .35 }, { y: 190, skala: 1, nebel: .15 }, { y: 213, skala: 1, nebel: 0 }];
  // Boden über drei Ebenen verteilt (fern -> 2, mitte -> 3, nah -> 4), damit Dinge, die auf dem
  // fernen Boden stehen, nicht vom nahen Boden übermalt werden. K.split = [y1, y2].
  K.split = [150, 160];
  K.eb = y => y < K.split[0] ? 2 : y < K.split[1] ? 3 : 4;
  K.boden = function (y0, y1, cols, tf) {
    const a = K.split[0], b = K.split[1];
    if (y0 < a) B.feld(K.e[2], -M, y0, W + M, Math.min(y1, a), cols, tf);
    if (y1 > a && y0 < b) B.feld(K.e[3], -M, Math.max(y0, a), W + M, Math.min(y1, b), cols, tf);
    if (y1 > b) B.feld(K.e[4], -M, Math.max(y0, b), W + M, y1, cols, tf);
  };
  K.bodenDith = function (x0, y0, x1, y1, c, af) {
    const a = K.split[0], b = K.split[1];
    if (y0 < a) B.dith(K.e[2], x0, y0, x1, Math.min(y1, a), c, af);
    if (y1 > a && y0 < b) B.dith(K.e[3], x0, Math.max(y0, a), x1, Math.min(y1, b), c, af);
    if (y1 > b) B.dith(K.e[4], x0, Math.max(y0, b), x1, y1, c, af);
  };
  // Boden mit mehreren Stoffen: klasse(x,y) -> Index in mats (oder -1), mats[i] = {cols, tf(x,y)}
  K.bodenStoffe = function (y0, y1, mats, klasse) {
    const P = mats.map(m => m.cols.map(B.pk));
    for (let y = Math.max(Math.floor(y0), -M); y < Math.min(Math.ceil(y1), H + M); y++) {
      const e = K.e[K.eb(y)];
      for (let x = -M; x < W + M; x++) {
        const c = klasse(x, y); if (c < 0) continue; const m = mats[c], p = P[c], n = p.length - 1;
        let t = m.tf(x, y); if (t !== t || t < -.5) continue; t = clamp(t, 0, .9999) * n; const k = Math.floor(t);
        e.d[(y + M) * EW + x + M] = p[Math.min(n, (t - k) > bay(x, y) ? k + 1 : k)];
      }
    }
  };
  K.glut = function (x, y, r, c, a, ebenen) { for (const i of (ebenen || [1, 2, 3, 4])) B.gluehen(K.e[i], x, y, r, c, a); };
  K.fertig = () => B.szene(K);
  return K;
};

// ---------- Szene zusammensetzen ----------
B.PAR = [0, .05, .15, .3, .5, .8, 1];
B.szene = function (K) {
  const can = K.e.map(e => e.leinwand()), par = B.PAR;
  const off = (k, p) => [-Math.round((k ? k.x || 0 : 0) * p), -Math.round((k ? k.y || 0 : 0) * p)];
  const S = {
    w: W, h: H, rand: M,
    ebenen: [0, 1, 2, 3, 4].map(i => ({ canvas: can[i], parallax: par[i], x: -M, y: -M })),
    vorne: { canvas: can[5], parallax: par[5], x: -M, y: -M },
    reihen: K.reihen, lichter: K.lichter, biom: K.o.biom, variante: K.o.variante, art: K.o.art,
    zeichneEbene(ctx, i, kam) { const L = i < 5 ? S.ebenen[i] : S.vorne; const [ox, oy] = off(kam, L.parallax); ctx.drawImage(L.canvas, ox - M, oy - M); },
    zeichneAnimiert(ctx, t, kam) { ctx.imageSmoothingEnabled = false; for (const a of K.anim) { const [ox, oy] = off(kam, a.p); a.f(ctx, t, ox, oy); } },
    zeichneVordergrund(ctx, t, kam, ohneEbene5) {
      ctx.imageSmoothingEnabled = false;
      if (!ohneEbene5) S.zeichneEbene(ctx, 5, kam);
      for (const a of K.luft) { const [ox, oy] = off(kam, a.p === undefined ? 1 : a.p); a.f(ctx, t, ox, oy); }
    },
    zeichneHintergrund(ctx, t, kam) { ctx.imageSmoothingEnabled = false; for (let i = 0; i < 5; i++) S.zeichneEbene(ctx, i, kam); S.zeichneAnimiert(ctx, t, kam); },
    zeichne(ctx, t, kam, gegner) { S.zeichneHintergrund(ctx, t, kam); if (gegner) gegner(ctx, S.reihen); S.zeichneVordergrund(ctx, t, kam); }
  };
  return S;
};

// ---------- Animierte Bausteine ----------
// Glühsprite (gedithert), wird mit 'lighter' gezeichnet
B.glanzSprite = function (r, col, a) {
  const s = Math.ceil(r) * 2 + 1, c = document.createElement('canvas'); c.width = s; c.height = s;
  const x = c.getContext('2d'), id = x.createImageData(s, s), C = B.col(col), R = Math.ceil(r);
  for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) {
    const q = Math.hypot(i - R, j - R) / r; if (q >= 1) continue; const v = a * (1 - q) * (1 - q);
    if (v > bay(i, j)) { const o = (j * s + i) * 4; id.data[o] = C[0]; id.data[o + 1] = C[1]; id.data[o + 2] = C[2]; id.data[o + 3] = 255; }
  }
  x.putImageData(id, 0, 0); c.R = R; return c;
};
// Kerze/Flamme: kleine flackernde Flamme mit Glühen
B.flamme = function (K, x, y, o) {
  o = o || {}; const p = o.p === undefined ? .3 : o.p, gross = o.gross || 1;
  const kern = B.css(o.kern || '#fff4d0'), mitte = B.css(o.mitte || '#ffb040'), aussen = B.css(o.aussen || '#a04a10');
  const gs = [B.glanzSprite(8 * gross + (o.glanz || 0), o.glut || '#3a2208', .7), B.glanzSprite(9 * gross + (o.glanz || 0), o.glut || '#3a2208', .75)];
  const ph = (x * 13.7 + y * 7.3) % 6.28;
  K.licht(x, y, o.mitte || '#ffb040', 10 * gross, .6);
  K.anim.push({ p, f(ctx, t, ox, oy) {
    const fl = Math.sin(t * 7 + ph) + Math.sin(t * 13.3 + ph * 2) * .6;
    const g = gs[fl > .3 ? 1 : 0]; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, x - g.R + ox, y - 2 - g.R + oy); ctx.globalCompositeOperation = 'source-over';
    const h = gross > 1 ? 4 + (fl > .8 ? 1 : 0) : 2 + (fl > .8 ? 1 : 0), lean = fl < -1 ? -1 : 0;
    ctx.fillStyle = aussen; ctx.fillRect(x + ox + lean, y - h + oy, 1, h);
    if (gross > 1) { ctx.fillStyle = mitte; ctx.fillRect(x + ox - 1, y - h + 1 + oy, 3, h - 1); ctx.fillStyle = aussen; ctx.fillRect(x + ox + lean, y - h - 1 + oy, 1, 1); }
    ctx.fillStyle = mitte; ctx.fillRect(x + ox + lean, y - h + 1 + oy, 1, h - 1);
    ctx.fillStyle = kern; ctx.fillRect(x + ox, y - 1 + oy, 1, 1);
  } });
};
// Partikel der Luft (Math.random nur hier: reine Kosmetik)
B.partikel = function (K, o) {
  const n = o.n || 40, P = [], cols = o.farben.map(B.css), p = o.p === undefined ? 1 : o.p;
  const x0 = o.x0 === undefined ? -M : o.x0, x1 = o.x1 === undefined ? W + M : o.x1, y0 = o.y0 === undefined ? -M : o.y0, y1 = o.y1 === undefined ? H + M : o.y1;
  for (let i = 0; i < n; i++) P.push({ x: Math.random() * (x1 - x0), y: Math.random() * (y1 - y0), v: .5 + Math.random(), ph: Math.random() * 6.28, c: Math.floor(Math.pow(Math.random(), o.hellSelten || 1.6) * cols.length) });
  const bw = x1 - x0, bh = y1 - y0, vx = o.vx || 0, vy = o.vy || 0, wob = o.wob || 0, wf = o.wf || 1, lg = o.laenge || 1, bl = o.blink || 0;
  K.luft.push({ p, f(ctx, t, ox, oy) {
    for (let c = 0; c < cols.length; c++) {
      ctx.fillStyle = cols[c];
      for (const q of P) {
        if (q.c !== c) continue; if (bl && Math.sin(t * bl + q.ph * 3) < .2) continue;
        let x = (q.x + vx * t * q.v + Math.sin(t * wf + q.ph) * wob) % bw; if (x < 0) x += bw;
        let y = (q.y + vy * t * q.v + (o.wobY ? Math.cos(t * wf * .7 + q.ph) * o.wobY : 0)) % bh; if (y < 0) y += bh;
        if (o.maske && !o.maske(x + x0, y + y0)) continue;
        ctx.fillRect(Math.round(x + x0) + ox, Math.round(y + y0) + oy, 1, lg);
      }
    }
  } });
};

// ---------- Allgemeine Zusätze je Art ----------
// Kleines Feuer (Rast), Werkbank, Krämerstand, Fundkiste. Position: Bodenpunkt (x,y).
B.feuer = function (K, x, y) {
  const m = B.maske(), pal = K.pal;
  m.kap(x - 9, y - 1, x + 7, y - 3, 1.6, 1.4); m.kap(x - 7, y - 3, x + 9, y, 1.5, 1.6); m.kap(x - 3, y + 1, x + 5, y - 4, 1.4, 1.2);
  B.form(K.e[5], m, K.mat(0, { ton: 1.3, k: ['#0a0604', '#1a0e08', '#2a1a10', '#3a2416'], r: ['#a0502a', '#ffb070'] }));
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28; const sx = x + Math.cos(a) * 12, sy = y + 1 + Math.sin(a) * 3; const s = B.maske(); s.ell(sx, sy, 2.2, 1.6); B.form(K.e[5], s, K.mat(0, { ton: 1.5, fase: 1 })); }
  for (const L of [K.e[4], K.e[3]]) B.gluehen(L, x, y - 6, 70, '#5a2a08', .9);
  K.licht(x, y - 6, '#ff9a40', 70, 1);
  const g1 = B.glanzSprite(30, '#4a2006', .75), g2 = B.glanzSprite(34, '#4a2006', .8);
  K.luft.push({ p: .8, f(ctx, t, ox, oy) {
    const fl = Math.sin(t * 6.1) + Math.sin(t * 10.7) * .7; const g = fl > 0 ? g2 : g1;
    ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, x - g.R + ox, y - 8 - g.R + oy); ctx.globalCompositeOperation = 'source-over';
    const cols = ['#7a2a08', '#d0601a', '#ffb040', '#fff0c0'];
    for (let k = 0; k < 4; k++) {
      ctx.fillStyle = cols[k]; const w = [10, 7, 4, 2][k], hh = [12, 9, 6, 3][k];
      for (let j = 0; j < hh; j++) { const q = j / hh, ww = Math.max(1, Math.round(w * (1 - q) * (1 + .15 * Math.sin(t * 9 + j + k)))); const sx = Math.round(x - ww / 2 + Math.sin(t * 5 + j * .7) * q * 2); ctx.fillRect(sx + ox, y - 2 - j - k + oy, ww, 1); }
    }
  } });
  B.partikel(K, { n: 14, farben: ['#ffb040', '#d0601a'], x0: x - 10, x1: x + 10, y0: y - 60, y1: y - 6, vy: -9, wob: 3, wf: 2, blink: 2, p: .8 });
};
B.werkbank = function (K, x, y, d) {
  const m = B.maske(); m.rect(x - 34, y - 22, 68, 5); m.rect(x - 31, y - 17, 4, 17); m.rect(x + 27, y - 17, 4, 17); m.rect(x - 31, y - 9, 62, 2);
  m.rect(x - 22, y - 30, 12, 8); m.kap(x + 4, y - 23, x + 18, y - 25, 1, 1); m.kap(x + 16, y - 28, x + 20, y - 22, 2, 2);
  B.form(K.e[3], m, K.mat(0, { ton: 1.6, schatten: 2 }));
  const s = B.maske(); s.ell(x, y + 1, 40, 3); B.form(K.e[4], s, K.mat(0, { ton: 0, rand: 0, fase: 0 }));
  if (d !== false) B.flamme(K, x - 16, y - 31, { p: .3 });
};
B.stand = function (K, x, y) {
  const m = B.maske();
  m.rect(x - 30, y - 26, 60, 6); m.rect(x - 28, y - 20, 56, 20); m.kap(x - 32, y - 72, x - 32, y, 1.6, 1.6); m.kap(x + 32, y - 76, x + 32, y, 1.6, 1.6);
  m.poly([[x - 40, y - 70], [x + 40, y - 78], [x + 42, y - 70], [x - 38, y - 62]]);
  for (let i = 0; i < 4; i++) m.ell(x - 18 + i * 12 + (i % 2) * 2, y - 30 - (i % 2) * 2, 4 + (i % 2), 4);
  B.form(K.e[3], m, K.mat(0, { ton: 1.5, schatten: 2 }));
  B.flamme(K, x + 24, y - 60, { p: .3 }); for (const L of [K.e[3], K.e[4]]) B.gluehen(L, x + 24, y - 58, 40, '#4a3010', .8);
};
B.fundstueck = function (K, x, y, pal) {
  const m = B.maske(); m.rect(x - 14, y - 12, 28, 12); m.poly([[x - 15, y - 12], [x - 12, y - 18], [x + 12, y - 18], [x + 15, y - 12]]);
  B.form(K.e[4], m, K.mat(0, { ton: 1.6, schatten: 2, muster: (px, py) => (py === y - 7 ? -1 : 0) }));
  B.gluehen(K.e[4], x, y - 14, 18, B.mix(pal.augen, '#000', .7), .9);
  K.anim.push({ p: .5, f(ctx, t, ox, oy) { if (Math.sin(t * 1.7) > .6) { ctx.fillStyle = pal.augen; ctx.fillRect(x + 6 + ox, y - 15 + oy, 1, 1); } } });
};
// Generischer Zusatz je Art (Biome dürfen eigene Zusätze statt dessen setzen)
B.artZusatz = function (K, o) {
  const art = K.o.art, y = o.y || 205, x = o.x || 240;
  if (art === 'rast') {
    for (let i = 0; i < 4; i++) B.dith(K.e[i], -M, -M, W + M, H + M, K.pal.koerper[0], (px, py) => .25 + .1 * i - Math.abs(px - x) / 1600);
    B.feuer(K, x, y + 14);
  } else if (art === 'werkstatt') B.werkbank(K, x, y + 4);
  else if (art === 'kraemer') B.stand(K, x + 30, y - 4);
  else if (art === 'fund' || art === 'ereignis') B.fundstueck(K, x, y, K.pal);
};

// ---------- Gegner-Platzhalter (für Labor und Fotos) ----------
B.platzhalter = function (pal, nr) {
  const e = new Ebene(), m = B.maske(), cx = 48, fy = 118, r = B.rng(nr * 31 + 5);
  const h = 78 + r.i(0, 20), w = 22 + r.i(0, 10);
  m.poly([[cx - w, fy], [cx - w * .55, fy - h * .62], [cx - 9, fy - h + 8], [cx + 8, fy - h + 6], [cx + w * .5, fy - h * .6], [cx + w + 2, fy]]);
  m.ell(cx, fy - h + 2, 10, 12);
  m.kap(cx + w * .4, fy - h * .6, cx + w + 6, fy - h * .25, 4, 2);
  for (let i = 0; i < 5; i++) m.poly([[cx - w + i * w * .42, fy], [cx - w + i * w * .42 + 6, fy + 0], [cx - w + i * w * .42 + 3, fy - 6 - r.i(0, 5)]], 0);
  const mat = { k: pal.koerper.map(B.pk), r: pal.rand.map(B.pk), ton: 1.2, fase: 1.5, rand: 2, verlauf: .4 };
  B.form(e, m, mat);
  const a = B.pk(pal.augen); e.set(cx - 3, fy - h + 2, a); e.set(cx + 3, fy - h + 2, a);
  B.gluehen(e, cx, fy - h + 2, 7, B.mix(pal.augen, '#000', .55), .9);
  const c = document.createElement('canvas'); c.width = 96; c.height = 120; const x = c.getContext('2d');
  x.drawImage(e.leinwand(), -M, -M); return c;
};

// ---------- Öffentliche Schnittstelle ----------
World.BIOME = ['hafen', 'moor', 'kapelle', 'salz', 'stadt', 'eis', 'pforte'];
World.ARTEN = ['kampf', 'waechter', 'weg', 'rast', 'werkstatt', 'kraemer', 'ereignis', 'wandbild', 'fund', 'uebergang', 'strand', 'ankunft', 'titel'];
World.build = function (biom, opt) {
  const o = Object.assign({ variante: 0, seed: 1, fremdheit: 0, art: 'kampf' }, opt || {});
  o.variante = clamp(o.variante | 0, 0, 2); o.biom = World._biome[biom] ? biom : 'hafen';
  if (World._spezial[o.art]) return World._spezial[o.art](o);
  return World._biome[o.biom].build(o);
};
World.palette = function (biom) {
  const p = (World._biome[biom] || World._biome.hafen).pal;
  return { koerper: p.koerper.slice(), rand: p.rand.slice(), augen: p.augen, nebel: p.nebel.slice() };
};
World.relief = function (biom, seed) {
  const def = World._biome[biom] || World._biome.hafen;
  return B.relief(def.pal, seed || 1, def.reliefStil || {});
};

// ---------- Wandbild-Relief 160×100 (Ritzlinien mit Randlicht) ----------
B.relief = function (pal, seed, stil) {
  const r = B.rng(seed * 977 + 3), e = new Ebene(), w = 160, h = 100;
  const stein = stil.stein || [B.mix(pal.koerper[2], pal.nebel[1], .5), B.mix(pal.koerper[3], pal.nebel[1], .6), B.mix(pal.koerper[3], pal.rand[0], .45), B.mix(pal.rand[0], pal.nebel[1], .3)];
  const P = stein.map(B.pk);
  B.feld(e, 0, 0, w, h, stein, (x, y) => .38 + .25 * B.fbm(x * .05, y * .05, seed, 3) - y / h * .12);
  // Ritzung: Figuren entlang eines Bandes, die sich einem Großen zuwenden
  const ritz = B.maske(), gx = stil.grossX || r.f(100, 130);
  const fig = stil.figuren || 4;
  for (let i = 0; i < fig; i++) {
    const x = 14 + i * (gx - 40) / Math.max(1, fig - 1) + r.j(4), y = 76, gl = (stil.gelenke || 3) + r.i(0, 2);
    let px = x, py = y, a = -Math.PI / 2 + .5 + i * .05; const pts = [[px, py]];
    for (let k = 0; k < gl; k++) { a += (k % 2 ? .9 : -.7) * (stil.knick || .6); px += Math.cos(a) * 9; py += Math.sin(a) * 9; pts.push([px, py]); }
    ritz.pfad(pts, 1.2, 1); ritz.ell(px + 2, py - 2, 2.5, 2.5);
    ritz.kap(x - 4, y, x + 4, y, 1, 1);
  }
  ritz.ell(gx + 12, 46, 22, 30); ritz.ell(gx + 12, 46, 18, 26, 0);
  for (let k = 0; k < 5; k++) { const a = -2.6 + k * .55; ritz.kap(gx + 12 + Math.cos(a) * 22, 46 + Math.sin(a) * 30, gx + 12 + Math.cos(a) * 34, 46 + Math.sin(a) * 42, 1, .8); }
  ritz.ell(gx + 12, 44, 3, 3);
  ritz.rect(4, 86, 152, 2); ritz.rect(4, 8, 152, 2);
  // Ritzlinie: dunkel, mit Licht an der Unterkante links (die Kante gegenüber dem Licht fängt es)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!ritz.has(x, y)) continue; e.set(x, y, B.pk(pal.koerper[1]));
    if (!ritz.has(x - 1, y + 1)) e.set(x - 1, y + 1, P[3]);
    if (!ritz.has(x + 1, y - 1) && !ritz.has(x + 1, y)) e.set(x + 1, y - 1, B.pk(pal.koerper[0]));
  }
  e.set(gx + 12, 44, B.pk(pal.augen)); B.gluehen(e, gx + 12, 44, 8, B.mix(pal.augen, '#000', .6), .8);
  const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(e.leinwand(), -M, -M); return c;
};
})();
