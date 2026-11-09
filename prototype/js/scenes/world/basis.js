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
  B.form(K.e[4], m, K.mat(0, { ton: 1.6, schatten: 2 }));
  const s = B.maske(); s.ell(x, y + 1, 40, 3); B.form(K.e[4], s, K.mat(0, { ton: 0, rand: 0, fase: 0 }));
  if (d !== false) { B.flamme(K, x - 16, y - 31, { p: .5 }); K.glut(x - 16, y - 30, 40, '#4a3010', .8, [3, 4]); }
};
B.stand = function (K, x, y) {
  const m = B.maske();
  m.rect(x - 30, y - 26, 60, 6); m.rect(x - 28, y - 20, 56, 20); m.kap(x - 32, y - 72, x - 32, y, 1.6, 1.6); m.kap(x + 32, y - 76, x + 32, y, 1.6, 1.6);
  m.poly([[x - 40, y - 70], [x + 40, y - 78], [x + 42, y - 70], [x - 38, y - 62]]);
  for (let i = 0; i < 4; i++) m.ell(x - 18 + i * 12 + (i % 2) * 2, y - 30 - (i % 2) * 2, 4 + (i % 2), 4);
  B.form(K.e[4], m, K.mat(0, { ton: 1.5, schatten: 2 }));
  B.flamme(K, x + 24, y - 60, { p: .5 }); for (const L of [K.e[3], K.e[4]]) B.gluehen(L, x + 24, y - 58, 40, '#4a3010', .8);
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
// opt.phase (nur Wächter-Szene): Boss-Phase 0, 1, 2 … aus buehne.js; ein Biom darf seine Wächter-Szene damit je Phase verändern
World.build = function (biom, opt) {
  const o = Object.assign({ variante: 0, seed: 1, fremdheit: 0, art: 'kampf', phase: 0 }, opt || {});
  o.variante = clamp(o.variante | 0, 0, 2); o.biom = World._biome[biom] ? biom : 'hafen';
  // Ein Biom darf eine Sonderszene selbst mitbringen (z. B. World._biome.ufer.ankunft), sonst gilt die gemeinsame
  if (World._spezial[o.art] && typeof World._biome[o.biom][o.art] === 'function') return World._biome[o.biom][o.art](o);
  if (World._spezial[o.art]) return World._spezial[o.art](o);
  return World._biome[o.biom].build(o);
};
World.palette = function (biom) {
  const p = (World._biome[biom] || World._biome.hafen).pal;
  return { koerper: p.koerper.slice(), rand: p.rand.slice(), augen: p.augen, nebel: p.nebel.slice() };
};
// motiv: 'prozession' (Vorgabe), 'treppe', 'welle', 'auge', 'glocke', 'schiff', 'baum', 'rad', 'tuer', 'hand', 'turm', 'kette', 'waage'.
// Ohne oder mit unbekanntem Motiv malt es die Prozession.
World.relief = function (biom, seed, motiv) {
  const def = World._biome[biom] || World._biome.hafen;
  return B.relief(def.pal, seed || 1, def.reliefStil || {}, motiv);
};

// ---------- Wandbild-Relief 160×100 (Ritzlinien mit Randlicht) ----------
// Hilfen der Motive: alles Ritzmasken (Maske m, Wert 1 = geritzt), Pixelkoordinaten im Bild 160×100.
const rStrich = (m, x1, y1, x2, y2, r) => m.kap(x1, y1, x2, y2, r, r);
const rZug = (m, pts, r) => m.pfad(pts, r, r);
// Ellipsenring (Wandstärke t), optional gedreht um w
function rRing(m, cx, cy, rx, ry, t, w) {
  const c = Math.cos(w || 0), s = Math.sin(w || 0), R = Math.max(rx, ry) + 1, ix = Math.max(.4, rx - t), iy = Math.max(.4, ry - t);
  m.fn(cx - R, cy - R, cx + R, cy + R, (x, y) => {
    const dx = x - cx, dy = y - cy, u = dx * c + dy * s, v = -dx * s + dy * c;
    return (u / rx) ** 2 + (v / ry) ** 2 <= 1 && (u / ix) ** 2 + (v / iy) ** 2 >= 1;
  });
}
// Bogen als Linienzug (Winkel in Bogenmaß, y nach unten: π..2π ist die obere Hälfte)
function rBogen(m, cx, cy, rx, ry, a0, a1, r) {
  const n = Math.max(4, Math.ceil(Math.abs(a1 - a0) * Math.max(rx, ry) / 2.2)), pts = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return m.pfad(pts, r, r);
}
// Umriss der Dicke t einer gefüllten Maske f nach m
function rKontur(f, m, t) {
  t = t || 1; if (f.leer()) return;
  const nb = []; for (let j = -t; j <= t; j++) for (let i = -t; i <= t; i++) if (Math.abs(i) + Math.abs(j) <= t && (i || j)) nb.push([i, j]);
  for (let y = f.y0; y <= f.y1; y++) for (let x = f.x0; x <= f.x1; x++) {
    if (!f.has(x, y)) continue;
    for (const o of nb) if (!f.has(x + o[0], y + o[1])) { m.put(x, y, 1); break; }
  }
}
// Kleine Gestalt (Füße bei x,y, Höhe ≈ 11·s); arm: 'hoch' | 'beide' | 'zeig' | undefined
function rMensch(m, x, y, s, arm, dir) {
  s = s || 1; dir = dir || 1;
  m.ell(x, y - 10 * s, 1.7 * s, 1.9 * s);
  m.kap(x, y - 8 * s, x, y - 4 * s, 1.1 * s, .9 * s);
  m.kap(x, y - 4 * s, x - 1.8 * s, y, .8, .8); m.kap(x, y - 4 * s, x + 1.8 * s, y, .8, .8);
  if (arm === 'hoch') m.kap(x, y - 7.5 * s, x + 3 * dir * s, y - 13 * s, .8, .8);
  else if (arm === 'beide') { m.kap(x, y - 7.5 * s, x - 3 * s, y - 13 * s, .8, .8); m.kap(x, y - 7.5 * s, x + 3 * s, y - 13 * s, .8, .8); }
  else if (arm === 'zeig') m.kap(x, y - 7.5 * s, x + 4 * dir * s, y - 8 * s, .8, .8);
  else m.kap(x, y - 7.5 * s, x + 1.5 * dir * s, y - 4.5 * s, .7, .7);
}
// Steinfugen in eine gefüllte Fläche f: Lagen alle hz Pixel, Stoßfugen alle bw Pixel versetzt
function rFugen(f, m, hz, bw, y0) {
  for (let y = f.y0; y <= f.y1; y++) {
    if (y < y0 || (y - y0) % hz) continue;
    const k = Math.floor((y - y0) / hz);
    for (let x = f.x0; x <= f.x1; x++) {
      if (!f.has(x, y) || !f.has(x, y - 2) || !f.has(x, y + 2)) continue;
      m.put(x, y, 1);
      if ((x + k * (bw >> 1)) % bw === 0) for (let j = 1; j < hz && f.has(x, y + j); j++) m.put(x, y + j, 1);
    }
  }
}

const MOTIV = {};
B.reliefMotive = MOTIV;

// Treppe, die in dunkles Wasser hinabführt; Gestalten gehen Hand in Hand hinunter
MOTIV.treppe = function (m, r) {
  const n = r.i(8, 9), x0 = Math.round(r.f(10, 16)), y0 = Math.round(r.f(20, 25)), dx = r.f(8.6, 9.4), dy = r.f(5.6, 6.2), f = B.maske();
  const top = [];
  for (let i = 0; i < n; i++) { top.push([x0 + i * dx, y0 + i * dy], [x0 + (i + 1) * dx, y0 + i * dy]); }
  top.push([x0 + n * dx, y0 + n * dy], [x0 + n * dx, 84], [x0, 84]);
  f.poly(top); rKontur(f, m, 1);
  // Unterseite der Stufenplatten: zweiter Stufenzug, 8 Pixel tiefer, nur innerhalb der Masse
  const g = B.maske(); const un = []; for (let i = 0; i < n; i++) un.push([x0 + i * dx, y0 + i * dy + 8], [x0 + (i + 1) * dx, y0 + i * dy + 8]);
  rZug(g, un, .6); g.fn(0, 0, 159, 99, (x, y) => !f.has(x, y), 0);
  for (let y = 0; y < 100; y++) for (let x = 0; x < 160; x++) if (g.has(x, y)) m.put(x, y, 1);
  // Mauerfugen nur links unten unter dem Stufenzug
  for (let y = Math.round(y0) + 24; y < 84; y += 7) for (let x = x0 + 2; x < x0 + 5 * dx && f.has(x, y) && f.has(x, y + 2); x++) if (y + 2 > y0 + (x - x0) / dx * dy + 14) m.put(x, y, 1);
  // Wasserlinie: die unteren drei Stufen liegen darunter, rechts davon Schuppenwellen
  const yw = Math.round(y0 + (n - 3) * dy) + 1, xw = x0 + (n - 3) * dx;
  for (let x = Math.ceil(xw); x < 156; x++) if (x % 10 < 7) m.put(x, yw + Math.round(Math.sin(x * .4) * .8), 1);
  for (let k = 0; k < 3; k++) {
    const rr = 5, off = (k % 2) * rr;
    for (let x = Math.ceil(xw) + 2 - off; x < 154; x += rr * 2) rBogen(m, x + rr, yw + 9 + k * 6, rr, rr * .6, Math.PI, Math.PI * 2, .6);
  }
  // Gestalten, Hand in Hand, auf den Stufen
  const a = r.i(1, 2), gz = r.i(3, 4);
  for (let k = 0; k < gz; k++) { const i = a + k * 1.7, x = x0 + (Math.floor(i) + .5) * dx, y = y0 + Math.floor(i) * dy; rMensch(m, x, y, 1.05, 'beide'); }
  return [Math.min(148, xw + r.f(28, 40)), Math.min(80, yw + 14)];
};

// Wasser: Wellenreihen und eine große überschlagende Welle
MOTIV.welle = function (m, r) {
  const fl = r.ja(.5), X = x => fl ? 159 - x : x, cx = X(r.f(66, 90)), cy = r.f(36, 40), dir = fl ? -1 : 1;
  // Schuppenwellen unten, groß und in versetzten Reihen
  for (let k = 0; k < 3; k++) {
    const y = 68 + k * 6, rr = 8, off = (k % 2) * rr;
    for (let x = 4 - off; x < 160; x += rr * 2) for (let j = 0; j < 2; j++) rBogen(m, x + rr, y + 3, rr - j * 3, (rr - j * 3) * .75, Math.PI, Math.PI * 2, .6);
  }
  // der große Brecher: Rücken von der Seite, steigt, rollt über
  const sp = [], R0 = 30;
  for (let i = 0; i <= 28; i++) { const a = -Math.PI * 1.05 + i * 0.205; const rad = R0 * (1 - i * .027); sp.push([cx + dir * Math.cos(a) * rad * .9, cy + Math.sin(a) * rad]); }
  const back = [[X(6), 66], [X(26), 64], [X(44), 58], [sp[0][0] - dir * 6, sp[0][1] + 8], sp[0]];
  rZug(m, back, 1.2); rZug(m, sp, 1.2);
  rZug(m, sp.slice(6, 20).map(p => [cx + (p[0] - cx) * .78, cy + (p[1] - cy) * .78 + 1]), .8);
  // Gischtfinger an der Spitze und Schaumpunkte
  const tip = sp[sp.length - 1];
  for (let k = 0; k < 4; k++) rStrich(m, tip[0] + dir * k * 2, tip[1] + 1, tip[0] + dir * (k * 2 + 1), tip[1] + 4 + k * 2.2, .8);
  for (let k = 0; k < 9; k++) m.ell(cx + dir * (r.f(-26, 26) + 4), cy - 32 + r.f(0, 12) + Math.abs(k - 4) * 1.5, 1, 1);
  rMensch(m, X(r.f(128, 142)), 66, .9, 'hoch', -dir);
  return [cx - dir * 2, cy + 1];
};

// Ein großes Auge: Mandel, Lid, Iris, Strahlen; unten kleine Gestalten, die hinaufsehen
MOTIV.auge = function (m, r) {
  const cx = r.f(68, 92), cy = r.f(42, 48), rw = r.f(40, 48), oben = r.f(15, 20), unten = r.f(11, 15);
  const obenPts = [], untenPts = [];
  for (let i = 0; i <= 24; i++) { const u = i / 24 * 2 - 1, s = 1 - u * u; obenPts.push([cx + u * rw, cy - oben * Math.pow(s, .8)]); untenPts.push([cx + u * rw, cy + unten * Math.pow(s, .9)]); }
  rZug(m, obenPts, 1.2); rZug(m, untenPts, 1.2);
  // Lidfalte
  rZug(m, obenPts.filter((p, i) => i >= 3 && i <= 21).map(p => [cx + (p[0] - cx) * 1.02, p[1] - 6 - Math.abs(p[0] - cx) * .05]), .9);
  // Iris und Pupille
  rRing(m, cx, cy, 15, 15, 1.7); rRing(m, cx, cy, 7, 7, 1.3);
  for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8; rStrich(m, cx + Math.cos(a) * 8.5, cy + Math.sin(a) * 8.5, cx + Math.cos(a) * 13, cy + Math.sin(a) * 13, .5); }
  // Wimpernstrahlen nach oben
  for (let k = 0; k < 9; k++) { const a = -Math.PI + (k + .5) * Math.PI / 9, ex = cx + Math.cos(a) * rw * .9, ey = cy - oben * Math.pow(Math.max(0, 1 - (Math.cos(a) * .9) ** 2), .8); rStrich(m, ex, ey - 2, ex + Math.cos(a) * 6, ey - 4 + Math.sin(a) * 6, .6); }
  // Gestalten unten, alle blicken hinauf
  const g = r.i(5, 7); for (let k = 0; k < g; k++) rMensch(m, 16 + k * 128 / (g - 1) + r.j(2), 84, .9, k % 3 === 1 ? 'hoch' : undefined, k % 2 ? 1 : -1);
  return [cx, cy];
};

// Glocke im Gerüst, Schallbögen, ein Mensch daneben
MOTIV.glocke = function (m, r) {
  const cx = Math.round(r.f(70, 90)), top = 28, hw = [[5, 28], [7, 31], [9, 36], [10, 43], [11, 50], [13, 58], [16, 64], [20, 69], [24, 73], [25.5, 76]];
  const f = B.maske(), L = hw.map(p => [cx - p[0], p[1]]), Rr = hw.slice().reverse().map(p => [cx + p[0], p[1]]);
  f.poly(L.concat(Rr)); rKontur(f, m, 1);
  const halb = y => { for (let i = 0; i < hw.length - 1; i++) if (y >= hw[i][1] && y <= hw[i + 1][1]) return hw[i][0] + (hw[i + 1][0] - hw[i][0]) * (y - hw[i][1]) / (hw[i + 1][1] - hw[i][1]); return hw[hw.length - 1][0]; };
  for (const y of [36, 40, 68, 72]) { const w = halb(y); rStrich(m, cx - w, y, cx + w, y, .5); }
  for (let k = 0; k < 7; k++) { const y = 50 + (k % 2) * 3, x = cx - 10 + k * 3.4; m.rect(x, y, 1, 4); }
  // Mund und Klöppel
  rStrich(m, cx - 25, 76, cx + 25, 76, 1);
  rRing(m, cx, 80, 3.5, 3.5, 1.1); rStrich(m, cx, 77, cx, 76, .8);
  // Krone, Joch, Balken
  for (let k = -1; k <= 1; k++) rRing(m, cx + k * 4.5, 25, 2.4, 3, 1);
  const bx = 48; rStrich(m, cx - bx, 21, cx + bx, 21, 1.4); rStrich(m, cx - 6, 22, cx - 6, 24, .8); rStrich(m, cx + 6, 22, cx + 6, 24, .8);
  for (const s of [-1, 1]) { rStrich(m, cx + s * bx, 21, cx + s * bx, 84, 1.4); rStrich(m, cx + s * bx, 36, cx + s * (bx - 14), 21, .8); }
  // Schallbögen
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) rBogen(m, cx + s * 26, 56, 4 + k * 5, 8 + k * 6, s > 0 ? -1 : Math.PI - 1, s > 0 ? 1 : Math.PI + 1, .6);
  rMensch(m, cx + 36 + r.i(-2, 2), 84, 1, 'hoch', -1);
  return [cx, 80];
};

// Schiff mit Segeln, kleine Schiffe hinter ihm, Wellen davor
MOTIV.schiff = function (m, r) {
  const sx = Math.round(r.f(8, 18)), f = B.maske();
  const hull = [[sx, 54], [sx + 12, 60], [sx + 80, 60], [sx + 96, 49], [sx + 90, 64], [sx + 72, 72], [sx + 16, 72], [sx + 4, 64]];
  f.poly(hull); rKontur(f, m, 1);
  for (const y of [64, 68]) for (let x = sx; x < sx + 96; x++) if (f.has(x, y) && f.has(x, y - 1) && f.has(x, y + 2) && f.has(x - 3, y) && f.has(x + 3, y)) m.put(x, y, 1);
  for (let k = 0; k < 6; k++) m.rect(sx + 22 + k * 10, 61, 1, 2);
  // Masten, Rahen, gebauschte Segel
  const mx = [sx + 22, sx + 46, sx + 68], mh = [r.i(26, 30), r.i(15, 19), r.i(26, 30)];
  const segel = (x, ya, yb, w) => {
    const q = B.maske(), mid = (ya + yb) / 2;
    q.poly([[x - w / 2, ya], [x + w / 2, ya], [x + w / 2 + 2, mid], [x + w / 2, yb], [x, yb - 2.5], [x - w / 2, yb], [x - w / 2 - 2, mid]]);
    m.fn(x - w, ya - 1, x + w, yb + 1, (px, py) => q.has(px, py), 0); rKontur(q, m, 1);
  };
  for (let i = 0; i < 3; i++) rStrich(m, mx[i], mh[i], mx[i], 60, 1);
  for (let i = 0; i < 3; i++) {
    const x = mx[i], y0 = mh[i], w = i === 1 ? 22 : 18;
    let ya = y0 + 3; for (let s = 0; s < 2; s++) { segel(x, ya + 1, ya + 13, w); rStrich(m, x - w / 2 - 1.5, ya, x + w / 2 + 1.5, ya, .7); ya += 16; }
  }
  // Takelage
  rStrich(m, mx[0], mh[0], sx + 2, 56, .6); rStrich(m, mx[2], mh[2], sx + 95, 49, .6);
  rStrich(m, mx[0], mh[0], mx[1], mh[1], .6); rStrich(m, mx[1], mh[1], mx[2], mh[2], .6);
  rStrich(m, sx + 95, 49, sx + 108, 41, .8);
  // kleine Schiffe in der Ferne: Rumpf, Mast, Dreieckssegel
  for (const fx of [r.i(124, 130), r.i(144, 148)]) {
    const fy = fx > 140 ? 52 : 58, sf = B.maske(), sg = B.maske();
    sf.poly([[fx - 9, fy], [fx + 9, fy], [fx + 6, fy + 5], [fx - 6, fy + 5]]); rKontur(sf, m, 1);
    rStrich(m, fx, fy - 18, fx, fy, .7); sg.poly([[fx + 1, fy - 17], [fx + 9, fy - 2], [fx + 1, fy - 2]]); rKontur(sg, m, 1); rStrich(m, fx - 1, fy - 12, fx - 6, fy - 2, .6);
  }
  // Wellen
  for (let k = 0; k < 3; k++) for (let x = 4 + (k % 2) * 6; x < 154; x += 12) rBogen(m, x + 5, 78 + k * 3, 5, 2.6, Math.PI, Math.PI * 2, .5);
  rMensch(m, sx + 36, 60, .8, 'zeig');
  return [mx[0], mh[0] - 3];
};

// Baum: Krone aus Ästen, kräftiger Stamm mit Hohlraum und Kerben, Wurzeln unter der Erde
MOTIV.baum = function (m, r) {
  const cx = Math.round(r.f(66, 94)), f = B.maske(), gy = 62;
  const br = (x, y, a, len, rad, d) => {
    const nx = x + Math.cos(a) * len, ny = y + Math.sin(a) * len;
    f.kap(x, y, nx, ny, rad, Math.max(1.3, rad * .72));
    if (d >= 4) { f.kap(nx, ny, nx + Math.cos(a) * 3, ny + Math.sin(a) * 3, 1.2, 1); return; }
    const k = d === 0 ? 2 : (r.ja(.3) ? 3 : 2);
    for (let i = 0; i < k; i++) { const da = k === 2 ? (i ? 1 : -1) * r.f(.5, .8) : (i - 1) * r.f(.55, .8); br(nx, ny, a + da, len * r.f(.72, .82), Math.max(1.3, rad * .66), d + 1); }
  };
  br(cx, gy, -Math.PI / 2 + r.j(.04), 15, 5.6, 0);
  f.poly([[cx - 8, gy + 2], [cx - 5, gy - 8], [cx + 5, gy - 8], [cx + 8, gy + 2]]);
  rKontur(f, m, 1);
  rRing(m, cx, gy - 4, 2.6, 3.8, 1);
  for (let k = 0; k < 5; k++) rStrich(m, cx + 5.5, gy - 1 - k * 2.4, cx + 8, gy - 1 - k * 2.4, .5);
  // Erde mit Lücke am Stamm, Wurzeln darunter nach außen
  for (let x = 4; x < 156; x++) if (Math.abs(x - cx) > 9 && x % 11 < 8) m.put(x, gy + 1 + Math.round(Math.sin(x * .3) * .6), 1);
  for (let k = 0; k < 6; k++) {
    const sd = k < 3 ? -1 : 1, kk = k % 3, pts = [[cx + sd * 3, gy + 2]]; let px = pts[0][0], py = pts[0][1], aa = (sd < 0 ? Math.PI : 0) + sd * -(.35 + kk * .55) * 1 + (sd < 0 ? 0 : 0);
    aa = sd < 0 ? Math.PI - (.3 + kk * .5) : (.3 + kk * .5);
    for (let s = 0; s < 6; s++) { aa += sd * r.j(.25) * 0 + r.j(.25); px += Math.cos(aa) * 6; py += Math.sin(aa) * 5; pts.push([px, py]); }
    m.pfad(pts.filter(p => p[1] < 84), 1.4, .5);
  }
  rMensch(m, cx - r.i(30, 38), gy, 1, 'hoch', 1); rMensch(m, cx + r.i(28, 36), gy, 1);
  return [cx, gy - 4];
};

// Zahnrad mit Speichen und Skala, ein kleineres greift hinein
MOTIV.rad = function (m, r) {
  const cx = Math.round(r.f(52, 68)), cy = 49, n = r.i(14, 18), Rb = 27, Rt = 32, f = B.maske();
  const zahn = (cx, cy, Rb, Rt, n, w0) => {
    const pts = [], p = Math.PI * 2 / n;
    for (let i = 0; i < n; i++) { const a = w0 + i * p; for (const q of [[Rb, -.40], [Rt, -.24], [Rt, .24], [Rb, .40], [Rb, .5]]) pts.push([cx + Math.cos(a + q[1] * p) * q[0], cy + Math.sin(a + q[1] * p) * q[0]]); }
    const t = B.maske(); t.poly(pts); return t;
  };
  rKontur(zahn(cx, cy, Rb, Rt, n, 0), m, 1);
  rRing(m, cx, cy, Rb - 4, Rb - 4, 1.2);
  for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12, l = k % 6 ? 2.5 : 4.5; rStrich(m, cx + Math.cos(a) * (Rb - 6), cy + Math.sin(a) * (Rb - 6), cx + Math.cos(a) * (Rb - 6 - l), cy + Math.sin(a) * (Rb - 6 - l), .5); }
  const sp = r.i(5, 7), w0 = r.f(0, 1);
  for (let k = 0; k < sp; k++) { const a = w0 + k * Math.PI * 2 / sp; m.kap(cx + Math.cos(a) * 6, cy + Math.sin(a) * 6, cx + Math.cos(a) * (Rb - 7), cy + Math.sin(a) * (Rb - 7), 1.5, 1.1); }
  rRing(m, cx, cy, 7, 7, 1.4);
  // kleines Rad rechts, greift ein
  const c2x = cx + 40, c2y = cy + r.i(-6, 6), n2 = Math.round(n * 9 / Rb * .95) + 2;
  rKontur(zahn(c2x, c2y, 9, 13, Math.max(6, Math.round(n * 13 / 32)), .3), m, 1);
  rRing(m, c2x, c2y, 5, 5, 1.2);
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + .5; rStrich(m, c2x, c2y, c2x + Math.cos(a) * 6, c2y + Math.sin(a) * 6, .8); }
  void n2;
  // Welle und Lager, Gestalten am Fuß
  m.rect(cx - 1, cy + Rt - 2, 2, 84 - cy - Rt + 2); rStrich(m, cx - 14, 84, cx + 14, 84, 1);
  rMensch(m, c2x + 26 + r.i(0, 8), 84, 1, 'hoch', -1); rMensch(m, c2x + 38 + r.i(0, 8), 84, .9);
  return [cx, cy];
};

// Tür mit Rundbogen, Bogensteinen, Füllungen; Licht im Schlüsselloch; Gestalten davor
MOTIV.tuer = function (m, r) {
  const cx = Math.round(r.f(60, 90)), hw = r.i(17, 20), bogen = r.ja(.7), f = B.maske(), g = B.maske(), yb = 84, yt = bogen ? 34 : 26;
  const form = (b, w) => {
    const pts = [[cx - w, yb], [cx - w, yt]];
    if (bogen) for (let i = 1; i < 16; i++) { const a = Math.PI + i * Math.PI / 16; pts.push([cx + Math.cos(a) * w, yt + Math.sin(a) * w]); }
    else pts.push([cx - w, yt - 1], [cx + w, yt - 1]);
    pts.push([cx + w, yt], [cx + w, yb]); b.poly(pts);
  };
  form(f, hw); form(g, hw + 6);
  rKontur(g, m, 1); rKontur(f, m, 1);
  // Bogensteine
  if (bogen) for (let k = 1; k < 9; k++) { const a = Math.PI + k * Math.PI / 9; rStrich(m, cx + Math.cos(a) * (hw + .5), yt + Math.sin(a) * (hw + .5), cx + Math.cos(a) * (hw + 5), yt + Math.sin(a) * (hw + 5), .5); }
  else for (let k = -2; k <= 2; k++) rStrich(m, cx + k * (hw + 3) / 2.2, yt - 7, cx + k * (hw + 3) / 2.2, yt - 1, .5);
  for (let y = yt + 8; y < yb; y += 9) { rStrich(m, cx - hw - 6, y, cx - hw, y, .5); rStrich(m, cx + hw, y + 4, cx + hw + 6, y + 4, .5); }
  // Füllungen: zwei Reihen
  const py = yt + (bogen ? 12 : 8), ph = (yb - 8 - py - 4) / 2;
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) { const w = hw - 4, x = cx - hw + 3 + i * (w + 2.5 - 1), pw = w - 1; m.rect(x, py + j * (ph + 4), pw, 1); m.rect(x, py + j * (ph + 4) + ph, pw, 1); m.rect(x, py + j * (ph + 4), 1, ph + 1); m.rect(x + pw - 1, py + j * (ph + 4), 1, ph + 1); }
  // Bänder, Angeln, Klinke, Schlüsselloch
  for (const y of [yt + 6, yb - 9]) rStrich(m, cx - hw, y, cx - hw + 7, y, .8);
  rRing(m, cx + hw - 6, 58, 2.2, 2.2, 1); rStrich(m, cx + hw - 6, 54, cx + hw - 6, 52, .6);
  // Schwelle
  for (let k = 0; k < 3; k++) rStrich(m, cx - hw - 6 - k * 4, yb - 1 - 0, cx + hw + 6 + k * 4, yb - 1, .0 + .5), void k;
  rStrich(m, 6, yb, 154, yb, .6);
  const ndir = r.ja(.5) ? 1 : -1, nx = ndir > 0 ? cx + hw + 14 : cx - hw - 14, k0 = r.i(2, 3);
  for (let k = 0; k < k0; k++) rMensch(m, nx + ndir * k * 9 + r.i(-1, 1), yb, 1, k === 0 ? 'zeig' : undefined, -ndir);
  return [cx + hw - 6, 58];
};

// Offene Hand mit Fingern und Handlinien, Gestalt zum Maßstab
MOTIV.hand = function (m, r) {
  const fl = r.ja(.5), s = fl ? -1 : 1, cx = Math.round(r.f(62, 96)), py = 62, f = B.maske(), tilt = r.j(.12);
  const P = (x, y) => [cx + s * (x * Math.cos(tilt) - (y - py) * Math.sin(tilt)), py + x * Math.sin(tilt) + (y - py) * Math.cos(tilt)];
  const fing = (x, y, a, len, r1, r2) => { const p = P(x, y), q = P(x + Math.cos(a) * len, y + Math.sin(a) * len); f.kap(p[0], p[1], q[0], q[1], r1, r2); return [p, q]; };
  const pa = P(0, py); f.ell(pa[0], pa[1], 16.5, 13.5); const w1 = P(0, py + 6), w2 = P(0, 92); f.kap(w1[0], w1[1], w2[0], w2[1], 10.5, 10);
  const lens = [r.i(27, 31), r.i(34, 38), r.i(31, 35), r.i(24, 28)], xs = [-11.5, -4, 3.5, 11], fi = [];
  for (let i = 0; i < 4; i++) fi.push(fing(xs[i], py - 10, -Math.PI / 2 + (i - 1.5) * .12, lens[i], 3, 2.3));
  const dau = fing(-12.5, py + 1, -Math.PI + .75 + r.j(.1), 21, 3.8, 3);
  rKontur(f, m, 1);
  // Gelenkfalten
  for (const [p, q] of fi.concat([dau])) for (const t of [.38, .68]) { const x = p[0] + (q[0] - p[0]) * t, y = p[1] + (q[1] - p[1]) * t; rStrich(m, x - 2, y, x + 2, y, .5); }
  // Handlinien
  const L = [[-9, py - 3], [-4, py + 1], [0, py + 5], [4, py + 8], [5, py + 13]].map(p => P(p[0], p[1])); rZug(m, L, .5);
  const H = [[-11, py - 4], [-4, py - 6], [4, py - 5], [11, py - 2]].map(p => P(p[0], p[1])); rZug(m, H, .5);
  rMensch(m, fl ? 24 : 134, 84, 1, 'hoch', fl ? 1 : -1);
  const pm = P(0, py - 1); return [pm[0], pm[1] + 2];
};

// Turm mit Galerie und Laterne, Lichtstrahlen, Steinlagen, Felsfuß
MOTIV.turm = function (m, r) {
  const cx = Math.round(r.f(60, 100)), f = B.maske(), yb = 80, yg = 36, wb = r.i(15, 18), wt = r.i(8, 10);
  f.poly([[cx - wb, yb], [cx - wt, yg], [cx + wt, yg], [cx + wb, yb]]);
  f.rect(cx - wt - 5, yg - 4, 2 * wt + 10, 4);
  f.rect(cx - 6, yg - 14, 12, 11);
  f.poly([[cx - 8, yg - 14], [cx, yg - 24], [cx + 8, yg - 14]]);
  rKontur(f, m, 1);
  rFugen(f, m, 8, 10, yg + 3);
  // Fenster und Tür (Fugen dahinter weg)
  for (const y of [yg + 10, yg + 24]) { m.fn(cx - 3, y - 5, cx + 3, y + 5, () => true, 0); rRing(m, cx, y, 2.6, 4, 1.1); }
  m.fn(cx - 4, yb - 12, cx + 4, yb, () => true, 0); rRing(m, cx, yb - 6, 3.4, 6, 1.2);
  m.rect(cx - 6, yg - 11, 1, 6); m.rect(cx + 5, yg - 11, 1, 6); m.rect(cx - 1, yg - 12, 2, 8);
  for (let x = cx - wt - 4; x <= cx + wt + 4; x += 3) m.put(x, yg - 5, 1);
  // Strahlen aus der Laterne, gestrichelt und gefächert
  const ly = yg - 8;
  for (const sd of [-1, 1]) for (let k = -1; k <= 1; k++) {
    const t = k * .2, x0 = cx + sd * (wt + 9);
    for (let d = 0; d < 46; d += 9) rStrich(m, x0 + sd * d, ly + Math.tan(t) * (d + wt + 9), x0 + sd * (d + 5), ly + Math.tan(t) * (d + wt + 14), .5);
  }
  // Felsfuß
  for (let x = 4; x < 156; x++) { const d = Math.abs(x - cx), y = yb + Math.max(0, Math.round(Math.sin(x * .55) + (d > 30 ? (d - 30) * .08 : 0))) + (d < wb + 3 ? 0 : 1); if (d > wb - 1) m.put(x, Math.min(84, y), 1); }
  for (let x = cx - 40; x < cx + 40; x += 11) if (Math.abs(x - cx) > wb) rStrich(m, x, 83, x + 5, 83, .5);
  rMensch(m, cx + wb + r.i(10, 18), 80, .9, 'hoch', -1); rMensch(m, cx - wb - r.i(12, 20), 80, .9);
  return [cx, ly + 1];
};

// Hängende Kette aus Gliedern zwischen zwei Pfosten, ein Gewicht an einem Kettenstrang
MOTIV.kette = function (m, r) {
  const xa = r.i(18, 24), xb = r.i(136, 142), ya = r.i(20, 24), sag = r.i(34, 40), xm = (xa + xb) / 2, hwid = (xb - xa) / 2;
  const Y = x => ya + sag * (1 - ((x - xm) / hwid) ** 2);
  for (const x of [xa - 6, xb + 6]) { const f = B.maske(); f.rect(x - 4, ya - 8, 8, 84 - ya + 8); rKontur(f, m, 1); rRing(m, x + (x < xm ? 4 : -4), ya, 2.4, 2.4, 1); }
  // Glieder in gleichen Abständen entlang des Bogens
  const pts = []; for (let x = xa; x <= xb; x += .5) pts.push([x, Y(x)]);
  let acc = 0, nxt = 0, idx = 0; const mitte = [];
  for (let i = 1; i < pts.length; i++) {
    acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (acc >= nxt) {
      nxt += 8.2; const p = pts[i], a = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]);
      if (idx % 2 === 0) rRing(m, p[0], p[1], 5, 3, 1.1, a); else m.kap(p[0] - Math.cos(a) * 3.4, p[1] - Math.sin(a) * 3.4, p[0] + Math.cos(a) * 3.4, p[1] + Math.sin(a) * 3.4, 1.2, 1.2);
      mitte.push([Math.abs(p[0] - xm), p[0], p[1], a, idx]); idx++;
    }
  }
  mitte.sort((p, q) => p[0] - q[0]);
  const c = mitte.find(p => p[4] % 2 === 0), cxm = c[1], cym = c[2];
  m.fn(cxm - 8, cym - 8, cxm + 8, cym + 8, (x, y) => Math.hypot(x - cxm, y - cym) < 5.6 && Math.hypot(x - cxm, y - cym) > 1.8, 0);
  rRing(m, cxm, cym, 6.5, 4.5, 1.4, c[3]);
  // senkrechter Strang mit Gewicht
  const ys = cym + 5; let yy = ys, k = 0;
  while (yy < 64) { if (k % 2) rRing(m, cxm, yy + 3, 2.4, 3.6, 1); else m.kap(cxm, yy, cxm, yy + 6, 1.2, 1.2); yy += 6.5; k++; }
  const g = B.maske(); g.poly([[cxm - 11, 77], [cxm - 8, 66], [cxm + 8, 66], [cxm + 11, 77]]); g.rect(cxm - 13, 77, 26, 7); rKontur(g, m, 1);
  rStrich(m, cxm - 6, 71, cxm + 6, 71, .5);
  rMensch(m, xa + r.i(18, 26), 84, 1, 'hoch', -1); rMensch(m, xb - r.i(18, 26), 84, 1, 'zeig', -1);
  return [cxm, cym];
};

// Balkenwaage auf Säule; die schwere Schale hängt tief, darin eine Gestalt
MOTIV.waage = function (m, r) {
  const cx = Math.round(r.f(70, 90)), s = r.ja(.5) ? 1 : -1, ty = 24, L = 45, tilt = r.f(6, 9), f = B.maske();
  // Fuß und Säule
  f.poly([[cx - 12, 84], [cx - 9, 77], [cx + 9, 77], [cx + 12, 84]]); f.rect(cx - 3, 30, 6, 48); f.poly([[cx - 6, 33], [cx - 3, 29], [cx + 3, 29], [cx + 6, 33]]);
  rKontur(f, m, 1); for (const y of [82]) rStrich(m, cx - 10, y, cx + 10, y, .5);
  rRing(m, cx, ty, 3.4, 3.4, 1.2); rStrich(m, cx, ty + 3, cx, 30, 1);
  // Balken
  const ax = cx - L, ay = ty + s * tilt, bx = cx + L, by = ty - s * tilt;
  rStrich(m, ax, ay, bx, by, 1.2); rStrich(m, cx, ty - 7, cx, ty - 3, .8); rRing(m, cx, ty - 9, 2, 2, .9);
  const schale = (x, y, g) => {
    // Ketten, Schale, Inhalt
    rStrich(m, x, y, x - 15, y + 28, .5); rStrich(m, x, y, x + 15, y + 28, .5); rStrich(m, x, y, x, y + 28, .4);
    rRing(m, x, y, 1.8, 1.8, 1);
    const p = []; for (let i = 0; i <= 12; i++) { const a = i * Math.PI / 12; p.push([x + Math.cos(a) * 16, y + 28 + Math.sin(a) * 5.2]); }
    const t = B.maske(); t.poly(p); rKontur(t, m, 1); rStrich(m, x - 16, y + 28, x + 16, y + 28, .8);
    if (g === 'mensch') rMensch(m, x, y + 28, 1, 'beide');
    else if (g === 'haufen') { for (let k = 0; k < 4; k++) m.ell(x - 8 + k * 5.5 + r.j(1), y + 26 - (k % 2) * 2, 2.6, 2.2); }
  };
  schale(ax, ay, s > 0 ? 'mensch' : null); schale(bx, by, s > 0 ? null : 'mensch');
  return [cx, ty];
};

B.relief = function (pal, seed, stil, motiv) {
  const r = B.rng(seed * 977 + 3), e = new Ebene(), w = 160, h = 100;
  const stein = stil.stein || [B.mix(pal.koerper[2], pal.nebel[1], .5), B.mix(pal.koerper[3], pal.nebel[1], .6), B.mix(pal.koerper[3], pal.rand[0], .45), B.mix(pal.rand[0], pal.nebel[1], .3)];
  const P = stein.map(B.pk);
  B.feld(e, 0, 0, w, h, stein, (x, y) => .38 + .25 * B.fbm(x * .05, y * .05, seed, 3) - y / h * .12);
  const ritz = B.maske(); let auge;
  if (motiv && motiv !== 'prozession' && MOTIV[motiv]) {
    // eigene Komposition; Rand um den Bildinhalt freihalten, dann Rahmenbänder
    auge = MOTIV[motiv](ritz, r, stil);
    ritz.fn(-M, -M, w + M, 11, () => true, 0); ritz.fn(-M, 85, w + M, h + M, () => true, 0);
    ritz.fn(-M, -M, 3, h + M, () => true, 0); ritz.fn(156, -M, w + M, h + M, () => true, 0);
  } else {
    // Ritzung: Figuren entlang eines Bandes, die sich einem Großen zuwenden
    const gx = stil.grossX || r.f(100, 130);
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
    auge = [gx + 12, 44];
  }
  ritz.rect(4, 86, 152, 2); ritz.rect(4, 8, 152, 2);
  // Ritzlinie: dunkel, mit Licht an der Unterkante links (die Kante gegenüber dem Licht fängt es)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!ritz.has(x, y)) continue; e.set(x, y, B.pk(pal.koerper[1]));
    if (!ritz.has(x - 1, y + 1)) e.set(x - 1, y + 1, P[3]);
    if (!ritz.has(x + 1, y - 1) && !ritz.has(x + 1, y)) e.set(x + 1, y - 1, B.pk(pal.koerper[0]));
  }
  e.set(auge[0], auge[1], B.pk(pal.augen)); B.gluehen(e, auge[0], auge[1], 8, B.mix(pal.augen, '#000', .6), .8);
  const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(e.leinwand(), -M, -M); return c;
};
})();
