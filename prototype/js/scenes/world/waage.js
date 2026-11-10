// Saltmoor 1925 · Hintergründe: Akt V, Die Waage am Grund (Biom-Paket waage).
// Komposition: docs/auftrag-2/biome/waage.md. Am Grund vor der Pforte steht ein Zollhaus: gekachelte Halle,
// Schalter mit Messinggittern, Wartebänke, die Registratur bis ins Wasser hinauf. Das Dach ist fort, darüber
// steht das Meer, und das Licht fällt in Bahnen hindurch (Wasserlicht, Gegenlicht von hinten oben rechts).
// Wahrzeichen: eine Balkenwaage, groß wie ein Schiff; rechts die volle Schale (Mäntel, Koffer, Briefe), links
// die leere. Falsches Detail: Die leere Schale hängt tiefer. Die Waage neigt sich immer zu dir (nach links vorn).
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#060504', '#0f0c08', '#1c170e', '#2d2516'], rand: ['#8a7434', '#e6dcbc'], augen: '#ec4a34', nebel: ['#0d0d08', '#3a3824'], fern: '#4a4632' };
// Meer über der Halle: dunkles Oliv, nach oben dichter; Lichtnetz (Kaustik) in blassem Wasserlicht
const WASSER = ['#040504', '#080a07', '#0d110b', '#131910', '#1b2216', '#242c1c', '#2f3823', '#3c452b', '#4c5434', '#60663f'];
const LICHTNETZ = ['#7c8050', '#a4a46c'];
// Kacheln der Wände und des Bodens: Aktenpapier im Wasserlicht, dunkel bis hell
const KACHEL = ['#0b0a07', '#12110c', '#1a1811', '#232017', '#2e2a1e', '#3a3526', '#47412f', '#554e38', '#655d43', '#786e50', '#8c8160', '#a29572'];
const HOLZ = ['#070504', '#0e0906', '#170f09', '#21160d', '#2c1e12', '#392818'];
const MESS = ['#100b05', '#1d1509', '#2e220e', '#433214', '#5c461c', '#7a5e26', '#9c7a34', '#c09c48', '#e0c26a'];
const SIEGEL = '#9c2a1e', ROT = '#ec4a34', ROT_G = '#3a120c';
const LAMPE = '#f0c870', LAMPE_K = '#fff2d0', LAMPE_G = '#2e2410', LAMPE_G2 = '#4a3a18';
const WLICHT = '#b8bc84', WLICHT_G = '#22261a';
const VORNE = ['#030302', '#070605', '#0c0a07', '#14110b'];
const frac = v => v - Math.floor(v);
const holzMat = (ton, x) => Object.assign({ k: HOLZ.slice(0, 6), r: [MESS[5], '#d8cca0'], ton, fase: 1.5, rand: 2, schatten: 2 }, x || {});
const messMat = (ton, x) => Object.assign({ k: MESS.slice(0, 7), r: [MESS[7], '#f0e2a8'], ton, fase: 1.5, rand: 2, schatten: 2 }, x || {});

// ---------- Das Meer über der Halle ----------
// Wellen-Unterseite mit Lichtnetz: Linien, wo sich zwei Wellenfelder kreuzen (wie Licht am Grund eines Beckens)
function meer(K, unten, o) {
  o = o || {}; const sd = (K.o.seed | 0) % 61, lx = o.lichtX === undefined ? 360 : o.lichtX;
  const netz = [];
  B.feld(K.e[0], -M, -M, W + M, unten, WASSER, (x, y) => {
    const q = (y + M) / (unten + M), schein = Math.exp(-(((x - lx) / 190) ** 2)) * (1 - q * .6);
    const per = 1 + q * 1.4, u = x * .085 / per + y * .03, v = y * .2 / per - x * .02;
    const c = Math.abs(Math.sin(u + Math.sin(v * 1.3 + sd) * 1.3 + B.fbm(x * .03, y * .06, sd + 9, 2) * 2.5) + Math.sin(v * 1.7 - u * .6 + sd * .3));
    if (c < .07 && q > .2 && B.hash(x, y, sd) < .55) netz.push(x, y);
    return .1 + q * .3 + schein * .3 + (B.fbm(x * .02, y * .05, sd, 2) - .5) * .14 + (c < .2 ? .07 : 0);
  });
  // Lichtnetz statisch (gedithert) und ruhig wandernd
  for (let i = 0; i < netz.length; i += 2) { const x = netz[i], y = netz[i + 1]; if (B.bay(x, y) < .35) K.e[0].set(x, y, B.pk(LICHTNETZ[y > unten * .6 && B.bay(x, y) < .15 ? 1 : 0])); }
  if (!o.ruhig) { const cs = B.css(LICHTNETZ[1]); K.anim.push({ p: 0, f(ctx, t) { ctx.fillStyle = cs; for (let i = 0; i < netz.length; i += 6) { const x = netz[i], y = netz[i + 1]; if (Math.sin(t * .8 + x * .05 + y * .21) > .7) ctx.fillRect(x, y, 2, 1); } } }); }
}
// Lichtbahnen von oben rechts durch das Wasser, schräg nach links unten (statisch, additiv, gedithert)
function bahnen(K, lst, ebenen) {
  for (const [x, w, a] of lst) for (const eb of ebenen || [1, 2, 3]) B.kegel(K.e[eb], x, -40, 1.95, w, 320, WLICHT_G, a);
}
// ---------- Boden: Kacheln im Schachbrett, perspektivisch ----------
function fliesen(K, P, o) {
  o = o || {}; const lx = o.lichtX === undefined ? 300 : o.lichtX, gr = o.gross || .5, sd = (K.o.seed | 0) % 41;
  const tf = (x, y) => {
    const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z);
    const i = Math.floor(X / gr), j = Math.floor(Z / gr), hell = (i + j) & 1;
    const fern = B.clamp(1 - 3.2 / Z, 0, 1), fuge = k * gr > 10 && (frac(X / gr) < .04 || frac(Z / gr) < .04 * Z / 2);
    const kon = B.clamp((k * gr - 6) / 16, 0, 1);
    let t = .26 + fern * .34 + (hell ? .14 : 0) * kon + .07 * (1 - kon) + (B.hash(i, j, sd) - .5) * .06 * kon;
    t += .2 * Math.exp(-(((x - lx) / 150) ** 2)) * fern;               // Licht hinten
    for (const [px, pz, pr, ps] of (o.flecken || [])) { const d = Math.hypot(X - px, (Z - pz) * .7) / pr; if (d < 1) t += ps * (1 - d * d); }
    if (fuge) t -= .12;
    if (o.nass) t += (B.fbm(X * .7, Z * .7, sd + 3, 2) - .5) * .12;
    return t;
  };
  B.feld(K.e[2], -M, K.split[0], W + M, H + M, KACHEL, tf);
  K.boden(P.vy, H + M, KACHEL, tf);
}
// Rückwand bei Tiefe Z: Kacheln, Holzvertäfelung unten, oben abgebrochen (dort fängt das Meer an)
function rueckwand(K, P, Z, o) {
  o = o || {}; const k = P.k(Z), yB = P.q(0, 0, Z)[1], sd = (K.o.seed | 0) % 37, eb = o.ebene || 1;
  const hoehe = o.hoehe || 5.5, kante = x => yB - k * (hoehe + Math.sin(x * .05 + sd) * .25 + (B.fbm(x * .03, 0, sd, 2) - .5) * 1.4 * (o.bruch || 1));
  const m = B.maske(); m.fn(-M, 0, W + M, yB, (x, y) => y >= kante(x));
  const kx = k * .16, ky = k * .12;
  K.form(eb, m, o.tiefe === undefined ? .25 : o.tiefe, { k: KACHEL.slice(2, 11), r: [KACHEL[10], '#d8d0a8'], ton: 3.2, fase: 0, rand: 1, rimF: .1,
    muster: (x, y) => { const h = (yB - y) / k; if (h < .9) return -2 + (frac((x - P.vx) / (k * .6)) < .06 ? -.6 : 0) + (frac(h / .3) < .1 ? .5 : 0);
      return (frac(x / kx) < .12 || frac(y / ky) < .14 ? -.8 : 0) + Math.exp(-(((x - (o.lichtX || 330)) / 160) ** 2)) * 1.6 + (B.hash(Math.floor(x / kx), Math.floor(y / ky), sd) - .5) * .5 - h * .08; } });
  return { yB, k, kante, m };
}
// Bogenfenster/Türen in einer Wand (zeigen das Wasser dahinter)
function boegen(K, P, Z, xs, o) {
  o = o || {}; const k = P.k(Z), yB = P.q(0, 0, Z)[1];
  for (const X of xs) {
    const [cx] = P.q(X, 0, Z), w = k * (o.breite || .5), h = k * (o.hoehe || 2.4), y0 = yB - k * (o.sockel || .15);
    const m = B.maske(); m.rect(cx - w, y0 - h + w, w * 2, h - w); m.ell(cx, y0 - h + w, w, w);
    B.feld(K.e[o.ebene || 1], cx - w - 1, y0 - h - 1, cx + w + 1, y0 + 1, WASSER, (x, y) => m.has(x, y) ? .35 + (y0 - y) / h * .3 + (Math.abs(Math.sin(x * .2 + y * .07)) < .12 ? .25 : 0) : NaN);
    // Laibung: Messingrahmen, Sprossen
    const r = B.maske(); r.rect(cx - .6, y0 - h + w, 1.2, h - w); r.rect(cx - w, y0 - h * .55, w * 2, 1);
    B.form(K.e[o.ebene || 1], r, K.mat(.3, { k: MESS.slice(1, 5), r: [MESS[6]], ton: 2, fase: 0, rand: 1 }));
  }
}
// ---------- Das Wahrzeichen: die Balkenwaage ----------
// Säule (wie ein Schiffsmast, genietet) bei (X, Z), Balken in Höhe Yb mit halber Länge L, Neigung kipp (positiv = links tiefer).
// Schalen an drei Ketten; links leer (hängt tiefer), rechts voll.
function waage(K, P, o) {
  const k = P.k(o.Z), [cx, yF] = P.q(o.X, 0, o.Z), eb = o.ebene || 1, ti = o.tiefe === undefined ? .15 : o.tiefe;
  const yb = yF - o.Yb * k, half = o.L * k, ca = Math.cos(o.kipp), sa = Math.sin(o.kipp);
  // Sockel: Stufen aus Messing und Stein
  const s = B.maske(); s.rect(cx - k * .9, yF - k * .25, k * 1.8, k * .25); s.rect(cx - k * .6, yF - k * .5, k * 1.2, k * .26);
  K.form(eb, s, ti, messMat(2, { muster: (x, y) => (Math.abs(y - (yF - k * .25)) < 1 ? -1 : 0) }));
  // Säule: verjüngt, mit Ringen
  const sm = B.maske(); sm.kap(cx, yF - k * .5, cx, yb + k * .3, k * .28, k * .18);
  K.form(eb, sm, ti, messMat(2.6, { muster: (x, y) => (frac((y - yb) / (k * .9)) < .06 ? 1.2 : 0) + (frac((y - yb) / (k * .3)) < .05 ? -.5 : 0) + ((x - cx) / (k * .3)) * .9 }));
  // Balken: Fachwerk aus Messing (Ober- und Untergurt, Streben), damit er groß und leicht zugleich wirkt
  const pL = [cx - ca * half, yb + sa * half], pR = [cx + ca * half, yb - sa * half];
  const bm = B.maske(), d = k * .12;
  bm.kap(pL[0], pL[1], pR[0], pR[1], d * 1.4, d * 1.4);
  const nx = -sa, ny = -ca; // nach oben (senkrecht zum Balken)
  const ob = (q, h) => [pL[0] + (pR[0] - pL[0]) * q + nx * h, pL[1] + (pR[1] - pL[1]) * q + ny * h];
  const H0 = k * .55 * (o.hoch || 1);
  const hq = q => H0 * (1 - Math.abs(q - .5) * 1.6);
  for (let i = 0; i <= 12; i++) { const q0 = i / 12, q1 = (i + 1) / 12; const a = ob(q0, hq(q0)), b = ob(Math.min(1, q1), hq(Math.min(1, q1))); if (i < 12) bm.kap(a[0], a[1], b[0], b[1], d, d); const u = ob(q0, 0); bm.kap(u[0], u[1], a[0], a[1], d * .6, d * .6); if (i < 12 && i % 2 === 0) { const c2 = ob(q1, 0); bm.kap(a[0], a[1], c2[0], c2[1], d * .5, d * .5); } }
  bm.ell(cx, yb, k * .35, k * .35); // Drehpunkt
  // Zunge: steigt über dem Drehpunkt, kippt mit
  const zl = k * (o.zunge || 1.8), zx = cx + nx * zl, zy = yb + ny * zl;
  bm.kap(cx, yb, zx, zy, k * .1, k * .04);
  K.form(eb, bm, ti, messMat(3.2, { fase: 1, rand: 2 }));
  // Schalen
  const schale = (p, tief, voll) => {
    const sx = p[0], sy = p[1] + tief * k, sw = k * (o.schale || 1.5);
    const km = B.maske(); for (const dx of [-.92, 0, .92]) km.kap(p[0], p[1], sx + dx * sw, sy - k * .05, Math.max(.5, k * .025), Math.max(.5, k * .025));
    B.form(K.e[eb], km, K.mat(ti, { k: MESS.slice(2, 6), r: [MESS[7]], ton: 2, fase: 0, rand: 1 }));
    const sm2 = B.maske(); sm2.fn(sx - sw - 1, sy - k * .1, sx + sw + 1, sy + k * .4, (x, y) => { const u = (x - sx) / sw; return Math.abs(u) <= 1 && y >= sy - k * .06 && y <= sy + k * .32 * Math.sqrt(Math.max(0, 1 - u * u)); });
    K.form(eb, sm2, ti, messMat(2.4, { muster: (x, y) => (y < sy + 1 ? 2.2 : 0) + ((x - sx) / sw) * .8 }));
    if (voll) {
      // Habe: Mäntel, Koffer, ein Bündel Briefe; Ringe glänzen
      const hm = B.maske(), r = B.rng(77 + (K.o.seed | 0));
      hm.ell(sx - sw * .45, sy - k * .18, sw * .4, k * .26); hm.ell(sx + sw * .25, sy - k * .26, sw * .5, k * .34); hm.rect(sx - sw * .1, sy - k * .62, sw * .5, k * .34);
      hm.kap(sx - sw * .8, sy - k * .1, sx - sw * 1.15, sy + k * .7, k * .1, k * .08); // Mantelärmel hängt über den Rand
      K.form(eb, hm, ti, { k: HOLZ.slice(0, 6), r: [KACHEL[9], '#d8d0a8'], ton: 2, fase: 1, rand: 2, muster: (x, y) => (B.fbm(x * .2, y * .2, 3, 2) - .5) * 1.4 });
      for (let i = 0; i < 6; i++) { const x = sx + r.f(-.7, .7) * sw, y = sy - k * r.f(.1, .45); if (K.e[eb].get(x, y) >>> 24) K.e[eb].set(x, y, B.pk(i % 2 ? MESS[8] : '#d8d0a8')); }
      const br = B.maske(); br.rect(sx + sw * .05, sy - k * .58, sw * .32, k * .14); B.form(K.e[eb], br, K.mat(ti, { k: KACHEL.slice(7, 11), r: ['#e6dcbc'], ton: 2, fase: 0, rand: 1 }));
      K.e[eb].set(sx + sw * .2, sy - k * .52, B.pk(SIEGEL));
    }
    return { x: sx, y: sy, w: sw };
  };
  const SL = schale(pL, o.tiefL, false), SR = schale(pR, o.tiefR, true);
  K.licht(cx, yb, MESS[8], k * 3, .4);
  return { cx, yF, yb, pL, pR, SL, SR, zx, zy };
}
// Wartebank mit sitzenden Ertrunkenen (Silhouetten, nur Hut, Schultern, Wartemarke)
function bank(K, P, X0, X1, Z, o) {
  o = o || {}; const k = P.k(Z), [x0, y] = P.q(X0, 0, Z), [x1] = P.q(X1, 0, Z), eb = K.eb(y - 1), ti = o.tiefe || 0;
  const m = B.maske(); m.rect(x0, y - k * .32, x1 - x0, k * .06); m.rect(x0, y - k * .62, x1 - x0, k * .05);
  for (let x = x0 + 2; x < x1; x += k * .9) m.rect(x, y - k * .62, Math.max(1, k * .04), k * .62);
  K.form(eb, m, ti, holzMat(1.8));
  const r = B.rng(31 + Math.round(X0 * 10) + (K.o.seed | 0)), n = Math.floor((x1 - x0) / (k * .42));
  const sitz = B.maske();
  for (let i = 0; i < n; i++) {
    if (r() < (o.leer || .25)) continue; const x = x0 + (i + .5) * (x1 - x0) / n, hh = k * r.f(.62, .74);
    sitz.poly([[x - k * .14, y - k * .32], [x - k * .12, y - hh + k * .12], [x - k * .02, y - hh + k * .05], [x + k * .1, y - hh + k * .1], [x + k * .14, y - k * .32]]);
    sitz.ell(x - k * .02, y - hh, k * .07, k * .08);
    if (r() < .5) sitz.rect(x - k * .1, y - hh - k * .07, k * .18, k * .04);
    if (k > 30 && r() < .6) sitz.kap(x - k * .1, y - k * .4, x - k * .02, y - k * .1, k * .03, k * .03);
  }
  K.form(eb, sitz, ti + .1, { k: VORNE.slice(0, 4), r: [KACHEL[8], '#c8c09a'], ton: 1.4, fase: 1, rand: 2 });
  // Wartemarken: winzige helle Kärtchen in den Händen
  for (let i = 0; i < n; i++) if (B.hash(i, 3, (K.o.seed | 0) + Math.round(X0)) < .5) { const x = x0 + (i + .5) * (x1 - x0) / n - k * .04, yy = y - k * .38; if (sitz.has(x, yy)) K.e[eb].set(x, yy, B.pk('#c8c09a')); }
}
// Absperrpfosten mit Kordel (Messing), Vordergrund: gibt Maßstab und rahmt
function pfosten(K, xs, y, o) {
  o = o || {}; const h = o.h || 48, m = B.maske(), kd = B.maske();
  for (const x of xs) { m.kap(x, y, x, y - h, 2.2, 1.6); m.ell(x, y - h - 2, 3, 3); m.ell(x, y, 7, 2.4); }
  for (let i = 0; i + 1 < xs.length; i++) { const a = xs[i], b = xs[i + 1]; for (let s = 0; s <= 20; s++) { const q = s / 20, x = a + (b - a) * q, yy = y - h + 6 + Math.sin(q * Math.PI) * (o.durch || 14); kd.ell(x, yy, 1.6, 1.6); } }
  B.form(K.e[5], kd, { k: ['#1a0806', '#2e0e0a', '#4a1610', SIEGEL].map(B.pk), r: [B.pk('#d06048')], ton: 2, fase: 0, rand: 1 });
  B.form(K.e[5], m, { k: MESS.slice(0, 5).map(B.pk), r: [MESS[7], '#f0e2a8'].map(B.pk), ton: 1.8, fase: 1, rand: 2, L: B.L });
}
// Hängelampe mit Messingschirm, warmes Licht nach unten
function haengelampe(K, x, y, eb, o) {
  o = o || {}; const m = B.maske(); m.kap(x, -M, x, y - 4, .6, .6); m.poly([[x - 7, y + 1], [x + 7, y + 1], [x + 3, y - 4], [x - 3, y - 4]]);
  B.form(K.e[eb], m, K.mat(o.tiefe || 0, { k: MESS.slice(0, 5), r: [MESS[7]], ton: 2, fase: 0, rand: 1 }));
  for (let i = -5; i <= 5; i++) K.e[eb].set(x + i, y + 1, B.pk(Math.abs(i) < 3 ? LAMPE_K : LAMPE));
  B.kegel(K.e[eb], x, y + 2, Math.PI / 2, .55, o.kegel || 70, LAMPE_G2, .9);
  K.glut(x, y + 6, o.glanz || 30, LAMPE_G, .9, o.ebenen || [eb]);
  K.licht(x, y + 4, LAMPE, 50, .8);
}
// Schalterfenster: Holzkasten, Messinggitter, Lampe dahinter, Nummerntafel
function schalter(K, x, y, w, h, eb, o) {
  o = o || {}; const m = B.maske(); m.rect(x, y - h, w, h); const fen = B.maske(); fen.rect(x + w * .14, y - h * .86, w * .72, h * .48);
  K.form(eb, m, o.tiefe || 0, holzMat(1.8, { muster: (px, py) => (fen.has(px, py) ? 0 : (Math.abs(py - (y - h * .3)) < 1 ? 1 : 0) + (frac((px - x) / (w * .5)) < .04 ? -.8 : 0)) }));
  // Fenster: dahinter warmes Licht, davor Gitterstäbe
  B.feld(K.e[eb], x + w * .14, y - h * .86, x + w * .86, y - h * .38, [HOLZ[2], LAMPE_G, LAMPE_G2, MESS[4], MESS[6]], (px, py) => fen.has(px, py) ? .2 + .7 * Math.exp(-(((px - x - w * .5) / (w * .3)) ** 2) - (((py - y + h * .7) / (h * .25)) ** 2)) : NaN);
  for (let px = Math.round(x + w * .18); px < x + w * .84; px += Math.max(3, Math.round(w * .09))) for (let py = Math.round(y - h * .86); py < y - h * .38; py++) K.e[eb].set(px, py, B.pk(py % 3 ? MESS[6] : MESS[4]));
  // Durchreiche unten im Gitter, dunkel; Nummerntafel oben (Messing, eine rote Ziffer)
  for (let px = Math.round(x + w * .36); px < x + w * .64; px++) K.e[eb].set(px, Math.round(y - h * .4), B.pk(HOLZ[0]));
  if (o.nummer !== false) { const t = B.maske(); t.rect(x + w * .3, y - h - h * .22, w * .4, h * .16); K.form(eb, t, o.tiefe || 0, messMat(2.4, { fase: 0, rand: 1 })); K.e[eb].set(x + w * .5, y - h - h * .15, B.pk(ROT)); K.e[eb].set(x + w * .5, y - h - h * .13, B.pk(ROT)); }
  K.licht(x + w / 2, y - h * .6, LAMPE, w, .5);
}
// Registratur: Regale mit Schubladen bis in die Dunkelheit, eine Leiter
function registratur(K, P, X, Z0, Z1, o) {
  o = o || {}; const eb = o.ebene || 2, hoehe = o.hoehe || 7, unten = [], oben = [];
  for (let Z = Z0; Z <= Z1; Z *= 1.03) { unten.push(P.q(X, 0, Z)); oben.push(P.q(X, hoehe + Math.sin(Z) * .4, Z)); }
  const m = B.maske(); m.poly([...unten, ...oben.reverse()]);
  const seite = X < 0 ? -1 : 1;
  K.form(eb, m, o.tiefe || .05, holzMat(3.4, { k: KACHEL.slice(2, 10), r: [KACHEL[11], '#e6dcbc'], muster: (x, y) => { const Z = (X * P.h) / Math.max(1, Math.abs(x - P.vx)) * Math.sign(X * (x - P.vx) || 1), Y = 1 - (y - P.vy) * Z / P.h; const fz = frac(Z / .35), fy = frac(Y / .28);
    if (fz < .08 || fy < .1) return -1.4; const id = Math.floor(Z / .35) * 31 + Math.floor(Y / .28); return (B.hash(id, 1, 5) < .05 ? -2 : 0) + (fy > .4 && fy < .55 && fz > .4 && fz < .6 ? 2.2 : 0) + (B.hash(id, 2, 5) - .5) * .5 - Y * .07; } }));
  void seite;
  return m;
}
// Kanonenofen (Rast): gusseisern, Ofenrohr nach oben, rote Glut hinter dem Türchen
function kanonenofen(K, x, y) {
  const m = B.maske(); m.kap(x, y - 6, x, y - 34, 11, 9); m.ell(x, y - 36, 10, 3); m.rect(x - 13, y - 6, 26, 5); m.kap(x - 9, y, x - 10, y - 4, 1.5, 1.5); m.kap(x + 9, y, x + 10, y - 4, 1.5, 1.5);
  m.kap(x + 2, y - 38, x + 2, -M, 3, 3);
  B.form(K.e[4], m, { k: VORNE.map(B.pk), r: [MESS[6], '#f0d8a0'].map(B.pk), ton: 1.6, fase: 1.5, rand: 2, schatten: 2, L: B.L, muster: (px, py) => (Math.abs(py - (y - 22)) < 1 ? 1 : 0) });
  for (let py = y - 18; py < y - 11; py++) for (let px = x - 5; px <= x + 5; px++) K.e[4].set(px, py, B.pk((px + py) % 2 ? ROT : '#ffb070'));
  for (const L of [K.e[3], K.e[4]]) B.gluehen(L, x, y - 14, 60, '#4a1a08', .9);
  K.licht(x, y - 14, '#ff8a50', 70, 1);
  const g1 = B.glanzSprite(18, '#5a1e08', .7), g2 = B.glanzSprite(21, '#5a1e08', .8);
  K.luft.push({ p: .8, f(ctx, t, ox, oy) { const fl = Math.sin(t * 5.3) + Math.sin(t * 9.1) * .6; const g = fl > 0 ? g2 : g1; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(g, x - g.R + ox, y - 15 - g.R + oy); ctx.globalCompositeOperation = 'source-over'; } });
}
// Asservaten: Koffer- und Mantelhaufen hinter einem Gitter (Krämer, Variante 2)
function asservaten(K, x, y, o) {
  o = o || {}; const m = B.maske(), r = B.rng(13 + (K.o.seed | 0));
  // Koffer in drei Lagen, unten breit, oben schmal; daneben Mantelballen, die zusammensacken
  let yy = y;
  for (const [n, br] of [[4, 90], [3, 66], [2, 40]]) { let xx = x - br / 2, hmax = 0; for (let i = 0; i < n; i++) { const w = br / n - 2 + r.f(-3, 3), h = r.f(9, 13); m.rect(xx, yy - h, w, h); m.rect(xx + w * .35, yy - h - 2, w * .3, 2); xx += br / n; hmax = Math.max(hmax, h); } yy -= hmax - 1; }
  m.ell(x - 56, y - 7, 14, 8); m.ell(x - 48, y - 15, 10, 7); m.ell(x + 54, y - 6, 13, 7);
  K.form(4, m, 0, holzMat(1.8, { muster: (px, py) => (B.hash(Math.floor(px / 9), Math.floor(py / 6), 3) - .5) * 1 + (frac(py / 11) < .08 ? -1 : 0) }));
  for (let i = 0; i < 14; i++) { const px = x + r.f(-44, 44), py = y - r.f(3, 34); if (K.e[4].get(px, py) >>> 24) K.e[4].set(px, py, B.pk(i % 3 ? MESS[7] : '#d8d0a8')); }
  if (o.gitter) { const g = B.maske(); for (let gx = x - 66; gx <= x + 66; gx += 8) g.rect(gx, y - 76, 1, 76); g.rect(x - 66, y - 76, 133, 2); B.form(K.e[4], g, K.mat(0, { k: MESS.slice(1, 5), r: [MESS[7]], ton: 2, fase: 0, rand: 1 })); }
  haengelampe(K, x, y - 80, 4, { kegel: 60, glanz: 40, ebenen: [3, 4] });
}
// Papier treibt nach oben (Luft): einzelne Blätter, die sich drehen
function papier(K, n, o) {
  o = o || {}; const cs = ['#a29572', '#d8d0a8', '#786e50'].map(B.css), P = [];
  for (let i = 0; i < n; i++) P.push({ x: (o.x0 || 0) + Math.random() * ((o.x1 || W) - (o.x0 || 0)), y: Math.random() * H, v: 4 + Math.random() * 6, ph: Math.random() * 6.28, s: Math.random() < .3 ? 2 : 1 });
  K.luft.push({ p: o.p === undefined ? .7 : o.p, f(ctx, t, ox, oy) { for (const q of P) { let y = (q.y - t * q.v) % (H + 20); if (y < -10) y += H + 20; const x = q.x + Math.sin(t * .7 + q.ph) * 6, w = Math.abs(Math.sin(t * 1.3 + q.ph)); ctx.fillStyle = cs[w > .7 ? 1 : w > .3 ? 0 : 2]; ctx.fillRect(Math.round(x) + ox, Math.round(y) + oy, Math.max(1, Math.round((q.s + 1) * w)), q.s); } } });
}

// =====================================================================
// Variante 0: Die Halle. Abfertigungshalle, Schachbrettboden in die Tiefe; hinten die Kachelwand, abgebrochen,
// darüber das Meer. Die Waage steht in der Halle wie ein Schiffsmast, der Balken spannt über die halbe Breite,
// links die leere Schale tief über dem Boden. Links eine Wartebank mit Ertrunkenen, vorn Absperrpfosten.
function halle(K, o) {
  o = o || {}; const P = B.persp(236, 142), fr = K.fr; K.split = [160, 178];
  meer(K, 130, { lichtX: 380, ruhig: o.ruhig });
  rueckwand(K, P, 11, { hoehe: 4.4, lichtX: 300, tiefe: .28 });
  // Seitenwände in Flucht: links Kacheln mit Bänken, rechts Bogenfenster zum Wasser
  for (const XW of [-6.5, 6.5]) {
    const un = [], ob = []; for (let Z = 1; Z <= 11; Z *= 1.03) { un.push(P.q(XW, 0, Z)); ob.push(P.q(XW, 4.4 + (B.fbm(Z * .5, XW, 4, 2) - .5) * 1.4, Z)); }
    const aus = XW < 0 ? [[-M - 400, -M - 300], [-M - 400, H + M]] : [[W + M + 400, -M - 300], [W + M + 400, H + M]];
    const wm = B.maske(); wm.poly([...un, ...ob.reverse(), ...aus]);
    K.form(2, wm, .12, { k: KACHEL.slice(1, 9), r: [KACHEL[10], '#d8d0a8'], ton: 2.4, fase: 1, rand: 2, muster: (x, y) => { const Z = (XW * P.h) / ((x - P.vx) || .01), Y = 1 - (y - P.vy) * Z / P.h; if (Z < 0) return -2;
      const fen = XW > 0 && frac(Z / 2.2) > .55 && frac(Z / 2.2) < .85 && Y > .5 && Y < 2.6 + (frac(Z / 2.2) - .7) * 0; return (Y < .8 ? -1.4 : 0) + (frac(Z / .3) < .08 || frac(Y / .22) < .1 ? -.6 : 0) + (fen ? -2.4 + (Math.abs(Math.sin(Y * 5 + Z * 3)) < .15 ? 1.6 : 0) : 0) + Math.max(0, 1 - Z / 8) * .2; } });
  }
  fliesen(K, P, { lichtX: 300, flecken: [[-1.6, 3.4, 1.4, .1], [2.6, 5.5, 1.6, .12]] });
  bahnen(K, [[430, .07, .5], [330, .05, .45], [520, .09, .4]], [1, 2]);
  // Schalter in der Rückwand
  for (const X of [-3.6, -1, 3.4]) { const [x, y] = P.q(X, 0, 10.8), k = P.k(10.8); schalter(K, x - k * .7, y, k * 1.4, k * 1.25, 1, { tiefe: .22 }); }
  const wg = waage(K, P, { X: -3.6, Z: 7.4, Yb: 7.6, L: 8.4, kipp: .1 + fr * .05, tiefL: 6.2, tiefR: 2.6, zunge: 1.8, schale: 1.5, ebene: 2, tiefe: .06 });
  bank(K, P, -6.2, -4.3, 3.1, { leer: .2 });
  bank(K, P, -6.3, -4.6, 5.6, { leer: .3, tiefe: .1 });
  if (fr > .5) bank(K, P, 4.6, 6.2, 4.4, { leer: .35, tiefe: .05 });
  haengelampe(K, 40, 92, 3, { kegel: 80, glanz: 36, ebenen: [2, 3] });
  if (!o.ohneVorne) pfosten(K, [-6, 40, 96], 262, { h: 54, durch: 12 });
  if (!o.ohneVorne) pfosten(K, [418, 470], 266, { h: 58, durch: 10 });
  papier(K, 26, {});
  B.partikel(K, { n: 30, farben: [WASSER[8], LICHTNETZ[0]], vx: 0, vy: -5, wob: 2, wf: .5, laenge: 1, p: .5 });
  K.reihen = [{ y: 168, skala: .9, nebel: .25 }, { y: 191, skala: 1, nebel: .1 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 210], wg };
}
// Variante 1: Die Schalter. Rechts läuft die Schalterreihe in die Tiefe (Messinggitter, Lampen dahinter), links
// steigt die Registratur bis ins Wasser. Hinten, am Ende der Halle, die Waage; die leere Schale links tief.
function schalterhalle(K, o) {
  o = o || {}; const P = B.persp(214, 146), fr = K.fr; K.split = [162, 180];
  meer(K, 130, { lichtX: 300, ruhig: o.ruhig });
  rueckwand(K, P, 18, { hoehe: 6, lichtX: 230, tiefe: .32, ebene: 1 });
  fliesen(K, P, { lichtX: 240, gross: .45, flecken: [[.4, 4, 1.4, .1]] });
  bahnen(K, [[360, .06, .5], [270, .05, .4]], [1, 2]);
  waage(K, P, { X: .4, Z: 16, Yb: 8.4, L: 7.6, kipp: .12 + fr * .05, tiefL: 4.8, tiefR: 2.6, zunge: 2, schale: 1.5, ebene: 1, tiefe: .25 });
  // Schalterwand rechts in Flucht: Wand bei X = 3.2, Schalter alle 1.6 Tiefe
  const XW = 3.2, un = [], ob = [];
  for (let Z = 1; Z <= 18; Z *= 1.03) { un.push(P.q(XW, 0, Z)); ob.push(P.q(XW, 3.4 + (B.fbm(Z * .4, 0, 4, 2) - .5) * 1.2, Z)); }
  const wm = B.maske(); wm.poly([...un, ...ob.reverse(), [W + M + 300, -M - 300], [W + M + 300, H + M]]);
  K.form(2, wm, .08, { k: KACHEL.slice(1, 9), r: [KACHEL[10], '#d8d0a8'], ton: 2.2, fase: 1, rand: 2, muster: (x, y) => { const Z = (XW * P.h) / Math.max(1, x - P.vx), Y = 1 - (y - P.vy) * Z / P.h; return (Y < .8 ? -1.2 : 0) + (frac(Z / .25) < .08 || frac(Y / .2) < .1 ? -.7 : 0) + (B.hash(Math.floor(Z / .25), Math.floor(Y / .2), 3) - .5) * .4 + Math.max(0, 1 - Z / 10) * .3; } });
  for (let i = 0; i < 6; i++) {
    const Z = 2.6 + i * 1.9, Z2 = Z + .9, a = P.q(XW, 0, Z), b = P.q(XW, 0, Z2), h = P.k(Z) * 1.35, h2 = P.k(Z2) * 1.35;
    const m = B.maske(); m.poly([[a[0], a[1]], [b[0], b[1]], [b[0], b[1] - h2], [a[0], a[1] - h]]);
    const glas = B.maske(); glas.poly([[a[0] + (b[0] - a[0]) * .12, a[1] - h * .88], [b[0] - (b[0] - a[0]) * .12, b[1] - h2 * .88], [b[0] - (b[0] - a[0]) * .12, b[1] - h2 * .44], [a[0] + (b[0] - a[0]) * .12, a[1] - h * .44]]);
    const an = fr < .8 || i % 2 === 0;
    K.form(i < 2 ? 3 : 2, m, i * .03, holzMat(1.6, { muster: (x, y) => glas.has(x, y) ? 2.8 + (an ? 1.6 * Math.exp(-(((y - (a[1] - h * .66)) / (h * .2)) ** 2)) : -1) + ((x & 3) === 0 ? -1.8 : 0) : (Math.abs(y - (a[1] - h * .44)) < 1.5 ? 1.4 : 0) }));
    { const eb2 = i < 2 ? 3 : 2, x0 = Math.min(a[0], b[0]) - 1, x1 = Math.max(a[0], b[0]) + 1, mx = (a[0] + b[0]) / 2, my = a[1] - h * .66;
      B.feld(K.e[eb2], x0, b[1] - h2 - 2, x1, a[1], [HOLZ[1], HOLZ[3], LAMPE_G, LAMPE_G2, MESS[5], MESS[7], LAMPE], (x, y) => glas.has(x, y) ? (an ? .25 + .8 * Math.exp(-(((x - mx) / ((x1 - x0) * .4)) ** 2) - (((y - my) / (h * .22)) ** 2)) : .1) : NaN);
      const gs = Math.max(2, Math.round((x1 - x0) / 7)); for (let x = Math.round(x0) + 1; x < x1; x += gs) for (let y = Math.round(b[1] - h2); y < a[1]; y++) if (glas.has(x, y)) K.e[eb2].set(x, y, B.pk(y % 3 ? MESS[6] : MESS[3])); }
    if (an) { K.glut((a[0] + b[0]) / 2, a[1] - h * .66, h * 1.1, LAMPE_G, .8, [2, 3]); K.licht((a[0] + b[0]) / 2, a[1] - h * .66, LAMPE, h, .6); }
  }
  // Registratur links, bis ins Wasser
  registratur(K, P, -4.4, 1.1, 22, { hoehe: 9, ebene: 2 });
  // Leiter an der Registratur
  const lm = B.maske(), l0 = P.q(-4.1, 0, 3.2), l1 = P.q(-4.3, 5.5, 3.6); lm.kap(l0[0], l0[1], l1[0], l1[1], 1.4, 1.2); lm.kap(l0[0] + 12, l0[1], l1[0] + 10, l1[1], 1.4, 1.2);
  for (let i = 1; i < 12; i++) { const q = i / 12; lm.kap(l0[0] + (l1[0] - l0[0]) * q, l0[1] + (l1[1] - l0[1]) * q, l0[0] + 12 + (l1[0] - l0[0] - 2) * q, l0[1] + (l1[1] - l0[1]) * q, .8, .8); }
  K.form(3, lm, 0, holzMat(2));
  // Papierbahnen aus einer offenen Schublade, steigen ins Wasser
  const pb = B.maske(), s0 = P.q(-4.3, 2.2, 5.2); for (let j = 0; j < 3; j++) { const pts = []; for (let i = 0; i <= 12; i++) pts.push([s0[0] + j * 4 + Math.sin(i * .6 + j) * (2 + i * .5), s0[1] - i * 8]); pb.pfad(pts, 1.6, 1.2); }
  K.form(2, pb, .05, { k: KACHEL.slice(6, 11), r: ['#e6dcbc'], ton: 2.2, fase: 0, rand: 1 });
  papier(K, 30, { x0: 0, x1: 300 });
  B.partikel(K, { n: 30, farben: [WASSER[8], LICHTNETZ[0]], vx: 0, vy: -5, wob: 2, wf: .5, p: .5 });
  pfosten(K, [300, 360, 420, 480], 264, { h: 52, durch: 10 });
  K.reihen = [{ y: 170, skala: .9, nebel: .25 }, { y: 192, skala: 1, nebel: .1 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [220, 210] };
}
// Variante 2: Unter der Schale. Die leere Schale hängt riesig über dir, ihre genietete Unterseite füllt den
// Himmel links; drei Ketten laufen hinauf ins Wasser. Rechts der Fuß der Säule auf seinem Sockel, dahinter die
// Asservaten. Die Schale hängt so tief, dass man den Kopf einziehen möchte.
function unterDerSchale(K, o) {
  o = o || {}; const P = B.persp(250, 140), fr = K.fr; K.split = [158, 176];
  meer(K, 140, { lichtX: 330, ruhig: o.ruhig });
  rueckwand(K, P, 13, { hoehe: 4.6, lichtX: 320, tiefe: .3 });
  boegen(K, P, 13, [-6.4, 6.8], { breite: .5, hoehe: 2.6 });
  fliesen(K, P, { lichtX: 320, flecken: [[-2.2, 3.2, 1.8, -.14], [1.6, 4.4, 1.2, .1]] });
  bahnen(K, [[450, .08, .55], [360, .05, .4]], [1, 2]);
  // Säulenfuß rechts: Sockel aus Messing, Säule steigt aus dem Bild
  const [sx, sy] = P.q(3.4, 0, 6.2), k = P.k(6.2);
  const sm = B.maske(); sm.rect(sx - k * 1.4, sy - k * .3, k * 2.8, k * .3); sm.rect(sx - k * 1.05, sy - k * .62, k * 2.1, k * .34); sm.kap(sx, sy - k * .6, sx, -M, k * .62, k * .5);
  K.form(2, sm, .02, messMat(2.6, { muster: (x, y) => (frac((y - sy) / (k * .9)) < .06 ? 1.2 : 0) + ((x - sx) / (k * .4)) * .8 + (Math.abs(y - (sy - k * .3)) < 1.2 ? -1 : 0) }));
  // Inschrift-Band am Sockel: Ritzlinien (kein Text)
  for (let i = 0; i < 18; i++) { const x = sx - k * .7 + i * k * .08; if (B.hash(i, 1, 2) < .7) K.e[2].set(x, sy - k * .48, B.pk(MESS[2])); }
  // Asservaten hinten rechts
  asservaten(K, 400, 174, { gitter: false });
  // Die Schale: riesige Unterseite (Ellipse), Nietenreihen, Rand mit Messinglicht; Ketten nach oben
  const scx = 128, scy = 34 + fr * 6, sw = 170, sh = 42;
  const ketten = B.maske(); for (const [dx, top] of [[-150, -M], [-8, -M], [140, -M]]) ketten.kap(scx + dx * .95, scy - sh * .2, scx + dx * .4, top, 2.2, 1.6);
  K.form(3, ketten, 0, messMat(2, { fase: 0 }));
  const sc = B.maske(); sc.fn(scx - sw - 2, scy - sh * .4, scx + sw + 2, scy + sh + 2, (x, y) => { const u = (x - scx) / sw; return Math.abs(u) <= 1 && y >= scy - sh * .18 && y <= scy + sh * Math.sqrt(Math.max(0, 1 - u * u)); });
  K.form(3, sc, 0, messMat(1.8, { rand: 2, muster: (x, y) => { const u = (x - scx) / sw, v = (y - scy) / sh; const ring = Math.hypot(u, v * 1.1); return (y < scy - sh * .1 ? 3 : 0) + (frac(ring * 4) < .06 && (x + y) % 3 === 0 ? 2 : 0) - v * 1.2 + u * .6 + (B.fbm(x * .06, y * .08, 7, 2) - .5) * .8; } }));
  // Rand der Schale fängt Wasserlicht (dünne helle Linie oben)
  for (let x = scx - sw; x <= scx + sw; x++) { const y = Math.round(scy - sh * .18); if (sc.has(x, y)) { K.e[3].set(x, y, B.pk(x % 4 ? MESS[8] : '#f0e2a8')); K.e[3].set(x, y + 1, B.pk(MESS[6])); } }
  // Tropfen fallen aus der Schale (sie ist leer, und trotzdem)
  const tp = []; for (let i = 0; i < 8; i++) tp.push(scx - sw * .7 + i * sw * .2 + B.hash(i, 0, 3) * 10);
  K.anim.push({ p: .3, f(ctx, t, ox, oy) { ctx.fillStyle = B.css(LICHTNETZ[1]); tp.forEach((x, i) => { const q = frac(t * .25 + i * .37), y = scy + sh * .8 + q * 120; ctx.fillRect(Math.round(x) + ox, Math.round(y) + oy, 1, 2); }); } });
  K.glut(scx, scy + sh, 140, WLICHT_G, .4, [2]);
  bank(K, P, -6, -3.4, 3.4, { leer: .3 });
  if (!o.ohneVorne) pfosten(K, [8, 70], 266, { h: 56, durch: 12 });
  papier(K, 24, {});
  B.partikel(K, { n: 30, farben: [WASSER[8], LICHTNETZ[0]], vx: 0, vy: -5, wob: 2, wf: .5, p: .5 });
  K.reihen = [{ y: 166, skala: .9, nebel: .25 }, { y: 190, skala: 1, nebel: .1 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [250, 208] };
}
// =====================================================================
// Finale (Wächter-Szene, Das, was ruft): die Mitte der Waage. Hinter dem Boss der Skalenbogen, eine ruhige,
// helle Fläche aus Aktenpapier im Wasserlicht mit Teilstrichen, die Zunge zeigt nach links zu dir. Darüber spannt
// der Balken über die ganze Breite, links hängt die leere Schale tief, rechts hoch die volle. Bei der Ankunft
// (danach) steht die Waage gerade, beide Schalen leer.
function zunge(K, o) {
  o = o || {}; const P = B.persp(240, 150), ruhe = !!o.ankunft; K.split = [166, 182];
  meer(K, 140, { lichtX: 250, ruhig: ruhe });
  rueckwand(K, P, 20, { hoehe: 3, lichtX: 240, tiefe: .4, bruch: 1.4 });
  fliesen(K, P, { lichtX: 240, flecken: [[0, 5, 2.4, .12]] });
  // Skalenbogen: Halbkreis aus Papier hinter der Mitte (ruhige, helle Zone), mit Teilstrichen am Rand
  const cx = 240, cy = 176, R = 126, Ri = 98;
  const bogen = B.maske(); bogen.fn(cx - R - 2, cy - R - 2, cx + R + 2, cy, (x, y) => { const d = Math.hypot(x - cx, y - cy); return d <= R && y <= cy; });
  B.feld(K.e[1], cx - R - 2, cy - R - 2, cx + R + 2, cy + 1, KACHEL, (x, y) => { if (!bogen.has(x, y)) return NaN; const d = Math.hypot(x - cx, y - cy) / R, a = Math.atan2(y - cy, x - cx);
    if (d > .97) return .62; if (d > Ri / R && d < Ri / R + .02) return .5;
    // Teilstriche: alle 3 Grad fein, alle 15 Grad lang
    const g = (a * 180 / Math.PI + 360) % 3; const lang = Math.abs(((a * 180 / Math.PI + 360) % 15) - 7.5) > 7;
    if (d > Ri / R && g < .55 && (d > .88 || lang)) return .32;
    return .64 + .22 * (1 - d) + (B.fbm(x * .04, y * .04, 3, 2) - .5) * .06 - (d > Ri / R ? .05 : 0); });
  // Messingrahmen des Bogens
  const rahmen = B.maske(); rahmen.fn(cx - R - 6, cy - R - 6, cx + R + 6, cy + 2, (x, y) => { const d = Math.hypot(x - cx, y - cy); return d > R && d <= R + 5 && y <= cy; });
  B.form(K.e[1], rahmen, messMat(3, { L: [.75, -.66] }));
  // die rote Null-Marke oben; links (zu dir) ist die Skala abgegriffen
  for (let j = 0; j < 6; j++) { K.e[1].set(cx, cy - R + 3 + j, B.pk(SIEGEL)); K.e[1].set(cx + 1, cy - R + 3 + j, B.pk(SIEGEL)); }
  // Balken: über die ganze Breite, Drehpunkt über dem Bogen
  const kipp = ruhe ? 0 : .16, bx = cx, by = 30, half = 300, ca = Math.cos(kipp), sa = Math.sin(kipp);
  const pL = [bx - ca * half, by + sa * half], pR = [bx + ca * half, by - sa * half];
  const bm = B.maske(); bm.kap(pL[0], pL[1], pR[0], pR[1], 5, 5); bm.kap(pL[0] - sa * 20, pL[1] - ca * 20, pR[0] - sa * 20, pR[1] - ca * 20, 3, 3);
  for (let i = -10; i <= 10; i++) { const q = i / 10, x0 = bx + ca * half * q, y0 = by - sa * half * q; bm.kap(x0, y0, x0 - sa * 20 + (i % 2 ? 12 : -12) * ca, y0 - ca * 20 - (i % 2 ? 12 : -12) * sa, 1.6, 1.6); }
  bm.ell(bx, by, 14, 14);
  K.form(2, bm, .02, messMat(3, { fase: 1.5 }));
  // Zunge: vom Drehpunkt nach unten bis in den Bogen, zeigt nach links (zu dir); hinter dem Boss
  const za = Math.PI / 2 + (ruhe ? 0 : .34), zl = R - 8, zx = bx + Math.cos(za) * zl, zy = by + Math.sin(za) * zl * .0 + 0;
  void zx; void zy;
  const zm = B.maske(), ze = [bx + Math.cos(za) * (cy - by - 10) / Math.sin(za) * 0 - Math.tan(za - Math.PI / 2) * (cy - by - 12), cy - 12];
  zm.kap(bx, by + 6, ze[0], ze[1], 4, 1.2); zm.poly([[ze[0] - 4, ze[1] - 6], [ze[0] + 4, ze[1] - 4], [ze[0] - 1, ze[1] + 6]]);
  K.form(2, zm, .02, messMat(3.4, { fase: 1 }));
  // Schalen: links leer und tief (fast am Boden), rechts voll und hoch
  const schale = (p, tief, voll) => {
    const sx = p[0], sy = p[1] + tief, sw = 46;
    const km = B.maske(); for (const dx of [-.92, 0, .92]) km.kap(p[0], p[1], sx + dx * sw, sy - 2, 1.2, 1.2);
    B.form(K.e[3], km, K.mat(0, { k: MESS.slice(2, 6), r: [MESS[7]], ton: 2, fase: 0, rand: 1 }));
    const sm2 = B.maske(); sm2.fn(sx - sw - 1, sy - 4, sx + sw + 1, sy + 20, (x, y) => { const u = (x - sx) / sw; return Math.abs(u) <= 1 && y >= sy - 3 && y <= sy + 18 * Math.sqrt(Math.max(0, 1 - u * u)); });
    K.form(3, sm2, 0, messMat(2.4, { muster: (x, y) => (y < sy ? 2.2 : 0) + ((x - sx) / sw) * .8 }));
    if (voll) { const hm = B.maske(); hm.ell(sx - 18, sy - 10, 24, 12); hm.ell(sx + 16, sy - 14, 28, 16); hm.rect(sx - 4, sy - 34, 26, 16); hm.kap(sx - 40, sy - 4, sx - 56, sy + 34, 5, 4);
      K.form(3, hm, 0, { k: HOLZ.slice(0, 6), r: [KACHEL[9], '#d8d0a8'], ton: 2, fase: 1, rand: 2, muster: (x, y) => (B.fbm(x * .1, y * .1, 3, 2) - .5) * 1.4 });
      const br = B.maske(); br.rect(sx, sy - 31, 18, 7); B.form(K.e[3], br, K.mat(0, { k: KACHEL.slice(7, 11), r: ['#e6dcbc'], ton: 2, fase: 0, rand: 1 })); K.e[3].set(sx + 9, sy - 28, B.pk(SIEGEL)); K.e[3].set(sx + 10, sy - 28, B.pk(SIEGEL)); }
  };
  schale([bx - 196 * ca, by + 196 * sa], ruhe ? 100 : 112, false);
  schale([bx + 196 * ca, by - 196 * sa], ruhe ? 100 : 70, !ruhe);
  bahnen(K, [[330, .05, .4], [150, .04, .3]], [1]);
  K.glut(cx, cy - 50, 150, WLICHT_G, .5, [1]);
  K.licht(cx, cy - 60, WLICHT, 160, .6);
  if (!ruhe) { papier(K, 30, {}); pfosten(K, [-8, 50], 264, { h: 56, durch: 12 }); pfosten(K, [432, 490], 266, { h: 58, durch: 10 }); }
  B.partikel(K, { n: ruhe ? 14 : 34, farben: [WASSER[8], LICHTNETZ[0]], vx: 0, vy: -5, wob: 2, wf: .5, p: .5 });
  K.reihen = [{ y: 184, skala: .9, nebel: .2 }, { y: 200, skala: 1, nebel: .08 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 210] };
}
// Übergang (Ankunft im Akt): eine breite Amtstreppe führt links von oben in die Halle herab
function amtstreppe(K) {
  const m = B.maske();
  for (let i = 0; i < 10; i++) { const q = i / 10, x = 10 + q * 140, y = 60 + q * 150; m.rect(x - 30, y, 60 + q * 20, 4); }
  m.kap(-12, 50, 160, 214, 3, 3.6); m.kap(60, 46, 210, 210, 2, 2.4);
  for (let i = 0; i < 6; i++) { const q = i / 5; m.kap(-12 + q * 172, 50 + q * 164, -12 + q * 172, 26 + q * 164, 1.2, 1.2); }
  K.form(4, m, 0, messMat(1.6, { k: HOLZ.slice(0, 6), r: [MESS[7], '#f0e2a8'] }));
}
function stand(K, x, y) { asservaten(K, x, y, { gitter: true }); }
function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante, info;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' ? 0 : art === 'kraemer' ? 2 : art === 'werkstatt' ? 1 : (o.seed + v) % 3;
  K.kulisse = art === 'waechter' ? 'waechter' : v; // M3: welche Kulisse die Szene zeigt (Schlüssel für die Fahrt, data/fahrt.json)
  if (art === 'waechter' || art === 'ankunft') info = zunge(K, { ankunft: art === 'ankunft' });
  else if (art === 'uebergang') { info = halle(K, { ohneVorne: true }); amtstreppe(K); }
  else info = [halle, schalterhalle, unterDerSchale][v](K, { ohneVorne: art === 'kraemer' || art === 'rast' });
  if (art === 'rast') kanonenofen(K, info.mitte[0] + 10, info.mitte[1] + 14);
  else if (art === 'kraemer') stand(K, info.mitte[0] + 40, info.mitte[1] - 2);
  else if (art !== 'uebergang' && art !== 'waechter' && art !== 'ankunft') B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
// Ankunft nach dem Finale: die Waage steht gerade, beide Schalen leer
function ankunft(o) { return bauen(Object.assign({}, o, { art: 'ankunft' })); }
World._biome.waage = { pal, build: bauen, ankunft, reliefStil: { figuren: 5, gelenke: 2, knick: .3, grossX: 116, stein: ['#2e2a1e', '#47412f', '#655d43', '#a29572'] } };
if (World.BIOME.indexOf('waage') < 0) World.BIOME.push('waage');
})();
