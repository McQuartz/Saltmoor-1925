// Saltmoor 1925 · Hintergründe: Akt IV, Der Mond unter dem Eis (Biom-Paket mond).
// Komposition: docs/auftrag-2/biome/mond.md. Unter dem schwarzen Eis hängt ein zweiter Mond, kalt und bleich,
// so nah, dass die Expedition von 1890 eine Strickleiter hinabgelassen hat. Man steht auf Asche; der Horizont
// ist so krumm, dass man ihn in einer Stunde umrunden könnte. Es gibt keine Sonne: Das Licht kommt von jenseits
// des Horizonts, von der Rückseite (Gegenlicht oben rechts, bleiches Gelb). Wahrzeichen: die Mondscheibe mit
// Kratern, in denen Lampen brennen. Falsches Detail: Die Rückseite schaut dich an (Krater, die Augen sind).
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#060606', '#0f0f0d', '#1b1b18', '#2c2b26'], rand: ['#83837d', '#dddcd4'], augen: '#efe07c', nebel: ['#141412', '#3a3934'], fern: '#5a5850' };
// Eisdecke: schwarzes Eis, warmgrau statt blau (Abgrenzung zum Schwarzen Eis)
const EIS = ['#020202', '#050505', '#090908', '#0e0e0c', '#141411', '#1b1a17', '#24231f', '#2f2d28'];
// Mondstaub vom Schatten bis ins volle Licht
const STAUB = ['#070706', '#0d0d0b', '#141412', '#1c1b18', '#25241f', '#302e29', '#3d3b34', '#4c4a42', '#5e5b52', '#726e63', '#888478', '#a19c8e', '#bab4a4', '#d2ccba'];
const LICHT = ['#1a1912', '#26241a', '#353222', '#47432c', '#5c5636', '#746c42', '#90864f', '#ada15e', '#c9bb72', '#e2d38a'];
const GELB = '#efe07c', GELB_K = '#fffbe2', GELB_G = '#2a2614', GELB_G2 = '#433d1f', BLEICH = '#c9bc6a';
const MESS = ['#2a2412', '#4a3e1c', '#76632c', '#9c8546', '#cdb878'];
const SEIL = ['#0a0806', '#16120c', '#241d13', '#352b1c', '#4a3c27'];
const frac = v => v - Math.floor(v);
const staubMat = (ton, x) => Object.assign({ k: STAUB.slice(1, 9), r: ['#8e8a7e', '#d6d1c0'], ton, fase: 1.5, rand: 2, schatten: 2, muster: (px, py) => (B.hash(px >> 1, py, 31) < .06 ? -1 : 0) + (B.fbm(px * .08, py * .08, 9, 2) - .5) * .8 }, x || {});
const eisMat = (ton, x) => Object.assign({ k: EIS.slice(1, 8), r: ['#6a6862', '#bdb9ae'], ton, fase: 1.5, rand: 2, schatten: 2, muster: (px, py) => (B.fbm(px * .05, py * .12, 4, 2) - .5) * 1.2 }, x || {});

// ---------- Bausteine ----------
// Die Eisdecke als Himmel: Platten, Pressrücken, ein Schein dort, wo das Licht der Rückseite hinauffällt
function eisdecke(K, gx, gy, staerke, unten) {
  const sd = K.o.seed, ub = unten === undefined ? 150 : unten, GW = 46, GH = 20;
  // Platten: Voronoi-Zellen (breit, flach, perspektivisch nach unten kleiner); jede Platte eigene Neigung, Fugen dunkel
  const zelle = (x, y) => { const sy = 1 + Math.max(0, y) / 160, gx0 = Math.floor(x / (GW / sy)), gy0 = Math.floor(y / (GH / sy)); let d1 = 1e9, d2 = 1e9, id = 0;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const cx = gx0 + i, cy = gy0 + j, px = (cx + B.hash(cx, cy, sd)) * GW / sy, py = (cy + B.hash(cx, cy, sd + 1)) * GH / sy; const d = Math.hypot((x - px) / (GW / sy), (y - py) / (GH / sy)) * GW / sy; if (d < d1) { d2 = d1; d1 = d; id = cx * 7919 + cy; } else if (d < d2) d2 = d; }
    return [d2 - d1, id]; };
  B.feld(K.e[0], -M, -M, W + M, H + M, EIS, (x, y) => {
    const [kd, id] = zelle(x, y), neig = B.hash(id, 3, sd) * .14, fuge = kd < 1.3 ? -.14 : kd < 2.4 ? .1 : 0;
    const schein = Math.max(0, 1 - Math.hypot((x - gx) / 300, (y - gy) / 170)) * staerke;
    const mond = Math.max(0, (y - 20) / (ub - 20)) * .2; // Mondlicht von unten auf der Unterseite des Eises
    return .1 + schein * .6 + mond + neig + fuge + B.fbm(x * .03, y * .06, sd + 5, 2) * .08;
  });
}
// Eiszapfen von der Decke (Ebene 1 oder 2), krumm, sie zeigen alle zur Mitte des Mondes
function zapfen(K, eb, n, y0, ziel, tiefe) {
  const r = K.r, m = B.maske();
  for (let i = 0; i < n; i++) { const x = r.f(-10, W + 10), l = r.f(10, 46) * (1 - tiefe * .5), w = r.f(2, 5) * (1 - tiefe * .4); const zx = (ziel - x) * .12; m.poly([[x - w, y0 - 2], [x + w, y0 - 2], [x + zx * .7 + w * .3, y0 + l * .7], [x + zx, y0 + l]]); }
  K.form(eb, m, tiefe, eisMat(1.6));
}
// Licht von jenseits des Horizonts (die Rückseite ist hell): bleicher Schein über der Kante
function rueckLicht(K, x, y, rx, ry, staerke, eb) {
  B.feld(K.e[eb === undefined ? 0 : eb], x - rx, y - ry, x + rx, y + 4, LICHT, (px, py) => { const q = Math.hypot((px - x) / rx, (py - y) / ry); if (q > 1) return -1; const v = (1 - q) * staerke; return v < .04 + B.bay(px, py) * .06 ? -1 : v; });
  for (const i of [1, 2, 3]) B.kegel(K.e[i], x, y + 10, -Math.PI * .78, .32, 360, GELB_G, .5 * staerke);
  K.licht(x, y, GELB, 220, .6 * staerke);
}
// Mondscheibe (Wahrzeichen): Kugel mit Licht von rechts, Maria, Krater mit Wall; in manchen brennt eine Lampe.
// augen: Krater auf der Nachtseite, die Augen sind. opt: {L:[lx,ly,lz], krater, lampen, augen, tiefe}
function mondscheibe(K, eb, cx, cy, R, o) {
  const sd = K.o.seed, e = K.e[eb], L = o.L || [.72, -.28, .4], Ln = Math.hypot(...L), lx = L[0] / Ln, ly = L[1] / Ln, lz = L[2] / Ln;
  const r = B.rng(sd * 131 + 7), krater = [];
  for (let i = 0; i < (o.krater || 40); i++) { const a = r.f(0, Math.PI * 2), q = Math.sqrt(r()) * .95; krater.push({ u: Math.cos(a) * q, v: Math.sin(a) * q, rr: r.f(.015, .07) * (r() < .12 ? 2.2 : 1) }); }
  const pk = STAUB.map(B.pk), n = pk.length - 1, tiefe = o.tiefe || 0, fern = B.col(K.fern);
  const y0 = Math.max(-M, Math.floor(cy - R)), y1 = Math.min(H + M, Math.ceil(cy + R)), x0 = Math.max(-M, Math.floor(cx - R)), x1 = Math.min(W + M, Math.ceil(cx + R));
  const maxY = o.bis === undefined ? H + M : o.bis;
  for (let y = y0; y < Math.min(y1, maxY); y++) for (let x = x0; x < x1; x++) {
    const nx = (x + .5 - cx) / R, ny = (y + .5 - cy) / R, rr = nx * nx + ny * ny; if (rr > 1) continue; const nz = Math.sqrt(1 - rr);
    let hell = Math.max(0, nx * lx + ny * ly + nz * lz);
    hell = hell > 0 ? .18 + hell * .82 : 0;
    const mare = B.fbm(nx * 2.2 + 3, ny * 2.2, sd + 11, 3); let t = hell * (mare > .55 ? .72 : 1) + (B.fbm(nx * 9, ny * 9, sd + 2, 2) - .5) * .12 * hell;
    // Krater: Mulde (lichtseitig dunkel, gegenüber hell), Wall
    for (const k of krater) { const du = (nx - k.u) / k.rr, dv = (ny - k.v) / (k.rr * Math.max(.35, Math.sqrt(Math.max(0, 1 - k.u * k.u - k.v * k.v)))); const d = Math.hypot(du, dv); if (d > 1.35) continue;
      const seite = (du * lx + dv * ly); if (d < 1) t += (seite < 0 ? .2 : -.3) * hell * (1 - d * .4) - .04; else t += (seite > 0 ? .2 : -.06) * hell; }
    // Erdschein auf der Nachtseite: der Rand glimmt aschgrau
    if (hell <= .02) t = .07 + Math.pow(Math.min(1, rr), 6) * .14 + (B.fbm(nx * 4, ny * 4, sd, 2) - .5) * .05;
    t = B.clamp(t, 0, .999) * n * (o.max || .95); const kk = Math.floor(t); let c = Math.min(n, (t - kk) > B.bay(x, y) ? kk + 1 : kk);
    if (tiefe > 0) { const p = B.unpk(pk[c]); e.d[(y + M) * (W + 2 * M) + x + M] = B.pk(B.mix(p, fern, tiefe)); } else e.d[(y + M) * (W + 2 * M) + x + M] = pk[c];
  }
  // Rand zur Lichtseite: eine helle Linie (Randlicht der Welt)
  for (let a = -Math.PI; a < Math.PI; a += .4 / R) { const nxx = Math.cos(a), nyy = Math.sin(a), f = nxx * lx + nyy * ly; if (f < .3) continue; const x = cx + nxx * (R - .6), y = cy + nyy * (R - .6); if (y >= maxY) continue; e.set(x, y, B.pk(f > .6 ? STAUB[13] : STAUB[11])); }
  // Lampen in Kratern auf der Tagseite (bewohnt)
  const lampen = [];
  krater.forEach((k, i) => { if (i % 5 !== 2 || lampen.length >= (o.lampen || 0)) return; const x = cx + k.u * R, y = cy + k.v * R; if (y >= maxY - 2) return; e.set(x, y, B.pk(GELB)); e.set(x + 1, y, B.pk(BLEICH)); B.gluehen(e, x, y, 6 + k.rr * R * .6, GELB_G2, .8); lampen.push([x, y]); });
  // Augen auf der Nachtseite (falsches Detail)
  (o.augen || []).forEach(([u, v, s], i) => { const x = cx + u * R, y = cy + v * R; auge(K, eb, x, y, s, i, o.augenOffen); });
  return { lampen };
}
// Krater-Auge: Ringwall, darin Lider, eine Pupille, die zu dir sieht. offen 0..1
function auge(K, eb, x, y, s, i, offen) {
  const e = K.e[eb], of = offen === undefined ? 1 : offen;
  for (let py = Math.floor(y - s * 1.3); py <= y + s * 1.3; py++) for (let px = Math.floor(x - s * 2.1); px <= x + s * 2.1; px++) {
    const u = (px + .5 - x) / (s * 2), v = (py + .5 - y) / (s * 1.1), q = Math.hypot(u, v); if (q > 1.05) continue;
    const lid = (px + .5 - x) / (s * 1.4), lw = (py + .5 - y) / (s * .55 * Math.max(.08, of));
    let c;
    if (lid * lid + lw * lw < 1) c = Math.hypot(px + .5 - x + s * .25, py + .5 - y) < s * .38 ? BLEICH : EIS[1];
    else if (q > .78) c = (u * -.7 + v * .7) > 0 ? STAUB[9] : STAUB[3];
    else c = (u * -.7 + v * .7) > 0 ? STAUB[5] : STAUB[2];
    e.set(px, py, B.pk(c));
  }
  if (of > .2) { e.set(x - s * .3, y, B.pk(GELB_K)); e.set(x - s * .3 + 1, y, B.pk(GELB)); B.gluehen(e, x - s * .2, y, s * 2.4, GELB_G, .7); K.licht(x, y, GELB, s * 6, .35); }
  if (of > .2) { const ph = i * 1.7; K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { const z = frac(t / 7.3 + ph); if (z > .03) return; ctx.fillStyle = STAUB[4]; ctx.fillRect(Math.round(x - s * 1.3) + ox, Math.round(y - 1) + oy, Math.round(s * 2.6), 3); } }); }
}
// Boden aus Mondstaub mit Perspektive: Körnung, kleine Krater als Ellipsen, Lichtstreifen zur Lichtseite
function staubBoden(K, P, y0, o) {
  o = o || {}; const sd = K.o.seed, r = B.rng(sd * 17 + 3), hx = o.lichtX === undefined ? 420 : o.lichtX, hell = o.hell || 0;
  const krater = []; for (let i = 0; i < (o.krater || 26); i++) krater.push({ X: r.f(-9, 9), Z: 1.2 + Math.pow(r(), 1.5) * 18, rr: r.f(.12, .7) });
  K.boden(y0, H + M, STAUB.slice(1, 11), (x, y) => {
    const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z);
    let t = .26 + hell + Math.min(.22, 4 / Z) * -.4 + (B.fbm(X * 1.2, Z * .9, sd + 4, 3) - .5) * .28;
    t += Math.max(0, .3 - Math.abs(x - hx - (y - P.vy) * .5) / 260) * (1 - Math.min(1, (y - P.vy) / 150));
    for (const c of krater) { const du = (X - c.X) / c.rr, dv = (Z - c.Z) / (c.rr * 1.3); const d = Math.hypot(du, dv); if (d > 1.3) continue; t += d < 1 ? (du > 0 ? -.05 : -.2) : (du < 0 ? .12 : -.04); }
    if (B.hash(x, y, sd) < .03) t += .18;
    return t;
  });
  return krater;
}
// Fußspuren der Expedition (1890): Stiefelabdrücke, die geradeaus in die Ferne laufen
function spuren(K, P, X0, Z0, X1, Z1, n) {
  for (let i = 0; i < n; i++) { const q = i / n, X = X0 + (X1 - X0) * q + (i % 2 ? .12 : -.12), Z = Z0 + (Z1 - Z0) * q; const [x, y] = P.q(X, 0, Z), k = P.k(Z); const e = K.e[K.eb(y)];
    const w = Math.max(1, k * .06), h = Math.max(1, k * .02); for (let py = 0; py < h; py++) for (let px = 0; px < w * 2; px++) e.set(x - w + px, y + py, B.pk(px < w * .4 ? STAUB[8] : STAUB[2])); }
}
// Strickleiter der Expedition: zwei Seile, Sprossen; hängt aus dem Eis
function leiter(K, eb, x0, y0, x1, y1, breite, tiefe) {
  const m = B.maske(), n = Math.round(Math.hypot(x1 - x0, y1 - y0) / Math.max(3, breite * .9)), dur = (x1 - x0) * .08;
  const pt = (q, s) => [x0 + (x1 - x0) * q + Math.sin(q * Math.PI) * dur * 6 + s * breite / 2 * (.6 + q * .4), y0 + (y1 - y0) * q];
  for (const s of [-1, 1]) { const pts = []; for (let i = 0; i <= 20; i++) pts.push(pt(i / 20, s)); m.pfad(pts, Math.max(.5, breite * .07), Math.max(.5, breite * .1)); }
  for (let i = 1; i < n; i++) { const q = i / n, [a, b] = pt(q, -1), [c] = pt(q, 1); m.kap(a, b, c, b, Math.max(.5, breite * .06), Math.max(.5, breite * .06)); }
  K.form(eb, m, tiefe, { k: SEIL, r: ['#7a6a4a', '#c8b48a'], ton: 1.6, fase: 0, rand: 1 });
}
// Ringwall eines Kraters am Boden (perspektivisch flach), mit Lampe in der Mulde; optional ein Auge darin
function bodenKrater(K, P, X, Z, rr, o) {
  o = o || {}; const [x, y] = P.q(X, 0, Z), k = P.k(Z), rx = rr * k, ry = rx * .28, eb = K.eb(y + ry), tiefe = Math.min(.6, Z / 30);
  const hin = B.maske(); hin.fn(x - rx * 1.3, y - ry * 3, x + rx * 1.3, y + ry * 1.2, (px, py) => { const u = (px - x) / (rx * 1.25), v = (py - y) / (ry * 1.6); return u * u + v * v < 1 && py < y + ry * .2 - Math.max(0, 1 - Math.abs(u)) * ry * 1.4 + ry * 1.2 && py < y; });
  hin.fn(x - rx * 1.3, y - ry * 3, x + rx * 1.3, y + ry * 1.2, (px, py) => { const u = (px - x) / (rx * 1.25); return Math.abs(u) < 1 && py < y && py > y - ry * (1.6 * (1 - u * u)) - ry; });
  K.form(eb, hin, tiefe, staubMat(1.7, { verlauf: .4, rand: 1 }));
  const mulde = B.maske(); mulde.ell(x, y, rx, ry); B.form(K.e[eb], mulde, K.mat(tiefe, { k: STAUB.slice(0, 5), ton: .6, fase: 0, rand: 0, verlauf: -.6 }));
  const vor = B.maske(); vor.fn(x - rx * 1.35, y, x + rx * 1.35, y + ry * 2.2, (px, py) => { const u = (px - x) / (rx * 1.3); return Math.abs(u) < 1 && py > y + ry * Math.sqrt(1 - Math.min(1, ((px - x) / rx) ** 2)) - 1 && py < y + ry * (1 + .9 * (1 - u * u)); });
  K.form(eb, vor, tiefe, staubMat(1.9, { rand: 0, fase: 1 }));
  if (o.lampe) { const lx = Math.round(x + rx * .35), ly = Math.round(y - ry * .2); B.gluehen(K.e[eb], lx, ly, rx * .9, GELB_G2, .9); K.e[eb].set(lx, ly, B.pk(GELB_K)); K.e[eb].set(lx + 1, ly, B.pk(GELB)); K.licht(lx, ly, GELB, rx * 2, .5); }
  if (o.auge) auge(K, eb, x - rx * .1, y, Math.max(1.6, rx * .32), o.nr || 0, o.offen);
  return [x, y, rx];
}
// Fels / Brocken im Vordergrund
function brocken(K, eb, x, y, w, h, ton) {
  const r = B.rng(x * 13 + y * 7), m = B.maske(), pts = [];
  for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI, rr = .8 + r() * .35; pts.push([x + Math.cos(a) * w * rr, y + Math.sin(a) * h * rr]); }
  m.poly(pts); K.form(eb, m, 0, staubMat(ton || 1.5, { fase: 2.5 }));
}

// =====================================================================
// Variante 0: Der Abstieg. Wir stehen auf einem Sims aus schwarzem Eis; vor uns, unter dem Sims, hängt der
// Mond, so groß, dass nur seine obere Wölbung über die Kante ragt. Die Strickleiter der Expedition hängt aus
// der Decke bis auf seine Oberfläche. Auf der Nachtseite der Scheibe: zwei Krater, die Augen sind.
function abstieg(K, cfg) {
  const fr = K.fr, sd = K.o.seed, vy = 168, P = B.persp(236, vy); K.split = [178, 190];
  eisdecke(K, 470, 150, .5, 170);
  zapfen(K, 1, 22, -M + 4, 240, .45);
  // Der Mond: groß, nur die Wölbung über der Kante des Simses; Licht von rechts hinten, die Nachtseite links
  mondscheibe(K, 1, 228, 262, 206, { L: [.5, -.42, .6], krater: 58, lampen: 8, bis: vy + 4, augen: [[-.86, -.34, 5], [-.76, -.5, 4]], augenOffen: 1, tiefe: 0, max: .9 });
  // Leiter aus der Decke bis auf den Mond (Mittelgrund, Maßstab)
  leiter(K, 2, 344, -M, 356, 92, 7, .1);
  // Sims: schwarzes Eis mit Reif, vom Mond von vorn bleich angestrahlt; Risse laufen zur Kante
  K.boden(vy, H + M, EIS.slice(1).concat(['#3a3832', '#4a4740']), (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; let t = .36 + Math.max(0, .3 - (y - vy) / 200) + (B.fbm(X * .8, Z * .5, sd + 1, 3) - .5) * .45 + Math.max(0, .3 - Math.abs(x - 400 - (y - vy) * .7) / 220);
    const riss = Math.abs(frac(X * .35 + B.fbm(Z * .3, X, sd, 2) * .8) - .5) < .025; if (riss) t -= .35; if (B.hash(x, y, sd + 2) < .05) t += .3; return t; });
  const kante = B.maske(); for (let x = -M; x < W + M; x += 3) kante.rect(x, vy - 1 - (B.hash(x, 1, sd) < .3 ? 2 : 0), 3, 3); K.form(2, kante, .05, eisMat(2.4));
  // Kiste der Expedition, ein Pflock mit dem Seil der Leiter (Maßstab)
  const [kx, ky] = P.q(-3.4, 0, 3.6), kk = P.k(3.6); const ki = B.maske(); ki.rect(kx - kk * .3, ky - kk * .26, kk * .6, kk * .26); ki.rect(kx - kk * .33, ky - kk * .29, kk * .66, kk * .05);
  K.form(K.eb(ky), ki, 0, { k: SEIL, r: ['#7a6a4a', '#c8b48a'], ton: 1.6, fase: 1, schatten: 2, muster: (px, py) => ((Math.round(py - ky) % 4) === 0 ? -.8 : 0) });
  // Vordergrund: Eiszähne links und rechts
  const v = B.maske(); v.poly([[-M, H + M], [-M, 160], [14, 186], [28, 232], [50, H + M]]); v.poly([[W + M, H + M], [W + M, 150], [458, 182], [442, 230], [414, H + M]]);
  K.form(5, v, 0, eisMat(1.4, { fase: 3 }));
  zapfen(K, 5, 5, -M, 240, 0);
  B.nebel(K.e[2], { y0: vy - 12, y1: vy + 4, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .14, xs: [-20, 500, 60], seed: 3 });
  B.partikel(K, { n: 34, farben: [STAUB[8], STAUB[11], BLEICH], vx: 0, vy: 3, wob: 1.5, wf: .3, x0: 0, x1: 480, y0: 0, y1: 230, p: .8, hellSelten: 3 });
  K.reihen = [{ y: 182, skala: .9, nebel: .2 }, { y: 200, skala: 1, nebel: .08 }, { y: 218, skala: 1, nebel: 0 }];
  void fr; return { mitte: [236, 210], P };
}

// Variante 1: Das Aschenmeer. Auf der Oberfläche. Der Horizont ist eine Kurve. Über uns das Eis mit dem Schacht,
// aus dem die Leiter hängt. Rechts über dem Horizont der Schein der Rückseite, und zwei Augen, die herüberschauen.
function aschenmeer(K, cfg) {
  const fr = K.fr, sd = K.o.seed, vy = 132, P = B.persp(230, vy); K.split = [150, 166];
  eisdecke(K, 440, 140, .6, 135);
  const sx = 120, sy = -M;
  zapfen(K, 1, 14, -M + 4, 260, .5);
  // Horizont: Kurve (der Mond ist klein); Licht der Rückseite rechts dahinter
  const hz = x => vy + Math.pow((x - 230) / 330, 2) * 26;
  rueckLicht(K, 470, vy + 6, 210, 90, .95, 0);
  // ferne Kraterwälle als Silhouetten am Horizont, in zweien brennt Licht
  const fern = B.maske(); fern.fn(-M, vy - 30, W + M, vy + 30, (x, y) => { const h = hz(x); return y > h - (B.rausch1(x * .03, sd) * 9 + Math.max(0, Math.sin(x * .021 + sd) * 7)) && y <= h + 1; });
  K.form(1, fern, .55, staubMat(1.4));
  // Augen der Rückseite, halb über der Kante
  if (!cfg.ohneAugen) { auge(K, 1, 404, hz(404) - 6, 9, 0, 1); auge(K, 1, 452, hz(452) - 5, 7.5, 1, fr > .4 ? 1 : .75); }
  for (const lx of [64, 188]) { const ly = hz(lx) - 4; K.e[1].set(lx, ly, B.pk(GELB)); B.gluehen(K.e[1], lx, ly, 7, GELB_G2, .8); }
  // Boden mit Kratern, Fußspuren laufen zur Leiter
  staubBoden(K, P, vy, { lichtX: 400, krater: 24, hell: .12 });
  for (let x = -M; x < W + M; x++) { const h = Math.round(hz(x)); for (let y = vy - 4; y <= h; y++) for (const e of [K.e[2], K.e[3], K.e[4]]) e.set(x, y, 0); }
  B.feld(K.e[2], -M, vy - 4, W + M, vy + 30, STAUB.slice(4, 10), (x, y) => { const h = hz(x); return y < h ? -1 : y < h + 1.2 ? .9 : -1; });
  leiter(K, 2, sx, sy + 6, sx + 14, vy + 10, 5, .2);
  spuren(K, P, -1, 1.4, -2.3, 12, 18);
  bodenKrater(K, P, 2.6, 5.5, .9, { lampe: true });
  bodenKrater(K, P, -4.8, 9, 1.1, { lampe: fr < .6 });
  bodenKrater(K, P, 4.6, 14, 1.3, { auge: fr > .2, offen: .8, nr: 3 });
  bodenKrater(K, P, -1.4, 16, 1.6, { lampe: true });
  for (const [X, Z, w] of [[-6.5, 7, .55], [6.8, 8, .45], [-2.8, 13, .5], [1.6, 20, .7]]) { const [bx, by] = P.q(X, 0, Z), bk = P.k(Z); brocken(K, K.eb(by), bx, by + 1, bk * w, bk * w * .5, 1.7); }
  // Vordergrund: Brocken links und rechts
  brocken(K, 5, 20, H + 6, 46, 40, 1.4); brocken(K, 5, 470, H + 10, 52, 54, 1.6);
  B.nebel(K.e[2], { y0: vy - 16, y1: vy + 10, col: B.mix(pal.nebel[1], LICHT[3], .3), dichte: .14, xs: [-20, 500, 60], seed: 4 });
  B.partikel(K, { n: 30, farben: [STAUB[8], STAUB[11], BLEICH], vx: 0, vy: 2.5, wob: 1, wf: .3, x0: 0, x1: 480, y0: 0, y1: 240, p: .8, hellSelten: 3 });
  K.reihen = [{ y: 170, skala: .9, nebel: .25 }, { y: 192, skala: 1, nebel: .1 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 208], P, hz };
}

// Variante 2: Im Krater. Ringsum der Wall, in Terrassen; in den Terrassen Öffnungen mit Lampenlicht (bewohnt).
// In der Mitte der Zentralberg. Links das Lager des Astronomen: Zelt und ein Refraktor, der in den Boden zeigt.
function imKrater(K, cfg) {
  const fr = K.fr, sd = K.o.seed, vy = 142, P = B.persp(250, vy); K.split = [158, 172];
  eisdecke(K, 460, 70, .5);
  rueckLicht(K, 480, 64, 150, 60, .7, 0);
  // Kraterwall: Band quer durch das Bild, an den Seiten höher (wir stehen innen), in Terrassen gestuft
  const oben = x => 52 + Math.pow((x - 250) / 260, 2) * -40 + B.rausch1(x * .04, sd) * 8;
  for (let i = 0; i < 5; i++) {
    const ob = x => oben(x) + i * 15 + B.rausch1(x * .06 + i * 3, sd + i) * 6;
    const band = B.maske(); band.fn(-M, -M, W + M, vy + 2, (x, y) => y > ob(x));
    K.form(1, band, .12 - i * .02, staubMat(.8 + i * .05, { r: i === 0 ? ['#8e8a7e', '#d6d1c0'] : ['#4c4a42', '#7a766a'], rand: i === 0 ? 2 : 1, verlauf: .6, fase: 2.5, muster: (px, py) => { const rinne = B.fbm(px * .1, py * .015, sd + 13 + i, 2); return (rinne > .64 ? -.8 : rinne < .28 ? .35 : 0) + (B.hash(px >> 1, py >> 1, sd + i) < .05 ? .7 : 0) - Math.max(0, (py - ob(px) - 8) / 30); } }));
  }
  // Wohnungen: Öffnungen in den Terrassen, einige mit Licht, eine mit einer Gestalt im Fenster
  const r = B.rng(sd * 41 + 1);
  for (let i = 0; i < 30; i++) { const x = Math.round(r.f(10, 470)), st = r.i(0, 4), y = Math.round(oben(x) + st * 15 + 6 + r.f(0, 4)); if (y > vy - 8) continue; const w = r.i(3, 5), h = r.i(4, 6); const an = r() < (.6 - fr * .3);
    for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) K.e[1].set(x + px, y + py, B.pk(an ? (py === h - 1 ? BLEICH : (px + py) % 3 ? GELB : BLEICH) : EIS[0])); for (let px = -1; px <= w; px++) K.e[1].set(x + px, y - 1, B.pk(STAUB[px % 2 ? 6 : 4]));
    if (an) { B.gluehen(K.e[1], x + w / 2, y + h / 2, 9, GELB_G2, .7); if (i % 7 === 3) K.e[1].set(x + 1, y + 1, B.pk(EIS[1])); } }
  // Zentralberg im Mittelgrund
  const zb = B.maske(); zb.poly([[290, vy + 2], [312, 118], [330, 98], [342, 86], [352, 90], [364, 104], [384, 122], [418, vy + 2]]); K.form(2, zb, .06, staubMat(1.1, { verlauf: .8, muster: (px, py) => (B.fbm(px * .1, py * .05, sd + 2, 2) - .5) * 1.4 + (B.hash(px >> 1, py >> 1, sd + 4) < .05 ? .8 : 0) }));
  // Boden des Kraters
  staubBoden(K, P, vy, { lichtX: 420, krater: 18, hell: .04 });
  // Lager: Zelt und Refraktor (zeigt in den Boden), eine Lampe
  const [zx, zy] = P.q(4.6, 0, 6.2), k = P.k(6.2); const ze = B.maske(); ze.poly([[zx - k * .5, zy], [zx - k * .08, zy - k * .62], [zx + k * .45, zy]]); ze.rect(zx - k * .52, zy - 1, k, 2);
  K.form(K.eb(zy), ze, .05, { k: ['#0c0b09', '#16140f', '#211e17', '#2e2a20', '#3c372a'], r: ['#7a7258', '#cfc4a0'], ton: 1.7, fase: 1, schatten: 2, muster: (px) => ((Math.round(px - zx) % 6) === 0 ? -.5 : 0) });
  if (fr < .8) { B.flamme(K, Math.round(zx + k * .1), Math.round(zy - k * .2), { p: B.PAR[K.eb(zy)], kern: GELB_K, mitte: GELB, aussen: '#8a7020', glut: GELB_G }); K.glut(zx + k * .1, zy - k * .2, k * .6, GELB_G2, .8, [K.eb(zy)]); }
  const [tx, ty] = P.q(-4.3, 0, 4.2), tk = P.k(4.2); const te = B.maske();
  for (const s of [-1, 0, 1]) te.kap(tx, ty - tk * .32, tx + s * tk * .16, ty, 1, 1);
  te.kap(tx - tk * .3, ty - tk * .52, tx + tk * .14, ty - tk * .2, tk * .045, tk * .03); te.ell(tx - tk * .3, ty - tk * .52, tk * .055, tk * .05);
  K.form(K.eb(ty), te, 0, { k: MESS.slice(0, 4), r: ['#9c8546', '#e8d49a'], ton: 1.6, fase: 0, rand: 1 });
  for (const [X, Z, w] of [[-1.2, 9, .5], [2.2, 12, .4], [-6, 13, .7]]) { const [bx, by] = P.q(X, 0, Z), bk = P.k(Z); brocken(K, K.eb(by), bx, by + 1, bk * w, bk * w * .55, 1.6); }
  // Vordergrund: Brocken, Staubzungen
  brocken(K, 5, -6, H + 8, 60, 50, 1.4); brocken(K, 5, 486, H + 4, 40, 70, 1.5);
  B.nebel(K.e[2], { y0: vy - 18, y1: vy + 8, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .14, xs: [-20, 500, 60], seed: 6 });
  B.partikel(K, { n: 28, farben: [STAUB[8], STAUB[11], BLEICH], vx: 0, vy: 2, wob: 1, wf: .3, x0: 0, x1: 480, y0: 0, y1: 240, p: .8, hellSelten: 3 });
  K.reihen = [{ y: 172, skala: .9, nebel: .25 }, { y: 193, skala: 1, nebel: .1 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [250, 208], P };
}

// Wächter: Die Rückseite. Hier ist der Boden hell (die Rückseite liegt im Licht), der Horizont ganz nah.
// Hinter dem Wächter ein ruhiger, großer Hof aus bleichem Licht (die helle Zone, vor der er dunkel steht).
// Ringsum Krater mit geschlossenen Lidern; mit der Fremdheit öffnen sie sich.
function rueckseite(K, cfg) {
  const fr = K.fr, sd = K.o.seed, vy = 150, P = B.persp(240, vy); K.split = [166, 178];
  eisdecke(K, 240, 120, .35);
  zapfen(K, 1, 18, -M + 4, 240, .5);
  // Der Hof: ruhig, wenige Stufen, gedithert, um die Mitte hinter dem Wächter
  const hx = 240, hy = 98;
  B.feld(K.e[0], -M, -M, W + M, vy + 4, ['#1a1912', '#24221a', '#2f2d22', '#3b382b', '#474434', '#53503d'], (x, y) => { const q = Math.hypot((x - hx) / 170, (y - hy) / 128); if (q > 1.05) return -1; const v = (1 - q) * 1.5; return v < .05 + B.bay(x, y) * .1 ? -1 : Math.min(.999, v); });
  K.licht(hx, hy, GELB, 200, .5);
  // Horizont nah und krumm; die Kante leuchtet
  const hz = x => vy - 6 + Math.pow((x - 240) / 250, 2) * 34;
  const fern = B.maske(); fern.fn(-M, vy - 40, W + M, vy + 40, (x, y) => { const h = hz(x); const zack = Math.abs(x - 240) > 150 ? B.rausch1(x * .05, sd) * 14 : 0; return y > h - zack && y <= h + 1; });
  K.form(1, fern, .4, staubMat(1.6));
  staubBoden(K, P, vy - 8, { lichtX: 240, krater: 10, hell: .18 });
  for (let x = -M; x < W + M; x++) { const h = Math.round(hz(x)); for (let y = vy - 10; y <= h; y++) for (const e of [K.e[2], K.e[3], K.e[4]]) e.set(x, y, 0); }
  B.feld(K.e[2], -M, vy - 12, W + M, vy + 36, STAUB.slice(7, 13), (x, y) => { const h = hz(x); return y < h || y > h + 1.4 ? -1 : .8; });
  // Krater mit Lidern, links und rechts (nicht hinter dem Wächter). Mit jeder Boss-Phase (K.o.phase) öffnen sie sich weiter
  // und neue Augen gehen im Staub auf, näher am Wächter und vorn.
  const ph = K.o.phase || 0, offen = Math.min(1, .25 + fr * .9 + ph * .35);
  bodenKrater(K, P, -4.2, 4.6, .8, { auge: true, offen, nr: 1 });
  bodenKrater(K, P, 4.4, 5.2, .9, { auge: true, offen: Math.min(1, Math.max(.1, offen - .2)), nr: 2 });
  bodenKrater(K, P, -5.6, 10, 1.1, { auge: true, offen: Math.min(1, .15 + fr * .8 + ph * .4), nr: 4 });
  bodenKrater(K, P, 6, 11, 1.2, { auge: true, offen: Math.min(1, .6 + ph * .3), nr: 5 });
  if (ph >= 1) { bodenKrater(K, P, -2.3, 3.4, .55, { auge: true, offen: .9, nr: 6 }); bodenKrater(K, P, 2.6, 3.7, .6, { auge: true, offen: .8, nr: 7 }); bodenKrater(K, P, 8.4, 7.2, .8, { auge: true, offen: 1, nr: 8 }); }
  if (ph >= 2) { bodenKrater(K, P, -8.6, 6.6, .9, { auge: true, offen: 1, nr: 9 }); bodenKrater(K, P, -3.4, 7.4, .7, { auge: true, offen: 1, nr: 10 }); bodenKrater(K, P, 3.2, 8.6, .7, { auge: true, offen: 1, nr: 11 }); bodenKrater(K, P, .9, 2.6, .45, { auge: true, offen: 1, nr: 12 }); }
  bodenKrater(K, P, -2.4, 16, 1.4, { lampe: true });
  // Vordergrund: dunkle Brocken als Rahmen
  brocken(K, 5, 8, H + 10, 64, 64, 1.2); brocken(K, 5, 478, H + 8, 58, 74, 1.3);
  zapfen(K, 5, 4, -M, 240, 0);
  B.nebel(K.e[2], { y0: vy - 14, y1: vy + 8, col: B.mix(pal.nebel[1], LICHT[2], .4), dichte: .22, xs: [-20, 500, 60], seed: 11 });
  B.partikel(K, { n: 30, farben: [STAUB[9], STAUB[12], BLEICH], vx: 0, vy: 2, wob: 1, wf: .3, x0: 0, x1: 480, y0: 0, y1: 240, p: .8, hellSelten: 3 });
  K.reihen = [{ y: 176, skala: .9, nebel: .2 }, { y: 196, skala: 1, nebel: .08 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [240, 210], P };
}

// Übergang: Neumond. Am Rand der Nachtseite ist im Staub ein rundes Loch, glatt wie gebohrt; die Leiter der
// Expedition geht weiter hinab. Von unten kommt kaltes, fremdes Licht (zur Pforte).
function neumond(K) {
  const sd = K.o.seed, vy = 136, P = B.persp(240, vy); K.split = [150, 164];
  eisdecke(K, 240, 300, .2);
  const hz = x => vy + Math.pow((x - 240) / 300, 2) * 26;
  const fern = B.maske(); fern.fn(-M, vy - 20, W + M, vy + 30, (x, y) => y > hz(x) - B.rausch1(x * .03, sd) * 6 && y <= hz(x) + 1); K.form(1, fern, .6, staubMat(1.1));
  staubBoden(K, P, vy, { lichtX: 600, krater: 14, hell: -.12 });
  for (let x = -M; x < W + M; x++) { const h = Math.round(hz(x)); for (let y = vy - 4; y <= h; y++) K.e[2].set(x, y, 0); }
  const [lx, ly] = P.q(0, 0, 3.4), k = P.k(3.4);
  for (let i = 0; i < 6; i++) { const m = B.maske(); m.ell(lx, ly + i * 2, k * (1.3 - i * .04), k * (.34 - i * .01)); m.ell(lx, ly + i * 2 + 2, k * (1.3 - i * .04) - 3, k * (.34 - i * .01) - 1, 0); K.form(4, m, 0, staubMat(1.5 - i * .15, { fase: 0, rand: i < 2 ? 2 : 0 })); }
  const sch = B.maske(); sch.ell(lx, ly + 12, k * 1.05, k * .27); B.form(K.e[4], sch, { k: [B.pk('#000000'), B.pk('#050505'), B.pk('#141410')], ton: .6, fase: 0, rand: 0, verlauf: -1.2 });
  leiter(K, 4, lx + k * .2, -M, lx + k * .1, ly + 24, 6, 0);
  B.gluehen(K.e[4], lx, ly + 16, k * .9, '#20262a', .8); K.licht(lx, ly + 16, '#c8d4d8', k * 2, .5);
  K.anim.push({ p: .5, f(ctx, t, ox, oy) { ctx.fillStyle = '#9aa6a8'; for (let i = 0; i < 12; i++) { const q = frac(t * .07 + i / 12); const a = i * 2.1 + t * .2; ctx.fillRect(Math.round(lx + Math.cos(a) * k * .9 * (1 - q) + ox), Math.round(ly + 12 + Math.sin(a) * k * .22 * (1 - q) + q * 8 + oy), 1, 1); } } });
  brocken(K, 5, 20, H + 6, 50, 44, 1.2); brocken(K, 5, 470, H + 8, 50, 60, 1.3);
  B.partikel(K, { n: 20, farben: [STAUB[7], STAUB[10]], vy: 2, wob: 1, wf: .3, x0: 0, x1: 480, y0: 0, y1: 230, p: .8 });
  K.reihen = [{ y: 170, skala: .9, nebel: .25 }, { y: 192, skala: 1, nebel: .1 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 208], P };
}

// Krämer: der Gehilfe des Astronomen unten an der Leiter. Kisten mit Instrumenten, ein Klappstuhl, eine Lampe.
function gehilfenStand(K, x, y) {
  const m = B.maske(); m.rect(x - 40, y - 14, 30, 14); m.rect(x - 36, y - 26, 22, 12); m.rect(x + 22, y - 10, 22, 10);
  K.form(4, m, 0, { k: SEIL, r: ['#7a6a4a', '#c8b48a'], ton: 1.7, fase: 1, schatten: 2, muster: (px, py) => ((Math.round(py) % 5) === 0 ? -.7 : 0) });
  const st = B.maske(); st.kap(x - 4, y, x + 8, y - 16, .9, .9); st.kap(x + 8, y, x - 4, y - 16, .9, .9); st.rect(x - 6, y - 17, 16, 2); st.kap(x + 8, y - 17, x + 10, y - 30, .9, .9);
  K.form(4, st, 0, { k: SEIL, r: ['#7a6a4a', '#c8b48a'], ton: 1.6, fase: 0, rand: 1 });
  const ro = B.maske(); ro.kap(x - 34, y - 30, x - 4, y - 44, 2.6, 2); ro.ell(x - 4, y - 44, 2.4, 2.4); K.form(4, ro, 0, { k: MESS.slice(0, 4), r: ['#9c8546', '#e8d49a'], ton: 1.6, fase: 0, rand: 1 });
  B.flamme(K, x + 33, y - 13, { p: .5, kern: GELB_K, mitte: GELB, aussen: '#8a7020', glut: GELB_G, gross: 1.3 });
  for (const i of [3, 4]) B.gluehen(K.e[i], x + 33, y - 12, 50, GELB_G2, .9);
}
// Fund und Ereignis: ein offener Instrumentenkasten, darin ein Messinggerät, das schimmert
function kasten(K, x, y) {
  const m = B.maske(); m.rect(x - 16, y - 10, 32, 10); m.poly([[x - 16, y - 10], [x - 18, y - 24], [x + 16, y - 25], [x + 16, y - 10]]);
  K.form(4, m, 0, { k: SEIL, r: ['#7a6a4a', '#c8b48a'], ton: 1.8, fase: 1, schatten: 2, muster: (px, py) => (py === y - 5 ? -.8 : 0) });
  const g = B.maske(); g.ell(x - 2, y - 12, 7, 2.4); g.ell(x - 2, y - 12, 4, 1.3, 0); g.kap(x - 2, y - 12, x + 5, y - 16, .8, .8);
  K.form(4, g, 0, { k: MESS.slice(0, 4), r: ['#9c8546', '#e8d49a'], ton: 2, fase: 0, rand: 1 });
  const sh = B.maske(); sh.ell(x, y + 1, 22, 2.5); B.form(K.e[4], sh, K.mat(0, { ton: 0, rand: 0, fase: 0 }));
  B.gluehen(K.e[4], x - 2, y - 13, 20, GELB_G2, .9);
  K.anim.push({ p: .5, f(ctx, t, ox, oy) { if (Math.sin(t * 1.3) > .5) { ctx.fillStyle = GELB; ctx.fillRect(x + 4 + ox, y - 16 + oy, 1, 1); } } });
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' ? 1 : art === 'kraemer' ? 0 : art === 'werkstatt' || art === 'ereignis' || art === 'fund' ? 2 : (o.seed + v) % 3;
  K.kulisse = art === 'waechter' ? 'waechter' : v; // M3: welche Kulisse die Szene zeigt (Schlüssel für die Fahrt, data/fahrt.json)
  let info;
  if (art === 'waechter') info = rueckseite(K, {});
  else if (art === 'uebergang') info = neumond(K);
  else info = [abstieg, aschenmeer, imKrater][v](K, {});
  if (art === 'fund' || art === 'ereignis') kasten(K, info.mitte[0] + 30, info.mitte[1]);
  else if (art === 'kraemer') gehilfenStand(K, info.mitte[0] + 40, info.mitte[1] - 2);
  else if (art !== 'uebergang' && art !== 'waechter') B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.mond = { pal, build: bauen, reliefStil: { figuren: 4, gelenke: 3, knick: .5, grossX: 112, stein: ['#25241f', '#3d3b34', '#5e5b52', '#a19c8e'] } };
if (World.BIOME.indexOf('mond') < 0) World.BIOME.push('mond');
})();
