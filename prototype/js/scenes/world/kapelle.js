// Saltmoor 1925 · Hintergründe: Akt 2, Die überflutete Kapelle.
// Komposition: docs/auftrag/hintergruende-kompositionen.md
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#070504', '#120c08', '#22160e', '#382618'], rand: ['#a06a2a', '#ffe0a0'], augen: '#fff4d0', nebel: ['#1a1008', '#3a2614'] };
const WAND = ['#050302', '#0a0604', '#120b07', '#1b110a', '#26180e', '#332214', '#45301c'];
const WASSER = ['#030302', '#060605', '#0a0b08', '#10120d', '#181a12', '#22241a', '#30301f'];
const BODEN = ['#060403', '#0d0906', '#16100a', '#21170e', '#2e2014'];
const GRUEN = ['#0a2a1a', '#14583a', '#2a9a62', '#6ae0a0', '#c8ffe0'];
const GLUT_G = '#0c3a20', KERZE = '#f0e0b0';

// Quaderwerk im Bildraum (Zeilen, versetzte Fugen)
const quader = (zh, bw) => (x, y) => { const row = Math.floor(y / zh), xx = x + (row & 1) * bw / 2; return (y % zh === 0 ? -.55 : 0) + ((Math.floor(xx) % bw) === 0 ? -.45 : 0) + (B.hash(Math.floor(xx / bw), row, 5) - .5) * .35; };
function spitzbogenMaske(m, x0, x1, yK, hb, v) {
  // Spitzbogen über [x0,x1], Kämpfer bei yK, Scheitel hb darüber
  const w = x1 - x0, r = Math.max(w * .62, (hb * hb + (w / 2) ** 2) / w), c0 = x0 + r, c1 = x1 - r;
  m.fn(x0 - 1, yK - hb - 2, x1 + 1, yK, (x, y) => { const dy = yK - y; return Math.hypot(x - c1, dy) <= r && Math.hypot(x - c0, dy) <= r && y > yK - hb; }, v);
  return m;
}
// Rundfenster mit Maßwerk; Licht kommt von unten (hell unten, dunkel oben)
function rundfenster(K, eb, cx, cy, R, tiefe) {
  const e = K.e[eb], fr = K.fr, ring = B.maske();
  ring.ell(cx, cy, R * 1.16, R * 1.16); ring.ell(cx, cy, R, R, 0);
  K.form(eb, ring, tiefe, { ton: 1.4, fase: Math.max(1, R * .05), muster: quader(5, 9) });
  B.feld(e, cx - R, cy - R, cx + R + 1, cy + R + 1, GRUEN, (x, y) => { const q = Math.hypot(x + .5 - cx, y + .5 - cy) / R; if (q > 1) return -1; return .2 + ((y - cy) / R + 1) * .42 * (.8 + .2 * fr) + (B.hash(x >> 1, y >> 1, 4) - .5) * .25; });
  // Maßwerk: Speichen, innerer Ring, Pässe
  const mw = B.maske(), n = 8, th = Math.max(.7, R * .035);
  for (let i = 0; i < n; i++) { const a = i / n * 6.283 + .2; mw.kap(cx + Math.cos(a) * R * .28, cy + Math.sin(a) * R * .28, cx + Math.cos(a) * R, cy + Math.sin(a) * R, th, th); }
  mw.ell(cx, cy, R * .3, R * .3); mw.ell(cx, cy, R * .3 - th * 2, R * .3 - th * 2, 0);
  for (let i = 0; i < n; i++) { const a = (i + .5) / n * 6.283 + .2, px = cx + Math.cos(a) * R * .68, py = cy + Math.sin(a) * R * .68, rr = R * .2; mw.ell(px, py, rr, rr); mw.ell(px, py, rr - th * 1.6, rr - th * 1.6, 0); }
  mw.ell(cx, cy, R * .08, R * .08);
  K.form(eb, mw, Math.max(0, tiefe - .1), { ton: 1.1, fase: 0, rand: 1, r: ['#2a6a4a', '#6ad0a0'], L: [0, 1] });
  // Licht von unten: Strahlen fallen schräg nach oben in den Raum
  for (const L of [K.e[0], K.e[1]]) { B.kegel(L, cx, cy + R * .6, -Math.PI / 2 - .55, .2, R * 4.2, '#1a6a40', .55); B.kegel(L, cx, cy + R * .6, -Math.PI / 2 + .5, .18, R * 4, '#1a6a40', .5); B.kegel(L, cx, cy + R * .6, -Math.PI / 2, .14, R * 3.4, '#1a6a40', .4); }
  K.glut(cx, cy + R * .4, R * 2.2, GLUT_G, .9, [0, 1, 2]);
  K.licht(cx, cy, '#6ae0a0', R * 2, 1);
  const g = B.glanzSprite(R * 1.3, '#0c2a18', .6);
  K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { if (Math.sin(t * .35) < 0) return; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, cx - g.R + ox, cy + R * .3 - g.R + oy); ctx.globalCompositeOperation = 'source-over'; } });
}
function pfeiler(K, eb, x, yTop, yBot, w, tiefe, o) {
  o = o || {}; const m = B.maske();
  m.rect(x - w / 2, yTop, w, yBot - yTop);
  m.poly([[x - w * .75, yTop + w * .5], [x - w * .62, yTop - w * .2], [x + w * .62, yTop - w * .2], [x + w * .75, yTop + w * .5]]);
  m.rect(x - w * .7, yTop - w * .45, w * 1.4, w * .3);
  const dienst = Math.max(2, Math.round(w / 4));
  K.form(eb, m, tiefe, { ton: o.ton === undefined ? .55 : o.ton, fase: Math.max(1, w * .08), verlauf: .3, muster: (px, py) => ((Math.round(px - x + w / 2) % dienst === 0) ? -.35 : 0) + (B.hash(px, py >> 2, 6) - .5) * .25, schatten: o.schatten ? 2 : 0 });
}
function kerze(K, eb, x, y, h, an, o) {
  const e = K.e[eb], c = B.pk(o && o.farbe || KERZE), c2 = B.pk('#a08a60');
  for (let j = 0; j < h; j++) { e.set(x, y - j, c); if (h > 4) e.set(x - 1, y - j, c2); }
  if (an) B.flamme(K, x, y - h, { p: B.PAR[eb], glut: (o && o.glut) || '#3a2008', kern: '#fff4d0', mitte: '#ffc060', aussen: '#b06a20' });
}
function treibholz(K, eb, x, y, l, n, an) {
  const m = B.maske(); m.poly([[x - l / 2, y], [x - l / 2 + 2, y - 2], [x + l / 2, y - 3], [x + l / 2 - 1, y]]);
  K.form(eb, m, 0, { ton: 1.6, fase: 0 });
  for (let i = 0; i < n; i++) kerze(K, eb, Math.round(x - l / 2 + 3 + i * (l - 6) / Math.max(1, n - 1)), Math.round(y - 3 - i * .3), 3 + (i * 7 % 3), an);
  if (an) K.glut(x, y - 6, 22 + n * 3, '#4a2a0c', .9, [2, 3, 4]);
}
// Kerze unter Wasser: Flamme brennt weiter, Licht gebrochen und grünlich
function kerzeUnterWasser(K, x, y) {
  K.glut(x, y, 20, '#2a3a14', .9, [3, 4]);
  const g = B.glanzSprite(10, '#283a10', .8);
  K.anim.push({ p: .5, f(ctx, t, ox, oy) {
    const w = Math.round(Math.sin(t * 1.7 + x) * 1.2);
    ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, x - g.R + ox + w, y - 3 - g.R + oy); ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#6a5a30'; ctx.fillRect(x + ox, y + oy, 1, 4);
    ctx.fillStyle = '#c0b060'; ctx.fillRect(x + ox + w, y - 3 + oy, 1, 2); ctx.fillStyle = '#e8f0b0'; ctx.fillRect(x + ox + w + (Math.sin(t * 3 + x) > .6 ? 1 : 0), y - 2 + oy, 1, 1);
    ctx.fillStyle = '#6a8a50'; for (let k = 0; k < 3; k++) { const by = (y - 4 - ((t * 8 + k * 7 + x) % 22)); ctx.fillRect(x + ox + Math.round(Math.sin(t * 2 + k) * 1.5), Math.round(by) + oy, 1, 1); }
  } });
}
// Schräges Wasser: Ebene Y = w0 + b*X. Liefert Tiefe Z je Bildpunkt (oder -1 über der Wasserlinie)
function wasserEbene(P, w0, b) { return (x, y) => { const u = (y + .5 - P.vy) / P.h, v = (x + .5 - P.vx) / P.h, d = u + b * v; if (d <= 0) return -1; const Z = (1 - w0) / d; return Z > 0 ? Z : -1; }; }

// =====================================================================
// Mittelschiff (Variante 0), Wächter (nah) und Übergang (Treppe hinter dem Altar)
function schiff(K, cfg) {
  const fr = K.fr, nah = !!cfg.nah, P = B.persp(240, nah ? 150 : 140), w0 = .5, b = -.12 - .06 * fr; K.split = nah ? [176, 186] : [150, 160];
  const Zap = nah ? 8 : 16, kap = P.k(Zap);
  // Ebene 0: Gewölbedunkel und Chorwand
  B.feld(K.e[0], -M, -M, W + M, H + M, WAND, (x, y) => .62 + y / H * .7 + quader(6, 11)(x, y) * .3 - Math.abs(x - 240) / 520);
  const chor = B.maske(); spitzbogenMaske(chor, 240 - 4.6 * kap * 1.25, 240 + 4.6 * kap * 1.25, P.q(0, 7.5, Zap * .8)[1], 5.5 * kap, 1); chor.rect(240 - 4.6 * kap * 1.25, P.q(0, 7.5, Zap * .8)[1], 9.2 * kap * 1.25, 200);
  B.form(K.e[0], chor, K.mat(.15, { ton: 2.2, fase: 0, rand: 0, muster: quader(Math.max(3, Math.round(kap * .55)), Math.round(kap * 1.1)) }));
  const fy = P.q(0, nah ? 7.2 : 9.4, Zap)[1], fR = (nah ? 3.7 : 4.4) * kap;
  rundfenster(K, 1, 240, fy, fR, .1);
  // Altar mit Stufen, Kerzen; beim Übergang die Treppe dahinter nach unten
  const Za = Zap - 2.2, ka = P.k(Za), am = B.maske();
  for (let s = 0; s < 3; s++) { const [x0, y0] = P.q(-2.2 + s * .3, .25 * s + .25, Za - .9 + s * .3), [x1] = P.q(2.2 - s * .3, 0, Za - .9 + s * .3); am.rect(x0, y0, x1 - x0, ka * .3); }
  const [ax0, ay0] = P.q(-1.3, 1.6, Za), [ax1, ay1] = P.q(1.3, .7, Za); am.rect(ax0, ay0, ax1 - ax0, ay1 - ay0 + 2); am.rect(ax0 - 1, ay0 - Math.max(1, ka * .1), ax1 - ax0 + 2, Math.max(1, ka * .12));
  B.form(K.e[1], am, K.mat(.12, { ton: 1.3, fase: 1, muster: quader(3, 7) }));
  if (cfg.treppe) { const t = B.maske(), [tx0, ty0] = P.q(-.9, 1.2, Za + .9), [tx1] = P.q(.9, 0, Za + .9); t.rect(tx0, ty0, tx1 - tx0, ka * 1.4); B.form(K.e[1], t, K.mat(0, { k: ['#000000', '#020101', '#050302', '#080504'], ton: 0, rand: 0, fase: 0 })); for (let i = 0; i < 5; i++) B.linie(K.e[1], tx0 + 1, ty0 + 3 + i * (ka * .25), tx1 - 1, ty0 + 3 + i * (ka * .25), B.pk(GRUEN[1 + (i > 2 ? 1 : 0)])); K.glut((tx0 + tx1) / 2, ty0 + ka, ka * 2.5, GLUT_G, 1, [1]); }
  for (let i = 0; i < 5; i++) kerze(K, 1, Math.round(B.lerp(ax0 + 2, ax1 - 2, i / 4)), Math.round(ay0 - 1), 2 + (i % 2) * 2 + (i === 2 ? 2 : 0), fr < .85 || i === 2);
  // Wasser: schräge Ebene, Wellenlinien parallel zur schrägen Wasserkante
  const zw = wasserEbene(P, w0, b), sd = K.o.seed, gr = B.pk(GRUEN[2]), gr2 = B.pk(GRUEN[1]);
  K.bodenStoffe(P.vy - 40, H + M, [
    { cols: WASSER, tf: (x, y) => { const Z = zw(x, y); if (Z < 0 || Z > Zap + 3) return -1; const f = Math.min(1, 3 / Z); return .62 - f * .36 + (Math.sin(Z * 9 + B.rausch2(x * .03, Z, sd) * 3) > .8 ? .14 : 0) + (B.hash(x, y, 3) > .97 ? .1 : 0); } },
    { cols: BODEN, tf: (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; return .3 + (((Math.floor(X * 1.2) + Math.floor(Z * 1.2)) & 1) ? .12 : 0) + Math.min(.4, Z / 30); } }
  ], (x, y) => { if (y <= P.vy) return -1; const Z = zw(x, y); if (Z > 0 && Z < Zap + 3) return 0; return y > P.vy + 2 ? 1 : -1; });
  // Pfeiler und Arkaden auf beiden Seiten, Wasserlinie schräg
  const Xp = 3.7, Zs = nah ? [3.6, 5.2] : [5.8, 7.8, 10.2, 13.2], wY = X => w0 + b * X;
  for (const Z of Zs.slice().reverse()) for (const sd of [-1, 1]) {
    const X = sd * Xp, k = P.k(Z), [x, yt] = P.q(X, 5.6, Z), ywl = P.q(X, Math.max(0, wY(X)), Z)[1];
    pfeiler(K, K.eb(ywl), x, yt, ywl + 1, Math.max(3, k * .85), Z > 9 ? .3 : Z > 7 ? .2 : .1);
    // Bogen zum nächsten Pfeiler (in der Wandebene)
    const Zn = Zs[Zs.indexOf(Z) + 1]; if (Zn) { const bm = B.maske(), [xn, ytn] = P.q(X, 5.6, Zn), [xm, ym] = P.q(X, 7.6, 2 / (1 / Z + 1 / Zn)); bm.pfad([[x, yt], [B.lerp(x, xm, .6), ym + (yt - ym) * .25], [xm, ym], [B.lerp(xn, xm, .6), ym + (ytn - ym) * .25], [xn, ytn]], Math.max(1.2, k * .32), Math.max(1, P.k(Zn) * .32)); B.form(K.e[2], bm, K.mat(Z > 9 ? .3 : .2, { ton: 1.1, fase: 1, muster: quader(3, 6) })); }
    // Gewölberippe nach oben
    const rm = B.maske(), [xr, yr] = P.q(0, 13, Z); rm.pfad([[x, yt - k * .3], [B.lerp(x, xr, .3), B.lerp(yt, yr, .55)], [xr, yr]], Math.max(.8, k * .18), Math.max(.6, k * .14)); B.form(K.e[1], rm, K.mat(.25, { ton: 1.2, fase: 0, rand: 1 }));
  }
  // Bänke: Lehnen ragen aus dem Wasser, links tiefer, einige verdreht
  const Zb = nah ? [3.8, 4.5, 5.2] : [6.3, 7.0, 7.7, 8.5, 9.4, 10.4, 11.4];
  Zb.slice().reverse().forEach((Z, i) => { for (const sd of [-1, 1]) {
    const k = P.k(Z), dreh = (B.hash(i, sd, K.o.seed) - .5) * (i % 3 === 1 ? 1.4 : .2), Xa = sd * .9, Xb = sd * 3.2, Ya = .95, wa = wY(Xa), wb = wY(Xb);
    if (Ya < Math.max(wa, wb) - .3) continue;
    const m = B.maske(), [x0, y0] = P.q(Xa, Ya, Z + dreh * .3), [x1, y1] = P.q(Xb, Ya, Z - dreh * .3), [, w0y] = P.q(Xa, Math.max(0, wa), Z + dreh * .3), [, w1y] = P.q(Xb, Math.max(0, wb), Z - dreh * .3);
    m.poly([[x0, y0], [x1, y1], [x1, w1y], [x0, w0y]]); m.rect(Math.min(x0, x1) - 1, Math.min(y0, y1) - Math.max(1, k * .1), Math.abs(x1 - x0) + 2, Math.max(1, k * .08));
    for (const [xx, yy, wy] of [[x0, y0, w0y], [x1, y1, w1y]]) m.rect(xx - Math.max(1, k * .06), yy - k * .12, Math.max(2, k * .12), wy - yy + k * .12);
    m.fn(m.x0, m.y0, m.x1, m.y1, (px, py) => py > y0 + (y1 - y0) * (px - x0) / (x1 - x0 || 1) + k * .18 && py < y0 + (y1 - y0) * (px - x0) / (x1 - x0 || 1) + k * .4, 0);
    K.form(K.eb(Math.max(w0y, w1y)), m, Z > 9 ? .25 : .12, { ton: 1.4, fase: 1 });
  } });
  // grüne Spiegelung des Fensters, warme der Altarkerzen
  for (let y = Math.ceil(P.vy + 6); y < H; y++) { const Z = zw(240, y); if (Z < 0) continue; const e = K.e[K.eb(y)], w = 2 + (y - P.vy) * .12; for (let x = Math.floor(240 - w); x <= 240 + w; x++) { const q = 1 - Math.abs(x - 240) / (w + 1); if (Math.sin(Z * 9) > .2 && B.hash(x, y, 9) < q * (1 - (y - P.vy) / 160)) e.set(x, y, B.hash(x, y, 2) > .7 ? gr : gr2); } }
  // Kerzen auf Treibholz, wo gebetet wurde: an der zweiten Bank links
  if (!nah) { const [tx, ty] = P.q(-1.2, wY(-1.2), 6.9); if (fr < .8) treibholz(K, K.eb(ty), tx, ty, 12, 3, true); }
  kerzeUnterWasser(K, ...P.q(-1.7, -.3, nah ? 2.6 : 3.3).map(Math.round)); kerzeUnterWasser(K, ...P.q(2.0, -.4, 2.2).map(Math.round));
  if (fr > .5) kerzeUnterWasser(K, ...P.q(-.4, -.2, 4.4).map(Math.round));
  B.nebel(K.e[2], { y0: P.vy - 50, y1: P.vy + 22, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .28, xs: [40, 440, 70], seed: 3 });
  // Vordergrund: Pfeiler an den Rändern, angeschnittene Bankwangen unten
  const v = B.maske(); v.rect(-M, -M, 30, H + 2 * M); v.rect(452, -M, 40, H + 2 * M); v.rect(-M, 40, 40, 8); v.rect(446, 36, 46, 8);
  spitzbogenMaske(v, 18, 470, 30, 70, 0);
  v.poly([[-M, 236], [70, 228], [74, 240], [-M, 250]]); v.rect(60, 222, 8, 60); v.poly([[480 + M, 232], [410, 226], [406, 238], [480 + M, 246]]); v.rect(408, 220, 8, 60);
  K.form(5, v, 0, { ton: .7, fase: 2, muster: quader(8, 14), k: ['#030201', '#070504', '#0e0a06', '#18100a'] });
  B.wasserGlanz(K, { x0: 0, x1: 480, y0: P.vy + 4, y1: H, n: 90, farben: ['#30301f', '#3a5a3a', '#6a5a30'], p: .5, pow: 1.3, maske: (x, y) => zw(x, y) > 0, schwelle: .65, laengeNah: 3 });
  B.partikel(K, { n: 36, farben: ['#45301c', '#6a5030', '#3a6a4a'], vx: 1, vy: -4, wob: 4, wf: .4, x0: 120, x1: 360, y0: 0, y1: 160, hellSelten: 2 });
  K.reihen = nah ? [{ y: 186, skala: .9, nebel: .3 }, { y: 200, skala: 1, nebel: .12 }, { y: 214, skala: 1, nebel: 0 }] : [{ y: 164, skala: .9, nebel: .35 }, { y: 189, skala: 1, nebel: .15 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [240, 206] };
}

// Variante 1: Seitenkapelle mit Votivkerzen; die schräge Wasserkante quer über den Boden
function seitenkapelle(K) {
  const fr = K.fr, P = B.persp(300, 150), w0 = .5, b = -.12 - .06 * fr, Zw = 9, kw = P.k(Zw); K.split = [156, 166];
  B.feld(K.e[0], -M, -M, W + M, H + M, WAND, (x, y) => .5 + y / H * .6);
  // Wand frontal mit Quaderwerk, Öffnung der Kapelle als Spitzbogen
  const wm = B.maske(); wm.rect(-M, -M, W + 2 * M, P.q(0, 0, Zw)[1] + M + 1);
  const ox0 = 128, ox1 = 300, oyK = 70; spitzbogenMaske(wm, ox0, ox1, oyK, 70, 0); wm.rect(ox0, oyK - 1, ox1 - ox0, 200, 0);
  B.form(K.e[2], wm, K.mat(.15, { ton: 1.5, fase: 2, verlauf: -.6, muster: quader(6, 13), schatten: 2 }));
  // Laibung des Bogens (Tiefe)
  const lb = B.maske(); spitzbogenMaske(lb, ox0, ox1, oyK, 70, 1); lb.rect(ox0, oyK - 1, ox1 - ox0, 120); spitzbogenMaske(lb, ox0 + 10, ox1 - 6, oyK + 4, 62, 0); lb.rect(ox0 + 10, oyK + 3, ox1 - ox0 - 16, 120, 0);
  B.form(K.e[2], lb, K.mat(.2, { ton: 2.3, fase: 1, muster: quader(5, 9) }));
  // Hinter dem Bogen: Seitenaltar mit Madonnen-Nische und Kerzenständer voller Votivkerzen
  const nm = B.maske(); nm.rect(176, 92, 40, 46); spitzbogenMaske(nm, 176, 216, 92, 22, 1); nm.rect(166, 136, 60, 16);
  B.form(K.e[1], nm, K.mat(.35, { ton: 1.6, fase: 1, muster: quader(4, 8) }));
  const fig = B.maske(); fig.ell(196, 100, 4, 5); fig.poly([[188, 136], [192, 106], [200, 106], [204, 136]]); B.form(K.e[1], fig, K.mat(.25, { ton: 2.4, fase: 1 }));
  const st = B.maske(); st.rect(150, 132, 92, 3); st.rect(158, 122, 76, 2); st.rect(166, 112, 60, 2); st.kap(196, 135, 196, 160, 2, 2);
  B.form(K.e[1], st, K.mat(.1, { ton: 1.6, fase: 0 }));
  const kz = []; for (const [y, x0, x1] of [[132, 152, 240], [122, 160, 232], [112, 168, 224]]) for (let x = x0; x <= x1; x += 6 + (x % 3)) kz.push([x, y]);
  kz.forEach(([x, y], i) => kerze(K, 1, x, y - 1, 2 + (i % 3), fr < .7 ? (i % 5 !== 3) : (i % 3 === 0)));
  K.glut(196, 118, 70, '#5a3008', 1, [0, 1, 2]); K.licht(196, 118, '#ffc060', 70, 1);
  // grünes Licht vom (unsichtbaren) Rundfenster rechts: ein Band, das nach oben steigt
  for (const L of [K.e[2]]) B.kegel(L, 520, 230, -Math.PI + .52, .1, 520, '#0e5a30', .55);
  // Beichtstuhl rechts, halb im Wasser
  const bs = B.maske(); bs.rect(338, 62, 86, 104); bs.poly([[332, 62], [381, 44], [430, 62]]); bs.rect(352, 82, 20, 70, 0); bs.rect(390, 82, 20, 70, 0);
  B.form(K.e[2], bs, K.mat(.05, { ton: 1.4, fase: 2, muster: (x, y) => ((x % 7) === 0 ? -.4 : 0), schatten: 2 }));
  const vh = B.maske(); vh.rect(352, 82, 20, 70); vh.rect(390, 82, 20, 70); B.form(K.e[2], vh, K.mat(.1, { ton: .4, fase: 0, rand: 0, muster: (x, y) => ((x + y) % 4 === 0 ? .8 : 0) }));
  // Hochwassermarke auf der Wand: schräg
  const e2 = K.e[2], mk = B.pk(B.mix(WAND[1], pal.rand[0], .25));
  for (let x = -M; x < W + M; x++) { const X = (x - P.vx) / kw, Y = w0 + b * X + .9, y = P.q(X, Y, Zw)[1]; if (y > -M && y < P.vy + 20) { e2.set(x, y, mk); if (B.hash(x, 0, 2) > .5) e2.set(x, y + 1, mk); } }
  // Boden: trockene Fliesen rechts, Wasser links, die Kante schräg
  const zw = wasserEbene(P, w0, b), sd = K.o.seed;
  K.bodenStoffe(P.vy - 30, H + M, [
    { cols: WASSER, tf: (x, y) => { const Z = zw(x, y); if (Z < 0 || Z > Zw) return -1; return .5 - Math.min(1, 3 / Z) * .35 + (Math.sin(Z * 9 + B.rausch2(x * .03, Z, sd) * 3) > .8 ? .14 : 0); } },
    { cols: BODEN, tf: (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z); const fx = X * 1.3 - Math.floor(X * 1.3), fz = Z * 1.3 - Math.floor(Z * 1.3); let t = .38 + (((Math.floor(X * 1.3) + Math.floor(Z * 1.3)) & 1) ? .1 : 0) - (1 - Math.min(1, Z / 12)) * .15; if (fx * k / 1.3 < 1 || fz * k * k / P.h / 1.3 < .8) t -= .2; return t; } }
  ], (x, y) => { if (y < P.q(0, 0, Zw)[1]) { const Z = zw(x, y); return Z > 0 && Z < Zw ? 0 : -1; } const Z = zw(x, y); return Z > 0 && Z < P.z(y + .5) + .01 ? 0 : 1; });
  // nasse Kante: helle Linie, wo Wasser auf trockene Fliesen trifft
  for (let y = Math.ceil(P.vy + 2); y < H; y++) { const e = K.e[K.eb(y)]; for (let x = -M; x < W + M; x++) { const a = zw(x, y), c = zw(x + 1, y), Zb = P.z(y + .5); if ((a > 0 && a < Zb) !== (c > 0 && c < Zb)) e.set(x, y, B.pk('#6a5030')); } }
  kerzeUnterWasser(K, 96, 196); kerzeUnterWasser(K, 150, 230);
  const v = B.maske(); pfeiler(K, 5, 24, 30, H + M, 40, 0); v.rect(452, -M, 40, H + 2 * M); K.form(5, v, 0, { ton: .7, fase: 2, muster: quader(8, 14) });
  B.wasserGlanz(K, { x0: -M, x1: 420, y0: P.vy + 4, y1: H, n: 70, farben: ['#30301f', '#3a5a3a', '#6a5a30'], p: .5, pow: 1.3, maske: (x, y) => zw(x, y) > 0 && zw(x, y) < P.z(y + .5), schwelle: .65 });
  B.partikel(K, { n: 30, farben: ['#45301c', '#6a5030'], vx: 1, vy: -5, wob: 4, wf: .4, x0: 140, x1: 260, y0: 30, y1: 130 });
  K.reihen = [{ y: 166, skala: .9, nebel: .35 }, { y: 190, skala: 1, nebel: .15 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [250, 206] };
}

// Variante 2: Empore. Vorne Holzboden mit Brüstung, dahinter der Raum, gegenüber das Rundfenster auf Augenhöhe
function empore(K) {
  const fr = K.fr, P = B.persp(240, 100); K.split = [150, 158];
  B.feld(K.e[0], -M, -M, W + M, H + M, WAND, (x, y) => .45 + Math.abs(y - 100) / H * -.4 + .3 + quader(5, 9)(x, y) * .4);
  // Gegenüber: Chorwand mit Rundfenster, Pfeilerköpfe und Bögen ragen aus der Tiefe
  rundfenster(K, 1, 300, 66, 44, .12);
  for (const [x, w] of [[118, 18], [170, 12], [404, 16], [446, 22]]) { pfeiler(K, 2, x, 70 - w, 150, w, .15); }
  const bg = B.maske(); bg.pfad([[118, 52], [132, 20], [146, 8], [158, 18], [170, 58]], 3, 3); bg.pfad([[404, 54], [420, 22], [434, 10], [446, 26], [446, 48]], 3, 3); B.form(K.e[2], bg, K.mat(.15, { ton: 1.2, fase: 1 }));
  // Tiefe unten: Wasser mit Bänken (eigene Perspektive, weit unter uns), durch die Brüstung zu sehen
  const P2 = B.persp(240, 92, 680), zw = wasserEbene(P2, 0, -.05 - .04 * fr);
  B.feld(K.e[1], -M, 100, W + M, 160, WASSER, (x, y) => { const Z = zw(x, y); if (Z < 0) return .6; return .5 + (Math.sin(Z * 2.4) > .85 ? .15 : 0) - Math.min(.3, 20 / Z * .1); });
  for (let i = 0; i < 9; i++) { const Z = 14 + i * 2.2, k = P2.k(Z); for (const sd of [-1, 1]) { const [x0, y0] = P2.q(sd * .8, .15, Z), [x1] = P2.q(sd * 3, .15, Z); B.linie(K.e[1], x0, y0 + (sd < 0 ? -1 : 1), x1, y0 + (sd < 0 ? -2 : 2) * (k / 40), B.pk(WAND[4])); } }
  for (let y = 104; y < 160; y++) if (Math.sin(y * 1.3) > 0) { K.e[1].set(300 + Math.sin(y) * 2, y, B.pk(GRUEN[1])); }
  // Brüstung mit Docken (Lücken), Handlauf mit Randlicht
  const br = B.maske(), yb0 = 116, yb1 = 154; br.rect(-M, yb0 - 4, W + 2 * M, 6); br.rect(-M, yb1 - 3, W + 2 * M, 6);
  for (let x = -6; x < W + M; x += 11) { br.kap(x, yb0, x, yb1, 2.4, 2.4); br.ell(x, yb0 + 12, 3.4, 4); br.ell(x, yb1 - 10, 3.6, 4.4); }
  B.form(K.e[3], br, K.mat(0, { ton: 1.5, fase: 1, schatten: 2 }));
  // Emporenboden: Dielen zur Brüstung hin
  K.boden(yb1 + 2, H + M, BODEN, (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z), f = X / .38 - Math.floor(X / .38); let t = .25 + B.hash(Math.floor(X / .38), 2, 3) * .15 + Math.min(.3, Z / 12); if (f * .38 * k < 1) t -= .2; return t; });
  // Gesangbuchpult und Orgelpfeifen rechts (Empore = Orgel)
  const pu = B.maske(); pu.poly([[96, 168], [120, 160], [122, 166], [100, 174]]); pu.kap(108, 170, 108, 200, 1.6, 2); pu.kap(100, 200, 116, 200, 1.4, 1.4);
  K.form(4, pu, 0, { ton: 1.5, schatten: 2 }); if (fr < .7) { kerze(K, 4, 114, 162, 3, true); K.glut(114, 160, 30, '#4a2a0c', .9, [3, 4]); }
  const og = B.maske(); for (let i = 0; i < 7; i++) { const x = 432 + i * 8, h = 120 + Math.abs(3 - i) * 22; og.rect(x - 3, -M, 6, h); og.poly([[x - 3, h - M], [x, h - M + 5], [x + 3, h - M]]); og.rect(x - 2, h - 26 - M, 4, 2, 0); }
  B.form(K.e[5], og, K.mat(0, { ton: 1.2, fase: 1, muster: (x, y) => ((x % 8) === 3 ? -.5 : 0) }));
  B.nebel(K.e[2], { y0: 60, y1: 140, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .25, xs: [30, 420, 60], seed: 5 });
  B.partikel(K, { n: 30, farben: ['#45301c', '#6a5030', '#3a6a4a'], vx: 1, vy: -3, wob: 4, wf: .4, x0: 200, x1: 400, y0: 20, y1: 150 });
  K.reihen = [{ y: 172, skala: .9, nebel: .3 }, { y: 194, skala: 1, nebel: .12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 210] };
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'kraemer' || art === 'rast' ? 2 : art === 'ereignis' ? 1 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = schiff(K, { nah: true });
  else if (art === 'uebergang') info = schiff(K, { nah: true, treppe: true });
  else info = [k => schiff(k, {}), seitenkapelle, empore][v](K);
  B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.kapelle = { pal, build: bauen, reliefStil: { figuren: 3, gelenke: 2, knick: .3 } };
})();
