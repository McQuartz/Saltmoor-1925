// Saltmoor 1925 · Sprite-Werkzeug: Renderer, Paletten, PNG, Dither.
// Kette wie in docs/spritegen/zielbild/referenz/render.js:
// Distanzfelder -> Höhe (dome/bevel/flat) -> Normalen -> Licht -> Rampe mit Bayer-Dither,
// Randlicht an der Außenkante gegen rimDir (oben rechts), Kontaktschatten, kein Umriss.
// Unterschied zur Referenz: gerendert wird in einen Puffer aus Paletten-Indizes,
// damit jedes Pixel garantiert eine Palettenfarbe ist (keine Zwischentöne, Alpha 0/255).
'use strict';
const zlib = require('zlib');
const fs = require('fs');

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
const bay = (x, y) => BAY[(y & 3) * 4 + (x & 3)];
const hx = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const lum = h => { const [r, g, b] = hx(h); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
const mix = (a, b, t) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };

// ---------------------------------------------------------------------------
// Paletten je Zone. Körper 4 dunkle Stufen, Randlicht innen/außen, Augen:
// kern = hellstes Pixel (Augenmitte, Flamme), glut = Augenfarbe, glutDim = gedithertes Glühen.
// extra = wenige erlaubte Detailfarben der Zone (z. B. Kerzenflamme).
// Werte aus zielbild.md und 04-welt-und-run.md; Abweichungen stehen in docs/auftrag/sprites.md.
const ZONEN = {
  hafen:   { body: ['#05070a', '#0b1016', '#141c26', '#22303e'], rim: ['#4a6a8a', '#cfe6ff'], kern: '#fff6d8', glut: '#ffe9a0', extra: {} },
  moor:    { body: ['#060508', '#0e0b14', '#1a1424', '#2a2238'], rim: ['#6a5a9a', '#e0d0ff'], kern: '#e8fff8', glut: '#9affe0', extra: {} },
  moor_gruen: { body: ['#050704', '#0c100a', '#162012', '#22321c'], rim: ['#6a8a3a', '#e0ffa0'], kern: '#ffffff', glut: '#f4ffd8', extra: {} },
  kapelle: { body: ['#070504', '#120c08', '#22160e', '#382618'], rim: ['#a06a2a', '#ffe0a0'], kern: '#fffaf0', glut: '#fff4d0', glutDim: '#6e4418', extra: { flamme: '#e8902e' } },
  salz:    { body: ['#070606', '#100d0c', '#1c1716', '#2c2421'], rim: ['#8a7c72', '#d8cec4'], kern: '#ffe6cc', glut: '#ff9a5a', extra: {} },
  stadt:   { body: ['#080404', '#140a0a', '#241212', '#3a1c18'], rim: ['#a0402a', '#ffc0a0'], kern: '#fff4c0', glut: '#ffe060', extra: {} },
  eis:     { body: ['#030508', '#070c14', '#0e1624', '#18243a'], rim: ['#5a8ab0', '#c8e2f6'], kern: '#ffe2dc', glut: '#ff4a4a', extra: {} },
  pforte:  { body: ['#030606', '#081010', '#0e1c1c', '#163030'], rim: ['#2a8a7a', '#8af0e0'], kern: '#fff0fa', glut: '#ff6ad8', extra: { magenta1: '#8a2a7a', magenta2: '#ff8ae0' } },
};
// Weitere Zonen aus tools/sprites/zonen/<zone>.json (je Biom-Paket eine Datei, gleiches Format wie oben)
try { const zd = require('path').join(__dirname, 'zonen'); for (const f of fs.readdirSync(zd)) if (f.endsWith('.json')) { const z = JSON.parse(fs.readFileSync(require('path').join(zd, f), 'utf8')); ZONEN[f.replace(/\.json$/, '')] = { extra: {}, ...z }; } } catch (e) { if (e.code !== 'ENOENT') throw e; }
// Index-Belegung im Puffer: 0 leer, 1..4 Körper, 5 R1, 6 R2, 7 glutDim, 8 glut, 9 kern, 10.. extra
const NAMEN = ['', 'k0', 'k1', 'k2', 'k3', 'r1', 'r2', 'glutDim', 'glut', 'kern'];
function palette(zone) {
  const z = ZONEN[zone];
  if (!z) throw new Error('Unbekannte Zone ' + zone);
  const farben = [null, ...z.body, ...z.rim, z.glutDim || mix(z.glut, z.body[3], 0.55), z.glut, z.kern];
  const namen = NAMEN.slice();
  for (const [k, v] of Object.entries(z.extra)) { namen.push(k); farben.push(v); }
  const idx = {}; namen.forEach((n, i) => { if (n) idx[n] = i; });
  return { zone, farben, namen, idx, licht: ['kern', 'glut', 'glutDim', ...Object.keys(z.extra)].map(n => farben[idx[n]]) };
}

// ---------------------------------------------------------------------------
// Formen (Distanzfelder). Optionen: pf ('dome'|'bevel'|'flat'), tone, m (Material: 'haut' heller, 'dunkel' dunkler)
const E = (x, y, rx, ry, m, o = {}) => ({ t: 'e', x, y, rx, ry, m, ...o });
const C = (x1, y1, x2, y2, r1, r2, m, o = {}) => ({ t: 'c', x1, y1, x2, y2, r1, r2, m, ...o });
const Pg = (v, m, o = {}) => ({ t: 'p', v, m, ...o });
function sdPoly(px, py, v) {
  let d = (px - v[0][0]) ** 2 + (py - v[0][1]) ** 2, s = 1; const n = v.length;
  for (let i = 0, j = n - 1; i < n; j = i, i++) {
    const ex = v[j][0] - v[i][0], ey = v[j][1] - v[i][1], wx = px - v[i][0], wy = py - v[i][1];
    const h = clamp((wx * ex + wy * ey) / (ex * ex + ey * ey || 1), 0, 1);
    const bx = wx - ex * h, by = wy - ey * h; d = Math.min(d, bx * bx + by * by);
    const c1 = py >= v[i][1], c2 = py < v[j][1], c3 = ex * wy > ey * wx;
    if ((c1 && c2 && c3) || (!c1 && !c2 && !c3)) s = -s;
  }
  return s * Math.sqrt(d);
}
function sd(px, py, p) {
  if (p.t === 'p') return [sdPoly(px, py, p.v) - (p.rd || 0), p.b ?? 2.5];
  if (p.t === 'e') { const dx = (px - p.x) / p.rx, dy = (py - p.y) / p.ry; const k = Math.hypot(dx, dy); return [(k - 1) * Math.min(p.rx, p.ry), Math.min(p.rx, p.ry)]; }
  const ax = px - p.x1, ay = py - p.y1, bx = p.x2 - p.x1, by = p.y2 - p.y1;
  const h = clamp((ax * bx + ay * by) / (bx * bx + by * by || 1), 0, 1); const r = p.r1 + (p.r2 - p.r1) * h;
  return [Math.hypot(ax - bx * h, ay - by * h) - r, r];
}
// Kette aus Kapseln (Glieder, Tentakel). wig(q,i) gibt Winkeländerung je Glied.
function chain(x, y, a, n, len, r0, r1, m, wig = () => 0, o = {}) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const q = i / n; a += wig(q, i);
    const nx = x + Math.cos(a) * len, ny = y + Math.sin(a) * len;
    out.push(C(x, y, nx, ny, r0 + (r1 - r0) * q, r0 + (r1 - r0) * (q + 1 / n), m, o)); x = nx; y = ny;
  }
  out.end = [x, y]; return out;
}
// Glied mit hartem Knick: Punkte-Liste -> Kapseln mit verjüngtem Radius
function glied(pts, r0, r1, m, o = {}) {
  const out = []; const n = pts.length - 1;
  for (let i = 0; i < n; i++) out.push(C(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], r0 + (r1 - r0) * i / n, r0 + (r1 - r0) * (i + 1) / n, m, o));
  return out;
}
// Zerfetzter Saum: Polygonpunkte von (x0,y) nach (x1,y) mit Zacken nach unten
function saum(x0, x1, y, zacken, tiefe, seed = 1, phase = 0) {
  const pts = []; const w = (x1 - x0) / zacken;
  for (let i = 0; i <= zacken; i++) {
    const r = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453; const f = r - Math.floor(r);
    pts.push([x0 + i * w, y - 1]);
    if (i < zacken) pts.push([x0 + (i + 0.5) * w + Math.round(phase), y + Math.round(tiefe * (0.5 + f * 0.7))]);
  }
  return pts;
}

// ---------------------------------------------------------------------------
// Renderer: Gruppen (hinten -> vorne) in Index-Puffer.
// Gruppe: { p:[Formen], k: Glättung (0 = hart), pf, hz, dunkel }
const STIL = { light: [-0.6, -0.7, 0.6], rimDir: [0.9, -0.5], rimOuter: 3 };
function render(W, H, gruppen, pal, opt = {}) {
  const N = W * H, ax = new Int16Array(N), ay = new Int16Array(N), gid = new Int16Array(N).fill(-1), mat = new Array(N), z = new Float32Array(N), tone = new Float32Array(N), noRim = new Uint8Array(N);
  gruppen.forEach((g, gi) => {
    if (!g || !g.p || !g.p.length) return;
    const k = g.k ?? 3, pr = g.p.flat ? g.p.flat(3) : g.p;
    let x0 = W, y0 = H, x1 = 0, y1 = 0;
    pr.forEach(p => {
      if (p.t === 'p') { p.v.forEach(([a, b]) => { x0 = Math.min(x0, a - k - 1 - (p.rd || 0)); x1 = Math.max(x1, a + k + 1 + (p.rd || 0)); y0 = Math.min(y0, b - k - 1 - (p.rd || 0)); y1 = Math.max(y1, b + k + 1 + (p.rd || 0)); }); return; }
      const r = p.t === 'e' ? Math.max(p.rx, p.ry) : Math.max(p.r1, p.r2);
      const xs = p.t === 'e' ? [p.x] : [p.x1, p.x2], ys = p.t === 'e' ? [p.y] : [p.y1, p.y2];
      xs.forEach(v => { x0 = Math.min(x0, v - r - k); x1 = Math.max(x1, v + r + k); });
      ys.forEach(v => { y0 = Math.min(y0, v - r - k); y1 = Math.max(y1, v + r + k); });
    });
    const gx0 = g.anker ? Math.round(g.anker[0]) : 0, gy0 = g.anker ? Math.round(g.anker[1]) : 0; // Dither-Anker: optional, wandert mit ganzzahlig bewegten Teilen
    x0 = Math.max(0, Math.floor(x0)); y0 = Math.max(0, Math.floor(y0)); x1 = Math.min(W - 1, Math.ceil(x1)); y1 = Math.min(H - 1, Math.ceil(y1));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      let D = 1e9, R = 1, M = null, best = 1e9, PF = null, TN = 0, NR = 0;
      for (const p of pr) {
        const [d, r] = sd(x + 0.5, y + 0.5, p);
        if (d < best) { best = d; M = p.m; R = r * (p.hz ?? 1); PF = p.pf || g.pf || 'bevel'; TN = (p.tone || 0) + (g.tone || 0); NR = p.noRim || g.noRim ? 1 : 0; }
        if (D === 1e9) D = d; else if (k <= 0) D = Math.min(D, d); else { const h = Math.max(k - Math.abs(D - d), 0) / k; D = Math.min(D, d) - h * h * k / 4; }
      }
      if (D < 0) {
        const i = y * W + x; gid[i] = gi; ax[i] = gx0; ay[i] = gy0; mat[i] = M; tone[i] = TN; noRim[i] = NR; const u = -D;
        z[i] = (PF === 'flat' ? Math.min(u, 1) : PF === 'bevel' ? Math.min(u, R) * 0.9 : (u >= R ? R : Math.sqrt(2 * R * u - u * u))) * (g.hz ?? 1);
      }
    }
  });
  const L = STIL.light, Ln = Math.hypot(...L), lx = L[0] / Ln, ly = L[1] / Ln, lz = L[2] / Ln;
  const rd = STIL.rimDir, rimBis = opt.rimBis ?? H - 6;
  const buf = new Uint8Array(N);
  const BODY = [1, 2, 3, 4];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (gid[i] < 0) continue;
    const g = gid[i], zl = x > 0 && gid[i - 1] === g ? z[i - 1] : 0, zr = x < W - 1 && gid[i + 1] === g ? z[i + 1] : 0;
    const zu = y > 0 && gid[i - W] === g ? z[i - W] : 0, zd = y < H - 1 && gid[i + W] === g ? z[i + W] : 0;
    let nx = -(zr - zl) / 2, ny = -(zd - zu) / 2, nz = 1; const nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl;
    const df = Math.max(0, nx * lx + ny * ly + nz * lz);
    let rimOk = false, rimK = 0;
    for (let k = 1; k <= STIL.rimOuter; k++) {
      const sx = Math.round(x + rd[0] * k), sy = Math.round(y + rd[1] * k);
      if (sx < 0 || sy < 0 || sx >= W || sy >= H || gid[sy * W + sx] < 0) { rimOk = true; rimK = k; break; }
    }
    const ox = Math.round(x - rd[0]), oy = Math.round(y - rd[1]);
    const thin = ox < 0 || oy < 0 || ox >= W || oy >= H || gid[oy * W + ox] < 0;
    const rim = !rimOk ? 0 : Math.pow(1 - nz, 2) * Math.max(0, nx * rd[0] + ny * rd[1] + 0.3);
    const front = (x > 0 && gid[i - 1] > g) || (x < W - 1 && gid[i + 1] > g) || (y > 0 && gid[i - W] > g) || (y < H - 1 && gid[i + W] > g);
    const m = mat[i];
    let c;
    if (rimOk && !front && !noRim[i] && y < rimBis && rimK === 1) c = thin ? 5 : 6;
    else if (rimOk && !front && !noRim[i] && y < rimBis && rimK === 2 && !thin) c = 5;
    else if (!noRim[i] && rim > 0.36 && y < rimBis) c = 6;
    else if (!noRim[i] && rim > 0.18 && y < rimBis) c = 5;
    else {
      let v = 0.02 + df * 0.75 + tone[i] + (m === 'haut' ? 0.25 : 0) - (m === 'dunkel' ? 0.25 : 0);
      if (front) v = 0;
      const t = clamp(v, 0, 0.9999) * 3, kk = Math.floor(t), f = t - kk;
      c = BODY[Math.min(3, f > bay(x - ax[i], y - ay[i]) ? kk + 1 : kk)];
    }
    buf[i] = c;
  }
  return { buf, gid };
}

// ---------------------------------------------------------------------------
// Pixel-Werkzeuge auf dem Index-Puffer (Details nach dem Rendern)
function pinsel(buf, W, H, pal) {
  const I = n => (typeof n === 'number' ? n : pal.idx[n]);
  const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
  const P = {
    W, H,
    get: (x, y) => (inb(x, y) ? buf[y * W + x] : 0),
    set(x, y, c) { x = Math.round(x); y = Math.round(y); if (inb(x, y)) buf[y * W + x] = I(c); },
    // nur auf vorhandenen Körper malen
    auf(x, y, c) { x = Math.round(x); y = Math.round(y); if (inb(x, y) && buf[y * W + x]) buf[y * W + x] = I(c); },
    loesch(x, y) { x = Math.round(x); y = Math.round(y); if (inb(x, y)) buf[y * W + x] = 0; },
    line(x0, y0, x1, y1, c, nurAuf = false) { const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))); for (let k = 0; k <= n; k++) { const q = k / (n || 1); (nurAuf ? P.auf : P.set)(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q, c); } },
    el(cx, cy, rx, ry, c, nurAuf = false) { for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) if (((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1) (nurAuf ? P.auf : P.set)(x, y, c); },
    // Glühen, gedithert, nur auf dem Körper: innen 'stark', außen 'schwach'
    glow(cx, cy, r, a = 1, stark = 'glutDim', schwach = 'k3') {
      for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) {
        if (!inb(x, y) || !buf[y * W + x]) continue; const q = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / r; if (q >= 1) continue;
        const v = a * (1 - q) * (1 - q); const cur = buf[y * W + x]; if (cur >= 5 && cur !== 5 && cur !== 6) continue;
        if (v > 0.45 + bay(x, y) * 0.4) buf[y * W + x] = I(stark); else if (v > bay(x, y) * 0.9 && cur < I(schwach)) buf[y * W + x] = I(schwach);
      }
    },
    // Auge: Kern + Glut. groesse 1 = ein Pixel, 2 = 2x1, 3 = Kreuz
    auge(x, y, gr = 1, glut = true) {
      x = Math.round(x); y = Math.round(y);
      if (glut) P.glow(x + 0.5, y + 0.5, gr + 3.5, 0.9);
      if (gr === 1) { P.set(x, y, 'kern'); }
      else if (gr === 2) { P.set(x, y, 'kern'); P.set(x + 1, y, 'glut'); }
      else { P.set(x, y, 'kern'); P.set(x - 1, y, 'glut'); P.set(x + 1, y, 'glut'); P.set(x, y - 1, 'glut'); P.set(x, y + 1, 'glut'); }
    },
  };
  return P;
}

// Nachbearbeitung: Treffer-Aufhellen (eine Stufe heller) und Zerfall (geordneter Dither)
function aufhellen(buf, stufen = 1) { for (let i = 0; i < buf.length; i++) { const c = buf[i]; if (c >= 1 && c <= 4) buf[i] = Math.min(4, c + stufen); else if (c === 5 && stufen > 1) buf[i] = 6; } }
function zerfall(buf, W, H, q) {
  if (q <= 0) return; let top = H, bot = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (buf[y * W + x]) { top = Math.min(top, y); bot = Math.max(bot, y); }
  const hh = Math.max(1, bot - top);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (!buf[i]) continue;
    const yf = (y - top) / hh; const s = q * 1.5 - (1 - yf) * 0.5; // oben zuerst
    const n = bay(x, y) * 0.75 + bay(x >> 2, y >> 2) * 0.25;
    if (n < s) buf[i] = 0;
    else if (n < s + 0.12 && buf[i] >= 2 && buf[i] <= 4) buf[i] = buf[i] - 1;
  }
}
function verschieben(buf, W, H, dx, dy) {
  dx = Math.round(dx); dy = Math.round(dy); if (!dx && !dy) return buf; const out = new Uint8Array(buf.length);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const sx = x - dx, sy = y - dy; if (sx >= 0 && sy >= 0 && sx < W && sy < H) out[y * W + x] = buf[sy * W + sx]; }
  return out;
}
// Hilfe: Augen ausblenden (Tod)
function augenAus(buf) { for (let i = 0; i < buf.length; i++) if (buf[i] >= 7 && buf[i] <= 9) buf[i] = 2; }

// ---------------------------------------------------------------------------
// PNG schreiben/lesen (Node-Bordmittel)
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b) { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(typ, data) { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(typ, 'ascii'), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td)); return Buffer.concat([l, td, c]); }
function pngSchreiben(datei, W, H, rgba) {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((W * 4 + 1) * H);
  for (let y = 0; y < H; y++) { raw[y * (W * 4 + 1)] = 0; Buffer.from(rgba.buffer, rgba.byteOffset + y * W * 4, W * 4).copy(raw, y * (W * 4 + 1) + 1); }
  const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
  fs.writeFileSync(datei, png);
}
function pngLesen(datei) {
  const b = fs.readFileSync(datei); let p = 8, W = 0, H = 0, ct = 0, bd = 0; const idat = [];
  while (p < b.length) { const len = b.readUInt32BE(p); const typ = b.toString('ascii', p + 4, p + 8); const d = b.slice(p + 8, p + 8 + len);
    if (typ === 'IHDR') { W = d.readUInt32BE(0); H = d.readUInt32BE(4); bd = d[8]; ct = d[9]; } else if (typ === 'IDAT') idat.push(d); p += 12 + len; }
  if (bd !== 8 || (ct !== 6 && ct !== 2)) throw new Error('Nur 8-Bit RGB/RGBA wird gelesen: ' + datei);
  const bpp = ct === 6 ? 4 : 3; const raw = zlib.inflateSync(Buffer.concat(idat)); const stride = W * bpp; const out = new Uint8Array(W * H * 4); const prev = new Uint8Array(stride), cur = new Uint8Array(stride);
  for (let y = 0; y < H; y++) { const f = raw[y * (stride + 1)]; for (let x = 0; x < stride; x++) { const v = raw[y * (stride + 1) + 1 + x]; const a = x >= bpp ? cur[x - bpp] : 0, u = prev[x], c = x >= bpp ? prev[x - bpp] : 0;
      let r; if (f === 0) r = v; else if (f === 1) r = v + a; else if (f === 2) r = v + u; else if (f === 3) r = v + ((a + u) >> 1); else { const pp = a + u - c, pa = Math.abs(pp - a), pb = Math.abs(pp - u), pc = Math.abs(pp - c); r = v + (pa <= pb && pa <= pc ? a : pb <= pc ? u : c); }
      cur[x] = r & 255; }
    for (let x = 0; x < W; x++) { out[(y * W + x) * 4] = cur[x * bpp]; out[(y * W + x) * 4 + 1] = cur[x * bpp + 1]; out[(y * W + x) * 4 + 2] = cur[x * bpp + 2]; out[(y * W + x) * 4 + 3] = bpp === 4 ? cur[x * bpp + 3] : 255; }
    prev.set(cur); }
  return { W, H, data: out };
}
function zuRGBA(buf, pal) { const out = new Uint8Array(buf.length * 4); const cols = pal.farben.map(c => (c ? hx(c) : null)); for (let i = 0; i < buf.length; i++) { const c = buf[i]; if (!c) continue; const k = cols[c]; out[i * 4] = k[0]; out[i * 4 + 1] = k[1]; out[i * 4 + 2] = k[2]; out[i * 4 + 3] = 255; } return out; }

// Bild-Leinwand für Kontaktbögen (RGBA)
function leinwand(W, H, farbe = '#0a0b0d') { const d = new Uint8Array(W * H * 4); const c = hx(farbe); for (let i = 0; i < W * H; i++) { d[i * 4] = c[0]; d[i * 4 + 1] = c[1]; d[i * 4 + 2] = c[2]; d[i * 4 + 3] = 255; } return { W, H, data: d }; }
function einsetzen(ziel, quelle, qW, qH, ox, oy, s = 1, schwarz = false) {
  for (let y = 0; y < qH * s; y++) for (let x = 0; x < qW * s; x++) { const sx = (x / s) | 0, sy = (y / s) | 0, q = (sy * qW + sx) * 4; if (!quelle[q + 3]) continue; const tx = ox + x, ty = oy + y; if (tx < 0 || ty < 0 || tx >= ziel.W || ty >= ziel.H) continue; const t = (ty * ziel.W + tx) * 4;
    if (schwarz) { ziel.data[t] = 0; ziel.data[t + 1] = 0; ziel.data[t + 2] = 0; } else { ziel.data[t] = quelle[q]; ziel.data[t + 1] = quelle[q + 1]; ziel.data[t + 2] = quelle[q + 2]; } ziel.data[t + 3] = 255; }
}
// Nebel-Hintergrund in Zonenfarbe (nur Vorschau, nicht Teil des Sprites): hellt hinter der Figur auf
function nebel(ziel, ox, oy, w, h, zone, s = 1) {
  const z = ZONEN[zone]; const st = [mix(z.body[2], z.rim[0], 0.08), mix(z.body[3], z.rim[0], 0.12), mix(z.body[3], z.rim[0], 0.28), mix(z.body[3], z.rim[0], 0.42)].map(hx);
  for (let y = 0; y < h * s; y++) for (let x = 0; x < w * s; x++) { const px = (x / s) | 0, py = (y / s) | 0; const dx = (px - w / 2) / (w * 0.55), dy = (py - h * 0.45) / (h * 0.6); let v = 1 - Math.hypot(dx, dy); v += py > h * 0.88 ? 0.25 : 0; const t = clamp(v, 0, 0.999) * 3, k = Math.floor(t);
    const c = st[Math.min(3, (t - k) > bay(px, py) ? k + 1 : k)]; const tt = ((oy + y) * ziel.W + ox + x) * 4; if (ox + x < 0 || oy + y < 0 || ox + x >= ziel.W || oy + y >= ziel.H) continue; ziel.data[tt] = c[0]; ziel.data[tt + 1] = c[1]; ziel.data[tt + 2] = c[2]; ziel.data[tt + 3] = 255; }
}

// ---------------------------------------------------------------------------
// Sheet bauen: def = Gegner-Modul, v = Variantenparameter
const ANIM_STANDARD = { idle: { n: 4, fps: 4, loop: true }, angriff: { n: 4, fps: 10 }, treffer: { n: 2, fps: 12 }, tod: { n: 6, fps: 8 } };
const REIHENFOLGE = ['idle', 'angriff', 'treffer', 'tod'];
function bild(def, v, anim, f, n) {
  const pal = palette(v.zone || def.zone);
  const W = def.w, H = def.h; const q = n > 1 ? f / (n - 1) : 0;
  const pose = { anim, f, n, q, idle: anim === 'idle', angriff: anim === 'angriff', treffer: anim === 'treffer', tod: anim === 'tod' };
  const res = def.bild(pose, v, api);
  const { buf } = render(W, H, res.gruppen, pal, { rimBis: res.rimBis ?? def.rimBis });
  const P = pinsel(buf, W, H, pal);
  if (res.details) res.details(P);
  let out = buf;
  if (anim === 'treffer' && res.aufhellen !== false) { if (f === 0) aufhellen(out, 1); }
  if (anim === 'tod') {
    const st = def.todStart ?? 0.25; // ab diesem Anteil zerfällt die Figur
    if (f >= 1) augenAus(out);
    const qq = (q - st) / (1 - st);
    if (res.sinken) out = verschieben(out, W, H, 0, res.sinken);
    if (qq > 0) zerfall(out, W, H, f === n - 1 ? 1.2 : qq);
  }
  if (res.dx || res.dy) out = verschieben(out, W, H, res.dx || 0, res.dy || 0);
  return { buf: out, augen: res.augen || [], pal };
}
function sheet(def, v) {
  const anim = { ...ANIM_STANDARD, ...(def.anim || {}) };
  const cols = Math.max(...REIHENFOLGE.map(a => anim[a].n));
  const W = def.w, H = def.h; const SW = W * cols, SH = H * REIHENFOLGE.length;
  let pal = null; const frames = {}; let augen = [];
  const rgba = new Uint8Array(SW * SH * 4);
  REIHENFOLGE.forEach((a, row) => {
    frames[a] = [];
    for (let f = 0; f < anim[a].n; f++) {
      const b = bild(def, v, a, f, anim[a].n); pal = b.pal; frames[a].push(b.buf);
      if (a === 'idle' && f === 0) augen = b.augen.map(([x, y]) => [Math.round(x), Math.round(y)]);
      const px = zuRGBA(b.buf, pal);
      for (let y = 0; y < H; y++) rgba.set(px.subarray(y * W * 4, (y + 1) * W * 4), ((row * H + y) * SW + f * W) * 4);
    }
  });
  const meta = { w: W, h: H, zone: v.zone || def.zone, anim: {}, fuss: v.fuss || def.fuss, kopf: v.kopf || def.kopf, augen, augenfarbe: ZONEN[v.zone || def.zone].glut };
  REIHENFOLGE.forEach((a, row) => { meta.anim[a] = { zeile: row, n: anim[a].n, fps: anim[a].fps }; if (anim[a].loop) meta.anim[a].loop = true; });
  return { rgba, SW, SH, meta, frames, pal };
}

// Gemeinsame Pose: atem (idle, 0/1), lean (Angriff nach links negativ, Treffer nach rechts), fall (Tod), aus (Augen aus)
function pose(p, o = {}) {
  const f = p.f, R = { atem: 0, lean: 0, fall: 0, aus: false, hit: false, k: f, q: p.q };
  if (p.idle) R.atem = (o.atem || [0, 0, 1, 1])[f % 4];
  if (p.angriff) R.lean = [1, -2, -(o.lunge ?? 6), -2][f];
  if (p.treffer) { R.lean = [2, 1][f]; R.hit = true; }
  if (p.tod) { R.fall = Math.round(p.q * (o.fall ?? 16)); R.aus = f >= 1; R.lean = Math.round(p.q * 2); }
  return R;
}
const api = { E, C, Pg, chain, glied, saum, clamp, bay, pose, r: Math.round, sin: Math.sin, cos: Math.cos, PI: Math.PI };
module.exports = { ZONEN, palette, E, C, Pg, chain, glied, saum, render, pinsel, aufhellen, zerfall, verschieben, pngSchreiben, pngLesen, zuRGBA, leinwand, einsetzen, nebel, sheet, bild, api, hx, lum, mix, bay, clamp, REIHENFOLGE, ANIM_STANDARD };
