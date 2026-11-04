// Saltmoor 1925 · Hintergründe: Akt III, Der Wald, der nach unten wächst (Biom-Paket wald).
// Komposition: docs/auftrag-2/biome/wald.md
// Ein versteinerter Urwald in einer Höhle: Die Wurzeln verflechten sich an der Decke, die Stämme hängen
// herab, so dick wie Häuser, und die Kronen liegen unten auf dem Boden oder hängen über der Tiefe.
// Eine Römerstraße führt durch den Wald und mitten durch einen Stamm. Licht kommt nur aus Harz:
// große Harztränen hängen in den Wurzeln, die größte oben rechts (Gegenlicht).
// Falsches Detail: Die Jahresringe zählen rückwärts. Die Vermesser der Legion haben sie numeriert,
// innen die höchste Zahl, nach außen immer weniger, und der äußerste Ring hat keine Zahl mehr.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#070706', '#100f0c', '#1c1a16', '#2c2923'], rand: ['#8e6a36', '#e6c48a'], augen: '#ffb436', nebel: ['#1c1913', '#4a4232'], fern: '#3e3930' };
const STEIN = ['#0b0a09', '#13120f', '#1c1a16', '#25231e', '#302d27', '#3c3831', '#4a453c', '#5a544a', '#6d665a', '#837b6d', '#9d9483'];
const HARZ = ['#241306', '#40230a', '#5e3410', '#7e4816', '#a4601c', '#ca7c24', '#ec9c32', '#ffc160', '#ffe3a4'];
const BASALT = ['#08090a', '#0e0f11', '#151618', '#1d1e21', '#26272a', '#303134', '#3c3c3e'];
const RINDE = ['#0a0908', '#12110e', '#1b1915', '#25221c', '#302c25', '#3c372e', '#4a4438'];
const SCHNITT = ['#1a140c', '#2a2014', '#3a2d1c', '#4c3b24', '#604b2e', '#78603a', '#927548'];
const RAND = ['#8e6a36', '#e6c48a'], RAND_K = ['#5e4a2e', '#a88c5e'];
const GLUT = '#3a2208', LICHT = '#ffb84a';

// ---------- Bausteine ----------
// Decke: dunkler Fels, nach rechts oben heller (dort hängt die große Harzträne), darin Wurzeln
function decke(K, yUnten, o) {
  o = o || {}; const sd = K.o.seed, fr = K.fr;
  B.feld(K.e[0], -M, -M, W + M, H + M, STEIN.slice(1, 8), (x, y) => {
    const lx = (x - (o.lx || 420)) / 260, ly = (y - (o.ly || 20)) / 200, l = Math.max(0, 1 - Math.hypot(lx, ly));
    return 0.08 + l * 0.55 + (B.fbm(x * 0.02, y * 0.03, sd + 5, 3) - 0.5) * 0.25 - y / H * 0.05 - fr * 0.06;
  });
  // Wurzeln: ein Geflecht entlang der Decke, wächst von den Stammansätzen aus seitwärts
  const r = B.rng(sd * 13 + 3), m = B.maske(), mf = B.maske();
  for (const [x, y, dick] of (o.ansaetze || [])) {
    for (let i = 0; i < 5; i++) { const a = (i % 2 ? Math.PI : 0) + r.j(0.5) + (i < 2 ? (i ? 0.25 : -0.25) : 0); B.baum(dick > 6 ? m : mf, r, x + r.j(dick), y, dick * r.f(5, 9), a, dick * r.f(0.3, 0.45), 2, { krumm: 0.35, spreiz: 0.5, kuerz: 0.6, verj: 0.6 }); }
  }
  // ferne Wurzeln als Netz in der Deckenfläche
  for (let i = 0; i < (o.netz || 14); i++) { const x = r.f(-20, W + 20), y = r.f(-10, yUnten * 0.6); B.baum(mf, r, x, y, r.f(30, 70), r.f(-0.4, 0.4) + (r() < 0.5 ? Math.PI : 0), r.f(1, 2.2), 2, { krumm: 0.4, spreiz: 0.6, kuerz: 0.6 }); }
  K.form(1, mf, 0.45, { k: RINDE, r: RAND_K, ton: 1.5, fase: 1, rand: 1, muster: (x, y) => (B.hash(x >> 1, y, 4) - 0.5) * 0.4 });
  K.form(2, m, 0.2, { k: RINDE, r: RAND, ton: 1.7, fase: 1.5, rand: 2, schatten: 2, muster: (x, y) => ((x * 3 + y) % 7 === 0 ? -0.5 : 0) });
}
// Hängender Stamm: oben breit (Wurzelansatz), nach unten schmaler; unten Krone oder Schnittfläche.
// eb Ebene, tiefe 0..1 (Luftperspektive), o: {krone: 'boden'|'luft'|'schnitt', boden (y), sd}
function stamm(K, eb, x, yT, yB, wT, wB, tiefe, o) {
  o = o || {}; const m = B.maske(), n = 30, L = [], R = [], ph = (o.ph || x * 0.013), C = {}, Wd = {};
  for (let i = 0; i <= n; i++) {
    const t = i / n, y = B.lerp(yT, yB, t), fl = Math.pow(1 - Math.min(1, t / 0.3), 2) * wT * 1.1; // Wurzelanlauf an der Decke
    const w = B.lerp(wT, wB, Math.pow(t, 0.7)) + fl, c = x + Math.sin(t * 2.6 + ph) * wB * 0.12;
    L.push([c - w / 2, y]); R.push([c + w / 2, y]); C[Math.round(y)] = c; Wd[Math.round(y)] = w;
  }
  m.poly(L.concat(R.reverse()));
  for (let y = Math.floor(yT); y <= yB + 1; y++) if (C[y] === undefined) { C[y] = C[y - 1] === undefined ? x : C[y - 1]; Wd[y] = Wd[y - 1] || wB; }
  // Rinde: senkrechte Leisten (versteinert, mit Fase), Querrisse, die rechte Seite fängt das Harzlicht
  const mus = (px, py) => { const c = C[py] === undefined ? x : C[py], w = Wd[py] || wB, f = (px - c) / w + 0.5; const lei = Math.sin(f * w * 0.55 + Math.sin(py * 0.04 + ph) * 1.4); return (lei > 0.55 ? 0.55 : lei < -0.7 ? -0.6 : 0) + f * 1.1 + (B.hash(px >> 2, py >> 3, 7) - 0.5) * 0.35 + ((py + (px >> 2)) % 23 === 0 ? -0.8 : 0); };
  K.form(eb, m, tiefe, { k: o.k || STEIN.slice(0, 8), r: tiefe > 0.5 ? RAND_K : RAND, ton: o.ton || 0.6, fase: 2, rand: tiefe > 0.5 ? 1 : 2, muster: mus, schatten: 2 });
  // Harz in den Rissen: kleine glimmende Punkte
  const r = B.rng(Math.round(x * 31 + yT * 7)), e = K.e[eb];
  for (let i = 0; i < (o.harz || 4); i++) { const y = r.f(yT + 20, yB - 10), c = C[Math.round(y)] || x, w = Wd[Math.round(y)] || wB, px = c + r.f(-0.3, 0.4) * w; if (!m.has(px, y)) continue;
    const col = B.mix(HARZ[r.i(4, 6)], K.fern, tiefe * 0.7); e.set(px, y, B.pk(col)); e.set(px, y + 1, B.pk(B.mix(HARZ[3], K.fern, tiefe * 0.7))); if (r() < 0.5) e.set(px, y + 2, B.pk(B.mix(HARZ[2], K.fern, tiefe))); B.gluehen(e, px, y, 6, B.mix(GLUT, '#000', tiefe), 0.7); }
  const unten = [C[Math.round(yB)] === undefined ? x : C[Math.round(yB)], yB];
  if (o.krone === 'schnitt') schnittUnten(K, eb, unten[0], yB, wB * 0.52, tiefe, o);
  else if (o.krone) krone(K, eb, unten[0], yB, wB, tiefe, o);
  return { m, unten };
}
// Krone unten: eine Kuppel aus versteinertem Laub, die nach unten hängt (wie die Krone eines Baums, nur
// umgekehrt), darin die Hauptäste. 'luft': hängt frei wie ein Leuchter, darunter hängen Zweige.
// 'boden': liegt auf dem Boden auf und breitet sich flach aus.
function blattwerk(K, eb, x, y, rx, ry, tiefe, o) {
  o = o || {}; const r = B.rng(Math.round(x * 13 + y * 7 + rx)), m = B.maske(), cl = [], bY = o.boden || 999;
  const n = Math.round(5 + rx * 0.3);
  for (let i = 0; i < n; i++) { const a = r.f(0, Math.PI), q = Math.sqrt(r()), cx = x + Math.cos(a) * rx * q * 0.9, cy = y + Math.sin(a) * ry * q * 0.85 + (o.flach ? 0 : ry * 0.05), cr = r.f(0.18, 0.32) * Math.max(rx, ry) * (1.1 - q * 0.4); cl.push([cx, cy, cr]); m.ell(cx, cy, cr * 1.1, cr * 0.9); }
  // obere Kante zum Stamm hin: der Ansatz
  m.ell(x, y, rx * 0.45, ry * 0.25);
  if (bY < 999) for (let yy = Math.max(m.y0, Math.floor(bY) + 1); yy <= m.y1; yy++) for (let xx = m.x0; xx <= m.x1; xx++) if (m.has(xx, yy)) m.put(xx, yy, 0);
  const mus = (px, py) => { let best = 1e9, c = null; for (const k of cl) { const d = Math.hypot(px - k[0], py - k[1]) / k[2]; if (d < best) { best = d; c = k; } } if (!c) return 0;
    const dx = (px - c[0]) / c[2], dy = (py - c[1]) / c[2]; return (dx * 0.6 - dy * 0.55) * 1.6 - best * 0.7 + (B.hash(px >> 1, py, 5) - 0.5) * 0.35 + ((px + py * 3) % 5 === 0 ? -0.3 : 0); };
  K.form(eb, m, tiefe, { k: STEIN.slice(0, 10), r: tiefe > 0.45 ? RAND_K : RAND, ton: 2.2, fase: 1, rand: tiefe > 0.45 ? 1 : 2, schatten: 2, muster: mus });
  // Bernsteinkrümel im Laub (wenige, glimmend)
  const e = K.e[eb]; for (let i = 0; i < Math.round(rx / 10); i++) { const k = cl[r.i(0, cl.length - 1)]; const px = k[0] + r.j(k[2] * 0.5), py = k[1] + r.j(k[2] * 0.5); if (m.has(px, py)) { e.set(px, py, B.pk(B.mix(HARZ[5], K.fern, tiefe))); B.gluehen(e, px, py, 4, B.mix(GLUT, '#000', tiefe), 0.6); } }
  return m;
}
function krone(K, eb, x, y, w, tiefe, o) {
  // Wie ein Baum, nur gespiegelt: der Stamm teilt sich in vier, fünf Hauptäste, die nach unten auseinanderlaufen,
  // an ihren Enden sitzen Laubballen aus Stein. Zwischen den Ballen sieht man die Äste (sonst liest es sich als Wolke).
  const r = B.rng(Math.round(x * 17 + y * 3)), lauf = o.krone === 'boden', bY = o.boden || 999, s = o.kroneS || 1;
  const L = w * (lauf ? 1.5 : 2.1) * s, n = lauf ? 5 : 5, am = B.maske(), ballen = [];
  for (let i = 0; i < n; i++) {
    const q = i / (n - 1) * 2 - 1, a = Math.PI / 2 - q * (lauf ? 1.15 : 0.82) + r.j(0.08), len = L * (1 - Math.abs(q) * 0.18) * r.f(0.85, 1.05);
    const mx = x + Math.cos(a) * len * 0.5 + q * w * 0.1, my = y + Math.sin(a) * len * 0.45, ex = x + Math.cos(a) * len, ey = Math.min(bY - 2, y + Math.sin(a) * len);
    am.pfad([[x + q * w * 0.22, y - 3], [mx, my], [ex, ey]], Math.max(1.4, w * 0.16), Math.max(0.8, w * 0.07));
    // Seitenäste
    const sa = a + (q < 0 ? 0.6 : -0.6) * (i % 2 ? 1 : -0.4);
    am.pfad([[mx, my], [mx + Math.cos(sa) * len * 0.35, Math.min(bY - 2, my + Math.sin(sa) * len * 0.35)]], Math.max(0.9, w * 0.07), 0.6);
    ballen.push([ex, ey, len * 0.42], [mx + Math.cos(sa) * len * 0.35, Math.min(bY - 2, my + Math.sin(sa) * len * 0.35), len * 0.3]);
    if (!lauf && i % 2 === 0) B.baum(am, r, ex, ey + len * 0.2, r.f(10, 22) * s, Math.PI / 2 + r.j(0.1), 0.7, 1, { krumm: 0.15, spreiz: 0.25, zug: Math.PI / 2, zugStaerke: 0.9 });
  }
  if (bY < 999) for (let yy = Math.max(am.y0, Math.floor(bY) + 1); yy <= am.y1; yy++) for (let xx = am.x0; xx <= am.x1; xx++) if (am.has(xx, yy)) am.put(xx, yy, 0);
  K.form(eb, am, tiefe, { k: RINDE, r: RAND_K, ton: 1.2, fase: 1, rand: 1, schatten: 1 });
  for (const [bx, by, br] of ballen) blattwerk(K, eb, bx, by - br * 0.2, br * 1.1, br * (lauf ? 0.55 : 0.8), tiefe, { boden: bY, flach: lauf });
}
// Schnittfläche von unten (ein von der Legion gekappter Stamm): Ellipse mit Ringen, Zahlen am Rand
function schnittUnten(K, eb, x, y, rx, tiefe, o) {
  const ry = Math.max(3, rx * (o.flach || 0.28)), e = K.e[eb], m = B.maske(); m.ell(x, y, rx, ry);
  const P = SCHNITT.map(c => B.pk(B.mix(c, K.fern, tiefe))), n = P.length - 1;
  for (let yy = Math.floor(y - ry); yy <= y + ry; yy++) for (let xx = Math.floor(x - rx); xx <= x + rx; xx++) {
    if (!m.has(xx, yy)) continue; const q = Math.hypot((xx + 0.5 - x) / rx, (yy + 0.5 - y) / ry);
    const ring = Math.floor(Math.pow(q, 0.8) * (o.ringe || 9)), t = 0.35 + (ring % 2) * 0.25 + (1 - q) * 0.2 + ((xx - x) / rx) * 0.15;
    const tt = B.clamp(t, 0, 0.999) * n, k = Math.floor(tt); e.set(xx, yy, P[Math.min(n, (tt - k) > B.bay(xx, yy) ? k + 1 : k)]);
  }
  // Rand der Rinde rundum, unten dunkel
  for (let a = 0; a < 6.283; a += 0.02) { const px = x + Math.cos(a) * rx, py = y + Math.sin(a) * ry; e.set(px, py, Math.sin(a) > 0.2 ? B.pk(B.mix(RINDE[1], K.fern, tiefe)) : B.pk(B.mix(RAND[0], K.fern, tiefe))); }
  if (o.harzKern) { e.set(x, y, B.pk(HARZ[6])); B.gluehen(e, x, y, 8, GLUT, 0.8); }
}
// Römische Zahl als Ritzung (3 × 4 Pixel je Zeichen), dunkle Kerbe mit heller Unterkante
function zahl(e, x, y, txt, dunkel, hell) {
  let cx = Math.round(x); y = Math.round(y);
  for (const ch of txt) {
    const pts = ch === 'I' ? [[0, 0], [0, 1], [0, 2], [0, 3]] : ch === 'V' ? [[0, 0], [0, 1], [1, 2], [1, 3], [2, 1], [2, 0]] : [[0, 0], [2, 0], [1, 1], [1, 2], [0, 3], [2, 3]];
    for (const [a, b] of pts) { e.set(cx + a, y + b, dunkel); if (b === 3) e.set(cx + a, y + 4, hell); }
    cx += ch === 'I' ? 2 : 4;
  }
  return cx;
}
const ROEM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
// Schnittfläche frontal (gefällter Stamm): Kreis mit Ringen; nach außen werden die Zahlen kleiner.
function schnittFront(K, eb, x, y, R, tiefe, o) {
  o = o || {}; const e = K.e[eb], n = o.ringe || 9, P = SCHNITT.map(c => B.pk(B.mix(c, K.fern, tiefe))), N = P.length - 1, sd = K.o.seed;
  const m = B.maske(); m.ell(x, y, R * (o.sx || 1), R);
  const kx = x - R * 0.06, ky = y + R * 0.04; // Mark leicht versetzt
  const rad = (xx, yy) => Math.hypot((xx + 0.5 - kx) / (o.sx || 1), yy + 0.5 - ky) / R * (1 + (B.fbm(Math.atan2(yy - ky, xx - kx) * 2, 0, sd + 3, 2) - 0.5) * 0.08);
  for (let yy = Math.floor(y - R - 1); yy <= y + R + 1; yy++) for (let xx = Math.floor(x - R * (o.sx || 1) - 1); xx <= x + R * (o.sx || 1) + 1; xx++) {
    if (!m.has(xx, yy)) continue; const q = rad(xx, yy), qr = q * n, f = qr - Math.floor(qr);
    let t = 0.42 + ((xx - x) / R) * 0.18 - ((yy - y) / R) * 0.1 + (B.hash(xx >> 1, yy >> 1, 5) - 0.5) * 0.12;
    if (f < 0.16) t -= 0.3; // Ringgrenze dunkel
    if (Math.abs(Math.atan2(yy - ky, xx - kx) - 2.2) < 0.03 && q > 0.1 && q < 0.95) t -= 0.35; // Trockenriss
    const tt = B.clamp(t, 0, 0.999) * N, k = Math.floor(tt); e.set(xx, yy, P[Math.min(N, (tt - k) > B.bay(xx, yy) ? k + 1 : k)]);
  }
  // Rinde als Ring: außen dunkel, oben rechts Randlicht
  for (let a = 0; a < 6.283; a += 0.01) { for (let d = 0; d < 3; d++) { const px = x + Math.cos(a) * (R - d) * (o.sx || 1), py = y + Math.sin(a) * (R - d); const f = Math.cos(a) * 0.75 - Math.sin(a) * 0.66; e.set(px, py, B.pk(B.mix(d === 0 && f > 0.4 ? RAND[1] : d < 2 && f > 0.2 ? RAND[0] : RINDE[d + 1], K.fern, tiefe))); } }
  // Die Zahlen der Vermesser: innen die höchste, nach außen abwärts, der äußerste Ring ohne Zahl
  const dk = B.pk(B.mix(RAND[1], K.fern, tiefe)), hl = B.pk(B.mix('#0c0906', K.fern, tiefe)), zN = Math.min(n - 1, o.zahlen || 7);
  for (let i = 0; i < zN; i++) { const q = (i + 0.55) / n, a = -0.5 + (o.zahlWinkel || 0); const px = kx + Math.cos(a) * q * R * (o.sx || 1), py = ky + Math.sin(a) * q * R; zahl(e, px - 1, py - 2, ROEM[zN - 1 - i], dk, hl); }
  // Der äußerste Ring: frisch, heller, noch ohne Zahl
  for (let a = 0; a < 6.283; a += 0.012) { const px = kx + Math.cos(a) * (R - 4.5) * (o.sx || 1), py = ky + Math.sin(a) * (R - 4.5); if (m.has(px, py) && B.bay(px, py) < 0.6) e.set(px, py, B.pk(B.mix(SCHNITT[6], K.fern, tiefe))); }
  // Mark: ein Harztropfen
  e.set(kx, ky, B.pk(HARZ[6])); e.set(kx + 1, ky, B.pk(HARZ[4])); B.gluehen(e, kx, ky, 10, GLUT, 0.8);
}
// Harzträne: hängt an den Wurzeln, leuchtet (Lichtquelle). s Größe
function traene(K, eb, x, y, s, o) {
  o = o || {}; const e = K.e[eb], fr = K.fr, m = B.maske(), L = 3 + s * 0.3;
  m.kap(x, y - 6 * s, x, y + 1 * s, 0.6 * s, 2.2 * s); m.ell(x, y + 2.4 * s, 3 * s, 3.6 * s);
  const P = HARZ.map(B.pk), n = P.length - 1;
  for (let yy = m.y0; yy <= m.y1; yy++) for (let xx = m.x0; xx <= m.x1; xx++) { if (!m.has(xx, yy)) continue; const q = Math.hypot((xx - x + 0.6 * s) / (3 * s), (yy - y - 3 * s) / (4 * s)); const t = 0.95 - q * 0.6 + (yy - y) / (8 * s) * 0.15; const tt = B.clamp(t, 0, 0.999) * n, k = Math.floor(tt); e.set(xx, yy, P[Math.min(n, (tt - k) > B.bay(xx, yy) ? k + 1 : k)]); }
  e.set(x - Math.round(s * 0.8), Math.round(y + 3.6 * s), P[8]);
  const st = (o.staerke || 1) * (0.8 + fr * 0.3);
  for (const i of (o.ebenen || [0, 1, 2, 3, 4])) if (i !== eb) B.gluehen(K.e[i], x, y + 2 * s, L * s * 4, GLUT, 0.75 * st);
  B.gluehen(e, x, y + 2 * s, L * s * 2, '#5a3410', 0.6 * st);
  K.licht(x, y + 2 * s, LICHT, 30 * s, 0.5 * st);
  // Tropfen, der sich löst (ruhig)
  if (o.tropft !== false) { const ph = (x * 7.1) % 6.28; K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { const z = (t * 0.25 + ph) % 1; if (z > 0.75) return; ctx.fillStyle = z < 0.5 ? '#ffc160' : '#ca7c24'; ctx.fillRect(Math.round(x - s * 0.6) + ox, Math.round(y + 6.5 * s + z * z * 120 * (o.fall || 1)) + oy, 1, z < 0.4 ? 1 : 2); } }); }
}
// Römerstraße: Basaltpflaster in Weltkoordinaten (Polygon-Steine), Randsteine, Wagenspuren
function strasse(P, sd, breite, o) {
  o = o || {}; const gr = 0.34;
  return (x, y) => {
    const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h - (o.kurve ? o.kurve(Z) : 0), k = P.k(Z);
    if (Math.abs(X) > breite + 0.16) return -1;
    if (Math.abs(X) > breite) return 0.42 + (Math.floor(Z / 0.6) % 2 ? 0.08 : 0) + (B.hash(Math.floor(Z / 0.6), X > 0 ? 1 : 0, sd) - 0.5) * 0.1; // Randsteine
    const cx = Math.floor(X / gr), cz = Math.floor(Z / gr); let d1 = 9, d2 = 9, id = 0;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const px = (cx + i + B.hash(cx + i, cz + j, sd)) * gr, pz = (cz + j + B.hash(cx + i, cz + j, sd + 1)) * gr; const d = Math.hypot(X - px, (Z - pz) * 0.9); if (d < d1) { d2 = d1; d1 = d; id = B.hash(cx + i, cz + j, sd + 2); } else if (d < d2) d2 = d; }
    const fuge = (d2 - d1) * k < 1.1;
    let t = 0.3 + id * 0.25 + Math.min(0.25, Z / 60) - (Math.abs(Math.abs(X) - breite * 0.45) < 0.08 ? 0.12 : 0);
    if (fuge) t = 0.08; else if (d1 < gr * 0.25) t += 0.08;
    return t;
  };
}
// Boden des Waldes: Steinlaub, Asche, Bernsteinkrümel
function waldboden(P, sd) {
  return (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h; return 0.26 + Math.min(0.3, Z / 50) + (B.fbm(X * 2.2, Z * 1.6, sd + 4, 3) - 0.5) * 0.5 + (B.hash(Math.floor(X * 14), Math.floor(Z * 20), sd) > 0.97 ? 0.2 : 0); };
}
// Römischer Bogen (Durchgang): Laibung aus Keilsteinen um eine Öffnung in einer Fläche
function bogen(K, eb, x, yB, w, h, tiefe, o) {
  o = o || {}; const rr = w / 2, cy = yB - h + rr, e = K.e[eb];
  // Öffnung: dunkel, hinten ein Schimmer (das Harzlicht auf der anderen Seite)
  const off = B.maske(); off.rect(x - rr, cy, w, yB - cy); off.ell(x, cy, rr, rr);
  B.feld(e, x - rr - 1, cy - rr - 1, x + rr + 1, yB + 1, ['#030302', '#0a0805', '#1a1208', '#3a2408', '#6a400e'], (px, py) => off.has(px, py) ? (o.schimmer === false ? 0.05 : Math.max(0, 0.75 - Math.hypot((px - x) / (rr * 0.5), (py - yB + h * 0.25) / (h * 0.32)) * 0.75)) : -1);
  // Keilsteine
  const ks = B.maske(), n = o.steine || 13, d = Math.max(3, w * 0.13);
  for (let i = 0; i < n; i++) { const a0 = Math.PI + i / n * Math.PI, a1 = Math.PI + (i + 1) / n * Math.PI, g = 0.012; ks.poly([[x + Math.cos(a0 + g) * rr, cy + Math.sin(a0 + g) * rr], [x + Math.cos(a0 + g) * (rr + d), cy + Math.sin(a0 + g) * (rr + d)], [x + Math.cos(a1 - g) * (rr + d), cy + Math.sin(a1 - g) * (rr + d)], [x + Math.cos(a1 - g) * rr, cy + Math.sin(a1 - g) * rr]]); }
  // Gewände (senkrechte Quader)
  for (let yy = cy; yy < yB - 1; yy += d * 0.9) { ks.rect(x - rr - d, yy + 0.5, d, d * 0.9 - 1); ks.rect(x + rr, yy + 0.5, d, d * 0.9 - 1); }
  K.form(eb, ks, tiefe, { k: BASALT.concat(['#46463f']), r: RAND, ton: 2.2, fase: 1, rand: 2, schatten: 2, muster: (px, py) => (B.hash(px >> 1, py >> 1, 3) - 0.5) * 0.5 });
  return { cy, rr, d };
}
// Meilenstein: Säule mit Inschriftfeld (Ritzlinien), daneben eine Öllampe der Legion (erlischt mit fremdheit)
function meilenstein(K, eb, x, yB, s, tiefe) {
  const m = B.maske(); m.rect(x - 4 * s, yB - 22 * s, 8 * s, 22 * s); m.ell(x, yB - 22 * s, 4 * s, 1.6 * s); m.rect(x - 5 * s, yB - 3 * s, 10 * s, 3 * s);
  K.form(eb, m, tiefe, { k: STEIN.slice(2, 9), r: RAND, ton: 1.4, fase: 1, schatten: 2, muster: (px, py) => ((py - yB) % 4 === 0 && Math.abs(px - x) < 3 * s && py < yB - 8 * s && py > yB - 19 * s ? -0.9 : 0) });
  const e = K.e[eb], dk = B.pk('#0c0a08'), hl = B.pk(STEIN[7]);
  // „M P“ und eine Zahl, die heruntergezählt wurde (durchgestrichen, darunter eine kleinere)
  zahl(e, x - 3 * s, yB - 18 * s, 'XII', dk, hl); for (let i = -3; i < 4; i++) e.set(x + i * s, yB - 16 * s, dk); zahl(e, x - 2 * s, yB - 11 * s, 'XI', dk, hl);
  if (K.fr < 0.7) { B.flamme(K, Math.round(x + 7 * s), Math.round(yB - 2), { p: B.PAR[eb], kern: '#fff4d0', mitte: '#ffb040', aussen: '#a04a10', glut: '#3a2208' }); const l = B.maske(); l.ell(x + 7 * s, yB - 1, 3, 1.4); K.form(eb, l, 0, { k: HARZ.slice(0, 4), ton: 1.5, fase: 0, rand: 1 }); K.glut(x + 7 * s, yB - 4, 30, GLUT, 0.8, [eb]); }
}

// Warmes Band hinter den Gegnern: der Harzschein in der Luft, damit die dunklen Figuren stehen (unter einem Drittel)
function band(K, y0, y1, d) { B.nebel(K.e[2], { y0, y1, col: '#4a3c28', dichte: d || 0.4, xs: [-20, 500, 60], seed: 12 }); B.nebel(K.e[2], { y0: y0 + 8, y1: y1 - 4, col: '#6a5232', dichte: (d || 0.4) * 0.45, xs: [40, 440, 80], seed: 13 }); }

// =====================================================================
// Variante 0: Die Legionsstraße. Die Straße läuft auf den großen Stamm zu, durch dessen Fuß ein Bogen führt.
// Grundform: Portal (Zentralperspektive auf eine Öffnung in einer riesigen Senkrechten).
function strassenzug(K, cfg) {
  const sd = K.o.seed, fr = K.fr, vx = cfg.vx || 330, vy = cfg.vy || 140, P = B.persp(vx, vy); K.split = [166, 178];
  decke(K, 110, { lx: 430, ly: 10, ansaetze: [[60, -4, 9], [150, -6, 6], [300, -8, 14], [400, -4, 7], [470, 0, 8]], netz: 16 });
  // Ferne: Reihen hängender Stämme im Dunst, hinter dem großen Stamm
  const r = B.rng(sd * 7 + 1);
  for (let i = 0; i < 10; i++) { const x = -10 + i * 52 + r.j(14), w = r.f(10, 18), luft = i % 2 === 1; stamm(K, 1, x, -M, luft ? r.f(50, 80) : vy - 4, w * 1.6, w, 0.62, { krone: luft ? 'luft' : 'boden', boden: vy + 2, harz: 2, kroneS: 0.9 }); }
  B.nebel(K.e[1], { y0: vy - 50, y1: vy + 12, col: B.mix(pal.nebel[1], K.fern, 0.5), dichte: 0.35, seed: 3 });
  // Der Durchgangsbaum: so breit wie ein Haus, hängt bis auf den Boden; die Straße führt durch seinen Fuß
  const bx = vx + 8, bw = 104;
  const d = stamm(K, 2, bx, -M, vy + 6, bw * 1.25, bw, 0.25, { harz: 9, ph: 1.2 });
  bogen(K, 2, vx, vy + 5, 40, 52, 0.25, { steine: 13 });
  // Harz rinnt am großen Stamm aus einer Kerbe der Legion (Licht auf der Rinde)
  traene(K, 2, bx + 38, 52, 2.2, { ebenen: [1, 2], staerke: 0.7 });
  // Mittelgrund: zwei Stämme links, einer rechts, mit Kronen auf dem Boden
  stamm(K, 3, 56, -M, 166, 70, 44, 0.05, { krone: 'boden', boden: 172, harz: 5 });
  stamm(K, 3, 168, -M, 62, 50, 30, 0.1, { krone: 'schnitt', flach: 0.32, ringe: 7, harzKern: true }); // gekappt, hängt frei: Schnittfläche von unten
  stamm(K, 3, 452, -M, 92, 60, 38, 0.05, { krone: 'luft', harz: 5, haenge: 9 });
  // Boden: Waldboden, darin die Straße zum Bogen
  const sb = strasse(P, sd, 0.95), wb = waldboden(P, sd);
  K.bodenStoffe(vy + 1, H + M, [{ cols: BASALT, tf: sb }, { cols: STEIN.slice(0, 7), tf: wb }], (x, y) => sb(x, y) >= 0 ? 0 : 1);
  // die große Harzträne oben rechts (Gegenlicht), dazu kleinere
  traene(K, 1, 420, 18, 4.2, { staerke: 1.2, fall: 1.4 });
  traene(K, 2, 236, 30, 1.6, { staerke: 0.5 }); traene(K, 3, 120, 46, 2, { staerke: 0.6 });
  for (const L of [K.e[1], K.e[2], K.e[3]]) B.kegel(L, 420, 30, Math.PI * 0.72, 0.18, 300, '#2a1c0c', 0.45);
  band(K, 112, 168, 0.42);
  meilenstein(K, 3, vx - 58, 178, 1.9, 0);
  // Vordergrund: ein Wurzelstrang links oben angeschnitten, Kronenzweige unten rechts
  const v = B.maske(); v.pfad([[-M, 24], [30, 34], [52, 60], [58, 96]], 9, 3); v.pfad([[30, 34], [14, 70], [18, 104]], 3, 1.2);
  const r2 = B.rng(sd + 77); for (let i = 0; i < 4; i++) B.baum(v, r2, 474 + i * 3, 272, 50 + i * 8, -Math.PI / 2 - 0.4 - i * 0.18, 2.4, 3, { krumm: 0.25, spreiz: 0.5 });
  K.form(5, v, 0, { k: RINDE, r: RAND, ton: 0.8, fase: 2, muster: (x, y) => ((x + y * 2) % 9 === 0 ? -0.6 : 0) });
  B.partikel(K, { n: 40, farben: ['#5a4a32', '#8e6a36', '#ca7c24'], vy: 6, vx: -1, wob: 2, wf: 0.5, x0: 0, x1: 480, y0: 0, y1: 230, p: 0.8, hellSelten: 2.4 });
  K.reihen = [{ y: 168, skala: 0.9, nebel: 0.3 }, { y: 191, skala: 1, nebel: 0.12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [250, 212] };
}

// Variante 1: Der gefällte Stamm. Ein Stamm liegt quer durchs Bild, links vorn die Schnittfläche
// mit den numerierten Ringen. Darüber hängt der Stumpf, von dem er stammt. Grundform: Diagonale.
function gefaellt(K) {
  const sd = K.o.seed, fr = K.fr, vx = 360, vy = 150, P = B.persp(vx, vy); K.split = [160, 172];
  decke(K, 120, { lx: 440, ly: 0, ansaetze: [[40, -6, 8], [200, -6, 9], [330, -4, 6], [440, -6, 10]], netz: 12 });
  const r = B.rng(sd * 11 + 4);
  for (let i = 0; i < 8; i++) { const x = 150 + i * 46 + r.j(12), w = r.f(8, 14), luft = i % 2 === 0; stamm(K, 1, x, -M, luft ? r.f(50, 84) : vy - 4, w * 1.5, w, 0.65, { krone: luft ? 'luft' : 'boden', boden: vy + 2, harz: 2, kroneS: 0.9 }); }
  B.nebel(K.e[1], { y0: vy - 40, y1: vy + 10, col: B.mix(pal.nebel[1], K.fern, 0.5), dichte: 0.32, seed: 5 });
  // Ferne: der Durchgangsbaum klein am Fluchtpunkt
  stamm(K, 1, vx + 30, -M, vy + 3, 44, 34, 0.55, { harz: 3 }); bogen(K, 1, vx + 26, vy + 3, 8, 11, 0.55, { steine: 7 });
  // Der Stumpf, von dem der liegende Stamm kommt: hängt über der Mitte, unten gekappt
  stamm(K, 2, 236, -M, 74, 92, 64, 0.18, { krone: 'schnitt', flach: 0.3, ringe: 9, harzKern: true, harz: 6 });
  // Boden zuerst (der Stamm liegt darauf)
  const wb = waldboden(P, sd); K.boden(vy + 1, H + M, STEIN.slice(0, 7), wb);
  for (let i = 0; i < 6; i++) { const x = 150 + i * 58 + r.j(16); blattwerk(K, 4, x, 214 + r.j(8), r.f(8, 14), r.f(3, 5), 0, { flach: true }); }
  // Der liegende Stamm: von links vorn (Schnittfläche) nach rechts hinten
  const e3 = K.e[3], m = B.maske(), x0 = 72, y0 = 150, R0 = 54, x1 = 520, y1 = 128, R1 = 22;
  const L = [], Rr = [];
  for (let i = 0; i <= 30; i++) { const t = i / 30, x = B.lerp(x0, x1, t), yc = B.lerp(y0, y1, t), rr = B.lerp(R0, R1, t); L.push([x, yc - rr]); Rr.push([x, yc + rr * 0.92]); }
  m.poly(L.concat(Rr.reverse()));
  K.form(3, m, 0.06, { k: STEIN.slice(0, 9), r: RAND, ton: 2.2, fase: 2, rand: 2, schatten: 2, muster: (px, py) => { const t = (px - x0) / (x1 - x0), yc = B.lerp(y0, y1, t), rr = B.lerp(R0, R1, t), f = (py - yc) / rr; const lei = Math.sin(f * 9 + Math.sin(px * 0.045 + f * 2) * 1.2); return (lei > 0.55 ? 0.8 : lei < -0.6 ? -0.9 : 0) - f * 1.6 - Math.max(0, f) * 1.2 + (B.hash(px >> 3, py >> 1, 4) - 0.5) * 0.4 + ((px * 7 + (py >> 1) * 13) % 97 === 0 ? -1.2 : 0); } });
  // Kerben der Legion im Stamm (Keile), ein Keil steckt noch, eine Dolabra lehnt daran
  for (let i = 0; i < 4; i++) { const x = 170 + i * 58, t = (x - x0) / (x1 - x0), yc = B.lerp(y0, y1, t) - B.lerp(R0, R1, t) * 0.7; const k = B.maske(); k.poly([[x - 6, yc - 3], [x + 5, yc - 4], [x, yc + 8]]); B.form(e3, k, K.mat(0, { k: ['#050403', '#0c0a07', '#3a2a14', '#7e5a22'], ton: 0.6, fase: 1, rand: 0 })); e3.set(x, yc + 6, B.pk(HARZ[5])); }
  const dol = B.maske(); dol.kap(312, 182, 296, 124, 1, 1); dol.poly([[290, 122], [304, 118], [306, 122], [292, 126]]); dol.kap(298, 121, 288, 128, 1.4, 0.6); K.form(4, dol, 0, { k: RINDE, r: RAND, ton: 1.4, fase: 0, rand: 1 });
  band(K, 120, 176, 0.4);
  // Schnittfläche vorne links: die Ringe mit den Zahlen der Vermesser
  schnittFront(K, 3, x0, y0, R0 - 1, 0, { sx: 0.62, ringe: 8, zahlen: 7, zahlWinkel: -1.0 });
  // Kronen vom liegenden Stamm: rechts hinten liegen sie über dem Boden ausgebreitet
  krone(K, 2, 476, 138, 30, 0.3, { krone: 'boden', boden: 152 });
  traene(K, 1, 440, 14, 3.8, { staerke: 1.2 }); traene(K, 2, 300, 30, 1.8, { staerke: 0.5 }); traene(K, 2, 196, 40, 1.4, { staerke: 0.4 });
  for (const L2 of [K.e[1], K.e[2], K.e[3]]) B.kegel(L2, 440, 26, Math.PI * 0.7, 0.2, 320, '#2a1c0c', 0.45);
  // Vordergrund: hängende Zweige rechts oben, Stein links unten
  const v = B.maske(); const r2 = B.rng(sd + 9); for (let i = 0; i < 5; i++) B.baum(v, r2, 440 + i * 9, -M, 60 + i * 10, Math.PI / 2 + 0.2 - i * 0.05, 2.6, 3, { krumm: 0.25, spreiz: 0.5, zug: Math.PI / 2, zugStaerke: 0.4 });
  v.poly([[-M, 250], [40, 244], [70, 256], [80, 282], [-M, 282]]);
  K.form(5, v, 0, { k: RINDE, r: RAND, ton: 0.8, fase: 2 });
  B.partikel(K, { n: 34, farben: ['#5a4a32', '#8e6a36', '#ca7c24'], vy: 5, wob: 2, wf: 0.4, x0: 0, x1: 480, y0: 0, y1: 230, p: 0.8, hellSelten: 2.4 });
  K.reihen = [{ y: 176, skala: 0.9, nebel: 0.22 }, { y: 196, skala: 1, nebel: 0.1 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [250, 214] };
}

// Variante 2: Über der Tiefe. Der Boden endet an einer Kante. Dahinter hängen die Stämme frei in einen Abgrund,
// ihre Kronen schweben darin wie Leuchter, weiter unten wächst der Wald weiter. Eine Hängebrücke der Legion
// führt hinüber zum Durchgangsbaum. Grundform: Weite (Leere in der Mitte, Reihe der Leuchter).
function abgrund(K) {
  const sd = K.o.seed, fr = K.fr, kante = x => 160 + Math.sin(x * 0.018 + sd) * 3 + (x > 400 ? (x - 400) * 0.12 : 0); K.split = [158, 170];
  decke(K, 60, { lx: 410, ly: -10, ansaetze: [[30, -6, 7], [120, -4, 5], [250, -6, 6], [380, -4, 8]], netz: 10 });
  // die Tiefe: unter den Kronen noch Kronen, kleiner, dann nur noch ein Schimmer aus Harz
  B.feld(K.e[0], -M, 100, W + M, H + M, ['#070605', '#0c0a07', '#15100a', '#22180c', '#34230e', '#4a3210'], (x, y) => y < 100 ? -1 : 0.1 + Math.max(0, (y - 150) / 110) * 0.5 * (0.7 + fr * 0.5) + (B.fbm(x * 0.03, y * 0.05, sd, 2) - 0.5) * 0.2);
  const r = B.rng(sd * 5 + 2);
  for (let i = 0; i < 12; i++) { const x = r.f(-10, W + 10), y = r.f(170, 230); blattwerk(K, 0, x, y, r.f(8, 14), r.f(6, 10), 0.85, {}); }
  // Reihe der hängenden Stämme hinten, Kronen frei schwebend, nach rechts kleiner (Flucht)
  for (let i = 0; i < 8; i++) { const t = i / 7, x = 30 + t * 420 + r.j(8), d = 0.62 - t * 0.12, w = 16 - t * 6; stamm(K, 1, x, -M, 70 + r.f(0, 40) - t * 10, w * 1.5, w, d, { krone: 'luft', harz: 2, kroneS: 0.9, haenge: 4 }); }
  for (let i = 0; i < 3; i++) { const x = 90 + i * 140 + r.j(20), w = 26 + r.f(0, 8); stamm(K, 2, x, -M, 96 + r.f(0, 24), w * 1.5, w, 0.32, { krone: 'luft', harz: 3, haenge: 7 }); }
  // Hängebrücke: zwei Seile im Durchhang, Bretter dazwischen, von links vorn zum Durchgangsbaum rechts
  const br = B.maske(), x0 = -M, x1 = 392, ya = 178, yb = 140, sag = 14;
  const yS = t => B.lerp(ya, yb, t) + Math.sin(t * Math.PI) * sag;
  for (let t = 0; t <= 1; t += 0.003) { const x = B.lerp(x0, x1, t), y = yS(t), hh = B.lerp(12, 5, t); br.rect(x, y - hh, 1, 1); br.rect(x, y, 1, t < 0.5 ? 3 : 2); }
  for (let t = 0.01; t < 1; t += 0.035) { const x = B.lerp(x0, x1, t), y = yS(t), hh = B.lerp(12, 5, t); br.rect(x, y - hh, 1, hh); }
  for (let i = 0; i < 6; i++) { const t = 0.12 + i * 0.15, x = B.lerp(x0, x1, t), y = yS(t) - 9; br.kap(x, y, x + 6, -M, 0.6, 0.6); } // Halteseile zu den Wurzeln
  K.form(2, br, 0.28, { k: RINDE, r: RAND_K, ton: 1.5, fase: 0, rand: 1 });
  // Durchgangsbaum drüben rechts: die Brücke endet in seinem Bogen
  stamm(K, 2, 424, -M, 150, 92, 70, 0.28, { harz: 6, ph: 0.4 }); bogen(K, 2, 396, 140, 16, 22, 0.28, { steine: 9 });
  // Vorne: der Absatz aus versteinertem Laub einer liegenden Krone, auf dem wir stehen
  const fm = B.maske(); fm.fn(-M, 140, W + M, H + M, (x, y) => y > kante(x));
  K.form(3, fm, 0, { k: STEIN.slice(0, 8), r: RAND, ton: 0.8, fase: 2, rand: 2, muster: (x, y) => { const s2 = Math.sin(x * 0.12 + Math.sin(y * 0.2) * 2 + y * 0.05); return (s2 > 0.7 ? 0.45 : s2 < -0.75 ? -0.5 : 0) + (B.fbm(x * 0.05, y * 0.08, sd + 2, 2) - 0.5) * 0.5 - (y - 160) / 200; } });
  for (let i = 0; i < 7; i++) { const x = 30 + i * 70 + r.j(10); blattwerk(K, 3, x, kante(x) - 1, r.f(12, 22), r.f(5, 8), 0, { flach: true }); }
  // die Straße der Legion auf dem Absatz: kommt von vorn rechts und biegt zum Brückenkopf links
  const P2 = B.persp(60, 150), sb2 = strasse(P2, sd, 0.7, { kurve: Z => -2.4 + Math.min(2.4, Z * 0.0) + (Z < 4 ? (4 - Z) * 1.1 : 0) });
  K.bodenStoffe(166, H + M, [{ cols: BASALT, tf: sb2 }], (x, y) => (y > kante(x) + 4 && sb2(x, y) >= 0 ? 0 : -1));
  band(K, 128, 178, 0.32);
  // Gekappter Stamm über der Kante: Schnittfläche von unten mit Ringen
  stamm(K, 3, 250, -M, 50, 62, 42, 0.08, { krone: 'schnitt', flach: 0.32, ringe: 8, harzKern: true });
  traene(K, 1, 410, 10, 4, { staerke: 1.2, fall: 2 }); traene(K, 2, 150, 32, 1.8, { staerke: 0.5, fall: 2 });
  for (const L of [K.e[1], K.e[2]]) B.kegel(L, 410, 20, Math.PI * 0.7, 0.2, 340, '#2a1c0c', 0.4);
  // Pflock und Seil der Brücke vorn links (Maßstab)
  const pf = B.maske(); pf.kap(22, 188, 26, 156, 2.2, 1.6); pf.kap(26, 160, 40, 150, 0.6, 0.6); K.form(4, pf, 0, { k: RINDE, r: RAND, ton: 1.6, fase: 1 });
  const v = B.maske(); v.pfad([[W + M, 40], [446, 60], [430, 110], [440, 140]], 8, 3); v.poly([[300, 282], [360, 254], [420, 262], [470, 252], [W + M, 260], [W + M, 282]]);
  K.form(5, v, 0, { k: RINDE, r: RAND, ton: 0.8, fase: 2 });
  B.partikel(K, { n: 46, farben: ['#5a4a32', '#8e6a36', '#ca7c24'], vy: 9, wob: 2, wf: 0.4, x0: 0, x1: 480, y0: 0, y1: 270, p: 0.7, hellSelten: 2.2 });
  K.reihen = [{ y: 180, skala: 0.9, nebel: 0.22 }, { y: 198, skala: 1, nebel: 0.1 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [230, 214] };
}

// Wächter: Im Wurzelgewölbe. Untersicht; die Decke kommt nah, die Wurzeln bilden ein Gewölbe, gekappte
// Stümpfe zeigen ihre Ringe von unten. In der Mitte ein Knoten aus Wurzeln: dort hängt der Wurzelstock.
// Übergang: unter dem Knoten öffnet sich der Boden, eine Treppe der Legion führt in einen hohlen Stamm hinab.
function gewoelbe(K, cfg) {
  const sd = K.o.seed, fr = K.fr, vy = cfg.treppe ? 176 : 196, P = B.persp(240, vy); K.split = [vy + 6, vy + 14];
  decke(K, 150, { lx: 400, ly: 30, ansaetze: [[30, 20, 10], [130, 10, 12], [240, 24, 16], [350, 10, 12], [450, 20, 10]], netz: 22 });
  // Gewölberippen: dicke Wurzeln laufen bogenförmig zum Knoten in der Mitte oben
  const rp = B.maske(), kx = 240, ky = 18;
  for (let i = 0; i < 9; i++) { const a = Math.PI * (0.08 + i * 0.105), x0 = kx + Math.cos(a + Math.PI) * 300, y0 = vy - 30 + Math.sin(a) * 10; const mx = (x0 + kx) / 2, my = Math.min(y0, ky) - 10 + Math.abs(x0 - kx) * 0.05; rp.pfad([[x0, y0], [B.lerp(x0, mx, 0.6), B.lerp(y0, my, 0.9)], [mx, my], [kx + (x0 - kx) * 0.1, ky + 8]], 9 - Math.abs(i - 4) * 0.6, 4); }
  rp.ell(kx, ky, 34, 22);
  K.form(2, rp, 0.12, { k: RINDE, r: RAND, ton: 1.2, fase: 2, rand: 2, schatten: 2, muster: (x, y) => { const s = Math.sin(x * 0.3 + y * 0.18); return (s > 0.6 ? 0.4 : s < -0.6 ? -0.4 : 0) + (B.hash(x >> 2, y >> 1, 6) - 0.5) * 0.3; } });
  // Stümpfe von unten: drei gekappte Stämme mit ihren Ringen
  stamm(K, 1, 70, -M, 60, 60, 44, 0.35, { krone: 'schnitt', flach: 0.36, ringe: 8, harzKern: true });
  stamm(K, 1, 410, -M, 70, 64, 46, 0.35, { krone: 'schnitt', flach: 0.36, ringe: 9, harzKern: true });
  // Hängende Kronen an den Seiten, bis fast auf den Boden
  stamm(K, 3, 18, -M, 150, 54, 34, 0, { krone: 'luft', aeste: 7, harz: 5 }); stamm(K, 3, 468, -M, 140, 54, 34, 0, { krone: 'luft', aeste: 7, harz: 5 });
  traene(K, 1, 388, 92, 3.4, { staerke: 1.2 }); traene(K, 1, 120, 100, 2.4, { staerke: 0.8 }); traene(K, 2, 300, 60, 1.6, { staerke: 0.5 });
  for (const L of [K.e[1], K.e[2], K.e[3]]) B.kegel(L, 388, 100, Math.PI * 0.75, 0.25, 220, '#2a1c0c', 0.45);
  // Boden: Straße endet hier, der Rest ist Kronenschutt
  const sb = strasse(P, sd, 0.8), wb = waldboden(P, sd);
  K.boden(vy + 1, H + M, STEIN.slice(0, 7), wb); void sb;
  if (cfg.treppe) {
    // Loch im Boden: ein hohler Stamm, innen eine Wendeltreppe, deren Stufen numeriert sind und abwärts zählen
    const e = K.e[4], lx = 240, ly = 226, rx = 92, ry = 26, lm = B.maske(); lm.ell(lx, ly, rx, ry);
    for (let yy = ly - ry; yy <= ly + ry; yy++) for (let xx = lx - rx; xx <= lx + rx; xx++) if (lm.has(xx, yy)) e.set(xx, yy, B.pk('#030201'));
    for (let i = 0; i < 9; i++) { const a = 3.6 + i * 0.42, rr = 1 - i * 0.075, x = lx + Math.cos(a) * rx * 0.86 * rr, y = ly + Math.sin(a) * ry * 0.7 * rr + i * 2.2; const st = B.maske(); st.poly([[x - 10 * rr, y], [x + 10 * rr, y - 2], [x + 8 * rr, y + 3], [x - 9 * rr, y + 4]]); B.form(e, st, K.mat(Math.min(0.85, i * 0.1), { k: STEIN.slice(1, 7), ton: 1.4, fase: 1, rand: 1 })); if (i < 6) zahl(e, x - 2, y - 1, ROEM[8 - i], B.pk('#0a0806'), B.pk(STEIN[6])); }
    const rd = B.maske(); rd.ell(lx, ly, rx + 5, ry + 3); rd.ell(lx, ly, rx, ry, 0); K.form(4, rd, 0, { k: STEIN.slice(1, 8), r: RAND, ton: 1.6, fase: 1, rand: 2 });
    B.gluehen(e, lx, ly + 20, 60, GLUT, 0.6);
  }
  band(K, vy - 50, vy + 6, 0.4);
  const v = B.maske(); v.pfad([[-M, 130], [10, 160], [6, 220], [-M, 250]], 10, 6); v.pfad([[W + M, 120], [470, 170], [476, 240]], 9, 5);
  K.form(5, v, 0, { k: RINDE, r: RAND, ton: 0.8, fase: 2 });
  B.partikel(K, { n: 40, farben: ['#5a4a32', '#8e6a36', '#ca7c24'], vy: 7, wob: 2, wf: 0.4, x0: 40, x1: 440, y0: 30, y1: vy, p: 0.6, hellSelten: 2 });
  K.reihen = cfg.treppe ? [{ y: 184, skala: 0.9, nebel: 0.22 }, { y: 194, skala: 1, nebel: 0.1 }, { y: 204, skala: 1, nebel: 0 }] : [{ y: 194, skala: 0.9, nebel: 0.22 }, { y: 207, skala: 1, nebel: 0.1 }, { y: 219, skala: 1, nebel: 0 }];
  return { mitte: [250, 216] };
}

// Köhler: ein Meiler aus Steinholz, der nicht brennen will; daneben der Köhler-Stand
function meiler(K, x, y, glimmt) {
  const m = B.maske(); m.ell(x, y - 2, 34, 22); m.rect(x - 34, y - 2, 68, 4);
  const e = K.e[4];
  K.form(4, m, 0, { k: STEIN.slice(0, 7), r: RAND, ton: 0.9, fase: 2, schatten: 2, muster: (px, py) => (((px * 2 + py * 3) >> 2) % 3 === 0 ? -0.4 : 0) + (B.hash(px >> 1, py >> 1, 8) - 0.5) * 0.4 });
  for (let i = 0; i < 6; i++) { const a = Math.PI + 0.3 + i * 0.45; const px = x + Math.cos(a) * 26, py = y - 2 + Math.sin(a) * 16; e.set(px, py, B.pk(HARZ[glimmt ? 5 : 3])); }
  if (glimmt) { B.gluehen(e, x, y - 14, 30, GLUT, 0.8); K.anim.push({ p: 0.5, f(ctx, t, ox, oy) { for (let k = 0; k < 3; k++) { const z = (t * 0.2 + k / 3) % 1; ctx.fillStyle = z < 0.5 ? '#5a4a32' : '#3a3024'; ctx.fillRect(Math.round(x - 2 + Math.sin(t + k * 2) * 3 * z) + ox, Math.round(y - 24 - z * 40) + oy, 2, 1); } } }); }
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' ? 1 : art === 'kraemer' ? 0 : art === 'wandbild' ? 1 : art === 'ereignis' || art === 'fund' ? 2 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = gewoelbe(K, {});
  else if (art === 'uebergang') info = gewoelbe(K, { treppe: true });
  else info = [k => strassenzug(k, {}), gefaellt, abgrund][v](K);
  if (art === 'rast') { for (let i = 0; i < 4; i++) B.dith(K.e[i], -M, -M, W + M, H + M, pal.koerper[0], (px) => 0.22 + 0.1 * i - Math.abs(px - 240) / 1600); B.feuer(K, 240, 222); }
  else if (art === 'kraemer') { meiler(K, 330, 206, true); B.stand(K, 180, 204); }
  else if (art === 'werkstatt') { meiler(K, 380, 200, false); B.werkbank(K, 220, 210); }
  else if (art !== 'uebergang') B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.wald = { pal, build: bauen, reliefStil: { figuren: 5, gelenke: 3, knick: 0.5, stein: ['#3a342a', '#4a4236', '#6a5e4a', '#a08a62'] } };
if (World.BIOME.indexOf('wald') < 0) World.BIOME.push('wald');
})();
