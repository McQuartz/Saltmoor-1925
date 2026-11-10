// Saltmoor 1925 · Hintergründe: Akt II, Die Glockengießerei (Biom-Paket glockengiesserei).
// Komposition: docs/auftrag-2/biome/glockengiesserei.md
// Ort: die Gießhütte unter dem Kirchhof von St. Brendan, 1641. Rußschwarzes Backsteingewölbe, Boden aus
// gestampftem Lehm, hinten der Flammofen; vom Abstich laufen glühende Gussrinnen zu den Dammgruben.
// Licht kommt von unten und von hinten (Ofenmaul, Rinnen, Gruben), dazu ein wenig kaltes Licht aus dem
// Schacht, durch den die Glocken hinaufgezogen wurden. Wahrzeichen: die große Glocke, halb im Lehmmantel.
// Falsches Detail: unter jeder fertigen Glocke hängen statt eines Klöppels zwei nackte Füße.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#060506', '#0e0b0d', '#1a1418', '#2a2026'], rand: ['#a8322a', '#ff9e6e'], augen: '#ffd36a', nebel: ['#180c0c', '#3a1c18'], fern: '#3e1e1a' };
const ZIEGEL = ['#060304', '#0c0607', '#130a0a', '#1b0e0d', '#251411', '#311a15', '#3f2119', '#52291d'];
const LEHM = ['#050404', '#0a0807', '#110e0c', '#181411', '#201a16', '#2a221c', '#352b23', '#433629'];
const GLUT = ['#2a0806', '#4e100a', '#7e1a0e', '#b02c14', '#da4a1c', '#ff6a24', '#ff9a40', '#ffd36a', '#fffbe6'];
const BRONZE = ['#0a0606', '#140c0a', '#20140f', '#2e1d16', '#40291e', '#563828', '#714a34', '#a87a52'];
const HOLZ = ['#060404', '#0d0908', '#150f0c', '#1f1611', '#2a1e17', '#382820'];
const MANTEL = ['#0d0a08', '#18120e', '#241b14', '#31251b', '#403023', '#52402e'];
const HAUT = ['#150c0a', '#241510', '#352018', '#482c20', '#5e3a2a'];
const KALT = ['#0e1216', '#161c22', '#202a34', '#2e3c4a', '#43566a', '#62788e'];
const RAND_B = ['#a8322a', '#ff9e6e'], RAND_H = ['#7a2a1e', '#d8805a'];
const FUNKE = '#ffd36a', FUNKE2 = '#ff6a24', GLUTG = '#3a0e08';

// Glockenprofil: halbe Breite (Anteil am Randradius) über der Höhe (0 Haube, 1 Schärfe)
const PROFIL = [[0, 0.5], [0.04, 0.6], [0.12, 0.66], [0.35, 0.68], [0.55, 0.73], [0.7, 0.81], [0.82, 0.91], [0.92, 0.99], [0.98, 1.02], [1, 1]];
const breite = q => { for (let i = 1; i < PROFIL.length; i++) if (q <= PROFIL[i][0]) { const [q0, w0] = PROFIL[i - 1], [q1, w1] = PROFIL[i]; return w0 + (w1 - w0) * (q - q0) / (q1 - q0 || 1); } return 1; };
// Eine Glocke im Bild: cx, Haube yt, Höhe h, Randradius R. o: tiefe, fuesse, mantel (Anteil links im Lehm), sprung, ton
function glocke(K, eb, cx, yt, h, R, o) {
  o = o || {}; const td = o.tiefe || 0, e = K.e[eb];
  const m = B.maske(); m.fn(cx - R - 2, yt - 1, cx + R + 2, yt + h + 1, (x, y) => { const q = (y - yt) / h; if (q < 0 || q > 1) return false; return Math.abs(x - cx) <= breite(q) * R; });
  // Krone und Aufhängung
  const kr = Math.max(1, R * 0.14); m.rect(cx - R * 0.3, yt - kr, R * 0.6, kr + 1);
  if (o.haken !== false) m.rect(cx - 0.5, yt - kr - (o.haken || 4), Math.max(1, R * 0.04), (o.haken || 4));
  const rib = [0.13, 0.17, 0.8, 0.85];
  K.form(eb, m, td, { k: BRONZE.slice(0, o.dunkel ? 5 : 7), r: RAND_B, ton: o.ton || 1.5, fase: Math.max(1, R * 0.06), rand: 2, schatten: 2, verlauf: 0.4,
    muster: (x, y) => { const q = (y - yt) / h, sn = (x - cx) / (breite(Math.max(0, q)) * R || 1); let t = 0;
      for (const l of rib) { const d = (q - l) * h; if (Math.abs(d) < 0.6) t -= 1.6; else if (Math.abs(d + 1.1) < 0.6) t += 0.8; }
      if (sn > 0.25 && sn < 0.48) t += 0.7; else if (sn > 0.55 && sn < 0.65) t += 1.5; else if (sn < -0.4) t -= 0.6;
      if (q > 0.2 && q < 0.3 && h > 30 && ((x * 3 + Math.floor(y / 2)) % 5 === 0) && sn > -0.3) t += 1.2;
      return t; } });
  // Lehmmantel links (Wahrzeichen): abgeschlagene, zackige Kante, Eisenbänder
  if (o.mantel) {
    const mm = B.maske(); const kante = y => { const q = (y - yt) / h; return cx - R * (o.mantel - 0.5) * 2 + Math.sin(q * 23) * R * 0.08 + Math.sin(q * 7.3) * R * 0.11 - (q > 0.75 ? R * 0.3 * (q - 0.75) * 4 : 0); };
    mm.fn(cx - R - 4, yt + h * 0.03, cx + R, yt + h * 0.97, (x, y) => { const q = (y - yt) / h; return x <= Math.min(cx + breite(q) * R + 1.5, kante(y)) && x >= cx - breite(q) * R - 2.5; });
    K.form(eb, mm, td, { k: MANTEL, r: RAND_H, ton: 2.6, fase: 1.5, rand: 2, schatten: 3, verlauf: 0.3,
      muster: (x, y) => { const q = (y - yt) / h; let t = (B.hash(x >> 1, y >> 1, 9) - 0.5) * 1.2; for (const l of [0.22, 0.5, 0.76]) { const d = (q - l) * h; if (Math.abs(d) < R * 0.03 + 0.6) t -= 1.4; else if (Math.abs(d + R * 0.03 + 1) < 0.7) t += 1; } if (x > kante(y) - 2) t += 1.3; return t; } });
  }
  // Mund: glüht von innen
  const my = yt + h, mr = R * 0.86;
  for (let x = Math.floor(cx - mr); x <= cx + mr; x++) { const d = Math.abs(x - cx) / mr, t = (o.glut ?? 0.8) * (1 - d * d); const c = t > 0.7 ? GLUT[6] : t > 0.45 ? GLUT[5] : t > 0.2 ? GLUT[3] : GLUT[1]; e.set(x, my - 1, B.pk(c)); if (t > 0.35) e.set(x, my, B.pk(GLUT[2])); }
  if ((o.glut ?? 0.8) > 0.3) for (const i of [eb, Math.min(4, eb + 1)]) B.gluehen(K.e[i], cx, my + 2, R * 1.2 + 6, GLUTG, 0.7);
  // Sprung (glühend)
  if (o.sprung) { let sx = cx + R * 0.4; for (let y = my - 1; y > my - h * 0.35; y--) { e.set(sx, y, B.pk(y > my - h * 0.15 ? GLUT[5] : GLUT[2])); if ((y & 3) === 0) sx += (y & 4) ? 1 : 0; } }
  // Füße: das falsche Detail. Zwei nackte Füße hängen unter dem Rand, Zehen nach unten
  if (o.fuesse) {
    const s = Math.max(0.5, R / 14), fm = B.maske(), sw = o.schwung || 0;
    for (const [dx, l] of [[-0.24, 1], [0.2, 0.9]]) {
      const fx = cx + dx * R + sw, top = my - 1, an = my + 7 * s * l;
      fm.kap(fx, top, fx + sw * 0.3, an, 1.2 * s, 1 * s);
      fm.poly([[fx - 1.5 * s, an - 1 * s], [fx + 1.8 * s, an - 1 * s], [fx + 2 * s, an + 1.5 * s], [fx - 0.8 * s, an + 5 * s], [fx - 2.6 * s, an + 5.2 * s], [fx - 2.4 * s, an + 3 * s]]);
    }
    K.form(eb, fm, Math.max(0, td - 0.05), { k: HAUT, r: RAND_H, ton: 2.2, fase: 0.8, rand: 1, schatten: 1, verlauf: -0.6 });
    // Licht von unten auf den Sohlen
    for (let y = fm.y0; y <= fm.y1; y++) for (let x = fm.x0; x <= fm.x1; x++) if (fm.has(x, y) && !fm.has(x, y + 1)) e.set(x, y, B.pk(GLUT[2]));
  }
  return { my, m };
}
// Schwerer Balken (Eiche) als Polygon; d = Dicke
function balken(K, eb, x1, y1, x2, y2, d, td, dim) {
  const m = B.maske(), a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a) * d / 2, ny = Math.cos(a) * d / 2;
  m.poly([[x1 - nx, y1 - ny], [x2 - nx, y2 - ny], [x2 + nx, y2 + ny], [x1 + nx, y1 + ny]]);
  K.form(eb, m, td || 0, { k: HOLZ, r: dim ? RAND_H : RAND_B, ton: dim ? 2 : 2.6, fase: Math.max(1, d * 0.15), rand: dim ? 1 : 2, schatten: 2, verlauf: 0.3,
    muster: (x, y) => { const u = (x - x1) * Math.cos(a) + (y - y1) * Math.sin(a), v = -(x - x1) * Math.sin(a) + (y - y1) * Math.cos(a); return (Math.abs(Math.sin(v * 1.7 + Math.sin(u * 0.05) * 2)) < 0.25 ? -0.9 : 0) + (B.hash(Math.floor(u / 6), Math.floor(v), 3) - 0.5) * 0.4; } });
  return m;
}
// Backsteinfläche (Muster in Bildkoordinaten), Mörtelfugen dunkel, Kanten der Steine mit etwas Licht
function ziegelMuster(s, hh) { hh = hh || 4; const bw = hh * 2.4; return (x, y) => { const row = Math.floor(y / hh), off = (row & 1) * bw / 2, fy = y - row * hh, fx = ((x + off) % bw + bw) % bw; let t = 0; if (fy < 1 || fx < 1) t -= 1.3; else if (fy < 2 && fx > 1) t += 0.4; return t + (B.hash(Math.floor((x + off) / bw), row, s) - 0.5) * 0.9; }; }
// Lehmboden mit Gussrinnen (glühend) und Gruben. rinnen: [{X0, Z0, X1, Z1, w}] (Fluchtlinien), gruben: [{X, Z, r}]
function boden(K, P, y0, rinnen, gruben, o) {
  o = o || {}; const sd = K.o.seed, gl = o.glanzX ?? 300;
  const inRinne = (X, Z, k) => { for (const c of rinnen) { if (Z < Math.min(c.Z0, c.Z1) || Z > Math.max(c.Z0, c.Z1)) continue; const t = (Z - c.Z0) / (c.Z1 - c.Z0 || 1), xc = c.X0 + (c.X1 - c.X0) * t, d = Math.abs(X - xc) * k; const w = c.w * k; if (d < w) return 1 + (d < w * 0.45 ? 1 : 0); if (d < w + Math.max(1, k * 0.05)) return 3; } return 0; };
  const mats = [
    { cols: LEHM, tf: (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h; let t = 0.25 + Math.min(0.2, Z / 60) + (B.fbm(X * 0.8, Z * 0.5, sd + 3, 2) - 0.5) * 0.3;
      t += Math.max(0, 0.25 - Math.abs(x - gl) / 300) * (1 - Math.min(1, (y - P.vy) / 120)); // Glut des Ofens auf dem Boden
      if (((Math.floor(X * 3) + Math.floor(Z * 2)) & 7) === 0 && B.hash(Math.floor(X * 3), Math.floor(Z * 2), sd) > 0.6) t -= 0.12; return t; } },
    { cols: GLUT.slice(0, 5), tf: (x, y) => { const Z = P.z(y + 0.5); return 0.45 + Math.min(0.3, 3 / Z) + (B.fbm(x * 0.05, Z * 0.8, sd + 9, 2) - 0.5) * 0.4 - K.fr * 0 + (o.rinnenHell || 0); } },
    { cols: GLUT.slice(1, 6), tf: (x, y) => { const Z = P.z(y + 0.5); return 0.4 + Math.min(0.4, 4 / Z) + (B.fbm(x * 0.08, Z * 1.2, sd + 4, 2) - 0.5) * 0.5 + K.fr * 0.15; } },
    { cols: LEHM.slice(3), tf: () => 0.9 },
  ];
  K.bodenStoffe(y0, H + M, mats, (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h, k = P.k(Z); return inRinne(X, Z, k); });
  for (const g of gruben) grube(K, P, g.X, g.Z, g.r, g);
  // Glut der Rinnen als Licht auf dem Boden ringsum
  for (const c of rinnen) for (let t = 0; t <= 1; t += 0.1) { const Z = c.Z0 + (c.Z1 - c.Z0) * t, [x, y] = P.q(c.X0 + (c.X1 - c.X0) * t, 0, Z); if (y < y0) continue; B.gluehen(K.e[K.eb(y)], x, y, 6 + P.k(Z) * 0.6, GLUTG, 0.6); }
}
// Dammgrube: ein Loch im Boden, Rand aus gestampftem Lehm, innen Glut
function grube(K, P, X, Z, rr, o) {
  o = o || {}; const [cx, cy] = P.q(X, 0, Z), k = P.k(Z), rx = rr * k, ry = Math.max(2, rx * (P.h / Z) / (P.h / Z + 30) * 0.5);
  const eb = K.eb(cy), e = K.e[eb];
  const ring = B.maske(); ring.ell(cx, cy, rx + 2 + k * 0.08, ry + 1.5 + k * 0.03); ring.ell(cx, cy, rx, ry, 0);
  K.form(eb, ring, 0, { k: LEHM.slice(1), r: RAND_B, ton: 3.2, fase: 1, rand: 2, schatten: 2 });
  for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
    const q = ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2; if (q > 1) continue;
    const dy = (y - (cy - ry)) / (2 * ry); const t = (o.leer ? 0.15 : 0.55) * (1 - q) + dy * 0.25 + (B.bay(x, y) - 0.5) * 0.25;
    e.set(x, y, B.pk(o.leer ? GLUT[Math.max(0, Math.min(6, Math.floor((0.35 * (1 - q) + dy * 0.55 + (B.bay(x, y) - 0.5) * 0.2) * 8) - 1))] : GLUT[Math.max(0, Math.min(7, Math.floor(t * 8)))]));
  }
  B.gluehen(e, cx, cy - ry, rx + 10, GLUTG, 0.8); if (eb > 1) B.gluehen(K.e[eb - 1], cx, cy - ry - 6, rx + 18, GLUTG, 0.6);
  K.licht(cx, cy, GLUT[5], rx + 20, o.leer ? 0.3 : 0.6);
  if (!o.leer) B.partikel(K, { n: Math.round(6 + rx / 3), farben: [FUNKE, FUNKE2, GLUT[3]], x0: cx - rx, x1: cx + rx, y0: cy - 60 - rx, y1: cy, vy: -12, wob: 2, wf: 1.5, blink: 1.5, p: B.PAR[eb], hellSelten: 1.4 });
}
// Flammofen: gemauerter Block mit Kuppel, rundes Maul voll Glut, Esse nach oben. Liefert den Abstich.
function ofen(K, eb, cx, by, w, h, o) {
  o = o || {}; const td = o.tiefe || 0;
  const m = B.maske(); m.rect(cx - w / 2, by - h * 0.62, w, h * 0.62); m.ell(cx, by - h * 0.62, w / 2, h * 0.38); if (o.esse !== false) m.rect(cx - w * 0.12, -M, w * 0.24, by - h * 0.9 + M);
  m.rect(cx - w * 0.62, by - h * 0.12, w * 1.24, h * 0.12);
  K.form(eb, m, td, { k: ZIEGEL.slice(1), r: RAND_B, ton: 2.6, fase: 1.5, rand: 2, schatten: 2, verlauf: -0.4, muster: ziegelMuster(5, Math.max(2, Math.round(h / 22))) });
  // Maul: Rundbogen, gleichmäßige Glut (ruhige Fläche)
  const mw = w * (o.maul || 0.42), mh = h * (o.maulH || 0.42), my = by - h * 0.14;
  B.feld(K.e[eb], cx - mw / 2, my - mh, cx + mw / 2, my, GLUT, (x, y) => { const u = (x - cx) / (mw / 2), v = (my - y) / mh; const ins = v < 0.62 ? Math.abs(u) <= 1 : (u * u + ((v - 0.62) / 0.38) ** 2) <= 1; if (!ins) return -1; return 0.66 + 0.18 * (1 - Math.abs(u)) - v * 0.12 + (B.rausch2(x * 0.3, y * 0.1, 7) - 0.5) * 0.12 + (o.hell || 0); });
  for (const i of [Math.max(1, eb - 1), eb, Math.min(4, eb + 1)]) B.gluehen(K.e[i], cx, my - mh / 2, w * 1.4, GLUTG, 0.85);
  K.licht(cx, my - mh / 2, GLUT[6], w * 1.6, 1);
  return { tap: [cx, by], maul: [cx, my - mh / 2, mw, mh] };
}
// Gewölbe: dunkle Backsteinwand, Gurtbögen; Licht von unten (rötlich), oben fast schwarz
function wand(K, o) {
  o = o || {}; const sd = K.o.seed, mu = ziegelMuster(sd + 1, 3);
  B.feld(K.e[0], -M, -M, W + M, H + M, ZIEGEL, (x, y) => 0.08 + Math.pow(Math.max(0, y) / (o.hor || 150), 2) * 0.5 + (mu(x, y) * 0.06) + (B.fbm(x * 0.02, y * 0.03, sd, 3) - 0.5) * 0.15 + Math.max(0, 0.3 - Math.abs(x - (o.lichtX ?? 240)) / 500) * (y / 200));
}
// Schacht nach oben: kaltes Licht, ein Seil hängt herab (die Glocken wurden hier in den Kirchhof gezogen)
function schacht(K, eb, x, y1, w, seilBis) {
  const m = B.maske(); m.rect(x - w / 2, -M, w, y1 + M);
  B.feld(K.e[eb], x - w / 2, -M, x + w / 2, y1, KALT, (px, py) => 0.85 - py / (y1 * 1.4) - Math.abs(px - x) / w * 0.4 + (B.bay(px, py) - 0.5) * 0.1);
  const r = B.maske(); r.rect(x - w / 2 - 4, y1, w + 8, 4); K.form(eb, r, 0.1, { k: ZIEGEL.slice(2), r: KALT.slice(4), ton: 3, fase: 1, rand: 1 });
  for (let y = -M; y < seilBis; y++) K.e[eb].set(x + 3 + Math.sin(y * 0.05) * 1.2, y, B.pk(y < y1 ? '#0a0c0e' : HOLZ[4]));
  B.kegel(K.e[eb + 1 > 4 ? 4 : eb + 1], x, y1, Math.PI / 2, 0.22, 90, KALT[2], 0.35);
  K.licht(x, y1, KALT[5], 60, 0.4);
}
// Galgen aus Eichenstämmen über der großen Glocke: zwei schräge Ständer, ein Querbalken, eine Kette
function galgen(K, eb, cx, by, bw, top, td) {
  balken(K, eb, cx - bw / 2 - 6, by + 2, cx - bw / 2 + 10, top, Math.max(3, bw * 0.06), td);
  balken(K, eb, cx + bw / 2 + 6, by + 2, cx + bw / 2 - 10, top, Math.max(3, bw * 0.06), td);
  balken(K, eb, cx - bw / 2 - 2, top + 2, cx + bw / 2 + 2, top + 2, Math.max(3, bw * 0.08), td);
}

// =====================================================================
// Variante 0: Die Gießhalle. Tunnel aus Backstein mit Gurtbögen, hinten der Ofen; die Rinnen laufen auf uns zu.
// Rechts hinten die große Glocke (Wahrzeichen) im Galgen, links ein Balken mit fertigen Glocken.
function halle(K, cfg) {
  cfg = cfg || {}; const fr = K.fr, sd = K.o.seed, vx = 300, vy = 146, P = B.persp(vx, vy); K.split = [158, 170];
  wand(K, { hor: 150, lichtX: vx });
  // Gurtbögen, nach hinten kleiner
  for (const [Z, eb, td] of [[14, 1, 0.55], [9, 1, 0.4], [6, 2, 0.25], [4, 2, 0.12], [2.6, 3, 0.04]]) {
    const k = P.k(Z), [xl] = P.q(-5.2, 0, Z), [xr] = P.q(5.2, 0, Z), [, yb] = P.q(0, 0, Z), [, ys] = P.q(0, 3.6, Z);
    const m = B.maske(), d = Math.max(3, k * 0.5), rx = (xr - xl) / 2, ry = Math.max(4, (yb - ys) * 0.7);
    m.fn(xl - d, ys - ry - d, xr + d, yb, (x, y) => { if (y > ys) return Math.abs(x - xl) < d || Math.abs(x - xr) < d; const q = ((x - vx) / rx) ** 2 + ((y - ys) / ry) ** 2; const q2 = ((x - vx) / (rx + d)) ** 2 + ((y - ys) / (ry + d)) ** 2; return q2 <= 1 && q > 1; });
    K.form(eb, m, td, { k: ZIEGEL, r: RAND_B, ton: 3, fase: 1.5, rand: 2, schatten: 2, verlauf: -0.6, muster: ziegelMuster(sd + Z, Math.max(2, Math.round(k * 0.12))) });
  }
  // Ofen hinten im Fluchtpunkt, mit Bühne und Leiter (Maßstab)
  const kz = P.k(11); const of = ofen(K, 1, vx, vy + 2, kz * 5.2, kz * 4.4, { tiefe: 0.3, esse: false, maul: 0.5, maulH: 0.5 });
  const lm = B.maske(); lm.kap(vx + kz * 2.2, vy, vx + kz * 2.5, vy - kz * 2.3, 0.7, 0.7); lm.kap(vx + kz * 2.7, vy, vx + kz * 3, vy - kz * 2.3, 0.7, 0.7); for (let i = 1; i < 6; i++) lm.rect(vx + kz * 2.25 + i * kz * 0.05, vy - i * kz * 0.38, kz * 0.5, 0.8);
  K.form(1, lm, 0.3, { k: HOLZ, r: RAND_B, ton: 3, fase: 0, rand: 1 });
  // Große Glocke rechts hinten im Galgen (Wahrzeichen), steht in ihrer Grube
  const gZ = 5.6, [gx, gy] = P.q(3.1, 0, gZ), gk = P.k(gZ);
  galgen(K, 2, gx, gy, gk * 3.6, gy - gk * 4.6, 0.18);
  glocke(K, 2, gx, gy - gk * 3.7, gk * 3.4, gk * 1.55, { tiefe: 0.15, mantel: 0.55, sprung: true, haken: gk * 0.6, fuesse: true, glut: 0.9 });
  // Links: Balken an der Wand, daran Glocken, nach hinten kleiner; Füße darunter (mit fremdheit mehr)
  const [bx0, by0] = P.q(-4.4, 3.3, 1.6), [bx1, by1] = P.q(-4.4, 3.3, 12);
  balken(K, 3, bx0, by0, bx1, by1, 6, 0.05);
  const reihe = [[2.2, 3], [3.2, 3], [4.6, 2], [6.8, 2], [10, 2]];
  reihe.forEach(([Z, eb], i) => { const [x, y] = P.q(-4.4, 3.3, Z), k = P.k(Z); glocke(K, eb, x, y + k * 0.25, k * 1.15, k * 0.62, { tiefe: Z > 6 ? 0.25 : 0.05, haken: k * 0.25, fuesse: i < 2 + Math.round(fr * 3), glut: 0.5, schwung: i % 2 }); });
  // Boden: drei Rinnen vom Abstich auf uns zu, eine biegt zur großen Grube
  const rinnen = [{ X0: -0.3, Z0: 11, X1: -1.6, Z1: 1.2, w: 0.05 }, { X0: 0.3, Z0: 11, X1: 1.4, Z1: 1.2, w: 0.045 }, { X0: 0.5, Z0: 10.5, X1: 2.9, Z1: gZ + 0.3, w: 0.05 }];
  boden(K, P, vy + 1, rinnen, [{ X: 3.1, Z: gZ, r: 1.6 }, { X: 3.6, Z: 2.1, r: 0.9 }, { X: -2.4, Z: 3.4, r: 0.7 }], { glanzX: vx });
  // Maßstab: Schubkarre mit Lehm links, Hocker
  { const [x, y] = P.q(-2.8, 0, 5.2), k = P.k(5.2); const m = B.maske(); m.poly([[x - k * 0.6, y - k * 0.5], [x + k * 0.4, y - k * 0.5], [x + k * 0.3, y - k * 0.15], [x - k * 0.5, y - k * 0.15]]); m.ell(x - k * 0.1, y - k * 0.55, k * 0.45, k * 0.12); m.ell(x + k * 0.3, y - k * 0.07, k * 0.1, k * 0.1); m.kap(x - k * 0.6, y - k * 0.3, x - k * 1.1, y - k * 0.2, 0.7, 0.7);
    K.form(K.eb(y), m, 0, { k: HOLZ, r: RAND_B, ton: 3, fase: 0.8, rand: 1, schatten: 1 }); }
  // Vordergrund: links ein Pfosten angeschnitten mit Strebe, rechts unten eine Grubenkante
  balken(K, 5, 14, -M, 22, H + M, 20, 0); balken(K, 5, -M, 40, 30, 4, 10, 0);
  { const v = B.maske(); v.poly([[392, H + M], [420, 246], [470, 238], [W + M, 240], [W + M, H + M]]); K.form(5, v, 0, { k: LEHM.slice(0, 5), r: RAND_B, ton: 2, fase: 2 }); for (let x = 420; x < 492; x++) K.e[5].set(x, 244 - (x - 420) * 0.08, B.pk(GLUT[3])); }
  B.nebel(K.e[2], { y0: vy - 26, y1: vy + 10, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.28, xs: [-20, 500, 60], seed: 3 });
  luft(K);
  K.reihen = [{ y: 168, skala: 0.9, nebel: 0.3 }, { y: 192, skala: 1, nebel: 0.12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [250, 208], P, of };
}

// Variante 1: Unter dem Glockenstuhl. Ein Glockenstuhl aus Eiche läuft hoch quer durchs Bild, fünf Glocken
// hängen daran, links klein, rechts groß. Hinten die Wand mit dem Schacht (kaltes Licht, Seil).
function stuhl(K, cfg) {
  cfg = cfg || {}; const fr = K.fr, sd = K.o.seed, vx = 120, vy = 156, P = B.persp(vx, vy); K.split = [166, 176];
  wand(K, { hor: 160, lichtX: 120 });
  schacht(K, 0, 300, 70, 34, 120);
  // fern links: die große Glocke als Silhouette vor der Glut des Ofens
  const of = ofen(K, 1, 62, vy - 2, 80, 70, { tiefe: 0.55, maul: 0.5, hell: 0.05 });
  glocke(K, 1, 120, vy - 64, 58, 30, { tiefe: 0.45, mantel: 0.6, fuesse: true, glut: 0.6, haken: 6, dunkel: true });
  // Rückwand: Pfeiler mit Bögen (Nischen)
  for (const x of [190, 410]) { const m = B.maske(); m.rect(x - 12, 40, 24, vy - 38); K.form(2, m, 0.15, { k: ZIEGEL, r: RAND_B, ton: 3, fase: 1.5, rand: 2, schatten: 2, verlauf: -0.5, muster: ziegelMuster(sd + x, 3) }); }
  // Glockenstuhl: zwei schräge Balken, Ständer, Andreaskreuze
  const yA = x => 58 - (x - 0) * 0.09, yB = x => 68 - (x - 0) * 0.09;
  balken(K, 3, -M, yA(-M), W + M, yA(W + M), 9, 0); balken(K, 3, -M, yB(-M) + 8, W + M, yB(W + M) + 8, 6, 0.02);
  for (const x of [46, 236, 448]) { balken(K, 3, x, yA(x), x + 2, vy + 30, 9, 0.1, true); }
  for (const [a, b] of [[46, 236], [236, 448]]) { balken(K, 2, a + 4, yB(a) + 12, b - 4, vy + 18, 5, 0.22, true); balken(K, 2, b - 4, yB(b) + 12, a + 4, vy + 18, 5, 0.22, true); }
  // Fünf Glocken, links klein, rechts groß; die größte reicht fast bis zum Boden
  const gl = [[96, 22, 0.7], [160, 28, 0.85], [290, 36, 1.05], [360, 30, 1], [420, 46, 1.3]];
  gl.forEach(([x, R, s], i) => { const yt = yA(x) + 8; const h = R * 1.75 * (i === 4 ? 1.25 : 1); glocke(K, 3, x, yt + 4, h, R, { tiefe: 0.1, haken: 6, fuesse: i < 3 + Math.round(fr * 2) || i === 4, glut: 0.55, schwung: (i % 2) * 2 - 1, sprung: i === 2 }); });
  // Boden: Gruben als glühende Ringe, eine Rinne diagonal
  boden(K, P, vy + 1, [{ X0: 3.5, Z0: 9, X1: -1.5, Z1: 1.3, w: 0.08 }, { X0: 0.6, Z0: 12, X1: 0.6, Z1: 5.4, w: 0.07 }], [{ X: 1.8, Z: 5, r: 0.8 }, { X: 3.1, Z: 2.4, r: 0.5 }, { X: -0.4, Z: 8, r: 0.7 }], { glanzX: 140 });
  // Unter der größten Glocke zwei Rinnen im Lehm, gezogen von den Zehen
  for (const dx of [-8, 6]) for (let y = 200; y < 222; y++) K.e[4].set(420 + dx + (y - 200) * 0.25, y, B.pk(LEHM[0]));
  // Vordergrund: rechts unten ein Ständerfuß, links ein Seilhaufen
  balken(K, 5, 470, 150, 478, H + M, 16, 0);
  { const v = B.maske(); for (let i = 0; i < 6; i++) v.ell(30 + i * 7, 258 - (i % 2) * 3, 12, 5); K.form(5, v, 0, { k: HOLZ, r: RAND_B, ton: 2.2, fase: 1, rand: 2, muster: (x, y) => ((x + y * 2) % 5 === 0 ? -1 : 0) }); }
  B.nebel(K.e[2], { y0: vy - 24, y1: vy + 8, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.26, xs: [-20, 500, 60], seed: 5 });
  luft(K);
  K.reihen = [{ y: 176, skala: 0.9, nebel: 0.3 }, { y: 196, skala: 1, nebel: 0.12 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [250, 210], P, of };
}

// Variante 2: Die Formenkammer. Frontal, drei Rundbögen, darin Lehmkerne in Reihen; in der Mitte öffnet sich
// der Bogen zur Halle (Glut, die große Glocke fern). Drehschablonen an der Wand, ein Kohlebecken, ein Kran.
function kammer(K, cfg) {
  cfg = cfg || {}; const fr = K.fr, sd = K.o.seed, vx = 240, vy = 150, P = B.persp(vx, vy); K.split = [160, 172];
  wand(K, { hor: 150, lichtX: 240 });
  // durch den mittleren Bogen: Glut der Halle, die große Glocke fern
  if (!cfg.dunkel) {
    B.feld(K.e[0], 196, 60, 284, vy, GLUT.slice(0, 7), (x, y) => 0.3 + (y - 60) / 200 + (B.fbm(x * 0.04, y * 0.04, sd, 2) - 0.5) * 0.3);
    glocke(K, 1, 240, 80, 54, 30, { tiefe: 0.35, mantel: 0.55, fuesse: true, glut: 0.9, haken: 20, dunkel: true });
    K.licht(240, 120, GLUT[5], 90, 0.7);
  }
  // Wand mit drei Bögen
  const wm = B.maske(); wm.rect(-M, 30, W + 2 * M, vy - 30 + 1);
  const boegen = [[110, 40], [240, 44], [370, 40]];
  for (const [bx, bw] of boegen) wm.fn(bx - bw, 50, bx + bw, vy + 1, (x, y) => y > 50 + bw - Math.sqrt(Math.max(0, bw * bw - (x - bx) ** 2)) * 0.85, 0);
  K.form(2, wm, 0.1, { k: ZIEGEL, r: RAND_B, ton: 2.6, fase: 1.5, rand: 2, schatten: 2, verlauf: -0.4, muster: ziegelMuster(sd + 7, 3) });
  // Nischen links und rechts: dunkler Grund, Lehmkerne auf Spindeln in zwei Reihen
  for (const [bx, bw] of [boegen[0], boegen[2]]) {
    B.feld(K.e[1], bx - bw, 50, bx + bw, vy, ZIEGEL.slice(0, 4), (x, y) => 0.2 + (y - 50) / 300);
    for (const [dx, s, eb] of [[-22, 0.8, 1], [0, 0.8, 1], [22, 0.8, 1], [-14, 1, 2], [14, 1, 2]]) kern(K, eb, bx + dx, vy - (eb === 1 ? 4 : 0), 13 * s, 26 * s, eb === 1 ? 0.25 : 0.12);
  }
  // Drehschablonen an der Wand zwischen den Bögen (Bretter mit Glockenprofil)
  for (const x of [168, 182]) schablone(K, 2, x, 52, 66, 0.08);
  // Kran mit einer fertigen Glocke (mit Füßen), links der Mitte vorn
  balken(K, 3, 336, vy + 30, 334, 20, 7, 0); balken(K, 3, 338, 24, 284, 30, 6, 0.02); balken(K, 3, 334, 70, 304, 28, 4, 0.03);
  glocke(K, 3, 292, 52, 40, 21, { tiefe: 0.02, haken: 16, fuesse: true, glut: 0.55, schwung: 1 });
  // Kohlebecken links: warme Glut
  if (!cfg.dunkel) { const [x, y] = P.q(-3.2, 0, 3.4), k = P.k(3.4); const m = B.maske(); m.poly([[x - k * 0.5, y - k * 0.5], [x + k * 0.5, y - k * 0.5], [x + k * 0.3, y - k * 0.2], [x - k * 0.3, y - k * 0.2]]); m.kap(x - k * 0.3, y - k * 0.2, x - k * 0.4, y, 0.8, 0.8); m.kap(x + k * 0.3, y - k * 0.2, x + k * 0.4, y, 0.8, 0.8);
    K.form(K.eb(y), m, 0, { k: BRONZE.slice(0, 6), r: RAND_B, ton: 2.4, fase: 1, rand: 2, schatten: 1 });
    for (let i = -6; i <= 6; i++) K.e[K.eb(y)].set(x + i * k * 0.07, y - k * 0.52 - (Math.abs(i) < 4 ? 1 : 0), B.pk(GLUT[i % 3 === 0 ? 7 : 5]));
    for (const L of [K.e[3], K.e[4], K.e[2]]) B.gluehen(L, x, y - k * 0.6, 70, GLUTG, 0.9); K.licht(x, y - k * 0.6, GLUT[6], 90, 0.8);
    B.partikel(K, { n: 14, farben: [FUNKE, FUNKE2], x0: x - 12, x1: x + 12, y0: y - 80, y1: y - k * 0.5, vy: -14, wob: 3, wf: 2, blink: 2, p: 0.5 }); }
  // Boden: Lehm, zwei Kerne halb fertig links und rechts im Mittelgrund
  boden(K, P, vy + 1, cfg.dunkel ? [] : [{ X0: 0, Z0: 12, X1: 0, Z1: 6, w: 0.1 }], cfg.dunkel ? [] : [{ X: 0, Z: 5.2, r: 0.7 }], { glanzX: 240 });
  for (const [X, Z] of [[-4.6, 3.1], [4.8, 3.4]]) { const [x, y] = P.q(X, 0, Z), k = P.k(Z); kern(K, K.eb(y), x, y, k * 0.75, k * 1.4, 0); }
  // Vordergrund: oben ein Balken, unten links eine Lehmwanne
  balken(K, 5, -M, 8, W + M, 2, 12, 0);
  { const v = B.maske(); v.poly([[-M, 236], [70, 240], [84, H + M], [-M, H + M]]); K.form(5, v, 0, { k: LEHM.slice(0, 5), r: RAND_B, ton: 2, fase: 2 }); }
  B.nebel(K.e[2], { y0: vy - 20, y1: vy + 8, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.24, xs: [-20, 500, 60], seed: 7 });
  luft(K);
  K.reihen = [{ y: 170, skala: 0.9, nebel: 0.3 }, { y: 193, skala: 1, nebel: 0.12 }, { y: 215, skala: 1, nebel: 0 }];
  return { mitte: [250, 208], P };
}
// Lehmkern (Bienenkorb) auf seiner Spindel
function kern(K, eb, cx, by, rx, hh, td) {
  const m = B.maske(); m.fn(cx - rx - 1, by - hh - 4, cx + rx + 1, by, (x, y) => { const q = (by - y) / hh; if (q < 0 || q > 1) return false; const w = rx * (0.34 + 0.66 * Math.pow(Math.sin(Math.min(1, (1 - q) * 1.25) * Math.PI / 2), 0.55)); return Math.abs(x - cx) <= w; });
  m.rect(cx - 0.5, by - hh - 4, 1.5, 5);
  K.form(eb, m, td, { k: MANTEL, r: RAND_H, ton: 2.6, fase: 1.2, rand: 2, schatten: 2, verlauf: 0.2, muster: (x, y) => { const q = (by - y) / hh; let t = (B.hash(x, y, 4) - 0.5) * 0.6; for (const l of [0.3, 0.55, 0.78]) if (Math.abs(q - l) * hh < 0.6) t -= 1.2; return t; } });
}
function schablone(K, eb, x, y, h, td) {
  const m = B.maske(); m.rect(x - 1, y, 2, h); m.fn(x, y, x + 14, y + h, (px, py) => { const q = (py - y) / h; return px - x <= 3 + breite(q) * 10 && px - x >= breite(q) * 10 - 1; });
  K.form(eb, m, td, { k: HOLZ, r: RAND_B, ton: 3, fase: 0, rand: 1, schatten: 1 });
}

// Wächter-Szene: Vor dem Ofen. Das breite Maul des großen Ofens hinter dem Wächter, gefüllt mit ruhiger Glut
// (die helle, ruhige Zone, vor der die Glocke als Silhouette steht). Oben der Galgen, seitlich kleine Glocken
// mit Füßen, am Boden die Grube, zu der alle Rinnen laufen. Übergang: die Glocke ist fort, im Kern eine Treppe.
function vorOfen(K, cfg) {
  cfg = cfg || {}; const fr = K.fr, sd = K.o.seed, vx = 240, vy = 168, P = B.persp(vx, vy); K.split = [178, 188];
  wand(K, { hor: 170, lichtX: 240 });
  // Ofen: breiter Block, das Maul mitten hinter dem Wächter
  const ow = 300, oh = 230;
  const m = B.maske(); m.rect(vx - ow / 2, vy - oh * 0.7, ow, oh * 0.7 + 2); m.ell(vx, vy - oh * 0.7, ow / 2, 40);
  K.form(1, m, 0.2, { k: ZIEGEL, r: RAND_B, ton: 3, fase: 2, rand: 2, schatten: 2, verlauf: -0.3, muster: ziegelMuster(sd + 2, 4) });
  const mw = cfg.leer ? 120 : 156, mh = cfg.leer ? 90 : 128, my = vy - 2;
  B.feld(K.e[1], vx - mw / 2, my - mh, vx + mw / 2, my, GLUT, (x, y) => { const u = (x - vx) / (mw / 2), v = (my - y) / mh; const ins = v < 0.6 ? Math.abs(u) <= 1 : (u * u + ((v - 0.6) / 0.4) ** 2) <= 1; if (!ins) return -1;
    const rand = Math.abs(u) > 0.9 || (v > 0.6 && u * u + ((v - 0.6) / 0.4) ** 2 > 0.82); return (rand ? 0.42 : 0.62) + 0.12 * (1 - Math.abs(u)) - v * 0.1 + (B.rausch2(x * 0.08, y * 0.05, sd + 7) - 0.5) * 0.06 - (cfg.leer ? 0.2 : 0); });
  // Laibung des Mauls: Keilsteine
  const lb = B.maske(); lb.fn(vx - mw / 2 - 10, my - mh - 10, vx + mw / 2 + 10, my, (x, y) => { const u = (x - vx) / (mw / 2), v = (my - y) / mh; const u2 = (x - vx) / (mw / 2 + 9), v2 = (my - y) / (mh + 9); const aus = v < 0.6 ? Math.abs(u) > 1 : (u * u + ((v - 0.6) / 0.4) ** 2) > 1; const in2 = v2 < 0.6 ? Math.abs(u2) <= 1 : (u2 * u2 + ((v2 - 0.6) / 0.4) ** 2) <= 1; return aus && in2; });
  K.form(2, lb, 0.08, { k: ZIEGEL, r: RAND_B, ton: 3.6, fase: 1.5, rand: 2, schatten: 2, muster: (x, y) => { const a = Math.atan2(my - mh * 0.4 - y, x - vx); return (Math.abs(Math.sin(a * 9)) < 0.12 ? -1.5 : 0) + (B.hash(Math.floor(a * 9 / Math.PI), 0, sd) - 0.5) * 0.6; } });
  for (const i of [1, 2, 3, 4]) B.gluehen(K.e[i], vx, my - mh * 0.4, 230, GLUTG, 0.85);
  K.licht(vx, my - mh * 0.45, GLUT[6], 220, 1);
  // Pfeiler links und rechts; oben der Galgenbalken mit Ständern
  for (const x of [72, 408]) { const p = B.maske(); p.rect(x - 22, -M, 44, vy + 24 + M); p.rect(x - 28, vy + 10, 56, 16); K.form(3, p, 0, { k: ZIEGEL, r: RAND_B, ton: 2.6, fase: 3, rand: 2, schatten: 2, verlauf: -0.5, muster: ziegelMuster(sd + x, 5) }); }
  balken(K, 3, 112, vy + 24, 122, 30, 12, 0); balken(K, 3, 368, vy + 24, 358, 30, 12, 0); balken(K, 3, 96, 36, 384, 36, 14, 0);
  // seitlich kleine Glocken mit Füßen (schwingen, wenn sie schlägt)
  glocke(K, 2, 30, 84, 38, 20, { tiefe: 0.1, haken: 30, fuesse: true, glut: 0.5 });
  glocke(K, 2, 450, 76, 44, 22, { tiefe: 0.1, haken: 26, fuesse: true, glut: 0.5, sprung: true });
  if (fr > 0.4) glocke(K, 4, 150, 64, 26, 14, { tiefe: 0, haken: 24, fuesse: true, glut: 0.5 });
  // Boden: die Grube in der Mitte, alle Rinnen laufen dorthin
  const rinnen = [{ X0: -6, Z0: 1.4, X1: -0.8, Z1: 3.9, w: 0.1 }, { X0: 6, Z0: 1.3, X1: 0.8, Z1: 3.9, w: 0.1 }, { X0: 0, Z0: 12, X1: 0, Z1: 4.8, w: 0.12 }];
  boden(K, P, vy + 1, cfg.leer ? rinnen.slice(0, 2) : rinnen, [{ X: 0, Z: 4.3, r: cfg.leer ? 2.6 : 1.9, leer: !!cfg.leer }], { glanzX: 240, rinnenHell: cfg.leer ? -0.2 : 0 });
  if (cfg.leer) {
    // Übergang: im Kern eine Wendeltreppe nach unten, von unten glüht es
    const [sx, sy] = P.q(0, 0, 4.3), k = P.k(4.3);
    for (let i = 0; i < 10; i++) { const a = i * 0.7, rw = k * 1.5 * (1 - i * 0.07), x = sx + Math.cos(a) * rw * 0.55, y = sy - 3 + i * 2.2 + Math.sin(a) * 2; const st = B.maske(); st.rect(x - 11 + i * 0.6, y - 4, 22 - i * 1.4, 2.6); K.form(4, st, 0, { k: LEHM, r: RAND_B, ton: 5 - i * 0.3, fase: 0, rand: 1 }); }
    B.partikel(K, { n: 30, farben: [FUNKE, FUNKE2], x0: sx - k, x1: sx + k, y0: sy - 70, y1: sy + 8, vy: -16, wob: 3, wf: 1.2, blink: 1.6, p: 0.5 });
  }
  // Vordergrund: Grubenrand vorn, angeschnitten
  { const v = B.maske(); v.poly([[-M, 246], [120, 252], [240, 254], [360, 252], [W + M, 246], [W + M, H + M], [-M, H + M]]); K.form(5, v, 0, { k: LEHM.slice(0, 5), r: RAND_B, ton: 2, fase: 2 }); }
  B.nebel(K.e[2], { y0: vy - 22, y1: vy + 6, col: B.mix(pal.nebel[1], K.fern, 0.35), dichte: 0.2, xs: [-20, 500, 60], seed: 11 });
  luft(K);
  K.reihen = [{ y: 186, skala: 0.9, nebel: 0.3 }, { y: 202, skala: 1, nebel: 0.12 }, { y: 218, skala: 1, nebel: 0 }];
  return { mitte: [240, 212], P };
}
// Luft: Funken und Ruß
function luft(K) {
  B.partikel(K, { n: 26, farben: [FUNKE2, GLUT[3], FUNKE], vx: 1, vy: -7, wob: 3, wf: 0.6, x0: 0, x1: 480, y0: 20, y1: 230, p: 0.8, blink: 0.9, hellSelten: 1.8 });
  B.partikel(K, { n: 30, farben: ['#1a1214', '#2a2026'], vx: -1, vy: 3, wob: 4, wf: 0.3, x0: 0, x1: 480, y0: 0, y1: 260, p: 1 });
}

// Krämer: der Wandergießer. Ein Haufen gesammelter Kessel, Leuchter und Löffel, daneben ein kleiner Tiegelofen.
function wandergiesser(K, x, y) {
  const m = B.maske();
  for (let i = 0; i < 9; i++) { const a = i * 1.7, r = 6 + (i % 3) * 3; m.ell(x - 30 + i * 6, y - 4 - (i % 2) * 5 - (i === 4 ? 8 : 0), r, r * 0.7); }
  m.kap(x - 20, y - 18, x - 22, y - 34, 1, 1); m.ell(x - 22, y - 35, 3, 1.4); m.kap(x - 8, y - 22, x - 6, y - 40, 1, 1); m.ell(x - 6, y - 41, 3, 1.4);
  K.form(4, m, 0, { k: BRONZE, r: RAND_B, ton: 3.4, fase: 1, rand: 2, schatten: 2, muster: (px, py) => (B.hash(px >> 1, py >> 1, 5) - 0.5) * 2 });
  const o = B.maske(); o.rect(x + 20, y - 22, 22, 22); o.ell(x + 31, y - 22, 11, 6); o.rect(x + 28, y - 44, 6, 20);
  K.form(4, o, 0, { k: ZIEGEL.slice(1), r: RAND_B, ton: 3, fase: 1, rand: 2, schatten: 2, muster: ziegelMuster(4, 2) });
  for (let i = 0; i < 8; i++) K.e[4].set(x + 27 + i, y - 8, B.pk(GLUT[i % 3 ? 5 : 7]));
  for (const L of [K.e[3], K.e[4]]) B.gluehen(L, x + 31, y - 8, 50, GLUTG, 0.9); K.licht(x + 31, y - 8, GLUT[6], 70, 0.8);
  B.partikel(K, { n: 10, farben: [FUNKE, FUNKE2], x0: x + 24, x1: x + 38, y0: y - 80, y1: y - 44, vy: -12, wob: 2, wf: 2, blink: 2, p: 0.5 });
}
// Fund und Ereignis: eine kleine zerschlagene Form, darin eine Handglocke, die kurz aufglüht
function form(K, x, y) {
  const m = B.maske(); m.ell(x - 8, y - 4, 9, 6); m.ell(x + 10, y - 3, 7, 4); m.poly([[x - 2, y - 2], [x + 4, y - 12], [x + 7, y - 2]]);
  K.form(4, m, 0, { k: MANTEL, r: RAND_H, ton: 2.6, fase: 1, rand: 2, schatten: 2 });
  glocke(K, 4, x + 2, y - 14, 10, 6, { tiefe: 0, haken: 3, glut: 0.9 });
  const sh = B.maske(); sh.ell(x, y + 1, 22, 2.5); B.form(K.e[4], sh, K.mat(0, { ton: 0, rand: 0, fase: 0 }));
  B.gluehen(K.e[4], x + 2, y - 8, 22, GLUTG, 0.9);
  K.anim.push({ p: 0.5, f(ctx, t, ox, oy) { if (Math.sin(t * 1.3) > 0.55) { ctx.fillStyle = FUNKE; ctx.fillRect(x + 2 + ox, y - 4 + oy, 1, 1); ctx.fillRect(x + 4 + ox, y - 9 + oy, 1, 1); } } });
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' || art === 'werkstatt' ? 2 : art === 'kraemer' ? 1 : art === 'ereignis' || art === 'fund' ? 0 : (o.seed + v) % 3;
  K.kulisse = art === 'waechter' ? 'waechter' : v; // M3: welche Kulisse die Szene zeigt (Schlüssel für die Fahrt, data/fahrt.json)
  let info;
  if (art === 'waechter') info = vorOfen(K, {});
  else if (art === 'uebergang') info = vorOfen(K, { leer: true });
  else if (art === 'rast') info = kammer(K, { dunkel: true });
  else info = [halle, stuhl, kammer][v](K, {});
  if (art === 'fund' || art === 'ereignis') form(K, info.mitte[0], info.mitte[1]);
  else if (art === 'kraemer') wandergiesser(K, info.mitte[0] + 10, info.mitte[1] - 2);
  else if (art !== 'uebergang') B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.glockengiesserei = { pal, build: bauen, reliefStil: { figuren: 4, gelenke: 3, knick: 0.5, stein: ['#2e1d16', '#40291e', '#563828', '#a87a52'] } };
if (World.BIOME.indexOf('glockengiesserei') < 0) World.BIOME.push('glockengiesserei');
})();
