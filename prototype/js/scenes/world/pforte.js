// Saltmoor 1925 · Hintergründe: Akt 5, Die Pforte (Auftrag 2, M7, neu entworfen). Dazu die Sonderszene „ankunft“.
// Komposition: docs/auftrag-2/biome/pforte-neu.md
// Der Hafen unten: der Kai aus Akt I, nur am Grund des Meeres und seitenverkehrt. Speicher rechts, Leuchtturm links,
// Licht von LINKS. Statt Himmel die Unterseite der See mit hängenden Rümpfen und Ketten. Die Laternen brennen schwarz.
// Am Ende des Kais steht das Wasser als Wand; die Pforte ist der Spalt, an dem sie sich öffnet.
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#030606', '#081010', '#0e1c1c', '#163030'], rand: ['#2a8a7a', '#a0fff0'], augen: '#ff6ad8', nebel: ['#061212', '#1a3a3a'] };
const LL = [-.75, -.66];
// Decke: Unterseite der See (hell, gewellt); Wand: stehendes Wasser; Stein: Kai
const DECKE = ['#030808', '#061212', '#0a1c1c', '#0f2828', '#163836', '#1e4a46', '#2a605a', '#3a7c74', '#5aa69a'];
const WAND = ['#020606', '#040c0c', '#071414', '#0b1e1e', '#102a2a', '#163836', '#204a46', '#2e625c'];
const STEIN = ['#030606', '#060d0d', '#0a1515', '#101f1f', '#172b2a', '#20393a', '#2c4c4a', '#3e6862'];
const BECKEN = ['#020505', '#040b0b', '#071313', '#0b1d1c', '#112a28', '#1a3c38'];
const LEER = ['#000101', '#010303', '#020606', '#040a0a', '#071010'];
// schwarze Flamme: Körper fast schwarz, Rand blasses Magenta (die einzigen „Lichter“ der Menschen hier)
const FL = { kern: '#000000', koerper: '#000000', innen: '#2a0a24', rand: '#ff8ae0', hell: '#ffd8f4', hof: '#000303' };
const WARM = '#ffd27a', WARMK = '#fff0c0', WARMG = '#6a4416';

function gespiegelt(K) { const m0 = K.mat; K.mat = (t, x) => m0(t, Object.assign({ L: LL }, x || {})); }

// ---------- Decke: die See von unten ----------
function decke(K, ybis, gx) {
  const e = K.e[0], s = K.o.seed;
  B.feld(e, -M, -M, W + M, ybis + 2, DECKE, (x, y) => {
    const v = 1 - (y + M) / (ybis + M);            // oben = Oberfläche nah und hell
    const fen = Math.exp(-(((x - gx) / 170) ** 2)) * .25 * v;   // Lichtfenster links
    const wel = Math.sin(x * .045 + y * .5 + B.fbm(x * .02, y * .08, s, 2) * 7);
    const netz = Math.sin(x * .11 - y * .2 + B.fbm(x * .03, y * .1, s + 5, 2) * 5);
    return .14 + v * .55 + fen + (wel > .72 ? .14 * v : 0) + (netz > .86 ? .1 * v : 0) - (y > ybis - 8 ? (y - ybis + 8) * .03 : 0);
  });
}
// Rumpf eines Bootes von unten (kieloben über uns), mit Kette, die herabhängt
function rumpf(K, eb, x, y, len, tiefe, kette) {
  const m = B.maske(), b = len * .17, L2 = len / 2;
  // von unten gesehen: spitzer Bug rechts, breites Heck links, Kiel als Grat in der Mitte, Planken längs
  m.fn(x - L2 - 1, y - b - 1, x + L2 + 1, y + b + 1, (px, py) => { const u = (px - x) / L2; if (u < -1 || u > 1) return false; const w = b * Math.pow(1 - Math.pow(Math.max(0, u), 2), .9) * (u < 0 ? Math.pow(1 - Math.pow(-u, 6), .5) : 1); return Math.abs(py - y) < w; });
  K.form(eb, m, tiefe, { ton: .8, fase: 1.5, rand: 2, schatten: 1, muster: (px, py) => { const u = (py - y) / b; return Math.abs(u) < .12 ? .9 : (Math.abs(u * 4 - Math.round(u * 4)) < .12 ? -.5 : 0); } });
  if (kette) {
    const c = B.maske(), x2 = x + kette[0], y2 = y + kette[1];
    for (let i = 0; i <= kette[1] / 3; i++) { const q = i / (kette[1] / 3), px = x + (x2 - x) * q + Math.sin(q * 3) * 1.5, py = y + b * .6 + (y2 - y) * q; if (i & 1) c.ell(px, py, .8, 1.6); else c.ell(px, py, 1.4, .9); }
    if (kette[2]) { const ax = x2 + Math.sin(3) * 1.5, ay = y2 + b * .4; c.kap(ax, ay, ax, ay + 8, .9, .9); c.pfad([[ax - 5, ay + 5], [ax - 3, ay + 9], [ax, ay + 10], [ax + 3, ay + 9], [ax + 5, ay + 5]], .9, .9); }
    K.form(eb, c, tiefe, { ton: 1.6, fase: 0, rand: 1 });
  }
}
// ---------- Wand aus stehendem Wasser ----------
function wand(K, eb, y0, y1, o) {
  o = o || {}; const s = K.o.seed, e = K.e[eb], ist = o.maske || (() => true);
  B.feld(e, -M, y0, W + M, y1, WAND, (x, y) => {
    if (!ist(x, y)) return -1;
    const q = (y - y0) / Math.max(1, y1 - y0);
    // Wellen liegen waagerecht in der Wand wie Schichten, dazu senkrechte Schlieren
    const schicht = Math.sin(y * .42 + B.rausch2(x * .025, y * .05, s) * 5);
    const schliere = B.fbm(x * .3, y * .012, s + 7, 2);
    const gross = B.fbm(x * .008, y * .02, s + 11, 3);
    let t = .3 + (1 - q) * .24 + (schicht > .84 ? .13 : schicht < -.85 ? -.1 : 0) + (schliere - .5) * .2 + (gross - .5) * .3;
    if (o.licht) t += Math.exp(-(((x - o.licht[0]) / o.licht[1]) ** 2)) * .18 * (1 - q * .5);
    return t - (q > .9 ? (q - .9) * 2 : 0);
  });
  // Oberkante: wo die Wand in die Decke übergeht, eine helle Naht
  B.dith(e, -M, y0, W + M, y0 + 3, DECKE[6], (x, y) => ist(x, y) ? .55 - (y - y0) * .18 : 0);
}
// Fisch, der still in der Wand steht (Silhouette mit Randlicht von links)
function fisch(K, eb, x, y, l, tiefe, dir) {
  const m = B.maske(), d = dir || 1;
  m.ell(x, y, l * .42, l * .16); m.poly([[x - d * l * .38, y], [x - d * l * .62, y - l * .16], [x - d * l * .58, y + l * .17]]);
  m.poly([[x - d * l * .05, y - l * .14], [x + d * l * .08, y - l * .27], [x + d * l * .16, y - l * .12]]);
  K.form(eb, m, tiefe, { ton: 1.1, fase: 1, rand: 1 });
  K.e[eb].set(x + d * l * .3, y - 1, B.pk(B.mix(WAND[6], pal.rand[1], .3)));
}
// Der Spalt: die Wand öffnet sich. Ränder mit Randlicht, Wasser rinnt an ihnen nach oben; innen fern ein zweiter Kai
function spalt(K, eb, cx, yb, hoch, breit, o) {
  o = o || {}; const e = K.e[eb], m = B.maske(), yt = yb - hoch;
  const halb = y => { const q = (y - yt) / hoch; return breit * (.15 + .85 * Math.pow(Math.sin(Math.min(1, q * 1.05) * Math.PI / 2), .8)) * (1 - Math.max(0, q - .92) * 2) * (o.weit || 1); };
  m.fn(cx - breit - 2, yt, cx + breit + 2, yb, (x, y) => Math.abs(x - cx - Math.sin(y * .07) * 1.2) < halb(y));
  // innen: tiefes Dunkel, unten fern ein Kai mit schwarzen Laternen (dieselbe Stelle noch einmal)
  if (o.dunst) {
    // innen fern: kein Licht, aber Dunst, vor dem eine dunkle Gestalt steht (hellt hinter dem Boss auf)
    const D = ['#020606', '#061212', '#0b1e1e', '#122c2c', '#1a3c3a', '#244e4a', '#30625c'];
    B.feld(e, cx - breit - 2, yt, cx + breit + 2, yb, D, (x, y) => { if (!m.has(x, y)) return -1; const q = (y - yt) / hoch, dx = Math.abs(x - cx) / breit; return (o.ruhig ? .95 : .78) - dx * .5 - Math.abs(q - .62) * .55 + (Math.sin(y * .5 + x * .05) > .9 ? .08 : 0); });
    // im Spalt: derselbe Kai noch einmal, klein und fern. Boden mit Fluchtlinien, schwarze Laternen, hinten wieder eine Wand mit einem Spalt
    const vy = yb - hoch * .34, kk = B.pk(D[1]), kl = B.pk(D[3]), pf = B.pk(FL.rand), wd = B.pk(D[2]);
    for (let y = Math.ceil(vy); y < yb; y++) for (let x = Math.floor(cx - breit); x <= cx + breit; x++) {
      if (!m.has(x, y)) continue; const q = (y - vy) / (yb - vy), X = (x - cx) / Math.max(1, q * breit * 1.6);
      if (Math.abs(X) > 1.05) continue; e.set(x, y, (Math.abs(Math.abs(X) - 1) < .06 || (Math.round(1 / Math.max(.02, q) * 2) % 3 === 0 && B.bay(x, y) < .5)) ? kl : kk);
    }
    for (let y = Math.round(vy - hoch * .22); y < vy; y++) for (let x = Math.floor(cx - breit * .3); x <= cx + breit * .3; x++) if (m.has(x, y)) e.set(x, y, Math.abs(x - cx) < 1 + (y - vy + hoch * .22) * .08 ? B.pk(D[0]) : wd);
    for (let i = 1; i <= 5; i++) { const q = Math.pow(.62, i), y = Math.round(vy + (yb - vy) * q), hh = Math.max(2, Math.round(24 * q)); for (const sgn of [-1, 1]) { const x = Math.round(cx + sgn * q * breit * 1.6 * 1.02); if (!m.has(x, y - 1)) continue; for (let k = 0; k < hh; k++) e.set(x, y - k, kk); e.set(x, y - hh, o.ruhig ? B.pk(WARM) : pf); } }
  } else B.feld(e, cx - breit - 2, yt, cx + breit + 2, yb, LEER, (x, y) => m.has(x, y) ? (o.ruhig ? .9 - (yb - y) / hoch * .6 : .15 + Math.max(0, (y - yb + hoch * .3) / (hoch * .3)) * .45) : -1);
  const fk = B.pk('#0a1c1a'), fl = B.pk(FL.rand);
  for (let i = 0; i < 6; i++) { const y = Math.round(yb - 2 - i * i * .6), w = Math.max(1, Math.round(halb(y) * (1 - i * .14))); for (let x = -w; x <= w; x++) if (m.has(cx + x, y) && (x + i) % 2 === 0) e.set(cx + x, y, fk); }
  if (!o.ruhig) for (const [dx, dy] of [[-.45, 6], [.4, 6], [-.25, 11], [.22, 11]]) { const x = Math.round(cx + dx * halb(yb - dy) * 1.6), y = yb - dy - 2; if (m.has(x, y)) { e.set(x, y, fl); e.set(x, y + 1, fk); } }
  // Ränder: Lichtkante innen (links stärker, das Licht kommt von links), außen eine dunkle Kante
  const ra = B.pk(pal.rand[1]), rb = B.pk(pal.rand[0]), dk = B.pk(WAND[0]), pts = [];
  for (let y = yt; y <= yb; y++) for (let x = Math.floor(cx - breit - 2); x <= cx + breit + 2; x++) {
    if (!m.has(x, y)) continue; const l = !m.has(x - 1, y), r = !m.has(x + 1, y);
    const dick = breit > 30 ? 2 : 1;
    if (l) { e.set(x, y, rb); if (dick > 1) { e.set(x - 1, y, ra); e.set(x - 2, y, dk); e.set(x - 3, y, dk); } else e.set(x - 1, y, dk); pts.push([x - dick + 1, y, 1]); }
    if (r) { e.set(x, y, (y & 1) ? rb : B.pk(WAND[5])); e.set(x + 1, y, ra); if (dick > 1) { e.set(x + 2, y, rb); e.set(x + 3, y, dk); } pts.push([x + 1, y, 0]); }
  }
  B.gluehen(e, cx, yb - hoch * .5, breit * 3, '#0a2a28', .6);
  // Wasser rinnt an den Rändern nach oben (animiert), dazu ein ruhiges Pulsieren der Kante
  const P = pts.filter((p, i) => i % 2 === 0);
  K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) {
    ctx.fillStyle = pal.rand[1];
    for (const [x, y, l] of P) { const ph = ((y + t * 22 * (l ? 1 : .8)) % 9 + 9) % 9; if (ph < 1) ctx.fillRect(x + (l ? -2 : 1) + ox, y + oy, 1, 1); }
    ctx.fillStyle = '#4ab0a0'; for (const [x, y, l] of P) { const ph = ((y + 4 + t * 16) % 13 + 13) % 13; if (ph < 1) ctx.fillRect(x + (l ? -3 : 2) + ox, y + oy, 1, 2); }
  } });
  return m;
}
// ---------- Schwarze Laterne ----------
function laterne(K, eb, x, yb, hoch, warm) {
  const m = B.maske(), k = hoch / 60, kk = Math.max(k, .8);
  m.kap(x, yb, x, yb - hoch + 8 * k, 1.4 * k + .4, 1 * k + .3);
  m.kap(x - 4 * k, yb - 1, x + 4 * k, yb - 1, 1.2 * k, 1.2 * k);
  m.kap(x - 3 * k, yb - hoch * .55, x + 3 * k, yb - hoch * .55, .6 * k + .3, .6 * k + .3);
  m.poly([[x - 4 * k, yb - hoch + 8 * k], [x - 3 * k, yb - hoch], [x + 3 * k, yb - hoch], [x + 4 * k, yb - hoch + 8 * k]]);
  m.poly([[x - 5 * k, yb - hoch], [x, yb - hoch - 4 * k], [x + 5 * k, yb - hoch]]);
  K.form(eb, m, 0, { ton: 1.2, fase: 1 });
  const gy = yb - hoch + 4 * k, e = K.e[eb];
  if (warm) {
    B.dith(e, x - 2.5 * k, yb - hoch + 1, x + 2.5 * k, yb - hoch + 8 * k - 1, WARM, () => .9);
    K.glut(x, gy, 62 * k, WARMG, 1, [2, 3, 4]); B.flamme(K, Math.round(x), Math.round(gy + 2), { p: B.PAR[eb], kern: WARMK, mitte: WARM, aussen: '#a06a20', glut: '#2a1a06' });
    return;
  }
  // Glas innen dunkel, ein dunkler Hof statt Schein: die Laterne nimmt Licht weg
  B.dith(e, x - 2.5 * k, yb - hoch + 1, x + 2.5 * k, yb - hoch + 8 * k - 1, '#000000', () => 1);
  for (const L of [K.e[1], K.e[2], K.e[3], K.e[4]]) B.dith(L, x - 40 * k, gy - 40 * k, x + 40 * k, gy + 50 * k, FL.hof, (px, py) => { if (!(L.get(px, py) >>> 24)) return 0; const q = Math.hypot(px - x, (py - gy) * .8) / (40 * k); return q < 1 ? (1 - q) * .55 : 0; });
  schwarzeFlamme(K, Math.round(x), Math.round(gy + 2.5 * k), Math.max(1, k * 1.6), B.PAR[eb]);
}
// dunkle Flamme mit hellem Rand, flackert ruhig; um sie ein paar Funken in Magenta
function schwarzeFlamme(K, x, y, g, p) {
  const ph = (x * 13.7 + y * 7.3) % 6.28, rand = B.css(FL.rand), hell = B.css(FL.hell), kern = B.css(FL.koerper);
  K.anim.push({ p, f(ctx, t, ox, oy) {
    const fl = Math.sin(t * 5 + ph) + Math.sin(t * 11.3 + ph * 2) * .6, h = Math.round((3 + (fl > .6 ? 1 : 0)) * g), w = Math.max(1, Math.round(1.6 * g)), lean = fl < -1 ? -1 : 0;
    for (let j = 0; j < h; j++) {
      const q = j / h, ww = Math.max(0, Math.round(w * (1 - q * q))), sx = x - ww + (j > h / 2 ? lean : 0);
      ctx.fillStyle = kern; ctx.fillRect(sx + ox, y - j + oy, ww * 2 + 1, 1);
      ctx.fillStyle = j === h - 1 ? hell : rand; ctx.fillRect(sx - 1 + ox, y - j + oy, 1, 1); ctx.fillRect(sx + ww * 2 + 1 + ox, y - j + oy, 1, 1);
    }
    ctx.fillStyle = hell; ctx.fillRect(x + lean + ox, y - h + oy, 1, 1);
    if (Math.sin(t * 1.3 + ph) > .7) { ctx.fillStyle = rand; ctx.fillRect(x + 2 + ox, y - h - 3 - Math.round((t * 6) % 5) + oy, 1, 1); }
  } });
}
// Schwarzes Feuer (Rast): dunkle Flammenzungen mit hellem Rand in einem Steinkreis
function schwarzesFeuer(K, x, y) {
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28, s = B.maske(); s.ell(x + Math.cos(a) * 17, y + 1 + Math.sin(a) * 4.4, 3, 2.1); K.form(5, s, 0, { ton: 1.5, fase: 1 }); }
  const h = B.maske(); h.kap(x - 9, y - 1, x + 7, y - 3, 1.6, 1.4); h.kap(x - 7, y - 3, x + 9, y, 1.5, 1.6); K.form(5, h, 0, { ton: 1.2 });
  for (const L of [K.e[3], K.e[4]]) B.dith(L, x - 70, y - 60, x + 70, y + 30, FL.hof, (px, py) => { if (!(L.get(px, py) >>> 24)) return 0; const q = Math.hypot(px - x, (py - y) * 1.4) / 70; return q < 1 ? (1 - q) * .4 : 0; });
  const rand = B.css(FL.rand), hell = B.css(FL.hell), kern = B.css(FL.koerper), innen = B.css(FL.innen);
  K.luft.push({ p: .8, f(ctx, t, ox, oy) {
    for (let k = 0; k < 5; k++) {
      const ph = k * 1.7, fl = Math.sin(t * 4.2 + ph) + Math.sin(t * 9.1 + ph) * .5, hh = 12 + [0, 6, 10, 5, 2][k] + Math.round(fl * 1.5), bx = x - 10 + k * 5;
      for (let j = 0; j < hh; j++) { const q = j / hh, ww = Math.max(0, Math.round(3.2 * (1 - q))), sx = Math.round(bx + Math.sin(t * 3 + j * .5 + ph) * q * 2) - ww;
        ctx.fillStyle = kern; ctx.fillRect(sx + ox, y - 3 - j + oy, ww * 2 + 1, 1); if (ww > 1 && (j + k) % 3 === 0) { ctx.fillStyle = innen; ctx.fillRect(sx + ww + ox, y - 3 - j + oy, 1, 1); } ctx.fillStyle = q > .8 ? hell : rand; ctx.fillRect(sx - 1 + ox, y - 3 - j + oy, 1, 1); if (k === 4 || (j & 1)) ctx.fillRect(sx + ww * 2 + 1 + ox, y - 3 - j + oy, 1, 1); }
    }
  } });
  B.partikel(K, { n: 12, farben: [FL.rand, FL.hell], x0: x - 10, x1: x + 10, y0: y - 50, y1: y - 8, vy: -8, wob: 3, wf: 2, blink: 2, p: .8 });
}
// ---------- Speicherfassade in Perspektive (rechts im Bild, schaut nach links zum Licht) ----------
function fassade(K, eb, P, o) {
  const m = B.maske(), sa = 1 / o.Za, sb = 1 / o.Zb, Zm = 2 / (sa + sb), X = o.X, Hh = o.H, g = o.giebel || 0;
  const pts = [P.q(X, -.2, o.Za), P.q(X, Hh, o.Za)];
  if (g) { if (o.treppe) { const n = 4; for (let i = 1; i < n; i++) { const s1 = sa + (sb - sa) * (i / (2 * n)); const Yh = Hh + g * i / n; pts.push(P.q(X, Yh - g / n, 1 / s1)); pts.push(P.q(X, Yh, 1 / s1)); } pts.push(P.q(X, Hh + g, Zm)); for (let i = n - 1; i >= 1; i--) { const s1 = sb - (sb - sa) * (i / (2 * n)); const Yh = Hh + g * i / n; pts.push(P.q(X, Yh, 1 / s1)); pts.push(P.q(X, Yh - g / n, 1 / s1)); } } else pts.push(P.q(X, Hh + g, Zm)); }
  pts.push(P.q(X, Hh, o.Zb), P.q(X, -.2, o.Zb));
  m.poly(pts);
  const ziegel = (x, y) => (B.hash(x >> 1, y, 5) - .5) * .35 + ((y % 3 === 0) ? -.12 : 0);
  K.form(eb, m, o.tiefe, { ton: o.seite < 0 ? .85 : .5, verlauf: .55, fase: 1, muster: ziegel });
  if (o.stirn) { const s = B.maske(); s.poly([P.q(o.stirn, -.2, o.Za), P.q(o.stirn, Hh, o.Za), P.q(X, Hh, o.Za), P.q(X, -.2, o.Za)]); K.form(eb, s, o.tiefe, { ton: .55, verlauf: .4, fase: 1, muster: ziegel }); }
  // Fenster: zugemauert bis auf eines, und dieses leuchtet schwarz (dunkle Scheibe, heller Rahmen)
  const fl = o.geschosse || Math.floor((Hh - 1) / 1.7), sp = o.achsen || 3, fB = (sa - sb) / (sp + 1) * .36;
  for (let f = 0; f < fl; f++) for (let a = 0; a < sp; a++) {
    const Y0 = 1.1 + f * 1.7, sMid = sa + (sb - sa) * (a + 1) / (sp + 1), s0 = sMid + fB, s1 = sMid - fB;
    const q = [P.q(X, Y0, 1 / s0), P.q(X, Y0 + 1.05, 1 / s0), P.q(X, Y0 + 1.05, 1 / s1), P.q(X, Y0, 1 / s1)];
    const fm = B.maske(); fm.poly(q); if (fm.leer()) continue;
    const e = K.e[eb];
    if (o.dunkel && o.dunkel[0] === f && o.dunkel[1] === a) {
      for (let y = fm.y0; y <= fm.y1; y++) for (let x = fm.x0; x <= fm.x1; x++) if (fm.has(x, y)) e.set(x, y, B.pk((!fm.has(x - 1, y) || !fm.has(x + 1, y) || !fm.has(x, y - 1) || !fm.has(x, y + 1)) ? FL.rand : (x === Math.round((fm.x0 + fm.x1) / 2) ? '#3a1030' : '#000000')));
      o.dunkelPos = [(fm.x0 + fm.x1) / 2, (fm.y0 + fm.y1) / 2];
      B.dith(e, fm.x0 - 8, fm.y0 - 8, fm.x1 + 8, fm.y1 + 8, FL.hof, (px, py) => fm.has(px, py) ? 0 : .35);
    } else {
      const mu = (x, y) => ((y & 1) ? -.5 : 0) + ((((x + (y >> 1) * 2) & 3) === 0) ? -.4 : 0) + (B.hash(x, y, 3) - .5) * .2;
      K.form(eb, fm, o.tiefe, { ton: o.seite < 0 ? 2.5 : 2.1, rand: 0, fase: 0, muster: fm.x1 - fm.x0 > 4 ? mu : null });
      const k0 = B.pk(B.mix(pal.koerper[0], K.fern, o.tiefe));
      for (let y = fm.y0; y <= fm.y1; y++) for (let x = fm.x0; x <= fm.x1; x++) if (fm.has(x, y) && (!fm.has(x, y - 1) || !fm.has(x - 1, y))) e.set(x, y, k0);
    }
  }
}
// ---------- Kai-Pflaster und Becken ----------
function pflaster(K, P, istKai, o) {
  o = o || {}; const s = K.o.seed;
  K.boden(P.vy + 1, H + M, STEIN.concat([K.fern]), (x, y) => {
    const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; if (!istKai(X, Z)) return -1;
    const k = P.k(Z), cz = .2, cx = .28, row = Math.floor(Z / cz), off = (row & 1) * .5, col = Math.floor(X / cx + off);
    const fx = X / cx + off - col, fz = Z / cz - row, pxw = k * cx, pzh = k * cz * k / P.h, fern = 1 - (y - P.vy) / P.h;
    let t = .2 + .12 * B.hash(col, row, s) + Math.pow(fern, 5) * .6 - (1 - fern) * .1;
    // Pfützen spiegeln die helle Decke aus See
    const nass = B.fbm(X * .9, Z * 1.4, s + 3, 3); if (nass > .66) return .5 + (nass - .66) * 2 + fern * .2 + (Math.sin(y * 2.1 + X * 3) > .6 ? .12 : 0);
    if (pxw > 3) { if (fx * pxw < .9 || fz * Math.max(1, pzh) < .7) t -= .2; else if ((1 - fz) * Math.max(1, pzh) < 1.2 && fx < .6) t += .13; }
    if (o.schiene) for (const sx of o.schiene) if (Math.abs(X - sx) * k < .55 + k * .004) t = .62 + Math.pow(fern, 3) * .3;
    if (o.rinne !== undefined && Math.abs(X - o.rinne) * k < 1.2 + k * .02) t = .14;
    if (o.kante && o.kante(X, Z) * k < 1.3) t = .7;
    return t;
  });
}
function becken(K, y0, ist) {
  const s = K.o.seed;
  K.boden(y0, H + M, BECKEN, (x, y) => { if (!ist(x, y)) return -1; const q = (y - y0) / (H - y0); return .2 + Math.pow(1 - q, 5) * .5 + (Math.sin(y * 1.7 + B.rausch2(x * .03, y * .25, s) * 6) > .78 ? .18 : 0); });
}
function poller(K, eb, x, yb, s, tiefe) { const m = B.maske(); m.rect(x - 2.2 * s, yb - 5 * s, 4.4 * s, 5 * s); m.ell(x, yb - 5 * s, 3.2 * s, 1.6 * s); K.form(eb, m, tiefe, { ton: 1.4, fase: 1, schatten: 1 }); }
function kiste(K, eb, x, yb, w, h) { const m = B.maske(); m.rect(x - w / 2, yb - h, w, h); K.form(eb, m, 0, { ton: 1.6, schatten: 2, muster: (px, py) => (py === Math.round(yb - h / 2) || px === Math.round(x + w / 2 - 2) || px === Math.round(x - w / 2 + 3)) ? -.7 : 0 }); }
// Netze hängen nach OBEN: sie fallen zur Decke
function netzNachOben(K, eb, a, b, hoch, tiefe) {
  const m = B.maske(); m.kap(a[0], a[1], a[0], a[2] - 3, 1.6, 1.2); m.kap(b[0], b[1], b[0], b[2] - 3, 1.4, 1.1); m.kap(a[0] - 3, a[2], b[0] + 3, b[2], 1, 1);
  K.form(eb, m, tiefe, { ton: 1.3, fase: 1, schatten: 1 });
  const n = B.maske(), steps = 22, unten = [], oben = [];
  for (let i = 0; i <= steps; i++) { const q = i / steps, x = B.lerp(a[0], b[0], q), y = B.lerp(a[2], b[2], q) - 1; unten.push([x, y]); oben.push([x + Math.sin(q * 9) * 1.5, y - hoch * (.6 + .4 * Math.sin(q * Math.PI)) * (.85 + .15 * Math.sin(q * 13)) - (i % 3 === 0 ? 4 : 0)]); }
  n.poly(unten.concat(oben.reverse()));
  n.fn(n.x0, n.y0, n.x1, n.y1, (x, y) => { const xi = Math.floor(x), yi = Math.floor(y); return ((xi + yi) & 3) !== 0 && ((xi - yi) & 3) !== 0; }, 0);
  K.form(eb, n, tiefe, { ton: 1.9, fase: 0, rand: 1 });
}
// Leuchtturm (links, auf der Mole); er wirft einen SCHWARZEN Strich statt eines Kegels
function leuchtturm(K, eb, x, yb, hoch, breit, tiefe) {
  const m = B.maske(), wt = breit * .66, yt = yb - hoch, gal = Math.max(1, hoch * .025), lh = hoch * .1, lw = wt * .7;
  m.poly([[x - breit / 2, yb], [x - wt / 2, yt], [x + wt / 2, yt], [x + breit / 2, yb]]);
  m.rect(x - wt / 2 - gal * 1.6, yt - gal, wt + gal * 3.2, gal + 1); m.rect(x - lw / 2, yt - gal - lh, lw, lh);
  m.poly([[x - lw / 2 - 1, yt - gal - lh], [x, yt - gal - lh - lh * .7], [x + lw / 2 + 1, yt - gal - lh]]);
  K.form(eb, m, tiefe, { ton: 1.1, verlauf: .7, fase: 1.2 });
  for (let i = 0; i < 4; i++) { const q = (i + .6) / 4.4, fy = yb - hoch * q, fx = x + (i % 2 ? .18 : -.18) * B.lerp(breit, wt, q), f = B.maske(); f.rect(fx - 1, fy - 1, 2, 2); K.form(eb, f, tiefe, { ton: 2.4, rand: 0, fase: 0 }); }
  const ly = Math.round(yt - gal - lh / 2);
  B.dith(K.e[eb], x - lw / 2 + 1, yt - gal - lh + 1, x + lw / 2 - 1, yt - gal - 1, '#000000', () => 1);
  K.e[eb].set(x - lw / 2 + 1, ly, B.pk(FL.rand)); K.e[eb].set(x + lw / 2 - 2, ly, B.pk(FL.rand));
  return [x, ly];
}
function schwarzerStrich(K, x, y, mitte, weite, laenge, p) {
  const c = B.css('#010303'), r2 = B.css('#1a3836');
  K.anim.push({ p, f(ctx, t, ox, oy) {
    const a = mitte + weite * Math.sin(t * Math.PI * 2 / 14), ca = Math.cos(a), sa = Math.sin(a);
    for (let r = 4; r < laenge; r += 1) { const w = Math.max(1, r * .045), q = 1 - r / laenge; for (let k = -Math.ceil(w); k <= w; k++) { const px = Math.round(x + ca * r - sa * k), py = Math.round(y + sa * r + ca * k); if (B.bay(px, py) < q * .8 * (1 - Math.abs(k) / (w + 1))) { ctx.fillStyle = Math.abs(k) >= Math.floor(w) ? r2 : c; ctx.fillRect(px + ox, py + oy, 1, 1); } } }
  } });
}
// Nebelband am Fuß der Wand (schmal)
function fussnebel(K, y0, y1, d) { B.nebel(K.e[2], { y0, y1, col: B.mix(pal.nebel[1], K.fern, .3), dichte: d || .3, seed: 8 }); }

// =====================================================================
// V0: Der Kai unten (Spiegel von Hafen V0)
function kai(K, o) {
  o = o || {}; const r = K.r, fr = K.fr, P = B.persp(108, 134); K.split = [146, 158];
  gespiegelt(K);
  decke(K, 62, 60);
  // Rümpfe über uns, kieloben, mit Ketten
  rumpf(K, 1, 150, 30, 64, .55, [-4, 28]); rumpf(K, 1, 300, 14, 90, .5, [6, 40, true]); rumpf(K, 1, 52, 44, 40, .62, null); rumpf(K, 1, 420, 46, 46, .6, [2, 22]);
  // die Wand am Ende des Kais, quer über das Bild
  const wy = 58, fussY = 144;
  wand(K, 1, wy, fussY, { licht: [60, 140] });
  fisch(K, 1, 196, 92, 16, .4, -1); fisch(K, 1, 212, 104, 11, .45, -1); fisch(K, 1, 44, 112, 14, .4, 1);
  const sm = spalt(K, 1, P.vx, fussY - 1, o.uebergang ? 0 : 68, 7, { ruhig: o.ruhig });
  void sm;
  // Mole links mit dem Leuchtturm, davor das Becken
  const mm = B.maske(); mm.poly([P.q(-3, .2, 12), P.q(-4.6, .2, 12), [6, 141], [-M, 140], [-M, 145], [6, 145], P.q(-4.6, -.3, 12), P.q(-3, -.3, 12)]); K.form(1, mm, .5, { ton: 1.2, fase: 1 });
  const lamp = leuchtturm(K, 2, 30, 142, 92, 15, .42);
  const kante = 3.05, istKai = (X, Z) => X < 15.2 && (X > -kante || X > 8);
  becken(K, 134, (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; return !istKai(X, Z); });
  pflaster(K, P, istKai, { schiene: [5.3, 6.7], kante: X => Math.abs(X + kante) });
  // Speicherflucht rechts
  const H1 = [
    { X: 15, Za: 4.6, Zb: 8.2, H: 9.4, giebel: 2.6, treppe: true, eb: 3, tiefe: .06, achsen: 3 },
    { X: 15.8, Za: 8.2, Zb: 11.4, H: 8.2, giebel: 2.2, eb: 3, tiefe: .16, achsen: 3 },
    { X: 14.6, Za: 11.4, Zb: 14, H: 7.2, giebel: 2.4, treppe: true, eb: 2, tiefe: .3, achsen: 2, stirn: 15.8, dunkel: [3, 1] },
  ];
  for (const h of H1.slice().reverse()) fassade(K, h.eb, P, Object.assign({ seite: -1 }, h));
  fussnebel(K, 132, 150, .32);
  // Poller und schwarze Laternen an der Kante, Taue führen in die Wand
  for (const Z of [5.6, 10]) { const [x, y] = P.q(-2.75, 0, Z); poller(K, K.eb(y), x, y, P.k(Z) / 26, 0); const t = B.maske(); t.pfad([[x - 1, y - 3], [x - 14, y + 2], [x - 30, y + 9]], .7, .6); K.form(K.eb(y), t, 0, { ton: 1.5, fase: 0, rand: 1 }); }
  for (const [X, Z, h] of [[-2.4, 3.6, 66], [-2.5, 8.5, 0]]) { const [x, y] = P.q(X, 0, Z); laterne(K, K.eb(y), x, y, h || 66 * 3.6 / Z, o.ruhig); }
  const [lx, ly] = P.q(13.4, 0, 6.2); laterne(K, K.eb(ly), lx, ly, 54, o.ruhig);
  const [kx, ky] = P.q(14.2, 0, 7.6); const ke = K.eb(ky + 2); kiste(K, ke, kx - 4, ky + 1, 16, 13); kiste(K, ke, kx - 18, ky + 2, 13, 11); kiste(K, ke, kx - 8, ky - 12, 12, 10);
  // vorne: ein Poller mit aufgeschossenem Tau, daneben eine umgefallene Laterne, die noch schwarz brennt
  if (!o.uebergang) {
    poller(K, 4, 300, 238, 2.6, 0);
    const tau = B.maske(); for (let i = 0; i < 4; i++) tau.ell(330, 236 - i * 2.2, 14 - i * 2, 4 - i * .4); tau.ell(330, 230, 5, 2, 0); K.form(4, tau, 0, { ton: 1.6, fase: 1, schatten: 1, muster: (x, y) => ((x + y * 2) % 4 === 0 ? -.5 : 0) });
    const lt = B.maske(); lt.poly([[188, 232], [200, 222], [206, 228], [194, 238]]); lt.kap(186, 234, 180, 240, 1.2, 1.2); K.form(4, lt, 0, { ton: 1.3, fase: 1 });
    B.dith(K.e[4], 150, 214, 240, 250, FL.hof, (x, y) => { const q = Math.hypot(x - 197, (y - 230) * 1.6) / 40; return q < 1 ? (1 - q) * .5 : 0; });
    schwarzeFlamme(K, 198, 229, 1.2, B.PAR[4]);
  }
  // Netzgestell links vorn: die Netze hängen nach oben
  const a = P.q(-2.15, 0, 3.15), a2 = P.q(-2.15, 1.75, 3.15), b = P.q(-2.15, 0, 4.6), b2 = P.q(-2.15, 1.7, 4.6);
  netzNachOben(K, K.eb(b[1]), [b[0], b[1], b2[1]], [a[0], a[1], a2[1]], 30, 0);
  // Vordergrund: Dalben links, Kistenkante rechts unten, oben eine Kette, die durchs Bild hängt
  const v = B.maske();
  v.poly([[14, H + M], [11, 74], [6, 70], [-M, 70], [-M, H + M]]); v.kap(14, 120, -M, 134, 3, 3); v.kap(16, 132, -M, 146, 3, 3);
  v.poly([[480 + M, 238], [436, 236], [430, 270 + M], [480 + M, 270 + M]]);
  for (let i = 0; i < 26; i++) { const yy = -M + i * 4; if (i & 1) v.ell(384 + Math.sin(i * .3) * 2, yy, 1.4, 2.6); else v.ell(384 + Math.sin(i * .3) * 2, yy, 2.4, 1.6); }
  K.form(5, v, 0, { ton: .5, fase: 1.5, k: ['#010303', '#030606', '#081010', '#0e1c1c'] });
  if (!o.ruhig) schwarzerStrich(K, lamp[0], lamp[1], -.2 - .1 * fr, .3, 420, .15);
  B.partikel(K, { n: 50, farben: ['#163836', '#2a605a', '#5aa69a'], vx: 3, vy: -14, wob: 3, wf: .4, p: 1 }); // Schwebteilchen steigen
  K.reihen = [{ y: 164, skala: .9, nebel: .3 }, { y: 189, skala: 1, nebel: .12 }, { y: 213, skala: 1, nebel: 0 }];
  return { P, mitte: [244, 206] };
}
// V1: Gasse unten (Spiegel der Lagerhaus-Gasse); am Ende die Wand mit dem Spalt
function gasse(K, o) {
  o = o || {}; const fr = K.fr, P = B.persp(212, 122); K.split = [140, 156];
  gespiegelt(K);
  decke(K, 70, 150);
  rumpf(K, 1, 212, 40, 50, .55, [0, 30, true]);
  wand(K, 1, 64, 132, { licht: [200, 60] });
  fisch(K, 1, 232, 96, 9, .45, -1);
  spalt(K, 1, P.vx, 131, 50, 5, {});
  const R = [{ X: 2.7, Za: 1.2, Zb: 4.2, H: 13 }, { X: 2.8, Za: 4.2, Zb: 8.5, H: 11.5, giebel: 2.4, treppe: true }, { X: 2.6, Za: 8.5, Zb: 22, H: 9, giebel: 2 }];
  const L = [{ X: -2.3, Za: 1.2, Zb: 5.6, H: 10.5 }, { X: -2.4, Za: 5.6, Zb: 12, H: 8.6, giebel: 2.2, dunkel: [4, 1] }, { X: -2.2, Za: 12, Zb: 22, H: 7.2, giebel: 1.6, treppe: true }];
  R.forEach((h, i) => fassade(K, i < 2 ? 3 : 2, P, Object.assign({ seite: -1, tiefe: [.04, .14, .34][i], achsen: [2, 3, 4][i] }, h)));
  L.forEach((h, i) => fassade(K, i < 2 ? 3 : 2, P, Object.assign({ seite: 1, tiefe: [.06, .18, .36][i], achsen: [3, 3, 4][i] }, h)));
  // Netze über der Gasse: sie hängen nach oben
  const n1 = P.q(2.7, 4.2, 5.2), n2 = P.q(-2.4, 4.4, 6.4), nm = B.maske(), pts = [];
  for (let i = 0; i <= 20; i++) { const q = i / 20; pts.push([B.lerp(n1[0], n2[0], q), B.lerp(n1[1], n2[1], q) - Math.sin(q * Math.PI) * 8]); }
  nm.pfad(pts, .7, .7); K.form(3, nm, .1, { ton: 1.4, fase: 0, rand: 1 });
  [[.15, .38, 1], [.45, .62, .7], [.7, .86, 1.15]].forEach(([q0, q1, l]) => { const n = B.maske(), un = [], ob = []; for (let i = 0; i <= 8; i++) { const q = B.lerp(q0, q1, i / 8), x = B.lerp(n1[0], n2[0], q), y = B.lerp(n1[1], n2[1], q) - Math.sin(q * Math.PI) * 8; un.push([x, y]); ob.push([x + 1, y - 30 * l * (.8 + .25 * Math.sin(i * 1.7)) - (i % 2) * 3]); } n.poly(un.concat(ob.reverse())); n.fn(n.x0, n.y0, n.x1, n.y1, (x, y) => { const xi = Math.floor(x), yi = Math.floor(y); return ((xi + yi) & 3) !== 0 && ((xi - yi) & 3) !== 0; }, 0); K.form(3, n, .1, { ton: 1.9, fase: 0, rand: 1 }); });
  fussnebel(K, 112, 140, .3);
  pflaster(K, P, (X, Z) => Math.abs(X - .2) < 2.6, { rinne: 0 });
  const [lx, ly] = P.q(2.5, 0, 3.2); laterne(K, K.eb(ly), lx - 6, ly, 54, false);
  { const [x2, y2] = P.q(-2.3, 0, 6); laterne(K, K.eb(y2), x2 + 4, y2, 30, false); }
  // ein Boot hängt kieloben in die Gasse, seine Kette reicht fast bis aufs Pflaster
  rumpf(K, 2, 236, 22, 120, .12, [-8, 120, true]);
  { const [kx, ky] = P.q(-2.1, 0, 2.2); kiste(K, K.eb(ky), kx + 10, ky, 22, 17); kiste(K, K.eb(ky), kx + 12, ky - 17, 16, 12); }
  const [fx, fy] = P.q(-2.0, 0, 2.6), fk = P.k(2.6) / 40, f = B.maske();
  f.poly([[fx - 9 * fk, fy], [fx - 10 * fk, fy - 12 * fk], [fx - 9 * fk, fy - 24 * fk], [fx + 9 * fk, fy - 24 * fk], [fx + 10 * fk, fy - 12 * fk], [fx + 9 * fk, fy]]); f.kap(fx - 4 * fk, fy - 24 * fk, fx - 7 * fk, -M, 1.6 * fk, 1.6 * fk);
  K.form(K.eb(fy), f, 0, { ton: 1.3, schatten: 2, muster: (x, y) => (Math.abs(y - (fy - 6 * fk)) < 1 || Math.abs(y - (fy - 18 * fk)) < 1) ? .8 : 0 });
  const v = B.maske(); v.poly([[480 + M, -M], [450, -M], [454, 90], [446, 120], [452, H + M], [480 + M, H + M]]); v.kap(450, 60, 420, 66, 2, 1.5);
  K.form(5, v, 0, { ton: .5, fase: 1.5, k: ['#010303', '#030606', '#081010', '#0e1c1c'] });
  B.partikel(K, { n: 40, farben: ['#163836', '#2a605a', '#5aa69a'], vx: -2, vy: -12, wob: 3, wf: .4 });
  K.reihen = [{ y: 162, skala: .9, nebel: .3 }, { y: 188, skala: 1, nebel: .12 }, { y: 213, skala: 1, nebel: 0 }];
  void fr; return { P, mitte: [222, 204] };
}
// V2: Steg unten (Spiegel des Bootsstegs): die Boote liegen nicht am Steg, sie hängen über ihm
function steg(K, o) {
  o = o || {}; const P = B.persp(274, 150); K.split = [158, 166];
  gespiegelt(K);
  decke(K, 66, 120);
  for (const [x, y, l, k] of [[140, 34, 70, [-6, 52]], [236, 20, 54, [4, 46, true]], [380, 40, 60, [0, 38]], [60, 54, 36, null]]) rumpf(K, 1, x, y, l, .5, k);
  wand(K, 1, 62, 152, { licht: [80, 160] });
  fisch(K, 1, 120, 110, 18, .4, 1); fisch(K, 1, 350, 96, 12, .45, -1); fisch(K, 1, 372, 118, 9, .5, -1);
  spalt(K, 1, P.vx, 151, 74, 8, { ruhig: o.ruhig });
  const istSteg = (X, Z) => X < 2.5 && X > -4.1 && Z < 30;
  const iw = (x, y) => { const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; return !istSteg(X, Z); };
  fussnebel(K, 136, 158, .3);
  becken(K, 152, iw);
  const HOLZ = ['#030606', '#071010', '#0c1818', '#132424', '#1c3232', K.fern];
  K.boden(152, H + M, HOLZ, (x, y) => {
    const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h; if (!istSteg(X, Z)) return -1;
    const k = P.k(Z), pw = .32, i = Math.floor(X / pw), f = X / pw - i;
    let t = .24 + .1 * B.hash(i, 0, 3) + .08 * B.rausch2(i * 3, Z * .4, 2) + Math.pow(1 - (y - 150) / 120, 6) * .5;
    if (f * pw * k < .9) t = .1; else if (f * pw * k < 2) t += .14;
    if (Math.abs(X + 4.1) * k < 1.2 || Math.abs(X - 2.5) * k < 1.2) t = .66;
    return t;
  });
  for (const [X, Z, hh] of [[2.6, 2.2, 1.4], [2.6, 4.1, 1.2], [2.6, 7.6, 1.5], [-4.2, 2.6, 1.6], [-4.2, 5.4, 1.1], [-4.2, 9.8, 1.5], [2.6, 13, 1.2]]) {
    const [x, y] = P.q(X, 0, Z), k = P.k(Z), m = B.maske(); m.kap(x, y + k * .5, x, y - k * hh, k * .1 + .4, k * .09 + .3); K.form(K.eb(y), m, Z < 6 ? 0 : .2, { ton: 1.3, fase: 1 });
  }
  { const [x, y] = P.q(-3.9, 0, 6.5); laterne(K, K.eb(y), x, y, 36, o.ruhig); }
  const v = B.maske(); v.poly([[-M, 180], [28, 196], [40, 270 + M], [-M, 270 + M]]); v.kap(480 + M, 220, 440, 240, 4, 4); v.kap(460, 160, 454, 270 + M, 5, 6);
  K.form(5, v, 0, { ton: .5, fase: 1.5, k: ['#010303', '#030606', '#081010', '#0e1c1c'] });
  B.partikel(K, { n: 40, farben: ['#163836', '#2a605a', '#5aa69a'], vx: 2, vy: -10, wob: 4, wf: .4 });
  K.reihen = [{ y: 170, skala: .9, nebel: .3 }, { y: 192, skala: 1, nebel: .12 }, { y: 214, skala: 1, nebel: 0 }];
  return { P, mitte: [258, 206] };
}
// Finale: am Kai-Ende, die Wand füllt die Breite, der Spalt steht hinter dem Boss
function finale(K, o) {
  o = o || {}; const P = B.persp(240, 176); K.split = [184, 196];
  gespiegelt(K);
  decke(K, 44, 130);
  rumpf(K, 1, 120, 16, 130, .3, [14, 36, true]); rumpf(K, 1, 396, 24, 80, .4, [-4, 22]); rumpf(K, 1, 272, 4, 50, .5, null);
  wand(K, 1, 40, 178, { licht: [240, 60] });
  // ein Ruderboot steht schräg in der Wand, darüber eine Ankerkette, die aus der Decke bis in die Wand reicht
spalt(K, 1, 240, 177, 152, o.ruhig ? 104 : 90, { ruhig: o.ruhig, dunst: true });
  // Spiegelung des Spalts im nassen Stein
  K.bodenDith(180, 179, 300, 230, '#163836', (x, y) => .5 * Math.max(0, 1 - Math.abs(x - 240) / 60) * Math.max(0, 1 - (y - 179) / 50) * (Math.sin(y * 1.9) > -.2 ? 1 : 0));
  // Kai-Kante quer, Platten
  const s = K.o.seed;
  K.boden(176, H + M, STEIN, (x, y) => { const q = (y - 176) / 94, zeile = Math.floor(Math.pow(q, .7) * 9), pl = Math.floor((x - 240) / (26 + zeile * 10) + zeile * .5); let t = .26 + .1 * B.hash(pl, zeile, s) - q * .1 + (B.rausch2(x * .05, y * .1, 7) - .5) * .2; if (Math.abs(Math.pow(q, .7) * 9 - zeile) < .12 + q * .05) t -= .2; if (y < 179) t = .75; return t; });
  fussnebel(K, 160, 184, .32);
  for (const [x, y, h] of [[96, 188, 84], [384, 188, 84]]) laterne(K, K.eb(y), x, y, h, o.ruhig);
  for (const [x, y] of [[58, 196], [430, 194]]) { poller(K, K.eb(y), x, y, 1.6, 0); const t = B.maske(); t.pfad([[x + (x < 240 ? 3 : -3), y - 6], [x + (x < 240 ? 30 : -30), y - 12], [x + (x < 240 ? 60 : -60), y - 16]], 1, .7); K.form(K.eb(y), t, 0, { ton: 1.5, fase: 0, rand: 1 }); }
  const v = B.maske(); v.poly([[-M, 226], [44, 232], [60, 270 + M], [-M, 270 + M]]); v.poly([[480 + M, 214], [446, 226], [430, 270 + M], [480 + M, 270 + M]]);
  K.form(5, v, 0, { ton: .5, fase: 1.5, k: ['#010303', '#030606', '#081010', '#0e1c1c'] });
  B.partikel(K, { n: 46, farben: ['#163836', '#2a605a', '#5aa69a'], vx: 0, vy: -10, wob: 4, wf: .4, p: 1 });
  if (!o.ruhig) B.partikel(K, { n: 16, farben: [FL.rand], x0: 200, x1: 280, y0: 40, y1: 176, vy: -6, wob: 3, wf: .7, blink: 1.2, p: .1 });
  K.reihen = [{ y: 190, skala: .9, nebel: .2 }, { y: 202, skala: 1, nebel: .08 }, { y: 216, skala: 1, nebel: 0 }];
  return { mitte: [240, 208] };
}
// Übergang: Ankunft in Akt V. Eine Eisentreppe führt rechts vom Eisloch herab auf den Kai
function ankunftUnten(K) {
  const info = kai(K, { uebergang: true }), P = info.P;
  const m = B.maske(), x0 = 470, y0 = -M, x1 = 330, y1 = 214;
  m.kap(x0, y0, x1, y1, 2.2, 2.6); m.kap(x0 + 22, y0, x1 + 26, y1 + 4, 2.2, 2.6);
  for (let i = 1; i < 16; i++) { const q = i / 16, xa = B.lerp(x0, x1, q), ya = B.lerp(y0, y1, q); m.kap(xa, ya, xa + 23, ya + q * 4, 1.4, 1.4); }
  K.form(5, m, 0, { ton: 1, fase: 1, k: ['#010303', '#030606', '#081010', '#0e1c1c'] });
  void P; return info;
}

function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' ? 2 : art === 'wandbild' || art === 'werkstatt' ? 1 : art === 'weg' ? 0 : (o.seed + v) % 3;
  let info;
  if (art === 'waechter') info = finale(K);
  else if (art === 'uebergang') info = ankunftUnten(K);
  else info = [kai, gasse, steg][v](K);
  if (art === 'rast') {
    for (let i = 0; i < 2; i++) B.dith(K.e[i], -M, -M, W + M, H + M, '#000000', (px, py) => .22 - Math.abs(px - info.mitte[0]) / 2400);
    schwarzesFeuer(K, info.mitte[0], info.mitte[1] + 14);
  } else if (art !== 'kampf' && art !== 'waechter' && art !== 'uebergang') B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
World._biome.pforte = { pal, build: bauen, reliefStil: { figuren: 1, gelenke: 3, knick: .3 } };
// Sonderszene: Ankunft (nach dem Finale) und Ende. Die Wand steht offen, die Laternen brennen wieder warm
World._spezial.ankunft = function (o) { const K = B.kontext(pal, Object.assign({}, o, { art: 'ankunft' })); finale(K, { ruhig: true }); return K.fertig(); };

// ---------- Wandbild: „Die letzte Wand. Sie zeigt dich.“ ----------
// Eigenes Relief: eine kleine Figur mit Laterne am Kai vor einer Wand aus Wasser, in der ein großes Auge offen steht.
function reliefPforte(seed) {
  const e = new B.Ebene(), w = 160, h = 100, r = B.rng(seed * 977 + 3);
  const stein = [B.mix(pal.koerper[2], pal.nebel[1], .5), B.mix(pal.koerper[3], pal.nebel[1], .6), B.mix(pal.koerper[3], pal.rand[0], .45), B.mix(pal.rand[0], pal.nebel[1], .3)];
  const P = stein.map(B.pk);
  B.feld(e, 0, 0, w, h, stein, (x, y) => .38 + .25 * B.fbm(x * .05, y * .05, seed, 3) - y / h * .12);
  const ritz = B.maske();
  ritz.rect(4, 8, 152, 2); ritz.rect(4, 86, 152, 2);
  // Kai: Linie mit Pollern, Laternen
  ritz.rect(10, 74, 140, 1.5); for (const x of [22, 60, 132]) { ritz.rect(x, 70, 3, 4); }
  for (const x of [40, 112]) { ritz.kap(x, 74, x, 54, .7, .7); ritz.rect(x - 2, 50, 5, 4); }
  // Wand aus Wasser: Wellenlinien waagerecht, dazwischen das Auge
  for (let k = 0; k < 6; k++) { const y = 16 + k * 9; const pts = []; for (let x = 70; x <= 150; x += 4) pts.push([x, y + Math.sin(x * .3 + k) * 1.2]); ritz.pfad(pts, .6, .6); }
  ritz.ell(110, 40, 20, 11); ritz.ell(110, 40, 17, 8.5, 0); ritz.ell(110, 40, 6, 6); ritz.ell(110, 40, 3, 3, 0);
  for (let i = 0; i < 9; i++) { const a = Math.PI * (1.08 + i * .1); ritz.kap(110 + Math.cos(a) * 21, 40 + Math.sin(a) * 12, 110 + Math.cos(a) * 28, 40 + Math.sin(a) * 18, .7, .5); }
  // die Figur: steht am Kai, hält eine Laterne hoch, schaut zur Wand
  const fx = 52 + r.j(2); ritz.ell(fx, 50, 3, 3.5); ritz.pfad([[fx, 54], [fx - 1, 62], [fx - 3, 73]], 1.4, 1.1); ritz.pfad([[fx, 62], [fx + 2, 73]], 1.1, 1);
  ritz.pfad([[fx, 56], [fx + 5, 52], [fx + 8, 46]], .9, .8); ritz.rect(fx + 6, 41, 4, 5); ritz.kap(fx + 8, 41, fx + 8, 38, .5, .5);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!ritz.has(x, y)) continue; e.set(x, y, B.pk(pal.koerper[1]));
    if (!ritz.has(x + 1, y + 1)) e.set(x + 1, y + 1, P[3]);
    if (!ritz.has(x - 1, y - 1) && !ritz.has(x - 1, y)) e.set(x - 1, y - 1, B.pk(pal.koerper[0]));
  }
  // in der Laterne der Figur und im Auge: dasselbe Licht
  e.set(fx + 8, 43, B.pk(pal.augen)); e.set(110, 40, B.pk(pal.augen));
  B.gluehen(e, 110, 40, 9, B.mix(pal.augen, '#000', .6), .8); B.gluehen(e, fx + 8, 43, 6, B.mix(pal.augen, '#000', .6), .8);
  const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(e.leinwand(), -M, -M); return c;
}
// World.relief kennt nur die Stil-Parameter; für die Pforte ein eigenes Bild (Vorschlag an den Kern: Haken reliefBild je Biom)
const reliefAlt = World.relief;
World.relief = function (biom, seed) { if (biom === 'pforte') return reliefPforte(seed || 1); return reliefAlt(biom, seed); };
})();
