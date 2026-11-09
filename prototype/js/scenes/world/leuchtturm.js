// Saltmoor 1925 · Hintergründe: Akt I, Der Leuchtturmhof (Biom-Paket leuchtturm).
// Komposition: docs/auftrag-2/biome/leuchtturm.md
// Grundform: der Strahl als Diagonale. Er kommt oben aus der Laterne und fällt schräg in den Hof, auf
// Pflaster und gekalkte Wände; alles, was er trifft, ist hell und flach, alles daneben Nacht. Das falsche
// Detail: draußen auf dem Meer zeigt jedes Schiff Rot und Grün zugleich, hält also genau auf den Turm zu,
// und keins kommt näher.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#050507', '#0c0c11', '#17161e', '#2d2b38'], rand: ['#857a60', '#ece2c8'], augen: '#ffe07a', nebel: ['#121220', '#3a3a4c'], fern: '#3e3e52' };
const HIMMEL = ['#04040a', '#07070f', '#0b0b16', '#10101e', '#161628', '#1e1d33', '#27263f', '#32304b', '#403d58'];
const KALK = ['#0d0d13', '#16161e', '#202029', '#2c2b35', '#3b3a43', '#504d53', '#6b6664', '#8e877a', '#b6ac96', '#dbd0b5'];
const ROT = ['#100506', '#1b0808', '#2a0d0b', '#3c120e', '#521912', '#6c2217', '#8c2e1f', '#ad3d28'];
const GRAS = ['#050605', '#0a0c0a', '#101310', '#161a16', '#1e231d', '#282e26', '#343b30'];
const FELS = ['#06060a', '#0b0b11', '#121219', '#1a1a22', '#24242e', '#30303b', '#3e3d48'];
const MEER = ['#020307', '#04060c', '#070912', '#0a0d19', '#0f1322', '#151a2d'];
const PFL = ['#070709', '#0d0d11', '#141419', '#1c1c22', '#26252b', '#323037', '#423f43', '#59544f', '#776f62', '#9d9280'];
const HOLZ = ['#08070a', '#100e10', '#1a1617', '#262021', '#342b29', '#463a33'];
const EISEN = ['#050607', '#0a0c0e', '#121518', '#1b1f23', '#262b30', '#333a40'];
const MESS = ['#2a2010', '#4a3818', '#7a5e2a', '#a8843c', '#d8b468'];
const STRAHL = '#fff1c0', STRAHLK = '#fffbe8', STRAHLG = '#3c3522', STRAHLD = '#26221a';
const FENSTER = '#ffc870', FENSTERG = '#4a3010';
const S_ROT = '#ff4a3a', S_GRUEN = '#5cff8e', S_WEISS = '#fff6d8';

// ---------- Himmel: Nacht, über dem Turm etwas Schein; Wolkenbänder ----------
function himmel(K, hor, lx, ly) {
  const e = K.e[0], s = K.o.seed, fr = K.fr;
  B.feld(e, -M, -M, W + M, hor + 2, HIMMEL, (x, y) => {
    const v = (y + M) / (hor + M), g = Math.exp(-(((x - lx) / 150) ** 2) - (((y - ly) / 110) ** 2)) * 0.45;
    return 0.12 + v * 0.42 + g + (B.fbm(x * 0.012, y * 0.04, s, 2) - 0.5) * 0.12 - fr * 0.06;
  });
  const wol = ['#08080f', '#0e0e18', '#161624', '#24243a', '#3a3852'];
  B.feld(e, -M, 6, W + M, hor - 10, wol, (x, y) => {
    const c = B.fbm(x * 0.007 + y * 0.003, y * 0.05, s + 9, 3) - 0.55 + Math.sin(y * 0.09 + 1) * 0.08; if (c < 0) return -1;
    const licht = Math.exp(-(((x - lx) / 170) ** 2) - (((y - ly) / 120) ** 2));
    return 0.15 + (c < 0.04 ? 0.5 * licht + 0.15 : 0.1 * licht);
  });
  B.sterne(e, K.r, 60, -M, -M, W + M, hor * 0.6, ['#2a2a42', '#4a4a66', '#9a96b0'], (x, y) => B.unpk(e.get(x, y))[2] < 0x20);
}
// ---------- Meer mit den Schiffen: jedes zeigt Rot und Grün zugleich (hält genau auf den Turm zu) ----------
function meer(K, x0, x1, hor, y1, eb) {
  const e = K.e[eb], s = K.o.seed;
  B.feld(e, x0, hor, x1, y1, MEER, (x, y) => 0.25 + (y - hor) / (y1 - hor) * 0.5 + (Math.sin(x * 0.11 + y * 1.7 + B.rausch1(y * 0.3, s) * 6) > 0.86 ? 0.35 : 0) + (B.fbm(x * 0.02, y * 0.2, s + 4, 2) - 0.5) * 0.3);
  B.wasserGlanz(K, { x0, x1, y0: hor + 1, y1, n: 50, farben: [MEER[5], '#262a40', '#3e3c52'], p: 0.08, pow: 1.3 });
}
function schiffe(K, liste, eb) {
  // liste: [x, y, groesse]; Bug voraus gesehen: schmaler Rumpf, Mast in der Mitte, links Rot, rechts Grün, oben Weiß
  const e = K.e[eb];
  for (const [x, y, g] of liste) {
    const m = B.maske(); m.poly([[x - 2.2 * g, y - 1.2 * g], [x + 2.2 * g, y - 1.2 * g], [x + 1.2 * g, y + 0.6 * g], [x - 1.2 * g, y + 0.6 * g]]);
    m.rect(x - 0.4, y - 7 * g, Math.max(1, 0.8 * g), 6 * g); m.rect(x - 2.6 * g, y - 4.5 * g, 5.2 * g, Math.max(1, 0.5 * g));
    K.form(eb, m, 0.55, { ton: 0.6, fase: 0, rand: 0 });
    e.set(x - 2 * g, y - 1.8 * g, B.pk(S_ROT)); e.set(x + 2 * g, y - 1.8 * g, B.pk(S_GRUEN)); e.set(x, y - 7 * g, B.pk(S_WEISS));
    B.gluehen(e, x - 2 * g, y - 1.8 * g, 3 + g * 3, '#5a140e', 0.9); B.gluehen(e, x + 2 * g, y - 1.8 * g, 3 + g * 3, '#145a2a', 0.9);
    if (g > 1.8) { e.set(x - 2 * g + 1, y - 1.8 * g, B.pk(S_ROT)); e.set(x + 2 * g - 1, y - 1.8 * g, B.pk(S_GRUEN)); }
    // Spiegelung im Wasser: zwei kurze senkrechte Striche
    B.linie(e, x - 2 * g, y + 1 * g, x - 2 * g, y + 1 * g + 2 + g * 2, B.pk('#6a1a12'), 0.6); B.linie(e, x + 2 * g, y + 1 * g, x + 2 * g, y + 1 * g + 2 + g * 2, B.pk('#1a6a34'), 0.6);
  }
  K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { liste.forEach(([x, y, g], i) => { if (Math.sin(t * 0.9 + i * 1.7) > 0.7) { ctx.fillStyle = S_WEISS; ctx.fillRect(Math.round(x) + ox, Math.round(y - 7 * g) + oy, 1, 1); ctx.fillStyle = '#ff9a8a'; ctx.fillRect(Math.round(x - 2 * g) + ox, Math.round(y - 1.8 * g) + oy, 1, 1); } }); } });
}
// Linie von Schiffen auf das Ziel zu (perspektivisch kleiner werdend)
function schiffsLinie(K, ax, ay, bx, by, n, g0, g1) { const l = []; for (let i = 0; i < n; i++) { const q = i / Math.max(1, n - 1); l.push([Math.round(B.lerp(ax, bx, q)), Math.round(B.lerp(ay, by, q)), B.lerp(g0, g1, q)]); } return l; }

// ---------- Der Turm: Kegel, rot und weiß gebändert, Galerie, Laterne mit Rautengittern ----------
// x Mitte, yb Fuß, hoch, breit (unten), tiefe; liefert Lampenpunkt
function turm(K, eb, x, yb, hoch, breit, tiefe, o) {
  o = o || {}; const wt = breit * 0.62, yt = yb - hoch;
  const rumpf = B.maske(); rumpf.poly([[x - breit / 2, yb], [x - wt / 2, yt], [x + wt / 2, yt], [x + breit / 2, yb]]);
  K.form(eb, rumpf, tiefe, { k: KALK.slice(1, 9), ton: 3.5, verlauf: 0.6, verlaufX: 2.5, fase: Math.max(1.5, breit * 0.05), schatten: 2,
    muster: (px, py) => (B.fbm(px * 0.08, py * 0.08, 3, 2) - 0.5) * 0.8 });
  // Bänder: drei rote Ringe
  const nb = o.baender || 3;
  for (let i = 0; i < nb; i++) {
    const q0 = 0.12 + i * 0.27, q1 = q0 + 0.13, y0 = yb - hoch * q1, y1 = yb - hoch * q0;
    const band = B.maske(); band.fn(x - breit, y0, x + breit, y1, (px, py) => rumpf.has(px, py));
    K.form(eb, band, tiefe, { k: ROT, ton: 2.6, verlauf: 0.2, verlaufX: 3, fase: Math.max(1.5, breit * 0.05), rand: 1 });
  }
  // Tür und Fenster (Maßstab): Tür unten, kleine Fenster versetzt die Treppe hinauf
  if (breit > 20) {
    const tw = Math.max(3, breit * 0.16), th = Math.max(5, hoch * 0.06);
    const tm = B.maske(); tm.rect(x - tw / 2 - breit * 0.08, yb - th, tw, th); K.form(eb, tm, tiefe, { k: HOLZ, ton: 1.4, rand: 0, fase: 0 });
    for (let i = 0; i < 4; i++) { const q = 0.25 + i * 0.18, fy = yb - hoch * q, bw = B.lerp(breit, wt, q), fx = x + (i % 2 ? 0.18 : -0.14) * bw; const fm = B.maske(); fm.rect(fx - 1, fy - 2, Math.max(2, bw * 0.06), Math.max(3, hoch * 0.022)); K.form(eb, fm, tiefe, { k: KALK.slice(0, 3), ton: 0.6, rand: 0, fase: 0 }); }
  }
  // Galerie mit Geländer
  const gw = wt + breit * 0.22, gy = yt - 1, gh = Math.max(2, hoch * 0.02);
  const gal = B.maske(); gal.rect(x - gw / 2, gy, gw, gh); gal.poly([[x - gw / 2, gy + gh], [x + gw / 2, gy + gh], [x + wt / 2, gy + gh + hoch * 0.03], [x - wt / 2, gy + gh + hoch * 0.03]]);
  for (let i = 0; i <= 8; i++) gal.rect(x - gw / 2 + i * gw / 8 - 0.4, gy - hoch * 0.035, 1, hoch * 0.035);
  gal.rect(x - gw / 2, gy - hoch * 0.04, gw, 1);
  K.form(eb, gal, tiefe, { k: EISEN, ton: 1.6, fase: 0, rand: 1 });
  // Laterne: Glas mit Rautensprossen, hell; Haube, Lüfterkugel
  const lw = wt * 0.78, lh = Math.max(5, hoch * 0.1), ly0 = gy - lh;
  const lmp = [x, ly0 + lh * 0.5];
  const e = K.e[eb];
  B.feld(e, x - lw / 2, ly0, x + lw / 2, gy, [STRAHLD, STRAHLG, '#8a7a50', '#d8c890', STRAHL, STRAHLK], (px, py) => 0.55 + 0.45 * (1 - Math.abs(px - x) / (lw / 2)) - (Math.abs(py - lmp[1]) / lh) * 0.3 - (o.aus ? 0.6 : 0));
  for (let k = -6; k <= 6; k++) { B.linie(e, x + k * lw / 6, ly0, x + k * lw / 6 + lh * 0.6, gy, B.pk(EISEN[1]), 1); B.linie(e, x + k * lw / 6, ly0, x + k * lw / 6 - lh * 0.6, gy, B.pk(EISEN[1]), 1); }
  const haube = B.maske(); haube.poly([[x - lw / 2 - 1, ly0], [x, ly0 - lh * 0.55], [x + lw / 2 + 1, ly0]]); haube.ell(x, ly0 - lh * 0.6, Math.max(1, lw * 0.07), Math.max(1, lw * 0.07)); haube.kap(x, ly0 - lh * 0.6, x, ly0 - lh * 0.95, 0.5, 0.4);
  K.form(eb, haube, tiefe, { k: EISEN, ton: 1.4, fase: 1, rand: 2 });
  for (const L of [K.e[0], K.e[Math.max(0, eb - 1)], e]) B.gluehen(L, lmp[0], lmp[1], 14 + hoch * 0.18, STRAHLG, 0.95);
  K.licht(lmp[0], lmp[1], STRAHL, 60, 1);
  return lmp;
}
// ---------- Der Strahl: fällt aus der Laterne schräg in den Hof (statisch hell, dazu ein ruhiges Atmen) ----------
function strahl(K, lx, ly, winkel, breite, laenge, ebenen, o) {
  o = o || {};
  for (const i of ebenen) B.kegel(K.e[i], lx, ly, winkel, breite, laenge, o.farbe || '#6e6444', o.a || 0.95);
  for (const i of ebenen) B.kegel(K.e[i], lx, ly, winkel, breite * 0.45, laenge * 0.9, '#5a5238', 0.8);
  B.lichtkegelAnim(K, { x: lx, y: ly, laenge, breite: breite * 0.7, basis: 1.5, farbe: [30, 28, 18], kern: [70, 64, 42], staerkeMax: 0.7, abfall: 0.45, p: o.p === undefined ? 0.15 : o.p,
    winkel: t => winkel + 0.025 * Math.sin(t * 0.5) + 0.04 * K.fr * Math.sin(t * 0.17), staerke: t => 0.75 + 0.25 * Math.sin(t * 0.9) });
  // Staub und Gischt im Strahl: helle Punkte nur innerhalb des Kegels
  const ca = Math.cos(winkel), sa = Math.sin(winkel);
  B.partikel(K, { n: 70, farben: ['#5a5238', '#a8987a', STRAHL], vx: -6, vy: 3, wob: 3, wf: 0.6, p: 0.5, hellSelten: 2.2,
    maske: (x, y) => { const dx = x - lx, dy = y - ly, d = dx * ca + dy * sa; if (d < 20 || d > laenge) return false; const q = Math.abs(-dx * sa + dy * ca); return q < d * Math.tan(breite) * 0.8; } });
}
// Lichtfleck auf einer Ebene: hellt gedithert auf (der Strahl trifft eine Fläche)
function fleck(K, eb, cx, cy, rx, ry, a) {
  const e = K.e[eb], C = B.col('#5a5240');
  for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
    const q = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2; if (q >= 1) continue; const v = a * (1 - q); if (v > B.bay(x, y) * 0.9) e.add(x, y, C, 0.55 + v * 0.4);
  }
}
// ---------- Wärterhaus, frontal: gekalkte Wand, Satteldach, Schornstein, Sprossenfenster ----------
function haus(K, eb, x, yb, w, h, o) {
  o = o || {}; const tiefe = o.tiefe || 0.12, dachH = o.dach || h * 0.55;
  const wand = B.maske(); wand.rect(x, yb - h, w, h);
  K.form(eb, wand, tiefe, { k: KALK, ton: o.hell ? 8.4 : 3, verlauf: 0.3, verlaufX: o.hell ? -0.8 : 1.2, fase: 1.5, schatten: 2, muster: (px, py) => (B.fbm(px * 0.1, py * 0.1, 5, 2) - 0.5) * 0.9 - (o.hell ? (py - (yb - h)) / h * 1.4 : 0) });
  const dach = B.maske(); dach.poly([[x - 4, yb - h + 1], [x + w / 2, yb - h - dachH], [x + w + 4, yb - h + 1]]);
  if (o.kamin !== false) dach.rect(x + w * 0.68, yb - h - dachH * 0.95, Math.max(3, w * 0.07), dachH * 0.6);
  K.form(eb, dach, tiefe, { k: FELS, ton: 2.4, verlauf: 0.5, fase: 1.5, schatten: 2, muster: (px, py) => ((py % 3) === 0 ? -0.6 : 0) });
  // Fenster: n Stück, Sprossenkreuz; welche leuchten, sagt o.lit (Liste)
  const n = o.fenster || 2, fw = Math.max(5, w * 0.16), fh = Math.max(7, h * 0.32), e = K.e[eb];
  const fl = [];
  for (let i = 0; i < n; i++) {
    const fx = Math.round(x + w * (i + 0.5) / n - fw / 2), fy = Math.round(yb - h * 0.72);
    const lit = (o.lit || []).includes(i);
    B.feld(e, fx, fy, fx + fw, fy + fh, lit ? [FENSTERG, '#8a5a20', FENSTER, '#ffe6b0'] : ['#050508', '#0a0a10', '#121219'], (px, py) => lit ? 0.4 + 0.5 * (1 - (py - fy) / fh) : 0.2 + (px - fx) / fw * 0.4);
    B.linie(e, fx + fw / 2, fy, fx + fw / 2, fy + fh - 1, B.pk(KALK[2])); B.linie(e, fx, fy + Math.round(fh * 0.45), fx + fw - 1, fy + Math.round(fh * 0.45), B.pk(KALK[2]));
    B.linie(e, fx - 1, fy + fh, fx + fw, fy + fh, B.pk(KALK[o.hell ? 9 : 5]));
    if (lit) { B.gluehen(e, fx + fw / 2, fy + fh / 2, fw * 1.6, FENSTERG, 0.7); K.licht(fx + fw / 2, fy + fh / 2, FENSTER, 30, 0.5); }
    fl.push([fx, fy, fw, fh]);
  }
  // Tür
  if (o.tuer !== false) { const tm = B.maske(); tm.rect(x + w * (o.tuerX || 0.08), yb - h * 0.55, Math.max(4, w * 0.12), h * 0.55); K.form(eb, tm, tiefe, { k: HOLZ, ton: 1.6, rand: 1, fase: 0 }); }
  return fl;
}
// Niedrige Hofmauer: Bruchstein, oben gekalkte Abdeckung
function mauer(K, eb, x0, x1, y, h, tiefe) {
  const m = B.maske(); m.rect(x0, y - h, x1 - x0, h);
  K.form(eb, m, tiefe, { k: FELS, ton: 2.6, fase: 1, schatten: 2, muster: (px, py) => { const r = Math.floor((py - y) / 4), c = Math.floor((px + (r & 1) * 5) / 9); return (((py - y) % 4 === 0) || ((px + (r & 1) * 5) % 9 === 0) ? -1.2 : 0) + (B.hash(c, r, 7) - 0.5) * 0.8; } });
  const k = B.maske(); k.rect(x0 - 1, y - h - 3, x1 - x0 + 2, 3); K.form(eb, k, tiefe, { k: KALK, ton: 6, fase: 0, rand: 2 });
}
// Boden: Hofpflaster mit Fluchtlinien (Fugen), Lichtfleck des Strahls
function pflaster(K, P, y0, hell) {
  const sd = K.o.seed;
  K.bodenStoffe(y0, H + M, [
    { cols: PFL, tf: (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h, k = P.k(Z);
      const rz = Math.floor(Z / 0.55), fx = (X + (rz & 1) * 0.25) / 0.5, fz = Z / 0.55;
      let t = 0.22 + (B.hash(Math.floor(fx), rz, sd) - 0.5) * 0.12 + Math.min(0.2, 3 / Z) * 0.3;
      if ((fx - Math.floor(fx)) * 0.5 * k < 1.1 || (fz - Math.floor(fz)) * 0.55 * k * k / P.h < 0.9) t -= 0.16;
      if (hell) { const l = hell(x, y); t += l * 0.62; }
      return t + (B.fbm(X * 0.8, Z * 0.6, sd + 3, 2) - 0.5) * 0.12; } },
    { cols: GRAS, tf: (x, y) => 0.35 + (B.fbm(x * 0.05, y * 0.2, sd + 5, 2) - 0.5) * 0.6 + (hell ? hell(x, y) * 0.5 : 0) },
  ], (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h; return Math.abs(X) > 7 + Math.sin(Z * 1.3) * 0.6 ? 1 : 0; });
}
// Pfützen auf dem Pflaster: spiegeln den Strahl (heller Streifen) und den Himmel
function pfuetzen(K, liste) {
  for (const [x, y, rx] of liste) {
    const ry = rx * 0.3, m = B.maske(); m.fn(x - rx - 2, y - ry - 2, x + rx + 2, y + ry + 2, (px, py) => ((px - x) / rx) ** 2 + ((py - y) / ry) ** 2 + (B.rausch2(px * 0.3, py * 0.5, 7) - 0.5) * 0.5 < 1);
    const e = K.e[K.eb(y)];
    for (let py = Math.floor(y - ry - 2); py <= y + ry + 2; py++) for (let px = Math.floor(x - rx - 2); px <= x + rx + 2; px++) {
      if (!m.has(px, py)) continue; const q = (px - x) / rx, oben = !m.has(px, py - 1);
      e.set(px, py, B.pk(oben ? PFL[2] : Math.abs(q + 0.15 - (py - y) * 0.06) < 0.14 ? '#9a9078' : B.bay(px, py) < 0.3 + (py - y) / ry * 0.2 ? HIMMEL[6] : HIMMEL[4]));
    }
  }
  K.anim.push({ p: 0.5, f(ctx, t, ox, oy) { liste.forEach(([x, y, rx], i) => { if (Math.sin(t * 1.1 + i) > 0.3) { ctx.fillStyle = '#d8ccaa'; ctx.fillRect(Math.round(x - rx * 0.2 + Math.sin(t + i) * 2) + ox, Math.round(y) + oy, 2, 1); } }); } });
}
// Gras und Klippenboden
function wiese(K, P, y0, hell) {
  const sd = K.o.seed;
  K.boden(y0, H + M, GRAS, (x, y) => { const Z = P.z(y + 0.5); return 0.28 + Math.min(0.25, 2 / Z) + (B.fbm(x * 0.04, y * 0.25, sd + 5, 3) - 0.5) * 0.55 + ((x * 7 + y * 13) % 23 === 0 ? 0.3 : 0) + (hell ? hell(x, y) * 0.55 : 0); });
}
// Signalmast mit Rah und Wimpel
function mast(K, eb, x, yb, h, tiefe) {
  const m = B.maske(); m.kap(x, yb, x, yb - h, 1.6, 0.9); m.kap(x - h * 0.2, yb - h * 0.82, x + h * 0.2, yb - h * 0.84, 0.7, 0.7);
  for (const s of [-1, 1]) m.pfad([[x, yb - h], [x + s * h * 0.25, yb]], 0.35, 0.35);
  m.poly([[x, yb - h + 1], [x + h * 0.18, yb - h + 3], [x, yb - h + 5]]);
  K.form(eb, m, tiefe, { k: HOLZ, ton: 1.6, fase: 0, rand: 1 });
}
// Nebelhornhaus: kleines Haus, aus dem ein großer Trichter aufs Meer zeigt
function nebelhorn(K, eb, x, yb, s, tiefe) {
  haus(K, eb, x, yb, 38 * s, 22 * s, { fenster: 1, lit: [0], tuer: false, kamin: false, tiefe });
  const m = B.maske(); m.poly([[x - 2, yb - 16 * s], [x - 22 * s, yb - 24 * s], [x - 22 * s, yb - 6 * s], [x - 2, yb - 12 * s]]);
  K.form(eb, m, tiefe, { k: EISEN, ton: 2, fase: 1, rand: 2, schatten: 2 });
}
// Wäscheleine: zwei Pfähle, nasse Wäsche, ein Ölzeug in Männergröße
function waesche(K, eb, x0, x1, y, tiefe) {
  const m = B.maske(); m.kap(x0, y, x0, y - 40, 1.2, 1); m.kap(x1, y, x1, y - 40, 1.2, 1);
  const pts = []; for (let i = 0; i <= 10; i++) { const q = i / 10; pts.push([B.lerp(x0, x1, q), y - 38 + Math.sin(q * Math.PI) * 4]); } m.pfad(pts, 0.4, 0.4);
  K.form(eb, m, tiefe, { k: HOLZ, ton: 1.6, fase: 0, rand: 1 });
  const stk = [[0.18, 8, 11, 'hemd'], [0.42, 12, 22, 'oel'], [0.68, 7, 15, 'hose'], [0.85, 6, 9, 'hemd']];
  for (const [q, w, h, art] of stk) {
    const cx = B.lerp(x0, x1, q), cy = y - 38 + Math.sin(q * Math.PI) * 4, s = B.maske();
    if (art === 'oel') { s.poly([[cx - w / 2, cy], [cx + w / 2, cy], [cx + w / 2 + 2, cy + h], [cx - w / 2 - 2, cy + h]]); s.kap(cx - w / 2, cy + 1, cx - w / 2 - 5, cy + h * 0.5, 1.5, 1.2); s.kap(cx + w / 2, cy + 1, cx + w / 2 + 5, cy + h * 0.5, 1.5, 1.2); }
    else if (art === 'hose') { s.rect(cx - w / 2, cy, w, 3); s.poly([[cx - w / 2, cy + 3], [cx - 0.5, cy + 3], [cx - 1, cy + h], [cx - w / 2 - 1, cy + h]]); s.poly([[cx + 0.5, cy + 3], [cx + w / 2, cy + 3], [cx + w / 2 + 1, cy + h], [cx + 1, cy + h]]); }
    else s.poly([[cx - w / 2, cy], [cx + w / 2, cy], [cx + w / 2 - 1, cy + h], [cx - w / 2 + 1, cy + h]]);
    K.form(eb, s, tiefe, art === 'oel' ? { k: ['#0c0b06', '#16140a', '#221e10', '#322c16', '#4a4020'], ton: 2.4, fase: 1, rand: 2, schatten: 1 } : { k: KALK.slice(2), ton: 5, fase: 1, rand: 2, schatten: 1 });
    // Tropfen, die nach oben fallen
    K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { for (let k = 0; k < 3; k++) { const ph = ((t * 0.6 + k * 0.33 + q) % 1); ctx.fillStyle = '#7a8a96'; ctx.fillRect(Math.round(cx - w / 2 + k * w / 2) + ox, Math.round(cy + h + 14 - ph * 14) + oy, 1, 1); } } });
  }
}
// Trittleiter, verlassen (Maßstab)
function leiter(K, eb, x, y, s) {
  const m = B.maske(); m.kap(x, y, x + 6 * s, y - 22 * s, 0.8, 0.7); m.kap(x + 12 * s, y, x + 7 * s, y - 22 * s, 0.8, 0.7); m.rect(x + 4 * s, y - 23 * s, 6 * s, 1.4);
  for (let i = 1; i < 3; i++) m.rect(x + i * 2 * s, y - i * 7 * s, 4 * s, 1);
  K.form(eb, m, 0.05, { k: HOLZ, ton: 1.8, fase: 0, rand: 1 });
}

// =====================================================================
// Variante 0: Der Hof. Der Turm hinten rechts, der Strahl fällt aus der Laterne schräg nach links unten in
// den Hof, auf die gekalkten Wärterhäuser links (zwölf Fenster). Über der Hofmauer rechts das Meer mit den Schiffen.
function hof(K, cfg) {
  const fr = K.fr, nah = !!cfg.nah, P = B.persp(nah ? 300 : 330, 128); K.split = [150, 164];
  himmel(K, 128, 330, 20);
  B.feld(K.e[1], -M, 110, W + M, 162, GRAS, (x, y) => 0.25 + (B.fbm(x * 0.05, y * 0.1, 2, 2) - 0.5) * 0.3);
  meer(K, 150, W + M, 120, 150, 1);
  schiffe(K, schiffsLinie(K, 474, 132, 232, 122, 7 + Math.round(fr * 5), 2.6, 0.9), 1);
  const lmp = turm(K, 2, 336, 152, 140, 44, 0.06, {});
  // Wärterhäuser links: hell im Strahl
  haus(K, 2, 18, 156, 70, 44, { fenster: 3, lit: [2], hell: true, tiefe: 0.1 });
  haus(K, 2, 96, 152, 60, 38, { fenster: 3, lit: fr > 0.5 ? [0, 2] : [1], hell: true, tiefe: 0.12, tuerX: 0.45 });
  // Hofmauer quer, dahinter das Meer; der Schuppen am Turm
  mauer(K, 2, 160, W + M, 152, 10, 0.1);
  haus(K, 2, 372, 152, 46, 26, { fenster: 1, lit: [], tiefe: 0.14, kamin: false, tuerX: 0.6 });
  mast(K, 2, 200, 148, 64, 0.16);
  // Strahl: aus der Laterne nach links unten, trifft die Häuser und das Pflaster vor ihnen
  strahl(K, lmp[0], lmp[1], Math.PI * 0.79, 0.11, 360, [0, 1, 2], {});
  fleck(K, 2, 90, 128, 90, 40, 0.75);
  const hell = (x, y) => { const q = ((x - 150) / 190) ** 2 + ((y - 186) / 34) ** 2; return Math.max(0, 1 - q) * 0.9; };
  pflaster(K, P, 152, hell);
  pfuetzen(K, [[120, 228, 22], [300, 246, 30], [390, 200, 14], [60, 196, 12]]);
  // Maßstab: Trittleiter neben dem Haus, ein Eimer
  leiter(K, 3, 168, 160, 1);
  const ei = B.maske(); ei.poly([[186, 160], [194, 160], [193, 154], [187, 154]]); K.form(3, ei, 0.05, { k: EISEN, ton: 2, fase: 0, rand: 1 });
  // Vordergrund: links ein Pfahl mit Tau, rechts die Ecke des Ölschuppens
  const v = B.maske(); v.kap(10, H + M, 14, 150, 4, 3); v.pfad([[14, 160], [60, 184], [120, 196], [200, 200]], 0.8, 0.6);
  v.poly([[440, H + M], [446, 186], [W + M, 180], [W + M, H + M]]);
  K.form(5, v, 0, { k: HOLZ.slice(0, 4), ton: 1, fase: 1.5 });
  B.nebel(K.e[2], { y0: 130, y1: 156, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.28, xs: [140, 500, 60], seed: 4 });
  B.partikel(K, { n: 30, farben: ['#2a2a3a', '#4a4a5c'], vx: -10, vy: 6, wob: 2, wf: 0.4, p: 1, laenge: 1 });
  K.reihen = [{ y: 166, skala: 0.9, nebel: 0.3 }, { y: 190, skala: 1, nebel: 0.12 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [236, 206], P };
}

// Variante 1: Die Klippe. Wir stehen am Rand; links das Meer mit der Linie der Schiffe, rechts der Turm,
// angeschnitten. Der Strahl geht über uns hinweg ins Land und fällt hinter uns, nur sein Rand streift die Wiese.
function klippe(K) {
  const fr = K.fr, P = B.persp(170, 136); K.split = [150, 164];
  himmel(K, 136, 440, 0);
  meer(K, -M, W + M, 136, 168, 1);
  schiffe(K, schiffsLinie(K, 8, 158, 250, 139, 8 + Math.round(fr * 5), 3, 0.9), 1);
  // Klippe: Felsband vorne links, fällt zum Meer ab
  const kl = B.maske(); kl.poly([[-M, 168], [60, 150], [140, 146], [210, 150], [270, 144], [W + M, 140], [W + M, H + M], [-M, H + M]]);
  K.form(2, kl, 0.1, { k: FELS, ton: 2.2, fase: 2, schatten: 2, muster: (px, py) => (B.fbm(px * 0.06, py * 0.12, 9, 3) - 0.5) * 1.2 });
  const lmp = turm(K, 2, 432, 158, 170, 64, 0.04, { baender: 3 });
  nebelhorn(K, 2, 300, 150, 1.1, 0.12);
  mast(K, 2, 248, 150, 58, 0.16);
  // Geländer an der Kante: Eisenpfosten und Draht
  const g = B.maske(); for (let i = 0; i < 9; i++) { const x = 20 + i * 26, y = 160 - i * 1.4; g.kap(x, y, x, y - 12, 0.7, 0.6); } g.pfad([[20, 150], [228, 137]], 0.4, 0.4); g.pfad([[20, 155], [228, 143]], 0.4, 0.4);
  K.form(3, g, 0.06, { k: EISEN, ton: 1.6, fase: 0, rand: 1 });
  strahl(K, lmp[0], lmp[1], Math.PI * 0.9, 0.09, 520, [0, 1], { a: 0.6 });
  const hell = (x, y) => Math.max(0, 1 - (((x - 250) / 210) ** 2 + ((y - 214) / 40) ** 2)) * 0.8;
  wiese(K, P, 150, hell);
  // Grasbüschel und Steine (Maßstab, Unruhe im Boden)
  const bu = B.maske(); for (let i = 0; i < 60; i++) { const x = K.r.f(0, W), y = K.r.f(156, 250), h = 2 + (y - 150) * 0.05; bu.kap(x, y, x + K.r.j(1.5), y - h, 0.5, 0.3); if (i % 6 === 0) bu.ell(x + 4, y, 1 + (y - 150) * 0.03, 0.6 + (y - 150) * 0.015); }
  K.form(4, bu, 0.03, { k: GRAS, ton: 5, fase: 0, rand: 2 });
  // Abbruch der Klippe unten links: Fels fällt ab, tief unten das Meer mit Brandung
  const ab = B.maske(); ab.poly([[-M, 202], [40, 214], [96, 236], [150, H + M], [-M, H + M]]);
  B.feld(K.e[4], -M, 200, 160, H + M, MEER.concat(['#262a40', '#5a5a70']), (x, y) => ab.has(x, y) ? 0.25 + (B.fbm(x * 0.08, y * 0.3, 5, 2) > 0.62 ? 0.55 : 0) + (y - 200) / 260 : -1);
  const kante = B.maske(); kante.poly([[-M, 196], [40, 208], [98, 230], [154, H + M], [140, H + M], [90, 238], [36, 218], [-M, 210]]);
  K.form(4, kante, 0, { k: FELS, ton: 2.6, fase: 2, rand: 2, schatten: 2, muster: (px, py) => (B.fbm(px * 0.1, py * 0.1, 13, 2) - 0.5) * 1.2 });
  // Kiesweg auf den Turm zu
  K.bodenDith(-M, 152, W + M, H + M, PFL[5], (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - 420) * Z / P.h; return Math.abs(X - 0.8 * Z * 0.2) < 1.4 ? 0.55 : 0; });
  // Bank am Geländer (Maßstab)
  const bk = B.maske(); bk.rect(92, 166, 30, 2); bk.rect(92, 158, 30, 2); bk.rect(94, 166, 2, 6); bk.rect(118, 166, 2, 6); K.form(3, bk, 0.04, { k: HOLZ, ton: 2, fase: 0, rand: 1 });
  // Vordergrund: Gras und ein Stein links, Felskante unten rechts
  const v = B.maske();
  v.poly([[392, H + M], [420, 240], [470, 232], [W + M, 236], [W + M, H + M]]);
  K.form(5, v, 0, { k: GRAS.slice(0, 4), ton: 1, fase: 1.5 });
  B.nebel(K.e[1], { y0: 128, y1: 146, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.26, seed: 7 });
  B.partikel(K, { n: 40, farben: ['#2a2a3a', '#4a4a5c', '#6a6a7a'], vx: 16, vy: -2, wob: 2, wf: 0.5, p: 1 });
  K.reihen = [{ y: 172, skala: 0.9, nebel: 0.3 }, { y: 194, skala: 1, nebel: 0.12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [220, 208], P };
}

// Variante 2: Am Fuß des Turms. Links der Turmfuß riesig, die Tür; die Laterne ist oben aus dem Bild, ihr
// Strahl fällt steil herab über den Hof auf das Wärterhaus und die Wäscheleine gegenüber.
function turmfuss(K) {
  const fr = K.fr, P = B.persp(300, 148); K.split = [156, 168];
  himmel(K, 148, 120, -40);
  meer(K, 330, W + M, 140, 150, 1);
  schiffe(K, schiffsLinie(K, 476, 147, 352, 142, 5 + Math.round(fr * 3), 1.8, 0.8), 1);
  // Gegenüber: Wärterhaus und Ölschuppen, hell im Strahl
  haus(K, 2, 196, 152, 92, 52, { fenster: 4, lit: [3], hell: true, tiefe: 0.08, tuerX: 0.02 });
  haus(K, 2, 300, 150, 40, 28, { fenster: 1, lit: [], hell: true, tiefe: 0.12, kamin: false, tuerX: 0.55 });
  mauer(K, 2, 340, W + M, 150, 9, 0.1);
  waesche(K, 3, 300, 410, 172, 0.06);
  // der Turmfuß links: nah, die Rundung des Schafts, rot-weiß, eine Tür mit Treppe
  const tm = B.maske(); tm.poly([[-M, H + M], [-M, -M], [120, -M], [150, 168], [140, 176], [-M, 178]]);
  K.form(3, tm, 0, { k: KALK.slice(0, 8), ton: 2.4, verlaufX: 3, fase: 3, schatten: 2, muster: (px, py) => (B.fbm(px * 0.05, py * 0.05, 11, 2) - 0.5) * 0.8 });
  for (const [y0, y1] of [[18, 54], [110, 146]]) { const b = B.maske(); b.fn(-M, y0, 160, y1, (px, py) => tm.has(px, py)); K.form(3, b, 0, { k: ROT, ton: 1.8, verlaufX: 3.4, fase: 3 }); }
  const tuer = B.maske(); tuer.rect(70, 120, 26, 52); tuer.ell(83, 120, 13, 8); K.form(3, tuer, 0, { k: HOLZ, ton: 1.4, rand: 1, fase: 0, muster: (px) => ((px - 70) % 6 === 0 ? -0.8 : 0) });
  const stufe = B.maske(); stufe.rect(62, 172, 44, 4); stufe.rect(58, 176, 52, 4); K.form(3, stufe, 0, { k: FELS, ton: 2.2, fase: 0, rand: 2 });
  K.e[3].set(92, 146, B.pk(MESS[4])); // Türklinke
  // Strahl von oben links (Laterne außerhalb des Bildes)
  strahl(K, 60, -120, Math.PI * 0.33, 0.12, 460, [1, 2], {});
  fleck(K, 2, 260, 128, 110, 34, 0.7);
  const hell = (x, y) => Math.max(0, 1 - (((x - 290) / 170) ** 2 + ((y - 196) / 30) ** 2)) * 0.9;
  pflaster(K, P, 150, hell);
  pfuetzen(K, [[220, 236, 26], [380, 224, 16], [130, 254, 20]]);
  leiter(K, 4, 156, 186, 1.2);
  // Vordergrund: Regentonne rechts, Kante links
  const v = B.maske(); v.rect(436, 196, 34, 80); v.ell(453, 196, 17, 4); v.poly([[-M, 236], [70, 246], [80, H + M], [-M, H + M]]);
  K.form(5, v, 0, { k: HOLZ.slice(0, 4), ton: 1.2, fase: 1.5, muster: (px, py) => ((py - 196) % 18 === 0 ? 0.8 : 0) });
  B.nebel(K.e[2], { y0: 136, y1: 158, col: B.mix(pal.nebel[1], K.fern, 0.4), dichte: 0.24, xs: [180, 500, 60], seed: 3 });
  B.partikel(K, { n: 26, farben: ['#2a2a3a', '#4a4a5c'], vx: -8, vy: 5, wob: 2, wf: 0.4, p: 1 });
  K.reihen = [{ y: 170, skala: 0.9, nebel: 0.3 }, { y: 192, skala: 1, nebel: 0.12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [290, 208], P };
}

// Wächter: Die Laterne. Innen im Laternenhaus: ringsum Rautenscheiben, durch die man Himmel, Meer und die
// Schiffe sieht. Hinter der Linse fängt die Rückwand ihr Licht: eine große, ruhige, warme Fläche, vor der sie
// steht. Unten das Messinggeländer, der Gitterboden, das Gewicht des Uhrwerks an seiner Kette.
// Übergang: die Wendeltreppe hinab, der Strahl folgt nach unten.
function laterne(K, cfg) {
  const fr = K.fr, sd = K.o.seed, P = B.persp(240, 168); K.split = [176, 188];
  if (cfg.treppe) return treppe(K);
  // Draußen: Himmel und Meer, durch die Scheiben
  himmel(K, 120, 240, 60);
  meer(K, -M, W + M, 120, 168, 0);
  B.feld(K.e[1], -M, 166, W + M, 192, EISEN, (x, y) => 0.2 + (y - 166) / 60);
  schiffe(K, [...schiffsLinie(K, 20, 140, 120, 124, 4 + Math.round(fr * 3), 1.6, 0.8), ...schiffsLinie(K, 470, 138, 370, 124, 4 + Math.round(fr * 3), 1.6, 0.8)], 1);
  // Rückwand hinter der Linse: Scheiben fangen ihr Licht (ruhige helle Fläche, Mitte)
  const e1 = K.e[1];
  B.feld(e1, 120, 6, 360, 172, ['#2c281e', '#433c2a', '#5e5438', '#7e7048', '#a08e5c', '#c2ad74'], (x, y) => { const q = Math.hypot((x - 240) / 118, (y - 92) / 94); if (q > 1) return -1; const rand = q > 0.82 ? (q - 0.82) / 0.18 : 0; if (rand > B.bay(x, y)) return -1; return 0.9 - q * 0.6 + (B.rausch2(x * 0.05, y * 0.05, sd) - 0.5) * 0.08; });
  // Rautensprossen über alles (Ebene 2): schräge Eisenstäbe, senkrechte Pfosten
  const sp = B.maske();
  for (let k = -20; k <= 30; k++) { const x0 = k * 24; sp.kap(x0, -M, x0 + 120, 168, 0.7, 0.7); sp.kap(x0, -M, x0 - 120, 168, 0.7, 0.7); }
  for (const x of [-4, 120, 240, 360, 484]) sp.rect(x - 3, -M, 6, 180);
  sp.rect(-M, 166, W + 2 * M, 6); sp.rect(-M, -M, W + 2 * M, 8);
  K.form(2, sp, 0.1, { k: EISEN, ton: 1.5, fase: 0, rand: 1 });
  // Messinggeländer und Boden
  const gl = B.maske(); gl.rect(-M, 176, W + 2 * M, 3); for (let i = 0; i < 16; i++) gl.rect(i * 32 - 4, 176, 2, 18); gl.rect(-M, 186, W + 2 * M, 2);
  K.form(3, gl, 0.04, { k: MESS, ton: 2, fase: 0, rand: 2 });
  K.boden(188, H + M, EISEN, (x, y) => { const Z = P.z(y + 0.5), X = (x + 0.5 - P.vx) * Z / P.h; const a = Math.atan2(X, Z * 0.6); return 0.3 + (Math.abs(((a * 8) % 1 + 1) % 1 - 0.5) < 0.06 ? 0.5 : 0) + (((Z * 3) % 1) < 0.08 ? 0.3 : 0) + Math.max(0, 1 - Math.abs(x - 240) / 160) * 0.35 + (B.hash(x >> 1, y, sd) - 0.5) * 0.1; });
  // Gewicht des Uhrwerks an der Kette (Maßstab), rechts
  const gw = B.maske(); gw.kap(410, -M, 410, 120, 0.8, 0.8); gw.rect(402, 120, 16, 28); gw.poly([[402, 148], [418, 148], [410, 156]]);
  K.form(3, gw, 0.02, { k: EISEN, ton: 2, fase: 1, rand: 2, schatten: 2 });
  for (let y = 0; y < 120; y += 3) K.e[3].set(410, y, B.pk(EISEN[5]));
  // Lichtstreifen auf dem Boden vor der Linse
  for (const L of [K.e[4]]) B.gluehen(L, 240, 214, 150, STRAHLG, 0.7);
  K.licht(240, 100, STRAHL, 160, 0.8);
  // Vordergrund: dunkle Pfosten links und rechts, oben der Rand der Haube
  const v = B.maske(); v.rect(-M, -M, 30, H + 2 * M); v.rect(452, -M, 40, H + 2 * M); v.poly([[-M, -M], [W + M, -M], [W + M, 10], [-M, 22]]);
  K.form(5, v, 0, { k: EISEN.slice(0, 4), ton: 0.9, fase: 2 });
  B.partikel(K, { n: 40, farben: ['#5a5238', '#a8987a', STRAHL], vx: 2, vy: -3, wob: 3, wf: 0.4, x0: 130, x1: 350, y0: 20, y1: 180, p: 0.6, hellSelten: 2.4 });
  K.reihen = [{ y: 196, skala: 0.9, nebel: 0.2 }, { y: 206, skala: 1, nebel: 0.08 }, { y: 218, skala: 1, nebel: 0 }];
  return { mitte: [240, 212], P };
}
// Übergang: die Wendeltreppe im Turm, von oben gesehen; der Strahl fällt den Schacht hinab auf Wasser
function treppe(K) {
  const sd = K.o.seed;
  B.feld(K.e[0], -M, -M, W + M, H + M, KALK.slice(0, 6), (x, y) => 0.25 + (B.fbm(x * 0.03, y * 0.03, sd, 2) - 0.5) * 0.3);
  // Schacht: Ringe der Treppe, nach unten enger und dunkler
  for (let i = 0; i < 12; i++) {
    const r = 210 - i * 16, cy = 140 + i * 4, m = B.maske(); m.ell(240, cy, r, r * 0.55); m.ell(240, cy + 2, r - 14, (r - 14) * 0.55, 0);
    K.form(Math.min(4, 1 + (i >> 2)), m, 0, { k: i < 6 ? KALK.slice(0, 8) : FELS, ton: 4 - i * 0.28, fase: 1, rand: 2, schatten: 2, muster: (px, py) => { const a = Math.atan2(py - cy, px - 240); return ((a * 6 + i) % 1 + 1) % 1 < 0.08 ? -1.2 : 0; } });
  }
  B.feld(K.e[4], 200, 168, 280, 196, MEER.concat(['#262a40', '#5a5238']), (x, y) => { const q = Math.hypot((x - 240) / 36, (y - 184) / 12); return q > 1 ? -1 : 0.3 + (1 - q) * 0.5 + (Math.sin(x * 0.4 + y) > 0.8 ? 0.2 : 0); });
  strahl(K, 240, -60, Math.PI * 0.5, 0.08, 260, [0, 1, 2, 3], { a: 0.6 });
  K.reihen = [{ y: 166, skala: 0.9, nebel: 0.3 }, { y: 190, skala: 1, nebel: 0.12 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [240, 206] };
}

// Krämer: der Strandvogt im Bootsschuppen, Strandgut, eine Laterne
function strandvogt(K, x, y) {
  const m = B.maske(); m.poly([[x - 70, y], [x - 70, y - 54], [x - 20, y - 78], [x + 30, y - 54], [x + 30, y]]); m.rect(x - 58, y - 46, 76, 46, 0);
  K.form(4, m, 0, { k: HOLZ, ton: 1.8, fase: 1.5, schatten: 2, muster: (px) => ((Math.round(px) % 5) === 0 ? -0.6 : 0) });
  const boot = B.maske(); boot.poly([[x - 54, y - 14], [x + 14, y - 16], [x + 8, y - 4], [x - 46, y - 3]]); K.form(4, boot, 0, { k: HOLZ, ton: 2.4, fase: 1, rand: 2 });
  const kr = B.maske(); kr.rect(x + 36, y - 14, 18, 14); kr.ell(x + 62, y - 8, 7, 7); kr.ell(x + 62, y - 8, 4, 4, 0); kr.rect(x + 40, y - 26, 12, 12);
  K.form(4, kr, 0, { k: HOLZ, ton: 2, fase: 1, rand: 2, schatten: 2 });
  K.e[4].set(x + 59, y - 12, B.pk('#ad3d28')); K.e[4].set(x + 65, y - 5, B.pk('#ad3d28'));
  B.flamme(K, x - 20, y - 50, { p: 0.5, kern: '#fff4d0', mitte: FENSTER, aussen: '#a05a10', glut: FENSTERG, gross: 1.2 });
  for (const i of [3, 4]) B.gluehen(K.e[i], x - 20, y - 48, 60, FENSTERG, 0.85);
}
// Fund und Ereignis: Strandgut am Fuß der Klippe, eine Seekiste, darauf ein Kompass, nass
function seekiste(K, x, y) {
  const m = B.maske(); m.rect(x - 18, y - 12, 36, 12); m.poly([[x - 18, y - 12], [x - 14, y - 22], [x + 20, y - 21], [x + 18, y - 12]]);
  K.form(4, m, 0, { k: HOLZ, ton: 1.9, fase: 1, schatten: 2, muster: (px, py) => (py === y - 6 ? -0.8 : 0) + ((Math.round(px) - x) % 9 === 0 ? -0.5 : 0) });
  const r = B.maske(); r.ell(x - 26, y - 4, 7, 4); r.ell(x - 26, y - 4, 4, 2, 0); K.form(4, r, 0, { k: KALK.slice(2), ton: 4, fase: 0, rand: 2 });
  const sh = B.maske(); sh.ell(x, y + 1, 26, 2.5); B.form(K.e[4], sh, K.mat(0, { ton: 0, rand: 0, fase: 0 }));
  B.gluehen(K.e[4], x + 2, y - 20, 22, STRAHLG, 0.9);
  K.anim.push({ p: 0.5, f(ctx, t, ox, oy) { if (Math.sin(t * 1.3) > 0.4) { ctx.fillStyle = STRAHL; ctx.fillRect(x + 3 + ox, y - 23 + oy, 1, 1); } } });
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' ? 2 : art === 'kraemer' ? 1 : art === 'ereignis' || art === 'fund' ? 0 : art === 'werkstatt' ? 2 : (o.seed + v) % 3;
  K.kulisse = art === 'waechter' ? 'waechter' : v; // M3: welche Kulisse die Szene zeigt (Schlüssel für die Fahrt, data/fahrt.json)
  let info;
  if (art === 'waechter') info = laterne(K, {});
  else if (art === 'uebergang') info = laterne(K, { treppe: true });
  else info = [k => hof(k, {}), klippe, turmfuss][v](K);
  if (art === 'fund' || art === 'ereignis') seekiste(K, info.mitte[0], info.mitte[1]);
  else if (art === 'kraemer') strandvogt(K, info.mitte[0] + 10, info.mitte[1] - 2);
  else if (art !== 'uebergang') B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.leuchtturm = { pal, build: bauen, reliefStil: { figuren: 4, gelenke: 2, knick: 0.5, stein: ['#2c2b35', '#504d53', '#8e877a', '#dbd0b5'] } };
if (World.BIOME.indexOf('leuchtturm') < 0) World.BIOME.push('leuchtturm');
})();
