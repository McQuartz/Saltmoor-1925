// Saltmoor 1925 · Hintergründe: Akt 3a, Die Salzstollen (Römerzeit und Vorzeit).
// Komposition: docs/auftrag/hintergruende-kompositionen.md
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#070606', '#100d0c', '#1c1716', '#2c2421'], rand: ['#9a8a80', '#f4ece4'], augen: '#ff9a5a', nebel: ['#2a2422', '#6a5e58'], fern: '#9a8e86' };
const SALZ = ['#141110', '#211c1a', '#322a27', '#463c38', '#5e524c', '#786a63', '#94877f', '#b2a69d', '#d0c6bd', '#ece4dc'];
const HOLZ = ['#0a0706', '#150f0c', '#221812', '#33241a', '#463324', '#5c4430'];
const LAMPE = '#ffb060', LAMPG = '#6a3410';

// Salzkruste: Voronoi-Zellen in Weltkoordinaten, Kanten dunkel
function kruste(X, Z, s, gr) {
  const cx = Math.floor(X / gr), cz = Math.floor(Z / gr); let d1 = 9, d2 = 9;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const px = (cx + i + B.hash(cx + i, cz + j, s)) * gr, pz = (cz + j + B.hash(cx + i, cz + j, s + 1)) * gr; const d = Math.hypot(X - px, (Z - pz) * .8); if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
  return [d2 - d1, d1];
}
// gewachsene Säule: unten breit, in der Mitte eingeschnürt, oben in die Decke übergehend, mit Facetten
function saeule(K, eb, x, yF, yT, wb, ww, wt, tiefe, o) {
  o = o || {}; const m = B.maske(), n = 40, L = [], R = [], ph = (o.ph || 0), tw = o.drall || 6, C = {}, Wd = {};
  for (let i = 0; i <= n; i++) {
    const t = i / n, y = B.lerp(yF, yT, t), w = t < .45 ? ww + (wb - ww) * Math.pow(1 - t / .45, 2) : ww + (wt - ww) * Math.pow((t - .45) / .55, 2.2);
    const c = x + Math.sin(t * 3.9 + ph) * tw, j = (B.hash(i, 0, ph * 10 | 0) - .5) * w * .12;
    L.push([c - w / 2 + j, y]); R.push([c + w / 2 - j * .5, y]); C[Math.round(y)] = c; Wd[Math.round(y)] = w;
  }
  m.poly(L.concat(R.reverse()));
  for (let y = Math.floor(yT); y <= yF; y++) if (C[y] === undefined) { C[y] = C[y - 1] || x; Wd[y] = Wd[y - 1] || ww; }
  const mus = (px, py) => { const c = C[py] || x, w = Wd[py] || ww, f = (px - c) / w + .5, fa = Math.floor(f * 5 + Math.sin(py * .05 + ph) * .6); return (fa & 1 ? .5 : 0) + f * .9 + (B.hash(px, py >> 2, 3) - .5) * .3; };
  K.form(eb, m, tiefe, { k: o.k || SALZ.slice(1, 8), r: ['#b2a69d', '#f4ece4'], ton: o.ton || 1.2, fase: 2, verlauf: .8, muster: mus, schatten: 2 });
}
// Kristallgruppe: sechskantige Prismen mit Fase
function kristalle(K, eb, x, yb, s, tiefe, n, seed) {
  const r = B.rng(seed || Math.round(x * 7 + yb)), m = B.maske();
  for (let i = 0; i < (n || 4); i++) { const a = -Math.PI / 2 + r.j(.7), l = s * r.f(.5, 1.2), w = s * r.f(.12, .22), bx = x + r.j(s * .3), ex = bx + Math.cos(a) * l, ey = yb + Math.sin(a) * l, nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
    m.poly([[bx - nx, yb - ny], [ex - nx, ey - ny], [ex + Math.cos(a) * w * 1.4, ey + Math.sin(a) * w * 1.4], [ex + nx, ey + ny], [bx + nx, yb + ny]]); }
  K.form(eb, m, tiefe, { k: SALZ.slice(3, 9), r: ['#d0c6bd', '#ffffff'], ton: 1.4, fase: Math.max(1, s * .06), verlauf: .6, muster: (px, py) => ((px + py) % 5 === 0 ? .4 : 0) });
}
// Fossil in der Wand: Fisch oder Kopffüßer, Augen offen, Blick nach unten
function fossil(K, eb, x, y, s, typ, tiefe) {
  const e = K.e[eb], dunkel = B.pk(B.mix(SALZ[1], K.fern, tiefe)), hell = B.pk(B.mix(SALZ[8], K.fern, tiefe * .5)), mm = B.maske();
  if (typ === 0) { // Fisch: Umriss, Wirbelsäule, Gräten, Schwanz
    mm.fn(x - 12 * s, y - 6 * s, x + 14 * s, y + 6 * s, (px, py) => { const q = ((px - x) / (11 * s)) ** 2 + ((py - y) / (4.5 * s)) ** 2; return q < 1 && q > .7; });
    mm.kap(x - 10 * s, y, x + 9 * s, y, .5, .5); for (let i = -3; i <= 3; i++) { mm.kap(x + i * 2.4 * s, y - 3.6 * s, x + i * 2.4 * s + s, y + 3.6 * s, .5, .5); }
    mm.poly([[x + 10 * s, y], [x + 16 * s, y - 5 * s], [x + 15 * s, y], [x + 16 * s, y + 5 * s]]);
  } else { // Kopffüßer: Spirale, Arme hängen
    for (let a = 0; a < 15; a += .12) { const rr = (1 + a * .55) * s; mm.ell(x + Math.cos(a) * rr, y + Math.sin(a) * rr * .9, .6, .6); }
    for (let i = 0; i < 5; i++) mm.pfad([[x - 8 * s, y + 4 * s], [x - 11 * s - i, y + 8 * s + i * s], [x - 10 * s - i * 2, y + 14 * s + i * 1.5 * s]], .6, .5);
  }
  for (let py = mm.y0; py <= mm.y1; py++) for (let px = mm.x0; px <= mm.x1; px++) if (mm.has(px, py)) { e.set(px, py, dunkel); if (!mm.has(px - 1, py + 1)) e.set(px - 1, py + 1, hell); }
  // Auge: Ring hell, Pupille unten (blickt nach unten)
  const ex = typ === 0 ? x - 7 * s : x - 7 * s, ey = typ === 0 ? y - 1 * s : y + 2 * s, er = Math.max(1.5, 2.2 * s);
  const em = B.maske(); em.ell(ex, ey, er, er); for (let py = em.y0; py <= em.y1; py++) for (let px = em.x0; px <= em.x1; px++) if (em.has(px, py)) e.set(px, py, hell);
  e.set(ex, ey + er - 1, dunkel); e.set(ex + 1, ey + er - 1, dunkel); if (er > 2.5) e.set(ex, ey + er - 2, dunkel);
  if (K.fr > .4) B.gluehen(e, ex, ey + er - 1, 4, '#5a2a10', K.fr);
}
function grubenlampe(K, eb, x, y, an) {
  const m = B.maske(); m.kap(x, y - 10, x, y - 4, .5, .5); m.poly([[x - 3, y - 4], [x + 3, y - 4], [x + 2, y + 3], [x - 2, y + 3]]); m.rect(x - 3, y + 3, 6, 2);
  K.form(eb, m, 0, { k: HOLZ, ton: 2, fase: 0 });
  if (an) { B.dith(K.e[eb], x - 1, y - 2, x + 2, y + 3, LAMPE, () => 1); K.glut(x, y, 60, LAMPG, 1, [1, 2, 3, 4]); B.flamme(K, x, y + 2, { p: B.PAR[eb], kern: '#fff0d0', mitte: LAMPE, aussen: '#c05a20', glut: '#3a1806' }); }
}
function stempel(K, eb, x0, x1, yb, yt, tiefe, o) {
  o = o || {}; const m = B.maske(), w = Math.max(2, (x1 - x0) * .07), bieg = o.bieg || 0;
  const ein = (x1 - x0) * .07;
  m.pfad([[x0, yb], [x0 + ein * .5 + bieg, (yb + yt) / 2], [x0 + ein, yt]], w * .55, w * .45);
  m.pfad([[x1, yb], [x1 - ein * .5 - bieg * .6, (yb + yt) / 2], [x1 - ein, yt]], w * .55, w * .45);
  m.pfad([[x0 + ein - w * .2, yt - w * .2], [(x0 + x1) / 2, yt + (o.durch || 0)], [x1 - ein + w * .2, yt - w * .3]], w * .55, w * .55);
  K.form(eb, m, tiefe, { k: HOLZ, ton: 1.6, fase: 1, schatten: 2, muster: (px, py) => (B.hash(px >> 1, py, 4) - .5) * .5 });
}
function lore(K, eb, x, yb, s, kipp) {
  const m = B.maske(), k = kipp || 0;
  m.poly([[x - 14 * s, yb - 18 * s - k * 3], [x + 14 * s, yb - 18 * s + k * 3], [x + 11 * s, yb - 5 * s + k * 2], [x - 11 * s, yb - 5 * s - k * 2]]);
  m.ell(x - 7 * s, yb - 3 * s - k * 1.5, 3 * s, 3 * s); m.ell(x + 7 * s, yb - 3 * s + k * 1.5, 3 * s, 3 * s);
  m.rect(x - 15 * s, yb - 19 * s - k * 3, 30 * s, 2 * s);
  K.form(eb, m, 0, { k: ['#0a0808', '#151110', '#221c1a', '#342a26'], r: pal.rand, ton: 1.5, fase: 1, schatten: 2, muster: (px, py) => (Math.abs(py - (yb - 11 * s)) < 1 ? -.6 : 0) });
  // Salz in der Lore
  const sm = B.maske(); sm.poly([[x - 12 * s, yb - 19 * s - k * 3], [x - 4 * s, yb - 24 * s], [x + 6 * s, yb - 22 * s], [x + 12 * s, yb - 19 * s + k * 3]]); K.form(eb, sm, 0, { k: SALZ.slice(4, 9), r: ['#d0c6bd', '#ffffff'], ton: 2, fase: 1 });
}
// Schienen in Weltkoordinaten: X = a + c*Z (eigener Fluchtpunkt), mit Schwellen
function gleis(K, P, a, c, Zmax, o) {
  o = o || {}; const sp = .55, Y = o.Y || (Z => 0);
  for (let Z = 1.05; Z < Zmax; Z += .55 + (Z > 6 ? Z * .04 : 0)) { const k = P.k(Z), X = a + c * Z, [x0, y0] = P.q(X - sp * .9, Y(Z), Z), [x1, y1] = P.q(X + sp * .9, Y(Z), Z); const m = B.maske(); m.poly([[x0, y0 - Math.max(.6, k * .03)], [x1, y1 - Math.max(.6, k * .03)], [x1, y1 + Math.max(.6, k * .04)], [x0, y0 + Math.max(.6, k * .04)]]); K.form(K.eb(y0), m, Math.min(.5, Z / 30), { k: HOLZ, ton: 1.4, fase: 0, rand: 1 }); }
  for (const sd of [-1, 1]) { let prev = null; for (let Z = 1.05; Z < Zmax; Z *= 1.04) { const p = P.q(a + c * Z + sd * sp / 2, Y(Z) + .02, Z); if (prev) { const e = K.e[K.eb(p[1])]; B.linie(e, prev[0], prev[1], p[0], p[1], B.pk(B.mix(pal.rand[1], K.fern, Math.min(.6, Z / 25)))); B.linie(e, prev[0], prev[1] + 1, p[0], p[1] + 1, B.pk(SALZ[1])); } prev = p; } }
}

// =====================================================================
// Variante 0: Salzkathedrale (Untersicht, gewachsene Säulen)
function kathedrale(K, o) {
  o = o || {}; const fr = K.fr, P = B.persp(250, 172); K.split = [168, 176];
  const sd = K.o.seed;
  // Ebene 0: ferne Hallenwand hell und dunstig, Decke mit Tropfsalz, Schachtlicht oben rechts
  B.feld(K.e[0], -M, -M, W + M, H + M, SALZ, (x, y) => { const sch = Math.max(0, 1 - Math.abs((x - 400) * .8 + (y - 0) * .45) / 70) * Math.max(0, 1 - y / 200); return .38 + (1 - Math.abs(y - 150) / 160) * .22 + sch * .35 + (B.fbm(x * .02, y * .05, sd, 3) - .5) * .2 - (y < 50 ? (50 - y) / 50 * .25 : 0); });
  // Decke: Zapfen hängen herab (unregelmäßig, an Rissen gehäuft)
  const dm = B.maske(); dm.rect(-M, -M, W + 2 * M, 22);
  for (let x = -M; x < W + M; x += 3) { const l = 6 + B.fbm(x * .03, 1, sd + 2, 2) * 40 * (B.rausch1(x * .015, sd) > .5 ? 1 : .4); dm.poly([[x - 2, 20], [x + 1.5, 20 + l], [x + 3, 20]]); }
  K.form(0, dm, .25, { k: SALZ.slice(1, 7), r: ['#b2a69d', '#f4ece4'], ton: 1.8, fase: 1, verlauf: -.5 });
  // Säulen fern bis nah, nicht im Raster
  const S = [[-11, 30, 1.6], [-4, 38, 1.4], [5, 33, 1.5], [13, 40, 1.8], [-16, 20, 2.2], [9, 21, 1.9], [-6.5, 16.5, 2.1], [3.6, 13.5, 2.3]];
  S.sort((a, b) => b[1] - a[1]).forEach(([X, Z, w], i) => { const k = P.k(Z), [x, yF] = P.q(X, 0, Z), tief = Math.min(.55, Z / 60); saeule(K, Z > 25 ? 1 : 2, x, yF + 2, -M, w * k * 1.9, w * k * .7, w * k * 2.6, tief, { ph: i * 1.7, drall: k * .5 }); });
  // linke Salzwand mit Fossilien (alle blicken nach unten)
  const lw = B.maske(); lw.poly([[-M, -M], [96, -M], [120, 40], [104, 120], [128, 176], [-M, 190]]);
  B.form(K.e[3], lw, K.mat(0, { k: SALZ.slice(1, 8), r: ['#b2a69d', '#f4ece4'], ton: 2.4, fase: 3, verlauf: .8, muster: (x, y) => (B.fbm(x * .05, y * .02, sd + 4, 3) - .5) * 1.4 + ((y + Math.floor(x * .3)) % 9 === 0 ? -.5 : 0) }));
  for (const [x, y, s, t] of [[40, 100, 1.4, 0], [76, 54, 1.1, 1], [26, 150, 1.2, 1], [86, 128, 1, 0], [52, 26, 1, 0]]) fossil(K, 3, x, y, s, t, 0);
  // rechts: letzter Holzstempel, wo der Stollen in die Halle mündet, mit Grubenlampe
  stempel(K, 3, 410, 498, 182, 96, 0, { bieg: 3, durch: 3 });
  grubenlampe(K, 3, 446, 112, fr < .7);
  // Boden: Salzkruste, Kristalle an den Säulenfüßen
  K.boden(P.vy + 1, H + M, SALZ, (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, [d, d1] = kruste(X, Z, sd, .9), k = P.k(Z), f = 1 - (y - P.vy) / P.h; let t = .42 + f * .3 - (1 - f) * .18 + d1 * .1; if (d * k < 1.1) t -= .18; else if (d * k < 2.2 && k > 12) t += .08; return t; });
  gleis(K, P, 2.6, -.32, 26);
  // Lore auf dem Gleis, zum Gefälle hin; niemand schiebt
  const [lx, ly] = P.q(2.6 - .32 * 5.2, 0, 5.2); lore(K, K.eb(ly), lx, ly, P.k(5.2) / 22, .8);
  for (const [X, Z, s] of [[-6.5, 16.2, 1], [3.6, 13.2, .9], [-1.2, 9.5, .7], [6, 8, .9]]) { const [x, y] = P.q(X, 0, Z); kristalle(K, K.eb(y), x, y, P.k(Z) * s * 1.4, Math.min(.4, Z / 40), 4); }
  // Salzstaub in der Luft, im Schachtlicht
  B.nebel(K.e[2], { y0: 110, y1: 176, col: SALZ[6], dichte: .22, xs: [100, 430, 60], seed: 3 });
  const v = B.maske(); kristalle(K, 5, 474, H + 6, 70, 0, 4, 9); kristalle(K, 5, 20, H + 10, 54, 0, 3, 4); void v;
  B.partikel(K, { n: 60, farben: ['#b2a69d', '#d0c6bd', '#ffffff'], vx: -3, vy: 5, wob: 3, wf: .3, x0: 250, x1: 490, y0: -10, y1: 200, hellSelten: 2 });
  K.reihen = [{ y: 174, skala: .9, nebel: .3 }, { y: 194, skala: 1, nebel: .12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [250, 208] };
}

// Variante 1: Holzverbau im Stollen; der Boden fällt nach hinten ab, am Ende ein römischer Bogen
function stollen(K) {
  const fr = K.fr, P = B.persp(292, 124), sd = K.o.seed, gef = .07; K.split = [150, 160];
  const kurve = Z => .012 * Z * Z, Yb = Z => -gef * Z;
  B.feld(K.e[0], -M, -M, W + M, H + M, SALZ, (x, y) => .12 + Math.max(0, 1 - Math.hypot(x - 300, y - 120) / 160) * .3);
  // römischer Bogen am Ende
  const Ze = 22, ke = P.k(Ze), [bx, by] = P.q(kurve(Ze), Yb(Ze), Ze), rb = 1.6 * ke, rm = B.maske();
  rm.rect(bx - rb * 2.2, by - rb * 3.2, rb * 4.4, rb * 3.2 + 2); rm.fn(bx - rb, by - rb * 2.4, bx + rb, by, (x, y) => (y > by - rb * 1.4) || Math.hypot(x - bx, y - (by - rb * 1.4)) < rb, 0);
  K.form(1, rm, .3, { k: SALZ.slice(2, 8), ton: 2, fase: 1, muster: (x, y) => ((y - by) % 5 === 0 || (x + Math.floor((y - by) / 5) * 3) % 9 === 0 ? -.6 : 0) });
  for (const [dx, dy, g] of [[-1.7, -2.6, 0], [1.5, -2.2, 1], [-1.3, -.8, 2], [1.8, -.6, 0]]) { const x = Math.round(bx + dx * rb), y = Math.round(by + dy * rb), e = K.e[1], c = B.pk(SALZ[1]); if (g === 0) { e.set(x, y, c); e.set(x + 1, y + 1, c); e.set(x + 2, y, c); } else if (g === 1) { e.set(x, y, c); e.set(x + 1, y + 1, c); e.set(x + 2, y + 2, c); e.set(x, y + 2, c); e.set(x + 2, y, c); } else { e.set(x, y, c); e.set(x, y + 1, c); e.set(x, y + 2, c); e.set(x - 1, y + 2, c); e.set(x + 1, y + 2, c); } }
  // Stollenwände und Decke: Salz, nah dunkler, Fossilien rechts
  K.bodenStoffe(-M, H + M, [{ cols: SALZ, tf: (x, y) => { const Z = Math.min(Ze, Math.max(.8, (y > P.vy ? P.z(y + .5) : 99))); return .25 + Math.min(.4, 4 / Z) * -.4 + .35 + (B.fbm(x * .04, y * .04, sd, 3) - .5) * .35; } }], () => -1);
  const wand = B.maske(); wand.poly([[-M, -M], [W + M, -M], [W + M, H + M], [bx + rb * 2.2, by], [bx + rb * 2.2, by - rb * 3.2], [bx - rb * 2.2, by - rb * 3.2], [bx - rb * 2.2, by], [-M, H + M]]);
  B.form(K.e[2], wand, K.mat(0, { k: SALZ.slice(0, 7), r: ['#9a8a80', '#f4ece4'], ton: 2.2, fase: 0, rand: 0, muster: (x, y) => (B.fbm(x * .04, y * .03, sd + 5, 3) - .5) * 1.6 - Math.max(0, 1 - Math.hypot(x - bx, y - by) / 230) * -1.2 }));
  for (const [x, y, s, t] of [[400, 150, 1.2, 0], [436, 86, 1, 1], [376, 44, 1, 0], [460, 190, 1.4, 1]]) fossil(K, 2, x, y, s, t, 0);
  // Boden mit Gefälle (eigene Fluchtlinie tiefer), Gleis
  K.boden(P.vy + 4, H + M, SALZ, (x, y) => { const Z = P.h * (1 + gef * 0) / Math.max(.5, (y + .5 - P.vy) + gef * P.h), X = (x + .5 - P.vx) * Z / P.h - kurve(Z); if (Math.abs(X) > 1.9 - Math.min(.4, 1 / Z)) return -1; const [d] = kruste(X, Z, sd, .7), k = P.k(Z); return .35 + Math.min(.3, Z / 50) + (d * k < 1 ? -.2 : 0); });
  // Türstöcke: ungleiche Abstände (wo neu verbaut wurde, dichter), vom Salzdruck verbogen
  const Zs = [2.4, 3.1, 4.6, 5.2, 7.6, 9.8, 10.5, 14, 18.5];
  Zs.slice().reverse().forEach((Z, i) => { const k = P.k(Z), Xc = kurve(Z), [x0, y0] = P.q(Xc - 1.75, Yb(Z), Z), [x1] = P.q(Xc + 1.75, Yb(Z), Z), [, yt] = P.q(0, 2.45, Z); const eb = Z < 3.5 ? 5 : Z < 6 ? 3 : 2; stempel(K, eb, x0, x1, y0 + k * .05, yt, eb === 5 ? 0 : Math.min(.4, Z / 40), { bieg: k * (.06 + .04 * (i % 3)), durch: k * .12 * (1 + (i % 2)) }); if ([1, 4, 7].includes(i)) grubenlampe(K, eb === 5 ? 3 : eb, Math.round((x0 + x1) / 2 + k * .3), Math.round(yt + k * .3 + 6), fr < .75 || i === 7); });
  const gy = Z => Yb(Z); gleis(K, P, .25, 0, 20, { Y: gy });
  const lzz = 7.2, [lx, ly] = P.q(kurve(lzz) + .25, Yb(lzz), lzz); lore(K, K.eb(ly), lx, ly, P.k(lzz) / 34, -.6);
  B.nebel(K.e[2], { y0: 70, y1: 150, col: SALZ[5], dichte: .2, xs: [180, 420, 60], seed: 7 });
  B.partikel(K, { n: 40, farben: ['#94877f', '#d0c6bd'], vx: -2, vy: 4, wob: 3, wf: .3, hellSelten: 2 });
  K.reihen = [{ y: 166, skala: .9, nebel: .3 }, { y: 190, skala: 1, nebel: .12 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [270, 206] };
}

// Variante 2: Kristallgrotte. Links schräge Fossilwand, rechts Kristalle so groß wie Häuser, hinten die Kathedrale
function grotte(K, o) {
  o = o || {}; const fr = K.fr, P = B.persp(214, 150), sd = K.o.seed; K.split = [160, 168];
  B.feld(K.e[0], -M, -M, W + M, H + M, SALZ, (x, y) => .2 + Math.max(0, 1 - Math.hypot((x - 214) * .8, y - 128) / 140) * .6 + (B.fbm(x * .02, y * .04, sd, 2) - .5) * .15);
  // Öffnung zur Kathedrale, weiß
  const om = B.maske(); om.ell(214, 122, 26, 34); om.rect(188, 122, 52, 30);
  B.form(K.e[1], om, K.mat(0, { k: SALZ.slice(6, 10), ton: 2.4, rand: 0, fase: 0, verlauf: .8 }));
  for (const [x, w] of [[200, 5], [222, 7], [238, 4]]) saeule(K, 1, x, 152, 88, w * 1.4, w * .6, w * 2, .35, { k: SALZ.slice(4, 9), drall: 2 });
  K.glut(214, 130, 60, '#3a3430', .9, [0, 1, 2]);
  if (o.spalt) { const sp = B.maske(); sp.poly([[150, 270 + M], [196, 190], [214, 168], [226, 170], [250, 200], [330, 270 + M]]); }
  // Boden
  K.boden(P.vy + 1, H + M, SALZ, (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, [d, d1] = kruste(X, Z, sd + 3, .8), k = P.k(Z), f = 1 - (y - P.vy) / P.h; return .38 + f * .3 - (1 - f) * .15 + d1 * .1 - (d * k < 1.1 ? .2 : 0); });
  if (o.spalt) {
    // Übergang: Spalt im Salz, darunter schwarzes, gefrorenes Wasser
    const sp = B.maske(); sp.poly([[160, 270 + M], [190, 210], [206, 176], [216, 160], [228, 168], [246, 206], [300, 270 + M]]);
    B.form(K.e[4], sp, K.mat(0, { k: ['#02030a', '#050a14', '#0a1426', '#14243a'], r: ['#5a8ab0', '#e8f6ff'], ton: 1, fase: 3, L: [-.4, -.9] }));
    K.glut(226, 230, 60, '#0a1a30', .9, [4]);
  }
  // linke Fossilwand, schräg
  const lw = B.maske(); lw.poly([[-M, -M], [150, -M], [176, 70], [168, 150], [120, 172], [-M, 210]]);
  B.form(K.e[3], lw, K.mat(0, { k: SALZ.slice(1, 8), r: ['#b2a69d', '#f4ece4'], ton: 2.2, fase: 3, verlauf: .6, muster: (x, y) => (B.fbm(x * .04, y * .02, sd + 9, 3) - .5) * 1.2 + (((y * 2 + x) >> 3) % 5 === 0 ? -.4 : 0) }));
  for (const [x, y, s, t] of [[40, 70, 1.6, 0], [110, 40, 1.2, 1], [60, 140, 1.4, 1], [130, 112, 1.1, 0], [20, 180, 1.2, 0], [150, 150, .9, 1]]) fossil(K, 3, x, y, s, t, 0);
  // rechts Kristalle so groß wie Häuser
  kristalle(K, 2, 380, 168, 120, .2, 5, 21); kristalle(K, 1, 300, 156, 50, .35, 4, 7); kristalle(K, 3, 470, 200, 150, 0, 4, 33);
  if (!o.spalt) { const [lx, ly] = P.q(1.6, 0, 6); lore(K, K.eb(ly), lx, ly, P.k(6) / 34, .5); gleis(K, P, 3, -.25, 14); }
  if (fr < .7) grubenlampe(K, 3, 172, 96, true);
  B.nebel(K.e[2], { y0: 100, y1: 166, col: SALZ[6], dichte: .2, xs: [150, 440, 60], seed: 8 });
  B.partikel(K, { n: 50, farben: ['#b2a69d', '#d0c6bd', '#ffffff'], vx: -2, vy: 4, wob: 3, wf: .3, hellSelten: 2 });
  K.reihen = [{ y: 168, skala: .9, nebel: .3 }, { y: 191, skala: 1, nebel: .12 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [250, 206] };
}

// Wächter: eine Säule nah und riesig, rechts das Loch in der Wand
function waechter(K) {
  const fr = K.fr, P = B.persp(250, 176), sd = K.o.seed; K.split = [182, 190];
  B.feld(K.e[0], -M, -M, W + M, H + M, SALZ, (x, y) => .4 + (B.fbm(x * .02, y * .05, sd, 3) - .5) * .25 + Math.max(0, 1 - Math.abs((x - 400) * .8 + y * .45) / 80) * .3);
  for (const [x, w, t] of [[60, 16, .45], [330, 12, .5], [270, 9, .55]]) saeule(K, 1, x, 178, -M, w * 2.2, w * .8, w * 3, t, { drall: 4, ph: x });
  saeule(K, 2, 128, 186, -M, 150, 66, 200, .05, { drall: 14, ph: 1.3 });
  const wm = B.maske(); wm.poly([[330, -M], [W + M, -M], [W + M, 196], [360, 184], [340, 120]]); wm.ell(400, 104, 38, 42, 0);
  B.form(K.e[2], wm, K.mat(.05, { k: SALZ.slice(1, 8), r: ['#b2a69d', '#f4ece4'], ton: 2.3, fase: 3, verlauf: .5, muster: (x, y) => (B.fbm(x * .04, y * .03, sd + 2, 3) - .5) * 1.2 }));
  // Ring aus Salzkruste um das Loch, innen dunkel, tief ein Glimmen
  const ring = B.maske(); ring.ell(400, 104, 44, 48); ring.ell(400, 104, 37, 41, 0); B.form(K.e[2], ring, K.mat(0, { k: SALZ.slice(3, 9), r: ['#d0c6bd', '#ffffff'], ton: 1.6, fase: 2 }));
  const loch = B.maske(); loch.ell(400, 104, 37, 41); B.form(K.e[1], loch, K.mat(0, { k: ['#040303', '#080605', '#100c0a', '#18120f'], ton: .8, rand: 0, fase: 0, verlauf: -.6 }));
  K.glut(404, 116, 26, '#4a1a06', .6 + fr * .4, [1]); K.licht(404, 116, '#ff9a5a', 30, .6);
  for (const [x, y, s, t] of [[360, 30, 1, 0], [450, 180, 1.2, 1], [440, 30, 1, 1]]) fossil(K, 2, x, y, s, t, 0);
  K.boden(P.vy + 1, H + M, SALZ, (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, [d] = kruste(X, Z, sd, .9), k = P.k(Z); return .42 + (1 - (y - P.vy) / P.h) * .3 - (d * k < 1.1 ? .2 : 0); });
  if (fr < .7) grubenlampe(K, 3, 250, 120, true);
  B.partikel(K, { n: 60, farben: ['#b2a69d', '#d0c6bd', '#ffffff'], vx: -3, vy: 5, wob: 3, wf: .3, hellSelten: 2 });
  K.reihen = [{ y: 190, skala: .9, nebel: .28 }, { y: 202, skala: 1, nebel: .12 }, { y: 215, skala: 1, nebel: 0 }];
  return { mitte: [250, 210] };
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'kraemer' ? 1 : art === 'rast' ? 1 : art === 'wandbild' ? 2 : (o.seed + v) % 3;
  K.kulisse = art === 'waechter' ? 'waechter' : v; // M3: welche Kulisse die Szene zeigt (Schlüssel für die Fahrt, data/fahrt.json)
  let info;
  if (art === 'waechter') info = waechter(K);
  else if (art === 'uebergang') info = grotte(K, { spalt: true });
  else info = [kathedrale, stollen, grotte][v](K);
  B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.salz = { pal, build: bauen, reliefStil: { figuren: 4, gelenke: 2, knick: .4, stein: ['#5e524c', '#786a63', '#94877f', '#d0c6bd'] } };
})();
