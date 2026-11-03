// Saltmoor 1925 · Hintergründe: Akt 1a, Das Hafenviertel (1925).
// Komposition: docs/auftrag/hintergruende-kompositionen.md
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#05070a', '#0b1016', '#141c26', '#22303e'], rand: ['#4a6a8a', '#cfe6ff'], augen: '#ffe9a0', nebel: ['#0e1628', '#2a3a52'] };
const WARM = '#ffd27a', WARMK = '#fff0c0', WARMG = '#6a4416';
const HIMMEL = ['#04060b', '#070b14', '#0b1220', '#111b2e', '#19273d', '#22344c', '#2e4460', '#3c5674'];
const WASSER = ['#04070b', '#080e16', '#0d1622', '#142134', '#1d2e46', '#2a405c'];
const STEIN = ['#06080b', '#0b1016', '#121a24', '#1a2532', '#243243', '#2e4058'];

// ---------- Himmel mit Wolkenbänken, hell über der See ----------
function himmel(K, hor, gx, o) {
  o = o || {}; const e = K.e[0], s = K.o.seed;
  B.feld(e, -M, -M, W + M, hor + 3, HIMMEL, (x, y) => {
    const v = (y + M) / (hor + M), g = Math.exp(-(((x - gx) / 190) ** 2)) * .3 * v * v;
    return v * .62 + g + (B.fbm(x * .012, y * .05, s, 2) - .5) * .1;
  });
  // Wolkenbänke: dunkler Körper, Unterkante vom Horizontschein beleuchtet
  const wol = ['#0a111c', '#101a2a', '#1a283c', '#2c3e58', '#4a6282'];
  B.feld(e, -M, 10, W + M, hor - 8, wol, (x, y) => {
    const band = Math.sin((y - 10) / (hor - 18) * Math.PI * (o.baender || 2.2) + 1.2);
    const c = B.fbm(x * .006 + y * .002, y * .045, s + 9, 3) + band * .12 - .56; if (c < 0) return -1;
    const unter = B.fbm(x * .006 + y * .002, (y + 3) * .045, s + 9, 3) + Math.sin((y + 3 - 10) / (hor - 18) * Math.PI * (o.baender || 2.2) + 1.2) * .12 - .56;
    const licht = Math.exp(-(((x - gx) / 220) ** 2)) * (y / hor);
    return .15 + (unter < 0 ? .55 : 0) * licht + (c < .03 ? .2 * licht : 0);
  });
  B.sterne(e, K.r, 70, -M, -M, W + M, hor * .55, ['#2a3a52', '#4a6282', '#9ab0cc'], (x, y) => !(e.get(x, y) === B.pk(wol[0]) || e.get(x, y) === B.pk(wol[1])));
}

// ---------- Leuchtturm (Bildkoordinaten) ----------
function leuchtturm(K, eb, x, yb, hoch, breit, tiefe, o) {
  o = o || {}; const m = B.maske(), wt = breit * .66, yt = yb - hoch;
  m.poly([[x - breit / 2, yb], [x - wt / 2, yt], [x + wt / 2, yt], [x + breit / 2, yb]]);
  const gal = Math.max(1, hoch * .025);
  m.rect(x - wt / 2 - gal * 1.6, yt - gal, wt + gal * 3.2, gal + 1);           // Galerie
  const lh = hoch * .1, lw = wt * .7;
  m.rect(x - lw / 2, yt - gal - lh, lw, lh);                                  // Laternenhaus
  m.poly([[x - lw / 2 - 1, yt - gal - lh], [x, yt - gal - lh - lh * .7], [x + lw / 2 + 1, yt - gal - lh]]); // Haube
  m.kap(x, yt - gal - lh * 1.7, x, yt - gal - lh * 2.3, .6, .4);
  // Felsfuß
  if (o.fels) m.poly([[x - breit * 1.6, yb + 2], [x - breit * .9, yb - breit * .25], [x + breit * .2, yb - breit * .35], [x + breit * 1.4, yb - breit * .1], [x + breit * 2.2, yb + 2]]);
  K.form(eb, m, tiefe, { ton: 1.1, verlauf: .7, fase: hoch > 120 ? 3 : 1.2 });
  // Fenster am Turm: zugemauert (eine Stufe heller), eines warm
  const n = o.fenster || 4, fw = Math.max(1, breit * .12), fh = Math.max(1, hoch * .035);
  const lit = o.lit === undefined ? 2 : o.lit;
  for (let i = 0; i < n; i++) {
    const q = (i + .6) / (n + .4), fy = yb - hoch * q, fx = x + (i % 2 ? .18 : -.18) * B.lerp(breit, wt, q);
    if (i === lit) { B.dith(K.e[eb], fx - fw / 2, fy - fh / 2, fx + fw / 2, fy + fh / 2, WARM, () => 1); B.gluehen(K.e[eb], fx, fy, 6 + breit * .4, WARMG, .8); }
    else { const f = B.maske(); f.rect(fx - fw / 2, fy - fh / 2, Math.max(1, fw), Math.max(1, fh)); K.form(eb, f, tiefe, { ton: 2.4, rand: 0, fase: 0 }); }
  }
  const ly = yt - gal - lh / 2;
  B.dith(K.e[eb], x - lw / 2 + 1, yt - gal - lh + 1, x + lw / 2 - 1, yt - gal - 1, WARM, (px, py) => .75);
  B.dith(K.e[eb], x - 1, ly - 1, x + 1, ly + 1, WARMK, () => 1);
  for (const L of [K.e[0], K.e[eb]]) B.gluehen(L, x, ly, 26 + hoch * .08, '#3a3418', .9);
  K.licht(x, ly, WARM, 40, 1);
  return [x, ly];
}
// Kegel, der landeinwärts sucht: Pendel statt Kreis
function kegel(K, x, y, mitte, weite, laenge, o) {
  o = o || {}; const fr = K.fr, per = 12;
  B.lichtkegelAnim(K, { x, y, laenge, breite: o.breite || .05, basis: o.basis || 1.5, farbe: [34, 34, 22], kern: [62, 58, 38], staerkeMax: .62, abfall: .55, p: o.p === undefined ? .05 : o.p,
    winkel: t => mitte + weite * Math.sin(t * Math.PI * 2 / per) + .12 * fr * Math.sin(t * .23) });
  // die Lampe selbst
  const g = [B.glanzSprite(7, '#6a6038', .9), B.glanzSprite(9, '#6a6038', .9)];
  K.anim.push({ p: o.p === undefined ? .05 : o.p, f(ctx, t, ox, oy) { const q = g[Math.sin(t * 3) > 0 ? 1 : 0]; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(q, x - q.R + ox, y - q.R + oy); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = WARMK; ctx.fillRect(x + ox, y + oy, 1, 1); } });
}

// ---------- Fassade in Perspektive (Speicher) ----------
// seite +1: Wand links im Bild, schaut nach rechts (zum Licht), -1: Wand rechts
function fassade(K, eb, P, o) {
  const m = B.maske(), sa = 1 / o.Za, sb = 1 / o.Zb, Zm = 2 / (sa + sb), X = o.X, Hh = o.H, g = o.giebel || 0;
  const pts = [P.q(X, -.2, o.Za), P.q(X, Hh, o.Za)];
  if (g) { if (o.treppe) { const n = 4; for (let i = 1; i < n; i++) { const s1 = sa + (sb - sa) * (i / (2 * n)); const Z1 = 1 / s1, Yh = Hh + g * i / n; pts.push(P.q(X, Yh - g / n, Z1)); pts.push(P.q(X, Yh, Z1)); } pts.push(P.q(X, Hh + g, Zm)); for (let i = n - 1; i >= 1; i--) { const s1 = sb - (sb - sa) * (i / (2 * n)); const Z1 = 1 / s1, Yh = Hh + g * i / n; pts.push(P.q(X, Yh, Z1)); pts.push(P.q(X, Yh - g / n, Z1)); } } else pts.push(P.q(X, Hh + g, Zm)); }
  pts.push(P.q(X, Hh, o.Zb), P.q(X, -.2, o.Zb));
  m.poly(pts);
  const ziegel = (x, y) => (B.hash(x >> 1, y, 5) - .5) * .35 + ((y % 3 === 0) ? -.12 : 0);
  K.form(eb, m, o.tiefe, { ton: o.seite > 0 ? .85 : .5, verlauf: .55, fase: 1, muster: ziegel, schatten: o.schatten || 0 });
  // Stirnwand (wenn das Haus vorspringt)
  if (o.stirn) { const s = B.maske(); s.poly([P.q(o.stirn, -.2, o.Za), P.q(o.stirn, Hh, o.Za), P.q(X, Hh, o.Za), P.q(X, -.2, o.Za)]); K.form(eb, s, o.tiefe, { ton: .55, verlauf: .4, fase: 1, muster: ziegel }); }
  // Fenster: alle zugemauert bis auf eines
  const fl = o.geschosse || Math.floor((Hh - 1) / 1.7), sp = o.achsen || 3;
  const fH = 1.05, fB = (sa - sb) / (sp + 1) * .36;
  for (let f = 0; f < fl; f++) for (let a = 0; a < sp; a++) {
    const Y0 = 1.1 + f * 1.7, sMid = sa + (sb - sa) * (a + 1) / (sp + 1);
    const luke = o.luke !== undefined && a === o.luke;
    const s0 = sMid + fB * (luke ? 1.4 : 1), s1 = sMid - fB * (luke ? 1.4 : 1);
    const q = [P.q(X, Y0, 1 / s0), P.q(X, Y0 + (luke ? 1.3 : fH), 1 / s0), P.q(X, Y0 + (luke ? 1.3 : fH), 1 / s1), P.q(X, Y0, 1 / s1)];
    const fm = B.maske(); fm.poly(q); if (fm.leer()) continue;
    const istLicht = o.licht && o.licht[0] === f && o.licht[1] === a;
    if (istLicht) {
      fm.fn(fm.x0, fm.y0, fm.x1, fm.y1, () => true, 0); fm.poly(q);
      const e = K.e[eb];
      for (let y = fm.y0; y <= fm.y1; y++) for (let x = fm.x0; x <= fm.x1; x++) if (fm.has(x, y)) e.set(x, y, B.pk((x === Math.round((fm.x0 + fm.x1) / 2) || y === Math.round((fm.y0 + fm.y1) / 2 - 1)) ? '#5a3a14' : (y > fm.y1 - 1 ? WARMK : WARM)));
      const cx = (fm.x0 + fm.x1) / 2, cy = (fm.y0 + fm.y1) / 2;
      for (const L of [K.e[eb], K.e[0], K.e[1]]) B.gluehen(L, cx, cy, 22, WARMG, .9);
      K.licht(cx, cy, WARM, 26, .8); o.lichtPos = [cx, cy];
    } else {
      const mu = (x, y) => ((y & 1) ? -.5 : 0) + ((((x + (y >> 1) * 2) & 3) === 0) ? -.4 : 0) + (B.hash(x, y, 3) - .5) * .2;
      K.form(eb, fm, o.tiefe, { ton: o.seite > 0 ? 2.5 : 2.1, rand: 0, fase: 0, muster: fm.x1 - fm.x0 > 4 ? mu : null });
      // Laibung: Schattenkante oben und auf der lichtfernen Seite
      const e = K.e[eb], k0 = B.pk(B.mix(pal.koerper[0], K.fern, o.tiefe));
      for (let y = fm.y0; y <= fm.y1; y++) for (let x = fm.x0; x <= fm.x1; x++) if (fm.has(x, y) && (!fm.has(x, y - 1) || (o.seite > 0 ? !fm.has(x - 1, y) : !fm.has(x + 1, y)))) e.set(x, y, k0);
    }
  }
  // Kragbalken mit Rolle über der Ladeluke
  if (o.luke !== undefined) {
    const sMid = sa + (sb - sa) * (o.luke + 1) / (sp + 1), Z = 1 / sMid, Yb = 1.1 + (fl - 1) * 1.7 + 1.6;
    const p1 = P.q(X, Yb, Z), p2 = P.q(X + o.seite * .9, Yb + .05, Z), p3 = P.q(X + o.seite * .9, Yb - 2.6 - (o.seil || 0), Z);
    const k = B.maske(); k.kap(p1[0], p1[1], p2[0], p2[1], Math.max(.8, P.k(Z) * .07), Math.max(.6, P.k(Z) * .05)); k.ell(p2[0], p2[1] + 1, Math.max(1, P.k(Z) * .06), Math.max(1, P.k(Z) * .06));
    k.kap(p2[0], p2[1], p3[0], p3[1], .5, .5); k.ell(p3[0], p3[1], Math.max(1, P.k(Z) * .05), Math.max(1.2, P.k(Z) * .07));
    K.form(eb, k, Math.max(0, o.tiefe - .05), { ton: 1.3, fase: 0 });
  }
}

// ---------- Kai-Pflaster und Wasser (Ebene 4) ----------
function boden(K, P, istKai, o) {
  o = o || {}; const s = K.o.seed;
  K.boden(P.vy + 1, H + M, STEIN.concat([K.fern]), (x, y) => {
    const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; if (!istKai(X, Z)) return -1;
    const k = P.k(Z), cz = .2, cx = .28, row = Math.floor(Z / cz), off = (row & 1) * .5, col = Math.floor(X / cx + off);
    const fx = X / cx + off - col, fz = Z / cz - row, pxw = k * cx, pzh = k * cz * k / P.h;
    const fern = 1 - (y - P.vy) / P.h;
    let t = .2 + .12 * B.hash(col, row, s) + Math.pow(fern, 5) * .6 - (1 - fern) * .1;
    const nass = B.fbm(X * 1.1, Z * 1.6, s + 3, 2); if (nass > .66 && !o.trocken) return .42 + fern * .35 + (Math.sin(y * 2.1 + X * 3) > .6 ? .12 : 0);
    if (pxw > 3) { if (fx * pxw < .9 || fz * Math.max(1, pzh) < .7) t -= .2; else if ((1 - fz) * Math.max(1, pzh) < 1.2 && fx > .4) t += .13; }
    if (o.schiene) for (const sx of o.schiene) if (Math.abs(X - sx) * k < .55 + k * .004) t = .62 + Math.pow(1 - (y - P.vy) / P.h, 3) * .3;
    if (o.rinne && Math.abs(X - o.rinne) * k < 1.2 + k * .02) t = .14;
    if (o.kante !== undefined && o.kante(X, Z) * k < 1.3) t = .7;
    return t;
  });
}
function wasser(K, eb, y0, y1, istWasser, o) {
  o = o || {}; const s = K.o.seed, feld = eb === 4 ? (a, b, c, d, cols, f) => K.boden(b, d, cols, f) : (a, b, c, d, cols, f) => B.feld(K.e[eb], a, b, c, d, cols, f);
  feld(-M, y0, W + M, y1, WASSER, (x, y) => {
    if (istWasser && !istWasser(x, y)) return -1;
    const q = (y - y0) / Math.max(1, y1 - y0), wel = Math.sin(y * 1.7 + B.rausch2(x * .03, y * .25, s) * 6);
    return .22 + Math.pow(1 - q, 5) * .55 + (wel > .75 ? .2 : 0) + (o.glanz ? o.glanz(x, y) : 0);
  });
}
// Spiegelung einer Lichtquelle als senkrechte, unterbrochene Spur
function spiegel(K, eb, x, y0, y1, col, breite, istWasser) {
  const p = B.pk(col);
  for (let y = Math.floor(y0); y < y1; y++) {
    const e = K.e[eb === 4 ? K.eb(y) : eb];
    const q = (y - y0) / (y1 - y0), w = breite * (1 + q * 1.6), v = (1 - q) * .8;
    for (let px = Math.floor(x - w); px <= x + w; px++) { if (istWasser && !istWasser(px, y)) continue; if (Math.sin(y * 2.3 + px * .2) > .1 && B.hash(px, y, 2) < v * (1 - Math.abs(px - x) / (w + 1))) e.set(px, y, p); }
  }
}

// ---------- Kleinkram, gesetzt ----------
function laterne(K, eb, x, yb, hoch, an) {
  const m = B.maske(), k = hoch / 60;
  m.kap(x, yb, x, yb - hoch + 8 * k, 1.4 * k + .4, 1 * k + .3);
  m.kap(x - 4 * k, yb - 1, x + 4 * k, yb - 1, 1.2 * k, 1.2 * k);
  m.poly([[x - 4 * k, yb - hoch + 8 * k], [x - 3 * k, yb - hoch], [x + 3 * k, yb - hoch], [x + 4 * k, yb - hoch + 8 * k]]);
  m.poly([[x - 5 * k, yb - hoch], [x, yb - hoch - 4 * k], [x + 5 * k, yb - hoch]]);
  K.form(eb, m, 0, { ton: 1.2, fase: 1 });
  const gy = yb - hoch + 4 * k;
  if (an) {
    B.dith(K.e[eb], x - 2.5 * k, yb - hoch + 1, x + 2.5 * k, yb - hoch + 8 * k - 1, WARM, () => .9);
    K.glut(x, gy, 62 * k, WARMG, 1, [2, 3, 4]); K.glut(x, yb, 40 * k, '#3a2408', .9, [2, 3, 4]);
    B.flamme(K, Math.round(x), Math.round(gy + 2), { p: B.PAR[eb], kern: WARMK, mitte: WARM, aussen: '#a06a20', glut: '#2a1a06' });
  } else B.dith(K.e[eb], x - 2.5 * k, yb - hoch + 1, x + 2.5 * k, yb - hoch + 8 * k - 1, B.mix(pal.rand[0], pal.koerper[2], .5), () => .5);
}
function kiste(K, eb, x, yb, w, h, tiefe) { const m = B.maske(); m.rect(x - w / 2, yb - h, w, h); K.form(eb, m, tiefe, { ton: 1.6, schatten: 2, muster: (px, py) => (py === Math.round(yb - h / 2) || px === Math.round(x - w / 2 + 2) || px === Math.round(x + w / 2 - 3)) ? -.7 : 0 }); }
function poller(K, eb, x, yb, s, tiefe) { const m = B.maske(); m.rect(x - 2.2 * s, yb - 5 * s, 4.4 * s, 5 * s); m.ell(x, yb - 5 * s, 3.2 * s, 1.6 * s); K.form(eb, m, tiefe, { ton: 1.4, fase: 1, schatten: 1 }); }
function netzGestell(K, eb, a, b, durch, tiefe) {
  // a, b: [x, yUnten, yOben] der beiden Pfähle; das Netz hängt durch
  const m = B.maske();
  m.kap(a[0], a[1], a[0], a[2] - 3, 1.6, 1.2); m.kap(b[0], b[1], b[0], b[2] - 3, 1.4, 1.1);
  m.kap(a[0] - 3, a[2], b[0] + 3, b[2], 1, 1);
  K.form(eb, m, tiefe, { ton: 1.3, fase: 1, schatten: 1 });
  const n = B.maske(), steps = 24, oben = [], unten = [];
  for (let i = 0; i <= steps; i++) { const q = i / steps, x = B.lerp(a[0], b[0], q), y = B.lerp(a[2], b[2], q) + 2; oben.push([x, y]); unten.push([x + Math.sin(q * 9) * 1.5, y + durch * Math.sin(q * Math.PI) * (.8 + .2 * Math.sin(q * 13)) + 8 + (i % 3 === 0 ? 4 : 0)]); }
  n.poly(oben.concat(unten.reverse()));
  n.fn(n.x0, n.y0, n.x1, n.y1, (x, y) => { const xi = Math.floor(x), yi = Math.floor(y); return ((xi + yi) & 3) !== 0 && ((xi - yi) & 3) !== 0; }, 0);
  K.form(eb, n, tiefe, { ton: 1.9, fase: 0, rand: 1 });
  // Schwimmer aus Kork am Netzrand
  for (let i = 1; i < 6; i++) { const q = i / 6, x = B.lerp(a[0], b[0], q), y = B.lerp(a[2], b[2], q) + 3; const f = B.maske(); f.ell(x, y, 1.6, 1.2); K.form(eb, f, tiefe, { ton: 2.2, fase: 0 }); }
}
function schemelKorb(K, eb, x, yb, s) {
  const m = B.maske(); m.rect(x - 5 * s, yb - 7 * s, 10 * s, 2 * s); m.kap(x - 4 * s, yb - 5 * s, x - 5 * s, yb, .9 * s, .9 * s); m.kap(x + 4 * s, yb - 5 * s, x + 5 * s, yb, .9 * s, .9 * s);
  m.poly([[x + 8 * s, yb], [x + 7 * s, yb - 7 * s], [x + 17 * s, yb - 7 * s], [x + 16 * s, yb]]);
  K.form(eb, m, 0, { ton: 1.4, fase: 1, schatten: 2, muster: (px, py) => (px >= x + 7 * s && (py & 1)) ? .5 : 0 });
}
// Kran (Wippkran): Bildkoordinaten, Ausleger als Fachwerk
function kran(K, eb, x, yb, s, tiefe, spitze) {
  const m = B.maske(), sp = s;
  m.poly([[x - 16 * sp, yb], [x - 10 * sp, yb - 50 * sp], [x + 10 * sp, yb - 50 * sp], [x + 16 * sp, yb]]);
  m.poly([[x - 11 * sp, yb - 4 * sp], [x - 6 * sp, yb - 44 * sp], [x + 6 * sp, yb - 44 * sp], [x + 11 * sp, yb - 4 * sp]], 0);
  m.rect(x - 12 * sp, yb - 70 * sp, 22 * sp, 20 * sp);                     // Haus
  m.poly([[x - 14 * sp, yb - 70 * sp], [x - 2 * sp, yb - 78 * sp], [x + 12 * sp, yb - 70 * sp]]);
  const bx = x + 4 * sp, by = yb - 66 * sp, ex = spitze[0], ey = spitze[1];
  // Fachwerk-Ausleger: zwei Gurte und Zickzack
  const nx = -(ey - by), ny = ex - bx, nl = Math.hypot(nx, ny), ux = nx / nl * 4 * sp, uy = ny / nl * 4 * sp;
  m.kap(bx, by, ex, ey, 1.2 * sp, .7); m.kap(bx + ux, by + uy, ex + ux * .3, ey + uy * .3, 1 * sp, .6);
  const n = 14; for (let i = 0; i < n; i++) { const q0 = i / n, q1 = (i + 1) / n; m.kap(B.lerp(bx, ex, q0) + ux * (1 - q0 * .7), B.lerp(by, ey, q0) + uy * (1 - q0 * .7), B.lerp(bx, ex, q1), B.lerp(by, ey, q1), .5, .5); }
  m.kap(x - 2 * sp, yb - 78 * sp, ex, ey, .5, .5);                          // Abspannung
  m.kap(ex, ey, ex, ey + 60 * sp, .5, .5); m.ell(ex, ey + 62 * sp, 1.6 * sp, 2 * sp); // Seil und Haken
  K.form(eb, m, tiefe, { ton: 1.2, fase: 1, verlauf: .5 });
}
// Fußspuren zum Wasser (ab fremdheit 0,3)
function spuren(K, P, von, nach, n) {
  const c = B.pk(STEIN[0]), c2 = B.pk(STEIN[3]);
  for (let i = 0; i < n; i++) {
    const q = i / n, X = B.lerp(von[0], nach[0], q) + Math.sin(q * 5) * .3 + (i & 1 ? .12 : -.12), Z = B.lerp(von[1], nach[1], q);
    const [x, y] = P.q(X, 0, Z), k = P.k(Z) * .07;
    const e = K.e[K.eb(y)];
    for (let j = -1; j <= 1; j++) { e.set(x + j * Math.max(1, k) * .7, y, c); if (k > 1.5) e.set(x + j, y - 1, c2); }
  }
}

// =====================================================================
// Variante 0: Am Kai
function kai(K, o) {
  o = o || {}; const r = K.r, fr = K.fr, P = B.persp(372, 134); K.split = [146, 158];
  himmel(K, 136, 430);
  // See fern (Ebene 1)
  wasser(K, 1, 134, 180, null);
  // Mole und Leuchtturm rechts, auf der Landzunge über der Bucht
  const mm = B.maske(); mm.poly([P.q(3, .2, 14), P.q(4.2, .2, 14), [452, 138], [480 + M, 136], [480 + M, 140.5], [452, 140.5], P.q(4.2, -.3, 14), P.q(3, -.3, 14)]);
  K.form(1, mm, .55, { ton: 1.2, fase: 1 });
  let lamp;
  if (!o.uebergang) {
    lamp = leuchtturm(K, 1, 441, 139, 96, 15, .48, { lit: 2 });
    const fm = B.maske(); fm.poly([[422, 140], [430, 134], [452, 133], [466, 139]]); K.form(1, fm, .5, { ton: 1, fase: 1 });
  } else kirchmauer(K, 1, 430, 140, .5);
  const kante = 3.05, ende = 14;
  const istKai = (X, Z) => X > -15.2 && ((Z < ende && X < kante) || X < -8);
  wasser(K, 4, 134, H + M, null, { glanz: (x, y) => 0 });
  boden(K, P, istKai, { schiene: [-5.3, -6.7], kante: (X, Z) => Z < ende ? Math.abs(X - kante) : (X > -8.5 && X < -8 ? 0 : 9) });
  // Speicherflucht links: jedes Haus anders hoch, eines springt vor (Stirnwand sichtbar)
  const H1 = [
    { X: -15, Za: 4.6, Zb: 8.2, H: 9.6 + r.j(.3), giebel: 2.6, treppe: true, eb: 3, tiefe: .06, achsen: 3, luke: 1 },
    { X: -15.8, Za: 8.2, Zb: 11.6, H: 8.4 + r.j(.3), giebel: 2.2, eb: 3, tiefe: .16, achsen: 3 },
    { X: -14.6, Za: 11.6, Zb: 16.5, H: 9.3, giebel: 2.6, treppe: true, eb: 2, tiefe: .3, achsen: 3, luke: 1, stirn: -15.8, licht: [3, 2] },
    { X: -15.4, Za: 16.5, Zb: 23, H: 7.6 + r.j(.4), giebel: 2, eb: 2, tiefe: .42, achsen: 3 },
    { X: -15, Za: 23, Zb: 34, H: 8.2, giebel: 2.4, treppe: true, eb: 1, tiefe: .55, achsen: 4 },
    { X: -14, Za: 34, Zb: 60, H: 5, giebel: 1.4, eb: 1, tiefe: .66, achsen: 3 }
  ];
  for (const h of H1.slice().reverse()) fassade(K, h.eb, P, Object.assign({ seite: 1, schatten: 0 }, h));
  const lit = H1[2].lichtPos;
  // Kran zwischen Speicher und Kante, Ausleger zieht den Blick zum Leuchtturm
  kran(K, 2, 268, 149, .95, .3, [392, 34]);
  // Nebel hinter den Figuren (deckt Ebenen 0–2)
  B.nebel(K.e[2], { y0: 92, y1: 168, col: B.mix(pal.nebel[1], K.fern, .4), dichte: .34, xs: [20, 470, 70], seed: 4 });
  // Boden: Kai mit Kranschiene, rechts das Hafenbecken
  // Bodennebel, schmal
  B.nebel(K.e[2], { y0: 134, y1: 150, col: B.mix(pal.nebel[1], K.fern, .3), dichte: .3, seed: 8 });
  // Spiegelungen auf dem Wasser
  const iw = (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; return !istKai(X, Z); };
  if (lamp) spiegel(K, 4, lamp[0], 140, 200, '#8a7a4a', 1.5, iw);
  // Spiegelung des Fensters im nassen Pflaster
  if (lit) K.bodenDith(lit[0] - 6, 150, lit[0] + 8, 200, '#3a2c14', (x, y) => .22 * Math.exp(-(((x - lit[0] - 2) / 4) ** 2)) * (Math.sin(y * 1.9) > 0 ? 1 : 0));
  // Poller an der Kante, Taue ins Wasser
  for (const Z of [5.3, 9.6]) { const [x, y] = P.q(2.75, 0, Z); poller(K, K.eb(y), x, y, P.k(Z) / 26, 0); const t = B.maske(); t.pfad([[x + 1, y - 3], [x + 14, y + 2], [x + 30, y + 10]], .7, .6); K.form(K.eb(y), t, 0, { ton: 1.5, fase: 0, rand: 1 }); }
  // Laterne an der Ecke des ersten Speichers, Kisten an der Ladetür
  const [lx, ly] = P.q(-13.2, 0, 6.4);
  laterne(K, K.eb(ly), lx, ly, 56, fr < .65);
  const [kx, ky] = P.q(-14.3, 0, 7.4);
  const ke = K.eb(ky + 2); kiste(K, ke, kx + 4, ky + 1, 16, 13, 0); kiste(K, ke, kx + 18, ky + 2, 13, 11, 0); kiste(K, ke, kx + 8, ky - 12, 12, 10, 0);
  // Netzgestell rechts vorn: hier wird geflickt
  const a = P.q(2.15, 0, 3.15), a2 = P.q(2.15, 1.75, 3.15), b = P.q(2.15, 0, 4.6), b2 = P.q(2.15, 1.7, 4.6);
  netzGestell(K, K.eb(b[1]), [b[0], b[1], b2[1]], [a[0], a[1], a2[1]], 26, 0);
  const st = P.q(1.35, 0, 3.4); schemelKorb(K, K.eb(st[1]), st[0], st[1], 1.1);
  if (fr > .3) spuren(K, P, [-1.5, 1.9], [kante, 3.9], Math.round(10 + fr * 8));
  // Vordergrund: Dalben rechts mit Tau, Seil oben, Kistenkante unten links
  const v = B.maske();
  v.poly([[466, H + M], [469, 74], [474, 70], [480 + M, 70], [480 + M, H + M]]);
  v.kap(466, 120, 492, 134, 3, 3); v.kap(464, 132, 492, 146, 3, 3);
  v.poly([[-M, 238], [44, 236], [50, 270 + M], [-M, 270 + M]]);
  v.pfad([[-M, 12], [60, 30], [140, 26], [200, 4], [240, -M]], 1.2, 1);
  K.form(5, v, 0, { ton: .5, fase: 1.5, k: ['#020305', '#05070a', '#0b1016', '#141c26'] });
  // Lichtkegel des Leuchtturms: sucht über den Dächern, landeinwärts
  if (lamp) kegel(K, lamp[0], lamp[1], Math.PI + .14 + .14 * fr, .32, 470);
  B.wasserGlanz(K, { x0: 380, x1: 480, y0: 137, y1: 200, n: 70, farben: ['#2a405c', '#4a6a8a', '#7a8a7a'], p: .5, pow: 1.4, maske: iw, laengeNah: 3 });
  B.partikel(K, { n: 60, farben: ['#2a3a52', '#3c5070', '#6a86a8'], vx: -14, vy: 70, laenge: 2, p: 1 });
  K.reihen = [{ y: 164, skala: .9, nebel: .35 }, { y: 189, skala: 1, nebel: .15 }, { y: 213, skala: 1, nebel: 0 }];
  return { P, mitte: [236, 206] };
}

// Variante 1: Lagerhaus-Gasse
function gasse(K) {
  const r = K.r, fr = K.fr, P = B.persp(268, 122); K.split = [140, 156];
  himmel(K, 124, 270, { baender: 1.4 });
  wasser(K, 1, 122, 150, null);
  const lamp = leuchtturm(K, 1, 272, 123, 40, 6, .56, { lit: 1, fenster: 3 });
  // Mole hinten quer
  const mm = B.maske(); mm.rect(200, 120, 140, 4); K.form(1, mm, .58, { ton: 1, fase: 1 });
  // Wände: links höher, rechts niedriger, Häuser unterschiedlich
  const L = [{ X: -2.7, Za: 1.2, Zb: 4.2, H: 13 }, { X: -2.8, Za: 4.2, Zb: 8.5, H: 11.5, giebel: 2.4, treppe: true }, { X: -2.6, Za: 8.5, Zb: 22, H: 9, giebel: 2 }];
  const R = [{ X: 2.3, Za: 1.2, Zb: 5.6, H: 10.5, luke: 1 }, { X: 2.4, Za: 5.6, Zb: 12, H: 8.6, giebel: 2.2, licht: [4, 2] }, { X: 2.2, Za: 12, Zb: 22, H: 7.2, giebel: 1.6, treppe: true }];
  L.forEach((h, i) => fassade(K, i < 2 ? 3 : 2, P, Object.assign({ seite: 1, tiefe: [.04, .14, .34][i], achsen: [2, 3, 4][i], luke: i === 1 ? 1 : undefined }, h)));
  R.forEach((h, i) => fassade(K, i < 2 ? 3 : 2, P, Object.assign({ seite: -1, tiefe: [.06, .18, .36][i], achsen: [3, 3, 4][i] }, h)));
  const lit = R[1].lichtPos;
  // Netze zum Trocknen über der Gasse
  const n1 = P.q(-2.7, 4.6, 5.2), n2 = P.q(2.4, 4.3, 6.4);
  netzGestellQuer(K, 3, n1, n2, 34, .1);
  B.nebel(K.e[2], { y0: 84, y1: 150, col: B.mix(pal.nebel[1], K.fern, .4), dichte: .3, xs: [150, 400, 50], seed: 5 });
  boden(K, P, (X, Z) => Math.abs(X + .2) < 2.6, { rinne: 0 });
  // Pfützen spiegeln das warme Fenster
  if (lit) { for (const [Z, w] of [[2.2, 1.4], [3.4, 1]]) { const [x, y] = P.q(.4, 0, Z), k = P.k(Z); K.bodenDith(x - w * k * .5, y - 3, x + w * k * .5, y + 4, '#22324a', (px, py) => ((px - x) / (w * k * .5)) ** 2 + ((py - y - .5) / 3.5) ** 2 < 1 ? .9 : 0); K.bodenDith(x + (lit[0] - 268) * .2 - 2, y - 3, x + (lit[0] - 268) * .2 + 3, y + 4, WARM, (px, py) => ((px - x) / (w * k * .5)) ** 2 + ((py - y - .5) / 3.5) ** 2 < 1 && (py & 1) ? .7 : 0); } }
  // Fass unter dem Fallrohr
  const [fx, fy] = P.q(2.0, 0, 2.6), fk = P.k(2.6) / 40;
  const f = B.maske(); f.poly([[fx - 9 * fk, fy], [fx - 10 * fk, fy - 12 * fk], [fx - 9 * fk, fy - 24 * fk], [fx + 9 * fk, fy - 24 * fk], [fx + 10 * fk, fy - 12 * fk], [fx + 9 * fk, fy]]); f.kap(fx + 4 * fk, fy - 24 * fk, fx + 7 * fk, -M, 1.6 * fk, 1.6 * fk);
  K.form(K.eb(fy), f, 0, { ton: 1.3, schatten: 2, muster: (x, y) => (Math.abs(y - (fy - 6 * fk)) < 1 || Math.abs(y - (fy - 18 * fk)) < 1) ? .8 : 0 });
  if (fr < .65) { const [lx, ly] = P.q(-2.5, 0, 3.2); laterne(K, K.eb(ly), lx + 6, ly, 54, true); }
  if (fr > .3) spuren(K, P, [-.6, 1.6], [.4, 9], 14);
  const v = B.maske(); v.poly([[-M, -M], [30, -M], [26, 90], [34, 120], [28, H + M], [-M, H + M]]); v.kap(30, 60, 60, 66, 2, 1.5); v.pfad([[480 + M, 30], [440, 46], [400, 40], [372, 24]], 1, .8);
  K.form(5, v, 0, { ton: .5, fase: 1.5, k: ['#020305', '#05070a', '#0b1016', '#141c26'] });
  // Kegel zeigt in die Gasse hinein, auf uns zu
  kegel(K, lamp[0], lamp[1], Math.PI / 2 + .1, .75, 300, { breite: .09, basis: 2 });
  B.partikel(K, { n: 50, farben: ['#2a3a52', '#3c5070', '#6a86a8'], vx: -6, vy: 70, laenge: 2 });
  K.reihen = [{ y: 162, skala: .9, nebel: .35 }, { y: 188, skala: 1, nebel: .15 }, { y: 213, skala: 1, nebel: 0 }];
  return { P, mitte: [258, 204] };
}
function netzGestellQuer(K, eb, a, b, durch, tiefe) {
  const m = B.maske(), pts = [];
  for (let i = 0; i <= 20; i++) { const q = i / 20; pts.push([B.lerp(a[0], b[0], q), B.lerp(a[1], b[1], q) + Math.sin(q * Math.PI) * 10]); }
  m.pfad(pts, .7, .7); K.form(eb, m, tiefe, { ton: 1.4, fase: 0, rand: 1 });
  // drei Netze in Bahnen, verschieden lang
  [[.15, .38, 1], [.45, .62, .7], [.7, .86, 1.15]].forEach(([q0, q1, l]) => {
    const n = B.maske(), top = [], bot = [];
    for (let i = 0; i <= 8; i++) { const q = B.lerp(q0, q1, i / 8), x = B.lerp(a[0], b[0], q), y = B.lerp(a[1], b[1], q) + Math.sin(q * Math.PI) * 10; top.push([x, y]); bot.push([x + 1, y + durch * l * (.8 + .25 * Math.sin(i * 1.7)) + (i % 2) * 3]); }
    n.poly(top.concat(bot.reverse()));
    n.fn(n.x0, n.y0, n.x1, n.y1, (x, y) => { const xi = Math.floor(x), yi = Math.floor(y); return ((xi + yi) & 3) !== 0 && ((xi - yi) & 3) !== 0; }, 0);
    K.form(eb, n, tiefe, { ton: 1.9, fase: 0, rand: 1 });
  });
}

// Variante 2: Bootssteg
function steg(K) {
  const r = K.r, fr = K.fr, P = B.persp(206, 154); K.split = [160, 166];
  himmel(K, 156, 330, { baender: 2.6 });
  wasser(K, 1, 154, H + M, null);
  // Ufer rechts mit kleinem Viertel, ein Fenster warm
  const u = B.maske(); u.poly([[250, 156], [270, 150], [300, 149], [480 + M, 146], [480 + M, 158], [250, 158]]); K.form(1, u, .6, { ton: 1, fase: 1 });
  const P2 = B.persp(206, 154, 154 + 40);
  let lit = null; let x = 286;
  for (let i = 0; i < 7; i++) {
    const w = 18 + r.f(0, 14) + (i === 3 ? 10 : 0), hh = 18 + r.f(0, 16) + (i === 3 ? 10 : 0), m = B.maske(), yb = 150 - i * .4;
    m.rect(x, yb - hh, w, hh + 2); m.poly([[x - 1, yb - hh], [x + w / 2, yb - hh - 7 - r.f(0, 5)], [x + w + 1, yb - hh]]);
    K.form(1, m, .5, { ton: 1.1, verlauf: .6, fase: 1 });
    for (let f = 0; f < 3; f++) for (let a = 0; a < 3; a++) { const fx = x + 3 + a * (w - 6) / 2.3, fy = yb - hh + 4 + f * 6; if (fy > yb - 3) continue; if (i === 3 && f === 0 && a === 2) { B.dith(K.e[1], fx, fy, fx + 2, fy + 3, WARM, () => 1); lit = [fx + 1, fy + 1]; B.gluehen(K.e[1], fx + 1, fy + 1, 14, WARMG, .9); B.gluehen(K.e[0], fx + 1, fy + 1, 14, WARMG, .9); } else { const q = B.maske(); q.rect(fx, fy, 2, 3); K.form(1, q, .5, { ton: 2.2, rand: 0, fase: 0 }); } }
    x += w + r.f(-2, 6);
  }
  void P2;
  // Leuchtturm links auf der Landzunge
  const lz = B.maske(); lz.poly([[-M, 158], [-M, 148], [60, 146], [118, 140], [150, 141], [170, 152], [200, 157]]); K.form(1, lz, .52, { ton: 1.1, fase: 1 });
  const lamp = leuchtturm(K, 1, 134, 142, 54, 9, .46, { lit: 1, fenster: 3 });
  // Steg: breiter Anleger, Planken als Fluchtlinien
  const istSteg = (X, Z) => X > -2.5 && X < 4.1 && Z < 30;
  B.nebel(K.e[2], { y0: 110, y1: 166, col: B.mix(pal.nebel[1], K.fern, .4), dichte: .3, xs: [40, 460, 60], seed: 6 });
  const HOLZ = ['#06070a', '#0c0f14', '#151a22', '#1f2632', '#2c3646', K.fern];
  const iw = (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; return !istSteg(X, Z); };
  wasser(K, 4, 155, H + M, iw);
  K.boden(155, H + M, HOLZ, (x, y) => {
    const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; if (!istSteg(X, Z)) return -1;
    const k = P.k(Z), pw = .32, i = Math.floor(X / pw), f = X / pw - i;
    let t = .24 + .1 * B.hash(i, 0, 3) + .08 * B.rausch2(i * 3, Z * .4, 2) + Math.pow(1 - (y - 154) / 116, 6) * .5;
    if (f * pw * k < .9) t = .1; else if ((1 - f) * pw * k < 1.1) t += .14;
    const naht = Z * 1.0 + B.hash(i, 1, 4) * 3; if ((naht % 3.2) * k / Z < .8 && k > 6) t = .12;
    if (Math.abs(X - 4.1) * k < 1.2 || Math.abs(X + 2.5) * k < 1.2) t = .66;
    return t;
  });
  // Pfähle unregelmäßig, oft geflickt
  for (const [X, Z, hh] of [[-2.6, 2.2, 1.4], [-2.6, 4.1, 1.2], [-2.6, 7.6, 1.5], [4.2, 2.6, 1.6], [4.2, 5.4, 1.1], [4.2, 9.8, 1.5], [-2.6, 13, 1.2], [4.2, 18, 1.4]]) {
    const [x, y] = P.q(X, 0, Z), k = P.k(Z), m = B.maske();
    m.kap(x, y + k * .5, x + (X > 0 ? 1 : -1) * k * .02, y - k * hh, k * .1 + .4, k * .09 + .3);
    K.form(K.eb(y), m, Z < 6 ? 0 : .2, { ton: 1.3, fase: 1 });
  }
  // Boote links festgemacht
  for (const [X, Z, l] of [[-4.3, 3.4, 2.6], [-5.6, 7, 2.2]]) {
    const [x, y] = P.q(X, -.3, Z), k = P.k(Z), m = B.maske(), L2 = l * k * .5;
    m.poly([[x - L2, y - k * .32], [x - L2 * .8, y], [x + L2 * .9, y], [x + L2 * 1.1, y - k * .4], [x + L2 * .2, y - k * .3]]);
    m.kap(x - L2 * .3, y - k * .32, x - L2 * .3, y - k * 1.6, .6, .5);
    K.form(K.eb(y), m, Z < 5 ? .02 : .2, { ton: 1.3, fase: 1.5, schatten: 1 });
    const t = B.maske(); t.pfad([[x + L2 * .9, y - k * .3], [x + L2 * 1.5, y - k * .1], P.q(-2.5, .2, Z + .5)], .5, .5); K.form(K.eb(y), t, 0, { ton: 1.6, fase: 0, rand: 1 });
  }
  // Laterne am Stegende
  if (fr < .65) { const [lx, ly] = P.q(3.9, 0, 6.5); laterne(K, K.eb(ly), lx, ly, 34, true); }
  if (lit) spiegel(K, 4, lit[0], 158, 186, '#6a5028', 1, iw);
  spiegel(K, 4, lamp[0], 158, 230, '#8a7a4a', 1.5, iw);
  const v = B.maske(); v.poly([[480 + M, 180], [452, 196], [440, 270 + M], [480 + M, 270 + M]]); v.kap(-M, 220, 40, 240, 4, 4); v.kap(20, 160, 26, 270 + M, 5, 6);
  K.form(5, v, 0, { ton: .5, fase: 1.5, k: ['#020305', '#05070a', '#0b1016', '#141c26'] });
  kegel(K, lamp[0], lamp[1], .1, .26, 420);
  B.wasserGlanz(K, { x0: -M, x1: W + M, y0: 156, y1: 270, n: 110, farben: ['#2a405c', '#4a6a8a'], p: .5, pow: 1.6, maske: iw, laengeNah: 4 });
  B.partikel(K, { n: 40, farben: ['#2a3a52', '#4a6282', '#8aa2c0'], vx: -20, vy: 6, wob: 4, p: 1 });
  K.reihen = [{ y: 168, skala: .9, nebel: .35 }, { y: 192, skala: 1, nebel: .15 }, { y: 214, skala: 1, nebel: 0 }];
  return { P, mitte: [220, 206] };
}

// Wächter: am Fuß des Leuchtturms
function waechter(K) {
  const fr = K.fr; K.split = [198, 204];
  himmel(K, 200, 470, { baender: 1.6 });
  wasser(K, 1, 196, H + M, null);
  // ferne Küste links mit der Stadt
  const k = B.maske(); k.poly([[-M, 198], [-M, 186], [40, 184], [90, 188], [150, 192], [200, 198]]); K.form(1, k, .6, { ton: 1, fase: 1 });
  const lamp = leuchtturm(K, 2, 356, 214, 196, 64, .08, { lit: 2, fenster: 5, fels: false });
  // Felsen am Fuß, Plattform aus Steinplatten
  const f = B.maske(); f.poly([[180, 214], [220, 196], [280, 192], [330, 200], [420, 196], [470, 186], [480 + M, 190], [480 + M, 230], [180, 230]]);
  K.form(3, f, 0, { ton: 1.1, fase: 2, verlauf: .5, muster: (x, y) => (B.rausch2(x * .12, y * .2, 4) - .5) * .8 });
  K.boden(204, H + M, STEIN, (x, y) => { const q = (y - 204) / 66; const plat = Math.floor((x + Math.floor(y / 14) * 23) / 52); return (B.rausch2(x * .05, y * .1, 7) - .5) * .3 + .22 + .12 * B.hash(plat, Math.floor(y / 14), 3) - q * .2 + (((y % 14) === 0 || ((x + Math.floor(y / 14) * 23) % 52) === 0) ? -.2 : 0); });
  B.nebel(K.e[2], { y0: 120, y1: 206, col: B.mix(pal.nebel[1], K.fern, .4), dichte: .26, xs: [20, 300, 60], seed: 3 });
  kegel(K, lamp[0], lamp[1], Math.PI + .3, .34, 470, { p: .15 });
  B.wasserGlanz(K, { x0: -M, x1: 200, y0: 198, y1: 240, n: 50, farben: ['#2a405c', '#4a6a8a'], p: .05 });
  // Gischt am Fels
  B.partikel(K, { n: 50, farben: ['#4a6a8a', '#8aa2c0', '#cfe6ff'], x0: 160, x1: 300, y0: 170, y1: 215, vy: -6, wob: 6, wf: 1.3, blink: .9, p: .3 });
  B.partikel(K, { n: 40, farben: ['#2a3a52', '#3c5070'], vx: -16, vy: 60, laenge: 2 });
  if (fr < .5) laterne(K, 3, 226, 198, 40, true);
  K.reihen = [{ y: 196, skala: .9, nebel: .3 }, { y: 206, skala: 1, nebel: .12 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [240, 210] };
}

// Übergang: Die Kais enden an einer Kirchenmauer, die halb im Wasser steht
function kirchmauer(K, eb, x, yb, tiefe) {
  const m = B.maske();
  m.rect(x - 60, yb - 40, 100, 44); m.poly([[x - 64, yb - 40], [x - 10, yb - 58], [x + 44, yb - 40]]);
  m.rect(x + 14, yb - 86, 18, 46); m.poly([[x + 12, yb - 86], [x + 23, yb - 104], [x + 34, yb - 86]]);
  m.fn(x + 18, yb - 80, x + 28, yb - 66, (px, py) => ((px - x - 23) / 4) ** 2 + ((py - yb + 70) / 6) ** 2 < 1 || (py > yb - 72 && Math.abs(px - x - 23) < 4), 0);
  m.fn(x - 40, yb - 34, x - 20, yb - 12, (px, py) => py > yb - 26 || ((px - x + 30) / 6) ** 2 + ((py - yb + 26) / 8) ** 2 < 1, 0);
  K.form(eb, m, tiefe, { ton: 1.2, verlauf: .6, fase: 1.5 });
  const g = B.maske(); g.ell(x + 23, yb - 70, 3, 3.5); K.form(eb, g, tiefe - .2, { ton: 2 });
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art;
  let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'kraemer' ? 0 : art === 'rast' ? 2 : art === 'werkstatt' ? 1 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = waechter(K);
  else if (art === 'uebergang') info = kai(K, { uebergang: true });
  else info = [kai, gasse, steg][v](K);
  B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.hafen = { pal, build: bauen, reliefStil: { figuren: 4, gelenke: 3, knick: .5 } };
})();
